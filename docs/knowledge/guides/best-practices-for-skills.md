---
type: guide
slug: best-practices-for-skills
title: "Buenas prácticas para LLM Clients: Skills"
date: 2026-03-26
status: null
substatus: null
parent: null
related:
  - best-practices-for-agents
  - best-practices-for-commands
  - harness-engineering
---
<!-- Referencias -->
[[best-practices-for-agents]]
[[best-practices-for-commands]]

# Buenas prácticas para LLM Clients: Skills

Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de skills:

## Skills (Habilidades)

### Agent Skills en Github Copilot (Habilidades del Agente)
Son el mecanismo más avanzado y reutilizable. A diferencia de los simples comandos /, los Skills son carpetas completas que incluyen no solo instrucciones, sino también scripts, recursos y, crucialmente, lógica interna para interactuar con el sistema de archivos, convirtiéndose en una "mini aplicación" que el agente puede ejecutar. Se almacenan en .github/skills/<skill-name>/SKILL.md a nivel de proyecto o en ~/.copilot/skills/ para uso personal.

### Skills en Claude

Los skills son las **habilidades personalizadas o herramientas** que construyes para dárselas a tus agentes. Se definen mediante documentos de texto que actúan como instrucciones continuas para dotar al agente de una especialización deseada, indicándole exactamente cómo debe comportarse o ejecutar una acción exclusiva. Gracias a las skills, los agentes pueden realizar tareas de forma autónoma, como redactar una especificación siguiendo una plantilla, conectarse a aplicaciones externas o aplicar técnicas específicas de escritura.

Assets empaquetados por skill: cada skill incluye su propio subdirectorio `assets/` para portabilidad multi-cliente. Los templates y recursos se copian junto con el skill en la instalación, lo que garantiza que cada skill tenga acceso a sus propios assets sin depender de rutas globales o hardcodeadas.

## Modelo de un solo nivel de delegación

En este modelo, el skill actúa como el punto de entrada y coordinador que invoca agentes especialistas. El skill es responsable de orquestar la ejecución de los agentes, asegurándose de que cada uno realice su tarea específica y luego recopile los resultados para generar la salida final. Este enfoque mantiene la estructura simple y clara, evitando la complejidad de múltiples niveles de delegación.

Los skills son el punto de entrada y el coordinador que invoca agentes especialistas. Es el patrón establecido en este proyecto.

```
skill (entry point + coordinator/orquestador)
    └── agent A (Subagentes A)
    └── agent B (Subagentes B)
    └── agent C (Subagentes C)
```

Esto es acorde a la arquitectura de Claude Code donde la sesión principal actúa como agente primario que orquesta la ejecución de skills y agentes especializados (Subagentes), manteniendo una estructura plana (Sesión → Subagente), clara y eficiente sin necesidad de múltiples niveles de delegación (agentes en .claude/agents/, invocados por la sesión principal).

## Patrón de comunicación inter-agente: `.tmp/<skill>/`

Cuando un skill orquesta múltiples subagentes en paralelo, cada subagente debe escribir sus resultados de forma **independiente** en un directorio temporal aislado, evitando el "teléfono descompuesto" (ver `[[harness-engineering]]`).

### Convención

```
.tmp/
└── <skill-name>/
    ├── <agent-a-output>.md
    ├── <agent-b-output>.md
    └── <agent-c-output>.md
```

### Reglas

1. **Cada skill tiene su propio subdirectorio** `.tmp/<skill-name>/` — nunca se comparte el directorio `.tmp/` raíz entre skills.
2. **Los subagentes escriben directamente** en `.tmp/<skill-name>/` sin recibir el contexto completo del skill orquestador.
3. **El skill sintetizador** (agente final) lee solo los archivos de `.tmp/<skill-name>/` que necesita, no el contexto de la sesión.
4. **El directorio `.tmp/` no se versiona** — debe estar en `.gitignore`.

### Ejemplo: skill `reverse-engineering`

```
.tmp/
└── rfc-architecture.md       # escrito por reverse-engineer-architect
└── rfc-features.md           # escrito por reverse-engineer-product-discovery
└── rfc-business-rules.md     # escrito por reverse-engineer-business-analyst
└── rfc-navigation.md         # escrito por reverse-engineer-ux-flow-mapper
```

El agente `reverse-engineer-synthesizer` lee solo esos cuatro archivos para generar el artefacto final, sin acceder al contexto de la sesión principal.

Nota:
**alwaysApply**: El campo alwaysApply en headers controla si el archivo se inyecta automáticamente en el contexto de cada conversación:
    - alwaysApply: true — Claude Code incluye este archivo en el contexto siempre, sin que el usuario lo pida. Útil para instrucciones globales (ej: CLAUDE.md de un skill).
    - alwaysApply: false — el archivo no se carga automáticamente; solo entra en contexto si el usuario lo referencia explícitamente, o si Claude lo lee con una herramienta.
Es un metadato del runtime para Claude, no del schema SDDF, y borrarlo cambiaría el comportamiento de Claude Code con ese archivo.

https://agentskills.io/home



