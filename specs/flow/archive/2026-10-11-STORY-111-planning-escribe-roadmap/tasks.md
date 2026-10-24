---
type: tasks
id: STORY-111
slug: STORY-111-planning-escribe-roadmap-tasks
title: "Tasks: project-planning escribe en product/roadmap.md y epic-from-project-plan lee de allí"
status: IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
story: STORY-111
design: STORY-111
created: 2026-10-08
updated: 2026-10-11
related:
  - STORY-111-planning-escribe-roadmap
  - STORY-111-planning-escribe-roadmap-design
---

<!-- Referencias -->
[[STORY-111-planning-escribe-roadmap]] · [[STORY-111-planning-escribe-roadmap-design]]

> Implementación ejecutada contra los contratos D-1…D-9 de `design.md`. Los detalles de alcance y evidencia viven allí y en `implement-report.md`.

## 1. Preparación y template

- [x] T001 Línea base: pruebas, inventario de evals, enlaces e integración vigente.
- [x] T002 Crear el template seed `roadmap-template.md`.
- [x] T003 Declarar el contrato de bloque de propuesta y resumen.
- [x] T004 Copiar el template byte a byte a `docs/templates/`.

## 2. project-planning

- [x] T005 Reescribir cabecera, entradas, precondiciones, dependencias y reglas.
- [x] T006 Reemplazar la precondición de proyecto por inventario de FR.
- [x] T007 Resolver template, inventario de épicas, heading y staging.
- [x] T008 Usar `product/story-map.md` como insumo opcional.
- [x] T009 Delegar al agente y validar estrictamente el staging.
- [x] T010 Añadir gate Confirmar/Cancelar.
- [x] T011 Materializar el roadmap append-only en UTF-8 sin BOM.
- [x] T012 Actualizar README de `project-planning`.

## 3. project-architect

- [x] T013 Reescribir el estado Planning para generar la propuesta en staging.
- [x] T014 Retirar rutas, IDs y retoma heredados del estado Planning.

## 4. epic-from-project-plan

- [x] T015 Usar `product/roadmap.md` como entrada con fail-fast.
- [x] T016 Parsear solo la última sección `## Propuesta (...)`.
- [x] T017 Asignar IDs desde el mayor existente y detectar slug repetido.
- [x] T018 Mapear la propuesta al template de épica, README y encoding.

## 5. Migración de templates y referencias

- [x] T019 Eliminar ambas copias de `project-plan-template.md`.
- [x] T020 Ajustar la anotación `parent` en ambos templates de épica.
- [x] T021 Actualizar la documentación de `epic-creation`.
- [x] T022 Actualizar el registro del template y su prueba de memoria.
- [x] T023 Actualizar reglas, scaffold y eval de memory-system.
- [x] T024 Actualizar sddf-init, skill-preflight y su eval.

## 6. Evals y release notes

- [x] T025 Crear los siete evals de `project-planning`.
- [x] T026 Reescribir los once evals de `epic-from-project-plan`.
- [x] T027 Retirar la exención de eval de `project-planning`.
- [x] T028 Añadir la nota breaking de STORY-111 al CHANGELOG.

## 7. Verificación

- [x] T029 Verificar ausencia del modelo de proyectos en los dos skills y Planning.
- [x] T030 Verificar templates, eliminaciones y única excepción de project-flow.
- [x] T031 Verificar precondiciones, gate y lector del roadmap.
- [x] T032 Probar el diff de inserción append-only con fixture.
- [x] T033 Ejecutar pruebas, inventario de evals, enlaces y gate determinista.
- [x] T034 Pendiente trasladado a EPIC-21: TC-007…TC-011 de `epic-from-project-plan` requieren autorización explícita para enviar prompts al runner externo.
- [x] T035 Verificar UTF-8 sin BOM y ausencia de mojibake en los archivos modificados.
