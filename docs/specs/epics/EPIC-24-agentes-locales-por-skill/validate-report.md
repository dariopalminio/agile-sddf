---
type: validate-report
id: EPIC-24
slug: EPIC-24-agentes-locales-por-skill
title: "Validate Report: agentes-locales-por-skill"
epic: EPIC-24
date: 2026-10-16
mode: manual
verdict: READY-TO-SHIP
created: 2026-10-16
updated: 2026-10-16
---

# Test Report: agentes-locales-por-skill

**Date**: 2026-10-16
**Epic**: EPIC-24
**Mode**: manual
**Veredicto**: ✅ READY-TO-SHIP

## Sign-off

- [x] Condición 1 — Historias hijas en estado terminal `COMPLETED` o `DELIVER/DONE`
- [x] Condición 2 — epic-analyze-report.md con Veredicto APPROVED.
- [x] Condición 3 — Criterios de salida y smoke tests
- [x] Condición 4 — El gate determinista del repositorio pasa: `npm run verify:repository` (incluye `npm run test`)
- [x] Condición 5 — Los evals con LLM de los skills modificados pasan
- [x] Condición 6 — La simulación de publicación (sin modificar versión) pasa: `npm publish --dry-run --access public`
- [ ] Condición 7 — La instalación funciona: instalación manual + Smoke desde el tarball (ejecución manual).
- [ ] Condición 8 — CHANGELOG.md actualizado con los cambios de la épica

> El smoke automatizado del tarball (`verify:repository`) aprobó los 4 runtimes. La ejecución manual desde el tarball sigue pendiente, a criterio humano. No forma parte de las tres condiciones del veredicto.

## Condición 1 — Historias hijas en estado terminal

Se leyeron los `story.md` que declaran `parent: EPIC-24-agentes-locales-por-skill`:

| Historia | status | substatus | Estado |
|---|---|---|---|
| STORY-129 — Migrar analizadores de reverse-engineering | COMPLETED | DONE | ✓ |
| STORY-131 — Partir project-pm en roles locales | COMPLETED | DONE | ✓ |
| STORY-132 — Partir project-architect en roles locales | COMPLETED | DONE | ✓ |
| STORY-133 — Mover project-ux a rol local de project-discovery | COMPLETED | DONE | ✓ |
| STORY-134 — Migrar project-story-mapper a rol local | COMPLETED | DONE | ✓ |
| STORY-135 — Migrar story-product-owner a rol local | COMPLETED | DONE | ✓ |

Coinciden con el índice `## Historias` de `epic.md` (6/6). No hay historias huérfanas.

✅ PASS

## Condición 2 — epic-analyze-report.md

- `epic-analyze-report.md` existe en la carpeta de la épica (2026-10-15).
- `## Resumen` → **Veredicto: APPROVED**, 0 ERROR y 0 WARNING. El contrato de salida tiene 10/10 elementos cubiertos y las historias hijas tienen 6/6 de madurez.

✅ PASS

## Condición 3 — Criterios de salida y smoke tests

### Criterios de salida

| # | Criterio | Evidencia | Estado |
|---|---|---|---|
| CS-1 | Ningún `SKILL.md` referencia `agents/` ni a un agente global fuera de "Dependencias" | Se buscó con `grep` en `skills/*/SKILL.md`. No aparecen referencias a `project-pm`, `project-architect`, `project-ux`, `project-story-mapper`, `story-product-owner` ni a `reverse-engineer-*`. Las únicas menciones `agents/` (`story-code-review`, `story-verify`) apuntan a subagentes **locales** del propio skill (`skills/<skill>/agents/`), no al `agents/` global. Ver Observación 1. | ✓ |
| CS-2 | `agents/` eliminada, fuera de `package.json` → `files`, install con código 0 por runtime | `agents/` no existe y `git ls-files "agents/*"` no devuelve nada. `files` = `skills/, config/, scripts/, sddf.config.yaml, README.md, LICENSE`. `node scripts/cli.js install --target <rt>` se ejecutó en directorios limpios y terminó con `exit=0` en `claude-code`, `opencode`, `github-copilot` y `codex` (34 skills, 0 agentes). | ✓ |
| CS-3 | Cada skill que invocaba un agente global tiene sus roles o subagentes en `skills/<skill>/assets/agents/` | `project-begin` (`begin-intent`), `project-discovery` (`discovery-pm`, `discovery-architect`, `discovery-ux`), `project-planning` (`planning`), `project-story-mapping` (`story-mapper`), `reverse-engineering` (`architect`, `product-discovery`, `business-analyst`, `ux-flow-mapper`, `synthesizer`) y `story-specify` (`product-owner`). | ✓ |
| CS-4 | Los entrevistadores son archivos de rol que lee la sesión, no subagentes | Cada rol declara "Lo lee y ejecuta la sesión del skill; no se invoca como subagente". Cada `SKILL.md` indica "lee `assets/agents/<rol>.md` … no lances un subagente". | ✓ |
| CS-5 | Los analizadores `reverse-engineer-*` son subagentes locales invocados por `reverse-engineering` | `reverse-engineering/SKILL.md:61` lanza un subagente genérico por cada analizador local y `:89` lanza el `synthesizer`. | ✓ |
| CS-6 | Ningún subagente local invoca a otro (ADR-0002) | Los cinco subagentes de `reverse-engineering` declaran "**Sin delegación:** no lances subagentes ni invoques skills". Los roles de entrevista tampoco delegan. | ✓ |
| CS-7 | `evals/evals.json` actualizados y en verde | Ver la sección "Validaciones no deterministas": PASS en los 6 skills afectados. | ✓ |
| CS-8 | `npm run verify:repository` pasa | Se volvió a ejecutar el 2026-10-16 sobre el estado actual: `[OK] Verificación determinista del repositorio aprobada.` | ✓ |
| CS-9 | Los skills migrados funcionan en `codex` (`agentsDirectory: null`) | La instalación `codex` copia los `assets/agents/` de los 6 skills. `project-discovery` se ejecutó de punta a punta en `codex` (SMOKE-1). Ver Observación 2. | ✓ |

### SMOKE-1 — Skill con rol local funciona en runtime sin carpeta agents/

**Preparación:**

- Se creó un proyecto limpio (scratchpad) y se ejecutó `node scripts/cli.js install --target codex`. El resultado fue `.agents/skills/` sin carpeta de agentes, con `project-discovery/assets/agents/{discovery-pm,discovery-architect,discovery-ux}.md`.
- Se agregó `docs/product/vision.md` con `substatus: DONE` y `sddf.config.yaml` con `root: docs`. No había templates centrales.

**Ejecución:** `codex exec -s workspace-write` (codex-cli 0.162.1), con la instrucción de seguir `.agents/skills/project-discovery/SKILL.md`. Como la corrida era no interactiva, el propio agente respondió como usuario y contestó `Confirmar` en el gate.

**Resultado:**

- Mostró `📋 Rol local: assets/agents/discovery-pm.md`, luego `discovery-ux.md` y luego `discovery-architect.md`, cada uno con "conduce esta sesión, sin subagente". Leyó los tres roles desde `.agents/skills/project-discovery/assets/agents/`.
- Condujo la entrevista y generó el documento de discovery: `docs/product/stakeholders.md` (`substatus: DONE`, 2 perfiles), `FR-001`…`FR-007` y `NFR-001`…`NFR-003`.
- En el log (4730 líneas) no aparece ninguna ruta `agents` fuera de `assets/agents` ni `.agents/skills`. No buscó archivos en `agents/` y no lanzó subagentes.
- Cierre: `✅ Discovery completo: 2 perfiles en docs/product/stakeholders.md · 7 FR y 3 NFR en docs/requirements/ · Siguiente comando: /project-planning`.

✅ PASS

### Observaciones (no bloqueantes)

1. `story-code-review` (4 revisores) y `story-verify` (`qa-engineer`) tienen subagentes locales en `skills/<skill>/agents/*.agent.md` y no en `skills/<skill>/assets/agents/`, que es el layout de ADR-0014. Viven en esa ruta desde `fbbdb80` (2026-06-20) y nunca fueron agentes globales. La fe de erratas de ADR-0014 (2026-10-15) retiró la limpieza de `story-code-review` de las consecuencias de la decisión. Quedan fuera del alcance de EPIC-24. Se recomienda alinearlos al layout `assets/agents/` en un ítem propio.
2. CS-9 se ejecutó de punta a punta en `codex` solo para `project-discovery` (SMOKE-1). Para los otros 5 skills, la evidencia es estática: la instalación `codex` incluye sus roles y ningún `SKILL.md` resuelve roles fuera de su directorio. Sus evals se corrieron con el runner por defecto (`claude`), no con `--eval-runner codex`.
3. El paso de las seis historias de `VERIFY/DONE` a `COMPLETED/DONE` está en la copia de trabajo y todavía no tiene commit.

## Condición 4 Validaciones deterministas:

npm run test
ℹ tests 251
ℹ suites 0
ℹ pass 251
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 20710.8821
✅ PASS

npm run verify:repository
...
npm notice Tarball Details
npm notice name: agile-sddf
npm notice version: 4.0.1
npm notice filename: agile-sddf-4.0.1.tgz
npm notice package size: 502.7 kB
npm notice unpacked size: 2.0 MB
npm notice shasum: 567e7b741cd1221bb104ad554169449790a13596
npm notice integrity: sha512-29kEzr1hdY4sQ[...]CakQ517bLF8kw==
npm notice total files: 451
npm notice
agile-sddf-4.0.1.tgz
[VERIFY] smoke del tarball
[OK] Smoke del tarball aprobó 4 runtime(s) declarados.
✅ PASS

[OK] Verificación determinista del repositorio aprobada.

npm run verify:repository (re-ejecución 2026-10-16, validación pre-SHIP)
[VERIFY] smoke del tarball
[OK] Smoke del tarball aprobó 4 runtime(s) declarados.
[OK] Verificación determinista del repositorio aprobada.
✅ PASS

npx agile-sddf install --target <runtime> (proyectos limpios, 2026-10-16)
- claude-code: exit=0 — 34 skills, 0 agents
- opencode: exit=0 — 34 skills, 0 agents
- github-copilot: exit=0 — 34 skills, 0 agents
- codex: exit=0 — 34 skills
✅ PASS

## Condición 5 - Validaciones no deterinistas (con LLM):

Run tests eval:
- STORY-129: npm run test:eval -- reverse-engineering
- STORY-131: npm run test:eval -- project-begin
- STORY-132:  npm run test:eval -- project-planning 
- STORY-133: npm run test:eval -- project-discovery
- STORY-134:  npm run test:eval -- project-story-mapping
- STORY-135:  npm run test:eval -- story-specify 

✅ PASS todos los evals.

SMOKE-1 (codex exec, runtime codex sin agents/, 2026-10-16)
- Roles leídos: discovery-pm.md, discovery-ux.md, discovery-architect.md (desde .agents/skills/project-discovery/assets/agents/)
- Escritos: docs/product/stakeholders.md + 7 FR + 3 NFR
✅ PASS
