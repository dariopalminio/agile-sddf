---
type: analyze
id: STORY-116
slug: STORY-116-analyze-report
title: "Analyze: Actualizar documentación canónica al modelo de dos niveles"
story: STORY-116
design: STORY-116
tasks: STORY-116
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-116-documentar-modelo-dos-niveles
---

<!-- Referencias -->
[[STORY-116-documentar-modelo-dos-niveles]] · [[STORY-116-documentar-modelo-dos-niveles-design]] · [[STORY-116-documentar-modelo-dos-niveles-tasks]]

# Reporte de Coherencia: Actualizar documentación canónica al modelo de dos niveles

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1…CNF-3 cubiertos por D-10, D-11, D-12 y la regla de reemplazo de D-3/D-6) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente |
| Alineación tareas → diseño | ✓ | 38/38 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 29/29 elementos con tarea (22 componentes + 7 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Historia listada y objetivo alineado; el criterio de salida "`memory-system check` devuelve exit code 0" queda diferido a STORY-117 (CR-002) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR · 5 WARNING)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Los seis documentos canónicos describen el modelo de dos niveles (`product/` + `requirements/` → `specs/epics/` → `specs/stories/`), sin Project como work item, y la tabla de fases del pipeline de proyecto muestra `vision.md`, `stakeholders.md`, `requirements/` y `roadmap.md` | ✓ | D-1 (modelo canónico), D-2 (`domain-work-item-hierarchy.md`), D-3 (sucesor `domain-foundational-docs-lifecycle.md` + tabla de fases), D-4 (resto de `domains/`), D-5 (`state-machine.md`, `memory-system.md`, `sddf-architecture.md`), D-6 (`flight-leves-model.md` y guías), D-7 (constitución, README, AGENTS); "Componentes afectados" filas 1-14; contratos #1-#3 |
| AC-2 | ADR-0013 pasa a `ACCEPTED`; ADR-0004 registra el reemplazo en frontmatter y nota visible; `adr/README.md` lista ambos con su estado | ✓ | D-9 (ADR-0013, ADR-0004, `adr/README.md`), F-3, Interfaces "Frontmatter de ADR reemplazado/que reemplaza", contrato #4 |
| AC-3 | `[Unreleased]` del CHANGELOG con sección BREAKING (rutas, hogares, skills, 4.0.0) que enlaza a una guía con `--dry-run` y luego sin él | ✓ | D-8 (guía en `artifact-directory-migration.md` + sección `### BREAKING`), F-2, Interfaces "Sección BREAKING", contratos #5-#6 |

Nota AC-1: D-5 conserva en `memory-system.md` `project.md` como archivo canónico y `type ∈ {project, epic, story}` con la aclaración "(solo repositorios sin migrar)". El contrato #1 admite esas coincidencias; describe el motor, no un work item vigente, por lo que no contradice AC-1.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar precondiciones F-4 y anotar `SHARED_TEMPLATES` y entradas `[Unreleased]` | Context, F-4, contratos #5-#6 | ✓ |
| T002 | Línea base de enlaces | D-12 | ✓ |
| T003 | Editar y aceptar ADR-0013 | D-9 | ✓ |
| T004 | ADR-0004 `SUPERSEDED` + nota | D-9 | ✓ |
| T005 | `adr/README.md` (convención + índice 0004, 0010-0013) | D-9, CR-003 | ✓ |
| T006 | Crear `domain-foundational-docs-lifecycle.md` | D-3, D-1, Interfaces | ✓ |
| T007 | Marcar `domain-project-lifecycle.md` como `superseded` | D-3, Interfaces | ✓ |
| T008 | Reescribir `domain-work-item-hierarchy.md` | D-2, D-1, D-10 | ✓ |
| T009 | `domains/README.md` | D-4, D-10 | ✓ |
| T010 | `domain-state-management.md` | D-4, D-10 | ✓ |
| T011 | `domain-epic-lifecycle.md` | D-4, D-10 | ✓ |
| T012 | `domain-story-lifecycle.md` | D-4, D-10 | ✓ |
| T013 | `domain-knowledge-artifacts.md` | D-4, D-10 | ✓ |
| T014 | `domain.md` | D-4 | ✓ |
| T015 | `state-machine.md` | D-5, D-3 | ✓ |
| T016 | `memory-system.md` | D-5 | ✓ |
| T017 | `sddf-architecture.md` | D-5 | ✓ |
| T018 | `flight-leves-model.md` | D-6, D-1 | ✓ |
| T019 | `organization-of-artifacts.md` | D-6 | ✓ |
| T020 | `sddf-commands-pipeline.md` | D-6, D-3 | ✓ |
| T021 | `orchestrator-subagent-pattern.md` l. 148 | D-6 | ✓ |
| T022 | Runbook `actualizar-spec-de-proyecto.md` → `superseded` | D-6, D-10 | ✓ |
| T023 | `constitution.md` | D-7 | ✓ |
| T024 | Copia literal en `skill-structural-pattern.md` | D-6, D-7 | ✓ |
| T025 | `README.md` | D-7 | ✓ |
| T026 | `AGENTS.md` | D-7 | ✓ |
| T027 | `docs/specs/README.md` y `docs/product/README.md` | D-7 | ✓ |
| T028 | Guía de migración 4.0.0 | D-8 | ✓ |
| T029 | Sección BREAKING del CHANGELOG | D-8, Interfaces | ✓ |
| T030 | Caso de prueba de `slugIndex` (RED) | D-11, Interfaces | ✓ (ver INC-004) |
| T031 | Regex `canonical` + export de `slugIndex` (GREEN) | D-11, Interfaces | ✓ |
| T032 | Regenerar `docs/index.md` | D-10, F-4, contrato #8 | ✓ |
| T033 | `npm test` y `node --test test/check-doc-links.test.js` | Contrato #9 | ✓ |
| T034 | Verificar AC-1 (contratos #1-#3) | Contratos #1-#3 | ✓ |
| T035 | Verificar AC-2 y AC-3 (contratos #4-#6) | Contratos #4-#6 | ✓ |
| T036 | Verificar CNF-1 contra la línea base | D-12, contrato #7 | ✓ |
| T037 | Verificar CNF-3 (encoding) | D-12, contrato #10 | ✓ |
| T038 | Validación manual F-1…F-3 | F-1, F-2, F-3 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Jerarquía de work items (`domain-work-item-hierarchy.md`) | Componentes afectados / D-2 | T008 | ✓ |
| Ciclo de vida de Project (`domain-project-lifecycle.md`) | Componentes afectados / D-3 | T007 | ✓ |
| Ciclo de vida de la documentación fundacional (nuevo) | Componentes afectados / D-3 | T006 | ✓ |
| Resto de dominios (README, state-management, epic, story, knowledge-artifacts, domain) | Componentes afectados / D-4 | T009-T014 | ✓ |
| Máquina de estados | D-5 | T015 | ✓ |
| Sistema de memoria | D-5 | T016 | ✓ |
| Arquitectura SDDF | D-5 | T017 | ✓ |
| Guías (flight-leves, organization, commands-pipeline, skill-structural, orchestrator) | D-6 | T018, T019, T020, T024, T021 | ✓ |
| Guía de migración | D-8 | T028 | ✓ |
| Runbook de `project.md` | D-6 | T022 | ✓ |
| Constitución | D-7 | T023 | ✓ |
| READMEs de capa (`docs/specs/README.md`, `docs/product/README.md`) | D-7 | T027 | ✓ |
| README y AGENTS | D-7 | T025, T026 | ✓ |
| CHANGELOG | D-8 | T029 | ✓ |
| ADR-0013 | D-9 | T003 | ✓ |
| ADR-0004 | D-9 | T004 | ✓ |
| Índice de ADRs | D-9 | T005 | ✓ |
| Verificador de enlaces (`check-doc-links.js`) | D-11 | T031 | ✓ |
| Prueba del verificador | D-11 | T030 | ✓ |
| Índice wiki (`docs/index.md`) | D-10 | T032 | ✓ |
| Interfaz: frontmatter de documento reemplazado | Interfaces | T007, T022 | ✓ |
| Interfaz: frontmatter del sucesor | Interfaces | T006 | ✓ |
| Interfaz: frontmatter de ADR reemplazado | Interfaces | T004 | ✓ |
| Interfaz: frontmatter de ADR que reemplaza | Interfaces | T003 | ✓ |
| Interfaz: sección BREAKING | Interfaces | T029 | ✓ |
| Interfaz: wikilinks a ADR por slug | Interfaces | T003, T011 | ✓ |
| Interfaz: `slugIndex(files)` | Interfaces | T030, T031 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. La verificación de AC-1…AC-3 y CNF-1…CNF-3 está planificada como tareas (T033-T038) contra los contratos de verificación #1-#10 de design.md.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-116` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-116` disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` l. 39: "STORY-116 — Actualizar documentación canónica: `memory-system.md`, `sddf-architecture.md`, `domain-*`, `docs/specs/README.md`, `README` y `CHANGELOG`". El diseño cubre esa lista y la amplía (ADRs, constitución, guías, AGENTS.md, `check-doc-links.js`), ampliación registrada en CR-001 |
| Objetivo de la historia alineado con la épica | ✓ | Cubre el criterio de salida l. 53 ("`CHANGELOG.md` documenta el breaking change con guía de migración") y la nota l. 84 (major 4.0.0). Respeta la dependencia de la tabla l. 102 (fila 9 depende de 6, 7, 8) con las precondiciones de F-4 / T001 |
| Restricciones de la épica respetadas | ⚠️ | El criterio de salida l. 51 "`memory-system check` devuelve exit code 0" no lo alcanza esta historia: D-12 verifica contra línea base y CR-002 delega la decisión a STORY-117 (ver INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D (desalineación con la épica) / ambigüedad story ↔ design
- **Descripción:** CNF-1 de story.md exige que `memory-system check` termine "sin enlaces ni wikilinks rotos" (absoluto), pero D-12 y el contrato #7 solo exigen "sin `broken-wikilink` con origen en los archivos tocados y recuento ≤ línea base" (48 rotos medidos, 31 en historias de EPIC-21). CR-002 propone precisar CNF-1, pero story.md no se ha actualizado. El criterio de salida de EPIC-21 (l. 51) sigue exigiendo exit 0.
- **Archivo afectado:** story.md — sección "⚙️ Criterios no funcionales específicos" (CNF-1); design.md — "Registro de Cambios (CR)" CR-002 y D-12; epic.md — "Criterios de salida" l. 51
- **Acción requerida:** aplicar CR-002 en story.md (CNF-1 relativo a la línea base + `verify:links` exit 0) y dejar constancia en STORY-117 de que el exit 0 de la épica se decide allí.

### INC-002 [WARNING]

- **Tipo:** D (alcance no reflejado en la historia)
- **Descripción:** CR-001 amplía el alcance a `scripts/check-doc-links.js` + `test/check-doc-links.test.js`, constitución §8/§9, `AGENTS.md`, `docs/product/README.md`, `docs/adr/README.md` (filas 0010-0012) y `orchestrator-subagent-pattern.md`, pero "📎 Notas / contexto adicional" de story.md aún no lista esas piezas. La aceptación podría tratarlas como fuera de alcance.
- **Archivo afectado:** story.md — sección "📎 Notas / contexto adicional"; design.md — CR-001
- **Acción requerida:** añadir a las notas de story.md la lista de piezas extra de D-6, D-7, D-9 y D-11 según CR-001.

### INC-003 [WARNING]

- **Tipo:** D (trazabilidad de referencias)
- **Descripción:** story.md usa `ADR-0013-eliminar-specs-01-projects` como slug en `related` (frontmatter l. 15) y como wikilink (l. 21 y l. 73), pero el slug real de ADR-0013 es `eliminar-specs-01-projects` (los slugs de ADR no llevan prefijo, como fija la interfaz "Wikilinks a ADR" del diseño). Es uno de los 31 `broken-wikilink` de la línea base de D-12. design.md ya usa el slug correcto.
- **Archivo afectado:** story.md — frontmatter `related` y bloque "Referencias"; sección "📎 Notas / contexto adicional" (Origen)
- **Acción requerida:** repuntar en story.md a `[[eliminar-specs-01-projects]]`, o asumirlo explícitamente como parte de la línea base de CR-002.

### INC-004 [WARNING]

- **Tipo:** C (calidad de la secuencia de tareas en relación con D-11)
- **Descripción:** T030 pide que el caso nuevo falle en RED por el regex actual, pero `slugIndex` no se exporta (`scripts/check-doc-links.js` l. 294-300 solo exporta `ACTIVE_ROOTS`, `HISTORICAL_EXCLUSIONS`, `activeMarkdownFiles`, `checkDocumentation`, `githubAnchor`; el test l. 9 solo importa `checkDocumentation`). El export se añade en T031, así que en T030 la prueba fallará por `slugIndex is not a function` y no por el regex. Además, el subcaso "prefiere `epic.md`" ya pasa con el regex actual; solo el subcaso `project.md`/`notes.md` demuestra el cambio.
- **Archivo afectado:** tasks.md — grupo "8. Verificador de enlaces" (T030, T031); design.md — D-11
- **Acción requerida:** mover el export de `slugIndex` a T030 (o verificar el RED a través de `checkDocumentation`) para que el RED falle por el comportamiento y no por el import.

### INC-005 [WARNING]

- **Tipo:** D (precondición de ejecución)
- **Descripción:** el diseño asume el estado final de STORY-104…115 (Context "Dependencia de ejecución", F-4): `docs/specs/01-projects/` inexistente y rutas `specs/epics/`/`specs/stories/`. A 2026-10-08 `docs/specs/01-projects/` todavía existe, la historia vive aún en `docs/specs/03-stories/` y las hermanas STORY-111…115 están en `READY-FOR-IMPLEMENT` (sin implementar), así que hoy T001 detendría la implementación.
- **Archivo afectado:** design.md — Context y F-4; tasks.md — T001
- **Acción requerida:** ninguna sobre los artefactos (la degradación está bien diseñada); no lanzar `/story-implement-tasks STORY-116` hasta integrar STORY-104…115, tal como ordena la tabla de dependencias de la épica.

---

## Recomendaciones

1. **INC-001:** en story.md › "⚙️ Criterios no funcionales específicos", reescribir CNF-1 como "`npm run verify:links` exit 0 y `memory-system check` sin `broken-wikilink` nuevos ni con origen en los archivos modificados (línea base D-12)", y anotar en STORY-117 la decisión pendiente sobre el criterio de salida l. 51 de EPIC-21.
2. **INC-002:** en story.md › "📎 Notas / contexto adicional", añadir el bullet "Alcance ampliado por diseño (CR-001)" con `check-doc-links.js` y su prueba, `AGENTS.md`, `docs/product/README.md`, `docs/adr/README.md` (0010-0012) y `orchestrator-subagent-pattern.md`.
3. **INC-003:** en story.md, sustituir `ADR-0013-eliminar-specs-01-projects` por `eliminar-specs-01-projects` en `related`, en el bloque de referencias (l. 21) y en la nota "Origen" (l. 73).
4. **INC-004:** en tasks.md, ampliar T030 con "exportar `slugIndex` en `module.exports` sin cambiar su firma" y limitar el RED esperado al subcaso `project.md`/`notes.md`; dejar en T031 solo el cambio de regex.
5. **INC-005:** secuenciar la implementación después de STORY-104…115; en el momento de implementar, T001 es el gate que lo confirma.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 (principales) y AC-3 (alternativo) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-1…D-7; AC-2 → D-9; AC-3 → D-8 (tabla "Componentes afectados") |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-12 con `// satisface:`; columnas "AC que satisface" en Componentes e Interfaces; "AC origen" en los contratos |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna"; CR-001…CR-003 registrados. Los datos que se fijan al implementar (lista de `SHARED_TEMPLATES`, lista de skills del BREAKING) tienen fuente y contrato definidos (#5, #6) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001-T038) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Una tarea por archivo o por verificación; AC-1 → T006-T027, AC-2 → T003-T005, AC-3 → T028-T029. T016 (`memory-system.md`) es amplia, pero su resultado es verificable en un solo archivo |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
