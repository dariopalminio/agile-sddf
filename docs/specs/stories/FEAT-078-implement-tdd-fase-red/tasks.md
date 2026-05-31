---
alwaysApply: false
type: tasks
id: FEAT-078
slug: FEAT-078-implement-tdd-fase-red-tasks
title: "Tasks: story-implement — Fase RED: validar configuración y generar pruebas"
date: 2026-05-30
status: IMPLEMENTING
substatus: DONE
parent: EPIC-14-fabrica-de-skills
story: FEAT-078
design: FEAT-078
related:
  - FEAT-078-implement-tdd-fase-red
  - FEAT-081-implement-tdd-fase-green-refactor
  - FEAT-082-implement-tdd-modos-ejecucion
---

<!-- Referencias -->
[[FEAT-078-implement-tdd-fase-red]]

## 1. Setup — Scaffolding del skill y evals (TDD)

- [x] 1.1 Crear estructura de directorios `.claude/skills/story-implement/evals/` — D-6
- [x] 1.2 Crear `evals/evals.json` con 3 casos de prueba: happy path (config válida → tests generados → RED confirmado), skill declarado no encontrado (→ ❌ sin generar archivos), testcases.md ausente (→ ⚠️ + continúa con story.md + design.md) — D-6, Req-5 (TDD: evals antes que SKILL.md)

## 2. Configuración — Extender sddf-config.yaml

- [x] 2.1 Añadir sección `implementing` a `docs/policies/sddf-config.yaml` con `test_generators` (entradas de ejemplo: unit, e2e, eval con campos type/skill/required) y `code_generator` (skill + required) — D-1, Req-4

## 3. Implementación — SKILL.md de story-implement (Fase RED)

- [x] 3.1 Escribir el archivo `.claude/skills/story-implement/SKILL.md` con frontmatter YAML completo: name, description (con frases trigger), triggers, version 1.0.0, type delegate, input, output — D-7
- [x] 3.2 Agregar Paso 0 al SKILL.md: invocar `skill-preflight`; si retorna `✗ Entorno inválido` detener inmediatamente — Req-6
- [x] 3.3 Agregar Paso 1 al SKILL.md: leer `docs/policies/sddf-config.yaml` y extraer `implementing.test_generators`; si sección ausente o vacía emitir `[WARN]` y continuar — D-1, Req-4
- [x] 3.4 [P] Agregar Paso 2 al SKILL.md: validar existencia de cada skill declarado con Glob `.claude/skills/{skill}/SKILL.md` antes de invocar ninguno (fail-fast); emitir ❌ si required:true y no existe, [WARN] si required:false — D-2, AC-2
- [x] 3.5 [P] Agregar Paso 3 al SKILL.md: resolver inputs — priorizar testcases.md; si ausente emitir ⚠️ y usar story.md + design.md como fuentes alternativas; si ambas ausentes emitir ❌ y detener — D-3, AC-3
- [x] 3.6 Agregar Paso 4 al SKILL.md: invocar skills de generación en orden configurado (un solo nivel de delegación); pasar bundle `{story_id, testcases_path|null, story_path, design_path}`; si subagente retorna `status: error` detener la fase RED sin invocar siguientes — D-4, AC-1
- [x] 3.7 Agregar Paso 5 al SKILL.md: confirmar estado RED ejecutando `defaults.{type}.command` de sddf-config.yaml para cada tipo generado; ✅ si exit≠0 (tests fallan), ⚠️ si exit=0 (tests pasan sin código), [INFO] si no hay comando — D-5, AC-1
- [x] 3.8 Agregar Paso 6 al SKILL.md: escribir `.tmp/story-implement/red-phase-status.json` con `{story_id, generators_invoked, generators_skipped, files_generated, red_confirmed, timestamp}` — D-8
- [x] 3.9 Agregar sección de manejo de errores al SKILL.md con tabla de condiciones → mensajes → acciones para todos los casos de error identificados en D-2, D-3, D-5 — AC-1, AC-2

## 4. Verificación — Validar escenarios de los ACs

- [x] 4.1 [P] Ejecutar eval TC-1 (happy path): sddf-config.yaml con test_generators válidos y skills existentes → verificar que invoca cada subagente en orden, emite ✅ RED confirmado y escribe red-phase-status.json — AC-1
- [x] 4.2 [P] Ejecutar eval TC-2 (skill no encontrado, required:true): declarar skill inexistente con required:true → verificar ❌ con nombre del skill, ningún archivo generado, ejecución detenida — AC-2
- [x] 4.3 [P] Ejecutar eval TC-3 (testcases.md ausente): ejecutar sin testcases.md en directorio → verificar ⚠️ con mensaje correcto y continuación usando story.md + design.md — AC-3
