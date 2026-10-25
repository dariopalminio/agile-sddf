---
alwaysApply: false
type: story
id: STORY-158
kind: feat
slug: STORY-158-migrar-skills-verificacion-specs-flow
title: "Migrar los skills de revisión, verificación y aceptación a specs/flow"
status: VERIFY
substatus: DONE
parent: EPIC-26-layout-y-flow-forward-mejorado
created: 2026-10-22
updated: 2026-10-25
related:
  - EPIC-26-layout-y-flow-forward-mejorado
  - STORY-148-contrato-de-rutas-fijas-y-gate-determinista
  - STORY-150-migrar-skills-especificacion-specs-flow
  - STORY-155-migrar-skills-planning-specs-flow
  - STORY-156-migrar-skills-implementacion-specs-flow
---
[[EPIC-26-layout-y-flow-forward-mejorado]]

# 📖 Historia: Migrar los skills de revisión, verificación y aceptación a specs/flow

**Como** practitioner que revisa, verifica y acepta historias con SDDF
**Quiero** ejecutar `/story-code-review`, `/story-verify` y `/story-acceptance` sobre una historia implementada en `specs/flow/STORY-NNN-<slug>/` y obtener cada informe en esa misma carpeta
**Para** que un repo recién inicializado lleve una historia implementada hasta su aceptación sin `sddf.config.yaml` ni `SDDF_ROOT`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – revisión, verificación y aceptación en la carpeta de la historia
```gherkin
Esquema del escenario: <skill> escribe <informe> en la carpeta de la historia
  Dado una historia implementada en "specs/flow/STORY-NNN-<slug>/"
  Cuando el usuario ejecuta "<skill>" sobre ella
  Entonces "<informe>" se escribe en "specs/flow/STORY-NNN-<slug>/"
    Y no se escribe nada en "docs/specs/"

  Ejemplos:
    | skill              | informe                 |
    | /story-code-review | code-review-report.md   |
    | /story-verify      | verify-report.md        |
    | /story-acceptance  | acceptance-report.md    |
```

### AC-2 — Escenario alternativo / error – sin resolución legada en los skills de cierre
```gherkin
Dado "story-code-review", "story-verify" y "story-acceptance" migrados junto con sus agentes locales y sus evals
Cuando se ejecuta el gate determinista de STORY-148 en "npm run verify:repository"
Entonces el gate no reporta resolución legada ("SDDF_ROOT", "root" o "SPECS_BASE") en ninguno de esos tres skills
  Y ningún artefacto de historia que escriben queda fuera de "specs/flow/STORY-NNN-<slug>/"
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evals actualizados:** los `evals/evals.json` de `story-code-review`, `story-verify` y `story-acceptance` usan rutas `specs/flow/`; su ejecución (`npm run test:eval`) queda a criterio humano.
- **CNF-2 — Contrato:** los tres skills migrados declaran el contrato de layout fijo de STORY-148.

## Fuera de alcance (Non-Goals)

- Skills de implementación (`story-implement`, `story-implement-tasks`): los cubre STORY-156.
- Skills de especificación (STORY-150) y de planning (STORY-155).
- La verificación global de que ningún `skills/story-*` conserva resolución legada: la cubre el gate determinista de STORY-148 a nivel de épica, una vez entregadas STORY-150, STORY-155, STORY-156 y esta historia.
- Buscar historias en `specs/flow/archive/` (las historias archivadas están cerradas).
- Skills `epic-*` (STORY-151) y transversales (STORY-152).

## 📎 Notas / contexto adicional

Historia hermana del split de STORY-156 «Migrar los skills de implementación y verificación a specs/flow» (`/story-split`, patrón 1 — pasos del flujo de trabajo). La core, STORY-156, migra los skills de implementación. Cubre la parte de revisión, verificación y aceptación de CS-2 y SMOKE-1.

Alcance: `story-code-review`, `story-verify` y `story-acceptance`, más sus agentes locales, `evals/evals.json`, `README.md`, plantillas en `assets/` y ejemplos.

**Dependencias:**

- `depends-on: STORY-148` (dura): aporta el contrato de layout fijo que declaran los skills migrados y el gate determinista que verifica AC-2. Mientras no esté entregada, AC-1 puede desarrollarse contra el contrato documentado en STORY-148.
- STORY-156 no es dependencia: AC-1 se prueba con una historia fixture ya implementada en `specs/flow/STORY-NNN-<slug>/` (con su `implement-report.md`), sin esperar a que `/story-implement` esté migrado. El orden 156 → 158 es solo sugerido.

**Inventario inicial (2026-10-22)** — coincidencias de `SPECS_BASE|SDDF_ROOT` y de rutas `specs/stories` en cada skill:

| Skill | `SPECS_BASE\|SDDF_ROOT` (total) | En `SKILL.md` | Fuera de `SKILL.md` | `specs/stories` | Agentes locales |
|---|:-:|:-:|---|:-:|---|
| `story-code-review` | 12 | 12 | — | 9 | 4 en `agents/`, sin coincidencias |
| `story-verify` | 15 | 12 | `README.md` | 5 | 1 en `agents/`, sin coincidencias |
| `story-acceptance` | 16 | 13 | `evals/evals.json` | 5 | — |

Total: 43 coincidencias de raíz legada y 19 rutas `specs/stories`, concentradas en los `SKILL.md`. Los agentes locales viven en `agents/` (no en `assets/agents/`) y no resuelven la raíz.
