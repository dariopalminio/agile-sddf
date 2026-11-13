---
type: testcases
id: STORY-183
slug: STORY-183-dod-code-review-sin-criterios-circulares-testcases
title: "Test Cases: DoD CODE-REVIEW sin criterios circulares"
story: STORY-183
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-183-dod-code-review-sin-criterios-circulares
---

<!-- Referencias -->
[[STORY-183-dod-code-review-sin-criterios-circulares]]

# Casos de Prueba: DoD CODE-REVIEW sin criterios circulares

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 5 |
| CT   | 0 |
| IT   | 2 |
| API  | 0 |
| E2E  | 4 |
| EV   | 4 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | DoD sin criterios que la revisión satisface por sí misma | El guardrail `docs/guardrails/dod-story-code-review.md` y la plantilla `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md` modificados | Se leen sus criterios `- [ ]` y se ejecuta `memory-system check` | Ningún criterio menciona `code-review-report.md`, `verdict`/`APPROVED` ni la ausencia de hallazgos HIGH o MEDIUM; quedan los cinco criterios de I-1; `memory-system check` pasa | AC-1, D-1, D-2 |
| E2E-002 | End-to-End | Un criterio cubierto por un revisor no duplica el hallazgo | Historia STORY-NNN con un escenario Gherkin sin código; el Product-Owner-Reviewer lo reporta como `MEDIUM` | Se evalúa el DoD en el Paso 4c.1 | El criterio «Cada escenario Gherkin tiene correspondencia en el código» queda `❌` con `Cubierto por Product-Owner-Reviewer: <Archivo:Línea>`; `fix-directives.md` y `code-review-report.md` tienen una sola entrada para el defecto; no hay fila `DoD-CODE-REVIEW` | AC-2, D-3, I-5 |
| E2E-003 | End-to-End | Criterio sin revisor: tarea pendiente en `tasks.md` | Historia STORY-NNN con `- [ ]` en `tasks.md`; ningún revisor cubre «Sin tareas pendientes en `tasks.md` (si existe el archivo)» | Se evalúa el DoD | `code-review-report.md` registra un hallazgo `DoD-CODE-REVIEW` `MEDIUM` que cita `docs/guardrails/dod-story-code-review.md:20`; `fix-directives.md` tiene una sola entrada para él | AC-3 (fila 1), D-5, I-6 |
| E2E-004 | End-to-End | Criterio sin revisor: frontmatter de `story.md` incompleto | Historia STORY-NNN cuyo `story.md` no tiene el campo `created` (campo de CR-001); ningún revisor cubre «Metadatos frontmatter de `story.md` están completos y correctos» | Se evalúa el DoD | `code-review-report.md` registra un hallazgo `DoD-CODE-REVIEW` `MEDIUM` que cita `docs/guardrails/dod-story-code-review.md:21` con `story.md: falta created`; `fix-directives.md` tiene una sola entrada para él | AC-3 (fila 2), D-5, CR-001 |
| UT-001 | Unit | Guardrail y plantilla tienen los mismos criterios | Los dos archivos del DoD CODE-REVIEW | `test/dod-story-code-review.test.js` compara sus líneas `- [ ]` normalizadas | Las listas son iguales y en el mismo orden; si difieren (p. ej. falta «(si existe el archivo)» en uno), la prueba falla | CNF-1, D-7 (1), T007 |
| UT-002 | Unit | Ningún criterio autorreferente | Los dos archivos del DoD | La prueba busca `code-review-report.md`, `verdict`, `APPROVED`, `HIGH o MEDIUM`, `[[dod-story-implement]]` y `status y substatus actualizados` en sus criterios | No hay coincidencias; un criterio con cualquiera de esos textos hace fallar la prueba | AC-1, D-7 (2), T007 |
| UT-003 | Unit | La tabla «Criterios conocidos» y el DoD no divergen | `skills/story-code-review/SKILL.md` con la tabla del Paso 4c.1 y los dos DoD | La prueba compara, como conjunto, la primera columna de la tabla con los criterios del DoD | Coinciden; editar un criterio en el DoD sin actualizar la tabla (o al revés) hace fallar la prueba | AC-2, AC-3, D-3, D-7 (3), T010 |
| UT-004 | Unit | Mapeo criterio → revisor | La tabla «Criterios conocidos» | La prueba lee la columna de revisor de los criterios de `constitution.md`, Gherkin y `design.md` | Son `Tech-Lead-Reviewer`, `Product-Owner-Reviewer` e `Integration-Reviewer`; los criterios de `tasks.md` y metadatos tienen cobertura `propia` | AC-2, D-3, D-7 (4) |
| UT-005 | Unit | Normalización del texto de un criterio (borde) | Un criterio con espacios dobles o finales y comillas invertidas | La prueba aplica la normalización de I-2 antes de comparar | Los espacios se colapsan y se recortan; las comillas invertidas se conservan, así que «`tasks.md`» y «tasks.md» no son el mismo criterio | I-2, D-7 |
| IT-001 | Integration | El guardrail modificado pasa el gate del repositorio | C-1 y C-2 aplicados | Se ejecuta `npm run verify:repository` (incluye `memory-system check`) | Termina con código 0; el frontmatter del guardrail solo cambia en `updated` | AC-1, CNF-2, T018 |
| IT-002 | Integration | Suite completa sin regresiones | Todos los cambios de la historia | Se ejecuta `npm test` | Termina con código 0, incluidos `test/dod-story.test.js` (fixtures de `memory-system` sin cambios) y `test/sddf-constitution.test.js` | CNF-2, T018 |
| EV-001 | Eval | `dod-sin-criterios-autorreferentes` (happy path) | Caso de `evals.json` con `dod_criteria` de I-1, revisores sin hallazgos, `tasks.md` cerrado y frontmatter completo | Se ejecuta el eval de `story-code-review` | La salida contiene `(verdict: APPROVED)` y `5/5 criterios ✓`, y no contiene `está creado o actualizado`, `Revisión de código aprobada`, `Sin hallazgo bloqueante` ni `Se cumple [[dod-story-implement]]` | AC-1, D-6, T003 |
| EV-002 | Eval | `criterio-cubierto-por-revisor-no-duplica` | Caso con `MEDIUM` del Product-Owner-Reviewer en `specs/flow/STORY-040-x/story.md:30` con `failure_scenario` | Se ejecuta el eval | Contiene `(verdict: NEEDS-CHANGES)`, `1 hallazgo(s) bloqueante(s)`, `Cubierto por Product-Owner-Reviewer` y `round: 1`; no contiene `DoD-CODE-REVIEW` ni `2 hallazgo(s) bloqueante(s)` | AC-2, D-6, T004 |
| EV-003 | Eval | `criterio-propio-tasks-pendiente` (fail path) | Caso con `- [ ] T-3` en la línea 30 de `tasks.md` y revisores sin hallazgos | Se ejecuta el eval | Contiene `DoD-CODE-REVIEW`, `dod-story-code-review.md:20`, `Sin tareas pendientes en`, `tasks.md:30`, `1 hallazgo(s) bloqueante(s)`, `(verdict: NEEDS-CHANGES)` y `round: 1`; no contiene `(verdict: APPROVED)` | AC-3, D-6, T005 |
| EV-004 | Eval | `criterio-propio-frontmatter-incompleto` (fail path) | Caso con `story.md` sin `created` y revisores sin hallazgos | Se ejecuta el eval | Contiene `DoD-CODE-REVIEW`, `dod-story-code-review.md:21`, `falta created`, `1 hallazgo(s) bloqueante(s)` y `(verdict: NEEDS-CHANGES)`; no contiene `(verdict: APPROVED)` | AC-3, D-6, CR-001, T006 |

## Notas de cobertura

- **tasks.md usado:** sí. T003 a T006 originan EV-001 a EV-004; T007, UT-001 a UT-005; T018, IT-001 e IT-002. T016 (grep de AC-1) refuerza UT-002; T017 (recorrido manual de F-1 a F-3) es la verificación de E2E-001 a E2E-004 mientras los evals no se ejecuten.
- **E2E ↔ AC:** AC-1 → E2E-001; AC-2 → E2E-002; el esquema de AC-3 tiene dos filas de `Ejemplos:` → E2E-003 y E2E-004.
- **CR-001:** E2E-004 y EV-004 usan el campo `created` en lugar de `substatus`, porque una historia sin `substatus` se detiene en el Paso 1d y el Paso 1e escribe `substatus` antes de evaluar el DoD. Si el humano no acepta CR-001 (T001), estos dos casos se rediseñan.
- **Fail-fast del skill:** la precondición de estado y los artefactos requeridos ya los cubren TC-003 y TC-004 de `evals.json`; esta historia no cambia esos pasos.
- **Gaps aceptados (sin eval):** la regla de entrada única para criterios no conocidos (D-4) y la degradación con un revisor sin informe válido o en `--single-agent` (F-4) no tienen caso propio: no afectan al DoD de este repositorio y se verifican en el recorrido manual de T017. Si un consumidor reporta duplicados con su DoD viejo, añadir un eval con `dod_criteria` que incluya «Se cumple [[dod-story-implement]]».
- **Ejecución:** UT e IT corren en `npm test` y `npm run verify:repository`; los EV se ejecutan con `npm run test:eval -- story-code-review` a criterio humano (AGENTS.md). Los IDs de eval son nominales (TC-038 a TC-041); T002 fija los definitivos.

## Test Cases Progress for STORY-183

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: DoD sin criterios que la revisión satisface por sí misma
- [ ] E2E-002: Un criterio cubierto por un revisor no duplica el hallazgo
- [ ] E2E-003: Criterio sin revisor: tarea pendiente en `tasks.md`
- [ ] E2E-004: Criterio sin revisor: frontmatter de `story.md` incompleto
- [ ] UT-001: Guardrail y plantilla tienen los mismos criterios
- [ ] UT-002: Ningún criterio autorreferente
- [ ] UT-003: La tabla «Criterios conocidos» y el DoD no divergen
- [ ] UT-004: Mapeo criterio → revisor
- [ ] UT-005: Normalización del texto de un criterio (borde)
- [ ] IT-001: El guardrail modificado pasa el gate del repositorio
- [ ] IT-002: Suite completa sin regresiones
- [ ] EV-001: `dod-sin-criterios-autorreferentes` (happy path)
- [ ] EV-002: `criterio-cubierto-por-revisor-no-duplica`
- [ ] EV-003: `criterio-propio-tasks-pendiente` (fail path)
- [ ] EV-004: `criterio-propio-frontmatter-incompleto` (fail path)
