---
alwaysApply: false
type: story
id: STORY-108
kind: chore
slug: STORY-108-renombrar-specs-sin-prefijos
title: "Renombrar specs/02-epics/ → specs/epics/ y specs/03-stories/ → specs/stories/"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-07
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-104-migrar-project-intent-a-vision
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-106-migrar-plan-a-roadmap
  - STORY-107-migrar-story-map-y-diagrama-contexto
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: Renombrar `specs/02-epics/` → `specs/epics/` y `specs/03-stories/` → `specs/stories/`

**Como** mantenedor de SDDF que navega, crea o referencia épicas e historias  
**Quiero** que las épicas vivan en `docs/specs/epics/` y las historias en `docs/specs/stories/`, y que todo skill, agente, test y documento vivo del framework use esas rutas  
**Para** que `specs/` sea consistente con el resto de capas de `docs/` (sin prefijos numéricos, que perdieron su ancla al desaparecer `01-projects/`) sin dejar en ningún momento un skill apuntando a una carpeta inexistente

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Carpetas renombradas sin pérdida
```gherkin
Dado que "docs/specs/02-epics/" contiene 22 directorios "EPIC-*" y "docs/specs/03-stories/" contiene los directorios "STORY-*" existentes
Cuando el mantenedor aplica el renombrado
Entonces existen "docs/specs/epics/" y "docs/specs/stories/" con el mismo número de directorios y archivos que tenían las carpetas originales
  Y no existen "docs/specs/02-epics/" ni "docs/specs/03-stories/"
  Y git registra cada archivo movido como renombrado, conservando su historial
```

### AC-2 — Escenario principal – Ninguna referencia viva queda en la ruta vieja
```gherkin
Dado que el renombrado de AC-1 está aplicado
Cuando se buscan las cadenas "02-epics" y "03-stories" en "skills/", "agents/", "test/", "scripts/", "README.md", "AGENTS.md" y los documentos vivos de "docs/"
Entonces no aparece ninguna coincidencia
  Y "npm test" termina con exit code 0
  Y "/skill-preflight" sobre este repositorio devuelve "OK"
```

### AC-3 — Escenario alternativo – `01-projects/` se elimina solo si ya está vacía
```gherkin
Escenario: tratamiento de "docs/specs/01-projects/" al cerrar el renombrado
  Dado que "docs/specs/01-projects/" contiene <archivos>
  Cuando el mantenedor completa el renombrado
  Entonces "docs/specs/01-projects/" <resultado>
    Y "/skill-preflight" no exige "specs/01-projects/" para devolver "OK"
Ejemplos:
  | archivos                                   | resultado                                                    |
  | ningún archivo                             | ya no existe                                                 |
  | "PROJ-01-agile-sddf/project.md" y otros    | se conserva intacta y los archivos restantes se listan en el informe de la historia |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Atomicidad:** el renombrado de carpetas y la actualización de referencias se integran en un único cambio, de modo que ningún commit de `main` deja a un skill apuntando a una ruta inexistente.
- **CNF-2 — Wikilinks intactos:** como los wikilinks resuelven por slug, `memory-system check` no reporta wikilinks rotos tras el renombrado y `docs/index.md` regenerado muestra las rutas nuevas.
- **CNF-3 — Encoding:** los archivos modificados conservan UTF-8 sin BOM, sin caracteres corruptos (`Ã³`, `ðŸ“–`).

## Fuera de alcance (Non-Goals)

- **Reescribir registros históricos:** artefactos dentro de cada `EPIC-*/` y `STORY-*/` (reportes, planes, `story.md` cerrados) y ADRs aceptados (`ADR-0004`, `ADR-0005`, `ADR-0010`, `ADR-0011`) conservan sus menciones textuales a las rutas viejas: son registro de lo que era cierto cuando se escribieron.
- **Referencias semánticas a `01-projects/`:** cambiar `project-begin`, `project-discovery`, `project-planning`, `project-flow`, `project-story-mapping`, `project-context-diagram` y sus agentes para que escriban en `product/` y `requirements/` corresponde a "Actualizar skills que referencian rutas de `specs/`". Esta historia solo quita `01-projects/` de la lista de directorios que exige `skill-preflight`.
- **Scaffolding y migración para otros repos:** que `memory-system scaffold`/`sddf-init` creen dos niveles en proyectos nuevos y que `memory-system migrate --from=specs-3-levels` renombre en repos existentes tienen sus propias historias. Esta historia sí actualiza las rutas que `memory-system` ya usa para leer el repo (por ejemplo, el mapa de capas `specs-epics`/`specs-stories`), porque son referencias de ruta.
- **`.claude/`:** no está versionado; se regenera con el instalador a partir de `skills/` y `agents/`.
- **Versión y CHANGELOG:** el major bump y la guía de migración van en "Actualizar documentación canónica".

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]] decide `specs/epics/` + `specs/stories/` sin prefijos y reemplaza la decisión de directorios numerados de `ADR-0004`.
- **Volumen (2026-10-05):** archivos que mencionan `02-epics` / `03-stories`: `skills/` 32 / 56, `docs/` 50 / 68 (la mayoría registros históricos), más `test/memory-system.test.js`, `scripts/migrate-finvest-field.js`, `README.md` y `AGENTS.md`. `sddf.config.yaml` no contiene rutas de `specs/`.
- **Documentos vivos de `docs/`:** todo lo que está fuera de `specs/epics/*/`, `specs/stories/*/` y de los ADRs aceptados. Incluye `constitution.md`, `index.md`, `specs/README.md`, `architecture/`, `domains/`, `guides/`, `guardrails/`, `runbooks/` y `adr/README.md`.
- **Cambio de alcance respecto de EPIC-21:** al hacer el renombrado atómico, esta historia absorbe la parte de ruta de "Actualizar skills que referencian rutas de `specs/`", que queda solo con la reubicación semántica de los outputs de `project-*`. Conviene ajustar la descripción de esa línea en la épica.
- **Dependencias:** la historia no requiere STORY-104–107 para ejecutarse; por AC-3 solo determinan si `01-projects/` puede eliminarse. Si `/story-evaluation` la considera demasiado grande, el corte natural es por área (`skills/`+`agents/`+`test/` vs. `docs/`), siempre que ambas partes se integren juntas (CNF-1).
