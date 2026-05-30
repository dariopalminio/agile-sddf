# Formato de `evals.json` para Skills

Este formato (TC-NNN con `contains`/`not_contains`/`threshold`) es para los evals propios del skill — define qué debe producir el skill ante cada entrada de prueba. Para el formato del sistema de benchmarking de skill-master (runs, grading, benchmark), ver `references/schemas.md`.

## Esquema

```json
{
  "skill": "nombre-del-skill",
  "version": "1.0.0",
  "description": "Descripción breve del propósito de estos evals",
  "cases": [
    {
      "id": "TC-001",
      "name": "nombre-descriptivo-kebab-case",
      "type": "happy-path | fail-fast | error-handling | edge-case",
      "description": "Qué escenario cubre este caso",
      "input": {
        "input_path": "ruta/al/archivo/de/prueba",
        "flags": ["--flag-opcional"]
      },
      "expected": {
        "output_file": "ruta/al/archivo/generado",
        "contains": ["fragmento que DEBE aparecer en el output"],
        "not_contains": ["fragmento que NO DEBE aparecer"],
        "decision": "APPROVED | REFINE | REJECT | SPLIT"
      },
      "threshold": 0.95
    }
  ]
}
```

## Campos obligatorios

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `skill` | string | Nombre del skill evaluado (debe coincidir con `name` en SKILL.md) |
| `version` | string | Versión semver del skill (debe coincidir con `version` en SKILL.md) |
| `cases` | array | Lista de casos de prueba (mínimo 1) |
| `cases[].id` | string | Identificador único del caso (`TC-NNN`) |
| `cases[].name` | string | Nombre descriptivo en kebab-case |
| `cases[].type` | enum | Categoría del caso (ver tipos abajo) |
| `cases[].input` | object | Datos de entrada para el skill |
| `cases[].expected` | object | Criterio de éxito medible |

## Tipos de caso

| Tipo | Cuándo usar |
|------|-------------|
| `happy-path` | Entrada válida y completa — el skill DEBE producir output correcto |
| `fail-fast` | Entrada inválida conocida — el skill DEBE detectar el error y reportarlo |
| `error-handling` | Condición de error de entorno (archivo ausente, ruta inválida) — el skill DEBE degradar graciosamente |
| `edge-case` | Entrada límite o inusual — el skill DEBE comportarse correctamente |

---

## Ejemplo 1 — Happy path

```json
{
  "id": "TC-001",
  "name": "valid-input-produces-structured-output",
  "type": "happy-path",
  "description": "Input válido genera output estructurado con secciones requeridas",
  "input": {
    "input_path": "examples/input/valid-input.txt"
  },
  "expected": {
    "output_file": "examples/output/expected-output.md",
    "contains": [
      "## Summary",
      "## Key Findings",
      "## Recommendations"
    ],
    "not_contains": [
      "TODO",
      "undefined"
    ]
  },
  "threshold": 0.95
}
```

---

## Ejemplo 2 — Fail-fast (entrada inválida)

```json
{
  "id": "TC-002",
  "name": "invalid-input-triggers-error",
  "type": "fail-fast",
  "description": "Entrada inválida o vacía debe generar mensaje de error claro",
  "input": {
    "input_path": "examples/input/empty-input.txt"
  },
  "expected": {
    "contains": [
      "⚠️",
      "insufficient content"
    ],
    "not_contains": [
      "## Summary"
    ]
  },
  "threshold": 1.0
}
```

---

## Ejemplo 3 — Error handling (ruta inválida)

```json
{
  "id": "TC-003",
  "name": "missing-file-degrades-gracefully",
  "type": "error-handling",
  "description": "Ruta de archivo inexistente debe emitir advertencia y no crashear",
  "input": {
    "input_path": "path/that/does/not/exist.txt"
  },
  "expected": {
    "contains": [
      "⚠️",
      "not found"
    ],
    "not_contains": [
      "Error:",
      "stack trace"
    ],
    "exit_gracefully": true
  },
  "threshold": 1.0
}
```

---

## Reglas para escribir evals

1. **DEBE existir al menos un `happy-path`** antes de declarar el skill funcional
2. **DEBE existir al menos un `fail-fast` o `error-handling`** antes de marcar `status: STABLE`
3. El campo `contains` DEBE ser específico — evitar fragmentos tan genéricos que siempre pasen
4. El campo `threshold` DEBE ser `1.0` para casos de tipo `fail-fast` y `error-handling`
5. Los archivos de `examples/input/` referenciados en los evals DEBEN existir
6. Los evals DEBEN crearse **antes** del `SKILL.md` (fase RED del ciclo TDD)
