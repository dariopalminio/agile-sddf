---
type: analyze
id: STORY-121
slug: STORY-121-analyze-report
title: "Analyze: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias"
story: STORY-121
design: STORY-121
tasks: STORY-121
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-121-epic-analyze-cobertura-criterios-salida
---

<!-- Referencias -->
[[STORY-121-epic-analyze-cobertura-criterios-salida]]

# Reporte de Coherencia: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y CNF-1…CNF-3 cubiertos) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 21/21 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 11/11 elementos con tarea (5 componentes + 6 interfaces) |
| Alineación con la épica EPIC-19-framework-consistency | ⚠️ | Historia no listada en el índice de la épica; el gate L2 no figura en su Alcance ni en sus criterios de salida |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 3 WARNING)

> Dependencia de orden (CR-001, verificada): `skills/epic-analyze/` **no existe** todavía en el filesystem y STORY-120 está en `READY-FOR-IMPLEMENT/DONE`. No es una inconsistencia de los artefactos (design.md › CR-001 y tasks.md › T001 la gestionan), pero STORY-121 no puede implementarse antes que STORY-120.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Contrato de salida cubierto: tabla que asocia cada criterio y `SMOKE-1` con su historia, sin hallazgos (story.md l. 28–36) | ✓ | D-1 (familia `SAL-`), D-2 (extracción `CS-n`/`SMOKE-N`), D-3 (universo), D-4 (evidencia E1/E2 + 5 ejemplos), D-6 (sección `cobertura-salida` + conteo en `resumen`), I-2, I-3, I-5, F-1, componentes "Template seed del reporte" y "Contrato del skill", TC-011 (D-8) |
| AC-2 | Huecos: criterio sin historia → ERROR; `SMOKE-2` sin historia → WARNING; sección "Criterios de salida" vacía/ausente → ERROR; sección "Smoke tests" vacía/ausente → ERROR (story.md l. 38–50) | ✓ | D-5 (catálogo `SAL-01` ERROR, `SAL-02` WARNING, `SAL-03` ERROR, `SAL-04` ERROR; mapeo explícito fila → código en l. 183–184), D-2 (placeholders = sección vacía), I-4, F-2, TC-012…TC-015 (D-8) |
| CNF-1 | Evidencia citable por asociación | ✓ | D-4 (cita `mención · story.md:<línea>` / `AC-<n> · story.md:<línea>`), D-6 (columnas `Cubierto por` / `Evidencia`), TC-016 |
| CNF-2 | Mismo reporte y veredicto; sin modificar `epic.md`/`story.md` | ✓ | D-1 (sin skill propio), D-5 (orden e integración con D-6/D-7 de STORY-120), D-7 (contenido como datos), I-6, "No se modifica" (l. 260–261), `not_contains` de bloques `=== FILE:` (D-8) |
| CNF-3 | Idempotencia | ✓ | D-2 (`CS-n` posicional), D-4 (orden E1 → E2, AC de menor número, orden por `STORY-NNN`), D-6, TC-018, contrato de verificación #6 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar existencia de `skills/epic-analyze/` y registrar línea base | CR-001; D-1, D-5, D-6 | ✓ |
| T002 | Línea base de `npm test`, `verify:eval-inventory`, `verify:links`, `test:eval -- epic-analyze` | Contratos de verificación #7, #8 | ✓ |
| T003 | Completar `input` de TC-001…TC-006, TC-008, TC-010 con contrato de salida cubierto por E1 | D-8, CR-002; componente "Casos de eval" | ✓ |
| T004 | Añadir TC-011…TC-015 | D-8; AC-1, AC-2; componente "Casos de eval" | ✓ |
| T005 | Añadir TC-016…TC-018 y `not_contains` de bloques FILE | D-8, D-3, D-4; CNF-1…CNF-3 | ✓ |
| T006 | Validar JSON, `--dry-run` y commit solo de `evals.json` | D-8 (evals antes que `SKILL.md`) | ✓ |
| T007 | Sección `cobertura-salida` y conteo en `resumen` del template seed | D-6, I-5; componente "Template seed del reporte" | ✓ |
| T008 | Vía B ampliada con `status` y cuerpo para el universo | D-3, F-3; componente "Contrato del skill" | ✓ |
| T009 | Ampliar cláusula `ai-untrusted-content-clause` | D-7 | ✓ |
| T010 | Paso nuevo de la familia `SAL-`: extracción del contrato | D-1, D-2, I-2 | ✓ |
| T011 | Regla de evidencia E1 → E2 con los cinco ejemplos | D-4, I-3 | ✓ |
| T012 | Catálogo `SAL-01…SAL-04`, supresiones, regla desactivada y orden | D-5, I-4, CR-003 | ✓ |
| T013 | Escritura de la clave `cobertura-salida` y conteo en `resumen` | D-6, I-5 | ✓ |
| T014 | Disparadores en `description`, `Objetivo`; I-1/I-3/D-7 sin cambio | D-1, I-1, I-6 | ✓ |
| T015 | Revisión de `SKILL.md` (< 500 líneas, sin encabezados de reporte, sin escrituras) | D-1, D-6; Risks (límite de 500 líneas) | ✓ |
| T016 | `CHANGELOG.md` | D-9; componente "Changelog" | ✓ |
| T017 | `domain-epic-lifecycle.md` §8 | D-9; componente "Ciclo de vida de épica" | ✓ |
| T018 | Contrato #8 y orden de commits evals → `SKILL.md` | Contrato #8, D-8 | ✓ |
| T019 | `npm run test:eval -- epic-analyze` con TC-001…TC-018 | Contratos #1–#5, #7 | ✓ |
| T020 | Ejecución real `/epic-analyze EPIC-19 --auto` dos veces | Contrato #6; Risks (EPIC-19 con varios `SAL-01`) | ✓ |
| T021 | Regresión contra línea base y encoding | Contratos #7, #8; regla UTF-8 sin BOM | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Casos de eval (`skills/epic-analyze/evals/evals.json`) | Componentes afectados l. 254; D-8 | T003, T004, T005, T006 | ✓ |
| Template seed del reporte | Componentes afectados l. 255; D-6 | T007 | ✓ |
| Contrato del skill (`skills/epic-analyze/SKILL.md`) | Componentes afectados l. 256; D-1…D-7 | T008–T015 | ✓ |
| Changelog | Componentes afectados l. 257; D-9 | T016 | ✓ |
| Ciclo de vida de épica (§8) | Componentes afectados l. 258; D-9 | T017 | ✓ |
| I-1 Invocación (sin cambio) | Interfaces l. 267 | T014 (confirma sin cambio) | ✓ |
| I-2 Extracción del contrato | Interfaces l. 268 | T010 | ✓ |
| I-3 Evaluación de cobertura | Interfaces l. 269 | T011 | ✓ |
| I-4 Hallazgo | Interfaces l. 270 | T012 | ✓ |
| I-5 Template del reporte | Interfaces l. 271 | T007, T013 | ✓ |
| I-6 Retorno en modo Agent (sin cambio) | Interfaces l. 272 | T014 (confirma sin cambio), T020 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada. (Los casos de prueba se especifican como evals TC-011…TC-018 en design.md › D-8 y tasks.md › T004–T005.)

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-121` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-121` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency (`status: DEVELOP`, `substatus: IN-PROGRESS`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ❌ | `epic.md` › `## Historias` (l. 22–33) lista STORY-086…STORY-094 y STORY-100; no contiene STORY-121 (ni STORY-120 / STORY-122). Mismo hallazgo que `STORY-120/analyze.md` › INC-001. |
| Objetivo de la historia alineado con la épica | ⚠️ | El Alcance (l. 20) busca que "el framework sea coherente consigo mismo"; un gate de coherencia épica ↔ historias encaja en ese espíritu, pero el Alcance no menciona un gate L2 `PLAN → READY-FOR-DEV`. |
| Restricciones de la épica respetadas | ✓ | Sin conflicto: el diseño no toca templates de épica ni de historia (preserva "los cinco templates centrales y sus seeds se mantienen idénticos", l. 120) y declara el escritor de la sección nueva (`escritor: epic-analyze`, D-6), en línea con el principio 13. |

---

## Inconsistencias Detectadas

### INC-001 [WARNING] RESUELTO

### INC-002 [WARNING] RESUELTO

### INC-003 [WARNING]

- **Tipo:** E (⚠️, no bloqueante): criterio DoD PLAN con evidencia parcial
- **Descripción:** Los elementos de diseño D-7 (l. 209, `// satisface: CNF-2, CNF-3`), D-9 (l. 238, `// satisface: CNF-2`) e I-6 (l. 272, `CNF-2`) trazan solo a CNF, no a un `AC-N`. El resto de las decisiones y todas las filas de componentes sí llevan `// satisface: AC-N`.
- **Archivo afectado:** `docs/specs/03-stories/STORY-121-epic-analyze-cobertura-criterios-salida/design.md` — secciones "Decisions" (D-7, D-9) e "Interfaces" (I-6)
- **Acción requerida:** Opcional: añadir el AC al que contribuyen (D-7 → AC-1 porque protege la evidencia de la tabla; D-9 → AC-1, AC-2 como en su fila de componente; I-6 → AC-2 porque los `SAL-` llegan al retorno) para homogeneizar la trazabilidad.

---

## Recomendaciones

1. **INC-001:** Resuelto.
2. **INC-002:** Resuelto.
3. **INC-003:** Opcional: en `design.md`, completar `// satisface: AC-N` en D-7, D-9 e I-6. No bloquea la implementación.
4. **Orden de implementación (CR-001):** implementar STORY-120 primero, porque T001 se detiene si `skills/epic-analyze/` no existe (hoy no existe).
5. **CR-003 / CR-004:** el Product Owner debe confirmar estas reglas: placeholder = sección vacía, clave ausente del template = regla desactivada, historias `CANCELED` excluidas y `[x]` sin exención. La confirmación debe llegar antes de T012, porque fija las aserciones de TC-014 y TC-017.
6. **Precisión menor:** `design.md` l. 119–120 y l. 320 citan "las 117 historias del repositorio"; el filesystem tiene hoy 114 directorios en `docs/specs/03-stories/`. Es solo informativo (no afecta al diseño): cambiar por "todas las historias del repositorio".

---

## Cumplimiento DoD — Fase PLAN

DoD: `docs/guardrails/dod-story-plan.md` (resuelto por `sddf.config.yaml › guardrails.dod.story.plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (l. 29–36) y AC-2 como esquema con 4 ejemplos (l. 39–50) |
| design.md existe y cubre todos los ACs con al menos un elemento por criterio | ✓ | — | AC-1 → D-1/D-2/D-3/D-4/D-6; AC-2 → D-5 (mapeo explícito l. 183–184) |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-7, D-9 e I-6 trazan solo a CNF (ver INC-003) |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad está resuelta en design.md o registrada como CR | ✓ | — | "Open Questions: Ninguna" (l. 352–354); CR-001…CR-004 registrados, con regla por defecto aplicada en CR-003/CR-004 |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001–T021) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | Cada tarea toca un solo archivo o un solo paso de verificación; AC-1 → T004 (TC-011), T007, T010, T011, T013; AC-2 → T004 (TC-012…TC-015), T012 |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md ausente (pruebas especificadas como evals en D-8 / T004–T005) |
