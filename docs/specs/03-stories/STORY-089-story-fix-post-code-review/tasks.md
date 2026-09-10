---
alwaysApply: false
type: tasks
id: STORY-089
slug: STORY-089-story-fix-post-code-review-tasks
title: "Tasks: Ciclo de corrección con dueño tras un code review rechazado"
story: STORY-089
design: STORY-089
created: 2026-09-10
updated: 2026-09-10
related:
  - STORY-089-story-fix-post-code-review
---

<!-- Referencias -->
[[STORY-089-story-fix-post-code-review]]

## 1. Scaffolding del skill `story-fix`

- [ ] 1.1 Crear el directorio del skill `.claude/skills/story-fix/` con los subdirectorios `assets/`, `examples/` y `evals/` (patrón estructural 1). [ref: design D-7, D-8; AC-5]
- [ ] 1.2 [P] Crear `.claude/skills/story-fix/assets/fix-report-template.md`: frontmatter (`type: fix-report`, `story`, `date`, campos de resumen), sección "Resumen" (N aplicados / M omitidos / total), tabla "Resultado por hallazgo" con columnas `#`, `Archivo:Línea`, `Hallazgo`, `Resultado (aplicado/omitido)`, `Motivo`, y sección de estado final. [ref: design D-8, OQ-1; AC-2, NF-2]

## 2. Componente central: `story-fix/SKILL.md`

- [ ] 2.1 Crear `SKILL.md` con frontmatter estándar: `name: story-fix`, `description` con gatillos, y `triggers` ("story-fix", "aplicar fix-directives", "corregir hallazgos de code review", "ciclo de corrección post-rechazo"). [ref: design D-8; AC-5, AC-6]
- [ ] 2.2 Redactar secciones de contrato del SKILL.md — Objetivo, Posicionamiento, Entrada, Parámetros (`{story_id}`, `{story_path}`), Precondiciones, Dependencias (`skill-preflight`), Modos de ejecución, Restricciones/Reglas. Declarar explícitamente que NO lee ni exige `tasks.md`. [ref: design D-1, D-8 (Independencia); AC-4]
- [ ] 2.3 Especificar Paso 0 (invocar `skill-preflight`) y Paso 1 (resolución de `story_id` → `$STORY_DIR` por glob `03-stories/{id}-*`). [ref: design D-9 Pasos 0–1; AC-5]
- [ ] 2.4 Especificar Paso 2 — validación de precondiciones fail-fast **sin modificar ningún archivo**: (a) `story.md.status == CODE-REVIEW` **y** `substatus == NEEDS-CHANGES`; (b) `fix-directives.md` existe. Si alguna falla, emitir mensaje que nombra la precondición incumplida, el estado real encontrado y el skill sugerido. [ref: design D-8, D-9 Paso 2; AC-3]
- [ ] 2.5 Especificar Paso 3 (leer tabla "Instrucciones de corrección" de `fix-directives.md`) y Paso 4 (iterar filas: extraer `Archivo:Línea`; si el archivo no existe → registrar "omitido — archivo no encontrado" y continuar sin abortar; si existe → aplicar `Acción requerida` y registrar "aplicado"). [ref: design D-4, D-9 Pasos 3–4; AC-2, NF-2]
- [ ] 2.6 Especificar Paso 5 (generar `fix-report.md` desde `assets/fix-report-template.md`, una fila por hallazgo con resultado aplicado/omitido + motivo) y Paso 6 (actualizar `story.md` → `status: IMPLEMENT` / `substatus: DONE`). [ref: design D-3, D-8; AC-2]
- [ ] 2.7 Especificar Paso 7 (resumen final: N aplicados / M omitidos; sugerir reejecutar `/story-code-review <story_id>` sin edición manual de frontmatter) y documentar la idempotencia por precondición de estado (re-ejecución en `IMPLEMENT/DONE` no cumple precondición → se detiene sin reaplicar). [ref: design D-5, D-9 Paso 7; NF-3]
- [ ] 2.8 Añadir sección "Salida" (artefacto `fix-report.md` + transición de estado) y tabla "Restricciones/Reglas" con la máquina de estados de entrada/salida del skill. Incluir la nota de encoding UTF-8 sin BOM. [ref: design D-8; AC-5, AC-6]

## 3. Modificaciones al productor del traspaso (`story-code-review`)

- [ ] 3.1 Modificar `story-code-review/SKILL.md` Paso 4g.2: escribir `status: CODE-REVIEW` / `substatus: NEEDS-CHANGES` (en lugar de `READY-FOR-IMPLEMENT/DONE`). [ref: design D-6, D-10; AC-1]
- [ ] 3.2 Modificar `story-code-review/SKILL.md` Paso 4g.1: eliminar la inyección de `- [ ] Implementar fix-directives.md` en `tasks.md`; el rastro accionable pasa a ser `fix-directives.md` + el substatus. Verificar que ninguna otra parte del skill dependa de esa tarea. [ref: design D-6; AC-1, AC-4]
- [ ] 3.3 Modificar `story-code-review/SKILL.md` Paso 7 (mensaje final needs-changes): indicar "Ejecuta `/story-fix <story_id>`" como paso siguiente y eliminar la instrucción de reejecutar `/story-code-review` como acción inmediata. [ref: design D-6, D-10; AC-1]
- [ ] 3.4 Actualizar en `story-code-review/SKILL.md` la sección "Posicionamiento" y la tabla "Restricciones/Reglas" para reflejar la salida `CODE-REVIEW/NEEDS-CHANGES` en la rama needs-changes. [ref: design D-6; AC-1, NF-1]
- [ ] 3.5 [P] Modificar `story-code-review/assets/fix-directives-template.md` sección "Ciclo de corrección": apuntar a `/story-fix <story_id>` y eliminar la mención al estado inexistente `READY-FOR-VERIFY` en ese punto. [ref: design D-6; AC-1]

## 4. Documento canónico de estados

- [ ] 4.1 Actualizar `docs/guides/state-machine.md`: en la tabla "Transiciones por skill", cambiar la salida de retroceso de `story-code-review` (needs-changes) a `CODE-REVIEW/NEEDS-CHANGES` y agregar una fila para `story-fix` (precondición `CODE-REVIEW/NEEDS-CHANGES` → salida `IMPLEMENT/DONE`). [ref: design D-2, D-6, G5; NF-1]
- [ ] 4.2 Actualizar en `docs/guides/state-machine.md` el diagrama mermaid del nivel STORY y/o la descripción para reflejar el substatus `NEEDS-CHANGES` dentro de `CODE-REVIEW` con su skill de entrada (`story-code-review`) y de salida (`story-fix`). [ref: design D-2; NF-1]

## 5. Ejemplos y evals (skill-master / patrones estructurales)

- [ ] 5.1 [P] Crear ejemplo `examples/example-fix-without-tasks/` (escenario alternativo AC-2): `story.md` en `CODE-REVIEW/NEEDS-CHANGES`, `fix-directives.md`, `testcases.md` presente y **sin** `tasks.md`; incluir el `fix-report.md` y `story.md` esperados (estado `IMPLEMENT/DONE`). [ref: design D-9; AC-2, AC-4, AC-6]
- [ ] 5.2 [P] Crear ejemplo `examples/example-precondition-error/` (escenario de error AC-3): historia fuera de `CODE-REVIEW/NEEDS-CHANGES` o sin `fix-directives.md`; incluir la salida esperada (mensaje de precondición incumplida, estado real, skill sugerido, cero archivos modificados). [ref: design D-8, D-9 Paso 2; AC-3, AC-6]
- [ ] 5.3 [P] Crear ejemplo `examples/example-missing-file-degradation/` (NF-2): `fix-directives.md` con un hallazgo cuyo archivo no existe; `fix-report.md` esperado marca ese hallazgo "omitido — archivo no encontrado" y aplica los restantes. [ref: design D-4, R1; NF-2]
- [ ] 5.4 Crear `evals/evals.json` con casos que cubran: entrega accionable tras rechazo (AC-1), corrección sin tasks.md (AC-2), error de precondición (AC-3), degradación controlada (NF-2) e idempotencia por re-ejecución (NF-3). [ref: design D-11; AC-6]

## 6. Verificación de escenarios y coherencia

- [ ] 6.1 Verificar AC-1: tras un `needs-changes` simulado, `story-code-review` deja `fix-directives.md`, `story.md` en `CODE-REVIEW/NEEDS-CHANGES` y mensaje que remite a `/story-fix` sin mencionar reejecutar `/story-code-review`. [ref: design D-6, D-10; AC-1]
- [ ] 6.2 Verificar AC-2 + AC-4: ejecutar `/story-fix` sobre el ejemplo sin `tasks.md` produce `fix-report.md`, deja `story.md` en `IMPLEMENT/DONE` y `/story-code-review` es reejecutable sin edición manual de frontmatter. [ref: design D-3, D-9; AC-2, AC-4]
- [ ] 6.3 Verificar AC-3: invocar `/story-fix` fuera de precondiciones se detiene, nombra la precondición y el estado real, no modifica archivos e indica el skill correspondiente. [ref: design D-8; AC-3]
- [ ] 6.4 Verificar NF-2 y NF-3: hallazgo con archivo inexistente se omite sin abortar el resto; re-ejecutar `/story-fix` sobre historia en `IMPLEMENT/DONE` no reaplica cambios ni degrada el estado. [ref: design D-4, D-5; NF-2, NF-3]
- [ ] 6.5 Verificar NF-1: `docs/guides/state-machine.md` refleja `CODE-REVIEW/NEEDS-CHANGES` con skill de entrada y de salida coherentes con los SKILL.md modificados/creados. [ref: design D-2, G5; NF-1]
- [ ] 6.6 Resolver CR-001 antes del cierre: confirmar/corregir la ruta de guías (`docs/guides/` vs `docs/knowledge/guides/`) en `story.md` o el diseño. [ref: design CR-001]
