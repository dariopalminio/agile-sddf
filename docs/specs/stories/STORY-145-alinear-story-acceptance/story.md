---
alwaysApply: false
type: story
id: STORY-145
kind: feat
slug: STORY-145-alinear-story-acceptance
title: "Alinear story-acceptance"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-20
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Alinear story-acceptance

**Como** mantenedor de Agile-SDDF que usa `story-acceptance` como último gate antes de DELIVER  
**Quiero** que `acceptance-report.md` declare un veredicto `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` o `PENDING` en una sección `## Veredicto` al inicio y en el campo `verdict`  
**Para** que el ciclo de ejecución y QA vuelva a implementar con el mismo vocabulario que `story-code-review` y `story-verify`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Veredicto canónico según la validación de criterios
```gherkin
Esquema del escenario: Veredicto canónico según el resultado de los criterios
  Dado una historia cuya sesión de aceptación termina con <resultado>
  Cuando el mantenedor ejecuta /story-acceptance sobre la historia
  Entonces acceptance-report.md tiene "## Veredicto" como primera sección tras el título con el valor <verdict>
    Y el frontmatter declara "verdict: <verdict>"
  Pero el reporte no contiene el campo "final-status" ni los valores ACCEPTANCE-APPROVED, ACCEPTANCE-REJECTED o ACCEPTANCE-BLOCKED
Ejemplos:
  | resultado                                                 | verdict       |
  | todos los criterios aprobados                             | APPROVED      |
  | al menos un criterio rechazado y ninguno bloqueado        | NEEDS-CHANGES |
  | al menos un criterio bloqueado y ninguno rechazado        | BLOCKED       |
  | criterios rechazados y bloqueados a la vez                | NEEDS-CHANGES |
  | sesión interrumpida con criterios sin evaluar (partial)   | PENDING       |
```

### AC-2 — Escenario alternativo — Reporte existente leído por su veredicto
```gherkin
Dado un acceptance-report.md completo con verdict NEEDS-CHANGES
Cuando el mantenedor vuelve a ejecutar /story-acceptance sobre la historia
Entonces el aviso de reporte existente muestra el resultado leído del campo "verdict"
  Pero no lee el campo "final-status"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin cambio de validación:** la validación criterio por criterio, `session-status` (`partial` / `complete`) y la reanudación de sesiones no cambian.

## Fuera de alcance (Non-Goals)

- Hacer que `story-implement` reconozca `acceptance-report.md` como señal de rework (bucle `NEEDS-CHANGES` del flowchart de ejecución y QA).
- Reescribir los `acceptance-report.md` históricos de `docs/specs/stories/`.

## 📎 Notas / contexto adicional

- **Estado actual:** `skills/story-acceptance/assets/acceptance-report-template.md` declara `final-status: ACCEPTANCE-APPROVED | ACCEPTANCE-REJECTED | ACCEPTANCE-BLOCKED` (SKILL.md, línea 397) y pone el resultado al final, en `## Estado final`. Los ejemplos (`examples/example-approved`, `examples/example-rejected`) y `evals/evals.json` usan esos valores.
- **Flowchart:** en `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid`, `story-acceptance` tiene las ramas `APPROVED` (fin) y `NEEDS-CHANGES` (vuelve a implementar). `BLOCKED` y `PENDING` no son ramas: detienen el flujo hasta que se resuelva el bloqueo o termine la sesión.
- **Decisiones del PO (2026-10-17):**
  - Un criterio bloqueado produce `BLOCKED`, porque un bloqueo impide el proceso. Un criterio rechazado produce `NEEDS-CHANGES`.
  - Con criterios rechazados y bloqueados a la vez, gana el rechazo: `NEEDS-CHANGES`.
  - Mientras la sesión es `partial`, `verdict` declara `PENDING`. Al completarla, se recalcula con las filas anteriores.
- **Resultados por criterio:** los valores `APPROVED` / `REJECTED` / `BLOCKED` de cada criterio en la tabla de detalle no son el veredicto del reporte. La política decide si se renombran.
- **Otros textos con `ACCEPTANCE-*`:** los ejemplos de DoD de `skills/memory-system/examples/` mencionan esos valores. Hay que revisarlos con esta historia.
- **Dependencias:** depende de STORY-138. Puede ejecutarse en paralelo con STORY-139, STORY-140, STORY-141, STORY-142 y STORY-144.
- Cubre el criterio de salida de EPIC-25: **CS-9** — `story-acceptance` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES` | `BLOCKED`, y `PENDING` mientras la sesión está a medias, sin `ACCEPTANCE-REJECTED`. Contribuye además a `## Veredicto` como primera sección y a `verdict` en el frontmatter.
