---
type: story
id: STORY-048
kind: feat
slug: STORY-048-refactor-migrates-templates-to-assets
title: "Refactoring - Migraci�n de templates a assets en Skills"
date: 2026-04-27
status: COMPLETED
substatus: READY
parent: EPIC-09-docs-and-wiki-builders
---

<!-- Referencias -->
[[EPIC-09-docs-and-wiki-builders]]

# ?? Historia de Usuario: Refactoring - Migraci�n de templates a assets en Skills (cumplimiento del est�ndar Agent Skills)

**Como** mantenedor del framework SDDF que sigue el est�ndar Agent Skills,
**Quiero** renombrar todas las carpetas templates/ dentro de mis skills a assets/, y actualizar las referencias a esas rutas relativas en los archivos SKILL.md correspondientes,
**Para** que mis skills sean compatibles con el est�ndar oficial, aprovechen el reconocimiento �out-of-the-box� por parte de herramientas de validaci�n (skills-ref validate, etc.) y faciliten la interoperabilidad con otros agentes y ecosistemas.

## ? Criterios de aceptaci�n

### Requirement: Cada skill contiene sus propios templates
Cada skill en `.claude/skills/` que requiera un template para operar SHALL tener ese template en su propio directorio `.claude/skills/<skill>/assets/`. No SHALL depender de templates en `$SPECS_BASE/specs/templates/` para funcionar.

#### Scenario: Skill usa template local
- **WHEN** un skill necesita un template para generar su output
- **THEN** el template existe en `.claude/skills/<skill>/assets/<template>.md`

#### Scenario: Skill no referencia directorio compartido
- **WHEN** se lee el archivo `SKILL.md` de cualquier skill activo
- **THEN** no contiene referencias a rutas bajo `$SPECS_BASE/specs/templates/`

### Requirement: Templates duplicados por skill cuando son compartidos
Cuando un mismo template es necesario en m�ltiples skills, cada skill SHALL tener su propia copia local del template en su directorio `assets/`.

#### Scenario: Mismo template usado por dos skills distintos
- **WHEN** dos skills (`story-creation` y `story-evaluation`) requieren el mismo template `story-template.md`
- **THEN** cada uno tiene una copia en `.claude/skills/story-creation/assets/story-template.md` y `.claude/skills/story-evaluation/assets/story-template.md` respectivamente

### Requirement: Referencias actualizadas en SKILL.md y agentes
Todos los archivos `SKILL.md` SHALL referenciar templates usando rutas relativas al directorio del skill (`assets/<template>.md`) en lugar de rutas absolutas con prefijo de cliente (`.claude/skills/<skill>/assets/<template>.md`). Como alternativa para clientes que requieren rutas absolutas expl�citas, se acepta el formato con variable de entorno `{{SKILL_ROOT}}/assets/<template>.md`. Ning�n SKILL.md SHALL hardcodear un prefijo de cliente (`.claude/`, `.github/`, `.opencode/`, etc.) en rutas a sus templates, ya que eso ata el skill a una plataforma espec�fica.

#### Scenario: SKILL.md referencia template con ruta relativa al skill
- **WHEN** un SKILL.md menciona un template
- **THEN** la ruta es `assets/<nombre>.md` (relativa al directorio del skill activo)

#### Scenario: SKILL.md no hardcodea prefijo de cliente en ruta de template
- **WHEN** se busca el patr�n `.claude/skills/<cualquier-skill>/assets/` en un SKILL.md
- **THEN** no hay coincidencias � ninguna referencia a template usa rutas absolutas con prefijo de cliente

#### Scenario: Ning�n agente referencia el directorio compartido antiguo
- **WHEN** se hace b�squeda de `$SPECS_BASE/specs/templates/` en `.claude/agents/`
- **THEN** no hay resultados en archivos activos

