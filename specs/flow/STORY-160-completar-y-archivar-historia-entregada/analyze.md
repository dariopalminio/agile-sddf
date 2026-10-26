---
type: analyze
id: STORY-160
slug: STORY-160-analyze-report
title: "Analyze: Skill story-complete: completar y archivar una historia entregada"
story: STORY-160
design: STORY-160
tasks: STORY-160
verdict: APPROVED
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-160-completar-y-archivar-historia-entregada
---

<!-- Referencias -->
[[STORY-160-completar-y-archivar-historia-entregada]]

# Reporte de Coherencia: Skill story-complete: completar y archivar una historia entregada

## Veredicto
<!-- Línea según la regla de Veredicto del Paso 6. -->

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo C, D, E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 7/7 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada — testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 28/28 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 11/11 componentes, 9/9 interfaces y 11/11 contratos con tarea; una mención de dominio fuera del inventario del diseño (INC-002) |
| Alineación con la épica EPIC-27-completar-flujo-de-story | ⚠️ | historia listada y objetivo alineado; `epic.md` atribuye todavía a STORY-160 el alcance que el split pasó a STORY-164 (INC-001) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, INC-003) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Archivado de una historia entregada (`DELIVER/DONE` → `COMPLETED/DONE` con `updated:` de hoy; `COMPLETED/DONE` sin reescritura; `git log --follow`; origen inexistente; ruta final informada) | ✓ | D-2 (`complete` / `archive-only`), D-4 (fecha y destino), D-5 (orden), D-6 (`git mv`), D-7 (edición mínima), D-8 paso 4, F-1, F-2, contratos 1–3 |
| AC-2 | Rechazo sin efectos: no existe, `ACCEPTANCE/DONE`, `DELIVER/IN-PROGRESS`, `CANCELED/DONE` | ✓ | D-3 (`NOT_FOUND` con la ruta buscada), D-2 (`NOT_DELIVERED` con sugerencia de `/story-delivery`, `CANCELED_NOT_ADMITTED` citando ADR-0016), D-8 paso 1 (sin pregunta), F-3, contrato 4 |
| AC-3 | Abortos sin efectos: rechazo de la confirmación, destino existente, sin `updated:`/`created:` válidos | ✓ | D-8 paso 3, D-4 (`ARCHIVE_CONFLICT`, `NO_ARCHIVE_DATE` sin `date:`), D-5 paso 1 (re-planificación), F-3, contrato 5 |

CNF: CNF-1 → D-4, D-11, contrato 8; CNF-2 → CR-001, contrato 9; CNF-3 → D-6, contrato 3; CNF-4 → D-5, contrato 6; CNF-5 → D-3, contrato 7; CNF-6 → D-8, D-10, C-6…C-11, contrato 10; CNF-7 → C-4, C-5, contrato 11.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Directorios `skills/story-complete/{scripts,evals}` | C-1, C-2, C-4 | ✓ |
| T002 | Fixture git + pruebas de localización (RED) | C-5, D-3, CNF-5 | ✓ |
| T003 | Pruebas de admisión y fecha (RED) | C-5, D-2, D-4 | ✓ |
| T004 | Pruebas de éxito de `applyCompletion` (RED) | C-5, D-5, D-6, D-7, CNF-3, CNF-4 | ✓ |
| T005 | Pruebas de fallo y de CLI (RED) | C-5, D-5, D-9 | ✓ |
| T006 | `evals.json` TC-001…TC-006 | C-4, § Esquema de datos | ✓ |
| T007 | Cabecera, constantes, `readFrontmatter`, `countStories` | C-2, D-4, D-5, CR-004 | ✓ |
| T008 | `locateStory` | C-2, D-3 | ✓ |
| T009 | `archiveDateOf` + `planCompletion` | C-2, D-2, D-4, D-6 | ✓ |
| T010 | Edición mínima del frontmatter | C-2, D-7 | ✓ |
| T011 | Movimiento `git mv` / `rename` | C-2, D-6 | ✓ |
| T012 | `applyCompletion` con restauración y conteo | C-2, D-5 | ✓ |
| T013 | `main()`, exports, códigos de salida (GREEN) | C-2, D-9 | ✓ |
| T014 | Frontmatter y secciones del SKILL.md, DoD N/A | C-1, D-11 | ✓ |
| T015 | Paso 0 (layout fijo), Paso 1, Paso 2 (motor) | C-1, D-9, CNF-1 | ✓ |
| T016 | Paso 3 `plan` y Paso 4 confirmación | C-1, D-8 | ✓ |
| T017 | Paso 5 `apply`, Paso 6, `## Manejo de errores`, `## Salida` | C-1, D-5, D-8 | ✓ |
| T018 | README del skill | C-3 | ✓ |
| T019 | `domain-state-management.md` §4 inv. 6 y §5.2 | C-6, D-10 | ✓ |
| T020 | `domain-story-lifecycle.md` §5 fila `COMPLETED` | C-7, D-10 | ✓ |
| T021 | `domain.md` BR-006 | C-8, D-10 | ✓ |
| T022 | `state-machine.md` líneas 72, 108 y fila `story-complete` | C-9, D-10 | ✓ |
| T023 | `README.md` líneas 134 y 145 | C-10 | ✓ |
| T024 | `sddf-commands-pipeline.md` línea 24 | C-11 | ✓ |
| T025 | Verificación CNF-6 por búsqueda | Contrato 10 | ✓ |
| T026 | `verify-fixed-layout` + `npm pack --dry-run`; `package.json` y script de migración sin cambios | Contratos 8, 9; CR-001, CR-004 | ✓ |
| T027 | `npm test` + `verify:repository` + `graphify update .` | Contratos 1–7, 11 | ✓ |
| T028 | Evals manuales TC-001…TC-006 | Contratos 1, 2, 4, 5 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 SKILL.md | § Componentes afectados | T014–T017 | ✓ |
| C-2 Motor `story-complete.js` | § Componentes afectados | T007–T013 | ✓ |
| C-3 README del skill | § Componentes afectados | T018 | ✓ |
| C-4 Evals | § Componentes afectados | T006 | ✓ |
| C-5 Pruebas del motor | § Componentes afectados | T002–T005 | ✓ |
| C-6 `domain-state-management.md` | § Componentes afectados | T019 | ✓ |
| C-7 `domain-story-lifecycle.md` | § Componentes afectados | T020 | ✓ |
| C-8 `domain.md` | § Componentes afectados | T021 | ⚠️ solo BR-006 (INC-002) |
| C-9 `state-machine.md` | § Componentes afectados | T022 | ✓ |
| C-10 `README.md` | § Componentes afectados | T023 | ✓ |
| C-11 `sddf-commands-pipeline.md` | § Componentes afectados | T024 | ✓ |
| Invocación del skill | § Interfaces | T015 | ✓ |
| CLI del motor | § Interfaces | T013, T005 | ✓ |
| `planCompletion` | § Interfaces | T009, T003 | ✓ |
| `applyCompletion` | § Interfaces | T012, T004, T005 | ✓ |
| `locateStory` | § Interfaces | T008, T002 | ✓ |
| `archiveDateOf` | § Interfaces | T009, T003 | ✓ |
| Confirmación | § Interfaces | T016, T006 (TC-005) | ✓ |
| Escritura | § Interfaces | T010, T012 | ✓ |
| Movimiento | § Interfaces | T011 | ✓ |
| Contratos de verificación 1–11 | § Contratos de verificación | T004–T006, T025–T028 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-27-completar-flujo-de-story

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias: «STORY-160 — Skill story-complete (Core) — completar y archivar una historia entregada». |
| Objetivo alineado | ✓ | «dejar `specs/flow/` solo con el trabajo activo y conservar la historia entregada como registro histórico» cumple el objetivo de la épica («cerrar el ciclo de vida de la historia… hasta su archivado… y dejen registro histórico»). |
| Restricciones respetadas | ⚠️ | La historia y el diseño respetan ADR-0016 y dejan `CANCELED` a STORY-164, pero `epic.md` todavía asigna a STORY-160 el ADR nuevo y el archivado de `CANCELED`, y CS-1 pide tocar `package.json › files` (INC-001). |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D
- **Descripción:** `epic.md` no refleja el split de STORY-160/STORY-164. § Alcance dice que `story-complete` «también archiva… las historias ya `COMPLETED/DONE` o `CANCELED/DONE`»; § Notas («Regla de archivo») dice que «STORY-160 incluye un ADR nuevo que lo reemplaza (`superseded-by`), y actualiza `AGENTS.md`, `docs/constitution.md` y `docs/domains/`»; CS-3 y CS-5 mezclan `CANCELED` y el ADR con el alcance de STORY-160. Además CS-1 (y CNF-2 de `story.md`) piden agregar el skill al arreglo `files` de `package.json`, que ya contiene `skills/` completo (design.md CR-001).
- **Archivo afectado:** `specs/flow/EPIC-27-completar-flujo-de-story/epic.md` — secciones «Alcance», «Criterios de salida» (CS-1, CS-3, CS-5) y «Notas»; `story.md` — «Criterios no funcionales específicos» (CNF-2).
- **Acción requerida:** en `epic.md`, atribuir a STORY-164 el ADR y el archivado de `CANCELED` en la nota «Regla de archivo», y reformular CS-1 como «incluidos en el paquete publicado». En `story.md`, reformular CNF-2 igual (opcional, según CR-001).

### INC-002 [WARNING]

- **Tipo:** C
- **Descripción:** el inventario de menciones de terminales de design.md (§ Context y CR-003) cubre BR-006 de `docs/domains/domain.md` (C-8, T021), pero no el resumen de `## State Models` (`docs/domains/domain.md:109`: «los terminales requieren acción humana o CI/CD»), que STORY-159 sí ajusta (su C-8). La frase sigue siendo cierta (la confirmación es una acción humana), pero T025 no la revisa y puede quedar desalineada con BR-006.
- **Archivo afectado:** `design.md` — § Componentes afectados (C-8) y CR-003; `tasks.md` — T021, T025.
- **Acción requerida:** añadir a C-8/T021 la revisión de `docs/domains/domain.md:109` (mencionar `COMPLETED` de story mediante `story-complete` con confirmación) o dejar constancia en T021 de que no requiere cambio.

### INC-003 [WARNING]

- **Tipo:** E
- **Descripción:** criterio DoD «tasks.md DEBE contener únicamente tareas atómicas»: T003 agrupa unos diez casos de prueba (cuatro filas de AC-2, `NO_STATUS`, tres variantes de fecha, `ARCHIVE_CONFLICT` y la comprobación de árbol sin cambios) y T017 cubre dos pasos del skill, la tabla de catorce códigos y `## Salida`. Son completables en una sesión, pero están en el límite de la regla (≤ 2 h). Se marca ⚠️ por la regla de duda.
- **Archivo afectado:** `tasks.md` — § 1 (T003) y § 3 (T017).
- **Acción requerida:** opcional: dividir T003 en admisión (AC-2) y fecha/destino (AC-3), y T017 en flujo (Pasos 5–6) y tabla de errores + `## Salida`.

---

## Recomendaciones

1. **INC-001:** editar `epic.md` (nota «Regla de archivo» → STORY-164; CS-1 → «incluidos en el paquete publicado») y, si se acepta CR-001, reformular CNF-2 de `story.md`. No bloquea: el diseño ya respeta el alcance real.
2. **INC-002:** ampliar T021 con la revisión de `docs/domains/domain.md:109` y añadir esa línea a la búsqueda de T025.
3. **INC-003:** si la estimación de T003 o T017 supera una sesión, dividirlas como se indica; el orden RED → GREEN no cambia.
4. **Orden de implementación:** implementar STORY-159 antes que STORY-160 (design.md D-10) para que la edición del invariante 6 y de BR-006 parta del texto sin `DELIVER`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline `--only-tasks`). La cobertura de AC-1…AC-3 está planificada en `test/story-complete.test.js` (T002–T005) y en `evals.json` (T006).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-160` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-160` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2, AC-3 en bloques `gherkin` con `Ejemplos`. |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Ver § Cobertura de Criterios de Aceptación (3/3). |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-11 con `// satisface:`; columna «AC / CNF» en Componentes e Interfaces. |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Pendiente de refinar» resuelto en D-6 (CR-002); Open Questions: ninguna bloqueante; CR-001…CR-004. |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (28 tareas). |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ⚠️ | WARNING | Los tres ACs tienen tareas; T003 y T017 en el límite de atomicidad (INC-003). |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md ausente (condición no activada). |
