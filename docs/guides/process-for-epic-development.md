---
type: guide
slug: process-for-epic-development
title: "El Pipeline Completo de Desarrollo de una Épica"
date: 2026-11-05
status: null
substatus: null
parent: null
related:
  - process-for-story-implement
  - sddf-commands-pipeline
  - branching-strategy-sddf-git-flow
  - state-machine
---
<!-- Referencias -->
[[process-for-story-implement]] [[sddf-commands-pipeline]] [[branching-strategy-sddf-git-flow]] [[state-machine]]

# El Pipeline Completo de Desarrollo de una Épica (Agile SDDF)

La épica recorre estos estados, y su frontmatter en `epic.md` guarda dónde está:

```text
DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED
```

Las transiciones hasta `VALIDATE` son manuales: los skills de esos pasos generan artefactos y veredictos, pero no cambian el estado de la épica. Desde `VALIDATE`, lo escriben `/epic-validate`, `/epic-ship` y `/epic-complete`.

**1. Define (Definición del Alcance)**
*   *¿Qué pasa?* Se definen el objetivo, las features, los criterios de salida y los smoke tests de la épica. **No se generan historias todavía.**
*   *Artefacto:* `epic.md` y `epic-format-validation-report.md`.
*   *Acción:* Se crea con `/epic-creation` (interactivo, sin roadmap previo) o con `/epic-from-project-plan` (desde `product/roadmap.md`). Ambos validan la forma con `/epic-format-validation`. Con `NEEDS-REFINEMENT`, se corrige con `/epic-improve` y se vuelve a validar.
*   *Estado al terminar:* `DEFINE`. Con `APPROVED`, se pasa a `PLAN` a mano.

**2. Plan (Desglose en Historias)**
*   *¿Qué pasa?* La épica se divide en historias y se comprueba que estas cubran su índice, sus criterios de salida y sus smoke tests.
*   *Artefacto:* Un `story.md` por feature, en `SPECIFY/IN-PROGRESS`, y `epic-analyze-report.md`.
*   *Acción:* Se invoca `/epic-generate-stories` y luego `/epic-analyze`. Con `NEEDS-REFINEMENT`, se corrige con `/epic-refine` y se vuelve a analizar. Lo que requiere una decisión del PO queda listado en `epic-refine-report.md` y no se escribe.
*   *Estado al terminar:* `PLAN`. Con `APPROVED`, el PO pasa la épica a `READY-FOR-DEV` a mano. El veredicto es informativo, pero `/epic-validate` volverá a exigirlo.

**3. Ready for Dev (Cola)**
*   *¿Qué pasa?* La épica está planificada y aprobada, y espera capacidad del equipo.
*   *Artefacto:* Ninguno nuevo.
*   *Acción:* Antes de activarla, se verifica que ninguna otra épica esté en `IN-PROGRESS`, porque el WIP-Limit de épicas es 1.
*   *Estado al terminar:* `DEVELOP/IN-PROGRESS`, escrito a mano.

**4. Develop (Desarrollo)**
*   *¿Qué pasa?* Cada historia recorre su propio [pipeline de implementación](process-for-story-implement.md), con un máximo de 2 historias en `IN-PROGRESS`.
*   *Artefacto:* Los artefactos de cada historia y sus commits. Con entrega `batch`, las historias se integran en la rama `epic/<epic-id>`, creada desde `main`; con `continuous`, cada una va directo a `main` (ver la [estrategia de branching](branching-strategy-sddf-git-flow.md)).
*   *Acción:* Se consulta el avance con `/epic-track-progress`, que es de solo lectura. Las historias deben estar en `DELIVER/DONE` o `COMPLETED/DONE`; las `CANCELED/DONE` no bloquean.
*   *Estado al terminar:* `VALIDATE/IN-PROGRESS`, escrito a mano cuando todas las historias terminan.

**5. Validate (Validación)**
*   *¿Qué pasa?* Se valida la épica como conjunto: historias cerradas, análisis aprobado, smoke tests, `verify:release`, DoD y suites de integración y regresión.
*   *Artefacto:* `epic-validate-report.md`.
*   *Acción:* Se invoca `/epic-validate`, que evalúa `dod-epic-validate.md`. Con `--mode` se elige el modo automático o manual, y con `--dry-run` se previsualiza sin escribir ni ejecutar comandos.
*   *Estado al terminar:*
    *   `APPROVED`: `VALIDATE/DONE`.
    *   `NEEDS-CHANGES` o `BLOCKED`: `DEVELOP/IN-PROGRESS`. Se corrigen los hallazgos de `## Veredicto` y se vuelve a validar.

**6. Ship (Liberación)**
*   *¿Qué pasa?* Se registra la liberación de la épica y se comprueba lo que el proyecto exige para publicarla.
*   *Artefacto:* `CHANGELOG.md` actualizado con la épica.
*   *Acción:* Se invoca `/epic-ship`, que exige `epic-validate-report.md` en `APPROVED` y evalúa `dod-epic-ship.md`. **Regla de oro:** el skill nunca hace commit, tag, merge, push, publicación ni despliegue; eso lo hace una persona.
*   *Estado al terminar:* `SHIP/IN-PROGRESS` al iniciar y `SHIP/DONE` solo sin bloqueos del DoD y con confirmación humana.

**7. Complete (Cierre y Archivado)**
*   *¿Qué pasa?* Se confirma que lo liberado funciona, se cierra la épica y se archiva.
*   *Artefacto:* El directorio de la épica, movido a `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`, con `completed:` y, si se conoce, `version:` en `epic.md`.
*   *Acción:* Se invoca `/epic-complete`, opcionalmente con `--version x.y.z`. Siempre pide confirmación humana y actualiza las referencias a la épica en la documentación activa.
*   *Estado al terminar:* `COMPLETED/DONE`.

> **Cancelación:** una épica `CANCELED/DONE` se archiva con `/epic-complete` y conserva su status.
