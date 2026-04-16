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
