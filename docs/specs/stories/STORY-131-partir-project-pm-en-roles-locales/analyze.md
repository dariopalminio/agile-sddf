---
type: analyze
id: STORY-131
slug: STORY-131-analyze-report
title: "Analyze: Partir project-pm en roles locales"
story: STORY-131
design: STORY-131
tasks: STORY-131
veredict: APPROVED
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-131-partir-project-pm-en-roles-locales
---

<!-- Referencias -->
[[STORY-131-partir-project-pm-en-roles-locales]] · [[STORY-131-partir-project-pm-en-roles-locales-design]] · [[STORY-131-partir-project-pm-en-roles-locales-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Coherencia: Partir project-pm en roles locales

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y CNF-1, CNF-2) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente |
| Alineación tareas → diseño | ✓ | 24/24 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 13/13 elementos con tarea (9 componentes + 4 interfaces) |
| Alineación con la épica EPIC-24-agentes-locales-por-skill | ✓ | Listada, objetivo alineado y restricciones respetadas (incluida la excepción de veracidad de `epic.md` › Notas) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ✓ Coherente

Regeneración del 2026-10-15, después de corregir los hallazgos del análisis anterior:

- **INC-001 (ERROR, T012):** `tasks.md:51` ahora cambia `(project-pm)` en «l.2–5, l.7 y l.8, como indica D-6».
- **INC-002 (WARNING, CR pendientes):** `story.md:69` incluye `docs/templates/vision-template.md` y `docs/guides/harness-eng-agents-orchestration.md:182`. CR-001 y CR-002 constan como aplicados (`design.md:268`, `design.md:276`).
- **INC-003 (WARNING, restricción de la épica):** `epic.md:63` añade la excepción de veracidad bajo «Fuera de alcance por ahora».

Verificaciones hechas sobre el filesystem el 2026-10-15:

- `agents/project-pm.agent.md` tiene 57 líneas y los encabezados `##` en l.16, 23, 30 y 45.
- `skills/*/assets/agents/` no existe en ninguno de los dos skills.
- `docs/templates/vision-template.md` y `skills/project-begin/assets/vision-template.md` son idénticos, y su l.8 contiene `(project-pm)`.
- Las menciones a `project-pm` coinciden con el Context de `design.md`: `skills/project-begin/SKILL.md:4,18,24,41,97,99`, `skills/project-discovery/SKILL.md:27,71`, `skills/project-begin/README.md:9`, vision-template l.2-8 y la l.182 de la guía.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Cada skill lee su propio rol de PM (`begin-intent.md`, `discovery-pm.md`), `agents/project-pm.agent.md` no existe y no se invoca `project-pm` como subagente | ✓ | Goals l.49-53; D-1 (ubicación y nombres), D-2 (formato), D-3 (cuerpo), D-4 (la sesión lee el rol en línea), D-6, D-7, D-8; componentes «Rol `begin-intent`», «Rol `discovery-pm`», «Agente global `project-pm`» y los dos orquestadores; I-1, I-2, I-4; F-1, F-3; contratos 1, 2, 3, 8 |
| AC-2 | Si falta `begin-intent`, `/project-begin` se detiene, informa la ruta y no recurre a `agents/project-pm.agent.md` | ✓ | D-5 (comprobación al final del Paso 0, sin fallback); I-3 (mensaje de error); F-2; D-8 TC-007 de `project-begin`; contratos 2, 3, 8 |
| CNF-1 | Sin pérdida de instrucciones (tabla de reparto de secciones) | ✓ | D-3 (tabla de reparto, encabezados literales); I-1; contratos 4 y 5 |
| CNF-2 | Contexto acotado (menos de 57 líneas por rol) | ✓ | D-2, D-3 (unas 40 y 37 líneas previstas); contrato 6 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar línea base (57 líneas, sin `assets/agents/`, templates idénticos) | Context «Estado medido»; D-1, D-6 | ✓ |
| T002 | Crear `discovery-pm.md` desde el original | Rol `discovery-pm`; D-1, D-2, D-3, I-1, I-2 | ✓ |
| T003 | `git mv` del agente global a `begin-intent.md` sin editar | Rol `begin-intent`; Agente global `project-pm` (eliminar); D-1 | ✓ |
| T004 | Frontmatter I-1, ajustes D-3 y borrar `## Estado Discovery` en `begin-intent.md` | Rol `begin-intent`; D-2, D-3, I-1, I-4 | ✓ |
| T005 | Textos D-6 de `project-begin/SKILL.md` (`description`, Objetivo, Dependencias) | Orquestador `project-begin`; D-6 | ✓ |
| T006 | Comprobación del rol al final del Paso 0 de `project-begin` | Orquestador `project-begin`; D-5, I-3, F-2 | ✓ |
| T007 | Paso 3 «Entrevista con el rol `begin-intent`» y l.83 «el rol no la reconstruye» | Orquestador `project-begin`; D-4, I-2, I-4, F-1 | ✓ (el cambio de l.83, en el Paso 1, no figura en D-6 ni en la fila del componente, pero aplica el mismo criterio de veracidad que D-6) |
| T008 | Textos D-6 de `project-discovery/SKILL.md` (Dependencias, Restricciones) | Orquestador `project-discovery`; D-6 | ✓ |
| T009 | Comprobación del rol al final del Paso 0 de `project-discovery` | Orquestador `project-discovery`; D-5, I-3, F-3 | ✓ |
| T010 | Reescribir Paso 4 con `$DISCOVERY_SUMMARY_PATH` y lectura del rol | Orquestador `project-discovery`; D-4, I-2, I-4, F-3 | ✓ |
| T011 | `skills/project-begin/README.md:9` | README de `project-begin`; D-6 | ✓ |
| T012 | Comentarios `# escritor:` de los dos `vision-template.md` (l.2–5, 7 y 8; l.6 con texto propio) | Template de visión; D-6, CR-001 | ✓ (coincide con `design.md:137` y con el contenido real de la l.8) |
| T013 | Reemplazar el párrafo de `docs/guides/harness-eng-agents-orchestration.md:182` | Guía de orquestación; D-7, CR-002 | ✓ |
| T014 | TC-007 y TC-008 de `project-begin` | Evals; D-8 | ✓ |
| T015 | TC-007 y TC-008 de `project-discovery` | Evals; D-8 | ✓ |
| T016 | Contratos 1 y 2 | Contratos de verificación 1, 2 | ✓ |
| T017 | Contrato 3 (`git grep project-pm`, `grep agents/`) | Contrato de verificación 3 | ✓ |
| T018 | Contrato 4 (reparto de secciones) | Contrato de verificación 4; D-3 | ✓ |
| T019 | Contrato 5 (`git diff -M main`) | Contrato de verificación 5 | ✓ (similitud medida: `begin-intent.md` conserva unos 2.350 de 3.228 bytes del original y `discovery-pm.md` unos 2.100, así que `-M` emparejará el renombrado con `begin-intent.md`) |
| T020 | Contrato 6 (`wc -l` < 57, sin `tools:`/`model:`) | Contrato de verificación 6; D-2 | ✓ |
| T021 | Codificación UTF-8 sin BOM | Restricción transversal de encoding | ✓ |
| T022 | `npm run verify:repository` | Contrato de verificación 9 | ✓ |
| T023 | Registrar el contrato 8 (evals manuales) en `implement-report.md` | Contrato de verificación 8; Risks «Evals existentes» | ✓ |
| T024 | Reinstalar y borrar `.claude/agents/project-pm.agent.md` | Risks «Entorno local» | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Rol `begin-intent` | Componentes afectados; D-1…D-3 | T003, T004 | ✓ |
| Rol `discovery-pm` | Componentes afectados; D-1…D-3 | T002 | ✓ |
| Agente global `project-pm` (eliminar) | Componentes afectados; D-1 | T003 | ✓ |
| Orquestador `project-begin` | Componentes afectados; D-4, D-5, D-6 | T005, T006, T007 | ✓ |
| Orquestador `project-discovery` | Componentes afectados; D-4, D-5, D-6 | T008, T009, T010 | ✓ |
| README de `project-begin` | Componentes afectados; D-6 | T011 | ✓ |
| Template de visión (seed y central) | Componentes afectados; D-6 | T012 | ✓ |
| Guía de orquestación | Componentes afectados; D-7 | T013 | ✓ |
| Evals | Componentes afectados; D-8 | T014, T015 | ✓ |
| I-1 — Archivo de rol entrevistador | Interfaces | T002, T004 | ✓ |
| I-2 — Variables que recibe el rol | Interfaces | T002, T007, T010 | ✓ |
| I-3 — Error de rol ausente | Interfaces | T006, T009 | ✓ |
| I-4 — Salidas del rol | Interfaces | T004, T007, T010 | ✓ |

La fila «sin cambio» de Componentes afectados (`skills/project-discovery/README.md`, `skills/project-flow/`, `package.json`, `config/runtimes.json`, tests de instalación) no requiere tarea; T022 la verifica de forma indirecta.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

Los casos de comportamiento de AC-1 y AC-2 están especificados en D-8 (TC-007 y TC-008 de cada skill) y los crean T014 y T015.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-131` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-131` disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-24-agentes-locales-por-skill

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:25` › Historias: «STORY-131 — Partir project-pm en roles locales», con los roles `begin-intent` (`project-begin`) y `discovery-pm` (`project-discovery`) como archivos de rol leídos por la sesión |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» de la historia (entrevistas que funcionan en cualquier runtime y sin depender de `agents/`) es el alcance de la épica y de ADR-0014. Cubre los criterios de salida «roles locales en `skills/<skill>/assets/agents/`» y «entrevistadores como archivos de rol» para `pm` |
| Restricciones de la épica respetadas | ✓ | La actualización general de docs sigue fuera de alcance. La excepción de `epic.md:63` permite que cada historia corrija los templates y guías que su migración deja falsos; D-6 y D-7 se limitan a eso. Los pasos 5 y 6 de `project-discovery` siguen invocando `project-ux` y `project-architect`, y así lo declaran los Non-Goals (STORY-132, STORY-133) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

1. **(Informativo)** Antes de este análisis, `story.md` estaba en `SPECIFY/DONE`, no en `PLAN/IN-PROGRESS` como espera el pipeline de planning. Este análisis la pasa a `READY-FOR-IMPLEMENT/DONE`. Conviene revisar si `story-design` o `story-plan` fijan el estado `PLAN/IN-PROGRESS` al empezar.
2. **(Informativo)** El cambio de `skills/project-begin/SKILL.md:83` que hace T007 no está en la tabla de D-6. Si `design.md` se vuelve a editar, se puede añadir allí para que la tabla esté completa.
3. **(Recordatorio de implementación)** El contrato 8 (`npm run test:eval -- project-begin` y `-- project-discovery`) es manual (T023), según `AGENTS.md`.

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), resuelto desde `sddf.config.yaml › guardrails.dod.story.plan`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (escenario con tabla de ejemplos de los dos skills) y AC-2 (error por rol ausente), en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-4, D-6…D-8; AC-2: D-5, I-3, F-2 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-8 llevan `// satisface:`; las tablas de Componentes, Interfaces y Contratos tienen columna de AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna»; CR-001 y CR-002 aplicados (`design.md:268`, `design.md:276`) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (T001…T024) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea toca un archivo o un contrato. AC-1 lo cubren T002…T005, T007, T008 y T010…T017; AC-2, T006, T014, T016 y T017 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
