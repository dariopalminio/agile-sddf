---
type: finvest-evaluation
story-id: STORY-134
finvest-score: 4.13
decision: APROBADA
evaluated: 2026-10-14
---

# Evaluación FINVEST

## Historia evaluada

> **Como** practitioner que construye el story map con `/project-story-mapping`
> **Quiero** que `project-story-mapper` sea un archivo de rol de `project-story-mapping` leído por la sesión del skill
> **Para** conducir la sesión de User Story Mapping con preguntas al usuario en cualquier runtime, sin la carpeta global `agents/`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Encabezado `# 📖 Historia` y las tres cláusulas presentes. El `Quiero` es concreto. El `Como` usa "practitioner", que no es una persona canónica de `product/stakeholders.md` / `product/person-user.md` (US-001 Solo Builder, Local Builder). El `Para` es algo genérico ("en cualquier runtime") y no nombra el runtime donde hoy falla. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 (principal) y AC-2 (alternativo/error) nombrados como `###`. |
| Escenarios Gherkin | 5 | 2 bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`. AC-2 es un escenario alternativo con `Pero`. |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ Gateway superado (F_score ≥ 2.5): se evalúan las dimensiones INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Toca solo `skills/project-story-mapping/` y `agents/project-story-mapper.agent.md`; ninguna otra historia de EPIC-24 comparte esos archivos. Puede ir antes o después de STORY-131/132/133. Solo STORY-136 depende de ella (retirar `agents/`). |
| **N** – Negociable | 4 | Fija el qué (rol leído por la sesión) y la ubicación que ya decidió ADR-0014, pero deja abierto cómo adaptar el contenido del agente al formato de rol. |
| **V** – Valiosa | 3 | El valor es real pero queda abstracto: "en cualquier runtime" no dice qué usuario gana qué. En `config/runtimes.json` hay un runtime con `agentsDirectory: null` (Codex), donde hoy el agente global no se instala; ese es el beneficio observable y la historia no lo nombra. |
| **E** – Estimable | 4 | Trabajo acotado: crear el rol en `skills/project-story-mapping/assets/agents/`, reescribir el Paso de delegación (hoy `SKILL.md:94`) y la sección Dependencias (`SKILL.md:39`), eliminar `agents/project-story-mapper.agent.md`. Pequeña incertidumbre: el nombre del archivo de rol no está fijado ("rol story-mapper"). |
| **S** – Small | 3 | 2 escenarios y 9 pasos en total. La cantidad de escenarios es ideal, pero AC-1 concentra 5 pasos e incluye la eliminación del agente global como precondición. |
| **T** – Testeable | 4 | Cubre happy path y error con `Pero`, con rutas exactas. AC-2 es automatizable (ausencia de `product/story-map.md`). AC-1 incluye una entrevista interactiva no automatizable, "staging" no se nombra como ruta (`.tmp/project-story-mapping/story-map.md`) y AC-2 no fija el texto del mensaje. |

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

- Anclar el valor en el usuario y el runtime concretos, como hizo STORY-133. Por ejemplo: "**Como** Solo Builder que construye el story map con `/project-story-mapping` desde Codex … **Para** obtener `product/story-map.md` aunque mi runtime no instale agentes Markdown (`agentsDirectory: null`)". Así el valor se puede observar con el SMOKE de la épica.

### S – Small (3)

- No hace falta dividirla. Para aligerar AC-1, mover "agents/project-story-mapper.agent.md ya no existe" del `Dado` a un `Entonces … Y agents/project-story-mapper.agent.md no existe` o a un CNF de limpieza. Eliminar el agente global es un resultado de la historia, no una precondición.

### Observaciones no bloqueantes

- **F (`Como`):** reemplazar "practitioner" por una persona canónica (US-001 Solo Builder o Local Builder).
- **E / N:** fijar el nombre del archivo de rol en Notas (por ejemplo, `skills/project-story-mapping/assets/agents/story-mapper.md`) para que AC-1 y AC-2 apunten a una ruta exacta.
- **T (AC-1):** nombrar la ruta de staging (`.tmp/project-story-mapping/story-map.md`) y la validación que ya aplica el skill (encabezados `## Personas`, `## Backbone`, `## Walking Skeleton`, `## Release slices`).
- **T (AC-2):** fijar el texto del mensaje de error siguiendo el estilo del skill (por ejemplo, `❌ Rol local story-mapper no encontrado: <ruta>`).
- **Alcance:** considerar una sección `Fuera de alcance` que excluya cambiar el contenido metodológico de la sesión (Jeff Patton) y la retirada de `agents/` (STORY-136).
