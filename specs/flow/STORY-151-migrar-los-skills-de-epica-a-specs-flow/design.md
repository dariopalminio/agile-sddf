---
alwaysApply: false
type: design
id: STORY-151
slug: STORY-151-migrar-los-skills-de-epica-a-specs-flow-design
title: "Design: Migrar los skills de épica a specs/flow"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-26-layout-y-flow-forward-mejorado
story: STORY-151
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-151-migrar-los-skills-de-epica-a-specs-flow
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-147-adr-del-layout-fijo-de-tres-raices
  - STORY-150-migrar-skills-especificacion-specs-flow
  - EPIC-26-layout-y-flow-forward-mejorado
---

<!-- Referencias -->
[[STORY-151-migrar-los-skills-de-epica-a-specs-flow]] · [[STORY-148-contrato-de-rutas-fijas-y-gate-determinista]] · [[STORY-147-adr-del-layout-fijo-de-tres-raices]] · [[STORY-150-migrar-skills-especificacion-specs-flow]] · [[EPIC-26-layout-y-flow-forward-mejorado]]

## Context

La historia migra los skills de épica al layout fijo de ADR-0016 (STORY-147): dejan de resolver una raíz configurable y leen/escriben en rutas fijas relativas a `REPO_ROOT` (`specs/flow/EPIC-NN-<slug>/`, `specs/flow/STORY-NNN-<slug>/`, `specs/flow/archive/`, `docs/templates/`, `docs/product/`). Adoptan el contrato verificable de STORY-148 (marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`, reglas R1–R4 de `scripts/verify-fixed-layout.js`) con el mismo texto canónico que STORY-150 (D-1).

Estado verificado en el filesystem (2026-10-22):

| Fuente | Hallazgo |
|---|---|
| `skills/epic-creation/` | `SKILL.md` (16 coincidencias): bloque `SDDF-ROOT-RESOLUTION: v1` (l. 108–115); siguiente `EPIC-NN` con Glob `$SPECS_BASE/specs/epics/EPIC-*/epic.md` y fallback `ls $SPECS_BASE/specs/epics/` (l. 135–139); salida `$SPECS_BASE/specs/epics/<EPIC-NN-slug>/epic.md` (l. 142, 146, 267, 290, 325); template `$SPECS_BASE/templates/epic-template.md` con seed local `assets/epic-template.md` (l. 62, 160–161, 329). `README.md:15`. `examples/test-0{1,2,3}-*.md`: 11 rutas `$SPECS_BASE/…` y `docs/specs/epics/…`. `evals/evals.json` (6 casos): TC-001 cita `SDDF_ROOT definido` y `$SPECS_BASE/…`. |
| `skills/epic-format-validation/` | `SKILL.md` (14): bloque v1 (l. 81–88); búsqueda por término en `$SPECS_BASE/specs/epics/` (l. 104); mensaje literal «No se encontró ninguna épica en docs/specs/epics/» (l. 116); template `$SPECS_BASE/templates/epic-template.md` con fallback `$CLI_ROOT/skills/epic-creation/assets/` (l. 41–56, 131–135, 272). `evals/evals.json` (15): 3 contextos `docs/specs/epics` y uno `$SPECS_BASE/templates/`. |
| `skills/epic-from-project-plan/` | `SKILL.md` (8): Paso 0 v1 abreviado (l. 25–31, cita `SDDF_ROOT` y «`root` válido de `sddf.config.yaml`» → R4); roadmap `$SPECS_BASE/product/roadmap.md` (l. 15, 34, 36, 44); `$EPICS_DIR = $SPECS_BASE/specs/epics/` (l. 52); template central con fallback `$CLI_ROOT/…` (l. 62). `README.md:7,9`. `evals/evals.json` (11) sin rutas legadas. |
| `skills/epic-generate-stories/` | `SKILL.md` (30): `description` del frontmatter cita `<SPECS_BASE>/specs/stories/…`; bloque v1 (l. 81–88); búsqueda Formato A por subdirectorios de `$SPECS_BASE/specs/epics/` (l. 102) y señal de Formato B «empieza con `$SPECS_BASE/`» (l. 109); **Paso 2b**: máximo ID = Fuente A `$SPECS_BASE/specs/stories/STORY-*/story.md` ∪ Fuente B `$SPECS_BASE/specs/epics/*/epic.md` (l. 158–160); salida, conflicto y resumen bajo `$SPECS_BASE/specs/stories/` (l. 184–362). `README.md:15`. `evals/evals.json` (7): 11 rutas legadas, dos «`SDDF_ROOT` definido». |
| `skills/epic-generate-all-stories/` | `SKILL.md` (33): `description` cita `<SPECS_BASE>/specs/epics/`; bloque v1 (l. 88–95); descubrimiento `$SPECS_BASE/specs/epics/EPIC-*/epic.md` (l. 102–115); detección anticipada de conflictos en `$SPECS_BASE/specs/stories/` (l. 126–143); delega numeración y generación en el flujo de `epic-generate-stories`. `README.md:15`. `evals/evals.json` (5): 9 rutas legadas, dos «`SDDF_ROOT` definido». |
| `skills/epic-analyze/` | `SKILL.md` (19): tabla de entradas (l. 39–42); bloque v1 (l. 91–98, con `CLI_ROOT` para dos seeds); resolución de la épica por nombre/ID en `$SPECS_BASE/specs/epics/` y mensaje de ejemplo `docs/specs/epics/EPIC-77-*/epic.md` (l. 107–112); **Vía B**: inventario `$SPECS_BASE/specs/stories/STORY-*/story.md` y resolución de IDs listados (l. 143–146); referencias `related` a historias y épicas (l. 245–253). El estado `COMPLETED` ya clasifica como «lista» (l. 230–240). `evals/evals.json` (28 casos, 125 coincidencias): fixtures con `env: { SDDF_ROOT: null }`, `sddf_config_root: "docs"`, `epics_dirs`, `epic_md_path` y `stories[].path` bajo `docs/specs/…`; TC-002 espera `specs/epics/EPIC-77-*`. |
| `epic-refine` | **No existe en `skills/`.** Solo hay una propuesta sin versionar en `.temp/propuestas-de-mejoras/epic-refine/` (`SKILL.md`, `README.md`, `assets/`, `evals/`) y un `epic-refine-report.md` en EPIC-26. No figura en `package.json › files`. Ver CR-001. |
| `scripts/verify-fixed-layout.js` (STORY-148) | **Aún no existe.** Su diseño fija el bloque canónico, R1–R4 y `PENDING_MIGRATION` (36 skills), de la que cada historia de migración retira los suyos en el mismo cambio. |
| Pruebas | Ninguna prueba de `test/` lee el contenido de los seis `SKILL.md` ni sus evals. `test/verify-validation-contract.test.js` solo usa el template del reporte de `epic-analyze` (sin rutas legadas). `test/epic-template.test.js` compara `docs/templates/epic-template.md` con el seed de `epic-creation` (no cambia). |
| Layout (ADR-0016, STORY-147 D-2/D-3) | `docs/product/` es conocimiento; `specs/flow/` es plano (`EPIC-NN-<slug>/` y `STORY-NNN-<slug>/` conviven, sin `epics/` ni `stories/`); `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` solo para stories `COMPLETED`; las épicas no se archivan. |
| `specs/` | No existe en el repo. Los work items siguen en `docs/specs/` hasta STORY-153. |

Stakeholders: el practitioner que crea, valida y analiza épicas en un repo inicializado con `/sddf-init` (AC-1–AC-3); el mantenedor que cierra EPIC-26 (CS-2, SMOKE-2) y STORY-157, que verifica `PENDING_MIGRATION` vacía.

## Goals / Non-Goals

**Goals:**
- Sustituir el Paso 0 de los seis `SKILL.md` por el bloque canónico del contrato de layout fijo // satisface: AC-4, CNF-1
- Reescribir toda ruta `$SPECS_BASE/…`, `<SPECS_BASE>/…` y `docs/specs/…` de los seis skills (SKILL.md, README.md, `examples/`, `evals/`) a rutas fijas relativas a `REPO_ROOT` // satisface: AC-1, AC-2, AC-4, CNF-1
- Resolver épicas solo entre `specs/flow/EPIC-*/`, sin confundirlas con historias del mismo directorio plano // satisface: AC-1, AC-2, AC-3
- Contar las historias de `specs/flow/archive/` como hijas en `epic-analyze` // satisface: AC-3
- Calcular el siguiente `STORY-NNN` sobre activas, archivadas y épicas, y nunca regenerar una historia archivada // satisface: AC-2, CNF-2
- Retirar los seis skills de `PENDING_MIGRATION` // satisface: AC-4
- Actualizar los evals a `specs/flow/` y añadir casos para AC-1, AC-2 y AC-3 // satisface: CNF-1

**Non-Goals:**
- Archivar épicas o crear `specs/flow/archive/` (épica de Workflow; `/sddf-init`, STORY-149)
- Crear `epic-specify`, `epic-plan`, `epic-implement` ni `epic-refine` (CR-001)
- Migrar `memory-system` (`migrate --from=epic-template-v1` descubre `specs/*/EPIC-*`) ni `domain-epic-lifecycle` (STORY-152, STORY-154)
- Mover work items de `docs/specs/` a `specs/flow/` (STORY-153) ni crear `specs/flow/` en este repo
- Crear `scripts/verify-fixed-layout.js` o cambiar sus reglas (STORY-148)
- Cambiar el contenido de `assets/epic-template.md` o `assets/epic-analyze-report-template.md` (verificados sin rutas legadas)
- Reinstalar las copias de runtime (`.claude/skills/`) ni ejecutar `npm run test:eval` (a criterio humano, CNF-1)

## Decisions

### D-1 — Paso 0 con el bloque canónico del contrato // satisface: AC-4, CNF-1

En los seis `skills/<skill>/SKILL.md` el bloque desde `<!-- SDDF-ROOT-RESOLUTION: v1 -->` hasta el siguiente encabezado se sustituye por el texto canónico de STORY-148 D-1 (idéntico al de STORY-150 D-1), conservando el encabezado y número de paso de cada skill:

```markdown
<!-- SDDF-FIXED-LAYOUT: v1 -->

Resuelve `REPO_ROOT` (raíz del repositorio) y usa rutas fijas relativas a él:
work items en `specs/flow/`, templates en `docs/templates/` y DoD en `docs/guardrails/`.
El layout no es configurable (ADR-0016).
```

| Skill | Encabezado que se conserva | Se elimina | Se añade tras el bloque (fuera de él solo si el skill lo necesita) |
|---|---|---|---|
| `epic-creation` | `### Paso 0 — Resolver contexto local` | pasos 1–4 (incluido `CLI_ROOT`, no lo usa: su seed es local) | — |
| `epic-format-validation` | ídem | pasos 1–4 | línea `CLI_ROOT` (fallback del template de `epic-creation`) |
| `epic-generate-stories` | ídem | pasos 1–4 | línea `CLI_ROOT` (seeds de `epic-creation` y `story-creation`) |
| `epic-generate-all-stories` | ídem | pasos 1–4 | línea `CLI_ROOT` (seed de `story-creation`) |
| `epic-analyze` | ídem | pasos 1–4 | línea `CLI_ROOT` (seed del template de épica y del reporte) |
| `epic-from-project-plan` | `## Paso 0 — Resolver contexto local` | pasos 1–4 (el 2.º lee `root` de `sddf.config.yaml` → R4) | línea `CLI_ROOT` (seed del template de épica) |

Texto de la línea `CLI_ROOT`, inmediatamente después del bloque: «Resuelve `CLI_ROOT` (instalación del paquete) por separado y solo para leer los seeds de templates; nunca lo derives de `REPO_ROOT`.» La línea sobre `/skill-preflight` se conserva donde exista.

Cumplimiento: R1 (marcador), R2 (los cuatro tokens en el bloque), R3 (sin `SDDF-ROOT-RESOLUTION: v1`, `SPECS_BASE`, `SDDF_ROOT`), R4 (ninguna línea combina `root` y `sddf.config.yaml`).

**Alternativas rechazadas:**
- **Eliminar `CLI_ROOT` en todos (como STORY-150):** cuatro skills leen seeds de otros skills (`$CLI_ROOT/skills/epic-creation/assets/…`); sin la variable la ruta del fallback queda indefinida en una instalación global.
- **Meter `CLI_ROOT` dentro del bloque del contrato:** el bloque canónico debe ser idéntico en todos los skills migrados (P5); `CLI_ROOT` no forma parte del layout.
- **Mantener el bloque v1 cambiando solo las rutas de salida:** seguiría honrando `SDDF_ROOT`/`root` (contradice ADR-0016) y el gate fallaría por R3/R4.

### D-2 — Mapa de sustitución de rutas // satisface: AC-1, AC-2, AC-4, CNF-1

Regla única para todos los archivos de los seis skills (`SKILL.md` incluido su frontmatter `description`, `README.md`, `examples/**`, `evals/evals.json`). Las rutas se escriben relativas a `REPO_ROOT`, sin prefijo de variable:

| Forma legada | Forma fija | Dónde aparece |
|---|---|---|
| `$SPECS_BASE/specs/epics/<EPIC-NN-slug>/…` | `specs/flow/<EPIC-NN-slug>/…` | salidas y entradas de creation, from-project-plan, generate-*, analyze, examples |
| `$SPECS_BASE/specs/epics/` (directorio, búsquedas, `$EPICS_DIR`) | `specs/flow/` con patrón `specs/flow/EPIC-*/epic.md` (D-3) | todos |
| `$SPECS_BASE/specs/epics/*/epic.md` (Fuente B) | `specs/flow/EPIC-*/epic.md` | generate-stories |
| `$SPECS_BASE/specs/stories/STORY-…/…` | `specs/flow/STORY-…/…` | generate-*, analyze |
| `$SPECS_BASE/specs/stories/` (directorio) | `specs/flow/` | generate-* (Paso 3), analyze |
| `$SPECS_BASE/templates/…` | `docs/templates/…` | creation, format-validation, from-project-plan, generate-*, analyze |
| `$SPECS_BASE/product/roadmap.md` | `docs/product/roadmap.md` | from-project-plan (`$ROADMAP_PATH` y dos mensajes) |
| `<SPECS_BASE>/specs/epics/`, `<SPECS_BASE>/specs/stories/…` (frontmatter `description`) | `specs/flow/`, `specs/flow/STORY-NNN-nombre/story.md` | generate-all-stories, generate-stories |
| `docs/specs/epics/…`, `docs/specs/stories/…` (mensajes, ejemplos, evals) | `specs/flow/…` | format-validation l. 116, analyze l. 112, examples, evals |
| `specs/stories/`, `specs/epics/` sin prefijo (notas de inexistencia) | `specs/flow/` | analyze l. 143, 253 |
| Señal Formato B «empieza con `$SPECS_BASE/`» | «empieza con `specs/flow/`» | generate-stories l. 109 |
| `ls $SPECS_BASE/specs/epics/ \| grep -E "^EPIC-"` | `ls specs/flow/ \| grep -E "^EPIC-"` | creation l. 138 |
| «Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/templates/`» | «… en `docs/templates/`» | creation, format-validation, generate-* |
| «(o la ruta de épicas vigente)» | se elimina: la ruta ya no varía | from-project-plan `README.md:9` |

**Alternativas rechazadas:**
- **Variable nueva (`FLOW_DIR`, `EPICS_DIR` relativo):** reintroduce la indirección que ADR-0016 retira. `$EPICS_DIR` de `epic-from-project-plan` se sustituye por el literal `specs/flow/` en todas sus apariciones (Fase 2, l. 52 y 54; Fase 4, l. 80).
- **Dejar ejemplos y evals con `docs/specs/`:** el gate solo lee `SKILL.md`, pero AC-4 hace grep sobre el directorio completo del skill y CNF-1 exige evals en `specs/flow/`; ejemplos obsoletos inducirían al LLM a escribir en la ruta legada.

### D-3 — Resolución de una épica en el directorio plano // satisface: AC-1, AC-2, AC-3

`specs/flow/` mezcla épicas e historias. Toda búsqueda de épicas se restringe al patrón `specs/flow/EPIC-*/epic.md`:

| Skill y entrada | Búsqueda | Sin coincidencia |
|---|---|---|
| `epic-analyze` por ID `EPIC-NN` | Glob `specs/flow/EPIC-NN-*/epic.md` (guion obligatorio, como hoy) | `❌ No se encontró la épica EPIC-NN: no existe specs/flow/EPIC-NN-*/epic.md` |
| `epic-analyze` por nombre `EPIC-NN-<slug>` | `specs/flow/EPIC-NN-<slug>/epic.md` | mismo patrón con la ruta probada |
| `epic-generate-stories` Formato A (término) | nombres de directorio de `specs/flow/EPIC-*/epic.md` que contengan el término (sin distinguir mayúsculas) | `No se encontró el directorio de la épica: <término>. Asegúrate de que existe en specs/flow/ …` |
| `epic-format-validation` Tipo B (término) | rutas `specs/flow/EPIC-*/epic.md` cuyo nombre de directorio contenga el término | `No se encontró ninguna épica en specs/flow/ que coincida …` |
| `epic-generate-all-stories` descubrimiento | Glob `specs/flow/EPIC-*/epic.md` | `No se encontraron directorios de épica en specs/flow/` |
| Rutas explícitas (Formato B, Tipo A, `epic-analyze` ruta) | sin cambio: se usan tal cual | sin cambio |

- Nunca se consulta `docs/specs/` ni `specs/flow/archive/` para resolver una épica (las épicas no se archivan).
- Un término que coincide con un `STORY-*` no produce coincidencia: el patrón exige `EPIC-*` y `epic.md`.

**Alternativas rechazadas:**
- **Buscar el término en cualquier subdirectorio de `specs/flow/` (traducción literal de «subdirectorios de `specs/epics/`»):** un término como `pagos` casaría `STORY-010-pagos-…` y el skill pediría elegir o leería un `epic.md` inexistente.
- **Fallback a `docs/specs/epics/` con aviso:** el diagnóstico del layout legado es de `skill-preflight` y `/sddf-init`; un fallback mantendría vivo el layout que la épica retira.

### D-4 — Historias hijas activas y archivadas en `epic-analyze` // satisface: AC-3

El conjunto de historias del repositorio (Vía B) pasa a ser la unión de dos patrones:

| Origen | Glob | Extracción del ID |
|---|---|---|
| Activas | `specs/flow/STORY-*/story.md` | prefijo `STORY-NNN` del nombre del directorio |
| Archivadas | `specs/flow/archive/*-STORY-*/story.md` | token `STORY-NNN` que sigue al prefijo `<YYYY-MM-DD>-` del nombre del directorio |

Cambios en `skills/epic-analyze/SKILL.md`:
1. **Paso 4.1 (inventario):** usa la unión. Si `specs/flow/` no existe el inventario es vacío; si solo falta `specs/flow/archive/`, se omite ese origen sin nota.
2. **Paso 4.2:** «el ID de la historia es el `STORY-NNN` del nombre de su directorio, tras el prefijo de fecha si está archivada».
3. **Paso 4.4 (ID listado):** Glob `specs/flow/<STORY-NNN>-*/story.md` y `specs/flow/archive/*-<STORY-NNN>-*/story.md` (guion obligatorio tras el ID en ambos). Con varias coincidencias se usa la activa antes que la archivada y, dentro de cada origen, la primera en orden alfabético; las demás se anotan en `notas-analisis` como hoy.
4. **Paso 5c (`related`):** un `STORY-NNN` resuelve si existe en cualquiera de los dos orígenes; un `EPIC-NN` con `specs/flow/EPIC-NN-*/epic.md`.
5. **Tabla de entradas (l. 39–42):** filas `epic.md` → `specs/flow/<EPIC-NN-nombre>/epic.md`; `story.md` → `specs/flow/STORY-*/story.md` y `specs/flow/archive/*-STORY-*/story.md`.

Efectos: una historia archivada con `parent` de la épica es declarante (no INT-02 si está listada); un ID listado cuyo `story.md` está archivado existe (no INT-01); entra en el universo, aporta evidencia E1/E2 y su `status: COMPLETED` ya clasifica como «lista» (sin MAD-01). Las rutas de evidencia del reporte citan la ruta archivada real.

**Alternativas rechazadas:**
- **Solo `specs/flow/STORY-*`:** tras STORY-153 todas las historias completadas de una épica aparecerían como INT-01 (listadas sin directorio); es el defecto que AC-3 prohíbe.
- **Leer el ID del frontmatter (`id:`) en lugar del directorio:** el skill identifica historias por directorio a propósito (una sola fuente de identidad); el prefijo de fecha se resuelve con el patrón, sin leer más archivos.
- **Excluir las archivadas de la cobertura (solo contarlas para INT):** una historia completada es la mejor evidencia de un criterio de salida; excluirla generaría huecos de cobertura falsos.

### D-5 — Numeración de historias y épicas // satisface: AC-2, CNF-2

**Historias** (`epic-generate-stories` Paso 2b; `epic-generate-all-stories` lo hereda al delegar en su flujo): `MAX_ID` = máximo de:
- **Fuente A — Filesystem:** `specs/flow/STORY-*/story.md` ∪ `specs/flow/archive/*-STORY-*/story.md` (extracción de D-4).
- **Fuente B — Épicas existentes:** todo `STORY-NNN` presente en `specs/flow/EPIC-*/epic.md`.

Sin coincidencias → `0` (primera historia `STORY-001`). Formato de tres dígitos con ceros sin cambio.

**Épicas** (`epic-creation`, `epic-from-project-plan`): siguiente `NN` sobre `specs/flow/EPIC-*/epic.md` (fallback `ls specs/flow/ | grep -E "^EPIC-"`). No se consulta `archive/`: las épicas no se archivan (ADR-0016). Un repo limpio produce `EPIC-01-<slug>` en `epic-creation` (AC-1); la regla `-1` de `epic-from-project-plan` no cambia.

**Alternativas rechazadas:**
- **Solo historias activas en la Fuente A:** tras STORY-153 las de mayor número están archivadas; se reutilizaría un ID emitido (CNF-2, ADR-0004).
- **Contador persistente (`.counters.json`, `next-id`):** fuera de alcance de la épica (épica de Workflow).
- **Incluir `archive/` en la numeración de épicas:** ningún flujo crea `archive/*-EPIC-*`; sería código muerto (P12).

### D-6 — Historias ya existentes o archivadas al generar // satisface: CNF-2, AC-2

En `epic-generate-stories` (verificación de conflicto, l. 218) y `epic-generate-all-stories` (detección anticipada, Paso 2), para cada línea F2/F3 con ID:

| Situación | Comportamiento |
|---|---|
| Existe `specs/flow/STORY-NNN-<nombre-kebab>/story.md` | conflicto: flujo actual (preguntar / opciones a-b-c) |
| Existe `specs/flow/archive/*-STORY-NNN-*/story.md` | **saltada sin preguntar**: `- specs/flow/archive/<dir>/ — saltada (archivada)` en el resumen; nunca se crea `specs/flow/STORY-NNN-*/` |
| No existe en ninguno | se genera en `specs/flow/STORY-NNN-<nombre-kebab>/story.md` |

**Alternativas rechazadas:**
- **Tratar la archivada como conflicto «sobreescribir»:** crearía una copia activa de una historia `COMPLETED` con el mismo ID (colisión, CNF-2) y la sacaría del archivo sin la épica de Workflow.
- **Ignorar `archive/` en la detección:** mismo efecto silencioso.

### D-7 — Directorio de salida inexistente // satisface: AC-1, AC-2

`epic-creation`, `epic-from-project-plan`, `epic-generate-stories` y `epic-generate-all-stories` crean `specs/flow/` (y el directorio del work item) si no existe; nunca crean `docs/specs/` ni `specs/flow/archive/`. El Paso 3 de los dos generadores pasa a «Verificar si el directorio `specs/flow/` existe; si no, crearlo».

**Alternativas rechazadas:**
- **Fallar si falta `specs/flow/`:** un repo inicializado con la versión anterior de `/sddf-init` no podría crear su primera épica; crear un directorio vacío era el comportamiento previo.
- **Crear también `archive/`, `living/`, `workflow/`:** duplica la responsabilidad de `/sddf-init` (P11).

### D-8 — Retiro de la lista transitoria del gate // satisface: AC-4

En `scripts/verify-fixed-layout.js` se retiran de `PENDING_MIGRATION` las seis entradas `epic-analyze`, `epic-creation`, `epic-format-validation`, `epic-from-project-plan`, `epic-generate-all-stories` y `epic-generate-stories`, en el mismo cambio que migra los skills (STORY-148 D-4). La lista conserva el orden alfabético.

**Alternativas rechazadas:**
- **Retirarlos en otra historia:** el gate no validaría la migración y fallaría por la regla de higiene «ya cumple el contrato — retíralo de la lista».

### D-9 — Evals // satisface: CNF-1, AC-1, AC-2, AC-3

Regla general: en todo `evals/evals.json` de los seis skills se aplica D-2 a `description`, `input` (incluidas claves de fixture) y `expected`; se elimina toda mención de `SDDF_ROOT` y `$SPECS_BASE` («Entorno SDDF valido. SDDF_ROOT definido.» → «Entorno SDDF válido con layout fijo.»). Casos con cambio específico:

| Skill | Caso | Cambio |
|---|---|---|
| `epic-analyze` | todos los que la tengan | eliminar `"env": { "SDDF_ROOT": null }` y `"sddf_config_root": "docs"`; `epics_dirs`, `epic_md_path`, `stories[].path` a `specs/flow/…` |
| `epic-analyze` | TC-002 `epica-no-encontrada-sin-reporte` | `expected.contains`: `specs/epics/EPIC-77-*` → `specs/flow/EPIC-77-*` |
| `epic-analyze` | nuevo `historia-archivada-cuenta-como-hija` (siguiente `TC-NNN` libre) | AC-3: EPIC-30 lista STORY-201 (F3) y STORY-202 (F2); STORY-201 está en `specs/flow/archive/2026-10-01-STORY-201-listar-clientes/story.md` con `parent: EPIC-30-ejemplo`, `status: COMPLETED`; STORY-202 activa. `contains`: `verdict: APPROVED`, `Sin hallazgos.`; `not_contains`: `INT-01`, `INT-02`, `MAD-01`, `docs/specs` |
| `epic-creation` | TC-001 | contexto sin `SDDF_ROOT`/`$SPECS_BASE`; épicas previas en `specs/flow/` |
| `epic-creation` | nuevo `repo-limpio-escribe-en-specs-flow` | AC-1: repo recién inicializado con `/sddf-init`, sin épicas → `contains`: `specs/flow/EPIC-01-`, `epic.md`; `not_contains`: `docs/specs` |
| `epic-generate-stories` | TC-005 y contextos | rutas a `specs/flow/` |
| `epic-generate-stories` | nuevo `max-id-incluye-archivadas` | AC-2/CNF-2: mayor activo `STORY-010`, archivado `specs/flow/archive/2026-09-30-STORY-012-x/`, épicas sin IDs mayores; dos F1 → `contains`: `STORY-013`, `STORY-014`, `specs/flow/STORY-013-`; `not_contains`: `STORY-011-`, `STORY-012-`, `docs/specs` |
| `epic-generate-all-stories`, `epic-format-validation` | contextos | rutas a `specs/flow/` y `docs/templates/` |
| `epic-from-project-plan` | — | sin rutas legadas; solo se revisa que ningún caso espere `docs/specs` |

El JSON debe seguir siendo válido para `npm run test:eval -- <skill> --dry-run` y para `verify:repository`. Los evals no se ejecutan en esta historia (CNF-1).

**Alternativas rechazadas:**
- **Conservar `env.SDDF_ROOT: null` como «sin variable»:** AC-4 hace grep sobre `skills/epic-*` completo; la clave es además irrelevante sin raíz configurable.
- **Cubrir AC-3 modificando un caso existente:** los 28 casos fijan otros comportamientos; un caso nuevo aísla la regla de D-4.

## Componentes afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| Creación de épica | modificar (Paso 0, rutas, numeración `EPIC-NN`) | `skills/epic-creation/SKILL.md`, `README.md` | AC-1, AC-4 |
| Ejemplos de creación | modificar (11 rutas) | `skills/epic-creation/examples/test-0{1,2,3}-*.md` | AC-4 |
| Evals de creación | modificar TC-001, añadir caso AC-1 | `skills/epic-creation/evals/evals.json` | AC-1, CNF-1 |
| Validación de formato | modificar (Paso 0, rutas, búsqueda por término, mensaje) | `skills/epic-format-validation/SKILL.md` | AC-4 |
| Evals de validación | modificar contextos | `skills/epic-format-validation/evals/evals.json` | CNF-1 |
| Épicas desde el roadmap | modificar (Paso 0, roadmap, destino, template) | `skills/epic-from-project-plan/SKILL.md`, `README.md` | AC-4 |
| Generación de historias | modificar (Paso 0, rutas, búsqueda, Paso 2b, conflicto con archivadas) | `skills/epic-generate-stories/SKILL.md`, `README.md` | AC-2, AC-4, CNF-2 |
| Evals de generación | modificar contextos, añadir caso AC-2 | `skills/epic-generate-stories/evals/evals.json` | AC-2, CNF-1 |
| Generación en batch | modificar (Paso 0, rutas, descubrimiento, conflictos con archivadas) | `skills/epic-generate-all-stories/SKILL.md`, `README.md` | AC-2, AC-4, CNF-2 |
| Evals de batch | modificar contextos | `skills/epic-generate-all-stories/evals/evals.json` | CNF-1 |
| Análisis de épica | modificar (Paso 0, entradas, resolución, Vía B, `related`) | `skills/epic-analyze/SKILL.md` | AC-3, AC-4 |
| Evals de análisis | modificar fixtures de 28 casos, TC-002, añadir caso AC-3 | `skills/epic-analyze/evals/evals.json` | AC-3, CNF-1 |
| Lista transitoria del gate | modificar (retirar 6 entradas) | `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) | AC-4 |

No se modifican `assets/` de ningún skill, `README.md` de `epic-format-validation` ni `epic-analyze` (sin rutas legadas), ni pruebas de `test/`. No se crea ningún archivo.

## Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Paso 0 de cada skill | bloque de D-1 entre el marcador y el siguiente encabezado | AC-4 |
| Directorio de una épica | `specs/flow/EPIC-NN-<slug>/epic.md` relativo a `REPO_ROOT` | AC-1 |
| Directorio de una historia | `specs/flow/STORY-NNN-<slug>/story.md`; archivada `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/story.md` | AC-2, AC-3 |
| Resolución de épica | `specs/flow/EPIC-*/epic.md` (D-3) | AC-1, AC-2, AC-3 |
| Inventario de historias | `specs/flow/STORY-*/story.md` ∪ `specs/flow/archive/*-STORY-*/story.md` (D-4) | AC-3 |
| Siguiente `STORY-NNN` | `max(activas ∪ archivadas ∪ IDs en specs/flow/EPIC-*/epic.md) + 1` (D-5) | AC-2, CNF-2 |
| Siguiente `EPIC-NN` | `max(specs/flow/EPIC-*) + 1`; vacío → `EPIC-01` (`epic-creation`) | AC-1 |
| Templates | `docs/templates/epic-template.md`, `docs/templates/story-template.md`, `docs/templates/epic-analyze-report-template.md`; seeds por `CLI_ROOT` | AC-1, AC-2 |
| Roadmap | `docs/product/roadmap.md` | AC-4 |
| Gate | `npm run verify:repository` aplica R1–R4 a los seis skills | AC-4 |

## Esquema de datos

N/A — no cambia ningún frontmatter ni formato de artefacto (`epic.md`, `story.md`, `epic-analyze-report.md`); solo su ubicación. El esquema de `evals.json` se conserva (`skill`, `version`, `cases[].id/name/type/description/input/expected/threshold`); en los fixtures de `epic-analyze` desaparecen las claves `env` y `sddf_config_root` (D-9).

## Flujos clave

### F-1 — `/epic-creation` en un repo limpio // AC-1
1. Paso 0: resuelve `REPO_ROOT`.
2. Numeración (D-5): Glob `specs/flow/EPIC-*/epic.md` vacío y `ls specs/flow/` sin `EPIC-*` → `EPIC-01`.
3. Lee `docs/templates/epic-template.md` (o el seed local con aviso).
4. Crea `specs/flow/` si falta (D-7) y escribe `specs/flow/EPIC-01-<slug>/epic.md`; ningún paso referencia ni crea `docs/specs/`.

### F-2 — `/epic-generate-stories EPIC-NN` con historias F1 // AC-2, CNF-2
1. Resuelve la épica con `specs/flow/EPIC-*/epic.md` (D-3).
2. Paso 2b: `MAX_ID` sobre `specs/flow/STORY-*`, `specs/flow/archive/*-STORY-*` y los `epic.md` de `specs/flow/EPIC-*` (D-5); asigna `MAX_ID+1…` y reescribe las líneas F1 a F2.
3. Para cada historia: si está archivada, la salta (D-6); si existe activa, conflicto; si no, escribe `specs/flow/STORY-NNN-<slug>/story.md`.

### F-3 — `/epic-analyze EPIC-NN` con historias archivadas // AC-3
1. Resuelve la épica (D-3); lee el índice (Vía A).
2. Vía B (D-4): inventario sobre activas ∪ archivadas; las archivadas con `parent` de la épica son declarantes y los IDs listados resuelven en `archive/`.
3. INT: sin INT-01 ni INT-02 por las archivadas; SAL y MAD las incluyen en el universo (`COMPLETED` = lista).
4. Escribe `specs/flow/EPIC-NN-<slug>/epic-analyze-report.md`.

### F-4 — Gate tras la migración // AC-4
1. `grep -rnE "SPECS_BASE|SDDF_ROOT" skills/epic-*` → sin coincidencias.
2. `npm run verify:repository`: el paso `contrato de layout fijo` valida R1–R4 en los seis skills (fuera de `PENDING_MIGRATION`) → `[OK]`.

### F-5 — Degradación // P7
- `docs/templates/epic-template.md` ausente: seed vía `CLI_ROOT` o local con aviso (comportamiento actual); ambos ausentes → error actual.
- `docs/product/roadmap.md` ausente: `epic-from-project-plan` se detiene con el mensaje actual en la ruta nueva.
- `specs/flow/archive/` ausente: origen vacío en D-4 y D-5, sin nota ni error.
- Repo con layout legado sin migrar (`docs/specs/` sin `specs/flow/`): las búsquedas de épica fallan con el mensaje de D-3; una épica nueva se crea en `specs/flow/`. La detección y el aviso pertenecen a `skill-preflight` y `/sddf-init`. Ver Riesgos.

### F-6 — Puntos de cambio // P6
- **Archivado de épicas (épica de Workflow):** se añade un tercer origen `specs/flow/archive/*-EPIC-*` a D-3/D-5 sin tocar D-4.
- **Contador de IDs:** sustituye la regla de D-5 en `epic-generate-stories` sin afectar D-4/D-6.
- **Contrato v2 o `specs/living/`:** cambia el texto canónico del bloque en todos los skills migrados.

## Decisiones de complejidad justificada

- **Patrón `EPIC-*` en las búsquedas por término (D-3):** el directorio plano obliga a filtrar por tipo; es un patrón Glob, no un mecanismo nuevo.
- **Segundo origen `archive/` en Vía B y en la numeración (D-4, D-5):** la solución simple (solo activas) incumple AC-3 y CNF-2 tras STORY-153.
- **Salto de archivadas al generar (D-6):** una fila más en la tabla de conflictos; sin ella CNF-2 se incumple en silencio.
- **Línea `CLI_ROOT` en cuatro skills (D-1):** imprescindible para los seeds compartidos; queda fuera del bloque para no romper la uniformidad del contrato.
- No se añade archivo, script, variable ni fallback: la historia es una sustitución textual guiada por el contrato de STORY-148 más tres reglas de búsqueda.

## Contratos de verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Sin referencias legadas | `grep -rnE "SPECS_BASE\|SDDF_ROOT" skills/epic-*` → sin salida (exit 1) | AC-4 |
| 2 | Sin rutas del layout legado | `grep -rnE "docs/specs\|specs/epics\|specs/stories\|sddf_config_root" skills/epic-*` → sin salida | AC-1, AC-2, CNF-1 |
| 3 | Contrato declarado | `grep -c "<!-- SDDF-FIXED-LAYOUT: v1 -->"` = 1 en cada uno de los seis `SKILL.md` | AC-4 |
| 4 | Gate verde con los skills validados | seis entradas ausentes de `PENDING_MIGRATION`; `npm run verify:repository` → exit 0 | AC-4 |
| 5 | Sin lectura de `root` | `grep -nE "\broot\b.*sddf\.config\.yaml\|sddf\.config\.yaml.*\broot\b" skills/epic-*/SKILL.md` → sin salida | AC-4 |
| 6 | Búsqueda de épicas acotada | `grep -n "specs/flow/EPIC-\*/epic.md"` en `epic-analyze`, `epic-format-validation`, `epic-generate-stories`, `epic-generate-all-stories`, `epic-creation` | AC-1, AC-2, AC-3 |
| 7 | Archivadas como hijas | `grep -n "specs/flow/archive/\*-STORY-\*/story.md"` y `"specs/flow/archive/\*-<STORY-NNN>-\*/story.md"` en `epic-analyze/SKILL.md` | AC-3 |
| 8 | Numeración con archivadas | `grep -n "specs/flow/archive/"` en el Paso 2b de `epic-generate-stories`; fila «saltada (archivada)» en generate-stories y generate-all-stories | AC-2, CNF-2 |
| 9 | Evals válidos y con casos nuevos | `node -e` parsea los seis `evals.json`; `npm run test:eval -- epic-analyze --dry-run` (y creation, generate-stories) sin error; casos `historia-archivada-cuenta-como-hija`, `repo-limpio-escribe-en-specs-flow`, `max-id-incluye-archivadas` presentes | CNF-1, AC-1, AC-2, AC-3 |
| 10 | Pruebas verdes | `npm test` → exit 0 | AC-4 |
| 11 | Alcance acotado | `git diff --stat` solo muestra los archivos de «Componentes afectados» más artefactos de la historia | Non-Goals |
| 12 | Ejecución real de evals (a criterio humano) | `npm run test:eval -- epic-analyze`, `-- epic-creation`, `-- epic-generate-stories` | AC-1, AC-2, AC-3 |

## Risks / Trade-offs

- **[Riesgo] Precondición: STORY-148 sin implementar** (`scripts/verify-fixed-layout.js` no existe) y ADR-0016 (STORY-147) no creado → implementar STORY-151 solo con ambas en `DONE`; la primera tarea lo comprueba. Sin el validador D-8 no tiene lista que editar.
- **[Riesgo] Dogfooding en transición:** los skills fuente apuntan a `specs/flow/` mientras los work items de este repo siguen en `docs/specs/` hasta STORY-153 → no reinstalar las copias de runtime (`.claude/`, ignorado por git) antes de STORY-153. Registrar la advertencia en `implement-report.md`.
- **[Trade-off] Repos instalados sin migrar:** un proyecto con `docs/specs/epics/` verá «no se encontró la épica … `specs/flow/…`» → comportamiento coherente con ADR-0016; la mitigación es de STORY-149, STORY-152 y STORY-154 (versión mayor).
- **[Riesgo] Volumen de `epic-analyze/evals.json` (125 coincidencias en 28 casos):** una sustitución manual puede dejar rutas o romper el JSON → contratos 1, 2 y 9; preferir reemplazo mecánico de los prefijos `docs/specs/epics/` y `docs/specs/stories/` por `specs/flow/` con revisión del diff.
- **[Riesgo] `epic-refine` puede llegar a `skills/` con el contrato v1** (su propuesta en `.temp/` cita `SPECS_BASE`) → el gate de STORY-148 rechaza un skill nuevo no conforme fuera de `PENDING_MIGRATION`; CR-001.
- **[Limitación] R2–R4 no prueban la prosa:** contratos 1, 2, 6, 7 y 8 cubren las rutas por grep.

## Open Questions

Ninguna: el alcance de `epic-refine` queda decidido en CR-001; la numeración con archivadas en D-5 y la regeneración de archivadas en D-6.

## Autoevaluación (P9, P10)

- **Omisiones:** AC-1 (D-2, D-3, D-5, D-7, D-9; F-1; contratos 2, 6), AC-2 (D-2, D-3, D-5, D-6, D-9; F-2; contratos 6, 8), AC-3 (D-3, D-4, D-9; F-3; contratos 6, 7), AC-4 (D-1, D-2, D-8; F-4; contratos 1, 3, 4, 5), CNF-1 (D-2, D-9; contrato 9), CNF-2 (D-5, D-6; contrato 8). Los seis skills, sus `README.md`, `examples/` y `evals/` están revisados; `assets/` verificados sin rutas legadas.
- **Ambigüedad:** «el máximo ID se calcula sobre … y las épicas de `specs/flow/`» operacionalizado como Fuentes A (activas ∪ archivadas) y B (IDs en `epic.md`); «cuentan como hijas» como inventario e ID listado resuelto en ambos orígenes; «sin referencias legadas» como grep sobre el directorio completo del skill.
- **Nombres:** «contrato de layout fijo», «lista transitoria» / `PENDING_MIGRATION`, «historia archivada», «directorio plano» se usan como en STORY-148, STORY-150 y la épica; las rutas siempre como literales relativos a `REPO_ROOT`.
- **Estructura:** sin componentes nuevos; los skills dependen del contrato y de las rutas fijas, no entre sí, salvo las delegaciones existentes (`epic-generate-all-stories` → flujo de `epic-generate-stories`; `epic-from-project-plan` → `epic-format-validation`), sin ciclos. Sin código de implementación (el bloque es contenido Markdown del contrato).

## Registro de Cambios (CR)

### CR-001
- **Tipo**: inviabilidad
- **Descripción**: la nota «Ampliación de alcance (2026-10-22)» de story.md incluye `epic-refine` y afirma que su `SKILL.md` resuelve `SPECS_BASE` y que sus evals usan `docs/specs/epics/`. `skills/epic-refine/` **no existe**: solo hay una propuesta sin versionar en `.temp/propuestas-de-mejoras/epic-refine/` (fuera de `skills/`, de `package.json › files` y de los 36 skills de `PENDING_MIGRATION`). Migrar un skill inexistente no es implementable, y crearlo es un Non-Goal («Crear `epic-specify`, `epic-plan` o `epic-implement`, que no existen hoy» por extensión).
- **Documento afectado**: story.md (Notas), design.md (Non-Goals, Riesgos)
- **Acción requerida**: el diseño migra solo los seis skills existentes. Si `skills/epic-refine/` existe al iniciar la implementación, se le aplican D-1, D-2, D-3, D-8 y D-9 en la misma historia (retirándolo de `PENDING_MIGRATION` si figura) y se registra en `implement-report.md`; si no existe, se deja constancia y, cuando se cree, nacerá con el contrato de layout fijo (el gate lo exige porque no estará en la lista transitoria). Opcional: corregir la nota de story.md para no afirmar que el skill existe.

### CR-002
- **Tipo**: dependencia
- **Descripción**: la historia depende de STORY-148, pero también de que `scripts/verify-fixed-layout.js` exista con `PENDING_MIGRATION` (D-8) y de ADR-0016 (STORY-147), citado en el bloque canónico. Ninguno existe a 2026-10-22.
- **Documento afectado**: story.md (Notas: «Depende de STORY-148»)
- **Acción requerida**: implementar STORY-151 solo con STORY-147 y STORY-148 en `DONE`; el retiro de los seis skills de `PENDING_MIGRATION` forma parte del alcance.

### CR-003
- **Tipo**: ambigüedad
- **Descripción**: AC-2 y CNF-2 fijan la numeración, pero no qué ocurre cuando una línea F2/F3 del índice apunta a una historia ya archivada: con la detección de conflictos actual (solo `specs/flow/STORY-*`) `epic-generate-stories` la recrearía como activa, duplicando el ID.
- **Documento afectado**: story.md (CNF-2), design.md (D-6)
- **Acción requerida**: el diseño decide saltarla sin preguntar con el estado «saltada (archivada)» (D-6). Opcional: añadir a CNF-2 «ni se recrea una historia archivada».
