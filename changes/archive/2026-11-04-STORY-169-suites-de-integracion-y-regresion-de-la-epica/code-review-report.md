---
type: code-review-report
story: STORY-169
title: "Code Review Report: Suites de integración y regresión de la épica"
verdict: APPROVED
date: 2026-10-31
max-severity: LOW
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-169

## Veredicto

**Veredicto:** `APPROVED` — Sin hallazgos bloqueantes (severidad máxima: LOW).

Los cuatro revisores entregaron informes válidos y aprobaron. Sus 14 hallazgos son LOW: robustez del lector YAML acotado, aserciones de evals mejorables, un desfase de documentación y endurecimiento de un mensaje de error. Ninguno rompe un AC ni el contrato de `design.md`.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-169 — Suites de integración y regresión de la épica |
| Severidad máxima detectada | LOW |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ⏭️ no encontrado — ejecuta /story-testcases para generar la especificación canónica |
| Fecha | 2026-10-31 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/scripts/epic-suites.js:190 | `required` solo vale `true` si el texto es exactamente `true`. `True` y `TRUE`, que son booleanos válidos en YAML 1.2 core, y también `yes`, se leen como `false` sin advertencia. Reproducido: una suite `integration` con `required: True` y un comando no ejecutable sale `not-executable` con `required: false`, y según la tabla del Paso 3e queda `omitida` en vez de bloquear. Es un fallo abierto del gate (contrario a G-06), aunque solo aparece con mayúsculas no canónicas, y este repositorio usa minúsculas | Aceptar `/^(true\|True\|TRUE)$/`. Si se quiere fallar cerrado: tratar como `true` cualquier valor que no sea `false`/`False`/`FALSE` o esté ausente, con una advertencia en `warnings`, y agregar una prueba |
| LOW | skills/epic-validate/scripts/epic-suites.js:181-189 | El lector no fija el nivel de indentación de las propiedades de cada suite. Cualquier `command:` más profundo dentro de la suite (por ejemplo, `env: { command: … }` en bloque) sobrescribe el `command` de la suite. Una línea dentro de `verify` que no coincide con la regex de clave (por ejemplo, la clave entre comillas `"e2e":`) no cierra la suite anterior, así que sus hijos se atribuyen a esa suite. Reproducido: `e2e-regression.command: "ok"` seguido de `env:\n  command: "node …"` ejecutó `node …` | Registrar la indentación de la primera propiedad de la suite (`propIndent`) y aplicar `command`/`required` solo en ese nivel. Ante una línea no reconocida al nivel de clave, poner `current = null`. Agregar un caso de prueba para cada situación |
| LOW | skills/epic-validate/scripts/epic-suites.js:134-157 | `scalarOf` no rechaza los indicadores YAML que no entiende: bloque `\|`/`>`/`>-`, alias `*x`, ancla `&x` y tag `!x`. Los devuelve como comando, en contra de su propio JSDoc («un dato que no se entiende nunca se convierte en un comando») y del Riesgo de `design.md` («anclas → `command` null»). Hoy lo mitiga `precheckCommand`: `command: >-` y `command: *alias` salieron `not-executable` con un motivo engañoso («ejecutable no encontrado (no está en el PATH)»), sin falso `pass`. Los escapes `\x`/`\u` de `"…"` no se decodifican. No hay prueba de comilla sin cerrar ni de escapes | Devolver `null` si el escalar plano empieza por `\|`, `>`, `*`, `&`, `!`, `%`, `@` o un acento grave, para que el motivo sea `<key> no declara command` en lugar de uno de PATH. Agregar pruebas de comilla sin cerrar, `\"` y `''` |
| LOW | test/epic-suites.test.js:248 | La prueba unitaria `readEpicSuites lee el verify real del repo` depende del `sddf.config.yaml` real y fija `integration.command === 'node scripts/verify-fixed-layout.js'` con `required: true`. Un cambio legítimo de configuración rompe una prueba del parser | Se puede mantener como prueba de CNF-1, pero conviene afirmar solo la forma (tres claves declaradas, `command` string, `required` boolean) y dejar los valores concretos para fixtures |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/evals/evals.json:TC-032 | AC-1 exige registrar **por suite** comando, resultado y duración, pero TC-032 solo asserta los comandos de `integration` y `e2e-regression` y una única duración (`12.3`); no comprueba `` `npm run test:e2e` `` ni las duraciones `2.1` y `4.5`, y `pasa` puede aparecer en cualquier parte del reporte. Aserción débil, no hueco funcional. | Añadir a `contains` `` `npm run test:e2e` ``, `2.1` y `4.5` (o una fila completa de la tabla, p. ej. `` | integration | `true` | `npm run test:integration` | pasa | 2.1 | ``). |
| LOW | skills/epic-validate/evals/evals.json:TC-037 | AC-3 pide que el reporte registre «integration» como fallida y «e2e» como no ejecutable; TC-037 asserta `fallida` y `no ejecutable` de forma suelta, sin atarlos a la suite correspondiente (un intercambio de suites pasaría el eval). | Assertar las filas de `suites-epica` o los encabezados de motivo `OPE-04: integration` / `OPE-04: e2e` junto a su veredicto. |
| LOW | skills/epic-validate/evals/evals.json:TC-011 | AC-4 fila 3 (criterio incumplido → NEEDS-CHANGES) se apoya en TC-011, de STORY-125, cuyo input no declara las suites de nivel épica: la precondición «todas las suites de nivel épica pasan» no se modela (`OPE-04` queda `omitida`). El veredicto observable sigue siendo el esperado. | Opcional: agregar un caso hermano de TC-038 con `check:docs` → código 1 y las tres suites en `pass`, para que los cuatro ejemplos de AC-4 compartan precondición. |
| LOW | specs/flow/STORY-169-suites-de-integracion-y-regresion-de-la-epica/implement-report.md:0 | Los pasos `Entonces … el veredicto es "<X>"` de AC-1..AC-4 dependen del agente (SKILL.md) y solo están especificados en TC-032..TC-039, que siguen pendientes de ejecución manual (V-7). La clasificación del motor sí está verificada con `node --test`. Conforme a AGENTS.md (evals a criterio humano), no se penaliza más allá de LOW. | Ejecutar `npm run test:eval -- epic-validate` (al menos TC-032..TC-039 y TC-001..TC-031 por el efecto de `OPE-04 omitida`) antes de ACCEPTANCE y registrar el resultado. |

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/epic-validate/scripts/epic-suites.js:190 | `readEpicSuites` solo reconoce `required: true` en minúsculas. Un valor YAML válido como `True` o `TRUE` se lee como `false` (comprobado: `required: True` → `false`). Así, una suite obligatoria `not-executable` se registraría como `omitida` en vez de bloquear, lo que deja abierto el gate. El contrato I1/`Suite` dice «`required` leído». El `sddf.config.yaml` actual usa minúsculas, así que hoy no hay impacto | Comparar sin distinguir mayúsculas (`/^true$/i`) o tratar un valor de `required` que no sea exactamente `true`/`false` como `true` (fail-closed, G-06). Agregar un caso en `test/epic-suites.test.js` |
| LOW | skills/epic-validate/scripts/epic-suites.js:189 | El lector no limita `command` al primer nivel bajo la clave de la suite. Un `command` anidado más profundo (p. ej. `e2e-regression: { env: { command: d } }` en bloque) sobrescribe el `command` de la suite (comprobado: devuelve `d`). D-4 limita la lectura a `verify.<key>.command`. El esquema de `verify` no declara subclaves, así que es un caso límite | Fijar la indentación del primer hijo de la suite y aceptar `command`/`required` solo en esa indentación |
| LOW | skills/epic-validate/SKILL.md:287 | La fila `absent` de la tabla de efecto pide escribir la advertencia `⚠️ clave <key> no declarada en verify`. El párrafo siguiente (:289) pide registrar además cada `warnings` del motor, que para esa clave es el mismo texto. Un agente puede escribir la advertencia dos veces bajo `suites-epica`. No afecta al veredicto | Indicar que las advertencias de `suites-epica` son exactamente las de `warnings` del motor (sin duplicar), o que la fila `absent` remite a ellas |
| LOW | docs/domains/domain-skills-map.md:21 | La fila de `epic-validate` en el mapa de skills sigue declarando que de `sddf.config.yaml` solo se lee `verify.e2e-smoke`. Ahora el skill (y el motor `run`) leen también `verify.integration`, `verify.e2e` y `verify.e2e-regression` (`command`, `required`). Es un desfase de documentación no listado en design.md | Agregar las tres claves a la columna de entradas del mapa |
| LOW | specs/flow/STORY-169-suites-de-integracion-y-regresion-de-la-epica/design.md:12 | El frontmatter conserva `updated: 2026-10-29`, aunque se agregó la sección «Notas de implementación (2026-10-30)» | Actualizar `updated` a `2026-10-30` |

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md (78 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/epic-validate/scripts/epic-suites.js:260 | gr-code-security-checklist (semántica: mensajes de error sin rutas absolutas del host) | El nuevo branch `run` del `catch` devuelve `err.message` tal cual. Cuando `sddf.config.yaml` existe pero no se puede leer (`fs.readFileSync` en la línea 203), Node incluye la ruta absoluta del host en el mensaje (p. ej. `EACCES: permission denied, open 'D:\…\sddf.config.yaml'`). `SKILL.md` (Paso 3e y tabla de errores, línea 449) copia ese `error` como motivo en `epic-validate-report.md`, que es un artefacto versionado. | Normalizar el error del branch `run`, por ejemplo `` `sddf.config.yaml ilegible (${err.code})` ``, o reemplazar `repoRoot` por una ruta relativa antes de serializar. Así la ruta absoluta del host no llega al reporte. |

---

### Nota de Tamaño de Cambio

ℹ️ Nota informativa: tamaño de cambio aceptable (9 archivos modificados) — sin acción requerida.

---

### Cobertura de Casos de Prueba (testcases.md)

⏭️ testcases.md no encontrado — análisis de cobertura omitido. Considera ejecutar /story-testcases para generar la especificación canónica de pruebas.

---

## Siguiente acción

Ejecuta `/story-verify STORY-169`. Antes de ACCEPTANCE, conviene ejecutar manualmente `npm run test:eval -- epic-validate`, porque TC-032..TC-039 verifican la composición del veredicto de AC-1..AC-4. Los hallazgos LOW quedan como mejoras opcionales. El más relevante es el de `required: True`, en `epic-suites.js:190`, que deja el gate abierto: lo señalaron dos revisores.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md` registra 19/24 ✓, 5 ⚠️ y 0 ❌. Los ⚠️ son los evals TC-032..TC-039, pendientes de ejecución manual, el CI y el linter, que el repositorio no tiene. Requiere acceso a CI/CD; no es evaluable desde los artefactos disponibles |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Tech-Lead-Reviewer: estilo CommonJS sin dependencias, kebab-case y sin secretos (status `approved`) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1..AC-4 y sus 9 ejemplos trazados al motor (31/31 `node --test`) y a los evals TC-032..TC-039, TC-006 y TC-011. AC-4 lo cubre `OPE-03` (SKILL.md, Paso 3d) |
| 4 | Los componentes respetan la arquitectura de `design.md` | ✓ | — | Integration-Reviewer: C1–C3, C5–C8, I1/I2, `SuitesResult`/`Suite` y la tabla de clasificación conformes, con las desviaciones documentadas en las Notas de implementación. `verify:repository` pasa |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ✓ | — | Severidad máxima entre los cuatro informes válidos: LOW |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 27/27 `[x]` y 0 `[ ]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | Frontmatter completo. Este review lo deja en `CODE-REVIEW/DONE` con `updated: 2026-10-31` |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo (2026-10-31) |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ✓ | — | `verdict: APPROVED` en el frontmatter |

**Resumen:** 8/9 criterios ✓ · 1 ⚠️ · 0 ❌
