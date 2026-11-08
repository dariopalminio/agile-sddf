---
alwaysApply: false
type: story
id: STORY-183
kind: feat
slug: STORY-183-dod-code-review-sin-criterios-circulares
title: "DoD CODE-REVIEW sin criterios circulares"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-08
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: DoD CODE-REVIEW sin criterios circulares

**Como** Solo Builder que corrige lo que pide `fix-directives.md`  
**Quiero** que `dod-story-code-review.md` (guardrail y plantilla de `sddf-constitution`) contenga solo criterios que la revisión puede comprobar, y que los criterios que ya cubre un revisor tomen su resultado en lugar de crear hallazgos nuevos  
**Para** que el DoD no se autoevalúe con el veredicto que ayuda a calcular y que un mismo defecto no aparezca varias veces en `fix-directives.md`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Sin criterios que el orquestador satisface por sí mismo
```gherkin
Dado "docs/guardrails/dod-story-code-review.md" y "skills/sddf-constitution/assets/dod-story/dod-story-code-review.md"
Cuando se leen sus criterios "- [ ]"
Entonces ninguno exige que "code-review-report.md" esté creado o actualizado
  Y ninguno exige "verdict: APPROVED"
  Y ninguno exige la ausencia de hallazgos bloqueantes HIGH o MEDIUM
  Y "memory-system check" pasa
```

### AC-2 — Escenario principal – Un criterio cubierto por un revisor no duplica el hallazgo
```gherkin
Dado una historia STORY-NNN con un escenario Gherkin sin correspondencia en el código
  Y el Product-Owner-Reviewer lo reporta como hallazgo
Cuando el árbitro evalúa el criterio del DoD "Cada escenario Gherkin tiene correspondencia en el código"
Entonces el criterio toma el resultado del Product-Owner-Reviewer
  Y el defecto aparece una sola vez en "fix-directives.md"
```

### AC-3 — Escenario alternativo – Un criterio sin revisor sigue evaluándose
```gherkin
Dado una historia STORY-NNN con tareas sin marcar en "tasks.md"
  Y ningún revisor cubre el criterio "Sin tareas pendientes en tasks.md"
Cuando el árbitro evalúa el DoD CODE-REVIEW
Entonces el criterio produce su propio hallazgo con "Archivo:Línea" del DoD, como hoy
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Guardrail y plantilla alineados:** los criterios de `docs/guardrails/dod-story-code-review.md` y de `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md` coinciden. Hoy difieren en «Sin tareas pendientes en `tasks.md`», que el guardrail matiza con «(si existe el archivo)».
- **CNF-2 — Gate verde:** `npm run verify:repository`, `npm test` y `memory-system check` pasan (CS-5).

## Fuera de alcance (Non-Goals)

- Migrar el DoD de proyectos consumidores ya instalados: `sddf-constitution` nunca sobrescribe un `dod-story-*.md` existente. Si hace falta, se tramita aparte.
- El tope de LOW y la deduplicación entre revisores: STORY-182.

## 📎 Notas / contexto adicional

- Cubre **CS-5** de EPIC-28.
- **Criterios circulares hoy** (`docs/guardrails/dod-story-code-review.md`): «Sin hallazgo bloqueante de severidad HIGH o MEDIUM» (L21), «El reporte de revisión de código (`code-review-report.md`) está creado o actualizado» (L24) y «Revisión de código aprobada (`verdict: APPROVED` …)» (L25). Las notas de la épica registran que los criterios 8 y 9 se autoevalúan.
- **Criterios cubiertos por revisores:** «Cada escenario Gherkin tiene correspondencia en el código» (Product-Owner-Reviewer) y «Los componentes respetan la arquitectura de `design.md`» (Integration-Reviewer). La evaluación del DoD está en el Paso 4c.1 de `skills/story-code-review/SKILL.md`.
- La precedencia del DoD frente a `REVIEW.md` la fija el ADR de STORY-178.
