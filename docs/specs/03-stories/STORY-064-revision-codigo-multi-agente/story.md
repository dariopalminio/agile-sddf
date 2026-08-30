---
alwaysApply: false
type: story
id: STORY-064
kind: feat
slug: STORY-064-revision-codigo-multi-agente
title: "Skill story-code-review: revisión multi-agente aprobada del código implementado"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
  - STORY-065-revision-con-bloqueantes
  - STORY-066-revision-validacion-precondiciones
---
**FINVEST Score:** [FINVEST Score]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]
[[STORY-065-revision-con-bloqueantes]]
[[STORY-066-revision-validacion-precondiciones]]

# 📖 Historia: Skill story-code-review — revisión multi-agente aprobada del código implementado

**Como** desarrollador o tech lead que acaba de ejecutar `/story-implement` en una historia de usuario  
**Quiero** ejecutar una revisión multi-agente del código implementado y obtener aprobación cuando no hay bloqueantes  
**Para** confirmar que la implementación cumple los criterios de aceptación de `story.md` y la arquitectura de `design.md` antes de marcar la historia como Done

## ✅ Criterios de aceptación

### Escenario principal – Revisión aprobada y transición a READY-FOR-VERIFY
```gherkin
Dado que existen "story.md", "design.md" e "implement-report.md" en "docs/specs/stories/STORY-NNN/"
Cuando ejecuto "/story-code-review STORY-NNN" y ningún revisor detecta problemas de severidad HIGH o MEDIUM
Entonces el skill genera "docs/specs/stories/STORY-NNN/code-review-report.md" con review-status: approved
  Y el frontmatter de "story.md" se actualiza a status: READY-FOR-VERIFY y substatus: DONE
```

### Escenario con datos (Scenario Outline) – Decisión aprobada según severidad máxima
```gherkin
Escenario: Decisión final cuando no hay bloqueantes
  Dado que los tres revisores detectan problemas con severidad máxima "<severidad>"
  Cuando el árbitro consolida los informes
  Entonces el review-status es "approved"
    Y no se genera "fix-directives.md"
Ejemplos:
  | severidad |
  | LOW       |
  | ninguna   |
```

### Requirement: Tres agentes especializados ejecutados en paralelo
El skill invoca exactamente tres subagentes en paralelo, cada uno con foco exclusivo:
- **Inspector de Código (Tech-Lead-Reviewer):** revisa calidad, legibilidad, duplicación y seguridad del código fuente contra `constitution.md` y `definition-of-done-story.md`
- **Guardián de Requisitos (Product-Owner-Reviewer):** verifica que cada escenario Gherkin de `story.md` tiene correspondencia directa en el código
- **Inspector de Integración (Integration-Reviewer):** valida que los componentes respetan la arquitectura de `design.md`

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

### Requirement: Modos de Ejecución
Debe incluir inicialmente la sección “## Modos de Ejecución” con los modos **Modo manual** y **Modo Agent**.

## ⚙️ Criterios no funcionales

* Rendimiento: la revisión completa de una historia con ≤10 archivos modificados debe completarse en menos de 3 minutos
* Idempotencia: ejecutar el skill dos veces sobre el mismo código produce el mismo `code-review-report.md`
* Compatibilidad: agnóstico al stack tecnológico; opera sobre artefactos Markdown y rutas de archivos sin asumir lenguaje de programación específico
* Trazabilidad: cada hallazgo en `code-review-report.md` incluye referencia exacta (archivo:línea) y dimensión de revisión

## 📎 Notas / contexto adicional

El skill se integra en el workflow SDD entre `/story-implement` y la marca final de Done. Los informes parciales de cada agente se escriben en `.tmp/story-code-review/` antes de la consolidación, siguiendo el principio de evitar el "teléfono descompuesto" (Principio 6 de `constitution.md`).

Flag opcional `--single-agent` disponible para historias muy pequeñas (≤3 archivos modificados). El flujo por defecto es siempre el equipo de tres agentes.

Historias relacionadas del split:
- STORY-065: flujo de revisión con problemas bloqueantes (HIGH/MEDIUM → fix-directives)
- STORY-066: validación de precondiciones (artefactos requeridos ausentes)
