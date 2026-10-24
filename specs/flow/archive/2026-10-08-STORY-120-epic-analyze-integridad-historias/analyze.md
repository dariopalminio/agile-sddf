---
type: analyze
id: STORY-120
slug: STORY-120-analyze-report
title: "Analyze: Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo"
story: STORY-120
design: STORY-120
tasks: STORY-120
created: 2026-10-08
updated: 2026-10-08
related:
  - STORY-120-epic-analyze-integridad-historias
---

<!-- Referencias -->
[[STORY-120-epic-analyze-integridad-historias]] · [[EPIC-22-epic-analyze]]

# Reporte de Coherencia: Detectar historias faltantes, huérfanas o duplicadas de una épica antes de aprobarla para desarrollo

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1…CNF-8 con elemento de diseño) |
| Cobertura de ACs en testcases.md | ⚠️ | No evaluada — testcases.md no presente |
| Alineación tareas → diseño | ✓ | 26/26 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 13/13 elementos (7 componentes + 6 interfaces) con tarea; contrato #3 cerrado por T024 (INC-001 resuelto) |
| Alineación con la épica EPIC-22-epic-analyze | ✓ | Listada en el índice (F2 canónico), con objetivo y criterio de salida propios |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️, 0 ❌) |

**Estado general:** ⚠️ Advertencias (0 ERROR · 1 WARNING abierto; INC-001 resuelto): sin inconsistencias bloqueantes.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Índice consistente → `epic-analyze-report.md` con `APPROVED`, 0 ERROR, fuentes sin cambios (story.md l. 28–37) | ✓ | D-1, D-3…D-10 (D-8 template, D-9 escritura única, D-10 solo lectura), I-1, I-2, F-1, contratos #1–#2, TC-001 con `errors: 0` (D-13) |
| AC-2 | Desajustes del índice: faltante, huérfana, duplicada, 1 y 4 F1 → severidad, elemento y veredicto (story.md l. 39–53) | ✓ | D-4 (Vía A), D-5 (Vía B), D-6 (INT-01…INT-06), D-7 (veredicto), I-5, Esquema de datos (cruce), F-2, contratos #3 y #5, TC-002…TC-006; INT-04/INT-06 con TC-026/TC-027 (CR-001 confirmado) |
| AC-3 | Épica no resuelta → mensaje con ruta buscada y sin reporte (story.md l. 55–61) | ✓ | D-2, D-11 (retorno `FAIL` en modo Agent), I-1, I-3, F-3, contrato #4, TC-007 |

CNF con elemento de diseño: CNF-1 → D-7; CNF-2 → D-9/D-10; CNF-3 → D-6 (orden)/D-9; CNF-4 → D-8; CNF-5 → D-11; CNF-6 → D-1/D-12/D-13; CNF-7 → D-10; CNF-8 → D-14 (con CR-002 y CR-003).

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Línea base (`npm test`, inventario de evals, enlaces, `domain-skills-map.md`, `files`, clave `historias`) | Contratos #9, #11; D-3; D-14; CR-002/CR-003 | ✓ |
| T002 | `evals.json` con TC-001…TC-006 (TC-001 con `errors: 0`) | D-13; componente "Casos de eval" | ✓ |
| T003 | TC-007…TC-010, TC-026, TC-027 y `not_contains` de bloques FILE | D-13; CR-001; CNF-2 | ✓ |
| T004 | Validar JSON, `--dry-run` (12 casos), commit solo de evals (RED) | D-13 | ✓ |
| T005 | Template seed `assets/epic-analyze-report-template.md` | D-8, D-9, I-4 | ✓ |
| T006 | `SKILL.md`: frontmatter y secciones de cabecera | D-1, D-10, D-11, D-12 | ✓ |
| T007 | Cláusula `ai-untrusted-content-clause` | D-10 | ✓ |
| T008 | Paso 0 (raíz) y Paso 1 (resolver épica) | D-2, F-3 | ✓ |
| T009 | Paso 2: sección de historias por clave | D-3, F-4 | ✓ |
| T010 | Paso 3: Vía A | D-4 | ✓ |
| T011 | Paso 4: Vía B | D-5, F-4 | ✓ |
| T012 | Paso 5: comprobaciones INT y orden determinista | D-6, I-5, I-6 | ✓ |
| T013 | Paso 6: veredicto | D-7 | ✓ |
| T014 | Paso 7: template del reporte | D-8, I-4 | ✓ |
| T015 | Pasos 8–9: escritura y salida por modo | D-9, D-11, D-12, I-3 | ✓ |
| T016 | Revisión integral de `SKILL.md` | D-1, D-12; CNF-4 | ✓ |
| T017 | `docs/domains/domain-skills-map.md` | D-14; CR-003 | ✓ |
| T018 | `docs/domains/domain-epic-lifecycle.md` §8, §9 | D-14 | ✓ |
| T019 | `docs/guides/sddf-commands-pipeline.md` §2 | D-14 | ✓ |
| T020 | `CHANGELOG.md` `[Unreleased] › Added` (STORY-120, EPIC-22) | D-14 | ✓ |
| T021 | Contrato #9 (checklist de skills, inventario, raíz, orden git) | Contrato #9; D-13 | ✓ |
| T022 | Contratos #7 y #10 | D-8, D-10 | ✓ |
| T023 | Contrato #11 (`npm pack`, docs, enlaces nuevos respecto a T001) | D-14; CR-002 | ✓ |
| T024 | `npm run test:eval -- epic-analyze` con TC-001…TC-010, TC-026 y TC-027 | Contratos #1, #3–#6, #8 | ✓ |
| T025 | Ejecución real `/epic-analyze EPIC-22 --auto` e idempotencia | Contrato #2; D-9; Risks | ✓ |
| T026 | Regresión final y encoding UTF-8 sin BOM | Contratos #9, #11 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Contrato del skill `skills/epic-analyze/SKILL.md` | Componentes afectados (l. 325) | T006–T016 | ✓ |
| Template seed del reporte | Componentes afectados (l. 326); D-8 | T005 | ✓ |
| Casos de eval `evals/evals.json` | Componentes afectados (l. 327); D-13 | T002–T004 (creación), T024 (ejecución) | ✓ |
| Mapa de skills | Componentes afectados (l. 328); D-14 | T017 | ✓ |
| Ciclo de vida de épica | Componentes afectados (l. 329); D-14 | T018 | ✓ |
| Guía de pipeline | Componentes afectados (l. 330); D-14 | T019 | ✓ |
| `CHANGELOG.md` | Componentes afectados (l. 331); D-14 | T020 | ✓ |
| I-1 Invocación | Interfaces (l. 340) | T006, T008 | ✓ |
| I-2 Lectura de la épica | Interfaces (l. 341) | T009, T010 | ✓ |
| I-3 Retorno en modo Agent | Interfaces (l. 342) | T015 (verificado en TC-010 y T025) | ✓ |
| I-4 Template del reporte | Interfaces (l. 343) | T005, T014 | ✓ |
| I-5 Hallazgo | Interfaces (l. 344) | T012 | ✓ |
| I-6 Extensión por familias | Interfaces (l. 345) | T012 | ✓ |
| Contrato de verificación #3: TC-026/TC-027 (INT-04/INT-06) | Contratos de verificación (l. 409) | T003 (creación), T024 (ejecución aprobatoria) | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente — cobertura de pruebas no evaluada.

Nota informativa: design.md › D-13 y tasks.md › T002–T003 definen TC-001…TC-010, TC-026 y TC-027 en `skills/epic-analyze/evals/evals.json` (AC-1 → TC-001; AC-2 → TC-002…TC-006, TC-026, TC-027; AC-3 → TC-007).

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-120` — no disponible |
| tasks.md | ✓ | `/story-implement-tasks STORY-120` — disponible |

---

## Alineación con la Épica

**Épica padre:** EPIC-22-epic-analyze (`docs/specs/02-epics/EPIC-22-epic-analyze/epic.md`, `status: DEFINE/TODO`)

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | `## Historias` l. 26: `- [ ] **STORY-120** — Integridad de historias …` (F2 canónico) |
| Objetivo de la historia alineado con la épica | ✓ | El Alcance cubre "la integridad del índice de historias"; los criterios de salida l. 31, l. 32 y l. 35 los entrega esta historia (skill + evals, detección INT, épica inexistente) |
| Restricciones de la épica respetadas | ✓ | Criterio "`skills/epic-analyze/` en `files` de `package.json`" (l. 36) ya satisfecho por `"skills/"` (CR-002, contrato #11); sin historias predecesoras en la tabla de dependencias |

---

## Inconsistencias Detectadas

### INC-001 [WARNING] RESUELTO

- **Tipo:** C — elemento de diseño sin tarea que lo cierre
- **Descripción:** El contrato de verificación #3 (design.md l. 409) se apoya en TC-026 y TC-027 para INT-04 e INT-06 (CR-001 confirmado). T003 los crea y T004 los cuenta en el `--dry-run` (12 casos), pero T024, la tarea que ejecuta los evals y fija el criterio de aceptación, solo exige "TC-001…TC-010 aprobados". Si TC-026 o TC-027 fallan, ninguna tarea obliga a corregirlo.
- **Archivo afectado:** `tasks.md` — T024 (l. 69)
- **Acción requerida:** En T024, cambiar "TC-001…TC-010 aprobados" por "TC-001…TC-010, TC-026 y TC-027 aprobados".
- **Resolución (2026-10-08):** aplicada en `tasks.md` › T024.

### INC-002 [WARNING]

- **Tipo:** E — criterio DoD PLAN no plenamente evidenciado (regla de duda → ⚠️)
- **Descripción:** Trazan solo a CNF los elementos documentales o transversales: D-12 (`// satisface: CNF-6`, l. 272), D-14 (`CNF-8, CNF-6`, l. 306), las filas "Mapa de skills", "Ciclo de vida de épica", "Guía de pipeline" y "Changelog" (`// satisface: CNF-8`, l. 328–331), e I-4 (`CNF-4`) e I-6 (`CNF-1`) en la columna "AC / CNF" de Interfaces (l. 343, l. 345). El resto de decisiones, componentes e interfaces citan un `AC-N`. Es el residual que aceptó el PO el 2026-10-08: AC real donde existe, CNF explícito en documentación.
- **Archivo afectado:** `design.md` — "Decisions" (D-12, D-14), "Componentes afectados" (l. 328–331), "Interfaces" (I-4, I-6)
- **Acción requerida:** Ninguna (decisión del PO). Revisar solo si el DoD PLAN pasa a exigir AC literal también en elementos documentales.

---

## Recomendaciones

1. **INC-001:** RESUELTO: T024 incluye TC-026 y TC-027 en la ejecución aprobatoria.
2. **INC-002:** sin acción; residual aceptado.

**Observaciones (no tipificadas, no cuentan como hallazgo):**

- `tasks.md` › T023 (l. 68) exige que `node scripts/check-doc-links.js` termine en exit 0, pero hoy el repositorio ya tiene 2 enlaces rotos ajenos a esta historia (`docs/guides/orchestrator-subagent-pattern.md:148` y `docs/index.md:262`). Resuelto (2026-10-08): T023 exige ahora "sin enlaces rotos nuevos respecto a la línea base de T001", como T026.
- `design.md` › Context l. 40 ("111 de 117 historias") y Risks l. 426 ("hoy 117 `story.md`") son una foto del repositorio; hoy hay 114 `story.md`. Es informativo y no afecta al diseño.
- `EPIC-19` › Notas mantiene una nota obsoleta ("directorio `EPIC-19/` sin slug"), ajena a esta historia.

---

## Cumplimiento DoD — Fase PLAN

DoD resuelto: `docs/guardrails/dod-story-plan.md` (override `sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`), `enforcement: error`, 7 criterios.

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin que cubren los escenarios principales | ✓ | — | AC-1 (principal), AC-2 (alternativo con `Ejemplos`), AC-3 (error), todos en bloques `gherkin` Dado/Cuando/Entonces |
| design.md existe y cubre todos los ACs con al menos un elemento de diseño por criterio | ✓ | — | AC-1 → D-1/D-8/D-9/D-10/F-1; AC-2 → D-4…D-7/F-2; AC-3 → D-2/D-11/F-3 |
| Todos los elementos de diseño tienen trazabilidad explícita al AC (`// satisface: AC-N`) | ⚠️ | WARNING | D-12, D-14, 4 filas documentales e I-4/I-6 trazan solo a CNF (INC-002, residual aceptado) |
| No hay decisiones de arquitectura aplazadas | ✓ | — | "Open Questions: Ninguna" (l. 432–434); CR-001 confirmado por el PO; CR-002/CR-003 con acción definida |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | `tasks.md` presente (26 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales | ✓ | — | AC-1 → T002/T010–T015/T024/T025; AC-2 → T002–T003/T010–T013/T024; AC-3 → T003/T008/T024; cada tarea apunta a un archivo o a una verificación |
| Si testcases.md existe DEBE contener pruebas para todos los escenarios principales | ✓ | — | No aplica: `testcases.md` ausente |
