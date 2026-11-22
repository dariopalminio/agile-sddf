---
type: analyze
id: STORY-110
slug: STORY-110-analyze-report
title: "Analyze: project-discovery y reverse-engineering escriben stakeholders y requisitos individuales"
story: STORY-110
design: STORY-110
tasks: STORY-110
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-110-discovery-escribe-stakeholders-y-requisitos
---

<!-- Referencias -->
[[STORY-110-discovery-escribe-stakeholders-y-requisitos]] · [[STORY-110-discovery-escribe-stakeholders-y-requisitos-design]] · [[STORY-110-discovery-escribe-stakeholders-y-requisitos-tasks]]

# Reporte de Coherencia: project-discovery y reverse-engineering escriben stakeholders y requisitos individuales

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1, CNF-2 y CNF-3 cubiertos) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 37/37 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 22/22 elementos con tarea (15 componentes + 7 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Listada y alineada; la tabla de dependencias de la épica no refleja la independencia declarada por la historia |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias — 0 ERRORs · 4 WARNINGs. Sin inconsistencias bloqueantes.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Discovery reparte su resultado en `stakeholders.md › Usuarios y roles` y un archivo por FR/NFR, sin `project.md` ni `specs/01-projects/` | ✓ | Goals (l. 63–64), D-2 (mapeo de secciones), D-3 (siempre fragmentado), D-5 (staging + materialización), D-6 pasos 7–8 (gate `Confirmar`), Interfaces "Gate de discovery", Flujo F-1 |
| AC-2 | IDs nuevos continúan la secuencia (FR-055) y ningún `FR-*`/`NFR-*` existente se sobrescribe sin confirmación, en discovery y en `reverse-engineering --update` | ✓ | D-4 (inventario y `$NEXT_*`, sin reutilizar huecos), D-5 paso 2 (reclasificación `modify`) y paso 4 (`Sobrescribir <ID>` / `Conservar` por defecto), D-7 (semántica de `--update`), Interfaces "Inventario" y "Confirmación de reescritura", Flujo F-2 |
| AC-3 | Sin `vision.md` en `substatus: DONE`, discovery se detiene sin escribir en `product/` ni `requirements/` y remite a `/project-begin` | ✓ | D-1 (tabla de estados con mensajes `❌ … Ejecuta primero /project-begin.`), Interfaces "Precondición de discovery", Flujo F-3, Contrato de verificación #4 |
| CNF-1 | Sin `01-projects`, `project.md` (destino) ni `PROJ-` en los 2 skills y 3 agentes; evals pasan | ✓ | D-9 (contratos de agentes), D-10 (evals + retirada de exenciones), Contratos #1, #2, #3, #11 |
| CNF-2 | Estructura derivada de templates de `docs/templates/` que reemplazan `project-template.md` | ✓ | D-8 (dos templates, seed + central, eliminación de `project-template.md`, 7 registros), Contratos #8, #9, #10 |
| CNF-3 | UTF-8 sin BOM | ✓ | D-5 paso 5, D-9 (reglas comunes), Contrato #12 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base (`npm test`, verificadores, greps) | Contratos de verificación #1, #3, #10, #13 | ✓ |
| T002 | Crear seed `stakeholders-template.md` | D-8, Componente "Template de stakeholders" | ✓ |
| T003 | Crear seed `requirement-template.md` | D-8, Componente "Template de requisito" | ✓ |
| T004 | Copiar seeds a `docs/templates/` (diff vacío) | D-8 (ADR-0001), Contrato #8 | ✓ |
| T005 | Crear `layer-materialization.md` (pasos 1–6) | D-5, Componente "Procedimiento de materialización", Interfaz "Materialización" | ✓ |
| T006 | Sección "Inventario y asignación de IDs" en la referencia | D-3, D-4, Interfaz "Inventario" | ✓ |
| T007 | Cabecera de `project-discovery/SKILL.md` | D-6, D-8, Componente "Skill `project-discovery`" | ✓ |
| T008 | Nuevo Paso 1 — precondición de visión | D-1, F-3, Interfaz "Precondición de discovery" | ✓ |
| T009 | Pasos 2–3 — templates e inventario | D-4, D-6, D-8, F-4 | ✓ |
| T010 | Pasos 4–6 — delegación secuencial | D-6, D-9, F-4 | ✓ |
| T011 | Pasos 7–8 — gate y materialización | D-5, D-6, F-1, F-2, Interfaz "Gate de discovery" | ✓ |
| T012 | README de `project-discovery` | Componente "README `project-discovery`" | ✓ |
| T013 | RE: eliminar Config 0b, Fase 0.2 | D-7, D-8 | ✓ |
| T014 | RE: Fase 0.3 (modo) y 0.4 | D-4, D-7 (CR-005) | ✓ |
| T015 | RE: Fases 1, 2 y 3 | D-2, D-5, D-7, F-4 | ✓ |
| T016 | README de `reverse-engineering` | Componente "README `reverse-engineering`" | ✓ |
| T017 | `project-architect` estado *Discovery* | D-2, D-5, D-9 | ✓ |
| T018 | `project-architect` estado *Planning* parametrizado | D-9 (fila *Planning*) | ✓ |
| T019 | Contrato de `project-ux` | D-9 (fila `project-ux`) | ✓ |
| T020 | `project-pm` estado *Discovery* | D-6 paso 4 (ver INC-002: el agente no figura en "Componentes afectados") | ✓ |
| T021 | `reverse-engineer-synthesizer` | D-2, D-7, D-9 | ✓ |
| T022 | `git rm` de `project-template.md` (seed + central) | D-8, Componente "`project-template.md`" | ✓ |
| T023 | `memory-system.js` `SHARED_TEMPLATES` | D-8 (registros) | ✓ |
| T024 | `test/memory-system.test.js` | D-8 (registros) | ✓ |
| T025 | `memory-rules.md` y `scaffold/templates/README.md` | D-8 (registros) | ✓ |
| T026 | `memory-system/evals/evals.json` TC-007 | D-8 (registros) | ✓ |
| T027 | `sddf-init/SKILL.md` y `skill-preflight/SKILL.md` | D-8 (registros) | ✓ |
| T028 | Evals de `project-discovery` (TC-001…TC-006) | D-10 | ✓ |
| T029 | Evals de `reverse-engineering` (TC-001…TC-004) | D-10 | ✓ |
| T030 | Quitar exenciones en `config/eval-exemptions.json` | D-10, Componente "Exenciones de evals" | ✓ |
| T031 | Entrada breaking en `CHANGELOG.md` | Componente "CHANGELOG" | ✓ |
| T032 | Verificar contrato #1 | Contratos de verificación #1 | ✓ |
| T033 | Verificar contratos #8, #9, #10 | Contratos de verificación #8–#10 | ✓ |
| T034 | Verificar contratos #4–#7, #11 | Contratos de verificación #4–#7, #11 | ✓ |
| T035 | `npm test`, `verify:eval-inventory`, `verify:links` | Contratos de verificación #3, #10, #13 | ✓ |
| T036 | `npm run test:eval` de ambos skills | Contrato de verificación #2 | ✓ |
| T037 | Verificar encoding | Contrato de verificación #12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `project-discovery` | Componentes afectados (l. 353) | T007–T011 | ✓ |
| README `project-discovery` | Componentes afectados (l. 354) | T012 | ✓ |
| Procedimiento de materialización | Componentes afectados (l. 355), D-5 | T005, T006 | ✓ |
| Template de stakeholders (seed + central) | Componentes afectados (l. 356), D-8 | T002, T004 | ✓ |
| Template de requisito (seed + central) | Componentes afectados (l. 357), D-8 | T003, T004 | ✓ |
| `project-template.md` (eliminar) | Componentes afectados (l. 358), D-8 | T022 | ✓ |
| Skill `reverse-engineering` | Componentes afectados (l. 359), D-7 | T013–T015 | ✓ |
| README `reverse-engineering` | Componentes afectados (l. 360) | T016 | ✓ |
| Agente `project-architect` | Componentes afectados (l. 361), D-9 | T017, T018 | ✓ |
| Agente `project-ux` | Componentes afectados (l. 362), D-9 | T019 | ✓ |
| Agente `reverse-engineer-synthesizer` | Componentes afectados (l. 363), D-9 | T021 | ✓ |
| Evals | Componentes afectados (l. 364), D-10 | T028, T029 | ✓ |
| Exenciones de evals | Componentes afectados (l. 365), D-10 | T030 | ✓ |
| Registros del template compartido (7 archivos) | Componentes afectados (l. 366), D-8 | T023–T027 | ✓ |
| CHANGELOG | Componentes afectados (l. 367) | T031 | ✓ |
| Interfaz: Precondición de discovery | Interfaces (l. 376) | T008 | ✓ |
| Interfaz: Inventario (skill → agente) | Interfaces (l. 377) | T006, T009, T014 | ✓ |
| Interfaz: Propuesta (agente → skill) | Interfaces (l. 378), Esquema de datos | T010, T015, T017, T021 | ✓ |
| Interfaz: Materialización | Interfaces (l. 379) | T005, T011, T015 | ✓ |
| Interfaz: Gate de discovery | Interfaces (l. 380) | T011 | ✓ |
| Interfaz: Confirmación de reescritura | Interfaces (l. 381) | T005 | ✓ |
| Interfaz: Templates | Interfaces (l. 382) | T002–T004, T009, T013 | ✓ |

Los 13 contratos de verificación del diseño tienen tarea de verificación: #1 → T032 · #2 → T036 · #3, #13 → T035 · #4–#7, #11 → T034 · #8–#10 → T033 · #12 → T037.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. Los escenarios AC-1, AC-2 y AC-3 se verifican mediante los casos de eval de D-10 (T028, T029) y las tareas de verificación T032–T037.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-110` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-110` (disponible) |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, l. 33: "STORY-110 — project-discovery + reverse-engineering + 3 agentes → stakeholders.md + un archivo por FR/NFR", con la misma regla de IDs (FR-055…) y la precondición de `vision.md` en DONE |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (requisitos concretos referenciables en lugar de un `project.md` monolítico) materializa el alcance de la épica (eliminar `01-projects/`, una fuente de verdad en `product/` y `requirements/`) y el criterio de salida "`docs/requirements/` contiene `functional/` y `non-functional/` poblados" |
| Restricciones de la épica respetadas | ⚠️ | Breaking change documentado (T031); los dos skills y tres agentes quedan sin `01-projects`. Pero la tabla "Dependencias entre historias" (`epic.md` § Notas, fila 6) sitúa la actualización de skills después del renombrado (fila 5 = STORY-108, hoy en `PLAN/IN-PROGRESS`), mientras la historia se declara independiente (story.md § Notas, "Independencia"). Ver INC-003 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E (criterio DoD PLAN evaluado como ⚠️, no bloqueante)
- **Descripción:** el criterio "Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen" se cumple en las decisiones D-1…D-10 (`// satisface:`) y en casi todo "Componentes afectados", pero la fila `CHANGELOG` declara "— (trazabilidad de release)" y el contrato de verificación #13 (`npm run verify:links`) tiene "AC origen: —". Son elementos de soporte justificados; por la regla de duda se informan como advertencia.
- **Archivo afectado:** design.md — sección "Componentes afectados" (l. 367) y "Contratos de verificación" (l. 477)
- **Acción requerida:** opcional: anotar en ambas filas el motivo de la ausencia de AC (p. ej. "transversal: release notes / integridad de wikilinks") o vincularlas a CNF-1.

### INC-002 [WARNING]

- **Tipo:** — (observación de completitud del diseño; no clasificable A–F)
- **Descripción:** `agents/project-pm.agent.md` se modifica (T020; D-6 paso 4) pero no figura en "Componentes afectados" ni tiene fila en la tabla de contratos de D-9. Su estado *Discovery* hoy lee `../skills/project-discovery/assets/project-template.md` y escribe `$SPECS_BASE/specs/01-projects/project.md` (project-pm.agent.md l. 91–144). T022 elimina `project-template.md` asumiendo que T007–T021 retiran todas sus referencias, pero T020 solo pide reorientar la salida y quitar la invocación a `project-ux`, sin mencionar explícitamente el template; y el contrato #10 (`grep -rn "project-template" skills test docs/templates`) no busca en `agents/`, por lo que una referencia residual en `project-pm` no se detectaría.
- **Archivo afectado:** design.md — secciones "Componentes afectados" y "D-9"; tasks.md — T020 y T033
- **Acción requerida:** añadir `project-pm` a "Componentes afectados" y a D-9 (entrada `$VISION_PATH`, `$STAKEHOLDERS_PATH`; salida `$OUTPUT_PATH` del resumen); precisar en T020 que el estado *Discovery* deja de citar `project-template.md` y `01-projects/project.md`; ampliar el grep de T033/contrato #10 a `agents/`.

### INC-003 [WARNING]

- **Tipo:** D (desalineación con la épica)
- **Descripción:** la tabla "Dependencias entre historias" de la épica (fila 6 "Actualizar skills que referencian rutas de `specs/`" depende de 5 "Renombrar `02-epics/` y `03-stories/`") precede al desglose STORY-109…STORY-113 y contradice tanto la nota "Orden de implementación sugerido: primero skills y scaffolding, luego migración" como la independencia declarada por STORY-110, cuyo diseño no toca rutas de `specs/`. No afecta al diseño, pero la trazabilidad de orden en la épica queda desactualizada.
- **Archivo afectado:** epic.md (EPIC-21) — sección "Notas", tabla "Dependencias entre historias"
- **Acción requerida:** actualizar la tabla de dependencias de la épica con las historias STORY-109…STORY-118 reales (STORY-110 sin dependencia de STORY-108; dependencia blanda de STORY-109 según design.md § Risks).

### INC-004 [WARNING]

- **Tipo:** — (acciones pendientes de CR sobre story.md; no clasificable A–F)
- **Descripción:** design.md registra CR-001, CR-002 y CR-005 con acciones sobre story.md que siguen sin aplicarse: la nota "Decisión abierta — secciones de `project.md` sin hogar … Hay que cerrarla antes de pasar esta historia a PLAN" sigue presente (ya resuelta en D-2), el Non-Goal de `reverse-engineering` sin `--update` describe una confirmación que no existe hoy (CR-005), y la disposición fragmentada frente a "SRS único primero" de STORY-118 (CR-001) no está precisada. El DoD se cumple (ambigüedades registradas como CR), pero la historia y el diseño no dicen lo mismo.
- **Archivo afectado:** story.md — secciones "Fuera de alcance (Non-Goals)" y "Notas / contexto adicional"
- **Acción requerida:** en una pasada de especificación, actualizar la nota de la decisión abierta para remitir a D-2, precisar el Non-Goal de RE conforme a D-7 y añadir que la disposición fragmentada rige hasta STORY-118.

---

## Recomendaciones

1. (INC-002, prioritaria antes de T022) Incluir `agents/project-pm.agent.md` en "Componentes afectados" y D-9 de design.md; ampliar T020 para retirar `project-template.md` y `01-projects/project.md` del estado *Discovery*, y extender el grep del contrato #10 / T033 a `agents/`.
2. (INC-004) Aplicar a story.md las acciones de CR-001, CR-002 y CR-005 (nota de decisión abierta → D-2; Non-Goal de RE → D-7; disposición fragmentada hasta STORY-118).
3. (INC-003) Actualizar la tabla "Dependencias entre historias" de EPIC-21 con el desglose real de historias.
4. (INC-001) Anotar en design.md el motivo de "—" en las filas `CHANGELOG` y contrato #13, o vincularlas a un CNF.
5. Observación de proceso: STORY-108 también está en `PLAN/IN-PROGRESS`; revisar la regla WIP = 1 por nivel antes de activar la implementación.

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo), AC-3 (error), todos en bloques `gherkin` |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-2/D-3/D-5/D-6; AC-2 → D-4/D-5/D-7; AC-3 → D-1 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-1…D-10 anotados; filas `CHANGELOG` y contrato #13 con "—" (INC-001) |
| No hay decisiones de arquitectura aplazadas (resueltas o registradas como CR) | ✓ | — | "Open Questions: Ninguna"; decisión abierta cerrada en D-2; ambigüedades en CR-001…CR-005 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001–T037) |
| Si tasks.md existe, contiene únicamente tareas atómicas para todos los escenarios principales | ✓ | — | Cada tarea toca un archivo o una verificación; AC-1 → T005, T010, T011, T017; AC-2 → T005, T006, T014, T015, T021; AC-3 → T008; verificación T032–T037 |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md no existe |
