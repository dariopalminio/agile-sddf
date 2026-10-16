---
type: epic
id: EPIC-25
slug: EPIC-25-unificar-contrato-de-validaciones-en-skills
title: "Unificar contrato de validaciones en skills"
status: DEFINE
substatus: TODO
parent: null
created: 2026-10-14
updated: 2026-10-15
related: []
---

# Épica: Unificar contrato de validaciones en skills

## Alcance

Alinear los cuatro skills de validación del framework (`epic-analyze`, `story-evaluation`, `story-code-review`, `story-verify`) bajo un contrato común de reporte: veredicto explícito al inicio, campo `verdict` en frontmatter y un vocabulario controlado único en inglés (`APPROVED`, `NEEDS-REFINEMENT`, `NEEDS-CHANGES`, `BLOCKED`, `SPLIT`). Se unifica `RECHAZAR` con `REFINAR` en `story-verify` y se completa el veredicto ausente en esa fase. El resultado es un gate de validación homogéneo, consumible por agentes y pipelines CI.

## Historias

- [Contrato de validación]: Definir `docs/policies/validation-contract-policy.md` con la estructura común de reporte y el vocabulario controlado de veredictos
- [Alinear epic-analyze]: Verificar y documentar conformidad de `epic-analyze` con el contrato de validación
- [Alinear story-evaluation]: Mover decisión al inicio, renombrar campo a `Veredicto` y normalizar valores al vocabulario canónico
- [Alinear story-code-review]: Renombrar `Review status` a `Veredicto` y normalizar valores y frontmatter
- [Alinear story-verify]: Añadir sección de veredicto y frontmatter, y unificar `RECHAZAR` con `REFINAR`
- [Validación end-to-end]: Verificar coherencia de los cuatro reportes contra el contrato y documentar en README

## Criterios de salida

- [ ] `docs/policies/validation-contract-policy.md` existe y describe la estructura común de reporte con ejemplos para cada skill.
- [ ] Los cuatro skills (`epic-analyze`, `story-evaluation`, `story-code-review`, `story-verify`) tienen una sección `## Veredicto` como primera sección tras el título en sus templates de reporte.
- [ ] Los cuatro templates declaran `verdict` en el frontmatter con valores del vocabulario controlado.
- [ ] No existe ninguna variante `APROBADA`, `Aprobada`, `approved` ni `review-status` en skills, templates ni documentación del framework.
- [ ] `story-verify` produce un veredicto explícito (`APPROVED` / `NEEDS-REFINEMENT` / `BLOCKED`) consumible por CI.
- [ ] `RECHAZAR` ya no existe en el vocabulario de `story-verify`; en `story-evaluation` se mapea a `BLOCKED`.
- [ ] El README del framework apunta a `docs/policies/validation-contract-policy.md` como fuente de verdad del contrato de validación.

## Smoke tests

### SMOKE-1 — Veredicto uniforme en los cuatro reportes
```gherkin
Escenario: Los cuatro skills emiten veredicto con la misma estructura
  Dado el framework con las historias de esta épica implementadas
  Cuando se ejecuta epic-analyze, story-evaluation, story-code-review y story-verify sobre artefactos de ejemplo
  Entonces cada reporte generado tiene una sección "## Veredicto" como primera sección tras el título
  Y cada reporte declara el campo "verdict" en su frontmatter
  Y todos los valores de veredicto pertenecen al vocabulario controlado {APPROVED, NEEDS-REFINEMENT, BLOCKED, SPLIT}
```

### SMOKE-2 — story-verify emite veredicto consumible por CI
```gherkin
Escenario: Un pipeline CI consume el veredicto de story-verify
  Dado un reporte generado por story-verify sobre una historia implementada
  Cuando el pipeline lee el campo "verdict" del frontmatter
  Entonces obtiene uno de los valores APPROVED, NEEDS-REFINEMENT o BLOCKED
  Y no encuentra el valor RECHAZAR en ninguna parte del reporte
```

### SMOKE-3 — Vocabulario canónico sin variantes
```gherkin
Escenario: El framework no contiene variantes de aprobación
  Dado el repositorio con las historias de esta épica implementadas
  Cuando se buscan las cadenas "APROBADA", "Aprobada", "approved" y "review-status" en skills, templates y documentación
  Entonces no se encuentran coincidencias
  Y la cadena "APPROVED" aparece en los cuatro skills de validación como valor canónico de aprobación
```

## Notas

- **Habilitación secuencial:** la historia *Contrato de validación* bloquea a las cuatro historias de alineación por skill. Las historias 2–5 pueden ejecutarse en paralelo una vez fijado el contrato. La historia *Validación end-to-end* depende de que las cuatro anteriores estén completas.
- **Origen:** la épica surge del análisis comparativo de los templates de reporte de los cuatro skills guardrail, donde se detectaron tres divergencias: ubicación del veredicto (inicio vs. final vs. ausente), idioma/casing (`APPROVED` / `APROBADA` / `approved`) y nombre del campo (`verdict` / `decision` / `review-status`).
- **Decisión de vocabulario:** se adopta inglés en `SCREAMING_SNAKE_CASE` por consistencia con `epic-analyze`, que ya usa `APPROVED`/`NEEDS-REFINEMENT`/`BLOCKED`, y por compatibilidad con máquinas de estado y pipelines CI.
- **Decisión semántica en `story-verify`:** `RECHAZAR` se elimina porque en la fase VERIFY el artefacto ya existe (código + tests ejecutados); descartarlo casi nunca es la acción correcta. Un fallo se resuelve iterando, no reiniciando. `RECHAZAR` en `story-evaluation` se mapea a `NEEDS-REFINEMENT` para preservar simplicidad y la semántica de "no viable en su forma actual".
- **`SPLIT` como extensión local:** el veredicto `SPLIT` solo aplica a `story-evaluation` (historia demasiado grande). Se mantiene documentado como extensión del vocabulario controlado, sin equivalente en los otros skills.
- **`NEEDS-CHANGES`:** se conserva como alias explícito de `NEEDS-REFINEMENT` en el contexto de `story-code-review`.
- **Riesgo:** cualquier consumidor externo (agentes, scripts, pipelines) que dependa hoy de `decision: APROBADA`, `review-status: approved` o del veredicto al final del reporte se romperá. Mitigación: documentar el cambio en `docs/policies/validation-contract-policy.md` y en el README.


