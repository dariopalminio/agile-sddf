---
type: analyze
id: STORY-143
slug: STORY-143-analyze-report
title: "Analyze: Validación end-to-end"
story: STORY-143
design: STORY-143
tasks: STORY-143
created: 2026-10-17
updated: 2026-10-17
related:
  - STORY-143-validacion-end-to-end
---

<!-- Referencias -->
[[STORY-143-validacion-end-to-end]] · [[STORY-143-validacion-end-to-end-design]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# Reporte de Coherencia: Validación end-to-end

## Resumen Ejecutivo

| Métrica | Estado | Detalle |
|---|---|---|
| Cobertura de ACs en design.md | ✓ | 3/3 criterios cubiertos (y CNF-1) |
| Cobertura de ACs en testcases.md | ⚠️ | testcases.md no presente: cobertura de pruebas no evaluada |
| Alineación tareas → diseño | ✓ | 32/32 tareas con diseño |
| Cobertura diseño → tareas | ✓ | 18/18 elementos con tarea (8 componentes, 10 interfaces) |
| Alineación con la épica EPIC-25-unificar-contrato-de-validaciones-en-skills | ⚠️ | Listada y alineada; CR-001 amplía las exclusiones de CS-10/SMOKE-3 pendiente de confirmación del PO |
| Cumplimiento DoD — Fase PLAN | ⚠️ | 6/7 criterios ✓ (1 ⚠️) |

**Estado general:** ⚠️ Advertencias (0 ERRORES, 4 WARNINGS)

Se verificó contra el filesystem el «Estado medido» de design.md (l.33-52): `scripts/verify-repository.js` tiene 13 pasos con `inventario de evals` y `enlaces activos` contiguos (l.23-24); `README.md` tiene 481 líneas, con «Flujo y evidencia» en l.176 y «Referencia para profundizar» en l.371; `docs/architecture/tech-stack.md` l.85 enumera los pasos del gate; `CHANGELOG.md` tiene `## [Unreleased]` en l.9 y `## [4.1.0]` en l.11; existen `test/verify-security-documents.test.js`, `scripts/verify-eval-inventory.js` y `scripts/check-doc-links.js`. `docs/policies/validation-contract-policy.md` aún no existe, como prevé D-10.

---

## Cobertura de Criterios de Aceptación

| AC | Descripción | Cubierto en design.md | Elemento de diseño |
|---|---|---|---|
| AC-1 | Los seis reportes tienen `## Veredicto` como primera sección y un `verdict` permitido por la política | ✓ | D-1, D-2 (lectura de §4), D-3 (`checkReport` en modos template/report, `REPORT_TEMPLATES`, `S-3`), modo `--report`, F-1, F-3, V-1…V-3, V-8, V-9, V-12 |
| AC-2 | Sin `APROBADA`, `Aprobada`, `review-status` ni el valor `approved` fuera de `docs/specs/` y las versiones publicadas del CHANGELOG | ✓ | D-4 (reglas L-1…L-4), D-5 (alcance y exclusiones), D-6 (`LEGACY_EXCEPTIONS`, E-1/E-2), D-9 (fila §6), F-2, V-4…V-6, V-11 |
| AC-3 | El README enlaza `docs/policies/validation-contract-policy.md` como fuente de verdad | ✓ | D-7 (párrafo en «Flujo y evidencia», fila en «Referencia para profundizar», regla `R-1`), D-9 (línea §3), V-7, V-13 |
| CNF-1 | La búsqueda de AC-2 es repetible sin juicio humano | ✓ | D-1 (gate determinista frente a evals), D-8 (paso en `verify:repository` y script npm), V-9, V-10 |

---

## Alineación Tareas ↔ Diseño

| Tarea | Descripción | Elemento de diseño asociado | Estado |
|---|---|---|---|
| T001 | Precondiciones de D-10 y lectura de la policy publicada | D-10, D-2 | ✓ |
| T002 | Confirmar el «Estado medido» | Context, D-3, D-6, D-7, D-8 | ✓ |
| T003 | Línea base de `verify:repository`, `npm test` y `git grep` | V-10, V-11 | ✓ |
| T004 | Crear `test/verify-validation-contract.test.js` con un repositorio fixture | D-8, Interfaces | ✓ |
| T005 | Pruebas V-1 de `parsePolicyContract` | D-2, V-1 | ✓ (ver INC-001) |
| T006 | Pruebas V-2 de `checkReport` en modo template | D-3, V-2 | ✓ |
| T007 | Pruebas V-3 de `checkReport` en modo report | D-3, V-3 | ✓ |
| T008 | Pruebas V-4 de `findLegacyVariants` | D-4, V-4 | ✓ |
| T009 | Pruebas V-5 del alcance | D-5, V-5 | ✓ |
| T010 | Pruebas V-6 de las excepciones | D-6, V-6 | ✓ (ver INC-002) |
| T011 | Pruebas V-7, V-8 y de degradación F-4 (RED) | D-3, D-7, F-4, V-7, V-8 | ✓ |
| T012 | Esqueleto del script, constantes y `Violation` | D-3, D-5, D-6, Esquema de datos | ✓ |
| T013 | `parsePolicyContract` | D-2, Interfaces | ✓ (ver INC-001) |
| T014 | `checkReport` (G-01…G-04) | D-3 | ✓ |
| T015 | `findLegacyVariants` (L-1…L-4) | D-4 | ✓ |
| T016 | Recorrido del alcance con exclusiones | D-5, F-4 | ✓ |
| T017 | `LEGACY_EXCEPTIONS`, E-1, E-2 | D-6 | ✓ |
| T018 | Orquestador `verifyValidationContract` | D-2, D-3, D-7, F-1, F-4 | ✓ (ver INC-002) |
| T019 | `verifyReports` y `main()` (GREEN) | D-3, D-8, Interfaces (CLI) | ✓ |
| T020 | Rótulo en `test/verify-repository.test.js` (RED) | D-8 | ✓ |
| T021 | Paso en `scripts/verify-repository.js` (GREEN) | D-8 | ✓ |
| T022 | Script npm `verify:validation-contract` | D-8 | ✓ |
| T023 | `docs/architecture/tech-stack.md` l.85 | D-8 | ✓ |
| T024 | Policy: línea de §3, fila `memory-system` de §6, versión e historial | D-9, D-6 | ✓ |
| T025 | README, párrafo en «Flujo y evidencia» | D-7 | ✓ |
| T026 | README, fila en «Referencia para profundizar» | D-7 | ✓ |
| T027 | V-9: `npm run verify:validation-contract` | V-9, D-10 | ✓ |
| T028 | V-11: búsqueda literal independiente | V-11 | ✓ |
| T029 | V-13: enlaces del README y `verify:links` | V-13 | ✓ |
| T030 | V-14: lectura de la policy | V-14 | ✓ |
| T031 | V-10: `npm test`, `verify:repository`, `git status`, `graphify update .` | V-10, Componentes afectados | ✓ |
| T032 | V-12 / SMOKE-1 manual con `--report` | F-3, V-12 | ✓ |

---

## Cobertura Diseño → Tareas

| Componente / Interfaz | Sección en design.md | Tarea que lo implementa | Estado |
|---|---|---|---|
| Verificador `scripts/verify-validation-contract.js` | Componentes afectados (l.316) | T012-T019 | ✓ |
| Pruebas `test/verify-validation-contract.test.js` | Componentes afectados (l.317) | T004-T011 | ✓ |
| Gate `scripts/verify-repository.js` | Componentes afectados (l.318) | T021 | ✓ |
| Prueba del gate `test/verify-repository.test.js` | Componentes afectados (l.319) | T020 | ✓ |
| Scripts npm `package.json` | Componentes afectados (l.320) | T022 | ✓ |
| `README.md` | Componentes afectados (l.321) | T025, T026 | ✓ |
| Policy del contrato (§3, §6, versión) | Componentes afectados (l.322) | T024 | ✓ |
| `docs/architecture/tech-stack.md` | Componentes afectados (l.323) | T023 | ✓ |
| CLI, modo gate | Interfaces (l.332) | T019, T021 | ✓ |
| CLI, modo reporte `--report` | Interfaces (l.333) | T019, T032 | ✓ |
| `parsePolicyContract(policyText)` | Interfaces (l.334) | T005, T013 | ✓ |
| `checkReport(text, allowedValues, mode)` | Interfaces (l.335) | T006, T007, T014 | ✓ |
| `findLegacyVariants(text)` | Interfaces (l.336) | T008, T015 | ✓ |
| `verifyValidationContract(repoRoot)` | Interfaces (l.337) | T009-T011, T016-T018 | ✓ (firma ampliada en tasks; INC-002) |
| `verifyReports(paths, repoRoot)` | Interfaces (l.338) | T011, T019 | ✓ |
| Tabla §4 de la policy (consumida) | Interfaces (l.339) | T001, T013 | ✓ |
| Tabla §6 de la policy (fila `memory-system`) | Interfaces (l.340) | T017, T024 | ✓ |
| Enlace del README | Interfaces (l.341) | T025, T026, T029 | ✓ |

---

## Cobertura de ACs en Testcases

⚠️ testcases.md no presente: cobertura de pruebas no evaluada. Las pruebas están especificadas en los contratos V-1…V-14 de design.md (l.419-434) y en las tareas T004-T011 de tasks.md.

---

## Vía de Implementación Disponible

| Artefacto | Presente | Skill habilitado |
|---|---|---|
| testcases.md | ❌ | `/story-implement STORY-143` (no disponible) |
| tasks.md | ✓ | `/story-implement-tasks STORY-143` |

---

## Alineación con la Épica

**Épica padre:** EPIC-25-unificar-contrato-de-validaciones-en-skills

| Criterio | Estado | Detalle |
|---|---|---|
| Historia listada en la épica | ✓ | epic.md l.27: «STORY-143 — Validación end-to-end». epic.md l.84 la designa dueña de CS-2, CS-3, CS-10, CS-11, SMOKE-1 y SMOKE-3, y story.md (l.70-74) los cita todos |
| Objetivo de la historia alineado con la épica | ✓ | «Para que ningún consumidor encuentre variantes del vocabulario de veredictos» coincide con el gate homogéneo del Alcance (epic.md l.17) y con la mitigación del riesgo, que pide documentar el cambio en el README (epic.md l.94; design D-7) |
| Restricciones de la épica respetadas | ⚠️ | Se respeta la habilitación secuencial (epic.md l.85; D-10 y T001). En cambio, CS-10 y SMOKE-3 solo excluyen `docs/specs/` y las versiones publicadas del CHANGELOG, y el diseño añade `docs/adr/`, `docs/product/roadmap.md`, `docs/product/story-map.md`, §5-§6 de la policy y las excepciones L-4 de §6 (D-5, D-6, CR-001). Ver INC-003 |

---

## Inconsistencias Detectadas

### INC-001 [WARNING]

- **Tipo:** contradicción interna del plan (no clasificable como A-F; se registra como WARNING por la regla de duda)
- **Descripción:** la tarea de pruebas y la de implementación de `parsePolicyContract` se contradicen. T005 (tasks.md l.39) exige que `parsePolicyContract` «omite la fila de un skill sin `SKILL.md` en el fixture (`epic-validate`)», como dice V-1 de design.md (l.421, «omite una fila sin skill instalado»). Sin embargo, T013 (tasks.md l.46) dice que «el filtrado de filas sin `SKILL.md` lo hace el orquestador, no la función pura» y afirma que así «hace pasar V-1 (T005)». La firma de design.md (Interfaces, l.334) solo recibe `policyText` y no puede consultar el filesystem. Tal como está redactado, el ciclo RED→GREEN de T005/T013 no puede cerrarse: o falla la prueba o la función deja de ser pura.
- **Archivo afectado:** tasks.md, tareas «T005» y «T013»; design.md, «Contratos de verificación», fila V-1
- **Acción requerida:** mover la prueba de la fila `epic-validate` sin `SKILL.md` de T005 a T011 (orquestador `verifyValidationContract`) y ajustar V-1 en design.md para que solo exija que `parsePolicyContract` devuelva la fila; el filtrado se prueba en V-7/F-4.

### INC-002 [WARNING]

- **Tipo:** divergencia de interfaz entre diseño y tareas (no clasificable como A-F; WARNING)
- **Descripción:** design.md (Interfaces, l.337) define `verifyValidationContract(repoRoot)`. T010 (tasks.md l.40) y T018 (l.51) añaden un segundo argumento opcional `{ legacyExceptions }` para inyectar excepciones en las pruebas. La ampliación es razonable y está justificada en T010, pero el diseño no la registra.
- **Archivo afectado:** design.md, sección «Interfaces», fila `verifyValidationContract(repoRoot)`
- **Acción requerida:** actualizar la fila a `verifyValidationContract(repoRoot, options?)` con `options.legacyExceptions` (por defecto `LEGACY_EXCEPTIONS`).

### INC-003 [WARNING]

- **Tipo:** D (desalineación con la épica)
- **Descripción:** CS-10 (epic.md l.43), SMOKE-3 (epic.md l.66-72) y el `Pero` de AC-2 (story.md l.46) excluyen solo `docs/specs/` y las versiones publicadas del CHANGELOG. D-5 y D-6 excluyen además `docs/adr/`, `docs/product/roadmap.md`, `docs/product/story-map.md` y §5-§6 de la policy, y eximen de L-4 los agentes y subinformes de `story-code-review` y los fixtures `dod-*` de `memory-system`. La justificación es sólida (ADR inmutables, roadmap append-only, fixtures de migración) y está registrada como CR-001, pero su «Acción requerida» es «opcional», y el criterio de salida de la épica sigue diciendo otra cosa.
- **Archivo afectado:** design.md, «Registro de Cambios (CR)», CR-001; story.md, AC-2 (l.46); epic.md, CS-10 (l.43) y SMOKE-3
- **Acción requerida:** que el PO confirme CR-001 antes de implementar y amplíe el `Pero` de AC-2 y el paréntesis de CS-10/SMOKE-3 con «los ADR, los registros cerrados de `docs/product/` y las excepciones registradas en §6 de la política».

### INC-004 [WARNING]

- **Tipo:** D (dependencia con otras historias de la épica)
- **Descripción:** según CR-002 (design.md l.488-498), el gate de esta historia valida `skills/story-analyze/examples/output/analyze.md` y los tres `skills/story-acceptance/examples/*/acceptance-report.md`, que hoy no cumplen G-01, G-02 ni G-04. STORY-144 y STORY-145 siguen en `SPECIFY/DONE`, sin `design.md` (verificado el 2026-10-17), así que nada garantiza todavía que sus inventarios incluyan esos ejemplos. Además, el precondicionante D-10 / T001 exige siete historias en `DONE`, y hoy STORY-138…142 están en `READY-FOR-IMPLEMENT/DONE` y STORY-144/145 en `SPECIFY/DONE`. No bloquea el plan, pero sí la implementación.
- **Archivo afectado:** design.md, CR-002 y D-10; tasks.md, T001 y T027
- **Acción requerida:** al planificar STORY-144 y STORY-145, incluir en sus inventarios los ejemplos que nombra CR-002 (y los fixtures `analyze.md` de `story-fix-plan` en STORY-144). No iniciar `/story-implement-tasks STORY-143` hasta que T001 pase.

---

## Recomendaciones

1. **INC-001** — En tasks.md, quitar de T005 la cláusula «omite la fila de un skill sin `SKILL.md` en el fixture (`epic-validate`)» y añadirla a T011 como prueba del orquestador. En design.md, V-1 (l.421), sustituir «omite una fila sin skill instalado» por «devuelve todas las filas; el filtrado por `SKILL.md` lo hace `verifyValidationContract` (V-7)». Se puede aplicar con `/story-fix-plan STORY-143`.
2. **INC-002** — En design.md, «Interfaces» (l.337), cambiar la firma a `verifyValidationContract(repoRoot, options?)` y documentar `options.legacyExceptions`.
3. **INC-003** — Pedir al PO la confirmación de CR-001 y, si la da, ampliar el `Pero` de AC-2 en story.md y el texto de CS-10/SMOKE-3 en epic.md. El diseño no cambia.
4. **INC-004** — Llevar CR-002 a la planificación de STORY-144 y STORY-145 (`/story-plan STORY-144`, `/story-plan STORY-145`) y respetar el orden de la épica: implementar STORY-143 en último lugar.

---

## Cumplimiento DoD — Fase PLAN

DoD cargado desde `docs/guardrails/dod-story-plan.md` (`sddf.config.yaml › guardrails.dod.story.plan: dod-story-plan`, `enforcement: error`).

| Criterio DoD | Estado | Severidad | Evidencia |
|---|---|---|---|
| story.md tiene criterios de aceptación en formato Gherkin (Dado/Cuando/Entonces) que cubren los escenarios principales | ✓ | — | AC-1 principal, AC-2 alternativo y AC-3 de documentación, en bloques `gherkin` (story.md l.33-54) |
| design.md existe y cubre todos los ACs de story.md con al menos un elemento de diseño por criterio | ✓ | — | AC-1: D-2/D-3; AC-2: D-4…D-6; AC-3: D-7; CNF-1: D-1/D-8 |
| Todos los elementos de diseño en design.md tienen trazabilidad explícita al AC que satisfacen (`// satisface: AC-N`) | ✓ | — | D-1…D-10 llevan `// satisface:`; las tablas de Componentes e Interfaces tienen columna «Satisface»; los flujos F-1…F-3 citan sus AC (F-4/F-5 son de degradación y extensión, con P7/P6) |
| No hay decisiones de arquitectura aplazadas: toda ambigüedad técnica está resuelta en design.md o registrada como CR | ⚠️ | WARNING | Open Questions: «Ninguna» y CR-001…CR-003 registrados, pero V-1 contradice la firma pura de `parsePolicyContract` (INC-001) |
| DEBE existir tasks.md o testcases.md o ambos | ✓ | — | tasks.md presente (32 tareas) |
| Si tasks.md existe DEBE contener únicamente tareas atómicas para todos los escenarios principales de story.md | ✓ | — | Cada tarea edita un archivo o una función y cita sus AC; AC-1, AC-2 y AC-3 tienen tareas de prueba, implementación y verificación |
| Si testcases.md existe DEBE contener pruebas definidas para todos los escenarios principales de story.md | ✓ | — | No aplica: testcases.md ausente |
