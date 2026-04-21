---
name: release-format-validation
description: "Valida que un archivo de especificación de release cumple la estructura obligatoria del template release-spec-template.md. Produce resultado APROBADO, REFINAR (con lista de secciones faltantes) o RECHAZADO (archivo no encontrado)."
---
# Skill: /release-format-validation

Valida que un archivo de especificación de release contiene todas las secciones obligatorias del template `docs/specs/templates/release-spec-template.md`. Produce resultado **APROBADO**, **REFINAR** o **RECHAZADO**.

**Usar cuando:**
- Antes de usar un archivo de release como input para `generate-stories` u otros skills del pipeline SDDF
- Para verificar que un release recién creado o editado cumple la estructura requerida
- Como gate de calidad antes de marcar un release como Ready

---

## Fase 0 — Resolver el input

El skill acepta tres formas de input. Detectar cuál aplica antes de continuar:

### Tipo A — Ruta relativa completa
**Señal:** El input contiene `/` o `\` o termina en `.md`.
**Acción:** Usar esa ruta directamente. Si el archivo no existe → ir a **manejo de archivo no encontrado**.

### Tipo B — Nombre con o sin extensión `.md`
**Señal:** El input es una palabra o frase corta que no contiene separadores de ruta.
**Acción:**
1. Buscar en `docs/specs/releases/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas/minúsculas), incluyendo los que tengan o no extensión `.md`
2. Si hay exactamente 1 coincidencia → usar ese archivo. Continuar a Fase 1.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → ir a **manejo de archivo no encontrado**.

### Manejo de archivo no encontrado

```
RECHAZADO

Archivo no encontrado: <ruta o término proporcionado>

No se encontró ningún archivo de release en docs/specs/releases/ que coincida con el input proporcionado.

Verifica que el nombre o ruta sea correcto e inténtalo de nuevo.
```

Terminar la ejecución del skill sin continuar.

---

## Fase 1 — Extraer secciones obligatorias del template

Leer el archivo `docs/specs/templates/release-spec-template.md`.

Extraer dinámicamente los encabezados de las secciones que contengan el comentario `<!-- sección obligatoria` (con o sin espacio antes de `-->`).

**Método de extracción:** Para cada línea que empiece con `##` (encabezado de nivel 2) y que contenga `<!-- sección obligatoria`, extraer el texto del encabezado limpiando el comentario HTML y los espacios sobrantes.

**Resultado esperado a partir del template actual:**
- `Descripción`
- `Features`
- `Flujos Críticos / Smoke Tests`

Adicionalmente, los campos de frontmatter siempre son obligatorios: **Título**, **Versión**, **Estado**, **Fecha**.

---

## Fase 2 — Validar el archivo de release

Leer el archivo de release resuelto en Fase 0.

### 2a. Validar frontmatter

Verificar que el bloque frontmatter (entre los dos `---`) contiene los cuatro campos:
- `**Título**:`
- `**Versión**:`
- `**Estado**:`
- `**Fecha**:`

Registrar cuáles están ausentes.

### 2b. Validar secciones obligatorias

Para cada sección obligatoria extraída en Fase 1, verificar que el archivo de release contiene un encabezado `##` cuyo texto (ignorando espacios y comentarios HTML) coincida con el nombre de la sección.

Registrar cuáles están ausentes.

---

## Fase 3 — Producir resultado

### Si no hay secciones ni campos faltantes → APROBADO

```
APROBADO

El archivo cumple la estructura obligatoria del template release-spec-template.md.

Archivo validado: <ruta del archivo>
```

### Si hay campos o secciones faltantes → REFINAR

```
REFINAR

El archivo no cumple la estructura obligatoria del template release-spec-template.md.

Archivo validado: <ruta del archivo>

Secciones/campos faltantes:
- <nombre exacto del campo o encabezado faltante 1>
- <nombre exacto del campo o encabezado faltante 2>
...

Revisa el template en docs/specs/templates/release-spec-template.md para completar las secciones indicadas.
```

---

## Notas de implementación

- La validación verifica **presencia** de secciones por encabezado `##`, no valida el contenido semántico.
- La extracción de secciones obligatorias es **dinámica**: si el template cambia (nuevas secciones con `<!-- sección obligatoria -->`), el skill las detecta automáticamente.
- Las secciones opcionales (marcadas con `<!-- sección opcional -->` o sin comentario) no afectan el resultado.
- Generación ni corrección de contenido están fuera del scope de este skill.
