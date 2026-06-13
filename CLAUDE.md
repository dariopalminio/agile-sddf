Busca los skills y agents en .claude

> **Idioma de trabajo:** Los skills, agentes y documentos de este repositorio se redactan en **español**. Los skills heredados de fuentes externas o integrados de ecosistemas en inglés pueden mantener su idioma original.

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
agile-sddf/
  ├── docs/specs/                      # Artefactos generados (projects/, releases/, stories/, templates/)
  ├── docs/policies/                   # constitution.md, definition-of-done-story.md
  ├── docs/adr/                        # Architecture Decision Records (ADR-NNNN)
  ├── CLAUDE.md                        # Instrucciones globales del proyecto
  └── .claude/                         # Fuente única de verdad para agentes y skills
      ├── agents/                      # 10 agentes registrados por el harness
      │   ├── project-pm.agent.md
      │   ├── project-architect.agent.md
      │   ├── project-ux.agent.md
      │   ├── project-story-mapper.agent.md
      │   ├── story-product-owner.agent.md
      │   ├── reverse-engineer-architect.agent.md
      │   ├── reverse-engineer-business-analyst.agent.md
      │   ├── reverse-engineer-product-discovery.agent.md
      │   ├── reverse-engineer-synthesizer.agent.md
      │   └── reverse-engineer-ux-flow-mapper.agent.md
      └── skills/
          ├── skill-name/
          │   ├── assets/
          │   ├── examples/
          │   ├── scripts/
          │   └── SKILL.md
          └── ...
```

**Plataformas soportadas:** Claude Code, OpenCode y GitHub Copilot — elegidas al instalar la librería; el instalador copia desde `.claude/` (fuente única) al destino `.claude`/`.agents`/`.github`. Los directorios `gem/` (Google Gemini Gems) y `rovo/` (Atlassian Rovo) son utilidades accesorias, no runtimes del framework. El soporte a otros CLI/LLMs se evaluará en releases futuros.


# Definición y Uso de Agentes, Skills y Comandos

Los **agentes**, las **skills** y los **comandos** son elementos fundamentales para estructurar un el equipo de inteligencia artificial automatizado para Agile Spec-Driven Development Framework (SDDF). Aquí tienes la definición y el uso de cada uno:

## Agentes

Los agentes funcionan como **pequeños empleados virtuales especializados** en tareas concretas dentro de un proyecto, como por ejemplo un agente que hace discovery, otro que redacta especificaciones o uno que diseña arquitectura. Técnicamente, son archivos de texto (Markdown) que contienen instrucciones de roly contexto específico sobre cómo deben actuar. Estos agentes pueden trabajar de forma autónoma, simultánea o en equipo, entregando resultados listos para usar.

## Comandos

En Claude **preferimos skills sobre commands**. Los commands son una excepción justificada solo para integraciones externas donde el harness de commands ofrece ventajas claras.

### Comandos en Opencode

Los comandos en OpenCode se ubican en ".opencode/commands/": Permite máxima personalización para un desarrollo acelerado. Puedes usar argumentos ($ARGUMENTS), inyectar resultados de comandos Bash (!), y referenciar archivos (@), lo que te permite construir flujos de automatización complejos.

### Comandos en Claude

Los comandos en Claude se ubican en `.claude/commands/`. Los skills son más componibles, más fáciles de versionar y se adaptan al contexto de ejecución. Los commands son apropiados solo para integraciones externas donde el harness de commands ofrece ventajas claras (argumentos posicionales `$ARGUMENTS`, inyección de resultados de shell).

## Skills (Habilidades)

Los skills son las **habilidades personalizadas o herramientas** que construyes para dárselas a tus agentes. Se definen mediante documentos de texto que actúan como instrucciones continuas para dotar al agente de una especialización deseada, indicándole exactamente cómo debe comportarse o ejecutar una acción exclusiva. Gracias a las skills, los agentes pueden realizar tareas de forma autónoma, como redactar una especificación siguiendo una plantilla, conectarse a aplicaciones externas o aplicar técnicas específicas de escritura.

Los skills deben ser Multicliente, es decir, diseñados para ser reutilizados por múltiples agentes. Esto significa que un skill debe ser lo suficientemente genérico y flexible para adaptarse a diferentes contextos y necesidades de los agentes que lo utilicen. Al diseñar un skill, es importante considerar cómo puede ser aplicado por diferentes agentes sin requerir modificaciones específicas para cada uno, lo que maximiza su utilidad y eficiencia dentro del sistema.

## Modelo de delegación: composición de skills + un solo salto de subagente

Distinguimos dos mecanismos de invocación, según cómo funciona realmente el harness de Claude Code:

- **Composición (skill → skill, inline):** cuando un skill invoca a otro skill, la misma sesión lee el SKILL.md del sub-skill y sigue sus instrucciones dentro de la misma conversación. No se crea un segundo agente ni un contexto aislado. **Está permitido componer skills, pero con cadenas cortas, porque el contexto se acumula** (las instrucciones de todos los skills compuestos quedan activas simultáneamente en la misma ventana de contexto).
- **Delegación (→ subagente):** lanzar un subagente crea un contexto nuevo y aislado. **Solo la sesión que ejecuta skills puede delegar en subagentes; un subagente nunca delega en otro subagente.** El subagente escribe su resultado en `.tmp/<skill-name>/` y devuelve el control.

El skill es el punto de entrada y coordinador: orquesta la ejecución, delega trabajo aislado o paralelo a agentes especialistas y consolida sus resultados en la salida final.

skill orquestador (entry point, sesión principal)
    ├── skill B (composición inline — misma sesión, cadena corta)
    ├── agent A (subagente — contexto aislado)
    └── agent C (subagente — contexto aislado)
                  └── ✗ prohibido: agente que delega en otro agente

Criterio de elección: **inline** cuando se necesita continuidad de contexto e interacción con el usuario; **subagente** cuando se necesita aislamiento, paralelismo, o proteger la sesión principal de trabajo voluminoso (ej. leer 50 archivos para producir un informe de 20 líneas).

Esto es acorde a la arquitectura de Claude Code, donde la sesión principal actúa como agente primario que ejecuta skills inline y mantiene una estructura plana de delegación (Sesión → Subagente), con agentes en `.claude/agents/` invocados por la sesión principal.


# Políticas del Proyecto

@docs/policies/constitution.md
@docs/policies/definition-of-done-story.md
