---
alwaysApply: false
type: story
id: STORY-105
kind: chore
slug: STORY-105-migrar-stakeholders-y-requisitos
title: "Migrar project.md a product/stakeholders.md y requirements/"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-07
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-104-migrar-project-intent-a-vision
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]
[[STORY-104-migrar-project-intent-a-vision]]

# 📖 Historia: Migrar `project.md` a `product/stakeholders.md` y `requirements/`

**Como** Product Owner o mantenedor de SDDF que consulta, cita o actualiza un requisito del framework  
**Quiero** encontrar los perfiles de usuario en `docs/product/stakeholders.md` y cada requisito funcional y no funcional como documento propio en `docs/requirements/`  
**Para** que una historia pueda declarar `implements: [FR-NNN]` apuntando a un requisito concreto en lugar de a un documento de 1264 líneas, y que cada requisito tenga una única fuente de verdad

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Los perfiles de usuario pasan a stakeholders
```gherkin
Dado que la sección "1.8. Características de los Usuarios" de "docs/specs/01-projects/PROJ-01-agile-sddf/project.md" define los perfiles US-001 a US-006
  Y la sección "Usuarios y roles" de "docs/product/stakeholders.md" solo contiene un marcador "[Por completar"
Cuando el mantenedor migra los perfiles de usuario
Entonces "Usuarios y roles" de "docs/product/stakeholders.md" contiene los seis perfiles con su ID, nombre y descripción originales
  Pero "Patrocinadores y decisores" e "Intereses y conflictos" conservan su marcador "[Por completar" porque "project.md" no tiene contenido de origen para ellas
```

### AC-2 — Escenario principal – Un documento por requisito, con los IDs originales
```gherkin
Dado que la sección "2.1 Requisitos Funcionales" de "project.md" define 53 requisitos (FR-001 a FR-054, sin FR-049)
  Y la sección "2.2. Requisitos No Funcionales" define 24 requisitos (NFR-001 a NFR-024)
Cuando el mantenedor migra los requisitos
Entonces "docs/requirements/functional/" contiene 53 archivos "FR-NNN-<slug>.md", uno por requisito y con el mismo ID
  Y "docs/requirements/non-functional/" contiene 24 archivos "NFR-NNN-<slug>.md", uno por requisito y con el mismo ID
  Y cada archivo conserva la descripción, la prioridad, los usuarios, la fuente y la categoría de origen del requisito
  Y no existe ningún archivo "FR-049-*"
```

### AC-3 — Escenario alternativo – Sin duplicación mientras `project.md` siga existiendo
```gherkin
Dado que "project.md" no se elimina en esta historia
Cuando se completa la migración
Entonces las secciones "1.8. Características de los Usuarios", "2.1 Requisitos Funcionales" y "2.2. Requisitos No Funcionales" de "project.md" quedan reemplazadas por enlaces a "[[stakeholders]]" y "[[requirements-index]]"
  Y ningún FR, NFR ni perfil US queda con su contenido escrito tanto en "project.md" como en su nuevo hogar
  Y "memory-system check" no reporta errores en "docs/product/" ni en "docs/requirements/"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin pérdida semántica:** el contenido de cada requisito y perfil se traslada literalmente; solo cambia el formato del contenedor (encabezados, frontmatter). Ningún requisito se resume, fusiona ni reescribe.
- **CNF-2 — Navegabilidad:** `docs/requirements/README.md` permite llegar a los 77 requisitos agrupados por categoría de origen, y `docs/index.md` (regenerado) lista `requirements/` sin enlaces rotos.
- **CNF-3 — Encoding:** todos los archivos creados o modificados quedan en UTF-8 sin BOM, sin caracteres corruptos (`Ã³`, `ðŸ“–`).

## Fuera de alcance (Non-Goals)

- **Eliminar `project.md`** y reubicar las secciones que [[ADR-0013-eliminar-specs-01-projects]] no asigna (§1.1–1.7, §2.3, §3 UI/UX, §4 stack tecnológico, §11 referencias, §12 glosario, Apéndices A y B). Requiere una nueva historia de EPIC-21 ("Reubicar las secciones restantes de `project.md` y eliminarlo"), que no está en el listado actual de la épica.
- Reescribir los requisitos para reflejar la estructura de dos niveles (por ejemplo, FR-001 menciona `01-projects/`): se actualizan en las historias de skills y documentación de EPIC-21.
- Agregar `implements: [FR-NNN]` a épicas o historias existentes.
- Crear un template de requisito en `docs/templates/` o cambiar skills (`project-discovery`, `reverse-engineering`) para que escriban en `requirements/`: lo cubre "Actualizar skills que referencian rutas de `specs/`".

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] decide "stakeholders de `project.md` → `docs/product/stakeholders.md`" y "FR/NFR → `requirements/functional/FR-NNN-*.md` + `requirements/non-functional/NFR-NNN-*.md`". `docs/requirements/README.md` ya fija esa convención de nombres y la regla de IDs únicos.
- **Formato de origen:** cada requisito es un ítem `- **FR-NNN**: <título>` con los campos `Descripción`, `Prioridad`, `Usuario` (IDs US-NNN) y `Fuente` (skill · STORY · EPIC), agrupados en 9 subsecciones funcionales (2.1.1–2.1.9) y 10 no funcionales (2.2.1–2.2.10).
- **Hueco en la numeración:** FR-049 no existe en `project.md`. Se conserva el hueco: renumerar rompería las referencias `FR-NNN` en `docs/architecture/memory-system.md`, `docs/domains/domain-knowledge-artifacts.md` y en historias anteriores.
- **Relación con STORY-104:** son independientes. STORY-104 trabaja con `project-intent.md` y la línea `related`/wikilink de `project.md` hacia él; esta historia trabaja con §1.8 y §2. Ambas tocan `project.md`, pero en secciones distintas.
