---
name: memory-system
description: >-
  Memoria del proyecto (docs/ como wiki LLM): ensure (por defecto) crea las capas que falten e
  indexa; scaffold solo lo faltante; rebuild --force regenera semillas; index regenera
  docs/index.md con wikilinks [[slug]]; check valida capas, frontmatter y wikilinks con exit code
  para CI. Usar para crear, completar, reindexar o verificar la memoria; sustituye a
  docs-wiki-builder. Invocar para "memory-system", "capas de memoria", "índice de documentación",
  "wiki de docs", "wikilinks" o "LLM wiki".
---

# Skill: `/memory-system`

**Cuándo usar este skill:**
Cuando haya que dejar la memoria del proyecto completa y consistente (`ensure`, modo por defecto),
crear solo las capas y archivos que falten (`scaffold`), regenerar los archivos semilla desde cero
(`rebuild --force`), regenerar `$SPECS_BASE/index.md` (`index`), el mapa de la wiki que los LLMs
leen antes que cualquier otro nodo, o **verificar** que la memoria es consistente sin tocar nada
(`check`, el gate que un pipeline de CI ejecuta en una línea y lee con `jq`). Invocar también
cuando el usuario mencione "memory-system",
"capas de memoria", "índice de documentación", "wiki de docs", "wikilinks", "LLM wiki" o el skill
deprecado `docs-wiki-builder`.

## Objetivo

Ser el único punto de entrada para la memoria del proyecto (ver
`docs/architecture/memory-system.md` en el repositorio del framework): once capas (`product`,
`requirements`, `specs`, `domains`, `architecture`, `adr`, `policies`, `guardrails`, `guides`,
`runbooks`, `templates`) más `constitution.md` en la raíz, y un `index.md` con una entrada
`[[slug]]` por artefacto. Todo lo que escribe es reproducible y nunca borra nada.

**Qué hace este skill:**
- Detecta el harness del proyecto (`sddf | speckit | openspec | generic`) y decide qué raíces se indexan.
- `scaffold`: copia-si-falta del árbol semilla de `assets/scaffold/` (constitución, `product/*`,
  un `README.md` por capa, `templates/README.md`, `adr-template.md`) y de las cinco plantillas
  compartidas desde su skill dueño. `[CREADO]` lo nuevo, `[PRESERVADO]` lo existente.
- `ensure` (por defecto): `scaffold` + `index` en un solo paso; con `--fix-frontmatter` normaliza
  antes los archivos sin frontmatter mediante `/header-aggregation` en batch.
- `rebuild --force`: `scaffold --force` (sobrescribe solo los archivos gestionados) + `index`.
- `index`: regenera `$SPECS_BASE/index.md` desde `assets/index-template.md` con el motor
  determinista `scripts/memory-system.js` (Node ≥ 18, sin dependencias): dos ejecuciones seguidas
  producen el mismo archivo salvo `updated`. Los wikilinks sin destino se marcan como nodos
  pendientes sin bloquear.
- `check [--json] [--harness h]`: verificación en **solo lectura** de cuatro familias de problemas
  (`missing-layer`, `orphan`, `invalid-frontmatter`, `broken-wikilink`). Informe textual agrupado
  por familia o, con `--json`, un único objeto para CI. Exit 0 sin problemas, 1 con al menos uno,
  2 ante error técnico. A diferencia de `index`, aquí un wikilink sin destino **sí** bloquea.

**Qué NO hace este skill:**
- No elimina archivos en ningún modo, ni siquiera `rebuild --force`.
- No sobrescribe archivos existentes salvo `rebuild --force`, y entonces únicamente los archivos
  gestionados por el scaffold (lista en `references/memory-rules.md` §5).
- No añade frontmatter por sí mismo: `ensure --fix-frontmatter` delega en `/header-aggregation`,
  que permanece como utilidad independiente (este skill solo lee su esquema `slug`/`title`).
- No escribe fuera de `$SPECS_BASE` (las raíces externas de OpenSpec/Spec-kit son de solo lectura).
- No corrige lo que `check` encuentra: `check` solo informa. La corrección es `ensure`,
  `ensure --fix-frontmatter` o una edición manual del artefacto.
- No valida el YAML completo ni el contenido semántico: `check` exige el subconjunto de campos de
  `REQUIRED_FIELDS` (`references/memory-rules.md` §6), no el esquema entero.
- No adapta el scaffold por harness (`migrate` llega con STORY-098).

## Entrada

- `$SPECS_BASE/` — raíz de artefactos resuelta en el Paso 0 (si no existe pero sí su directorio
  padre, `scaffold` la crea).
- `<REPO_ROOT>/sddf.config.yaml`, `.specify/`, `openspec/` — marcadores de harness (opcionales).
- `assets/scaffold/**` — árbol semilla (espejo del destino; `{date}` como único placeholder).
- `<CLI_ROOT>/skills/<dueño>/assets/<plantilla>` — origen de las cinco plantillas compartidas.
- `assets/index-template.md` — template del índice (solo lectura; el motor lo lee en runtime).
- `references/memory-rules.md` — reglas de slug/título/capa/exclusiones, extracción de wikilinks,
  tabla de harness, archivos gestionados por el scaffold y campos obligatorios de `check`
  (`REQUIRED_FIELDS`, §6). Léelo solo en la degradación inline (Paso 5).

## Parámetros

| Argumento | Efecto |
|---|---|
| (ninguno) | Equivale a `ensure`. |
| `ensure [--fix-frontmatter] [--harness h]` | `scaffold` + `index`; con `--fix-frontmatter`, `header-aggregation` en batch entre ambos. |
| `scaffold [--dry-run] [--harness h]` | Solo crea lo faltante; no toca `index.md`. `--dry-run` imprime el plan sin escribir. |
| `rebuild [--force]` | Sin `--force` se detiene. Con `--force`: `scaffold --force` + `index`. |
| `index [--harness h] [--dry-run]` | Regenera `$SPECS_BASE/index.md`. `--dry-run` imprime el índice por consola sin escribir. |
| `check [--json] [--harness h]` | Verifica la memoria en solo lectura y propaga el exit code del motor (0 / 1 / 2). Con `--json`, stdout lleva un único objeto y nada más. |
| `--harness <sddf\|speckit\|openspec\|generic>` | Fuerza el harness en lugar de detectarlo. |

## Precondiciones

- `$SPECS_BASE/` debe existir, o al menos su directorio padre (bootstrap de `scaffold`/`ensure`).
  `index` y `check` exigen que exista (exit 2 si no).
- `node` (≥ 18) en PATH para la ejecución reproducible; sin él, ver la degradación del Paso 5.
- `assets/scaffold/` debe existir dentro del skill (exit 2 nombrando la ruta si falta).

## Dependencias

- Archivos del skill: `scripts/memory-system.js`, `assets/scaffold/**`, `assets/index-template.md`,
  `references/memory-rules.md`.
- Herramientas: `node` ≥ 18 (solo módulos nativos; no requiere `package.json` en el proyecto consumidor).
- Skills: `header-aggregation` (solo con `ensure --fix-frontmatter`, composición skill → skill en la
  misma sesión); `skill-preflight` (opcional, diagnóstico bajo demanda). No lanza subagentes.
- Skills dueños de las plantillas compartidas (`story-creation`, `epic-creation`,
  `project-discovery`, `project-begin`, `project-planning`): opcionales; si faltan, el motor avisa y
  continúa.

## Modos de ejecución

- **Manual** (`/memory-system [modo]`): muestra la salida del motor y el informe final; no pide
  confirmación porque ningún modo sobrescribe salvo `rebuild --force`, que se confirma con el flag.
- **Automático** (invocado por `/docs-wiki-builder`, `sddf-init` u otro skill): mismo comportamiento.
- **Simulación** (`scaffold --dry-run`, `index --dry-run`): imprime el plan o el índice, no escribe.
- **Gate de CI** (`check`, `check --json`): solo lectura y exit code propagado; no pide nada y no
  escribe. Un pipeline invoca el motor directamente (ver `docs/guides/sddf-commands-pipeline.md`).

## Restricciones / Reglas

- **Copia-si-falta:** `scaffold` y `ensure` verifican cada destino antes de escribir; ejecutar
  cualquier modo dos veces produce el mismo resultado (`creados: 0` en la segunda) sin errores.
- **Solo `rebuild --force` sobrescribe**, y solo los archivos gestionados por el scaffold. Los
  artefactos de autor (ADRs, historias, guías, runbooks, policies concretas) nunca se tocan.
- **Nunca se elimina nada:** ningún modo borra archivos ni directorios.
- **Regeneración completa del índice:** `index.md` no se fusiona con el anterior; el template es la
  fuente de verdad de las secciones y el motor solo rellena placeholders.
- **`check` es solo lectura y su salida es del motor:** no crea, modifica ni borra nada (tampoco
  regenera `index.md`), reenvía el stdout del motor **tal cual** y termina con su mismo exit code.
  Con `--json` no se añade ni una línea a stdout: el pipeline lo consume con `jq`.
- **Exit 1 de `check` no es un fallo de la herramienta:** significa "memoria con problemas". El
  error técnico es exit 2 y su mensaje va a stderr.
- **Fail-fast sin escrituras:** un modo no reconocido, un `--harness` no admitido, una raíz sin
  padre, `assets/scaffold/` ausente o un template desalineado detienen el skill con el mensaje del
  motor y sin escribir.
- **Plantilla sin dueño instalado:** no bloquea; el motor emite `[WARNING] template no copiado:
  <nombre> (skill <dueño> no instalado)` y sigue (misma regla que `sddf-init` Paso 2b).
- **Rutas relativas y portabilidad:** el motor normaliza rutas con `/` y ordena con comparación
  ordinal, por lo que el resultado es idéntico en Windows, macOS y Linux.
- **Encoding:** todo lo escrito va en UTF-8 sin BOM y con saltos `\n`; las plantillas compartidas
  se copian byte a byte.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras. Excepción: en `scaffold`/`ensure` una raíz declarada que todavía no existe es válida si su directorio padre existe (el motor la crea).
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

### Paso 1 — Interpretar el modo y los flags

Lee los argumentos del usuario y decide con esta tabla antes de tocar nada:

| Argumentos | Acción |
|---|---|
| (ninguno) | Modo `ensure`: continúa al Paso 2 y sigue la secuencia del Paso 3.1. |
| `ensure [--fix-frontmatter] [--harness h]` | Paso 2 y secuencia 3.1. |
| `scaffold [--dry-run] [--harness h]` | Paso 2 y secuencia 3.2. |
| `rebuild` (sin `--force`) | Muestra exactamente `❌ rebuild es destructivo. Añade --force para confirmar.` y termina: no invoques el motor, no escribas nada, no muestres marcas ni resúmenes. |
| `rebuild --force` | Paso 2 y secuencia 3.3. |
| `index [--harness h] [--dry-run]` | Paso 2 y secuencia 3.4. |
| `check [--json] [--harness h]` | Paso 2 y secuencia 3.5. |
| `migrate` | Muestra `ℹ️ Modo migrate aún no disponible en esta versión (llega con STORY-098). Modos disponibles: ensure, scaffold, rebuild, index, check.` y termina con éxito. |
| Otro valor | Muestra `❌ Modo no reconocido: <valor>. Modos disponibles: ensure, scaffold, rebuild, index, check.` y termina sin invocar el motor ni escribir. |

El gate de `rebuild` vive aquí, y no en el motor, porque la confirmación es interacción: el motor
solo conoce `scaffold --force`.

### Paso 2 — Localizar el motor

Resuelve `CLI_ROOT` y localiza `scripts/memory-system.js` dentro de este skill
(`<CLI_ROOT>/skills/memory-system/scripts/memory-system.js`). Comprueba que `node` está en PATH
(`node --version`). Si no lo está, salta al Paso 5. Todas las invocaciones siguientes se hacen
desde `REPO_ROOT` con la forma:

```
node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js <subcomando> --root <SPECS_BASE> [flags]
```

Subcomandos del motor y sus flags:

| Subcomando | Flags | Salida |
|---|---|---|
| `detect` | `[--harness h]` | Una línea: `sddf`, `speckit`, `openspec` o `generic`. |
| `scaffold` | `--cli-root <CLI_ROOT> [--harness h] [--dry-run] [--force]` | `harness: <h>`, `capas faltantes: …`, una línea por archivo (`[CREADO]`, `[PRESERVADO]`, `[SOBRESCRITO]`; con `--dry-run`: `[CREARÍA]`, `[PRESERVARÍA]`, `[SOBRESCRIBIRÍA]`), `[WARNING] template no copiado: …` si procede y última línea `creados: N · sobrescritos: S · preservados: M · omitidos por harness: K`. |
| `index` | `[--harness h] [--dry-run]` | `harness: <h>`, `índice escrito: …` (o el índice completo con `--dry-run`) y última línea `nodos indexados: N · sin frontmatter: M · nodos pendientes: K`. |
| `check` | `[--harness h] [--json]` | Sin `--json`: cabecera `── memory-system check ── harness: <h> · root: <root>`, una línea `[<familia>]` por problema, una regla `─` y última línea `problemas: N (<familia> n · …)`. Con `--json`: un único objeto `{ harness, root, ok, summary, problems }` y nada más en stdout. |

Pasa siempre `--cli-root <CLI_ROOT>` a `scaffold`: es como el motor localiza los skills dueños de
las plantillas compartidas (`<CLI_ROOT>/skills/<dueño>/assets/<plantilla>`). `check` no lo necesita:
no copia nada. Muestra al usuario la salida del motor tal cual; no la resumas ni la inventes.

Exit codes (comunes a todos los subcomandos):

| Exit | Situación | Qué hacer |
|---|---|---|
| 0 | Éxito (en `check`: `problemas: 0`) | Continuar la secuencia y mostrar el informe. |
| 2 | `--harness` no admitido, raíz inexistente (o sin padre), `assets/scaffold/` ausente, template desalineado, Node < 18 | Mostrar el mensaje del motor (por ejemplo `valor no admitido para --harness: foo (admitidos: sddf, speckit, openspec, generic)` o `raíz inexistente: no-existe (no existe o no es un directorio)`) y detenerse: nada se ha escrito y no se muestra informe. |
| 1 | Error inesperado — **excepto en `check`**, donde 1 significa "al menos un problema" y es el resultado normal del gate | En `check`: mostrar el informe del motor y propagar el 1. En los demás modos: mostrar el mensaje y detenerse sin escribir. |

### Paso 3 — Ejecutar la secuencia del modo

#### 3.1 `ensure` (por defecto) — `detect → scaffold → [header-aggregation] → index`

1. `detect` → muestra `harness: <h>`.
2. `scaffold --root <SPECS_BASE> --cli-root <CLI_ROOT> [--harness h]` → muestra su salida completa
   (marcas `[CREADO]`/`[PRESERVADO]`, avisos `[WARNING]` y su resumen). Guarda `N` (creados) y
   `M` (preservados) para el informe final.
3. Solo si el usuario pasó `--fix-frontmatter`: invoca el skill `header-aggregation` con el
   directorio `<SPECS_BASE>` como input (activa su modo batch, Paso 4 de ese skill). Responde a
   sus dos preguntas sin abrir diálogos de merge: a la estrategia para los archivos con
   conflicto, **"Saltar todos los conflictos"** (procesa solo los archivos sin frontmatter); a
   "¿Confirmas el procesamiento de N archivos?", **"s"**. Muestra la invocación, la estrategia
   elegida y la lista de archivos que recibieron frontmatter (por ejemplo `guides/a.md`,
   `guides/b.md`); los que ya tenían frontmatter no se tocan. Sin el flag no invoques
   `header-aggregation` ni lo menciones como ejecutado.
4. `index --root <SPECS_BASE> [--harness h]` → muestra su salida y su resumen
   `nodos indexados: N · sin frontmatter: M · nodos pendientes: K`. Si el motor no expone `index`
   (exit 2 con `subcomando no admitido: index`), muestra
   `⚠️ modo index no disponible — índice no regenerado` y continúa.
5. Informe final (Paso 4) con `índice regenerado: sí` (o `no` en el caso anterior).

Idempotencia: una segunda ejecución sobre la misma raíz muestra todo `[PRESERVADO]`, `creados: 0`
y vuelve a regenerar el índice sin ningún error.

#### 3.2 `scaffold` — `detect → scaffold`

1. `detect` → `harness: <h>`.
2. `scaffold --root <SPECS_BASE> --cli-root <CLI_ROOT> [--harness h] [--dry-run]` → muestra su
   salida completa y cierra con su resumen `creados: N · sobrescritos: 0 · preservados: M ·
   omitidos por harness: K`.

No invoques `index` ni `header-aggregation`: `index.md` no se crea ni se modifica, y el informe no
incluye ninguna línea sobre el índice. Con `--dry-run` las marcas son `[CREARÍA]`/`[PRESERVARÍA]`
y nada se escribe.

#### 3.3 `rebuild --force` — `advertencia → detect → scaffold --force → index`

1. Muestra exactamente `⚠️ Los cambios manuales en archivos gestionados por el scaffold se perderán.`
2. `detect` → `harness: <h>`.
3. `scaffold --root <SPECS_BASE> --cli-root <CLI_ROOT> --force` → el motor marca `[SOBRESCRITO]`
   únicamente los archivos gestionados (constitución, `product/*.md`, `README.md` de cada capa,
   `templates/README.md`, `adr-template.md` y las cinco plantillas compartidas) y `[CREADO]` los
   que faltaban; los artefactos de autor no aparecen ni se tocan; nada se elimina. Resumen
   `creados: N · sobrescritos: S · preservados: 0 · omitidos por harness: K`.
4. `index --root <SPECS_BASE>` → regenera `index.md` y muestra su resumen.
5. Informe final (Paso 4) con `sobrescritos: S` e `índice regenerado: sí`.

#### 3.4 `index` — solo el índice

Invoca `index --root <SPECS_BASE> [--harness h] [--dry-run]`. El motor detecta el harness
(precedencia `--harness` > `sddf.config.yaml` > `.specify/` > `openspec/` > `generic`), escanea
`SPECS_BASE` y las raíces externas del perfil, deriva slug, título y capa de cada nodo según
`references/memory-rules.md`, rellena `assets/index-template.md` y escribe `<SPECS_BASE>/index.md`.
Con `--dry-run` imprime el índice por stdout y no escribe: en ese caso emite
`ℹ️ --dry-run: índice impreso por consola, no se escribió ningún archivo` antes de mostrar la
salida del motor.

Muestra al usuario la salida del motor tal cual (con `--dry-run` incluye el índice completo) y
cierra con su última línea, que es el resumen:

```
nodos indexados: N · sin frontmatter: M · nodos pendientes: K
```

Con exit 0, sugiere `/header-aggregation <ruta>` (o `ensure --fix-frontmatter`) para los nodos
`⚠️ sin frontmatter`. Si no puedes ejecutar `node` (entorno de solo lectura, sin shell, o una
simulación del skill), no inventes la salida del motor: pasa al Paso 5 y genera el índice inline.

#### 3.5 `check` — verificar sin escribir y propagar el exit code

Invoca `check --root <SPECS_BASE> [--harness h] [--json]`. El motor detecta el harness (misma
precedencia que `index`), escanea `SPECS_BASE` una sola vez con las mismas exclusiones y ejecuta
cuatro evaluadores puros sobre los nodos:

| Familia | Regla |
|---|---|
| `missing-layer` | Una de las once capas (o `constitution.md`) no existe en la raíz y el perfil del harness no la omite (`skipLayers`). |
| `orphan` | Nodo sin bloque de frontmatter (`---` inicial ausente o sin cerrar). |
| `invalid-frontmatter` | Frontmatter **declarado** sin `type`, `slug` o `title`; además sin `id` o `status` cuando `type ∈ {project, epic, story}`. Un problema por campo ausente. |
| `broken-wikilink` | Cada ocurrencia de `[[slug]]` cuyo slug no resuelve contra el conjunto de slugs derivados. |

Se evalúa el campo **declarado**, no el derivado: un archivo cuyo `slug` deduce el motor por su
nombre sigue siendo `invalid-frontmatter` porque no lo declara. Las reglas completas (campos
obligatorios y extracción de wikilinks) están en `references/memory-rules.md` §6 y §2.

Reglas de esta secuencia:

1. **No ejecutes `detect` por separado**: `check` ya imprime el harness en su cabecera (o en la
   clave `harness` del JSON). Una línea `harness: <h>` extra contaminaría el stdout de `--json`.
2. **Reenvía el stdout del motor tal cual**, sin resumir, reordenar ni traducir.
3. **Con `--json`, stdout es exclusivamente el objeto del motor**: ni cabeceras, ni informe del
   Paso 4, ni sugerencias, ni una línea en blanco de más. Es el contrato con `jq`.
4. **Propaga el exit code** del motor: 0 sin problemas, 1 con al menos uno, 2 ante error técnico.
   Sin `--json`, cierra con una última línea `exit code: <N>` para que la propagación sea visible;
   con `--json`, no la imprimas.
5. **Exit 2**: muestra el mensaje de stderr del motor (`❌ raíz inexistente: no-existe (no existe o
   no es un directorio)`) y detente. No imprimas ningún informe de problemas, ni `problemas: 0`,
   ni `problemas: N`; con `--json` el propio motor ya ha puesto `{ "ok": false, "error": "…" }` en
   stdout, así que tampoco añadas nada.
6. **No corrijas nada**: `check` informa. Con exit 1 y problemas `orphan`, sugiere
   `/memory-system ensure --fix-frontmatter` (o `/header-aggregation <ruta>`); con `missing-layer`,
   `/memory-system scaffold`; con `broken-wikilink` o `invalid-frontmatter`, edición manual del
   artefacto. Nunca lo hagas en la misma invocación.

Salida de referencia (texto):

```
── memory-system check ── harness: sddf · root: docs
[missing-layer]        product/ — capa ausente
[orphan]               guides/notas.md — sin frontmatter
[invalid-frontmatter]  adr/ADR-0003-x.md — falta title
[broken-wikilink]      guides/sdd.md — [[no-existe]] no resuelve
────────────────────────────────────────────────
problemas: 4 (missing-layer 1 · orphan 1 · invalid-frontmatter 1 · broken-wikilink 1)
```

Si no puedes ejecutar `node`, no inventes la salida del motor: pasa al Paso 5.

### Paso 4 — Informe final

Cierra cada modo con estas líneas, después de la salida íntegra del motor:

| Modo | Informe |
|---|---|
| `ensure` | `✅ memory-system ensure — harness: <h> — <SPECS_BASE>` y en la última línea `creados: N · preservados: M · índice regenerado: sí` (o `no`). |
| `scaffold` | `✅ memory-system scaffold — harness: <h> — <SPECS_BASE>` y en la última línea el resumen del motor `creados: N · sobrescritos: 0 · preservados: M · omitidos por harness: K`. Con `--dry-run`, antepón `ℹ️ --dry-run: plan impreso por consola, no se escribió ningún archivo`. |
| `rebuild --force` | `✅ memory-system rebuild — harness: <h> — <SPECS_BASE>` y en la última línea `creados: N · sobrescritos: S · índice regenerado: sí`. |
| `index` | `✅ memory-system index — harness: <h> — <SPECS_BASE>/index.md regenerado` y en la última línea `nodos indexados: N · sin frontmatter: M · nodos pendientes: K`. Con `--dry-run`, la línea `ℹ️ --dry-run: índice impreso por consola, no se escribió ningún archivo` va ANTES del índice y la salida cierra con el resumen. |
| `check` | **Sin informe propio**: la salida es la del motor. Sin `--json`, añade como única línea final `exit code: <N>`; con `--json`, no añadas nada a stdout. `check` no escribe, así que no hay línea de creados, sobrescritos ni índice. |

`N`, `M` y `S` son las cifras de la última línea del motor; no las recalcules.

### Paso 5 — Degradación sin `node` en PATH

Si `node` no está disponible, avisa:

```
⚠️ node no está en PATH: el scaffold y el índice se generan inline. La reproducibilidad byte a byte no está garantizada; instala Node ≥ 18 para obtenerla.
```

Después lee `references/memory-rules.md` y aplica sus reglas a mano, con los archivos reales:

1. Resuelve las rutas relativas al `REPO_ROOT` indicado (o al directorio de trabajo): `SPECS_BASE`
   es `<REPO_ROOT>/<root>` y los marcadores de harness se buscan en `REPO_ROOT`. Determina el
   harness con la tabla de perfiles.
2. **Scaffold inline** (`ensure`, `scaffold`, `rebuild --force`): recorre la lista de archivos
   gestionados de `memory-rules.md` §5. Por cada uno, comprueba con la herramienta de lectura si el
   destino existe: si no existe, copia la semilla desde `assets/scaffold/<ruta>` sustituyendo
   `{date}` por la fecha de hoy y registra `[CREADO] <ruta>`; si existe, registra
   `[PRESERVADO] <ruta>` (con `rebuild --force`, sobrescribe y registra `[SOBRESCRITO]`). Copia
   las cinco plantillas compartidas desde `<CLI_ROOT>/skills/<dueño>/assets/` tal cual; si el
   origen no existe, `[WARNING] template no copiado: <nombre> (skill <dueño> no instalado)`. Crea
   los directorios de capa y `specs/01-projects/`, `02-epics/`, `03-stories/` (con `.gitkeep` solo
   si el directorio no existía). No borres nada. Con `--dry-run` solo lista `[CREARÍA]`/`[PRESERVARÍA]`. Cierra
   con `creados: N · sobrescritos: S · preservados: M · omitidos por harness: 0`.
3. **Índice inline** (`ensure`, `rebuild --force`, `index`): lista los `.md` de `SPECS_BASE` (y las
   raíces externas del perfil) descartando las exclusiones. **Lee cada `.md` candidato con la
   herramienta de lectura antes de clasificarlo.** Un nodo solo se marca `⚠️ sin frontmatter` si
   su primera línea no es `---` (o el bloque no cierra); en caso contrario toma `slug` y `title`
   del bloque leído y, si faltan, deriva el slug del nombre del archivo/directorio y el título
   del primer `#`. No asumas el contenido de ningún archivo a partir de su nombre. Rellena
   `assets/index-template.md` con las entradas ordenadas por ruta y calcula los nodos pendientes
   a partir de los wikilinks leídos.
4. Si el usuario pasó `--dry-run` a `index`, emite primero
   `ℹ️ --dry-run: índice impreso por consola, no se escribió ningún archivo` y a continuación el
   índice completo; si no, escribe `<SPECS_BASE>/index.md`.
5. **`check` inline**: aplica a mano las cuatro reglas de `references/memory-rules.md` (§6 los
   campos obligatorios, §2 la extracción de wikilinks y las exclusiones, §1 el `skipLayers` del
   perfil). Comprueba con la herramienta de lectura qué capas y qué `constitution.md` existen,
   **lee cada `.md` candidato** antes de clasificarlo (no deduzcas nada del nombre), construye el
   conjunto de slugs derivados y evalúa cada `[[slug]]` contra él. Imprime el informe textual con
   el formato exacto del Paso 3.5 (cabecera, una línea `[<familia>]` por problema en el orden
   `missing-layer` → `orphan` → `invalid-frontmatter` → `broken-wikilink`, regla y última línea
   `problemas: N (…)`) y añade después, literalmente:

   ```
   ⚠️ node no disponible — sin exit code; no usar en CI
   ```

   No emitas la línea `exit code: <N>` (no hay proceso del que propagarlo) y no intentes servir
   `--json`: un objeto producido a mano no es reproducible y contaminaría el gate. Si el usuario
   pidió `--json`, dilo y ofrece el informe textual.
6. Termina con el informe del Paso 4 del modo correspondiente (`check` no tiene informe propio).

## Salida

- `$SPECS_BASE/constitution.md`, `product/{README,vision,stakeholders,objectives}.md`, un
  `README.md` por capa, `specs/01-projects/`, `02-epics/`, `03-stories/` y las seis plantillas de
  `templates/` — solo los que faltaban (`scaffold`, `ensure`) o todos los gestionados
  (`rebuild --force`).
- `$SPECS_BASE/index.md` — índice completo de la wiki con wikilinks `[[slug]]` por capa, sección
  "Estado del grafo" y, si procede, "Nodos pendientes" (`ensure`, `rebuild --force`, `index`).
- `check`: **ningún archivo**. Solo stdout — informe textual agrupado por familia con su línea
  `problemas: N (…)`, o el objeto `{ harness, root, ok, summary, problems }` con `--json` — y el
  exit code 0 / 1 / 2.
- Informe final del Paso 4 con las cifras del motor (`check` no añade informe propio).

## Deprecación de `docs-wiki-builder`

`/docs-wiki-builder [--update|--dry-run]` es desde 3.3.0 un alias que emite
`⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.` y delega en este skill
(`--update` → `index`, `--dry-run` → `index --dry-run`). Se elimina en 4.0.0.
