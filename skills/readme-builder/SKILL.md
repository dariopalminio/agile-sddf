---
name: readme-builder
description: >-
  Generates README.md from SDDF spec artifacts (project-intent.md, requirement-spec.md, project-plan.md).
  Use after /project-discovery or /project-planning to document the project.
  Triggers on /readme-builder, "generate README", "create README", "write a README",
  "build README from specs", "document my project".
---

# Skill: /readme-builder

Genera un README.md completo a partir de los artefactos de especificación disponibles, usando un template Markdown como fuente de verdad estructural. Nunca sobreescribe un README existente sin confirmación explícita del usuario.

---

## Restricciones / Reglas

- NO modifique ningún archivo existente en el código fuente (estamos documentando en el README, no en implementación)
- NO genere código; estamos documentando en el README, no implementando los artefactos técnicos
- NO modifique ningún archivo que no sea el README de salida (nunca escribir en el template ni en los artefactos de especificación)
- Siempre extraiga la estructura de secciones del template en tiempo de ejecución
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Step 1: Verify and read the template

The template file is the **sole structural source-of-truth** for the generated README. It defines which sections exist, in what order, and with what purpose. Never hardcode section names or structure in this skill — always derive them from the template at runtime. If the template changes, the generated README changes automatically.

The template file is **read-only**. Never write to it, modify it, or use it as an output path.

Read the The template file at `assets/readme-template.md`.

  - If the file **does not exist**: inform the user and stop execution.
    > ❌ No se encontró el template requerido en `assets/readme-template.md`.
    > Por favor verifica que el archivo existe antes de continuar.

  - If the file **exists**: continue to step 2.

---

## Step 2: Extract sections from the template at runtime

From the template content, extract dynamically:

- Each `##` and `###` heading → the section or subsection name and hierarchy
- The `<!-- ... -->` HTML comment immediately following a heading → the content generation prompt for that section

If a section has no `<!-- -->` comment, use the heading text itself as the generation prompt and produce best-effort content.

Never hardcode which sections to generate. This extraction loop must work for any future template — even one with sections not known today.

---

## Step 3: Discover available artifacts (3-tier)

Check sources in order. Stop at the first tier that yields usable content.

**Tier 1 — Formal SDDF spec artifacts**

Check if any of these files exist and read them all if found:
- `$SPECS_BASE/specs/01-projects/project-intent.md`
- `$SPECS_BASE/specs/01-projects/project.md`
- `$SPECS_BASE/specs/01-projects/project-plan.md`

These are the primary content source. Use their combined content to populate all README sections.

**Tier 2 — LLM-context files**

If no formal spec artifacts exist, check:
- `AGENTS.md`
- `CLAUDE.md`
- `.specify/memory/constitution.md`

Read any that exist. Use them to reconstruct project name, purpose, features, and usage.

**Tier 3 — Reverse-engineering fallback**

If neither Tier 1 nor Tier 2 yields content, scan the project for key entry points:
- `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod` — project name, version, description, scripts
- `src/main.*`, `src/index.*`, `app.*`, `main.*`, `index.*` — primary entry point code
- Top-level directory names — infer structure and purpose
- README fragments in subdirectories — reuse any partial documentation found

Extract project name, purpose, tech stack, and key features from these files. Keep scans shallow (do not traverse the full repo depth).

**If absolutely nothing is found:**

Display this exact message:
> No se encontraron artefactos de especificación para generar el README

Then suggest: "Ejecuta `/project-discovery` primero para crear los artefactos base."

Exit without writing any file.

---

## Step 4: Write guard — check for existing README

Before writing, check whether `README.md` exists in the project root.

**If README.md does not exist:** proceed directly to Step 5.

**If README.md already exists:**

1. Inform the user that a README.md already exists.
2. Show a brief preview (first 10 lines) of the current content.
3. Ask the user what to do using **AskUserQuestion** with exactly three options:

   | Option | Label | What it does |
   |--------|-------|--------------|
   | A | Overwrite README.md | Replace existing README.md with generated content |
   | B | Save as README-new.md | Write generated content to README-new.md; leave README.md untouched |
   | C | Cancel | Exit without writing any file |

If the user cancels, stop immediately and confirm no files were written.

---

## Step 5: Generate README content

For each section extracted in Step 2, in template order:

1. Use the `<!-- -->` comment as the generation prompt (or the heading text if no comment exists).
2. Populate the section with content derived from the artifacts discovered in Step 3.
3. Preserve the `##` / `###` hierarchy exactly as in the template.
4. Do not add sections absent from the template.
5. Do not skip template sections — stub with minimal placeholder text if no relevant information is available.

The goal is a README that reads naturally and accurately describes the project, not a mechanical fill-in of placeholders.

---

## Step 6: Write the output

Write the generated README to:
- `README.md` in the project root — when no prior README exists, or when the user chose "Overwrite"
- `README-new.md` in the project root — when the user chose "Save as README-new.md"

**Output rules (hard constraints):**
- Output is always written to the **project root** — never a subdirectory.
- The template file (`assets/readme-template.md`) is **never written to or modified**.
- No other files are created or modified beyond the README output.

After writing, confirm to the user: which file was written, its full path, and how many sections were generated.

---

## Summary of invariants

| Rule | What it means |
|------|---------------|
| Template is read-only | Never write to the template file |
| No hardcoded sections | Always extract structure from template at runtime |
| 3-tier discovery | Formal specs → LLM context files → reverse-engineering |
| Write guard | Always ask before overwriting an existing README.md |
| Root output only | README.md or README-new.md always in project root |
| Never write other files | Only the README output file is created/modified |

