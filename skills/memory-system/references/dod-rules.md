# Reglas del DoD de historia por etapa

> Referencia del skill `memory-system` para `migrate --from=dod-monolithic` y la familia `dod-guardrail`
> de `check` (STORY-101). El motor las aplica en `scripts/dod-story.js`; léelas solo en la degradación
> inline (Paso 5 del `SKILL.md`) o para entender un problema `dod-guardrail`.

## 1. Etapas (`DOD_STAGES`)

Un archivo `$SPECS_BASE/guardrails/dod-story-<etapa>.md` por fila, en este orden canónico:

| Etapa (`stage`) | `from` | `to` | `enforcement` | `kind` | `applies-to` | Skills que lo cargan |
|---|---|---|---|---|---|---|
| `specify` | `SPECIFY/IN-PROGRESS` | `SPECIFY/DONE` | `warn` | `transition` | `story` | `story-specify` |
| `plan` | `PLAN/IN-PROGRESS` | `PLAN/DONE` | `error` | `transition` | `story` | `story-plan` (lo evalúa `story-analyze`), `story-design`, `story-analyze` |
| `implement` | `IMPLEMENT/IN-PROGRESS` | `IMPLEMENT/DONE` | `error` | `transition` | `story` | `story-implement`, `story-implement-tasks` |
| `code-review` | `CODE-REVIEW/IN-PROGRESS` | `CODE-REVIEW/DONE` | `error` | `transition` | `story` | `story-code-review` |
| `verify` | `VERIFY/IN-PROGRESS` | `VERIFY/DONE` | `error` | `transition` | `story` | `story-verify` |
| `acceptance` | `ACCEPTANCE/IN-PROGRESS` | `ACCEPTANCE/DONE` | `error` | `transition` | `story` | `story-acceptance` |
| `deliver` | — | — | `error` | `content` | `deliver` | ninguno (checklist de publicación; sin skill por ahora; opcional) |

- Un DoD es la condición para **cerrar** su etapa: protege la transición `<ETAPA>/IN-PROGRESS` →
  `<ETAPA>/DONE`, que escribe el skill que lo evalúa. El orden entre etapas lo fija el orden de esta
  tabla (`CODE-REVIEW` antes de `VERIFY`), no el campo `from`.
- `deliver` no es una transición de historia (tras `ACCEPTANCE` viene `DELIVER`, manual): es el checklist
  de publicación, un guardrail de contenido sin `from`/`to`.
- `enforcement: error` bloquea la transición en el skill que lo evalúa; `warn` informa sin bloquear.

## 2. Resolución (la misma en `check` y en la sección `## DoD aplicable` de cada skill)

1. `sddf.config.yaml › guardrails.dod.story.<etapa>: <slug>` → `$SPECS_BASE/guardrails/<slug>.md`
2. Convención: `$SPECS_BASE/guardrails/dod-story-<etapa>.md`
3. Ninguno existe → el skill avisa y continúa sin validación DoD (el DoD es opcional).

`sddf.config.yaml` se busca en `<REPO_ROOT>`, el directorio padre de `SPECS_BASE`. Solo se lee la ruta
`guardrails → dod → story`; el resto del archivo se ignora.

## 3. División del monolítico (`migrate --from=dod-monolithic`)

Origen, por precedencia: `guardrails/dod-story-checklist.md` → `policies/dod-story.md` (heredado).

**Reconocimiento de etapas.** Un encabezado de nivel 2 o 3 es de etapa si su primer token en
mayúsculas es `SPECIFY`, `PLAN`, `IMPLEMENT`, `CODE-REVIEW`, `VERIFY` o `ACCEPTANCE`. Cubre los dos
formatos existentes: `### Definition of Done para el estado VERIFY` y `## ✅ VERIFY (Definición de
Hecho …)`. El bloque `## … Criterios de Despliegue en Producción` es `deliver`. Un bloque de etapa
incluye los subencabezados más profundos que el suyo hasta el siguiente de su nivel o superior.

**Transformación del contenido** (nada más cambia):

1. Frontmatter generado desde la tabla §1 (`slug: dod-story-<etapa>`, `created`/`updated` = fecha).
2. Título `# DoD <ETAPA> — Story` (deliver: `# Criterios de despliegue en producción`).
3. Se eliminan comentarios HTML, separadores `---` y blancos repetidos; los subencabezados pasan a `##`.
4. `(el |la )?[texto](…/gr-<x>.md)` → `[[gr-<x>]]`.
5. `Definition of Done para el estado <X> es satisfactorio` → `Se cumple [[dod-story-<x>]]`.

Cada criterio del origen acaba en exactamente un destino.

**Bloques descartados sin error:** frontmatter, H1, texto previo a la primera etapa y bloques sin
criterios (solo blancos, `---` o `[Por completar]`, como `DELIVER`, `COMPLETED` o `Notas adicionales`
vacías). Cualquier otro bloque tras la primera etapa es `[NO MIGRADO]`.

**Acciones por destino:**

| Situación | Acción | Etiqueta |
|---|---|---|
| No existe y el origen tiene la sección | `create` | `[CREADO]` |
| Existe, sin `--force` | `preserve` | `[PRESERVADO]` |
| Existe, con `--force` y sección en el origen | `overwrite` | `[SOBRESCRITO]` |
| No existe y el origen no tiene la sección | `no-source` | `[SIN ORIGEN]` (exit 1) |
| `deliver` ausente del origen | `skip` | `[OMITIDO]` |

**Índice deprecado.** Si no hubo `[NO MIGRADO]`, `guardrails/dod-story-checklist.md` se reemplaza
(`[REEMPLAZADO]`) por un índice con `kind: index`, `status: deprecated`, `slug: dod-story-checklist`,
`superseded-by` (los siete slugs), `removal: 4.0.0` y wikilinks a cada etapa. Un origen con
`status: deprecated` ya es el índice: no se divide de nuevo. El heredado `policies/dod-story.md` nunca
se elimina (ningún modo borra archivos); `check` lo sigue señalando hasta que la persona lo retire.

Resumen: `creados: N · sobrescritos: S · preservados: M · reemplazados: R`; con `--dry-run`, además
`cambios pendientes: N + S + R`. Exit 0 salvo `[SIN ORIGEN]` o `[NO MIGRADO]` (1) o error de uso (2).

## 4. Familia `dod-guardrail` de `check` (R1–R7)

Solo se evalúa si el proyecto tiene DoD: algún `guardrails/dod-story-*.md`, el heredado
`policies/dod-story.md` o la clave `guardrails.dod.story`. Un proyecto sin DoD no recibe problemas.

| Regla | Qué verifica | `path` | `detail` |
|---|---|---|---|
| R1 | El archivo de cada etapa declara `kind`, `applies-to`, `enforcement ∈ {error, warn}` y, si es `transition`, `from`/`to`; su `slug` coincide con el nombre del archivo | `guardrails/<archivo>` | `falta from` · `enforcement: X — se esperaba error o warn` · `slug: X — debe coincidir con el nombre del archivo` |
| R2 | `from`/`to` coinciden con §1 (`<ETAPA>/IN-PROGRESS` → `<ETAPA>/DONE`) | `guardrails/<archivo>` | `to: X — se esperaba VERIFY/DONE` |
| R3 | `deliver` declara `kind: content` y `applies-to: deliver` | `guardrails/dod-story-deliver.md` | `applies-to: X — se esperaba deliver` |
| R4 | Cada clave del mapeo es una etapa conocida y su slug existe como `guardrails/<slug>.md` | `../sddf.config.yaml` | `<etapa>: etapa desconocida` · `<etapa>: <slug> — archivo inexistente` |
| R5 | No queda DoD monolítico ni heredado | `guardrails/dod-story-checklist.md` · `policies/dod-story.md` | `DoD monolítico sin migrar → /memory-system migrate --from=dod-monolithic` · `DoD heredado ya migrado: elimínalo` |
| R6 | Cada skill de §1 presente tiene `## DoD aplicable` y cita `dod-story-<etapa>` | `../skills/<skill>/SKILL.md` | `falta la sección DoD aplicable (dod-story-<etapa>)` |
| R7 | Ningún `SKILL.md` (salvo `memory-system`, el migrador) nombra el DoD monolítico ni el heredado | `../skills/<skill>/SKILL.md` | `referencia al DoD monolítico` |

R6 y R7 necesitan un directorio de skills: `--skills-dir <ruta>` → `<REPO_ROOT>/skills` →
`<REPO_ROOT>/<--cli-root>/skills`; si no se resuelve ninguno, no se evalúan y la cabecera del informe
dice `skills: —`. Las rutas fuera de `SPECS_BASE` se informan relativas a ella (`../…`). Una etapa sin
archivo no es un problema (el skill avisa y continúa); sí lo es un mapeo que apunta a un archivo inexistente.
