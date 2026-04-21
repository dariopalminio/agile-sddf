---
alwaysApply: false
---
**Título**: Enhance Project Spec (Expansión project spec)
**Versión**: 1.0
**Estado**: Ready
**Fecha**: 2026-04-18
---
# Release 05 — Enhance Project Spec (Expansión project spec)

## Descripción

Release de expansión del pipeline de especificación de proyectos. Se incorporan nuevas capacidades: orquestación del pipeline completo en una sola sesión, story mapping según la técnica de Jeff Patton integrado como fase pre-planning, refinamiento iterativo de historias con gate anti-bucle, y centralización de templates compartidos. También se realiza una primera auto-especificación del framework SDDF mediante el skill de ingeniería inversa, generando su propio `requirement-spec.md`.

## Features

- **project-flow**: Skill orquestador que ejecuta el pipeline completo ProjectSpecFactory (Begin Intention → Discovery → Planning) en una sola sesión continua, con detección automática del estado actual y gates de revisión humana entre etapas.
- **project-story-mapping**: Nuevo skill de User Story Mapping según la técnica de Jeff Patton. Construye backbone (actividades del usuario), walking skeleton (flujo mínimo end-to-end) y release slices (MVP y versiones incrementales). Produce `docs/specs/project/story-map.md`.
- **Agente project-story-mapper**: Agente especializado en conducir la sesión interactiva de story mapping. Lee `project-intent.md` y `requirement-spec.md` si existen; puede operar con input libre si no hay documentos previos.
- **project-planning mejorado**: Integra story mapping como fase pre-planning opcional. Si `story-map.md` existe, el arquitecto lo usa como guía de agrupación de features (backbone) y estructura de releases (slices).
- **story-refine**: Nuevo skill de refinamiento iterativo de historias. Invoca al agente `story-product-owner` para evaluar, sugerir mejoras y aplicarlas en ciclos controlados con gate anti-bucle para evitar iteraciones infinitas.
- **Agente story-product-owner**: Especializado en análisis de negocio, refinamiento de redacción INVEST y mejora de criterios de aceptación Gherkin.
- **Centralización de templates**: Los templates compartidos entre múltiples skills (`story-gherkin-template.md`, `evaluation-output-template.md`, `requirement-spec-template.md`) se mueven a `docs/specs/templates/` para eliminar redundancia y garantizar una única fuente de verdad agnóstica del runtime.
- **Limpieza de directorios legacy**: Se eliminan archivos residuales de `.agents/` y `.github/` que estaban desactualizados respecto a `.claude/`.
- **Auto-especificación del framework**: Se ejecuta `/reverse-engineering` sobre el propio repositorio SDDF, generando `docs/specs/project/requirement-spec.md` con 30 FRs, 13 NFRs, árbol de navegación ASCII y sección de gaps identificados.
