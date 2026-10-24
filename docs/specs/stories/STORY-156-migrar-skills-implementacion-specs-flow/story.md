---
alwaysApply: false
type: story
id: STORY-156
kind: feat
slug: STORY-156-migrar-skills-implementacion-specs-flow
title: "Migrar los skills de implementación a specs/flow"
status: IMPLEMENT
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-22
updated: 2026-10-23
related:
  - EPIC-26-layout-y-flow-forward-mejorado
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-150-migrar-skills-especificacion-specs-flow
  - STORY-155-migrar-skills-planning-specs-flow
  - STORY-158-migrar-skills-verificacion-specs-flow
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de implementación a specs/flow

**Como** practitioner que implementa historias con SDDF
**Quiero** ejecutar `/story-implement` o `/story-implement-tasks` sobre una historia planificada en `specs/flow/STORY-NNN-<slug>/` y obtener su `implement-report.md` en esa misma carpeta
**Para** que un repo recién inicializado implemente una historia sin `sddf.config.yaml` ni `SDDF_ROOT`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – implementación en la carpeta de la historia
```gherkin
Esquema del escenario: <skill> escribe su informe en la carpeta de la historia
  Dado una historia planificada en "specs/flow/STORY-NNN-<slug>/"
  Cuando el usuario ejecuta "<skill>" sobre ella
  Entonces "implement-report.md" se escribe en "specs/flow/STORY-NNN-<slug>/"
    Y no se escribe nada en "docs/specs/"

  Ejemplos:
    | skill                  |
    | /story-implement       |
    | /story-implement-tasks |
```

### AC-2 — Escenario alternativo / error – sin resolución legada en los skills de implementación
```gherkin
Dado "story-implement" y "story-implement-tasks" migrados junto con sus evals y ejemplos
Cuando se ejecuta el gate determinista de STORY-148 en "npm run verify:repository"
Entonces el gate no reporta resolución legada ("SDDF_ROOT", "root" o "SPECS_BASE") en ninguno de esos dos skills
  Y ningún artefacto de historia que escriben queda fuera de "specs/flow/STORY-NNN-<slug>/"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals actualizados:** los `evals/evals.json` de `story-implement` y `story-implement-tasks` usan rutas `specs/flow/`; su ejecución (`npm run test:eval`) queda a criterio humano.
- **CNF-2 — Contrato:** los dos skills migrados declaran el contrato de layout fijo de STORY-148.

## Fuera de alcance (Non-Goals)

- Skills de revisión, verificación y aceptación (`story-code-review`, `story-verify`, `story-acceptance`): los cubre STORY-158.
- Skills de especificación (STORY-150) y de planning (STORY-155).
- La verificación global de que ningún `skills/story-*` conserva resolución legada: la cubre el gate determinista de STORY-148 a nivel de épica, una vez entregadas STORY-150, STORY-155, STORY-158 y esta historia.
- Buscar historias en `specs/flow/archive/` (las historias archivadas están cerradas).
- Skills `epic-*` (STORY-151) y transversales (STORY-152).

## 📎 Notas / contexto adicional

Historia core del split de STORY-156 «Migrar los skills de implementación y verificación a specs/flow» (`/story-split`, patrón 1 — pasos del flujo de trabajo), cuyo directorio era `STORY-156-migrar-skills-implementacion-verificacion-specs-flow/`. Hermana del split: STORY-158 (revisión, verificación y aceptación). A su vez, STORY-156 provenía del split de STORY-150.

Alcance: `story-implement` y `story-implement-tasks`, más sus `evals/evals.json`, `README.md` y ejemplos. Cubre la parte de implementación de CS-2 y SMOKE-1.

**Dependencias:**

- `depends-on: STORY-148` (dura): aporta el contrato de layout fijo que declaran los skills migrados y el gate determinista que verifica AC-2. Mientras no esté entregada, AC-1 puede desarrollarse contra el contrato documentado en STORY-148.
- STORY-150, STORY-155 y STORY-158 no son dependencias: migran otros skills `story-*` y esta historia no los toca. Para probar AC-1 basta una historia fixture ya planificada en `specs/flow/STORY-NNN-<slug>/`.

**Inventario inicial (2026-10-22)** — coincidencias de `SPECS_BASE|SDDF_ROOT` y de rutas `specs/stories` en cada skill:

| Skill | `SPECS_BASE\|SDDF_ROOT` (total) | En `SKILL.md` | Fuera de `SKILL.md` | `specs/stories` | Agentes locales |
|---|:-:|:-:|---|:-:|---|
| `story-implement` | 20 | 14 | `README.md`, `evals/evals.json` (8 rutas `docs/specs`) | 12 | — |
| `story-implement-tasks` | 20 | 20 | — | 9 | — |

Total: 40 coincidencias de raíz legada y 21 rutas `specs/stories`, concentradas en los `SKILL.md`. Ninguno de los dos skills tiene agentes locales.
