---
alwaysApply: false
type: story
id: STORY-180
kind: feat
slug: STORY-180-story-code-review-lee-review-md
title: "story-code-review lee REVIEW.md"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-10
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-179-review-md-de-agile-sddf
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: story-code-review lee REVIEW.md

**Como** Solo Builder que revisa sus historias con `/story-code-review`  
**Quiero** que el skill lea `REVIEW.md` cuando existe, lo pase a los cuatro revisores y al árbitro y me avise si la historia modifica `REVIEW.md` o el DoD CODE-REVIEW  
**Para** calibrar la revisión de cada proyecto sin editar los agentes del skill, y que los agentes dejen de juzgar con reglas propias de agile-sddf en proyectos que no son agile-sddf

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – REVIEW.md llega a los revisores y al árbitro
```gherkin
Dado una historia STORY-NNN en IMPLEMENT/DONE
  Y un "REVIEW.md" en la raíz del repositorio
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces el resumen "Contexto cargado" muestra la ruta de "REVIEW.md"
  Y el bloque de contexto de cada uno de los cuatro revisores incluye la ruta de "REVIEW.md"
  Y el árbitro aplica "REVIEW.md" al consolidar los hallazgos
```

### AC-2 — Escenario principal – "No reportar" evita un falso bloqueante
```gherkin
Dado una historia STORY-NNN en IMPLEMENT/DONE cuyo alcance incluye un secreto falso en "skills/<skill>/examples/"
  Y un "REVIEW.md" cuya sección "No reportar" excluye los secretos falsos de "skills/*/examples/"
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces el secreto falso no figura como hallazgo HIGH ni MEDIUM
  Y el veredicto no es NEEDS-CHANGES por ese archivo
```

### AC-3 — Escenario alternativo – Proyecto sin REVIEW.md
```gherkin
Dado un proyecto que instaló agile-sddf y no tiene "REVIEW.md"
Cuando el usuario ejecuta "/story-code-review STORY-NNN" sobre una historia en IMPLEMENT/DONE
Entonces el skill muestra una advertencia de que no hay guía de revisión
  Y genera "code-review-report.md" con el mismo frontmatter, las mismas secciones y el mismo veredicto que antes de esta historia
  Pero la falta de "REVIEW.md" no produce BLOCKED ni NEEDS-CHANGES
```

### AC-4 — Escenario alternativo – La historia modifica la guía o el DoD
```gherkin
Dado una historia STORY-NNN cuyo alcance incluye "REVIEW.md" o "docs/guardrails/dod-story-code-review.md"
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces el skill advierte que la historia modifica las reglas con las que se la revisa
  Y lee "REVIEW.md" desde la fuente que fija el ADR de la guía de revisión (STORY-178)
```

### AC-5 — Escenario alternativo – Agentes sin reglas propias de agile-sddf
```gherkin
Dado los cuatro archivos de "skills/story-code-review/agents/"
Cuando se ejecuta grep -rE "Principio 6|teléfono descompuesto|un solo nivel de delegación" skills/story-code-review/agents/
Entonces no devuelve resultados
  Pero esas reglas siguen aplicándose en este repositorio porque figuran en su "REVIEW.md" (STORY-179)
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Contrato del informe estable:** el frontmatter, las secciones y los valores de `verdict` de `code-review-report.md` no cambian; `REVIEW.md` cambia qué se reporta y con qué severidad, no el formato (CS-2).
- **CNF-2 — Evals primero:** los casos «`REVIEW.md` presente», «`REVIEW.md` ausente» y «secreto falso en `examples/`» se escriben en `skills/story-code-review/evals/evals.json` antes de cambiar el skill (principio 11 de la constitución, CS-8).
- **CNF-3 — Gate verde:** `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Redactar el `REVIEW.md` de agile-sddf: es STORY-179.
- La categoría PREEXISTENTE, la verificación de evidencia, la deduplicación y el tope de LOW: son STORY-181, STORY-182 y STORY-185. Esta historia solo hace llegar `REVIEW.md` al árbitro.
- Activar Claude Code Review en GitHub.

## 📎 Notas / contexto adicional

- Cubre **CS-2** y **CS-3** de EPIC-28, y el escenario **SMOKE-1** y **SMOKE-3**.
- **Depende de STORY-178:** la fuente de lectura (working tree o rama base) y la precedencia de `REVIEW.md` frente a `constitution.md` y el DoD las fija el ADR. Implementar después de STORY-178 y STORY-179.
- **Punto de inserción:** el Paso 2d de `skills/story-code-review/SKILL.md` localiza `constitution.md` y el DoD; el Paso 3b lista las variables que recibe cada revisor (`$STORY_DIR`, `$REPO_PATH`, `$CONSTITUTION_PATH`, `$DOD_PATH`…). Las reglas propias del repo están en `skills/story-code-review/agents/integration-reviewer.agent.md:48-49`.
- **Tamaño:** cinco escenarios que tocan el skill y los cuatro agentes. Si `/story-evaluation` la marca como grande, separar AC-5 (limpieza de agentes) en una historia propia es el corte natural.
