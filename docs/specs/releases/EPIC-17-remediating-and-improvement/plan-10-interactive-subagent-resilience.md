---
type: plan
id: plan-10
slug: plan-10-interactive-subagent-resilience
title: "Resiliencia de entrevistas multivuelta (project-pm como subagente interactivo)"
status: DEFINITION
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# plan-10 — Resiliencia de entrevistas multivuelta

## Propósito

`project-pm` es el único agente del framework diseñado como **subagente interactivo**: conduce entrevistas multivuelta con el usuario usando `AskUserQuestion` mientras corre en un contexto de subagente (invocado por `project-begin`, `project-discovery` y `project-flow`).

**El problema documentado en A6:** `harness-engineering.md` establece que los subagentes no deben interactuar con el usuario (condición #1). `project-pm` viola esta regla intencionalmente — y funciona porque `AskUserQuestion` está disponible para subagentes en Claude Code. El riesgo real es:

1. No hay fallback si `AskUserQuestion` falla o no está disponible (contexto CI, cliente no-interactivo, futuro cambio del harness).
2. La excepción no está documentada: parece una violación del estándar, no una decisión intencional.
3. Los skills invocadores no pasan instrucción de resiliencia a `project-pm`: si la interacción falla, el agente se detiene sin escribir output y el gate de revisión del skill falla en cascada.

## Cambios realizados

### 1. `.claude/agents/project-pm.agent.md`

Agregada sección `## Protocolo de Resiliencia para Entrevistas Multivuelta` entre `## Principios de PM` y `## Estado Begin Intention`. Define degradación en 4 niveles:

- Nivel 1: `AskUserQuestion` normal (interactivo)
- Nivel 2: pregunta como texto markdown inline (si AskUserQuestion no produce respuesta)
- Nivel 3: inferencia con `[inferido: sin respuesta del usuario]` (tras dos intentos sin respuesta)
- Cierre: lista de inferencias bajo `## Inferencias aplicadas` al finalizar en modo degradado

### 2. `docs/knowledge/guides/harness-engineering.md`

Agregado bloque de excepción documentada después de la condición #3 ("tres condiciones para que sea seguro"), antes de `## Resumen de relaciones`. Clasifica `project-pm` como excepción intencional a la condición #1 y referencia su Protocolo de Resiliencia.

### 3. `.claude/skills/project-begin/SKILL.md`

Agregada instrucción de resiliencia al final del prompt del Paso 4 (invocación a `project-pm`):
> Si no puedes obtener respuesta del usuario, aplica tu Protocolo de Resiliencia: degrada a inferencia, marca con `[inferido: sin respuesta del usuario]` y lista las inferencias al final.

### 4. `.claude/skills/project-discovery/SKILL.md`

Ídem en el prompt del Paso 4 — Fase Discovery.

### 5. `.claude/skills/project-flow/SKILL.md`

Ídem en el prompt de:
- Paso 1.4 (Begin Intention)
- Paso 2.4 (Discovery)

## Verificación

- `project-pm.agent.md`: la sección `## Protocolo de Resiliencia` existe entre `## Principios de PM` y el primer `---`.
- `harness-engineering.md`: el bloque `> **Excepción documentada...`  aparece después de la condición #3.
- Cada uno de los tres skills (`project-begin`, `project-discovery`, `project-flow`) termina el bloque del prompt a `project-pm` con la instrucción de resiliencia.
