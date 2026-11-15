---
type: implement-report
id: STORY-190
slug: STORY-190-implement-report
title: "Implement Report: Directivas de corrección desde verify y acceptance"
story: STORY-190
created: 2026-11-14
updated: 2026-11-14
---

# Reporte de Implementación: Directivas de corrección desde verify y acceptance

## Resumen

| Métrica | Valor |
|---|---|
| Historia | STORY-190 |
| Total de tareas | 18 |
| Tareas completadas | 0 (rework: solo correcciones de `fix-directives.md`, ronda 1) |
| Tareas bloqueadas | 0 |
| Tareas omitidas (ya completadas antes) | 18 |
| Fecha de implementación | 2026-11-14 |

**Estado:** ✅ Implementación completa (ronda 1 de corrección aplicada: 3 hallazgos de `story-code-review`)

`story-code-review`, `story-verify` y `story-acceptance` escriben `fix-directives.md` desde la plantilla común
`docs/templates/fix-directives-template.md`, con su `based-on` y un `round` continuo calculado con la misma regla
de dos fuentes (ADR-0022). `story-implement` y `story-implement-tasks` anuncian el gate de origen desde `based-on`,
aceptan una lista blanca vacía sin aviso y avisan con `[WARN]` ante `IMPLEMENT/TODO` sin `fix-directives.md`.

---

## Tabla de Estado por Tarea

| ID | Descripción | Estado | Archivos generados |
|---|---|---|---|
| T001 | Estado de partida: ADR-0022 aceptado, STORY-189 implementada, versiones de evals y línea base | ✓ completado | — |
| T002 | Test de contrato de la plantilla (rojo) | ✓ completado | `test/fix-directives-template.test.js` |
| T003 | Plantilla común central | ✓ completado | `docs/templates/fix-directives-template.md` |
| T004 | Tres semillas idénticas (verde) | ✓ completado | `skills/story-code-review/assets/fix-directives-template.md`, `skills/story-verify/assets/fix-directives-template.md`, `skills/story-acceptance/assets/fix-directives-template.md` |
| T005 | Registro en el README de plantillas | ✓ completado | `docs/templates/README.md` |
| T006 | Evals de `story-code-review` (TC-047, TC-048; TC-002 migrado; 1.2.0 → 1.3.0) | ✓ completado | `skills/story-code-review/evals/evals.json` |
| T007 | `story-code-review`: regla de ronda de dos fuentes, plantilla central → semilla, sin «escritor único» | ✓ completado | `skills/story-code-review/SKILL.md` |
| T008 | Evals de `story-verify` (TC-009 a TC-011; TC-001, TC-005 y TC-008 migrados; 1.2.0 → 1.3.0) | ✓ completado | `skills/story-verify/evals/evals.json` |
| T009 | `story-verify`: paso 6h y mensajes del Paso 8 | ✓ completado | `skills/story-verify/SKILL.md`, `skills/story-verify/README.md` |
| T010 | Evals de `story-acceptance` (TC-017, TC-018; TC-006, TC-012 y TC-016 migrados; 1.2.0 → 1.3.0) | ✓ completado | `skills/story-acceptance/evals/evals.json` |
| T011 | `story-acceptance`: paso 7f, mensajes de 8a/8b y Caso 2 | ✓ completado | `skills/story-acceptance/SKILL.md`, `skills/story-acceptance/README.md` |
| T012 | Evals de `story-implement` (TC-048 a TC-051; 1.5.0 → 1.6.0) | ✓ completado | `skills/story-implement/evals/evals.json` |
| T013 | `story-implement`: `$REWORK_ORIGIN`, línea `Origen:`, lista blanca vacía y aviso de `IMPLEMENT/TODO` | ✓ completado | `skills/story-implement/SKILL.md`, `skills/story-implement/README.md` |
| T014 | Evals de `story-implement-tasks` (TC-010 a TC-012; 1.2.0 → 1.3.0) | ✓ completado | `skills/story-implement-tasks/evals/evals.json` |
| T015 | `story-implement-tasks`: aviso en 2c, origen en 2f.1, filas sin archivo destino en 2f.2 | ✓ completado | `skills/story-implement-tasks/SKILL.md`, `skills/story-implement-tasks/README.md` |
| T016 | Frase del escritor único en la guía del pipeline | ✓ completado | `docs/guides/sddf-commands-pipeline.md` |
| T017 | Coherencia entre archivos (V-4 a V-7) | ✓ completado | — |
| T018 | Gate, bytes sin BOM, graphify y notas | ✓ completado | — |

### Notas de T001 (estado de partida)

- ADR-0022 existe con `status: ACCEPTED` y fija `verify-defect`, la regla de ronda de dos fuentes y la lista blanca vacía de aceptación, igual que `design.md`.
- STORY-189 está implementada: los tres gates escriben `IMPLEMENT/TODO` y los ejecutores registran `$ENTRADA_SUBSTATUS` y aceptan `IMPLEMENT/TODO`.
- Versiones de partida (STORY-189 ya las había subido): `story-code-review` 1.2.0 (46 casos), `story-verify` 1.2.0 (8), `story-acceptance` 1.2.0 (16), `story-implement` 1.5.0 (47), `story-implement-tasks` 1.2.0 (9). Se subió de nuevo la versión menor de cada uno (D-09).
- Línea base: `npm test` 584/584. `npm run verify:repository` falló una vez en «pruebas deterministas» y pasó al reejecutarlo sin cambios (fallo intermitente previo a esta historia).

### Desviaciones respecto del plan

- **CR-002 (documentado en `design.md`):** `story-verify` 6h.2 no añade una fila por un criterio DoD cuyo `❌` se debe solo a defectos `CRITICAL`/`HIGH` que ya son filas. Sin esa regla, AC-1 fila 1 daría 3 filas en vez de 2 y el mismo defecto aparecería dos veces.
- **TC-008 de `story-verify` y TC-016 de `story-acceptance`:** sus descripciones decían «No escribe fix-directives.md (STORY-190)»; ahora dicen que lo escribe. Sus expectativas no cambian: el mensaje del gate usa `📋 Fix directives: … (ronda N)` y no la línea `Ronda de corrección` de `story-code-review`, que esos casos tienen en `not_contains`.
- **Casos de verify con una sola ruta:** en el caso TC-009 de `story-verify` los dos defectos bloqueantes apuntan a `src/auth.py`, que existe en `examples/no-tests-project`; una ruta inexistente no entraría en la lista blanca (D-03).
- **Descripciones de evals con «escritor único»:** tres descripciones de casos (`story-implement` TC-010 y TC-016, `story-implement-tasks` TC-006) y las descripciones generales de los cinco `evals.json` se actualizaron a los tres escritores. Sus expectativas no cambian.

---

## Correcciones de fix-directives.md (ronda 1)

Origen: `code-review-report.md` (`NEEDS-CHANGES`, severidad máxima MEDIUM). Las 18 tareas ya estaban en `[x]`: el rework solo aplica la tabla de instrucciones (pre-paso 2f).

| # | Archivo:Línea | Severidad | Resultado |
|---|---|---|---|
| 1 | skills/story-verify/SKILL.md:563 | MEDIUM | 💻 corregido: `skills/story-verify/SKILL.md` (viñeta de 6h.2 → `` - `<ruta>` (hallazgo #N, #M) ``, el formato que lee `$WHITELIST` en `story-implement` 0c.3) y `skills/story-verify/evals/evals.json` (TC-009: `contains` `` `src/auth.py` (hallazgo #1, #2) ``) |
| 2 | docs/templates/fix-directives-template.md:1 | MEDIUM | 💻 corregido: `docs/templates/fix-directives-template.md` anota cada clave de frontmatter con `# escritor:` en línea completa (convención de `adr-template.md`, porque un comentario al final de la línea contaminaría `title`) y cada sección con `<!-- escritor: … -->`; copia byte a byte en las tres semillas `skills/{story-code-review,story-verify,story-acceptance}/assets/fix-directives-template.md`; 4f.2, 6h.3 y 7f.3 dicen que las anotaciones no se copian a `fix-directives.md` |
| 3 | docs/guardrails/dod-story-code-review.md:17 | MEDIUM | ✓ sin cambios: se cumple al resolver el hallazgo #2 (P13 de la constitución); el DoD es solo lectura |

**Archivos corregidos:** `skills/story-verify/SKILL.md`, `skills/story-verify/evals/evals.json`, `docs/templates/fix-directives-template.md`, `skills/story-code-review/assets/fix-directives-template.md`, `skills/story-verify/assets/fix-directives-template.md`, `skills/story-acceptance/assets/fix-directives-template.md`, `skills/story-code-review/SKILL.md`, `skills/story-acceptance/SKILL.md`
**Hallazgos omitidos por archivo inexistente:** ninguno

**Fuera de la lista blanca, exigidos por la propia `Acción requerida`:** `skills/story-verify/evals/evals.json` (#1), las tres semillas (#2: el test exige igualdad byte a byte) y los `SKILL.md` de `story-code-review` y `story-acceptance` (#2: 4f.2 y 7f.3). La lista blanca de `story-code-review` (4e) solo toma el archivo de la columna `Archivo:Línea`, así que no puede listar los destinos secundarios de una acción.

---

## Cumplimiento DoD — Fase IMPLEMENT

| # | Criterio | Estado | Evidencia / Justificación |
|---|---|---|---|
| 1 | Todos los escenarios Gherkin definidos en `story.md` pasan exitosamente | ⚠️ | Los escenarios se cubren con casos de eval nuevos en los cinco skills; requiere ejecución de `npm run test:eval` — no evaluable por story-implement |
| 2 | Los criterios no funcionales de `story.md` están verificados | ✓ | CNF-1: `test/fix-directives-template.test.js` (8/8); CNF-2: regla idéntica en los tres gates (diff vacío entre los tres bloques); CNF-3/CNF-4: tablas de 6h.2 y 7f.2; CNF-5: `based-on` solo produce `Origen:`; CNF-6: evals antes de cada `SKILL.md` (orden de `tasks.md`); CNF-7: 4e, reglas de filas de 4f y 4h sin cambios; CNF-8: plantillas de reporte y 6c-6g / 7a-7e sin diff; CNF-9: gate verde |
| 3 | El comportamiento coincide con lo especificado en `design.md` | ✓ | C-1 a C-17 implementados; la única decisión nueva (CR-002) quedó registrada en `design.md` |
| 4 | No hay regresiones en las funcionalidades previamente trabajadas | ✓ | `npm test` 592/592 y `npm run verify:repository` exit 0; las expectativas de los casos existentes solo ganaron `contains`/`not_contains` (TC-002 de code-review, TC-001/TC-005 de verify, TC-006/TC-012 de acceptance) |
| 5 | El código sigue las convenciones definidas en `constitution.md` | ✓ | Skills en español, Markdown + Node.js sin dependencias, layout fijo (`verify:fixed-layout` OK); P13: la plantilla anota el escritor de cada clave y sección (ronda 1) |
| 6 | No hay código comentado ni `TODO` sin issue asociado | ✓ | Ninguno en los archivos tocados |
| 7 | No hay variables, imports ni funciones sin usar | ✓ | `test/fix-directives-template.test.js` usa todas sus constantes |
| 8 | El código pasa el linter y el formateador sin errores ni warnings | ✓ | `verify:repository`: sintaxis válida en 58 archivos JavaScript |
| 9 | No se introducen dependencias nuevas sin aprobación del equipo | ✓ | `package.json` sin cambios |
| 10 | Se usó el skill `skill-master` para crear skills nuevos | ✓ | No aplica: no se crearon skills |
| 11 | Ruta de skill nuevo en `files` de `package.json` | ✓ | No aplica: no hay skills nuevos; `files` incluye `skills/`, así que las semillas nuevas se publican (smoke del tarball OK) |
| 12 | Se cumple [[gr-ai-security-checklist]] | ⚠️ | Sin cambios de prompts de subagentes ni de canales `.tmp/`; evaluación completa en `story-code-review` |
| 13 | Se cumple [[gr-code-security-checklist]] | ✓ | Sin secretos, sin ejecución de entrada externa; el único código es un test de lectura de archivos |
| 14 | Se cumple [[gr-skill-creation-checklist]] | ⚠️ | No se crearon skills; los cambios conservan la estructura de cada `SKILL.md`; evaluación completa en `story-code-review` |
| 15 | Los skills críticos deben tener pruebas `evals/evals.json` | ✓ | Los cinco skills tocados tienen casos nuevos; `verify:eval-inventory` OK |
| 16 | Se ejecutaron y evalúan los casos de prueba automáticamente | ⚠️ | Requiere ejecución de tests — `npm run test:eval -- <skill>` lo ejecuta una persona a mano (AGENTS.md) |
| 17 | El `tasks.md` de la historia tiene todas las tareas marcadas como `[x]` | ✓ | 18/18 `[x]` |
| 18 | Si la historia modifica contratos, el README o docs relevantes están actualizados | ✓ | `docs/templates/README.md`, READMEs de los cinco skills y `docs/guides/sddf-commands-pipeline.md` |
| 19 | Decisiones de diseño no previstas documentadas en `design.md` | ✓ | CR-002 |
| 20 | El CHANGELOG se actualiza si aplica | ✓ | No aplica por historia: el bloque de la épica lo escribe `epic-ship` |
| 21 | El build de CI pasa sin errores | ⚠️ | Requiere ejecución de CI; el gate local equivalente (`verify:repository`) pasa |
| 22 | No hay secrets ni credenciales expuestos en el código | ✓ | Ninguno |
| 23 | Las variables de entorno necesarias están documentadas | ✓ | No aplica: no hay variables nuevas |
| 24 | El despliegue puede revertirse sin pérdida de datos | ✓ | Solo Markdown, JSON y un test |

**Resumen:** 18/24 criterios ✓ · 6 ⚠️ · 0 ❌

---

## Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `node --test test/fix-directives-template.test.js` (antes de T003) | 7 fallos, 1 pase (rojo esperado) |
| `node --test test/fix-directives-template.test.js` (tras T004) | 8/8 |
| `npm run verify:links` | OK |
| `npm run verify:eval-inventory` | OK (43 skills) |
| `npm test` | 592/592. Una ejecución posterior a `graphify update .` dio 591/592 y la siguiente, sin cambios, 592/592: fallo intermitente, como el de la línea base |
| `npm run verify:repository` | exit 0 |
| Bytes de los 24 archivos creados o modificados | Sin BOM ni U+FEFF. El test tenía un U+FEFF literal (el escape se convirtió en carácter al escribir); se reemplazó por `String.fromCharCode(0xfeff)` |
| `graphify update .` | Grafo actualizado |
| Ronda 1 — `node --test test/fix-directives-template.test.js` | 8/8 (plantilla anotada y semillas idénticas) |
| Ronda 1 — `npm test` | 592/592 |
| Ronda 1 — `npm run verify:repository` | exit 0 |
| Ronda 1 — bytes de los archivos corregidos | Sin BOM ni U+FEFF |
| Ronda 1 — `graphify update .` | Grafo actualizado |

## Nota sobre los Tests Generados

Los tests generados deben ejecutarse manualmente con el runner del proyecto.

- Los casos nuevos de `npm run test:eval -- <skill>` de `story-code-review`, `story-verify`, `story-acceptance`, `story-implement` y `story-implement-tasks` los ejecuta una persona a mano (AGENTS.md).
- Para el dogfooding hace falta `npx agile-sddf install`: los destinos de runtime (`.claude/skills/`) siguen con la versión anterior de los cinco skills.
