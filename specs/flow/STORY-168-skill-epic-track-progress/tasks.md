---
alwaysApply: false
type: tasks
id: STORY-168
slug: STORY-168-skill-epic-track-progress-tasks
title: "Tasks: Skill epic-track-progress"
status: PLAN
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
story: STORY-168
design: STORY-168
created: 2026-10-29
updated: 2026-10-29
related:
  - STORY-168-skill-epic-track-progress
---

<!-- Referencias -->
[[STORY-168-skill-epic-track-progress]]

## 1. Scaffolding

- [x] T001 Invocar `skill-master` para crear el skill `epic-track-progress` en `skills/epic-track-progress/` con solo `SKILL.md`, `references/` y `evals/`: sin `assets/`, `scripts/` ni `README.md` (nunca en los destinos de runtime `.claude/`, `.codex/`, `.agents/`) (D-1, Componentes) // CS-12, CNF-5

## 2. SKILL.md (componente central)

- [x] T002 Escribir el frontmatter de `skills/epic-track-progress/SKILL.md`: `name: epic-track-progress`, `description: >-` en español ≤ 350 caracteres con disparadores «epic-track-progress», «progreso de la épica», «historias terminadas», «semáforo de épica»; sin claves fuera de `name`, `description`, `allowed-tools`, `license` (Interfaces) // CS-12, CNF-5
- [x] T003 Escribir el Objetivo (semáforo de solo lectura de la fase `DEVELOP`, gate `all stories done?`), «Qué hace / Qué NO hace» con los Non-Goals de design.md (no cambia estados, no valida evidencia, no reporta hallazgos de índice → `/epic-analyze`) y la regla de solo lectura: el skill no escribe ningún archivo, ni en `.tmp/` (D-7) // CNF-1, AC-2
- [x] T004 Escribir la regla de contenido untrusted: de los `story.md` solo se leen los escalares `parent`, `status` y `substatus` del frontmatter, nunca el cuerpo; de `epic.md`, solo `title` y las líneas `- ` de `## Historias`; texto con apariencia de orden no se sigue; los valores citados en la tabla van en código en línea (D-8) // AC-1, CNF-4
- [x] T005 Escribir el Paso 0 con `<!-- SDDF-FIXED-LAYOUT: v1 -->` y la resolución de solo `REPO_ROOT` (mismo bloque que `skills/epic-analyze/SKILL.md`), sin `SDDF_ROOT` ni `SPECS_BASE` // CNF-3
- [x] T006 Escribir el Paso 1 (resolver épica): argumento `EPIC-NN`, nombre de directorio o ruta; sin argumento → preguntar el ID; glob `specs/flow/<EPIC-NN>-*/epic.md` (guion obligatorio, nunca `archive/`); 0 coincidencias o directorio sin `epic.md` → `❌ No se encontró la épica <arg>: no existe specs/flow/<arg>-*/epic.md` y fin sin tabla; varias → listar candidatas y error; registrar `EPIC_DIR`, `EPIC_ID` y `title` (F4) // AC-4
- [x] T007 Escribir el Paso 2: cargar `references/story-sources.md` (único punto del flujo que lo referencia) y aplicar la Vía A (índice F1/F2/F3), la Vía B (inventario activo ∪ archivado, pertenencia por prefijo `EPIC-NN` de `parent`) y la unión por ID con `origen` (`índice` · `parent` · `índice + parent`) (F1, D-2, D-6) // AC-1, AC-3, CNF-2, CNF-4
- [x] T008 Escribir el Paso 3 (clasificar): la tabla cerrada de cinco filas de design.md — `DELIVER/DONE` y `COMPLETED/DONE` → `terminada`; `CANCELED/DONE` → `cancelada` (no bloquea); otro par o frontmatter sin `status`/`substatus` → `pendiente`; ID sin directorio → `pendiente` con `no encontrada`; línea F1 → `pendiente` con `planificada (sin ID)` — y la regla global: `todas terminadas` solo con ≥ 1 `terminada` y 0 `pendiente` (D-3, D-4, D-5) // AC-1, AC-2, AC-3
- [x] T009 Escribir el Paso 4 (salida en chat): encabezado `Progreso de <EPIC_ID> — <title>`; tabla `ID │ Status │ Substatus │ Ubicación │ Resultado` ordenada por `STORY-NNN` con las F1 al final; línea `✅ Todas las historias están terminadas (<n> terminadas, <m> canceladas). Siguiente paso: /epic-validate <EPIC_ID>` o `⏳ No todas las historias están terminadas: <k> pendiente(s) — <ID> (<status>/<substatus> | no encontrada | planificada), …`; notas de degradación; línea final `ℹ️ Solo lectura: no se modificó ningún archivo.` (Formato de salida, F1–F3) // AC-1, AC-2, AC-3, CNF-1
- [x] T010 Escribir la tabla de errores y degradación: épica no encontrada o ambigua (F4); `specs/flow/archive/` ausente → origen omitido sin nota; frontmatter ilegible → `—` + `pendiente` + nota `<ruta>: frontmatter ilegible`; sin `## Historias` → solo Vía B + nota `→ /epic-format-validation <EPIC_ID>`; ID duplicado activo/archivado → activa + nota (P7) // AC-3, AC-4

## 3. Reglas de cruce

- [x] T011 [P] Crear `skills/epic-track-progress/references/story-sources.md` con la cita de origen (`skills/epic-analyze/SKILL.md`, Pasos 1, 3 y 4) y las reglas: resolución de épica; parseo del índice (F2/F3 por la primera ocurrencia de `**STORY-NNN**`, `- [ ]` / `- [x]`; F1 sin checkbox ni ID con nombre hasta el primer `:`; línea no reconocida → nota); inventario `specs/flow/STORY-*/story.md` ∪ `specs/flow/archive/*-STORY-*/story.md` con ID tomado del directorio tras el prefijo de fecha; pertenencia por prefijo `EPIC-NN` (`EPIC-300-x` no cuenta para `EPIC-30`); resolución de un ID listado con guion obligatorio y prioridad activa → archivada → orden alfabético (D-2, D-6) // AC-1, AC-3, CNF-2

## 4. Evals

- [x] T012 Crear `skills/epic-track-progress/evals/evals.json` (versión `1.0.0`, formato de `skills/epic-analyze/evals/evals.json` con épica e historias descritas inline en `input`) con los casos de Contratos de verificación 1–5:
  - TC-001: 2 activas `DELIVER/DONE` + 1 archivada `COMPLETED/DONE` → `contains` `archivada`, `✅`, `/epic-validate EPIC-NN` // AC-1
  - TC-002 (SMOKE-6): una `IMPLEMENT/IN-PROGRESS` → `contains` `⏳`, su ID, `IMPLEMENT`, `Solo lectura`; `not_contains` `Siguiente paso: /epic-validate` // AC-2
  - TC-003: `STORY-200` en el índice sin directorio → `contains` `STORY-200`, `no encontrada`, `⏳` // AC-3
  - TC-004: `/epic-track-progress EPIC-77` sin directorio → `contains` `❌`, `specs/flow/EPIC-77-*/epic.md`; `not_contains` `Resultado` // AC-4
  - TC-005: una `CANCELED/DONE` y el resto `DELIVER/DONE` → `contains` `cancelada`, `✅` // AC-1 (D-3)
  - En todos los casos, `not_contains` de un archivo escrito (`report.md`, `.tmp/`) // CNF-1
- [x] T013 [P] Añadir a los inputs de TC-001 un `story.md` con `parent: EPIC-300-otra` que no debe figurar en la tabla, y a TC-002 una historia huérfana (declara `parent` sin estar en el índice) que sí debe figurar con origen `parent` (D-2, D-6) // CNF-2

## 5. Integración en el framework

- [x] T014 [P] En `docs/domains/domain-skills-map.md`, tabla `## Épica (L2)`, añadir la fila de `epic-track-progress`: momento `DEVELOP` (antes de `/epic-validate` y tras `NEEDS-CHANGES` de este), lee `epic.md` (sección con clave `historias`) y el frontmatter de los `story.md` activos y archivados, escribe `—`, cambia estado `—` (Componentes) // CS-16
- [x] T015 [P] En `docs/guides/sddf-commands-pipeline.md` §2, añadir la fila de `epic-track-progress` (input: `epic.md` + `story.md` con `parent`, incluidas las archivadas; output: tabla de progreso en el chat, sin archivos) y una nota de que resuelve el gate `all stories done?` de `DEVELOP → VALIDATE` (Componentes) // CS-16
- [x] T016 Aplicar CR-001 de design.md: en `story.md` (Notas, «Historia terminada») reemplazar «se decide al refinar esta historia» por la decisión D-3 (`CANCELED/DONE` se muestran como `cancelada` y no bloquean) y en `epic.md` (Notas, «Historia terminada (gate de `DEVELOP`)») la misma frase; dejar registrado que la aclaración de `domain-epic-lifecycle` §7 invariante 3 queda para STORY-171 (CR-001) // AC-1

## 6. Verificación

- [x] T017 Verificar `wc -l skills/epic-track-progress/SKILL.md` ≤ 150, `description` ≤ 350 caracteres y que el detalle de cruce no está duplicado en el cuerpo (solo en `references/story-sources.md`); si supera el presupuesto, mover detalle a la referencia (Contrato 8) // CNF-4, CNF-5
- [x] T018 Verificar que `SKILL.md` no contiene ninguna instrucción de escritura de archivos (grep de `Write`, `escribe`, `guarda`, `.tmp/`, `.bak` fuera de la regla de solo lectura) (Contrato 7) // CNF-1
- [x] T019 Verificar que los archivos creados en `skills/epic-track-progress/` son UTF-8 sin BOM (primeros bytes ≠ `EF BB BF`)
- [x] T020 Ejecutar `node scripts/verify-fixed-layout.js` y `npm run verify:eval-inventory`; deben incluir `epic-track-progress` sin errores (Contratos 6 y 9) // CNF-3, CS-12
- [x] T021 Ejecutar `npm test` y `npm run verify:repository`; deben pasar sin errores (Contrato 10) // CS-21
- [x] T022 Ejecutar `graphify update .` para actualizar el grafo tras los cambios
- [x] T023 Registrar como pendiente de ejecución manual (criterio humano, AGENTS.md) `npm run test:eval -- epic-track-progress` (TC-001…TC-005) y el recorrido SMOKE-6 sobre una épica real con una historia `IMPLEMENT/IN-PROGRESS`, comprobando con `git status` que ningún archivo cambia // AC-1, AC-2, AC-3, AC-4
