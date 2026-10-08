---
type: analyze
id: STORY-112
slug: STORY-112-analyze-report
title: "Analyze: project-story-mapping y project-context-diagram escriben en product/ y architecture/c4/"
story: STORY-112
design: STORY-112
tasks: STORY-112
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-112-story-map-y-diagrama-en-sus-capas
---

<!-- Referencias -->
[[STORY-112-story-map-y-diagrama-en-sus-capas]] · [[STORY-112-story-map-y-diagrama-en-sus-capas-design]] · [[STORY-112-story-map-y-diagrama-en-sus-capas-tasks]]

# Reporte de Coherencia: project-story-mapping y project-context-diagram escriben en product/ y architecture/c4/

> Re-auditoría con `--force` (2026-10-08). Respecto del reporte anterior: INC-001 (contrato #1 ↔ evals/T006) quedó resuelto por
> design.md › CR-003; INC-002 (ruta del diagrama en la épica) quedó resuelto (`epic.md` l. 30 y l. 47 ya citan `architecture/c4/`);
> INC-004 (wikilink del ADR) quedó resuelto por CR-001 (`story.md` l. 15 y l. 20 usan `eliminar-specs-01-projects`).

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1…CNF-3) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no presente |
| Alineación tareas → diseño | ✓ | 27/27 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 17/17 elementos con tarea (10 componentes + 7 interfaces) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ✓ | Listada (l. 35), objetivo alineado, rutas coherentes con los criterios de salida (l. 46–47) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

**Estado general:** ⚠️ Advertencias (0 ERROR, 1 WARNING)

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | El story map se escribe en `docs/product/story-map.md` (personas, backbone, walking skeleton, release slices) sin crear `specs/01-projects/` | ✓ | Goals (l. 56–58); D-1 (l. 77–89, `$STORY_MAP_PATH`); D-2 (l. 98–116, insumos `product/` + `requirements/`); D-3 (l. 125–137, staging + validación de `## Personas`, `## Backbone`, `## Walking Skeleton`, `## Release slices`); D-4 (l. 147–152); D-5 (l. 160–179); D-6 (l. 188–202); Interfaces "Salida del story map"; Flujo F-1 |
| AC-2 | `/project-context-diagram --from-files` escribe `docs/architecture/c4/context-diagram.puml` desde `product/stakeholders.md` y `requirements/` sin pedir `PROJ-*` | ✓ | Goals (l. 59–60); D-1 (`$DIAGRAM_PATH`, elimina el Paso 6.1); D-7 (l. 207–223, tabla de fuentes y degradación); D-8 (l. 233–236); Interfaces "Salida del diagrama" y "Fuentes de --from-files"; Esquema de datos; Flujo F-2 |
| AC-3 | Con diagrama existente, cualquier modo pide confirmación; sin confirmación `.puml` y `.png` quedan intactos | ✓ | Goals (l. 61–62); D-9 (l. 241–250: pregunta en todos los modos, `No` por defecto, `Sin cambios`, el `.png` nunca se escribe); Interfaces "Sobrescritura del diagrama"; Flujo F-3 |
| CNF-1 | Sin rutas del modelo de proyectos (salvo aserciones `not_contains` en `evals/`); evals de ambos skills pasan | ✓ | Goals (l. 63–64); D-1, D-2, D-5, D-7, D-8, D-10; Contratos #1 (con `--exclude-dir=evals`, CR-003), #6, #7 |
| CNF-2 | `.puml` en `c4/` con nombre `context-diagram` | ✓ | D-1 (l. 88–89); Contrato #3 |
| CNF-3 | UTF-8 sin BOM | ✓ | Goals (l. 65); D-3 paso 5, D-5 Paso 7, D-9; Contrato #9 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base (tests, inventario de evals, links, root-resolution, grep CNF-1 con `--exclude-dir=evals`, chequeo STORY-107) | Contratos #1, #6, #8; CR-002, CR-003 | ✓ |
| T002 | `description` e intro del agente | D-5 (filas `description`, Intro) | ✓ |
| T003 | Variables inyectadas y Paso 0 del agente | D-5 (tabla de variables, Paso 0); D-2 | ✓ |
| T004 | Paso 6 y Paso 7 del agente (staging sin frontmatter, `## Release slices (épicas)`) | D-5 (Pasos 6–7); D-3 | ✓ |
| T005 | Criterios de calidad del agente | D-5 (fila Criterios de calidad) | ✓ |
| T006 | Cabecera de `project-story-mapping/SKILL.md` (restricción sin el literal de rutas antiguas) | D-1, D-2, D-3; CR-003; Componente "Skill project-story-mapping" | ✓ |
| T007 | Eliminar Paso 0b; Paso 1 con `$STORY_MAP_PATH` y `Sobrescribir`/`Cancelar` | D-1, D-4 | ✓ |
| T008 | Paso 2 — insumos y regla de contenido | D-2 | ✓ |
| T009 | Paso 3 delegación y Paso 4 validación del staging | D-3, D-5 | ✓ |
| T010 | Paso 5 materialización (frontmatter D-6) y Paso 6 mensaje final | D-1, D-3, D-6 | ✓ |
| T011 | README de `project-story-mapping` | Componente "README project-story-mapping" | ✓ |
| T012 | Cabecera de `project-context-diagram/SKILL.md` | D-1, D-9; Componente "Skill project-context-diagram" | ✓ |
| T013 | Modo from-files con la tabla de fuentes | D-7; Esquema de datos | ✓ |
| T014 | Degradación y fallback de ruta inexistente | D-7, D-8 | ✓ |
| T015 | Paso 6 nuevo: `$DIAGRAM_PATH` y sobrescritura en todo modo | D-1, D-9 | ✓ |
| T016 | README de `project-context-diagram` | Componente "README project-context-diagram" | ✓ |
| T017 | Reescribir los tres ejemplos (existen `test-01/02/03-*.md`); no tocar el template | Componentes "Ejemplos" y "Template PlantUML (sin cambios)"; D-7, D-8 | ✓ |
| T018 | `evals.json` de `project-story-mapping` (TC-001…TC-006) | D-10 | ✓ |
| T019 | `evals.json` de `project-context-diagram` (TC-001…TC-007) | D-10 | ✓ |
| T020 | Quitar 2 entradas de `config/eval-exemptions.json` (hoy en l. 11 y l. 41) | D-10; Componente "Exenciones de evals" | ✓ |
| T021 | Entrada BREAKING en `CHANGELOG.md` | Componente "CHANGELOG" | ✓ |
| T022 | Verificar contrato #1 (grep CNF-1 excluyendo `evals/`) | Contrato #1; CR-003 | ✓ |
| T023 | Verificar contratos #2–#5 | Contratos #2–#5 | ✓ |
| T024 | Verificar contrato #6 | Contrato #6 | ✓ |
| T025 | `npm run test:eval -- <skill>` en ambos skills | Contrato #7 | ✓ |
| T026 | Contratos del repositorio vs. línea base | Contrato #8 | ✓ |
| T027 | Verificar encoding | Contrato #9 | ✓ |

Los comandos citados existen en `package.json` (`test`, `test:installer`, `test:eval:runner`, `test:eval`, `verify:eval-inventory`, `verify:links`) y en `scripts/` (`audit-root-resolution.js`, `verify-eval-inventory.js`).

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `project-story-mapping` | Componentes afectados | T006–T010 | ✓ |
| README `project-story-mapping` | Componentes afectados | T011 | ✓ |
| Agente `project-story-mapper` | Componentes afectados / D-5 | T002–T005 | ✓ |
| Skill `project-context-diagram` | Componentes afectados | T012–T015 | ✓ |
| README `project-context-diagram` | Componentes afectados | T016 | ✓ |
| Ejemplos de `project-context-diagram` | Componentes afectados | T017 | ✓ |
| Template PlantUML (sin cambios) | Componentes afectados | T017 (restricción "no modificar") | ✓ |
| Evals (2 archivos) | Componentes afectados / D-10 | T018, T019 | ✓ |
| Exenciones de evals | Componentes afectados | T020 | ✓ |
| CHANGELOG | Componentes afectados | T021 | ✓ |
| Salida del story map | Interfaces | T010 | ✓ |
| Skill → `project-story-mapper` | Interfaces | T003, T009 | ✓ |
| `project-story-mapper` → skill (staging) | Interfaces | T004, T009 | ✓ |
| Sobrescritura del story map | Interfaces | T007 | ✓ |
| Salida del diagrama | Interfaces | T015 | ✓ |
| Fuentes de `--from-files` | Interfaces | T013 | ✓ |
| Sobrescritura del diagrama | Interfaces | T015 | ✓ |

Los contratos de verificación #1–#9 quedan cubiertos por T022–T027 (más T001 como línea base).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. Los casos de eval de D-10 / T018–T019 cubren AC-1 (story-mapping TC-001…TC-006), AC-2 (context-diagram TC-001, TC-002, TC-006, TC-007) y AC-3 (context-diagram TC-003, TC-004 y TC-005 en modo automático).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-112` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-112` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › `## Historias` (l. 35): "STORY-112 — project-story-mapping → product/; project-context-diagram → architecture/c4/: --from-files lee las capas en vez de project.md. Si el diagrama ya existe, pide confirmación antes de sobrescribir." |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (cada artefacto nace en su capa, sin copias en `specs/01-projects/`) desarrolla el alcance "única fuente de verdad" (l. 23) y el criterio de salida "Ningún skill ni agente referencia `specs/01-projects/`" (l. 49). |
| Restricciones de la épica respetadas | ✓ | Criterios de salida l. 46 (`docs/product/` contiene `story-map.md`) y l. 47 (`docs/architecture/c4/` contiene `context-diagram.puml`) coinciden con D-1. La entrada de CHANGELOG (T021) no contradice STORY-116 (guía de migración global). Dependencia de orden con STORY-107 registrada (INC-001). |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D (dependencia de implementación entre historias de la épica)
- **Descripción:** design.md › CR-002 (l. 405–412) y la nota de cabecera de tasks.md (l. 24–25) condicionan el orden: STORY-107 (migración del mapa a `product/`) no está implementada — `docs/product/story-map.md` no existe hoy (solo `vision.md`, `stakeholders.md`, `objectives.md`, `README.md`). Si STORY-112 se implementa y se ejecuta `/project-story-mapping` en este repositorio antes, STORY-107 F-3 ("si ya existe, no se sobrescribe") dejaría el mapa antiguo sin migrar. El riesgo está documentado y T001 lo comprueba, pero ninguna tarea impide la ejecución.
- **Archivo afectado:** design.md — "Registro de Cambios (CR)" › CR-002; tasks.md — nota de orden y T001
- **Acción requerida:** Respetar el orden STORY-107 → STORY-112, o no ejecutar `/project-story-mapping` en este repositorio hasta integrar STORY-107 (T025 ejecuta evals en seco, no la sesión real, así que la verificación no dispara el riesgo).

---

## Recomendaciones

1. **INC-001:** planificar STORY-107 antes que STORY-112; si no es posible, dejar constancia en `implement-report.md` de que `/project-story-mapping` no se ejecutó contra `docs/` de este repositorio durante la implementación.

---

## Cumplimiento DoD — Fase PLAN

DoD resuelto: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 (principales) y AC-3 (alternativo) en bloques `gherkin` (story.md l. 30–53) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-1…D-6; AC-2: D-1, D-7, D-8; AC-3: D-9 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals y D-1…D-10 con `// satisface:`; tablas de Componentes e Interfaces con columna de AC (CHANGELOG marcado "— (trazabilidad de release)", componente sin AC funcional) |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | Open Questions: "Ninguna"; CR-001 y CR-003 con resolución aplicada; CR-002 registrado como dependencia |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001–T027) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | AC-1: T002–T011, T018; AC-2: T012–T014, T016–T017, T019; AC-3: T015, T019; verificación T022–T027 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
