---
type: finvest-evaluation
story-id: STORY-133
finvest-score: 4.22
decision: APROBADA
evaluated: 2026-10-14
---

# Evaluación FINVEST

## Historia evaluada

> **Como** Solo Builder y Product Owner que ejecuta `/project-discovery` desde Codex
> **Quiero** que la sesión del skill asuma el rol UX leyendo un rol local en lugar de delegar en el agente global `project-ux`
> **Para** obtener los hallazgos UX del discovery aunque mi runtime no soporte subagentes

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Encabezado `# 📖 Historia` y las tres cláusulas presentes. El `Quiero` describe el comportamiento observable y el `Para` es concreto. El `Como` es débil porque nombra dos roles, y el Product Owner (US-003 en `product/stakeholders.md`) no ejecuta `/project-discovery`. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 (principal), AC-2 (alternativo) y AC-3 (error) nombrados como `###`. |
| Escenarios Gherkin | 5 | 3 bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`. AC-2 es un escenario alternativo con `Pero`. |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ Gateway superado (F_score ≥ 2.5): se evalúan las dimensiones INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Comparte el directorio `skills/project-discovery/assets/agents/` con STORY-131 y STORY-132, pero cada rol es un archivo propio con nombre por origen (ADR-0014) y el orden entre las tres historias es libre. Los Non-Goals excluyen explícitamente los otros dos roles. |
| **N** – Negociable | 4 | La historia expresa el comportamiento esperado (la sesión asume el rol en lugar de delegar) y deja el nombre del archivo como restricción en Notas. Los Non-Goals acotan el alcance sin prescribir cómo adaptar el contenido del agente al rol. |
| **V** – Valiosa | 4 | El valor es claro para el usuario y se puede observar: obtener los hallazgos UX en Codex, el único runtime con `agentsDirectory: null`. Lo valida el SMOKE-1 de la épica. Las Notas corrigen la premisa de la delegación anidada con evidencia verificada. |
| **E** – Estimable | 4 | El trabajo está acotado: crear `discovery-ux.md`, reescribir el Paso 5 de `project-discovery`, eliminar `agents/project-ux.agent.md` y quitar sus referencias. La incertidumbre sobre la delegación anidada quedó resuelta. |
| **S** – Small | 3 | 3 escenarios y 14 pasos en total. La cantidad de escenarios está en el rango ideal, pero AC-1 concentra 6 pasos. |
| **T** – Testeable | 4 | Cubre happy path, alternativo y error, con rutas exactas. AC-2 es una búsqueda verificable y AC-3 tiene una condición observable ("termina sin escribir en $SPECS_BASE"). AC-1 incluye un refinamiento interactivo con el usuario, que no se puede automatizar, y AC-3 no fija el texto del mensaje de error. |

**INVEST_Score = (4 + 4 + 4 + 4 + 3 + 4) / 6 = 3.83 / 5.0**

---

## Resultado Final

**F – Formato:** 4.60 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 4 / 5

**FINVEST Score:** 4.22 / 5.0
**FINVEST Decisión:** APROBADA

---

## Comentarios y Recomendaciones

### S – Small (3)

- El tamaño es adecuado y no hace falta dividirla. Para que AC-1 quede más liviano, se puede mover el paso "Y el paso de propuesta de requisitos recibe esa misma ruta como $UX_FINDINGS_PATH" a un CNF de contrato entre pasos. Así AC-1 se enfoca en lo que observa el usuario.

### Observaciones no bloqueantes

- **F (`Como`):** dejar un solo rol: "Como Solo Builder que ejecuta `/project-discovery` desde Codex". El Product Owner no es usuario de `/project-discovery` según `product/stakeholders.md`.
- **T (AC-3):** si se quiere automatizar la prueba, fijar el texto exacto del mensaje, siguiendo el estilo del skill (por ejemplo, `❌ Rol local discovery-ux no encontrado.`).
- **Épica:** el criterio de salida "se resuelve la delegación de `project-ux`" (`epic.md:40`) sigue partiendo de una premisa que las Notas de esta historia desmienten. Conviene corregirlo en la épica.
