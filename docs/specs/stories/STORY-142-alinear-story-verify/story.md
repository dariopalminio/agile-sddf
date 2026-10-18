---
alwaysApply: false
type: story
id: STORY-142
kind: feat
slug: STORY-142-alinear-story-verify
title: "Alinear story-verify"
status: IMPLEMENT
substatus: DONE
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-18
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Alinear story-verify

**Como** mantenedor de Agile-SDDF que usa `story-verify` como gate antes de ACCEPTANCE en un pipeline CI  
**Quiero** que `verify-report.md` declare un veredicto explícito (`APPROVED`, `NEEDS-CHANGES` o `BLOCKED`) en su frontmatter y en una sección `## Veredicto` al inicio  
**Para** que el pipeline lea el resultado de la verificación sin interpretar el resumen de pruebas ni los mensajes de consola

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Veredicto explícito según el resultado de la verificación
```gherkin
Esquema del escenario: Veredicto explícito según el resultado de la verificación
  Dado una historia implementada cuya verificación termina con <resultado>
  Cuando el mantenedor ejecuta /story-verify sobre la historia
  Entonces verify-report.md tiene "## Veredicto" como primera sección tras el título con el valor <verdict>
    Y el frontmatter declara "verdict: <verdict>"
Ejemplos:
  | resultado                                          | verdict       |
  | todos los criterios DoD VERIFY aprobados           | APPROVED      |
  | defectos CRITICAL o HIGH, o algún criterio fallido | NEEDS-CHANGES |
  | pruebas no ejecutables en el entorno               | BLOCKED       |
```

### AC-2 — Escenario alternativo — Sin vocabulario de rechazo
```gherkin
Dado una verificación con defectos CRITICAL sin resolver
Cuando story-verify termina
Entonces la salida en consola y verify-report.md informan el veredicto NEEDS-CHANGES
  Pero ni el reporte ni la salida contienen RECHAZAR, RECHAZADO ni REJECTED
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Legible por máquinas:** el veredicto está siempre en el campo `verdict` del frontmatter, también cuando no se ejecutó ninguna prueba.

## Fuera de alcance (Non-Goals)

- Cambiar la detección de modo (unit/e2e/manual) o los comandos de `sddf.config.yaml`.
- Cambiar los criterios del DoD VERIFY.

## 📎 Notas / contexto adicional

- **Estado actual:** `skills/story-verify/assets/verify-report-template.md` no tiene campo de veredicto. El resultado se calcula con `$VERIFY_RECHAZADO` (SKILL.md, línea 472), se muestra como `⚠️ VERIFY RECHAZADO` y deja story.md en `READY-FOR-IMPLEMENT/DONE (REJECTED)`.
- **Decisión de la épica:** `RECHAZAR` se reemplaza por `NEEDS-CHANGES`, porque en VERIFY el artefacto ya existe y un fallo se resuelve iterando. Hay que revisar si la etiqueta `(REJECTED)` de la transición de story.md también pasa a `NEEDS-CHANGES`, sin cambiar la transición en sí.
- **Flowchart:** en `docs/architecture/diagrams/flowchart-story-excecution-qa.mermaid`, `story-verify` tiene las ramas `APPROVED` (pasa a `story-acceptance`) y `NEEDS-CHANGES` (vuelve a implementar). `BLOCKED` no es una rama: detiene el flujo hasta que se resuelva el bloqueo.
- **Decisión del PO (2026-10-17):** cuando las pruebas no pueden ejecutarse, el veredicto es `BLOCKED`, porque un bloqueo impide el proceso. Los defectos y los criterios fallidos son `NEEDS-CHANGES`. Si hay fallos y bloqueos a la vez, gana `NEEDS-CHANGES`.
- **Consumidores:** hoy `skills/story-implement/` **no** reconoce `verify-report.md` como señal de rework; solo `fix-directives.md` la activa. Construir el bucle `NEEDS-CHANGES` → implementar está fuera del alcance de esta épica.
- **Dependencias:** depende de STORY-138. Puede ejecutarse en paralelo con STORY-139, STORY-140, STORY-141, STORY-144 y STORY-145.
- Cubre el criterio de salida de EPIC-25: **CS-8** — `story-verify` produce un veredicto explícito `APPROVED` | `NEEDS-CHANGES` | `BLOCKED`, sin `RECHAZAR`, `RECHAZADO` ni `REJECTED`. Verifica SMOKE-2.
