---
alwaysApply: false
type: story
id: STORY-166
kind: feat
slug: STORY-166-veredicto-de-epic-format-validation
title: "Veredicto de epic-format-validation"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-27
related:
  - EPIC-23-completar-flujo-de-epic
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-167-skill-epic-improve
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Veredicto canónico de `epic-format-validation`

**Como** Solo Builder que define una épica  
**Quiero** que `/epic-format-validation EPIC-NN` declare un veredicto canónico (`APPROVED` o `NEEDS-REFINEMENT`) en lugar de `APROBADO` / `REFINAR` / `RECHAZADO`, con el diagnóstico de cada defecto  
**Para** que el bucle de `DEFINE` decida si avanza a `PLAN` o pasa por `/epic-improve` sin interpretar texto libre

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Épica conforme obtiene APPROVED
```gherkin
Dado una épica cuyo epic.md cumple el frontmatter, las secciones obligatorias, las líneas F1/F2/F3 y los smoke tests SMOKE-N del template
Cuando el Solo Builder ejecuta "/epic-format-validation EPIC-NN"
Entonces el resultado declara el veredicto "APPROVED"
  Y no aparece ninguno de los valores heredados "APROBADO", "REFINAR" ni "RECHAZADO"
```

### AC-2 — Escenario alternativo – Épica con defectos obtiene NEEDS-REFINEMENT con diagnóstico
```gherkin
Dado una épica cuyo epic.md no tiene la sección de criterios de salida
  Y una de sus líneas de historias no casa con F1, F2 ni F3
Cuando el Solo Builder ejecuta "/epic-format-validation EPIC-NN"
Entonces el resultado declara el veredicto "NEEDS-REFINEMENT"
  Y lista cada defecto con su ubicación y la corrección esperada
  Y el diagnóstico es suficiente para que /epic-improve aplique las correcciones sin volver a analizar la épica
```

### AC-3 — Escenario de error – Épica inexistente
```gherkin
Dado que no existe ningún directorio para EPIC-77 en specs/flow/
Cuando el Solo Builder ejecuta "/epic-format-validation EPIC-77"
Entonces informa la ruta buscada y finaliza con error
  Pero no declara "APPROVED" ni "NEEDS-REFINEMENT"
```

### AC-4 — Coherencia con la política y el flowchart
```gherkin
Dado que epic-format-validation emite "APPROVED" o "NEEDS-REFINEMENT"
Cuando se ejecuta "npm run verify:repository"
Entonces validation-contract-policy §4 incluye una fila para epic-format-validation con sus valores permitidos
  Y epic-format-validation ya no figura en las exclusiones de §1
  Y la fila enlaza flowchart-skill-epic-flow-relationship.mermaid, cuya rama "verdict" hacia epic-improve es "NEEDS-REFINEMENT"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Vocabulario cerrado:** el veredicto cumple el patrón `^[A-Z]+(-[A-Z]+)*$` y la regla G-03 de `validation-contract-policy`.
- **CNF-2 — Compatibilidad de consumidores:** los skills y orquestadores que hoy leen `APROBADO` / `REFINAR` (por ejemplo `epic-from-project-plan`) se actualizan en la misma historia o la tabla de equivalencias §5 de la política registra los valores heredados.

## Fuera de alcance (Non-Goals)

- Aplicar las correcciones en `epic.md` (lo hace `/epic-improve`, STORY-167).
- Cambiar las reglas de validación de forma; solo cambia cómo se declara el resultado.

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-166 — Veredicto de epic-format-validation.
- **Criterios de salida que cubre:** CS-13 y la parte de CS-20 que registra en `validation-contract-policy` el gate de `DEFINE` de forma coherente con su flowchart. Participa en SMOKE-4 (primera y segunda validación).
- **Veredicto de rechazo (decisión del PO, 2026-10-27):** `NEEDS-REFINEMENT`, coherente con §2 de `validation-contract-policy`, que lo reserva para artefactos de especificación (épica o historia). El diagrama ya rotula `NEEDS-REFINEMENT` la rama hacia `epic-improve`; falta versionar la política (fila en §4 y salida de la exclusión de §1).
- **`RECHAZADO` actual:** hoy significa «archivo no encontrado». Con el contrato nuevo ese caso es un error sin veredicto (AC-3); decidir si además debe emitir `BLOCKED`.
