# features-spec-builder

Sistema cliente agentico minimalista que automatiza la especificación de features e historias de usuario solo con skills y templates (scripts y agentes si es necesario) para crear historias de usuario, dividirlas y evaluarlas.

# Entorno de Desarrollo con Docker + VSCode Dev Containers
🎯 Objetivo
Tener un entorno de desarrollo completamente aislado usando Docker, donde:
* El proyecto de agentes IA corre dentro de un contenedor
* VSCode se conecta directamente al contenedor
* Hot reload funciona correctamente
* No se ensucia el sistema host

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
  │   │   ├── product-manager.agent.md # PM — Begin Intention, Discovery
  │   │   ├── architect.agent.md       # Arquitecto — Specifying, Planning
  │   │   └── ux-designer.agent.md     # UX — apoyo en Discovery y Specifying
  │   └── skills/
  │       ├── skill-name/
  │       │   ├── templates/           # Templates específicos para este skill
  │       │   ├── examples/           # Ejemplos específicos para este skill
  │       │   ├── scripts/ 
  │       │   └── SKILL.md
  │       └── ...
```


