---
alwaysApply: false
type: design
id: STORY-156
slug: STORY-156-migrar-skills-implementacion-specs-flow-design
title: "Design: Migrar los skills de implementación a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-156
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-156-migrar-skills-implementacion-specs-flow
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-150-migrar-skills-especificacion-specs-flow
  - STORY-151-migrar-los-skills-de-epica-a-specs-flow
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-156-migrar-skills-implementacion-specs-flow]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-150-migrar-skills-especificacion-specs-flow]] · [[STORY-151-migrar-los-skills-de-epica-a-specs-flow]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia migra los dos skills de implementación (`story-implement`, `story-implement-tasks`) al layout fijo de ADR-0016 (STORY-147): dejan de resolver una raíz configurable y leen/escriben en rutas fijas relativas a `REPO_ROOT` (`specs/flow/STORY-NNN-<slug>/`, `specs/flow/EPIC-NN-<slug>/`, `docs/templates/`, `docs/guardrails/`). Adoptan el contrato verificable de STORY-148 (marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, reglas R1–R4 de `scripts/verify-fixed-layout.js`) con el mismo texto canónico que STORY-150 (D-1) y STORY-151.

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `skills/story-implement/SKILL.md` (1260 líneas) | Bloque `SDDF-ROOT-RESOLUTION: v1` en el Paso 0 (l. 223–232). Resumen de la l. 32 «Resuelve `REPO_ROOT`, `SPECS_BASE` y `CLI_ROOT`». Sección DoD (l. 89–96) con `$SPECS_BASE/guardrails/…`. **0c.1** (l. 254): Glob `$SPECS_BASE/specs/stories/{story_id}*/` — **sin guion**, `STORY-15` casaría `STORY-150-…` — y mensaje `❌ … bajo $SPECS_BASE/specs/stories/` (l. 258, repetido en la tabla de errores l. 1171). **11d** (l. 1083–1088): épica en `$SPECS_BASE/specs/epics/<parent>/epic.md` y template `$SPECS_BASE/templates/epic-template.md` con seed `$CLI_ROOT/skills/epic-creation/assets/epic-template.md`. Salida (l. 1255) cita `$SPECS_BASE/specs/epics/<parent>/epic.md`. El resto de rutas de historia ya usa `$STORY_DIR` (l. 264–1254). `CLI_ROOT` se usa en 10 líneas para localizar los generadores (`$CLI_ROOT/skills/{skill}/SKILL.md`). Lee `sddf.config.yaml` en los Pasos 1–2 para `implement.test_generators` / `code_generators` / `defaults` (no para la raíz). |
| `skills/story-implement/README.md` | l. 81 y 83: salidas en `$SPECS_BASE/specs/stories/<STORY-NNN>/` y `$SPECS_BASE/specs/epics/<parent>/`. Las menciones de `sddf.config.yaml` (l. 3, 17–18, 43–47, 113–148) son de generadores y no contienen la palabra `root`. |
| `skills/story-implement/evals/evals.json` | 8 rutas `docs/specs/stories/STORY-TEST/…` (l. 1166, 1367, 1401, 2937, 3086, 3243, 3507, 3638) y 4 `$SPECS_BASE/specs/epics/EPIC-21-colapsar-specs/epic.md` (l. 3661, 3678, 3703, 3720). Las rutas `docs/guardrails/dod-story-implement.md` ya son fijas. Sin `SDDF_ROOT` ni `sddf_config_root`. |
| `skills/story-implement-tasks/SKILL.md` (828 líneas) | Tabla de entrada (l. 66–70) con 4 rutas `$SPECS_BASE/specs/stories/<STORY-NNN>/…` y el DoD `$SPECS_BASE/guardrails/…`. Tabla de dependencias l. 102: fila «Resolución local de raíz — `SDDF_ROOT → sddf.config.yaml.root → docs`» (incumple R3 y R4). Sección DoD (l. 112–119). Bloque v1 (l. 160–169). **1b** (l. 186–191): `{story_path}` explícito o Glob `$SPECS_BASE/specs/stories/{story_id}-*/` y mensaje `❌ … bajo $SPECS_BASE/specs/stories/` (repetido en l. 751). **4c** (l. 699–702): épica en `$SPECS_BASE/specs/epics/<parent>-*/epic.md` — con `parent` = slug completo (`EPIC-26-layout-…`) el patrón `-*` **no casa** — y el mismo template/seed que 11d. Salida l. 772 y 775. `CLI_ROOT` solo para el seed de épica (l. 702). |
| `skills/story-implement-tasks/README.md` | l. 57: ejemplo `--path docs/specs/stories/STORY-059-mi-historia/`. |
| `skills/story-implement-tasks/evals/`, `examples/` | Sin rutas legadas (grep vacío en `evals.json`, `examples/input/*.md`, `examples/output/implement-report.md`). |
| `test/dod-story.test.js` E2E-002 | Exige en la sección DoD de ambos skills el literal `$SPECS_BASE/guardrails/dod-story-implement.md`. STORY-150 D-7 cambia la aserción a `docs/guardrails/<slug>.md`; si STORY-150 no está entregada, migrar estos skills rompe `npm test`. Ver CR-001. |
| `scripts/verify-fixed-layout.js` (STORY-148) | **Aún no existe**. Su diseño fija R1–R4 y `PENDING_MIGRATION` (36 skills, incluidos estos dos), de la que cada historia retira los suyos. |
| Copias de runtime | `.claude/` está en `.gitignore`: las copias instaladas siguen con el contrato v1 hasta reinstalar. |
| `specs/` | No existe en el repo. Los work items siguen en `docs/specs/` hasta STORY-153. |

Stakeholders: el practitioner que implementa una historia en un repo recién inicializado (AC-1), el mantenedor que verifica el gate (AC-2) y STORY-157, que verifica la lista transitoria vacía.

## Goals / Non-Goals

**Goals:**
- Sustituir el Paso 0 de los dos `SKILL.md` por el bloque canónico del contrato de layout fijo // satisface: AC-2, CNF-2
- Reescribir toda ruta `$SPECS_BASE/…` y `docs/specs/…` de los dos skills (`SKILL.md`, `README.md`, `evals/evals.json`) a rutas fijas relativas a `REPO_ROOT` // satisface: AC-1, AC-2, CNF-1
- Resolver la historia solo en `specs/flow/STORY-NNN-*/` (con guion) y rechazar una ruta explícita fuera de `specs/flow/` para que ningún artefacto de historia se escriba fuera de su carpeta // satisface: AC-1, AC-2
- Localizar la épica padre en `specs/flow/` con una regla única para ambos skills // satisface: AC-2
- Retirar los dos skills de `PENDING_MIGRATION` para que el gate los valide con R1–R4 // satisface: AC-2, CNF-2
- Mantener `npm test` verde (E2E-002) // satisface: AC-2 (CR-001)

**Non-Goals:**
- Skills de especificación (STORY-150), planning (STORY-155), revisión/verificación/aceptación (STORY-158), épica (STORY-151) y transversales (STORY-152)
- Cambiar la lectura de `sddf.config.yaml` para generadores (`implement.*`, `defaults`) ni el override `guardrails.dod.story.implement`: es configuración del pipeline, no del layout (CR-002)
- Buscar historias o épicas en `specs/flow/archive/`
- Mover work items a `specs/flow/` (STORY-153), crear `scripts/verify-fixed-layout.js` (STORY-148), reinstalar copias de runtime
- Ejecutar `npm run test:eval` (a criterio humano, CNF-1)
- Cambiar la lógica TDD, el modo rework, la lista blanca ni los bundles de subagentes

## Decisions

### D-1 — Paso 0 con el bloque canónico del contrato // satisface: AC-2, CNF-2

En ambos `SKILL.md`, el bloque desde `<!-- SDDF-ROOT-RESOLUTION: v1 -->` hasta el siguiente encabezado se sustituye por el texto canónico de STORY-148 (D-1), idéntico al de STORY-150, conservando `### Paso 0 — Resolver contexto local`:

```markdown
<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

| Skill | Se elimina | Se conserva / añade |
|---|---|---|
| `story-implement` | pasos 1–3 de precedencia; el paso 4 se reescribe | línea de `/skill-preflight`; línea `CLI_ROOT`: «Resuelve `CLI_ROOT` (directorio de skills del runtime) solo para localizar los generadores declarados y el seed del template de épica.» (sin mencionar `SPECS_BASE`) |
| `story-implement-tasks` | pasos 1–3; el paso 4 se reescribe | línea de `/skill-preflight`; línea `CLI_ROOT` equivalente, limitada al seed del template de épica |

Ajustes fuera del Paso 0:
- `story-implement` l. 32: «Resuelve `REPO_ROOT` y `CLI_ROOT` localmente como Paso 0 (layout fijo, ADR-0016)».
- `story-implement-tasks` l. 102: la fila pasa a «Contrato de layout fijo | Resuelve `REPO_ROOT` y usa `specs/flow/`, `docs/templates/` y `docs/guardrails/` (ADR-0016) antes de cualquier operación.» (cumple R3 y R4).

**Alternativas rechazadas:**
- **Eliminar `CLI_ROOT`:** `story-implement` necesita localizar los generadores (`$CLI_ROOT/skills/{skill}/SKILL.md`, 10 líneas); el contrato de STORY-148 solo prohíbe `SPECS_BASE`/`SDDF_ROOT`. STORY-151 conserva la misma línea para sus seeds.
- **Bloque propio con redacción distinta:** R2 lo admitiría, pero rompe la uniformidad con STORY-150/151 (P5).

### D-2 — Mapa de sustitución de rutas // satisface: AC-1, AC-2, CNF-1

| Forma legada | Forma fija | Dónde |
|---|---|---|
| `$SPECS_BASE/specs/stories/<STORY-NNN>/…` | `specs/flow/<STORY-NNN>-<slug>/…` | implement-tasks entrada (l. 66–69) y salida (l. 772); implement README l. 81 |
| `$SPECS_BASE/specs/stories/{story_id}*/` / `…{story_id}-*/` | `specs/flow/{story_id}-*/` (D-3) | implement 0c.1; implement-tasks 1b |
| `❌ … bajo $SPECS_BASE/specs/stories/` | `❌ No se encontró la historia {story_id} en specs/flow/` | implement l. 258, 1171; implement-tasks l. 191, 751 |
| `$SPECS_BASE/specs/epics/<parent>[-*]/epic.md` | `specs/flow/<parent>/epic.md` (D-4) | implement 11d, salida l. 1255, README l. 83; implement-tasks 4c, salida l. 775 |
| `$SPECS_BASE/templates/epic-template.md` | `docs/templates/epic-template.md` (seed `$CLI_ROOT/skills/epic-creation/assets/epic-template.md` sin cambio) | implement 11d; implement-tasks 4c |
| `$SPECS_BASE/guardrails/…` | `docs/guardrails/…` | secciones DoD y tabla de entrada de implement-tasks |
| `docs/specs/stories/STORY-TEST/…` | `specs/flow/STORY-TEST/…` | 8 líneas de `story-implement/evals/evals.json` |
| `$SPECS_BASE/specs/epics/EPIC-21-colapsar-specs/epic.md` | `specs/flow/EPIC-21-colapsar-specs/epic.md` | 4 líneas de `story-implement/evals/evals.json` |
| `--path docs/specs/stories/STORY-059-mi-historia/` | `--path specs/flow/STORY-059-mi-historia/` | implement-tasks README l. 57 |

Sección DoD de ambos skills (mismo criterio que STORY-150 D-2): `Archivo` → `docs/guardrails/dod-story-implement.md` (se elimina el paréntesis «en este repositorio, …»); resolución 1 → `docs/guardrails/<slug>.md`; resolución 2 → `docs/guardrails/dod-story-implement.md`. La fila `Override` (`sddf.config.yaml › guardrails.dod.story.implement`) se conserva: no contiene `root` (R4).

En los evals solo cambian rutas: los valores esperados, los `contains` y los `archivo_linea` de `docs/guardrails/…` no cambian. `STORY-TEST` se conserva como nombre de fixture (no es un ID de tres dígitos; no afecta a AC-1).

**Alternativas rechazadas:**
- **Variable nueva (`FLOW_DIR`):** reintroduce la indirección que ADR-0016 retira; R2 exige los literales.
- **Dejar evals con `docs/specs/`:** CNF-1 exige `specs/flow/`; un fixture legado induce al LLM a escribir en la ruta antigua (AC-1 «no se escribe nada en `docs/specs/`»).

### D-3 — Resolución del directorio de la historia // satisface: AC-1, AC-2

Contrato común a `story-implement` (0c.1) y `story-implement-tasks` (1b):

| Entrada | Regla | Fallo |
|---|---|---|
| `story_id` | Glob `specs/flow/{story_id}-*/story.md`, primera coincidencia → su directorio | `❌ No se encontró la historia {story_id} en specs/flow/` + sugerencia existente (`/epic-generate-stories`); detener sin escribir |
| `{story_path}` explícito (solo implement-tasks) | se acepta solo si, normalizado y relativo a `REPO_ROOT`, tiene la forma `specs/flow/STORY-NNN-<slug>/` (no `specs/flow/archive/…`) y contiene `story.md` | `❌ La ruta {story_path} no es una historia de specs/flow/ (se esperaba specs/flow/STORY-NNN-<slug>/)`; detener sin escribir |

- El guion obligatorio corrige el Glob de `story-implement` (`{story_id}*/` casaba `STORY-15` con `STORY-150-…`) y unifica ambos skills.
- Nunca se consulta `docs/specs/` ni `specs/flow/archive/`.
- `implement-report.md` y la actualización de `story.md`/`tasks.md` se escriben solo en el directorio resuelto (`$STORY_DIR` en implement; «directorio de la historia» en implement-tasks), sin otra ruta posible. Los ficheros de `.tmp/story-implement/{story_id}/` no son artefactos de historia (canal entre subagentes, no versionado) y no cambian.

**Alternativas rechazadas:**
- **Aceptar cualquier `{story_path}`:** un `--path docs/specs/stories/…` escribiría `implement-report.md` fuera de `specs/flow/`, contra AC-2 («ningún artefacto … queda fuera de `specs/flow/STORY-NNN-<slug>/`»).
- **Eliminar el parámetro `{story_path}`:** cambio incompatible innecesario; validarlo cuesta una regla.
- **Fallback a `docs/specs/stories/` con aviso:** contradice AC-1; el diagnóstico del layout legado es de `skill-preflight` (STORY-152) y `/sddf-init` (STORY-149).

### D-4 — Localización de la épica padre // satisface: AC-2

Regla única para 11d (implement) y 4c (implement-tasks), coherente con STORY-151 D-3 (épicas solo por `specs/flow/EPIC-*/epic.md`):

1. Leer `parent` del frontmatter de `story.md`; vacío → comportamiento actual de «sin épica».
2. Probar `specs/flow/<parent>/epic.md` (parent = slug completo, forma de la plantilla de historia).
3. Si no existe y `parent` es solo `EPIC-NN`, probar Glob `specs/flow/<parent>-*/epic.md` (primera coincidencia).
4. Sin coincidencia → mensajes actuales de cada skill (`[INFO] epic.md no encontrado …` en implement; `⚠️ No se pudo actualizar el checklist de la épica: <razón>` + sección de advertencia en implement-tasks). No se consulta `specs/flow/archive/` ni `docs/specs/epics/`.

Corrige el defecto actual de implement-tasks (`<parent>-*` nunca casa con un slug completo) sin cambiar la semántica de la actualización del checklist (sección `clave: historias`, token `**{story_id}**`, `- [ ]` → `- [x]`).

**Alternativas rechazadas:**
- **Mantener cada skill con su patrón:** conserva el defecto de implement-tasks y dos reglas para la misma operación (P5).
- **Buscar en todo `specs/flow/` por el ID de la épica dentro de `epic.md`:** más costoso y ambiguo; el `parent` ya nombra el directorio.

### D-5 — Retiro de la lista transitoria del gate // satisface: AC-2, CNF-2

En `scripts/verify-fixed-layout.js` se retiran de `PENDING_MIGRATION` las entradas `story-implement` y `story-implement-tasks` en el mismo cambio que migra los skills (STORY-148 D-4). La lista conserva el orden alfabético. Efecto: `verify:repository` aplica R1–R4 a ambos y falla con skill y línea ante cualquier `SPECS_BASE`, `SDDF_ROOT`, `SDDF-ROOT-RESOLUTION: v1` o línea con `root` + `sddf.config.yaml`.

**Alternativas rechazadas:**
- **Retirarlos en una historia posterior:** el gate no validaría la migración (AC-2) y fallaría por la regla de higiene «ya cumple el contrato — retíralo de la lista».

### D-6 — E2E-002 // satisface: AC-2 (CR-001)

La historia no cambia `test/dod-story.test.js` si STORY-150 ya aplicó su D-7 (aserción `docs/guardrails/${slug}.md` y patrón `guardrails\/(dod-story-[a-z-]+)\.md`). Si no, aplica ese mismo cambio, idéntico y de una sola vez, en su primera tarea; STORY-150 lo encontrará ya hecho. Ambos skills contienen hoy `docs/guardrails/dod-story-implement.md` en su sección DoD, por lo que la prueba sigue verde antes y después de migrar.

**Alternativas rechazadas:**
- **Conservar `$SPECS_BASE/guardrails/…` en la sección DoD para no tocar la prueba:** incumple R3 y AC-2.
- **Excluir los dos skills de E2E-002:** pierde la verificación «solo el DoD de su etapa».

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Orquestador TDD | modificar (Paso 0, l. 32, DoD, 0c.1, 11d, errores, salida) | `skills/story-implement/SKILL.md` | AC-1, AC-2, CNF-2 |
| README del orquestador | modificar (2 rutas de salida) | `skills/story-implement/README.md` | AC-1 |
| Evals del orquestador | modificar (12 rutas) | `skills/story-implement/evals/evals.json` | CNF-1 |
| Implementador por tareas | modificar (entrada, dependencias, DoD, Paso 0, 1b, 4c, errores, salida) | `skills/story-implement-tasks/SKILL.md` | AC-1, AC-2, CNF-2 |
| README del implementador | modificar (ejemplo `--path`) | `skills/story-implement-tasks/README.md` | AC-1 |
| Lista transitoria del gate | modificar (retirar 2 entradas) | `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) | AC-2, CNF-2 |
| Prueba E2E-002 | modificar solo si STORY-150 no la cambió (D-6) | `test/dod-story.test.js` | AC-2 |

No se modifican `story-implement-tasks/evals/evals.json` ni `examples/` (sin rutas legadas). No se crea ningún archivo.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Paso 0 de ambos skills | bloque de D-1 entre el marcador y el siguiente encabezado | AC-2, CNF-2 |
| Directorio de la historia | `specs/flow/STORY-NNN-<slug>/` relativo a `REPO_ROOT` | AC-1 |
| Resolución por ID | `specs/flow/{story_id}-*/story.md`; fallo → `❌ No se encontró la historia {story_id} en specs/flow/` | AC-1, AC-2 |
| Ruta explícita (implement-tasks) | solo `specs/flow/STORY-NNN-<slug>/` con `story.md`; otra → error de D-3 | AC-2 |
| Informe | `specs/flow/STORY-NNN-<slug>/implement-report.md` | AC-1 |
| Épica padre | `specs/flow/<parent>/epic.md`, luego `specs/flow/<parent>-*/epic.md` | AC-2 |
| DoD | `docs/guardrails/dod-story-implement.md` (override `sddf.config.yaml › guardrails.dod.story.implement`) | AC-2 |
| Gate | `npm run verify:repository` aplica R1–R4 a ambos skills | AC-2 |

## Esquema de datos

N/A — no cambia ningún frontmatter ni el formato de `implement-report.md`, `red-phase-status.json`, `cycle-status.json` ni de los bundles de subagentes; solo la ubicación de los artefactos de historia. El esquema de los casos de `evals.json` se conserva.

## Flujos clave

### F-1 — `/story-implement STORY-001` en un repo recién inicializado // AC-1
1. Paso 0: resuelve `REPO_ROOT` (y `CLI_ROOT` para los generadores).
2. 0c.1: Glob `specs/flow/STORY-001-*/story.md` → `$STORY_DIR = specs/flow/STORY-001-<slug>/`.
3. Pasos 1–10 sin cambios (generadores de `sddf.config.yaml`, que `/sddf-init` crea sin clave de raíz).
4. 11: escribe `$STORY_DIR/implement-report.md` y actualiza `story.md`; 11d actualiza `specs/flow/<parent>/epic.md` si existe.
5. Ningún paso referencia ni crea `docs/specs/`.

### F-2 — `/story-implement-tasks STORY-001` // AC-1
1. Paso 0 → `REPO_ROOT`. 1b: Glob `specs/flow/STORY-001-*/` → directorio.
2. Ciclo por tarea sin cambios; 4c localiza la épica con D-4.
3. Escribe `implement-report.md`, `story.md` y `tasks.md` en `specs/flow/STORY-001-<slug>/`.

### F-3 — Ruta explícita legada // AC-2
`/story-implement-tasks STORY-059 --path docs/specs/stories/STORY-059-x/` → error de D-3 y detención: no se escribe ningún informe fuera de `specs/flow/`.

### F-4 — Gate tras la migración // AC-2
1. `grep -rnE "SPECS_BASE|SDDF_ROOT|docs/specs|specs/stories" skills/story-implement skills/story-implement-tasks` → sin coincidencias.
2. `npm run verify:repository`: el paso de contrato de layout fijo valida R1–R4 en ambos skills (fuera de `PENDING_MIGRATION`) → `[OK]`; `npm test` (E2E-002) → verde.

### F-5 — Degradación // P7
- Historia inexistente: error de D-3 antes de 0c.2/0c.4 → no se escribe `story.md`, `.tmp/` ni código (comportamiento actual del gate).
- `docs/templates/epic-template.md` ausente: seed `$CLI_ROOT/skills/epic-creation/assets/epic-template.md` (comportamiento actual).
- Épica no encontrada: aviso no bloqueante (comportamiento actual).
- `docs/guardrails/dod-story-implement.md` ausente: aviso y continuación sin DoD (comportamiento actual).
- `sddf.config.yaml` ausente: `story-implement` se detiene con `❌ sddf.config.yaml no encontrado` (comportamiento actual, CR-002); `story-implement-tasks` no lo requiere.
- Repo con layout legado sin migrar: la búsqueda por ID falla con el mensaje de D-3; el aviso de migración pertenece a `skill-preflight` y `/sddf-init`.

### F-6 — Puntos de cambio // P6
- **Contrato v2 o nuevas raíces:** cambia el texto canónico en el Paso 0 y las constantes de STORY-148.
- **Archivo de historias (`specs/flow/archive/`):** si la épica de Workflow permite reabrir historias, se amplía solo la regla de D-3.

## Decisiones de complejidad justificada

- **Validación de `{story_path}` (D-3):** sin ella, AC-2 no se cumple por construcción; es una comprobación de prefijo y existencia, no un mecanismo nuevo.
- **Fallback `<parent>-*` en D-4:** cubre historias cuyo `parent` es solo `EPIC-NN` (forma que hoy asume implement-tasks); es un segundo intento de Glob sobre el mismo directorio.
- **D-6 condicional:** evita duplicar el cambio de STORY-150 sin crear dependencia dura entre historias hermanas.
- No se añade archivo, script, variable ni fallback a rutas legadas.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin referencias legadas | `grep -rnE "SPECS_BASE\|SDDF_ROOT\|SDDF-ROOT-RESOLUTION" skills/story-implement skills/story-implement-tasks` → sin salida | AC-2 |
| 2 | Sin rutas `docs/specs` ni `specs/stories` | `grep -rnE "docs/specs\|specs/stories\|specs/epics" <mismos dirs>` → sin salida | AC-1, CNF-1 |
| 3 | Contrato declarado | `grep -c "<!-- SDDF-FIXED-LAYOUT: v1 -->"` = 1 en cada `SKILL.md` | CNF-2 |
| 4 | Sin lectura de `root` | `grep -nE "\broot\b.*sddf\.config\.yaml\|sddf\.config\.yaml.*\broot\b"` en ambos `SKILL.md` → sin salida | AC-2 |
| 5 | Gate verde | ambas entradas ausentes de `PENDING_MIGRATION`; `npm run verify:repository` → exit 0 | AC-2 |
| 6 | Pruebas verdes | `npm test` → exit 0 (incluye E2E-002) | AC-2 |
| 7 | Resolución con guion y mensaje nuevo | `grep -n "specs/flow/{story_id}-\*/"` y `grep -n "No se encontró la historia {story_id} en specs/flow/"` en ambos `SKILL.md` | AC-1, AC-2 |
| 8 | Ruta explícita restringida | `grep -n "no es una historia de specs/flow/"` en `story-implement-tasks/SKILL.md` | AC-2 |
| 9 | Épica en `specs/flow/` | `grep -n "specs/flow/<parent>/epic.md"` en ambos `SKILL.md` | AC-2 |
| 10 | Informe en la carpeta de la historia | `grep -n "implement-report.md"` en las tablas de salida → `$STORY_DIR/…` (implement) y `specs/flow/<STORY-NNN>-<slug>/…` (implement-tasks) | AC-1 |
| 11 | Evals válidos | `node -e "JSON.parse(require('fs').readFileSync('skills/story-implement/evals/evals.json','utf8'))"`; `npm run test:eval -- story-implement --dry-run` sin error | CNF-1 |
| 12 | Alcance acotado | `git diff --stat` solo muestra los archivos de «Componentes afectados» más artefactos de la historia | Non-Goals |
| 13 | Ejecución real de evals (a criterio humano) | `npm run test:eval -- story-implement` y `-- story-implement-tasks` | AC-1, CNF-1 |

## Risks / Trade-offs

- **[Riesgo] Precondición: STORY-148 sin implementar** (`scripts/verify-fixed-layout.js` no existe) y ADR-0016 (STORY-147) sin crear → implementar solo con ambas en `DONE`; la primera tarea lo comprueba (dependencia dura declarada en la historia).
- **[Riesgo] Dogfooding en transición:** los skills fuente apuntarán a `specs/flow/` mientras este repo sigue en `docs/specs/` hasta STORY-153 → no reinstalar las copias de runtime antes de STORY-153; registrar la advertencia en `implement-report.md`. Esta historia se implementa con las copias instaladas (contrato v1).
- **[Trade-off] Repos sin migrar:** `story-implement` informa «no encontrada en `specs/flow/`» para historias en `docs/specs/` → comportamiento exigido; la guía de migración es de STORY-154.
- **[Riesgo] Evals no ejecutados:** un error semántico en los 12 fixtures no se detecta en CI → contrato 11 valida estructura; ejecución a criterio humano.
- **[Limitación] R2–R4 no prueban la prosa:** contratos 2, 7, 8 y 9 cubren rutas por grep.

## Open Questions

Ninguna: la dependencia con E2E-002 queda decidida en D-6 (CR-001) y el alcance de `sddf.config.yaml` en CR-002.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2, D-3; F-1, F-2; contratos 2, 7, 10), AC-2 (D-1, D-3, D-4, D-5, D-6; F-3, F-4; contratos 1, 4, 5, 6, 8, 9), CNF-1 (D-2; contratos 2, 11), CNF-2 (D-1, D-5; contrato 3). README, evals y ejemplos de ambos skills inventariados; ninguno tiene agentes locales.
- **Ambigüedad:** «no se escribe nada en `docs/specs/`» operacionalizado como ausencia de fallback, de literales y de rutas explícitas fuera de `specs/flow/` (D-3).
- **Nombres:** «contrato de layout fijo», «lista transitoria» / `PENDING_MIGRATION`, `$STORY_DIR` se usan como en STORY-148, STORY-150 y el propio skill.
- **Estructura:** sin componentes nuevos ni ciclos; los skills dependen del contrato (bloque y rutas) y de `CLI_ROOT` para generadores/seed, no entre sí. Sin código de implementación.

## Registro de Cambios (CR)

### CR-001
- **Tipo**: dependencia
- **Descripción**: `test/dod-story.test.js` (E2E-002) exige el literal `$SPECS_BASE/guardrails/dod-story-implement.md` en ambos skills. La historia declara que STORY-150 no es dependencia, pero el cambio de la prueba lo hace STORY-150 (D-7). Si STORY-156 se implementa antes, `npm test` falla.
- **Documento afectado**: story.md (dependencias), design.md (D-6)
- **Acción requerida**: la primera tarea comprueba si E2E-002 ya usa `docs/guardrails/`; si no, aplica el cambio de STORY-150 D-7 tal cual. Opcional: añadir `test/dod-story.test.js` al alcance de la historia como cambio condicional.

### CR-002
- **Tipo**: ambigüedad
- **Descripción**: el «Para» de la historia dice «sin `sddf.config.yaml` ni `SDDF_ROOT`», pero `story-implement` exige `sddf.config.yaml` para sus generadores (`implement.test_generators`/`code_generators`), independiente del layout. `/sddf-init` (STORY-149) crea ese archivo sin clave de raíz.
- **Documento afectado**: story.md (narrativa)
- **Acción requerida**: el diseño interpreta el «Para» como «sin declarar una raíz en `sddf.config.yaml` ni `SDDF_ROOT`» y no cambia la lectura de generadores. Opcional: precisar la redacción en story.md.

### CR-003
- **Tipo**: dependencia
- **Descripción**: la historia omite dos defectos que la migración debe corregir para cumplir AC-2: el Glob sin guion de `story-implement` 0c.1 y el patrón `<parent>-*` de `story-implement-tasks` 4c, que no casa con un `parent` de slug completo.
- **Documento afectado**: design.md (D-3, D-4)
- **Acción requerida**: incluidos en el alcance mediante D-3 y D-4; sin cambio en story.md.
