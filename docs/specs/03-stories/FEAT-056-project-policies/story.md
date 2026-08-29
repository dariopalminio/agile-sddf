---
alwaysApply: false
type: story
id: FEAT-056
slug: FEAT-056-project-policies
title: "Project policies"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-06
updated: 2026-05-06
related:
  - EPIC-12-story-sdd-workflow
---
**FINVEST Score:** —
**FINVEST Decisión:** —
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]


# 📖 Historia: Project policies

**Como** Tech Lead o desarrollador que configura un proyecto SDDF  
**Quiero** ejecutar un skill `project-policies-generation` que genere los documentos de políticas y constitución del proyecto (`constitution.md` y `definition-of-done-story.md`)  
**Para** centralizar en el repositorio las reglas técnicas y acuerdos de equipo que guiarán el diseño e implementación de todas las historias

## ✅ Criterios de aceptación

### Escenario principal – Generación de documentos de políticas cuando no existen
```gherkin
Dado que estoy en la raíz de un proyecto SDDF
  Y los archivos $SPECS_BASE/policies/constitution.md y $SPECS_BASE/policies/definition-of-done-story.md NO existen
Cuando ejecuto el skill `project-policies-generation`
Entonces el skill crea $SPECS_BASE/policies/constitution.md a partir del template $SPECS_BASE/specs/templates/project-constitution-template.md
  Y crea $SPECS_BASE/policies/definition-of-done-story.md con la estructura definida en el template correspondiente
  Y ambos archivos contienen un frontmatter válido con los campos requeridos para el workflow de story
```

### Escenario alternativo / error – Los archivos de políticas ya existen
```gherkin
Dado que $SPECS_BASE/policies/constitution.md y $SPECS_BASE/policies/definition-of-done-story.md ya existen
Cuando ejecuto el skill `project-policies-generation`
Entonces el skill abre los archivos existentes para edición en lugar de crearlos desde cero
  Pero no sobreescribe el contenido existente sin confirmación del usuario
```

### Escenario alternativo / error – Template de constitución no encontrado
```gherkin
Dado que el archivo $SPECS_BASE/specs/templates/project-constitution-template.md no existe
Cuando ejecuto el skill `project-policies-generation`
Entonces el skill muestra un mensaje de error indicando que el template no fue encontrado
  Y no crea ningún archivo de política
  Pero sugiere ejecutar `sddf-init` para inicializar la estructura base
```

### Requirement: Integración con CLAUDE.md / AGENTS.md
Los archivos de políticas deben referenciarse desde `CLAUDE.md` o `AGENTS.md` usando la sintaxis `@` para que los agentes IA los lean automáticamente antes de cualquier acción en el proyecto.

### Requirement: Nombre del skill
El skill debe llamarse `project-policies-generation` para reflejar claramente su función de generar las políticas del proyecto.

## Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

## Requerimiento: skill-master
Usar en la creación del skill el skill `skill-master` para asegurar que el nuevo skill siga los estándares de estructura, documentación y funcionalidad definidos para los skills en SDDF. Esto incluye la generación de un README.md con la descripción del skill, sus comandos, ejemplos de uso y cualquier configuración necesaria. Además, el skill debe incluir pruebas unitarias para validar su correcto funcionamiento y manejo de errores. El uso de `skill-master` garantiza que el skill `project-policies-generation` esté bien diseñado, documentado y sea fácil de mantener a largo plazo.

## Requerimiento: Inicializar políticas del proyecto
Agregar un paso de "Inicializar políticas del proyecto (opcional)" en skills/sddf-init/SKILL.md.  Inicializar políticas del proyecto: pregunta (s/n) al usuario y, si acepta, invoca project-policies-generation antes de continuar. Si rechaza, registra [OMITIDO] en el informe. Paso 5 → Paso 6 (Informe final): renumerado; el ejemplo de informe ahora incluye las entradas de constitution.md y definition-of-done-story.md.

## ⚙️ Criterios no funcionales

* Coherencia: los archivos generados deben estar versionados en el repositorio (no en .gitignore)
* Portabilidad: el skill debe funcionar con cualquier cliente IA compatible con SDDF (Claude, Cursor, Codex)
* Mantenibilidad: la estructura del documento la define el template en tiempo de ejecución, no el skill

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: EPIC-12-story-sdd-workflow  
Feature origen: FEAT-056 — Project policies

El principio guía es "el repositorio como sistema": las políticas están dentro del repo, versionadas y accesibles para todos los agentes. Todo lo que un agente necesita para entender "cómo trabajamos" debe estar en `policies/`.
