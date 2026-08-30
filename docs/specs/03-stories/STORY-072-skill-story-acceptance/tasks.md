---
alwaysApply: false
type: tasks
id: STORY-072
slug: STORY-072-skill-story-acceptance-tasks
title: "Tasks: Skill story-acceptance — Validación final humana de criterios de aceptación antes de DELIVER"
story: STORY-072
design: STORY-072
created: 2026-05-15
updated: 2026-05-15
status: PLANNING
substatus: IN-PROGRESS
related:
  - STORY-072-skill-story-acceptance
  - STORY-071-skill-story-verify
  - STORY-070-dod-code-review-en-story-code-review
---

<!-- Referencias -->
[[STORY-072-skill-story-acceptance]]
[[STORY-071-skill-story-verify]]

## 1. Scaffolding — Estructura de directorios del skill

- [x] 1.1 Crear directorio `.claude/skills/story-acceptance/` con los subdirectorios `assets/` y `examples/` siguiendo la estructura canónica de skills (design.md D-1, constitution.md patrón 1)

## 2. Asset — Template de acceptance-report

- [x] 2.1 Escribir `.claude/skills/story-acceptance/assets/acceptance-report-template.md` con la estructura definida en design.md D-5: frontmatter (type, story, date, validator, dod-version, session-status, final-status), sección "Resumen ejecutivo" con contadores totales/aprobados/rechazados/bloqueados, tabla "Detalle por criterio" con columnas #/Criterio/Resultado/Observaciones/Timestamp, sección "Criterios DoD ACCEPTANCE" con checklist, sección "Estado final" con texto ACCEPTANCE-APPROVED o ACCEPTANCE-BLOQUEADO, y sección "Historial de sesiones anteriores"

## 3. Core — SKILL.md

- [x] 3.1 Crear `.claude/skills/story-acceptance/SKILL.md` con el frontmatter YAML estandarizado del skill: name, description, triggers, outputs, flags aceptados (`--restart`, `--dry-run`, `--validator "<nombre>"`), referencia a skill-preflight como Paso 0 (design.md D-1, constitution.md patrón 2)
- [x] 3.2 Implementar Paso 0 en SKILL.md: invocar `skill-preflight`; si retorna entorno inválido, detener sin generar archivos (constitution.md patrón 3)
- [x] 3.3 Implementar Paso 1 en SKILL.md: resolución de `{story_id}` / `{story_path}` con glob `$SPECS_BASE/specs/stories/{story_id}-*/`; verificar existencia de `story.md`; si no se encuentra, mostrar error y detener
- [x] 3.4 Implementar Paso 2 en SKILL.md: verificar precondición de estado — `story.md` debe tener `status: VERIFY` / `substatus: DONE` **o** `status: ACCEPTANCE` / `substatus: IN-PROGRESS` (sesión en curso); si el estado no es válido, mostrar el mensaje de error del AC-4 y terminar sin modificar ningún archivo (design.md D-4)
- [x] 3.5 Implementar Paso 3 en SKILL.md: leer `story.md` y extraer todos los escenarios Gherkin como criterios numerados (AC-1, AC-2...); registrar ID, título de la historia y criterios no funcionales
- [x] 3.6 Implementar Paso 4 en SKILL.md: leer `$SPECS_BASE/policies/definition-of-done-story.md` y extraer la sección ACCEPTANCE como lista de criterios DoD; si la sección no existe, emitir el aviso del AC-5 y usar exclusivamente los criterios Gherkin extraídos en el paso 3.5 (design.md D-2)
- [x] 3.7 Implementar Paso 5 en SKILL.md: detección de sesión — verificar si existe `acceptance-report.md` en el directorio de la historia; si no existe → sesión nueva; si existe con sesión parcial → preguntar "continuar / reiniciar"; si existe con sesión completa → preguntar "reiniciar / ver resultado anterior"; flag `--restart` fuerza reinicio sin preguntar (design.md D-3, Req-8)
- [x] 3.8 Implementar actualización de frontmatter de `story.md` a `ACCEPTANCE/IN-PROGRESS` al inicio de sesión nueva o al reiniciar (design.md D-4)
- [x] 3.9 Implementar Paso 6 en SKILL.md: bucle interactivo de presentación de criterios — mostrar cada criterio uno por vez con instrucción clara; aceptar respuestas `[P] PASS`, `[F] FAIL + observación`, `[B] BLOCKED + razón`, `[Q] Salir` (guarda sesión parcial); validar que FAIL y BLOCKED incluyen texto no vacío; registrar resultado, observación y timestamp por criterio; soporte de `--dry-run` para listar criterios sin iniciar sesión (design.md D-6, AC-1, AC-2, AC-6)
- [x] 3.10 Implementar Paso 7 en SKILL.md: consolidación al completar todos los criterios — calcular totales (aprobados/rechazados/bloqueados); generar `acceptance-report.md` desde `assets/acceptance-report-template.md` completando frontmatter y todas las secciones; si ya existe un `acceptance-report.md` con sesión previa, añadir el anterior como entrada en "Historial de sesiones anteriores" sin eliminarlo (design.md D-5, D-7, Req-9)
- [x] 3.11 Implementar Paso 8 en SKILL.md: actualizar frontmatter de `story.md` según el resultado de consolidación — si todos APPROVED → `ACCEPTANCE/DONE` + mensaje "ACCEPTANCE APROBADO: historia STORY-NNN lista para DELIVER"; si ≥1 REJECTED/BLOCKED → `VERIFY/REJECTED` + mensaje "ACCEPTANCE BLOQUEADO: N criterios no aprobados. La historia regresa a VERIFY para corrección." (design.md D-4, AC-1, AC-2)
- [x] 3.12 Implementar soporte del flag `--validator "<nombre>"` en SKILL.md: si se proporciona, registrar el nombre en el campo `validator` del frontmatter de `acceptance-report.md` y en la sección "Resumen ejecutivo"; si no se proporciona, usar "no especificado" (design.md D-6, Req-9)

## 4. DoD — Agregar sección ACCEPTANCE

- [x] 4.1 Agregar sección `### Definition of Done para el estado ACCEPTANCE` en `docs/policies/definition-of-done-story.md` con los criterios de aceptación funcional que el skill leerá dinámicamente: todos los escenarios Gherkin de `story.md` verificados manualmente, criterios no funcionales validados (performance, UX, accesibilidad), `acceptance-report.md` generado con resultado final ACCEPTANCE-APPROVED, `story.md` actualizado con `status: ACCEPTANCE / substatus: DONE` (design.md D-2, Req-7)

## 5. Ejemplos

- [x] 5.1 Crear `examples/example-approved/` con: `story.md` de ejemplo en `status: VERIFY / substatus: DONE` con 2 escenarios Gherkin, `definition-of-done-story.md` de ejemplo con sección ACCEPTANCE, y `acceptance-report.md` esperado con todos los criterios APPROVED y `final-status: ACCEPTANCE-APPROVED` (AC-1, Req-11)
- [x] 5.2 [P] Crear `examples/example-rejected/` con: misma `story.md` de entrada y un `acceptance-report.md` esperado donde el segundo criterio tiene resultado REJECTED con observación, y `final-status: ACCEPTANCE-REJECTED` (AC-2, AC-6)
- [x] 5.3 [P] Crear `examples/example-partial/` con: `acceptance-report.md` de sesión parcial (1 de 2 criterios evaluados, `session-status: partial`) que simula una sesión interrumpida (AC-3, Req-8)

## 6. Verificación

- [x] 6.1 Verificar AC-1 (happy path): ejecutar `story-acceptance` sobre una historia con `status: VERIFY / substatus: DONE`, responder PASS a todos los criterios → confirmar que `acceptance-report.md` tiene `final-status: ACCEPTANCE-APPROVED` y `story.md` queda en `status: ACCEPTANCE / substatus: DONE`
- [x] 6.2 Verificar AC-2 (criterio rechazado): responder FAIL con observación en ≥1 criterio → confirmar que `acceptance-report.md` registra el criterio como REJECTED con el texto de observación, y `story.md` queda en `status: VERIFY / substatus: REJECTED`
- [x] 6.3 Verificar AC-3 (sesión interrumpida): responder [Q] después de validar el primer criterio; re-ejecutar el skill → confirmar que detecta la sesión parcial (N/M criterios), ofrece reanudar/reiniciar, y al reanudar continúa desde el criterio pendiente sin repetir los ya evaluados
- [x] 6.4 Verificar AC-4 (estado incorrecto): ejecutar el skill sobre una historia con `status: IMPLEMENT / substatus: IN-PROGRESS` → confirmar que muestra el mensaje de error con instrucción y no modifica ningún archivo (story.md ni acceptance-report.md)
- [x] 6.5 Verificar AC-5 (DoD sin sección ACCEPTANCE): ejecutar el skill apuntando a un `definition-of-done-story.md` sin sección ACCEPTANCE → confirmar que muestra el aviso correspondiente y continúa usando los criterios Gherkin de `story.md` como lista de validación
- [x] 6.6 Verificar Req-12 (no modificación de código): tras una sesión completa, confirmar que solo se modificaron `story.md` (frontmatter) y `acceptance-report.md`; ningún otro archivo del repositorio fue alterado
- [x] 6.7 Verificar idempotencia (Req-8): ejecutar el skill dos veces sobre una historia que ya tiene `acceptance-report.md` completo → confirmar que la segunda ejecución ofrece "reiniciar / ver resultado anterior" y no sobreescribe el report sin confirmación explícita
- [x] 6.8 Verificar `--dry-run`: ejecutar con el flag → confirmar que se lista la cantidad y texto de criterios a validar sin iniciar la sesión interactiva ni modificar ningún archivo
- [x] 6.9 Verificar `--validator "<nombre>"`: ejecutar con el flag → confirmar que el nombre aparece en el frontmatter (`validator:`) y en la sección "Resumen ejecutivo" del `acceptance-report.md` generado
- [x] 6.10 Verificar seguir lineamientos de `skill-master`.md y se sigue la estructura canónica de skills \skill-master\assets\skill-template.md

## 7. Correcciones de code-review

- [x] Implementar fix-directives.md
- [x] package.json
