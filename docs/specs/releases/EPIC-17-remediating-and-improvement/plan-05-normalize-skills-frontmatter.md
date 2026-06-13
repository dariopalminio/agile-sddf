---
type: plan
id: plan-5
slug: plan-5-normalize-skills-frontmatter
title: "Normalizar zoo de frontmatter en skills — Feature del EPIC-17"
status: DEFINITION
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---
# Plan: Normalizar zoo de frontmatter en skills — Feature del EPIC-17

## Context

El censo de los 47 SKILL.md del proyecto revela 22+ campos distintos en el frontmatter.
Claude Code solo procesa `name`, `description`, `allowed-tools` (y `license` para packaging npm).
Todo lo demás es metadata inerte que: (a) infla el frontmatter sin efecto observable,
(b) crea falsa sensación de configuración activa (ej. `alwaysApply: true` en skills no tiene efecto),
(c) genera inconsistencias que confunden al que lee o escribe skills nuevos.

`skill-master` define un estándar en `references/skill-frontmatter.md` que incluye campos opcionales válidos (`version`, `type`, `input`, `output`, `invocable`) que ningún skill aplica de forma consistente y que el harness no procesa.

**Resultado esperado:** Todos los SKILL.md convergen al frontmatter canónico mínimo. Se actualiza `skill-frontmatter.md` para reflejar la realidad del harness.

---

## Frontmatter canónico (post-normalización)

```yaml
---
name: nombre-del-skill           # OBLIGATORIO — coincide con nombre del directorio
description: >-                  # OBLIGATORIO — mecanismo primario de trigger
  Qué hace y cuándo usarlo. Incluir frases clave.
triggers:                        # RECOMENDADO — frases literales adicionales
  - "frase clave"
  - "alias"
# allowed-tools: [...]           # SOLO si el skill restringe herramientas (Claude Code lo procesa)
---
```

Campos **eliminados del canon**: `version`, `type`, `input`, `output`, `outputs`, `invocable`,
`alwaysApply`, `metadata`, `license`, `compatibility`, `author`, `tags`, `category`,
`models`, `mcp`, `capabilities`, `languages`, `department`.

---

## Cambios por archivo

### Grupo 1 — Skills openspec (5 archivos)
Eliminar `license`, `compatibility`, `metadata` de cada uno.

- `.claude/skills/openspec-apply-change/SKILL.md`
- `.claude/skills/openspec-archive-change/SKILL.md`
- `.claude/skills/openspec-explore/SKILL.md`
- `.claude/skills/openspec-propose/SKILL.md`
- `.claude/skills/openspec-init-config/SKILL.md`

### Grupo 2 — Skills de test externo (4 archivos)
Eliminar `metadata` (y `license` donde exista). Conservar `allowed-tools` en test-react-testing-library.

- `.claude/skills/test-cypress-cucumber/SKILL.md` — eliminar `license`, `metadata`
- `.claude/skills/test-react-testing-library/SKILL.md` — eliminar `metadata`; conservar `allowed-tools`
- `.claude/skills/test-playwright-cucumber/SKILL.md` — eliminar `metadata`
- `.claude/skills/code-frontend-library-react/SKILL.md` — eliminar `metadata`

### Grupo 3 — changelog-generator (1 archivo)
Eliminar todos los campos no canónicos: `version`, `author`, `license`, `category`, `tags`,
`models`, `mcp`, `capabilities`, `languages`.

- `.claude/skills/changelog-generator/SKILL.md`

### Grupo 4 — Skills con alwaysApply/invocable/variants (3 archivos)

- `.claude/skills/story-testcases/SKILL.md` — eliminar `version`, `type`, `input`, `output`, `invocable`, `alwaysApply`
- `.claude/skills/security-audit/SKILL.md` — eliminar `alwaysApply`, `invocable`, `outputs`
- `.claude/skills/project-flow/SKILL.md` — eliminar `alwaysApply`
- `.claude/skills/reverse-engineering/SKILL.md` — eliminar `alwaysApply`

### Grupo 5 — Skill con `department` (1 archivo desconocido)
Identificar durante implementación con grep: `grep -r "department:" .claude/skills/`
Eliminar el campo del SKILL.md que lo contenga.

### Grupo 6 — skill-frontmatter.md (referencia de skill-master)
**Archivo:** `.claude/skills/skill-master/references/skill-frontmatter.md`

Actualizar el documento para reflejar la realidad del harness:
1. Reducir la "plantilla canónica" a: `name`, `description`, `triggers`
2. Eliminar `version` y `type` de la plantilla canónica y de los campos "OBLIGATORIO/RECOMENDADO"
3. Reescribir la sección de `alwaysApply` indicando que solo aplica a **agentes** (`.claude/agents/`), **no a skills**
4. Eliminar las secciones de "Campos adicionales para type: reference" y "type: delegate" (o marcarlas como deprecadas)
5. Conservar la sección de `allowed-tools` como campo opcional válido
6. Actualizar el template de `assets/skill-template.md` para que coincida con la plantilla canónica reducida

---

## Skills NO afectados (ya conformes)

Los ~35 skills restantes que solo tienen `name`, `description` y opcionalmente `triggers`
no requieren cambio.

---

## Verificación

1. **Grep post-limpieza** — los siguientes comandos deben devolver 0 resultados:
   ```
   grep -r "alwaysApply:" .claude/skills/
   grep -r "invocable:" .claude/skills/
   grep -r "^version:" .claude/skills/
   grep -r "^metadata:" .claude/skills/
   grep -r "^license:" .claude/skills/
   grep -r "^compatibility:" .claude/skills/
   grep -r "^department:" .claude/skills/
   ```

2. **allowed-tools conservado**: `grep -r "allowed-tools:" .claude/skills/` debe retornar
   exactamente 1 resultado (test-react-testing-library).

3. **Smoke test de frontmatter**: todos los SKILL.md son YAML válido — no se rompe ningún frontmatter.

4. **skill-frontmatter.md revisado**: la plantilla canónica coincide con el estado final de los skills.

## Reporte de implementación

Todos los 47 SKILL.md están limpios. Resumen de lo ejecutado:

Skills editados (16):

5 openspec → eliminados license, compatibility, metadata
4 test/code-react → eliminado metadata (y license en test-cypress)
1 changelog-generator → eliminados 9 campos externos (version, author, license, category, tags, models, mcp, capabilities, languages, department)
4 con alwaysApply/invocable → eliminados esos campos (story-code-review, story-tasking, story-implement, readme-builder, project-flow, reverse-engineering, security-audit, story-testcases)
1 openspec-generate-baseline → eliminados license, compatibility, metadata
1 skill-test-evals → eliminados version, type, input, output
1 story-implement → eliminados version, type, input, output, invocable, alwaysApply
Referencias actualizadas:

skill-frontmatter.md — plantilla canónica reducida a name + description + triggers, tabla de campos eliminados del canon, nota sobre alwaysApply como campo exclusivo de agents
skill-template.md — fix > → >- en description
