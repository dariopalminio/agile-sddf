---
alwaysApply: false
type: design
id: FEAT-064
slug: FEAT-064-revision-codigo-multi-agente-design
title: "Design: Skill story-code-review — revisión multi-agente aprobada"
story: FEAT-064
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: IN-PROGRESS
related:
  - FEAT-064-revision-codigo-multi-agente
---

<!-- Referencias -->
[[FEAT-064-revision-codigo-multi-agente]]

## Context

El skill `story-code-review` actúa como quality gate formal entre `/story-implement` y la marca final de Done. Hasta su creación, el workflow SDD no tiene validación automatizada de que el código producido cumple los criterios de aceptación de `story.md` ni la arquitectura de `design.md`.

El skill sigue el patrón de un solo nivel de delegación establecido en `constitution.md`: el SKILL.md es el orquestador; los agentes especializados son subagentes que leen artefactos y escriben informes parciales a `.tmp/story-code-review/`, evitando el "teléfono descompuesto" (Principio 6).

**Contexto técnico detectado:**
- Skills en `.claude/skills/{nombre}/SKILL.md` — orquestadores Markdown sin código ejecutable
- Agentes en `.claude/agents/` (globales) o `.claude/skills/{nombre}/agents/` (locales al skill)
- Convención de nombres: kebab-case para archivos y directorios
- Templates en `docs/specs/templates/` — fuente de verdad de estructura de output
- Patrón de output: `docs/specs/stories/FEAT-NNN/` para artefactos de historia
- Lineamientos de estructura de skills: `docs/knowledge/guides/skill-structural-pattern.md`

---

## Goals / Non-Goals

**Goals:**
- Definir la arquitectura del skill `story-code-review` para el flujo happy path (revisión aprobada) // satisface: AC-1
- Especificar los tres agentes revisores, sus responsabilidades y el contrato de sus informes // satisface: R-1
- Diseñar la lógica de consolidación (árbitro) que produce `code-review-report.md` // satisface: AC-1, AC-2
- Garantizar ejecución en paralelo de los tres agentes // satisface: NF-1
- Definir el formato de `code-review-report.md` con hallazgos referenciados // satisface: NF-4

**Non-Goals:**
- Diseño del flujo de revisión con bloqueantes (FEAT-065 — genera `fix-directives.md`)
- Diseño de la validación de precondiciones (FEAT-066 — artefactos faltantes)
- Lógica del flag `--single-agent`

---

## Decisions

### D-1: Estructura de directorios del skill // satisface: R-1

**Opción elegida:** Agentes locales al skill en `.claude/skills/story-code-review/agents/`

```
.claude/skills/story-code-review/
├── SKILL.md                                    # Orquestador (entry point)
├── agents/
│   ├── tech-lead-reviewer.agent.md             # Inspector de Código
│   ├── product-owner-reviewer.agent.md         # Guardián de Requisitos
│   └── integration-reviewer.agent.md           # Inspector de Integración
├── assets/
│   └── code-review-report-template.md          # Fuente de verdad del output
└── examples/
    ├── example-approved/                        # Input/output con review-status: approved
    └── example-needs-changes/                   # Input/output con review-status: needs-changes
```

**Alternativas rechazadas:**
- Agentes globales en `.claude/agents/`: los revisores son específicos de este skill, contaminarían el namespace global
- Un único agente polivalente: reduce especialización y aumenta el tamaño del contexto del agente; viola P11 (cohesión)

---

### D-2: Contrato de interfaz de los agentes // satisface: R-1, NF-4

Cada agente recibe como contexto:
- Ruta del directorio de la historia (`$STORY_DIR`)
- Ruta a `constitution.md` y `definition-of-done-story.md`

Cada agente escribe su informe parcial a:
```
.tmp/story-code-review/{agent-id}-report.md
```

**Formato del informe parcial (contrato):**

```markdown
---
agent: tech-lead-reviewer | product-owner-reviewer | integration-reviewer
dimension: code-quality | requirements-coverage | integration-architecture
status: approved | needs-changes
max-severity: HIGH | MEDIUM | LOW | ninguna
---

# Informe: {dimensión}

## Hallazgos

| Severidad | Archivo:Línea | Descripción | Recomendación |
|-----------|---------------|-------------|---------------|
| HIGH      | path/file.ts:42 | descripción | acción |
| LOW       | path/file.ts:10 | descripción | acción |

## Veredicto
{approved | needs-changes}: {justificación}
```

**Alternativas rechazadas:**
- Informes en JSON: más fácil de parsear, pero inconsistente con el ecosistema Markdown del proyecto
- Un solo informe combinado: los agentes son paralelos; escribir a un único archivo crearía conflictos de concurrencia

---

### D-3: Lógica del árbitro (consolidación) // satisface: AC-1, AC-2

El árbitro vive en `SKILL.md` (el orquestador), no en ningún agente.

**Regla de consolidación:**
```
max_severity = máxima severidad encontrada en todos los hallazgos de los 3 informes parciales
review-status = approved  si max_severity ∈ {LOW, ninguna}
review-status = needs-changes  si max_severity ∈ {HIGH, MEDIUM}
```

El árbitro lee los tres archivos de `.tmp/story-code-review/` después de que todos los agentes terminan.

**Alternativas rechazadas:**
- Votación por mayoría (2 de 3 aprobados → aprobado): puede enmascarar un HIGH en un agente; inaceptable para quality gate
- Un agente árbitro separado: innecesario; la lógica es una comparación de severidades, no análisis de dominio

---

### D-4: Ejecución paralela de agentes // satisface: NF-1

Los tres agentes se lanzan en paralelo (sin dependencias entre ellos). El orquestador espera a que los tres finalicen antes de invocar la consolidación.

**Alternativas rechazadas:**
- Ejecución secuencial: más simple, pero incumple NF-1 (<3 min para ≤10 archivos)
- Pipeline con dependencias entre agentes: crea acoplamiento artificial

---

### D-5: Estructura de code-review-report.md // satisface: AC-1, NF-4

El report se genera a partir del template `assets/code-review-report-template.md`. El orquestador lee el template en tiempo de ejecución (fuente de verdad dinámica — Principio 5 de constitution.md).

**Estructura del report final:**

```markdown
---
type: code-review-report
story: FEAT-NNN
review-status: approved | needs-changes
date: YYYY-MM-DD
max-severity: LOW | ninguna
---

# Code Review Report: FEAT-NNN

## Resumen
- **Story:** FEAT-NNN — título
- **Review status:** approved
- **Revisores:** Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer
- **Severidad máxima detectada:** LOW | ninguna

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)
[hallazgos o "Sin hallazgos bloqueantes"]

### Cobertura de Requisitos (Product-Owner-Reviewer)
[hallazgos o "Todos los escenarios Gherkin cubiertos"]

### Integración y Arquitectura (Integration-Reviewer)
[hallazgos o "Arquitectura consistente con design.md"]

## Decisión final
**review-status: approved**
La implementación cumple todos los criterios de aceptación de `story.md` y la arquitectura de `design.md`.
```

---

### D-6: Actualización del frontmatter de story.md // satisface: AC-1

El orquestador actualiza `story.md` **solo cuando** review-status = approved:
```
status: READY-FOR-VERIFY
substatus: DONE
```

La actualización se hace después de escribir `code-review-report.md`, garantizando que el artefacto existe antes de cambiar el estado.

---

### D-7: Restricción Markdown-only (compatibilidad agnóstica al stack) // satisface: NF-3

El skill lee y escribe únicamente archivos de texto (Markdown y YAML). No ejecuta, compila ni inspecciona binarios ni código de producción. Los agentes analizan el código fuente leyéndolo como texto plano y aplicando criterios definidos en sus instrucciones Markdown.

Esta restricción garantiza NF-3: el skill funciona independientemente del lenguaje de programación o stack tecnológico de la historia revisada.

**Alternativa rechazada:** integración con linters o analizadores estáticos del stack (ESLint, Pylint, etc.) — introduce dependencias de stack que violan NF-3 y complican la instalación del framework.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Un agente produce un informe malformado → árbitro falla al leer | El árbitro valida el frontmatter del informe; si falta `max-severity`, asume HIGH (fail-safe) |
| Los tres agentes consumen mucho contexto → lentitud | Cada agente recibe solo sus artefactos relevantes (P6 diseño para el cambio: si un agente es lento, se puede excluir con flag futuro) |
| El informe `.tmp/` persiste de una ejecución anterior → falso positivo | El orquestador limpia `.tmp/story-code-review/` al inicio (NF-2 idempotencia) |
| Cambio en el template de report → SKILL.md no se actualiza | El template es la fuente de verdad; el skill lo lee en runtime. Si el template cambia, el output cambia automáticamente |

---

## Open Questions

Sin preguntas abiertas. El diseño cubre todos los ACs del happy path (FEAT-064). Los flujos de bloqueantes (FEAT-065) y precondiciones (FEAT-066) tienen diseños separados.

---

## Registro de Cambios (CR)

Sin CRs detectados.
