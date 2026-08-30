---
alwaysApply: false
type: tasks
id: STORY-064
slug: STORY-064-revision-codigo-multi-agente-tasks
title: "Tasks: Skill story-code-review — revisión multi-agente aprobada"
story: STORY-064
design: STORY-064
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: IN-PROGRESS
related:
  - STORY-064-revision-codigo-multi-agente
---

<!-- Referencias -->
[[STORY-064-revision-codigo-multi-agente]]

## 1. Setup — Estructura de directorios del skill

- [x] 1.1 Crear el directorio `.claude/skills/story-code-review/` con subdirectorios `agents/`, `assets/`, `examples/`
- [x] 1.2 Ejecutar `/skill-master` para scaffoldear la estructura base del skill y generar el SKILL.md inicial antes de escribirlo manualmente

## 2. Core — SKILL.md (Orquestador)

- [x] 2.1 Escribir frontmatter YAML del skill (name, description, triggers, outputs) y sección "Posicionamiento" con el flujo en el pipeline SDD (post story-implement, pre Done)
- [x] 2.2 Escribir sección "Modos de Ejecución" (Modo manual + Modo Agent)
- [x] 2.3 Escribir "Paso 0 — Preflight": invocar `skill-preflight`, resolver SPECS_BASE
- [x] 2.4 Escribir "Paso 1 — Resolver input": resolución del directorio de la historia (ID o ruta), verificación de `story.md`, actualización de frontmatter a `CODE-REVIEW / IN-PROGRESS`
- [x] 2.5 Escribir "Paso 2 — Cargar contexto": leer `story.md`, `design.md`, `tasks.md`, `implement-report.md`, `constitution.md`, `definition-of-done-story.md`; pasar rutas a los agentes
- [x] 2.6 Escribir "Paso 3 — Preparar ejecución": limpiar `.tmp/story-code-review/` (idempotencia NF-2), crear el directorio tmp, lanzar los 3 agentes en paralelo pasando `$STORY_DIR`
- [x] 2.7 Escribir "Paso 4 — Consolidar resultados (árbitro)": leer los tres informes parciales de `.tmp/story-code-review/`, calcular `max-severity`, derivar `review-status` (approved si max-severity ∈ {LOW, ninguna})
- [x] 2.8 Escribir "Paso 5 — Generar `code-review-report.md`": leer `assets/code-review-report-template.md`, completar con hallazgos consolidados, guardar en `$STORY_DIR/code-review-report.md`
- [x] 2.9 Escribir "Paso 6 — Actualizar frontmatter `story.md`": solo si `review-status: approved`, actualizar a `status: READY-FOR-VERIFY / substatus: IN-PROGRESS`
- [x] 2.10 Escribir "Paso 7 — Mostrar resumen": tabla con review-status, severidad máxima, hallazgos por dimensión y siguiente acción sugerida

## 3. Agentes revisores

- [x] 3.1 [P] Escribir `agents/tech-lead-reviewer.agent.md`: revisa calidad de código (legibilidad, duplicación, seguridad básica) contra `constitution.md` y `definition-of-done-story.md`; escribe informe parcial a `.tmp/story-code-review/tech-lead-report.md` con formato definido en design.md D-2
- [x] 3.2 [P] Escribir `agents/product-owner-reviewer.agent.md`: verifica que cada escenario Gherkin de `story.md` tiene correspondencia directa en el código (Given → precondición, When → acción, Then → resultado); escribe a `.tmp/story-code-review/product-owner-report.md`
- [x] 3.3 [P] Escribir `agents/integration-reviewer.agent.md`: valida que los componentes implementados respetan la arquitectura de `design.md` y las convenciones de `constitution.md`; escribe a `.tmp/story-code-review/integration-report.md`

## 4. Assets — Template del reporte de salida

- [x] 4.1 Escribir `assets/code-review-report-template.md` con la estructura definida en design.md D-5: frontmatter (type, story, review-status, date, max-severity), secciones "Resumen", "Hallazgos por dimensión" (una por agente), "Decisión final"

## 5. Ejemplos de casos de uso

- [x] 5.1 [P] Crear `examples/example-approved/` con: `story.md` de muestra, `implement-report.md` ficticio de 3 archivos, y `code-review-report.md` esperado con `review-status: approved` y hallazgos LOW/ninguna
- [x] 5.2 [P] Crear `examples/example-needs-changes/` con: mismo `story.md` de muestra y `tech-lead-report.md` parcial de muestra con un hallazgo HIGH (referencia para STORY-065)

## 6. Verificación del happy path

- [x] 6.1 Preparar fixture de prueba: directorio `docs/specs/stories/STORY-000-test/` con `story.md`, `design.md` e `implement-report.md` de contenido mínimo
- [x] 6.2 Ejecutar `/story-code-review STORY-000` sobre el fixture sin hallazgos HIGH/MEDIUM → confirmar que `code-review-report.md` se genera con `review-status: approved` (AC-1)
- [x] 6.3 Confirmar que el frontmatter de `story.md` del fixture se actualiza a `status: READY-FOR-VERIFY / substatus: IN-PROGRESS` (AC-1)
- [x] 6.4 Ejecutar el skill una segunda vez sobre el mismo fixture sin cambios → confirmar que `code-review-report.md` es idéntico al anterior (NF-2 idempotencia)
- [x] 6.5 Verificar Scenario Outline AC-2: ejecutar con fixture de severidad LOW → `approved`; ejecutar con fixture sin hallazgos → `approved`; confirmar que en ningún caso se genera `fix-directives.md`
