---
alwaysApply: false
type: design
id: STORY-078
slug: STORY-078-implement-tdd-fase-red-design
title: "Design: story-implement — Fase RED: validar configuración y generar pruebas"
date: 2026-05-30
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-14-fabrica-de-skills
related:
  - STORY-078-implement-tdd-fase-red
  - STORY-081-implement-tdd-fase-green-refactor
  - STORY-082-implement-tdd-modos-ejecucion
---

<!-- Referencias -->
[[STORY-078-implement-tdd-fase-red]]

## Context

`story-implement` es un nuevo skill SDDF que implementa el ciclo TDD (RED → GREEN → REFACTOR) de forma agnóstica al stack. Esta historia cubre exclusivamente la **Fase RED**: validar que los skills de generación de pruebas declarados en `sddf-config.yaml` existen y son accesibles, invocarlos en orden para generar archivos de test en el código productivo, y confirmar que los tests fallan (estado rojo) antes de empezar la implementación.

Actualmente no existe ningún skill SDDF que cierre la brecha entre la especificación de pruebas (`testcases.md`) y la generación real de archivos de test en el código productivo. `story-implement` es la pieza que conecta esos artefactos con los skills concretos de testing del proyecto del usuario.

**Posición en el pipeline:**
```
story-plan → story-testcases → story-implement (Fase RED) → story-implement (GREEN+REFACTOR, STORY-081) → story-code-review
```

**Criterios de aceptación de referencia:**
- AC-1: Fase RED exitosa — configuración válida, tests generados, estado rojo confirmado
- AC-2: Skill declarado no encontrado detiene la ejecución antes de generar pruebas
- AC-3: testcases.md ausente → continúa con story.md + design.md como fuentes
- Req-4: Configurabilidad agnóstica al stack desde sddf-config.yaml
- Req-5: Patrones estructurales de Skills (skill-structural-pattern.md)
- Req-6: skill-preflight como Paso 0

---

## Goals / Non-Goals

**Goals:**
- Definir la estructura y frontmatter de `.claude/skills/story-implement/SKILL.md`
- Diseñar el schema YAML que extiende `sddf-config.yaml` con la sección `IMPLEMENT.test_generators`
- Definir el contrato de invocación entre `story-implement` y cada skill de generación de pruebas
- Definir el algoritmo de validación de skills declarados (fail-fast)
- Definir la resolución de inputs: `testcases.md` vs fallback a `story.md` + `design.md`
- Definir cómo el skill confirma el estado rojo tras la generación
- Definir la estructura de output intermedio en `.tmp/`

**Non-Goals:**
- Diseñar skills de generación de pruebas específicos (ej. `story-test-unit-jest`) — son historias separadas
- Diseñar la Fase GREEN o REFACTOR — cubiertos en STORY-081
- Diseñar modos interactivo/automático — cubiertos en STORY-082
- Definir el schema del artefacto `testcases.md` — ya definido en story-testcases (STORY-079)

---

## Decisions

### D-1: Schema de `IMPLEMENT.test_generators` en sddf-config.yaml
// satisface: AC-1, Req-4

Extender el `docs/policies/sddf-config.yaml` existente con una nueva sección `IMPLEMENT`:

```yaml
IMPLEMENT:
  test_generators:
    - type: unit          # coincide con clave de defaults.unit
      skill: story-test-unit-jest   # nombre del directorio en .claude/skills/
      required: true      # true = abortar si falla; false = WARN y continuar
    - type: e2e
      skill: story-test-e2e-playwright
      required: false
    - type: eval
      skill: story-test-eval
      required: true
  code_generator:
    skill: story-code-nodejs
    required: true
```

El orden de las entradas en `test_generators` define el orden de invocación. Los tipos no listados se omiten sin advertencia. `code_generator` es usado por STORY-081 (fuera de scope de esta historia).

**Alternativa rechazada — archivo separado `test_generators.yaml`:** Fragmentar la configuración viola el principio de fuente única; `sddf-config.yaml` es la fuente de verdad de configuración SDDF.

**Alternativa rechazada — tipos hardcodeados en SKILL.md:** Viola la agnósticidad de stack (Req-4); cambiar de Jest a Vitest requeriría modificar el skill en lugar de solo actualizar la configuración.

---

### D-2: Algoritmo de validación de skills declarados (fail-fast)
// satisface: AC-1, AC-2

Validar todos los skills declarados **antes** de invocar ninguno:

1. Si `IMPLEMENT.test_generators` no existe o está vacío → emitir `[WARN] No hay test_generators configurados — Fase RED sin generación de pruebas` y continuar
2. Para cada entry en `test_generators`:
   - Construir ruta: `.claude/skills/{entry.skill}/SKILL.md`
   - Verificar existencia con Glob
   - Si no existe y `required: true` → `❌ Skill '<nombre>' declarado en sddf-config.yaml no encontrado en .claude/skills/` + detener sin generar ningún archivo
   - Si no existe y `required: false` → `[WARN] Skill '<nombre>' no encontrado — omitiendo tipo '<tipo>'` + marcar entry como omitida

**Alternativa rechazada — validación lazy (skill a skill durante invocación):** Si el tercer skill falla, los dos primeros ya habrán generado archivos, dejando el directorio de código en estado parcial. Fail-fast previene inconsistencias.

---

### D-3: Resolución de inputs para los skills de generación
// satisface: AC-3

El skill resuelve los artefactos de especificación en este orden:

| Prioridad | Artefacto | Acción |
|-----------|-----------|--------|
| 1 | `testcases.md` existe | Usarlo como fuente primaria |
| 2 | `testcases.md` ausente | `⚠️ testcases.md no encontrado — generando pruebas desde story.md y design.md` |
| 3 | story.md o design.md ausentes | `❌ Artefactos de especificación insuficientes` + detener |

El bundle de inputs `{story_id, testcases_path|null, story_path, design_path}` se pasa a cada skill de generación como contexto.

**Alternativa rechazada — bloquear si testcases.md no existe:** AC-3 establece explícitamente que la ausencia de `testcases.md` no debe bloquear; story.md + design.md son suficientes para derivar tests.

---

### D-4: Contrato de invocación (un solo nivel de delegación)
// satisface: AC-1, Req-5

El skill sigue el patrón de un solo nivel de delegación:

```
story-implement (Fase RED)   ← orquestador
  └── {skill tipo unit}           ← subagente
  └── {skill tipo e2e}            ← subagente
  └── {skill tipo eval}           ← subagente
```

**Inputs al subagente:** `story_id`, bundle de artefactos de especificación (D-3), ruta raíz del proyecto.

**Output esperado del subagente:** `{status: ok|error, files_generated: [rutas], message: string}`.

Si `status: error` → el orquestador detiene la Fase RED sin invocar subagentes siguientes (fail-fast) y reporta el error.

Los subagentes escriben sus resultados en `.tmp/story-implement/{tipo}/results.json` (D-8) para que sean legibles de forma independiente.

**Alternativa rechazada — pasar el contexto completo heredado al subagente:** Viola el principio "evitar el teléfono descompuesto" (constitution.md §6); los subagentes deben recibir solo lo necesario para su tarea.

---

### D-5: Confirmación de estado RED
// satisface: AC-1

Tras generar los tests de cada tipo, el skill confirma el estado rojo ejecutando el comando del tipo correspondiente declarado en `sddf-config.yaml`:

1. Para cada tipo generado, leer `defaults.{type}.command` de `sddf-config.yaml`
2. Si el comando existe → ejecutarlo
   - Exit code ≠ 0: `✅ Tests en estado rojo (fallan correctamente) — tipo: <tipo>`
   - Exit code 0: `⚠️ Los tests PASAN sin implementación — verificar que los tests sean correctos`
3. Si no hay comando declarado para el tipo → `[INFO] Sin comando configurado para tipo '<tipo>' — confirmación de RED omitida`

**Alternativa rechazada — no ejecutar los tests y solo reportar generación:** AC-1 establece explícitamente "ejecuta los tests confirmando que están en estado rojo"; no confirmar el RED invalida la garantía del ciclo TDD.

**Alternativa rechazada — delegar confirmación al skill de generación:** La confirmación del ciclo TDD es responsabilidad del orquestador, no del skill especializado; mantiene la separación de responsabilidades.

---

### D-6: Estructura de directorios del skill story-implement
// satisface: Req-5

```
.claude/skills/story-implement/
├── SKILL.md          # Fase RED (esta historia) + referencia a STORY-081 y STORY-082
└── evals/
    └── evals.json    # DEBE existir antes que SKILL.md (principio TDD para skills)
```

- `assets/` omitido: el skill no genera documentos con estructura de template propio
- `agents/` omitido: los subagentes son skills del sistema invocables directamente; no se necesitan agentes locales en esta entrega
- `evals/evals.json` es prerequisito al SKILL.md (TDD); debe generarse en la fase RED del propio ciclo de construcción del skill

**Alternativa rechazada — SKILL.md separado por fase:** El skill es un único punto de entrada; las fases son secciones internas del mismo SKILL.md, no skills independientes. Dividirlos rompería la invocación simple `/story-implement`.

---

### D-7: Frontmatter del SKILL.md de story-implement
// satisface: Req-5

```yaml
---
name: story-implement
description: >-
  Implementa el ciclo TDD (RED→GREEN→REFACTOR) para una historia SDDF, delegando
  generación de pruebas y código a skills configurados en sddf-config.yaml.
  Usar cuando el practitioner quiere ejecutar story-implement, implementar
  una historia con TDD, o completar el ciclo rojo-verde-refactor de una historia.
triggers:
  - "story-implement"
  - "implementar con TDD"
  - "ciclo TDD historia"
  - "fase RED historia"
  - "generar tests y código"
version: "1.0.0"
type: delegate
input: "story.md + testcases.md (opcional) + sddf-config.yaml"
output: "archivos de prueba en código productivo + story.md actualizado a CODE-REVIEW"
---
```

---

### D-8: Output intermedio en `.tmp/`
// satisface: AC-1, constitution.md §6

El orquestador escribe el estado de la Fase RED en `.tmp/story-implement/` para desacoplar la comunicación entre fases:

```
.tmp/story-implement/
├── red-phase-status.json     # resumen de la fase
└── {tipo}/
    └── results.json          # output de cada subagente
```

Schema de `red-phase-status.json`:
```json
{
  "story_id": "STORY-NNN",
  "generators_invoked": ["unit", "e2e"],
  "generators_skipped": ["eval"],
  "files_generated": [".../test/unit/service.test.js"],
  "red_confirmed": true,
  "timestamp": "2026-05-30T..."
}
```

Este archivo es la precondición que leerá STORY-081 (Fase GREEN) antes de invocar el code-generator.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| Un skill de generación escribe en rutas incorrectas (incumple contrato) | El orquestador verifica que `files_generated` no esté vacío tras la invocación |
| El comando de tests del usuario no existe (`required: false` en defaults) | La confirmación RED se omite con `[INFO]`; no bloquea la fase |
| `sddf-config.yaml` no tiene sección `IMPLEMENT` (proyecto en migración) | El skill emite `[WARN]` y continúa con flujo genérico; nunca lanza error fatal |
| Los skills de generación (ej. `story-test-unit-jest`) aún no existen | D-2 detecta la ausencia en la validación previa y emite `❌` con sugerencia explícita de instalación |
| La Fase RED genera tests que pasan de inmediato (tests mal escritos) | D-5 emite `⚠️` con instrucción de verificar los tests; el ciclo no avanza automáticamente a GREEN |

## Open Questions

Sin preguntas abiertas — todas las ambigüedades técnicas están resueltas en D-1 a D-8 o delegadas explícitamente a STORY-081 y STORY-082.
