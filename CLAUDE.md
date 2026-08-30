# IMPORTANTE — leer antes de actuar

- **Idioma de trabajo:** skills, agentes y documentos de este repositorio se redactan en **español**. Los skills heredados de ecosistemas en inglés (ej. `test-cypress-cucumber`, `test-playwright-cucumber`) pueden mantener su idioma original.
- **El repositorio es la fuente de verdad:** specs, políticas, ADRs y decisiones viven versionados aquí dentro. Si necesitas saber "cómo trabajamos", está en el repo, no fuera de él.
- **`skills/` y `agents/` (en la raíz) son la fuente única de skills y agentes de este repo.** Los skills nuevos se crean en `skills/<skill-name>/` y los subagentes en `agents/<nombre>.agent.md`. El instalador (`scripts/install.js`) copia desde estas carpetas raíz hacia el destino elegido (`.claude/`, `.agents/` o `.github/`); ese destino es solo salida de instalación, no la fuente. El catálogo vigente ya se inyecta en cada conversación de Claude Code — no lo enumeres de memoria en este archivo; verifica con `ls skills/` / `ls agents/` si necesitas confirmar que algo existe antes de referenciarlo.
- **`skill-preflight` es el paso 0 obligatorio** de cualquier skill: verifica `SDDF_ROOT`, estructura de directorios y templates antes de ejecutar lógica de negocio.
- **Veracidad ante todo:** antes de editar la sección de estructura de este archivo, verifica con el filesystem (`ls skills/`, `ls agents/`, `ls docs/`). Nunca describas algo que no existe ni omitas algo relevante que sí existe.
- **Framework agnóstico al SDK/LLM:** aunque el desarrollo inicial se hizo con Claude Code, el diseño de SDDF es independiente del SDK o LLM específico. La instalación de skills/agentes en `.agents/` y `.github/` es un paso explícito para soportar múltiples plataformas; el orquestador de cada skill puede adaptarse a las APIs de cada plataforma sin afectar la estructura general del framework. Los skills no tienen que tener referencias explícitas a `.claude`. 
---

# Agile Spec-Driven-Development Framework (SDDF)

Framework multiagente minimalista (solo Markdown + scripts Node.js de instalación) que automatiza el ciclo Spec-Driven Development completo — intención → discovery → planning → historias de usuario → implementación con TDD — operando sobre Claude Code, OpenCode y GitHub Copilot. La visión de producto completa vive en `docs/specs/01-projects/PROJ-01-agile-sddf/project-intent.md`; este mismo repositorio dogfoodea su propio framework para desarrollarse a sí mismo (ver `docs/specs/01-projects/PROJ-01-agile-sddf/`).

## Stack y comandos

- **Lenguaje:** Markdown (skills/agentes) + TypeScript/Node.js solo para la parte ejecutable (`scripts/cli.js`, `install.js`, `postinstall.js`).
- **Sin build/test/lint propios:** `package.json` no declara ningún script salvo `postinstall`. No busques `npm test` ni `npm run build` — no existen en este repo.
- **Instalar skills/agentes en otro proyecto:** `npx agile-sddf install [--global] [--target .claude|.agents|.github] [--force]`.
- **CI (`.github/workflows/`):** solo corre escaneo de seguridad de skills (Skill Shielder vía `skill-security-audit.yml`) y `docker-security.yml`; no hay pipeline de tests funcionales.

## Estructura del repositorio

```
agile-sddf/
├── docs/
│   ├── index.md                                            # punto de entrada wiki (wikilinks [[slug]])
│   ├── specs/{01-projects,02-epics,03-stories,templates}/  # artefactos generados por los skills SDD
│   ├── policies/                                           # constitution.md, definition-of-done-story.md
│   ├── adr/                                                # decisiones de arquitectura (ADR-NNNN, inmutables)
│   ├── guides/                                             # guías de referencia (ver docs/index.md)
│   └── runbooks/                                           # procedimientos operativos (deploy npm, docker)
├── skills/                                                 # fuente única de verdad: skills SDD (uno por carpeta)
├── agents/                                                 # fuente única de verdad: subagentes (*.agent.md)
├── scripts/                                                # cli.js, install.js, postinstall.js
└── sddf.config.yaml                                        # skills activos por fase del pipeline TDD de este repo
```

**Plataformas soportadas:** Claude Code, OpenCode y GitHub Copilot. El instalador copia desde `skills/` y `agents/` (raíz, fuente única) al destino elegido (`.claude/`, `.agents/`, `.github/`); soporte a otros CLI/LLMs se evalúa en releases futuros.

## Particularidades de este repo (lo que el código no te dice)

- **`SDDF_ROOT`** define la raíz de artefactos (default `docs`); este repo usa el valor por defecto, así que los specs viven en `docs/specs/`, no en `.sdd/` ni en la raíz.
- **WIP = 1 por nivel de pipeline:** solo un documento puede tener `substatus: IN-PROGRESS` a la vez por nivel (project, épica o story). Verifícalo antes de activar un ítem nuevo.
- **`.tmp/<skill-name>/` nunca se versiona:** es el canal de comunicación entre subagentes y el skill orquestador, para evitar el "teléfono descompuesto". Está en `.gitignore`; no lo trates como directorio permanente.
- **Los ADR aceptados son inmutables:** se reemplazan con un ADR nuevo (`superseded-by`), nunca se editan in place. Ver `docs/adr/README.md`.
- **Publicar un skill nuevo en npm:** su ruta debe agregarse al arreglo `files` de `package.json`, o quienes instalen el paquete no lo recibirán vía `postinstall`.
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
@docs/policies/definition-of-done-story.md
