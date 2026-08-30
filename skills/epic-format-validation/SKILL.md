---
name: epic-format-validation
description: "Valida que un archivo de especificación de épica cumple la estructura obligatoria del template epic-template.md. Produce resultado APROBADO, REFINAR (con lista de secciones faltantes) o RECHAZADO (archivo no encontrado)."
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

Valida que un archivo de especificación de épica contiene todas las secciones obligatorias
del template `epic-template.md`. Produce resultado **APROBADO**, **REFINAR**
(con lista de secciones faltantes) o **RECHAZADO** (archivo no encontrado).

**Qué hace este skill:**
- Lee el template en runtime y extrae dinámicamente las secciones obligatorias
- Valida presencia de campos de frontmatter requeridos y encabezados de sección
- Produce un resultado con diagnóstico accionable

**Qué NO hace este skill:**
- No valida el contenido semántico de las secciones, solo su presencia
- No corrige ni genera contenido en el archivo de épica

## Entrada

- Argumento posicional: ruta relativa, nombre (con o sin `.md`) o término de búsqueda del archivo de épica
- `$SPECS_BASE/specs/02-epics/` — directorio donde se buscan los archivos de épica
- `$SPECS_BASE/specs/templates/epic-template.md` — fuente de verdad estructural (solo lectura)

## Parámetros

- `<epica>` (argumento posicional): ruta relativa al archivo `.md`, nombre de la épica con o sin extensión, o término de búsqueda parcial

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `$SPECS_BASE/specs/templates/epic-template.md` debe existir
- Debe proporcionarse al menos un argumento para identificar el archivo a validar

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: `$SPECS_BASE/specs/templates/epic-template.md`

## Modos de ejecución

- **Manual** (`/epic-format-validation <epica>`): muestra el resultado APROBADO/REFINAR/RECHAZADO al usuario.
- **Automático**: invocado por otro skill (ej. `epic-generate-stories`) como gate previo — no pide confirmación.

## Restricciones / Reglas

- **Solo lectura:** no escribe ni modifica ningún archivo.
- **Validación estructural, no semántica:** verifica presencia de secciones por encabezado `##`, no el contenido.
- **Extracción dinámica:** las secciones obligatorias se derivan en runtime del template mediante el comentario `<!-- sección obligatoria -->`; si el template cambia, el skill se adapta automáticamente.
- **Sin corrección:** la generación o corrección de contenido están fuera del scope de este skill.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas validando, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.
  
## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

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

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/epic-template.md`.

- Si el archivo central **no existe**: usar el fallback `$CLI_ROOT/skills/epic-creation/assets/epic-template.md` y emitir:

  > ⚠️ Usando template del skill epic-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

- Si tampoco existe el fallback: informar al usuario y detener la ejecución:

  > ❌ Template `epic-template.md` no encontrado. Ejecuta `sddf-init`.

- Si alguno de los dos **existe**: continua.

---

### Paso 3 — Extraer el contrato obligatorio del template

El contrato tiene dos partes, y **ambas se derivan del template en runtime**: las secciones obligatorias y las claves de frontmatter.

#### 3a. Secciones obligatorias

Extraer dinámicamente los encabezados de las secciones que contengan el comentario `<!-- sección obligatoria` (con o sin espacio antes de `-->`).

**Método de extracción:** Para cada línea que empiece con `##` (encabezado de nivel 2) y que contenga `<!-- sección obligatoria`, extraer el texto del encabezado limpiando el comentario HTML y los espacios sobrantes.

**Resultado esperado a partir del template actual:**
- `Descripción`
- `Historias`
- `Flujos Críticos / Smoke Tests`

#### 3b. Claves de frontmatter obligatorias

Leer el bloque de frontmatter del template (el contenido entre el primer par de `---`) y extraer el nombre de cada clave YAML (el texto antes de los dos puntos, al inicio de línea y sin indentación).

De esas claves, **exigir todas menos** las de esta allowlist de opcionales:

| Clave opcional | Por qué no se exige |
|---|---|
| `alwaysApply` | Configuración de carga del documento en el harness, no parte del contrato de la épica |
| `parent` | Nullable — una épica sin proyecto padre declara `parent: null` |
| `related` | Nullable — una épica sin referencias declara `related: []` |

La allowlist es la única parte codificada en este skill, y solo enumera claves nullables o de configuración. Cualquier clave nueva que se agregue al template pasa a ser obligatoria automáticamente, sin editar este skill.

**Resultado esperado a partir del template actual:**
`type`, `id`, `slug`, `title`, `status`, `substatus`, `created`, `updated`

---

### Paso 4 — Validar el archivo de épica

Leer el archivo de épica resuelta en Paso 1.

#### 4a. Validar frontmatter

Verificar que el bloque frontmatter del archivo de épica (el contenido entre el primer par de `---`) contiene una clave YAML `<clave>:` al inicio de línea por cada clave obligatoria derivada en el Paso 3b.

Buscar claves YAML (`created:`), **no** patrones Markdown (`**Fecha**:`). Una clave presente pero con valor vacío cuenta como presente: este skill valida estructura, no contenido.

Registrar cuáles están ausentes.

#### 4b. Validar secciones obligatorias

Para cada sección obligatoria extraída en Paso 3, verificar que el archivo de épica contiene un encabezado `##` cuyo texto (ignorando espacios y comentarios HTML) coincida con el nombre de la sección.

Registrar cuáles están ausentes.

---

### Paso 5 — Producir resultado

#### Si no hay secciones ni campos faltantes → APROBADO

```
APROBADO

El archivo cumple la estructura obligatoria del template epic-template.md.

Archivo validado: <ruta del archivo>
```

#### Si hay campos o secciones faltantes → REFINAR

```
REFINAR

El archivo no cumple la estructura obligatoria del template epic-template.md.

Archivo validado: <ruta del archivo>

Secciones/campos faltantes:
- <nombre exacto del campo o encabezado faltante 1>
- <nombre exacto del campo o encabezado faltante 2>
...

Revisa el template en $SPECS_BASE/specs/templates/epic-template.md para completar las secciones indicadas.
```

---

## Salida

- **APROBADO**: el archivo cumple la estructura completa del template.
- **REFINAR**: el archivo existe pero le faltan secciones o campos de frontmatter; incluye lista accionable.
- **RECHAZADO**: el archivo no fue encontrado.
- No genera ni modifica archivos en disco.
