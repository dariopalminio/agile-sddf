---
type: analyze
id: STORY-109
slug: STORY-109-analyze-report
title: "Analyze: project-begin escribe la intención en product/vision.md"
story: STORY-109
design: STORY-109
tasks: STORY-109
created: 2026-10-07
updated: 2026-10-07
related:
  - STORY-109-project-begin-escribe-vision
---

<!-- Referencias -->
[[STORY-109-project-begin-escribe-vision]]

# Reporte de coherencia: project-begin escribe la intención en product/vision.md

## Resumen ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (+ CNF-1, CNF-2) |
| Alineación tareas → diseño | ✓ | 27/27 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 17/17 elementos con tarea (9 componentes + 8 archivos de registro de D-7) |
| Cobertura de ACs en testcases.md | ⚠️ | testcases.md no presente (`--only-tasks`): cobertura de pruebas no evaluada |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ⚠️ | Alineada; 3 dependencias (CR) por propagar a historias hermanas |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (sin errores bloqueantes)

---

## Cobertura de criterios de aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | La entrevista completa la visión (todas las secciones del template, `substatus: DONE`, sin `01-projects/` ni `PROJ-*`) | ✓ | D-2 (estructura), D-3 (sin `PROJ_DIR`/WIP=1), D-4 regla 1 (secciones ausentes en la semilla), D-5 (gate → `DONE`), F-1; contratos #5, #8, #10 |
| AC-2 | Retoma según `substatus` (`TODO` / `IN-PROGRESS` / `DONE`) | ✓ | D-3 (tabla de modos), D-4 (regla de sección pendiente), D-5 (`Dejar en revisión`), F-2, F-3; contrato #9 |
| AC-3 | Sin `01-projects`, `project-intent`, `PROJ-` en `skills/project-begin/` y `project-pm`; evals pasan | ✓ | D-1 (renombrado del template), D-6 (agente sin rutas), D-8 (evals + exención), D-9 (superficie del skill); contratos #1, #2, #3 |
| CNF-1 | Template como única fuente de estructura | ✓ | D-1, D-2, D-7; contratos #4–#7 |
| CNF-2 | `vision.md` en UTF-8 sin BOM | ✓ | D-6 (regla explícita en el agente); contrato #11 |

---

## Alineación tareas ↔ diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base de `npm test`, inventario de evals, enlaces y grep | Contratos #1, #3, #7, #12 | ✓ |
| T002 | `git mv` + reescritura del seed `vision-template.md` | D-1, D-2 · Template de visión (seed) | ✓ |
| T003 | `git mv` + copia idéntica del central | D-1 · Template de visión (central) | ✓ |
| T004 | Cabecera de `SKILL.md` (descripción, entrada, precondiciones, modos, reglas) | D-1, D-3, D-9 · Skill `project-begin` | ✓ |
| T005 | Paso 1 — resolución del template | D-1, F-4 | ✓ |
| T006 | Paso 2 — estado y modo, regla de sección pendiente | D-3, D-4 | ✓ |
| T007 | Paso 3 — delegación a `project-pm` | D-6 · Interfaz skill → agente | ✓ |
| T008 | Paso 4 — gate de confirmación y `## Salida` | D-5, F-4 · Interfaz gate | ✓ |
| T009 | README de `project-begin` | D-9 · README | ✓ |
| T010 | Frontmatter e introducción del agente, estado Visión | D-6 · Agente `project-pm` | ✓ |
| T011 | Pasos del estado Visión (modos, reglas de escritura, UTF-8) | D-5, D-6 · Interfaz salida del agente | ✓ |
| T012 | Parametrizar el estado Discovery | D-6 | ✓ |
| T013 | `SHARED_TEMPLATES` en `memory-system.js` | D-7 | ✓ |
| T014 | `NINE_TEMPLATES` en `test/memory-system.test.js` | D-7 | ✓ |
| T015 | `memory-rules.md` + README semilla de `templates/` | D-7 | ✓ |
| T016 | Descripción de TC-007 de `memory-system` | D-7 | ✓ |
| T017 | Tabla y ejemplos de `sddf-init` | D-7 | ✓ |
| T018 | `skill-preflight` + `docs/templates/README.md` | D-7 | ✓ |
| T019 | `skills/project-begin/evals/evals.json` (TC-001…TC-006) | D-8 · Evals de `project-begin` | ✓ |
| T020 | Quitar la exención de `config/eval-exemptions.json` | D-8 · Inventario de excepciones | ✓ |
| T021 | Entrada `[Unreleased]` del CHANGELOG (breaking) | Componente CHANGELOG, D-7 | ✓ |
| T022 | Verificar contrato #1 | Contratos de verificación | ✓ |
| T023 | Verificar contratos #4, #5, #6 | Contratos de verificación | ✓ |
| T024 | Verificar contratos #8, #9, #10 | Contratos de verificación | ✓ |
| T025 | Verificar contratos #3, #7, #12 | Contratos de verificación | ✓ |
| T026 | Verificar contrato #2 (`npm run test:eval -- project-begin`) | Contratos de verificación | ✓ |
| T027 | Verificar contrato #11 (encoding) | Contratos de verificación | ✓ |

---

## Cobertura diseño → tareas

| Componente / interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Template de visión (seed) | D-1, D-2 | T002 | ✓ |
| Template de visión (central) | D-1 | T003 | ✓ |
| Skill `project-begin` | D-3, D-4, D-5, D-9 | T004–T008 | ✓ |
| README de `project-begin` | D-9 | T009 | ✓ |
| Evals de `project-begin` | D-8 | T019 | ✓ |
| Inventario de excepciones de evals | D-8 | T020 | ✓ |
| Agente `project-pm` | D-6 | T010–T012 | ✓ |
| `memory-system.js` | D-7 | T013 | ✓ |
| `test/memory-system.test.js` | D-7 | T014 | ✓ |
| `memory-rules.md` | D-7 | T015 | ✓ |
| README semilla de `templates/` | D-7 | T015 | ✓ |
| `memory-system/evals/evals.json` | D-7 | T016 | ✓ |
| `sddf-init/SKILL.md` | D-7 | T017 | ✓ |
| `skill-preflight/SKILL.md` | D-7 | T018 | ✓ |
| `docs/templates/README.md` | D-7 | T018 | ✓ |
| CHANGELOG | Componentes afectados | T021 | ✓ |
| Interfaces (skill → agente, salida del agente, gates, template compartido) | Interfaces | T007, T008, T011, T005 | ✓ |

---

## Vía de implementación disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| tasks.md | ✓ | `/story-implement-tasks` |
| testcases.md | — | `/story-implement` (no disponible: planificado con `--only-tasks`) |

---

## Alineación con la épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `STORY-109 — project-begin + project-pm → vision.md` (línea 32) |
| Objetivo de la historia alineado con la épica | ✓ | Una única fuente de verdad para la visión; el `substatus` de `vision.md` sustituye al proyecto activo `PROJ-NN`, tal como describe la épica |
| Restricciones de la épica respetadas | ⚠️ | Breaking change documentado en el CHANGELOG (T021), como exige la épica. El renombrado del template deja dependencias abiertas en historias hermanas (INC-001) |

---

## Inconsistencias detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica (coordinación entre historias)
- **Descripción:** el diseño registra tres dependencias que ninguna historia hermana recoge todavía: CR-001 (la semilla `memory-system/assets/scaffold/product/vision.md` sigue con 3 secciones; STORY-115 no la menciona), CR-002 (`project-flow` resuelve `project-intent-template.md` y su etapa Begin se detiene tras el renombrado hasta STORY-113) y CR-003 (`docs/architecture/memory-system.md`, `docs/constitution.md` §7/§13 y `scripts/check-doc-links.js:172` siguen citando el modelo de proyectos; corresponde a STORY-116).
- **Archivo afectado:** design.md — sección "Registro de Cambios (CR)"; story.md de STORY-113, STORY-115 y STORY-116
- **Acción requerida:** propagar cada CR al `story.md` de la historia destino antes de cerrar la épica.

### INC-002 [WARNING]

- **Tipo:** F: AC sin caso de prueba (no evaluable)
- **Descripción:** sin `testcases.md` por `--only-tasks`. La verificación de AC-1/AC-2 recae en los evals de T019 y en las revisiones de T024; no hay casos tipificados UT/CT/EV trazables.
- **Archivo afectado:** directorio de la historia — `testcases.md` ausente
- **Acción requerida:** opcional: ejecutar `/story-testcases STORY-109` si se quiere implementar con `/story-implement`.

---

## Recomendaciones

1. **INC-001:** agregar una nota en `story.md` de STORY-113 (cambiar `project-flow` a `vision-template.md` o delegar su etapa Begin en `/project-begin`), de STORY-115 (alinear la semilla de `vision.md` con los encabezados de `vision-template.md`) y de STORY-116 (arquitectura, constitución y `check-doc-links.js`).
2. **INC-002:** implementar con `/story-implement-tasks STORY-109`. T019 y T026 materializan los escenarios de AC-1/AC-2/AC-3 como evals.
3. **Observación (no bloqueante):** D-4 amplía la regla de AC-2 para `IN-PROGRESS` y trata como pendientes también las secciones del template que faltan en el archivo. Es coherente con AC-1 ("todas las secciones del template"); si se quiere que el AC lo diga, precisar la fila `IN-PROGRESS` en `story.md`.
4. **Observación (no bloqueante):** `story.md` enlaza `[[ADR-0013-eliminar-specs-01-projects]]`, que no resuelve (el slug real es `eliminar-specs-01-projects`; ver CR-002 de STORY-104). `design.md` y `tasks.md` usan el slug correcto.

---

## Cumplimiento DoD — Fase PLAN

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (Esquema con `Ejemplos` de 3 filas), AC-3 (cierre) en Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento por criterio | ✓ | — | Tabla de cobertura: 3/3 + CNF-1/CNF-2 |
| Todos los elementos de diseño tienen trazabilidad explícita (`// satisface: AC-N`) | ✓ | — | D-1…D-9 anotados; columnas "AC que satisface" en componentes e interfaces; "AC origen" en contratos |
| No hay decisiones de arquitectura aplazadas | ✓ | — | "Open Questions: Ninguna"; dependencias externas registradas como CR-001…CR-003 |
| Existe tasks.md o testcases.md | ✓ | — | tasks.md (27 tareas) |
| tasks.md contiene solo tareas atómicas para los escenarios principales | ✓ | — | Una tarea por archivo o paso del skill; AC-1/AC-2/AC-3 trazados en T006–T008, T011, T019, T022–T026 |
| testcases.md, si existe, cubre los escenarios principales | ✓ | — | No aplica: testcases.md no existe (`--only-tasks`) |
