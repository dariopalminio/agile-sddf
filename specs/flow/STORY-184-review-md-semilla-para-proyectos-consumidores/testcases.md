---
type: testcases
id: STORY-184
slug: STORY-184-review-md-semilla-para-proyectos-consumidores-testcases
title: "Test Cases: REVIEW.md semilla para proyectos consumidores"
story: STORY-184
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-184-review-md-semilla-para-proyectos-consumidores
---

<!-- Referencias -->
[[STORY-184-review-md-semilla-para-proyectos-consumidores]]

# Casos de Prueba: REVIEW.md semilla para proyectos consumidores

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 8 |
| CT   | 0 |
| IT   | 3 |
| API  | 0 |
| E2E  | 3 |
| EV   | 4 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | Plantilla del skill idéntica a la central | `skills/sddf-constitution/assets/REVIEW-template.md` copiada de `docs/templates/REVIEW-template.md` | se ejecuta UT-001 de `test/sddf-constitution.test.js` | los dos archivos son iguales byte a byte (`Buffer.equals`). Borde: si difieren, la prueba falla con un mensaje que nombra las dos rutas | CNF-1, I-6, D-1, T004, T005 |
| UT-002 | Unit | Secciones de la plantilla y codificación | la plantilla del skill creada | se ejecuta UT-002 | sus `##` empiezan, en orden, por `Qué es «Importante» aquí`, `Tope de Minor`, `No reportar` y `Verificar siempre` (comparación por prefijo: los dos primeros llevan sufijo); no empieza por `EF BB BF`; no contiene code points de `ai-no-hidden-characters` | AC-1, CNF-4, D-6, T004, T005 |
| UT-003 | Unit | Contrato del Paso 4 en `SKILL.md` | `SKILL.md` modificado (T006-T008) | se ejecuta EV-005 | contiene `### Paso 4 — Sembrar REVIEW.md`, `assets/REVIEW-template.md`, `✅ Creado: REVIEW.md` y `ℹ️ Conservado: REVIEW.md (ya existe)` | AC-1, AC-2, I-4, D-2, T004, T006 |
| UT-004 | Unit | Los evals usan los literales del skill | `evals/evals.json` creado (T002) | se ejecuta EV-005 | existen TC-001 a TC-004; TC-001 exige `✅ Creado: REVIEW.md`; TC-002 y TC-003 exigen `ℹ️ Conservado: REVIEW.md (ya existe)` y excluyen `✅ Creado: REVIEW.md`; TC-004 exige `⚠️ Plantilla no encontrada: assets/REVIEW-template.md`; el archivo no tiene BOM | CNF-3, CNF-4, D-5, T002, T004 |
| UT-005 | Unit | Inventario sin exención | evals creados y exención retirada (T002-T003) | se ejecutan EV-003 y `npm run verify:eval-inventory` | `errors` está vacío; `sddf-constitution` está en `skills` y no está en `missing` ni en `exemptions`; el verificador termina en `[OK]` con 0 excepciones. Borde: con la exención todavía presente, el verificador fallaría con «ya tiene evals y no debe seguir exento» | CNF-3, C-5, D-5, T003, T004 |
| UT-006 | Unit | Artefactos obligatorios del skill | skill fuente en `skills/sddf-constitution/` | se ejecuta E2E-001 de `test/sddf-constitution.test.js` | existen `assets/REVIEW-template.md` y `evals/evals.json` junto a los artefactos anteriores, y el resto de aserciones (nombre, «Templates de solo lectura», «Sin sobreescritura silenciosa») sigue pasando | AC-1, CNF-3, C-6, T004 |
| UT-007 | Unit | Numeración de pasos coherente | `SKILL.md` renumerado (T007) | `grep -n "Paso [0-9]" skills/sddf-constitution/SKILL.md` | los encabezados van del Paso 0 al Paso 6 sin duplicados; el registro en `CLAUDE.md` es el Paso 5 (5a-5c) y el resumen el Paso 6; las tres salidas del Paso 3 («continuar con el Paso 4») apuntan a la semilla; ninguna referencia apunta a un paso inexistente | AC-2, D-2, T007 |
| UT-008 | Unit | Codificación de los archivos del alcance | los seis archivos del alcance escritos | se ejecuta el comando `ai-no-hidden-characters` de `docs/guardrails/gr-ai-security-checklist.md` y se leen los bytes iniciales | no hay coincidencias y ningún archivo empieza por `EF BB BF` | CNF-4, T012 |
| IT-001 | Integration | La instalación distribuye la plantilla | proyecto temporal limpio | `installSDDF` para cada runtime soportado (IT-001 de `test/sddf-constitution.test.js`) | cada destino contiene `sddf-constitution/assets/REVIEW-template.md` | CNF-2, D-6, T004 |
| IT-002 | Integration | Contenido del paquete npm | `package.json › files` sin cambios | `npm pack --dry-run --json` | lista `skills/sddf-constitution/assets/REVIEW-template.md` y `skills/sddf-constitution/evals/evals.json`, y no lista `REVIEW.md` de la raíz | CNF-2, T011 |
| IT-003 | Integration | Gate completo | todos los cambios aplicados | `npm test` y `npm run verify:repository` | ambos terminan con código 0 | CNF-2, CNF-3, CNF-4, T014 |
| EV-001 | Eval | Crea `REVIEW.md` si falta (TC-001) | proyecto con agile-sddf, constitución, seis DoD y `@docs/constitution.md` en `CLAUDE.md`, sin `REVIEW.md`; el usuario responde `n` a cada pregunta | `npm run test:eval -- sddf-constitution --only TC-001` (a criterio humano) | la salida contiene `✅ Creado: REVIEW.md` y los cuatro nombres de sección, y no contiene `ℹ️ Conservado: REVIEW.md` ni `[ERROR]` | AC-1, D-5, T002, T015 |
| EV-002 | Eval | Conserva un `REVIEW.md` existente (TC-002) | igual que EV-001, con un `REVIEW.md` propio en la raíz | `npm run test:eval -- sddf-constitution --only TC-002` | la salida contiene `ℹ️ Conservado: REVIEW.md (ya existe)` y `docs/constitution.md`, y no contiene `✅ Creado: REVIEW.md` ni `Sobreescribir` | AC-2, D-3, T002, T015 |
| EV-003 | Eval | Segunda ejecución sin cambios (TC-003) | `REVIEW.md` creado por una ejecución anterior, idéntico a la plantilla | `npm run test:eval -- sddf-constitution --only TC-003` | la salida contiene `ℹ️ Conservado: REVIEW.md (ya existe)` y no contiene `✅ Creado: REVIEW.md` | AC-3, D-3, T002, T015 |
| EV-004 | Eval | Plantilla ausente no bloquea (TC-004, fail-safe) | sin `REVIEW.md` y sin `assets/REVIEW-template.md` en el skill instalado | `npm run test:eval -- sddf-constitution --only TC-004` | la salida contiene `⚠️ Plantilla no encontrada: assets/REVIEW-template.md` y `docs/constitution.md` (el flujo sigue), y no contiene `✅ Creado: REVIEW.md` | AC-1, F-3, D-5, T002, T015 |
| E2E-001 | End-to-End | Proyecto sin `REVIEW.md` | proyecto temporal en el scratchpad con agile-sddf instalado y sin `REVIEW.md` | el usuario ejecuta `/sddf-constitution` | se crea `REVIEW.md` en la raíz, igual byte a byte a la plantilla, con las secciones «Qué es «Importante» aquí», «Tope de Minor», «No reportar» y «Verificar siempre», y el skill informa `✅ Creado: REVIEW.md` | AC-1, F-1, T013 |
| E2E-002 | End-to-End | `REVIEW.md` ya existe | proyecto temporal con un `REVIEW.md` propio, constitución y seis DoD; se registra su SHA-256 | el usuario ejecuta `/sddf-constitution` respondiendo `n` a cada pregunta | el SHA-256 de `REVIEW.md` no cambia; el skill informa `ℹ️ Conservado: REVIEW.md (ya existe)`; los Pasos de constitución, DoD y registro en `CLAUDE.md` se ejecutan como antes y el resumen muestra `REVIEW.md [conservado]` | AC-2, F-2, T013 |
| E2E-003 | End-to-End | Ejecución repetida (SMOKE-4) | proyecto temporal sin `REVIEW.md` | el usuario ejecuta `/sddf-constitution` dos veces seguidas | la primera informa `✅ Creado: REVIEW.md`; la segunda informa `ℹ️ Conservado: REVIEW.md (ya existe)` y el SHA-256 del archivo es igual tras las dos | AC-3, F-2, T013 |

## Notas de cobertura

- Se usó `tasks.md` para las referencias `T-NNN`. Las tareas T005-T009 (copia de la plantilla, edición de `SKILL.md` y `README.md`) no tienen caso propio: son el objeto de UT-001 a UT-007.
- Cada escenario Gherkin tiene su E2E (AC-1 → E2E-001, AC-2 → E2E-002, AC-3 → E2E-003). Los tres son manuales (T013): el skill es Markdown que ejecuta un LLM y no hay función que llamar desde `node:test` (design.md, D-6). La igualdad byte a byte de AC-2 solo la comprueba E2E-002 con un hash (contrato 6). Los evals no usan `sandbox` y no ven el disco (D-5).
- Los EV-001 a EV-004 corresponden a TC-001 a TC-004 de `skills/sddf-constitution/evals/evals.json`. Se ejecutan a mano y a criterio humano (AGENTS.md), no en el gate. EV-004 es el caso de fallo del skill: el paso no tiene un fail-fast, porque nunca bloquea (F-3).
- Los IDs de esta tabla no coinciden con los títulos de las pruebas de `test/sddf-constitution.test.js` (E2E-001, EV-003, EV-005, IT-001, UT-001, UT-002). La columna «Cuando» nombra la prueba concreta.
- Gap aceptado: el fallo de escritura (`❌ No se pudo crear REVIEW.md`) y `REVIEW.md` como directorio o enlace (F-3) no tienen caso ejecutable. Son ramas de degradación que solo comprueba UT-003, por el literal del contrato.
- Fuera de cobertura (Non-Goals): el comportamiento de la constitución y del DoD, salvo comprobar en E2E-002 que siguen funcionando, y la lectura de `REVIEW.md` por `/story-code-review` (STORY-180).

## Test Cases Progress for STORY-184

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] UT-001: Plantilla del skill idéntica a la central
- [ ] UT-002: Secciones de la plantilla y codificación
- [ ] UT-003: Contrato del Paso 4 en `SKILL.md`
- [ ] UT-004: Los evals usan los literales del skill
- [ ] UT-005: Inventario sin exención
- [ ] UT-006: Artefactos obligatorios del skill
- [ ] UT-007: Numeración de pasos coherente
- [ ] UT-008: Codificación de los archivos del alcance
- [ ] IT-001: La instalación distribuye la plantilla
- [ ] IT-002: Contenido del paquete npm
- [ ] IT-003: Gate completo
- [ ] EV-001: Crea `REVIEW.md` si falta (TC-001)
- [ ] EV-002: Conserva un `REVIEW.md` existente (TC-002)
- [ ] EV-003: Segunda ejecución sin cambios (TC-003)
- [ ] EV-004: Plantilla ausente no bloquea (TC-004, fail-safe)
- [ ] E2E-001: Proyecto sin `REVIEW.md`
- [ ] E2E-002: `REVIEW.md` ya existe
- [ ] E2E-003: Ejecución repetida (SMOKE-4)
