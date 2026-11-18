---
type: adr
id: ADR-0015
slug: contrato-de-validacion
title: "Contrato común de validación para los skills de gate"
status: ACCEPTED
date: 2026-10-17
supersedes: null
superseded-by: null
---

# ADR-0015: Contrato común de validación para los skills de gate

## Contexto y problema

Los skills de validación (`epic-analyze`, `story-evaluation`, `story-analyze`, `story-code-review`, `story-verify` y
`story-acceptance`) emiten reportes que un agente, un orquestador o un pipeline CI deben leer para decidir si el flujo
avanza. El análisis comparativo de sus templates, origen de EPIC-25, detectó tres divergencias:

1. **Ubicación del veredicto:** al inicio, al final o ausente. `story-analyze` no declara veredicto, solo un «Estado
   general» en el texto.
2. **Idioma y formato del valor:** `APPROVED`, `APROBADA`, `approved` o `ACCEPTANCE-APPROVED` para el mismo resultado.
3. **Nombre del campo:** `verdict`, `decision`, `review-status` o `final-status`.

Con esas divergencias, cada consumidor tiene que conocer los detalles de cada skill, y los flowcharts de especificación,
planificación y ejecución/QA no tienen un vocabulario común para sus ramas `verdict`.

## Decisión

Todos los skills de gate declaran su resultado con un contrato común: el campo `verdict` en el frontmatter y una sección
`## Veredicto` como primera sección del reporte, con un valor de un vocabulario cerrado en inglés, en mayúsculas y con
guion ASCII. El rechazo usa dos valores distintos según la fase: uno para los artefactos de especificación y otro para
los de planificación, ejecución y QA. Un bloqueo del proceso tiene su propio valor, distinto del rechazo.

El contrato vive en una única fuente, la [política de contrato de validación](../policies/validation-contract-policy.md),
que fija la estructura, el vocabulario, los valores permitidos por skill y las equivalencias de los valores heredados.
Este ADR no repite esas tablas.

## Rationale

- **Fuente única (principio inamovible 8):** un vocabulario definido en un solo lugar evita que cada skill lo redacte de
  otra forma. Skills, templates y README enlazan la política.
- **Verificación legible por máquinas (principio inamovible 3):** un campo de frontmatter con valores cerrados permite que
  CI lea cualquier gate sin parsear Markdown ni conocer cada skill.
- **Precedente:** `epic-analyze` ya declaraba `verdict` con valores en inglés y mayúsculas, y EPIC-23 (`epic-validate`)
  adopta `## Veredicto` como primera sección.
- **Rechazo por fase:** en especificación el artefacto se refina y se reevalúa; en planificación, ejecución y QA el
  artefacto existe y se corrige en el paso que lo produjo. Dos valores distintos hacen explícita la rama de retorno.

## Alternativas consideradas

- **Vocabulario en español:** coherente con el idioma de los documentos — descartada porque `epic-analyze` y los
  flowcharts ya usan valores en inglés, y los identificadores en inglés son los habituales en máquinas de estado y CI.
- **Un único valor de rechazo para todas las fases:** más simple — descartada porque oculta a qué paso vuelve el flujo y
  obliga al consumidor a deducirlo de la fase.
- **Mantener un vocabulario por skill y documentar cada uno:** sin cambios en los skills — descartada porque perpetúa las
  tres divergencias y obliga a cada consumidor a conocer todos los skills.

## Consecuencias

**Positivas:**
- Agentes, orquestadores y CI leen el resultado de cualquier gate con la misma regla.
- Los flowcharts y la política comparten vocabulario, así que la deriva entre ambos es detectable por inspección.

**Negativas / trade-offs:**
- Se rompe cualquier consumidor externo que dependa de `decision: APROBADA`, `review-status: approved`,
  `final-status: ACCEPTANCE-*` o del veredicto al final del reporte. La ruptura ocurre cuando se alinea cada skill
  (STORY-139 a STORY-142, STORY-144 y STORY-145). Mitigación: la tabla de equivalencias de la política traduce cada valor
  heredado, y los reportes históricos no se reescriben.
- Cualquier cambio posterior del contrato exige una versión nueva de la política y, si cambia la decisión, un ADR nuevo.

## Referencias

- [Política de contrato de validación](../policies/validation-contract-policy.md)
- [EPIC-25 — Unificar contrato de validaciones en skills](../specs/epics/EPIC-25-unificar-contrato-de-validaciones-en-skills/epic.md)
- Flowcharts: [especificación](../architecture/diagrams/flowchart-story-specify.mermaid),
  [planificación](../architecture/diagrams/flowchart-story-plan.mermaid) y
  [ejecución y QA](../architecture/diagrams/flowchart-story-excecution-qa.mermaid)
- [[validation-contract-policy]] · [[EPIC-25-unificar-contrato-de-validaciones-en-skills]]
