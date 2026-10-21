---
alwaysApply: false
type: story
id: STORY-140
kind: feat
slug: STORY-140-alinear-story-evaluation
title: "Alinear story-evaluation"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-18
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Alinear story-evaluation

**Como** mantenedor de Agile-SDDF que encadena `story-evaluation` con `story-specify`, `story-improve`, `story-split` o un pipeline  
**Quiero** que el reporte FINVEST declare su veredicto al inicio y en el campo `verdict`, con el vocabulario canónico  
**Para** decidir el siguiente paso de una historia sin interpretar valores en español propios de este skill

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Veredicto canónico al inicio del reporte
```gherkin
Esquema del escenario: Veredicto canónico según la decisión FINVEST
  Dado una historia cuya evaluación FINVEST corresponde a <resultado>
  Cuando el mantenedor ejecuta /story-evaluation sobre la historia
  Entonces finvest-evaluation-report.md tiene "## Veredicto" como primera sección tras el título con el valor <verdict>
    Y el frontmatter declara "verdict: <verdict>"
  Pero el reporte no contiene el campo "decision" ni los valores APROBADA, REFINAR, RECHAZAR o DIVIDIR
Ejemplos:
  | resultado                                                       | verdict          |
  | FINVEST ≥ 4.0                                                   | APPROVED         |
  | 3.0 ≤ FINVEST < 4.0                                             | NEEDS-REFINEMENT |
  | F_score < 2.5, FINVEST < 3.0 o una dimensión INVEST distinta de S = 1 | NEEDS-REFINEMENT |
  | S – Small = 1 y ninguna otra dimensión INVEST = 1              | SPLIT            |
```

### AC-2 — Escenario alternativo — story-specify enruta según el veredicto
```gherkin
Esquema del escenario: Siguiente paso según el veredicto
  Dado un finvest-evaluation-report.md con verdict <verdict>
  Cuando story-specify procesa la historia
  Entonces <siguiente paso>
Ejemplos:
  | verdict          | siguiente paso                                                                       |
  | NEEDS-REFINEMENT con S – Small = 1 | invoca story-split; si no produce historias derivadas, invoca story-improve |
  | NEEDS-REFINEMENT | invoca story-improve con el mismo gate anti-bucle existente |
  | SPLIT            | invoca story-split como hoy con DIVIDIR                                              |
  | APPROVED         | la historia pasa a status SPECIFY y substatus DONE                                   |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin cambio de rúbrica:** las rúbricas, los pesos y los umbrales FINVEST no cambian. Solo cambian la ubicación, el nombre del campo y los valores del veredicto.

## Fuera de alcance (Non-Goals)

- Reescribir los `finvest-evaluation-report.md` históricos de `docs/specs/stories/`.
- Cambiar la escala Likert o las reglas de decisión FINVEST.

## 📎 Notas / contexto adicional

- **Estado actual:** el frontmatter usa `decision: <APROBADA|REFINAR|RECHAZAR|DIVIDIR>` y la decisión aparece al final, en `## Resultado Final` de `skills/story-evaluation/assets/evaluation-output-template.md`.
- **Consumidores que hay que actualizar:** `skills/story-specify/` (SKILL.md, README y el rol `assets/agents/product-owner.md`), `skills/story-improve/` (gate interno de APROBADA y ejemplos), `skills/story-split/` (disparo con DIVIDIR), comentarios de escritor de `skills/story-creation/assets/story-template.md` y `scripts/migrate-finvest-field.js`.
- **Flowchart:** `docs/architecture/diagrams/flowchart-story-specify.mermaid`. La rama `NEEDS-REFINEMENT` lleva a `story-refine`, que hoy es `story-improve` (renombrarlo está fuera de alcance), y `SPLIT` lleva a `story-split`. Ambas vuelven a `story-evaluation`.
- **Mapeo de `RECHAZAR`:** se mapea a `NEEDS-REFINEMENT`, según lo decidido en la épica. Hoy `story-specify` también invoca `story-split` con `RECHAZAR` cuando la evaluación recomienda dividir. Ese camino debe conservarse cuando `RECHAZAR` pase a `NEEDS-REFINEMENT`.
- **Reportes heredados:** los consumidores deben seguir leyendo `decision:` en los reportes existentes, o la política debe definir una migración. Si no, una historia ya evaluada con `APROBADA` dejaría de reconocerse.
- **Tamaño:** puede crecer por la cantidad de consumidores. Si al estimar resulta grande, se puede dividir en «reporte» y «consumidores».
- Cubre el criterio de salida de EPIC-25: **CS-5** — `story-evaluation` produce un veredicto explícito `APPROVED` | `NEEDS-REFINEMENT` | `SPLIT`, y `RECHAZAR` se mapea a `NEEDS-REFINEMENT`. Contribuye además a `## Veredicto` como primera sección, a `verdict` en el frontmatter y a que no quede ninguna variante `APROBADA`.
