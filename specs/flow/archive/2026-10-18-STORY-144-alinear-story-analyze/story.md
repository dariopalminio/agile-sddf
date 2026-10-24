---
alwaysApply: false
type: story
id: STORY-144
kind: feat
slug: STORY-144-alinear-story-analyze
title: "Alinear story-analyze"
status: COMPLETED
substatus: DONE
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-18
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Alinear story-analyze

**Como** mantenedor de Agile-SDDF que prepara una historia con `story-plan`  
**Quiero** que `analyze.md` declare un veredicto `APPROVED` o `NEEDS-CHANGES` en una sección `## Veredicto` al inicio y en el campo `verdict`  
**Para** que `story-plan` y CI decidan si la historia está lista para implementar sin interpretar el «Estado general» ni contar ERRORes en el texto

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Veredicto explícito según las inconsistencias
```gherkin
Esquema del escenario: Veredicto explícito según las inconsistencias detectadas
  Dado una historia con story.md, design.md y tasks.md cuyo análisis detecta <inconsistencias>
  Cuando el mantenedor ejecuta /story-analyze sobre la historia
  Entonces analyze.md tiene "## Veredicto" como primera sección tras el título con el valor <verdict>
    Y el frontmatter declara "verdict: <verdict>"
Ejemplos:
  | inconsistencias       | verdict       |
  | ninguna               | APPROVED      |
  | solo WARNING          | APPROVED      |
  | al menos un ERROR     | NEEDS-CHANGES |
```

### AC-2 — Escenario alternativo — story-plan respeta el veredicto
```gherkin
Dado un analyze.md con verdict NEEDS-CHANGES
Cuando story-plan termina el pipeline de planning
Entonces story.md no pasa a READY-FOR-IMPLEMENT
  Y el resumen de story-plan informa el veredicto NEEDS-CHANGES
  Pero con verdict APPROVED la historia pasa a READY-FOR-IMPLEMENT/DONE como hoy
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin cambio de criterio:** las correlaciones, los tipos de inconsistencia (A–D) y su severidad no cambian. Solo se añade el veredicto que resume el resultado.

## Fuera de alcance (Non-Goals)

- Crear `story-fix-plan`, el bucle `NEEDS-CHANGES` del flowchart de planificación.
- Reescribir los `analyze.md` históricos de `docs/specs/stories/`.

## 📎 Notas / contexto adicional

- **Estado actual:** `skills/story-analyze/assets/analyze-report-template.md` no declara ningún veredicto. El resultado aparece solo como `**Estado general:** {overall_status}`, con los valores `✓ Coherente`, `⚠️ Advertencias` o `❌ Inconsistencias bloqueantes`. `story-plan` deja la historia en `READY-FOR-IMPLEMENT/DONE` solo si no hay ERRORes.
- **Flowchart:** en `docs/architecture/diagrams/flowchart-story-plan.mermaid`, `story-analyze` tiene las ramas `APPROVED` (fin del planning) y `NEEDS-CHANGES` (pasa a `story-fix-changes` y vuelve a `story-analyze`).
- **Decisión de diseño:** si el «Estado general» se conserva como detalle o se elimina, porque duplicaría el veredicto.
- **Dependencias:** depende de STORY-138. Puede ejecutarse en paralelo con STORY-139, STORY-140, STORY-141, STORY-142 y STORY-145.
- Cubre el criterio de salida de EPIC-25: **CS-6** — `story-analyze` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES`. Contribuye además a `## Veredicto` como primera sección y a `verdict` en el frontmatter.
