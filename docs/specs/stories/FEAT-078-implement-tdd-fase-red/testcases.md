---
type: testcases
id: FEAT-078
slug: FEAT-078-implement-tdd-fase-red-testcases
title: "Test Cases: story-implement — Fase RED: validar configuración y generar pruebas"
story: FEAT-078
created: 2026-05-30
updated: 2026-05-30
related:
  - FEAT-078-implement-tdd-fase-red
---

<!-- Referencias -->
[[FEAT-078-implement-tdd-fase-red]]

# Casos de Prueba: story-implement — Fase RED

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | 11 |
| CT   | 0 |
| IT   | 3 |
| API  | 0 |
| E2E  | 3 |
| EV   | 2 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| UT-001 | Unit | Leer test_generators válidos de sddf-config.yaml | sddf-config.yaml tiene sección `implementing.test_generators` con entradas unit, e2e, eval | El skill lee la sección | Retorna lista ordenada de entradas con fields type, skill, required | D-1 |
| UT-002 | Unit | Sección implementing ausente en sddf-config.yaml | sddf-config.yaml existe pero no tiene sección `implementing` | El skill intenta leer test_generators | Emite `[WARN] No hay test_generators configurados` y retorna lista vacía sin detener la ejecución | D-1 |
| UT-003 | Unit | Validación de skills — todos existen | sddf-config.yaml declara skills unit, e2e, eval cuyos directorios existen en .claude/skills/ | El skill ejecuta la validación previa | Retorna lista validada completa sin errores ni advertencias | D-2, AC-1 |
| UT-004 | Unit | Validación fail-fast — skill required:true no encontrado | sddf-config.yaml declara skill `story-test-inexistente` con required:true y el directorio no existe | El skill ejecuta la validación previa | Emite `❌ Skill 'story-test-inexistente' declarado en sddf-config.yaml no encontrado en .claude/skills/` y retorna error sin continuar | D-2, AC-2 |
| UT-005 | Unit | Validación permisiva — skill required:false no encontrado | sddf-config.yaml declara skill inexistente con required:false | El skill ejecuta la validación previa | Emite `[WARN]` con nombre del skill, excluye la entrada de la lista de invocación y continúa | D-2 |
| UT-006 | Unit | Resolución de inputs — testcases.md existe | testcases.md, story.md y design.md existen en el directorio de la historia | El skill resuelve los inputs | Retorna testcases.md como fuente primaria sin emitir advertencias | D-3, AC-1 |
| UT-007 | Unit | Fallback a story.md + design.md cuando testcases.md ausente | story.md y design.md existen pero testcases.md no está en el directorio | El skill resuelve los inputs | Emite `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` y retorna rutas alternativas | D-3, AC-3 |
| UT-008 | Unit | Error cuando no hay artefactos de especificación | testcases.md, story.md y design.md están ausentes | El skill resuelve los inputs | Emite `❌ Artefactos de especificación insuficientes` y detiene la ejecución | D-3 |
| UT-009 | Unit | Confirmación RED — tests fallan (exit≠0) | El skill de generación de tipo unit produjo archivos de prueba; `defaults.unit.command` está configurado y devuelve exit code 1 | El skill ejecuta el comando de confirmación | Emite `✅ Tests en estado rojo (fallan correctamente) — tipo: unit` | D-5, AC-1 |
| UT-010 | Unit | Confirmación RED — tests pasan sin código (exit=0) | El skill generó archivos de prueba pero `defaults.unit.command` devuelve exit code 0 | El skill ejecuta el comando de confirmación | Emite `⚠️ Los tests PASAN sin implementación — verificar que los tests sean correctos` | D-5, AC-1 |
| UT-011 | Unit | Confirmación RED omitida — sin comando configurado | Tipo de prueba generado no tiene `command` en `defaults` de sddf-config.yaml | El skill intenta confirmar estado RED | Emite `[INFO] Sin comando configurado para tipo '<tipo>' — confirmación de RED omitida` y no bloquea la ejecución | D-5 |
| IT-001 | Integration | Orquestador invoca subagente de generación exitosamente | sddf-config.yaml declara skill `story-test-unit-jest` con required:true; el skill existe | story-implement invoca story-test-unit-jest pasando bundle de inputs | El subagente retorna `{status: ok, files_generated: [...]}` y el orquestador continúa con el siguiente tipo | D-4, AC-1 |
| IT-002 | Integration | Orquestador detiene RED cuando subagente falla | El skill de generación tipo e2e retorna `{status: error, message: "..."}` | story-implement procesa la respuesta del subagente | El orquestador no invoca los subagentes siguientes, emite el error recibido y detiene la Fase RED | D-4 |
| IT-003 | Integration | Escritura de red-phase-status.json en .tmp/ | La Fase RED completó la invocación de todos los subagentes | El skill escribe el estado de la fase | `.tmp/story-implement/red-phase-status.json` existe con campos story_id, generators_invoked, generators_skipped, files_generated, red_confirmed y timestamp | D-8 |
| E2E-001 | End-to-End | Fase RED exitosa — flujo completo | story.md, design.md y testcases.md existen; sddf-config.yaml declara test_generators con skills existentes en .claude/skills/ | El practitioner invoca `story-implement FEAT-078` | El skill valida config, invoca cada skill de generación en orden, genera archivos de prueba en código productivo, ejecuta tests y emite ✅ confirmando estado rojo | AC-1 |
| E2E-002 | End-to-End | Skill declarado no encontrado — detiene sin generar archivos | sddf-config.yaml declara `story-test-unit-jest` con required:true y el directorio `.claude/skills/story-test-unit-jest/` no existe | El practitioner invoca `story-implement FEAT-078` | El skill emite `❌ Skill 'story-test-unit-jest' declarado en sddf-config.yaml no encontrado en .claude/skills/`, no genera ningún archivo y detiene la ejecución | AC-2 |
| E2E-003 | End-to-End | testcases.md ausente — continúa con story.md y design.md | story.md y design.md existen; testcases.md no existe en el directorio de la historia | El practitioner invoca `story-implement FEAT-078` | El skill emite `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` y continúa la Fase RED usando esas fuentes, sin bloquear la ejecución | AC-3 |
| EV-001 | Eval | Happy-path del skill story-implement | Entorno SDDF válido (preflight OK); sddf-config.yaml con test_generators configurados; artefactos de especificación presentes | Se ejecuta `/story-implement FEAT-078` completo | El skill completa la Fase RED: genera archivos de prueba, confirma estado rojo y escribe red-phase-status.json; no emite errores bloqueantes | AC-1, D-4, D-8 |
| EV-002 | Eval | Fail-fast del skill — entorno inválido | skill-preflight retorna `✗ Entorno inválido` (SDDF_ROOT apunta a ruta inexistente) | Se ejecuta `/story-implement FEAT-078` | El skill detiene inmediatamente sin generar ningún artefacto ni modificar ningún archivo | Req-6 |

## Notas de cobertura

- **tasks.md usado:** los casos UT-003..UT-011 y IT-001..IT-003 refuerzan la cobertura de las tareas 3.4, 3.5, 3.6, 3.7, 3.8 respectivamente.
- **CT=0, API=0:** el skill no tiene componentes UI ni endpoints REST; clasificación correcta.
- **Sin Scenario Outline en story.md:** los 3 escenarios Gherkin generan exactamente 3 casos E2E (1-a-1).
- **Gap de cobertura aceptado:** no se cubre el caso donde `sddf-config.yaml` no existe en absoluto (UT-002 cubre "sección ausente"; el caso "archivo ausente" se delega a skill-preflight que gestiona la validación de entorno).
- **Cobertura mínima EV verificada:** EV-001 cubre happy-path, EV-002 cubre fail-fast.
