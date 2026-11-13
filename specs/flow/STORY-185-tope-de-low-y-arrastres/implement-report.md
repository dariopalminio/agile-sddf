---
type: implement-report
id: STORY-185
slug: STORY-185-implement-report
title: "Implement Report: Tope de LOW por revisor y sin arrastres entre rondas"
story: STORY-185
created: 2026-11-11
updated: 2026-11-11
---

# Reporte de Implementación: Tope de LOW por revisor y sin arrastres entre rondas

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-185 |
| Total de tareas | 29 |
| Tareas completadas | 29 |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 0 |
| Fecha de implementación | 2026-11-11 |

**Estado:** ✅ Implementación completa

---

## Decisiones de precondición (T001–T003)

- **T001 — STORY-180:** implementada. `SKILL.md` ya resuelve `$REVIEW_PATH` (Paso 2d.1) y la plantilla tiene la fila `Guía de revisión`. I-1 lee «Tope de Minor» desde `$REVIEW_PATH`; no hace falta tratarla como vacía.
- **T002 — STORY-181/182:** implementadas. 4a tiene los sub-pasos 4a.1 («No reportar»), 4a.2 (PREEXISTENTE), 4a.3 (verificación) y 4a.4 (fusión), así que **4a.N = 4a.5**. El Paso 0 ya resolvía `CLI_ROOT`: solo se amplió la frase para nombrar los dos motores. La plantilla tenía `Hallazgos preexistentes`, y la fila `Control de LOW` va después de ella y antes de `Fecha`. `skills/story-code-review/scripts/touched-lines.js` exporta `parseLocation`, que `low-ledger.js` importa (D-9). No hay una segunda copia.
- **T003 — IDs de eval:** el último caso era TC-041, así que se usaron **TC-042 a TC-046** sin renumerar nada.

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Estado de STORY-180 | ✓ completado | — (decisión anotada arriba) |
| T002 | Estado de STORY-181/182, número de sub-paso y origen de `parseLocation` | ✓ completado | — (decisión anotada arriba) |
| T003 | IDs de eval libres | ✓ completado | — |
| T004 | TC-042 tope desde REVIEW.md | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T005 | TC-043 y TC-044 tope por defecto | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T006 | TC-045 y TC-046 arrastre, más la `description` de nivel superior | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T007 | Prueba del motor, aserciones 1–8 (RED) | ✓ completado | `test/story-code-review-low-noise.test.js` |
| T008 | Aserción 9, contrato estático (RED) | ✓ completado | `test/story-code-review-low-noise.test.js` |
| T009 | `parseLocation` (importada de `touched-lines.js`) | ✓ completado | `skills/story-code-review/scripts/low-ledger.js` |
| T010 | `fingerprint` | ✓ completado | `skills/story-code-review/scripts/low-ledger.js` |
| T011 | `locateEntry` | ✓ completado | `skills/story-code-review/scripts/low-ledger.js` |
| T012 | `recordLedger` | ✓ completado | `skills/story-code-review/scripts/low-ledger.js` |
| T013 | `compareLedger` | ✓ completado | `skills/story-code-review/scripts/low-ledger.js` |
| T014 | CLI `compare`/`record` | ✓ completado | `skills/story-code-review/scripts/low-ledger.js` |
| T015 | Cabecera, `## Entrada`, `## Dependencias` y Paso 0 | ✓ completado | `skills/story-code-review/SKILL.md` |
| T016 | Paso 4a.5 «Control de ruido de LOW» | ✓ completado | `skills/story-code-review/SKILL.md` |
| T017 | Pasos 4b y 4c.1 remiten a I-8 | ✓ completado | `skills/story-code-review/SKILL.md` |
| T018 | Paso 5b: nota `ℹ️` y `{{LOW_NOISE_STATUS}}` | ✓ completado | `skills/story-code-review/SKILL.md` |
| T019 | Paso 5c «Registrar los LOW de esta ronda» | ✓ completado | `skills/story-code-review/SKILL.md` |
| T020 | Paso 7, `## Salida` y manejo de errores | ✓ completado | `skills/story-code-review/SKILL.md` |
| T021 | Fila `Control de LOW` en la plantilla | ✓ completado | `skills/story-code-review/assets/code-review-report-template.md` |
| T022 | Regla de orden D-5 en los cuatro agentes | ✓ completado | `skills/story-code-review/agents/{tech-lead,product-owner,integration,security}-reviewer.agent.md` |
| T023 | Frase en el README | ✓ completado | `skills/story-code-review/README.md` |
| T024 | Pruebas del skill | ✓ completado | — |
| T025 | Sin BOM ni U+FEFF | ✓ completado | — |
| T026 | `npm test` y `npm run verify:repository` | ✓ completado | — |
| T027 | Recorrido de AC-1 | ✓ completado | — (anotado abajo) |
| T028 | Recorrido de AC-2 | ✓ completado | — (anotado abajo) |
| T029 | `graphify update .` | ✓ completado | `graphify-out/` |

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `node --test test/story-code-review-low-noise.test.js` antes del motor | ❌ 0/14: RED esperado, porque faltaba `low-ledger.js` |
| `node --test test/story-code-review-low-noise.test.js` tras T014 | 13/14: solo faltaba la aserción 9, el contrato del skill |
| Pruebas de `story-code-review` (low-noise, review-md, preexisting, evidence-dedup, dod-story-code-review, paths) | 57/57 ✓. Antes hubo 1 fallo: TC-045 no traía `failure_scenario` en sus bloqueantes, como pide el contrato de STORY-182. Se añadió el campo |
| `npm test` | 580/580 ✓ |
| `npm run verify:repository` | ✓ «Verificación determinista del repositorio aprobada» (incluido el smoke del tarball; `low-ledger.js` va en el paquete) |
| Búsqueda de `EF BB BF` en los archivos tocados | sin resultados |
| `npm run test:eval -- story-code-review --only TC-042,TC-046 --dry-run` | los casos se planifican. Los evals **no se ejecutaron**: quedan a criterio humano (AGENTS.md) |

## Recorridos sobre el `SKILL.md` final

**AC-1 (F-1, T027):**
- Con `REVIEW.md` que declara «Máximo **3**», la fase 1 del 4a.5 da `$LOW_CAP = 3` y `$LOW_CAP_SOURCE = REVIEW.md`.
- Sin registro ni informe anterior, la fase 2 da `none`. La fase 3 deja visibles los LOW 1 a 3 del Tech-Lead y marca los 9 restantes como `omitido-por-tope`.
- El Paso 4b mantiene `max-severity: LOW` y el 4c da `APPROVED`.
- En el 5b, la tabla muestra `src/a.js:1` a `src/a.js:3`, seguida de la nota `ℹ️ 9 LOW omitidos por el tope (tope 3, REVIEW.md)`. El texto coincide con lo que espera TC-042.
- Si `REVIEW.md` no tiene número, el tope es 5 con origen `por defecto (REVIEW.md sin tope declarado)` y la nota cuenta 7 omitidos (TC-043). Si no hay `REVIEW.md`, el origen es `por defecto (sin REVIEW.md)` (TC-044).

**AC-2 con registro (F-2/F-3, T028):**
- Existe `code-review-lows.json`. El 4a.5 escribe `low-locations.json` e invoca `compare`.
- Si el motor da L1 `unchanged`/`moved` con `overlaps: [L1]` y la descripción es la misma, el LOW queda `omitido-por-arrastre`. No consume cupo y la nota dice `1 LOW arrastrados…`.
- El HIGH y el MEDIUM no pasan por el 4a.5. Siguen siendo bloqueantes en 4c y el 4f escribe `round: 2`, como espera TC-045.
- Si el motor da `changed` con `overlaps: []`, el LOW se muestra (TC-046, invariante de D-3).
- El 5c registra los LOW visibles y los arrastrados con su `current`.

**AC-2 legado sin registro (F-4/F-6):**
- Con informe anterior y sin registro, el 4a.5 da `unavailable` con el motivo `no-ledger` y avisa `⚠️ arrastre no comprobado: no existe code-review-lows.json de la revisión anterior — …`.
- Ningún LOW se omite por arrastre y todos pasan por el tope.
- El 5c crea el primer registro con las huellas actuales. El skill dice explícitamente que esas huellas no prueban nada sobre la ronda anterior.

## Notas de implementación

- `current` y `location` del registro usan siempre la forma `<ruta>:<inicio>-<fin>`, también para una sola línea (`src/calc.js:10-10`), como fija el esquema de I-2/I-5.
- `compareLedger` recibe en `ledger` la **ruta** del registro, no el objeto, para que `no-ledger` e `invalid-ledger` se decidan en el motor. Un registro también es `invalid-ledger` si alguna entrada no tiene `id`, `reviewer`, `location`, `description` o `hash` como cadenas.
- `record` descarta como `skipped` los rangos que pasan del final del archivo, además de las ubicaciones ilegibles y los archivos inexistentes.
- El texto del 4c.2 «El único uso de git del skill es el motor `touched-lines.js`» sigue siendo cierto: `low-ledger.js` no usa git.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | Requiere ejecutar los evals TC-042 a TC-046, lo que no evalúa story-implement. Los recorridos de AC-1 y AC-2 están anotados arriba y el motor tiene las aserciones 1 a 8 en verde |
| 2 | Los criterios no funcionales de `story.md` (performance, seguridad, UX) están verificados | ✓ | CNF-1: la aserción 9 comprueba que no cambian ni las claves del frontmatter ni la fila previa a `Fecha`, y la prueba de encabezados de STORY-180 sigue en verde. CNF-2: los evals y la prueba existían, en RED, antes de editar `SKILL.md` |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | Cumple I-1 a I-9, D-1 a D-9 y los textos del Esquema de datos. Las desviaciones menores están en «Notas de implementación» |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ⚠️ | Requiere ejecución de tests, que no evalúa story-implement. Aun así, se ejecutaron `npm test` (580/580) y `verify:repository`, ambos en verde |
| 5 | El código sigue las convenciones definidas en `constitution.md` | ✓ | Node ≥ 18 sin dependencias, mismo patrón que `touched-lines.js` (CLI con `require.main`, exit 2 y mensajes sin rutas absolutas) y documentación en español |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | No hay en `low-ledger.js` ni en la prueba |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | Todas las funciones y constantes del motor se usan o se exportan (I-7) |
| 8 | El código pasa el linter y el formateador sin errores ni warnings | ⚠️ | El repo no tiene linter configurado. `verify:repository` aprobó |
| 9 | No se introducen dependencias nuevas sin aprobación del equipo | ✓ | Solo `crypto`, `fs` y `path` del runtime |
| 10 | Se uso el skill `skill-master` para crear skills nuevos | ✓ | No aplica: no se crea ningún skill |
| 11 | Si se agrega un nuevo skill, su ruta está en `files` de `package.json` | ✓ | No aplica. `npm pack --dry-run` confirma que el paquete incluye `skills/story-code-review/scripts/low-ledger.js` |
| 12 | Se cumple [[gr-ai-security-checklist]] | ⚠️ | No se evaluó criterio por criterio. El LLM nunca copia huellas (solo escribe el motor) y el registro es dato, no instrucción. Lo audita el Security-Reviewer en `/story-code-review` |
| 13 | Se cumple [[gr-code-security-checklist]] | ⚠️ | No se evaluó criterio por criterio. El motor rechaza rutas con `..` o absolutas, `--out` fuera de `--repo-root` termina en exit 2, no usa `child_process` y los mensajes no exponen rutas del host |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ✓ | No aplica: es una modificación de un skill existente, sin skill nuevo |
| 15 | Los skills críticos deben tener pruebas `evals/evals.json` | ✓ | Se añadieron 5 casos: TC-042 a TC-046 |
| 16 | Se ejecutaron y evalúan los casos de prueba automáticamente según «Test Cases» de `skill-master` | ⚠️ | Requiere ejecutar los evals, que según AGENTS.md quedan a criterio humano: `npm run test:eval -- story-code-review --only TC-042,TC-043,TC-044,TC-045,TC-046` |

**Resumen:** 10/16 criterios ✓ · 6 ⚠️ · 0 ❌

---

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto. La prueba unitaria del motor y del contrato ya se ejecutó en esta sesión, y está en verde. Los evals de simulación TC-042 a TC-046 quedan pendientes de ejecución humana.

Pasos recomendados:
1. Ejecutar `npm run test:eval -- story-code-review --only TC-042,TC-043,TC-044,TC-045,TC-046`
2. Si algún eval falla, revisar los textos de 4a.5 y 5b de `SKILL.md` contra las expectativas `contains`/`not_contains`
3. Consultar `design.md` para verificar que la implementación respeta las interfaces definidas
