---
name: docs-wiki-builder
description: >-
  Deprecado desde 3.3.0, se elimina en 4.0.0: alias de memory-system index. Regenera docs/index.md
  con wikilinks delegando en /memory-system index (con --dry-run si se pasa ese flag).
  Invocar solo por compatibilidad cuando el usuario mencione "docs-wiki-builder", "wiki de docs"
  o "índice de documentación" con el nombre antiguo; preferir memory-system.
---

# Skill: `/docs-wiki-builder` (alias deprecado)

> ⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.

Este skill ya no tiene lógica propia: desde la versión 3.3.0 es un alias de `/memory-system index`
y se elimina en 4.0.0. Se conserva una versión minor para que los flujos que lo invocaban sigan
funcionando mientras migran.

## Flujo de ejecución

### Paso 1 — Emitir el aviso

Muestra siempre, como primera línea de la salida, exactamente:

```
⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.
```

### Paso 2 — Mapear los argumentos y anunciar la delegación

Determina la invocación delegada a partir de los argumentos recibidos. Solo importa si el usuario
pasó `--dry-run`: `--update` y la ausencia de argumentos equivalen al modo `index` normal.

| Argumentos recibidos | Modo delegado |
|---|---|
| (ninguno) o `--update` | `index` |
| `--dry-run` (con o sin `--update`) | `index` en modo simulación |

Cualquier otro argumento se ignora con el aviso `ℹ️ argumento ignorado: <arg>` (el alias no
reorganiza archivos ni crea estructura: esa funcionalidad desapareció con la deprecación).

Inmediatamente después del aviso del Paso 1 imprime por consola **una sola** de estas dos líneas,
la que corresponda al modo determinado, literalmente:

- si el usuario NO pasó `--dry-run`: `→ delegando en /memory-system index`
- si el usuario SÍ pasó `--dry-run`: `→ delegando en /memory-system index --dry-run`

Nunca imprimas la línea del otro caso ni menciones el modo simulación cuando el usuario no pasó
`--dry-run`: la salida debe reflejar únicamente la invocación que realmente se delega.

### Paso 3 — Delegar

Invoca el skill `memory-system` con el modo anunciado en el Paso 2, exactamente como lo haría el
usuario, sin añadir pasos propios, y muestra su salida y su resumen
`nodos indexados: N · sin frontmatter: M · nodos pendientes: K`. El `index.md` resultante es el
mismo que produce `/memory-system index` directamente; en modo simulación el índice se imprime y no
se escribe ningún archivo.

## Salida

- La de `/memory-system index` (con `--dry-run`, solo por consola; no se escribe ningún archivo).
