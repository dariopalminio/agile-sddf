---
type: analyze
id: STORY-118
slug: STORY-118-analyze-report
title: "Analyze: Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en requirements/"
story: STORY-118
design: STORY-118
tasks: STORY-118
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-118-requirements-srs-unico-primero
---

<!-- Referencias -->
[[STORY-118-requirements-srs-unico-primero]] · [[STORY-118-requirements-srs-unico-primero-design]] · [[STORY-118-requirements-srs-unico-primero-tasks]]

# Reporte de Coherencia: Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en requirements/

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 9/9 criterios cubiertos |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no está presente |
| Alineación tareas → diseño | ✓ | 45/45 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 33/33 elementos con tarea (14 componentes, 14 interfaces de `requirements.js` y 5 cambios de interfaz del motor) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | La historia está listada y su objetivo está alineado. SMOKE-1 de la épica contradice AC-3 (INC-001), y CR-004 sigue abierto (INC-002) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ (`enforcement: error`) |

**Estado general:** ⚠️ Advertencias. Hay 0 ERRORES y 2 WARNINGS, así que nada bloquea la transición a `READY-FOR-IMPLEMENT/DONE`.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `docs/requirements/README.md` documenta las dos disposiciones, el umbral, el resolver y las migraciones | ✓ | Goals (`// satisface: AC-1`); D-10, fila `docs/requirements/README.md`; Componentes "README de requisitos" (semilla y docs); Contrato #1 |
| AC-2 | `docs/templates/srs-template.md` con frontmatter, ejemplos FR/NFR, comentarios de umbral y no-renumerar, sin implementación | ✓ | D-6 (tabla de bloques y `renderSrs`); Componentes "Template SRS (semilla/dogfood)"; Contrato #2 |
| AC-3 | `scaffold` crea solo `srs-<project-slug>.md`, sin `functional/` ni `non-functional/`, y pasa `check` | ✓ | D-3 (pasos 1–5); D-6 (ejemplos comentados → 0 secciones visibles); interfaz `scaffoldSrs`; F-1; Contratos #3 y #4 |
| AC-4 | Resolver archivo → sección → error, en las dos disposiciones | ✓ | D-5 (`resolveRequirement`, alias en `slugSetOf`, `parseIdList`); D-2 (inventario); D-9 (`implements:` no resuelve); Contratos #5 y #6 |
| AC-5 | `migrate --from=srs-single` extrae los fragmentos, crea `index.md`, conserva los wikilinks, sin pérdidas e idempotente | ✓ | D-7 (pasos 1–6); D-4 (catálogo); F-2; Contratos #7, #8, #9 y #11 |
| AC-6 | `migrate --from=requirements-fragmented` consolida en el SRS, elimina `index.md` y es idempotente | ✓ | D-8 (pasos 1–5, inversa exacta de D-7); F-4; Contratos #9, #10 y #11 |
| AC-7 | `check` valida las dos disposiciones (IDs únicos, `implements`, `index.md` completo, frontmatter de fragmento) | ✓ | D-9 (familia `requirement`, tabla de reglas por disposición); D-4; Contrato #12 |
| AC-8 | La documentación canónica (`architecture/memory-system.md`, `domain-knowledge-artifacts.md`, `sddf-commands-pipeline.md`) y el `CHANGELOG.md` están actualizados | ✓ | D-10 (filas por artefacto); Componentes "Documentación canónica"; Contrato #14 |
| AC-9 | Un proyecto fragmentado existente funciona sin migrar | ✓ | D-3 (paso 2: `[PRESERVADO]`); D-5; D-9 (un solo problema accionable); F-3; CR-003; Contrato #13 |

Cobertura de los CNF: CNF-1 y CNF-2 (D-7, D-8 y Contrato #8), CNF-3 (D-3 y F-3), CNF-4 (D-5, "Carga mínima"), CNF-5 (D-3 `slugify` y Contrato #16) y CNF-6 (D-1 y CR-002, que sustituye `fs-extra` por `node:fs`).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base: pruebas, verificadores, `MIGRATE_SOURCES`/`CHECK_KINDS`/`MIGRATORS`, último TC y secuencia 3.N, estado de `docs/requirements/` | D-1, D-11, Risks, CR-005 | ✓ |
| T002 | Crear la semilla `assets/scaffold/templates/srs-template.md` | D-6; Componente "Template SRS (semilla)" | ✓ |
| T003 | Copiar byte a byte `docs/templates/srs-template.md` | D-6, D-10; Componente "Template SRS (dogfood)" | ✓ |
| T004 | Añadir `srs-template.md` a los dos README de plantillas y ajustar los recuentos | D-10; Componente "README de plantillas" | ✓ |
| T005 | Fixture `examples/srs-single/` | D-11; Componente "Fixtures" | ✓ |
| T006 | Fixture `examples/requirements-fragmented/` | D-11, D-4, D-7 | ✓ |
| T007 | Fixture `examples/requirements-legacy/` | D-11 (AC-9) | ✓ |
| T008 | Fixture `examples/requirements-mixed/` | D-11, D-2 | ✓ |
| T009 | Esqueleto de `requirements.js` con `engine()` y `REQUIREMENT_ID` | D-1; interfaz `REQUIREMENT_ID` | ✓ |
| T010 | `slugify`, `projectSlug`, `parseIdList` | D-3, D-5; interfaces homónimas | ✓ |
| T011 | `inventoryRequirements` y `layout` | D-2; interfaz `inventoryRequirements` | ✓ |
| T012 | `resolveRequirement`, `requirementAliases` | D-5; interfaces homónimas | ✓ |
| T013 | `renderSrs`, `scaffoldSrs` | D-3, D-6; interfaces homónimas | ✓ |
| T014 | `renderCatalog`, `writeCatalog` | D-4; interfaces homónimas | ✓ |
| T015 | `requirementProblems` | D-9; interfaz `requirementProblems` | ✓ |
| T016 | Utilidades internas `rewriteRequirementLinks` y formateador del informe | D-7 (pasos 5 y salida), D-8 (paso 4) | ✓ |
| T017 | Plan de `migrateSrsSingle` (pasos 1–3) | D-7; interfaz `migrateSrsSingle` | ✓ |
| T018 | Escritura de `migrateSrsSingle` (pasos 4–6), todo o nada | D-7, F-5 | ✓ |
| T019 | Plan de `migrateFragmented` (pasos 1–3) | D-8; interfaz `migrateFragmented` | ✓ |
| T020 | Escritura de `migrateFragmented` (pasos 4–5) | D-8, F-4, F-5 | ✓ |
| T021 | `MIGRATE_SOURCES`, `MIGRATORS`, `USAGE` | D-1; interfaces `MIGRATE_SOURCES`, `MIGRATORS[from]`, CLI | ✓ |
| T022 | `CHECK_KINDS`/`EVALUATORS`, `ctx.requirements`, `slugSetOf(nodes, aliases)` | D-5, D-9; interfaces `slugSetOf`, `CHECK_KINDS / EVALUATORS` | ✓ |
| T023 | `scaffold` → `scaffoldSrs`; `runIndex` → `writeCatalog` | D-3, D-4; Componente "Motor (registro)" | ✓ |
| T024 | `test/requirements.test.js`, pruebas `S118-UT-*` | D-11; Contratos #5 y #16 | ✓ |
| T025 | `S118-IT-*` de scaffold y S096-UT-001c | D-11; Contratos #2, #3 y #4 | ✓ |
| T026 | `S118-IT-*` de `srs-single` | D-11; Contratos #7 y #8 | ✓ |
| T027 | `S118-IT-*` de `requirements-fragmented` y de ida y vuelta | D-11; Contratos #8, #9 y #10 | ✓ |
| T028 | `S118-IT-*` de fallo seguro | D-11; Contrato #11 | ✓ |
| T029 | `S118-IT-*` de `check` | D-11, D-9; Contratos #6, #12 y #13 | ✓ |
| T030 | Prueba de BOM, `\n` y guion U+002D; regresión de `dod-monolithic` y `epic-template-v1` | D-11; Contrato #16 | ✓ |
| T031 | Evals TC-NNN nuevos, TC-007 y `version` | D-11; Componente "Evals" | ✓ |
| T032 | `skills/memory-system/SKILL.md` (modos, familia, excepción de eliminación) | D-10, CR-006; Componente "Skill" | ✓ |
| T033 | `references/memory-rules.md` (§5, §7, §9) y `skills/memory-system/README.md` | D-10, F-5; Componentes "Reglas" y "Skill" | ✓ |
| T034 | `docs/requirements/README.md` | D-10, CR-001; Componente "README de requisitos" | ✓ |
| T035 | README semilla de `requirements/` | D-10; Componente "README de requisitos (semilla)" | ✓ |
| T036 | `docs/architecture/memory-system.md` | D-10; Componente "Documentación canónica" | ✓ |
| T037 | `docs/domains/domain-knowledge-artifacts.md` | D-10; Componente "Documentación canónica" | ✓ |
| T038 | `sddf-commands-pipeline.md` y `README.md` (raíz) | D-10; Componente "Documentación canónica" | ✓ |
| T039 | `CHANGELOG.md` `[Unreleased]` | D-10; Componente "Documentación canónica" | ✓ |
| T040 | `npm test` comparado con la línea base | Contratos de verificación #3–#13 y #15 | ✓ |
| T041 | Evals: JSON válido, `verify:eval-inventory`, `test:eval -- memory-system` | Contrato #15; D-11 | ✓ |
| T042 | `verify:repository`, `verify:links`, `verify:syntax`, `audit-root-resolution`, BOM y dependencias | Contratos #15 y #16 | ✓ |
| T043 | Grep de los contratos documentales | Contratos #1, #2 y #14 | ✓ |
| T044 | Validación manual de F-1…F-4 | Flujos clave F-1…F-4 | ✓ |
| T045 | Riesgo de dogfood: `layout` de `docs/requirements/` antes de `ensure` | Risks (primera fila); Componente "Catálogo de este repo" | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Módulo de requisitos `requirements.js` | Componentes y archivos | T009–T020 | ✓ |
| Motor (registro) `memory-system.js` | Componentes y archivos | T021–T023 | ✓ |
| Template SRS (semilla) | Componentes y archivos | T002 | ✓ |
| Template SRS (dogfood) | Componentes y archivos | T003 | ✓ |
| README de requisitos (semilla) | Componentes y archivos | T035 | ✓ |
| README de requisitos (`docs/`) | Componentes y archivos | T034 | ✓ |
| README de plantillas (semilla y `docs/`) | Componentes y archivos | T004 | ✓ |
| Skill (`SKILL.md`, `README.md`) | Componentes y archivos | T032, T033 | ✓ |
| Reglas `memory-rules.md` | Componentes y archivos | T033 | ✓ |
| Documentación canónica | Componentes y archivos | T036–T039 | ✓ |
| Fixtures (4 directorios) | Componentes y archivos | T005–T008 | ✓ |
| Pruebas | Componentes y archivos | T024–T030 | ✓ |
| Evals | Componentes y archivos | T031 | ✓ |
| Catálogo de este repo `docs/requirements/index.md` | Componentes y archivos | T045 | ✓ |
| `REQUIREMENT_ID` | Interfaces (`requirements.js`) | T009 | ✓ |
| `slugify` / `projectSlug` / `parseIdList` | Interfaces (`requirements.js`) | T010 | ✓ |
| `inventoryRequirements` | Interfaces (`requirements.js`) | T011 | ✓ |
| `resolveRequirement` / `requirementAliases` | Interfaces (`requirements.js`) | T012 | ✓ |
| `renderSrs` / `scaffoldSrs` | Interfaces (`requirements.js`) | T013 | ✓ |
| `renderCatalog` / `writeCatalog` | Interfaces (`requirements.js`) | T014 | ✓ |
| `requirementProblems` | Interfaces (`requirements.js`) | T015 | ✓ |
| `migrateSrsSingle` | Interfaces (`requirements.js`) | T016–T018 | ✓ |
| `migrateFragmented` | Interfaces (`requirements.js`) | T016, T019, T020 | ✓ |
| `slugSetOf(nodes, aliases)` | Interfaces (motor) | T022 | ✓ |
| `MIGRATE_SOURCES` / `MIGRATORS[from]` / CLI | Interfaces (motor) | T021 | ✓ |
| `CHECK_KINDS` / `EVALUATORS` | Interfaces (motor) | T022 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias: "**STORY-118** — Adoptar la estrategia 'SRS único primero, fragmentación cuando duela' en `requirements/`" |
| Objetivo de la historia alineado con la épica | ✓ | El objetivo de la historia es evitar la fragmentación prematura sin perder escalabilidad. Está alineado con el criterio de salida "`docs/requirements/` contiene `functional/` y `non-functional/` poblados **o un documento srs**" |
| Restricciones de la épica respetadas | ⚠️ | SMOKE-1 de la épica espera que `scaffold` cree `docs/requirements/{functional,non-functional}/`, pero AC-3 y D-3 lo prohíben (INC-001). Las historias hermanas STORY-110 y STORY-114 escriben siempre fragmentos, en tensión con la estrategia (CR-004, INC-002). |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D, desalineación con la épica.
- **Descripción:** SMOKE-1 de la épica dice: "Entonces … se crean `docs/requirements/{functional,non-functional}/`". AC-3 de la historia dice: "NO se crean las carpetas `functional/` ni `non-functional/` vacías", y D-3 de design.md dice: "No se crean `functional/` ni `non-functional/` en ningún modo de `scaffold`". Cuando STORY-118 esté implementada, SMOKE-1 fallará tal como está redactado.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-21-colapsar-specs-dos-niveles/epic.md`, sección "Smoke tests › SMOKE-1". Contraparte en `story.md`, AC-3, y en `design.md`, D-3.
- **Acción requerida:** cambiar SMOKE-1 a "se crea `docs/requirements/srs-<project-slug>.md` y NO se crean `functional/` ni `non-functional/`". Coordinar con STORY-115, que define el árbol semilla de la épica.

### INC-002 [WARNING]

- **Tipo:** D, desalineación con la épica.
- **Descripción:** en la lista de historias de la épica, STORY-110 escribe "un archivo por FR/NFR" y STORY-114 migra a disposición fragmentada. Por eso todo proyecto que pase por `/project-discovery` queda fragmentado aunque tenga pocos requisitos, en contra de "SRS único primero". El diseño lo tolera, porque D-2 ignora un SRS sin secciones visibles, y lo registra en CR-004 sin historia asignada.
- **Archivo afectado:** `docs/specs/03-stories/STORY-118-requirements-srs-unico-primero/design.md`, sección "Registro de Cambios (CR) › CR-004"; `epic.md`, sección "Historias", entradas STORY-110 y STORY-114.
- **Acción requerida:** crear en EPIC-21 (o en una épica posterior) una historia para que los escritores de requisitos añadan `### FR-NNN` al SRS cuando `layout ∈ {empty, srs}` y no se supere el umbral, o registrar en la épica que se acepta esa desviación.

---

## Recomendaciones

1. **INC-001:** editar `epic.md` › SMOKE-1 para que el scaffolding de `requirements/` diga "crea `srs-<project-slug>.md`, no crea `functional/`/`non-functional/`". Hacerlo antes de cerrar STORY-115 y STORY-117, para que la verificación de cierre no falle por esta contradicción.
2. **INC-002:** decidir el destino de CR-004. Se puede abrir una historia de seguimiento (los escritores de discovery, reverse-engineering y `specs-3-levels` respetan el modo SRS) o documentar en `epic.md` › Notas que se acepta la desviación de forma temporal.
3. **Observación (CR pendientes en story.md, sin tipo):** aplicar en `story.md` las recomendaciones de design.md:
   - CR-002: CNF-6 → "solo módulos nativos de Node, sin dependencias nuevas", en lugar de `fs-extra`.
   - CR-003: precisar en AC-9 que `check` informa un único problema, el catálogo, que se corrige con `/memory-system index` sin migrar.
   - CR-005: en la fila `requirement-template.md` del mapa de implementación, indicar que lo crea STORY-110.
4. **Observación (story.md › "Notas / mapa de implementación"):** la fila `.claude/skills/memory-system/SKILL.md` debe ser `skills/memory-system/SKILL.md`, porque `skills/` es la fuente única según AGENTS.md. design.md y tasks.md ya usan la ruta correcta.
5. **Observación (story.md › frontmatter `related`):** `STORY-XXX-epic-template-minimalista` es un placeholder sin resolver. Según la épica corresponde a STORY-103; corregirlo en el próximo refinamiento.
6. **Observación (dogfood):** este repositorio queda con `check` en rojo (falta el catálogo) si STORY-105 se implementa antes que T045. Ejecutar T045 antes de dar la historia por verificada, porque el criterio de salida de la épica exige `memory-system check` con exit 0.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no está presente, así que la cobertura de pruebas no se evaluó. Las pruebas están especificadas como tareas (T024–T030) y como "Contratos de verificación" (#1–#16) en design.md.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-118` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-118` (disponible) |

---

## Cumplimiento DoD — Fase PLAN

DoD cargado: `docs/guardrails/dod-story-plan.md` (`sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1…AC-9 en bloques `gherkin` con Dado/Cuando/Entonces; AC-4 y AC-7 tienen varios escenarios |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | 9/9 ACs cubiertos (ver "Cobertura de Criterios de Aceptación") |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-11 llevan `// satisface: AC-N`; las tablas de Componentes e Interfaces tienen la columna "AC que satisface"; los Contratos tienen "AC origen" |
| No hay decisiones de arquitectura aplazadas; toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: Ninguna"; las ambigüedades y dependencias están registradas en CR-001…CR-006 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (45 tareas) |
| Si tasks.md existe, contiene solo tareas atómicas para todos los escenarios principales | ✓ | — | Cada tarea toca un archivo o una función acotada; los AC-1…AC-9 y CNF-1…CNF-6 tienen tareas (T034/T043 → AC-1; T002–T004 → AC-2; T013/T023/T025 → AC-3; T012/T022/T029 → AC-4; T017/T018/T026 → AC-5; T019/T020/T027 → AC-6; T015/T029 → AC-7; T036–T039 → AC-8; T007/T029/T045 → AC-9) |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe y la condición no se activa |
