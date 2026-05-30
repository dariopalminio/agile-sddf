---
alwaysApply: false
type: tasks
id: FEAT-079
slug: FEAT-079-story-testcases
title: "Tasks: story-testcases — generación de testcases.md desde story.md y design.md"
story: FEAT-079-story-testcases
design: FEAT-079-story-testcases-design
created: 2026-05-30
updated: 2026-05-30
related:
  - FEAT-079-story-testcases
---

<!-- Referencias -->
[[FEAT-079-story-testcases]]

## 1. Setup — Estructura de directorios del skill

- [x] T001 Crear estructura de directorios: `.claude/skills/story-testcases/` con subdirectorios `assets/`, `evals/`, `examples/input/`, `examples/output/`

## 2. RED — Evals antes del SKILL.md (ciclo TDD)

- [x] T002 Crear `evals/evals.json` con TC-001 (happy-path: story.md + design.md válidos → testcases.md con tabla correcta de columnas ID/Tipo/Escenario/Dado/Cuando/Entonces/Ref)
- [x] T003 Agregar TC-002 a `evals/evals.json` (fail-fast: story.md sin secciones de criterios de aceptación → emite ⚠️ y no genera testcases.md)
- [x] T004 [P] Agregar TC-003 a `evals/evals.json` (error-handling: story.md ausente → error limpio sin crash)
- [x] T005 [P] Agregar TC-004 a `evals/evals.json` (edge-case: testcases.md ya existe + `--force` → sobreescribe y emite `[INFO] testcases.md sobreescrito con --force`)
- [x] T006 [P] Agregar TC-005 a `evals/evals.json` (edge-case: tasks.md presente con tareas tipo "code"/"test" → columna Ref incluye entradas `T-NNN`)
- [x] T007 Crear `examples/input/story.md` con historia canónica de ejemplo que incluya al menos 3 ACs en formato Gherkin (fuente de TC-001)
- [x] T008 [P] Crear `examples/input/design.md` con diseño de ejemplo que incluya componentes UT/IT/E2E (fuente de TC-001)
- [x] T009 [P] Crear `examples/input/tasks.md` con tareas de ejemplo que incluyan al menos una de tipo "code" y una de tipo "test" (fuente de TC-005)

## 3. Template — Fuente de verdad del output

- [x] T010 Crear `assets/testcases-template.md` con: frontmatter YAML (type, id, slug, title, story, created, updated), sección "Resumen de cobertura" (tabla de conteo por tipo), sección "Tabla de casos" (columnas: ID, Tipo, Escenario, Dado, Cuando, Entonces, Ref) y sección "Notas de cobertura"

## 4. SKILL.md — Artefacto central del skill

- [x] T011 Escribir frontmatter YAML de `SKILL.md`: campos `name`, `description`, `triggers`, `version: "1.0.0"`, `type: delegate`, `input`, `output`, `invocable: true`, `alwaysApply: false` (según D-2 del diseño)
- [x] T012 Escribir secciones Objetivo, Posicionamiento en el pipeline y Entrada/Salida/Parámetros/Precondiciones en `SKILL.md`
- [x] T013 Escribir Paso 0 en `SKILL.md`: invocar skill-preflight + leer `sddf-config.yaml` y cargar referencias de `complementary_skills.plan.skills` con `type: reference`
- [x] T014 Escribir Pasos 1–1f en `SKILL.md`: resolución de story_id, directorio, verificación de story.md y design.md, idempotencia (preguntar si existe / sobreescribir con `--force`)
- [x] T015 Escribir Pasos 2–3b en `SKILL.md`: leer story.md (extraer AC-1..AC-N), leer design.md (extraer D-1..D-N y elementos estructurales), leer tasks.md opcionalmente (tareas tipo "code"/"test" → T-NNN)
- [x] T016 Escribir Paso 4 en `SKILL.md`: leer `assets/testcases-template.md` en tiempo de ejecución como fuente de verdad de la estructura de salida
- [x] T017 Escribir Paso 5 en `SKILL.md`: algoritmo de derivación de casos — tabla de clasificación (señal → prefijo), cobertura mínima por tipo (UT: happy path + error; CT: render + edge; IT: flujo positivo; API: request válido; E2E: 1-a-1 a Gherkin; EV: happy-path + fail-fast), verificación de caso AC-4 (sin ACs → ⚠️ sin generar)
- [x] T018 Escribir Pasos 6–8 en `SKILL.md`: completar template con frontmatter correcto, guardar testcases.md, mostrar confirmación en modo manual / reportar al orquestador en modo Agent
- [x] T019 Escribir sección "Manejo de errores" en `SKILL.md` con tabla de condiciones D-8: preflight falla, story.md ausente, design.md ausente, sin ACs suficientes, tasks.md ausente (no es error)

## 5. Examples — Output de referencia

- [x] T020 Crear `examples/output/testcases.md` con output esperado para TC-001: tabla completa con al menos 3 casos UT, 1 IT, 1 E2E derivados de los inputs de `examples/input/`, con Ref trazables a AC-N y D-N

## 6. Integración y registro del skill

- [x] T021 Verificar que el campo `files` en `package.json` incluye la ruta `.claude/skills/story-testcases/**` para que el skill se publique en npm
- [x] T022 Ejecutar `/skill-master` sobre el skill creado para validar estructura completa (SKILL.md, assets, evals, examples) y cumplimiento de patrones SDDF
- [x] T023 Revisar CR-002: inspeccionar `story-analyze/SKILL.md` y verificar si incluye o no validación de `testcases.md`; si no la incluye, abrir historia separada o registrar deuda técnica

## 7. Verificación de criterios de aceptación

- [x] T024 Ejecutar TC-001 con `/skill-test-evals` y verificar: testcases.md generado con tabla de columnas ID/Tipo/Escenario/Dado/Cuando/Entonces/Ref, IDs con prefijos correctos, columna Ref trazable a ACs
- [x] T025 [P] Ejecutar TC-002 y verificar: emite ⚠️ "story.md o design.md no tienen contenido suficiente" y no genera testcases.md parcial (satisface AC-4)
- [x] T026 [P] Ejecutar TC-003 y verificar: error limpio con mensaje de archivo ausente, sin crash ni stack trace (satisface precondición D-8)
- [x] T027 Ejecutar TC-004 y verificar: con `--force` sobreescribe testcases.md y emite `[INFO] testcases.md sobreescrito con --force` (satisface AC-11)
- [x] T028 [P] Ejecutar TC-005 y verificar: con tasks.md presente, columna Ref de casos derivados de tasks incluye `T-NNN` (satisface AC-3)
- [x] T029 Verificar AC-5: ejecutar skill sobre ejemplo con elementos UT/CT/IT/API/E2E/EV en design.md y confirmar que cada caso recibe el prefijo correcto según tabla D-4
- [x] T030 Verificar NFR rendimiento: tiempo de generación de testcases.md < 15 segundos para story.md con 5 ACs (verificación manual con timer)
