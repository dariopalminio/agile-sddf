---
type: epic-analyze
id: EPIC-24
slug: EPIC-24-agentes-locales-por-skill-analyze-report
title: "Epic analyze: Mover agentes globales a agentes locales por skill"
epic: EPIC-24
verdict: APPROVED
errors: 0
warnings: 0
created: 2026-10-15
updated: 2026-10-15
related:
  - EPIC-24-agentes-locales-por-skill
---
<!-- Referencias -->
[[EPIC-24-agentes-locales-por-skill]]

# Análisis de épica: Mover agentes globales a agentes locales por skill

## Resumen

| Métrica | Valor |
|---|---|
| Épica | EPIC-24 (`docs/specs/epics/EPIC-24-agentes-locales-por-skill/epic.md`) |
| Veredicto | APPROVED |
| Hallazgos ERROR | 0 |
| Hallazgos WARNING | 0 |
| Contrato de salida | Contrato de salida: 10/10 cubiertos |
| Madurez de historias hijas | Madurez de historias hijas: 6/6 listas |
| Fecha | 2026-10-15 |
| Template de épica | `docs/templates/epic-template.md` |
| Template de reporte | `.claude/skills/epic-analyze/assets/epic-analyze-report-template.md` |

**Veredicto:** APPROVED — informativo; este análisis no cambia el estado de la épica.

## Índice de historias

| ID | Línea(s) en epic.md | En índice | story.md | parent | Estado |
|---|---|---|---|---|---|
| STORY-129 | 24 | sí | `docs/specs/stories/STORY-129-migrar-analizadores-de-reverse-engineering/story.md` | `EPIC-24-agentes-locales-por-skill` | ✓ |
| STORY-131 | 25 | sí | `docs/specs/stories/STORY-131-partir-project-pm-en-roles-locales/story.md` | `EPIC-24-agentes-locales-por-skill` | ✓ |
| STORY-132 | 26 | sí | `docs/specs/stories/STORY-132-partir-project-architect-en-roles-locales/story.md` | `EPIC-24-agentes-locales-por-skill` | ✓ |
| STORY-133 | 27 | sí | `docs/specs/stories/STORY-133-mover-project-ux-a-rol-local-de-project-discovery/story.md` | `EPIC-24-agentes-locales-por-skill` | ✓ |
| STORY-134 | 28 | sí | `docs/specs/stories/STORY-134-migrar-project-story-mapper-a-rol-local/story.md` | `EPIC-24-agentes-locales-por-skill` | ✓ |
| STORY-135 | 29 | sí | `docs/specs/stories/STORY-135-migrar-story-product-owner-a-rol-local/story.md` | `EPIC-24-agentes-locales-por-skill` | ✓ |

## Cobertura del contrato de salida

| Elemento | Texto o nombre | Línea en epic.md | Cubierto por | Evidencia | Estado |
|---|---|---|---|---|---|
| CS-1 | ``Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"`` | 33 | STORY-129, STORY-131, STORY-132, STORY-133, STORY-134, STORY-135 | STORY-129: mención · story.md:57 ``  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».``<br>STORY-131: mención · story.md:73 (misma línea literal)<br>STORY-132: mención · story.md:58 (misma línea literal)<br>STORY-133: mención · story.md:74 (misma línea literal)<br>STORY-134: mención · story.md:56 (misma línea literal)<br>STORY-135: mención · story.md:68 (misma línea literal) | ✓ |
| CS-2 | ``La carpeta `agents/` queda vacía y se elimina como consecuencia de la migración (ADR-0014, Regla 2), `package.json` → `files` no incluye `agents/`, y `npx agile-sddf install --target <runtime>` termina con código 0 para cada runtime de `config/runtimes.json` `` | 34 | STORY-135 | STORY-135: mención · story.md:64 ``- Cubre, como cierre de la épica, el criterio de salida «La carpeta `agents/` queda vacía y se elimina como consecuencia de la migración (ADR-0014, Regla 2), `package.json` → `files` no incluye `agents/`, y `npx agile-sddf install --target <runtime>` termina con código 0 para cada runtime de `config/runtimes.json`».`` | ✓ |
| CS-3 | ``Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/` `` | 35 | STORY-129, STORY-131, STORY-132, STORY-133, STORY-134, STORY-135 | STORY-129: mención · story.md:55 ``- Cubre, para `reverse-engineering`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».``<br>STORY-131: mención · story.md:70 ``- Cubre, para `project-begin` y `project-discovery`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».``<br>STORY-132: mención · story.md:55 ``- Cubre, para `project-discovery` y `project-planning`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».``<br>STORY-133: mención · story.md:71 ``- Cubre, para `project-discovery`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».``<br>STORY-134: mención · story.md:53 ``- Cubre, para `project-story-mapping`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».``<br>STORY-135: mención · story.md:65 ``- Cubre, para `story-specify`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».`` | ✓ |
| CS-4 | ``Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados`` | 36 | STORY-131, STORY-132, STORY-133, STORY-134, STORY-135 | STORY-131: mención · story.md:71 ``- Cubre, para el entrevistador `pm`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».``<br>STORY-132: mención · story.md:56 ``- Cubre, para el entrevistador `architect`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».``<br>STORY-133: mención · story.md:72 ``- Cubre, para el entrevistador `ux`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».``<br>STORY-134: mención · story.md:54 ``- Cubre, para el entrevistador `story-mapper`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».``<br>STORY-135: mención · story.md:66 ``- Cubre, para el entrevistador `product-owner`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».`` | ✓ |
| CS-5 | ``Los agentes analizadores (`reverse-engineer-*`) son subagentes locales que invoca `reverse-engineering` `` | 37 | STORY-129 | STORY-129: AC-1 · story.md:31 `Entonces el skill invoca los cuatro analizadores locales en paralelo y luego el synthesizer local` | ✓ |
| CS-6 | `Ningún subagente local invoca a otro subagente (ADR-0002)` | 38 | STORY-129, STORY-133 | STORY-129: mención · story.md:46 ``- **CNF-2 — Un solo nivel de delegación:** ningún subagente local invoca a otro subagente (ADR-0002).``<br>STORY-133: mención · story.md:70 ``- Cubre, para `project-discovery`, el criterio de salida de la épica «Ningún subagente local invoca a otro subagente (ADR-0002)».`` | ✓ |
| CS-7 | ``Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval` `` | 39 | STORY-129, STORY-131, STORY-132, STORY-133, STORY-134, STORY-135 | STORY-129: mención · story.md:58 ``  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».``<br>STORY-131: mención · story.md:74 (misma línea literal)<br>STORY-132: mención · story.md:59 (misma línea literal)<br>STORY-133: mención · story.md:75 (misma línea literal)<br>STORY-134: mención · story.md:57 (misma línea literal)<br>STORY-135: mención · story.md:69 (misma línea literal) | ✓ |
| CS-8 | `` `npm run verify:repository` pasa `` | 40 | STORY-129, STORY-131, STORY-132, STORY-133, STORY-134, STORY-135 | STORY-129: mención · story.md:59 ``  - «`npm run verify:repository` pasa».``<br>STORY-131: mención · story.md:75 (misma línea literal)<br>STORY-132: mención · story.md:60 (misma línea literal)<br>STORY-133: mención · story.md:76 (misma línea literal)<br>STORY-134: mención · story.md:58 (misma línea literal)<br>STORY-135: mención · story.md:50 `  Y npm run verify:repository pasa` | ✓ |
| CS-9 | ``Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)`` | 41 | STORY-131, STORY-132, STORY-133, STORY-134, STORY-135 | STORY-131: mención · story.md:76 ``  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».``<br>STORY-132: mención · story.md:61 (misma línea literal)<br>STORY-133: mención · story.md:77 (misma línea literal)<br>STORY-134: mención · story.md:59 (misma línea literal)<br>STORY-135: mención · story.md:71 (misma línea literal) | ✓ |
| SMOKE-1 | `Skill con rol local funciona en runtime sin carpeta agents/` | 45 | STORY-133 | STORY-133: mención · story.md:68 ``- **Runtime objetivo:** `codex` es el único runtime de `config/runtimes.json` con `agentsDirectory: null`. Es el caso que valida el SMOKE-1 de la épica.`` | ✓ |

## Hallazgos

Sin hallazgos.

## Notas del análisis

- Sin notas sobre el índice, la pertenencia ni la madurez: las seis historias están en `SPECIFY/DONE` y su única referencia `related` (`EPIC-24-agentes-locales-por-skill`) resuelve.
- CS-5 se cubre por evidencia E2 (juicio acotado), no por mención: `STORY-129` no cita el criterio en su `story.md`. Para fijar la cobertura de forma determinista, puede citarse en sus notas.
