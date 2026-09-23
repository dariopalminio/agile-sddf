---
type: guide
slug: sddf-commands-pipeline
title: "Flujos principales SDDF"
date: 2026-04-26
status: null
substatus: null
parent: null
related:                                    # opcional, si tiene relación con otros nodos
  - flight-leves-model
---
<!-- Referencias -->
[[flight-leves-model]]

# Flujos principales SDDF

---

## Configuración — Raíz de artefactos

Todos los skills resuelven localmente `SPECS_BASE` una vez por invocación.

| Escenario | Ruta usada |
|---|---|
| `SDDF_ROOT` válida | La ruta del override; no se lee configuración. |
| Sin override y `sddf.config.yaml.root` válida | La raíz versionada; las rutas relativas se anclan en `REPO_ROOT`. |
| Sin fuente explícita | `docs/` (compatibilidad). |
| Fuente explícita inválida | Error accionable y ninguna escritura. |

```bash
# Override opcional, por ejemplo para CI
export SDDF_ROOT="artefactos-ci"
```

---

## 0. Memoria del proyecto

```
sddf-init → memory-system            (ensure: scaffold + index)
memory-system index                  (solo reindexar)
memory-system check [--json]         (verificar; exit code para CI)
```

| Skill | Input | Output |
|---|---|---|
| `memory-system` = `memory-system ensure [--fix-frontmatter] [--harness h]` | `$SPECS_BASE/` (puede estar vacío o incompleto) y `<CLI_ROOT>/skills/<dueño>/assets/` para las plantillas compartidas | Crea solo lo que falta de las once capas (`constitution.md`, `product/*`, un `README.md` por capa, seis plantillas) y regenera `index.md`; informe `creados: N · preservados: M · índice regenerado: sí`. Con `--fix-frontmatter`, `header-aggregation` en batch ("Saltar todos los conflictos") completa antes los archivos sin frontmatter |
| `memory-system scaffold [--dry-run] [--harness h]` | Igual que `ensure` | Solo crea lo faltante (`[CREADO]`/`[PRESERVADO]`); no toca `index.md` |
| `memory-system rebuild --force` | Memoria existente | `⚠️` advertencia, sobrescribe únicamente los archivos gestionados por el scaffold (`[SOBRESCRITO]`) y regenera `index.md`; sin `--force` se detiene con `❌ rebuild es destructivo. Añade --force para confirmar.` |
| `memory-system index [--harness h] [--dry-run]` | `$SPECS_BASE/` (artefactos con frontmatter `slug`/`title`) y, según el harness detectado, las raíces externas de Spec-kit/OpenSpec | `$SPECS_BASE/index.md` regenerado con wikilinks `[[slug]]` por capa; resumen `nodos indexados: N · sin frontmatter: M · nodos pendientes: K` |
| `memory-system check [--json] [--harness h]` | `$SPECS_BASE/` en solo lectura | Informe de las cuatro familias de problemas (`missing-layer`, `orphan`, `invalid-frontmatter`, `broken-wikilink`) y cierre `problemas: N (…)`; con `--json`, un único objeto `{ harness, root, ok, summary, problems }`. No escribe nada. Exit 0 sin problemas, 1 con al menos uno, 2 ante error técnico |

> Ejecuta `/memory-system` justo después de `/sddf-init`: deja la memoria completa sin crear nada
> a mano y sin riesgo para lo existente (ningún modo borra; solo `rebuild --force` sobrescribe, y
> solo semillas y plantillas). Regenera el índice tras añadir o mover artefactos: es el mapa que
> los LLMs leen antes de abrir cualquier nodo. `--dry-run` imprime el resultado sin escribir. Los
> nodos sin frontmatter se enlazan solo por ruta; complétalos con `/header-aggregation <ruta>` o
> `/memory-system ensure --fix-frontmatter`.
>
### Gate de CI con `memory-system check`

Un pipeline no invoca al agente: llama al motor directamente y lee el objeto JSON con `jq`. La
ruta es la del skill instalado en el runtime; el ejemplo usa la del runtime por defecto
(`claude-code`), y los destinos de los demás runtimes instalables se derivan de
`config/runtimes.json` (por ejemplo `.agents/skills/` en Codex), así que ajusta el prefijo al
runtime que tengas instalado. En el repositorio del framework el motor vive en
`skills/memory-system/scripts/memory-system.js`.

```yaml
- name: Verificar la memoria del proyecto
  run: |
    set +e   # sin esto, el `bash -e` por defecto de GitHub Actions abortaría el paso en el exit 1 del motor
    node .claude/skills/memory-system/scripts/memory-system.js check --root docs --json > memory-check.json
    status=$?
    set -e
    if [ "$status" -eq 2 ]; then
      echo "::error::memory-system check mal invocado"; jq -r ".error" memory-check.json; exit 2
    fi
    jq ".summary" memory-check.json
    exit $status
```

- **Exit 0** = memoria consistente; **1** = al menos un problema (el gate falla y `problems` dice
  cuál y dónde); **2** = error técnico (raíz inexistente, `--harness` no admitido, argumentos mal
  formados, Node < 18 o cualquier error inesperado durante el chequeo), que no debe confundirse con
  memoria rota. En `check` el 1 significa exclusivamente "memoria con problemas", así que el
  pipeline puede fiarse de él. Con `--json`, todo exit 2 deja un objeto en stdout, de modo que el
  `jq -r ".error"` de arriba siempre tiene qué leer.
- Con `--json` el motor no escribe nada más en stdout, así que el archivo es JSON puro. Sin
  `--json` la salida es el informe textual, útil en local: `node … check --root docs`.
- `check` es **solo lectura**: no corrige. Para corregir, `/memory-system ensure --fix-frontmatter`
  (frontmatter ausente), `/memory-system scaffold` (capa ausente) o editar el artefacto.

> **El repositorio del framework aún no está en verde.** `check --root docs` devuelve hoy 46
> problemas conocidos (exit 1): wikilinks a documentos canónicos borrados y aún no restaurados, nodos de
> `templates/` —excluidos del escaneo por diseño— y artefactos sin encabezado del que derivar un
> `title` honesto. Copiar el snippet tal cual en un workflow de este repositorio rompería el build.
> Actívalo primero en proyectos consumidores, o espera a que esa deuda se cierre.

> **`check` y `npm run verify:links` son complementarios, no sustitutos** (CR-003 de STORY-097).
> `verify:links` (`scripts/check-doc-links.js`) valida los **enlaces Markdown relativos** de este
> repositorio: que `[texto](ruta/archivo.md)` apunte a un archivo que existe. `check` valida lo que
> aquel no mira: los **wikilinks** `[[destino]]` contra el conjunto de slugs derivados y el
> **frontmatter** de cada nodo. Un repositorio puede pasar uno y fallar el otro, así que en CI se
> ejecutan los dos.

> ⚠️ `docs-wiki-builder` está deprecado desde 3.3.0 (se elimina en 4.0.0): es un alias que
> delega en `/memory-system index` (`--update` → `index`, `--dry-run` → `index --dry-run`).

---

## 1. Pipeline de especificación de proyecto

```
project-begin → project-discovery → project-planning
```

| Skill | Input | Output |
|---|---|---|
| `project-begin` | Intención del usuario (conversación) | `$SPECS_BASE/specs/01-projects/project-intent.md` |
| `project-discovery` | `project-intent.md` | `$SPECS_BASE/specs/01-projects/project.md` |
| `project-planning` | `requirement-spec.md` | `$SPECS_BASE/specs/01-projects/project-plan.md` |

> `project-flow` orquesta los 3 pasos en una sola sesión con gates de revisión entre etapas.
> `$SPECS_BASE` procede de `SDDF_ROOT` válida, de `sddf.config.yaml.root` válida o de `docs` si no hay fuente explícita.

---

## 2. Pipeline de generación de épicas e historias

```
epic-from-project-plan → epic-generate-stories
```

| Skill | Input | Output |
|---|---|---|
| `epic-from-project-plan` | `project-plan.md` | `$SPECS_BASE/specs/02-epics/épica-[ID]-[Nombre].md` (uno por épica) |
| `epic-generate-stories` | Un archivo `epic.md` | `$SPECS_BASE/specs/03-stories/STORY-[NNN]-[nombre]/story.md` (una por feature) |

> `epic-generate-all-stories` procesa todas las épicas en batch.

---

## 3. Pipeline de refinamiento de historias

```
story-creation → story-evaluation → story-split
```

| Skill | Propósito |
|---|---|
| `story-creation` | Redacta la historia (Como/Quiero/Para + Gherkin) |
| `story-evaluation` | Evalúa calidad con rúbrica FINVEST (1–5 por dimensión) → `APROBADA / REFINAR / RECHAZAR` |
| `story-split` | Divide historias grandes usando 8 patrones de splitting |

> `story-specify` orquesta el ciclo completo con control de backlog por archivo (`substatus: IN-PROGRESS / READY`).

---

## 4. Pipeline de implementación y ciclo de corrección post-review

```
story-implement | story-implement-tasks → story-code-review → approved
                                              └─ needs-changes → story-implement | story-implement-tasks → story-code-review → …
```

| Skill | Precondición (`story.md`) | Resultado |
|---|---|---|
| `story-implement` o `story-implement-tasks` | `READY-FOR-IMPLEMENT/DONE` (ejecución inicial o rework encolado) | `IMPLEMENT/DONE` + `implement-report.md`; si existe `fix-directives.md`, aplica sus correcciones |
| `story-code-review` → `approved` | `IMPLEMENT/DONE` | `CODE-REVIEW/DONE` + `code-review-report.md`; `fix-directives.md` eliminado si existía |
| `story-code-review` → `needs-changes` | `IMPLEMENT/DONE` | `READY-FOR-IMPLEMENT/DONE` + `code-review-report.md` + `fix-directives.md` con `round: N` (ronda previa + 1); mensaje `→ Ejecuta /story-implement <id>` (alternativa `/story-implement-tasks <id>` si existe `tasks.md`) |

> La señal de rework es la presencia de `fix-directives.md` en el directorio de la historia: lo crea o sobreescribe `story-code-review` en `needs-changes` (escritor único de `round`) y lo elimina en `approved`. No existe estado ni substatus de rework; el ciclo `needs-changes → ejecutor → story-code-review` se repite sin editar el frontmatter a mano hasta obtener `approved` (ver [[rework-sin-estado-propio]], ADR-0008).
