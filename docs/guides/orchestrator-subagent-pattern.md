---
type: guide
slug: orchestrator-subagent-pattern
title: "Patrón orquestador con un subagente por paso"
date: 2026-10-07
status: active
related:
  - harness-engineering
  - best-practices-for-skills
  - root-folder-practices
---
<!-- Referencias -->
[[harness-engineering]]
[[best-practices-for-skills]]
[[root-folder-practices]]

# Patrón orquestador con un subagente por paso

> Aprendizaje de STORY-119: cómo pasar un skill orquestador de composición inline a un subagente aislado por paso,
> cómo medir el ahorro con `/context` y cómo evitar que una copia vieja del skill anule el cambio.
> La implementación de referencia es [`skills/story-plan/SKILL.md`](../../skills/story-plan/SKILL.md).

---

## El problema: el hilo principal lo acumula todo

Un orquestador que compone sus workers **inline** (skill → skill en la misma sesión) arrastra todo a la ventana
de contexto principal: el `SKILL.md` de cada worker, los artefactos que lee cada paso, sus razonamientos y sus
salidas. En `/story-plan` (design → tasking → testcases → analyze) eso dejaba la categoría **Messages** de `/context`
en unos **125k tokens** por historia. Lo peor es que esos tokens siguen ahí después del plan: cada turno
posterior los vuelve a pagar y acerca la autocompactación.

El criterio general (inline cuando se necesita continuidad e interacción; subagente cuando se necesita aislar
trabajo voluminoso) ya está en [[best-practices-for-skills]], sección "Modelo de delegación". Esta guía muestra
cómo aplicarlo a un orquestador secuencial que ya existe.

---

## Cómo convertir un orquestador inline a subagentes

### 1. Workers ejecutables sin preguntar

Un subagente no puede conversar con el usuario. Cada worker debe cumplir las tres condiciones de **skill worker**
de [[best-practices-for-skills]] (no interactúa, no lanza subagentes, no depende de contexto conversacional).
Lo habitual es que haya que agregarle flags que resuelvan de antemano sus preguntas. En STORY-119,
`story-design`, `story-tasking`, `story-testcases` y `story-analyze` aceptan `--force` (regenerar) y
`--skip-existing` (conservar), y ya no muestran el diálogo "(r) Regenerar / (n) No modificar".

### 2. Todas las preguntas al inicio, una sola vez

Las preguntas que antes hacía cada worker pasan al orquestador, **antes de cualquier escritura**:

- Tomar una instantánea de los artefactos que existen ahora y no recalcularla después.
- Hacer una única pregunta (regenerar todos / solo los que faltan / cancelar).
- Traducir la respuesta en **un flag por paso**: cada worker recibe siempre `--force` o `--skip-existing`.
- Si el usuario cancela, no se escribe nada: ni el `status` de la historia ni `.tmp/`, y no se lanza ningún subagente.

### 3. Prompt mínimo por subagente

El prompt del subagente contiene solo la ruta del `SKILL.md` del worker, el contexto ya resuelto y las reglas.
Nunca lleva el contexto conversacional ni el contenido del `SKILL.md`, porque el subagente lo lee por su cuenta:

```
Ejecuta el skill worker `story-tasking`. Lee íntegro su contrato en: <ruta>/story-tasking/SKILL.md

Contexto de invocación (valores ya resueltos; no vuelvas a resolverlos):
- REPO_ROOT: <ruta>
- SPECS_BASE: <ruta>
- ROOT_SOURCE: sddf.config.yaml
- story_id: STORY-109
- story_dir: <ruta del directorio de la historia>
- modo: Agent (sin confirmaciones interactivas)
- argumentos: STORY-109 --force
- result_path: <REPO_ROOT>/.tmp/story-plan/STORY-109/tasking.result.md

Reglas:
- No lances subagentes ni invoques skills orquestadores; si el worker pide otro skill, síguelo inline.
- No preguntes al usuario; ante una pausa, aplica el valor por defecto documentado.
- Al terminar, también si fallas, escribe result_path (primera línea `STATUS: OK|WARN|FAIL`).
- Tu respuesta final es solo el contenido de result_path.
```

Pasar `REPO_ROOT`, `SPECS_BASE` y `ROOT_SOURCE` resueltos evita que cada subagente repita la resolución de raíces
(ver [[root-folder-practices]]) y garantiza que todos escriban en el mismo lugar.

### 4. Un archivo de resultado como único canal de vuelta

Cada paso escribe `.tmp/<skill>/<ID>/<paso>.result.md` con un formato fijo y muy corto:

| Línea | Contenido |
|---|---|
| 1 | `STATUS: OK`, `STATUS: WARN` o `STATUS: FAIL` |
| 2 | Estado del artefacto (`generado`, `regenerado`, `sin cambios (--skip-existing)`, `no generado`) |
| 3-6 | Opcional: motivo del fallo, conteos, CRs |

El orquestador **decide el fail-fast y arma el resumen final leyendo solo esos archivos**. Un archivo ausente,
vacío o con una primera línea inválida cuenta como `FAIL`. Antes de cada corrida, el directorio se borra y se
vuelve a crear para no leer resultados de una corrida anterior. Es el patrón `.tmp/<skill>/` de
[[best-practices-for-skills]] aplicado a una cadena secuencial.

### 5. Fallback inline con la misma lógica

No todos los runtimes pueden lanzar subagentes. El orquestador decide `$EXEC_MODE` una sola vez:

- `--inline` explícito, o una sesión sin herramienta de subagentes → composición inline.
- En cualquier otro caso → un subagente por paso.

La capacidad se **observa en la sesión en curso**. No se deduce de `config/runtimes.json`, que describe dónde se
instalan los agentes y no si la sesión puede lanzar uno. En modo inline, el orquestador escribe él mismo el
`<paso>.result.md` después de cada worker, así el fail-fast y el resumen tienen una sola implementación.
`--inline` también es la salida cuando falla el lanzamiento de un subagente.

### Errores típicos

- **Pasar contexto de más al subagente** (la conversación, el `SKILL.md` pegado, artefactos leídos): reproduce
  el problema dentro del subagente y además lo paga dos veces.
- **Workers que todavía preguntan**: el subagente se bloquea o inventa una respuesta. Cada pregunta del worker
  tiene que tener un flag que la resuelva.
- **Subagente → subagente** o subagente → skill orquestador: prohibido por el modelo de delegación.
- **El orquestador "verifica" leyendo los artefactos generados**: vuelve a inflar el hilo principal. La
  verificación de coherencia es trabajo de un paso (en `story-plan`, `story-analyze`) y no del orquestador.

---

## Cómo medir el antes y el después con `/context`

`/context` desglosa la ventana de contexto por categoría. La categoría que el patrón reduce es **Messages**. El
resto (system prompt, tools, archivos de memoria, skills, agentes y el buffer de autocompactación) es un
*baseline* fijo de la sesión que la refactorización no toca: en este repo son unos 36k tokens.

Protocolo:

1. `/clear` (o una sesión nueva) para partir del baseline.
2. Ejecutar el mismo comando en el mismo modo sobre una historia comparable (por ejemplo, `/story-plan <ID> --only-tasks`).
3. Al terminar, ejecutar `/context` y anotar **Messages** y el **total**.
4. Repetir con la versión anterior en **varias** historias y comparar contra el promedio, no contra una corrida suelta.
5. Comprobar que la categoría **Skills** no crezca: un `SKILL.md` refactorizado más largo encarece todas las
   sesiones, incluso las que no lo usan.

`/cost` sirve como dato complementario. Los subagentes también consumen tokens: el ahorro está en la entrada
acumulada del hilo principal y en el margen frente a la autocompactación, no en que el trabajo de cada paso deje
de costar.

### Caso de estudio: STORY-119

Medición registrada en [testing-report.md](../specs/03-stories/STORY-119-story-plan-un-subagente-por-paso/testing-report.md):

| Ejecución | Versión | Messages | Total |
| :--- | :--- | ---: | ---: |
| STORY-104 | Inline | 111.9k | 147.6k |
| STORY-106 | Inline | 130.3k | 166.0k |
| STORY-107 | Inline | 111.0k | 146.7k |
| STORY-109 | Inline (copia global con shadowing) | 148.7k | 184.3k |
| STORY-109 `--only-tasks` | Un subagente por paso | **30.1k** | **65.8k** |

- **Messages:** de ~125k (promedio inline) a 30.1k, un **−76 %**.
- **Total:** un **−58 %**, menos que Messages porque el baseline no cambia.
- **Skills:** de 3.7k a 3.6k; el `SKILL.md` nuevo no encarece el arranque.
- **Costo estimado por historia (Opus):** de ~$1.55 a ~$0.45.

> ⚠️ Es una sola corrida de la versión refactorizada y los costos son estimaciones a partir de tokens, no
> facturación medida. Tómalo como orden de magnitud y repite la medición antes de usarlo como argumento.

---

## Cómo detectar y resolver el shadowing de skills

**Shadowing** es cuando hay dos copias de un skill con el mismo nombre y el runtime carga una que no es la que
editaste. En STORY-119, la primera medición después de la refactorización no mostró ningún ahorro (la fila
STORY-109 inline de la tabla). El motivo era una copia **global vieja** que tapaba la copia nueva del proyecto.

### Por qué ocurre

El instalador puede copiar los skills en dos destinos: el del proyecto (`npx agile-sddf install`) y el global
(`npx agile-sddf install --global`). Los destinos concretos de cada runtime están en `config/runtimes.json`; en
Claude Code son `.claude/skills/` y `~/.claude/skills/`. Si los dos tienen el mismo skill, Claude Code aplica su
precedencia documentada (*"Enterprise over personal, and personal over project"*, sección "Resolve skills that
share a name" de la documentación de skills de Claude Code): **la copia personal (global) gana a la del proyecto**.
Reinstalar el skill en el proyecto no sirve de nada mientras siga existiendo una copia global vieja.

### Síntomas

- El skill se comporta "como antes". En `story-plan`, por ejemplo, el banner no muestra la línea `Ejecución:`
  o no aparecen los `.tmp/story-plan/<ID>/*.result.md`.
- La categoría Messages de `/context` no baja después de un cambio que debería reducirla.
- Los evals del skill pasan (corren sobre `skills/`), pero la sesión interactiva no refleja el cambio.

### Detección

1. **Qué copia se cargó:** al invocar un skill, Claude Code inyecta la línea `Base directory for this skill: <ruta>`.
   Si la ruta apunta a `~/.claude/skills/...` y esperabas la del proyecto, hay shadowing.
2. **Nombres duplicados entre destinos:**
   ```bash
   comm -12 <(ls ~/.claude/skills | sort) <(ls .claude/skills | sort)
   ```
3. **Copia instalada desactualizada respecto de la fuente:**
   ```bash
   diff -rq skills/story-plan .claude/skills/story-plan
   ```

### Resolución

- Borrar la copia global que sobra, o reinstalarla desde la versión actual con `npx agile-sddf install --global --force`.
- Para trabajar en este repositorio, conviene mantener **solo la instalación del proyecto** y reinstalarla
  (`npx agile-sddf install --force`) después de cada cambio en `skills/`.
- Abrir una sesión nueva después de reinstalar para que el catálogo de skills se recargue.
- Prevención: la regla de nombres únicos en todas las ubicaciones ("Metadatos del skill" en
  [[best-practices-for-skills]]) no solo se aplica entre skills distintos. Tampoco conviene tener dos versiones
  del mismo skill instaladas en destinos que se solapan.

---

## Próximos candidatos

El siguiente orquestador con el mismo perfil es `story-implement-tasks`, que hoy consume unos 155k tokens en el
hilo principal. Se le puede aplicar la misma receta: workers no interactivos, decisiones al inicio, prompt mínimo,
archivo de resultado y fallback inline.
