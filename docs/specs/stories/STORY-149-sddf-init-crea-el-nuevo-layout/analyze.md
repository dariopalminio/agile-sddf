---
type: analyze
id: STORY-149
slug: STORY-149-analyze-report
title: "Analyze: sddf-init crea el nuevo layout"
story: STORY-149
design: STORY-149
tasks: STORY-149
verdict: APPROVED
created: 2026-10-22
updated: 2026-10-22
related:
  - STORY-149-sddf-init-crea-el-nuevo-layout
---

<!-- Referencias -->
[[STORY-149-sddf-init-crea-el-nuevo-layout]]

# Reporte de Coherencia: sddf-init crea el nuevo layout

## Veredicto

**Veredicto:** `APPROVED` — sin inconsistencias

Los 4 ACs y los 3 CNF tienen elemento de diseño; las 27 tareas se trazan a una decisión, contrato o CR de `design.md`; los 7 componentes y 8 interfaces tienen tarea. `testcases.md` no se generó (modo `--only-tasks`): la Correlación 6 se omite como aviso de cobertura.

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos (más CNF-1, CNF-2, CNF-3) |
| Cobertura de ACs en testcases.md | ⚠️ | no evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 27/27 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (7 componentes + 8 interfaces) |
| Alineación con la épica EPIC-26-layout-y-flow-forward-mejorado | ✓ | listada (epic.md:24); cubre CS-3, CS-8, CS-13, SMOKE-3, SMOKE-6 |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ (uno condicional no aplicable) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Repo limpio: crea `specs/flow/`, `specs/flow/archive/`, `specs/living/`, `workflow/` con `.gitkeep`; templates en `docs/templates/`; sin `root`; sin `docs/specs/` | ✓ | D-2 (estado limpio, l.85), D-3 (tabla de directorios y `.gitkeep`, l.103), D-4 (assets sin `root`, l.126), D-7 (cierres, l.176), Esquema de datos (l.267), F-1 (l.290) |
| AC-2 | Layout legado: aviso con la ruta de la guía, no crea `specs/flow/`, `docs/specs/` sin cambios | ✓ | D-2 (estado legado y mixto, l.85), D-5 (texto del aviso y fin sin escrituras, l.142), F-2 (l.296), F-4 (l.306) |
| AC-3 | Re-ejecución: no sobrescribe en `specs/` ni `workflow/`; informa que el layout existe | ✓ | D-3 (`[YA EXISTÍA]`, sin `.gitkeep` en directorios existentes, línea `[INFO] El layout fijo ya existe…`, l.103), D-7 (cierre «Entorno ya inicializado», l.176), F-3 (l.301) |
| AC-4 | Sin `SPECS_BASE`/`SDDF_ROOT` en `skills/sddf-init/`; assets sin `root`; `.env.template` sin `SDDF_ROOT` | ✓ | D-1 (bloque de contrato, l.68), D-4 (l.126), D-6 (`.env.template` neutral, l.161), D-9 (prueba determinista, l.215), D-11 (README, l.236) |
| CNF-1 | Sin escritura en layout legado | ✓ | D-2 (legado termina sin escribir), D-5 (Paso 5b no se alcanza) |
| CNF-2 | Evals cubren AC-1 y AC-2; se reescriben/retiran los de `SDDF_ROOT`/`root` | ✓ | D-8 (tabla TC-001–TC-010, v3.0.0, l.197), D-9 (caso «Evals cubren AC-1 y AC-2») |
| CNF-3 | Declara el contrato de STORY-148 y sale de la lista transitoria | ✓ | D-1 (marcador `SDDF-FIXED-LAYOUT: v1`), D-10 (`PENDING_MIGRATION`, l.232), D-9 (caso «Contrato de layout») |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar que STORY-148 está integrada | CR-001, Risks | ✓ |
| T002 | Línea base `npm test`/`verify:repository` e inventario de greps | Context, contratos #5, #6 | ✓ |
| T003 | Crear `test/sddf-init-layout.test.js` y helpers | D-9 | ✓ |
| T004 | Casos de AC-4 (sin tokens legados, assets sin `root`, `.env.template` neutral) | D-4, D-6, D-9 | ✓ |
| T005 | Casos de contrato, layout declarado y cobertura de evals | D-9, D-10 | ✓ |
| T006 | Confirmar RED | D-9 | ✓ |
| T007 | Paso 1 con el bloque del contrato; reglas y descripción | D-1 | ✓ |
| T008 | Paso 1b con la tabla de cuatro estados | D-2 | ✓ |
| T009 | Aviso de deprecación literal | D-5 | ✓ |
| T010 | Paso 2: crear el layout fijo | D-3, F-5 | ✓ |
| T011 | Pasos 2b, 3 y 4 | D-4, D-6 | ✓ |
| T012 | Pasos 5 y 5b | D-7 | ✓ |
| T013 | Paso 6: informes y cierres | D-5, D-7 | ✓ |
| T014 | Revisión de `SKILL.md` (tokens, R4, E2E-002) | D-1 | ✓ |
| T015 | Template de configuración | D-4 | ✓ |
| T016 | Ejemplo de configuración | D-4 | ✓ |
| T017 | README | D-11 | ✓ |
| T018 | Evals v3.0.0 | D-8 | ✓ |
| T019 | Retirar `sddf-init` de `PENDING_MIGRATION` | D-10 | ✓ |
| T020 | GREEN de la prueba y del validador | contratos #5–#8 | ✓ |
| T021 | Verificar AC-4 con el comando literal | contratos #5, #6 | ✓ |
| T022 | Verificar AC-1 en sandbox | contrato #1, F-1 | ✓ |
| T023 | Verificar AC-3 en sandbox | contrato #3, F-3 | ✓ |
| T024 | Verificar AC-2, CNF-1 y estado mixto en sandbox | contratos #2, #4, F-2, F-4 | ✓ |
| T025 | `npm test` y `verify:repository` | contratos #7, #9 | ✓ |
| T026 | Alcance (`git diff --stat`), encoding y `graphify update .` | contrato #10 | ✓ |
| T027 | Registrar CR-001, CR-002 y evals a criterio humano en `implement-report.md` | CR-001, CR-002 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Protocolo de `sddf-init` (`SKILL.md`) | Componentes afectados (l.240) | T007–T014 | ✓ |
| Template de configuración | Componentes afectados | T015 | ✓ |
| Ejemplo de configuración | Componentes afectados | T016 | ✓ |
| README del skill | Componentes afectados | T017 | ✓ |
| Evals del skill | Componentes afectados | T018 | ✓ |
| Prueba determinista | Componentes afectados | T003–T006, T020 | ✓ |
| Lista transitoria del gate | Componentes afectados | T019 | ✓ |
| Bloque del contrato | Interfaces (l.254) | T007, T014 | ✓ |
| Detección de layout | Interfaces | T008 | ✓ |
| Líneas de informe nuevas | Interfaces | T010, T013 | ✓ |
| Aviso de deprecación | Interfaces | T009, T013 | ✓ |
| Cierres | Interfaces | T013 | ✓ |
| `sddf.config.yaml` generado | Interfaces | T011, T015 | ✓ |
| `.env.template` generado | Interfaces | T011 | ✓ |
| `checkSkillLayout` / `PENDING_MIGRATION` | Interfaces | T005, T019 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-26-layout-y-flow-forward-mejorado

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:24` — STORY-149 «sddf-init crea el nuevo layout» |
| Objetivo de la historia alineado con la épica | ✓ | Crea las tres raíces sin configuración (CS-8, SMOKE-3), deja de escribir `root` (CS-3), avisa ante `docs/specs/` sin estructura paralela (CS-13, SMOKE-6), retira `SPECS_BASE`/`SDDF_ROOT` del skill (CS-2) |
| Restricciones de la épica respetadas | ✓ | Mitigación «detectar sin escribir» (epic.md:112) aplicada en D-2/D-5; contenido de `workflow/` y `specs/living/` y migración automática fuera de alcance (epic.md:119) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

No hay acciones bloqueantes. Observaciones para la implementación:

1. **CR-001 (design.md l.365) — orden con STORY-148:** `story.md` › Notas › Dependencia (l.81) dice que AC-1 a AC-3 pueden desarrollarse antes que STORY-148, pero quitar `root: docs` de los assets rompe el gate actual (`scripts/audit-root-resolution.js`). T001 bloquea la implementación hasta que STORY-148 esté integrada. Conviene actualizar esa nota de `story.md` para dejar constancia de la dependencia completa.
2. **CR-002 (design.md l.371) — scaffold de `memory-system`:** con `--level full`, el scaffold seguirá creando `docs/specs/` hasta STORY-152. Pasa el requisito a STORY-152 cuando se planifique; el estado mixto de D-2 mantiene a `sddf-init` idempotente mientras tanto.
3. **Pruebas de comportamiento:** como `testcases.md` no se generó, AC-1 a AC-3 se comprueban con los evals TC-001–TC-004 (ejecución manual) y con los sandboxes de T022–T024. Si quieres que `/story-implement` esté disponible, ejecuta `/story-testcases STORY-149`.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-149` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-149` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en Gherkin que cubren los escenarios principales | ✓ | — | AC-1 a AC-4 en bloques `gherkin` con Dado/Cuando/Entonces (story.md l.26–61) |
| design.md existe y cubre todos los ACs con al menos un elemento por criterio | ✓ | — | Tabla «Cobertura de Criterios de Aceptación»: 4/4 |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1 a D-11 y el esquema de datos llevan `// satisface:`; los flujos llevan `// AC-N`; las tablas de componentes e interfaces tienen la columna «AC que satisface» |
| No hay decisiones de arquitectura aplazadas | ✓ | — | Open Questions: «Ninguna» (l.352); dependencias registradas como CR-001 y CR-002 |
| Existe tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (27 tareas) |
| Si tasks.md existe, solo contiene tareas atómicas para todos los escenarios principales | ✓ | — | Una edición o verificación por tarea; AC-1→T022, AC-2→T024, AC-3→T023, AC-4→T021; CNF-1→T024, CNF-2→T018/T005, CNF-3→T019/T005 |
| Si testcases.md existe, define pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
