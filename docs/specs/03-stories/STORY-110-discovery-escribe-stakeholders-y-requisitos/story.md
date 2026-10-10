---
alwaysApply: false
type: story
id: STORY-110
kind: feat
slug: STORY-110-discovery-escribe-stakeholders-y-requisitos
title: "project-discovery y reverse-engineering escriben stakeholders y requisitos individuales"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-109-project-begin-escribe-vision
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# ðŸ“– Historia: `project-discovery` y `reverse-engineering` escriben stakeholders y requisitos individuales

**Como** desarrollador o Product Owner que especifica los requisitos de un proyecto con `/project-discovery`, o que los extrae de un repositorio existente con `/reverse-engineering`  
**Quiero** que los perfiles de usuario queden en `docs/product/stakeholders.md` y cada requisito funcional y no funcional en su propio archivo de `docs/requirements/`  
**Para** que las historias puedan declarar `implements: [FR-NNN]` sobre requisitos concretos desde el momento en que se especifican, en lugar de partir de un `project.md` monolÃ­tico que luego hay que trocear

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ Discovery reparte su resultado en las capas
```gherkin
Dado que "docs/product/vision.md" tiene "substatus: DONE"
  Y "docs/requirements/functional/" y "docs/requirements/non-functional/" estÃ¡n vacÃ­os
Cuando el desarrollador completa "/project-discovery" y confirma el resultado
Entonces "Usuarios y roles" de "docs/product/stakeholders.md" contiene los perfiles identificados
  Y cada requisito funcional existe como "docs/requirements/functional/FR-NNN-<slug>.md" y cada no funcional como "docs/requirements/non-functional/NFR-NNN-<slug>.md"
  Y no se crea ningÃºn "project.md" ni el directorio "docs/specs/01-projects/"
```

### AC-2 â€” Escenario alternativo â€“ Requisitos existentes se respetan
```gherkin
Dado que "docs/requirements/functional/" ya contiene requisitos hasta "FR-054"
Cuando "/project-discovery" o "/reverse-engineering --update" identifica requisitos funcionales nuevos
Entonces el primer requisito nuevo recibe el ID "FR-055" y los siguientes continÃºan la secuencia
  Pero ningÃºn archivo "FR-*" o "NFR-*" existente se sobrescribe sin confirmaciÃ³n explÃ­cita del usuario
```

### AC-3 â€” Escenario de error â€“ Discovery sin visiÃ³n terminada
```gherkin
Dado que "docs/product/vision.md" no tiene "substatus: DONE"
Cuando el desarrollador ejecuta "/project-discovery"
Entonces el skill se detiene sin escribir en "docs/product/" ni en "docs/requirements/"
  Y muestra un mensaje que indica ejecutar primero "/project-begin"
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Sin rutas del modelo de proyectos:** "01-projects", "project.md" (como destino) y "PROJ-" no aparecen en `skills/project-discovery/`, `skills/reverse-engineering/`, `agents/project-architect.agent.md`, `agents/project-ux.agent.md` ni `agents/reverse-engineer-synthesizer.agent.md`; los evals de ambos skills pasan con `npm run test:eval`.
- **CNF-2 â€” Templates como Ãºnica fuente de estructura:** la estructura de `stakeholders.md`, de un FR y de un NFR se deriva en runtime de templates en `docs/templates/`, que reemplazan a `project-template.md`.
- **CNF-3 â€” Encoding:** todo archivo escrito queda en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- `project-planning`, que hoy lee `project.md`: STORY-111.
- `project-context-diagram --from-files`, que hoy lee `project.md`: STORY-112.
- Migrar el `project.md` existente de este repositorio: STORY-105.
- `reverse-engineering` sin `--update` sobre un repo que ya tiene requisitos: conserva el comportamiento actual de confirmaciÃ³n antes de escribir.

## ðŸ“Ž Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] (stakeholders â†’ `product/stakeholders.md`; FR/NFR â†’ `requirements/functional/` y `requirements/non-functional/`). La convenciÃ³n de nombres e IDs Ãºnicos ya estÃ¡ en `docs/requirements/README.md`.
- **DecisiÃ³n abierta â€” secciones de `project.md` sin hogar:** hoy discovery (con `project-ux`) y el sintetizador de `reverse-engineering` tambiÃ©n producen UI/UX (design vibe, mapas de navegaciÃ³n, wireframes), stack tÃ©cnico, glosario y referencias. [[ADR-0013-eliminar-specs-01-projects]] no les asigna destino; es la misma decisiÃ³n que necesita la historia pendiente "Reubicar las secciones restantes de `project.md` y eliminarlo". Hay que cerrarla antes de pasar esta historia a PLAN.
- **Mayor cambio de formato del pipeline:** de un documento a N archivos. `reverse-engineering` sintetiza hoy con `reverse-engineer-synthesizer` rellenando el template secciÃ³n por secciÃ³n; ahora debe emitir un archivo por requisito.
- **ResoluciÃ³n de proyecto:** desaparece la bÃºsqueda de `PROJ-NN` activo en `01-projects/` (en `reverse-engineering`, la creaciÃ³n automÃ¡tica de `PROJ-01-<nombre>`).
- **Independencia:** se apoya en `vision.md` como precondiciÃ³n, no en STORY-109. Funciona con cualquier `vision.md` en `DONE`, incluido el que deja STORY-104.
