---
alwaysApply: false
type: story
id: STORY-183
kind: feat
slug: STORY-183-dod-code-review-sin-criterios-circulares
title: "DoD CODE-REVIEW sin criterios circulares"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-11
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: DoD CODE-REVIEW sin criterios circulares

**Como** Solo Builder que corrige lo que pide `fix-directives.md`  
**Quiero** que el DoD de CODE-REVIEW solo exija lo que la revisión puede comprobar y no repita lo que ya reporta un revisor  
**Para** que el DoD no se apruebe con el veredicto que ayuda a calcular (cero criterios autorreferentes) y cada defecto tenga una sola entrada en `fix-directives.md`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Sin criterios que la revisión satisface por sí misma
```gherkin
Dado el DoD de CODE-REVIEW del repositorio y la plantilla que instala "sddf-constitution"
Cuando se leen sus criterios "- [ ]"
Entonces ninguno se cumple por el solo hecho de generar "code-review-report.md"
  Y ninguno depende del veredicto de ese reporte
  Y ninguno depende de la ausencia de hallazgos HIGH o MEDIUM de la misma revisión
  Y "memory-system check" pasa
```

### AC-2 — Escenario principal – Un criterio cubierto por un revisor no duplica el hallazgo
```gherkin
Dado una historia STORY-NNN con un escenario Gherkin sin correspondencia en el código
  Y un revisor lo reporta como hallazgo
Cuando se evalúa el DoD de CODE-REVIEW
Entonces el criterio del DoD que cubre ese defecto queda incumplido con el resultado del revisor
  Y "fix-directives.md" tiene una sola entrada para ese defecto
  Y "code-review-report.md" lista ese defecto una sola vez
  Pero el DoD no añade un hallazgo propio para ese criterio
```

### AC-3 — Escenario alternativo – Un criterio sin revisor sigue evaluándose
```gherkin
Esquema del escenario: Un criterio que ningún revisor cubre produce su propio hallazgo
  Dado una historia STORY-NNN en la que <incumplimiento>
    Y ningún revisor cubre el criterio "<criterio>"
  Cuando se evalúa el DoD de CODE-REVIEW
  Entonces "code-review-report.md" registra un hallazgo del DoD para "<criterio>"
    Y el hallazgo cita el archivo del DoD y la línea del criterio
    Y "fix-directives.md" tiene una sola entrada para ese hallazgo

  Ejemplos:
    | criterio                                          | incumplimiento                           |
    | Sin tareas pendientes en tasks.md                 | "tasks.md" tiene una tarea "- [ ]"       |
    | Metadatos frontmatter de story.md están completos | "story.md" no tiene el campo "created"   |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Guardrail y plantilla alineados:** los criterios de `docs/guardrails/dod-story-code-review.md` y de `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md` coinciden. Hoy difieren en «Sin tareas pendientes en `tasks.md`», que el guardrail matiza con «(si existe el archivo)».
- **CNF-2 — Gate verde:** `npm run verify:repository`, `npm test` y `memory-system check` pasan (CS-5).

## Fuera de alcance (Non-Goals)

- Migrar el DoD de proyectos consumidores ya instalados: `sddf-constitution` nunca sobrescribe un `dod-story-*.md` existente. Si hace falta, se tramita aparte.
- El tope de LOW y la deduplicación entre revisores: STORY-182.

## 📎 Notas / contexto adicional

- Cubre **CS-5** de EPIC-28.
- **Archivos del DoD:** el guardrail `docs/guardrails/dod-story-code-review.md` y la plantilla `skills/sddf-constitution/assets/dod-story/dod-story-code-review.md`.
- **Criterios circulares hoy** (guardrail): «Sin hallazgo bloqueante de severidad HIGH o MEDIUM» (L21), «El reporte de revisión de código (`code-review-report.md`) está creado o actualizado» (L24) y «Revisión de código aprobada (`verdict: APPROVED` …)» (L25). Las notas de la épica registran que los criterios 8 y 9 se autoevalúan.
- **Criterios cubiertos por revisores:** «Cada escenario Gherkin tiene correspondencia en el código» (Product-Owner-Reviewer) y «Los componentes respetan la arquitectura de `design.md`» (Integration-Reviewer). La evaluación del DoD está en el Paso 4c.1 de `skills/story-code-review/SKILL.md`. Hoy esa evaluación cita `Archivo:Línea` del DoD en cada hallazgo propio; AC-3 conserva ese comportamiento.
- **Mecanismo abierto:** `story-design` decide cómo el árbitro reutiliza el resultado del revisor en AC-2: un mapeo explícito criterio → revisor o la deduplicación de hallazgos. AC-2 y AC-3 se comprueban sobre las entradas de `fix-directives.md` y `code-review-report.md`, no sobre el razonamiento del árbitro.
- **Posible división:** si en `story-design` el cambio de `story-code-review` (AC-2, AC-3) crece, separar la limpieza de criterios del DoD (AC-1, CNF-1) en una historia propia.
- La precedencia del DoD frente a `REVIEW.md` la fija el ADR de STORY-178.
- **Cambios aceptados en el diseño (CR-001, CR-002; 2026-11-11):** el segundo ejemplo de AC-3 usa el campo `created` y no `substatus`, porque una historia sin `substatus` se detiene en el Paso 1d y el Paso 1e escribe `substatus` antes de evaluar el DoD. El DoD también retira «Se cumple [[dod-story-implement]]», que arrastra criterios de IMPLEMENT que duplican a los revisores y al criterio de `tasks.md`, y reescribe el criterio de metadatos sin «con status y substatus actualizados», que satisface el propio Paso 1e (D-2 de `design.md`).
