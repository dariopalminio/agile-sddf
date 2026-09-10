---
type: testcases
id: STORY-089
slug: STORY-089-story-fix-post-code-review-testcases
title: "Test Cases: Ciclo de corrección con dueño tras un code review rechazado"
story: STORY-089
created: 2026-09-10
updated: 2026-09-10
related:
  - STORY-089-story-fix-post-code-review
---

<!-- Referencias -->
[[STORY-089-story-fix-post-code-review]]

# Casos de Prueba: Ciclo de corrección con dueño tras un code review rechazado

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 0 |
| CT   | 0 |
| IT   | 2 |
| API  | 0 |
| E2E  | 3 |
| EV   | 8 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | El rechazo deja una entrega accionable e inequívoca | Una historia en `CODE-REVIEW/IN-PROGRESS` con al menos un hallazgo bloqueante | `/story-code-review` cierra la revisión con review-status `needs-changes` | Genera `fix-directives.md`, deja `story.md` en `CODE-REVIEW/NEEDS-CHANGES`, el mensaje final indica ejecutar `/story-fix <story_id>` y no menciona reejecutar `/story-code-review` como acción inmediata | AC-1 |
| E2E-002 | End-to-End | Corrección aplicada en una historia planificada sin tasks.md | Una historia en `CODE-REVIEW/NEEDS-CHANGES` con `fix-directives.md` presente, con `testcases.md` pero sin `tasks.md` | Ejecuto `/story-fix` sobre esa historia | Se aplican las correcciones de cada fila de `fix-directives.md` sobre los archivos indicados, se genera `fix-report.md` (aplicado/omitido+motivo), `story.md` queda en `IMPLEMENT/DONE` y `/story-code-review` es reejecutable sin edición manual de frontmatter | AC-2 |
| E2E-003 | End-to-End | Invocación fuera de las precondiciones | Invoco `/story-fix` sobre una historia que no está en `CODE-REVIEW/NEEDS-CHANGES`, o que sí lo está pero no tiene `fix-directives.md` | El skill valida sus precondiciones | Se detiene con un mensaje que nombra la precondición incumplida y el estado real encontrado, no modifica ningún archivo (historia ni código fuente) e indica el skill que corresponde ejecutar en su lugar | AC-3 |
| EV-001 | Eval | `/story-fix` happy path aplica correcciones | Historia en `CODE-REVIEW/NEEDS-CHANGES` con `fix-directives.md` cuya tabla lista N hallazgos con archivos existentes | Se ejecuta `/story-fix` | Cada `Acción requerida` se aplica en su `Archivo:Línea` y `fix-report.md` registra los N hallazgos como "aplicado" | D-4, D-9 |
| EV-002 | Eval | `/story-fix` fail-fast por estado incorrecto | Historia en un estado distinto de `CODE-REVIEW/NEEDS-CHANGES` (ej. `IMPLEMENT/DONE`) | Se ejecuta `/story-fix` | El skill se detiene en el Paso 2, nombra la precondición de estado incumplida y el estado real, y no modifica ningún archivo | AC-3, D-8 |
| EV-003 | Eval | `/story-fix` fail-fast por `fix-directives.md` ausente | Historia en `CODE-REVIEW/NEEDS-CHANGES` sin `fix-directives.md` en el directorio | Se ejecuta `/story-fix` | El skill se detiene, nombra la precondición de artefacto incumplida e indica el skill sugerido; no modifica archivos | AC-3, D-8 |
| EV-004 | Eval | Independencia de `tasks.md` | Historia en `CODE-REVIEW/NEEDS-CHANGES` con `fix-directives.md` y sin `tasks.md` en el directorio | Se ejecuta `/story-fix` | El skill completa el ciclo sin leer ni exigir `tasks.md` en ninguna rama | AC-4, D-1, D-8 |
| EV-005 | Eval | Degradación controlada ante archivo inexistente | `fix-directives.md` con un hallazgo cuyo `Archivo:Línea` apunta a un archivo que no existe, junto a otros hallazgos válidos | Se ejecuta `/story-fix` | El hallazgo se marca "omitido — archivo no encontrado" en `fix-report.md`, los hallazgos restantes se aplican y el skill no aborta | NF-2, D-4, R1 |
| EV-006 | Eval | Idempotencia por precondición de estado | Historia ya corregida en `IMPLEMENT/DONE` (post `/story-fix`) | Se reejecuta `/story-fix` sobre la misma historia | El skill no cumple la precondición `CODE-REVIEW/NEEDS-CHANGES`, se detiene sin reaplicar cambios ni degradar el estado alcanzado | NF-3, D-5 |
| EV-007 | Eval | `story-code-review` produce el nuevo contrato de traspaso | Revisión que resuelve `needs-changes` con hallazgos bloqueantes | Finaliza `/story-code-review` | `story.md` queda en `CODE-REVIEW/NEEDS-CHANGES`, no se inyecta la tarea `Implementar fix-directives.md` en `tasks.md` y el mensaje final remite a `/story-fix` | AC-1, D-6, D-10 |
| EV-008 | Eval | Salida de estado a `IMPLEMENT/DONE` | Ejecución exitosa de `/story-fix` con al menos una corrección aplicada | Finaliza el Paso 6 | `story.md` queda en `status: IMPLEMENT` / `substatus: DONE` | AC-2, D-3 |
| IT-001 | Integration | Handoff `story-code-review` → `story-fix` | `story-code-review` dejó `fix-directives.md` y `story.md` en `CODE-REVIEW/NEEDS-CHANGES` | Se ejecuta `/story-fix` a continuación | `/story-fix` reconoce el estado y el artefacto como precondiciones válidas y procede a aplicar correcciones | AC-1, AC-2, D-2 |
| IT-002 | Integration | Reentrada `story-fix` → `story-code-review` | `/story-fix` dejó `story.md` en `IMPLEMENT/DONE` | Se reejecuta `/story-code-review <story_id>` | La revisión arranca sin requerir edición manual de frontmatter (precondición `IMPLEMENT/DONE` satisfecha) | AC-2, D-3 |

## Notas de cobertura

- **Tipo predominante EV:** el "código de producción" de este repositorio son skills (`sddf.config.yaml`: `layer: monolithic`), por lo que la validación de comportamiento se modela como casos Eval (skill como sujeto de validación) además de los E2E trazables a los escenarios Gherkin.
- **Trazabilidad E2E 1-a-1:** E2E-001/002/003 corresponden respectivamente al escenario principal (AC-1), alternativo (AC-2) y de error (AC-3) de `story.md`.
- **NF cubiertos:** NF-1 (trazabilidad de `NEEDS-CHANGES` en `state-machine.md`) se valida documentalmente en tasks 4.1/4.2 y task de verificación 6.5; no genera caso ejecutable EV/E2E porque es coherencia de documentación, no comportamiento de skill. NF-2 → EV-005; NF-3 → EV-006.
- **`tasks.md` como fuente opcional:** se usó `tasks.md` para confirmar la cobertura de verificación (grupo 6) y la independencia de planificación (EV-004), pero ninguna tarea introdujo casos técnicos UT/IT adicionales más allá de los derivados de `design.md`.
- **Gap consciente:** no se generan casos UT/CT/API porque el diseño no introduce funciones de dominio, componentes UI ni endpoints REST; todos los componentes son artefactos de skills/documentación.
- **Pendiente de OQ-2:** el comportamiento ante `fix-directives.md` con tabla vacía (transicionar vs. detener) no tiene caso aún; añadir tras resolver la Open Question en `design.md`.

## Test Cases Progress for STORY-089

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
- [ ] E2E-001: El rechazo deja una entrega accionable e inequívoca
- [ ] E2E-002: Corrección aplicada en una historia planificada sin tasks.md
- [ ] E2E-003: Invocación fuera de las precondiciones
- [ ] EV-001: `/story-fix` happy path aplica correcciones
- [ ] EV-002: `/story-fix` fail-fast por estado incorrecto
- [ ] EV-003: `/story-fix` fail-fast por `fix-directives.md` ausente
- [ ] EV-004: Independencia de `tasks.md`
- [ ] EV-005: Degradación controlada ante archivo inexistente
- [ ] EV-006: Idempotencia por precondición de estado
- [ ] EV-007: `story-code-review` produce el nuevo contrato de traspaso
- [ ] EV-008: Salida de estado a `IMPLEMENT/DONE`
- [ ] IT-001: Handoff `story-code-review` → `story-fix`
- [ ] IT-002: Reentrada `story-fix` → `story-code-review`
