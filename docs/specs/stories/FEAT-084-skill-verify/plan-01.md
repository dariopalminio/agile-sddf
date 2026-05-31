# Plan: Crear el skill skill-verify

## Context

skill-verify es el skill que ejecuta los casos de prueba TC-NNN definidos en evals/evals.json de un skill y devuelve un informe detallado de resultados pass/fail. Completa el par simétrico con skill-test-evals (que genera los evals):

skill-test-evals  →  genera evals/evals.json  (fase RED: define qué debe cumplir el skill)
skill-verify      →  ejecuta evals/evals.json  (fase de validación: comprueba que el skill cumple)
No existe todavía en el proyecto. story-verify es un skill distinto (verifica historias de usuario, no skills).

## Archivos a crear / modificar

Archivo	Tipo
.claude/skills/skill-verify/evals/evals.json	Nuevo — casos TC-NNN del propio skill-verify (TDD first)
.claude/skills/skill-verify/assets/report-template.md	Nuevo — template del informe de resultados
.claude/skills/skill-verify/SKILL.md	Nuevo — definición del skill
package.json	Modificar — añadir .claude/skills/skill-verify al array files
.claude/skills/skill-master/SKILL.md	Modificar — añadir modo evals que delega a skill-verify

## Paso 0 — TDD: crear evals/evals.json ANTES del SKILL.md
Según el principio TDD del proyecto (constitution.md §11 y references/tdd-workflow.md): los evals se crean antes del SKILL.md.

Crear .claude/skills/skill-verify/evals/evals.json con 5 casos:

{
  "skill": "skill-verify",
  "version": "1.0.0",
  "description": "Casos de prueba para skill-verify: ejecución de evals TC-NNN contra un skill y generación de informe",
  "cases": [
    {
      "id": "TC-001",
      "name": "happy-path-todos-los-casos-pasan",
      "type": "happy-path",
      "description": "evals.json válido con 2 casos, ambos pasan → informe con pass_rate 100%, tabla con ✅ en cada fila",
      "input": {
        "skill_name": "skill-test",
        "evals_present": true,
        "evals_format": "sddf",
        "cases_count": 2,
        "all_cases_pass": true
      },
      "expected": {
        "contains": ["✅", "100%", "TC-001", "TC-002", "PASS"],
        "not_contains": ["❌", "FAIL", "no encontrado"]
      },
      "threshold": 0.95
    },
    {
      "id": "TC-002",
      "name": "fail-fast-skill-no-encontrado",
      "type": "fail-fast",
      "description": "El skill indicado no existe en .claude/skills/ → ❌ con mensaje exacto indicando la ruta esperada",
      "input": {
        "skill_name": "skill-inexistente-xyz"
      },
      "expected": {
        "contains": ["❌", "skill-inexistente-xyz", "no encontrado"],
        "not_contains": ["✅", "PASS", "pass_rate"]
      },
      "threshold": 1.0
    },
    {
      "id": "TC-003",
      "name": "fail-fast-evals-json-ausente",
      "type": "fail-fast",
      "description": "El skill existe pero no tiene evals/evals.json → ❌ con sugerencia de ejecutar skill-test-evals",
      "input": {
        "skill_name": "skill-sin-evals",
        "skill_present": true,
        "evals_present": false
      },
      "expected": {
        "contains": ["❌", "evals/evals.json", "skill-test-evals"],
        "not_contains": ["✅", "PASS", "pass_rate"]
      },
      "threshold": 1.0
    },
    {
      "id": "TC-004",
      "name": "error-handling-formato-trigger-evals",
      "type": "error-handling",
      "description": "evals.json es formato trigger (array con query/should_trigger, no cases[]) → ❌ explicando que ese formato es para optimización de descripción, no para verificación",
      "input": {
        "skill_name": "skill-test",
        "evals_present": true,
        "evals_format": "trigger"
      },
      "expected": {
        "contains": ["❌", "trigger", "skill-test-evals"],
        "not_contains": ["✅", "PASS", "pass_rate"]
      },
      "threshold": 1.0
    },
    {
      "id": "TC-005",
      "name": "edge-case-algunos-casos-fallan",
      "type": "edge-case",
      "description": "evals.json con 3 casos, 2 pasan y 1 falla → informe con pass_rate 66%, tabla con ✅ y ❌, sección de detalles del caso fallido con evidencia",
      "input": {
        "skill_name": "skill-test",
        "evals_present": true,
        "evals_format": "sddf",
        "cases_count": 3,
        "passing_cases": ["TC-001", "TC-002"],
        "failing_cases": ["TC-003"]
      },
      "expected": {
        "contains": ["❌", "TC-003", "FAIL", "66%", "✅ TC-001", "✅ TC-002"],
        "not_contains": ["100%", "All cases passed"]
      },
      "threshold": 0.90
    }
  ]
}

## Paso 1 — Crear assets/report-template.md

Template del informe que el skill lee en runtime (no hardcodea la estructura):

# Eval Report: {skill_name}

**Fecha:** {date} | **Total:** {total} | ✅ Passed: {passed} | ❌ Failed: {failed} | **Pass rate:** {pass_rate}%

| ID | Nombre | Tipo | Threshold | Estado | Notas |
|---|---|---|---|---|---|
{rows}

{failure_details}

---
{summary_message}

## Paso 2 — Crear SKILL.md

Frontmatter
---
name: skill-verify
description: >-
  Ejecuta los casos de prueba TC-NNN definidos en evals/evals.json de un skill
  y devuelve un informe detallado de resultados pass/fail con evidencia por caso.
  Usar cuando el usuario quiera verificar que un skill funciona correctamente,
  ejecutar sus evals, comprobar la tasa de aciertos, o validar antes de publicar.
triggers:
  - "skill-verify"
  - "ejecutar evals del skill"
  - "verificar skill"
  - "correr los tests del skill"
  - "comprobar que el skill funciona"
version: "1.0.0"
type: delegate
input: "<skill-name> | <skill-path>"
output: "Informe markdown pass/fail por caso TC-NNN + pass_rate"
invocable: true
alwaysApply: false
---
Parámetros
Parámetro	Tipo	Descripción
{skill_name}	posicional	Nombre del skill (ej. story-design) o ruta explícita
--report	flag opcional	Guarda el informe en .tmp/skill-verify/{skill_name}/report-YYYYMMDD.md
Flujo de ejecución
Paso 0 — skill-preflight: verificar entorno, resolver $SPECS_BASE.

Paso 1 — Resolver parámetros:

Si sin argumento: preguntar "¿Qué skill deseas verificar?"
Si el argumento no contiene /: construir path .claude/skills/{arg}/
Verificar que SKILL.md existe en la ruta resuelta. Si no: ❌ No se encontró el skill '{arg}' en .claude/skills/
Verificar que evals/evals.json existe. Si no: ❌ No se encontró evals/evals.json en <path>. Ejecuta /skill-test-evals primero para generar los casos de prueba.
Paso 2 — Leer y validar evals.json:

Leer el archivo
Si tiene clave cases en el nivel raíz → formato SDDF ✓ continuar
Si es array plano con campo query → ❌ Este evals.json usa formato trigger (optimización de descripción). skill-verify requiere el formato SDDF con cases[]. Consulta skill-test-evals para generar los evals correctos.
Extraer todos los casos de cases[]
Emitir: [INFO] {N} casos encontrados en {skill_name}/evals/evals.json
Paso 3 — Ejecutar cada caso:

Para cada caso en cases[] (lanzar en paralelo cuando sea posible):

Construir el prompt de escenario a partir del caso:
Escenario de prueba para el skill {skill_name}:

{description}

Condiciones de entrada:
{input — cada campo como bullet list}

Ejecuta el skill con estas condiciones y reporta exactamente qué emitiría.
Invocar el skill {skill_name} como subagente con el prompt construido
Capturar el output completo del subagente
Evaluar contra expected:
Para cada string en expected.contains: buscar en output → FOUND / MISSING
Para cada string en expected.not_contains: buscar en output → ABSENT (ok) / PRESENT (violation)
Calcular: caso PASS si todos los contains están presentes Y todos los not_contains están ausentes
Para threshold < 1.0: PASS si (found_contains / total_contains) ≥ threshold y sin violaciones en not_contains
Registrar: {id, name, type, threshold, status, missing_contains[], violated_not_contains[], evidence}
Paso 4 — Agregar resultados:

pass_rate = passed / total × 100
Paso 5 — Generar informe:

Leer assets/report-template.md
Completar tabla con una fila por caso: TC-NNN | nombre | tipo | threshold | ✅ PASS / ❌ FAIL | notas
Si hay fallos: añadir sección de detalles con missing_contains, violated_not_contains y primeros 300 chars de evidence por caso fallido
Mensaje final:
100%: ✅ Todos los {N} casos pasaron. El skill está listo.
< 100%: ⚠️ Pass rate: {X}%. Considera ejecutar /skill-master build para mejorar el skill.
Paso 6 — Guardar (si --report):

Escribir informe en .tmp/skill-verify/{skill_name}/report-YYYYMMDD.md
Informar ruta al usuario
Manejo de errores
Condición	Mensaje	Acción
Skill no encontrado	❌ No se encontró el skill '{name}' en .claude/skills/	Detener
evals.json ausente	❌ No se encontró evals/evals.json ... Ejecuta /skill-test-evals primero	Detener
Formato trigger detectado	❌ Este evals.json usa formato trigger ...	Detener
cases[] vacío	⚠️ evals.json no contiene casos. Añade al menos TC-001 antes de verificar.	Detener
Subagente falla al ejecutar caso	Marcar caso como ❌ ERROR con mensaje del subagente	Continuar con siguiente caso
Paso 3 — Modificar package.json
Añadir en el array files, después de ".claude/skills/story-verify" (o junto a los otros skill-*):

".claude/skills/skill-verify",

## Paso 4 — Modificar .claude/skills/skill-master/SKILL.md

Dos cambios mínimos para que /skill-master evals delegue a skill-verify:

4a. Tabla de intent detection — añadir fila:

| "ejecutar evals de...", "run evals on...", "validar skill...", "probar el skill con sus tests", "/skill-master evals" | **evals** | Delegate to `skill-verify` to execute TC-NNN cases |
4b. Mapping rule — añadir:

- Intent = **evals** → act as `/skill-verify <skill-name>`; invoke `skill-verify` directly
4c. Modes of Operation — añadir entrada:

**`/skill-master evals <skill-name>`**
Delegates to `skill-verify` — runs all TC-NNN cases in `evals/evals.json` and returns a pass/fail report.
> **Language triggers:** "ejecutar evals de...", "validar skill...", "comprobar que el skill funciona"

## Verificación end-to-end

1. Invocar /skill-verify story-implement → debe leer 9 casos (TC-001 a TC-009) y ejecutarlos
2. Confirmar que el informe contiene tabla con todas las IDs y estados
3. Invocar /skill-verify skill-inexistente-xyz → debe emitir ❌ con nombre del skill
4. Invocar /skill-verify sin argumento → debe preguntar qué skill verificar
5. Invocar /skill-master evals story-design → skill-master detecta intent evals y delega a skill-verify

