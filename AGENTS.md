# IMPORTANTE — leer antes de actuar

- **Idioma de trabajo:** skills, agentes y documentos de este repositorio se redactan en **español**. Los skills heredados de ecosistemas en inglés (ej. `test-cypress-cucumber`, `test-playwright-cucumber`) pueden mantener su idioma original.
- **El repositorio es la fuente de verdad:** specs, políticas, ADRs y decisiones viven versionados aquí dentro. Si necesitas saber "cómo trabajamos", está en el repo, no fuera de él.
- **`skills/` y `agents/` (en la raíz) son la fuente única de skills y agentes de este repo.** Los skills nuevos se crean en `skills/<skill-name>/` y los subagentes en `agents/<nombre>.agent.md`. El instalador copia desde estas carpetas solo mediante un acto explícito (`agile-sddf install`) hacia un runtime declarado en `config/runtimes.json`; ese destino es salida de instalación, no la fuente. El catálogo vigente ya se inyecta en cada conversación de Claude Code — no lo enumeres de memoria en este archivo; verifica con `ls skills/` / `ls agents/` si necesitas confirmar que algo existe antes de referenciarlo.
- **Resolución de raíz obligatoria:** cada skill resuelve localmente `REPO_ROOT` y `SPECS_BASE` con la precedencia `SDDF_ROOT` válida → `sddf.config.yaml.root` válido → `docs`. Una fuente explícita inválida bloquea escrituras. `skill-preflight` es un diagnóstico explícito, no un paso automático.
- **Veracidad ante todo:** antes de editar la sección de estructura de este archivo, verifica con el filesystem (`ls skills/`, `ls agents/`, `ls docs/`). Nunca describas algo que no existe ni omitas algo relevante que sí existe.
- **Framework agnóstico al SDK/LLM:** aunque el desarrollo inicial se hizo con Claude Code, el diseño de SDDF es independiente del SDK o LLM específico. Los runtimes soportados, sus destinos locales/globales y su layout viven exclusivamente en `config/runtimes.json`; no dupliques esa lista en scripts o documentos. `.agents` es, cuando el contrato lo declare, una ruta de compatibilidad solo para skills y no un destino instalable de agentes.
---

# Agile Spec-Driven-Development Framework (SDDF)

Framework multiagente minimalista (solo Markdown + scripts Node.js de instalación) que automatiza el ciclo Spec-Driven Development completo — intención → discovery → planning → historias de usuario → implementación con TDD — operando sobre Claude Code, OpenCode y GitHub Copilot. La visión de producto completa vive en `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md`; este mismo repositorio dogfoodea su propio framework para desarrollarse a sí mismo (ver `docs/specs/01-projects/PROJ-01-agile-sddf/`).

## Stack y comandos

- **Lenguaje:** Markdown (skills/agentes) + TypeScript/Node.js solo para la parte ejecutable (`scripts/cli.js`, `install.js` y verificadores deterministas).
- **Validación del runner de evals:** no hay `npm test`, build ni lint genéricos. `npm run test:eval:runner` ejecuta la suite determinista de `scripts/run-evals.js`; `npm run test:eval -- [opciones]` ejecuta o planifica los casos de `skills/<skill>/evals/evals.json`. Una selección inválida o vacía falla cerrada; `--dry-run` solo aprueba con un plan no vacío.
- **Instalar skills/agentes en otro proyecto:** `npx agile-sddf install [--global] [--target <runtime>] [--force]`. Consulta `config/runtimes.json` para los IDs admitidos; `npm install` no crea directorios de runtime ni ejecuta una copia implícita.
- **Perfiles y stacks:** `config/profiles.json` separa `core` (predeterminado, sin extensiones externas) de `dogfood` (este repositorio, con workers de autoría fijados). Un perfil selecciona un `stack`; no es otra forma de instalación. Valida el contrato con `node scripts/verify-profiles.js`; para comprobar dogfood instalado usa su `--extensions-dir` explícito.
- **CI (`.github/workflows/`):** `quality.yml` ejecuta el gate determinista sin secretos ni lifecycle scripts en Windows, macOS y Linux. `evals.yml` conserva la selección desde SHA base en seco cuando cambian skills; las evaluaciones LLM reales no corren en PRs no confiables. Los workflows de seguridad siguen cubriendo Skill Shielder y Docker.

## Estructura del repositorio

```
agile-sddf/
├── docs/
│   ├── index.md                                            # punto de entrada wiki (wikilinks [[slug]])
│   ├── specs/{01-projects,02-epics,03-stories}/            # artefactos generados por los skills SDD
│   ├── templates/                                          # plantillas de generación (meta-artefactos)
│   ├── policies/                                           # constitution.md, dod-story.md
│   ├── adr/                                                # decisiones de arquitectura (ADR-NNNN, inmutables)
│   ├── guides/                                             # guías de referencia (ver docs/index.md)
│   └── runbooks/                                           # procedimientos operativos (deploy npm, docker)
├── skills/                                                 # fuente única de verdad: skills SDD (uno por carpeta)
├── agents/                                                 # fuente única de verdad: subagentes (*.agent.md)
├── config/                                                 # contratos versionados de perfiles, stacks y runtimes
├── scripts/                                                # CLI, instalación, runner y verificadores deterministas
└── sddf.config.yaml                                        # skills activos por fase del pipeline TDD de este repo
```

**Plataformas soportadas:** las declaradas con estado `supported` en `config/runtimes.json`. El instalador copia desde `skills/` y `agents/` (raíz, fuente única) solamente al destino canónico del runtime solicitado. Consulta ese contrato para IDs, rutas concretas y soporte a otros CLI/LLMs antes de afirmar compatibilidad.

## Particularidades de este repo (lo que el código no te dice)

- **`root` en `sddf.config.yaml`** declara la raíz versionada de artefactos; `SDDF_ROOT` es un override temporal válido solo si la ruta existe. Este repo declara `root: docs`, así que los specs viven en `docs/specs/`.
- **WIP = 1 por nivel de pipeline:** solo un documento puede tener `substatus: IN-PROGRESS` a la vez por nivel (project, épica o story). Verifícalo antes de activar un ítem nuevo.
- **`.tmp/<skill-name>/` nunca se versiona:** es el canal de comunicación entre subagentes y el skill orquestador, para evitar el "teléfono descompuesto". Está en `.gitignore`; no lo trates como directorio permanente.
- **Los ADR aceptados son inmutables:** se reemplazan con un ADR nuevo (`superseded-by`), nunca se editan in place. Ver `docs/adr/README.md`.
- **Publicar un skill nuevo en npm:** su ruta debe agregarse al arreglo `files` de `package.json`; después se distribuye mediante `agile-sddf install`, nunca por `postinstall`.
- **Commands son legacy en Claude:** preferimos skills (en `skills/`) sobre commands (`.claude/commands/`, que no existe en este repo); los commands solo se justifican para integraciones externas.

## Modelo de delegación: skills, agentes y subagentes

Dos mecanismos de invocación, según cómo funciona el harness de Claude Code:

- **Composición inline (skill → skill):** la misma sesión lee el `SKILL.md` del sub-skill y sigue sus instrucciones; comparten todo el contexto. Permitido, pero en cadenas cortas — el contexto se acumula.
- **Delegación (→ subagente):** crea un contexto nuevo y aislado. Solo la sesión que ejecuta skills delega en subagentes (`agents/`); **un subagente nunca delega en otro subagente.**

```
skill orquestador (sesión principal)
    ├── skill B (composición inline — misma sesión, cadena corta)
    ├── agent A (subagente — contexto aislado)
    └── agent C (subagente — contexto aislado)
                  └── ✗ prohibido: agente que delega en otro agente
```

Cada subagente escribe su resultado en `.tmp/<skill-name>/` y devuelve el control; el orquestador lee solo esos archivos para consolidar — nunca le pasa al subagente todo su contexto heredado. El detalle completo (matriz de invocaciones permitidas, patrón de agentes locales en `<skill>/agents/`, contrato de `.tmp/`) está en `docs/guides/best-practices-for-skills.md`.

## Documentación de referencia

`docs/index.md` es el punto de entrada wiki (wikilinks `[[slug]]`) hacia specs, ADRs y guías. Antes de inventar una convención nueva, comprueba si ya existe una guía en `docs/guides/` (agentes, skills, comandos, harness engineering, branching, organización de artefactos, specs y workflows, etc.).

---

# Políticas del Proyecto

@docs/policies/constitution.md
@docs/policies/dod-story.md
