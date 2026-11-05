---
type: analyze
id: STORY-151
slug: STORY-151-analyze-report
title: "Analyze: Migrar los skills de épica a specs/flow"
story: STORY-151
design: STORY-151
tasks: STORY-151
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-151-migrar-los-skills-de-epica-a-specs-flow
---

<!-- Referencias -->
[[STORY-151-migrar-los-skills-de-epica-a-specs-flow]]

# Reporte de Coherencia: Migrar los skills de épica a specs/flow

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo C, D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos (más CNF-1 y CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada — testcases.md no presente (`--only-tasks`) |
| Alineación tareas → diseño | ✓ | 24/24 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 13/13 componentes y 10/10 interfaces con tarea; un uso de `$EPICS_DIR` sin tarea (INC-001) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ⚠️ | alineada; `epic-refine` condicionado por CR-001 y dependencias de story.md incompletas (INC-002) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `/epic-creation` en un repo limpio crea `specs/flow/EPIC-01-<slug>/epic.md` y no `docs/specs/epics/` | ✓ | D-2, D-3, D-5 (numeración `EPIC-NN` → `EPIC-01`), D-7 (crea `specs/flow/`), D-9 (caso `repo-limpio-escribe-en-specs-flow`); F-1; contratos #2, #6 |
| AC-2 | `/epic-generate-stories EPIC-NN` crea historias en `specs/flow/STORY-NNN-<slug>/` con máximo ID sobre activas, archivadas y épicas | ✓ | D-3 (Formato A acotado a `EPIC-*`), D-5 (Fuentes A y B), D-6 (archivadas saltadas), D-7, D-9 (caso `max-id-incluye-archivadas`); F-2; contratos #6, #8 |
| AC-3 | `/epic-analyze EPIC-NN` cuenta las historias de `specs/flow/archive/` como hijas, sin huérfanas ni faltantes | ✓ | D-4 (inventario y resolución de IDs en ambos orígenes, `related`), D-3, D-9 (caso `historia-archivada-cuenta-como-hija`); F-3; contrato #7 |
| AC-4 | grep `SPECS_BASE\|SDDF_ROOT` sobre `skills/epic-*` sin coincidencias | ✓ | D-1 (bloque canónico), D-2 (mapa sobre SKILL, README, examples, evals), D-8 (retiro de `PENDING_MIGRATION`), D-9 (claves `env`/`sddf_config_root` eliminadas); F-4; contratos #1, #3, #4, #5 |
| CNF-1 | Evals con rutas `specs/flow/`; ejecución a criterio humano | ✓ | D-2, D-9; contratos #9 (estructura y `--dry-run`), #12 (ejecución humana) |
| CNF-2 | Ningún `STORY-NNN` nuevo colisiona con uno archivado | ✓ | D-5 (Fuente A con `archive/`), D-6 (no se recrea una archivada); contrato #8 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones (ADR-0016, `verify-fixed-layout.js` con las seis entradas) | Risks (precondición), CR-002 | ✓ |
| T002 | Resolver el alcance de `epic-refine` | CR-001 | ✓ |
| T003 | Línea base `npm test` / `verify:repository` e inventario grep | Context, D-2 | ✓ |
| T004 | Retirar seis entradas de `PENDING_MIGRATION` y confirmar RED | D-8 | ✓ (ver Recomendación 3) |
| T005 | Migrar `epic-creation/SKILL.md` | D-1, D-2, D-5, D-7 | ✓ |
| T006 | Migrar `epic-format-validation/SKILL.md` | D-1, D-2, D-3 | ✓ |
| T007 | Migrar `epic-from-project-plan/SKILL.md` | D-1, D-2, D-5, D-7 | ✓ (ver INC-001) |
| T008 | Migrar `epic-generate-stories/SKILL.md` | D-1, D-2, D-3, D-5, D-7 | ✓ |
| T009 | Regla de archivadas en el conflicto de `epic-generate-stories` | D-6 | ✓ |
| T010 | Migrar `epic-generate-all-stories/SKILL.md` | D-1, D-2, D-3, D-6, D-7 | ✓ |
| T011 | Migrar `epic-analyze/SKILL.md` (Paso 0, entradas, resolución) | D-1, D-2, D-3 | ✓ |
| T012 | Migrar `epic-analyze/SKILL.md` (Vía B y `related`) | D-4 | ✓ |
| T013 | READMEs de creation, from-project-plan, generate-stories, generate-all-stories | D-2 | ✓ |
| T014 | Ejemplos de `epic-creation` | D-2 | ✓ |
| T015 | Evals de `epic-analyze` (fixtures, TC-002, caso AC-3) | D-9 | ✓ |
| T016 | Evals de `epic-creation` (TC-001, caso AC-1) | D-9 | ✓ |
| T017 | Evals de `epic-generate-stories` (contextos, caso AC-2) | D-9 | ✓ |
| T018 | Evals de generate-all-stories y format-validation; revisión de from-project-plan | D-9 | ✓ |
| T019 | `npm run verify:layout` en verde | D-8, contrato #4 | ✓ |
| T020 | Greps de contratos #1–#3, #5–#8 | Contratos de verificación | ✓ |
| T021 | Validar JSON de evals y `--dry-run` | D-9, contrato #9 | ✓ |
| T022 | `npm test` y `verify:repository` | Contratos #4, #10 | ✓ |
| T023 | Revisión de alcance con `git diff --stat` | Contrato #11, Non-Goals | ✓ |
| T024 | `graphify update .` e `implement-report.md` (epic-refine, dogfooding, evals humanos) | Risks, CR-001, contrato #12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Creación de épica (`SKILL.md`, `README.md`) | Componentes afectados | T005, T013 | ✓ |
| Ejemplos de creación | Componentes afectados | T014 | ✓ |
| Evals de creación | Componentes afectados | T016 | ✓ |
| Validación de formato | Componentes afectados | T006 | ✓ |
| Evals de validación | Componentes afectados | T018 | ✓ |
| Épicas desde el roadmap (`SKILL.md`, `README.md`) | Componentes afectados | T007, T013 | ⚠️ (INC-001) |
| Generación de historias (`SKILL.md`, `README.md`) | Componentes afectados | T008, T009, T013 | ✓ |
| Evals de generación | Componentes afectados | T017 | ✓ |
| Generación en batch (`SKILL.md`, `README.md`) | Componentes afectados | T010, T013 | ✓ |
| Evals de batch | Componentes afectados | T018 | ✓ |
| Análisis de épica | Componentes afectados | T011, T012 | ✓ |
| Evals de análisis | Componentes afectados | T015 | ✓ |
| Lista transitoria del gate (`PENDING_MIGRATION`) | Componentes afectados | T004, T019 | ✓ |
| Paso 0 de cada skill (bloque canónico) | Interfaces | T005–T008, T010, T011, T020 | ✓ |
| Directorio de una épica | Interfaces | T005, T007 | ✓ |
| Directorio de una historia (activa y archivada) | Interfaces | T008, T010, T012 | ✓ |
| Resolución de épica `specs/flow/EPIC-*/epic.md` | Interfaces | T006, T008, T010, T011, T020 | ✓ |
| Inventario de historias (activas ∪ archivadas) | Interfaces | T012, T020 | ✓ |
| Siguiente `STORY-NNN` | Interfaces | T008, T020 | ✓ |
| Siguiente `EPIC-NN` | Interfaces | T005, T007 | ✓ |
| Templates en `docs/templates/` con seeds por `CLI_ROOT` | Interfaces | T005–T008, T010, T011 | ✓ |
| Roadmap `docs/product/roadmap.md` | Interfaces | T007, T013 | ✓ |
| Gate R1–R4 | Interfaces | T004, T019, T022 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias` › STORY-151 «Migrar los skills de épica a specs/flow» (l. 26), con «la búsqueda de stories hijas cubre `specs/flow/` y `specs/flow/archive/`; se actualizan sus evals» |
| Objetivo de la historia alineado con la épica | ✓ | Cubre la parte de épicas de CS-2 (grep vacío) y CS-3 (sin lectura de `root`, R4), SMOKE-2 (`specs/flow/EPIC-01-<slug>/epic.md`) y contribuye a CS-12 |
| Restricciones de la épica respetadas | ⚠️ | Conserva el slug, no archiva épicas ni crea scripts de archivado (CS-11, Notas «Épicas»). La épica nombra `epic-refine`, que no existe en `skills/`; el diseño lo deja condicionado (CR-001, T002). story.md declara solo «Depende de STORY-148» (INC-002) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** C
- **Descripción:** D-2 decide sustituir `$EPICS_DIR` de `epic-from-project-plan` por el literal `specs/flow/`, pero T007 solo lo aplica a la Fase 2 (`skills/epic-from-project-plan/SKILL.md:52`). La variable vuelve a aparecer en la Fase 4 (l. 80: «Mostrar los archivos creados o saltados bajo `$EPICS_DIR`…»). Si se elimina su definición en la Fase 2, la l. 80 queda con una variable sin definir. No rompe el gate (`$EPICS_DIR` no es un token prohibido) ni AC-4.
- **Archivo afectado:** `tasks.md` — T007; `design.md` — sección «D-2» (fila `$SPECS_BASE/specs/epics/` y alternativa rechazada sobre `$EPICS_DIR`)
- **Acción requerida:** ampliar T007 a «toda aparición de `$EPICS_DIR` (Fases 2 y 4)».

### INC-002 [WARNING]

- **Tipo:** D
- **Descripción:** el alcance y las dependencias de story.md no coinciden con los del diseño ni con lo que existe en el repo. (1) La nota «Ampliación de alcance (2026-10-22)» afirma que `epic-refine` existe y resuelve `SPECS_BASE`, pero `skills/epic-refine/` no existe (solo `.temp/propuestas-de-mejoras/epic-refine/`, sin versionar); el diseño lo resuelve con una regla condicional (CR-001, T002). (2) story.md declara solo «Depende de STORY-148», mientras el diseño exige también STORY-147 (ADR-0016, citado en el bloque canónico) y modifica `scripts/verify-fixed-layout.js` (D-8) (CR-002). (3) La regla de no recrear historias archivadas (D-6) no está en CNF-2 (CR-003).
- **Archivo afectado:** `story.md` — sección «📎 Notas / contexto adicional» (párrafos «Cubre parte de CS-2 … Depende de STORY-148» y «Ampliación de alcance (2026-10-22)»); «⚙️ Criterios no funcionales» › CNF-2
- **Acción requerida:** aplicar CR-001, CR-002 y CR-003 en story.md: precisar que `epic-refine` se migra solo si existe en `skills/` al implementar, declarar «Depende de STORY-147 y STORY-148» y el retiro de `PENDING_MIGRATION`, y ampliar CNF-2 con «ni se recrea una historia archivada». No cambia los ACs.

---

## Recomendaciones

1. **INC-001:** en `tasks.md` › T007, sustituir «Fase 2 usa el literal `specs/flow/` en lugar de `$EPICS_DIR`» por «sustituir toda aparición de `$EPICS_DIR` (Fase 2, l. 52, y Fase 4, l. 80) por el literal `specs/flow/`». Se puede aplicar con `/story-fix-plan STORY-151` o durante T007.
2. **INC-002:** en `story.md` › Notas, reformular la ampliación de alcance como condicional (CR-001), declarar «Depende de STORY-147 y STORY-148» y añadir el retiro de los seis skills de `PENDING_MIGRATION` (CR-002); en CNF-2 añadir «ni se recrea una historia archivada» (CR-003).
3. **Observación sobre T004 (no es hallazgo):** el resultado RED esperado dice que R4 aparecerá solo en `epic-from-project-plan`, pero el paso 2 del bloque v1 de los otros cinco skills (p. ej. `skills/epic-analyze/SKILL.md:96`, `skills/epic-creation/SKILL.md:113`) también combina `root` y `sddf.config.yaml` en una línea. Esperar R1, R3 y R4 en los seis.
4. **Ejecución:** respetar T001; STORY-147 y STORY-148 siguen en planificación a 2026-10-22, así que la historia no es implementable todavía aunque el plan esté aprobado.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline ejecutado con `--only-tasks`). Las verificaciones de AC-1, AC-2 y AC-3 recaen en los evals nuevos de D-9 (ejecución a criterio humano) y en los greps de T020; AC-4 en T019, T020 y T022.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-151` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-151` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 y AC-2 (principales), AC-3 (alternativo) y AC-4 (error) en bloques `gherkin` Dado/Cuando/Entonces |
| design.md cubre todos los ACs con al menos un elemento por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación»: 4/4 + CNF-1/CNF-2 |
| Elementos de diseño con trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-9 con `// satisface:`; tablas de componentes e interfaces con columna «AC que satisface» |
| Sin decisiones de arquitectura aplazadas; ambigüedad resuelta o registrada como CR | ✓ | — | Open Questions «Ninguna»; `epic-refine` resuelto con regla determinista (CR-001 → T002); archivadas al generar decidido (D-6, CR-003); ubicaciones de Paso 0 verificadas en los seis `SKILL.md` |
| Existe tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| tasks.md contiene solo tareas atómicas para todos los escenarios principales | ✓ | — | 24 tareas, una por archivo, sección o verificación; AC-1 → T005, T016; AC-2 → T008, T009, T017; AC-3 → T011, T012, T015; AC-4 → T004–T014, T019, T020, T022 |
| Si testcases.md existe, contiene pruebas para todos los escenarios | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
