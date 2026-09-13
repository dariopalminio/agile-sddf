---
type: adr
id: ADR-0009
slug: perfiles-runtimes-e-instalacion-explicita
title: "Perfiles reproducibles, runtimes canónicos e instalación explícita"
status: ACCEPTED
date: 2026-09-13
supersedes: null
superseded-by: null
---

# ADR-0009: Perfiles reproducibles, runtimes canónicos e instalación explícita

## Contexto y problema

STORY-094 detectó que el paquete mezclaba el perfil distribuido con el entorno
de autoría de este repositorio. `sddf.config.yaml` requería `skill-master` y
`skill-test-evals`, aunque ambos no pertenecen al paquete core. Además,
`postinstall` copiaba archivos por efecto de `npm install`, y los directorios
de Claude Code, OpenCode y GitHub Copilot estaban codificados por separado.

En particular, `.agents/skills` es una ruta de compatibilidad que OpenCode y
Copilot pueden descubrir, pero no es el directorio canónico de sus agentes.
Instalar allí ambos tipos de artefacto anunciaba soporte que el runtime no
garantiza.

## Decisión

1. `config/profiles.json` es el manifiesto versionado de perfiles, stacks,
   workers y extensiones. `core` es el perfil por defecto; solo consume el
   contenido empaquetado y declara los workers externos como `none` y no
   obligatorios. `dogfood` usa el stack `sddf-authoring` y exige
   `skill-master` y `skill-test-evals` desde
   `agile-sddf-extension.git` en la revisión inmutable
   `302d66c93a3905e70dc0a0e267f43a553c873f49`.
2. No se descargan ni instalan extensiones de forma implícita. Para validar
   dogfood, el operador debe proveer deliberadamente `--extensions-dir` junto
   con `sddf.extensions.lock.json`, cuyo origen, SHA y workers coincidan con
   el manifiesto.
3. `config/runtimes.json` es la única fuente de rutas. Los destinos canónicos
   son:

| Runtime | Proyecto | Global | Skills | Agentes |
|---|---|---|---|---|
| `claude-code` | `.claude/` | `~/.claude/` | `skills/<name>/SKILL.md` | `agents/*.md` |
| `opencode` | `.opencode/` | `~/.config/opencode/` | `skills/<name>/SKILL.md` | `agents/*.md` |
| `github-copilot` | `.github/` | `~/.copilot/` | `skills/<name>/SKILL.md` | `agents/*.agent.md` |

   `.agents/skills` permanece registrado únicamente como ruta de
   compatibilidad de skills, con `installable: false`; no es un target del
   instalador.
4. `agile-sddf install --target <runtime>` es el único acto que copia skills y
   agentes. El lifecycle `postinstall` no escribe en el proyecto ni en el
   home, e ignora `SDDF_TARGET`.
5. Retirar la copia automática es un cambio incompatible: la siguiente
   publicación que aplique esta decisión debe ser una versión mayor (3.0.0 o
   posterior). La migración es ejecutar explícitamente
   `npx agile-sddf install --target <runtime>` después de instalar el paquete.

## Rationale

Los directorios se derivan de la documentación primaria de cada runtime:
Claude Code documenta `.claude/skills` y `.claude/agents`; OpenCode documenta
`.opencode/{skills,agents}` y `~/.config/opencode`; y Copilot documenta
`.github/{skills,agents}` y `~/.copilot/{skills,agents}`.

OpenCode y Copilot también documentan `.agents/skills` como compatibilidad,
pero esa compatibilidad no cubre los agentes configurables. Separar rutas
canónicas y compatibilidades evita una instalación aparentemente correcta que
no puede ser descubierta por completo.

La instalación por lifecycle viola el principio de acto explícito y convierte
una descarga de dependencia en una escritura fuera de `node_modules`. La
validación local con lock permite reproducir dogfood sin que CI de PR descargue
ni ejecute código de extensiones remotas.

## Alternativas consideradas

- **Mantener `.agents/` como destino de OpenCode:** descartada porque es una
  compatibilidad de skills, no la ubicación canónica de agentes OpenCode.
- **Copiar automáticamente durante `postinstall`:** descartada porque una
  instalación limpia debe no escribir configuración de runtime.
- **Empaquetar los workers de dogfood dentro de core:** descartada porque
  confunde el producto distribuido con las herramientas de mantenimiento y
  amplía el contenido instalado por todos los consumidores.
- **Resolver las rutas en cada script y documento:** descartada porque vuelve
  a introducir listas divergentes y hace imposible una prueba de inventario
  única.

## Consecuencias

**Positivas:**

- El perfil core se puede instalar sin extensiones externas ni efectos de
  lifecycle.
- Dogfood falla con un diagnóstico que identifica extensión, SHA y worker
  faltante.
- El instalador, la ayuda y los smoke tests consumen el mismo mapa de runtime.
- Los paths de compatibilidad quedan explícitos, sin convertirse en soporte de
  instalación accidental.

**Negativas / trade-offs:**

- Los usuarios que dependían de la copia automática deben ejecutar un comando
  adicional y actualizar al siguiente major.
- Provisionar dogfood requiere un lock local explícito y no puede depender de
  una descarga silenciosa.
- Las integraciones que aún usen `.agents/` deben migrar a un runtime canónico
  o limitarse conscientemente a la compatibilidad de skills.

## Referencias

- [[STORY-094-fixing-insights]]
- [Claude Code: skills](https://code.claude.com/docs/en/skills)
- [Claude Code: subagents](https://code.claude.com/docs/en/subagents)
- [OpenCode: skills](https://opencode.ai/docs/skills)
- [OpenCode: agents](https://opencode.ai/docs/agents)
- [GitHub Copilot: agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [GitHub Copilot CLI: directorio de configuración](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
