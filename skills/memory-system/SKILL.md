---
name: memory-system
description: >-
  Gestiona la memoria del proyecto (docs/ como wiki LLM): el modo index regenera docs/index.md
  con wikilinks [[slug]] agrupados por capa y detecta el harness (sddf, speckit, openspec, generic).
  Usar para regenerar o actualizar el índice de documentación; sustituye a docs-wiki-builder.
  Invocar también cuando el usuario mencione "memory-system", "índice de documentación",
  "wiki de docs", "wikilinks" o "LLM wiki".
---

# Skill: `/memory-system`

**Cuándo usar este skill:**
Cuando haya que regenerar `$SPECS_BASE/index.md` (el mapa de la wiki que los LLMs leen antes que
cualquier otro nodo), saber qué harness usa el proyecto o, en futuras versiones, crear y verificar
las capas de memoria. Invocar también cuando el usuario mencione "memory-system", "índice de
documentación", "wiki de docs", "wikilinks", "LLM wiki" o el skill deprecado `docs-wiki-builder`.

## Objetivo

Ser el único punto de entrada para la memoria del proyecto (ver
`docs/architecture/memory-system.md` en el repositorio del framework). En esta versión expone el
modo `index`: regenera `$SPECS_BASE/index.md` completo, de forma reproducible, con una entrada
`[[slug]]` por artefacto agrupada por capa, y la detección de harness que los demás modos
reutilizarán.

**Qué hace este skill:**
- Detecta el harness del proyecto (`sddf | speckit | openspec | generic`) y decide qué raíces se indexan.
- Regenera `$SPECS_BASE/index.md` desde `assets/index-template.md` con el motor determinista
  `scripts/memory-system.js` (Node ≥ 18, sin dependencias): dos ejecuciones seguidas producen el
  mismo archivo salvo `updated`.
- Marca los wikilinks sin destino como nodos pendientes sin bloquear la generación.

**Qué NO hace este skill:**
- No crea ni mueve archivos de `$SPECS_BASE/` (los modos `scaffold`, `ensure` y `rebuild` llegan
  con STORY-096; `check` con STORY-097; `migrate` con STORY-098).
- No añade ni modifica frontmatter de los artefactos: eso sigue siendo `/header-aggregation`, que
  permanece como utilidad independiente (este skill solo lee su esquema `slug`/`title`).
- No escribe fuera de `$SPECS_BASE` (las raíces externas de OpenSpec/Spec-kit son de solo lectura).

## Entrada

- `$SPECS_BASE/` — raíz de artefactos resuelta en el Paso 0.
- `<REPO_ROOT>/sddf.config.yaml`, `.specify/`, `openspec/` — marcadores de harness (opcionales).
- `assets/index-template.md` — template del índice (solo lectura; el motor lo lee en runtime).
- `references/memory-rules.md` — reglas de slug/título/capa/exclusiones y tabla de harness. Léelo
  solo en la degradación inline (Paso 4): el motor ya las aplica cuando `node` está disponible.

## Parámetros

| Argumento | Efecto |
|---|---|
| (ninguno) | Modo por defecto reservado a `ensure` (STORY-096); hoy informa los modos disponibles y termina. |
| `index` | Regenera `$SPECS_BASE/index.md`. |
| `--harness <sddf\|speckit\|openspec\|generic>` | Fuerza el harness en lugar de detectarlo. |
| `--dry-run` | Imprime el índice resultante por consola sin escribir ningún archivo. |

## Precondiciones

- `$SPECS_BASE/` debe existir (el motor termina con exit 2 si la raíz no existe).
- `node` (≥ 18) en PATH para la generación reproducible; sin él, ver la degradación del Paso 4.

## Dependencias

- Archivos del skill: `scripts/memory-system.js`, `assets/index-template.md`, `references/memory-rules.md`.
- Herramientas: `node` ≥ 18 (solo módulos nativos; no requiere `package.json` en el proyecto consumidor).
- Skills: `skill-preflight` (opcional, diagnóstico bajo demanda). No invoca `header-aggregation`.

## Modos de ejecución

- **Manual** (`/memory-system index`): muestra el resumen al terminar; no pide confirmación porque
  el índice se regenera completo y es reproducible.
- **Automático** (invocado por `/docs-wiki-builder` u otro skill): mismo comportamiento.
- **Simulación** (`index --dry-run`): imprime el índice y el resumen, no escribe.

## Restricciones / Reglas

- **Regeneración completa:** el índice no se fusiona con el anterior; el template es la fuente de
  verdad de las secciones y el motor solo rellena placeholders (`{layer:<capa>}`, `{stats}`, `{date}`).
- **Fail-fast sin escrituras:** un `--harness` no admitido, una raíz inexistente o un template
  desalineado (placeholder sin capa conocida, capa con nodos sin placeholder) detienen el skill con
  el mensaje del motor y sin tocar `index.md`.
- **Nodos pendientes no bloquean:** se listan al final del índice con `⚠️ nodo pendiente`.
- **Rutas relativas y portabilidad:** el motor normaliza rutas con `/` y ordena con comparación
  ordinal, por lo que el resultado es idéntico en Windows, macOS y Linux.
- **Encoding:** `index.md` se escribe en UTF-8 sin BOM y con saltos `\n`.

## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.

### Paso 1 — Interpretar el modo y los flags

Lee los argumentos del usuario:

| Argumentos | Acción |
|---|---|
| (ninguno) | Muestra exactamente `ℹ️ Modo ensure aún no disponible en esta versión. Modos disponibles: index. Ejecuta /memory-system index.` y termina con éxito, sin invocar el motor y sin escribir nada. |
| `index [--harness h] [--dry-run]` | Continúa al Paso 2. |
| `scaffold`, `ensure`, `rebuild`, `check`, `migrate` | Muestra `ℹ️ Modo <m> aún no disponible en esta versión (llega con STORY-096…098). Modos disponibles: index.` y termina con éxito. |
| Otro valor | `❌ Modo no reconocido: <valor>. Modos disponibles: index.` y termina sin escribir. |

El modo por defecto se reserva a `ensure` para que, cuando exista, `/memory-system` a secas
garantice la memoria completa sin cambiar la interfaz.

### Paso 2 — Localizar el motor

Resuelve `CLI_ROOT` y localiza `scripts/memory-system.js` dentro de este skill
(`<CLI_ROOT>/skills/memory-system/scripts/memory-system.js`). Comprueba que `node` está en PATH
(`node --version`). Si no lo está, salta al Paso 4.

### Paso 3 — Ejecutar `index` con el motor

Invoca, desde `REPO_ROOT`:

```
node <CLI_ROOT>/skills/memory-system/scripts/memory-system.js index --root <SPECS_BASE> [--harness h] [--dry-run]
```

El motor detecta el harness (precedencia `--harness` > `sddf.config.yaml` > `.specify/` >
`openspec/` > `generic`), escanea `SPECS_BASE` y las raíces externas del perfil, deriva slug,
título y capa de cada nodo según `references/memory-rules.md`, rellena `assets/index-template.md`
y escribe `<SPECS_BASE>/index.md`. Con `--dry-run` imprime el índice por stdout y no escribe: en
ese caso emite `ℹ️ --dry-run: índice impreso por consola, no se escribió ningún archivo` antes de
mostrar la salida del motor.

Muestra al usuario la salida del motor tal cual (con `--dry-run` incluye el índice completo) y
cierra con su última línea, que es el resumen:

```
nodos indexados: N · sin frontmatter: M · nodos pendientes: K
```

Si no puedes ejecutar `node` (entorno de solo lectura, sin shell, o una simulación del skill),
no inventes la salida del motor: pasa al Paso 4 y genera el índice inline leyendo los archivos.

Interpretación del exit code:

| Exit | Situación | Qué hacer |
|---|---|---|
| 0 | Índice generado (o impreso con `--dry-run`) | Mostrar salida y resumen. Sugerir `/header-aggregation <ruta>` para los nodos `⚠️ sin frontmatter`. |
| 2 | `--harness` no admitido, raíz inexistente, template desalineado | Mostrar el mensaje del motor (por ejemplo `valor no admitido para --harness: foo (admitidos: sddf, speckit, openspec, generic)`) y detenerse: no se escribe `index.md` ni se muestra resumen. |
| 1 | Error inesperado | Mostrar el mensaje y detenerse sin escribir. |

### Paso 4 — Degradación sin `node` en PATH

Si `node` no está disponible, avisa:

```
⚠️ node no está en PATH: el índice se genera inline. La reproducibilidad byte a byte no está garantizada; instala Node ≥ 18 para obtenerla.
```

Después lee `references/memory-rules.md` y aplica sus reglas a mano, con los archivos reales:

1. Resuelve las rutas relativas al `REPO_ROOT` indicado (o al directorio de trabajo): `SPECS_BASE`
   es `<REPO_ROOT>/<root>` y los marcadores de harness se buscan en `REPO_ROOT`. Determina el
   harness con la tabla de perfiles.
2. Lista los `.md` de `SPECS_BASE` (y las raíces externas del perfil) descartando las exclusiones.
3. **Lee cada `.md` candidato con la herramienta de lectura antes de clasificarlo.** Un nodo solo
   se marca `⚠️ sin frontmatter` si su primera línea no es `---` (o el bloque no cierra); en caso
   contrario toma `slug` y `title` del bloque leído y, si faltan, deriva el slug del nombre del
   archivo/directorio y el título del primer `#`. No asumas el contenido de ningún archivo a
   partir de su nombre.
4. Rellena `assets/index-template.md` con las entradas ordenadas por ruta y calcula los nodos
   pendientes a partir de los wikilinks leídos.
5. Si el usuario pasó `--dry-run`, emite primero
   `ℹ️ --dry-run: índice impreso por consola, no se escribió ningún archivo` y a continuación el
   índice completo; si no, escribe `<SPECS_BASE>/index.md`.
6. Termina con el mismo resumen del Paso 3.

### Paso 5 — Resumen final

Sin `--dry-run`:

```
✅ memory-system index — harness: <h> — <SPECS_BASE>/index.md regenerado
nodos indexados: N · sin frontmatter: M · nodos pendientes: K
```

Con `--dry-run`, la línea `ℹ️ --dry-run: índice impreso por consola, no se escribió ningún archivo`
se emite ANTES del índice (Paso 3 o Paso 4) y la salida cierra con el resumen `nodos indexados: …`.

## Salida

- `$SPECS_BASE/index.md` — índice completo de la wiki con wikilinks `[[slug]]` por capa, sección
  "Estado del grafo" y, si procede, "Nodos pendientes". Con `--dry-run`, solo por consola.
- Resumen `nodos indexados: N · sin frontmatter: M · nodos pendientes: K`.

## Deprecación de `docs-wiki-builder`

`/docs-wiki-builder [--update|--dry-run]` es desde 3.3.0 un alias que emite
`⚠️ docs-wiki-builder está deprecado. Usa /memory-system index.` y delega en este skill
(`--update` → `index`, `--dry-run` → `index --dry-run`). Se elimina en 4.0.0.
