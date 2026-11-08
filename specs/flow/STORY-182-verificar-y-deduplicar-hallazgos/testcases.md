---
type: testcases
id: STORY-182
slug: STORY-182-verificar-y-deduplicar-hallazgos-testcases
title: "Test Cases: Verificación y deduplicación de hallazgos del árbitro"
story: STORY-182
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-182-verificar-y-deduplicar-hallazgos
---

<!-- Referencias -->
[[STORY-182-verificar-y-deduplicar-hallazgos]]

# Casos de Prueba: Verificación y deduplicación de hallazgos del árbitro

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 5 |
| CT   | 0 |
| IT   | 5 |
| API  | 0 |
| E2E  | 3 |
| EV   | 5 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | Sección de evidencia idéntica en los cuatro agentes | Los cuatro `skills/story-code-review/agents/*.agent.md` con `## Evidencia de hallazgos bloqueantes` | `test/story-code-review-evidence-dedup.test.js` extrae el cuerpo de la sección hasta el siguiente `## ` y los compara | Los cuatro cuerpos son idénticos; una diferencia de un carácter o la falta de la sección en un agente hace fallar la aserción y nombra el archivo | CNF-3, D-7, I-1 |
| UT-002 | Unit | Filas de ejemplo de los agentes con evidencia | Las tablas de ejemplo de los cuatro agentes (incluidas `AC / Escenario` y `Test Case ID`) | La prueba recorre sus filas `HIGH`/`MEDIUM` | Todas contienen `Fallo:` y ninguna usa una línea `:0`; la fila `test/file.ts:0` actual hace fallar la aserción | CNF-3, D-2, I-2 |
| UT-003 | Unit | Pasos del árbitro declarados en `SKILL.md` | `skills/story-code-review/SKILL.md` tras la historia | La prueba busca los encabezados de los Pasos 4a.2 y 4a.3 y las cadenas `no verificado` y `Reportado por:` | Los cuatro están presentes; si falta uno, la aserción lo nombra | AC-1, AC-2, D-3, D-4 |
| UT-004 | Unit | Evals de `NEEDS-CHANGES` coherentes con la regla | Todos los casos de `evals.json` cuyo `expected.contains` incluye `(verdict: NEEDS-CHANGES)` | La prueba busca en cada uno un hallazgo `HIGH`/`MEDIUM` con `file_line` válido (ruta sin espacios, `:<n>` o `:<n>-<m>`, `n ≥ 1`, `m ≥ n`) y `failure_scenario` no vacío | Todos lo tienen; un caso sin `failure_scenario`, con `file_line` `src/a.js` (sin línea) o `src/a.js:0` hace fallar la aserción con su ID | AC-1, CNF-2, D-8, I-2 |
| UT-005 | Unit | Ejemplos del skill con evidencia | `skills/story-code-review/examples/*/{tech-lead,product-owner,integration,security}-report.md` | La prueba recorre sus filas `HIGH`/`MEDIUM` | Todas contienen `Fallo:`; las filas actuales de `example-needs-changes/tech-lead-report.md:14-15` y `example-needs-changes-medium/tech-lead-report.md:14` la hacen fallar antes de T019 | CNF-3, C-7 |
| IT-001 | Integration | Verificación antes de fusión y de severidad | Pasos 4a, 4a.1 (si existe), 4a.2, 4a.3 y 4b de `SKILL.md` | Se revisa el orden y la fuente de datos de cada paso | 4a.2 construye `$FINDINGS` desde todas las tablas de los informes válidos; 4a.3 trabaja sobre `$FINDINGS` ya con `estado`; 4b usa la severidad efectiva de I-8; ningún paso posterior lee las tablas crudas | AC-1, AC-2, D-3, D-6, I-4, I-8 |
| IT-002 | Integration | El DoD no reintroduce un `no verificado` | Paso 4c.1 y criterio «Sin hallazgo bloqueante de severidad HIGH o MEDIUM» de `docs/guardrails/dod-story-code-review.md` | Se revisa contra qué datos evalúa 4c.1 | 4c.1 evalúa contra `$FINDINGS`; un `no verificado` no cuenta como bloqueante para ese criterio, así que no genera una fila `DoD-CODE-REVIEW` | AC-1, D-6 |
| IT-003 | Integration | `fix-directives.md` y lista blanca solo con bloqueantes | Pasos 4e y 4f.2 de `SKILL.md` y `assets/fix-directives-template.md` | Se revisa de dónde salen las filas y cómo se escribe un fusionado | Solo entran hallazgos con `estado: bloqueante` y filas DoD; un fusionado ocupa una fila con `Dimensión` de los miembros separadas por `, `; la plantilla no cambia | AC-1, AC-2, D-5, CNF-1 |
| IT-004 | Integration | Tablas del informe consolidadas por dimensión | Paso 5b de `SKILL.md` y los placeholders de `assets/code-review-report-template.md` | Se revisa qué inserta cada placeholder | Cada dimensión recibe sus filas consolidadas con el prefijo de estado; el fusionado va en la dimensión del representante y se quita de las demás, con la fila `Sin hallazgos propios: <N> fusionado(s) en <dimensión>` si la tabla queda vacía; `{{DECISION_RATIONALE}}` cuenta `no verificado` y fusiones; la plantilla no cambia | AC-1, AC-2, AC-3, D-5, D-6, I-9 |
| IT-005 | Integration | Gate determinista en verde | Todos los cambios de la historia aplicados | Se ejecutan `npm test` y `npm run verify:repository` | Ambos terminan con código 0 | CNF-1, CNF-3 |
| EV-001 | Eval | Bloqueantes sin evidencia no cuentan | Caso `bloqueantes-sin-evidencia-no-cuentan` (Tech-Lead `MEDIUM` sin `file_line`; Security `HIGH` en `src/auth.js:42` sin `failure_scenario`) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `no verificado`, `falta Archivo:Línea`, `falta escenario de fallo` y `(verdict: APPROVED)`; no contiene `(verdict: NEEDS-CHANGES)`, `round: 1` ni `READY-FOR-IMPLEMENT` | AC-1 (filas 1-2), D-3, D-8 |
| EV-002 | Eval | Bloqueante verificado junto a uno no verificado | Caso `bloqueante-verificado-junto-a-no-verificado` (Tech-Lead `HIGH` en `src/auth.js:42` con escenario; Integration `MEDIUM` en `src/db.js:10` sin escenario) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `(verdict: NEEDS-CHANGES)`, `1 hallazgo(s) bloqueante(s)`, `bloqueante`, `no verificado`, `fix-directives.md` y `src/auth.js`; no contiene `src/db.js (hallazgo` ni `(verdict: APPROVED)` | AC-1 (fila 3), D-3, D-6, D-8 |
| EV-003 | Eval | Hallazgo duplicado entre revisores se fusiona | Caso `hallazgo-duplicado-entre-revisores-se-fusiona` (Tech-Lead `MEDIUM` y Security `HIGH` en `src/auth.js:42`, misma corrección) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `Reportado por:`, `Tech-Lead-Reviewer`, `Security-Reviewer`, `1 hallazgo(s) bloqueante(s)`, `max-severity: HIGH` y `(verdict: NEEDS-CHANGES)`; no contiene `2 hallazgo(s) bloqueante(s)` | AC-2, D-4, D-5, D-8 |
| EV-004 | Eval | Hallazgos distintos no se fusionan | Caso `hallazgos-distintos-no-se-fusionan` (`src/auth.js:42` token, `src/auth.js:90`, `src/auth.js:42` nombre de variable) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `3 hallazgo(s) bloqueante(s)` y `(verdict: NEEDS-CHANGES)`; no contiene `Reportado por:` ni `fusionado` | AC-3, D-4, D-8 |
| EV-005 | Eval | Regresión de los casos existentes, incluidos los fail-fast | TC-001 a TC-023, con los once casos `NEEDS-CHANGES` migrados con `failure_scenario` (y los de STORY-177 y STORY-180 si existen) | `npm run test:eval -- story-code-review` | Todos pasan su `threshold`: los migrados siguen en `NEEDS-CHANGES`; TC-003, TC-004 y TC-022 siguen deteniéndose sin escrituras; TC-017 sigue en `BLOCKED` | CNF-1, CNF-2, D-8 |
| E2E-001 | End-to-End | Un bloqueante sin evidencia no bloquea (Scenario Outline, tres ejemplos) | Tres revisiones de una historia en `IMPLEMENT/DONE` donde un revisor reporta: (a) `MEDIUM` sin `Archivo:Línea`, con escenario; (b) `HIGH` con `Archivo:Línea`, sin escenario; (c) `HIGH` con los dos | El árbitro consolida los informes de `/story-code-review STORY-NNN` | (a) y (b) figuran en `code-review-report.md` como `no verificado` y no cuentan para `max-severity`, el veredicto ni `fix-directives.md`; (c) figura como `bloqueante`, cuenta para `max-severity: HIGH`, da `NEEDS-CHANGES` y entra en `fix-directives.md` | AC-1 |
| E2E-002 | End-to-End | Deduplicación: un hallazgo repetido aparece una vez | El Tech-Lead-Reviewer reporta `MEDIUM` y el Security-Reviewer `HIGH` sobre el mismo defecto en `src/auth.js:42` | El árbitro consolida los informes | `code-review-report.md` y `fix-directives.md` lo muestran una sola vez, como `HIGH`, con `Reportado por:` citando a los dos revisores | AC-2 |
| E2E-003 | End-to-End | Hallazgos distintos no se fusionan | Tech-Lead en `src/auth.js:42`, Security en `src/auth.js:90` e Integration en `src/auth.js:42` con un defecto que pide otra corrección | El árbitro consolida los informes | `code-review-report.md` muestra los tres por separado y ninguno cita a más de un revisor | AC-3 |

## Notas de cobertura

- **tasks.md usado:** sí. UT-001 a UT-005 corresponden a las cinco aserciones de T008 (D-9); EV-001 a EV-004 a los casos de T004-T007 (D-8); EV-005 a la migración de T003; IT-005 a T024.
- **IDs de eval:** EV-001 a EV-004 usan `<ID>` porque el número en `evals.json` se fija en T002 (TC-030 a TC-033 si STORY-177 y STORY-180 ya ocuparon TC-024 a TC-029).
- **Ejecución de evals:** EV-001 a EV-005 consumen cuota; se ejecutan a criterio humano (AGENTS.md). El gate determinista cubre UT-001 a UT-005 e IT-005.
- **E2E:** son ejecuciones reales del skill; los ejemplos de AC-1 se agrupan en E2E-001 porque proceden de un único Scenario Outline (trazabilidad 1-a-1 con el escenario). EV-001 y EV-002 los cubren por simulación.
- **Fail-fast del skill:** no cambia en esta historia; lo cubren TC-003, TC-004 y TC-022 dentro de EV-005.
- **Borde de UT:** cada UT incluye en «Entonces» la condición que la hace fallar. No se escriben meta-pruebas de la prueba unitaria.
- **Sin cobertura automatizada:** el juicio del árbitro (LLM) sobre si un escenario es concreto o si dos hallazgos piden la misma corrección (D-3, D-4) no es comprobable de forma determinista; lo cubren EV-001 a EV-004 y E2E-001 a E2E-003. Riesgo aceptado en design.md.
- **CNF-2 (evals primero):** se verifica por el orden de tareas (T003-T007 antes de T009-T016) y el historial de `evals.json`; UT-004 fija la coherencia de los casos existentes.
- **CR-001 de design.md** (los `MEDIUM` de mantenibilidad necesitan escenario) no tiene caso: es una consecuencia a confirmar en `/story-acceptance`.

## Test Cases Progress for STORY-182

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] UT-001: Sección de evidencia idéntica en los cuatro agentes
- [ ] UT-002: Filas de ejemplo de los agentes con evidencia
- [ ] UT-003: Pasos del árbitro declarados en `SKILL.md`
- [ ] UT-004: Evals de `NEEDS-CHANGES` coherentes con la regla
- [ ] UT-005: Ejemplos del skill con evidencia
- [ ] IT-001: Verificación antes de fusión y de severidad
- [ ] IT-002: El DoD no reintroduce un `no verificado`
- [ ] IT-003: `fix-directives.md` y lista blanca solo con bloqueantes
- [ ] IT-004: Tablas del informe consolidadas por dimensión
- [ ] IT-005: Gate determinista en verde
- [ ] EV-001: Bloqueantes sin evidencia no cuentan
- [ ] EV-002: Bloqueante verificado junto a uno no verificado
- [ ] EV-003: Hallazgo duplicado entre revisores se fusiona
- [ ] EV-004: Hallazgos distintos no se fusionan
- [ ] EV-005: Regresión de los casos existentes, incluidos los fail-fast
- [ ] E2E-001: Un bloqueante sin evidencia no bloquea (Scenario Outline, tres ejemplos)
- [ ] E2E-002: Deduplicación: un hallazgo repetido aparece una vez
- [ ] E2E-003: Hallazgos distintos no se fusionan
