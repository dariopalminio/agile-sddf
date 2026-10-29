---
type: analyze
id: STORY-165
slug: STORY-165-analyze-report
title: "Analyze: Skill epic-refine (Core): corregir índice y enlaces de una épica"
story: STORY-165
design: STORY-165
tasks: STORY-165
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-165-corregir-indice-y-enlaces-epica
---

<!-- Referencias -->
[[STORY-165-corregir-indice-y-enlaces-epica]]

# Reporte de Coherencia: Skill epic-refine (Core): corregir índice y enlaces de una épica

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos |
| Alineación tareas → diseño | ✓ | 35/35 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 17/17 elementos con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ✓ | Listada en «Fase PLAN» con su título actual; objetivo alineado con el Alcance, CS-15, SMOKE-5 y su parte de CS-12 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

> ⚠️ testcases.md no presente — cobertura de pruebas no evaluada (planificada con `--only-tasks`). Vía habilitada: `/story-implement-tasks STORY-165`.

Este análisis reemplaza al anterior (INC-001 tipo C e INC-002 tipo D), resueltos según `fix-plan-report.md`: fixture `reejecucion-parcial/` y T035 para TC-005, e índice de EPIC-23 actualizado tras el split.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Aplicar INT-02 y MAD-02 tras confirmar el plan consolidado: `.bak` de `epic.md` y `story.md`, línea F2 de STORY-304, `related` sin STORY-999, reporte con «aplicados», status/substatus intactos | ✓ | D-3 (extracción y revalidación), D-4 (enrutamiento), D-5 (reglas INT-02/MAD-02), D-6 (plan consolidado y confirmación), D-7 (backup, relectura, restauración), D-8 (`epic-refine-report.md`), F-1 |
| AC-2 | `verdict: APPROVED` → mensaje «no necesita refinamiento», ningún archivo creado ni modificado (tampoco el reporte) | ✓ | D-2 (gate por `verdict`, G-06), F-2 |
| AC-3 | Solo INT-01, INT-05, SAL-03 con `--auto` → «fuera de alcance» con responsable `PO`, sin modificar `epic.md` ni `story.md` | ✓ | D-4 (tabla de enrutamiento), D-6 (sin `C-NN` → solo reporte), D-8, F-3, CR-002 |

Requisitos no funcionales: CNF-1 → D-7; CNF-2 → D-3 (resolución por glob), D-9; CNF-3 → D-7, D-9; CNF-4 → D-1, D-4; CNF-5 → D-1 (presupuesto ≤ 300 líneas). Notas de la historia: idempotencia → D-3, F-4, TC-005 con `reejecucion-parcial/`; ejecución secuencial sin subagentes → Non-Goals; extensibilidad para STORY-173/174 → D-4, D-6, D-8; `skill-master` → D-10.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Crear el skill con `skill-master` | D-1, D-10 | ✓ |
| T002 | Frontmatter y cuerpo introductorio de `SKILL.md` | D-1, Non-Goals | ✓ |
| T003 | Entrada, parámetros, modos y restricciones | D-6, D-7, D-9 | ✓ |
| T004 | Cláusula de contenido no confiable | D-9 | ✓ |
| T005 | Paso 0 (layout) y Paso 1 (épica + template del reporte) | D-2, D-8, D-10 | ✓ |
| T006 | Paso 2: gate por `verdict` | D-2 | ✓ |
| T007 | Paso 3: extracción de hallazgos y resolución por glob | D-3 | ✓ |
| T008 | Tabla de enrutamiento código → tratamiento | D-4 | ✓ |
| T009 | Paso 4: revalidación y carga condicional de catálogos | D-3, D-5, D-7 | ✓ |
| T010 | Paso 5: plan consolidado y confirmación por modo | D-6, CR-002 | ✓ |
| T011 | Paso 6: backup y escritura única | D-7.1–D-7.2 | ✓ |
| T012 | Paso 7: relectura y restauración global | D-7.3, F-5 | ✓ |
| T013 | Paso 8: rellenar el reporte | D-8 | ✓ |
| T014 | Paso 9: salida manual, bloque `--auto` y errores | D-9, Interfaces, F-5 | ✓ |
| T015 | `references/int-corrections.md` | D-5, CR-001 | ✓ |
| T016 | `references/mad-corrections.md` | D-5 | ✓ |
| T017 | `assets/epic-refine-report-template.md` | D-8 | ✓ |
| T018 | `README.md` | D-1 | ✓ |
| T019 | Fixture `huerfana-y-related-roto/` | D-11 | ✓ |
| T020 | Fixture `aprobada/` | D-11 | ✓ |
| T021 | Fixture `solo-decisiones-po/` | D-11 | ✓ |
| T022 | Fixture `duplicada/` | D-11 | ✓ |
| T023 | Fixture `instruccion-incrustada/` | D-11 | ✓ |
| T035 | Fixture `reejecucion-parcial/` | D-11, F-4 | ✓ |
| T024 | `evals/evals.json` TC-001…TC-008 (requiere T019–T023, T035) | D-11 | ✓ |
| T025 | `escritor:` de `historias` en el template de épica (central + seed) | D-10 | ✓ |
| T026 | `escritor:` de `related:` en el template de historia (central + seed) | D-10, CR-003 | ✓ |
| T027 | `domain-epic-lifecycle` §8 y §9 | D-10 | ✓ |
| T028 | `sddf-commands-pipeline` §2 | D-10 | ✓ |
| T029 | Tamaño y carga condicional del `SKILL.md` | V-9 | ✓ |
| T030 | UTF-8 sin BOM y paridad del template de historia | V-10, V-11 | ✓ |
| T031 | `verify-fixed-layout` y `verify:eval-inventory` | V-7, V-8 | ✓ |
| T032 | `npm test` y `verify:repository` | V-10, V-12 | ✓ |
| T033 | `graphify update .` | AGENTS.md (graphify) | ✓ |
| T034 | Evals y SMOKE-5 pendientes de ejecución manual | V-1…V-6 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| `skills/epic-refine/SKILL.md` | Componentes afectados, D-1 | T002–T014 | ✓ |
| `references/int-corrections.md` | D-1, D-5 | T015 | ✓ |
| `references/mad-corrections.md` | D-1, D-5 | T016 | ✓ |
| `assets/epic-refine-report-template.md` | D-1, D-8 | T017 | ✓ |
| `README.md` | D-1 | T018 | ✓ |
| `evals/evals.json` | D-11 | T024 | ✓ |
| Fixtures `huerfana-y-related-roto/`, `aprobada/`, `solo-decisiones-po/`, `duplicada/`, `instruccion-incrustada/`, `reejecucion-parcial/` | D-11 | T019–T023, T035 | ✓ |
| Template de épica (central + seed) | D-10 | T025 | ✓ |
| Template de historia (central + seed) | D-10, CR-003 | T026 | ✓ |
| `domain-epic-lifecycle` §8, §9 | D-10 | T027 | ✓ |
| `sddf-commands-pipeline` §2 | D-10 | T028 | ✓ |
| Interfaz: invocación `/epic-refine <epica> [--auto]` | Interfaces | T005 | ✓ |
| Interfaz: reporte de análisis → `epic-refine` | Interfaces, D-2, D-3 | T006, T007 | ✓ |
| Interfaz: templates → `epic-refine` (por `clave:`) | Interfaces | T007, T015 | ✓ |
| Interfaz: `SKILL.md` → catálogos | Interfaces, D-1 | T009 | ✓ |
| Interfaz: `epic-refine` → usuario / orquestador | Interfaces, D-6, D-9 | T010, T014 | ✓ |
| Interfaz: `epic-refine` → disco | Interfaces, D-7 | T011, T012, T013 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:45`, «Fase PLAN — skill nuevo `epic-refine` (dividido en tres historias)»: `- [ ] **STORY-165** — Skill epic-refine (Core): …`, junto a STORY-173 (`:46`) y STORY-174 (`:47`) |
| Objetivo de la historia alineado con la épica | ✓ | Alcance PLAN («`epic-refine` aplica a la épica y a sus historias los hallazgos de `epic-analyze-report.md`»), CS-15, SMOKE-5 y su parte de CS-12; las Notas (`epic.md:199`) asignan a STORY-165 CS-15 y SMOKE-5, con STORY-173/174 ampliando la parte de CS-15 |
| Restricciones de la épica respetadas | ✓ | No escribe `status`/`substatus` (CS-15, D-7); sin operaciones de git; `epic-improve` y `epic-refine` se mantienen como bucles distintos (Notas de la épica; disparador negativo en T002) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

Ninguna. Antes de entregar, ejecutar a criterio humano `npm run test:eval -- epic-refine` y el recorrido SMOKE-5 (T034).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-165` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-165` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1…AC-3 en bloques `gherkin` (principal, cierre, alternativo) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 3/3 ACs cubiertos (tabla de cobertura) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-11 con `// satisface:`; tablas de Componentes e Interfaces con columna AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; CR-001…CR-003 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 35 tareas de un archivo o sección cada una; AC-1 (T010–T013, T015–T016, T019, T035), AC-2 (T006, T020), AC-3 (T008, T021) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe (planificada con `--only-tasks`) |
