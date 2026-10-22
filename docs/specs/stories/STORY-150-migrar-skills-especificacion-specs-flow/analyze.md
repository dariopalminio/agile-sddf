---
type: analyze
id: STORY-150
slug: STORY-150-analyze-report
title: "Analyze: Migrar los skills de especificación a specs/flow"
story: STORY-150
design: STORY-150
tasks: STORY-150
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-150-migrar-skills-especificacion-specs-flow
---

<!-- Referencias -->
[[STORY-150-migrar-skills-especificacion-specs-flow]]

# Reporte de Coherencia: Migrar los skills de especificación a specs/flow

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D, E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada — testcases.md no presente (`--only-tasks`) |
| Alineación tareas → diseño | ✓ | 22/22 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 componentes y 7/7 interfaces con tarea |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ⚠️ | alineada; alcance declarado en story.md menor que el del diseño (INC-002) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓, 1 ⚠️ (INC-001) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `/story-specify` en un repo limpio crea `specs/flow/STORY-001-<slug>/story.md` y no `docs/specs/stories/` | ✓ | D-1, D-2, D-4 (numeración → `001`), D-5 (crea `specs/flow/`), D-8 (TC-003 de specify reemplazado, TC-001 con `not_contains: docs/specs`); F-1; contratos #2, #9 |
| AC-2 | `/story-evaluation STORY-999` informa que no existe en `specs/flow/` sin buscar ni crear en `docs/specs/` | ✓ | D-3 (resolución sin fallback y mensaje con `specs/flow/`), D-8 (TC-009 de evaluation); F-2; contrato #8 |
| AC-3 | grep `SPECS_BASE\|SDDF_ROOT` vacío sobre los skills y sus `assets/agents/`; `verify:repository` verde | ✓ | D-1, D-2, D-6 (retiro de `PENDING_MIGRATION`), D-7 (E2E-002); F-3; contratos #1, #3, #4, #5, #7 |
| CNF-1 | Evals con rutas `specs/flow/`; ejecución a criterio humano | ✓ | D-2, D-8; contrato #6 (estructura y `--dry-run`), #11 (ejecución humana) |
| CNF-2 | Skills migrados declaran el contrato de STORY-148 | ✓ | D-1 (bloque canónico), D-6; contrato #3 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones (ADR-0016, `verify-fixed-layout.js` con las seis entradas) | Risks (precondición), CR-003 | ✓ |
| T002 | Línea base `npm test` / `verify:repository` e inventario grep | Context, D-2 | ✓ |
| T003 | Retirar seis entradas de `PENDING_MIGRATION` y confirmar RED | D-6 | ✓ |
| T004 | Ajustar E2E-002 de `test/dod-story.test.js` | D-7, CR-002 | ✓ |
| T005 | Migrar `story-creation/SKILL.md` | D-1, D-2, D-3, D-4, D-5 | ✓ |
| T006 | Migrar `story-evaluation/SKILL.md` | D-1, D-2, D-3 | ✓ (ver INC-001) |
| T007 | Migrar `story-refine/SKILL.md` | D-1, D-2, D-3 | ✓ |
| T008 | Migrar `story-improve/SKILL.md` | D-1 | ✓ |
| T009 | Migrar `story-split/SKILL.md` | D-1, D-2, D-3, D-4 | ✓ |
| T010 | Migrar `story-specify/SKILL.md` | D-1, D-2, D-3, D-5 | ✓ |
| T011 | READMEs de creation y specify | D-2 | ✓ |
| T012 | Rol local `product-owner.md` | D-2 | ✓ |
| T013 | Ejemplo `split-result.md` | D-2 | ✓ |
| T014 | Evals de specify (TC-001/002/008, TC-003 reemplazado) | D-8 | ✓ |
| T015 | Evals de evaluation (TC-001/002, TC-009 nuevo) | D-8 | ✓ |
| T016 | Evals de refine (TC-003) | D-8 | ✓ |
| T017 | `npm run verify:layout` en verde | D-6, contrato #4 | ✓ |
| T018 | Greps de contratos #1–#3, #7–#9 | Contratos de verificación | ✓ |
| T019 | Validar JSON de evals y `--dry-run` | D-8, contrato #6 | ✓ |
| T020 | `npm test` y `verify:repository` | Contratos #4, #5 | ✓ |
| T021 | Revisión de alcance con `git diff --stat` | Contrato #10, Non-Goals | ✓ |
| T022 | `graphify update .` e `implement-report.md` (dogfooding, evals humanos) | Risks, contrato #11 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill de creación (`SKILL.md`, `README.md`) | Componentes afectados | T005, T011 | ✓ |
| Skill de evaluación FINVEST | Componentes afectados | T006 | ✓ |
| Evals de evaluación | Componentes afectados | T015 | ✓ |
| Skill de refinamiento | Componentes afectados | T007 | ✓ |
| Evals de refinamiento | Componentes afectados | T016 | ✓ |
| Alias deprecado `story-improve` | Componentes afectados | T008 | ✓ |
| Skill de split | Componentes afectados | T009 | ✓ |
| Ejemplo de split | Componentes afectados | T013 | ✓ |
| Orquestador de especificación (`SKILL.md`, `README.md`) | Componentes afectados | T010, T011 | ✓ |
| Rol local Product Owner | Componentes afectados | T012 | ✓ |
| Evals de especificación | Componentes afectados | T014 | ✓ |
| Lista transitoria del gate (`PENDING_MIGRATION`) | Componentes afectados | T003, T017 | ✓ |
| Prueba E2E-002 del DoD | Componentes afectados | T004, T020 | ✓ |
| Paso 0 de cada skill (bloque canónico) | Interfaces | T005–T010, T018 | ✓ |
| Directorio de una historia `specs/flow/STORY-NNN-<slug>/` | Interfaces | T005, T007, T009, T010 | ✓ |
| Resolución por ID y mensaje de no encontrada | Interfaces | T005, T006, T007, T009, T018 | ✓ |
| Siguiente NNN con `archive/` | Interfaces | T005, T009, T018 | ✓ |
| Template de historia `docs/templates/` | Interfaces | T005, T006, T009 | ✓ |
| DoD de especificación `docs/guardrails/` | Interfaces | T010 | ✓ |
| Gate R1–R4 | Interfaces | T003, T017, T020 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias` › STORY-150 «Migrar los skills de especificación a specs/flow» con los mismos seis skills y «se actualizan sus evals» |
| Objetivo de la historia alineado con la épica | ✓ | Cubre la parte de especificación de CS-2 (grep vacío) y CS-3 (sin lectura de `root`), SMOKE-1 (`specs/flow/STORY-001-<slug>/story.md`) y contribuye a CS-12 |
| Restricciones de la épica respetadas | ⚠️ | Conserva el slug (ADR-0004 / Notas «Nombre de directorio»), no busca en `archive/` para leer historias y no crea scripts de archivado (CS-11). La precondición real incluye STORY-147, STORY-148 (validador) y, para el «repo limpio inicializado con `/sddf-init`» de AC-1, STORY-149; story.md solo declara STORY-148 (INC-002) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E
- **Descripción:** el diseño ubica mal dos puntos de `story-evaluation`. D-1 indica que el bloque v1 está bajo `### Paso 0 — Resolver contexto local` («ídem»), pero en `skills/story-evaluation/SKILL.md` está bajo `## Contexto de ejecución` (l. 84). D-3 y T006 dicen «añadir al Paso 1 la resolución por ID», pero el Paso 1 de ese skill es `### Paso 1 — Leer template canónico` (l. 100) y no existe un paso de entrada; la evaluación empieza en `### Paso 2 — Evaluar F (Formato)` (l. 115). La decisión de fondo (resolver y detener antes de evaluar) está tomada; solo la ubicación queda ambigua. Por la regla de duda, el criterio DoD «No hay decisiones de arquitectura aplazadas» se marca ⚠️.
- **Archivo afectado:** `design.md` — sección «D-1» (tabla, fila `story-evaluation`) y «D-3» (viñeta de `story-evaluation`); `tasks.md` — T006
- **Acción requerida:** precisar que en `story-evaluation` el bloque canónico sustituye el contenido de `## Contexto de ejecución` (conservando el encabezado) y que la resolución por ID se añade al final de esa sección o como paso propio antes de `### Paso 2 — Evaluar F`, sin renumerar el resto.

### INC-002 [WARNING]

- **Tipo:** D
- **Descripción:** el alcance y las dependencias de story.md no reflejan los del diseño. `## 📎 Notas` limita el alcance a los seis skills «más sus `assets/agents/` y `evals/evals.json`» y declara solo la dependencia de STORY-148, mientras que el diseño modifica `scripts/verify-fixed-layout.js` (D-6) y `test/dod-story.test.js` (D-7) y exige STORY-147 (ADR-0016 citado en el bloque canónico). AC-1 parte de «un repositorio limpio inicializado con `/sddf-init`», que en su forma nueva es STORY-149. Los CR-002 y CR-003 del diseño ya lo registran.
- **Archivo afectado:** `story.md` — sección «📎 Notas / contexto adicional» (párrafo «Alcance» y «Depende de STORY-148»)
- **Acción requerida:** aplicar CR-002 y CR-003 en story.md (añadir los dos archivos al alcance y STORY-147 a las dependencias) y aclarar que AC-1 no requiere STORY-149, porque D-5 crea `specs/flow/` si falta; opcionalmente aplicar CR-001 (precisar que el Non-Goal de `archive/` es para lectura, no para numerar).

---

## Recomendaciones

1. **INC-001:** en `design.md` › D-1, cambiar la fila `story-evaluation` a «Encabezado que se conserva: `## Contexto de ejecución`»; en D-3 y en `tasks.md` › T006, sustituir «al Paso 1 de entrada» por «al final de `## Contexto de ejecución` (antes de `### Paso 1 — Leer template canónico`)». Se puede aplicar con `/story-fix-plan STORY-150` o durante T006.
2. **INC-002:** en `story.md` › Notas, ampliar el alcance con `scripts/verify-fixed-layout.js` (`PENDING_MIGRATION`) y `test/dod-story.test.js` (E2E-002), y declarar «Depende de STORY-147 y STORY-148». No cambia los ACs.
3. **Ejecución:** respetar T001; STORY-147 y STORY-148 siguen en planificación a 2026-10-22, así que la historia no es implementable todavía aunque el plan esté aprobado.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline ejecutado con `--only-tasks`). Las verificaciones de AC-1 y AC-2 recaen en los evals de D-8 (ejecución a criterio humano) y en los greps de T018.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-150` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-150` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 y AC-3 (alternativos/error) en bloques `gherkin` Dado/Cuando/Entonces |
| design.md cubre todos los ACs con al menos un elemento por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación»: 3/3 + CNF-1/CNF-2 |
| Elementos de diseño con trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-8 con `// satisface:`; tablas de componentes e interfaces con columna «AC que satisface» |
| Sin decisiones de arquitectura aplazadas; ambigüedad resuelta o registrada como CR | ⚠️ | WARNING | Open Questions «Ninguna» y CR-001…CR-003; ubicación de la resolución por ID en `story-evaluation` inexacta (INC-001) |
| Existe tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| tasks.md contiene solo tareas atómicas para todos los escenarios principales | ✓ | — | 22 tareas, una por archivo o verificación; AC-1 → T005, T010, T014; AC-2 → T006, T015; AC-3 → T003, T004, T017–T020 |
| Si testcases.md existe, contiene pruebas para todos los escenarios | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
