---
name: epic-format-validation
description: "Valida que una épica cumple el contrato del template epic-template.md: frontmatter, secciones obligatorias, formato F1/F2/F3 de las historias y smoke tests SMOKE-N en gherkin. Produce APROBADO, REFINAR (faltantes y formato inválido, con la corrección esperada) o RECHAZADO (archivo no encontrado)."
triggers:
  - epic-format-validation
  - /epic-format-validation
  - validar épica
  - validar formato de épica
  - verificar estructura de épica
---

# Skill: `/epic-format-validation`

**Cuándo usar este skill:**
Usar antes de que un archivo de épica sea consumido por otros skills del pipeline SDDF
(`epic-generate-stories`, etc.), para verificar que una épica recién creada o editada
cumple la estructura requerida, o como gate de calidad antes de marcar una épica como Ready.
Invocar también cuando el usuario mencione "validar épica", "verificar estructura de épica",
"epic-format-validation" o equivalentes.

## Objetivo

Valida que un archivo de especificación de épica cumple el contrato del template
`epic-template.md`: frontmatter, secciones obligatorias y la **forma** de las dos secciones que
leen otros skills (la de clave `historias` y la de clave `smoke-tests`). Produce resultado
**APROBADO**, **REFINAR** (faltantes y formato inválido) o **RECHAZADO** (archivo no encontrado).

**Qué hace este skill:**
- Lee el template en runtime y extrae dinámicamente las secciones obligatorias y el contrato por claves
- Valida presencia de campos de frontmatter requeridos y encabezados de sección
- Valida el formato de línea de las historias (F1/F2/F3) y de los smoke tests (`SMOKE-N` + `gherkin`)
- Produce un resultado con diagnóstico accionable (línea, texto y forma esperada)

**Qué NO hace este skill:**
- No valida el contenido semántico de las secciones, solo su presencia y su forma
- No corrige ni migra el archivo de épica (la migración es `/memory-system migrate --from=epic-template-v1`)

## Entrada

- Argumento posicional: ruta relativa, nombre (con o sin `.md`) o término de búsqueda del archivo de épica
- `$SPECS_BASE/specs/02-epics/` — directorio donde se buscan los archivos de épica
- `$SPECS_BASE/templates/epic-template.md` — fuente de verdad estructural (solo lectura)

## Parámetros

- `<epica>` (argumento posicional): ruta relativa al archivo `.md`, nombre de la épica con o sin extensión, o término de búsqueda parcial

## Precondiciones

- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.
- `$SPECS_BASE/templates/epic-template.md` debe existir
- Debe proporcionarse al menos un argumento para identificar el archivo a validar

## Dependencias

- Archivos: `$SPECS_BASE/templates/epic-template.md`

## Modos de ejecución

- **Manual** (`/epic-format-validation <epica>`): muestra el resultado APROBADO/REFINAR/RECHAZADO al usuario.
- **Automático**: invocado por otro skill (ej. `epic-generate-stories`) como gate previo — no pide confirmación.

## Restricciones / Reglas

- **Solo lectura:** no escribe ni modifica ningún archivo.
- **Validación estructural, no semántica:** verifica presencia de secciones por encabezado `##` y la forma de línea de dos secciones, no el sentido del contenido.
- **Extracción dinámica:** las secciones obligatorias y sus claves se derivan en runtime del template (comentario `<!-- sección obligatoria · clave: <clave> -->`); si el template cambia (títulos, orden, secciones), el skill se adapta automáticamente.
- **Sin títulos de sección en este skill:** las reglas de forma se aplican a la sección cuya `clave:` corresponde y su título se lee del template. En la salida, cita las secciones solo por el título que trae el template (D-2b).
- **Contrato fijo de dominio:** los formatos F1/F2/F3 y el patrón `SMOKE-N` se definen en `domain-epic-lifecycle` §9 ("Estructura de `epic.md`"); este skill los aplica, no los redefine.
- **Sin corrección:** la generación o corrección de contenido están fuera del scope de este skill.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas validando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.
  
## Flujo de ejecución

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 1 — Resolver el input

El skill acepta tres formas de input. Detectar cuál aplica antes de continuar:

#### Tipo A — Ruta relativa completa
**Señal:** El input contiene `/` o `\` o termina en `.md`.
**Acción:** Usar esa ruta directamente. Si el archivo no existe → ir a **manejo de archivo no encontrado**.

#### Tipo B — Nombre con o sin extensión `.md`
**Señal:** El input es una palabra o frase corta que no contiene separadores de ruta.
**Acción:**
1. Buscar en `$SPECS_BASE/specs/02-epics/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas/minúsculas), incluyendo los que tengan o no extensión `.md`
2. Si hay exactamente 1 coincidencia → usar ese archivo. Continuar a Paso 2.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → ir a **manejo de archivo no encontrado**.

#### Manejo de archivo no encontrado

```
RECHAZADO

Archivo no encontrado: <ruta o término proporcionado>

No se encontró ninguna épica en docs/specs/02-epics/ que coincida con el input proporcionado.

Verifica que el nombre o ruta sea correcto e inténtalo de nuevo.
```

Terminar la ejecución del skill sin continuar.

---

### Paso 2 — Verificar template

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derívelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/templates/epic-template.md`.

- Si el archivo central **no existe**: usar el fallback `$CLI_ROOT/skills/epic-creation/assets/epic-template.md` y emitir:

  > ⚠️ Usando template del skill epic-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/templates/`.

- Si tampoco existe el fallback: informar al usuario y detener la ejecución:

  > ❌ Template `epic-template.md` no encontrado. Ejecuta `sddf-init`.

- Si alguno de los dos **existe**: continua.

---

### Paso 3 — Extraer el contrato obligatorio del template

El contrato tiene tres partes y **todas se derivan del template en runtime**: las secciones
obligatorias, las claves de sección y las claves de frontmatter.

#### 3a. Secciones obligatorias y contrato por claves

Para cada línea del template que empiece con `## ` (encabezado de nivel 2), fuera de bloques de código:

- **título**: el texto del encabezado sin el comentario HTML ni espacios sobrantes;
- **obligatoria**: el comentario contiene `sección obligatoria` (con o sin espacio antes de `-->`);
- **clave**: el valor de `clave: <clave>` dentro del comentario, si lo declara.

Resultado: una lista ordenada `{ título, clave, obligatoria }`. Las obligatorias son las que se
exigen en el Paso 4b. Si dos secciones declaran la **misma clave**, el template es inválido: muestra
exactamente

```
❌ Template inválido: clave <clave> duplicada
```

y **termina sin resultado** (ni APROBADO, ni REFINAR, ni RECHAZADO).

De la lista, toma el título de la sección con clave `historias` y el de la sección con clave
`smoke-tests`. Si el template no declara una de esas claves, la regla de forma correspondiente
(Paso 4c o 4d) **no se aplica** y no se menciona en la salida.

#### 3b. Claves de frontmatter obligatorias

Leer el bloque de frontmatter del template (el contenido entre el primer par de `---`) y extraer el nombre de cada clave YAML (el texto antes de los dos puntos, al inicio de línea y sin indentación).

De esas claves, **exigir todas menos** las de esta allowlist de opcionales:

| Clave opcional | Por qué no se exige |
|---|---|
| `alwaysApply` | Configuración de carga del documento en el harness, no parte del contrato de la épica |
| `parent` | Nullable — una épica sin proyecto padre declara `parent: null` |
| `related` | Nullable — una épica sin referencias declara `related: []` |

La allowlist es la única parte codificada en este skill, y solo enumera claves nullables o de configuración. Cualquier clave nueva que se agregue al template pasa a ser obligatoria automáticamente, sin editar este skill.

---

### Paso 4 — Validar el archivo de épica

Leer el archivo de épica resuelta en Paso 1.

#### 4a. Validar frontmatter

Verificar que el bloque frontmatter del archivo de épica (el contenido entre el primer par de `---`) contiene una clave YAML `<clave>:` al inicio de línea por cada clave obligatoria derivada en el Paso 3b.

Buscar claves YAML (`created:`), **no** patrones Markdown (`**Fecha**:`). Una clave presente pero con valor vacío cuenta como presente. Las claves extra que el template no exige se aceptan.

Registrar cuáles están ausentes.

#### 4b. Validar secciones obligatorias

Para cada sección obligatoria extraída en el Paso 3a, verificar que el archivo de épica contiene un encabezado `##` cuyo texto (ignorando espacios y comentarios HTML) coincida con su título.

Registrar cuáles están ausentes.

#### 4c. Regla de forma de la sección con clave `historias`

Solo si el template declara la clave `historias` y la épica tiene esa sección. Dentro de ella,
analizar **solo las líneas de nivel superior que empiezan por `- `** (las líneas indentadas son
sub-ítems y se ignoran). Cada una debe casar con uno de los tres formatos del dominio:

| Formato | Estado | Forma |
|---|---|---|
| F1 | planificada, sin ID | `- <Nombre>: <descripción>` — sin checkbox y sin `STORY-NNN` (el placeholder `- [Por completar]` es un F1 válido) |
| F2 | creada | `- [ ] **STORY-NNN** — <Nombre>: <descripción>` |
| F3 | completada | `- [x] **STORY-NNN** — <Nombre>: <descripción>` |

`STORY-NNN` usa guion ASCII (`-`) y al menos tres dígitos; el separador tras `**STORY-NNN**` es la
raya `—`. Una línea con checkbox pero sin `**STORY-NNN**` (p. ej. `- [ ] Nombre: desc`), con el ID
fuera de la negrita o con otro separador **no** casa con ningún formato. Cada incumplimiento es un
ítem de `Formato inválido:` con su número de línea, el texto literal de la línea y la forma esperada.

#### 4d. Regla de forma de la sección con clave `smoke-tests`

Solo si el template declara la clave `smoke-tests` y la épica tiene esa sección. Dentro de ella,
tomar los encabezados `###` (fuera de bloques de código):

1. Debe haber **al menos uno**.
2. Si hay **dos o más**, todos deben casar `### SMOKE-<N> — <nombre>` (N entero; no se exige que
   sean contiguos: los IDs son estables y no se renumeran). Si hay **uno solo**, se acepta con o sin
   `SMOKE-<N> — `.
3. Un mismo `SMOKE-<N>` repetido es inválido.
4. Cada `###` debe ir seguido de un bloque de código `gherkin` que contenga `Escenario:`, `Dado`,
   `Cuando` y `Entonces`. Los pasos en negrita (`**DADO**`…) fuera de un bloque `gherkin` no cuentan.

Cada incumplimiento es un ítem de `Formato inválido:` con su número de línea, el texto literal del
encabezado y la corrección esperada (`### SMOKE-N — <nombre>` o "bloque `gherkin` con
Escenario/Dado/Cuando/Entonces").

---

### Paso 5 — Producir resultado

#### Si no hay faltantes ni formato inválido → APROBADO

```
APROBADO

El archivo cumple la estructura obligatoria del template epic-template.md.

Archivo validado: <ruta del archivo>
```

#### Si hay faltantes o formato inválido → REFINAR

Incluir solo los bloques que tengan ítems. Los títulos de sección que se citen salen del template.

```
REFINAR

El archivo no cumple la estructura obligatoria del template epic-template.md.

Archivo validado: <ruta del archivo>

Secciones/campos faltantes:
- <nombre exacto del campo o título de la sección faltante>

Formato inválido:
- Línea <n> (<título de la sección>): `<texto literal>` → se esperaba F1 `- <Nombre>: <descripción>`, F2 `- [ ] **STORY-NNN** — <Nombre>: <descripción>` o F3 `- [x] **STORY-NNN** — <Nombre>: <descripción>`
- Línea <n> (<título de la sección>): `<encabezado>` → se esperaba `### SMOKE-N — <nombre>` seguido de un bloque gherkin con Escenario/Dado/Cuando/Entonces

Revisa el template en $SPECS_BASE/templates/epic-template.md para completar las secciones indicadas.
```

Si el bloque `Secciones/campos faltantes:` lista alguna **sección**, añadir al final esta nota:

```
Si la épica se creó con una versión anterior del template → /memory-system migrate --from=epic-template-v1
```

No detectes la versión de la épica por sus títulos: la lista de secciones faltantes más esta nota da
la misma información y funciona también con templates personalizados.

---

## Salida

- **APROBADO**: el archivo cumple la estructura completa del template.
- **REFINAR**: el archivo existe pero le faltan secciones o campos de frontmatter, o alguna línea de historias o de smoke tests no tiene la forma del contrato; incluye lista accionable y, si faltan secciones, el comando de migración.
- **RECHAZADO**: el archivo no fue encontrado.
- No genera ni modifica archivos en disco.
