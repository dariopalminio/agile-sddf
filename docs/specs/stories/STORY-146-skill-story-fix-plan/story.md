---
alwaysApply: false
type: story
id: STORY-146
kind: feat
slug: STORY-146-skill-story-fix-plan
title: "Skill `story-fix-plan`: corregir el plan de una historia desde `analyze.md`"
status: IMPLEMENT
substatus: DONE
parent: null
created: 2026-10-17
updated: 2026-10-17
related: null
---

# 📖 Historia: skill `story-fix-plan`: corregir el plan de una historia desde `analyze.md`

**Como** Solo Builder que planifica historias con el pipeline SDD
**Quiero** un skill `/story-fix-plan STORY-NNN` que aplique sobre `design.md`, `tasks.md` y `testcases.md` los hallazgos que `/story-analyze` dejó en `analyze.md`
**Para** dejar de corregir a mano el plan entre ejecuciones de `/story-analyze` y llegar antes a `READY-FOR-IMPLEMENT`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – aplicar el plan de cambios
```gherkin
Dado que el frontmatter de "analyze.md" declara "verdict: NEEDS-CHANGES"
  Y "analyze.md" reporta inconsistencias, recomendaciones o criterios DoD PLAN en ⚠️ o ❌
  Y existen "design.md" y al menos uno de "tasks.md" o "testcases.md"
Cuando ejecuto "/story-fix-plan STORY-NNN" y confirmo el plan de cambios
Entonces cada archivo modificado tiene su ".bak" con el contenido previo
  Y los cambios se aplican sin renumerar IDs y con las referencias cruzadas actualizadas
  Y se genera "fix-plan-report.md" con cada cambio trazado a su hallazgo de origen
  Y "analyze.md", "story.md" y "epic.md" no se modifican
```

### AC-2 — Archivos del plan según los artefactos presentes
```gherkin
Esquema del escenario: archivos que el skill puede editar
  Dado que el directorio de la historia contiene "analyze.md", "<design>", "<tasks>" y "<testcases>"
  Cuando ejecuto "/story-fix-plan STORY-NNN"
  Entonces el resultado es "<resultado>"
Ejemplos:
  | design   | tasks    | testcases | resultado                                                |
  | presente | presente | ausente   | edita design.md y tasks.md                               |
  | presente | ausente  | presente  | edita design.md y testcases.md; no crea tasks.md         |
  | presente | presente | presente  | edita los tres                                           |
  | presente | ausente  | ausente   | ❌ No se encontró tasks.md ni testcases.md               |
  | ausente  | presente | presente  | ❌ No se encontró design.md                              |
```

### AC-3 — Sin cambios aplicables
```gherkin
Esquema del escenario: el skill termina sin cambios
  Dado que "analyze.md" cumple "<condición>"
  Cuando ejecuto "/story-fix-plan STORY-NNN"
  Entonces el skill emite un mensaje ℹ️ indicando que no hay cambios encontrados para aplicar
    Y no crea ni modifica ningún archivo
Ejemplos:
  | condición                                                                     |
  | el frontmatter declara "verdict: APPROVED" y no se pidió el modo advertencias |
  | el frontmatter no declara "verdict" o declara un valor distinto               |
  | declara "verdict: NEEDS-CHANGES" pero no tiene hallazgos accionables          |
  | todos los hallazgos exigen tocar archivos fuera del plan                      |
```

### AC-4 — Modo advertencias
```gherkin
Dado que el frontmatter de "analyze.md" declara "verdict: APPROVED"
  Y "analyze.md" reporta hallazgos WARNING que se resuelven en los archivos del plan
Cuando ejecuto "/story-fix-plan STORY-NNN corrige advertencias" o "/story-fix-plan STORY-NNN corrige warnings"
Entonces el skill corrige esas advertencias como en AC-1
  Y "fix-plan-report.md" registra el modo advertencias
```

## Fuera de alcance (Non-Goals)

- Re-ejecutar `/story-analyze` o cambiar `status`/`substatus` de los artefactos.
- Crear `tasks.md` o `testcases.md` cuando no existen.
- Integrar el skill en el orquestador `/story-plan`.

## 📎 Notas / contexto adicional

- Historia retroactiva: el skill se construyó con `/skill-master` antes de especificarla, sin pasar por `/story-evaluation` ni por el pipeline de planning (no hay `design.md` ni `tasks.md`). El detalle está en `implement-report.md`.
- Implementado en `skills/story-fix-plan/`, inspirado en `story-improve`: `SKILL.md`, `README.md`, `assets/fix-plan-report-template.md`, `evals/evals.json` (TC-001…TC-013) y tres fixtures en `examples/` (`example-con-hallazgos`, `example-coherente`, `example-solo-testcases`).
- El gate lee `verdict` del frontmatter de `analyze.md` (contrato de STORY-138) y acepta `veredict` como alias, porque el `analyze.md` de STORY-138 usa esa grafía.
- `fix-plan-report.md` termina en `-report.md` para que `memory-system` lo excluya del índice sin cambios en ese skill.
- Los evals no se ejecutaron: `npm run test:eval -- story-fix-plan` queda a criterio humano.
