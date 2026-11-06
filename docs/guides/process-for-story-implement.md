---
type: guide
slug: process-for-story-implement
title: "El Pipeline Completo de Implementación de una Historia"
date: 2026-11-05
status: null
substatus: null
parent: null
related:
  - sddf-commands-pipeline
  - branching-strategy-sddf-git-flow
  - state-machine
---
<!-- Referencias -->
[[sddf-commands-pipeline]] [[branching-strategy-sddf-git-flow]] [[state-machine]]

# El Pipeline Completo de Implementación de una Historia (Agile SDDF)

La historia recorre estos estados, y cada paso corresponde a un skill que escribe el estado de `story.md`:

```text
SPECIFY → PLAN → READY-FOR-IMPLEMENT → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED
```

**1. Specify (Especificación)**
*   *¿Qué pasa?* Se define el comportamiento esperado: formato Como/Quiero/Para y criterios de aceptación en Gherkin. **No se toman decisiones técnicas todavía.**
*   *Artefacto:* `story.md`.
*   *Acción:* Se invoca `/story-specify`, que orquesta `story-creation`, `story-evaluation` (rúbrica FINVEST), `story-split` si la historia es demasiado grande y `story-refine` si necesita mejoras.
*   *Estado al terminar:* `SPECIFY/DONE`.

**2. Plan (Planificación de la Solución)**
*   *¿Qué pasa?* Se define *cómo* se va a construir la historia y se audita que el plan sea coherente con lo especificado.
*   *Artefacto:* `design.md`, `tasks.md`, `testcases.md` y `analyze.md`.
*   *Acción:* Se invoca `/story-plan`, que encadena `story-design`, `story-tasking`, `story-testcases` y `story-analyze`. Con `NEEDS-CHANGES`, se corrige con `/story-fix-plan` y se vuelve a ejecutar `/story-analyze`.
*   *Estado al terminar:* `READY-FOR-IMPLEMENT/DONE` con `APPROVED`. Con `NEEDS-CHANGES` sigue en `PLAN/IN-PROGRESS`.

**3. Implement (Implementación)**
*   *¿Qué pasa?* Se escriben las pruebas y el código siguiendo TDD (Rojo-Verde-Refactor). `READY-FOR-IMPLEMENT` funciona como cola: antes de activar la historia, se verifica que no se supere el WIP-Limit de 2 historias en `IN-PROGRESS`.
*   *Artefacto:* `implement-report.md`, `tasks.md` actualizado y commits en la rama `<kind>/<story-id>-<slug>`, creada desde `main` (entrega `continuous`) o desde la rama `epic/` activa (entrega `batch`).
*   *Acción:* Se invoca `/story-implement`, que delega en los generadores de `sddf.config.yaml › implement`, o `/story-implement-tasks`, que avanza tarea por tarea y requiere `tasks.md`. Los commits siguen Conventional Commits.
*   *Estado al terminar:* `IMPLEMENT/DONE`, tras evaluar `dod-story-implement.md`.

**4. Code Review (Revisión de Código)**
*   *¿Qué pasa?* Cuatro subagentes revisan en paralelo el código, los requisitos, la integración y la seguridad.
*   *Artefacto:* `code-review-report.md` y, si hay correcciones pendientes, `fix-directives.md`.
*   *Acción:* Se invoca `/story-code-review`. El Pull Request se abre según la [estrategia de branching](branching-strategy-sddf-git-flow.md), y `quality.yml` ejecuta el gate `verify:repository`. **Regla de oro:** en este repositorio los agentes nunca hacen push, PR ni merge; eso lo hace una persona.
*   *Estado al terminar:*
    *   `APPROVED`: `CODE-REVIEW/DONE`.
    *   `NEEDS-CHANGES`: `READY-FOR-IMPLEMENT/DONE`. Se vuelve al paso 3, que aplica `fix-directives.md`.
    *   `BLOCKED`: `IMPLEMENT/DONE`. Se repite la revisión cuando se despeje el bloqueo.

**5. Verify (Verificación)**
*   *¿Qué pasa?* Se comprueba con pruebas que la historia funciona y que no se rompió nada más. El skill detecta el modo de ejecución: delegado, automático (E2E o unitario) o manual.
*   *Artefacto:* `verify-report.md`.
*   *Acción:* Se invoca `/story-verify`, normalmente desde `CODE-REVIEW/DONE`. Desde `IMPLEMENT/DONE` también se admite, como mínimo aceptable. Con `--mode` se fuerza el modo manual o automático.
*   *Estado al terminar:*
    *   `APPROVED`: `VERIFY/DONE`.
    *   `NEEDS-CHANGES`: `READY-FOR-IMPLEMENT/DONE`. Se vuelve al paso 3.
    *   `BLOCKED`: `VERIFY/BLOCKED`. Se reintenta el paso.

**6. Acceptance (Aceptación)**
*   *¿Qué pasa?* Una persona valida la historia contra sus criterios de aceptación y decide si el valor es entregable.
*   *Artefacto:* `acceptance-report.md`.
*   *Acción:* Se invoca `/story-acceptance`, que guía la validación criterio por criterio. Una sesión interrumpida se guarda con `PENDING` y se reanuda con el mismo comando.
*   *Estado al terminar:*
    *   `APPROVED`: `ACCEPTANCE/DONE`.
    *   `NEEDS-CHANGES`: `READY-FOR-IMPLEMENT/DONE`. Se vuelve al paso 3.
    *   `BLOCKED`: `ACCEPTANCE/BLOCKED`. Se reintenta el paso.
    *   `PENDING`: `ACCEPTANCE/IN-PROGRESS`.

**7. Deliver (Entrega)**
*   *¿Qué pasa?* Se verifica el DoD de entrega y se registra que el incremento está listo para producción (`batch`) o ya desplegado (`continuous`), según `defaults.delivery-model` en `sddf.config.yaml`.
*   *Artefacto:* `CHANGELOG.md` actualizado, si el DoD lo exige. `delivery-report.md` solo se genera si se fuerza la entrega con `--force`.
*   *Acción:* Se invoca `/story-delivery`, que evalúa `dod-story-deliver.md` y pide confirmación humana. El skill no despliega nada. Con `--dry-run` se previsualiza el resultado sin escribir.
*   *Estado al terminar:* `DELIVER/DONE`.

**8. Complete (Cierre y Archivado)**
*   *¿Qué pasa?* Se cierra la historia y se archiva.
*   *Artefacto:* El directorio de la historia, movido a `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/`.
*   *Acción:* Se invoca `/story-complete`, que siempre pide confirmación humana, conserva el historial de git y actualiza las referencias a la historia en la documentación activa.
*   *Estado al terminar:* `COMPLETED/DONE`.

> **Cancelación:** una persona puede marcar `CANCELED` en cualquier estado activo; ningún skill escribe ese estado. Una historia `CANCELED/DONE` se archiva con `/story-complete` y conserva su status.
