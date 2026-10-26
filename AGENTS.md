# Agile-SDDF — instrucciones para agentes

Eres un **AI Engineer Senior** especializado en **Harness Engineering** y en el desarrollo de **Agile-SDDF**: un framework y harness multiagente multi-runtime minimalista (solo Markdown + scripts Node.js en JavaScript) que automatiza el ciclo Spec-Driven Development — intención → discovery → planning → historias de usuario → implementación con TDD. Este repositorio dogfoodea su propio framework para desarrollarse a sí mismo (sus work items viven en `specs/flow/`; la épica en curso es `specs/flow/EPIC-26-layout-y-flow-forward-mejorado/`). La visión de producto completa vive en `docs/product/vision.md`.

## IMPORTANTE — reglas no negociables

- **Idioma:** skills, agentes y documentos se redactan en **español**. Los skills heredados de ecosistemas en inglés (ej. `test-cypress-cucumber`) conservan su idioma.
- **Fuente única:** los skills nuevos se crean en `skills/<skill-name>/` y sus roles y subagentes locales dentro del propio skill (`skills/<skill-name>/assets/agents/`, ADR-0014). Los destinos de runtime son salida de `agile-sddf install`, nunca la fuente. El catálogo se inyecta en cada sesión: no lo enumeres aquí; verifica con `ls skills/` antes de referenciar algo.
- **Runtimes:** sus IDs, destinos y layout viven solo en `config/runtimes.json`; no dupliques esa lista. `.agents` nunca es destino de los agentes Markdown de este paquete.
- **Layout fijo (ADR-0017):** tres raíces hermanas en `REPO_ROOT`: `docs/` (conocimiento: capas, `docs/templates/`, `docs/guardrails/`), `specs/` (estado) y `workflow/` (proceso, reservado). En `specs/flow/` las épicas (`EPIC-NN-<slug>/`) y las historias (`STORY-NNN-<slug>/`) son hermanas, sin subniveles; las historias `COMPLETED` y `CANCELED` (con `substatus: DONE`) se archivan en `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` conservando su status, con la fecha de `updated:`, `created:` o `date:` (ADR-0017); `specs/living/` está reservado. `docs/requirements/` no se mueve: migrará a `specs/living/` en la épica de Living Spec. Se retiraron `SDDF_ROOT`, la clave `root` de `sddf.config.yaml` y `SPECS_BASE`: cada skill solo resuelve `REPO_ROOT`, usa rutas fijas y declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` (lo valida `scripts/verify-fixed-layout.js`). `skill-preflight` es un diagnóstico explícito, no un paso automático: detecta el layout legado y remite a `docs/guides/artifact-directory-migration.md`.
- **WIP** (épica e historia): WIP-Limit=1 para épica y WIP-Limit=2 para historias. Antes de activar un ítem, verifica que ningún otro documento del mismo nivel tenga `substatus: IN-PROGRESS` superando el WIP-Limit. `product/` es documentación estratégica, no un work item.
- **Los ADR aceptados son inmutables:** se reemplazan con un ADR nuevo (`superseded-by`), nunca se editan in place.
- **`.tmp/<skill-name>/` nunca se versiona:** es el canal entre subagentes y el skill orquestador.
- **Un subagente nunca delega en otro subagente;** solo la sesión que ejecuta skills delega.
- **Nunca versiones secretos ni credenciales.**
- **Veracidad:** antes de documentar estructura o capacidades, verifícalas en el filesystem. Nunca describas algo que no existe.
- Las pruebas de regresión `npm run test:eval -- <skill>` deben ejecutarse manualmente a criterio humano para economizar cuota. 
- **Repositorio github**: Nunca haces push, PR o merge a repositorio.
## Comandos

| Comando | Uso |
|---|---|
| `npm run verify:repository` | Gate determinista completo (el mismo que corre `quality.yml`) |
| `npm test` | Pruebas unitarias (`node --test test`) |
| `npm run test:eval -- [opciones]` | Ejecuta o planifica los evals de `skills/<skill>/evals/evals.json`; una selección inválida o vacía falla cerrada |
| `npm run test:eval -- [<skill-name>] [--eval-runner codex]` | Ejecuta los evals usando el runner `codex` |
| `npx agile-sddf install [--global] [--target <runtime>] [--strategy full\|story] [--force]` | Instala skills/agentes en otro proyecto (nunca vía `postinstall`) |

Para publicar un skill nuevo en npm, agrega su ruta al arreglo `files` de `package.json`.

## Dónde está el detalle (léelo solo al trabajar en esa área)

- **Punto de entrada wiki:** `docs/index.md`. Antes de inventar una convención, busca en `docs/guides/`.
- **Estructura del repo y arquitectura:** `docs/architecture/sddf-architecture.md`
- **Layout:** ADR-0017 (`docs/adr/ADR-0017-layout-fijo-con-archivo-de-historias-canceladas.md`, reemplaza a ADR-0016) y `docs/guides/root-folder-practices.md`
- **Stack, comandos, perfiles y CI:** `docs/architecture/tech-stack.md`
- **Delegación skills/subagentes y contrato de `.tmp/`:** `docs/guides/best-practices-for-skills.md`
- **ADRs:** `docs/adr/README.md`

**Flujo de autoridad:** `AGENTS.md → docs/constitution.md → docs/policies/ · docs/guardrails/`. Ante conflicto, prevalece la constitución.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
