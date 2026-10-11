---
type: plan
id: plan-17
slug: plan-17-generates-evals
title: "Generar evals/evals.json para dos skills (STORY-057)"
status: COMPLETED
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: Generate evals/evals.json for two skills

## Summary
Write two new files. No existing files to modify.

---

## File 1: `D:\code\agile-sddf\.claude\skills\release-generate-stories\evals\evals.json`

```json
{
  "skill": "release-generate-stories",
  "version": "1.0.0",
  "description": "Evalua el skill release-generate-stories: generacion de historias de usuario (story.md) a partir de las features definidas en un release.md",
  "cases": [
    {
      "id": "TC-001",
      "name": "happy-path: release valido genera historias con IDs STORY-NNN",
      "type": "functional",
      "description": "Dado un release.md valido con una seccion ## Features que contiene entradas STORY-NNN, el skill debe generar un directorio STORY-NNN-nombre/ con story.md por cada feature, con frontmatter correcto y estructura Gherkin",
      "input": {
        "input_path": "docs/specs/releases/EPIC-01-ejemplo/release.md",
        "flags": []
      },
      "expected": {
        "contains": [
          "STORY-",
          "story.md",
          "status: SPECIFY",
          "Como",
          "Quiero",
          "Para",
          "Dado",
          "Cuando",
          "Entonces",
          "Historias generadas",
          "Siguiente paso"
        ],
        "not_contains": [
          "Entorno invalido",
          "No se encontro el template",
          "No se encontraron features"
        ]
      },
      "threshold": 0.90
    },
    {
      "id": "TC-002",
      "name": "fail-fast: release.md ausente detiene la ejecucion con error",
      "type": "error",
      "description": "Dado un nombre de release que no existe en $SPECS_BASE/specs/releases/, el skill debe detenerse inmediatamente sin generar ningun archivo de historia y mostrar un mensaje de error claro",
      "input": {
        "input_path": "EPIC-99-no-existe",
        "flags": []
      },
      "expected": {
        "contains": [
          "No se encontro",
          "release"
        ],
        "not_contains": [
          "story.md",
          "Historias generadas",
          "status: SPECIFY"
        ]
      },
      "threshold": 1.0
    },
    {
      "id": "TC-003",
      "name": "edge-case: release sin seccion Features muestra error orientativo",
      "type": "edge",
      "description": "Dado un release.md valido pero que no contiene la seccion ## Features o la tiene vacia, el skill debe mostrar un mensaje orientativo y terminar sin generar archivos",
      "input": {
        "input_path": "docs/specs/releases/EPIC-02-sin-features/release.md",
        "flags": []
      },
      "expected": {
        "contains": [
          "No se encontraron features"
        ],
        "not_contains": [
          "story.md",
          "Historias generadas",
          "status: SPECIFY"
        ]
      },
      "threshold": 1.0
    },
    {
      "id": "TC-004",
      "name": "edge-case: features duplicadas generan sufijo -bis e informan al usuario",
      "type": "edge",
      "description": "Dado un release.md con dos features que producen el mismo ID y slug (STORY-NNN duplicado), el segundo directorio debe generarse con sufijo -bis y el resumen debe informar del conflicto",
      "input": {
        "input_path": "docs/specs/releases/EPIC-03-duplicados/release.md",
        "flags": []
      },
      "expected": {
        "contains": [
          "-bis",
          "story.md",
          "Historias generadas"
        ],
        "not_contains": [
          "Entorno invalido"
        ]
      },
      "threshold": 0.90
    }
  ]
}
```

---

## File 2: `D:\code\agile-sddf\.claude\skills\release-generate-all-stories\evals\evals.json`

```json
{
  "skill": "release-generate-all-stories",
  "version": "1.0.0",
  "description": "Evalua el skill release-generate-all-stories: generacion batch de historias de usuario para todos los releases existentes en $SPECS_BASE/specs/releases/",
  "cases": [
    {
      "id": "TC-001",
      "name": "happy-path: multiples releases generan historias para todas sus features",
      "type": "functional",
      "description": "Dado un directorio $SPECS_BASE/specs/releases/ con dos o mas subdirectorios EPIC-NN-nombre/ cada uno con release.md valido y seccion ## Features, el skill debe generar un story.md por cada feature en todos los releases, en orden alfabetico, y mostrar un resumen consolidado",
      "input": {
        "input_path": "docs/specs/releases/",
        "flags": []
      },
      "expected": {
        "contains": [
          "STORY-",
          "story.md",
          "status: READY-FOR-IMPLEMENT",
          "Como",
          "Quiero",
          "Para",
          "Dado",
          "Cuando",
          "Entonces",
          "Historias generadas",
          "Releases procesados",
          "Siguiente paso"
        ],
        "not_contains": [
          "Entorno invalido",
          "No se encontro el template",
          "No se encontraron directorios de release"
        ]
      },
      "threshold": 0.90
    },
    {
      "id": "TC-002",
      "name": "fail-fast: directorio releases vacio o inexistente detiene la ejecucion",
      "type": "error",
      "description": "Dado que $SPECS_BASE/specs/releases/ no existe o no contiene ningun subdirectorio con release.md, el skill debe mostrar el mensaje de orientacion y terminar sin generar ninguna historia",
      "input": {
        "input_path": "docs/specs/releases/",
        "flags": []
      },
      "expected": {
        "contains": [
          "No se encontraron directorios de release",
          "releases-from-project-plan"
        ],
        "not_contains": [
          "story.md",
          "Historias generadas",
          "status: READY-FOR-IMPLEMENT"
        ]
      },
      "threshold": 1.0
    },
    {
      "id": "TC-003",
      "name": "edge-case: release sin seccion Features es saltado sin interrumpir el batch",
      "type": "edge",
      "description": "Dado un directorio releases/ con dos releases, uno valido con features y otro sin seccion ## Features, el skill debe procesar el valido, registrar el otro como 'saltado (sin features)' y continuar sin interrumpir el batch",
      "input": {
        "input_path": "docs/specs/releases/",
        "flags": []
      },
      "expected": {
        "contains": [
          "saltado (sin features)",
          "story.md",
          "Releases sin features",
          "Historias generadas"
        ],
        "not_contains": [
          "Entorno invalido"
        ]
      },
      "threshold": 0.90
    },
    {
      "id": "TC-004",
      "name": "edge-case: conflictos detectados anticipadamente muestran pregunta de resolucion",
      "type": "edge",
      "description": "Dado que existen historias previas en $SPECS_BASE/specs/stories/ que coinciden con features del batch, el skill debe detectarlas antes de procesar, listar los conflictos y preguntar al usuario como resolverlos (opciones a/b/c) antes de continuar",
      "input": {
        "input_path": "docs/specs/releases/",
        "flags": []
      },
      "expected": [
        "conflictos",
        "Sobreescribir todos",
        "Saltar todos",
        "Decidir uno por uno"
      ],
      "not_contains": [
        "Entorno invalido"
      ],
      "threshold": 0.90
    }
  ]
}
```

---

## Actions when plan mode exits

1. Create directory `D:\code\agile-sddf\.claude\skills\release-generate-stories\evals\` (implicit via Write).
2. Write File 1 above.
3. Create directory `D:\code\agile-sddf\.claude\skills\release-generate-all-stories\evals\` (implicit via Write).
4. Write File 2 above.

Note: TC-004 for release-generate-all-stories has a minor structural issue — `expected` field should be an object with `contains`/`not_contains` keys, not a plain array. The correct shape is shown in File 1 and will be applied uniformly in the final write.

## Reporte de implementación

Resumen de lo generado en esta sesión:

Antes	Después
10 skills con evals	24 skills con evals
79% sin cobertura	~49% sin cobertura
Nuevos evals creados (14): story-specify, story-plan, story-design, story-tasking, story-analyze, story-code-review, story-verify, story-acceptance, release-creation, release-format-validation, release-generate-stories, release-generate-all-stories, skill-preflight, sddf-init.

Pendientes del pipeline principal: skill-master (complejo, mejor manual). Skills no-pipeline: changelog-generator, code-frontend-library-react, docs-wiki-builder, project-begin, project-context-diagram, project-discovery, project-flow, project-planning, project-policies-generation, project-story-mapping, readme-builder, releases-from-project-plan, reverse-engineering, security-audit, story-implement-tasks, test-react-testing-library — 16 más.

Los skills que no deben agregarse test evals son: skill-master, changelog-generator, code-frontend-library-react, reverse-engineering, test-react-testing-library. El resto es deuda técnica.
