---
type: finvest-evaluation
story-id: STORY-143
finvest-score: 4.08
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que prepara una release del framework
> **Quiero** comprobar que los seis reportes de validación cumplen el contrato y que el README lo enlaza como fuente de verdad
> **Para** que ningún consumidor encuentre variantes del vocabulario de veredictos después de publicar

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que prepara una release), la acción es concreta (comprobar los seis reportes y el enlace del README) y el beneficio se puede observar (cero variantes publicadas). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal, AC-2 como alternativo y AC-3 de documentación, todos con nombre. |
| Escenarios Gherkin | 5 | Tiene 3 bloques ` ```gherkin ` bien formados con `Dado/Cuando/Entonces`. AC-1 usa `Y` y AC-2 usa `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Es la historia de cierre de la épica y depende de las seis alineaciones (STORY-139 a STORY-142, STORY-144 y STORY-145) y de la política de STORY-138. Ninguna está entregada: STORY-139 a STORY-142 están en `SPECIFY/DONE`, STORY-144 y STORY-145 siguen en `SPECIFY/IN-PROGRESS` y `docs/policies/validation-contract-policy.md` no existe. El `Dado` de AC-1 y AC-2 exige las alineaciones, y AC-3 exige la política. No llega a 1 porque la secuencia está planificada en la épica y porque el chequeo de AC-2 se puede construir antes: hoy encuentra coincidencias y sirve como prueba en rojo. |
| **N** – Negociable | 4 | Fija el resultado (cero variantes, `## Veredicto` primero, enlace en el README) y deja abiertas decisiones de diseño reales: chequeo determinista en `scripts/verify-*.js` o evals por skill, y el criterio exacto para detectar `approved` como valor. |
| **V** – Valiosa | 4 | El valor es claro y se puede observar: la release sale sin variantes de vocabulario y el README da a los consumidores un único punto de entrada. Cubre CS-2, CS-3, CS-10 y CS-11 y los smoke tests SMOKE-1 y SMOKE-3 de EPIC-25. Si el chequeo se integra en `npm run verify:repository` (CNF-1), el valor dura más allá de la release porque evita regresiones. |
| **E** – Estimable | 3 | Se puede hacer una estimación gruesa, pero hay incertidumbre por volumen. Hay coincidencias de AC-2 que ninguna historia hermana va a corregir (ver Comentarios), y la historia no dice si STORY-143 las corrige o solo las reporta. Tampoco está definido qué es "documentación vigente" ni con qué artefactos de ejemplo se generan los seis reportes de AC-1. |
| **S** – Small | 3 | Tiene 3 escenarios distintos y 11 pasos en total. El entregable es un chequeo de búsqueda, una comprobación de seis reportes y un enlace en el README. Si la limpieza de las coincidencias sin dueño entra en el alcance, la historia crece. |
| **T** – Testeable | 3 | AC-2 y AC-3 se pueden automatizar con búsquedas, pero el oráculo de AC-2 no está cerrado: el criterio para `approved` "se decide en el diseño", y "documentación vigente" no tiene un alcance enumerado. AC-1 depende de generar seis reportes con un LLM sobre artefactos que no se nombran, así que no es determinista. El `Cuando` de AC-3 ("un consumidor busca") no se puede observar. |

**INVEST_Score = (2 + 4 + 4 + 3 + 3 + 3) / 6 = 3.17 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 3 / 5

**FINVEST Score:** 4.08 / 5.0
**FINVEST Decisión:** **APROBADA**

---

## Comentarios y Recomendaciones

**E – Estimable (3): asignar las coincidencias de AC-2 que no tienen dueño.** Una búsqueda sobre el estado actual encuentra variantes que ninguna historia hermana declara en su alcance. Después de las seis alineaciones, AC-2 seguiría fallando por estas:
- `status: approved | needs-changes` en los cuatro subagentes de `skills/story-code-review/agents/*.agent.md` (l. 79–180). STORY-141 los excluye de forma explícita en sus Non-Goals ("Cambiar los cuatro subagentes revisores").
- "Review status approved" en `docs/guardrails/dod-story-code-review.md`, en la semilla `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md` y en los cuatro ejemplos de DoD de `skills/memory-system/examples/`. La evaluación de STORY-141 ya propuso asignarlos a STORY-143.
- `APROBADA` en `docs/requirements/functional/FR-031-evaluacion-de-calidad-con-rubrica-finvest.md:19`, `docs/guides/sddf-commands-pipeline.md:214` y `docs/templates/story-template.md:8`. STORY-140 actualiza la copia de `skills/story-creation/assets/`, pero no la de `docs/templates/`.
- `approved` como valor de veredicto en `docs/architecture/state-machine.md:48`, `docs/domains/domain-story-lifecycle.md:97` y `docs/guides/sddf-commands-pipeline.md:224–234`.

Hay que decidir en las Notas si STORY-143 corrige estas coincidencias o las delega. Corregir documentación no cambia el comportamiento de los skills, así que es compatible con la primera Non-Goal. Los subagentes de `story-code-review` sí son comportamiento y necesitan un dueño explícito.

**T – Testeable (3): enumerar el alcance y las exclusiones de la búsqueda de AC-2.** Hay que reemplazar "skills, templates y documentación vigente" por una lista de rutas y añadir estas exclusiones:
- `docs/adr/`: `ADR-0008-rework-sin-estado-propio.md` está `ACCEPTED` y usa `approved` como valor (l. 34 y 56). Los ADR aceptados son inmutables, así que la búsqueda debe excluirlos o la historia debe prever un ADR que lo reemplace.
- `docs/product/roadmap.md` (append-only) y `docs/product/story-map.md`, que contienen `APROBADA`. Hay que decidir si cuentan como documentación vigente.
- Copias de runtime como `.claude/skills/`: no están versionadas, pero existen en disco con 13 archivos que contienen `APROBADA`. La búsqueda debe limitarse a archivos versionados (`git ls-files`) o a las fuentes.
- `CHANGELOG.md`: solo cuenta `## [Unreleased]`.

**T – Testeable: cerrar el criterio de `approved` en la historia.** Conviene fijarlo en la historia y no delegarlo al diseño: búsqueda que distinga mayúsculas y patrón de valor (por ejemplo, `(verdict|status|review-status)\s*:\s*approved` y `→ approved` en diagramas), no la palabra suelta. La nota de riesgo pone como ejemplo `test-cypress-cucumber`, pero ese skill no existe en `skills/`. Los falsos positivos reales son `skills/memory-system/assets/scaffold/templates/domain-template.md` ("approved English rendering") y nombres de evals como `indice-consistente-veredicto-approved` en `skills/epic-analyze/evals/evals.json`.

**T / I – AC-1: nombrar los artefactos de ejemplo y el modo de verificación.** CS-2 y CS-3 hablan de templates de reporte, pero AC-1 exige generar reportes. Conviene que AC-1 verifique los seis templates (`skills/*/assets/*report*template*.md`) y los `examples/` de forma determinista, y dejar la generación con LLM como eval manual (`npm run test:eval`), porque el repositorio la ejecuta solo a criterio humano. Hay que añadir también la segunda aserción de SMOKE-3, que AC-2 no cubre: `Y "APPROVED" aparece en los seis skills como valor canónico`.

**T – AC-3: hacer observable el `Cuando`.** Se propone: `Cuando se lee la sección de políticas del README` / `Entonces contiene un enlace a docs/policies/validation-contract-policy.md descrito como fuente de verdad del contrato de validación`. Hoy `README.md` no enlaza la política (solo menciona `<SPECS_BASE>/policies/` en la l. 81).

**I – Independencia (2): habilitar trabajo temprano.** Conviene declarar en las Notas que el chequeo de AC-2 se puede implementar antes, en modo informe (sin fallar el gate), y activarse como bloqueante cuando las seis alineaciones se entreguen. Si se integra en `verify:repository` antes de tiempo, rompe el gate de `quality.yml`. AC-3 solo necesita que STORY-138 publique la política.

**S – Small (3): acotar la limpieza.** Si la primera recomendación lleva a corregir documentación dentro de esta historia, conviene limitarla a la lista enumerada. Si aparecen más coincidencias, deben ir a una historia nueva, para que el tamaño no crezca sin control.
