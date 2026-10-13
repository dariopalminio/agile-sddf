---
type: testcases
id: EPIC-21
slug: EPIC-21-colapsar-specs-dos-niveles-test-cases
title: "Test Cases: Colapsar specs/ a dos niveles y eliminar 01-projects/"
epic: EPIC-21
created: 2026-10-13
updated: 2026-10-13
related:
  - EPIC-21-colapsar-specs-dos-niveles
  - STORY-113-project-flow-sin-01-projects
---

<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]
[[STORY-113-project-flow-sin-01-projects]]

# Casos de Prueba: Colapsar `specs/` a dos niveles y eliminar `01-projects/`

Casos de prueba a nivel de épica, ejecutados en la fase QUALITY de `VALIDATE`. Los resultados de cada ejecución se registran en [validate-report.md](validate-report.md).

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| E2E  | 1 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | Onboarding completo sin `01-projects/` | Un repositorio git vacío, sin `docs/` ni `sddf.config.yaml`, y sin `SDDF_ROOT` definida | Se ejecuta `/sddf-init` (nivel `standard`) y después `/project-flow` hasta «Pipeline completo», con todos los gates confirmados por una persona | No existe `docs/specs/01-projects/`, `02-epics/` ni `03-stories/`; existen `docs/product/vision.md` y `docs/product/stakeholders.md` con `substatus: DONE`, al menos un `FR-*.md` en `docs/requirements/` y `docs/product/roadmap.md` con una sección `## Propuesta (` | Ítem 6 de QUALITY, T027 de STORY-113, CS-1, SMOKE-1 |

## E2E-001 — Onboarding completo sin `01-projects/`

### Objetivo

Comprobar que el flujo de onboarding de 4.0.0 (`/sddf-init` → `/project-flow`) produce la documentación de producto en sus capas (`product/`, `requirements/`) sin crear el nivel de proyectos retirado por ADR-0013, y que `project-flow` encadena Begin → Discovery → Planning con sus gates.

### Naturaleza de la prueba

- **Interactiva y no automatizable:** los skills componen agentes que entrevistan al usuario, y cada gate requiere confirmación humana.
- **Conducción:** una persona (o un asistente que sigue los `SKILL.md`) ejecuta los skills. La persona responsable de QA responde la entrevista y los gates.
- **Entorno:** repositorio temporal fuera del árbol versionado del framework. `CLI_ROOT` es el checkout de agile-sddf.

### Precondiciones

1. `SDDF_ROOT` no está definida en la sesión.
2. El directorio de prueba está vacío y se inicializa con `git init`.
3. Los skills `sddf-init`, `project-flow`, `project-begin`, `project-discovery`, `project-planning` y `project-story-mapping`, y los agentes `project-pm`, `project-ux`, `project-architect` y `project-story-mapper`, existen en `CLI_ROOT`.

### Datos de prueba

Proyecto ficticio **tskr**: un CLI de tareas personales en Node.js. Estas fueron las respuestas de la ejecución de referencia; cualquier proyecto equivalente es válido.

| Etapa | Pregunta | Respuesta |
|-------|----------|-----------|
| `sddf-init` Paso 5 | ¿Inicializar políticas del proyecto? | `n` (omitir `sddf-constitution`) |
| Begin | Problema | Desarrolladores que trabajan en la terminal anotan tareas en archivos sueltos o apps web y pierden contexto al cambiar de ventana |
| Begin | Propuesta de valor | tskr: CLI open source en Node.js, tareas en un JSON local, sin cuenta ni red; a diferencia de Todoist o Trello, nunca sale de la terminal |
| Begin | Criterios de éxito | Crear una tarea en menos de 2 s; 100 instalaciones en npm en 3 meses; 80 % de los comandos sin `--help` |
| Begin | Restricciones y fuera de alcance | Node.js 18+ sin dependencias de runtime, una persona, 6 semanas; fuera: nube, interfaz gráfica, recordatorios |
| Discovery | Usuarios | US-001 Desarrollador individual |
| Discovery | Requisitos funcionales | FR-001 añadir tarea, FR-002 listar pendientes, FR-003 completar tarea, FR-004 eliminar tarea |
| Discovery | Requisitos no funcionales | NFR-001 respuesta menor a 2 s |
| Story Mapping | Backbone | Instalar tskr → Capturar tarea → Revisar pendientes → Completar tarea → Depurar la lista |
| Story Mapping | Release slices | Walking Skeleton/MVP (FR-001…FR-003) y Mejoras críticas (FR-004, NFR-001) |

### Pasos

| # | Acción | Gate o respuesta | Resultado esperado |
|---|--------|------------------|--------------------|
| 1 | Ejecutar `/sddf-init` sin argumentos | Paso 5: `n` | Se crean `docs/specs/epics/`, `docs/specs/stories/`, `docs/templates/` con los 6 templates, `sddf.config.yaml` con `root: docs` y `.env.template`. Se registra `[OMITIDO] sddf-constitution`. **No** se crea `docs/specs/01-projects/` |
| 2 | Ejecutar `/project-flow` | — | `🚀 Pipeline de proyecto — estado: vision.md ausente · 0 FR · roadmap ausente`, `Etapas a ejecutar: Begin → Discovery → Planning` y `▶ Etapa Begin: componiendo /project-begin → docs/product/vision.md` |
| 3 | Entrevista de `/project-begin` (modo `full`, template central) | Respuestas de Begin | `project-pm` escribe `docs/product/vision.md` con la estructura de `vision-template.md` y `substatus: IN-PROGRESS`; marca `[inferido]` lo que deduce |
| 4 | Gate de `/project-begin` | `Confirmar` | `vision.md` pasa a `substatus: DONE`; se muestra `✅ Visión del producto completa: … · Siguiente comando: /project-discovery` |
| 5 | Re-detección de `/project-flow` | `Continuar con Discovery` | `📋 Etapa Begin completa.` y después `▶ Etapa Discovery: componiendo /project-discovery → …` |
| 6 | Entrevista de `/project-discovery` | Respuestas de Discovery | La propuesta queda solo en `.tmp/project-discovery/proposal/` con `manifest.md`. No se escribe nada en `docs/` antes del gate |
| 7 | Gate global de `/project-discovery` | `Confirmar` | Se materializan `docs/product/stakeholders.md` (`substatus: DONE`), `docs/requirements/functional/FR-001…FR-004` y `docs/requirements/non-functional/NFR-001`; se muestra `✅ Discovery completo: …` |
| 8 | Re-detección de `/project-flow` | `Continuar con Planning` | `📋 Etapa Discovery completa.` y después `▶ Etapa Planning: componiendo /project-planning → docs/product/roadmap.md` |
| 9 | Paso 4 de `/project-planning` (sin story map) | `1. Sí, hacer Story Mapping ahora` | `/project-story-mapping` muestra `🗺️ Destino: docs/product/story-map.md`, el aviso de `objectives.md` ausente y `📋 Inventario de requisitos: 4 FR` con una línea por FR y su ruta |
| 10 | Sesión de `project-story-mapper` | Respuestas de Story Mapping | El staging pasa la validación (sin frontmatter; `## Personas`, `## Backbone`, `## Walking Skeleton`, `## Release slices`) y se escribe `docs/product/story-map.md` |
| 11 | Propuesta de `project-architect` | — | `.tmp/project-planning/proposal.md` cumple el contrato: `## Propuesta (<fecha>)`, bloques `### Épica` con objetivo, historias, `FR-NNN` y criterio de éxito, `### Resumen` y ningún `STORY-NNN` |
| 12 | Gate de `/project-planning` | `Confirmar` | Se crea `docs/product/roadmap.md` desde el template con `Sin épicas creadas al <fecha>.` y la propuesta; se muestra `✅ Propuesta (<fecha>) agregada …` |
| 13 | Re-detección final de `/project-flow` | — | Estado `vision.md DONE · 4 FR · roadmap planificado` y «Pipeline completo» |

### Comprobaciones deterministas

Ejecutar desde la raíz del repositorio de prueba. Todas deben terminar con éxito:

```bash
test ! -e docs/specs/01-projects
test ! -e docs/specs/02-epics && test ! -e docs/specs/03-stories
test -z "$(find . -path ./.git -prune -o \( -name project-intent.md -o -name project.md -o -name project-plan.md -o -name 'PROJ-*' \) -print)"
grep -q '^substatus: DONE$' docs/product/vision.md
grep -q '^substatus: DONE$' docs/product/stakeholders.md
test "$(ls docs/requirements/functional/FR-*.md | wc -l)" -ge 1
grep -q '^## Propuesta (' docs/product/roadmap.md
test -f docs/product/story-map.md   # solo si se eligió Story Mapping en el paso 9
```

### Criterio de aprobación

El caso se aprueba si se cumplen los resultados esperados de los pasos 1 a 13 y todas las comprobaciones deterministas. `memory-system check` no forma parte del criterio: con el nivel `standard` y sin `sddf-constitution`, informa problemas esperados (ver Observaciones).

### Variantes no cubiertas por la ejecución de referencia

- Responder `Dejar en revisión`, `Cancelar` o `Detener aquí` en un gate: debe mostrarse `⏸ La etapa <Etapa> no quedó cerrada (…)` o `Retoma cuando quieras con /project-flow.`, sin escrituras posteriores.
- Retomar `/project-flow` con `vision.md` en `IN-PROGRESS`: debe empezar por Begin en modo `resume`.
- `/sddf-init --level full`: añade `memory-system scaffold` y no debe crear `01-projects/`.

## Registro de ejecuciones

| Fecha | Ejecutó | Gates confirmados por | Resultado | Evidencia |
|-------|---------|-----------------------|-----------|-----------|
| 2026-10-13 | Claude, siguiendo los `SKILL.md` | Dario Palminio | ✅ Aprobado (13/13 pasos, 8/8 comprobaciones) | [validate-report.md](validate-report.md) › Seguimiento QUALITY › Ítem 6 |

## Observaciones

- Tras `memory-system ensure` (scaffold + index) sobre el repositorio de prueba, `check` solo informa 7 problemas `dod-guardrail`. El `sddf.config.yaml` que genera `sddf-init` referencia los `dod-story-*`, que no existen al responder `n` a `sddf-constitution`. Es una fricción de onboarding ajena a EPIC-21.
- Sin `ensure`, `check` informa además capas ausentes (`adr/`, `architecture/`, `domains/`…) y la falta de `requirements/index.md`. Es lo esperado con el nivel `standard`, que no ejecuta el scaffold.
