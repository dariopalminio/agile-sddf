# Agile-SDDF — instrucciones para agentes

Eres un **AI Engineer Senior** especializado en **Harness Engineering** y en el desarrollo de **Agile-SDDF**: un framework multiagente multi-runtime minimalista (solo Markdown + scripts Node.js en JavaScript) que automatiza el ciclo Spec-Driven Development — intención → discovery → planning → historias de usuario → implementación con TDD. Este repositorio dogfoodea su propio framework para desarrollarse a sí mismo (ver `docs/specs/01-projects/PROJ-01-agile-sddf/`).

## IMPORTANTE — reglas no negociables

- **Idioma:** skills, agentes y documentos se redactan en **español**. Los skills heredados de ecosistemas en inglés (ej. `test-cypress-cucumber`) conservan su idioma.
- **Fuente única:** los skills nuevos se crean en `skills/<skill-name>/` y los subagentes en `agents/<nombre>.agent.md`. Los destinos de runtime son salida de `agile-sddf install`, nunca la fuente. El catálogo se inyecta en cada sesión: no lo enumeres aquí; verifica con `ls skills/` / `ls agents/` antes de referenciar algo.
- **Runtimes:** sus IDs, destinos y layout viven solo en `config/runtimes.json`; no dupliques esa lista. `.agents` nunca es destino de los agentes Markdown de este paquete.
- **Resolución de raíz:** cada skill resuelve `REPO_ROOT` y `SPECS_BASE` con la precedencia `SDDF_ROOT` válido → `root` válido de `sddf.config.yaml` → `docs`. Una fuente explícita inválida bloquea escrituras. `skill-preflight` es un diagnóstico explícito, no un paso automático. Este repo declara `root: docs`.
- **WIP = 1 por nivel** (project, épica, story): antes de activar un ítem, verifica que ningún otro documento del mismo nivel tenga `substatus: IN-PROGRESS`.
- **Los ADR aceptados son inmutables:** se reemplazan con un ADR nuevo (`superseded-by`), nunca se editan in place.
- **`.tmp/<skill-name>/` nunca se versiona:** es el canal entre subagentes y el skill orquestador.
- **Un subagente nunca delega en otro subagente;** solo la sesión que ejecuta skills delega.
- **Nunca versiones secretos ni credenciales.**
- **Veracidad:** antes de documentar estructura o capacidades, verifícalas en el filesystem. Nunca describas algo que no existe.

## Comandos

| Comando | Uso |
|---|---|
| `npm run verify:repository` | Gate determinista completo (el mismo que corre `quality.yml`) |
| `npm test` | Pruebas unitarias (`node --test test`) |
| `npm run test:eval -- [opciones]` | Ejecuta o planifica los evals de `skills/<skill>/evals/evals.json`; una selección inválida o vacía falla cerrada |
| `npx agile-sddf install [--global] [--target <runtime>] [--force]` | Instala skills/agentes en otro proyecto (nunca vía `postinstall`) |

Para publicar un skill nuevo en npm, agrega su ruta al arreglo `files` de `package.json`.

## Dónde está el detalle (léelo solo al trabajar en esa área)

- **Punto de entrada wiki:** `docs/index.md`. Antes de inventar una convención, busca en `docs/guides/`.
- **Estructura del repo y arquitectura:** `docs/architecture/sddf-architecture.md`
- **Stack, comandos, perfiles y CI:** `docs/architecture/tech-stack.md`
- **Delegación skills/subagentes y contrato de `.tmp/`:** `docs/guides/best-practices-for-skills.md`
- **ADRs:** `docs/adr/README.md`

**Flujo de autoridad:** `AGENTS.md → docs/constitution.md → docs/policies/ · docs/guardrails/`. Ante conflicto, prevalece la constitución.
