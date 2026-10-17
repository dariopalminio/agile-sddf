---
alwaysApply: false
type: story
id: STORY-139
kind: feat
slug: STORY-139-alinear-epic-analyze
title: "Alinear epic-analyze"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-17
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Alinear epic-analyze

**Como** mantenedor de Agile-SDDF que consume `epic-analyze-report.md` desde agentes o desde CI  
**Quiero** que el reporte de análisis de épica declare su veredicto en una sección `## Veredicto` al inicio, de acuerdo con el contrato de validación  
**Para** leer el resultado de una épica igual que el de cualquier otro gate del framework

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Veredicto al inicio del reporte
```gherkin
Esquema del escenario: Veredicto al inicio según el resultado del análisis
  Dado una épica cuyo análisis termina con <resultado>
  Cuando el mantenedor ejecuta /epic-analyze sobre la épica
  Entonces epic-analyze-report.md tiene "## Veredicto" como primera sección tras el título con el valor <verdict>
    Y el campo "verdict" del frontmatter declara el mismo valor
  Pero el reporte no declara el valor BLOCKED
Ejemplos:
  | resultado                                    | verdict          |
  | ningún hallazgo ERROR y como máximo 3 WARNING | APPROVED         |
  | ningún hallazgo ERROR y más de 3 WARNING      | NEEDS-REFINEMENT |
  | al menos un hallazgo ERROR                   | NEEDS-REFINEMENT |
```

### AC-2 — Escenario alternativo — Conformidad documentada
```gherkin
Dado la política docs/policies/validation-contract-policy.md publicada
Cuando se compara el template de reporte de epic-analyze con la política
Entonces cada diferencia queda corregida en el template
  Pero si alguna se conserva, queda registrada como excepción en la política con su motivo
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Severidad legible sin un tercer valor:** el frontmatter conserva `errors` y `warnings`, así que un consumidor puede distinguir un `NEEDS-REFINEMENT` con hallazgos ERROR de uno que solo tiene WARNING.

## Fuera de alcance (Non-Goals)

- Cambiar la clasificación de hallazgos (familias INT, SAL y MAD, y sus severidades) o el umbral de 3 WARNING.
- Alinear los otros cinco skills de validación.

## 📎 Notas / contexto adicional

- **Estado actual:** `skills/epic-analyze/assets/epic-analyze-report-template.md` declara `verdict: {APPROVED | NEEDS-REFINEMENT | BLOCKED}` en el frontmatter. El Paso 6 de `SKILL.md` emite `BLOCKED` con al menos un hallazgo ERROR. El veredicto aparece como una fila de la tabla en `## Resumen` y no como una sección `## Veredicto` propia.
- **Decisión del PO (2026-10-17):** un hallazgo ERROR es un defecto del artefacto, no un bloqueo del proceso, así que `epic-analyze` emite `NEEDS-REFINEMENT` en lugar de `BLOCKED`. Cambian el Paso 6 de `SKILL.md`, el template, `README.md` y `evals/evals.json` del skill.
- **Decisión de diseño:** si la fila del veredicto en `## Resumen` se conserva o se elimina.
- **Consumidores:** `epic-validate` (EPIC-23, CS-3 y STORY-124) lee el veredicto del análisis de la épica, pero solo comprueba que sea `APPROVED`. Reemplazar `BLOCKED` por `NEEDS-REFINEMENT` no cambia su resultado: cualquier valor distinto de `APPROVED` sigue impidiendo la validación. No hay consumidores que lean el valor `BLOCKED`.
- **Dependencias:** depende de STORY-138, que define el contrato.
- **Vocabulario:** `epic-analyze` es un gate de especificación y no aparece en los flowcharts del ciclo de historia. Sus valores pasan a ser `APPROVED` / `NEEDS-REFINEMENT`.
- Cubre el criterio de salida de EPIC-25: **CS-4** — `epic-analyze` produce un veredicto explícito `APPROVED` | `NEEDS-REFINEMENT`, sin `BLOCKED`. Contribuye además a la sección `## Veredicto` como primera sección y a `verdict` en el frontmatter.
