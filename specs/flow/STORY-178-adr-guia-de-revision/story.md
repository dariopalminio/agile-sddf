---
alwaysApply: false
type: story
id: STORY-178
kind: chore
slug: STORY-178-adr-guia-de-revision
title: "ADR de la guía de revisión"
status: SPECIFY
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-08
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: ADR de la guía de revisión

**Como** mantenedor de agile-sddf que va a implementar las historias de EPIC-28 sobre `REVIEW.md`  
**Quiero** un ADR aceptado que fije dónde vive `REVIEW.md`, qué decide frente a `constitution.md`, el DoD CODE-REVIEW y la plantilla del informe, de dónde se lee y cómo se traducen las severidades de Claude Code Review (Important, Nit, Pre-existing)  
**Para** que las demás historias de la épica implementen una sola decisión y ninguna tenga que reabrir la ubicación, la precedencia, la fuente de lectura o el vocabulario en su `design.md`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El ADR fija ubicación, precedencia y fuente de lectura
```gherkin
Dado que EPIC-28 deja abiertas la ubicación, la precedencia, la fuente de lectura y el vocabulario de "REVIEW.md"
Cuando el mantenedor registra el ADR de la guía de revisión con el siguiente número "ADR-NNNN" libre
Entonces existe "docs/adr/ADR-NNNN-<slug>.md" con estado "ACCEPTED" y todas las secciones de "docs/adr/adr-template.md"
  Y su decisión fija la ubicación de "REVIEW.md", su precedencia frente a "constitution.md", "dod-story-code-review.md" y la plantilla de "code-review-report.md", y si se lee del working tree o de la rama base
  Y "docs/adr/README.md" lista el ADR en su índice con el mismo título, estado y fecha
```

### AC-2 — Escenario con datos – Cada severidad de Claude Code Review tiene una sola traducción
```gherkin
Escenario: Traducción de severidades
  Dado el ADR de la guía de revisión con estado "ACCEPTED"
  Cuando se busca la severidad "<severidad>" de Claude Code Review en su tabla de vocabulario
  Entonces aparece en una sola fila, traducida a "<categoría>" con efecto sobre el veredicto "<efecto>"
Ejemplos:
  | severidad       | categoría      | efecto     |
  | 🔴 Important    | HIGH o MEDIUM  | bloquea    |
  | 🟡 Nit          | LOW            | no bloquea |
  | 🟣 Pre-existing | PREEXISTENTE   | no bloquea |
```

### AC-3 — Escenario alternativo – La historia revisada modifica REVIEW.md o el DoD
```gherkin
Dado una historia cuyo alcance modifica "REVIEW.md" o "dod-story-code-review.md"
Cuando se consulta el ADR de la guía de revisión
Entonces el ADR indica qué versión de esa guía rige la revisión de esa historia
  Y exige que "/story-code-review" advierta del cambio en el informe
  Pero no exige que "/story-code-review" use git si la fuente elegida es el working tree
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin cuarta raíz:** el ADR ubica `REVIEW.md` en la raíz por convención de la herramienta, como `AGENTS.md` y `CLAUDE.md`, sin editar ADR-0019 (ADR aceptado, inmutable) ni añadir una raíz al layout fijo.

- **CNF-2 — Alternativas descartadas:** la sección de alternativas del ADR registra al menos la opción no elegida entre working tree y rama base, con el motivo del descarte.

- **CNF-3 — Veracidad de la fuente:** el ADR cita `code.claude.com/docs/en/code-review-customize` y distingue lo que dice la convención de Anthropic (`REVIEW.md` solo lo lee el servicio gestionado de GitHub, cambia lo que se reporta y no el formato, se lee de la rama base) de lo que decide agile-sddf (`story-code-review` es un gate que bloquea y lee `REVIEW.md` de forma explícita).

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan tras añadir el ADR y su entrada en el índice.

## Fuera de alcance (Non-Goals)

- Crear el `REVIEW.md` de la raíz, modificar `story-code-review`, sus agentes, `dod-story-code-review.md` o `sddf-constitution`: son otras historias de EPIC-28 que implementan este ADR.
- Activar Claude Code Review en GitHub (decisión humana, fuera de alcance de la épica).
- Publicar `REVIEW.md` en npm: el de la raíz es propio de este repo y no entra en `package.json › files`.

## 📎 Notas / contexto adicional

- Cubre la parte del ADR del criterio de salida **CS-1** de EPIC-28; el resto de CS-1 (el `REVIEW.md` con sus cuatro secciones) corresponde a la historia «REVIEW.md de agile-sddf».
- El ADR es obligatorio por la constitución (`docs/constitution.md`, sección de decisiones transversales): la decisión afecta a `story-code-review` y `sddf-constitution` y restringe las historias siguientes. Por eso conviene implementar esta historia antes que las que leen `REVIEW.md`.
- Las decisiones (a) fuente de lectura y (c) ubicación en la raíz vienen de la nota «Decisiones para el ADR» de la épica. La decisión (b), cómo identificar las líneas no tocadas para PREEXISTENTE si el skill no usa `git diff`, no está en el enunciado de esta historia: puede incorporarse al ADR o resolverse en el `design.md` de «Hallazgos preexistentes».
- La tabla de AC-2 recoge el vocabulario propuesto en las notas de la épica; el ADR puede ajustarlo si documenta el motivo, siempre que cada severidad tenga una sola traducción.
- Fuente: `.temp/propuestas-de-mejoras/mejora-015-REVIEW.md` (2026-11-07).
