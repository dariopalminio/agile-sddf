## Context

El proyecto SDDF usa OpenSpec como framework de spec-driven development. OpenSpec requiere un archivo `openspec/config.yaml` para configurar el contexto del proyecto (stack tecnológico, convenciones, dominio). Actualmente este archivo se llena manualmente, lo que lleva a configuraciones incompletas o desalineadas con la documentación real del proyecto.

El skill `openspec-load-context` automatiza este proceso instruyendo al modelo a leer los archivos de documentación del proyecto y escribir el contexto en `openspec/config.yaml`.

## Goals / Non-Goals

**Goals:**
- Crear un skill `.claude/skills/openspec-load-context/SKILL.md` invocable via `/openspec-load-context`
- El skill lee README.md, CLAUDE.md, AGENTS.md y archivos del proyecto para inferir el contexto
- El skill escribe el campo `context:` en `openspec/config.yaml` siguiendo el template del archivo
- Seguir la convención de skills del proyecto (frontmatter + instrucciones en SKILL.md)

**Non-Goals:**
- No modifica el schema ni otras secciones de `openspec/config.yaml` (solo `context:`)
- No crea ni modifica archivos de specs o changes
- No requiere herramientas externas ni dependencias adicionales

## Decisions

**D1: Skill como archivo SKILL.md único**
El skill solo requiere un archivo `SKILL.md` con frontmatter y las instrucciones al modelo. No necesita templates/ ni scripts/ adicionales porque la lógica es puramente instruccional (leer archivos existentes → escribir config.yaml).

Alternativa considerada: agregar un template de config.yaml en templates/. Descartado porque `openspec/config.yaml` ya existe en el proyecto con su propio template inline como comentarios.

**D2: Instrucción exhaustiva de lectura**
El skill instruye explícitamente a leer README.md, AGENTS.md (si existe) y CLAUDE.md (si existe) antes de escribir, para maximizar el contexto capturado. El orden de lectura prioriza README.md como fuente principal.

**D3: Escritura con Edit tool sobre el campo context:**
El skill instruye al modelo a usar la herramienta Edit para actualizar únicamente el campo `context:` del `openspec/config.yaml`, preservando el schema y las rules existentes.

## Risks / Trade-offs

- [Riesgo] El modelo puede sobreescribir secciones del config.yaml que no debería → Mitigación: La instrucción es explícita en modificar solo el campo `context:`
- [Trade-off] La calidad del contexto generado depende de la calidad de la documentación del proyecto; si README.md está desactualizado, el config.yaml reflejará ese estado
