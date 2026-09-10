---
alwaysApply: false
type: design
id: STORY-090
slug: STORY-090-campos-declarados-nombran-su-escritor-design
title: "Design: Todo campo declarado en un template nombra a su escritor"
date: 2026-09-10
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-17-remediating-and-improvement
related:
  - STORY-090-campos-declarados-nombran-su-escritor
  - STORY-089-story-fix-post-code-review
---

<!-- Referencias -->
[[STORY-090-campos-declarados-nombran-su-escritor]]

## Context

**Historia origen:** [[STORY-090-campos-declarados-nombran-su-escritor]] (kind: `chore`, épica `EPIC-17`).

**Criterios de aceptación de referencia** (numeración usada en todo el diseño):

| AC | Escenario / requerimiento en `story.md` |
|---|---|
| AC-1 | Escenario principal — el campo FINVEST del cuerpo desaparece del template canónico, del seed y de las historias; `story-improve` y `story-split` siguen leyendo el frontmatter de `finvest-evaluation-report.md`; ningún escritor vuelve a producir el campo; la equivalencia `SPECIFY/DONE ⇔ APROBADA` queda documentada |
| AC-2 | Escenario alternativo — una historia con dato real en el cuerpo y sin `finvest-evaluation-report.md` detiene la migración *sobre esa historia*, se reporta, no se borra la línea, y el resto sigue migrando |
| AC-3 | Escenario de error — todo campo declarado en los cinco templates de `$SPECS_BASE/specs/templates/` queda retirado o anotado con su escritor; los campos con escritor existente conservan su declaración |
| AC-4 | Requerimiento — nuevo principio numerado en `docs/policies/constitution.md`: *"Todo campo declarado nombra a su escritor"* |
| AC-5 | Requerimiento — los cinco templates quedan anotados con el skill responsable de cada campo; la anotación es legible sin ejecutar nada y vive junto al campo |
| NFR-1 | Sin pérdida de datos |
| NFR-2 | Idempotencia de la migración |
| NFR-3 | Reversibilidad: cambio masivo en commit aislado |

**Estado actual medido sobre el repositorio (2026-09-10)** — la historia cita 37/78; desde su redacción se crearon historias nuevas:

- 82 historias en `docs/specs/03-stories/`; **38** contienen el bloque `**FINVEST Score:**` / `**FINVEST Decisión:**`.
- El bloque tiene siempre la misma forma: tres líneas inmediatamente después del `---` que cierra el frontmatter:
  ```
  ---                                  ← cierre del frontmatter
  **FINVEST Score:** <valor>
  **FINVEST Decisión:** <valor>
  ---                                  ← separador propio del bloque
  <!-- Referencias -->
  ```
  Las historias sin bloque pasan directamente de `---` a `<!-- Referencias -->` (p. ej. STORY-087).
- Grafías de "vacío" observadas en `Score`: `—`, `-`, `pendiente`, `[pendiente]`, `[Por evaluar]`, `[pendiente de evaluación]`, `[pendiente — ejecutar /story-evaluation]`, `[FINVEST Score]`, `[no aplica — …]`. En `Decisión`: `—`, `-`, `pendiente`, `[pendiente]`, `[pendiente de evaluación]`, `[APROBADA | REFINAR | RECHAZAR]`, `[no aplica]`.
- **Datos reales sin otra copia** (no tienen `finvest-evaluation-report.md` en su directorio):
  - `STORY-067`: `Score: 4.33 / 5.0`, `Decisión: APROBADA` — único score numérico del repositorio.
  - `STORY-078`: `Score: [Por evaluar]`, `Decisión: APROBADA` — la decisión es un dato real aunque el score no; **no está contemplada en la historia** (ver CR-001).
- Solo 5 historias tienen `finvest-evaluation-report.md` (074, 075, 076, 089, 090). Su frontmatter (`finvest-score`, `decision`, `evaluated`) es el registro canónico que `story-improve` (Paso 2) y `story-split` (Paso 3b) ya consumen.

**Quién escribe el campo hoy.** Ninguno de los tres skills (`story-creation`, `epic-generate-stories`, `epic-generate-all-stories`) menciona el literal `FINVEST Score` en su `SKILL.md`; los tres instancian el template en tiempo de ejecución (constitución, patrón §5 *"Template como fuente de verdad dinámica"*). El campo se escribe **únicamente porque el template lo declara**. `story-evaluation` (Paso 7) tiene prohibido tocar el cuerpo y solo actualiza `status/substatus` a `SPECIFY/DONE` cuando la decisión es `APROBADA` — esa es la señal de un vistazo que sustituye al campo.

**Copias del template.** `docs/specs/templates/story-template.md` (canónico) y `skills/story-creation/assets/story-template.md` (seed, origen de `sddf-init` Paso 2b) son idénticos byte a byte. `.claude/skills/` es una copia instalada (`scripts/install.js`), ignorada por git, que debe refrescarse tras el cambio.

**Los cinco templates y su skill dueño** (tabla de `sddf-init`, Paso 2b — reutilizada como fuente de verdad para la anotación):

| Template central | Seed (skill dueño) | Skills que lo instancian |
|---|---|---|
| `story-template.md` | `skills/story-creation/assets/` | `story-creation`, `epic-generate-stories`, `epic-generate-all-stories` |
| `epic-template.md` | `skills/epic-creation/assets/` | `epic-creation`, `epic-from-project-plan` |
| `project-intent-template.md` | `skills/project-begin/assets/` | `project-begin` (agente `project-pm`) |
| `project-template.md` | `skills/project-discovery/assets/` | `project-discovery` (agentes `project-pm`, `project-ux`, `project-architect`), `reverse-engineering` (agente `reverse-engineer-synthesizer`) |
| `project-plan-template.md` | `skills/project-planning/assets/` | `project-planning` (agente `project-architect`) |

**Precedentes reutilizables (P3):**
- Anotación inline en frontmatter ya existente: `kind: <…>   # tipo de historia; determina el prefijo de rama` en `story-template.md`.
- Anotación inline en cuerpo ya existente: `<!-- sección opcional-->`, `<!-- sección obligatoria-->` en los cinco templates.
- Script de normalización masiva con `--dry-run` y resumen tabular: `scripts/normalize-preflight-paso0.js`.
- La constitución tiene 12 principios numerados en *"✅ Principios Técnicos Inamovibles"* → el nuevo es el **13**.

**Restricciones del proyecto:** Markdown para skills/templates; Node.js para lo ejecutable (constitución, *Stack*); kebab-case; template como fuente de verdad dinámica (§5); decisiones de una historia en `design.md` (§16).

## Goals / Non-Goals

**Goals:**
- Retirar el bloque FINVEST del template canónico, del seed y de las 38 historias que lo contienen, sin perder el único dato irrecuperable. `// satisface: AC-1, AC-2, NFR-1`
- Que la migración sea determinista, reejecutable sin efectos y revertible como un solo commit. `// satisface: NFR-2, NFR-3`
- Anotar en los cinco templates el escritor de cada campo declarado, con una gramática única y legible sin ejecutar nada. `// satisface: AC-3, AC-5`
- Establecer el principio 13 en la constitución. `// satisface: AC-4`
- Documentar la equivalencia `SPECIFY/DONE ⇔ decisión APROBADA` junto al campo `status` del template y en `story-evaluation`. `// satisface: AC-1`

**Non-Goals:**
- Validación automatizada del principio (script/eval que falle ante un campo sin anotación) — historia hermana declarada en `story.md`.
- Mover el score al frontmatter de `story.md` o extender `header-aggregation` — descartado en la historia.
- Reescribir los `SKILL.md` de los tres escritores: no contienen el literal; el cambio de template basta (se verifica, no se edita).
- Propagar el principio 13 al seed `skills/project-policies-generation/assets/project-constitution-template.md` (constitución genérica para otros proyectos) — fuera del alcance de la historia; se registra como candidato a historia hermana.
- Limpiar los fixtures de ejemplo que aún muestran el campo (`skills/story-improve/examples/*/story.md`, `skills/story-split/examples/input/epic-story.md`): son entradas de ejemplo, no templates; no declaran campos.

## Decisions

### D1 — Forma de la anotación: comentario inline junto al campo, con la clave `escritor:`

`// satisface: AC-3, AC-5`

**Gramática del contrato de anotación** (aplica a los cinco templates y a sus seeds):

| Lugar | Forma | Ejemplo |
|---|---|---|
| Clave de frontmatter | comentario YAML al final de la línea | `status: <ESTADO_INICIAL>   # escritor: story-creation (inicial) · story-evaluation → SPECIFY/DONE · story-plan, story-implement-tasks… (transiciones)` |
| Escritor por defecto del cuerpo | un comentario HTML inmediatamente después del frontmatter | `<!-- escritor del cuerpo: story-creation | epic-generate-stories | epic-generate-all-stories — salvo anotación distinta junto a la sección -->` |
| Sección o línea del cuerpo cuyo escritor difiere del defecto | comentario HTML en la misma línea del encabezado o del campo | `## Historias <!-- sección obligatoria · escritor: epic-creation (inicial) · epic-generate-stories (actualiza lista) -->` |

Reglas:
1. Valor de `escritor:` = nombre kebab-case del skill que **instancia** el template (el punto de entrada); un agente subordinado se cita entre paréntesis (`project-discovery (project-pm)`). Varios escritores se separan con ` · `; se puede calificar cada uno entre paréntesis (`inicial`, `transiciones`, `actualiza`).
2. Un "campo declarado" es: (a) cada clave del frontmatter; (b) cada línea de dato con etiqueta en el cuerpo (`**Etiqueta:** valor`); (c) cada sección (`#`, `##`, `###`) del cuerpo — los placeholders internos de una sección heredan el escritor de su sección.
3. La anotación del cuerpo se hereda del comentario *escritor del cuerpo* salvo anotación local. Un lector responde "¿quién escribe X?" leyendo como máximo dos líneas: la del campo y la del defecto.
4. Los comentarios de anotación forman parte del template, **no** de los documentos generados: los skills ya omiten hoy los comentarios de instrucción (`<!-- sección opcional-->` no aparece en las historias generadas) y los parsers YAML ignoran los comentarios del frontmatter.
5. Un campo cuyo escritor no existe se retira del template (caso FINVEST) o se anota con el skill que **pasará** a escribirlo, en cuyo caso el `SKILL.md` de ese skill debe instruir la escritura en la misma historia. Para esta historia, el inventario (sección Context) no detectó otro campo huérfano además de FINVEST; si la anotación sección a sección revela otro, se aplica la misma regla y se registra en el `implement-report.md`.

**Alternativas rechazadas:**
- *Tabla de propiedad al final de cada template.* Legible sin ejecutar, pero la anotación no vive junto al campo: obliga a saltar entre la declaración y la tabla, y las tablas se desincronizan cuando alguien renombra una sección. Viola el requerimiento "junto al campo que describe".
- *Archivo aparte `docs/specs/templates/ownership.md`.* Centraliza, pero el template deja de ser autoexplicativo y el patrón §5 (template como fuente de verdad) se rompe: habría dos fuentes.
- *Anotación por cada placeholder individual del cuerpo (`[…]`, `<…>`).* Exhaustiva pero ruidosa (project-template tiene ~30 encabezados y decenas de placeholders con un único escritor). El defecto-por-cuerpo con excepciones locales da la misma información con una fracción del ruido (P12).

### D2 — Retiro del bloque FINVEST: tres líneas, del template canónico, del seed y de las historias

`// satisface: AC-1`

Se elimina el bloque completo de tres líneas (`**FINVEST Score:** …`, `**FINVEST Decisión:** …` y el `---` separador que lo sigue), no solo las dos líneas de dato: sin el bloque, el `---` sobrante quedaría como un `<hr>` huérfano justo después del frontmatter y alteraría el formato respecto de las historias que nunca lo tuvieron (STORY-087).

Archivos afectados: `docs/specs/templates/story-template.md`, `skills/story-creation/assets/story-template.md` y los 38 `story.md`. Tras el cambio, los dos templates deben volver a ser idénticos (`diff` vacío) — contrato de verificación V-3.

**Alternativas rechazadas:**
- *Mantener el bloque con valor fijo `—` como "reservado".* Sigue siendo un campo que nadie escribe: viola el principio 13 que la propia historia establece.
- *Retirar solo del template y dejar las historias como están.* Cumple "ningún escritor vuelve a escribirlo" pero no "se retiran de las historias existentes que las contienen" (AC-1) y deja 38 archivos fuera de formato.

### D3 — Mecanismo de migración: script Node `scripts/migrate-finvest-field.js` con `--dry-run`

`// satisface: AC-1, AC-2, NFR-1, NFR-2, NFR-3`

**Contrato del script** (componente *Migración del campo FINVEST*):

| Aspecto | Contrato |
|---|---|
| Invocación | `node scripts/migrate-finvest-field.js [--dry-run] [--stories-dir <ruta>]` (defecto `docs/specs/03-stories`) |
| Entrada | todos los `STORY-*/story.md` bajo el directorio |
| Detección del bloque | exactamente las tres líneas descritas en D2, inmediatamente después del `---` de cierre del frontmatter; cualquier otra posición no se toca y se reporta como `FORMA INESPERADA` |
| Clasificación del valor | *vacío* si coincide con el conjunto cerrado de grafías observadas (sección Context) — comparación tras `trim`, insensible a mayúsculas, y toda cadena entre `[` `]` cuenta como placeholder; **cualquier otro valor en Score o en Decisión es *dato real*** |
| Regla de decisión por historia | vacío → `MIGRADA` (se elimina el bloque) · dato real **y** existe `finvest-evaluation-report.md` en el directorio → `MIGRADA` (el dato ya está preservado) · dato real **sin** reporte → `REQUIERE DECISIÓN` (el archivo no se modifica) · sin bloque → `SIN CAMBIOS` |
| Salida | tabla por historia `ID │ resultado │ valor Score │ valor Decisión` + resumen de conteos; exit code `0` si no hubo `REQUIERE DECISIÓN` ni `FORMA INESPERADA`, `1` en caso contrario (sin abortar el recorrido) |
| Idempotencia | segunda ejecución sobre el mismo árbol → 0 `MIGRADA`, mismo conjunto de `REQUIERE DECISIÓN`, exit igual |
| Escritura | reescribe el archivo con el mismo encoding y los mismos finales de línea que leyó (UTF-8 sin BOM, preserva `\n`/`\r\n`) |
| Sin resolución automática | el script **nunca** crea reportes ni acepta pérdidas: la decisión de AC-2 es humana |

Comportamiento ante fallo (P7): un `story.md` ilegible o sin frontmatter se reporta como `ERROR LECTURA` y no detiene el recorrido; el `--dry-run` produce la misma tabla sin escribir nada, lo que permite conocer el conjunto `REQUIERE DECISIÓN` antes de tocar el árbol.

**Alternativas rechazadas:**
- *Edición manual archivo por archivo (agente o humano).* 38 archivos, sin garantía de idempotencia ni de detención en el caso real; imposible de reejecutar de forma verificable (NFR-2).
- *`sed`/one-liner de shell.* No puede aplicar la regla "dato real sin reporte → detener" ni producir el informe; además el repositorio fija Node como runtime de lo ejecutable (constitución, *Stack*).
- *Flag `--force` para migrar también los casos `REQUIERE DECISIÓN`.* Tentador para cerrar rápido, pero convierte la "decisión explícita" en un interruptor: la pérdida quedaría aceptada sin registro. La resolución se hace fuera del script (D4) y queda en el commit.

### D4 — Resolución de los casos `REQUIERE DECISIÓN`: fuera del script, por historia, registrada en el commit

`// satisface: AC-2, NFR-1`

Para cada historia reportada, la implementación ofrece al usuario dos salidas y ejecuta la elegida **antes** de la segunda pasada del script:

| Opción | Acción | Preserva el dato |
|---|---|---|
| *Reconstruir* | crear `finvest-evaluation-report.md` mínimo en el directorio, con el frontmatter de `story-evaluation` (`type: finvest-evaluation`, `story-id`, `finvest-score`, `decision`, `evaluated: <fecha created de la historia>`) y una nota de que el cuerpo del reporte no existe porque se reconstruyó desde el campo retirado | sí — en el lugar canónico |
| *Aceptar pérdida* | añadir una línea en `## 📎 Notas / contexto adicional` de la historia: *"Score FINVEST histórico X retirado en STORY-090 sin reporte asociado; pérdida aceptada."* | no, pero la aceptación queda escrita |

Con cualquiera de las dos, la segunda pasada clasifica la historia como `MIGRADA` (D3: dato real con reporte, o valor ya ausente). No se reevalúa con `/story-evaluation`: produciría un score nuevo, no el histórico.

Candidatos hoy: `STORY-067` (score 4.33) y `STORY-078` (solo decisión). Para 078 el dato es redundante con su frontmatter (`status` posterior a `SPECIFY/DONE`), por lo que *aceptar pérdida* no pierde información — se deja constancia igualmente (ver CR-001 y Open Questions).

**Alternativas rechazadas:**
- *Reevaluar con `/story-evaluation`.* Genera un reporte real, pero con un score distinto al histórico: no preserva el dato, lo sustituye.
- *Que el script reconstruya el reporte automáticamente.* Resuelve el caso sin decisión explícita; contradice el escenario alternativo, que exige detenerse.

### D5 — Documentar la equivalencia `SPECIFY/DONE ⇔ decisión APROBADA` junto al campo `status`

`// satisface: AC-1`

La equivalencia se escribe en dos lugares que ya existen, sin crear documento nuevo:
1. Anotación del campo `status`/`substatus` en `story-template.md` (y su seed): *"SPECIFY/DONE lo escribe story-evaluation solo con decisión APROBADA — es la señal de un vistazo; el score vive en `finvest-evaluation-report.md`"*.
2. `skills/story-evaluation/SKILL.md`, Paso 7: una frase que declara que esa transición es la única huella de la aprobación en `story.md`.

Alternativa rechazada: *sección nueva en `docs/guides/sddf-commands-pipeline.md`.* Válida pero lejos del campo; la anotación en el template ya es el lugar que el principio 13 exige.

### D6 — Principio 13 en la constitución

`// satisface: AC-4`

Se añade como ítem **13** de *"✅ Principios Técnicos Inamovibles"* en `docs/policies/constitution.md`, con el mismo formato que los existentes (`N. **Título:** enunciado`). Enunciado propuesto:

> 13. **Todo campo declarado nombra a su escritor:** ningún template de `$SPECS_BASE/specs/templates/` puede declarar un campo (clave de frontmatter, línea de dato o sección) sin anotar junto a él qué skill lo escribe. Un campo cuyo escritor no existe se retira del template o se anota con el skill que pasará a escribirlo en la misma historia. La anotación usa la clave `escritor:` como comentario inline (YAML en frontmatter, HTML en el cuerpo) y no se copia a los documentos generados.

Se actualiza `updated:` del frontmatter de la constitución. El número se asigna al escribir (hoy 12 principios → 13), como pide la historia.

Alternativa rechazada: *ubicarlo en "Reglas de framework" o en "Patrones de output".* Son listas de convenciones operativas; la historia pide explícitamente el formato de los principios numerados.

### D7 — Los tres escritores no se editan; se verifican

`// satisface: AC-1`

`story-creation`, `epic-generate-stories` y `epic-generate-all-stories` no contienen el literal del campo ni un fallback con él (`epic-generate-stories` §4c tiene fallback de estructura sin FINVEST). El cumplimiento de "ninguna ejecución vuelve a escribir el campo" se demuestra con el contrato V-4 (grep del literal en los tres `SKILL.md` y en los dos templates), no con ediciones.

### D8 — Plan de commits para la reversibilidad

`// satisface: NFR-3`

Tres commits independientes, en este orden, para que el masivo pueda revertirse solo:

1. `chore(templates): anotar escritor en los cinco templates y retirar campo FINVEST` — templates centrales + seeds + `story-evaluation` Paso 7 + script `scripts/migrate-finvest-field.js`.
2. `chore(stories): migrar campo FINVEST retirado (STORY-090)` — **únicamente** los `story.md` (y los reportes reconstruidos / notas de aceptación de D4). Ninguna otra edición.
3. `docs(constitution): principio 13 — todo campo declarado nombra a su escritor`.

Tras el commit 1, refrescar la copia instalada con `node scripts/cli.js install --target .claude --force` (no versionada).

## Componentes afectados

| Componente (vocabulario de la historia) | Acción | Ubicación | AC |
|---|---|---|---|
| Template canónico de historia | modificar: retirar bloque FINVEST, anotar escritores, anotar equivalencia en `status` | `docs/specs/templates/story-template.md` | AC-1, AC-3, AC-5 |
| Copia seed del template de historia | modificar: idéntico al canónico | `skills/story-creation/assets/story-template.md` | AC-1, AC-5 |
| Templates de épica / project-intent / project / project-plan (canónicos) | modificar: anotar escritores | `docs/specs/templates/{epic,project-intent,project,project-plan}-template.md` | AC-3, AC-5 |
| Seeds de esos cuatro templates | modificar: idénticos a sus canónicos | `skills/epic-creation/assets/epic-template.md`, `skills/project-begin/assets/project-intent-template.md`, `skills/project-discovery/assets/project-template.md`, `skills/project-planning/assets/project-plan-template.md` | AC-5 |
| Migración del campo FINVEST | crear | `scripts/migrate-finvest-field.js` | AC-1, AC-2, NFR-1..3 |
| Historias existentes con el campo | modificar (vía script): 38 `story.md` | `docs/specs/03-stories/STORY-*/story.md` | AC-1 |
| Reporte reconstruido o nota de aceptación | crear / modificar (según D4) | `docs/specs/03-stories/STORY-067-*/`, `STORY-078-*/` | AC-2, NFR-1 |
| Constitución | modificar: principio 13 + `updated` | `docs/policies/constitution.md` | AC-4 |
| Skill `story-evaluation` | modificar: una frase en Paso 7 | `skills/story-evaluation/SKILL.md` | AC-1 |
| Escritores del template de historia | verificar, sin cambios | `skills/{story-creation,epic-generate-stories,epic-generate-all-stories}/SKILL.md` | AC-1 |
| Lectores del registro canónico | verificar, sin cambios | `skills/story-improve/SKILL.md` (Paso 2), `skills/story-split/SKILL.md` (Paso 3b) | AC-1 |

## Interfaces / contratos

| Interfaz | Contrato | AC |
|---|---|---|
| Gramática de anotación `escritor:` | definida en D1 (frontmatter: comentario YAML de línea; cuerpo: comentario HTML; defecto de cuerpo + excepciones locales) | AC-3, AC-5 |
| CLI de migración | definida en D3 (`--dry-run`, `--stories-dir`, tabla de resultados, exit code) | AC-1, AC-2 |
| Registro canónico del score | frontmatter de `finvest-evaluation-report.md` (`finvest-score`, `decision`, `evaluated`) — sin cambios; único lugar donde vive el dato | AC-1, AC-2 |
| Señal de aprobación en `story.md` | `status: SPECIFY` + `substatus: DONE`, escrita solo por `story-evaluation` con decisión `APROBADA` — documentada en el template (D5) | AC-1 |

## Flujos clave

**Flujo 1 — Migración (AC-1, AC-2):**
`node scripts/migrate-finvest-field.js --dry-run` → tabla con `MIGRADA / SIN CAMBIOS / REQUIERE DECISIÓN` → el usuario resuelve cada `REQUIERE DECISIÓN` según D4 → ejecución real → segunda ejecución (0 `MIGRADA`, exit 0) → commit 2 aislado.

**Flujo 2 — Anotación (AC-3, AC-5):**
Para cada template: inventariar claves de frontmatter, líneas `**Etiqueta:**` y encabezados → asignar escritor con la tabla de skills dueños (Context) → escribir defecto de cuerpo + anotaciones locales → copiar al seed → `diff` canónico/seed vacío → lectura de verificación: ningún campo sin anotación (V-1).

**Flujo 3 — Lectura por consumidores (AC-1):**
`story-improve`/`story-split` → `finvest-evaluation-report.md` (frontmatter) → sin cambios; no dependen del cuerpo de `story.md`.

## Decisiones de complejidad justificada

- **Un script en vez de ediciones directas.** 38 archivos con diez grafías de vacío y dos casos reales: la única forma de demostrar idempotencia y detención (NFR-2, AC-2) es un proceso reejecutable con salida tabular. El script se descarta tras la historia en cuanto a uso, pero queda versionado como evidencia (constitución §1 y §3: demostrar, no declarar).
- **Defecto-por-cuerpo + excepciones en vez de anotar cada placeholder.** Mantiene la lectura "quién escribe X" en dos líneas como máximo y evita decenas de comentarios idénticos en `project-template.md`.
- **Lo que se mantuvo simple:** sin flag `--force`, sin reconstrucción automática de reportes, sin validador del principio (historia hermana), sin cambios en los `SKILL.md` de los escritores.

## Contratos de verificación

| # | Criterio | Método | AC |
|---|---|---|---|
| V-1 | Cada clave de frontmatter, línea `**Etiqueta:**` y encabezado de los cinco templates centrales tiene anotación `escritor:` propia o hereda del defecto de cuerpo | lectura de los cinco archivos (manual, como declara la historia) + `grep -c "escritor" docs/specs/templates/*.md` > 0 en los cinco | AC-3, AC-5 |
| V-2 | Ningún template central ni seed contiene `FINVEST Score` / `FINVEST Decisión` | grep del literal en `docs/specs/templates/` y en `skills/*/assets/*-template.md` → vacío | AC-1 |
| V-3 | Cada template central es idéntico a su seed | `diff` por pareja → vacío (5 parejas) | AC-5 |
| V-4 | Ningún escritor del template de historia vuelve a producir el campo | grep de `FINVEST Score` en los tres `SKILL.md` escritores → vacío; instanciación de prueba con `story-creation` sobre el template modificado → historia sin el bloque y sin comentarios `escritor:` | AC-1 |
| V-5 | Ninguna historia conserva el bloque salvo las registradas como `REQUIERE DECISIÓN` sin resolver | grep de `^\*\*FINVEST Score` en `docs/specs/03-stories/STORY-*/story.md` → vacío tras resolver D4 | AC-1 |
| V-6 | Historia con dato real y sin reporte: el script la reporta y no la modifica; el resto migra | ejecutar `--dry-run` y ejecución real sobre el árbol con STORY-067 sin reporte: fila `REQUIERE DECISIÓN`, archivo sin cambio (`git diff` vacío para ese archivo), exit 1, las demás `MIGRADA` | AC-2 |
| V-7 | Idempotencia | segunda ejecución real → 0 `MIGRADA`, exit 0, `git status` sin cambios nuevos | NFR-2 |
| V-8 | Reversibilidad | `git show --stat <commit 2>` toca solo `docs/specs/03-stories/**`; `git revert` del commit 2 restaura los 38 bloques sin conflicto | NFR-3 |
| V-9 | Equivalencia documentada | la anotación de `status` en `story-template.md` y el Paso 7 de `story-evaluation` mencionan `SPECIFY/DONE` ⇔ `APROBADA` | AC-1 |
| V-10 | Principio 13 presente con el formato de los existentes | lectura de `docs/policies/constitution.md`: ítem `13. **Todo campo declarado nombra a su escritor:**` en la lista numerada; `updated` actualizado | AC-4 |
| V-11 | Lectores intactos | `git diff` vacío en `skills/story-improve/SKILL.md` y `skills/story-split/SKILL.md`; ambos siguen refiriendo `finvest-evaluation-report.md` | AC-1 |

## Risks / Trade-offs

- **[Riesgo] Un skill copia los comentarios de anotación al documento generado.** Hoy no ocurre con los comentarios de instrucción existentes, pero un modelo podría copiarlos. → Mitigación: la regla 4 de D1 y el principio 13 lo prohíben explícitamente; verificación puntual generando una historia de prueba tras el cambio (V-4). Si aparece, se corrige el `SKILL.md` del skill afectado en historia de fix.
- **[Riesgo] El conjunto de grafías de "vacío" está cerrado por observación.** Una grafía no prevista se clasifica como dato real y frena esa historia. → Trade-off aceptado: el falso positivo cuesta una decisión humana; el falso negativo costaría un dato. El `--dry-run` la muestra antes de tocar nada.
- **[Riesgo] `story-evaluation` evalúa el formato F "basado en `story-template.md`".** Al retirar el bloque, historias antiguas y nuevas coinciden con el template; no hay penalización nueva. → Verificado leyendo la rúbrica: no menciona el bloque FINVEST.
- **[Riesgo] El commit 2 mezcla la migración con los reportes reconstruidos / notas de D4.** → Son parte del mismo cambio masivo (preservar antes de retirar); revertir el commit 2 restaura ambos coherentemente. Se documenta en el mensaje del commit.
- **[Trade-off] El script se publica en el paquete npm** (`files` incluye `scripts/`), igual que `normalize-preflight-paso0.js`. → Aceptado por precedente; es inofensivo fuera de este repositorio (opera sobre `--stories-dir` explícito y sin bloque no hace nada).
- **[Trade-off] Fixtures de ejemplo con el campo quedan sin tocar** (`story-improve/examples`, `story-split/examples`). → No son templates ni declaran campos; limpiarlos es cosmético y se deja fuera para no mezclar con el commit masivo.

## Open Questions

- **OQ-1 (decisión del usuario; bloquea solo la segunda pasada del script): STORY-067** — ¿reconstruir `finvest-evaluation-report.md` mínimo con `finvest-score: 4.33`, `decision: APROBADA`, `evaluated: 2026-05-09`, o aceptar la pérdida con nota en la historia? Recomendación: **reconstruir** — el coste es un archivo de 8 líneas y preserva el único score histórico del repositorio.
- **OQ-2 (decisión del usuario): STORY-078** — decisión `APROBADA` sin score ni reporte. Recomendación: **aceptar pérdida con nota**; el dato es redundante con su `status` (posterior a `SPECIFY/DONE`), así que no se pierde información. Ver CR-001.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: ambigüedad
- **Descripción**: `story.md` afirma que `STORY-067` es "la única historia con un score real en el cuerpo". Medido hoy, `STORY-078` tiene `Decisión: APROBADA` (dato real) con `Score: [Por evaluar]` y sin reporte. La regla de detención de AC-2 habla de "score real"; el diseño (D3) la aplica a **cualquier** valor real en Score *o* Decisión, para no perder datos por una lectura estrecha.
- **Documento afectado**: story.md (Notas / "Decisión abierta para la planificación") · design.md (D3, D4, OQ-2)
- **Acción requerida**: confirmar que la detención cubre también la decisión (recomendado) y resolver OQ-2; opcionalmente actualizar la nota de la historia con las cifras actuales (82 historias / 38 con el campo / 2 casos a decidir).
