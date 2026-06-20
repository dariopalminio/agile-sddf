---
alwaysApply: false
type: release
id: EPIC-18
slug: complete-flow
title: "Complete Flow — Skills para el Workflow de Story y Release"
status: DEVELOP
substatus: IN-PROGRESS
parent: null
created: 2026-06-14
updated: 2026-06-14
related:
  - plan-01-deliver-status
  - plan-02-epic-workflow-definition
  - plan-03-lazy-assignment-of-feat-ids
  - plan-04-doc-story-implement
  - plan-05-enhance-code-review
  - plan-06-isolate-workspace-by-story
  - plan-07-fix_code_generators_of_story-implement
  - plan-08-move-skills-to-the-root
---

# Release/Epic: Complete Flow — Skills para el Workflow de Story y Release

## Descripción
Este release añade al framework las capacidades de bulk y orquestacion de flujo completo que faltan: ejecutar `story-plan` e `story-implement` sobre multiples historias en lote, un skill que orquesta el ciclo completo de un release de punta a punta, y herramientas de inspeccion y actualizacion masiva de status. Resuelve el cuello de botella de tener que invocar skills uno a uno cuando se trabaja con releases de 5+ historias.

## Features 

- [x] PLAN-01 - **Renombrar INTEGRATION → DELIVER en el workflow de story:** reemplazar INTEGRATION por DELIVER en el workflow de story. Usa DELIVER como nombre de integration, y actualiza todas las referencias correspondientes en el código y la documentación. El término DELIVER puede servir para un incremento potencialmente entregable (para modelo batch) como para un incremento entregado al usuario final (para continuous).

- [x] PLAN-02 - **Definir workflow canónico de Épica/Release:** definir nuevo workflow para épicas/release: DEFINE → PLAN → READY-FOR-DEV → DEVELOP → VALIDATE → SHIP → COMPLETED.

- [x] PLAN-03 - **Asignación lazy de FEAT IDs**: mover la asignación de FEAT IDs al momento real de creación de directorios de historia (`release-generate-stories`). El `release.md` describe features **sin ID**; el ID se asigna y se escribe en `release.md` recién cuando `release-generate-stories` crea los directorios.

- [x] PLAN-04 - **Mejorar documentación de story-implement:** actualizar la documentación de `story-implement` para reflejar correctamente la exposición de variables y la configuración de `code_generators` por capas (frontend/backend).

- [x] PLAN-05 - **Incorporar mejoras a `story-code-review`:** identificar prácticas valiosas que falten en nuestro skill, y diseñar un plan de integración de esas prácticas (performance, estándar de aprobación, disciplina de dependencias, tamaño de cambio, código muerto) dentro de la estructura actual de subagentes y orquestación, asegurando coherencia y sin introducir complejidad innecesaria.

- [x] PLAN-06 - **Aislar espacio de trabajo por historia:** modificar las rutas de archivos intermedios generados por skills (en `story-implement`, `story-code-review`, `security-audit`, `story-verify`) para incluir `{story_id}`, evitando colisiones cuando múltiples agentes ejecutan el skill simultáneamente sobre historias distintas. Esto asegura que cada historia tenga su propio espacio de trabajo aislado, manteniendo la integridad de los datos y el flujo de trabajo. Esto habilita escalabilidad para trabajo en paralelo.

- [x] PLAN-07 - **Corregir desincronización en code_generators de story-implement:** sincronizar la configuración de `code_generators` entre `sddf.config.yaml`, `SKILL.md` y la implementación real del skill para evitar invocaciones innecesarias de generadores de código en capas no existentes.

- [x] PLAN-08 - **Mover los skills a la raíz:** Anteriormente los skills se localizaban, en este proyecto, en: .claude\skillsAhora se localizan en: skillsAntes los agentes se localizaban en:. claude\agentsAhora se localizan en: agentsDebido a este cambio es necesario actualizar las ubicaciones de origen en los scripts de instalación.

