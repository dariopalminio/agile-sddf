---
alwaysApply: false
type: story
id: STORY-114
kind: feat
slug: STORY-114-migrate-specs-3-levels
title: "Implementar memory-system migrate --from=specs-3-levels"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-10-05
updated: 2026-10-05
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - ADR-0013-eliminar-specs-01-projects
  - STORY-101-dod-story-por-etapa
  - STORY-104-migrar-project-intent-a-vision
  - STORY-105-migrar-stakeholders-y-requisitos
  - STORY-106-migrar-plan-a-roadmap
  - STORY-107-migrar-story-map-y-diagrama-contexto
  - STORY-108-renombrar-specs-sin-prefijos
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[ADR-0013-eliminar-specs-01-projects]]

# 📖 Historia: Implementar `memory-system migrate --from=specs-3-levels`

**Como** usuario de SDDF que actualiza a la versión con `specs/` de dos niveles un repositorio que ya tiene `docs/specs/{01-projects,02-epics,03-stories}/`  
**Quiero** ejecutar `/memory-system migrate --from=specs-3-levels`, revisar antes qué va a cambiar y aplicar el colapso en un solo paso  
**Para** adoptar la nueva estructura sin repetir a mano las migraciones de las historias STORY-104 a STORY-108 y sin perder épicas, historias ni el contenido de mi proyecto

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Colapso completo de un repo de tres niveles
```gherkin
Dado un repositorio con un único proyecto en "docs/specs/01-projects/PROJ-01-demo/" que contiene "project-intent.md", "project.md", "project-plan.md" y "story-map.md" generados con los templates de SDDF
  Y épicas en "docs/specs/02-epics/" e historias en "docs/specs/03-stories/"
Cuando el usuario ejecuta "/memory-system migrate --from=specs-3-levels"
Entonces el contenido de "01-projects/" queda en "docs/product/" y "docs/requirements/" según ADR-0013, con un archivo por FR y NFR
  Y "02-epics/" pasa a "docs/specs/epics/" y "03-stories/" a "docs/specs/stories/" con el mismo número de archivos
  Y "docs/specs/01-projects/" ya no existe
  Y "memory-system check" devuelve exit code 0 sin wikilinks rotos
```

### AC-2 — Escenario alternativo – Simulación e idempotencia
```gherkin
Escenario: plan antes de aplicar y repetición después de aplicar
  Dado un repositorio en el estado "<estado>"
  Cuando el usuario ejecuta "/memory-system migrate --from=specs-3-levels <flags>"
  Entonces la última línea del informe dice "<resumen>"
    Y <escritura>
Ejemplos:
  | estado                       | flags     | resumen                         | escritura                                         |
  | tres niveles sin migrar      | --dry-run | cambios pendientes: N (con N>0) | ningún archivo del repositorio cambia             |
  | ya migrado con AC-1          | --dry-run | cambios pendientes: 0           | ningún archivo del repositorio cambia             |
  | ya migrado con AC-1          |           | creados: 0 · sobrescritos: 0    | ningún archivo del repositorio cambia             |
```

### AC-3 — Escenario de error – Contenido que no se puede migrar con seguridad
```gherkin
Escenario: la migración se niega a decidir por el usuario
  Dado un repositorio donde <situación>
  Cuando el usuario ejecuta "/memory-system migrate --from=specs-3-levels"
  Entonces el informe marca <elemento> como "[NO MIGRADO]" con el motivo
    Y el comando termina con exit code 1
    Pero "docs/specs/01-projects/" no se elimina mientras quede algún "[NO MIGRADO]"
Ejemplos:
  | situación                                                             | elemento                                          |
  | "01-projects/" contiene dos proyectos ("PROJ-01-a" y "PROJ-02-b")     | "docs/specs/01-projects/"                         |
  | "docs/product/vision.md" ya tiene contenido propio (sin "[Por completar") | "project-intent.md" (sin "--force" no se sobrescribe) |
  | "project.md" tiene secciones que no siguen el template de SDDF         | cada sección no reconocida                        |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Contrato de `migrate`:** el informe sigue el formato del modo existente `--from=dod-monolithic` (cabecera `from: specs-3-levels`, una línea por archivo con `[CREADO]`/`[PRESERVADO]`/`[SOBRESCRITO]`/`[NO MIGRADO]` o sus formas condicionales en `--dry-run`, y una línea final de totales). `--from=specs-3-levels` se suma a los orígenes admitidos sin alterar los existentes.
- **CNF-2 — Sin pérdida:** ningún archivo de `02-epics/` ni `03-stories/` se modifica en su contenido al moverse; ningún ítem de `01-projects/` desaparece sin quedar en su nuevo hogar o marcado `[NO MIGRADO]`.
- **CNF-3 — Historial:** en un repositorio git, los movimientos de épicas e historias se registran como renombrados.
- **CNF-4 — Cobertura:** `test/memory-system.test.js` cubre AC-1, AC-2 y AC-3 sobre repositorios temporales; `npm test` termina con exit code 0.

## Fuera de alcance (Non-Goals)

- **Reconciliar el roadmap con las épicas reales**, como hizo a mano STORY-106: la migración traslada el plan tal como está, y el usuario puede reconciliarlo después.
- **Repositorios multi-proyecto:** se rechazan (AC-3). [[ADR-0013-eliminar-specs-01-projects]] deja ese caso para un ADR futuro.
- **Reescribir menciones textuales a las rutas viejas** dentro de épicas e historias del usuario: son registro histórico. Solo se ajustan los wikilinks cuyo slug cambia (por ejemplo, el de `project-intent.md` pasa a `[[vision]]`).
- **Migrar el repositorio del propio framework:** lo hacen STORY-104 a STORY-108 a mano. Esta historia automatiza el mismo resultado para terceros.
- **Que `scaffold` deje de crear `01-projects/`:** "Actualizar scaffolding de `memory-system`".

## 📎 Notas / contexto adicional

- **Origen:** [[ADR-0013-eliminar-specs-01-projects]], consecuencia "Migración de contenido: el skill `memory-system migrate` debe implementar esta migración". Cubre el smoke test 2 de EPIC-21 y su criterio de salida "`migrate --from=specs-3-levels --dry-run` reporta 0 cambios pendientes tras la migración".
- **Precedente:** `migrate --from=dod-monolithic` (STORY-101) ya resuelve dry-run, `--force`, idempotencia y `[NO MIGRADO]` con exit 1 de forma determinista en `skills/memory-system/scripts/memory-system.js`. El motor normaliza `--from=valor` a `--from valor`.
- **Mapa de destino:** es el que fijan STORY-104 (`project-intent.md` → `vision.md`), STORY-105 (§1.8 → `stakeholders.md`; FR/NFR → un archivo por requisito, conservando IDs y huecos), STORY-106 (`project-plan.md` → `roadmap.md`; "Objetivo" → `objectives.md`), STORY-107 (`story-map.md` → `product/`; `.puml` → `architecture/c4/`) y STORY-108 (renombrado). Esta historia no redefine ese mapa.
- **Dependencia de decisión:** las secciones de `project.md` que ADR-0013 no asigna (UI/UX, stack, glosario, referencias, apéndices) dependen de la historia pendiente "Reubicar las secciones restantes de `project.md`". Hasta que exista esa decisión, la migración las marca `[NO MIGRADO]`, lo que impide eliminar `01-projects/` (AC-3).
- **Determinista vs. asistido:** reconocer secciones por los encabezados de los templates y los requisitos por el patrón `- **FR-NNN**:` permite un motor determinista. Lo que no encaje cae en `[NO MIGRADO]` en lugar de interpretarse. El reparto exacto entre motor e instrucciones del `SKILL.md` se decide en diseño.
