# memory-system

Punto de entrada para crear, mantener y verificar la memoria documental del proyecto como una wiki navegable para LLMs.

## What it does

- Detecta el harness del proyecto: `sddf`, `speckit`, `openspec` o `generic`.
- Crea las capas de memoria que falten, junto con `constitution.md` y las plantillas gestionadas.
- Regenera `$SPECS_BASE/index.md` con wikilinks `[[slug]]` para los artefactos documentales.
- Verifica en solo lectura capas ausentes, archivos sin frontmatter, frontmatter inválido y wikilinks rotos.
- Adopta la memoria SDDF en proyectos Speckit u OpenSpec, o divide un DoD monolítico en guardrails por etapa.

No elimina archivos. Solo `rebuild --force` puede sobrescribir archivos gestionados por el scaffold.

## When to use

Úsalo cuando necesites preparar o mantener las capas de memoria del proyecto, regenerar el índice de documentación, trabajar con una wiki de docs o resolver wikilinks. También aplica ante referencias a “capas de memoria”, “índice de documentación”, “LLM wiki” o “dividir el DoD”.

## Invocation modes

| Modo | Comportamiento | Escritura |
|---|---|---|
| `ensure` o sin argumentos | Ejecuta `scaffold` e `index`. | Sí, solo archivos ausentes e `index.md`. |
| `scaffold` | Crea solo las capas, semillas y plantillas que faltan. | Sí. |
| `rebuild --force` | Regenera archivos gestionados por el scaffold y el índice. | Sí; puede sobrescribir archivos gestionados. |
| `index` | Regenera únicamente el índice de la wiki. | Sí, salvo con `--dry-run`. |
| `check` | Valida la memoria y propaga el resultado para CI. | No. |
| `migrate` | Adopta el scaffold en un proyecto Speckit u OpenSpec. | Sí, tras confirmar o con `--yes`. |
| `migrate --from=dod-monolithic` | Divide el DoD de historia en guardrails por etapa. | Sí; no sobrescribe destinos sin `--force`. |

`scaffold --dry-run` e `index --dry-run` muestran el plan o el índice sin escribir. `check --json` entrega un único objeto JSON apto para CI.

## Input

| Entrada | Uso |
|---|---|
| `$SPECS_BASE` | Raíz de los artefactos. Se resuelve mediante `SDDF_ROOT`, `sddf.config.yaml.root` o `docs`. |
| `sddf.config.yaml`, `.specify/`, `openspec/` | Marcadores opcionales para detectar el harness. |
| Argumentos y flags | Seleccionan el modo, `--harness`, `--dry-run`, `--json`, `--fix-frontmatter`, `--yes` o `--force`. |
| `assets/scaffold/` y plantillas compartidas | Semillas y plantillas que el skill copia cuando corresponda. |
| Node.js 18 o superior | Ejecuta el motor determinista `scripts/memory-system.js`. |

## Usage

```
# Crear lo que falta y regenerar el índice
/memory-system

# Ver el scaffold propuesto sin modificar archivos
/memory-system scaffold --dry-run

# Normalizar frontmatter antes de indexar
/memory-system ensure --fix-frontmatter

# Regenerar solo el índice
/memory-system index

# Ejecutar el gate de CI en JSON, sin escrituras
/memory-system check --json

# Adoptar la memoria en un proyecto OpenSpec sin interacción
/memory-system migrate --harness openspec --yes

# Planificar la división del DoD monolítico
/memory-system migrate --from=dod-monolithic --dry-run
```

## Output

Los modos de escritura pueden crear `constitution.md`, las capas documentales faltantes, plantillas gestionadas y, cuando corresponde, `$SPECS_BASE/index.md`. En Speckit y OpenSpec respetan las rutas que ya administra el harness y no escriben en ellas.

`check` no crea ni modifica archivos: devuelve un informe agrupado por problema, o un objeto JSON con `--json`. Sus códigos de salida son `0` sin problemas, `1` cuando encuentra problemas y `2` ante un error técnico.

Todos los modos muestran el resultado del motor y un resumen de los archivos creados, preservados, sobrescritos, mapeados u omitidos cuando aplique.
