---
alwaysApply: false
type: tasks
id: FEAT-066
slug: FEAT-066-validacion-precondiciones-revision-tasks
title: "Tasks: Skill story-code-review — validación de artefactos requeridos antes de revisar"
story: FEAT-066
design: FEAT-066
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: IN-PROGRESS
related:
  - FEAT-066-validacion-precondiciones-revision
  - FEAT-064-revision-codigo-multi-agente
---

<!-- Referencias -->
[[FEAT-066-validacion-precondiciones-revision]]
[[FEAT-064-revision-codigo-multi-agente]]

## 1. Core — Validación de precondiciones en SKILL.md

- [x] 1.1 Añadir sección `## Artefactos requeridos` en `.claude/skills/story-code-review/SKILL.md` que liste explícitamente los tres artefactos requeridos (`story.md`, `design.md`, `implement-report.md`) con la justificación de cada uno tomada de design.md D-4; esta sección actúa como registro de la lista editable (design.md Risks)
- [x] 1.2 Unificar la verificación de `story.md` existente en el Paso 1 de SKILL.md con las nuevas verificaciones de `design.md` e `implement-report.md` en un único bloque all-at-once, eliminando la verificación individual previa para evitar duplicación (design.md D-1, D-2)
- [x] 1.3 Implementar la lógica all-at-once en el bloque de validación: iterar los tres artefactos requeridos, acumular todos los faltantes en una lista y, si la lista no está vacía, emitir el mensaje de error y detener la ejecución sin continuar al siguiente paso (design.md D-2)
- [x] 1.4 Implementar el formato exacto del mensaje de error: línea cabecera `❌ Artefactos requeridos no encontrados en: <$STORY_DIR>/`, lista de archivos faltantes como viñetas `· <nombre-archivo>`, e instrucción `Completa los artefactos faltantes y vuelve a ejecutar /story-code-review <FEAT-NNN>` (design.md D-3)
- [x] 1.5 Desplazar la instrucción de actualización del frontmatter de `story.md` a `CODE-REVIEW / IN-PROGRESS` para que aparezca en SKILL.md únicamente después del bloque de validación (si la validación pasa), garantizando que ningún archivo se modifica cuando hay faltantes (design.md D-1, D-5)

## 2. Ejemplos

- [x] 2.1 [P] Crear `examples/example-missing-artifacts/` con un directorio de historia de prueba que contenga solo `story.md` (sin `design.md` ni `implement-report.md`) y un archivo `expected-output.md` con el mensaje de error esperado listando ambos faltantes (AC-2, NF-1)
- [x] 2.2 [P] Crear `examples/example-all-artifacts-present/` con los tres artefactos requeridos mínimos y documentar que el skill procede al Paso 2 sin error de precondición (AC-1); puede referenciar o reutilizar el fixture `FEAT-000-test` de FEAT-064

## 3. Verificación

- [x] 3.1 Preparar o ampliar el fixture `docs/specs/stories/FEAT-000-test/` eliminando `design.md` e `implement-report.md` (conservar solo `story.md`) para simular el escenario de artefactos ausentes
- [x] 3.2 Ejecutar `/story-code-review FEAT-000` sobre el fixture → confirmar que el mensaje de error lista `design.md` e `implement-report.md` como faltantes en una única salida (AC-2, NF-1)
- [x] 3.3 Verificar que el frontmatter de `story.md` del fixture no fue modificado tras el error: su `status` y `substatus` deben ser idénticos a los valores previos a la ejecución (design.md D-5, AC-2)
- [x] 3.4 Verificar que no se creó `.tmp/story-code-review/` ni ningún archivo de output parcial (`code-review-report.md`, `fix-directives.md`) en el directorio de la historia cuando la validación falla (AC-2)
- [x] 3.5 Restaurar los tres artefactos requeridos en el fixture (`story.md`, `design.md`, `implement-report.md`) → ejecutar `/story-code-review FEAT-000` → confirmar que la validación pasa y el skill actualiza el frontmatter y lanza los agentes (AC-1)
- [x] 3.6 Verificar casos parciales: (a) ejecutar con solo `design.md` ausente → mensaje lista únicamente `design.md`; (b) ejecutar con solo `implement-report.md` ausente → mensaje lista únicamente `implement-report.md`; (c) ejecutar con los tres ausentes → mensaje lista los tres — confirmar NF-1 en cada caso (AC-2, NF-1)
