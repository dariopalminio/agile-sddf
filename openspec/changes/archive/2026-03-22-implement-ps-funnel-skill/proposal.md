## Why

El pipeline de ProjectSpecFactory comienza con el estado **Funnel**, pero actualmente no existe el skill `/ps-funnel` ni su agente PM asociado. Sin este punto de entrada, el usuario no puede iniciar el workflow de forma guiada, lo que obliga a crear el `initial-prompt.md` manualmente sin estructura ni asistencia.

## What Changes

- Nuevo skill `/ps-funnel` (`.claude/skills/ps-funnel/SKILL.md`) que orquesta el inicio del pipeline (puede usar `.claude/skills/skill-master` para generar el skill)
- Nuevo template `initial-prompt-template.md` que define la estructura del documento de entrada
- Nuevo agente PM (`.claude/agents/pm-agent.md`) especializado en entrevistar al usuario para capturar la intención del proyecto
- El agente hace preguntas al usuario sección por sección del template y completa el documento con las respuestas + su propia pericia
- El resultado final es `$SPECS_BASE/specs/initial-prompt.md` listo para el siguiente estado (Draft)

## Non-goals

- No implementa los demás estados del workflow (Draft, Discovery, etc.)
- No valida ni procesa el `initial-prompt.md` generado (eso es tarea de estados posteriores)
- No integra con herramientas externas (Jira, Linear, etc.)

## Capabilities

### New Capabilities

- `ps-funnel-skill`: Skill SKILL.md que define el comportamiento del comando `/ps-funnel`, incluyendo la invocación del agente PM y la escritura del documento de salida
- `pm-agent`: Agente Product Manager en `.claude/agents/` con instrucciones para conducir la entrevista de intención de proyecto y completar el template
- `initial-prompt-template`: Template estructurado (`docs/templates/initial-prompt-template.md`) con secciones que guían la captura de intención del proyecto

### Modified Capabilities

<!-- Sin cambios a specs existentes -->

## Impact

- Nuevo archivo: `.claude/skills/ps-funnel/SKILL.md`
- Nuevo archivo: `.claude/agents/pm-agent.md`
- Nuevo archivo: `.claude/skills/ps-funnel/templates/initial-prompt-template.md`
- Nuevo archivo generado (output): `$SPECS_BASE/specs/initial-prompt.md`
- Sin cambios a código existente; solo adición de archivos Markdown

