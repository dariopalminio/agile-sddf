---
type: finvest-evaluation
story-id: STORY-132
finvest-score: 4.13
decision: APROBADA
evaluated: 2026-10-14
---

# Evaluación FINVEST

## Historia evaluada

> **Como** mantenedor de Agile-SDDF que evoluciona `project-discovery` y `project-planning`
> **Quiero** separar `project-architect` en un rol de arquitecto para `project-discovery` y el rol `planning` de `project-planning`
> **Para** que cada skill cargue solo las instrucciones de arquitectura de su fase y funcione sin la carpeta global `agents/`

---

## Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Formato `Como/Quiero/Para` | 4 | Sección `# 📖 Historia` presente y las tres cláusulas completas. El `Para` es concreto: cada skill carga solo lo de su fase y no depende de `agents/`. El `Quiero` describe una reestructuración interna (partir un archivo) más que una capacidad. |
| Criterios de aceptación | 5 | Sección `## ✅ Criterios de aceptación` con AC-1 (principal) y AC-2 (alternativo/error) nombrados como `###`. |
| Escenarios Gherkin | 5 | Dos bloques ` ```gherkin ` con `Dado/Cuando/Entonces`, `Y` en AC-1 y `Pero` en el escenario de error AC-2. |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 4.60 / 5.0**

✅ F_score ≥ 2.5 — se continúa con la evaluación INVEST.

---

## Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Fuera de `project-discovery` y `project-planning` nada usa `project-architect`: ni `project-flow`, ni `config/`, ni `test/`, ni ningún `evals.json`. Por eso borrar `agents/project-architect.agent.md` no rompe a otros consumidores. Comparte `skills/project-discovery/SKILL.md` con STORY-131 y STORY-133. Eso solo fija un orden (WIP = 1) y no bloquea, porque cada historia escribe su propio archivo de rol. |
| **N** – Negociable | 4 | Los nombres de archivo (`discovery-architect.md`, `planning.md`) salen de una convención ya acordada en ADR-0014 (líneas 44 y 135), no de esta historia. La redacción y la organización de cada rol quedan abiertas. CNF-1 dice qué debe quedar cubierto, no cómo. |
| **V** – Valiosa | 3 | El beneficio es real pero interno y no se mide. Para `project-planning` la historia entrega todo el `Para`, porque su única dependencia de `agents/` es `project-architect`. Para `project-discovery` no: sigue dependiendo de `project-pm` y `project-ux` hasta que se hagan STORY-131 y STORY-133. Tampoco hay indicador de "carga solo lo de su fase" (hoy el agente tiene 60 líneas y cada fase usa una parte). |
| **E** – Estimable | 4 | Alcance cerrado y verificado: `agents/project-architect.agent.md` (60 líneas; Principios + 2 estados) y los dos `SKILL.md` que lo invocan. Falta nombrar `skills/project-planning/README.md`, que también menciona `project-architect`. Tampoco se aclara qué pasa con el frontmatter del agente (`tools`, `model: sonnet`) cuando pasa a ser un archivo de rol leído por la sesión. |
| **S** – Small | 3 | 2 escenarios y 9 pasos, más CNF-1. La señal principal (2 escenarios) es de historia muy pequeña, pero la cantidad de pasos y el trabajo del lado de discovery, que ningún escenario cubre, la llevan a tamaño pequeño. No hace falta dividirla. |
| **T** – Testeable | 4 | Cubre camino feliz y error, con `Pero` comprobable por grep o ejecutando sin el archivo de rol. Dos huecos: (1) del lado de discovery solo hay una precondición ("existe `discovery-architect.md`") y ningún escenario comprueba que `/project-discovery` lea ese rol; (2) "propone las épicas… como antes de la migración" es una comparación sin criterio objetivo. |

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
**FINVEST Decisión:** ✅ **APROBADA**

---

## Comentarios y Recomendaciones

La historia supera el umbral de aprobación (≥ 4.0). Las recomendaciones siguientes son opcionales.

### V – Valiosa (3)

- Acotar el `Para` a lo que entrega esta historia. Por ejemplo: *"…y que `project-planning` funcione sin la carpeta global `agents/` y la parte de arquitectura de `project-discovery` deje de depender de ella"*. La independencia completa de `project-discovery` llega recién con STORY-131 y STORY-133.
- Opcional: agregar un indicador observable al CNF. Por ejemplo, que el rol `planning` no incluya el contenido del estado Discovery y viceversa, o que `/project-planning` funcione en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`), como el SMOKE-1 de la épica.

### S – Small (3)

- El tamaño es adecuado y no hace falta dividirla. Para cubrir los dos skills sin agregar escenarios, AC-2 puede pasar a ser un Scenario Outline con dos filas: `project-discovery` / `discovery-architect.md` y `project-planning` / `planning.md`. Esto también cierra el hueco de T.

### Otras observaciones (dimensiones ≥ 4)

- **T / AC-1:** cambiar "como antes de la migración" por un criterio comprobable. Por ejemplo: *"Y la propuesta respeta la sección `clave: propuesta` del template y queda en staging hasta la confirmación"*.
- **T / discovery:** agregar en AC-1 (o en un Outline) que `/project-discovery` lee `discovery-architect.md` y deja la propuesta fragmentada en `$STAGING_DIR`, sin invocar `project-architect`.
- **E:** agregar a Notas que `skills/project-planning/README.md` también menciona `project-architect` y debe actualizarse. Indicar además qué pasa con el frontmatter del agente (`tools`, `model`) en los archivos de rol.
- **F / Quiero:** se puede expresar como capacidad. Por ejemplo: *"Quiero que `project-discovery` y `project-planning` lleven dentro su propio rol de arquitecto"*.
