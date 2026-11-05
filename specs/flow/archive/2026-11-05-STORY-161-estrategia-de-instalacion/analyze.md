---
type: analyze
id: STORY-161
slug: STORY-161-analyze-report
title: "Analyze: Estrategia de instalación"
story: STORY-161
design: STORY-161
tasks: STORY-161
verdict: APPROVED
created: 2026-10-25
updated: 2026-10-25
related:
  - STORY-161-estrategia-de-instalacion
---

<!-- Referencias -->
[[STORY-161-estrategia-de-instalacion]]

# Reporte de Coherencia: Estrategia de instalación

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y 4/4 CNF) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 29/29 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 16/16 elementos con tarea |
| Alineación con la épica EPIC-27-completar-flujo-de-story | ✓ | Listada en la épica; cumple CS-4 y SMOKE-3 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | `--strategy story --target claude-code` instala todo salvo `epic-*` y el resumen nombra la estrategia | ✓ | D-1 (filtro en `install.js`), D-2 (catálogo `INSTALL_STRATEGIES`), D-6 (`copyDir` con `shouldCopy`), D-7 (agentes dentro del skill), D-8 (resumen y resultado), F-1 |
| AC-2 | Resolución según flag y TTY: `full` explícito, default `full` sin TTY, pregunta con TTY | ✓ | D-3 (`resolveInstallStrategy`, `undefined` → `full`), D-5 (`promptStrategySelection` independiente del prompt de runtime), F-2 |
| AC-3 | `--strategy epic` → código ≠ 0, mensaje con valor y válidos, sin copiar | ✓ | D-3 (error de la API), D-4 (`exitInvalidStrategy` antes del bloque asíncrono), F-3 |
| CNF-1 | Validación antes de cualquier escritura | ✓ | D-4, F-3 |
| CNF-2 | Sin flag ni TTY idéntico al actual; combinable con `--global`, `--target`, `--force` | ✓ | D-6 (`excluded = 0` con `full`), D-8 (alcance de «idéntico»), D-9 (`--force` no toca `epic-*`) |
| CNF-3 | `USAGE` documenta `--strategy` | ✓ | D-10 (`USAGE`, `tech-stack.md`, `AGENTS.md`, `README.md`) |
| CNF-4 | Pruebas en `test/` y gates en verde | ✓ | Contratos de verificación #1–#10 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Imports y helper `epicSkillNames()` en las pruebas | Interfaces › Exportaciones; Contratos #1 | ✓ |
| T002 | Prueba `resolveInstallStrategy` | D-3; Contratos #7 | ✓ |
| T003 | Prueba `installSDDF` con `story` | D-1, D-6, D-8; Contratos #1 | ✓ |
| T004 | Prueba `installSDDF` con `full` y sin estrategia | D-3, D-6; Contratos #3 | ✓ |
| T005 | Prueba `--force` + `story` y `--global` | D-9; Contratos #8 | ✓ |
| T006 | Prueba `promptStrategySelection` con `PassThrough` | D-5; Contratos #6 | ✓ |
| T007 | Prueba CLI `--strategy story` | D-4, D-8; Contratos #2 | ✓ |
| T008 | Prueba CLI sin flag ni TTY | D-5, F-2; Contratos #4 | ✓ |
| T009 | Prueba CLI valores inválidos y sin valor | D-4, F-3; Contratos #5 | ✓ |
| T010 | Prueba de `--help` | D-10; Contratos #9 | ✓ |
| T011 | Corrida RED de `test:installer` | Contratos de verificación (ciclo TDD) | ✓ |
| T012 | Catálogo `INSTALL_STRATEGIES`, `VALID_STRATEGIES`, `DEFAULT_STRATEGY` | D-2; Esquema de datos | ✓ |
| T013 | `resolveInstallStrategy` | D-3; Interfaces | ✓ |
| T014 | `copyDir` con `shouldCopy` y `strategyId` | D-6; Interfaces | ✓ |
| T015 | `installSDDF`: resolver estrategia y filtrar solo `skills/` | D-1, D-7 | ✓ |
| T016 | Líneas de resumen y objeto devuelto | D-8 | ✓ |
| T017 | `promptStrategySelection` | D-5; Interfaces | ✓ |
| T018 | `module.exports` | Componentes afectados › `module.exports` | ✓ |
| T019 | Imports, parseo y `exitInvalidStrategy` en `cli.js` | D-4 | ✓ |
| T020 | Validación temprana de `--strategy` | D-4, F-3 | ✓ |
| T021 | Prompt condicionado a TTY y paso de `strategy` | D-5, F-2 | ✓ |
| T022 | `USAGE` | D-10 | ✓ |
| T023 | Corrida GREEN y refactor opcional | Contratos de verificación (ciclo TDD) | ✓ |
| T024 | `docs/architecture/tech-stack.md` | D-10 | ✓ |
| T025 | `AGENTS.md`, tabla `## Comandos` | D-10 | ✓ |
| T026 | `README.md`, sección «Instalación en tu runtime» | D-10 | ✓ |
| T027 | `npm test` y `npm run verify:repository` | Contratos #10 | ✓ |
| T028 | Verificación manual de AC-2 con TTY | D-5, F-2 | ✓ |
| T029 | `graphify update .` | Grupo «Verificación final»; regla de `AGENTS.md` tras modificar código | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Catálogo de estrategias | Componentes afectados; D-2; Esquema de datos | T012 | ✓ |
| `resolveInstallStrategy(strategy)` | Componentes afectados; D-3; Interfaces | T013 (prueba T002) | ✓ |
| `promptStrategySelection(streams?)` | Componentes afectados; D-5; Interfaces | T017 (prueba T006) | ✓ |
| `copyDir(…, { force, shouldCopy, strategyId })` | Componentes afectados; D-6; Interfaces | T014 | ✓ |
| `installSDDF(options)` — estrategia, filtro, resumen | Componentes afectados; D-1, D-7, D-8; Interfaces | T015, T016 (pruebas T003, T004) | ✓ |
| `module.exports` | Componentes afectados; Interfaces | T018 | ✓ |
| Parseo y validación de `--strategy` en `cli.js` | Componentes afectados; D-4; Interfaces (CLI) | T019, T020 (prueba T009) | ✓ |
| Prompt condicionado a TTY en `cli.js` | D-5; F-2 | T021 (pruebas T008, T028) | ✓ |
| `USAGE` | Componentes afectados; D-10 | T022 (prueba T010) | ✓ |
| Pruebas en `test/install.test.js` | Componentes afectados; Contratos #1–#9 | T001–T010 | ✓ |
| Documentación del comando | Componentes afectados; D-10 | T024, T025, T026 | ✓ |
| `--force` + `story` no toca `epic-*` | D-9 | T005, T014 | ✓ |
| Agentes sin filtro adicional | D-7 | T015 | ✓ |
| Degradación (E/S, prompt, API) | F-4 | T013, T017 | ✓ |
| Esquema de datos del catálogo | Esquema de datos | T012 | ✓ |
| Gates finales | Contratos #10 | T027 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-27-completar-flujo-de-story

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § «Instalador» — `**STORY-161** — Estrategia de instalación` |
| Objetivo de la historia alineado con la épica | ✓ | El alcance de la épica incluye «Instalador: estrategia `full` (épica + story) o `story` (sin los skills `epic-*`), con flag y prompt interactivo». CS-4 coincide con AC-1, AC-2 y AC-3; SMOKE-3 coincide con AC-1 |
| Restricciones de la épica respetadas | ✓ | Notas › Instalación: «la estrategia `story` solo excluye los skills con prefijo `epic-*`». D-2 fija `excludedSkillPrefixes: ['epic-']` y los non-goals dejan fuera las demás familias |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

Sin acciones obligatorias. Observaciones que no bloquean:

1. `design.md` › «Registro de Cambios (CR)» › CR-001: con `--strategy story`, 16 `SKILL.md` no-epic siguen sugiriendo comandos `/epic-*` que no estarán instalados. Está fuera del alcance de la historia y registrado; conviene abrir una historia de seguimiento en EPIC-27 o en la siguiente épica.
2. `tasks.md` › T028: la fila «con TTY» de AC-2 se verifica a mano a nivel CLI; la función de menú tiene prueba automática (T006), pero la condición `process.stdin.isTTY` en `cli.js` no. Es aceptable porque replica el patrón existente de `--target`, que tampoco tiene prueba automática.
3. Antes de `/story-implement` (que requiere `testcases.md`), ejecutar `/story-testcases STORY-161` si se quiere esa vía; con el plan actual la vía disponible es `/story-implement-tasks`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-161` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-161` (disponible) |

---

## Cumplimiento DoD — Fase PLAN

Archivo: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo con tabla de ejemplos), AC-3 (error), todos en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | Ver «Cobertura de Criterios de Aceptación»: 3/3 AC y 4/4 CNF |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-10, Goals y Esquema de datos llevan `// satisface:`; las tablas de Componentes e Interfaces tienen columna «AC que satisface»; los flujos F-1…F-3 indican su AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; el pendiente de la historia (`--force` + `story`) se resuelve en D-9; CR-001 registra la dependencia de texto `/epic-*` |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 29 tareas con un único entregable cada una; AC-1 (T003, T007, T012–T016), AC-2 (T004, T006, T008, T013, T017, T021, T028), AC-3 (T002, T009, T019, T020) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: `testcases.md` no existe (modo `--only-tasks`) |
