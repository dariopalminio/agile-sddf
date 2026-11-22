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
Para pasar del layout de 5.x (`specs/flow/`, `specs/living/`) al de 6.0.0, sigue
[la sección de migración a 6.0.0](artifact-directory-migration.md#migracion-a-600--changes-y-especificacion-viva).

## Layout fijo

[ADR-0023](../decisions/ADR-0023-separar-changes-de-specs.md) (que reemplaza a ADR-0019) fija cuatro raíces hermanas en
`REPO_ROOT`, cada una con una responsabilidad:

| Raíz | Responsabilidad | Contenido |
|---|---|---|
| `docs/` | Conocimiento | Las capas de memoria (`product/`, `requirements/`, `domains/`, `architecture/`, `decisions/`, `policies/`, `guardrails/`, `guides/`, `runbooks/`, `templates/`), `constitution.md` e `index.md`. |
| `specs/` | Especificación viva | La fuente de verdad vigente del sistema: qué comportamiento está en vigor. ADR-0023 no define todavía su formato ni la consolidación desde las historias. |
| `changes/` | Flujo de cambios | Las épicas (`EPIC-NNN-<slug>/`) y las historias (`STORY-NNN-<slug>/`) como hermanas, sin subniveles; `changes/archive/<YYYY-MM-DD>-STORY-NNN-<slug>/` y `changes/archive/<YYYY-MM-DD>-EPIC-NNN-<slug>/` para las historias y las épicas `COMPLETED` o `CANCELED`. |
| `workflow/` | Proceso | Reservado. |

`changes/` describe qué se quiere cambiar; `specs/`, qué está vigente. El archivo de `changes/` conserva el
historial, pero consultar una historia, incluso completada, no equivale a consultar la especificación viva.

Las historias y las épicas `COMPLETED` y `CANCELED` (con `substatus: DONE`) se archivan conservando su status. La
fecha del prefijo de archivo es el `updated:` del work item; si no es válido, su `created:`; si el frontmatter no
tiene ninguna de esas dos claves, su `date:`. Las historias las archiva `story-complete` y las épicas `epic-complete`,
siempre con confirmación humana. La numeración consulta los ítems activos de `changes/` y los archivados de
`changes/archive/`: ningún identificador archivado se reutiliza. `docs/requirements/` no se mueve: migrará a
`specs/` en la épica de Living Spec.

## Contrato que usan los skills

Antes de acceder a artefactos, un skill:

1. Determina `REPO_ROOT`.
2. Usa rutas fijas relativas a él: work items en `changes/`, templates en
   `docs/templates/` y DoD en `docs/guardrails/`.
3. Resuelve `CLI_ROOT` de forma independiente solo si necesita un skill, agente o
   comando del runtime.

Cada `SKILL.md` declara el contrato con el marcador `<!-- SDDF-FIXED-LAYOUT: v1 -->`
seguido de un bloque que nombra `REPO_ROOT`, `changes/`, `docs/templates/` y
`docs/guardrails/`. `scripts/verify-fixed-layout.js` lo valida en `npm run verify:repository`
y rechaza cualquier referencia a `SPECS_BASE`, `SDDF_ROOT`, a la clave `root` de
`sddf.config.yaml` o a las rutas retiradas por ADR-0023 fuera de la región de diagnóstico de
`skill-preflight` y `sddf-init`.

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

`/sddf-init` crea el layout fijo (`changes/`, `changes/archive/`, `specs/` y
`workflow/`, con un `.gitkeep` en cada directorio que crea), los templates en
`docs/templates/` y la configuración, de forma idempotente. No escribe la clave `root`. Si
encuentra un layout legado (`docs/specs/` o los niveles `flow/` y `living/` dentro de `specs/`),
avisa, no crea `changes/` en paralelo y remite a la guía de migración.

`/skill-preflight` es un diagnóstico explícito y no mutante. Informa `REPO_ROOT`, el layout
fijo, los templates centrales y el runtime disponible. Además detecta cinco señales de layout
legado (`docs/specs/`, la clave `root` en `sddf.config.yaml`, la variable `SDDF_ROOT` y los
niveles `flow/` y `living/` dentro de `specs/`), las informa como advertencias y remite a la
guía de migración. Un skill ordinario no lo invoca
automáticamente.

## Checklist de revisión

- Los work items viven en `changes/` (o en `changes/archive/` si están `COMPLETED` o `CANCELED`);
  no existe `docs/specs/`.
- `sddf.config.yaml` no declara la clave `root` y `SDDF_ROOT` no está definida.
- Las rutas relativas se interpretan desde `REPO_ROOT`.
- Cada skill declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y `npm run verify:repository` pasa.
- El diagnóstico se ejecuta solo cuando se solicita expresamente.
