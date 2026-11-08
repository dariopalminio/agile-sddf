---
type: testcases
id: STORY-179
slug: STORY-179-review-md-de-agile-sddf-testcases
title: "Test Cases: REVIEW.md de agile-sddf"
story: STORY-179
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-179-review-md-de-agile-sddf
---

<!-- Referencias -->
[[STORY-179-review-md-de-agile-sddf]]

# Casos de Prueba: REVIEW.md de agile-sddf

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 13 |
| CT   | 0 |
| IT   | 3 |
| API  | 0 |
| E2E  | 3 |
| EV   | 0 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | Estructura de la guía | `REVIEW.md` creado según D-1 | se ejecuta `node --test test/review-md.test.js` (aserción 1) | el H1 es `# REVIEW.md — Guía de revisión de agile-sddf`; hay exactamente cuatro `##` con el texto literal de la plantilla, en orden; no hay `<!--` ni placeholders entre corchetes (`[ ]` y `[texto](url)` no cuentan) | AC-1, I-1, D-1, T002 |
| UT-002 | Unit | Una viñeta por área | «Qué es «Importante» aquí» escrita según D-2 | aserción 2 | hay seis viñetas de primer nivel con los prefijos `` `skills/` ``, `` `scripts/` ``, `` `docs/adr/` ``, `` `docs/templates/` ``, `` `docs/guardrails/` `` y `Cualquier archivo`, en ese orden | AC-1, I-2, D-2, T004 |
| UT-003 | Unit | Tope de 5 LOW | «Tope de nits» escrita | aserción 3 | la sección contiene `Máximo **5**` | AC-1, D-1, T005 |
| UT-004 | Unit | Cada regla de AC-2 en una sola sección | las cuatro secciones escritas | aserción 4 | los siete marcadores de D-3 (`delega en otro subagente`, `fuera de la ruta de`, `in place`, `skills/*/examples/`, `fuente de reglas`, `ai-no-hidden-characters`, `evals/evals.json`) aparecen en su sección y en ninguna otra | AC-2, I-4, D-3, T004-T007 |
| UT-005 | Unit | Doble vocabulario en cada sección | las cuatro secciones escritas | aserción 5 | cada sección tiene al menos un par término-traducción (`🔴 Important`/`HIGH/MEDIUM`, `🟡 Nit`/`LOW`, `🟣 Pre-existing`/`PREEXISTENTE`) y ningún término aparece sin su traducción | CNF-1, I-3, T005-T008 |
| UT-006 | Unit | Rutas citadas existentes o ignoradas | `REVIEW.md` cita rutas versionadas (`config/runtimes.json`, `skills/*/examples/`…) e ignoradas (`.claude/`, `.agents/`, `.tmp/`…) | aserción 6 | cada ruta existe en disco (prefijo anterior al primer `*` si es un glob) o `git check-ignore -q` la reconoce como ignorada | AC-3, I-5, D-8, T002 |
| UT-007 | Unit | Fuera del paquete npm | `package.json › files` sin cambios | aserción 7 | ninguna entrada es `REVIEW.md`, `*.md`, `/` ni `.` | CNF-2, D-7, T002 |
| UT-008 | Unit | Sin BOM ni caracteres invisibles | `REVIEW.md` guardado en UTF-8 | aserción 8 | los bytes iniciales no son `EF BB BF` y no hay ningún code point de `ai-no-hidden-characters` | CNF-3, D-6, T002, T008 |
| UT-009 | Unit | RED: guía ausente | `test/review-md.test.js` creado y `REVIEW.md` inexistente | se ejecuta `node --test test/review-md.test.js` | la prueba falla y nombra `REVIEW.md` como ausente | T002, F-1 |
| UT-010 | Unit | Error: placeholder sin reemplazar | una copia de trabajo de `REVIEW.md` con `Máximo **[5]**` (mutación temporal, se revierte) | aserción 1 | la prueba falla y señala el placeholder | AC-1, I-1 |
| UT-011 | Unit | Error: regla en dos secciones | una copia de trabajo con `ai-no-hidden-characters` también en «Qué es «Importante» aquí» (mutación temporal) | aserción 4 | la prueba falla y nombra el marcador y las dos secciones | AC-2, D-3 |
| UT-012 | Unit | Error: ruta inexistente y no ignorada | una copia de trabajo que cita `` `docs/guardrails/gr-no-existe.md` `` (mutación temporal) | aserción 6 | la prueba falla y nombra la ruta | AC-3, D-8, F-3 |
| UT-013 | Unit | Error: término sin traducción | una copia de trabajo con `🟡 Nit` sin `LOW` en «Tope de nits» (mutación temporal) | aserción 5 | la prueba falla y nombra la sección | CNF-1, I-3 |
| IT-001 | Integration | La prueba entra en el gate | `test/review-md.test.js` en `test/` | se ejecuta `npm test` | `review-md.test.js` se ejecuta junto al resto y todo pasa con código 0 | CNF-4, D-7, T012 |
| IT-002 | Integration | `REVIEW.md` supera el contrato de validación | `REVIEW.md` en la raíz, revisado por `verify-validation-contract.js:300-303` | se ejecuta `npm run verify:repository` | el paso `contrato de validación` no informa `APROBADA`, `Aprobada`, `review-status` ni `approved` en `REVIEW.md`, y el gate termina con código 0 | CNF-4, D-6, T008, T012 |
| IT-003 | Integration | No se publica en el tarball | `package.json › files` sin cambios | se ejecuta `npm pack --dry-run --json` | la lista de archivos no contiene `REVIEW.md` | CNF-2, T011 |
| E2E-001 | End-to-End | REVIEW.md con las cuatro secciones de la convención | `docs/templates/REVIEW-template.md` define «Qué es «Importante» aquí», «Tope de nits», «No reportar» y «Verificar siempre» | el mantenedor crea `REVIEW.md` en la raíz desde esa plantilla (T003-T008) | `REVIEW.md` tiene las cuatro secciones en orden, sin placeholders ni comentarios; una viñeta por cada área (`skills/`, `scripts/`, `docs/adr/`, `docs/templates/`, `docs/guardrails/`) y otra para cualquier archivo; tope de 5 LOW por revisor; y ninguna sección de formato de salida. Evidencia: UT-001 a UT-003 en verde | AC-1 |
| E2E-002 | End-to-End | Cada regla del repo cae en una sola sección (7 ejemplos) | cada una de las siete reglas de la tabla de ejemplos de AC-2 | se busca en `REVIEW.md` | las tres primeras (delegación entre subagentes, informe fuera de la ruta de `.tmp/`, ADR aceptado editado in place) están solo en «Qué es «Importante» aquí»; secretos falsos en fixtures y copias de instalación como fuente de reglas, solo en «No reportar»; caracteres invisibles y `evals/evals.json`, solo en «Verificar siempre». Evidencia: UT-004 en verde y lectura de cada fila | AC-2 |
| E2E-003 | End-to-End | Lo que ya cubre el gate no se verifica dos veces | `npm run verify:repository` ejecuta los 14 pasos de `scripts/verify-repository.js:17-30` | se revisa «Verificar siempre» y «No reportar» contra esos pasos y sus verificadores (T010) | cada casilla de «Verificar siempre» nombra algo que el gate no ejecuta (con la razón de D-5); «No reportar» nombra los 14 pasos; y ninguna ruta citada deja de existir (UT-006 en verde) | AC-3 |

## Notas de cobertura

- **tasks.md utilizado:** T002 es la tarea de código (prueba unitaria C-2) y origina UT-001 a UT-013. T008, T011 y T012 originan IT-001 a IT-003. T010 es la revisión manual que da evidencia a E2E-003.
- **Sin EV:** la historia no cambia el comportamiento de ningún skill (design.md, «Decisiones de complejidad justificada»), así que el principio 11 no exige evals.
- **E2E manuales:** este repo no tiene runner E2E (`sddf.config.yaml › verify.e2e.command: manual`). Los tres E2E se verifican con la evidencia de los UT indicados más la revisión manual de T010. E2E-002 es un *Scenario Outline*: un caso con las siete filas de ejemplos, no siete casos.
- **UT de error (UT-010 a UT-013):** `test/review-md.test.js` lee el `REVIEW.md` real (D-7), así que los casos negativos se comprueban con una mutación temporal del archivo durante la implementación, que se revierte antes de T012. No forman parte de la suite permanente: dejarlos fijos exigiría que la prueba aceptara un archivo alternativo, y design.md no lo prevé.
- **Gap aceptado:** la elección entre `HIGH` y `MEDIUM` dentro de 🔴 Important no se prueba: ADR-0021 la deja al criterio de cada revisor (STORY-178 D-6; ver CR-001 de design.md).

## Test Cases Progress for STORY-179

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] UT-001: Estructura de la guía
- [ ] UT-002: Una viñeta por área
- [ ] UT-003: Tope de 5 LOW
- [ ] UT-004: Cada regla de AC-2 en una sola sección
- [ ] UT-005: Doble vocabulario en cada sección
- [ ] UT-006: Rutas citadas existentes o ignoradas
- [ ] UT-007: Fuera del paquete npm
- [ ] UT-008: Sin BOM ni caracteres invisibles
- [ ] UT-009: RED: guía ausente
- [ ] UT-010: Error: placeholder sin reemplazar
- [ ] UT-011: Error: regla en dos secciones
- [ ] UT-012: Error: ruta inexistente y no ignorada
- [ ] UT-013: Error: término sin traducción
- [ ] IT-001: La prueba entra en el gate
- [ ] IT-002: `REVIEW.md` supera el contrato de validación
- [ ] IT-003: No se publica en el tarball
- [ ] E2E-001: REVIEW.md con las cuatro secciones de la convención
- [ ] E2E-002: Cada regla del repo cae en una sola sección (7 ejemplos)
- [ ] E2E-003: Lo que ya cubre el gate no se verifica dos veces
