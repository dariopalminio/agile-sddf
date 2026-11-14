---
alwaysApply: false
type: story
id: STORY-186
kind: chore
slug: STORY-186-adr-de-workflows-sin-estados-buffer
title: "ADR de workflows sin estados buffer"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-029-eliminar-estados-buffer
created: 2026-11-13
updated: 2026-11-13
related:
  - EPIC-029-eliminar-estados-buffer
---
[[EPIC-029-eliminar-estados-buffer]]

# 📖 Historia: ADR de workflows sin estados buffer

**Como** mantenedor de agile-sddf que va a implementar las historias de EPIC-029  
**Quiero** un ADR aceptado que reemplace a ADR-0006 y ADR-0008 y fije los workflows sin buffers, `PLAN/DONE` como salida aprobada de la planificación de historia y de épica, el rework en `IMPLEMENT/TODO` sin estado ni substatus propios, el contrato de `fix-directives.md` con tres escritores y la ventana de compatibilidad de `READY-FOR-IMPLEMENT/DONE`  
**Para** que las demás historias de la épica implementen una sola decisión y ninguna tenga que reabrir el destino del rework, el contrato de directivas o la regla del valor legado en su `design.md`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El ADR fija los workflows y reemplaza a ADR-0006 y ADR-0008
```gherkin
Dado que ADR-0006 y ADR-0008 describen workflows con "READY-FOR-DEV" y "READY-FOR-IMPLEMENT"
Cuando el mantenedor registra el ADR de workflows sin buffers con el siguiente número "ADR-NNNN" libre
Entonces existe "docs/adr/ADR-NNNN-<slug>.md" con estado "ACCEPTED" y todas las secciones de "docs/adr/adr-template.md"
  Y fija el workflow de historia "SPECIFY → PLAN → IMPLEMENT → CODE-REVIEW → VERIFY → ACCEPTANCE → DELIVER → COMPLETED"
  Y fija el workflow de épica "DEFINE → PLAN → DEVELOP → VALIDATE → SHIP → COMPLETED", con la aprobación del PO escrita a mano como "PLAN/DONE"
  Y ADR-0006 y ADR-0008 tienen "status: SUPERSEDED" y "superseded-by" apuntando al ADR nuevo, sin ningún otro cambio
  Y "docs/adr/README.md" lista el ADR nuevo con el mismo título, estado y fecha, y muestra ADR-0006 y ADR-0008 como "SUPERSEDED"
```

### AC-2 — Escenario con datos – Contrato de fix-directives.md por gate
```gherkin
Escenario: Rechazo de cada gate
  Dado el ADR de workflows sin buffers con estado "ACCEPTED"
  Cuando se consulta qué ocurre cuando "<gate>" emite "NEEDS-CHANGES"
  Entonces la historia vuelve a "IMPLEMENT/TODO"
    Y "fix-directives.md" lleva "based-on: <reporte>"
    Y sus filas usan la dimensión "<dimensión>"
    Y "round" continúa la numeración de todas las rondas de rework de la historia
Ejemplos:
  | gate              | reporte               | dimensión                                          |
  | story-code-review | code-review-report.md | la del revisor, o DoD-CODE-REVIEW                  |
  | story-verify      | verify-report.md      | la que nombra el ADR, que no exige un test nuevo   |
  | story-acceptance  | acceptance-report.md  | requirements-coverage                              |
```

### AC-3 — Escenario alternativo – Valor legado durante la ventana de transición
```gherkin
Dado una historia con "status: READY-FOR-IMPLEMENT" y "substatus: DONE" en un proyecto actualizado a 6.0.0
Cuando se consulta la regla del valor legado del ADR
Entonces el ADR la trata como "IMPLEMENT/TODO" si existe "implement-report.md" y como "PLAN/DONE" si no existe
  Y declara la versión en la que termina la ventana de transición
  Pero no define un estado ni un substatus de rework
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Decisiones abiertas cerradas:** el ADR resuelve las cuatro «Decisiones para el ADR» de la épica: cuánto dura la ventana de transición; de dónde lee cada gate la ronda anterior (`story-code-review` borra `fix-directives.md` al aprobar y `cycle-status.json` vive en `.tmp/`, que no se versiona); el nombre de la dimensión de verify; y la lista blanca de un rechazo de aceptación, que no tiene archivo de origen.

- **CNF-2 — Alternativas descartadas:** la sección de alternativas registra, con su motivo, al menos: el rework en `PLAN/DONE`; que los ejecutores lean `verify-report.md` y `acceptance-report.md`; usar el estado como señal de rework; y clasificar el valor legado por la presencia de `fix-directives.md`.

- **CNF-3 — Registros históricos intactos:** ADR-0003 no cambia; ADR-0006 y ADR-0008 solo cambian `status` y `superseded-by`.

- **CNF-4 — Gate verde:** `npm run verify:repository` y `npm test` pasan tras añadir el ADR y su entrada en el índice.

## Fuera de alcance (Non-Goals)

- Modificar skills, documentos de dominio, requisitos, guías o ejemplos: lo hacen STORY-187 a STORY-192 y STORY-194, que implementan este ADR.
- El substatus `HUMAN-REVIEW`, un WIP configurable o un aviso de inventario para `PLAN/DONE`, y una política de planificación justo a tiempo (fuera de alcance de la épica).
- Escribir el bloque BREAKING de `CHANGELOG.md` o subir la versión a 6.0.0: lo hace `/epic-ship` y un paso humano.

## 📎 Notas / contexto adicional

- Cubre el criterio de salida **CS-1** de EPIC-029.
- El ADR es obligatorio por la constitución (decisión transversal que afecta a varios skills y restringe a las demás historias), así que esta historia va primero. A 2026-11-13, el último ADR es ADR-0021 (`guia-de-revision-review-md`), por lo que el siguiente número libre es ADR-0022.
- El contrato de `fix-directives.md` parte del actual de `story-code-review` (`skills/story-code-review/assets/fix-directives-template.md`: `based-on`, `round`, tabla de instrucciones, lista blanca y ciclo de corrección) e incluye lo que fijó EPIC-28 (ADR-0021): los hallazgos PREEXISTENTE y los `no verificado` no entran; un hallazgo fusionado entra una vez, con `Reportado por:`.
- Conserva la decisión de ADR-0008 de no tener estado ni substatus de rework: `fix-directives.md` sigue siendo la única señal de rework. Cierra la deuda que registró ADR-0008: los rechazos de verify y acceptance no producían artefactos que el ejecutor reconociera.
- Regla del valor legado: el ADR usa `implement-report.md`, no `fix-directives.md`, porque la regla basada en `fix-directives.md` clasificaba como `PLAN/DONE` los rechazos de verify y acceptance (nota «Decisiones tomadas» de la épica).
- Fuente: `.temp/propuestas-de-mejoras/mejora-016-eliminar-buffers.md` (2026-11-07).
