---
type: analyze
id: STORY-178
slug: STORY-178-analyze-report
title: "Analyze: ADR de la guía de revisión"
story: STORY-178
design: STORY-178
tasks: STORY-178
verdict: APPROVED
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-178-adr-guia-de-revision
---

<!-- Referencias -->
[[STORY-178-adr-guia-de-revision]] · [[STORY-178-adr-guia-de-revision-design]] · [[STORY-178-adr-guia-de-revision-tasks]] · [[EPIC-28-calibrar-story-code-review-con-review-md]]

# Reporte de Coherencia: ADR de la guía de revisión

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D, E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 22/22 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 7/7 elementos con tarea (3 componentes, 4 interfaces) |
| Alineación con la épica EPIC-28-calibrar-story-code-review-con-review-md | ⚠️ | Alineada; dependencia con STORY-181 pendiente de CR-001 (INC-001) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, sin ❌) |

Hechos verificados en el filesystem el 2026-11-08 para este análisis:

- `docs/adr/` termina en `ADR-0020-contratos-centralizados-para-spec-living.md`; `ADR-0021` solo aparece en `design.md` y `tasks.md` de esta historia, así que el número está libre.
- Los slugs `layout-fijo-con-archivo-de-epicas` (ADR-0019), `contrato-de-validacion` (ADR-0015) y `EPIC-28-calibrar-story-code-review-con-review-md` existen. `guia-de-revision-review-md` solo aparece en `design.md:190`.
- `skills/story-code-review/SKILL.md` define `$IMPL_FILES` en el Paso 2c (línea 271) y `$DOD_PATH` en el Paso 2d (línea 282). El Paso 4c.2 dice «No se invoca `git diff`» (línea 466). Esto sostiene D-4 y D-5.
- Los checklists `docs/guardrails/gr-code-security-checklist.md` y `gr-ai-security-checklist.md` existen (nivel 4 de D-3).
- `docs/adr/README.md:69` y `docs/index.md:485` tienen la fila y la línea de ADR-0020 en los formatos que T014 y T015 replican.
- `docs/adr/adr-template.md` tiene las seis secciones `##` que nombra D-1, en ese orden (líneas 26-69).

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | El ADR fija ubicación, precedencia y fuente de lectura; está `ACCEPTED`, tiene las secciones del template y figura en `docs/adr/README.md` | ✓ | D-1 (línea 61), D-2 (81), D-3 (92), D-4 (112), D-7 (155); Componentes afectados (166-174); Interfaces «Frontmatter de ADR» y «Fila del índice de ADRs» (180-181); Esquema de datos (185); contratos 1-4 (232-235) |
| AC-2 | Cada severidad de Claude Code Review tiene una sola traducción (Important → HIGH o MEDIUM/bloquea; Nit → LOW/no bloquea; Pre-existing → PREEXISTENTE/no bloquea) | ✓ | D-6 (133-153): la tabla coincide fila por fila con los Ejemplos de `story.md:41-45`; F-2 (208); contrato 5 (236) |
| AC-3 | Si la historia modifica `REVIEW.md` o el DoD, el ADR dice qué versión rige, exige una advertencia en el informe y no exige git con el working tree | ✓ | D-4 (112-118) y D-5 (120-131): rige el working tree, hay advertencia en `code-review-report.md` y se detecta con `$IMPL_FILES` sin git; contrato 6 (237) |

Criterios no funcionales (no son ACs, pero el DoD exige trazabilidad):

| CNF | Elemento de diseño | Contrato |
|---|---|---|
| CNF-1 — Sin cuarta raíz | D-2 (81-90) | 7 |
| CNF-2 — Alternativas descartadas | D-4 «Alternativas rechazadas» (116-118) y D-7 «Alternativas consideradas» (161) | 8 |
| CNF-3 — Veracidad de la fuente | D-7 (157-159): dos bloques separados con la URL | 9 |
| CNF-4 — Gate verde | F-1 paso 4 (206), F-3 (213) | 10 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Confirmar que `ADR-0021` y el slug siguen libres; aplicar F-3 si no | D-1, F-1 paso 1, F-3 | ✓ |
| T002 | Comprobar el estado de CR-001 antes de redactar D-6 | CR-001, D-6 | ✓ |
| T003 | Crear ADR-0021 con frontmatter, título y seis secciones | D-1, Esquema de datos, Interfaz «Frontmatter de ADR» | ✓ |
| T004 | Redactar `## Contexto y problema` con los dos bloques | D-7 (Contexto), CNF-3, F-3 (fecha de consulta) | ✓ |
| T005 | Redactar `### Ubicación` | D-2 | ✓ |
| T006 | Redactar `### Precedencia` | D-3 | ✓ |
| T007 | Redactar `### Fuente de lectura` | D-4 | ✓ |
| T008 | Redactar `### Historias que modifican la guía o el DoD` | D-5 | ✓ |
| T009 | Redactar `### Vocabulario` | D-6 | ✓ |
| T010 | Redactar `## Rationale` | D-7 (Rationale) | ✓ |
| T011 | Redactar `## Alternativas consideradas` | D-7 (Alternativas), D-2 a D-6, CNF-2 | ✓ |
| T012 | Redactar `## Consecuencias` con puntos de cambio | D-7 (Consecuencias), F-4 | ✓ |
| T013 | Redactar `## Referencias` y verificar wikilinks a mano | D-7 (Referencias), Risks (`check-doc-links.js` excluye `docs/adr`) | ✓ |
| T014 | Añadir fila en `docs/adr/README.md` | Componente «Índice de ADRs», Interfaz «Fila del índice de ADRs» | ✓ |
| T015 | Añadir línea en `docs/index.md` | Componente «Índice wiki», Interfaz «Línea de `docs/index.md`» | ✓ |
| T016 | Verificar contratos 1 y 2 | Contratos de verificación 1-2 | ✓ |
| T017 | Verificar contratos 3, 6 y 7 | Contratos de verificación 3, 6, 7 | ✓ |
| T018 | Verificar contrato 5 con los Ejemplos de AC-2 | Contrato de verificación 5 | ✓ |
| T019 | Verificar contratos 8 y 9 | Contratos de verificación 8-9 | ✓ |
| T020 | Verificar contrato 4 y codificación UTF-8 sin BOM | Contrato de verificación 4; regla de encoding | ✓ |
| T021 | Ejecutar `npm run verify:repository` y `npm test` | F-1 paso 4, F-3, contrato 10 | ✓ |
| T022 | Verificar alcance con `git diff --stat` | Contrato de verificación 11, Non-Goals | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| ADR de la guía de revisión (`docs/adr/ADR-0021-guia-de-revision-review-md.md`) | Componentes afectados (170) | T003-T013 | ✓ |
| Índice de ADRs (`docs/adr/README.md`) | Componentes afectados (171) | T014 | ✓ |
| Índice wiki (`docs/index.md`) | Componentes afectados (172) | T015 | ✓ |
| Frontmatter de ADR | Interfaces (180) | T003, T016 | ✓ |
| Fila del índice de ADRs | Interfaces (181) | T014, T020 | ✓ |
| Línea de `docs/index.md` | Interfaces (182) | T015, T021 | ✓ |
| ADR-0021 → STORY-179 a STORY-185 | Interfaces (183) | T005-T009 (redactan `## Decisión` con D-2 a D-6, que es el contenido que citarán las historias) | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-28-calibrar-story-code-review-con-review-md

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:30`, **STORY-178** con el mismo título y propósito |
| Objetivo de la historia alineado con la épica | ✓ | Cubre la parte del ADR de **CS-1** (`epic.md:41`: ubicación, precedencia, fuente de lectura y vocabulario) y las decisiones (a) y (c) de `epic.md:90`. El vocabulario de D-6 coincide con `epic.md:88` |
| Restricciones de la épica respetadas | ⚠️ | ADR-0019 no se edita (D-2, contrato 7), `REVIEW.md` no se publica en npm (D-2, `epic.md:91`) y no se activa Claude Code Review (Non-Goals). La decisión (b) de `epic.md:90` (método de líneas no tocadas) se delega en STORY-181 mediante CR-001, pero STORY-181 todavía espera que la fije el ADR (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica (dependencia entre historias hermanas)
- **Descripción:** `design.md` (D-6, líneas 146 y 153; CR-001, líneas 264-268) no fija en el ADR el método para identificar las líneas que la historia no tocó y lo delega en el `design.md` de STORY-181. Las notas de la épica (`epic.md:90`) incluyen ese punto, la decisión (b), entre las «Decisiones para el ADR». STORY-181 sigue esperando que lo fije el ADR: `specs/flow/STORY-181-hallazgos-preexistentes/story.md:51` (AC-3: «el método que fija el ADR de la guía de revisión») y `:72` (Notas: «el ADR decide cómo identificar las líneas no tocadas»). La propia historia admite las dos vías (`story.md:77`), y T002 condiciona T009 a que la decisión esté tomada, así que el plan de STORY-178 es coherente. Lo que queda desalineado es el texto de STORY-181 hasta que se aplique CR-001.
- **Archivo afectado:** `specs/flow/STORY-181-hallazgos-preexistentes/story.md` — sección «AC-3» (línea 51) y «📎 Notas» (línea 72); `design.md` de STORY-178 — sección «Registro de Cambios (CR) › CR-001»
- **Acción requerida:** decisión humana antes de T009: (1) aplicar CR-001 en STORY-181 (AC-3 y Notas pasan a «el método que fija el `design.md` de STORY-181 conforme a ADR-0021»), o (2) fijar el método en el ADR y ampliar D-6 de `design.md` antes de implementar.

### INC-002 [WARNING]

- **Tipo:** E: criterio DoD PLAN no evaluable con certeza
- **Descripción:** el criterio «Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen» se cumple en las decisiones D-1 a D-7, el esquema de datos, los componentes, las interfaces y los contratos. Pero los flujos F-3 (`design.md:211`, `// P7`) y F-4 (`design.md:216`, `// P6`) se anotan con principios de diseño y no con un AC, y «Decisiones de complejidad justificada» (líneas 221-226) no tiene anotación. Por la regla de duda se marca ⚠️ y no ❌: F-3 sirve a AC-1 y CNF-4, y F-4 a D-2 y D-4.
- **Archivo afectado:** `design.md` — secciones «F-3 — Degradación», «F-4 — Puntos de cambio» y «Decisiones de complejidad justificada»
- **Acción requerida:** opcional: anotar F-3 con `// satisface: AC-1, CNF-4` y F-4 con `// satisface: AC-1` (puntos de cambio de D-2 y D-4), conservando la referencia a P6/P7.

---

## Recomendaciones

1. **INC-001:** antes de ejecutar T009, decidir si el método de líneas no tocadas queda delegado (CR-001) o se fija en el ADR. Si se delega, aplicar CR-001 en `specs/flow/STORY-181-hallazgos-preexistentes/story.md` (líneas 51 y 72) con `/story-refine STORY-181` o con una edición manual. Si se fija en el ADR, ampliar D-6 de `design.md` y quitar CR-001. T002 ya bloquea T009 hasta que esté decidido.
2. **INC-002:** con `/story-fix-plan STORY-178`, o a mano, añadir `// satisface: AC-N` a F-3 y F-4 de `design.md`. No bloquea.
3. **Observación (no es hallazgo):** el comentario de `docs/adr/adr-template.md:10` dice que `slug` «debe coincidir con el nombre del archivo sin extensión», pero ADR-0015 y ADR-0019 omiten el prefijo `ADR-NNNN-`. El diseño sigue esa práctica (contrato 1, `slug: guia-de-revision-review-md`), y hace bien, porque los wikilinks de `docs/index.md` se resuelven por ese slug. El template propone `PROPOSED` al crear (`adr-template.md:14`); el diseño elige `ACCEPTED` y lo justifica en D-1 con AC-1 y CS-1.
4. **Observación (no es hallazgo):** no hay `testcases.md`. En un `chore` documental basta con T016-T022, que verifican los 11 contratos del diseño, y la implementación va por `/story-implement-tasks`. Si se quiere habilitar `/story-implement`, ejecutar `/story-testcases STORY-178`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-178` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-178` (disponible) |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (`story.md:27-33`), AC-2 con `Escenario` y `Ejemplos` (36-46) y AC-3 (49-55) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs (ver «Cobertura de Criterios de Aceptación») |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ⚠️ | WARNING | D-1 a D-7, el esquema, los componentes, las interfaces y los contratos están trazados; F-3 y F-4 se anotan con P7/P6 (INC-002) |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | `## Open Questions`: «Ninguna» (línea 253); el método de líneas no tocadas está registrado como CR-001 (264-268) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (T001-T022) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Una sección del ADR por tarea (T004-T013) y una verificación por contrato (T016-T020); AC-1, AC-2 y AC-3 tienen tareas de redacción y de verificación |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe |
