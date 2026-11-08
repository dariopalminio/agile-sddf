---
type: testcases
id: STORY-180
slug: STORY-180-story-code-review-lee-review-md-testcases
title: "Test Cases: story-code-review lee REVIEW.md"
story: STORY-180
created: 2026-11-08
updated: 2026-11-08
related:
  - STORY-180-story-code-review-lee-review-md
---

<!-- Referencias -->
[[STORY-180-story-code-review-lee-review-md]]

# Casos de Prueba: story-code-review lee REVIEW.md

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 5 |
| CT   | 0 |
| IT   | 4 |
| API  | 0 |
| E2E  | 5 |
| EV   | 5 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | Agentes sin reglas propias de agile-sddf | Los cuatro archivos de `skills/story-code-review/agents/` | `test/story-code-review-review-md.test.js` busca `/Principio 6\|teléfono descompuesto\|un solo nivel de delegación/` | No hay ninguna coincidencia; con una de las frases presente, la aserción falla | AC-5, D-6, D-8 |
| UT-002 | Unit | `$REVIEW_PATH` declarado en orquestador y agentes | `SKILL.md` y los cuatro `agents/*.agent.md` | La prueba busca la cadena `$REVIEW_PATH` en cada archivo | Los cinco archivos la contienen; si falta en uno, la aserción nombra ese archivo | AC-1, I-3, D-8 |
| UT-003 | Unit | Sección de guía idéntica en los cuatro agentes | Los cuatro agentes con `## Guía de revisión (REVIEW.md)` | La prueba extrae el cuerpo de la sección hasta el siguiente encabezado `## ` y los compara | Los cuatro cuerpos son idénticos; una diferencia de un carácter o la falta de la sección en un agente hace fallar la aserción | AC-1, AC-2, D-3, I-4 |
| UT-004 | Unit | Contrato de la plantilla sin cambios estructurales | `assets/code-review-report-template.md` tras la historia | La prueba lista sus encabezados `##`/`###` y busca `{{REVIEW_STATUS}}` | Los encabezados coinciden exactamente y en orden con la lista anterior a la historia; el placeholder existe; un encabezado nuevo, quitado o reordenado hace fallar la aserción | AC-3, CNF-1, D-5 |
| UT-005 | Unit | Lectura y detección sin git | `SKILL.md` tras la historia | La prueba busca `git show` y `git diff --name-only` | No aparece ninguno de los dos | AC-4, D-1, D-2 |
| IT-001 | Integration | El bloque de contexto del orquestador coincide con lo que esperan los revisores | Paso 3b de `SKILL.md` y «Contexto recibido del orquestador» de los cuatro agentes | Se comparan las variables que lista el bloque con las que declara cada agente | `$REVIEW_PATH` figura en el bloque y en los cuatro agentes con el mismo nombre; el principio compartido del Paso 3b remite a `## Guía de revisión (REVIEW.md)` | AC-1, I-3, D-3 |
| IT-002 | Integration | El Paso 5b y la plantilla usan el mismo placeholder | Paso 5b de `SKILL.md` y la fila `Guía de revisión` de `## Resumen` en la plantilla | Se revisan los dos textos | Ambos usan `{{REVIEW_STATUS}}`; los cinco textos (dos bases y tres sufijos) del Paso 5b coinciden con el Esquema de datos de design.md | AC-1, AC-3, AC-4, I-7 |
| IT-003 | Integration | Detección de reglas modificadas reutiliza `$IMPL_FILES` | Paso 2c (extrae `$IMPL_FILES`) y Paso 2d.2 de `SKILL.md` | Se revisa el orden y la fuente de datos de 2d.2 | 2d.2 se ejecuta después de 2c, compara `REVIEW.md` y `$DOD_PATH` con `$IMPL_FILES` normalizado, y con `$IMPL_FILES` vacío fija `unverifiable` sin detener la revisión | AC-4, I-2, D-2 |
| IT-004 | Integration | Gate determinista en verde | Todos los cambios de la historia aplicados | Se ejecutan `npm test` y `npm run verify:repository` | Ambos terminan con código 0 | CNF-3 |
| EV-001 | Eval | `REVIEW.md` presente llega a los revisores y al árbitro | Caso `review-md-presente-llega-a-revisores-y-arbitro` en `evals.json` (`review_md_present: true`, revisores sin hallazgos) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `REVIEW.md`, `Guía de revisión`, `$REVIEW_PATH` y `(verdict: APPROVED)`; no contiene `sin guía de revisión` | AC-1, D-7 |
| EV-002 | Eval | Secreto falso en `examples/` excluido por «No reportar» | Caso `secreto-falso-en-examples-excluido-por-review-md` (HIGH `BASE-01` en `skills/demo/examples/config.md:3`, «No reportar» que excluye esos fixtures) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `excluido`, `No reportar` y `(verdict: APPROVED)`; no contiene `(verdict: NEEDS-CHANGES)`, `fix-directives.md` ni `READY-FOR-IMPLEMENT` | AC-2, D-4, SMOKE-1 |
| EV-003 | Eval | Proyecto sin `REVIEW.md` conserva el contrato | Caso `sin-review-md-advierte-y-conserva-contrato` (`review_md_present: false`) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `sin guía de revisión`, `## Veredicto`, `## Resumen`, `## Hallazgos por dimensión`, `## Cumplimiento DoD`, `(verdict: APPROVED)` y `CODE-REVIEW`; no contiene `(verdict: BLOCKED)` ni `(verdict: NEEDS-CHANGES)` | AC-3, D-1, D-5, SMOKE-3 |
| EV-004 | Eval | Historia que modifica `REVIEW.md` y el DoD | Caso `historia-modifica-review-md-advierte` (`impl_files` con `REVIEW.md` y `docs/guardrails/dod-story-code-review.md`) | `npm run test:eval -- story-code-review --only <ID>` | La salida contiene `modifica las reglas con las que se la revisa`, `REVIEW.md`, `dod-story-code-review.md`, `working tree` y `(verdict: APPROVED)`; no contiene `git diff`, `git show` ni `(verdict: BLOCKED)` | AC-4, D-2, D-7 |
| EV-005 | Eval | Regresión de los casos existentes, incluidos los fail-fast | TC-001 a TC-023 (y TC-024/TC-025 de STORY-177 si existen) sin cambios | `npm run test:eval -- story-code-review` | Todos pasan su `threshold`: TC-003, TC-004 y TC-022 siguen deteniéndose sin escrituras, y los veredictos de los casos sin `REVIEW.md` no cambian | AC-3, CNF-1 |
| E2E-001 | End-to-End | REVIEW.md llega a los revisores y al árbitro | Una historia en `IMPLEMENT/DONE` y un `REVIEW.md` en la raíz | El usuario ejecuta `/story-code-review STORY-NNN` | «Contexto cargado» muestra la ruta de `REVIEW.md`; el bloque de contexto de los cuatro revisores incluye `$REVIEW_PATH`; el árbitro aplica «No reportar» (Paso 4a.1) y el informe muestra `Guía de revisión: ✓ REVIEW.md` | AC-1 |
| E2E-002 | End-to-End | «No reportar» evita un falso bloqueante | Una historia cuyo alcance incluye un secreto falso en `skills/<skill>/examples/` y un `REVIEW.md` cuya «No reportar» excluye esos fixtures | El usuario ejecuta `/story-code-review STORY-NNN` | El secreto falso no figura como HIGH ni MEDIUM y el veredicto no es `NEEDS-CHANGES` por ese archivo; si un revisor lo reportó, `{{REVIEW_STATUS}}` lo lista como excluido | AC-2 |
| E2E-003 | End-to-End | Proyecto sin REVIEW.md | Un proyecto que instaló agile-sddf sin `REVIEW.md` y una historia en `IMPLEMENT/DONE` | El usuario ejecuta `/story-code-review STORY-NNN` | El skill advierte que no hay guía de revisión; `code-review-report.md` tiene el mismo frontmatter, secciones y veredicto que antes de la historia; la falta de `REVIEW.md` no produce `BLOCKED` ni `NEEDS-CHANGES` | AC-3 |
| E2E-004 | End-to-End | La historia modifica la guía o el DoD | Una historia cuyo `implement-report.md` lista `REVIEW.md` o `docs/guardrails/dod-story-code-review.md` | El usuario ejecuta `/story-code-review STORY-NNN` | El skill advierte, en consola y en `{{REVIEW_STATUS}}`, que la historia modifica las reglas con las que se la revisa, y lee `REVIEW.md` del working tree (ADR de la guía de revisión, STORY-178) | AC-4 |
| E2E-005 | End-to-End | Agentes sin reglas propias de agile-sddf | Los cuatro archivos de `skills/story-code-review/agents/` tras la historia | Se ejecuta `grep -rE "Principio 6\|teléfono descompuesto\|un solo nivel de delegación" skills/story-code-review/agents/` | No devuelve resultados; las reglas siguen vigentes en este repo porque `docs/constitution.md` las declara y `REVIEW.md` las recoge (STORY-179) | AC-5 |

## Notas de cobertura

- **tasks.md usado:** sí. UT-001 a UT-005 corresponden a las cinco aserciones de T008 (D-8); EV-001 a EV-004 a los casos de T004-T007 (D-7); IT-004 a T026.
- **IDs de eval:** EV-001 a EV-004 usan `<ID>` porque el número del caso en `evals.json` se fija en T002 (TC-026 a TC-029 si STORY-177 ya ocupó TC-024 y TC-025).
- **Ejecución de evals:** EV-001 a EV-005 consumen cuota; se ejecutan a criterio humano (AGENTS.md). El gate determinista cubre UT-001 a UT-005 e IT-004.
- **E2E:** son ejecuciones reales del skill sobre una historia; E2E-001 y E2E-004 dependen de que STORY-178 y STORY-179 estén implementadas. E2E-003 requiere un proyecto consumidor sin `REVIEW.md` (o eliminarlo temporalmente en una copia del repo, nunca en el working tree compartido). E2E-005 es determinista y lo automatiza UT-001.
- **Borde de UT:** cada UT incluye en «Entonces» la condición que la hace fallar. No se escriben meta-pruebas de la prueba unitaria.
- **Sin cobertura automatizada:** que un revisor LLM aplique «Qué es «Importante» aquí», «Tope de nits» y «Verificar siempre» (D-3) no es comprobable de forma determinista; lo cubren EV-001 y E2E-001 de forma indirecta. Es un riesgo aceptado en design.md (F-4).
- **CNF-2 (evals primero):** se verifica por el orden de tareas (T004-T007 antes de T009-T021) y el historial de `evals.json`; no tiene caso propio.

## Test Cases Progress for STORY-180

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] UT-001: Agentes sin reglas propias de agile-sddf
- [ ] UT-002: `$REVIEW_PATH` declarado en orquestador y agentes
- [ ] UT-003: Sección de guía idéntica en los cuatro agentes
- [ ] UT-004: Contrato de la plantilla sin cambios estructurales
- [ ] UT-005: Lectura y detección sin git
- [ ] IT-001: El bloque de contexto del orquestador coincide con lo que esperan los revisores
- [ ] IT-002: El Paso 5b y la plantilla usan el mismo placeholder
- [ ] IT-003: Detección de reglas modificadas reutiliza `$IMPL_FILES`
- [ ] IT-004: Gate determinista en verde
- [ ] EV-001: `REVIEW.md` presente llega a los revisores y al árbitro
- [ ] EV-002: Secreto falso en `examples/` excluido por «No reportar»
- [ ] EV-003: Proyecto sin `REVIEW.md` conserva el contrato
- [ ] EV-004: Historia que modifica `REVIEW.md` y el DoD
- [ ] EV-005: Regresión de los casos existentes, incluidos los fail-fast
- [ ] E2E-001: REVIEW.md llega a los revisores y al árbitro
- [ ] E2E-002: «No reportar» evita un falso bloqueante
- [ ] E2E-003: Proyecto sin REVIEW.md
- [ ] E2E-004: La historia modifica la guía o el DoD
- [ ] E2E-005: Agentes sin reglas propias de agile-sddf
