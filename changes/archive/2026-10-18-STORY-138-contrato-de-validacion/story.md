---
alwaysApply: false
type: story
id: STORY-138
kind: feat
slug: STORY-138-contrato-de-validacion
title: "Contrato de validación"
status: COMPLETED
substatus: DONE
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-18
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Contrato de validación

**Como** mantenedor de Agile-SDDF que crea o modifica un skill de validación  
**Quiero** una política única que defina la estructura común del reporte y el vocabulario controlado de veredictos  
**Para** que agentes y pipelines CI lean el resultado de cualquier gate de la misma forma, sin conocer los detalles de cada skill

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Política publicada con estructura y vocabulario
```gherkin
Dado que no existe docs/policies/validation-contract-policy.md
Cuando el mantenedor publica la política de contrato de validación
Entonces la política exige una sección "## Veredicto" como primera sección tras el título y el campo "verdict" en el frontmatter
  Y define el vocabulario por fase: APPROVED común, NEEDS-REFINEMENT para los gates de especificación y NEEDS-CHANGES para los de planificación, ejecución y QA, BLOCKED cuando un bloqueo impide completar el proceso, y SPLIT y PENDING como extensiones locales de story-evaluation y story-acceptance
  Y incluye un ejemplo de reporte conforme para cada uno de los seis skills de validación
```

### AC-2 — Escenario alternativo — Valor heredado fuera del vocabulario
```gherkin
Esquema del escenario: Equivalencia de un valor heredado
  Dado la política publicada
  Cuando un reporte de <skill> declara el valor heredado "<heredado>"
  Entonces la política lo califica como no conforme
    Y su tabla de equivalencias indica el valor canónico "<canonico>"
Ejemplos:
  | skill             | heredado            | canonico         |
  | epic-analyze      | BLOCKED             | NEEDS-REFINEMENT |
  | story-evaluation  | REFINAR             | NEEDS-REFINEMENT |
  | story-evaluation  | RECHAZAR            | NEEDS-REFINEMENT |
  | story-code-review | needs-changes       | NEEDS-CHANGES    |
  | story-verify      | RECHAZADO           | NEEDS-CHANGES    |
  | story-acceptance  | ACCEPTANCE-REJECTED | NEEDS-CHANGES    |
  | story-acceptance  | ACCEPTANCE-BLOCKED  | BLOCKED          |
```

### AC-3 — Escenario alternativo — Vocabulario trazado a los flowcharts
```gherkin
Dado la política publicada y los flowcharts de especificación, planificación y ejecución/QA
Cuando se compara la tabla de valores permitidos por skill con las ramas "verdict" de cada flowchart
Entonces cada rama es un valor permitido para el skill que la precede
  Y ningún skill que aparece en un flowchart tiene valores permitidos fuera de sus ramas, salvo PENDING, que detiene el flujo sin rama de retorno
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Fuente única:** la política es la única definición del vocabulario. Skills, templates y README la enlazan y no repiten la lista de valores con otra redacción.
- **CNF-2 — Formato del valor:** todos los valores van en mayúsculas, separados con guion ASCII (`-`), y en inglés.
- **CNF-3 — Debe ser ejecutiva:** la política debe ser comprensible y aplicable por los Product Owners y miembros del equipo sin necesidad de interpretación adicional.
- **CNF-4 — Debe ser breve:** la política debe ser concisa y directa, evitando información redundante o innecesaria.

## Fuera de alcance (Non-Goals)

- Modificar los skills o sus templates de reporte (STORY-139 a STORY-142, STORY-144 y STORY-145).
- Crear un validador automático del contrato (lo evalúa STORY-143).
- Crear o renombrar los nodos de los flowcharts que hoy no existen (`story-refine`, `story-fix-changes`).

## 📎 Notas / contexto adicional

- **Bloquea a STORY-139…STORY-142, STORY-144 y STORY-145:** las historias de alineación por skill dependen de esta política. Esta historia no depende de ninguna otra.
- **Fuente del vocabulario:** las ramas `verdict` de `docs/architecture/diagrams/flowchart-story-specify.mermaid`, `flowchart-story-plan.mermaid` y `flowchart-story-excecution-qa.mermaid`. La política incluye la tabla de valores permitidos por skill:
  - `epic-analyze`: `APPROVED`, `NEEDS-REFINEMENT` (no tiene flowchart).
  - `story-evaluation`: `APPROVED`, `NEEDS-REFINEMENT`, `SPLIT`.
  - `story-analyze`: `APPROVED`, `NEEDS-CHANGES`.
  - `story-code-review` y `story-verify`: `APPROVED`, `NEEDS-CHANGES`, `BLOCKED`.
  - `story-acceptance`: `APPROVED`, `NEEDS-CHANGES`, `BLOCKED`, `PENDING`.
- **Semántica:**
  - `NEEDS-REFINEMENT`: un artefacto de especificación debe refinarse.
  - `NEEDS-CHANGES`: un artefacto de planificación o de implementación fue rechazado o sus pruebas fallaron; debe corregirse, y el flujo vuelve al paso que lo produjo.
  - `BLOCKED`: un bloqueo impide completar el proceso. Por ejemplo, las pruebas no se pueden ejecutar o un criterio de aceptación queda bloqueado. En el flowchart de ejecución y QA su rama vuelve al mismo gate: el flujo se detiene y, una vez despejado el bloqueo, se vuelve a ejecutar ese gate.
  - `PENDING`: la validación aún no terminó (`story-acceptance` con `session-status: partial`). No tiene rama en los flowcharts.
- **Decisiones del PO (2026-10-17):**
  - Lo que falla o se rechaza es `NEEDS-CHANGES`; lo que no se pudo evaluar por un bloqueo es `BLOCKED`.
  - Si en un mismo reporte hay a la vez algo rechazado y algo bloqueado, gana `NEEDS-CHANGES`.
  - `story-acceptance` declara `PENDING` mientras la sesión es `partial`.
  - Un hallazgo ERROR de `epic-analyze` es un defecto de la épica, no un bloqueo del proceso, así que su veredicto es `NEEDS-REFINEMENT`; `epic-analyze` deja de emitir `BLOCKED`.
- **Decisión del PO (2026-10-18):** el flowchart de ejecución y QA es la referencia vigente. Da a `BLOCKED` una rama hacia el mismo gate en `story-code-review`, `story-verify` y `story-acceptance`: significa «detente y vuelve a ejecutar el mismo gate una vez despejado el bloqueo». Por eso `story-code-review` admite `BLOCKED`, y `PENDING` es el único valor sin rama.
- **Tabla de equivalencias completa** (la política cubre todos los valores heredados):
  - `epic-analyze`: `BLOCKED`.
  - `story-evaluation`: `APROBADA`, `REFINAR`, `RECHAZAR` y `DIVIDIR`.
  - `story-code-review`: `approved` y `needs-changes`.
  - `story-verify`: el estado interno `RECHAZADO` / `REJECTED`.
  - `story-acceptance`: `ACCEPTANCE-APPROVED`, `ACCEPTANCE-REJECTED` y `ACCEPTANCE-BLOCKED`.
  - `story-analyze`: el «Estado general» `✓ Coherente` / `⚠️ Advertencias` / `❌ Inconsistencias bloqueantes`.
- **Antecedente:** `epic-analyze` ya declara `verdict` en su frontmatter, y EPIC-23 (`epic-validate`) adopta `## Veredicto` como primera sección. Conviene que la política los tome como referencia.
- **`epic-validate` (EPIC-23, decisión del PO 2026-10-17):** el skill aún no existe, pero EPIC-23 ya adopta este contrato con `APPROVED`, `NEEDS-CHANGES` (la evidencia no cumple) o `BLOCKED` (no se puede obtener la evidencia). La política incluye esa fila en su tabla de valores permitidos para que EPIC-23 la consuma.
- La política sigue las convenciones de `docs/policies/README.md` y se registra en ese índice.
- Cubre el criterio de salida de EPIC-25: **CS-1** — `docs/policies/validation-contract-policy.md` existe y describe la estructura común de reporte y el vocabulario por fase, con ejemplos para cada skill.
