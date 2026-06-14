---
type: plan
id: plan-14
slug: plan-14-evals-standardization
title: "Estandarización del esquema de evals.json (FEAT-055)"
status: COMPLETED
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---


# Plan: Estandarización del esquema de evals.json (EPIC-17)

## Contexto

Existen dos esquemas incompatibles de `evals.json` en el repositorio. `skill-test-evals` solo parsea el Schema 2 (TC-NNN) — si encuentra `evals[]` en lugar de `cases[]`, falla. El Schema 2 está documentado como canónico en `skill-master/references/skill-evals-format.md`. Hay 5 archivos legacy (Schema 1) que deben migrarse.

**Item de referencia:** `release.md` — `- [ ] Test - Estandarización del esquema de evals`

---

## Schemas en juego

### Schema 1 — Legacy (a ELIMINAR)
```json
{
  "skill_name": "nombre-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "...",
      "expected_output": "...",
      "files": ["ruta/archivo.md"],
      "expectations": ["..."],
      "eval_name": "opcional",
      "assertions": [{ "text": "...", "type": "qualitative" }]
    }
  ]
}
```

### Schema 2 — TC-NNN (CANÓNICO, a conservar)
```json
{
  "skill": "nombre-skill",
  "version": "1.0.0",
  "description": "...",
  "cases": [
    {
      "id": "TC-001",
      "name": "kebab-case-nombre",
      "type": "happy-path | fail-fast | error-handling | edge-case",
      "description": "...",
      "input": {
        "flags": [],
        "context": "..."
      },
      "expected": {
        "contains": ["..."],
        "not_contains": ["..."]
      },
      "threshold": 0.90
    }
  ]
}
```

**Referencia canónica:** `.claude/skills/skill-master/references/skill-evals-format.md`

---

## Reglas de conversión (Schema 1 → Schema 2)

| Schema 1 | Schema 2 | Notas |
|---|---|---|
| `skill_name` | `skill` | rename directo |
| — | `version: "1.0.0"` | añadir |
| — | `description` | extraer de contexto del skill |
| `evals[]` | `cases[]` | rename directo |
| `id: N` | `id: "TC-00N"` | convertir a string con padding |
| `eval_name` / `prompt` | `name` + `description` | derivar nombre kebab desde eval_name o prompt truncado |
| — | `type` | inferir: primer caso → `happy-path`; casos de error → `fail-fast` o `error-handling` |
| `files[0]` | `input.input_path` | para 1 archivo; `input.files[]` para múltiples |
| `prompt` | `input.context` | texto libre del prompt como contexto |
| `expected_output` + `expectations[]` | `expected.contains[]` | extraer frases clave verificables |
| — | `expected.not_contains[]` | añadir `["❌", "error"]` como mínimo si aplica |
| — | `threshold: 0.90` | default para happy-path; `1.0` para fail-fast/error-handling |
| `assertions[].text` | `expected.contains[]` | absorber como frases contains |

---

## Archivos a migrar

| Archivo | Casos actuales | Casos resultado |
|---|---|---|
| `.claude/skills/header-aggregation/evals/evals.json` | 1 caso | TC-001 (happy-path) |
| `.claude/skills/story-creation/evals/evals.json` | 1 caso (id:0) | TC-001 (happy-path) |
| `.claude/skills/story-split/evals/evals.json` | 3 casos con `eval_name` | TC-001, TC-002, TC-003 |
| `.claude/skills/test-cypress-cucumber/evals/evals.json` | N casos | TC-00N |
| `.claude/skills/test-playwright-cucumber/evals/evals.json` | N casos | TC-00N |

Los 5 archivos en Schema 2 que ya existen **no se tocan**: `skill-test-evals`, `story-evaluation`, `story-implement`, `story-improve`, `story-testcases`.

---

## Implementación

### Paso 1 — Migrar los 5 archivos legacy

Para cada archivo, leer el contenido actual y reescribirlo con el Schema 2 aplicando las reglas de conversión. El criterio de fidelidad es: preservar la intención del caso, no el texto literal.

Orden de migración: `header-aggregation` → `story-creation` → `story-split` → `test-cypress-cucumber` → `test-playwright-cucumber`

### Paso 2 — Marcar ítem en release.md

Cambiar `- [ ] Test - Estandarización...` → `- [x]` con nota de resolución.

---

## Archivos NO modificados

- Archivos ya en Schema 2 (skill-test-evals, story-evaluation, story-implement, story-improve, story-testcases)
- `skill-master/references/skill-evals-format.md` — fuente de verdad, no se toca
- `node_modules/` — ignorado

---

## Verificación

1. `grep -r '"evals"' .claude/skills/ --include="*.json"` → 0 resultados (ningún archivo usa la clave legacy `evals`)
2. `grep -r '"skill_name"' .claude/skills/ --include="*.json"` → 0 resultados
3. `grep -r '"cases"' .claude/skills/ --include="*.json"` → lista los 10 archivos migrados+existentes
4. Cada archivo migrado tiene `skill`, `version`, `cases`, y todos sus casos tienen `id` en formato `TC-NNN`, `type`, `threshold`
5. Invocar `/skill-test-evals evals header-aggregation` y confirmar que no lanza error de formato
