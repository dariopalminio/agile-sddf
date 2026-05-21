---
name: release-format-validation
description: "Valida que un archivo de especificación de release cumple la estructura obligatoria del template release-spec-template.md. Produce resultado APROBADO, REFINAR (con lista de secciones faltantes) o RECHAZADO (archivo no encontrado)."
triggers:
  - release-format-validation
  - /release-format-validation
  - validar release
  - validar formato de release
  - verificar estructura de release
---

# Skill: `/release-format-validation`

**Cuándo usar este skill:**
Usar antes de que un archivo de release sea consumido por otros skills del pipeline SDDF
(`release-generate-stories`, etc.), para verificar que un release recién creado o editado
cumple la estructura requerida, o como gate de calidad antes de marcar un release como Ready.
Invocar también cuando el usuario mencione "validar release", "verificar estructura de release",
"release-format-validation" o equivalentes.

## Objetivo

Valida que un archivo de especificación de release contiene todas las secciones obligatorias
del template `release-spec-template.md`. Produce resultado **APROBADO**, **REFINAR**
(con lista de secciones faltantes) o **RECHAZADO** (archivo no encontrado).

**Qué hace este skill:**
- Lee el template en runtime y extrae dinámicamente las secciones obligatorias
- Valida presencia de campos de frontmatter requeridos y encabezados de sección
- Produce un resultado con diagnóstico accionable

**Qué NO hace este skill:**
- No valida el contenido semántico de las secciones, solo su presencia
- No corrige ni genera contenido en el archivo de release

## Entrada

- Argumento posicional: ruta relativa, nombre (con o sin `.md`) o término de búsqueda del archivo de release
- `$SPECS_BASE/specs/releases/` — directorio donde se buscan los archivos de release
- `$SPECS_BASE/specs/templates/release-spec-template.md` — fuente de verdad estructural (solo lectura)

## Parámetros

- `<release>` (argumento posicional): ruta relativa al archivo `.md`, nombre del release con o sin extensión, o término de búsqueda parcial

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `$SPECS_BASE/specs/templates/release-spec-template.md` debe existir
- Debe proporcionarse al menos un argumento para identificar el archivo a validar

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: `$SPECS_BASE/specs/templates/release-spec-template.md`

## Modos de ejecución

- **Manual** (`/release-format-validation <release>`): muestra el resultado APROBADO/REFINAR/RECHAZADO al usuario.
- **Automático**: invocado por otro skill (ej. `release-generate-stories`) como gate previo — no pide confirmación.

## Restricciones / Reglas

- **Solo lectura:** no escribe ni modifica ningún archivo.
- **Validación estructural, no semántica:** verifica presencia de secciones por encabezado `##`, no el contenido.
- **Extracción dinámica:** las secciones obligatorias se derivan en runtime del template mediante el comentario `<!-- sección obligatoria -->`; si el template cambia, el skill se adapta automáticamente.
- **Sin corrección:** la generación o corrección de contenido están fuera del scope de este skill.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas validando, no implementando los artefactos técnicos

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

### Paso 1 — Resolver el input

El skill acepta tres formas de input. Detectar cuál aplica antes de continuar:

#### Tipo A — Ruta relativa completa
**Señal:** El input contiene `/` o `\` o termina en `.md`.
**Acción:** Usar esa ruta directamente. Si el archivo no existe → ir a **manejo de archivo no encontrado**.

#### Tipo B — Nombre con o sin extensión `.md`
**Señal:** El input es una palabra o frase corta que no contiene separadores de ruta.
**Acción:**
1. Buscar en `$SPECS_BASE/specs/releases/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas/minúsculas), incluyendo los que tengan o no extensión `.md`
2. Si hay exactamente 1 coincidencia → usar ese archivo. Continuar a Paso 2.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → ir a **manejo de archivo no encontrado**.

#### Manejo de archivo no encontrado

```
RECHAZADO

Archivo no encontrado: <ruta o término proporcionado>

No se encontró ningún archivo de release en docs/specs/releases/ que coincida con el input proporcionado.

Verifica que el nombre o ruta sea correcto e inténtalo de nuevo.
```

Terminar la ejecución del skill sin continuar.

---

### Paso 2 — Verificar template

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derívelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `$SPECS_BASE/specs/templates/release-spec-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:

  > ❌ No se encontró el template requerido en `$SPECS_BASE/specs/templates/release-spec-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua.

---

### Paso 3 — Extraer secciones obligatorias del template

Extraer dinámicamente los encabezados de las secciones que contengan el comentario `<!-- sección obligatoria` (con o sin espacio antes de `-->`).

**Método de extracción:** Para cada línea que empiece con `##` (encabezado de nivel 2) y que contenga `<!-- sección obligatoria`, extraer el texto del encabezado limpiando el comentario HTML y los espacios sobrantes.

**Resultado esperado a partir del template actual:**
- `Descripción`
- `Features`
- `Flujos Críticos / Smoke Tests`

Adicionalmente, los campos de frontmatter siempre son obligatorios: **Título**, **Versión**, **Estado**, **Fecha**.

---

### Paso 4 — Validar el archivo de release

Leer el archivo de release resuelto en Paso 1.

#### 4a. Validar frontmatter

Verificar que el bloque frontmatter (entre los dos `---`) contiene los cuatro campos:
- `**Título**:`
- `**Versión**:`
- `**Estado**:`
- `**Fecha**:`

Registrar cuáles están ausentes.

#### 4b. Validar secciones obligatorias

Para cada sección obligatoria extraída en Paso 3, verificar que el archivo de release contiene un encabezado `##` cuyo texto (ignorando espacios y comentarios HTML) coincida con el nombre de la sección.

Registrar cuáles están ausentes.

---

### Paso 5 — Producir resultado

#### Si no hay secciones ni campos faltantes → APROBADO

```
APROBADO

El archivo cumple la estructura obligatoria del template release-spec-template.md.

Archivo validado: <ruta del archivo>
```

#### Si hay campos o secciones faltantes → REFINAR

```
REFINAR

El archivo no cumple la estructura obligatoria del template release-spec-template.md.

Archivo validado: <ruta del archivo>

Secciones/campos faltantes:
- <nombre exacto del campo o encabezado faltante 1>
- <nombre exacto del campo o encabezado faltante 2>
...

Revisa el template en $SPECS_BASE/specs/templates/release-spec-template.md para completar las secciones indicadas.
```

---

## Salida

- **APROBADO**: el archivo cumple la estructura completa del template.
- **REFINAR**: el archivo existe pero le faltan secciones o campos de frontmatter; incluye lista accionable.
- **RECHAZADO**: el archivo no fue encontrado.
- No genera ni modifica archivos en disco.
