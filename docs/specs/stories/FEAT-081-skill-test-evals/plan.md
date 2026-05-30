Plan

Ahora quiero crear un skill skill-test-evals que se encargue de solo crear pruebas donde su output sea un \skill-name\evals\evals.json, no duplicar conocimiento, que use las referencias de skill-master

El skill skill-test-evals ya aparece activo en la lista. Resumen de lo que se creó/modificó:

Creado: .claude/skills/skill-test-evals/SKILL.md

Skill especializado, único archivo, sin scripts ni agentes propios
7 pasos: determinar source → determinar output path → extraer intent → generar casos → checkpoint → escribir evals.json → reportar
Schema inline de fallback (funciona sin skill-master)
Referencias a ../skill-master/references/skill-evals-format.md y ../skill-master/references/schemas.md — sin duplicar contenido
Modificado: .claude/skills/skill-master/SKILL.md

"Mode: plan" ahora delega en skill-test-evals con una sola línea
Mantiene fallback inline compacto para cuando skill-test-evals no esté disponible
De ~60 líneas de lógica duplicada a ~10 líneas de delegación

Context
skill-test-evals ya existe y genera evals/evals.json desde descripciones, archivos de spec (story.md, testcases.md) o texto libre. Falta un modo clave: dado un skill ya implementado que no tiene evals, leer su SKILL.md, interpretar qué hace, y generar los evals automáticamente. Esto permite hacer TDD retroactivo sobre skills existentes sin evals.

--from-skill <path> — nuevo flag: lee <path>/SKILL.md, interpreta el skill, genera evals en <path>/evals/evals.json
Auto-detección: si --source apunta a un archivo llamado SKILL.md o a un directorio que contiene SKILL.md, se trata como --from-skill
Si la ruta ya tiene evals/evals.json, advertir al usuario y ofrecer sobreescribir o cancelar
Estado actual de skill-test-evals/SKILL.md
Ya implementado (sesión anterior):

Parameters: --source, --skill-name, --skill-dir, --auto, --manual
Step 1: determina la fuente (file/text/Q&A interactiva)
Step 2: determina el path de salida
Step 3: extrae intent desde la fuente
Step 4: genera casos (happy-path, fail-fast, edge-case)
Step 5: checkpoint manual/auto
Step 6: escribe evals.json
Step 7: reporta
Cambios a implementar
Solo se modifica .claude/skills/skill-test-evals/SKILL.md. Un único archivo.

1. Actualizar frontmatter
Añadir --from-skill a la description y a los triggers:

description: >
  ...Also use to generate evals for an existing skill that has no evals yet:
  pass the skill directory and it will read SKILL.md, interpret the skill, and generate evals.json.
  Invoke when users say "genera evals para este skill", "add tests to this existing skill",
  "este skill no tiene pruebas, créalas", "reverse-engineer evals from SKILL.md"...
triggers:
  - ...existing...
  - "genera evals para este skill"
  - "add tests to this skill"
  - "este skill no tiene pruebas"
2. Añadir --from-skill a la sección Parameters
- `--from-skill <path>` — reads an existing SKILL.md at `<path>`, interprets the skill, and generates evals
  in `<path>/evals/evals.json`. Shorthand for pointing both input and output at the same skill directory.
3. Actualizar Step 1: añadir la nueva rama
Después de las ramas existentes (file, free text, auto error, manual Q&A):

- If `--from-skill <path>`:
  - Verify `<path>/SKILL.md` exists. If not: error — "No SKILL.md found at <path>."
  - Check if `<path>/evals/evals.json` already exists:
    - If yes and `--auto`: overwrite silently
    - If yes and `--manual`: warn — "evals/evals.json already exists. Overwrite? (y/n)"
  - Set output path to `<path>/evals/evals.json`
  - Read `<path>/SKILL.md` as the source → proceed to "SKILL.md interpretation" in Step 3
- Auto-detect: if `--source` points to a file named `SKILL.md` or to a directory containing `SKILL.md`
  → treat as `--from-skill <that directory>`
4. Actualizar Step 2: output path para --from-skill
- If `--from-skill`: output path is `<path>/evals/evals.json` (co-located with the skill)
5. Actualizar Step 3: añadir sub-sección "Interpreting a SKILL.md"
Añadir después del bloque principal de Step 3:

### Interpreting a SKILL.md source

When the source is a SKILL.md file, extract:

1. **From frontmatter:**
   - `name:` → skill_name for evals.json
   - `description:` → primary source of purpose, trigger contexts, and expected output
   - `triggers:` list → the exact phrases users say to invoke it

2. **From body:**
   - "What this skill does" / "Objective" / overview paragraphs → purpose
   - "Parameters" section → what inputs the skill accepts (flags, files, text)
   - "Output" / "Salida" section → what the skill produces
   - "Flujo de ejecución" / flow steps → what steps the skill runs, what could fail

3. **Generate prompts by inverting the triggers:**
   - For each trigger phrase, construct a realistic user prompt that would invoke the skill
   - Example: trigger "crear pruebas de" → prompt "crea pruebas de un skill que formatea commits de git en mi repo"
   - Add enough context to make the prompt concrete (file paths, domain details, realistic user scenario)

4. **Derive expectations from the output section:**
   - If the skill writes a file → "The file `<output-path>` is created"
   - If the skill produces structured output → "The output contains the sections: X, Y, Z"
   - If the skill has error conditions → derive fail-fast cases from error rules
Archivo a modificar
Archivo	Acción
.claude/skills/skill-test-evals/SKILL.md	MODIFICAR — añadir --from-skill en Parameters, Step 1, Step 2, Step 3
Verificación
/skill-test-evals --from-skill .claude/skills/story-creation → lee story-creation/SKILL.md, genera evals en story-creation/evals/evals.json
/skill-test-evals --source .claude/skills/story-split/SKILL.md → auto-detecta que es SKILL.md, genera evals en story-split/evals/
/skill-test-evals --from-skill .claude/skills/header-aggregation --auto → sobreescribe sin pausa (ya tiene evals.json)
/skill-test-evals --from-skill .claude/skills/nonexistent → error claro: "No SKILL.md found"
Evals generados cubren happy-path basado en los triggers del skill y fail

Los 5 cambios aplicados en .claude/skills/skill-test-evals/SKILL.md:

Frontmatter — description menciona el nuevo modo --from-skill; 3 nuevos triggers ("genera evals para este skill", "add tests to this skill", "este skill no tiene pruebas")

Parameters — --from-skill <path> documentado: lee SKILL.md del skill target, escribe en <path>/evals/evals.json

Step 1 — nueva rama --from-skill con validación de existencia, detección de evals.json previo (warn/overwrite), y auto-detección cuando --source apunta a un SKILL.md

Step 2 — --from-skill tiene prioridad sobre --skill-dir y --skill-name para la ruta de salida

Step 3 — nueva sub-sección "Interpreting a SKILL.md source" con 4 reglas: extraer frontmatter, extraer body, invertir triggers en prompts realistas, derivar expectations del output
