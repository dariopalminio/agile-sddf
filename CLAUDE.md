# Agile Spec-Driven-Development Framework (SDDF)

Este es un proyecto Agile Spec-Driven-Development Framework (SDDF) que utiliza un sistema de agentes y skills para automatizar el proceso de especificación de proyectos software, desde la intención inicial hasta la planificación del backlog, y escritura de historias de usuario. El sistema está diseñado para ser minimalista, utilizando solo archivos Markdown para definir agentes, skills y documentos de salida, con un enfoque en la claridad, la estructura y la colaboración entre agentes.

Sistema CLI multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software, desde la intención inicial hasta el backlog planificado, siguiendo un workflow secuencial con control de WIP y revisión humana en cada etapa.

Sistema cliente agentico minimalista que automatiza la especificación de features e historias de usuario solo con skills y templates (scripts y agentes si es necesario) para crear historias de usuario, dividirlas y evaluarlas.

## Vision

**Para** builders, freelancers, developers y equipos ágiles que usan IA para acelerar el desarrollo de software,
**quienes** sufren de procesos manuales, prompts inconsistentes y falta de estructura para transformar ideas en código de calidad de manera predecible,
**nuestro producto** Agile Spec-Driven-Development Framework (SDDF) es un sistema multiagente minimalista que automatiza todo el ciclo de vida del desarrollo de software – desde la intención inicial hasta el código desplegado – utilizando Spec-Driven Development (OpenSpec / SpecKit), agentes especializados, skills reutilizables y comandos simples, todo gestionado con archivos Markdown.

**Que** provee un workflow ágil y secuencial con control de WIP, puntos de compromiso y revisiones humanas integradas: planificación de releases, especificación de features, descomposición en historias de usuario, generación de tareas, implementación con IA y validación automática, garantizando trazabilidad y calidad en cada paso.

**A diferencia de** escribir prompts ad-hoc, usar herramientas monolíticas o frameworks rígidos que no se adaptan al contexto del proyecto ni permiten evolución orgánica de los templates,
**nuestro producto** es el único sistema que extrae dinámicamente la estructura de los templates en tiempo de ejecución para generar preguntas contextuales y comandos, permitiendo que el framework evolucione junto con tus prácticas de desarrollo sin modificar código subyacente. Además, integra nativamente con OpenSpec y SpecKit, potenciando sus capacidades con agentes y skills personalizables.

## Project structure

```
features_spec_builder/   # main package
tests/                   # pytest tests
features_spec_builder/
  ├── docs/specs/features/              # Directorio de salida de documentos generados
  ├── AGENTS.md                        # Convención .agent/ — compatible con Codex, Cursor, etc.
  ├── CLAUDE.md                        # Instrucciones globales del proyecto
  ├── .claude/                          # Fuente única de verdad para agentes y skills
  │   ├── agents/
  │   │   ├── project-pm.agent.md      # PM — Begin Intention, Discovery
  │   │   ├── project-architect.agent.md # Arquitecto — Specifying, Planning
  │   │   └── project-ux.agent.md      # UX — apoyo en Discovery y Specifying
  │   └── skills/
  │       ├── skill-name/
  │       │   ├── templates/           # Templates específicos para este skill
  │       │   ├── examples/           # Ejemplos específicos para este skill
  │       │   ├── scripts/ 
  │       │   └── SKILL.md
  │       └── ...
```


# Definición y Uso de Agentes, Skills y Comandos

Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de cada uno:

## Agentes

Los agentes funcionan como **pequeños empleados virtuales especializados** en tareas concretas dentro de un proyecto, como por ejemplo un agente que hace discovery, otro que redacta especificaciones o uno que diseña arquitectura. Técnicamente, son archivos de texto (Markdown) que contienen instrucciones de roly contexto específico sobre cómo deben actuar. Estos agentes pueden trabajar de forma autónoma, simultánea o en equipo, entregando resultados listos para usar.

## Comandos

Evitamos usar comandos.

### Comandos en Opencode

Los comandos en OpenCode se ubican en ".opencode/commands/": Permite máxima personalización para un desarrollo acelerado. Puedes usar argumentos ($ARGUMENTS), inyectar resultados de comandos Bash (!), y referenciar archivos (@), lo que te permite construir flujos de automatización complejos.

### Comandos en Claude

Los comandos en Claude se ubican en ".claude/commands/". En Claude evitamos usar comandos por se más bien legacy ("precede al sistema de skills actual"). En su lugar, recomendamos usar skills para encapsular la lógica de ejecución, lo que permite una mayor flexibilidad y reutilización. Sin embargo, si decides usar comandos, asegúrate de que estén bien documentados y organizados para facilitar su uso.

## Skills (Habilidades)

Los skills son las **habilidades personalizadas o herramientas** que construyes para dárselas a tus agentes. Se definen mediante documentos de texto que actúan como instrucciones continuas para dotar al agente de una especialización deseada, indicándole exactamente cómo debe comportarse o ejecutar una acción exclusiva. Gracias a las skills, los agentes pueden realizar tareas de forma autónoma, como redactar una especificación siguiendo una plantilla, conectarse a aplicaciones externas o aplicar técnicas específicas de escritura.

## Modelo de un solo nivel de delegación

En este modelo, el skill actúa como el punto de entrada y coordinador que invoca agentes especialistas. El skill es responsable de orquestar la ejecución de los agentes, asegurándose de que cada uno realice su tarea específica y luego recopile los resultados para generar la salida final. Este enfoque mantiene la estructura simple y clara, evitando la complejidad de múltiples niveles de delegación.

Los skills son el punto de entrada y el coordinador que invoca agentes especialistas. Es el patrón establecido en este proyecto.

skill (entry point + coordinator/orquestador)
    └── agent A (Subagentes A)
    └── agent B (Subagentes B)
    └── agent C (Subagentes C)

Esto es acorde a la arquitectura de Claude Code donde la sesión principal actúa como agente primario que orquesta la ejecución de skills y agentes especializados (Subagentes), manteniendo una estructura plana (Sesión → Subagente), clara y eficiente sin necesidad de múltiples niveles de delegación (agentes en .claude/agents/, invocados por la sesión principal).

