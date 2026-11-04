---
type: analyze
id: STORY-124
slug: STORY-124-analyze-report
title: "Analyze: Validar la preparación estructural de una épica"
story: STORY-124
design: STORY-124
tasks: STORY-124
verdict: APPROVED
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-124-validar-preparacion-estructural-epica
---

<!-- Referencias -->
[[STORY-124-validar-preparacion-estructural-epica]]

# Reporte de Coherencia: Validar la preparación estructural de una épica

## Veredicto
<!-- Línea según la regla de Veredicto del Paso 6. -->

**Veredicto:** `APPROVED` — sin ERROR; WARNING de tipo D, E

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (AC-2 con un valor de veredicto distinto del literal, ver INC-001) |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 15/15 elementos con tarea (7 componentes + 8 interfaces) |
| Alineación con la épica EPIC-23-completar-flujo-de-epic | ⚠️ | Listada y alineada; AC-2 y CNF-1 de `story.md` aún no reflejan decisiones de la épica (INC-001, INC-002) |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Épica con historias cerradas y análisis `APPROVED` → `epic-validate-report.md` desde su plantilla con `APPROVED` en la primera sección y en `verdict` | ✓ | Componentes `SKILL.md` y template seed; Esquema «Comprobaciones estructurales» (`EST-01`, `EST-02`), «Veredicto», «Frontmatter del reporte», «Template seed»; Flujo F1; D-3, D-9; Contrato 1 |
| AC-2 | Historia no terminal o análisis sin `APPROVED` → el reporte identifica cada historia con su estado o el análisis con su veredicto | ✓ (⚠️ valor) | Clasificación de historias, `EST-01`/`EST-02`, «Motivo» (`M-NNN` con `status/substatus` o veredicto citado); Flujos F2, F3; D-4, D-5, D-6; Contratos 2–4. El diseño emite `NEEDS-CHANGES` donde AC-2 (`story.md:43`) dice `BLOCKED` — decisión D-6 registrada como CR-001 |
| AC-3 | Identificador o ruta sin épica → error con la ubicación buscada, sin reporte | ✓ | Interfaz «Resolución de épica»; Flujo F4; D-7; Contrato 5 |
| CNF-1 | Resolución portable de la raíz de artefactos | ✓ | Componente `references/story-sources.md`, D-2, Contrato 8; lectura «solo `REPO_ROOT`» registrada como CR-002 |
| CNF-2 | Reporte legible sin marcadores; plantilla con marcador por sección y `## Veredicto` primero | ✓ | Template seed (6 secciones con marcador), Contratos 6–7, D-8 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Aplicar CR-001 y CR-002 en `story.md` (con confirmación del PO) y retirar la nota pendiente de `epic.md` | Registro de Cambios CR-001, CR-002; D-6 | ✓ |
| T002 | Scaffolding de `skills/epic-validate/` con `skill-master` | Componentes (sin `scripts/` ni `README.md`); D-1 | ✓ |
| T003 | Frontmatter de `SKILL.md` | Interfaz «Frontmatter de `SKILL.md`» | ✓ |
| T004 | Objetivo, qué hace / qué no hace, escritura única | Goals / Non-Goals; Interfaz «Escritura» | ✓ |
| T005 | Contenido untrusted | D-10 | ✓ |
| T006 | Paso 0 con marcador de layout y `REPO_ROOT` | Componente `SKILL.md`; Contrato 8; CR-002 | ✓ |
| T007 | Paso 1: argumentos y resolución de épica | Interfaces «Invocación», «Resolución de épica»; F4; D-7 | ✓ |
| T008 | Paso 2: `EST-01` cierre de historias | Esquema «Universo», «Clasificación», `EST-01`; D-2, D-3, D-4 | ✓ |
| T009 | Paso 3: `EST-02` análisis | Interfaz «Lectura de `epic-analyze-report.md`»; `EST-02`; D-5 | ✓ |
| T010 | Paso 4: veredicto y motivos | Esquema «Veredicto», «Motivo»; D-6; Puntos de variación | ✓ |
| T011 | Paso 5: template y escritura | Interfaces «Template del reporte», «Escritura»; «Frontmatter del reporte», «Template seed»; D-9 | ✓ |
| T012 | Paso 6: salida en consola | Interfaz «Salida en consola» | ✓ |
| T013 | Errores y degradación | Degradación gradual (P7) | ✓ |
| T014 | Verificación del flujo | Contratos 6–7 | ✓ |
| T015 | `references/story-sources.md` | Componente «Reglas de fuentes»; D-2 | ✓ |
| T016 | Template seed del reporte | Componente «Template seed»; Esquema «Template seed» | ✓ |
| T017 | `evals/evals.json` TC-001…TC-005 | Componente «Evals mínimos»; Contratos 1–6 | ✓ |
| T018 | Entrada en `REPORT_TEMPLATES` | Componente «Verificador del contrato»; D-8 | ✓ |
| T019 | Ajuste de `test/verify-validation-contract.test.js` | Componente «Prueba del verificador»; D-8 | ✓ |
| T020 | Fila en `domain-skills-map.md` | Componente «Mapa de skills» | ✓ |
| T021 | `APPROVED` en `SKILL.md`, sin valores heredados, tamaño | Context (regla S-3 del verificador); Contrato 7 | ✓ |
| T022 | UTF-8 sin BOM | Regla de codificación de `epic-analyze` adoptada en Interfaz «Template del reporte» / T011; regla del proyecto | ✓ |
| T023 | `verify:layout`, `verify:validation-contract`, `verify:eval-inventory` | Contratos 7–9 | ✓ |
| T024 | `npm test` y `npm run verify:repository` | Contrato 10 | ✓ |
| T025 | `graphify update .` | Regla de `AGENTS.md` (sección graphify), no un elemento de design.md | ✓ |
| T026 | Evals y SMOKE-2/SMOKE-3 como ejecución manual | Contratos 1–5; regla de `AGENTS.md` sobre `npm run test:eval` | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Skill `epic-validate` (`SKILL.md`) | Decisions › Componentes | T002–T014 | ✓ |
| Reglas de fuentes (`references/story-sources.md`) | Decisions › Componentes | T015 | ✓ |
| Template seed del reporte | Decisions › Componentes | T016 | ✓ |
| Evals mínimos | Decisions › Componentes | T017 | ✓ |
| Verificador del contrato (`REPORT_TEMPLATES`) | Decisions › Componentes | T018 | ✓ |
| Prueba del verificador | Decisions › Componentes | T019 | ✓ |
| Mapa de skills | Decisions › Componentes | T020 | ✓ |
| Invocación | Decisions › Interfaces | T007 | ✓ |
| Frontmatter de `SKILL.md` | Decisions › Interfaces | T003 | ✓ |
| Resolución de épica | Decisions › Interfaces | T007, T015 | ✓ |
| Lectura de `story.md` | Decisions › Interfaces | T005, T008 | ✓ |
| Lectura de `epic-analyze-report.md` | Decisions › Interfaces | T005, T009 | ✓ |
| Template del reporte | Decisions › Interfaces | T011 | ✓ |
| Escritura | Decisions › Interfaces | T004, T011 | ✓ |
| Salida en consola | Decisions › Interfaces | T012 | ✓ |

---

## Alineación con la Épica

**Épica padre:** EPIC-23-completar-flujo-de-epic

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `epic.md` › Historias, fase VALIDATE: «**STORY-124** — Validar la preparación estructural de una épica» |
| Objetivo de la historia alineado con la épica | ✓ | «identificar … los impedimentos antes de que la épica avance» coincide con el Alcance VALIDATE (`epic-validate` verifica la evidencia estructural y escribe `epic-validate-report.md`) y con CS-1, CS-2, CS-3, CS-5, CS-6, SMOKE-2 y SMOKE-3, que la épica asigna a STORY-124 |
| Restricciones de la épica respetadas | ⚠️ | El diseño respeta el vocabulario decidido (`epic.md` › Notas, «Vocabulario del veredicto de `epic-validate`») y SMOKE-3 (`epic.md:115`), pero `story.md` AC-2 (`story.md:43`) aún declara `BLOCKED`, como la épica reconoce en «Alineación pendiente» (`epic.md:195`). Pendiente de T001 (INC-001) |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** AC-2 de `story.md` dice «Entonces el reporte declara BLOCKED» para una historia no terminal o un análisis sin `APPROVED`. La decisión del PO en `epic.md` (Notas, vocabulario de `epic-validate`, 2026-10-17), SMOKE-3 —que esta historia cubre según `story.md:74`— y STORY-128 AC-2 exigen `NEEDS-CHANGES`. `design.md` sigue a la épica (D-6, línea 165) y reserva `BLOCKED` para el análisis ausente (D-5, línea 164; F3), con lo que la nota «veredicto binario» (`story.md:68`) queda desactualizada. El desvío está registrado (CR-001, `design.md:231`) y su corrección planificada (T001), pero mientras no se aplique, el literal de AC-2 y los evals TC-002…TC-004 se contradicen.
- **Archivo afectado:** story.md — sección "✅ Criterios de aceptación › AC-2" y "📎 Notas / contexto adicional"
- **Acción requerida:** aplicar CR-001 en `story.md` con confirmación del PO antes de implementar el resto de tareas.

### INC-002 [WARNING]

- **Tipo:** D: desalineación con la épica
- **Descripción:** CNF-1 (`story.md:55`) pide resolver la raíz «con la precedencia vigente de SDDF»; esa precedencia (`SDDF_ROOT`, `root`, `SPECS_BASE`) la retiró ADR-0017 y CS-1 de la épica exige resolver solo `REPO_ROOT`. `design.md` interpreta CNF-1 como layout fijo (CR-002, `design.md:237`).
- **Archivo afectado:** story.md — sección "⚙️ Criterios no funcionales específicos › CNF-1"
- **Acción requerida:** reescribir CNF-1 según CR-002 (incluido en T001).

### INC-003 [WARNING]

- **Tipo:** E: criterio DoD PLAN no cumplido (evidencia insuficiente, ⚠️)
- **Descripción:** Criterio «design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio»: AC-2 tiene elementos de diseño, pero su resultado observable (`NEEDS-CHANGES`) difiere del literal de AC-2 (`BLOCKED`). Por la regla de duda se evalúa ⚠️, no ❌: el desvío está justificado y registrado como CR, que el propio DoD admite («resuelta en design.md o registrada como CR»).
- **Archivo afectado:** design.md — sección "Decisions › Decisiones técnicas" (D-6) y story.md — AC-2
- **Acción requerida:** se resuelve al aplicar CR-001 (INC-001); no requiere cambios en design.md.

---

## Recomendaciones

1. Antes de `/story-implement-tasks STORY-124`, ejecutar T001 (o `/story-refine STORY-124`) para aplicar CR-001 y CR-002 en `story.md` con confirmación del PO. Si el PO rechaza CR-001 y mantiene `BLOCKED` en AC-2, corregir `design.md` (D-5, D-6, esquema «Veredicto», F2–F3) y los TC-002…TC-004 de T017 antes de implementar, porque contradirían el vocabulario de `epic.md` y SMOKE-3.
2. Al aplicar T001, retirar de `epic.md` › Notas › «Alineación pendiente de historias existentes» la mención de STORY-124 en la línea de vocabulario (`epic.md:195`) y la línea de `SPECS_BASE` (`epic.md:196`), que ya no aplica: `story.md` no contiene `SPECS_BASE`.
3. Opcional (no es hallazgo): añadir a Contratos de verificación de design.md las verificaciones de UTF-8 sin BOM y `graphify update .`, hoy justificadas solo por reglas del proyecto (T022, T025).

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada (pipeline `--only-tasks`). Los evals de T017 (TC-001…TC-005) cubren AC-1, AC-2 y AC-3.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-124` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-124` — disponible |

---

## Cumplimiento DoD — Fase PLAN

Fuente: `docs/guardrails/dod-story-plan.md` (`enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo), AC-3 (error) en bloques `gherkin` |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ⚠️ | WARNING | 3/3 ACs con elementos; AC-2 cubierto con `NEEDS-CHANGES` en lugar de `BLOCKED` (INC-003, CR-001) |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | Goals, Esquema y Flujos con `// satisface:`; tablas de Componentes, Interfaces y Decisiones con columna AC |
| No hay decisiones de arquitectura aplazadas — toda ambigüedad técnica está resuelta en design.md o registrada como CR | ✓ | — | D-1…D-10; «Open Questions: Ninguna»; CR-001, CR-002 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | 26 tareas de un archivo o sección cada una; AC-1 (T008–T011, TC-001), AC-2 (T008–T010, TC-002…TC-004), AC-3 (T007, TC-005) |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md no existe (modo `--only-tasks`) |
