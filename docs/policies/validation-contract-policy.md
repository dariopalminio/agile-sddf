---
type: policy
slug: validation-contract-policy
title: "Política de contrato de validación"
derives-from: constitution
---

# Política de contrato de validación

**Versión:** 1.0.0
**Estado:** Aprobado
**Última actualización:** 2026-10-17
**Propietario:** Mantenedores de Agile-SDDF

## 1. Propósito y alcance

**Propósito:** que agentes, orquestadores y pipelines CI lean el resultado de cualquier gate de validación de la misma forma, sin conocer los detalles de cada skill. Para ello, la política fija dónde declara el reporte su veredicto y qué valores puede tomar.

**Deriva de:** los principios inamovibles 3 (*Verificación y automejora*) y 8 (*estándares homogéneos*) de la [constitución](../constitution.md).

**Alcance:** los skills de validación de la tabla de [§4](#4-valores-permitidos-por-skill) y los reportes que emiten.

**Exclusiones:** `epic-format-validation`, `security-audit` y `fix-directives.md`, que es un artefacto de rework de `story-code-review` y no un reporte de veredicto.

## 2. Vocabulario de veredictos

**Formato:** cada valor va en inglés, en mayúsculas y con guion ASCII (`-`). Cumple el patrón `^[A-Z]+(-[A-Z]+)*$`.

| Valor | Fase | Significado | Efecto en el flujo |
|---|---|---|---|
| `APPROVED` | Todas | El artefacto supera el gate. | Avanza al paso siguiente. |
| `NEEDS-REFINEMENT` | Especificación | Un artefacto de especificación (épica o historia) debe refinarse. | Vuelve a refinar y se reevalúa. |
| `NEEDS-CHANGES` | Planificación, ejecución y QA | Un artefacto de planificación o de implementación fue rechazado o sus pruebas fallaron. | Vuelve al paso que lo produjo. |
| `BLOCKED` | Cualquiera con bloqueo | Un bloqueo impide completar el proceso. No es un defecto del artefacto. | Detiene el flujo y, una vez despejado el bloqueo, se vuelve a ejecutar el mismo gate. |
| `SPLIT` | Especificación | La historia es demasiado grande. | Se divide y se reevalúa. |
| `PENDING` | Extensión local de `story-acceptance` | La sesión de validación sigue `partial`. | Detiene el flujo hasta completar la sesión. No tiene rama en los flowcharts. |

`NEEDS-REFINEMENT` y `NEEDS-CHANGES` no son alias: cada gate emite solo uno de los dos.

## 3. Reglas no negociables

- **G-01 — Campo `verdict`:** el frontmatter del reporte declara `verdict` con exactamente un valor.
- **G-02 — Sección `## Veredicto`:** es el primer encabezado `##` tras el título `#`. Entre ambos solo puede haber líneas en blanco o comentarios HTML. Su primera línea es `` **Veredicto:** `<VALOR>` — <motivo en una frase> ``, con el mismo valor que `verdict`. Pueden seguirle motivos breves; el detalle vive en las secciones propias del skill.
- **G-03 — Vocabulario cerrado:** el valor es uno de los permitidos para el skill en §4. Cualquier otro valor no es conforme, ya sea heredado, en minúsculas, en español o de otro skill.
- **G-04 — Fuente única en el reporte:** ningún otro campo ni línea declara el veredicto (`decision`, `review-status`, `final-status`, `**Estado general:**`, línea «Resultado»). Los campos que no son veredicto se mantienen (`errors`, `warnings`, `max-severity`, `session-status`).
- **G-05 — Precedencia:** si en un reporte coexisten algo rechazado y algo bloqueado, gana `NEEDS-CHANGES`. Mientras la sesión de `story-acceptance` sea `partial`, el veredicto es `PENDING`. Fuera de estos dos casos, cada skill aplica su propia regla de decisión.
- **G-06 — Lectura cerrada ante fallo:** un consumidor (agente, orquestador o CI) lee `verdict` del frontmatter. Solo `APPROVED` habilita el avance. Un valor ausente, no permitido para el skill o heredado sin traducir (§5) se trata como no aprobado.

**Acción ante violación:** un reporte no conforme es un defecto del skill que lo emite y se corrige en ese skill. Sus consumidores aplican G-06.

## 4. Valores permitidos por skill

| Skill | Reporte | Fase | Valores permitidos | Flowchart | Valores sin rama |
|---|---|---|---|---|---|
| `epic-analyze` | `epic-analyze-report.md` | Especificación | `APPROVED`, `NEEDS-REFINEMENT` | — (sin flowchart) | — |
| `story-evaluation` | `finvest-evaluation-report.md` | Especificación | `APPROVED`, `NEEDS-REFINEMENT`, `SPLIT` | [specify](../architecture/diagrams/flowchart-story-specify.mermaid) | — |
| `story-analyze` | `analyze.md` | Planificación | `APPROVED`, `NEEDS-CHANGES` | [plan](../architecture/diagrams/flowchart-story-plan.mermaid) | — |
| `story-code-review` | `code-review-report.md` | Ejecución y QA | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | [ejecución y QA](../architecture/diagrams/flowchart-story-excecution-qa.mermaid) | — |
| `story-verify` | `verify-report.md` | Ejecución y QA | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | [ejecución y QA](../architecture/diagrams/flowchart-story-excecution-qa.mermaid) | — |
| `story-acceptance` | `acceptance-report.md` | Ejecución y QA | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED`, `PENDING` | [ejecución y QA](../architecture/diagrams/flowchart-story-excecution-qa.mermaid) | `PENDING` |
| `epic-validate` (previsto, EPIC-23) | `epic-validate-report.md` | QA de épica | `APPROVED`, `NEEDS-CHANGES`, `BLOCKED` | — (sin flowchart) | — |

**Invariante con los flowcharts:** en cada fila con flowchart, los valores permitidos menos los valores sin rama coinciden exactamente con las ramas `verdict` que salen del skill en su diagrama. Solo `PENDING` puede figurar en «Valores sin rama». Si un flowchart gana o pierde una rama, esta tabla se actualiza con una versión nueva.

## 5. Equivalencias de valores heredados

Todo valor de esta tabla es no conforme (G-03). La columna «Valor canónico» indica el que lo reemplaza.

| Skill | Campo heredado | Valor heredado | Valor canónico |
|---|---|---|---|
| `epic-analyze` | `verdict` | `BLOCKED` | `NEEDS-REFINEMENT` |
| `story-evaluation` | `decision` | `APROBADA` | `APPROVED` |
| `story-evaluation` | `decision` | `REFINAR` | `NEEDS-REFINEMENT` |
| `story-evaluation` | `decision` | `RECHAZAR` | `NEEDS-REFINEMENT` |
| `story-evaluation` | `decision` | `DIVIDIR` | `SPLIT` |
| `story-analyze` | `**Estado general:**` | `✓ Coherente` | `APPROVED` |
| `story-analyze` | `**Estado general:**` | `⚠️ Advertencias` | `APPROVED` |
| `story-analyze` | `**Estado general:**` | `❌ Inconsistencias bloqueantes` | `NEEDS-CHANGES` |
| `story-code-review` | `review-status` | `approved` | `APPROVED` |
| `story-code-review` | `review-status` | `needs-changes` | `NEEDS-CHANGES` |
| `story-verify` | Resultado | `VERIFY-PASSED` | `APPROVED` |
| `story-verify` | Resultado | `VERIFY-REJECTED` | `NEEDS-CHANGES` |
| `story-verify` | estado interno | `RECHAZADO` | `NEEDS-CHANGES` |
| `story-verify` | estado interno | `REJECTED` | `NEEDS-CHANGES` |
| `story-acceptance` | `final-status` | `ACCEPTANCE-APPROVED` | `APPROVED` |
| `story-acceptance` | `final-status` | `ACCEPTANCE-REJECTED` | `NEEDS-CHANGES` |
| `story-acceptance` | `final-status` | `ACCEPTANCE-BLOCKED` | `BLOCKED` |
| `story-acceptance` | `session-status` | `partial` | `PENDING` |

**Reportes heredados:** los reportes generados antes de que su skill se alinee son registro histórico y no se reescriben. Un consumidor que necesite leer uno traduce su valor con esta tabla, por el par (skill, valor heredado), antes de aplicar G-06. Ningún skill alineado vuelve a emitir un valor heredado.

## 6. Excepciones

| Skill | Elemento conservado | Motivo | Historia |
|---|---|---|---|

Sin excepciones vigentes.

## 7. Ejemplos de reportes conformes

Cada ejemplo muestra solo lo que fija el contrato. El resto de la estructura la define el template de cada skill.

### 7.1 epic-analyze
```markdown
---
type: epic-analyze
verdict: NEEDS-REFINEMENT
---
# Análisis de épica: …

## Veredicto
**Veredicto:** `NEEDS-REFINEMENT` — 1 hallazgo ERROR de integridad en el índice de historias.

## Resumen
…
```

### 7.2 story-evaluation
```markdown
---
type: finvest-evaluation
verdict: SPLIT
---
# Evaluación FINVEST

## Veredicto
**Veredicto:** `SPLIT` — S – Small = 1: la historia es demasiado grande para una iteración.

## Historia evaluada
…
```

### 7.3 story-analyze
```markdown
---
type: analyze
verdict: APPROVED
---
# Reporte de Coherencia: …

## Veredicto
**Veredicto:** `APPROVED` — sin hallazgos ERROR; 2 WARNING no bloqueantes.

## Resumen Ejecutivo
…
```

### 7.4 story-code-review
```markdown
---
type: code-review-report
verdict: NEEDS-CHANGES
---
# Code Review Report: …

## Veredicto
**Veredicto:** `NEEDS-CHANGES` — 1 hallazgo de severidad HIGH debe corregirse.

## Resumen
…
```

### 7.5 story-verify
```markdown
---
type: verify-report
verdict: BLOCKED
---
# Test Report: …

## Veredicto
**Veredicto:** `BLOCKED` — las pruebas no se pueden ejecutar en el entorno.

## Summary
…
```

### 7.6 story-acceptance
```markdown
---
type: acceptance-report
session-status: partial
verdict: PENDING
---
# Acceptance Report: …

## Veredicto
**Veredicto:** `PENDING` — sesión `partial`: 3 de 5 criterios evaluados.

## Resumen ejecutivo
…
```

## Historial de cambios

| Versión | Fecha | Cambios | Autor |
|---|---|---|---|
| 1.0.0 | 2026-10-17 | Creación inicial (STORY-138) | Dario Palminio |
