---
alwaysApply: false
type: design
id: STORY-190
slug: STORY-190-directivas-de-correccion-desde-verify-y-acceptance-design
title: "Design: Directivas de corrección desde verify y acceptance"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-029-eliminar-estados-buffer
story: STORY-190
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-190-directivas-de-correccion-desde-verify-y-acceptance
  - EPIC-029-eliminar-estados-buffer
  - STORY-186-adr-de-workflows-sin-estados-buffer
  - STORY-189-el-rework-vuelve-a-implement-todo
  - STORY-191-valor-legado-durante-la-ventana-de-transicion
---

<!-- Referencias -->
[[STORY-190-directivas-de-correccion-desde-verify-y-acceptance]] · [[EPIC-029-eliminar-estados-buffer]] · [[STORY-186-adr-de-workflows-sin-estados-buffer]] · [[STORY-189-el-rework-vuelve-a-implement-todo]]

## Context

ADR-0008 dejó una deuda: `story-verify` y `story-acceptance` rechazan sin producir un artefacto que el ejecutor reconozca. ADR-0022 (lo crea STORY-186, decisiones D-04 y D-05 de su diseño) la cierra: los tres gates escriben `fix-directives.md` desde una plantilla común, y `round` continúa entre gates. Esta historia implementa ese contrato.

Estado actual verificado en el filesystem (2026-11-13):

- **Plantilla.** Solo existe `skills/story-code-review/assets/fix-directives-template.md`, con `based-on: code-review-report.md` fijo y la línea `**Veredicto de origen:** \`NEEDS-CHANGES\` (\`code-review-report.md\`)`. `docs/templates/` no tiene `fix-directives-template.md`. `docs/templates/README.md` no lista plantillas: solo describe la convención de nombres.
- **Precedente de plantilla central con semilla:** `epic-analyze` (SKILL.md:286) y `epic-creation` (SKILL.md:162) leen `docs/templates/<x>-template.md` y, si no existe, la semilla de `assets/`, con el aviso `⚠️ Usando template seed del skill…`. `test/epic-template.test.js` comprueba que la central y la semilla son iguales.
- **`story-code-review`.** 4e construye la lista blanca y 4f calcula `round` (solo desde `fix-directives.md`) e instancia `assets/fix-directives-template.md`. La nota de SKILL.md:681 y la fila de Salida (SKILL.md:924) lo declaran **escritor único** de `round`. 4h borra el archivo al aprobar.
- **`story-verify`.** 6d escribe cada defecto como `### [SEVERITY] título` con `- **Location**:` y `- **Fix**:`. 6e calcula `$DOD_ERROR` y `$N_CRITICAL_HIGH` y deriva `NEEDS-CHANGES`. El Paso 3 resuelve el DoD VERIFY, con dos criterios mínimos si no existe. El Paso 8 (7a) escribe el estado del rechazo. No escribe `fix-directives.md`.
- **`story-acceptance`.** El Paso 2 numera los criterios (Gherkin primero, DoD ACCEPTANCE después). El Paso 5 registra `{id, texto, resultado, observación, timestamp}` y un `REJECTED` siempre lleva observación. 8a escribe el estado del rechazo. No escribe `fix-directives.md`.
- **Ejecutores.** `story-implement` 0c.3 activa el modo rework solo por `fix-directives.md` y lee `round`, `max-severity`, la tabla y la lista blanca. Una lista blanca sin viñetas emite `[WARN] fix-directives.md sin lista blanca…` (el caso EV-010 de sus evals cubre la sección **ausente**). El bloque de inicio de 0c.4 muestra `Estado` y `Modo`. La instrucción GREEN/REFACTOR (SKILL.md:829 y :963) dice «limita los cambios a los archivos de whitelist». `story-implement-tasks` 2f muestra `🔁 Correcciones de fix-directives.md (ronda N)` y aplica cada fila «en el archivo y línea especificados». Ninguno lee `based-on`.
- **Rastro de rondas.** Los dos ejecutores **sobrescriben** `implement-report.md` en cada ejecución (story-implement 11b: «no se acumulan rondas»; story-implement-tasks 4a). Su único encabezado de ronda es el de la última ronda ejecutada: `## Ciclo de corrección — ronda N` (story-implement) o `## Correcciones de fix-directives.md (ronda N)` (story-implement-tasks).
- **Regla de evidencia** (`story-implement` 6b): error si la Fase RED no toca tests y alguna fila tiene `Dimensión` `requirements-coverage`; advertencia con cualquier otra dimensión, incluida una desconocida.
- **Evals.** `story-code-review` 1.1.0 (46 casos; TC-002, TC-009, TC-011 a TC-015 cubren `fix-directives.md` y `round`; TC-037 tiene `not_contains` `Reportado por:` y `fusionado`). `story-verify` 1.1.0 (7 casos), `story-acceptance` 1.1.0 (15), `story-implement` 1.3.1 (45), `story-implement-tasks` 1.0.1 (6). Ninguno de verify ni acceptance nombra `fix-directives.md`.
- **Guía.** `docs/guides/sddf-commands-pipeline.md:263` dice que `story-code-review` es el «escritor único de `round`».

**Dependencias.** ADR-0022 (STORY-186) fija el contrato. STORY-189 deja a los tres gates escribiendo `IMPLEMENT/TODO`, añade `$ENTRADA_SUBSTATUS` a los ejecutores y les hace aceptar `IMPLEMENT/TODO`. La cadena de la épica es STORY-188 → STORY-189 → STORY-190 → STORY-191: este diseño parte del estado que deja STORY-189 y no toca destinos de estado ni gates de entrada.

## Goals / Non-Goals

**Goals:**

- Crear la plantilla común `docs/templates/fix-directives-template.md` con `based-on` como placeholder, registrarla en `docs/templates/README.md` y dejar una copia semilla idéntica en los tres gates. // satisface: CNF-1
- `story-verify` y `story-acceptance` con `NEEDS-CHANGES` escriben `fix-directives.md` con sus filas, su `Dimensión` y su lista blanca. // satisface: AC-1, CNF-3, CNF-4
- Los tres gates calculan `round` con la misma regla de dos fuentes, y `story-code-review` deja de ser escritor único. // satisface: AC-2, CNF-2
- `story-implement` y `story-implement-tasks` anuncian el gate de origen desde `based-on` y avisan ante `IMPLEMENT/TODO` sin `fix-directives.md`. // satisface: AC-1, AC-3, CNF-5
- Los ejecutores tratan una lista blanca vacía sin aviso de error y nunca usan `story.md` como destino de una corrección. // satisface: AC-1 (fila acceptance), CNF-4
- Evals antes de cada `SKILL.md`, sin regresión en la revisión y sin cambiar los reportes de verify y acceptance. // satisface: CNF-6, CNF-7, CNF-8
- Gate verde. // satisface: CNF-9

**Non-Goals:**

- El destino `IMPLEMENT/TODO` de los rechazos y la entrada `IMPLEMENT/TODO` de los ejecutores (STORY-189).
- Qué hallazgos de `story-code-review` entran en `fix-directives.md` (EPIC-28): 4e y las reglas de filas de 4f no cambian.
- Que los ejecutores lean `verify-report.md` o `acceptance-report.md`.
- La regla de evidencia de `story-implement` 6b: `requirements-coverage` ya exige el test.
- Acumular rondas en `implement-report.md` (ver D-05 y Risks).
- El aviso y la clasificación del valor legado `READY-FOR-IMPLEMENT/DONE` (STORY-191) y el resto de las guías (STORY-193), salvo la frase del escritor único de `round` (C-15).

## Componentes afectados

| # | Componente | Acción | Ubicación | Satisface |
|---|---|---|---|---|
| C-1 | Plantilla común | crear | `docs/templates/fix-directives-template.md` | CNF-1, AC-1 |
| C-2 | Registro de la plantilla | modificar (sección nueva) | `docs/templates/README.md` | CNF-1 |
| C-3 | Semilla de `story-code-review` | modificar (igual a C-1) | `skills/story-code-review/assets/fix-directives-template.md` | CNF-1, CNF-7 |
| C-4 | Semilla de `story-verify` | crear (igual a C-1) | `skills/story-verify/assets/fix-directives-template.md` | CNF-1 |
| C-5 | Semilla de `story-acceptance` | crear (igual a C-1) | `skills/story-acceptance/assets/fix-directives-template.md` | CNF-1 |
| C-6 | Test de contrato de la plantilla | crear | `test/fix-directives-template.test.js` | CNF-1, CNF-9 |
| C-7 | Evals de `story-verify` | modificar (+3 casos, 1 migrado) | `skills/story-verify/evals/evals.json` | CNF-6, AC-1, AC-2 |
| C-8 | Evals de `story-acceptance` | modificar (+2 casos, 2 migrados) | `skills/story-acceptance/evals/evals.json` | CNF-6, AC-1, AC-2 |
| C-9 | Evals de `story-code-review` | modificar (+2 casos, 1 migrado) | `skills/story-code-review/evals/evals.json` | CNF-6, AC-2, CNF-7 |
| C-10 | Evals de `story-implement` | modificar (+4 casos) | `skills/story-implement/evals/evals.json` | CNF-6, AC-1, AC-3 |
| C-11 | Evals de `story-implement-tasks` | modificar (+3 casos) | `skills/story-implement-tasks/evals/evals.json` | CNF-6, AC-1, AC-3 |
| C-12 | `story-code-review`: plantilla central y regla de ronda | modificar (4f, nota de escritor, Salida, error de `round`) | `skills/story-code-review/SKILL.md` | AC-2, CNF-2, CNF-7 |
| C-13 | `story-verify`: paso de directivas | modificar (Paso 7 → nuevo 6h, que sigue la numeración 6a-6g del Paso 7, resumen, Salida, `## Entrada`/`Dependencias`) | `skills/story-verify/SKILL.md`, `skills/story-verify/README.md` | AC-1, AC-2, CNF-3, CNF-8 |
| C-14 | `story-acceptance`: paso de directivas | modificar (Paso 7 → nuevo 7f, resumen, Salida, Caso 2) | `skills/story-acceptance/SKILL.md`, `skills/story-acceptance/README.md` | AC-1, AC-2, CNF-4, CNF-8 |
| C-15 | Guía del pipeline | modificar (frase del escritor único, línea 263) | `docs/guides/sddf-commands-pipeline.md` | CNF-2 (veracidad) |
| C-16 | `story-implement`: origen, aviso, lista blanca vacía | modificar (0c.3, 0c.4, instrucción GREEN/REFACTOR, Manejo de errores, restricciones de las líneas 45-47 y 66) | `skills/story-implement/SKILL.md`, `skills/story-implement/README.md` | AC-1, AC-3, CNF-5 |
| C-17 | `story-implement-tasks`: origen, aviso, filas sin archivo destino | modificar (2c, 2f, Manejo de errores, líneas 27, 69 y 150) | `skills/story-implement-tasks/SKILL.md`, `skills/story-implement-tasks/README.md` | AC-1, AC-3, CNF-5 |

P3: se reutilizan la plantilla actual de `story-code-review` como base de C-1, el patrón central → semilla de `epic-analyze`, la forma de `test/epic-template.test.js` para C-6, el bloque de lista blanca de 4e y la forma de los casos existentes de cada `evals.json`. No se crea ningún script: los skills son Markdown y la regla de ronda se reduce a dos lecturas.

## Interfaces

| Interfaz | Contrato | Satisface |
|---|---|---|
| Resolución de la plantilla (los tres gates) | 1. `docs/templates/fix-directives-template.md`; 2. si no existe, la semilla `assets/fix-directives-template.md` del skill, con `⚠️ Usando template seed del skill. Copia assets/fix-directives-template.md a docs/templates/ para personalizarlo.` Sin ninguna de las dos: `❌ Template fix-directives-template.md no encontrado` y el gate escribe su reporte y el estado, pero no `fix-directives.md` | CNF-1 |
| Placeholders de C-1 | `{{STORY_ID}}`, `{{STORY_TITLE}}`, `{{DATE}}`, `{{MAX_SEVERITY}}`, `{{ROUND}}`, `{{BASED_ON}}`, `{{TOTAL_BLOCKING}}`, `{{INSTRUCTIONS_TABLE}}`, `{{WHITELIST}}`. `{{BASED_ON}}` ∈ {`code-review-report.md`, `verify-report.md`, `acceptance-report.md`} | CNF-1, AC-1 |
| Regla de ronda (texto idéntico en los tres gates) | `$PREV_ROUND` = máximo entero ≥ 1 entre (a) `round` del frontmatter de `$STORY_DIR/fix-directives.md` y (b) los `N` de los encabezados `## Ciclo de corrección — ronda N` y `## Correcciones de fix-directives.md (ronda N)` de `$STORY_DIR/implement-report.md`. Sin valores válidos ⇒ `0`, sin error ni aviso. `$ROUND = $PREV_ROUND + 1` | AC-2, CNF-2 |
| Filas de `story-verify` | ver «Esquema de datos», tabla V | AC-1, CNF-3 |
| Filas de `story-acceptance` | ver «Esquema de datos», tabla A | AC-1, CNF-4 |
| Mensaje de los gates al escribir | `📋 Fix directives: <ruta>/fix-directives.md (ronda <N>)` (el de `story-code-review`, reutilizado), antes del bloque de ejecutor de STORY-189 | AC-1 |
| Variable de origen en los ejecutores | `$REWORK_ORIGIN` = `/story-code-review` · `/story-verify` · `/story-acceptance` según `based-on` = `code-review-report.md` · `verify-report.md` · `acceptance-report.md`. Otro valor o ausente ⇒ `null` + `[WARN] fix-directives.md sin based-on reconocible — origen del rework desconocido` y se continúa | AC-1, CNF-5 |
| Línea de origen | `   Origen: <gate> (<based-on>)`, y si el gate no es `/story-code-review`: `   Origen: <gate> (<based-on>) — tras /story-code-review, vuelve a pasar <gate>`. En `story-implement`, tras la línea `Modo` del bloque de inicio (0c.4). En `story-implement-tasks`, tras `🔁 Correcciones de fix-directives.md (ronda N)` (2f.1). Con `$REWORK_ORIGIN = null`: `   Origen: desconocido` | AC-1 |
| Aviso de AC-3 (los dos ejecutores) | si la entrada es `IMPLEMENT/TODO` y no existe `fix-directives.md`: `[WARN] story.md está en IMPLEMENT/TODO sin fix-directives.md — se continúa sin modo rework (la única señal de rework es fix-directives.md)`. No detiene, no lee reportes y no cambia el modo | AC-3, CNF-5 |
| Lista blanca vacía | sección `## Lista blanca…` presente sin viñetas ⇒ `$WHITELIST = []` sin `[WARN]`. Sección ausente ⇒ el `[WARN]` actual (EV-010 sin cambio) | CNF-4 |
| Filas sin archivo destino | una fila cuyo archivo es `story.md` o `—` no designa un archivo a editar: `story.md` es la referencia del criterio y nunca se modifica. La corrección se ubica con `design.md` y la `Acción requerida` | AC-1 (fila acceptance) |

## Decisions

### D-01 — Plantilla común: la actual con `based-on` como placeholder // satisface: CNF-1, CNF-7

- **Elegida:** C-1 parte de la plantilla de `story-code-review` sin cambiar secciones, columnas ni orden. Tres cambios: `based-on: {{BASED_ON}}`; `**Veredicto de origen:** \`NEEDS-CHANGES\` (\`{{BASED_ON}}\`)`; y en `## Ciclo de corrección` el paso 4 queda genérico y se añade un paso 5 (ver «Esquema de datos»). Bajo `## Instrucciones de corrección` va una línea: «Una fila por bloqueante que cuenta para el veredicto del gate de origen; un mismo defecto aparece una sola vez.» Recoge la regla de EPIC-28 sin las cadenas `PREEXISTENTE`, `no verificado`, `Reportado por:` ni `fusionado`, que TC-031 a TC-033 y TC-037 de `story-code-review` tienen en `not_contains`.
- **Rechazadas:** (a) Una plantilla por gate: triplica la estructura que CNF-1 quiere única. (b) Escribir las reglas de EPIC-28 literalmente en la plantilla: romperían TC-037 en cada rechazo sin fusión. (c) Comentarios `<!-- -->` con instrucciones: ninguna plantilla de los gates los usa hoy, y habría que añadir a los tres la regla de no copiarlos.
- **Resolución central → semilla:** el patrón de `epic-analyze`. Los proyectos consumidores no tienen `docs/templates/fix-directives-template.md` hasta que lo copian, así que la semilla es el camino habitual fuera de este repositorio.

### D-02 — Copias semilla idénticas, garantizadas por un test // satisface: CNF-1, CNF-9

- **Elegida:** C-3, C-4 y C-5 son copias byte a byte de C-1. C-6 comprueba la igualdad, que `based-on: {{BASED_ON}}` está en el frontmatter, que no hay ningún `based-on` literal, que estén las cuatro secciones `##` y la tabla de seis columnas, y que no haya BOM.
- **Rechazadas:** (a) Una sola semilla en `story-code-review` leída por los otros dos skills: un skill instalado no depende de los `assets/` de otro (las semillas cruzadas de `epic-analyze` usan `$CLI_ROOT`, que los gates no resuelven). (b) Comprobar la igualdad solo con una revisión: la deriva entre copias no la vería el gate de calidad.

### D-03 — Filas de `story-verify` // satisface: AC-1, CNF-3, CNF-8

- **Elegida:** un paso nuevo **6h** tras 6g (escribir `verify-report.md`), solo con `NEEDS-CHANGES`. Lee los datos que ya calculó 6d/6e, así que `verify-report.md` no cambia (CNF-8). Entran, en este orden: los defectos `CRITICAL` y luego `HIGH` de esta ejecución, y luego los criterios DoD VERIFY con `❌`. Los `MEDIUM`, `LOW` y criterios `⚠️` no entran. `Dimensión` = `verify-defect` para todas las filas (ADR-0022). Reglas de columna en la tabla V.
- **`Archivo:Línea` de un defecto:** el `Location` si empieza por una ruta que existe en el repositorio (`ruta` o `ruta:línea`). Si no (p. ej. «pantalla de login»), `—`, y el texto de `Location` pasa a `Hallazgo`. La lista blanca son las rutas de esas filas, deduplicadas como en 4e. Los criterios DoD no aportan entradas.
- **`Archivo:Línea` de un criterio DoD:** `<ruta del DoD resuelto>:<línea del criterio>`, como `DoD-CODE-REVIEW`. Con los criterios mínimos (sin DoD), `—`. Para «Todos los tests del proyecto pasan», `Acción requerida` nombra los tests fallidos de esta ejecución.
- **Rechazadas:** (a) Incluir `MEDIUM`: CNF-3 lo excluye y no bloquean el veredicto. (b) Construir las filas leyendo `verify-report.md` ya escrito: duplica el análisis de un formato que el propio skill acaba de generar.

### D-04 — Filas y lista blanca de `story-acceptance` // satisface: AC-1, CNF-4, CNF-8

- **Elegida:** un paso nuevo **7f** tras 7e, solo con `NEEDS-CHANGES`. Una fila por criterio `REJECTED`, en el orden de la sesión, con `Dimensión` = `requirements-coverage` y `Severidad` = `HIGH`. Un criterio Gherkin apunta a `story.md:<línea del encabezado ### AC-N>`; un criterio DoD ACCEPTANCE, a `<ruta del DoD>:<línea>`. `Hallazgo` = la observación del validador. `{{WHITELIST}}` es una línea sin viñeta: «Vacía: un rechazo de aceptación no tiene archivo de origen. El ejecutor confirma (interactivo) o registra (`--auto`) cada archivo existente que modifique.» Los `BLOCKED` no entran: no son rechazos.
- **`requirements-coverage` también para un criterio DoD rechazado:** ADR-0022 fija una dimensión para el gate. Ver CR-001.
- **Rechazadas:** (a) Lista blanca con los archivos de `implement-report.md`: ADR-0022 la descarta, porque solo lista archivos en modo rework. (b) Una dimensión `DoD-ACCEPTANCE` para los criterios del DoD: no está en el ADR (CR-001).

### D-05 — Regla de ronda compartida: máximo de dos fuentes // satisface: AC-2, CNF-2

- **Elegida:** el texto de la Interfaz «Regla de ronda», copiado igual en `story-code-review` 4f.1, `story-verify` 6h.1 y `story-acceptance` 7f.1. La nota de escritor único de `story-code-review` se reemplaza por: «`round` cuenta todas las rondas de rework de la historia; lo escriben `story-code-review`, `story-verify` y `story-acceptance` con la misma regla (ADR-0022), y los ejecutores solo lo leen.»
- **Traza de AC-2:** CR rechaza (ronda 1) → el ejecutor escribe `implement-report.md` con la ronda 1 → CR aprueba y borra `fix-directives.md` → acceptance rechaza: máx(—, 1) + 1 = **2**. Un mismo gate que rechaza dos veces sin implementar entre medias da N + 1 desde `fix-directives.md`, como hoy (TC-015).
- **Rechazadas:** (a) Un script compartido: la regla son dos lecturas, y un script tendría que instalarse con tres skills. (b) Leer solo `fix-directives.md`: vuelve a 1 tras la aprobación (AC-2). (c) Acumular las rondas en `implement-report.md`: con tres gates escribiendo directivas, todo `IMPLEMENT/TODO` normal llega con `fix-directives.md` y el ejecutor deja la ronda en el informe. Basta el último encabezado (ver Risks).
- **CR-001 de STORY-189:** queda resuelto con (c). El encabezado de ronda solo se pierde si un ejecutor corre sin `fix-directives.md` después de un rework, que es justo la anomalía que AC-3 hace visible.

### D-06 — Origen del rework desde `based-on` // satisface: AC-1, CNF-5

- **Elegida:** `$REWORK_ORIGIN` se lee en el mismo momento en que se leen `round` y la tabla (0c.3 y 2f.1) y solo produce la línea `Origen:`. No cambia el modo ni las reglas de evidencia. La regla de evidencia sigue leyendo solo `Dimensión`: el comportamiento «no exige un test nuevo» de verify (AC-1, filas 1 y 2) sale de `verify-defect`, que da una advertencia, y «exige un test» de acceptance (fila 3), de `requirements-coverage`.
- **Rechazadas:** (a) Deducir el origen de qué reportes existen: los tres pueden existir a la vez, y CNF-5 prohíbe usarlos como señal. (b) Un campo nuevo `gate:` en el frontmatter: `based-on` ya identifica al gate de forma unívoca.

### D-07 — Aviso de `IMPLEMENT/TODO` sin directivas // satisface: AC-3, CNF-5

- **Elegida:** en `story-implement` 0c.3, si `$REWORK_MODE = false` y `$ENTRADA_STATUS = IMPLEMENT` y `$ENTRADA_SUBSTATUS = TODO` (variables de STORY-189). En `story-implement-tasks` 2c, con la misma condición sobre `fix_directives_existe = false`. Se emite la línea de la Interfaz y el flujo sigue el camino de STORY-189 (D-05 de su diseño). No se leen `verify-report.md` ni `acceptance-report.md`.
- **Rechazadas:** (a) Detener: AC-3 exige continuar, y una historia sin directivas puede venir de una edición manual. (b) Deducir el rework de los reportes: lo prohíbe AC-3.

### D-08 — Lista blanca vacía y filas sin archivo destino en los ejecutores // satisface: AC-1, CNF-4

- **Elegida:** `story-implement` 0c.3 separa «sección ausente» (el `[WARN]` actual) de «sección sin viñetas» (`$WHITELIST = []` sin aviso). La instrucción GREEN/REFACTOR añade: «si whitelist es [], no hay alcance declarado: reporta en files_modified todo archivo tocado; `story.md` es la referencia del criterio, nunca un destino». La Consolidación de alcance ya trata todo archivo modificado como fuera de la lista, y pide confirmación en modo interactivo o lo registra con `--auto`, que es lo que fija ADR-0022. `story-implement-tasks` 2f: una fila con archivo `story.md` o `—` no se salta como «archivo no encontrado». Se aplica la `Acción requerida` donde la ubica `design.md` y se registra en `$FIX_CORRECTED` el archivo realmente modificado.
- **Rechazadas:** (a) Mantener el `[WARN]` con la lista vacía: lo emitiría en todo rechazo de aceptación, que es el caso esperado (CNF-4). (b) Que acceptance ponga `story.md` en la lista blanca como **solo lectura**: contradice ADR-0022, que la fija vacía.

### D-09 — Evals primero, por skill // satisface: CNF-6, CNF-7

- Cada `SKILL.md` cambia después de su `evals.json`. El orden es C-1 a C-6 (plantilla y test) → C-9 y C-12 (`story-code-review`, porque su plantilla cambia de ubicación) → C-7 y C-13 → C-8 y C-14 → C-10 y C-16 → C-11 y C-17 → C-15.
- Cada `evals.json` sube su versión menor (`1.1.0 → 1.2.0`, `1.3.1 → 1.4.0`, `1.0.1 → 1.1.0`) sobre la que deje STORY-189. Si ya la subió, se vuelve a subir. Los IDs nuevos son el siguiente libre de cada archivo.

## Esquema de datos // satisface: AC-1, AC-2, CNF-1, CNF-3, CNF-4

**Plantilla C-1** (diferencias con la actual de `story-code-review`):

| Elemento | Antes | Después |
|---|---|---|
| Frontmatter `based-on` | `code-review-report.md` | `{{BASED_ON}}` |
| `**Veredicto de origen:**` | `` `NEEDS-CHANGES` (`code-review-report.md`) `` | `` `NEEDS-CHANGES` (`{{BASED_ON}}`) `` |
| Línea bajo `## Instrucciones de corrección` | — | «Una fila por bloqueante que cuenta para el veredicto del gate de origen; un mismo defecto aparece una sola vez.» |
| Ciclo, paso 4 | «Si el veredicto es `APPROVED`, este archivo se elimina y la historia queda en `CODE-REVIEW/DONE`.» | igual (todo rework vuelve a la revisión) |
| Ciclo, paso 5 | — | «Continúa el pipeline (`/story-verify`, `/story-acceptance`) hasta volver a pasar el gate que generó `{{BASED_ON}}`.» |

**Tabla V — filas de `story-verify`** (`based-on: verify-report.md`):

| Origen | `Archivo:Línea` | `Dimensión` | `Severidad` | `Hallazgo` | `Acción requerida` |
|---|---|---|---|---|---|
| Defecto `CRITICAL`/`HIGH` | `Location` si es ruta del repo; si no, `—` | `verify-defect` | la del defecto | `título` (+ `Location` si no es ruta) | `Fix` del defecto; si falta, «Corrige: Expected `<Expected>` / Actual `<Actual>`» |
| Criterio DoD VERIFY `❌` | `<ruta del DoD>:<línea>`; sin DoD, `—` | `verify-defect` | `HIGH` | texto del criterio + evidencia | «Haz que se cumpla el criterio»; para el de los tests, «Haz pasar: <tests fallidos>» |

`max-severity` = la mayor de las filas. Lista blanca: rutas de defectos, una viñeta por archivo con `hallazgo #N, #M`. Sin rutas: la misma línea sin viñeta que en acceptance, pero con el texto adaptado: «Vacía: ningún defecto de esta verificación apunta a un archivo del repositorio…».

**Tabla A — filas de `story-acceptance`** (`based-on: acceptance-report.md`): `Archivo:Línea` = `story.md:<línea ### AC-N>` (Gherkin) o `<ruta del DoD>:<línea>` (DoD) · `Dimensión` = `requirements-coverage` · `Severidad` = `HIGH` · `Hallazgo` = «Criterio `<N>` rechazado: `<observación>`» · `Acción requerida` = «Implementa el comportamiento del criterio con su test; `story.md` es la referencia, no un destino». `max-severity: HIGH`.

**Casos de eval** (la forma `input`/`expected` copia la del caso de referencia):

| Skill | Caso | Base | Expectativas clave | Cubre |
|---|---|---|---|---|
| verify | nuevo `needs-changes-defectos-critical-high-generan-fix-directives` | TC-006 (manual) | defectos 1 CRITICAL, 1 HIGH, 2 MEDIUM. `contains` `📋 Fix directives:`, `based-on: verify-report.md`, `verify-defect`, `round: 1`, `IMPLEMENT/TODO`. `not_contains` los títulos de los MEDIUM en la tabla de directivas | AC-1 fila 1, CNF-3 |
| verify | nuevo `needs-changes-dod-tests-fallidos-una-fila` | TC-004 | tests fallidos, 0 defectos. `contains` `dod-story-verify.md:`, `verify-defect`, `HIGH`, `1 hallazgo(s) bloqueante(s)` | AC-1 fila 2 |
| verify | nuevo `round-continua-tras-aprobacion-de-revision` | TC-004 | sin `fix-directives.md` e `implement-report.md` con `## Ciclo de corrección — ronda 1`. `contains` `round: 2`, `(ronda 2)` | AC-2, CNF-2 |
| verify | TC-001 y TC-005 | migrar | `not_contains` `📋 Fix directives:` (APPROVED, BLOCKED) | CNF-8 |
| acceptance | nuevo `rechazo-genera-fix-directives-ronda-continua` | TC-002 | sin `fix-directives.md`, `implement-report.md` con ronda 1 (escenario AC-2). `contains` `based-on: acceptance-report.md`, `requirements-coverage`, `story.md:`, `round: 2`, `Vacía: un rechazo de aceptación`. `not_contains` `round: 1` | AC-1 fila 3, AC-2, CNF-4 |
| acceptance | nuevo `rechazo-sin-rondas-previas-round-1` | TC-009 | 1 FAIL y 1 BLOCKED. `contains` `round: 1` y una sola fila. `not_contains` el título del criterio bloqueado en la tabla | AC-1, CNF-4 |
| acceptance | TC-006 y TC-012 | migrar | `not_contains` `📋 Fix directives:` (BLOCKED, PENDING) | CNF-8 |
| code-review | nuevo `round-continua-desde-implement-report` | TC-002 | sin `fix-directives.md`, `implement-report.md` con `## Correcciones de fix-directives.md (ronda 2)`. `contains` `round: 3` | AC-2, CNF-2 |
| code-review | nuevo `plantilla-semilla-si-falta-la-central` | TC-002 | sin `docs/templates/fix-directives-template.md`. `contains` `Usando template seed del skill`, `based-on: code-review-report.md` | CNF-1, CNF-7 |
| code-review | TC-002 | migrar | añadir `contains` `based-on: code-review-report.md` | CNF-7 |
| implement | nuevo `rework-desde-verify-anuncia-origen` | caso de rework con `fix-directives.md` | `based-on: verify-report.md`, `verify-defect`, test existente modificado en RED. `contains` `Origen: /story-verify (verify-report.md)`, `vuelve a pasar /story-verify`. `not_contains` `Rework sin evidencia` | AC-1 filas 1-2 |
| implement | nuevo `rework-desde-acceptance-exige-test` | ídem | `based-on: acceptance-report.md`, `requirements-coverage`, lista blanca vacía, RED sin tests. `contains` `Origen: /story-acceptance`, `❌ Rework sin evidencia`. `not_contains` `[WARN] fix-directives.md sin lista blanca` | AC-1 fila 3, CNF-4 |
| implement | nuevo `implement-todo-sin-fix-directives-avisa` | TC-021 | `IMPLEMENT/TODO`, sin `fix-directives.md`, `verify-report.md` con `NEEDS-CHANGES`. `contains` `[WARN] story.md está en IMPLEMENT/TODO sin fix-directives.md`, `ciclo TDD completo`. `not_contains` `Modo rework` | AC-3 |
| implement | nuevo `based-on-desconocido-avisa-y-continua` | caso de rework | `based-on: otro.md`. `contains` `sin based-on reconocible`, `Origen: desconocido`, `🔁 Modo rework` | CNF-5 |
| implement-tasks | nuevo `rework-desde-acceptance-no-edita-story-md` | TC-001 | `based-on: acceptance-report.md`, fila `story.md:12`. `contains` `Origen: /story-acceptance`. `files_unchanged` `story.md` salvo el frontmatter. `not_contains` `archivo no encontrado: story.md` | AC-1 fila 3 |
| implement-tasks | nuevo `rework-desde-verify-anuncia-origen` | TC-001 | `based-on: verify-report.md`. `contains` `Origen: /story-verify (verify-report.md)` | AC-1 |
| implement-tasks | nuevo `implement-todo-sin-fix-directives-avisa` | caso de STORY-189 | `contains` `[WARN] story.md está en IMPLEMENT/TODO sin fix-directives.md`. `not_contains` `Correcciones de fix-directives.md` | AC-3 |

## Flujos clave

**F-1 — Rechazo en verify (AC-1, filas 1 y 2):** `/story-verify` → 6e `NEEDS-CHANGES` → 6g escribe `verify-report.md` (sin cambios) → 6h.1 regla de ronda → 6h.2 filas (tabla V) y lista blanca → 6h.3 resuelve la plantilla e instancia con `based-on: verify-report.md` → `📋 Fix directives: … (ronda N)` → Paso 8: `IMPLEMENT/TODO` (STORY-189) y bloque de ejecutor → `/story-implement` → 0c.3: modo rework, `$REWORK_ORIGIN = /story-verify` → 0c.4 anuncia `Origen:` → 6b: `verify-defect` ⇒ advertencia, no exige test nuevo → `IMPLEMENT/DONE` → `/story-code-review` aprueba y borra `fix-directives.md` → `/story-verify` de nuevo.

**F-2 — Rechazo en acceptance (AC-1 fila 3, AC-2):** `/story-acceptance` → 7b `NEEDS-CHANGES` → 7d reporte (sin cambios) → 7f.1 ronda: máx(`fix-directives.md` ausente, `implement-report.md` ronda 1) + 1 = 2 → 7f.2 filas (tabla A) y lista blanca vacía → `fix-directives.md` → 8a `IMPLEMENT/TODO` → `/story-implement`: `Origen: /story-acceptance`, lista vacía sin `[WARN]` → 6b: `requirements-coverage` ⇒ exige el test del criterio en RED.

**F-3 — `IMPLEMENT/TODO` sin directivas (AC-3):** el ejecutor admite la entrada (STORY-189) → no existe `fix-directives.md` → `[WARN] …` → ciclo normal sin modo rework (story-implement) o camino de D-05 de STORY-189 (story-implement-tasks).

**F-4 — Orden de implementación:** D-09.

## Decisiones de complejidad justificada

- **Tres copias semilla más un test:** el contrato pide una sola estructura y un skill instalado autosuficiente. El test convierte la duplicación en un invariante comprobado. Es el mismo patrón que `epic-template`.
- **Regla de ronda copiada en tres `SKILL.md`:** son cinco líneas, y extraerlas a un script obligaría a instalar y resolver ese script desde tres skills Markdown. La igualdad la revisa V-5.
- **Dos ramas de lista blanca en `story-implement` (ausente / vacía):** una condición más, necesaria para que el caso normal de acceptance no avise de un error que no existe (CNF-4).
- **Filas sin archivo destino en `story-implement-tasks`:** una regla para `story.md` y `—` evita dos fallos: saltar la única fila de un rechazo de aceptación y editar la especificación.

## Contratos de verificación

| # | Criterio | Método de verificación | Origen |
|---|---|---|---|
| V-1 | C-1 existe con `based-on: {{BASED_ON}}` y C-3, C-4 y C-5 son iguales byte a byte | `node --test test/fix-directives-template.test.js` | CNF-1 |
| V-2 | `docs/templates/README.md` registra la plantilla y sus tres semillas | lectura y `npm run verify:links` | CNF-1 |
| V-3 | `story-verify` 6h y `story-acceptance` 7f escriben `fix-directives.md` solo con `NEEDS-CHANGES`, con `based-on`, filas y dimensión de las tablas V y A | lectura de los pasos y casos nuevos de C-7 y C-8 | AC-1, CNF-3, CNF-4 |
| V-4 | El formato de `verify-report.md` y de `acceptance-report.md` no cambia | `git diff` sin cambios en `assets/verify-report-template.md`, `assets/acceptance-report-template.md`, 6c-6g de verify y 7d-7e de acceptance | CNF-8 |
| V-5 | La regla de ronda es idéntica en los tres gates y ya no dice «escritor único» | `grep -c "Correcciones de fix-directives.md (ronda N)"` en los tres `SKILL.md` = 1; `grep -rn "escritor único" skills/story-code-review skills/story-implement skills/story-implement-tasks docs/guides` sin resultados sobre `round` | AC-2, CNF-2 |
| V-6 | `story-code-review` sigue escribiendo `based-on: code-review-report.md`, las mismas filas y borrando al aprobar | `git diff` de 4e, de las reglas de filas de 4f y de 4h: solo cambian la resolución de la plantilla, 4f.1 y la nota; TC-002 y TC-009 a TC-015 sin cambios de expectativas salvo TC-002 (+1 `contains`) | CNF-7 |
| V-7 | Los ejecutores anuncian el origen, avisan con `IMPLEMENT/TODO` sin directivas y no leen los reportes | lectura de 0c.3, 0c.4, 2c y 2f.1; `grep -n "verify-report.md\|acceptance-report.md"` solo en las líneas de `based-on` y en las prohibiciones | AC-1, AC-3, CNF-5 |
| V-8 | Lista blanca vacía sin `[WARN]` y sección ausente con `[WARN]` (EV-010 sin cambio) | lectura de 0c.3 y casos de C-10 | CNF-4 |
| V-9 | Evals antes de `SKILL.md`, JSON válido, IDs únicos y versión subida | orden de `tasks.md`; `npm run verify:eval-inventory` | CNF-6 |
| V-10 | Gate verde | `npm run verify:repository` y `npm test` con salida 0 | CNF-9 |
| V-11 | Archivos sin BOM ni U+FEFF | comprobación de bytes de los archivos tocados (memoria del proyecto) | CNF-9 |

## Risks / Trade-offs

- [Un ejecutor sin `fix-directives.md` después de un rework sobrescribe `implement-report.md` sin encabezado de ronda, y la ronda siguiente se numera más baja] → solo ocurre en la anomalía de AC-3 (o en una historia legada), que el aviso hace visible. Nunca es un error: `round` sigue siendo ≥ 1.
- [STORY-189 todavía no está implementada al empezar] → el diseño usa `$ENTRADA_SUBSTATUS` e `IMPLEMENT/TODO`, que añade STORY-189. Se implementa después de ella (cadena de la épica). Si cambian sus nombres, solo cambia la condición de D-07.
- [En los proyectos consumidores, cada rechazo emite el aviso de la semilla] → es el precedente de `epic-analyze`, y el aviso dice cómo silenciarlo (copiar la plantilla).
- [`Location` de verify en texto libre deja filas `—` y una lista blanca vacía] → la `Acción requerida` y el `Hallazgo` conservan el texto, y D-08 hace que los ejecutores no las salten.
- [Un criterio DoD de aceptación rechazado exige un test aunque no sea comprobable con un test] → CR-001.
- [EPIC-28 y esta historia tocan `story-code-review`] → con WIP=1 de épica no avanzan en paralelo. La plantilla parte del estado actual, que ya incluye ADR-0021.
- [Los destinos de runtime (`.claude/skills/`) siguen con la versión anterior] → tras implementar, una persona ejecuta `npx agile-sddf install`.

## Open Questions

Ninguna bloqueante. CR-001 queda para que el PO lo confirme antes de implementar.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 → D-03, D-04, D-06, tablas V y A, F-1, F-2. AC-2 → D-05. AC-3 → D-07, F-3. CNF-1 → D-01, D-02. CNF-2 → D-05. CNF-3 → D-03. CNF-4 → D-04, D-08. CNF-5 → D-06, D-07. CNF-6 → D-09. CNF-7 → D-01, V-6. CNF-8 → D-03, D-04, V-4. CNF-9 → V-10, V-11.
- **Ambigüedad:** «la dimensión de verify que nombra el ADR» se fija como `verify-defect`, como en el diseño de STORY-186. Las filas de verify sin ruta y los criterios DoD de acceptance quedan fijados en D-03 y D-04.
- **Nombres:** «ronda», «lista blanca», «gate de origen» y «directivas» se usan igual que en la historia. `$REWORK_ORIGIN` sigue la forma de `$REWORK_ROUND`.
- **Estructura:** sin dependencias cíclicas. Los gates escriben y los ejecutores leen `fix-directives.md`, y ningún ejecutor escribe en él. La plantilla (C-1) no depende de nadie. La regla de ronda depende de dos archivos de solo lectura.

## Registro de Cambios (CR)

### CR-001

- **Tipo:** ambigüedad
- **Descripción:** ADR-0022 (diseño de STORY-186, D-04) fija para `story-acceptance` la dimensión `requirements-coverage` y `Archivo:Línea` = `story.md:<línea del AC>`. No dice nada de los criterios del DoD ACCEPTANCE, que `story-acceptance` también valida y puede rechazar. Este diseño les aplica la misma dimensión (exige un test) y les asigna `<ruta del DoD>:<línea>`.
- **Documento afectado:** design.md (D-04); ADR-0022.
- **Acción requerida:** ninguna para implementar. Si el PO prefiere que un criterio DoD rechazado no exija test, hace falta un ADR que añada una dimensión (p. ej. `DoD-ACCEPTANCE`), y se cambia la tabla A.
