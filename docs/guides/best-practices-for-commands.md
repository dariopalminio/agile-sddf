---
type: guide
slug: best-practices-for-commands
title: "Buenas prácticas para LLM Clients: Comandos"
date: 2026-03-26
status: null
substatus: null
parent: null
related:                                    # opcional, si tiene relación con otros nodos
  - best-practices-for-agents
  - best-practices-for-skills
---
<!-- Referencias -->
[[best-practices-for-agents]]
[[best-practices-for-skills]]

# Buenas prácticas para LLM Clients: Comandos

Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de comandos:

## Comandos

Evitamos usar comandos.

### Comandos en Opencode

Los comandos en OpenCode se ubican en ".opencode/commands/": Permite máxima personalización para un desarrollo acelerado. Puedes usar argumentos ($ARGUMENTS), inyectar resultados de comandos Bash (!), y referenciar archivos (@), lo que te permite construir flujos de automatización complejos.

### Comandos en Claude

Los comandos en Claude se ubican en ".claude/commands/". En Claude evitamos usar comandos por se más bien legacy ("precede al sistema de skills actual"). En su lugar, recomendamos usar skills para encapsular la lógica de ejecución, lo que permite una mayor flexibilidad y reutilización. Sin embargo, si decides usar comandos, asegúrate de que estén bien documentados y organizados para facilitar su uso.

### Comandos en Github Copilot

En Github Copilot, los comandos son los prompts y se ubican en .github/prompts/*.prompt.md. Son fragmentos de texto que actúan como instrucciones para guiar a Copilot en la generación de código o contenido. Funcionan como templates independientes y reutilizables que se activan manualmente a través de un comando / desde el chat. Ideales para tareas estandarizadas y repetitivas que ejecutas cada cierto tiempo.


