# Test 02 — Modo from-files: diagrama desde documento de especificaciones existente

**Invocación:** `/project-context-diagram docs/specs/projects/PROJ-01-agile-sddf/project.md`

---

## Flujo de conversación esperado

**Skill:**
> ⚙️ SPECS_BASE = `docs` (SDDF_ROOT no está definida)  
> ✅ Template `assets/c4-context-template.puml` encontrado.  
> Modo: `--from-files` (documento indicado: `$SPECS_BASE/specs/projects/PROJ-01-agile-sddf/project.md`)

**Skill:** Leyendo `$SPECS_BASE/specs/projects/PROJ-01-agile-sddf/project.md`...

---

## Inferencia desde el documento

El skill extrae del documento:

| Elemento | Inferido desde |
|---|---|
| **Sistema:** Agile SDDF | Heading `# ` o campo `title` del frontmatter |
| **Actor:** Developer / Architect | Sección de usuarios o "Como un developer..." en historias relacionadas |
| **Actor:** Team Lead / PM | Sección de stakeholders o "Como PM..." |
| **Sistema ext:** GitHub | Menciones en integraciones o `package.json` |
| **Sistema ext:** Claude / OpenAI API | Menciones en stack tecnológico o imports |
| **Rel:** Developer → SDDF | Inferida de la descripción de casos de uso |

---

## Vista previa generada automáticamente

```plantuml
@startuml C4Context
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

title Agile SDDF — Diagrama de Contexto (C4 Nivel 1)

Person(dev, "Developer / Architect", "Especifica proyectos, define features y genera historias de usuario usando el framework.")
Person(pm, "Team Lead / PM", "Revisa especificaciones, aprueba releases y gestiona el backlog del proyecto.")

System(sddf, "Agile SDDF", "Framework multiagente minimalista que automatiza el ciclo completo de especificación de proyectos software desde la intención hasta el backlog.")

System_Ext(github, "GitHub", "Repositorio de código y artefactos de especificación. Gestión de ramas y PRs.")
System_Ext(claude_api, "Claude API (Anthropic)", "Modelo LLM que ejecuta los agentes y skills del framework.")

Rel(dev, sddf, "Define intención, ejecuta skills y revisa artefactos generados", "CLI / Chat")
Rel(pm, sddf, "Revisa documentos de specs y aprueba releases", "Markdown / Editor")
Rel(sddf, github, "Versiona artefactos de especificación y gestiona branches", "Git / HTTPS")
Rel(sddf, claude_api, "Delega ejecución de agentes y generación de contenido", "API REST / HTTPS")

@enduml
```

**Skill:** ¿El diagrama está correcto? (Sí / No / Editar)  
**Usuario:** Sí, está bien.

---

## Resultado esperado

**Skill:**
> ✅ Diagrama de contexto C4 generado:  
> `$SPECS_BASE/specs/projects/PROJ-01-agile-sddf/context-diagram.puml`
>
> Para renderizarlo localmente, instala la extensión PlantUML en VS Code (ext: jebbs.plantuml) o visita https://www.plantuml.com/plantuml
>
> Siguiente paso sugerido: `/project-planning`
