---
type: finvest-evaluation
story-id: STORY-128
finvest-score: 4.02
decision: APROBADA
evaluated: 2026-10-17
---

# Evaluación FINVEST

## Historia evaluada

> **Como** Solo Builder y mantenedor de Agile-SDDF que evoluciona el gateway de calidad
> **Quiero** contar con casos de evaluación que demuestren sus veredictos aprobados y bloqueados
> **Para** detectar regresiones antes de distribuir cambios del gateway

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 5 | Tiene el encabezado `# 📖 Historia` del template. El rol es real (el mantenedor), la acción es concreta (casos de evaluación con veredictos aprobados y bloqueados) y el beneficio es observable (detectar regresiones antes de distribuir). |
| Criterios de aceptación | 5 | Tiene la sección `## ✅ Criterios de aceptación` con subapartados `###` nombrados: escenario principal (AC-1), alternativo (AC-2) y de regresión (AC-3). |
| Escenarios Gherkin | 4 | Tiene 3 escenarios en bloques ` ```gherkin ` con Dado/Cuando/Entonces, y AC-3 usa `Y`. No llega a 5 porque no tiene `Scenario Outline` con `Ejemplos` ni `Pero`. |

**F_score = (5 × 0.4) + (5 × 0.3) + (4 × 0.3) = 4.70 / 5.0**

✅ Supera el gateway de formato (F_score ≥ 2.5). Se evalúa INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 2 | Verifica el comportamiento que entregan STORY-124 a STORY-127. Las cuatro están en `SPECIFY/DONE` y `skills/epic-validate/` todavía no existe. Los casos y fixtures de `evals.json` se pueden escribir antes (en rojo), pero el «resultado observado» de AC-1 a AC-3 necesita el gateway real. A diferencia de sus hermanas, las Notas no dicen qué partes se pueden preparar antes ni cómo. |
| **N** – Negociable | 4 | Describe resultados (`APPROVED` o `BLOCKED` esperado y observado) y no el contenido de los casos. La ruta `skills/epic-validate/evals/evals.json` aparece en AC-3, pero viene del criterio de salida CS-9 y de la convención del repo, no es una decisión técnica nueva. |
| **V** – Valiosa | 3 | El valor es claro para el mantenedor y cierra CS-9 de EPIC-23. Sin embargo, es valor de calidad interna, parecido a «mejorar cobertura de pruebas»: el beneficio solo se ve cuando aparece una regresión, y no hay métrica ni señal observable que lo confirme. |
| **E** – Estimable | 4 | El trabajo está acotado: dos o más casos TC-NNN con fixtures de épica (una consistente y una inconsistente) en el formato `evals.json` que ya usa el repo, con `skill-test-evals` y `scripts/run-evals.js` disponibles. Queda una incertidumbre: cómo lograr que el veredicto sea repetible si el runner ejecuta un modelo LLM. |
| **S** – Small | 3 | 3 escenarios con 10 pasos, dentro del tamaño ideal. AC-1 y AC-2 se solapan en parte con AC-3, que vuelve a exigir un caso `APPROVED` y uno `BLOCKED`. |
| **T** – Testeable | 4 | Los resultados son exactos y comparables (`APPROVED`/`BLOCKED`), con caso feliz y alternativo, y se pueden automatizar con `npm run test:eval -- epic-validate`. Tiene dos ambigüedades: AC-2 no dice qué impedimento debe identificarse, y en AC-1/AC-2 «se ejecuta la evaluación del gateway» puede leerse como ejecutar el skill o ejecutar los evals. |

**INVEST_Score = (2 + 4 + 3 + 4 + 3 + 4) / 6 = 3.33 / 5.0**

---

## Resultado Final

**F – Formato:** 4.70 / 5.0
**I – Independencia:** 2 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.02 / 5.0
**FINVEST Decisión:** ✅ APROBADA

> Queda justo en el umbral (4.0). Si se aplican las recomendaciones de I y V, el margen sube sin cambiar el alcance.

---

## Comentarios y Recomendaciones

### I – Independencia (2)

- Agregar en **📎 Notas** una aclaración que separe lo que se puede preparar antes de lo que necesita el gateway. Antes se pueden escribir los fixtures (épica consistente e inconsistente) y los casos TC-NNN con su veredicto esperado, como pruebas en rojo según el TDD de `implement.test_generators: eval`. El «resultado observado» solo se puede comprobar cuando STORY-124 a STORY-127 estén entregadas.
- Declarar el contrato que consumen los casos, el mismo que cita STORY-127: `verdict` en el frontmatter de `epic-validate-report.md` y la sección `## Veredicto`. Así los asserts no dependen de detalles internos del skill.

### V – Valiosa (3)

- Definir en **Para** o en un CNF una señal observable, por ejemplo: «un cambio en el gateway que invierta un veredicto hace fallar `npm run test:eval -- epic-validate` antes de publicar en npm». Con eso el valor deja de ser abstracto y se puede comprobar.

### S – Small (3)

- Unificar AC-1/AC-2 con AC-3 para quitar el solapamiento. Por ejemplo, convertir AC-1 y AC-2 en un `Scenario Outline` con `Ejemplos` (fixture consistente → `APPROVED`, fixture con impedimento → `BLOCKED` + identificador del impedimento) y dejar AC-3 solo para repetibilidad. Esto también sube el componente Gherkin de F a 5.

### Observaciones adicionales (no bloqueantes)

- **T (AC-2):** nombrar el impedimento concreto que tiene el fixture inconsistente (por ejemplo, una historia hija sin `status` terminal o un `SMOKE-N` fallido) para que «identifica el impedimento» se pueda comprobar con un valor exacto.
- **T (AC-1/AC-2):** cambiar «se ejecuta la evaluación del gateway» por «se ejecutan los casos de evaluación de `epic-validate`» para no confundirlo con ejecutar el skill.
- **CNF-2 frente al runner:** `npm run test:eval` ejecuta un modelo LLM (`claude -p` o `codex`), que es un servicio externo y no determinista. Conviene reformular CNF-2: los fixtures son autocontenidos y no requieren red ni comandos externos, y la aserción compara solo el campo `verdict`. Además, conviene aclarar que «sin intervención manual» significa que no hace falta juicio humano por caso, porque AGENTS.md pide que el mantenedor lance `test:eval` manualmente.
