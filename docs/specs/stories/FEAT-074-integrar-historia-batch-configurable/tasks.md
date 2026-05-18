---
type: tasks
id: FEAT-074
slug: FEAT-074-integrar-historia-batch-configurable-tasks
title: "Tasks: story-integrate — Integración batch configurable de historias"
story: FEAT-074
design: FEAT-074
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-074-integrar-historia-batch-configurable
---

[[FEAT-074-integrar-historia-batch-configurable]]

## 1. Setup / Scaffolding

- [ ] T001 Crear estructura de directorios `.claude/skills/story-integrate/` con subdirectorios `assets/` y `examples/`

## 2. Core Skill — SKILL.md

- [ ] T002 Escribir frontmatter YAML del skill (name, description, triggers, outputs, invocable: true)
- [ ] T003 Escribir Paso 0 — invocación de `skill-preflight` con detención si entorno inválido
- [ ] T004 Escribir Paso 1 — resolución de parámetros: verificar `--story-id`, glob del directorio historia, verificar existencia de `story.md` y estado `READY-FOR-INTEGRATE`
- [ ] T005 Escribir Paso 2 — lectura de `integration-config.yaml` con error orientativo si no existe (indicar ruta esperada y sugerir usar el template de assets)
- [ ] T006 Escribir Paso 3 — resolución de versión: leer `.release-version` en raíz del proyecto; fallback al campo `version` en `integration-config.yaml`; error si ninguno resuelve
- [ ] T007 Escribir Paso 4 — cálculo de ramas: expandir `source-branch-pattern` y `target-branch-pattern` de la config reemplazando `{story-id}` y `{version}`; aplicar sanitización de placeholders (rechazar si contienen `;`, `|`, `&`, `` ` ``, `$(`, `>`)
- [ ] T008 Escribir Paso 5 — verificación de PR existente: ejecutar comando `check-pr` de la config con placeholders expandidos; parsear JSON output de `gh pr list` para detectar PR abierto con mismo head/base
- [ ] T009 Escribir Paso 6 — creación de PR (solo si Paso 5 no detectó PR): ejecutar comando `create-pr` de la config; extraer `pr-number` y `pr-url` del output; registrar internamente
- [ ] T010 Escribir Paso 7 — merge del PR: ejecutar comando `merge-pr` de la config con `{pr-number}` expandido; extraer `commit-hash` del output
- [ ] T011 Escribir Paso 8 — actualización de `story.md`: añadir bloque `integration:` al frontmatter con `target-branch`, `source-branch`, `pr-number`, `pr-url`, `commit-hash`, `integrated-at`; actualizar `status: INTEGRATED` / `substatus: DONE`
- [ ] T012 Escribir lógica de sanitización de placeholders como función reutilizable dentro del SKILL.md (regex `^[a-zA-Z0-9/\-.]+$` contra cada valor de placeholder antes de expansión)
- [ ] T013 Verificar seguir lineamientos de `skill-creator`.md y se sigue la estructura canónica de skills \skill-creator\assets\skill-template.md

## 3. Assets

- [ ] T014 Crear `assets/integration-config-template.yaml` con schema completo del modelo `batch`: campos `delivery-model`, `version-source`, `batch.source-branch-pattern`, `batch.target-branch-pattern`, `batch.commands.create-pr`, `batch.commands.check-pr`, `batch.commands.merge-pr`; incluir comentarios explicativos para cada campo y lista de placeholders permitidos

## 4. Examples

- [ ] T015 [P] Crear `examples/example-integration-config.yaml` con configuración concreta para un proyecto GitHub que usa `gh` CLI: comandos reales de `gh pr create`, `gh pr list --json`, `gh pr merge`
- [ ] T016 [P] Crear `examples/example-input.md` documentando: escenario de historia `FEAT-042` en `READY-FOR-INTEGRATE`, contenido de `.release-version`, config usada, output esperado en story.md (frontmatter integration + status INTEGRATED)

## 5. Verificación de criterios de aceptación

- [ ] T017 Verificar AC-1 — revisar que SKILL.md cubre el flujo completo: lee `.release-version` → construye ramas → ejecuta `check-pr` → ejecuta `create-pr` → ejecuta `merge-pr` → actualiza story.md con todos los campos de IntegrationResult → status INTEGRATED
- [ ] T018 Verificar AC-2 — revisar que SKILL.md cubre idempotencia: cuando `check-pr` retorna PR existente, el paso `create-pr` se omite y el flujo continúa con `merge-pr` sobre el PR detectado; el output muestra "PR existente detectado: #N — URL"
- [ ] T019 Verificar AC-R — confirmar que SKILL.md no contiene comandos `git` ni `gh` literales hardcodeados; todos los comandos se leen de `integration-config.yaml` en tiempo de ejecución
- [ ] T020 Verificar seguridad — confirmar que la sanitización de placeholders rechaza valores con caracteres de inyección shell; revisar los contratos de verificación CRV-6 del design.md
