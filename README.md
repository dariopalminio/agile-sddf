![agile-sddf](assets/logo/agile-sddf-logo-v1.png)

# Agile Spec-Driven-Development Framework (SDDF)

Sistema multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software — desde la intención inicial hasta el backlog planificado y las historias de usuario — usando solo archivos Markdown como agentes, skills y templates en Claude Code.

## Vision

**Para** builders, freelancers, developers y equipos ágiles que usan IA para acelerar el desarrollo de software,
**quienes** sufren de procesos manuales, prompts inconsistentes y falta de estructura para transformar ideas en especificaciones precisas que la IA pueda ejecutar de forma predecible,
**nuestro producto** es un sistema que extrae dinámicamente la estructura de los templates en tiempo de ejecución para generar preguntas contextuales, garantizando que el framework evolucione junto con tus prácticas sin modificar lógica hardcodeada. Integra nativamente con OpenSpec y SpecKit, potenciando sus capacidades con agentes y skills personalizables.

---

## Módulos

| Módulo | Descripción |
|--------|-------------|
| [ProjectSpecFactory CLI](#projectspecfactory-cli) | Pipeline de especificación de proyecto: intención → discovery → backlog |
| [features-spec-builder](#features-spec-builder) | Pipeline de historias de usuario: creación → evaluación → splitting |

---

# ProjectSpecFactory CLI

Sistema CLI multiagente que convierte la intención inicial de un proyecto en un backlog planificado por releases, con control de WIP y revisión humana en cada etapa.

## Workflow

```
/project-begin-intention → /project-discovery → /project-planning
```

Cada comando produce un documento. WIP=1: un proyecto activo a la vez. Cada documento tiene subestados `Doing` y `Ready`.

## Comandos

| Comando | Documento de salida | Agente principal |
|---------|---------------------|-----------------|
| `/project-begin-intention` | `docs/specs/project/project-intent.md` | `project-pm` |
| `/project-discovery` | `docs/specs/project/requirement-spec.md` | `project-architect` |
| `/project-planning` | `docs/specs/project/project-plan.md` | `project-architect` |

## Agentes

| Agente | Archivo | Rol |
|--------|---------|-----|
| `project-pm` | `.claude/agents/project-pm.agent.md` | Entrevistas de intención y discovery de producto |
| `project-architect` | `.claude/agents/project-architect.agent.md` | Especificación técnica y planificación |
| `project-ux` | `.claude/agents/project-ux.agent.md` | Flujos de usuario y usabilidad (soporte en Discovery) |

## Principios

- **Minimalista** — sin dependencias externas, solo archivos Markdown
- **Trazable** — cada documento incluye metadatos de estado (`Doing` / `Ready`) y agente generador
- **Idempotente** — re-ejecutar un estado detecta el documento existente y retoma sin duplicar
- **Extensible** — agregar una sección al template es suficiente para que el agente la incluya

## Estructura

```
.claude/
├── agents/
│   ├── project-pm.agent.md          # PM — Begin Intention, Discovery
│   ├── project-architect.agent.md   # Arquitecto — Discovery, Planning
│   └── project-ux.agent.md          # UX — apoyo en Discovery
└── skills/
    ├── project-begin-intention/
    │   ├── SKILL.md
    │   └── templates/project-intent-template.md
    ├── project-discovery/
    │   ├── SKILL.md
    │   └── templates/requirement-spec-template.md
    └── project-planning/
        ├── SKILL.md
        └── templates/project-plan-template.md

docs/specs/project/              # Documentos generados por el pipeline
├── project-intent.md
├── requirement-spec.md
└── project-plan.md
```

---

# features-spec-builder

Sistema agentico minimalista para crear, dividir y evaluar historias de usuario de alta calidad usando skills de Claude Code.

## Workflow

```
Necesidad / feature
       │
       ▼
 /story-creation          ← Genera la historia en formato canónico
       │
       ▼
 /story-finvest-evaluation      ← Evalúa la calidad (score S ≤ 2 → dividir)
       │
       ├── Ready           → Historia lista para sprint planning
       ├── Refinar         → Aplicar recomendaciones y re-evaluar
       └── Rechazar
             │
             ├── Formato insuficiente → Reescribir con /story-creation
             └── Historia muy grande  → /story-split → /story-finvest-evaluation
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/story-creation` | Crea una historia de usuario en formato story-gherkin a partir de una necesidad en lenguaje natural. Aplica Mike Cohn, 3 C's e INVEST. |
| `/story-split` | Divide una historia grande en historias más pequeñas e independientes usando los 8 patrones de splitting. |
| `/story-finvest-evaluation` | Evalúa la calidad de una historia con la rúbrica FINVEST (Formato + INVEST) en escala Likert 1–5. Produce score por dimensión, score global y decisión Ready / Refinar / Rechazar. |

## Template canónico

Todas las historias siguen el template `story-gherkin-template.md`:

```markdown
## Historia
**Como** {rol específico}
**Quiero** {acción concreta}
**Para** {beneficio medible}

## Criterios de aceptación

### Escenario principal – {título}
Dado {contexto}
Cuando {acción}
Entonces {resultado}

### Escenario alternativo / error – {título}
Dado {contexto}
Cuando {acción inválida}
Entonces {error}
  Pero {excepción}

## Criterios no funcionales (opcional)
## Notas / contexto adicional (opcional)
```

## Estructura

```
.claude/skills/
├── story-creation/
│   ├── SKILL.md
│   └── templates/story-gherkin-template.md
├── story-split/
│   ├── SKILL.md
│   └── templates/story-gherkin-template.md
└── story-finvest-evaluation/
    ├── SKILL.md
    ├── templates/
    │   ├── story-gherkin-template.md
    │   └── output-template.md
    └── examples/
        ├── example-ready.md
        ├── example-refinar.md
        └── example-rechazar.md
```

## Uso en otros clientes

**Claude Code / VS Code / JetBrains** — ejecuta directamente los comandos en el chat del agente:
```
/story-creation
/story-split
/story-finvest-evaluation
```

**Jira (Rovo)** — crea un agente en Studio → Agentes → Crear un Agente y configúralo con los prompts de la carpeta `gem/prompts/`.

**Gemini Gem** — crea una Gem con las instrucciones de `gem/prompts/`. Agrega como conocimiento el template canónico (`story-gherkin-template.md`) y la base teórica FINVEST.

## Base teórica

- Mike Cohn — *User Stories Applied* (2004)
- Bill Wake — *INVEST in Good Stories* (2003)
- Richard Lawrence & Peter Green — *Humanizing Work Guide to Splitting User Stories*
- User Experience Mapping — Peter W. Szabo

# cli-requirement-from-code — Instrucciones para Claude Code

Este directorio contiene el skill `/requirement-from-code` para Claude Code. Úsalo en cualquier repositorio de código para generar automáticamente una especificación de requerimientos a partir del código fuente.

## Cómo usar el skill

Desde la raíz del repositorio que quieras analizar, ejecuta:

```
/requirement-from-code
```

### Opciones

| Opción | Descripción |
|---|---|
| `--focus <path>` | Limita el análisis a un directorio o módulo específico |
| `--update` | Re-ejecuta el análisis actualizando una `requirement-spec.md` ya existente |
| `--verbose` | Muestra el razonamiento de cada agente y estadísticas del análisis |

## Salida generada

El skill crea el archivo `docs/specs/project/requirement-spec.md` con:

- **Stack y arquitectura** detectados automáticamente
- **Features** agrupadas por dominio con nivel de confianza
- **Reglas de negocio** en formato `DADO / CUANDO / ENTONCES` con referencia al archivo y línea de código
- **Mapa de navegación ASCII** de rutas, pantallas y endpoints
- **Gaps** — secciones no inferibles marcadas con `<!-- PENDING MANUAL REVIEW -->` y preguntas sugeridas

## Template personalizado

Si quieres controlar la estructura del documento de salida, coloca un archivo `requirement-spec-template.md` en la raíz del repositorio a analizar. El skill lo detecta automáticamente y lo usa como base. Sin él, aplica el template interno por defecto.

## Agentes que se ejecutan

El skill lanza un pipeline multi-agente de forma automática. No necesitas invocarlos manualmente:

| Agente | Qué analiza |
|---|---|
| `arch-reverse-engineer` | Estructura técnica, capas, frameworks, patrones, dependencias |
| `product-discovery` | Features desde la perspectiva del usuario: rutas, endpoints, textos de UI |
| `business-rules-analyst` | Reglas de negocio, validaciones, permisos, workflows |
| `ux-flow-mapper` | Mapa de navegación: pantallas, rutas, guards, entry points |
| `requirements-synthesizer` | Fusiona todos los outputs y genera el documento final |

Los primeros cuatro agentes corren en paralelo. El synthesizer corre al final con todos sus outputs.

## Niveles de confianza

Cada inferencia en el documento generado incluye un nivel de confianza:

| Rango | Significado |
|---|---|
| 0.9 – 1.0 | Extraído directamente del código |
| 0.7 – 0.9 | Inferido con patrones claros |
| 0.5 – 0.7 | Inferido con análisis semántico |
| < 0.5 | Sugerencia — revisar manualmente |

## Restricciones

- Solo análisis estático: no ejecuta código del repositorio.
- No detecta features planeadas pero no implementadas.
- La precisión depende de convenciones de nomenclatura del proyecto analizado.
- Frameworks con metaprogramación intensiva pueden producir inferencias de baja confianza.
 es un documento vivo y puede ser actualizada con feedback tuyo, o del usuarios. Puedes sugerir mejora arquitectura de solución, nuevos agentes, skills, o cambios en el template. El objetivo es crear una herramienta práctica y efectiva para la ingeniería inversa de requerimientos desde código.
 
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

```
skill (entry point + coordinator/orquestador)
    └── agent A (Subagentes A)
    └── agent B (Subagentes B)
    └── agent C (Subagentes C)
```

Esto es acorde a la arquitectura de Claude Code donde la sesión principal actúa como agente primario que orquesta la ejecución de skills y agentes especializados (Subagentes), manteniendo una estructura plana (Sesión → Subagente), clara y eficiente sin necesidad de múltiples niveles de delegación (agentes en .claude/agents/, invocados por la sesión principal).

