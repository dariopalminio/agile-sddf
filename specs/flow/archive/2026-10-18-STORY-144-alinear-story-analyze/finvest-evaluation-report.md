---
type: finvest-evaluation
story-id: STORY-144
finvest-score: 4.25
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que prepara una historia con `story-plan`
> **Quiero** que `analyze.md` declare un veredicto `APPROVED` o `NEEDS-CHANGES` en una sección `## Veredicto` al inicio y en el campo `verdict`
> **Para** que `story-plan` y CI decidan si la historia está lista para implementar sin interpretar el «Estado general» ni contar ERRORes en el texto

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (0–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia`. El rol es real (mantenedor que prepara una historia con `story-plan`), la acción es concreta (`## Veredicto` al inicio y `verdict` con dos valores) y el beneficio se puede observar (decidir sin interpretar el «Estado general»). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación`, con AC-1 como escenario principal y AC-2 como alternativo, ambos con nombre. |
| Escenarios Gherkin | 5 | Tiene 2 bloques ` ```gherkin ` bien formados. AC-1 es un Esquema del escenario con `Ejemplos` y `Y` en el `Entonces`; AC-2 usa `Y` y `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 5.00 / 5.0**

✅ Pasa el gateway de formato y continúa con INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 3 | Declara que depende de STORY-138, que no se entregó: `docs/policies/validation-contract-policy.md` todavía no existe. Ningún AC exige la política, y los dos valores ya están fijados en la propia historia y en CS-6 de EPIC-25, así que la dependencia está desacoplada. Hay un acoplamiento sin declarar: AC-2 obliga a cambiar `skills/story-plan/SKILL.md`, un segundo skill que ninguna otra historia de la épica toca. |
| **N** – Negociable | 4 | Fija el resultado (`## Veredicto` primero, `verdict` en el frontmatter, regla de mapeo por severidad) y deja abierta una decisión de diseño explícita: conservar o eliminar el «Estado general». Las Notas describen el estado actual y no imponen una solución. |
| **V** – Valiosa | 4 | El valor es claro y se puede observar: CI y `story-plan` leen un campo en lugar de interpretar texto. Hay un beneficio que la historia no menciona: hoy `story-plan` marca `⚠️` ante cualquier inconsistencia, ERROR o WARNING (`skills/story-plan/SKILL.md:317–319`), y su resumen informa `PLAN/IN-PROGRESS (no actualizado — hay ERROREs pendientes)` (l. 383–390) aunque con solo WARNINGs `story-analyze` sí haya pasado la historia a `READY-FOR-IMPLEMENT/DONE`. Decidir por `verdict` elimina esa contradicción. |
| **E** – Estimable | 3 | Es un cambio de texto sin lógica nueva: la regla ERROR → bloqueo ya existe. Pero las Notas tienen dos errores y el inventario está incompleto. (1) La transición la escribe `story-analyze` en su Paso 9a (`skills/story-analyze/SKILL.md:480–489`), no `story-plan`; `story-plan` lo declara así (`SKILL.md:63` y `117`). (2) CNF-1 habla de tipos A–D, pero el skill define seis tipos, A–F (`SKILL.md:413–420`): E (criterio DoD PLAN, ERROR) y F (AC sin caso de prueba, WARNING). Además hay dos templates que alinear: `assets/analyze-report-template.md` y el template de fallback embebido en `SKILL.md` (l. 567 en adelante), que ya divergen entre sí (el fallback tiene la fila de cobertura de testcases y el asset no). Se puede estimar con talla de camiseta, pero el volumen no se ve desde la historia. |
| **S** – Small | 3 | Hay 2 escenarios distintos. Las 3 filas de AC-1 son datos de una sola regla de mapeo. El entregable abarca dos skills (`story-analyze` y el resumen de `story-plan`), con sus evals y ejemplos, lo que la deja en el límite superior de "pequeña". |
| **T** – Testeable | 4 | AC-1 se puede automatizar con aserciones sobre la primera sección y el frontmatter. Hay dos puntos débiles. El `Pero` de AC-2 dice "como hoy", pero hoy el resumen de `story-plan` no distingue ERROR de WARNING (ver V), así que la referencia es ambigua. Y "story.md no pasa a READY-FOR-IMPLEMENT" no fija el estado esperado: el skill usa `PLAN/IN-PROGRESS` en el resumen y `PLANNING` en la tabla de transiciones (`skills/story-analyze/SKILL.md:62`). |

**INVEST_Score = (3 + 4 + 4 + 3 + 3 + 4) / 6 = 3.50 / 5.0**

---

## Resultado Final

**F – Formato:** 5.00 / 5.0
**I – Independencia:** 3 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 3 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.25 / 5.0
**FINVEST Decisión:** **APROBADA**

---

## Comentarios y Recomendaciones

**E – Estimable (3): corregir quién escribe la transición.** La nota "`story-plan` deja la historia en `READY-FOR-IMPLEMENT/DONE` solo si no hay ERRORes" es inexacta. La transición la escribe `story-analyze` en el Paso 9a (`skills/story-analyze/SKILL.md:480–489`), en modo manual y en modo Agent, y `story-plan` solo informa el resultado (`skills/story-plan/SKILL.md:63` y `117`). Conviene reformular AC-2 en dos partes: `story-analyze` condiciona la transición a `verdict`, y `story-plan` informa el veredicto en su resumen. Por ejemplo: `Entonces story.md conserva el status que tenía Y el resumen de story-plan informa "NEEDS-CHANGES"`.

**E – Estimable (3): corregir CNF-1 y completar el inventario.** CNF-1 debe decir tipos A–F, no A–D. El tipo E (criterio DoD PLAN incumplido con `enforcement: error`) es ERROR y debe producir `NEEDS-CHANGES`; el tipo F es WARNING. Conviene listar en las Notas los puntos que cambian:
- en `skills/story-analyze/SKILL.md`, la descripción del reporte (l. 459), el Paso 9a (l. 480–489), el resumen de consola (l. 516–537), la sección Salida (l. 562–565) y el template de fallback (l. 567 en adelante, con su `**Estado general:**` en la l. 597);
- `skills/story-analyze/assets/analyze-report-template.md`;
- `skills/story-analyze/README.md:16`;
- `skills/story-analyze/examples/output/analyze.md`, que tiene «Estado general: ❌ Inconsistencias bloqueantes» (l. 29);
- `skills/story-analyze/evals/evals.json` (5 casos; TC-001 espera "estado general OK" y TC-004 espera "Sin inconsistencias bloqueantes", l. 114);
- en `skills/story-plan/`, el Paso 5 (l. 313–320), el resumen final (l. 375–392), `examples/output/plan-summary.md` y `evals/evals.json`;
- `skills/story-implement-tasks/SKILL.md:249` ("verifica que story-analyze no reportó ERROREs").

**T – Testeable (4): quitar "como hoy" del `Pero` de AC-2.** Hoy el resumen de `story-plan` informa `PLAN/IN-PROGRESS` ante cualquier inconsistencia, incluidas las que son solo WARNING. Se propone que AC-2 nombre el comportamiento esperado: `Pero con verdict APPROVED story.md pasa a READY-FOR-IMPLEMENT/DONE y el resumen de story-plan informa "APPROVED", aunque analyze.md tenga WARNINGs`. Así el escenario cubre también la corrección de la incoherencia actual. Conviene además fijar el estado que conserva story.md con `NEEDS-CHANGES`: el skill usa `PLAN/IN-PROGRESS` en el resumen y `PLANNING` en la tabla de transiciones (l. 62).

**I – Independencia (3): declarar el alcance en `story-plan`.** La historia modifica dos skills, pero las Notas solo mencionan `story-analyze`. Hay que declarar `story-plan` en el alcance y publicar `docs/policies/validation-contract-policy.md` (STORY-138) antes o en paralelo, para que `SKILL.md` cite la política. Si se adelanta, bastan los valores de CS-6 y una tarea para alinear la referencia después.

**CNF-1 sin escenario que lo verifique.** Las filas de AC-1 ya fijan la regla ERROR → `NEEDS-CHANGES` y WARNING → `APPROVED`, pero no nombran los tipos. Conviene expresarlas por tipo para fijar la regla actual en el escenario. Por ejemplo: `| solo WARNING (tipos C, D o F) | APPROVED |` y `| al menos un ERROR (tipos A, B o E) | NEEDS-CHANGES |`.
