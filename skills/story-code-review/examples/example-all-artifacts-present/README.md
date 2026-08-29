---
type: example-readme
scenario: all-artifacts-present
---

# Ejemplo: Todos los artefactos presentes

Este ejemplo documenta el escenario AC-1 de FEAT-066: cuando los tres artefactos requeridos
(`story.md`, `design.md`, `implement-report.md`) están presentes en el directorio de la historia,
la validación de precondiciones pasa sin error y el skill procede al Paso 2.

## Referencia

Ver el fixture completo en:
- `docs/specs/03-stories/FEAT-000-test/` — directorio de fixture creado en FEAT-064

El fixture contiene `story.md`, `design.md` e `implement-report.md` con contenido mínimo válido.
Ejecutar `/story-code-review FEAT-000` sobre ese fixture confirma que la validación pasa
y el skill avanza al Paso 2 (carga de contexto) sin emitir errores de precondición.

## Comportamiento esperado

```
🔍 Iniciando revisión de código para: FEAT-000
   Directorio: docs/specs/03-stories/FEAT-000-test/
   Artefactos: story.md ✓ | design.md ✓ | implement-report.md ✓
   Estado: IMPLEMENT/DONE ✓
```

El skill continúa con el Paso 2 (carga de contexto), lanza los tres agentes revisores
y genera `code-review-report.md` al finalizar.
