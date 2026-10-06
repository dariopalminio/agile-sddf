---
alwaysApply: false
type: story
id: STORY-109
kind: feat
slug: STORY-109-project-begin-escribe-vision
title: "project-begin escribe la intención en product/vision.md"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-104-migrar-project-intent-a-vision
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: `project-begin` escribe la intención en `product/vision.md`

**Como** desarrollador que inicia un proyecto con `/project-begin`  
**Quiero** que la entrevista de intención complete directamente `docs/product/vision.md`  
**Para** que la visión de mi producto viva en un único documento desde el primer día, sin crear un `specs/01-projects/PROJ-NN/project-intent.md` paralelo que después haya que reconciliar

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – La entrevista completa la visión
```gherkin
Dado un repositorio cuyo "docs/product/vision.md" solo contiene marcadores "[Por completar"
  Y no existe "docs/specs/01-projects/"
Cuando el desarrollador completa la entrevista de "/project-begin" y confirma el resultado
Entonces "docs/product/vision.md" tiene completas todas las secciones del template de visión y "substatus: DONE"
  Y no se crea "docs/specs/01-projects/" ni ningún directorio "PROJ-*"
```

### AC-2 — Escenario alternativo – Retoma según el estado de la visión
```gherkin
Escenario: "/project-begin" sobre una visión existente
  Dado que "docs/product/vision.md" tiene "substatus: <substatus>"
  Cuando el desarrollador ejecuta "/project-begin"
  Entonces el skill <comportamiento>
Ejemplos:
  | substatus   | comportamiento                                                                             |
  | TODO        | conduce la entrevista completa                                                             |
  | IN-PROGRESS | pregunta solo las secciones que conservan un marcador "[Por completar" o un placeholder     |
  | DONE        | ofrece "Actualizar" o "Cancelar" y no modifica el archivo hasta que el desarrollador elija |
```

### AC-3 — Escenario de cierre – Sin rastro del modelo de proyectos
```gherkin
Dado que el cambio está aplicado
Cuando se buscan "01-projects", "project-intent" y "PROJ-" en "skills/project-begin/" y "agents/project-pm.agent.md"
Entonces no aparece ninguna coincidencia
  Y los evals de "project-begin" pasan con "npm run test:eval"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Template como única fuente de estructura:** las preguntas de la entrevista se derivan en runtime del template de visión, igual que hoy se derivan de `project-intent-template.md`.
- **CNF-2 — Encoding:** `vision.md` se escribe en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- Cambiar la etapa siguiente del pipeline (`project-discovery`) o el orquestador (`project-flow`): STORY-110 y STORY-113.
- Que `memory-system scaffold` siembre `vision.md` con la nueva estructura: "Actualizar scaffolding de `memory-system`".
- Migrar el `project-intent.md` existente de este repositorio: STORY-104.

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] (`project-intent.md` → `product/vision.md`) y la decisión de STORY-108 de dejar en esta historia solo la reubicación semántica de los outputs de `project-*`.
- **Template de visión:** `docs/templates/project-intent-template.md` (y su seed `skills/project-begin/assets/project-intent-template.md`) se reemplaza por un template de visión. Su estructura debe coincidir con la que STORY-104 deja en `vision.md` y con la semilla de `memory-system`, para no reintroducir dos estructuras de visión. El nombre exacto del template se decide en diseño.
- **Desaparece la resolución de proyecto activo:** hoy `project-begin` busca en `01-projects/` un `PROJ-NN` con `substatus: IN-PROGRESS` (WIP=1) o deriva uno nuevo del título. Con un solo proyecto por raíz `docs/`, el `substatus` de `vision.md` cumple ese papel (AC-2).
- **Agente afectado:** `project-pm` (12 referencias a `01-projects`).
