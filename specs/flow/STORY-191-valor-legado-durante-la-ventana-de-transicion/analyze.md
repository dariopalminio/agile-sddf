---
type: analyze
id: STORY-191
slug: STORY-191-analyze-report
title: "Analyze: Valor legado durante la ventana de transición"
story: STORY-191
design: STORY-191
tasks: STORY-191
verdict: APPROVED
created: 2026-11-13
updated: 2026-11-13
related:
  - STORY-191-valor-legado-durante-la-ventana-de-transicion
---

<!-- Referencias -->
[[STORY-191-valor-legado-durante-la-ventana-de-transicion]]

# Reporte de Coherencia: Valor legado durante la ventana de transición

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1 a CNF-6) |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada: testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 14/14 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 7/7 componentes y 9/9 interfaces con tarea |
| Alineación con la épica EPIC-029-eliminar-estados-buffer | ⚠️ | listada; cubre su parte de CS-4, SMOKE-3 y su parte de CS-7; la mención del valor legado en los README de los ejecutores (D-06) puede chocar con la lista literal de CS-6 (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ (uno no aplica: testcases.md no existe) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Los ejecutores clasifican `READY-FOR-IMPLEMENT/DONE` según `implement-report.md`, avisan y pasan a `IMPLEMENT/IN-PROGRESS` (4 filas) | ✓ | C-4, C-5; D-01 (normalización en memoria), D-02 (presencia de `implement-report.md`); Interfaces «Variables del clasificador», «Aviso del valor legado», «Línea `Estado`»; «Esquema de datos» (tabla de clasificación y casos de las 4 filas); F-1 |
| AC-2 | `skill-preflight` emite un `[WARNING]` por work item legado con ruta, status y destino, sin modificar archivos (5 filas) | ✓ | C-6, C-7; D-03 (Verificación 3b fuera de la región de layout), D-04 (regla de destino), D-05 (lectura del frontmatter); Interfaces «Señal de status legado» y «Alcance del escaneo»; casos de eval de las 5 filas; F-3 |
| AC-3 | `READY-FOR-DEV` rechazado con la lista de estados admitidos; `archive/` no genera aviso | ✓ | Interfaces «Precondición de entrada» y «Línea del valor legado en el rechazo» (fila 1); «Alcance del escaneo» (fila 2); casos `ready-for-dev-rechazado-lista-estados-admitidos` y `status-legado-solo-en-archivo-no-avisa`; F-2 |

CNF: CNF-1 → Interfaz «Regla del valor legado» (texto idéntico) y mensajes con ADR-0022 y 7.0.0. CNF-2 → D-06, V-4, V-5. CNF-3 → D-05, V-6. CNF-4 → D-01 (sin reescritura). CNF-5 → D-07, F-4. CNF-6 → V-10, V-11.

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar estado de partida (ADR-0022, STORY-188 a STORY-190, líneas, evals, línea base) | Context; F-4; Risks (dependencias) | ✓ |
| T002 | Cinco casos nuevos en evals de `skill-preflight` | C-3; «Esquema de datos» (casos `skill-preflight`); D-07 | ✓ |
| T003 | Verificación 3b en `skill-preflight/SKILL.md` | C-6; D-03, D-04, D-05; Interfaces de señal, ilegible y alcance | ✓ |
| T004 | README de `skill-preflight` | C-7; D-06 | ✓ |
| T005 | Evals de `story-implement` (2 nuevos, 1 renombrado, migración D-07) | C-1; D-07; «Esquema de datos» | ✓ |
| T006 | Evals de `story-implement-tasks` (2 nuevos, migración D-07) | C-2; D-07; «Esquema de datos» | ✓ |
| T007 | Clasificador, aviso y rechazo en `story-implement` 0c.2 | C-4; D-01, D-02, D-06; Interfaces del clasificador | ✓ |
| T008 | Clasificador, aviso y rechazo en `story-implement-tasks` 1d | C-5; D-01, D-02, D-06; Interfaces del clasificador | ✓ |
| T009 | README de los ejecutores | C-7; D-06 | ✓ |
| T010 | Clasificar ocurrencias de `READY-FOR-*` y `git diff` de la región | V-4, V-5, V-7 | ✓ |
| T011 | Recorrer F-1 a F-3 contra AC-1 a AC-3 y SMOKE-3 | F-1, F-2, F-3; V-1 a V-3, V-6 | ✓ |
| T012 | Validar JSON e inventario de evals | V-8 | ✓ |
| T013 | `npm run verify:repository` y `npm test` | V-10, V-11 | ✓ |
| T014 | Sin BOM ni U+FEFF | V-12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Ubicación en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C-1 Evals de `story-implement` | Componentes afectados | T005 | ✓ |
| C-2 Evals de `story-implement-tasks` | Componentes afectados | T006 | ✓ |
| C-3 Evals de `skill-preflight` | Componentes afectados | T002 | ✓ |
| C-4 Clasificador de `story-implement` | Componentes afectados | T007 | ✓ |
| C-5 Clasificador de `story-implement-tasks` | Componentes afectados | T008 | ✓ |
| C-6 Señal de status legado de `skill-preflight` | Componentes afectados | T003 | ✓ |
| C-7 README de los tres skills | Componentes afectados | T004, T009 | ✓ |
| Regla del valor legado | Interfaces | T003, T007, T008 | ✓ |
| Precondición de entrada | Interfaces | T007, T008 | ✓ |
| Variables del clasificador | Interfaces | T007, T008 | ✓ |
| Aviso del valor legado | Interfaces | T007, T008 | ✓ |
| Línea `Estado` del bloque de inicio | Interfaces | T007, T008 | ✓ |
| Línea del valor legado en el rechazo | Interfaces | T007, T008 | ✓ |
| Señal de status legado | Interfaces | T003 | ✓ |
| Frontmatter ilegible | Interfaces | T003 | ✓ |
| Alcance del escaneo | Interfaces | T003 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-029-eliminar-estados-buffer

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `specs/flow/EPIC-029-eliminar-estados-buffer/epic.md:34` |
| Objetivo alineado | ✓ | Cubre la parte de ejecutores y `skill-preflight` de CS-4 (`epic.md:43`), SMOKE-3 completo (`epic.md:66-72`, recorrido en T011) y la parte de CS-7 de los evals de `story-implement`, `story-implement-tasks` y `skill-preflight` (`epic.md:46`). Respeta la decisión de edición manual sin `memory-system migrate` |
| Restricciones respetadas | ⚠️ | CS-6 (`epic.md:45`) solo admite menciones del valor legado en «gates de entrada de los ejecutores, `epic-analyze`, `skill-preflight` y sus evals». D-06 deja una mención en la línea de estados admitidos de `skills/story-implement/README.md` y `skills/story-implement-tasks/README.md`, que la lista no nombra literalmente (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D
- **Descripción:** D-06 y T009 conservan una mención de `READY-FOR-IMPLEMENT/DONE` en el README de cada ejecutor. CS-6 de la épica enumera los lugares donde puede quedar el valor legado («gates de entrada de los ejecutores, `epic-analyze`, `skill-preflight` y sus evals») y no nombra los README de los ejecutores. El diseño lo justifica como descripción del gate, pero el `grep` de CS-6 (y el AC-1 de STORY-193, `story.md:31-34`) lo encontrará fuera de la lista.
- **Archivo afectado:** `design.md` — sección «D-06 — Menciones de `READY-FOR-IMPLEMENT` tras la historia» (README); `tasks.md` — T009 y T010 (categoría «línea de estados admitidos de un README»).
- **Acción requerida:** decidir antes de implementar: (a) redactar la línea del README sin el literal (p. ej. «el valor legado de ADR-0022, aceptado con aviso hasta 7.0.0»), o (b) mantenerla y registrar en `epic-validate` que los README de los ejecutores describen el gate de entrada.

---

## Recomendaciones

1. **INC-001:** preferir la opción (a): en T009, describir el alias en los README de los ejecutores sin el literal `READY-FOR-IMPLEMENT` y retirar de T010 la categoría «línea de estados admitidos de un README». Así el `grep` de CS-6 queda limpio sin depender de una interpretación en `epic-validate`. Si se elige (b), anotarlo en `implement-report.md` para STORY-193.
2. **Observación (no bloqueante):** en «Esquema de datos», el caso `ready-for-dev-rechazado-lista-estados-admitidos` toma como referencia «caso de rechazo de estado existente». Ese caso es TC-012 (`estado-no-admitido-detiene-sin-modificar`), cuyo `input.story_status` es un objeto `{status, substatus}`. Al implementar T005, copiar esa forma.
3. **Observación (no bloqueante):** el caso `legado-con-implement-report-sin-fix-directives-avisa-implement-todo` (fila 3 de AC-1) no espera de forma explícita el paso por `IMPLEMENT/IN-PROGRESS`. En T006 se puede añadir a `contains` la línea `IMPLEMENT/TODO ✓  → IMPLEMENT/IN-PROGRESS` del bloque de inicio (formato de STORY-189) para cubrir el «Y pasa story.md a IMPLEMENT/IN-PROGRESS» de AC-1.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (planificación con `--only-tasks`; los casos de prueba se especifican como casos de eval en «Esquema de datos» de design.md y en T002, T005 y T006).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-191` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-191` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 a AC-3 con `Escenario`/`Dado`/`Cuando`/`Entonces` y tablas de `Ejemplos` (`story.md:30-76`) |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación»: 3/3 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ✓ | — | `// satisface:` en Goals, en cada decisión D-01 a D-07 y en «Esquema de datos»; columna «Satisface» en Componentes e Interfaces |
| No hay decisiones de arquitectura aplazadas | ✓ | — | «Open Questions: Ninguna»; ambigüedades de AC-1 y AC-2 resueltas en la Autoevaluación; «Sin CRs detectados» |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe, solo tareas atómicas para todos los escenarios principales | ✓ | — | 14 tareas con criterio «Hecho» verificable; AC-1 → T005-T008, AC-2 → T002-T004, AC-3 → T002, T003, T005, T007, T008; T011 recorre todas las filas |
| Si testcases.md existe, pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
