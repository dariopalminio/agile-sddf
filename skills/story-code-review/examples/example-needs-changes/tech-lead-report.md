---
agent: tech-lead-reviewer
dimension: code-quality
status: needs-changes
max-severity: HIGH
---

# Informe: Calidad de Código

## Hallazgos

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| HIGH      | src/users.ts:15 | API key hardcodeada: `const API_KEY = "sk-prod-abc123"` | Mover a variable de entorno; nunca commitear secrets |
| MEDIUM    | src/users.ts:28 | Función `getUserById` hace 3 cosas distintas (validar, leer DB, formatear respuesta) | Extraer en funciones separadas con responsabilidad única |
| LOW       | src/users.ts:5  | Import `fs` sin usar | Eliminar el import |

## Veredicto
needs-changes: Se detectó un secret hardcodeado de severidad HIGH que debe resolverse antes de aprobar.
