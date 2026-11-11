---
type: code-review-report
story: STORY-182
title: "Code Review Report: Verificación y deduplicación de hallazgos del árbitro"
verdict: NEEDS-CHANGES
date: 2026-11-10
max-severity: MEDIUM
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: STORY-182

## Veredicto

**Veredicto:** `NEEDS-CHANGES` — 1 hallazgo(s) bloqueante(s) (severidad máxima: MEDIUM).

El Tech-Lead-Reviewer y el Integration-Reviewer reportan el mismo defecto `MEDIUM` sobre `skills/story-code-review/SKILL.md:693-696`, con `Archivo:Línea` y escenario de fallo concreto, así que se cuenta una sola vez. La regla nueva del Paso 5b (filas consolidadas con prefijo de estado y `Reportado por:`) convive con la instrucción anterior, sin actualizar, que manda insertar la tabla cruda de `security-report.md` en `{{SECURITY_FINDINGS}}`. Con las entradas de AC-2 (TC-036) o de TC-034, el informe puede salir sin `Reportado por:` o sin el prefijo `no verificado` en la sección de seguridad. El resto son 11 observaciones `LOW` que no bloquean. Los cuatro informes son válidos.

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | STORY-182 — Verificación y deduplicación de hallazgos del árbitro |
| Severidad máxima detectada | MEDIUM |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | ✓ analizado (18 casos — UT:5/CT:0/IT:5/API:0/E2E:3/EV:5) |
| Fecha | 2026-11-10 |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| MEDIUM    | skills/story-code-review/SKILL.md:696 | El Paso 5b quedó con dos instrucciones contradictorias para `{{SECURITY_FINDINGS}}`. La línea 693 (modificada por la historia) dice que cada dimensión recibe **solo** las filas consolidadas de `$FINDINGS`, con prefijo de estado y fusión (694-695). La línea 696, que no se actualizó, sigue diciendo «contenido de la sección "Hallazgos" de `security-report.md`», es decir, la tabla cruda. Como la línea 696 es la regla específica de la sección de seguridad, el árbitro puede seguirla a ella. Fallo: con la entrada de AC-2 / TC-036 (Security HIGH y Tech-Lead MEDIUM sobre `src/auth.js:42`, con Security como representante), el árbitro copia la tabla cruda de `security-report.md` → el hallazgo fusionado aparece sin `Reportado por:` y sin `**[bloqueante]**`, y `code-review-report.md` no cita a los dos revisores como exige AC-2. Además, un HIGH `no verificado` de seguridad (TC-034) aparece sin su prefijo, como si bloqueara. Reportado por: Tech-Lead-Reviewer, Integration-Reviewer | Reescribir la línea 696 así: «`{{SECURITY_FINDINGS}}`: las filas consolidadas de `$FINDINGS` de la dimensión `security` (Pasos 4a.3 y 4a.4, con el prefijo de estado y las reglas de fusionado de 694-695), precedidas por la línea `**Fuentes de checklist:** …`» |
| LOW       | skills/story-code-review/evals/evals.json:1328 | La descripción de TC-034 atribuye la verificación al «Paso 4a.2», que tras CR-002 es la clasificación PREEXISTENTE. La de TC-036 (línea 1440) atribuye la fusión al «Paso 4a.3», que es la verificación. Las dos referencias quedaron desfasadas por la renumeración. Reportado por: Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer | Cambiar a «Paso 4a.3» en TC-034 y a «Paso 4a.4» en TC-036 |
| LOW       | skills/story-code-review/agents/tech-lead-reviewer.agent.md:58 | Dos textos del agente prescriben `MEDIUM` para casos que casi nunca tienen un resultado erróneo observable: la «Disciplina de dependencias» (con texto fijo y sin `Fallo:`) y el `MEDIUM` de mantenibilidad de `## Formato de severidad` (línea 75). Con la nueva sección de evidencia, esos hallazgos quedarán siempre `no verificado`, así que el agente recibe instrucciones que se contradicen. Además, el ejemplo `examples/example-needs-changes-medium/tech-lead-report.md:14` justifica un hallazgo de responsabilidad múltiple con un `Fallo:` que describe otro defecto (el orden de validación). Así enseña a fabricar escenarios. Está relacionado con CR-001, pendiente de confirmar en aceptación | Al cerrar CR-001, alinear la línea 58 y la línea 75 con `## Evidencia de hallazgos bloqueantes`: exigir un `Fallo:` o degradar a `LOW` las dependencias y la mantenibilidad sin fallo observable. Usar en el ejemplo un `Fallo:` que se derive del propio hallazgo |
| LOW       | test/story-code-review-evidence-dedup.test.js:19 | La aserción 6 recorre solo los `*-report.md` de `examples/`. Las filas `HIGH`/`MEDIUM` de `examples/*/fix-directives.md`, que también se migraron con `Fallo:`, no están cubiertas, y una regresión en ellas pasaría la prueba. Además, la expresión de `Archivo:Línea` válido de la aserción 2 acepta cualquier `x:N` en cualquier parte de la fila, no solo en la columna de ubicación | Añadir `fix-directives.md` a los archivos de la aserción 6 y validar la celda de ubicación con `isValidFileLine` en lugar de buscar en toda la fila |

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW | skills/story-code-review/evals/evals.json:1440 | AC-2 exige que `fix-directives.md` muestre el duplicado una sola vez, pero TC-036 solo comprueba `1 hallazgo(s) bloqueante(s)` (el motivo del veredicto en `code-review-report.md`) y no comprueba el total de `fix-directives.md` (`**Total de hallazgos bloqueantes:** 1`, `assets/fix-directives-template.md:18`). La regla está especificada en `SKILL.md:626`; lo débil es la aserción. | Añadir a `expected.contains` de TC-036 `Total de hallazgos bloqueantes:** 1` (o una cadena equivalente de `fix-directives.md`) |
| LOW | skills/story-code-review/SKILL.md:491-494 | Hay un caso límite de AC-1 combinado con AC-2 sin regla clara: un grupo fusionado con un `HIGH` `no verificado` y un `LOW` toma severidad `LOW` (L491) y estado `no verificado` (L494). Así queda un `LOW` con prefijo de estado, que el Paso 5b (L694) no prevé, y 4b (L504) no aclara si cuenta como `LOW`. No cambia el veredicto, que no bloquea en ningún caso. Reportado por: Product-Owner-Reviewer, Integration-Reviewer | Fijar una regla en L494: si la severidad del grupo es `LOW`, el fusionado no lleva estado; o tomar como severidad y estado los del representante; o no fusionar un `no verificado` con miembros que cuentan |
| LOW | specs/flow/STORY-182-verificar-y-deduplicar-hallazgos/implement-report.md:1 | Los escenarios Gherkin AC-1 (los tres ejemplos), AC-2 y AC-3 tienen cada uno un eval con aserciones observables (TC-034/TC-035, TC-036, TC-037). La prueba unitaria solo fija el contrato textual (7/7 en verde). Los evals y los E2E-001..003 no se ejecutaron, lo que es correcto según AGENTS.md porque se ejecutan a criterio humano. Por ahora la cobertura de comportamiento está especificada pero no demostrada. | Ejecutar `npm run test:eval -- story-code-review` (al menos TC-034..TC-037 y los migrados) antes de `/story-acceptance` |

_Fusionado en Calidad de Código: la referencia desfasada de `evals.json:1328` (Pasos 4a.2/4a.3)._

---

### Integración y Arquitectura (Integration-Reviewer)

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| LOW       | specs/flow/STORY-182-verificar-y-deduplicar-hallazgos/testcases.md:35 | UT-003 (línea 35) e IT-001 (línea 38) citan los Pasos 4a.2 y 4a.3, y D-3, D-4, D-9 y F-5 de design.md conservan esa numeración. Solo CR-002 recoge la que quedó (4a.3 y 4a.4). La prueba de contrato ya usa la numeración final. Reportado por: Integration-Reviewer, Product-Owner-Reviewer | Actualizar las referencias de testcases.md o remitir a CR-002 en sus notas de cobertura |

_Fusionados en otras dimensiones: el `MEDIUM` de `SKILL.md:693-696` (en Calidad de Código), la referencia desfasada de `evals.json:1328` (en Calidad de Código) y el caso límite de `SKILL.md:491-494` (en Cobertura de Requisitos)._

---

### Seguridad (Security-Reviewer)

**Fuentes de checklist:** docs/guardrails/gr-code-security-checklist.md, docs/guardrails/gr-ai-security-checklist.md, .claude/skills/security-audit/assets/security-checklist.md, .claude/skills/security-audit/assets/ai-security-checklist.md (63 reglas evaluadas)

| Severidad | Archivo:Línea | Regla | Descripción | Recomendación |
|-----------|---------------|-------|-------------|---------------|
| LOW | skills/story-code-review/SKILL.md:477 | gr-code-security-checklist (semántica: «A change that relaxes any control… states… what compensating control applies») | Un `HIGH` de seguridad sin `Fallo:` queda `no verificado` y no bloquea, aunque cite una regla `(error)` determinista del guardrail (p. ej. `sec-no-credential-literal`), que según `docs/guardrails/gr-code-security-checklist.md:18` «blocks delivery». design.md justifica la relajación y deja el hallazgo visible, pero no trata el caso de las reglas deterministas de seguridad, cuya evidencia es la coincidencia en archivo:línea y no un escenario en prosa. Fallo: Security-Reviewer reporta `HIGH` en `src/config.js:12` por `sec-no-credential-literal` y omite `Fallo:` → el veredicto es `APPROVED` con un secreto commiteado. Lo mitiga que `security-reviewer.agent.md:150` pide escribir `Fallo:`. | Endurecimiento opcional: en 4a.3, considerar suficiente como escenario un hallazgo de seguridad con `Archivo:Línea` válido y un rule-id `(error)` determinista, o anotar en design.md que esta relajación se aceptó a conciencia para la dimensión de seguridad. |

---

### Nota de Tamaño de Cambio

⚠️ Nota informativa: tamaño de cambio elevado (13 archivos modificados). Considera ejecutar /story-split antes de futuras historias similares para reducir el alcance. Esta nota es informativa y no afecta la decisión de este review.

---

### Cobertura de Casos de Prueba (testcases.md)

**Cobertura en testcases.md (Product-Owner-Reviewer):**

| Severidad | AC / Escenario | Descripción | Recomendación |
|-----------|----------------|-------------|---------------|
| LOW | Checklist (specs/flow/STORY-182-verificar-y-deduplicar-hallazgos/testcases.md:64-85) | Las 18 entradas de «Test Cases Progress» siguen en `[ ]`, aunque `implement-report.md` documenta que UT-001..UT-005 e IT-005 pasaron (`node --test` 7/7, `npm test` 556/556). No hay entradas `[!]`. | Marcar `[x]` UT-001..UT-005 e IT-005; dejar EV/E2E en `[ ]` hasta ejecutarlos |
| — | AC-1, AC-2, AC-3, CNF-1..3 | Todos los ACs tienen casos referenciados: AC-1 → UT-003, UT-004, IT-001, IT-002, IT-003, IT-004, EV-001, EV-002, E2E-001; AC-2 → UT-003, IT-001, IT-003, IT-004, EV-003, E2E-002; AC-3 → IT-004, EV-004, E2E-003. Cada escenario Gherkin tiene casos IT, EV y E2E. | — |

_La desalineación de numeración de UT-003 e IT-001 se consolida en Integración y Arquitectura._

**Trazabilidad de diseño en testcases.md (Integration-Reviewer):**

| Severidad | Test Case ID | Descripción | Recomendación |
|-----------|--------------|-------------|---------------|
| — | — | Trazabilidad de diseño correcta en testcases.md | — |

---

## Siguiente acción

Corregir el hallazgo bloqueante de `fix-directives.md` (ronda 1) con `/story-implement STORY-182` (alternativa, porque existe `tasks.md`: `/story-implement-tasks STORY-182`) y volver a ejecutar `/story-code-review STORY-182`. Conviene resolver en la misma ronda los `LOW` de numeración desfasada (`evals.json:1328`, `:1440`; `testcases.md:35`, `:38`), que no bloquean.

Notas del árbitro:

- Las copias instaladas en `.claude/skills/story-code-review/` (SKILL.md y los cuatro agentes) son anteriores a STORY-181 y STORY-182. Esta revisión se ejecutó con ellas, así que los revisores no recibieron la sección nueva `## Evidencia de hallazgos bloqueantes`. Aun así, los dos `MEDIUM` traen `Archivo:Línea` y `Fallo:`, así que también bloquearían con la regla nueva. Para revisar con las reglas nuevas, reinstala con `npx agile-sddf install`.
- Los hallazgos repetidos entre revisores se muestran una vez, con `Reportado por:`, como propone esta historia.

---

## Cumplimiento DoD — Fase CODE-REVIEW

| # | Criterio | Estado | Severidad | Evidencia |
|---|----------|--------|-----------|-----------|
| 1 | Se cumple [[dod-story-implement]] | ⚠️ | — | `implement-report.md`: 20/24 ✓, 4 ⚠️ (evals, CI y CHANGELOG requieren ejecución o se escriben en `/epic-ship`); el criterio «comportamiento coincide con design.md» lo contradice el hallazgo `MEDIUM` sobre I-9 |
| 2 | Se cumplen los estándares del proyecto (`constitution.md`) | ✓ | — | Español, layout fijo, fuente única en `skills/`; sin BOM ni invisibles (Security-Reviewer y Tech-Lead-Reviewer) |
| 3 | Cada escenario Gherkin tiene correspondencia en el código | ✓ | — | Product-Owner-Reviewer: AC-1 (tres ejemplos), AC-2 y AC-3 implementados en los Pasos 4a.3, 4a.4, 4b, 4c, 4e, 4f.2 y 5b, con TC-034..TC-037 |
| 4 | Los componentes respetan la arquitectura de `design.md` | ❌ | MEDIUM | Integration-Reviewer: `SKILL.md:696` contradice I-9 (tablas consolidadas por dimensión) |
| 5 | Sin hallazgo bloqueante de severidad HIGH o MEDIUM | ❌ | MEDIUM | 1 hallazgo `MEDIUM` verificado en `SKILL.md:693-696` |
| 6 | Sin tareas pendientes en `tasks.md` (si existe el archivo) | ✓ | — | `tasks.md`: 25/25 `[x]` |
| 7 | Metadatos frontmatter de `story.md` están completos y correctos con status y substatus actualizados | ✓ | — | `story.md` con id, slug, parent, status/substatus actualizados por este gate |
| 8 | El reporte de revisión de código (`code-review-report.md`) está creado o actualizado | ✓ | — | Este archivo |
| 9 | Revisión de código aprobada (`verdict: APPROVED` en `code-review-report.md`) | ❌ | MEDIUM | `verdict: NEEDS-CHANGES` |

**Resumen:** 5/9 criterios ✓ (1 ⚠️, 3 ❌; los tres ❌ derivan del mismo hallazgo y se resuelven al corregirlo)
