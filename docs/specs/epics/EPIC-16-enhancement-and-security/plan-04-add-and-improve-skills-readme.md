---
alwaysApply: false
type: plan
id: plan-04-add-and-improve-skills-readme
slug: plan-04-add-and-improve-skills-readme
title: "Plan 04: Add and Improve Skills README"
status: COMPLETED
substatus: DONE
parent: EPIC-16-enhancement-and-security
created: 2026-06-05
updated: 2026-06-05
related: [
  - EPIC-16-enhancement-and-security
]
---
[[EPIC-16-enhancement-and-security]]

## Plan (ya ejecutado): Mejorar README.md de story-plan

### Context
El README.md actual de story-plan es mínimo (solo lista los modos de uso en texto plano). La convención del proyecto para skills orquestadores complejos (ej. story-implement-tasks) es tener un README comprehensivo con: posicionamiento en el flujo SDD, precondiciones, tabla de modos, parámetros, transiciones de estado, artefactos por modo y ejemplos CLI. El SKILL.md fue actualizado recientemente para incluir story-testcases como paso por defecto; el README debe reflejar este estado actualizado.

### Archivo a modificar
Un solo archivo: .claude/skills/story-plan/README.md

Reescritura completa. Estructura objetivo (siguiendo la convención de story-implement-tasks/assets/README.md):

H1 + descripción breve — qué es y qué hace en una línea
Posicionamiento en el flujo SDD — diagrama ASCII del ciclo completo, marcando dónde entra story-plan
Precondiciones — tabla con los artefactos/estados requeridos antes de ejecutar
Modos de ejecución — tabla con 3 modos + efecto de --skip-analyze
Parámetros — lista de todos los flags con descripción y nota de exclusión mutua
Artefactos generados — tabla con artefacto, skill generador y condición (en qué modo aplica)
Transiciones de estado — tabla status/substatus
Uso (ejemplos CLI) — los 6 escenarios de la verificación, con descripción breve de cada uno
### Verificación
El README resultante debe:

Reflejar el pipeline default de 4 pasos: design → tasking → testcases → analyze
Mostrar los 3 modos (default, --only-tasks, --only-testcases)
Listar testcases.md como artefacto generado (salvo --only-tasks)
Ser coherente con el SKILL.md ya actualizado

