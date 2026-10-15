---
type: analyze
id: STORY-132
slug: STORY-132-analyze-report
title: "Analyze: Partir project-architect en roles locales"
story: STORY-132
design: STORY-132
tasks: STORY-132
created: 2026-10-15
updated: 2026-10-15
related:
  - STORY-132-partir-project-architect-en-roles-locales
---

<!-- Referencias -->
[[STORY-132-partir-project-architect-en-roles-locales]] · [[STORY-132-partir-project-architect-en-roles-locales-design]] · [[STORY-132-partir-project-architect-en-roles-locales-tasks]] · [[EPIC-24-agentes-locales-por-skill]]

# Reporte de Coherencia: Partir project-architect en roles locales

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente |
| Alineación tareas → diseño | ✓ | 23/23 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea (7 componentes + 4 interfaces) |
| Alineación con la épica EPIC-24-agentes-locales-por-skill | ✓ | Listada, objetivo alineado y restricciones respetadas (incluida la excepción de veracidad de `epic.md:63`) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ✓ Coherente

Verificaciones hechas sobre el filesystem el 2026-10-15 (rama `epic/EPIC-24-agentes-locales-por-skill`):

- `agents/project-architect.agent.md` tiene 59 líneas. Sus encabezados están en l.17 (`## Principios`), l.24 (`## Estado Discovery — Propuesta fragmentada`, con `###` en l.26, 32 y 38) y l.47 (`## Estado Planning — Propuesta de roadmap`, con `###` en l.49 y 53). `AskUserQuestion` solo aparece en `tools:` (l.11). Esto coincide con el Context de `design.md:33` y con la justificación de D-2 de decir «Rol de arquitecto» y no «Rol entrevistador».
- Las dos restricciones que D-3.2 neutraliza existen: «No resuelvas rutas ni escribas fuera de `$STAGING_DIR`» (l.30) y «Está prohibido escribir en `$SPECS_BASE`» (l.59).
- Las menciones a `project-architect` coinciden con el Context: `skills/project-planning/SKILL.md:5,17,35,95`, `skills/project-planning/README.md:7` y `skills/project-discovery/SKILL.md:27,79`. Fuera de `skills/`, las menciones están en FR-009, FR-010, NFR-015, `product/stakeholders.md`, `product/roadmap.md` y en los ADR-0013 y ADR-0014, que son inmutables. Todo eso queda fuera de alcance según los Non-Goals.
- `skills/project-discovery/SKILL.md:75` fija `$OUTPUT_PATH = .tmp/project-discovery/ux-findings.md` y la l.79 consume `$UX_FINDINGS_PATH` sin definirla. Es la brecha que corrigen D-4 y T011.
- El Paso 3 de `project-planning` (`SKILL.md:80`) vacía `.tmp/project-planning/` y el Paso 4 (l.86-91) pregunta por el story map. Por eso D-5 pone la comprobación del rol al final del Paso 0 (l.47-54).
- `skills/*/assets/agents/` no existe en ninguno de los dos skills. `project-planning` tiene TC-001…TC-007 y `project-discovery` TC-001…TC-006. Ninguno cita `project-architect`.
- ADR-0014 l.46 clasifica a `project-architect` como entrevistador y la l.134 fija los nombres `discovery-architect` y `planning`.
- STORY-131 está en `READY-FOR-IMPLEMENT/DONE` y **no está implementada**: no existe `discovery-pm.md`. Los textos de STORY-131 de los que parte este diseño (Dependencias, Restricciones y TC-007 en `STORY-131/design.md:134,135,159`) coinciden literalmente con los «antes» de D-6 y D-7.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Existen `discovery-architect.md` y `planning.md`, y `agents/project-architect.agent.md` no. `/project-planning` lee su rol `planning`, propone épicas y las agrega append-only a `product/roadmap.md` tras confirmación, como antes | ✓ | Goals l.48-53; D-1 (ubicación y nombres), D-2 (formato), D-3 (cuerpo), D-4 (la sesión lee el rol en línea), D-6 (textos) y D-7 (TC-009 de cada skill, y TC-001…TC-007 de `project-planning` como regresión); componentes «Rol `planning`», «Rol `discovery-architect`», «Agente global `project-architect`» y los dos orquestadores; I-1, I-2, I-4; F-1, F-3; contratos 1, 2, 3, 8 y 9 |
| AC-2 | Si falta `planning.md`, `/project-planning` se detiene, informa la ruta y no modifica el roadmap ni recurre a `agents/project-architect.agent.md` | ✓ | D-5 (comprobación al final del Paso 0, antes de vaciar `.tmp/` y de preguntar, sin fallback); I-3 (mensaje); F-2; D-7 TC-008 (`project-planning`) y TC-010 (`project-discovery`, extensión F-4); contratos 2, 3 y 8 |
| CNF-1 | Sin pérdida de instrucciones: Principios, Discovery y Planning repartidos entre los dos roles | ✓ | D-3 (tabla de reparto con encabezados literales); I-1; contratos 4 y 5 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Verificar línea base (STORY-131 integrada, 59 líneas, sin `assets/agents` en `project-planning`) | Risks «Orden»; Context; D-1, D-5 | ✓ |
| T002 | Crear `planning.md` desde el original, antes del `git mv` | Rol `planning`; D-1, D-2, D-3, I-1, I-2, I-4 | ✓ |
| T003 | `git mv` del agente global a `discovery-architect.md` sin editar | Rol `discovery-architect`; Agente global `project-architect` (eliminar); D-1 | ✓ |
| T004 | Frontmatter I-1, ajustes D-3 y borrado de `## Estado Planning` en `discovery-architect.md` | Rol `discovery-architect`; D-2, D-3, I-1, I-4 | ✓ |
| T005 | Textos D-6 de `project-planning/SKILL.md` (`description`, Objetivo, Dependencias, Restricciones) | Orquestador `project-planning`; D-6 | ✓ |
| T006 | Comprobación del rol al final del Paso 0 de `project-planning` | Orquestador `project-planning`; D-5, I-3, F-2 | ✓ |
| T007 | Paso 5 «Propuesta con el rol `planning`…» y l.95 | Orquestador `project-planning`; D-4, I-2, I-4, F-1, F-5 | ✓ |
| T008 | `skills/project-planning/README.md:7` | README de `project-planning`; D-6 | ✓ |
| T009 | Textos D-6 de `project-discovery/SKILL.md` (Dependencias, Restricciones) | Orquestador `project-discovery`; D-6 | ✓ |
| T010 | Añadir `discovery-architect.md` a la lista de roles del Paso 0 | Orquestador `project-discovery`; D-5, I-3, F-4 | ✓ |
| T011 | `$OUTPUT_PATH = $UX_FINDINGS_PATH = …` en el Paso 5 | Orquestador `project-discovery`; D-4, I-2, F-3 | ✓ |
| T012 | Paso 6 «Propuesta de requisitos con el rol `discovery-architect`» y l.79/l.81 | Orquestador `project-discovery`; D-4, I-2, I-4, F-3, F-5 | ✓ |
| T013 | TC-008 y TC-009 de `project-planning` | Evals; D-7 | ✓ |
| T014 | TC-009 y TC-010 de `project-discovery` y contexto de TC-007 | Evals; D-7 | ✓ |
| T015 | Contratos 1 y 2 | Contratos de verificación 1, 2 | ✓ |
| T016 | Contrato 3 (`git grep project-architect`, `grep agents/`) | Contrato de verificación 3 | ✓ |
| T017 | Contrato 4 (reparto de secciones) | Contrato de verificación 4; D-3 | ✓ |
| T018 | Contrato 5 (`git diff -M main`) | Contrato de verificación 5 | ✓ (Discovery ocupa 22 líneas y Planning 13, así que `-M` emparejará el renombrado con `discovery-architect.md`, como prevé D-1) |
| T019 | Contrato 6 (sin `tools:`/`model:`) | Contrato de verificación 6; D-2 | ✓ |
| T020 | Codificación UTF-8 sin BOM | Contrato de verificación 7 | ✓ |
| T021 | `npm run verify:repository` | Contrato de verificación 9 | ✓ (ver Recomendación 2 sobre el número de archivos) |
| T022 | Registrar el contrato 8 (evals manuales) en `implement-report.md` | Contrato de verificación 8; Risks «Evals existentes» | ✓ |
| T023 | Reinstalar y borrar `.claude/agents/project-architect.agent.md` | Risks «Entorno local» | ✓ (la copia residual existe hoy) |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Rol `planning` | Componentes afectados; D-1…D-3 | T002 | ✓ |
| Rol `discovery-architect` | Componentes afectados; D-1…D-3 | T003, T004 | ✓ |
| Agente global `project-architect` (eliminar) | Componentes afectados; D-1 | T003 | ✓ |
| Orquestador `project-planning` | Componentes afectados; D-4, D-5, D-6 | T005, T006, T007 | ✓ |
| README de `project-planning` | Componentes afectados; D-6 | T008 | ✓ |
| Orquestador `project-discovery` | Componentes afectados; D-4, D-5, D-6 | T009, T010, T011, T012 | ✓ |
| Evals | Componentes afectados; D-7 | T013, T014 | ✓ |
| I-1 — Archivo de rol de arquitecto | Interfaces | T002, T004 | ✓ |
| I-2 — Variables que recibe el rol | Interfaces | T002, T004, T007, T011, T012 | ✓ |
| I-3 — Error de rol ausente | Interfaces | T006, T010 | ✓ |
| I-4 — Salidas del rol | Interfaces | T002, T004, T007, T012 | ✓ |

La fila «sin cambio» de Componentes afectados (`skills/project-flow/`, guía de orquestación, `package.json`, `config/runtimes.json`, tests de instalación) no requiere tarea. T021 la verifica de forma indirecta.

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

D-7 especifica los casos de comportamiento de AC-1 y AC-2: TC-008 y TC-009 de `project-planning`, y TC-009 y TC-010 de `project-discovery`. Los crean T013 y T014.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-132` no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-132` disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-24-agentes-locales-por-skill

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md:26` › Historias: «STORY-132 — Partir project-architect en roles locales», con `discovery-architect` (`project-discovery`) y `planning` (`project-planning`) como archivos de rol leídos por la sesión |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (cada skill carga solo la fase de arquitectura que le toca y funciona sin `agents/`) es el alcance de la épica y de ADR-0014. Cubre los criterios de salida «roles locales en `skills/<skill>/assets/agents/`» (`epic.md:35`) y «entrevistadores como archivos de rol» para `architect` (`epic.md:36`), además de los transversales (`epic.md:33,39,40,41`) |
| Restricciones de la épica respetadas | ✓ | La actualización general de docs sigue fuera de alcance (`epic.md:62`): FR-009, FR-010, NFR-015, `stakeholders.md` y `roadmap.md` van al chore de cierre (Non-Goals, Risks). D-6 corrige solo `skills/project-planning/README.md:7`, que la propia migración dejaría falso, y eso entra en la excepción de `epic.md:63`. El Paso 5 de `project-discovery` sigue invocando `project-ux` (Non-Goals, STORY-133). Se respeta el orden 131 → 132 → 133 (T001) |

---

## Inconsistencias Detectadas

Sin inconsistencias detectadas.

---

## Recomendaciones

1. **(Bloqueo de implementación, no de plan)** STORY-131 está en `READY-FOR-IMPLEMENT/DONE`, pero no está implementada: no existe `skills/project-discovery/assets/agents/discovery-pm.md`. T001 detendrá `/story-implement-tasks STORY-132` hasta que se integre. Implementa STORY-131 primero.
2. **(Informativo, `tasks.md:64`)** T021 dice «auditoría de skills/agentes con 8 archivos en `agents/`». Ese número supone que STORY-131 ya está integrada (10 − 1 − 1) y STORY-129 todavía no. El orden sugerido en `epic.md:59` pone reverse-engineering primero. Si STORY-129 se implementa antes, quedarán 3 archivos. La auditoría enumera la carpeta de forma dinámica (`scripts/run-skill-shielder-audit.js:43-44`), así que el gate no falla, pero el texto de la tarea puede quedar falso. Conviene quitar el número o escribir «los archivos restantes de `agents/`».
3. **(Informativo)** Antes de este análisis, `story.md` estaba en `SPECIFY/DONE`, no en `PLAN/IN-PROGRESS`, que es lo que espera el pipeline de planning. Pasó lo mismo en STORY-131. Este análisis la deja en `READY-FOR-IMPLEMENT/DONE`.
4. **(Recordatorio de implementación)** El contrato 8 (`npm run test:eval -- project-planning` y `-- project-discovery`) se ejecuta a mano (T022), según `AGENTS.md`.

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`), resuelto desde `sddf.config.yaml › guardrails.dod.story.plan`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (escenario principal) y AC-2 (rol ausente), en bloques `gherkin` (`story.md:26-41`) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-4, D-6, D-7; AC-2: D-5, I-3, F-2; CNF-1: D-3 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals (l.48-53) y D-1…D-7 llevan `// satisface:`. Las tablas de Componentes, Interfaces y Contratos tienen columna de AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | «Open Questions: Ninguna» (l.247-249): D-3.2 y D-4 resuelven las dos ambigüedades. «Sin CRs detectados» (l.253) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (T001…T023) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea toca un archivo, una sección o un contrato. AC-1 lo cubren T002…T005, T007…T009, T011…T016 y T018…T021; AC-2, T006, T010, T013…T016 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
