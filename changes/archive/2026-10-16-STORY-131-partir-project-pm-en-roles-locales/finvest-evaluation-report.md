---
type: finvest-evaluation
story-id: STORY-131
finvest-score: 4.22
decision: APROBADA
evaluated: 2026-10-14
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que evoluciona `project-begin` y `project-discovery`
> **Quiero** separar `project-pm` en un rol de visión propio de `project-begin` y un rol de discovery propio de `project-discovery`
> **Para** que la entrevista de visión y la de discovery funcionen en cualquier runtime, aunque un subagente no pueda preguntar al usuario, y que los skills instalados no dependan de la carpeta global `agents/`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Sección `# 📖 Historia` presente y cláusulas completas. El `Para` ahora expresa el beneficio para quien usa el framework. El `Quiero` todavía describe una reestructuración interna (partir un archivo en dos) más que una capacidad. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 (principal) y AC-2 (alternativo/error) nombrados como `###`. |
| Escenarios Gherkin | 5 | Dos bloques ` ```gherkin `. AC-1 es un Scenario Outline con tabla `Ejemplos` y `Pero`; AC-2 usa `Pero` como escenario de error. |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ F_score ≥ 2.5 — se continúa con la evaluación INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | El choque de nombres con STORY-132 y STORY-133 está resuelto: cada historia escribe su propio archivo (`discovery-pm.md`, `discovery-architect.md`, `discovery-ux.md`). Las tres siguen tocando `skills/project-discovery/SKILL.md`, pero eso solo obliga a un orden (WIP = 1), no bloquea. |
| **N** – Negociable | 4 | El `Quiero` ya no fija nombres de archivo; los nombres viven en los Ejemplos y en Notas, con la convención registrada en ADR-0014. La tabla de CNF-1 dice qué sección va en cada rol, que es un criterio de verificación y no una solución. La redacción de cada rol queda abierta. |
| **V** – Valiosa | 3 | El `Para` habla del beneficio para quien usa el framework y CNF-2 da un indicador observable (menos de 57 líneas de PM por sesión). Pero esta historia sola no entrega por completo que "los skills instalados no dependan de `agents/`": `project-discovery` sigue dependiendo de `project-architect` y `project-ux` hasta que se hagan STORY-132 y STORY-133. |
| **E** – Estimable | 4 | Alcance cerrado y verificado: las 4 secciones de `agents/project-pm.agent.md` (57 líneas), los `SKILL.md` de `project-begin` y `project-discovery`, `project-begin/README.md` y `vision-template.md`. Ningún `evals.json` menciona `project-pm`. La duda "Begin Intention" ↔ "Estado Visión" está cerrada en Notas. |
| **S** – Small | 3 | 3 casos (2 filas del Scenario Outline + AC-2) y 9 pasos, más CNF-1 (tabla de 4 filas) y CNF-2. Es un tamaño pequeño y manejable. |
| **T** – Testeable | 5 | El Scenario Outline usa datos concretos. "No invoca a project-pm" y AC-2 se comprueban con grep o ejecutando el skill sin el archivo de rol. CNF-1 se comprueba recorriendo la tabla y CNF-2 contando líneas. Lo único menos objetivo es "conduce la entrevista con el usuario". |

**INVEST_Score = (4 + 4 + 3 + 4 + 3 + 5) / 6 = 3.83 / 5.0**

---

## Resultado Final

**F – Formato:** 4.60 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** 4.22 / 5.0
**FINVEST Decisión:** ✅ **APROBADA**

---

## Comentarios y Recomendaciones

La historia supera el umbral de aprobación (≥ 4.0). Las recomendaciones siguientes son opcionales.

### V – Valiosa (3)

- Acotar el `Para` a lo que entrega esta historia, por ejemplo: *"y que `project-begin` y la parte de PM de `project-discovery` no dependan de la carpeta global `agents/`"*. La independencia completa de `project-discovery` llega recién con STORY-132 y STORY-133.
- Opcional: agregar un criterio que diga en qué runtime se comprueba, por ejemplo que `/project-begin` funcione en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`), igual que el SMOKE-1 de la épica.

### S – Small (3)

- El tamaño es adecuado y no hace falta dividir la historia. Si se quiere achicar, AC-2 se puede convertir en Scenario Outline con las dos filas (`project-begin` / `begin-intent.md`, `project-discovery` / `discovery-pm.md`). Así quedan cubiertos los dos skills sin agregar escenarios nuevos.

### Otras observaciones (dimensiones ≥ 4)

- **F / Quiero:** se puede expresar como capacidad en vez de como reestructuración, por ejemplo: *"Quiero que `project-begin` y `project-discovery` lleven dentro su propio rol de PM"*.
- **T:** "conduce la entrevista con el usuario" se puede volver comprobable diciendo que la sesión hace preguntas al usuario (`AskUserQuestion` o preguntas inline) sin lanzar un subagente.
