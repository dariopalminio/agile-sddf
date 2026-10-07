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

# 📖 Historia: `project-discovery` y `reverse-engineering` escriben stakeholders y requisitos individuales

**Como** desarrollador o Product Owner que especifica los requisitos de un proyecto con `/project-discovery`, o que los extrae de un repositorio existente con `/reverse-engineering`  
**Quiero** que los perfiles de usuario queden en `docs/product/stakeholders.md` y cada requisito funcional y no funcional en su propio archivo de `docs/requirements/`  
**Para** que las historias puedan declarar `implements: [FR-NNN]` sobre requisitos concretos desde el momento en que se especifican, en lugar de partir de un `project.md` monolítico que luego hay que trocear

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Discovery reparte su resultado en las capas
```gherkin
Dado que "docs/product/vision.md" tiene "substatus: DONE"
  Y "docs/requirements/functional/" y "docs/requirements/non-functional/" están vacíos
Cuando el desarrollador completa "/project-discovery" y confirma el resultado
Entonces "Usuarios y roles" de "docs/product/stakeholders.md" contiene los perfiles identificados
  Y cada requisito funcional existe como "docs/requirements/functional/FR-NNN-<slug>.md" y cada no funcional como "docs/requirements/non-functional/NFR-NNN-<slug>.md"
  Y no se crea ningún "project.md" ni el directorio "docs/specs/01-projects/"
```

### AC-2 — Escenario alternativo – Requisitos existentes se respetan
```gherkin
Dado que "docs/requirements/functional/" ya contiene requisitos hasta "FR-054"
Cuando "/project-discovery" o "/reverse-engineering --update" identifica requisitos funcionales nuevos
Entonces el primer requisito nuevo recibe el ID "FR-055" y los siguientes continúan la secuencia
  Pero ningún archivo "FR-*" o "NFR-*" existente se sobrescribe sin confirmación explícita del usuario
```

### AC-3 — Escenario de error – Discovery sin visión terminada
```gherkin
Dado que "docs/product/vision.md" no tiene "substatus: DONE"
Cuando el desarrollador ejecuta "/project-discovery"
Entonces el skill se detiene sin escribir en "docs/product/" ni en "docs/requirements/"
  Y muestra un mensaje que indica ejecutar primero "/project-begin"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin rutas del modelo de proyectos:** "01-projects", "project.md" (como destino) y "PROJ-" no aparecen en `skills/project-discovery/`, `skills/reverse-engineering/`, `agents/project-architect.agent.md`, `agents/project-ux.agent.md` ni `agents/reverse-engineer-synthesizer.agent.md`; los evals de ambos skills pasan con `npm run test:eval`.
- **CNF-2 — Templates como única fuente de estructura:** la estructura de `stakeholders.md`, de un FR y de un NFR se deriva en runtime de templates en `docs/templates/`, que reemplazan a `project-template.md`.
- **CNF-3 — Encoding:** todo archivo escrito queda en UTF-8 sin BOM.

## Fuera de alcance (Non-Goals)

- `project-planning`, que hoy lee `project.md`: STORY-111.
- `project-context-diagram --from-files`, que hoy lee `project.md`: STORY-112.
- Migrar el `project.md` existente de este repositorio: STORY-105.
- `reverse-engineering` sin `--update` sobre un repo que ya tiene requisitos: conserva el comportamiento actual de confirmación antes de escribir.

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] (stakeholders → `product/stakeholders.md`; FR/NFR → `requirements/functional/` y `requirements/non-functional/`). La convención de nombres e IDs únicos ya está en `docs/requirements/README.md`.
- **Decisión abierta — secciones de `project.md` sin hogar:** hoy discovery (con `project-ux`) y el sintetizador de `reverse-engineering` también producen UI/UX (design vibe, mapas de navegación, wireframes), stack técnico, glosario y referencias. [[ADR-0013-eliminar-specs-01-projects]] no les asigna destino; es la misma decisión que necesita la historia pendiente "Reubicar las secciones restantes de `project.md` y eliminarlo". Hay que cerrarla antes de pasar esta historia a PLAN.
- **Mayor cambio de formato del pipeline:** de un documento a N archivos. `reverse-engineering` sintetiza hoy con `reverse-engineer-synthesizer` rellenando el template sección por sección; ahora debe emitir un archivo por requisito.
- **Resolución de proyecto:** desaparece la búsqueda de `PROJ-NN` activo en `01-projects/` (en `reverse-engineering`, la creación automática de `PROJ-01-<nombre>`).
- **Independencia:** se apoya en `vision.md` como precondición, no en STORY-109. Funciona con cualquier `vision.md` en `DONE`, incluido el que deja STORY-104.
