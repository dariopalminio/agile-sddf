---
alwaysApply: false
type: tasks
id: FEAT-058
slug: FEAT-058-skill-para-tasking
title: "Tasks: Skill para Tasking (story-tasking)"
story: FEAT-058-skill-para-tasking
design: FEAT-058-skill-para-tasking
created: 2026-05-07
updated: 2026-05-07
---

## 1. Scaffolding y estructura del skill

- [x] T001 Crear estructura de directorios `.claude/skills/story-tasking/` con `assets/`, `examples/input/`, `examples/output/`
- [x] T002 [P] Crear change de OpenSpec `openspec/changes/story-tasking-skill/` con `proposal.md`, `design.md`, `specs/` y `tasks.md`

## 2. SKILL.md — Núcleo del skill

- [x] T003 Escribir frontmatter YAML (`name`, `description` con triggers, `alwaysApply: false`) y sección de posicionamiento `story → design → tasks`
- [x] T004 Escribir Paso 0 (preflight), Paso 1 (resolución de parámetros con fail-fast para `design.md` y `tasks-template.md`), y manejo de idempotencia
- [x] T005 Escribir Pasos 2–4 (lectura de `story.md`, `design.md` y `tasks-template.md` dinámico)
- [x] T006 Escribir Paso 5 (derivación de tareas: IDs `T001`..., marcador `[P]`, ordenamiento por dependencias)
- [x] T007 Escribir Pasos 6–8 (completar template, guardar `tasks.md`, confirmación interactiva)

## 3. Artefactos de soporte

- [x] T008 Crear `assets/README.md` con referencia a `tasks-template.md` y nota sobre ausencia de fallback
- [x] T009 [P] Crear `examples/input/story.md` con historia de ejemplo con 3 ACs (éxito, sin datos, error)
- [x] T010 [P] Crear `examples/input/design.md` con componentes, interfaces y comportamiento ante fallos
- [x] T011 Crear `examples/output/tasks.md` mostrando 20 tareas con `T001`–`T020`, marcadores `[P]`, 5 grupos `##`

## 4. Verificación de criterios de aceptación

- [x] T012 Verificar AC-1: ejecutar `/story-tasking FEAT-058` genera `tasks.md` en `docs/specs/stories/FEAT-058-skill-para-tasking/`
- [ ] T013 [P] Verificar AC-2: al eliminar `design.md` del directorio, el error incluye sugerencia `/story-design`
- [ ] T014 [P] Verificar AC-3: al eliminar `tasks-template.md`, el error menciona la ruta faltante y no genera archivo
- [ ] T015 Verificar AC-4: el `tasks.md` generado tiene IDs `T001`..., checkboxes `- [ ]` y marcadores `[P]` donde aplica
