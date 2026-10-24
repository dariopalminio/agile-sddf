---
type: epic
id: EPIC-24
slug: EPIC-24-agentes-locales-por-skill
title: "Mover agentes globales a agentes locales por skill"
status: VALIDATE
substatus: DONE
parent: null
created: 2026-10-14
updated: 2026-10-15
related: []
---

# Épica: Mover agentes globales a agentes locales por skill

## Objetivo

Mover los agentes globales a agentes locales por skill, asegurando que cada skill gestione sus propios agentes y roles, y eliminando la dependencia de la carpeta global `agents/`.

## Alcance

Aplicar ADR-0014 moviendo cada agente de `agents/` al skill que lo invoca, en `skills/<skill>/assets/agents/`. Los agentes **entrevistadores** (hacen preguntas al usuario) pasan a ser archivos de rol que lee la sesión del skill. Los **analizadores** (trabajan aislados y escriben en `.tmp/`) pasan a ser subagentes locales del skill.

`project-pm` y `project-architect` se parten por responsabilidad. Cuando ningún skill dependa de `agents/` y la carpeta quede vacía, se retira del paquete.

## Historias

- [x] **STORY-129** — Migrar analizadores de reverse-engineering: mover los cinco `reverse-engineer-*` (`architect`, `product-discovery`, `business-analyst`, `ux-flow-mapper`, `synthesizer`) a subagentes locales en `skills/reverse-engineering/assets/agents/`, invocados por el skill y conservando el contrato de `.tmp/`.
- [x] **STORY-131** — Partir project-pm en roles locales: separar la sección Begin Intention en el rol `begin-intent` de `project-begin`, y la sección Discovery en el rol `discovery-pm` de `project-discovery`. Ambos son archivos de rol leídos por la sesión del skill.
- [x] **STORY-132** — Partir project-architect en roles locales: separar la sección Discovery en el rol `discovery-architect` de `project-discovery` y la sección Planning en el rol `planning` de `project-planning`. Ambos son archivos de rol leídos por la sesión del skill.
- [x] **STORY-133** — Mover project-ux a rol local de project-discovery: convertir `project-ux` en el archivo de rol `discovery-ux` que lee la sesión de `project-discovery`. Así deja de haber delegación de subagente a subagente.
- [x] **STORY-134** — Migrar project-story-mapper a rol local: convertir `project-story-mapper` en un archivo de rol de `project-story-mapping` leído por la sesión del skill.
- [x] **STORY-135** — Migrar story-product-owner a rol local: convertir `story-product-owner` en un archivo de rol de `story-specify` leído por la sesión del skill.

## Criterios de salida

- [x] Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"
- [x] La carpeta `agents/` queda vacía y se elimina como consecuencia de la migración (ADR-0014, Regla 2), `package.json` → `files` no incluye `agents/`, y `npx agile-sddf install --target <runtime>` termina con código 0 para cada runtime de `config/runtimes.json`
- [x] Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`
- [x] Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados
- [x] Los agentes analizadores (`reverse-engineer-*`) son subagentes locales que invoca `reverse-engineering`
- [x] Ningún subagente local invoca a otro subagente (ADR-0002)
- [x] Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`
- [x] `npm run verify:repository` pasa
- [x] Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)

## Smoke tests

### SMOKE-1 — Skill con rol local funciona en runtime sin carpeta agents/

```gherkin
Escenario: Skill con rol local funciona en runtime sin carpeta agents/
  Dado el framework sin la carpeta agents/
    Y los roles locales discovery-pm.md, discovery-architect.md y discovery-ux.md en skills/project-discovery/assets/agents/
  Cuando ejecuto /project-discovery en el runtime codex, que no soporta agents/
  Entonces el skill lee su rol local, conduce la entrevista y genera el documento de discovery
    Y no busca ningún archivo en agents/
```

### SMOKE-2 — Instalación manual + Smoke desde el tarball

```gherkin
Escenario: instalación manual + Smoke desde el tarball  
  Dado instalo el paquete en .tmp\test-consumer\  
  Cuando ejecuto script de copiado de archivos del paquete `npx agile-sddf install --target claude-code`  
  Entonces se encuentran todos los skills en .tmp\test-consumer\.claude\skills\  
  Y no hay ningún archivo en agents/
```

## Notas

- Decisión de arquitectura: ADR-0014 (independencia de skills respecto de `agents/`) y ADR-0002 (un solo nivel de delegación).
- Orden de implementación sugerido, de menor a mayor riesgo: reverse-engineering → project-flow → partir pm/architect/ux → story-mapper y product-owner → retirar `agents/`.
- `project-story-mapper` y `story-product-owner` se migran como archivos de rol porque no está garantizado que un subagente genérico pueda preguntar al usuario (ADR-0014, trade-offs).
- El retiro de `agents/` tampoco tiene historia propia: es un chore de cierre de la épica, que se hace después de STORY-129 y STORY-131 a STORY-135. Se puede hacer cuando `git ls-files "agents/*.agent.md"` no lista nada. Consiste en eliminar `agents/`, quitar `"agents/"` de `package.json` → `files` y adaptar las pruebas que exigen la carpeta (`test/install.test.js:126`, que lee `agents/` del repo, y `assertSameTree` en `scripts/smoke-package-install.js:226,236`). El instalador ya omite la copia cuando falta la fuente (`copyDir` en `scripts/install.js:104`), así que se mantiene `agentsDirectory: "agents"` en `config/runtimes.json`.
- Fuera de alcance por ahora: `scripts/verify-skill-independence.js` con fixtures, y la actualización de docs, CHANGELOG y guía de migración del release major. Los dos figuran como consecuencias en ADR-0014.
  - Excepción: cada historia corrige los templates y las guías que su propia migración deja falsos (regla de veracidad de `AGENTS.md`), sin que haga falta un CR por historia. Ejemplos: los comentarios `# escritor:` de `vision-template.md` y el párrafo de `docs/guides/harness-eng-agents-orchestration.md:182` en STORY-131. La revisión general de docs sigue en el chore de cierre.
- Origen: propuesta de mejora 008 (trazabilidad `agents/` → `skills/` y hallazgos colaterales).
