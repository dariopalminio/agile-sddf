---
type: wiki
slug: guides-index
title: "Índice de Guías"
date: 2026-09-20
parent: null
---

# 📚 Guías

> Documentos **didácticos** del framework: explican conceptos, fundamentos y buenas prácticas para
> que humanos y agentes entiendan *por qué* y *cómo* se hacen las cosas en SDDF.
> No son normativos ni verificables — para restricciones que bloquean ver [guardrails/](../guardrails/README.md);
> para reglas de gobernanza ver [policies/](../policies/); para decisiones de arquitectura ver [adr/](../adr/README.md).

---

## Convención

- **Nombre de archivo:** `slug-kebab.md`; el `slug` del frontmatter debe coincidir con el nombre del archivo
- **Frontmatter:** `type: guide`, `slug`, `title`, `date`, `status`, `related` (lista de slugs de guías relacionadas, enlazadas también como wikilinks `[[slug]]` al inicio del cuerpo)
- **Contrato de runtime:** toda guía que mencione rutas de instalación de skills o agentes por plataforma lo hace como contexto descriptivo; los destinos que el instalador soporta viven únicamente en [config/runtimes.json](../../config/runtimes.json)
- **Guía vs how-to:** una guía responde *¿cómo se hace algo y por qué?*; un procedimiento paso a paso sin explicación pertenece a `how-to/` (ver [domain-knowledge-artifacts.md](../domains/domain-knowledge-artifacts.md))

---

## Índice de guías

### Fundamentos del framework

| Guía | Contenido |
|------|-----------|
| [sdd.md](sdd.md) | Spec Driven Development: la especificación como fuente única de verdad y plano de control del código |
| [extreme-agile.md](extreme-agile.md) | Agilidad Agéntica: cómo la IA generativa transforma los valores del manifiesto ágil |
| [flight-leves-model.md](flight-leves-model.md) | Modelo de Niveles de Vuelo: L3 Project → L2 Epic → L1 Story y los flujos de cada nivel |
| [sddf-commands-pipeline.md](sddf-commands-pipeline.md) | Flujos principales SDDF: la secuencia de skills que recorre cada nivel del pipeline |
| [branching-strategy-sddf-git-flow.md](branching-strategy-sddf-git-flow.md) | Modelo de branching git flow adaptado a los niveles SDDF |

### Organización de artefactos

| Guía | Contenido |
|------|-----------|
| [organization-of-artifacts.md](organization-of-artifacts.md) | Reglas para organizar proyectos, épicas e historias bajo `SPECS_BASE` (inspirado en OpenSpec y SpecKit) |
| [root-folder-practices.md](root-folder-practices.md) | Las tres raíces no intercambiables (`REPO_ROOT`, `SPECS_BASE`, `CLI_ROOT`) y cómo resolverlas |
| [artifact-directory-migration.md](artifact-directory-migration.md) | Migración de la estructura plana anterior a directorios por workitem con niveles numerados |

### Harness engineering

| Guía | Contenido |
|------|-----------|
| [agent-harness-guide.md](agent-harness-guide.md) | Qué es un Agent Harness (Agente = Modelo + Harness) y por qué los agentes lo necesitan |
| [harness-engineering-guide.md](harness-engineering-guide.md) | Harness Engineering: diseñar el entorno de ejecución (reglas, feedback loops, compuertas) de un agente autónomo |
| [harness-eng-agents-orchestration.md](harness-eng-agents-orchestration.md) | Orquestación de skills y agentes en Claude Code |

### Buenas prácticas

| Guía | Contenido |
|------|-----------|
| [best-practices-for-skills.md](best-practices-for-skills.md) | Buenas prácticas para diseñar y escribir skills |
| [best-practices-for-agents.md](best-practices-for-agents.md) | Buenas prácticas para definir agentes |
| [best-practices-for-commands.md](best-practices-for-commands.md) | Buenas prácticas para comandos de LLM clients |
| [best-practices-for-system-prompt.md](best-practices-for-system-prompt.md) | Mejores prácticas para el prompt de sistema |
| [best-practices-for-testing.md](best-practices-for-testing.md) | Pirámide de pruebas y mejores prácticas de testing de software |
| [best-practices-for-skill-testing.md](best-practices-for-skill-testing.md) | Cómo probar skills con `skill-master`, `skill-test-evals` y `agent-skills-eval` |

### Creación de componentes

| Guía | Contenido |
|------|-----------|
| [custom-skill-creation-guide.md](custom-skill-creation-guide.md) | Estructura, frontmatter y recursos de un skill personalizado, comparado entre plataformas |
| [skill-structural-pattern.md](skill-structural-pattern.md) | Patrones estructurales que todo skill del framework sigue (directorios, referencias, evals) |
| [custom-agent-creation-guide.md](custom-agent-creation-guide.md) | Formato, ubicación y permisos de custom agents por plataforma |
| [custom-system-prompt-guide.md](custom-system-prompt-guide.md) | Archivos de instrucciones persistentes (`AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md`) |

> Las guías de creación de skills y agentes tienen su contraparte verificable en
> [gr-skill-creation-checklist.md](../guardrails/gr-skill-creation-checklist.md) y
> [gr-agent-creation-checklist.md](../guardrails/gr-agent-creation-checklist.md): la guía enseña, el guardrail bloquea.
