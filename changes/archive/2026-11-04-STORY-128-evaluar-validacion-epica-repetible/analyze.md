---
type: analyze
id: STORY-128
slug: STORY-128-analyze-report
title: "Analyze: Evaluar la validación de épicas de forma repetible"
story: STORY-128
design: STORY-128
tasks: STORY-128
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-128-evaluar-validacion-epica-repetible
---

<!-- Referencias -->
[[STORY-128-evaluar-validacion-epica-repetible]]

# Reporte de Coherencia: Evaluar la validación de épicas de forma repetible

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada: testcases.md no está presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 18/18 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 3/3 componentes y 6/6 interfaces con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | la historia está listada y alineada con CS-9; una nota de la épica está desactualizada respecto de la historia (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Una épica de evaluación con toda la evidencia aprobada da `APPROVED`, como veredicto esperado y observado | ✓ | C1 `regresion-veredicto-approved`, sobre el «Mundo base» (Esquema de datos); forma cerrada (Interfaces); V-1 |
| AC-2 | Las tres filas del esquema (historia no terminal → `NEEDS-CHANGES`; smoke tests no ejecutables → `BLOCKED`; ambas → `NEEDS-CHANGES`), con el motivo identificado | ✓ | C1 «Variaciones del conjunto de regresión» (tres filas); D-2 (comando inexistente); aserciones con `[<VALOR>]`, `EST-01` y `OPE-01`; V-2…V-4 |
| AC-3 | `evals.json` conserva al menos un caso de cada veredicto, y repetir la ejecución da el veredicto esperado sin intervención manual | ✓ | C3 `test/epic-validate-evals.test.js` (G-B, G-D, G-E); D-4, D-7, D-8; flujos F1 y F2; V-5…V-7 |

Los requisitos no funcionales también tienen cobertura: CNF-1 (G-B), CNF-2 (D-2, `command_results`, G-F, CR-002) y CNF-3 (D-3, C2, G-C).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar las precondiciones de STORY-124/125 y el orden `verdict` → `created` del template | CR-001; D-3; «Degradación gradual» | ✓ |
| T002 | Precisar CNF-2 en `story.md`, con confirmación del PO | CR-002 | ✓ |
| T003 | Quitar STORY-128 de «Alineación pendiente» en `epic.md` | CR-003 | ✓ |
| T004 | Crear `test/epic-validate-evals.test.js` con `declaredVerdict` y funciones de validación | C3; Interfaces «Veredicto esperado de un caso» y «Mensajes de C3» | ✓ |
| T005 | Reglas G-A y G-B | C3; reglas G-A y G-B | ✓ |
| T006 | Regla G-C (forma cerrada) | C3; regla G-C; Interfaz «Forma cerrada»; D-3 | ✓ |
| T007 | Reglas G-D, G-E y G-F | C3; reglas G-D…G-F; Interfaces «Nombres» y «Resultados de comandos simulados» | ✓ |
| T008 | Pruebas negativas con manifiestos en memoria | C3; V-7 | ✓ |
| T009 | Caso `regresion-veredicto-approved` con el mundo base | C1; «Mundo base»; variación AC-1 | ✓ |
| T010 | Caso `regresion-veredicto-historia-no-terminal` | C1; variación AC-2, fila 1 | ✓ |
| T011 | Caso `regresion-veredicto-smoke-no-ejecutable` | C1; variación AC-2, fila 2; D-2 | ✓ |
| T012 | Caso `regresion-veredicto-precedencia` | C1; variación AC-2, fila 3 | ✓ |
| T013 | Revisar los cuatro casos nuevos (IDs, descripciones y tokens contractuales) | C1; D-7; D-8 | ✓ |
| T014 | Aplicar la forma cerrada a los casos existentes | C2; D-3 | ✓ |
| T015 | `node --test test/epic-validate-evals.test.js` | V-6, V-7 | ✓ |
| T016 | `npm run verify:repository` y `npm test`, y la codificación | V-8; CS-21 | ✓ |
| T017 | Registrar la ejecución manual doble de los evals | F1; V-1…V-5; D-4 | ✓ |
| T018 | `graphify update .` tras crear la prueba | C3 (archivo nuevo); regla del repositorio en `AGENTS.md` | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| C1 Conjunto de regresión del veredicto | Decisions › Componentes | T009, T010, T011, T012, T013 | ✓ |
| C2 Aserción cerrada del veredicto | Decisions › Componentes | T014 | ✓ |
| C3 Guardia de cobertura de evals | Decisions › Componentes | T004, T005, T006, T007, T008, T015 | ✓ |
| Veredicto esperado de un caso | Decisions › Interfaces | T004 | ✓ |
| Forma cerrada | Decisions › Interfaces | T006, T009–T012, T014 | ✓ |
| Invocación del conjunto de regresión | Decisions › Interfaces | T007 (G-E), T009 | ✓ |
| Resultados de comandos simulados | Decisions › Interfaces | T007 (G-F), T009, T011 | ✓ |
| Nombres de los casos de regresión | Decisions › Interfaces | T007 (G-D), T009–T013 | ✓ |
| Mensajes de C3 | Decisions › Interfaces | T004–T008 | ✓ |
| CR-001, CR-002, CR-003 | Registro de Cambios (CR) | T001, T002, T003 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` línea 57: `**STORY-128** — Evaluar la validación de épicas de forma repetible`. La línea 200 la asigna como dueña de CS-9 |
| Objetivo de la historia alineado con la épica | ✓ | «detectar regresiones antes de distribuir cambios del gateway» corresponde a CS-9 (línea 80: `evals.json` con al menos un caso APPROVED, NEEDS-CHANGES y BLOCKED). CS-21 queda cubierto con T016 |
| Restricciones de la épica respetadas | ⚠️ | La historia usa el vocabulario de la épica (`NEEDS-CHANGES` para evidencia que no cumple, `BLOCKED` para evidencia que no se puede obtener, precedencia de G-05). Pero la línea 196 de la épica todavía dice que STORY-128 usa `APPROVED` / `BLOCKED` (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** `epic.md`, en Notas › «Alineación pendiente de historias existentes» (línea 196), dice que «STORY-124 a STORY-128 todavía usan `APPROVED` / `BLOCKED` y deben alinearse». STORY-128 ya usa los tres valores: AC-2 incluye `NEEDS-CHANGES` y la precedencia, CNF-3 y las Notas también. El documento desactualizado es la épica, no la historia. design.md lo registra como CR-003.
- **Archivo afectado:** `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`, sección «Notas», línea 196
- **Acción requerida:** ejecutar T003: con confirmación del PO, cambiar «STORY-124 a STORY-128» por «STORY-124 a STORY-127» en esa línea.

---

## Recomendaciones

1. (INC-001) Aplicar T003 al refinar EPIC-23: actualizar la línea 196 de `epic.md` para que no mencione STORY-128. No bloquea la implementación.
2. (Fuera de los hallazgos) Antes de `/story-implement-tasks STORY-128`, confirmar que STORY-124 y STORY-125 ya están implementadas (CR-001, T001). Sin `OPE-01`, los casos `smoke-no-ejecutable` y `precedencia` no pueden pasar.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline `--only-tasks`).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-128` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-128` |

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 (Esquema del escenario con tres ejemplos) y AC-3 en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → C1 approved; AC-2 → C1, tres variaciones; AC-3 → C3 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals y Esquema de datos llevan `// satisface:`; Componentes, Interfaces, Decisiones y Contratos tienen columna de AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | D-1…D-8 resueltas; Open Questions: «Ninguna»; CR-001…CR-003 registrados |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (T001–T018) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Una tarea por caso de AC-1 y de cada fila de AC-2 (T009–T012); AC-3 en T004–T008 y T017 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
