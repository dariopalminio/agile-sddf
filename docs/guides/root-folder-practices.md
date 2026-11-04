---
type: guide
slug: root-folder-practices
title: "Raíces del repositorio y layout fijo SDDF"
status: active
---

# Raíces del repositorio y layout fijo SDDF

SDDF distingue dos raíces que no son intercambiables:

| Raíz | Responsabilidad |
|---|---|
| `REPO_ROOT` | Raíz del repositorio de trabajo: `sddf.config.yaml`, código, scripts y el layout fijo de artefactos. |
| `CLI_ROOT` | Runtime instalado que contiene los artefactos admitidos por su contrato; se resuelve solo cuando hace falta. Sus destinos canónicos viven en `config/runtimes.json`. |

Desde 5.0.0 no existe una raíz de artefactos configurable: se retiraron `SDDF_ROOT`, la
clave `root` de `sddf.config.yaml` y `SPECS_BASE`. Para migrar un proyecto que aún los usa,
sigue [la sección de migración a 5.0.0](artifact-directory-migration.md#migracion-a-500--layout-fijo-de-tres-raices).

## Layout fijo

[ADR-0019](../adr/ADR-0019-layout-fijo-con-archivo-de-epicas.md) (que reemplaza a ADR-0017) fija tres raíces hermanas en
`REPO_ROOT`, cada una con una responsabilidad:

| Raíz | Responsabilidad | Contenido |
|---|---|---|
| `docs/` | Conocimiento | Las capas de memoria (`product/`, `requirements/`, `domains/`, `architecture/`, `adr/`, `policies/`, `guardrails/`, `guides/`, `runbooks/`, `templates/`), `constitution.md` e `index.md`. |
| `specs/` | Estado | `specs/flow/` con las épicas (`EPIC-NN-<slug>/`) y las historias (`STORY-NNN-<slug>/`) como hermanas, sin subniveles; `specs/flow/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` y `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` para las historias y las épicas `COMPLETED` o `CANCELED`; `specs/living/` reservado. |
| `workflow/` | Proceso | Reservado. |

Las historias y las épicas `COMPLETED` y `CANCELED` (con `substatus: DONE`) se archivan conservando su status. La
fecha del prefijo de archivo es el `updated:` del work item; si no es válido, su `created:`; si el frontmatter no
tiene ninguna de esas dos claves, su `date:`. Las historias las archiva `story-complete` y las épicas `epic-complete`,
siempre con confirmación humana. `docs/requirements/` no se mueve en
5.0.0: migrará a `specs/living/` en la épica de Living Spec.

## Contrato que usan los skills

Antes de acceder a artefactos, un skill:

1. Determina `REPO_ROOT`.
2. Usa rutas fijas relativas a él: work items en `specs/flow/`, templates en
   `docs/templates/` y DoD en `docs/guardrails/`.
3. Resuelve `CLI_ROOT` de forma independiente solo si necesita un skill, agente o
   comando del runtime.

Cada `SKILL.md` declara el contrato con el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`
seguido de un bloque que nombra `REPO_ROOT`, `specs/flow/`, `docs/templates/` y
`docs/guardrails/`. `scripts/verify-fixed-layout.js` lo valida en `npm run verify:repository`
y rechaza cualquier referencia a `SPECS_BASE`, `SDDF_ROOT` o a la clave `root` de
`sddf.config.yaml` fuera de la región de diagnóstico de `skill-preflight`.

No uses sustituciones textuales entre las raíces: `CLI_ROOT` no se deriva de `REPO_ROOT`
ni del layout.

Para detectar un runtime instalado, `skill-preflight` conserva el override explícito
`SDDF_CLI_ROOT`; sin override, lee `config/runtimes.json`, recorre los destinos locales
de sus runtimes soportados en el orden declarado y usa el primero que exista. Si no
encuentra ninguno, informa como advertencia el destino local del `defaultRuntime` del
mismo archivo. No copies esas rutas a otro documento o script: el mapa versionado es la
única fuente. `.agents` puede servir para descubrir skills por compatibilidad o ser el
`CLI_ROOT` de solo skills del target `codex`; en ningún caso representa un `CLI_ROOT`
canónico de los agentes Markdown del paquete.

## Bootstrap y diagnóstico

`/sddf-init` crea el layout fijo (`specs/flow/`, `specs/flow/archive/`, `specs/living/` y
`workflow/`, con un `.gitkeep` en cada directorio que crea), los templates en
`docs/templates/` y la configuración, de forma idempotente. No escribe la clave `root`. Si
encuentra `docs/specs/`, avisa del layout legado, no crea `specs/flow/` en paralelo y
remite a la guía de migración.

`/skill-preflight` es un diagnóstico explícito y no mutante. Informa `REPO_ROOT`, el layout
fijo, los templates centrales y el runtime disponible. Además detecta tres señales de layout
legado (`docs/specs/`, la clave `root` en `sddf.config.yaml` y la variable `SDDF_ROOT`), las
informa como advertencias y remite a la guía de migración. Un skill ordinario no lo invoca
automáticamente.

## Checklist de revisión

- Los work items viven en `specs/flow/` (o en `specs/flow/archive/` si están `COMPLETED` o `CANCELED`);
  no existe `docs/specs/`.
- `sddf.config.yaml` no declara la clave `root` y `SDDF_ROOT` no está definida.
- Las rutas relativas se interpretan desde `REPO_ROOT`.
- Cada skill declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y `npm run verify:repository` pasa.
- El diagnóstico se ejecuta solo cuando se solicita expresamente.
