---
type: analyze
id: STORY-168
slug: STORY-168-analyze-report
title: "Analyze: Skill epic-track-progress"
story: STORY-168
design: STORY-168
tasks: STORY-168
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-168-skill-epic-track-progress
---

<!-- Referencias -->
[[STORY-168-skill-epic-track-progress]]

# Reporte de Coherencia: Skill epic-track-progress

## Veredicto

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 4/4 criterios cubiertos |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente (modo `--only-tasks`) |
| Alineación tareas → diseño | ✓ | 23/23 tareas con diseño o regla del proyecto |
| Cobertura diseño → tareas | ✓ | 13/13 elementos con tarea |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | Listada y alineada; D-3 diverge de la invariante 3 de `domain-epic-lifecycle` sin dueño explícito para el ajuste (INC-001) |
| Cumplimiento DoD — Fase PLAN | ✓ | 7/7 criterios ✓ |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Todas terminadas (2 `DELIVER/DONE` activas + 1 `COMPLETED/DONE` archivada) → fila por historia con ubicación, «todas terminadas» y sugerencia `/epic-validate EPIC-NN` | ✓ | Componentes (SKILL.md, `references/story-sources.md`), Esquema «Fila de historia» y «Clasificación del resultado», Formato de salida (`✅ …`), Flujo F1, D-2, D-3, D-4, D-6 (design.md:52-115, 130-137) |
| AC-2 | Una `IMPLEMENT/IN-PROGRESS` → «no todas terminadas», identifica la pendiente con status/substatus, ningún archivo cambia | ✓ | Clasificación (fila «cualquier otro par» → `pendiente`), Formato `⏳ …`, línea `ℹ️ Solo lectura`, Flujo F2, D-7 (design.md:84-104, 117-118, 136) |
| AC-3 | `STORY-200` del índice sin directorio → «no encontrada» y «no todas terminadas» | ✓ | Clasificación (fila ID sin directorio), Flujo F3, D-5 (design.md:91, 120-121, 134) |
| AC-4 | `EPIC-77` inexistente → informa la ruta buscada y termina con error | ✓ | Interfaz «Resolución de épica», Flujo F4 (`❌ No se encontró la épica <arg>: no existe specs/flow/<arg>-*/epic.md`) (design.md:70, 123-124) |

CNF-1…CNF-5 también tienen cobertura: CNF-1 (D-1, D-7, Contrato 7), CNF-2 (D-2, D-6), CNF-3 (Contrato 6, T005), CNF-4 y CNF-5 (D-1, D-2, Decisiones de complejidad justificada, Contrato 8).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Crear el skill con `skill-master` (solo `SKILL.md`, `references/`, `evals/`) | Componentes (nota «No se crea `assets/` …»), D-1; nota de story.md «se debe usar skill-master» | ✓ |
| T002 | Frontmatter de `SKILL.md` | Interfaz «Frontmatter de `SKILL.md`» | ✓ |
| T003 | Objetivo, Qué hace / Qué NO hace, regla de solo lectura | Goals / Non-Goals, D-7 | ✓ |
| T004 | Regla de contenido untrusted | D-8, Interfaz «Lectura de `story.md`» | ✓ |
| T005 | Paso 0 con marcador de layout fijo | Contrato 6 (CNF-3) | ✓ |
| T006 | Paso 1: resolver épica y error F4 | Interfaces «Invocación» y «Resolución de épica», Flujo F4 | ✓ |
| T007 | Paso 2: cargar la referencia, Vía A, Vía B, unión con `origen` | Flujo F1 pasos 2-5, D-2, D-6, Esquema «Fila de historia» | ✓ |
| T008 | Paso 3: tabla de clasificación y regla global | Esquema «Clasificación del resultado», D-3, D-4, D-5 | ✓ |
| T009 | Paso 4: salida en chat | Formato de salida, Flujos F1-F3 | ✓ |
| T010 | Tabla de errores y degradación | Degradación gradual (P7), Flujo F4 | ✓ |
| T011 | `references/story-sources.md` | Componente «Reglas de cruce», D-2, D-6 | ✓ |
| T012 | `evals/evals.json` TC-001…TC-005 | Componente «Evals», Contratos 1-5 | ✓ |
| T013 | Casos de borde de pertenencia y huérfana en los evals | D-2, D-6, Risks (prefijo `EPIC-300`) | ✓ |
| T014 | Fila en `domain-skills-map.md` | Componente «Mapa de skills» | ✓ |
| T015 | Fila en `sddf-commands-pipeline.md` | Componente «Pipeline de comandos» | ✓ |
| T016 | Aplicar CR-001 a story.md y epic.md | Registro de Cambios CR-001 | ✓ |
| T017 | Presupuesto de líneas y `description` | Contrato 8 | ✓ |
| T018 | Ninguna instrucción de escritura | Contrato 7 | ✓ |
| T019 | UTF-8 sin BOM | Regla de encoding del proyecto (no figura en Contratos de verificación de design.md) | ✓ |
| T020 | `verify-fixed-layout` y `verify:eval-inventory` | Contratos 6 y 9 | ✓ |
| T021 | `npm test` y `npm run verify:repository` | Contrato 10 (CS-21) | ✓ |
| T022 | `graphify update .` | Regla de `AGENTS.md` (sección graphify), no un elemento de design.md | ✓ |
| T023 | Evals y SMOKE-6 como ejecución manual | Contratos 1-5, regla de `AGENTS.md` sobre `npm run test:eval` | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `epic-track-progress` (`SKILL.md`) | Decisions › Componentes | T001-T010 | ✓ |
| Reglas de cruce (`references/story-sources.md`) | Decisions › Componentes | T011 | ✓ |
| Evals (`evals/evals.json`) | Decisions › Componentes | T012, T013 | ✓ |
| Mapa de skills (`domain-skills-map.md`) | Decisions › Componentes | T014 | ✓ |
| Pipeline de comandos (`sddf-commands-pipeline.md`) | Decisions › Componentes | T015 | ✓ |
| Invocación | Decisions › Interfaces | T006 | ✓ |
| Frontmatter de `SKILL.md` | Decisions › Interfaces | T002 | ✓ |
| Resolución de épica | Decisions › Interfaces | T006, T011 | ✓ |
| Lectura de `story.md` | Decisions › Interfaces | T004, T007 | ✓ |
| Salida | Decisions › Interfaces | T009 | ✓ |
| Clasificación del resultado (D-3, D-4, D-5) | Decisions › Esquema de datos | T008 | ✓ |
| Degradación gradual (P7) | Decisions › Degradación gradual | T010 | ✓ |
| CR-001 | Registro de Cambios (CR) | T016 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › Historias, fase DEVELOP: `- [ ] **STORY-168** — Skill epic-track-progress` (línea F2) |
| Objetivo de la historia alineado con la épica | ✓ | El «Para» (pasar a `/epic-validate` solo sin historias pendientes) coincide con el Alcance › DEVELOP («semáforo de solo lectura») y con la nota «Posición de `epic-validate`»; cubre CS-16, su parte de CS-12 y SMOKE-6 |
| Restricciones de la épica respetadas | ⚠️ | CS-12: `package.json › files` ya publica `skills/` (design.md:31) ✓. Nota «Historia terminada (gate de `DEVELOP`)» deja el trato de `CANCELED/DONE` a esta historia y D-3 lo decide ✓. Pero la misma nota cita la invariante 3 de `domain-epic-lifecycle` («todas en `DELIVER`»), con la que D-3 diverge, y T016 delega la aclaración a STORY-171 sin que su alcance la incluya (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D
- **Descripción:** D-3 (design.md:132) deja pasar el gate `DEVELOP → VALIDATE` con historias `CANCELED/DONE`, mientras que `docs/domains/domain-epic-lifecycle.md` §7 invariante 3 y §8 «Gate de completitud de historias» exigen que **todas** las historias estén en `DELIVER`. CR-001 (design.md:198) y T016 delegan la aclaración del dominio a STORY-171, pero el alcance de STORY-171 en `epic.md` (Historias, fase COMPLETED) se limita al ADR de archivo de épicas y a los escritores de `COMPLETED`; nadie es dueño del ajuste de la invariante 3. Mientras tanto, `epic-track-progress` y `epic-validate` (STORY-124, «estado terminal de las historias», CS-3) podrían clasificar distinto una épica con una historia cancelada.
- **Archivo afectado:** design.md — sección "Registro de Cambios (CR) › CR-001"; tasks.md — sección "5. Integración en el framework › T016"
- **Acción requerida:** Asignar un dueño explícito al ajuste de la invariante 3: incluirlo en esta historia (una tarea que edite `domain-epic-lifecycle.md` §7 y §8 para decir «todas en `DELIVER` o `COMPLETED`, salvo las `CANCELED/DONE`») o registrarlo en la nota de STORY-171 o STORY-124, y alinear el criterio «terminal» de STORY-124 con D-3.

---

## Recomendaciones

1. **INC-001:** con `/story-fix-plan STORY-168`, reemplazar en tasks.md la parte final de T016 («queda para STORY-171») por una tarea nueva en el grupo 5 que actualice `docs/domains/domain-epic-lifecycle.md` §7 invariante 3 y §8 «Gate de completitud de historias» con la regla de D-3, y añadir el componente correspondiente (modificar `domain-epic-lifecycle.md`) a la tabla Componentes de design.md. Alternativa: si el PO prefiere no tocar el dominio en esta historia, anotar en `specs/flow/STORY-124-*/story.md` (Notas) que «estado terminal» incluye `CANCELED/DONE` según D-3 de STORY-168.
2. Opcional (no es hallazgo): añadir a Contratos de verificación de design.md las verificaciones de UTF-8 sin BOM y `graphify update .`, hoy justificadas solo por reglas del proyecto (T019, T022).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline ejecutado con `--only-tasks`). Los casos TC-001…TC-005 de T012 cubren AC-1…AC-4 en `evals/evals.json`.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-168` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-168` — disponible |

---

## Cumplimiento DoD — Fase PLAN

`docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1…AC-4 en bloques `gherkin`: principal, alternativo, inconsistencia y error |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | 4/4 (tabla de cobertura arriba) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Columna «AC que satisface» en Componentes, Interfaces y Decisiones técnicas; `// satisface:` en Goals, Esquema, Formato y Flujos |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | D-1…D-8 resueltas; «Open Questions: Ninguna»; la ambigüedad de `CANCELED/DONE` decidida en D-3 y registrada como CR-001 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 23 tareas acotadas a un archivo o una verificación; AC-1 (T007-T009, T012), AC-2 (T008-T009, T012), AC-3 (T008, T010, T012), AC-4 (T006, T012) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe (condición no activada) |
