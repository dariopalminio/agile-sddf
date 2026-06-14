---
type: plan
id: plan-01
slug: plan-01-deliver-status
title: "Renombrar INTEGRATION → DELIVER en el workflow de story"
status: COMPLETED
substatus: DONE
parent: EPIC-18
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-18-complete-flow
---

# Plan: Renombrar INTEGRATION → DELIVER en el workflow de story

## Contexto

El estado final activo del workflow de historia se llamaba INTEGRATION, lo que era ambiguo: podía significar "integrar ramas" (técnico) pero no capturaba el concepto ágil de "entregar valor". El nuevo nombre DELIVER es más claro, profesional y agnóstico al modelo de entrega (batch o continuous). La documentación canónica de la máquina de estados debe reflejar el cambio y explicitar la dualidad semántica de DELIVER.

El workflow completo queda:
`SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED`

## Alcance

### Excepción — NO renombrar
- `.claude/skills/story-code-review/assets/code-review-report-template.md` — el placeholder `{{INTEGRATION_FINDINGS}}` es un campo de "hallazgos de integración de código" del revisor (concepto técnico, no estado del workflow). No debe tocarse.

---

## Archivos a modificar (agrupados por prioridad)

### Grupo 1 — Documentación canónica (máxima prioridad)

**`docs/knowledge/guides/state-machine.md`** (mencionado explícitamente)
- Reemplazar `INTEGRATION` → `DELIVER` en las transiciones del diagrama Mermaid y en el texto.
- Reemplazar la descripción del estado:
  - Actual: "INTEGRATION y COMPLETED son transiciones manuales — ningún skill los escribe. Los marca el humano o CI/CD al integrar el código y cerrar la historia."
  - Nueva: "DELIVER y COMPLETED son transiciones manuales — ningún skill los escribe. DELIVER significa que el incremento está listo para producción (potencialmente entregable) o ya desplegado (entregado), según el modelo de entrega del equipo (batch vs. continuous). Lo marca el humano o CI/CD."

**`docs/knowledge/guides/specs_and_workflows.md`**
- Reemplazar `INTEGRATION` → `DELIVER` en todas las cadenas del workflow.
- Actualizar la descripción "INTEGRATION – Fase donde se integra a la rama release/main." → "DELIVER – Incremento listo para entregar o ya entregado al usuario. Cubre tanto el modelo batch (potencialmente entregable) como el modelo continuous (ya desplegado)."

**`docs/knowledge/guides/skill-structural-pattern.md`**
- Reemplazar `INTEGRATION` → `DELIVER` en el enum de status.

### Grupo 2 — Skills activos

**`.claude/skills/header-aggregation/SKILL.md`**
- Reemplazar `INTEGRATION` → `DELIVER` en el enum de status del frontmatter.

**`.claude/skills/story-acceptance/SKILL.md`**
- Reemplazar `INTEGRATION` → `DELIVER` en:
  - Descripción (línea 5): "Usar para el gate de aceptación antes de DELIVER."
  - Mensajes de output (líneas 402, 440, 473): "historia {story_id} lista para DELIVER"

### Grupo 3 — Políticas y templates

**`docs/policies/definition-of-done-story.md`**
- Reemplazar comentario: `<!-- Criterios que el validador humano debe confirmar manualmente antes de avanzar a DELIVER. -->`

**`.claude/skills/project-policies-generation/assets/definition-of-done-story-template.md`**
- Reemplazar sección header: `## 🖇️ DELIVER (Definición de Hecho para la fase de Entrega)`
- Reemplazar referencias `INTEGRATION` → `DELIVER` e `Integración` → `Entrega`.

### Grupo 4 — Specs de historia FEAT-072 (story-acceptance)

Los artefactos de la historia que implementó `story-acceptance` contienen referencias al estado. Actualizar:

- `docs/specs/stories/FEAT-072-skill-story-acceptance/story.md`
- `docs/specs/stories/FEAT-072-skill-story-acceptance/design.md`
- `docs/specs/stories/FEAT-072-skill-story-acceptance/tasks.md`
- `docs/specs/stories/FEAT-072-skill-story-acceptance/analyze.md`
- `docs/specs/stories/FEAT-072-skill-story-acceptance/verify-report.md`
- `docs/specs/stories/FEAT-072-skill-story-acceptance/acceptance-report.md`
- `docs/specs/stories/FEAT-072-skill-story-acceptance/code-review-report.md`
- `docs/specs/stories/FEAT-072-skill-story-acceptance/implement-report.md`

Estrategia: `replace_all` de `INTEGRATION` → `DELIVER` en cada archivo. Los títulos del frontmatter (`title`) también se actualizan si contienen el término.

### Grupo 5 — Otros artefactos con referencias

- `README.md` — flujo de workflow en línea 39.
- `docs/specs/projects/PROJ-01-agile-sddf/project.md` — enum de status en glosario (línea 574).
- `docs/specs/releases/EPIC-13-quality-gates-con-dod-en-story-workflow/release.md` — descripción de feature FEAT-072.
- `docs/specs/releases/EPIC-17-remediating-and-improvement/plan-09-state-machine-canonical-document.md` — documento del canonical state machine.

### Grupo 6 — Examples y evals

- `.claude/skills/story-acceptance/examples/example-approved/acceptance-report.md` — mensaje de output de ejemplo.
- `.claude/skills/story-improve/examples/example-aprobada-input/story.md` — escenario de ejemplo.
- `.claude/skills/story-acceptance/evals/evals.json` — assertions de tests ("lista para DELIVER").

---

## Estrategia de implementación

1. Usar `Edit` con `replace_all: true` para cada archivo — la cadena `INTEGRATION` (en mayúsculas como estado) es suficientemente específica para no colisionar con otros usos.
2. En `definition-of-done-story-template.md` hacer también el reemplazo en español: `Integración` → `Entrega` en el header de sección.
3. En `state-machine.md` y `specs_and_workflows.md` actualizar también las descripciones narrativas del estado (no solo las menciones en cadenas de workflow).
4. Verificar manualmente que `story-code-review/assets/code-review-report-template.md` NO fue modificado.

## Verificación

1. `grep -r "INTEGRATION" .claude/skills/ docs/knowledge/ docs/policies/ README.md` — debe devolver 0 coincidencias (salvo `story-code-review/assets/code-review-report-template.md`).
2. `grep -r "DELIVER" docs/knowledge/guides/state-machine.md` — debe mostrar las transiciones y la descripción ampliada.
3. Revisar visualmente `state-machine.md` para confirmar que el diagrama Mermaid y la narrativa son coherentes.
