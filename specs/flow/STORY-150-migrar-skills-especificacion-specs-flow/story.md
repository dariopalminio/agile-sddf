---
alwaysApply: false
type: story
id: STORY-150
kind: feat
slug: STORY-150-migrar-skills-especificacion-specs-flow
title: "Migrar los skills de especificación a specs/flow"
status: VERIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-21
updated: 2026-10-25
related:
  - EPIC-26-layout-y-flow-forward-mejorado
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-155-migrar-skills-planning-specs-flow
  - STORY-156-migrar-skills-implementacion-specs-flow
  - STORY-158-migrar-skills-verificacion-specs-flow
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de especificación a specs/flow

**Como** practitioner que especifica historias con SDDF
**Quiero** que la fase de especificación de una historia lea y escriba sus artefactos en `specs/flow/STORY-NNN-<slug>/`
**Para** que un repo recién inicializado complete la especificación de una historia sin `sddf.config.yaml` ni `SDDF_ROOT`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – story-specify en un repo limpio
```gherkin
Dado un repositorio limpio inicializado con "/sddf-init"
Cuando el usuario ejecuta "/story-specify" para una historia nueva
Entonces se crea "specs/flow/STORY-001-<slug>/story.md"
  Y no existe "docs/specs/stories/"
```

### AC-2 — Escenario alternativo – historia no encontrada
```gherkin
Dado que no existe "specs/flow/STORY-999-*/"
Cuando el usuario ejecuta "/story-evaluation STORY-999"
Entonces el skill informa que la historia no existe en "specs/flow/"
  Pero no busca ni crea nada en "docs/specs/"
```

### AC-3 — Escenario alternativo / error – sin referencias legadas
```gherkin
Dado los skills de especificación y sus "assets/agents/" migrados
Cuando se ejecuta grep -rnE "SPECS_BASE|SDDF_ROOT" sobre ellos
Entonces no hay coincidencias
  Y "npm run verify:repository" termina en verde
```

> **Excepción registrada (code-review ronda 1, 2026-10-23):** la segunda cláusula depende de la migración de plantilla de épica, ajena a esta historia. `npm run verify:repository` falla únicamente en el paso `pruebas deterministas` por 15 tests preexistentes (UT-001, UT-003, UT-005…UT-012, UT-014, UT-016, UT-019, UT-020, IT-001), idénticos a la línea base previa a esta historia. Para esta historia la cláusula se cumple cuando el paso de contrato de layout fijo (`npm run verify:layout`) pasa y no se introduce ningún fallo nuevo; la luz verde completa queda como dependencia de la historia que cierre la migración de plantilla de épica.

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals actualizados:** los `evals/evals.json` de los skills de esta historia usan rutas `specs/flow/`; su ejecución (`npm run test:eval`) queda a criterio humano.
- **CNF-2 — Contrato:** todos los skills migrados declaran el contrato de layout fijo de STORY-148.

## Fuera de alcance (Non-Goals)

- Skills de planning (STORY-155), de implementación (STORY-156) y de revisión, verificación y aceptación (STORY-158).
- Buscar historias en `specs/flow/archive/` (las historias archivadas están cerradas).
- Skills `epic-*` (STORY-151) y transversales (STORY-152).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: `EPIC-26-layout-y-flow-forward-mejorado/epic.md`
Feature origen: STORY-150 — Migrar los skills de historia a specs/flow (dividida con `/story-split`, patrón 1 — pasos del flujo de trabajo, guiado por el plan de `finvest-evaluation-report.md`).

Historia core del split. Alcance: `story-creation`, `story-evaluation`, `story-refine`, `story-improve`, `story-split` y `story-specify`, más sus `assets/agents/` y `evals/evals.json`. Cubre la parte de especificación de CS-2 y SMOKE-1. Depende de STORY-148.

Hermanas del split: STORY-155 (planning), STORY-156 (implementación) y STORY-158 (revisión, verificación y aceptación; STORY-158 nació del split de STORY-156). El grep global sobre `skills/` lo verifica el AC-3 de cierre de STORY-157.

Para probar la lectura de la épica padre sin esperar a STORY-151 se usa una épica fixture en `specs/flow/EPIC-NN-<slug>/epic.md`.
