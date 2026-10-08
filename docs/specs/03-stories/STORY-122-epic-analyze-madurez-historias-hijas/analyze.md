---
type: analyze
id: STORY-122
slug: STORY-122-analyze-report
title: "Analyze: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica"
story: STORY-122
design: STORY-122
tasks: STORY-122
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-122-epic-analyze-madurez-historias-hijas
---

<!-- Referencias -->
[[STORY-122-epic-analyze-madurez-historias-hijas]]

# Reporte de Coherencia: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 2/2 criterios cubiertos (y CNF-1…CNF-3 cubiertos) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 21/21 tareas con diseño |
| Cobertura diseño → tareas | ⚠️ | 11/11 elementos con tarea (5 componentes + 6 interfaces); 1 obligación cruzada de evals sin tarea (INC-003) |
| Alineación con la épica EPIC-19-framework-consistency | ✓ | Alineada |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR, 4 WARNING)

> Dependencia de orden (CR-001, verificada el 2026-10-08): `skills/epic-analyze/` **no existe** en el filesystem; STORY-120 y STORY-121 están en `READY-FOR-IMPLEMENT/DONE`. No es una inconsistencia de los artefactos (design.md › CR-001 y tasks.md › T001 la gestionan), pero STORY-122 no puede implementarse antes que STORY-120.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Historias hijas en `SPECIFY/DONE` con `related` resolubles → sin hallazgos de madurez (story.md l. 28–34) | ✓ | D-2 (universo), D-3 (`SPECIFY/DONE` → lista), D-4 (resolución por ID), D-5 (l. 170–172: AC-1 → ningún `MAD-`), D-6 (conteo `Madurez de historias hijas: <l>/<t> listas`), I-2, I-5, F-1, componentes "Template seed del reporte" y "Contrato del skill", TC-019 (D-8) |
| AC-2 | `SPECIFY/IN-PROGRESS` → WARNING citando `STORY-202` + `completar su especificación con /story-specify`; `related: STORY-999` inexistente → WARNING citando `STORY-999` + `corregir o retirar la referencia` (story.md l. 36–47) | ✓ | D-5 (catálogo `MAD-01`/`MAD-02` con las acciones literales de AC-2, mapeo fila → código l. 170–172), D-3, D-4, I-3, I-4, F-2, TC-020/TC-021 (D-8) |
| CNF-1 | Estado mínimo `SPECIFY/DONE` o posterior; `CANCELED` sin hallazgo (story.md l. 51) | ✓ | D-2 (exclusión de `CANCELED`), D-3 (tabla de clasificación con orden de `domain-story-lifecycle` §4.1/§5), CR-003, CR-004 (`MAD-03`), TC-022, TC-024 |
| CNF-2 | Mismo reporte y veredicto (regla de STORY-120); sin modificar `epic.md`/`story.md` (story.md l. 52) | ✓ | D-1 (familia dentro del skill, D-7 de STORY-120 sin cambio), D-5 (todos WARNING), D-6, D-7 (frontmatter como datos), I-4, I-6, "No se modifica" (design.md l. 250–251), `not_contains` de bloques `=== FILE:` (D-8) |
| CNF-3 | Idempotencia (story.md l. 53) | ✓ | D-5 (orden determinista integrado `INT-` < `MAD-` < `SAL-`), D-2 (universo determinista), TC-025, contrato de verificación #7 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Comprobar existencia de `skills/epic-analyze/`, registrar línea base y si STORY-121 está implementada | CR-001; D-1, D-5, D-6, D-8 | ✓ |
| T002 | Línea base de `npm test`, `verify:eval-inventory`, `verify:links`, `test:eval -- epic-analyze` | Contratos de verificación #8, #9 | ✓ |
| T003 | Completar `input` de TC-001…TC-006, TC-008, TC-010 (y TC-011…TC-018 si STORY-121 existe) con `status`/`related` válidos | D-8, CR-002; componente "Casos de eval" | ✓ |
| T004 | Añadir TC-019…TC-021 (AC-1, AC-2 filas 1 y 2) | D-8; AC-1, AC-2; componente "Casos de eval" | ✓ |
| T005 | Añadir TC-022…TC-025 y `not_contains` de bloques FILE | D-8, D-3, D-4; CNF-1…CNF-3; CR-003, CR-004 | ✓ |
| T006 | Validar JSON, `--dry-run` y commit solo de `evals.json` | D-8 (evals antes que `SKILL.md`) | ✓ |
| T007 | Campo de madurez en `resumen` del template seed | D-6, I-5; componente "Template seed del reporte" | ✓ |
| T008 | Vía B ampliada con `status`/`substatus`/`related` + universo | D-2, I-2; componente "Contrato del skill"; CR-001 | ✓ |
| T009 | Paso `MAD-` con lista ordenada de estados y regla de estado mínimo | D-1, D-3; CR-004 | ✓ |
| T010 | Regla de resolución de `related` | D-4, I-3, F-3 | ✓ |
| T011 | Catálogo `MAD-01…MAD-03`, orden integrado, veredicto sin cambio | D-5, I-4 | ✓ |
| T012 | Relleno de `hallazgos` y del campo de `resumen` | D-6, I-5 | ✓ |
| T013 | Cláusula `ai-untrusted-content-clause` ampliada | D-7 | ✓ |
| T014 | `description`, `Objetivo`, invocación y retorno sin cambio | D-1, I-1, I-6 | ✓ |
| T015 | Revisión de `SKILL.md` (< 500 líneas, sin `.tmp/`, sin leer cuerpo) | D-1, D-2; Risks (límite de 500 líneas) | ✓ |
| T016 | `CHANGELOG.md` | D-9; componente "Changelog" | ✓ |
| T017 | `domain-epic-lifecycle.md` §8 | D-9; componente "Ciclo de vida de épica" | ✓ |
| T018 | Checklist de skills, inventario de evals, cláusula y orden de commits | Contratos de verificación #9; D-8 | ✓ |
| T019 | `npm run test:eval -- epic-analyze` | Contratos de verificación #1–#6, #8 | ✓ |
| T020 | Ejecución real sobre EPIC-19 dos veces | Contrato de verificación #7; CNF-3 | ✓ |
| T021 | Regresión contra la línea base y encoding | Contratos de verificación #8, #9 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Casos de eval (`evals.json`) | Componentes afectados (l. 244); D-8 | T003, T004, T005, T006 | ✓ |
| Template seed del reporte | Componentes afectados (l. 245); D-6 | T007 | ✓ |
| Contrato del skill (`SKILL.md`) | Componentes afectados (l. 246); D-1…D-7 | T008–T015 | ✓ |
| Changelog | Componentes afectados (l. 247); D-9 | T016 | ✓ |
| Ciclo de vida de épica (§8) | Componentes afectados (l. 248); D-9 | T017 | ✓ |
| I-1 Invocación | Interfaces (l. 257) | T014 | ✓ |
| I-2 Lectura de madurez | Interfaces (l. 258) | T008 | ✓ |
| I-3 Resolución de referencia | Interfaces (l. 259) | T010 | ✓ |
| I-4 Hallazgo | Interfaces (l. 260) | T011 | ✓ |
| I-5 Template del reporte | Interfaces (l. 261) | T007, T012 | ✓ |
| I-6 Retorno en modo Agent | Interfaces (l. 262) | T014 | ✓ |
| Obligación cruzada de evals con STORY-121 (STORY-121 › design.md › CR-002, l. 368; STORY-122 › D-8, l. 225–226) | D-8 "Mundos de TC-001…TC-018" | — (ninguna tarea cubre los mundos de TC-019…TC-025 frente a la familia `SAL-`) | ⚠️ sin tarea (INC-003) |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

Referencia: design.md › D-8 define TC-019…TC-025 en `skills/epic-analyze/evals/evals.json` (cubren AC-1, AC-2 filas 1–2, CNF-1, CNF-2, CNF-3) y tasks.md › T004–T005 los crea.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-122` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-122` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-19-framework-consistency

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | Listada |
| Objetivo de la historia alineado con la épica | ⚠️ | El objetivo ("no comprometer capacidad de desarrollo con historias que todavía no están listas", story.md l. 24) encaja con la coherencia del framework, pero `## Alcance` (l. 20) y `## Criterios de salida` (l. 35–41) no mencionan un gate de análisis de épica. |
| Restricciones de la épica respetadas | ✓ | Ningún archivo nuevo de template ni campo sin escritor: D-6 añade un campo de `resumen` al template seed del skill, que escribe el propio `epic-analyze` (principio 13, `epic.md` l. 120); no toca `docs/domains/domain-story-lifecycle.md` (D-9). |

---

## Inconsistencias Detectadas

### INC-001 [WARNING] RESUELTO

- **Tipo:** D — desalineación con la épica
- **Descripción:** STORY-122 declara `parent: EPIC-19-framework-consistency`, pero no aparece en el índice de historias de la épica. Al ejecutar T020 (`/epic-analyze EPIC-19 --auto`), la propia familia `INT-` de STORY-120 reportará STORY-120…STORY-122 como huérfanas.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — sección "Historias" (l. 22–33)
- **Acción requerida:** Añadir STORY-120, STORY-121 y STORY-122 al índice (formato F2 `- [ ] **STORY-NNN** — …`).

### INC-002 [WARNING] RESUELTO

- **Tipo:** D — desalineación con la épica
- **Descripción:** El gate L2 `/epic-analyze` (integridad, cobertura de salida y madurez de historias hijas) no figura en el Alcance ni en los Criterios de salida de EPIC-19. La historia y su épica no comparten un criterio de salida verificable.
- **Archivo afectado:** `docs/specs/02-epics/EPIC-19-framework-consistency/epic.md` — secciones "Alcance" (l. 20) y "Criterios de salida" (l. 35–41)
- **Acción requerida:** Que el Product Owner confirme la pertenencia a EPIC-19 y añada un criterio de salida, o que reasigne STORY-120…STORY-122 a una épica propia.

### INC-003 [WARNING]

- **Tipo:** C — elemento de diseño sin tarea (obligación cruzada de evals)
- **Descripción:** STORY-121 › design.md › CR-002 (l. 368) exige que "STORY-122 aplique la misma regla a sus mundos", es decir, que los `input` de los casos nuevos traigan un contrato de salida cubierto por E1. Ni D-8 ni T004/T005 lo recogen. Si STORY-121 se implementa antes que STORY-122, los mundos de TC-019…TC-025 sin "Criterios de salida"/"Smoke tests" producirían `SAL-03`/`SAL-04` (ERROR) → `BLOCKED`. Eso contradice el `APPROVED` esperado en TC-020/TC-021 y el `NEEDS-REFINEMENT` de TC-024. En sentido inverso, D-8 (l. 225–226) delega en STORY-121 completar `status`/`related` de TC-011…TC-018 si STORY-122 va primero, pero STORY-121 › design.md/tasks.md no incluyen esa obligación.
- **Archivo afectado:** `design.md` — D-8 "Mundos de TC-001…TC-018" (l. 222–226); `tasks.md` — T004 (l. 44) y T005 (l. 45)
- **Acción requerida:** Que T004/T005 exijan, cuando la familia `SAL-` esté implementada (T001 lo detecta), que los mundos de TC-019…TC-025 incluyan "Criterios de salida" y "Smoke tests" cubiertos por las historias del mundo. Registrar la obligación recíproca en STORY-121 (CR o tarea) o dejar en T001 una comprobación explícita.

### INC-004 [WARNING]

- **Tipo:** E — criterio DoD PLAN no evaluable con certeza (⚠️, no bloqueante)
- **Descripción:** El criterio DoD "Todos los elementos de diseño tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`)" no se cumple al pie de la letra: D-7 (l. 197) y D-9 (l. 228), y los componentes "Changelog" y "Ciclo de vida de épica" (l. 247–248), trazan solo a CNF-2/CNF-3. Todos los elementos tienen anotación `// satisface:`, así que se aplica la regla de duda.
- **Archivo afectado:** `design.md` — D-7, D-9 y tabla "Componentes afectados"
- **Acción requerida:** Opcional: añadir el AC relacionado (AC-1/AC-2) donde aplique, o aceptar la traza a CNF como suficiente.

---

## Recomendaciones

1. **INC-001:** RESUELTO
2. **INC-002:** RESUELTO
3. **INC-003:** En `tasks.md` › T004/T005 (o en D-8), añadir: "si T001 detecta la familia `SAL-`, cada mundo de TC-019…TC-025 incluye `## Criterios de salida` y `## Smoke tests` cubiertos por E1 por sus historias". En STORY-121, añadir la regla recíproca para TC-011…TC-018 (`status: SPECIFY/DONE` o posterior y `related` resoluble) si se implementa después de STORY-122.
4. **INC-004:** Opcional: completar `// satisface: AC-N` en D-7, D-9 y en las filas de documentación de "Componentes afectados". No bloquea la implementación.
5. **Antes de T001:** Que el Product Owner confirme CR-003 (exclusión total de `CANCELED`) y CR-004 (`MAD-03` para estados fuera de vocabulario). Ninguno bloquea; el diseño ya fija un valor por defecto.

---

## Cumplimiento DoD — Fase PLAN

DoD cargado: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan = dod-story-plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene ACs en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 (l. 29–34) y AC-2 con `Ejemplos` (l. 37–47) en Gherkin |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-2…D-6, F-1; AC-2 → D-3…D-5, F-2 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-7, D-9 y dos componentes de documentación trazan solo a CNF (INC-004) |
| No hay decisiones de arquitectura aplazadas; toda ambigüedad está resuelta o registrada como CR | ✓ | — | "Open Questions: Ninguna" (l. 340); CR-001…CR-004 registrados con acción |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (T001–T021) |
| Si tasks.md existe, contiene solo tareas atómicas para todos los escenarios principales | ✓ | — | AC-1 → T004 (TC-019), T007, T012, T019; AC-2 → T004 (TC-020/021), T009–T011, T019; cada tarea toca un archivo o una verificación |
| Si testcases.md existe, contiene pruebas para todos los escenarios principales | ✓ | — | No aplica: testcases.md ausente |
