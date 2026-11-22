---
type: finvest-evaluation
story-id: STORY-135
finvest-score: 4.13
decision: APROBADA
evaluated: 2026-10-14
---

# Evaluación FINVEST

## Historia evaluada

> **Como** practitioner que especifica historias con `/story-specify`
> **Quiero** que `story-product-owner` sea un archivo de rol de `story-specify` leído por la sesión del skill
> **Para** resolver los huecos de contexto de una historia con preguntas al usuario en cualquier runtime, sin la carpeta global `agents/`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Están el encabezado `# 📖 Historia` y las tres cláusulas. El `Quiero` es concreto. El `Como` usa "practitioner", que no es una persona canónica del producto (Solo Builder, Local Builder). El `Para` queda genérico ("en cualquier runtime") y no nombra el runtime donde hoy falla. |
| Criterios de aceptación | 5 | La sección `## ✅ Criterios de aceptación` tiene AC-1 (principal) y AC-2 (alternativo/error) nombrados como `###`. |
| Escenarios Gherkin | 5 | 2 bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`. AC-2 es un escenario alternativo con `Pero`. |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ Gateway superado (F_score ≥ 2.5): se evalúan las dimensiones INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Solo toca `skills/story-specify/` y `agents/story-product-owner.agent.md`. Ninguna otra historia de EPIC-24 comparte esos archivos, así que puede ir en cualquier orden respecto de STORY-131 a STORY-134. Solo STORY-136 (retirar `agents/`) depende de ella. |
| **N** – Negociable | 4 | Fija el qué (rol leído por la sesión) y la ubicación que ya decidió ADR-0014. Deja abierto cómo adaptar el contenido del agente al formato de rol. |
| **V** – Valiosa | 3 | El valor es real pero abstracto: "en cualquier runtime" no dice qué usuario gana qué. El beneficio observable es poder refinar historias en un runtime sin directorio de agentes (`agentsDirectory: null` en `config/runtimes.json`), y la historia no lo nombra. |
| **E** – Estimable | 4 | El trabajo está acotado: crear el rol, reescribir las menciones de `skills/story-specify/SKILL.md` (líneas 25, 29, 71, 107, 138 y 240) y eliminar el agente global. Hay algo de incertidumbre: el nombre del archivo de rol no está fijado y las Notas omiten otras referencias que también hay que actualizar, en `skills/story-specify/README.md` (líneas 15, 54 y 67) y `skills/story-specify/evals/evals.json` (líneas 110 y 118). |
| **S** – Small | 3 | 2 escenarios con 9 pasos en total. La cantidad de escenarios es ideal, pero AC-1 concentra 5 pasos y trata la eliminación del agente global como precondición. |
| **T** – Testeable | 4 | Cubre el happy path y el error con `Pero`, con rutas exactas. AC-2 se puede automatizar. AC-1 incluye una entrevista interactiva que no se automatiza fácilmente y solo cubre el disparador "input incompleto" (Paso de creación), no el refinamiento conversacional tras REFINAR (Paso 5B). AC-2 no fija el texto del mensaje. |

**INVEST_Score = (4 + 4 + 3 + 4 + 3 + 4) / 6 = 3.67 / 5.0**

---

## Resultado Final

**F – Formato:** 4.60 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.13 / 5.0
**FINVEST Decisión:** APROBADA

---

## Comentarios y Recomendaciones

### V – Valiosa (3)

- Anclar el valor en un usuario y un runtime concretos. Por ejemplo: "**Como** Solo Builder que especifica historias con `/story-specify` desde Codex … **Para** completar el contexto de una historia aunque mi runtime no instale agentes Markdown (`agentsDirectory: null`)". Así el valor se puede observar con el SMOKE de la épica.

### S – Small (3)

- No hace falta dividirla. Para aligerar AC-1, mover "agents/story-product-owner.agent.md ya no existe" del `Dado` a un `Entonces … Y agents/story-product-owner.agent.md no existe` o a un CNF de limpieza. Eliminar el agente global es un resultado de la historia, no una precondición.

### Observaciones no bloqueantes

- **F (`Como`):** reemplazar "practitioner" por una persona canónica (Solo Builder o Local Builder).
- **E / N:** fijar en Notas el nombre del archivo de rol (por ejemplo, `skills/story-specify/assets/agents/product-owner.md`) para que AC-1 y AC-2 apunten a una ruta exacta.
- **E (Notas):** ampliar la nota de alcance para incluir `skills/story-specify/README.md` y `skills/story-specify/evals/evals.json`, que también nombran `story-product-owner`.
- **T (AC-1):** cubrir también el refinamiento conversacional del Paso 5B (tras una decisión REFINAR), no solo el input incompleto. Puede hacerse con un `Y` adicional o con un Scenario Outline por disparador.
- **T (AC-2):** fijar el texto del mensaje de error siguiendo el estilo del skill (por ejemplo, `❌ Rol local product-owner no encontrado: <ruta>`).
- **Alcance:** considerar una sección `Fuera de alcance` que excluya cambiar el criterio de refinamiento del rol y la retirada de `agents/` (STORY-136).
