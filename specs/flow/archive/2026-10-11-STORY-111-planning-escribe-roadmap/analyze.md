---
type: analyze
id: STORY-111
slug: STORY-111-analyze-report
title: "Analyze: project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allí"
story: STORY-111
design: STORY-111
tasks: STORY-111
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-111-planning-escribe-roadmap
---

<!-- Referencias -->
[[STORY-111-planning-escribe-roadmap]]

# Reporte de Coherencia: project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allí

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (más CNF-1, CNF-2 y CNF-3 cubiertos) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada: testcases.md no está presente |
| Alineación tareas → diseño | ✓ | 35/35 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 22/22 elementos con tarea; un caso de eval de D-9 se trasladó incompleto a T025 (INC-002) |
| Alineación con la épica EPIC-21-colapsar-specs-dos-niveles | ✓ | Listada como STORY-111; objetivo y restricciones alineados |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 2 WARNING): no bloquean la implementación.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Con ≥ 1 FR y sin `roadmap.md`, `/project-planning` confirmado crea `docs/product/roadmap.md` con la propuesta (objetivo, historias, criterios de éxito); no crea `project-plan.md` ni `specs/01-projects/` | ✓ | D-1, D-2 (template), D-3 (bloque de épica), D-4 (precondición ≥ 1 FR), D-5, D-6 (staging, gate `Confirmar`/`Cancelar`, materialización con roadmap inexistente), D-7 (agente *Planning*); interfaces "Precondición de planning", "Skill → agente", "Agente → skill", "Gate de planning"; flujo F-1; contratos #3 y #4 |
| AC-2 | Sobre un roadmap con `## Épicas` y `## Plan original (2026-04-20)`, la propuesta nueva se agrega con su fecha sin cambiar esas secciones | ✓ | D-1 (encabezado `## Propuesta (AAAA-MM-DD[ #n])`, append-only), D-6 (inserción antes del pie, solo cambia `updated:`), interfaces "Encabezado de propuesta" y "Secciones protegidas"; flujo F-2; contrato #5 |
| AC-3 | Con una propuesta de 3 épicas nuevas, `/epic-from-project-plan` crea 3 `EPIC-NN-<slug>/epic.md` numerados desde el mayor `EPIC-NN`; sin `roadmap.md` no crea nada y remite a `/project-planning` | ✓ | D-8 (Fase 0 sin roadmap → `❌ … Ejecuta /project-planning`, última propuesta, `$MAX_EPIC + 1`, existencia por slug), D-3; interfaces "Lectura del roadmap" y "Numeración de épicas"; flujo F-3; contrato #6; caso de eval TC-009 de D-9 |

Los criterios no funcionales también están cubiertos: CNF-1 (D-4, D-7, D-8, D-9; contrato #1), CNF-2 (D-2; contratos #2, #3 y #8) y CNF-3 (D-6, D-7; contrato #9).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base (`npm test`, `verify:eval-inventory`, `verify:links`, greps) y comprobación de STORY-106/108/110 | Contratos #1, #2, #7 y #8; D-4 (`$EPICS_DIR`) | ✓ |
| T002 | Crear el template seed: frontmatter, cita, `## Épicas`, `## Propuesta (…)` con el contrato de encabezado | D-1, D-2 | ✓ |
| T003 | Bloque modelo `### Épica <N>: <Nombre>`, `### Resumen` y pie | D-2, D-3 | ✓ |
| T004 | Copia central idéntica al seed | D-2 (ADR-0001) | ✓ |
| T005 | Cabecera de `project-planning/SKILL.md` (description, entrada, precondiciones, reglas) | D-2, D-4, D-6; componente "Skill `project-planning`" | ✓ |
| T006 | Nuevo Paso 1: precondición de FR y aviso de visión | D-4, F-4 | ✓ |
| T007 | Paso 2 (template central → seed) y Paso 3 (`$EPICS_INVENTORY`, `$PROPOSAL_HEADING`, staging) | D-2, D-4, D-6 | ✓ |
| T008 | Story map previo | D-5 | ✓ |
| T009 | Delegación en `project-architect` y validación del staging | D-6 (paso 4), D-7 | ✓ |
| T010 | Gate `Confirmar`/`Cancelar` | D-6 (paso 5); interfaz "Gate de planning" | ✓ |
| T011 | Materialización (roadmap nuevo o inserción antes del pie), UTF-8 sin BOM, mensaje final | D-1, D-6, F-1, F-2 | ✓ |
| T012 | README de `project-planning` | Componente "README `project-planning`" | ✓ |
| T013 | Reescribir `## Estado Planning` del agente | D-7; interfaces "Skill → agente" y "Agente → skill" | ✓ |
| T014 | Eliminar el modelo de proyectos del estado *Planning*, `description` y tabla de variables | D-7 | ✓ |
| T015 | `epic-from-project-plan`: quitar 0b, Fase 0 con `$ROADMAP_PATH`, textos | D-8 | ✓ |
| T016 | Fase 1: última `## Propuesta (…)` y parseo de bloques | D-1, D-3, D-8 | ✓ |
| T017 | Fases 2 y 3a: `$MAX_EPIC + 1`, existencia por slug, `-bis` | D-8; interfaz "Numeración de épicas" | ✓ |
| T018 | Fase 3d (`parent: null`, `status: DEFINE`), Fase 4 y README | D-8 | ✓ |
| T019 | `git rm` de las dos copias de `project-plan-template.md` | D-2; componente "`project-plan-template.md` (seed + central)" | ✓ |
| T020 | Anotación `parent` del template de épica (seed + central) | D-8; componente "Template de épica" | ✓ |
| T021 | Prosa de `epic-creation` (SKILL + README) | D-8; componente "`epic-creation`" | ✓ |
| T022 | `memory-system.js` y `test/memory-system.test.js` | D-2 (registros) | ✓ |
| T023 | `memory-rules.md`, scaffold README, evals de `memory-system` | D-2 (registros) | ✓ |
| T024 | `sddf-init`, `skill-preflight` (SKILL + evals) | D-2 (registros) | ✓ |
| T025 | Crear evals de `project-planning` (TC-001…TC-007) | D-9 | ✓ |
| T026 | Reescribir evals de `epic-from-project-plan` v2.0.0 (TC-001…TC-011) | D-9 | ✓ |
| T027 | Quitar `project-planning` de `config/eval-exemptions.json` | D-9; componente "Exenciones de evals" | ✓ |
| T028 | Entrada breaking en `CHANGELOG.md` | Componente "CHANGELOG" | ✓ |
| T029 | Verificar el contrato #1 | Contrato #1 | ✓ |
| T030 | Verificar los contratos #2 y #3 | Contratos #2 y #3 | ✓ |
| T031 | Verificar los contratos #4 y #6 | Contratos #4 y #6 | ✓ |
| T032 | Verificar el contrato #5 con un fixture | Contrato #5 | ✓ |
| T033 | `npm test`, `verify:eval-inventory`, `verify:links` | Contratos #7 y #8 | ✓ |
| T034 | `npm run test:eval` de ambos skills | Contrato #7 | ✓ |
| T035 | Verificar el contrato #9 (encoding) | Contrato #9 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `project-planning` | Componentes afectados | T005–T011 | ✓ |
| README `project-planning` | Componentes afectados | T012 | ✓ |
| Template del roadmap (seed + central) | Componentes afectados / D-2 | T002–T004 | ✓ |
| `project-plan-template.md` (seed + central) | Componentes afectados / D-2 | T019 | ✓ |
| Agente `project-architect` (*Planning* + `description`) | Componentes afectados / D-7 | T013, T014 | ✓ |
| Skill `epic-from-project-plan` | Componentes afectados / D-8 | T015–T018 | ✓ |
| README `epic-from-project-plan` | Componentes afectados | T018 | ✓ |
| Template de épica (anotación `parent`) | Componentes afectados / D-8 | T020 | ✓ |
| `epic-creation` (prosa) | Componentes afectados | T021 | ✓ |
| Evals (ambos skills) | Componentes afectados / D-9 | T025, T026 | ⚠️ T025 omite una aserción de TC-004 (INC-002) |
| Exenciones de evals | Componentes afectados / D-9 | T027 | ✓ |
| Registros del template compartido (8 archivos) | Componentes afectados / D-2 | T022–T024 | ✓ |
| CHANGELOG | Componentes afectados | T028 | ✓ |
| Precondición de planning | Interfaces | T006 | ✓ |
| Skill → agente (*Planning*) | Interfaces | T009, T013 | ✓ |
| Agente → skill (staging) | Interfaces | T009, T013 | ✓ |
| Gate de planning | Interfaces | T010 | ✓ |
| Encabezado de propuesta | Interfaces / D-1 | T002, T007, T016 | ✓ |
| Secciones protegidas | Interfaces / D-6 | T011, T032 | ✓ |
| Lectura del roadmap | Interfaces / D-8 | T015, T016 | ✓ |
| Numeración de épicas | Interfaces / D-8 | T017 | ✓ |
| Template (central → seed → `❌`) | Interfaces / D-2 | T007 | ✓ |

Las consumidoras de `project-plan-template.md` listadas en el Context de design.md coinciden con `git grep -n project-plan-template -- skills agents scripts test config` (verificado el 2026-10-08). Las únicas referencias no incluidas en D-2 son `skills/epic-from-project-plan/evals/evals.json:37`, que T026 reescribe, y `skills/project-flow/SKILL.md:215`, diferida a STORY-113 por CR-001.

---

## Alineación con la Épica

**Épica padre:** EPIC-21-colapsar-specs-dos-niveles

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` § Historias, línea 34: "**STORY-111** — project-planning → roadmap.md; epic-from-project-plan lee de allí: Replanificar agrega una propuesta nueva sin tocar la lista de épicas reales ni el plan original." |
| Objetivo de la historia alineado con la épica | ✓ | El "Para" (roadmap como única fuente del plan de épicas, sin `project-plan.md` en `01-projects/`) concreta el alcance de la épica: "una única fuente de verdad para la visión y el plan del producto". AC-2 implementa el resumen de la épica para STORY-111. |
| Restricciones de la épica respetadas | ✓ | Breaking change documentado (T028). Contribuye a los criterios de salida "Ningún skill ni agente referencia `specs/01-projects/`" (CNF-1) y "`docs/product/` contiene `roadmap.md`". La referencia que queda en `project-flow` está asignada a STORY-113 dentro de la misma épica (CR-001), sin violar el alcance. |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** E (criterio DoD PLAN no evaluable con certeza; ⚠️ por regla de duda)
- **Descripción:** El criterio DoD "Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen" se cumple en D-1…D-9 (`// satisface: …`), en Goals y en Interfaces. En cambio, dos filas de la tabla de componentes no tienen AC: "`epic-creation` (texto 'sin `project-plan.md` previo')" → `— (veracidad)` y "CHANGELOG" → `— (trazabilidad de release)`.
- **Archivo afectado:** design.md, sección "Componentes afectados" (filas `epic-creation` y `CHANGELOG`)
- **Acción requerida:** Opcional. Vincular la fila de `epic-creation` a CNF-1 (retira la remisión a `project-plan.md` como artefacto) y aceptar `CHANGELOG` como trazabilidad de release sin AC. No bloquea porque ambos son cambios de soporte sin comportamiento.

### INC-002 [WARNING]

- **Tipo:** C (elemento de diseño implementado parcialmente)
- **Descripción:** D-9, fila "planning TC-004", exige en `not_contains` las cadenas `roadmap.md:` (como escrito) y `✅`. T025 traslada solo `no ✅` a TC-004. La garantía "sin FR no se escribe el roadmap" queda menos cubierta en el eval.
- **Archivo afectado:** tasks.md, sección "8. Evals de ambos skills", T025 (TC-004), frente a design.md § "D-9 — Evals", tabla, fila planning TC-004
- **Acción requerida:** Al implementar T025, agregar a TC-004 la aserción `not_contains` acordada en D-9, o simplificar la fila de D-9 si esa cadena resulta frágil.

---

## Recomendaciones

1. **INC-001:** en design.md § "Componentes afectados", cambiar la columna "AC que satisface" de la fila `epic-creation` a `CNF-1 (veracidad)`. Mantener `CHANGELOG` como trazabilidad de release. Opcional, no bloquea.
2. **INC-002:** en tasks.md, T025, ampliar TC-004 a `no roadmap.md: (escrito), no ✅` para alinearlo con D-9, o aplicarlo directamente al implementar.
3. **Observación sin hallazgo:** no existe testcases.md, así que solo está habilitada la vía `/story-implement-tasks`. Si se quiere usar `/story-implement` (TDD orquestado), ejecutar `/story-testcases STORY-111`. Los casos de D-9 y los contratos #1…#9 ya dan una base directa para esos casos.
4. **Observación sin hallazgo (orden de integración):** T001 ya comprueba si STORY-106, STORY-108 y STORY-110 están integradas. Si STORY-110 aún no se ha implementado, conviene implementar T014 (tabla de variables del agente) después de ella para evitar conflictos en `agents/project-architect.agent.md` (Risks del diseño).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: cobertura de pruebas no evaluada.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-111` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-111` |

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan = dod-story-plan`), `enforcement: error`.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1, AC-2 y AC-3 en bloques `gherkin` con Dado/Cuando/Entonces (y Pero) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-4/D-6/D-7; AC-2 → D-1/D-6; AC-3 → D-8 (ver la tabla de cobertura) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ⚠️ | WARNING | D-1…D-9 y Goals con `// satisface:`; dos filas de Componentes con `—` (INC-001) |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna"; ambigüedades y dependencias registradas en CR-001…CR-004 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001…T035) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea apunta a un archivo o paso concreto. AC-1 → T005–T011, T013; AC-2 → T007, T010, T011, T032; AC-3 → T015–T018. Verificación en T029–T035 |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe |
