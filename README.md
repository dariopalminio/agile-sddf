![project-spec-factory](assets\logo\agile-sddf-logo-v1.png)

# features-spec-builder

Sistema agentico minimalista para crear, dividir y evaluar historias de usuario de alta calidad usando skills de Claude Code.

## Skills disponibles

| Skill | Comando | Descripción |
|---|---|---|
| Story Creation | `/story-creation` | Crea una historia de usuario completa en formato story-gherkin a partir de una necesidad en lenguaje natural. Aplica Mike Cohn, 3 C's e INVEST. |
| Story Split | `/story-split` | Divide una historia grande en historias más pequeñas e independientes usando los 8 patrones de splitting. Output en formato story-gherkin. |
| FINVEST Evaluation | `/finvest-evaluation` | Evalúa la calidad de una historia con la rúbrica FINVEST (Formato + INVEST) en escala Likert 1–5. Produce score por dimensión, score global y decisión Ready / Refinar / Rechazar. |

## Flujo de trabajo

```
Necesidad / feature
       │
       ▼
 /story-creation          ← Genera la historia en formato canónico
       │
       ▼
 /finvest-evaluation      ← Evalúa la calidad (score S ≤ 2 → dividir)
       │
       ├── Ready           → Historia lista para sprint planning
       ├── Refinar         → Aplicar recomendaciones y re-evaluar
       └── Rechazar
             │
             ├── Formato insuficiente → Reescribir con /story-creation
             └── Historia muy grande  → /story-split → /finvest-evaluation
```

## Template canónico

Todas las historias siguen el template `story-gherkin-template.md`:

```markdown
## 📖 Historia
**Como** {rol específico}
**Quiero** {acción concreta}
**Para** {beneficio medible}

## ✅ Criterios de aceptación

### Escenario principal – {título}

Dado {contexto}
Cuando {acción}
Entonces {resultado}


### Escenario alternativo / error – {título}

Dado {contexto}
Cuando {acción inválida}
Entonces {error}
  Pero {excepción}


## ⚙️ Criterios no funcionales (opcional)

## 📎 Notas / contexto adicional (opcional)
```

## Estructura del proyecto

```
.claude/
└── skills/
    ├── story-creation/          # /story-creation
    │   ├── SKILL.md
    │   └── templates/
    │       └── story-gherkin-template.md
    ├── story-split/             # /story-split
    │   ├── SKILL.md
    │   └── templates/
    │       └── story-gherkin-template.md
    └── finvest-evaluation/      # /finvest-evaluation
        ├── SKILL.md
        ├── templates/
        │   ├── story-gherkin-template.md
        │   └── output-template.md
        └── examples/
            ├── example-ready.md
            ├── example-refinar.md
            └── example-rechazar.md

references/
└── invest.md                    # Base teórica de la rúbrica FINVEST
```

## Ejemplo de uso en terminal o extensión de VSCode

Debes instalar los skills en tu entorno de Claude Code, Github copilot u otro cliente agente y luego puedes ejecutar los comandos en el chat de tu agente:
```
/story-creation
/story-split
/finvest-evaluation
```

## Ejemplo de uso en Jira

Para usar en Jira debes crear tres agentes.

Studio --> Agentes --> Crear un Agente

Nombre
[coloca un nombre descriptivo según el agente a configurar, ej: "Escritor Historias de Usuario"]

Configura el agente según la información de cada archivo de carpeta rovo.

## Ejemplo de uso en Gemini - Gem

Para usar en Gemini - Gem debes crear tres agentes usando los mismos archivos de carpeta rovo.
Debes fucionar el comportamiento con las instrucciones.

En el conocimiento de la gema puedes sumar la plantilla canónica de historia de usuario (localizada en templates de skills) y la base teórica de la rúbrica FINVEST.

## Base teórica

- Mike Cohn — *User Stories Applied* (2004)
- Bill Wake — *INVEST in Good Stories* (2003)
- Richard Lawrence & Peter Green — *Humanizing Work Guide to Splitting User Stories*
- Agile Product Management: User Stories — Paul VII
- Historias de usuario: Una visión pragmática
- User Experience Mapping — Peter W. Szabo


# ProjectSpecFactory CLI para Spec Driven Development Framework (SDDF)

Sistema CLI multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software, desde la intención inicial hasta el backlog planificado, siguiendo un workflow secuencial con control de WIP y revisión humana en cada etapa.

## Workflow

```
/ps-begin-intention → /ps-discovery → /ps-planning
```

Cada estado produce un documento. WIP=1: un proyecto activo a la vez. Cada documento tiene subestados `Doing` y `Ready`.

## Documentos generados

| Comando | Documento de salida |
|---------|---------------------|
| `/ps-begin-intention` | `docs/specs/project/project-intent.md` |
| `/ps-discovery` | `docs/specs/project/requirement-spec.md` |
| `/ps-planning` | `docs/specs/project/project-plan.md` |

## Comandos

```
/ps-begin-intention   — Captura la intención del proyecto y genera project-intent.md
/ps-discovery         — Conduce el discovery de usuarios y genera requirement-spec.md
/ps-planning          — Genera el backlog planificado por releases en project-plan.md
```

## Estructura

```
project-spec-factory/
├── docs/specs/project/          # Documentos generados por el pipeline
│   ├── project-intent.md
│   ├── requirement-spec.md
│   └── project-plan.md
├── AGENTS.md                    # Convención .agent/ — compatible con Codex, Cursor, etc.
├── CLAUDE.md                    # Instrucciones globales del proyecto
├── .agent/                      # Fuente única de verdad para agentes y skills
│   ├── agents/
│   │   ├── product-manager.agent.md   # PM — Begin Intention, Discovery
│   │   ├── architect.agent.md         # Arquitecto — Discovery, Planning
│   │   └── ux-designer.agent.md       # UX — apoyo en Discovery
│   └── skills/
│       ├── ps-begin-intention/
│       │   ├── SKILL.md
│       │   └── templates/project-intent-template.md
│       ├── ps-discovery/
│       │   ├── SKILL.md
│       │   └── templates/requirement-spec-template.md
│       └── ps-planning/
│           ├── SKILL.md
│           └── templates/project-plan-template.md
├── .claude/
│   ├── agents/  →  symlink a .agent/agents/
│   └── skills/  →  symlink a .agent/skills/
└── .github/
    └── copilot-instructions.md  # Generado desde .agent/ via dotagent
```

## Principios

- **Minimalista** — sin dependencias externas, solo archivos Markdown
- **Trazable** — cada documento incluye metadatos de estado y generación
- **Idempotente** — re-ejecutar un estado no duplica contenido
- **Extensible** — agregar un estado o sección al template es suficiente, sin tocar los agentes


# features-spec-builder

Sistema agentico minimalista para crear, dividir y evaluar historias de usuario de alta calidad usando skills de Claude Code.

## Skills disponibles

| Skill | Comando | Descripción |
|---|---|---|
| Story Creation | `/story-creation` | Crea una historia de usuario completa en formato story-gherkin a partir de una necesidad en lenguaje natural. Aplica Mike Cohn, 3 C's e INVEST. |
| Story Split | `/story-split` | Divide una historia grande en historias más pequeñas e independientes usando los 8 patrones de splitting. Output en formato story-gherkin. |
| FINVEST Evaluation | `/finvest-evaluation` | Evalúa la calidad de una historia con la rúbrica FINVEST (Formato + INVEST) en escala Likert 1–5. Produce score por dimensión, score global y decisión Ready / Refinar / Rechazar. |

## Flujo de trabajo

```
Necesidad / feature
       │
       ▼
 /story-creation          ← Genera la historia en formato canónico
       │
       ▼
 /finvest-evaluation      ← Evalúa la calidad (score S ≤ 2 → dividir)
       │
       ├── Ready           → Historia lista para sprint planning
       ├── Refinar         → Aplicar recomendaciones y re-evaluar
       └── Rechazar
             │
             ├── Formato insuficiente → Reescribir con /story-creation
             └── Historia muy grande  → /story-split → /finvest-evaluation
```

## Template canónico

Todas las historias siguen el template `story-gherkin-template.md`:

```markdown
## 📖 Historia
**Como** {rol específico}
**Quiero** {acción concreta}
**Para** {beneficio medible}

## ✅ Criterios de aceptación

### Escenario principal – {título}

Dado {contexto}
Cuando {acción}
Entonces {resultado}


### Escenario alternativo / error – {título}

Dado {contexto}
Cuando {acción inválida}
Entonces {error}
  Pero {excepción}


## ⚙️ Criterios no funcionales (opcional)

## 📎 Notas / contexto adicional (opcional)
```

## Estructura del proyecto

```
.claude/
└── skills/
    ├── story-creation/          # /story-creation
    │   ├── SKILL.md
    │   └── templates/
    │       └── story-gherkin-template.md
    ├── story-split/             # /story-split
    │   ├── SKILL.md
    │   └── templates/
    │       └── story-gherkin-template.md
    └── finvest-evaluation/      # /finvest-evaluation
        ├── SKILL.md
        ├── templates/
        │   ├── story-gherkin-template.md
        │   └── output-template.md
        └── examples/
            ├── example-ready.md
            ├── example-refinar.md
            └── example-rechazar.md

references/
└── invest.md                    # Base teórica de la rúbrica FINVEST
```

## Ejemplo de uso en terminal o extensión de VSCode

Debes instalar los skills en tu entorno de Claude Code, Github copilot u otro cliente agente y luego puedes ejecutar los comandos en el chat de tu agente:
```
/story-creation
/story-split
/finvest-evaluation
```

## Ejemplo de uso en Jira

Para usar en Jira debes crear tres agentes.

Studio --> Agentes --> Crear un Agente

Nombre
[coloca un nombre descriptivo según el agente a configurar, ej: "Escritor Historias de Usuario"]

Configura el agente según la información de cada archivo de carpeta rovo.

## Ejemplo de uso en Gemini - Gem

Para usar en Gemini - Gem debes crear tres agentes usando los mismos archivos de carpeta rovo.
Debes fucionar el comportamiento con las instrucciones.

En el conocimiento de la gema puedes sumar la plantilla canónica de historia de usuario (localizada en templates de skills) y la base teórica de la rúbrica FINVEST.

## Base teórica

- Mike Cohn — *User Stories Applied* (2004)
- Bill Wake — *INVEST in Good Stories* (2003)
- Richard Lawrence & Peter Green — *Humanizing Work Guide to Splitting User Stories*
- Agile Product Management: User Stories — Paul VII
- Historias de usuario: Una visión pragmática
- User Experience Mapping — Peter W. Szabo
