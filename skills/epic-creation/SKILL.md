---
name: epic-creation
description: >-
  Crea epic.md interactivamente, sección por sección, siguiendo el template
  epic-template.md en tiempo de ejecución. Usar para crear una épica
  sin necesitar project-plan.md previo.
  Invocar también cuando el usuario mencione "epic-creation", "crear épica",
  "nueva épica", "crear epic", "épica interactiva" o "épica desde cero".
triggers:
  - "epic-creation"
  - "crear épica"
  - "nueva épica"
  - "crear epic"
  - "épica interactiva"
  - "épica desde cero"
---

# Skill: `/epic-creation`

## Objetivo

Conduce al usuario a través de la creación de un archivo de épica completa mediante preguntas interactivas. Extrae la estructura del template `assets/epic-template.md` en tiempo de ejecución — si el template cambia, el flujo de preguntas se actualiza automáticamente.

**Qué hace este skill:**
- Guía la creación de una épica de forma interactiva, sección por sección, extrayendo estructura del template en tiempo de ejecución
- Soporta modo rápido (`--quick`) para omitir secciones opcionales sin preguntar individualmente
- Calcula automáticamente el siguiente ID de features disponible sin pedir IDs al usuario
- Valida la épica generada invocando `epic-format-validation` al finalizar
- Ofrece corrección interactiva si la validación devuelve REFINAR

**Qué NO hace este skill:**
- Crear una épica a partir de un `project-plan.md` existente → usar `epic-from-project-plan`
- Validar una épica ya existente → usar `epic-format-validation`
- Generar historias de usuario de la épica → usar `epic-generate-stories`

---

## Entrada

- Nombre o descripción de la épica en lenguaje natural (opcional; si no se proporciona, el skill lo solicita)
- Flag `--quick` (opcional)

---

## Parámetros

- `{nombre}` — nombre de la épica (opcional; si se omite, el skill lo solicita en el Paso 1)
- `--quick` — omite todas las secciones opcionales sin preguntar individualmente

---

## Precondiciones

- `assets/epic-template.md` debe existir
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`, `epic-format-validation`]
- Archivos: [`assets/epic-template.md`]

---

## Modos de ejecución

- **Manual** (`/epic-creation`): interactivo, guía al usuario sección por sección con preguntas
- **Modo rápido** (`/epic-creation --quick`): omite secciones opcionales sin preguntar
- **Automático**: invocado por orquestador — reporta resultado sin interacción adicional

---

## Restricciones / Reglas

- El template `epic-template.md` es la **única fuente de estructura** — nunca hardcodear nombres de secciones; extraerlos dinámicamente en tiempo de ejecución
- El template es de solo lectura — nunca escribir en él ni usarlo como ruta de salida
- No pedir IDs de features al usuario — calcularlos automáticamente leyendo los directorios existentes en `$SPECS_BASE/specs/03-stories/`
- En modo rápido (`--quick`), las secciones opcionales se omiten sin preguntar
- Si el directorio destino ya existe, preguntar al usuario antes de sobreescribir
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; estas ESPECIFICANDO, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Resolver modo de ejecución y nombre de la épica

#### Detectar modo rápido

Si el input contiene `--quick` o el usuario indica "solo obligatorias" / "modo rápido": activar **modo rápido** (`QUICK_MODE=true`). En modo rápido, las secciones opcionales se omiten sin preguntar.

#### Pedir el nombre de la épica

Si el usuario no proporcionó un nombre de épica junto con el comando, preguntar:

> "¿Cómo se llama la épica? (Ej: 'Sistema de pagos', 'Onboarding v2')"

Con el nombre provisto:
- Derivar el **slug kebab-case**: minúsculas, palabras separadas por guiones, sin caracteres especiales (Ej: `"Sistema de pagos"` → `sistema-de-pagos`)
- Construir el **ID de directorio**: proponer el siguiente ID disponible buscando con Glob el
  patrón `$SPECS_BASE/specs/02-epics/EPIC-*/epic.md`. La herramienta Glob solo encuentra
  archivos, no directorios — usar siempre este patrón de archivo anidado. De cada ruta retornada,
  extraer el número `NN` del segmento `EPIC-NN-*` (directorio padre). Tomar el número más alto
  y sumarle 1; si Glob retorna vacío, verificar con Bash (`ls $SPECS_BASE/specs/02-epics/ |
  grep -E "^EPIC-"`) antes de asumir que no hay épicas previas.
  Formato final: `EPIC-NN-<slug>` con NN de 2 dígitos (Ej: `EPIC-14-mi-epica`).
  Si el usuario prefiere asignar el ID manualmente, aceptarlo sin objeción.
- Definir la **ruta de salida**: `$SPECS_BASE/specs/02-epics/<EPIC-NN-slug>/epic.md`

#### Verificar conflicto de directorio

Si el directorio `$SPECS_BASE/specs/02-epics/<EPIC-NN-slug>/` ya existe, preguntar:

> "El directorio `<ruta>` ya existe. ¿Qué deseas hacer?
> 1. Sobreescribir el archivo existente
> 2. Usar un nombre diferente"

Si elige "2", volver al inicio del Paso 1 para pedir un nombre diferente.

---

### Paso 2 — Leer template y extraer secciones

El archivo de plantilla es la **única fuente de información estructural**. Nunca hardcodear nombres de secciones.

Leer `$SPECS_BASE/specs/templates/epic-template.md` (fuente de verdad del proyecto, puede contener personalizaciones). Si no existe, usar el seed `assets/epic-template.md` y emitir:
> ⚠️ Usando template seed del skill. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

- Si ninguno de los dos archivos existe: detener la ejecución (ver Manejo de errores).
- Si el archivo **existe**: extraer dinámicamente:
  - **Secciones obligatorias**: líneas que empiecen con `##` y contengan `<!-- sección obligatoria`
  - **Secciones opcionales**: líneas que empiecen con `##` y contengan `<!-- sección opcional`
  - **Campos de frontmatter obligatorios**: `slug`, `title`, `date`, `status`

Guardar la lista de secciones para guiar los Pasos 3, 4 y 5.

---

### Paso 3 — Completar frontmatter

Preguntar los campos del frontmatter con valores sugeridos. Para cada campo, mostrar la pregunta con el valor por defecto entre paréntesis para que el usuario lo acepte o modifique:

| Campo | Pregunta | Valor por defecto |
|---|---|---|
| `title` | "¿Cuál es el título de la épica?" | El nombre ingresado en el Paso 1 |
| `date` | "¿Fecha de la épica? (YYYY-MM-DD)" | Fecha de hoy |
| `status` | "¿Estado inicial?" | `DEFINE` — estado inicial de una épica recién creada (en etapa de definición de alcance) |
| `substatus` | "¿Subestado? (IN‑PROGRESS / REVIEW / READY)" | `IN‑PROGRESS` |
| `slug` | — | Derivado automáticamente del nombre (mostrar al usuario, permitir corrección) |

Confirmar el slug con el usuario antes de continuar. El slug determinará el nombre del directorio y del archivo.

---

### Paso 4 — Completar secciones obligatorias

Para cada sección obligatoria extraída en el Paso 2, formular una pregunta clara con contexto del template. **No se permite saltar secciones obligatorias.**

#### Guía de preguntas por sección del template actual

> Estas preguntas son una guía basada en la estructura actual del template. Si el template cambia, adaptar las preguntas a las secciones reales extraídas.

##### Descripción
> "Describe la épica en 2-4 líneas: ¿qué valor de negocio entrega, qué problema resuelve y en qué contexto?"

##### Features
Preguntar de forma iterativa:
> "¿Cuáles son las features principales de esta épica? Lista cada una con formato:
> `Nombre: descripción breve`
> (Escribe 'listo' cuando termines)"

Acepta múltiples features en un mismo mensaje o una por una. **No pedir IDs al usuario** — los IDs se asignan al generar las historias con `/epic-generate-stories`, no durante la creación de la épica. El formato final en el archivo será:
```
- [ ] **{Nombre}:** {descripción}
```
> Los FEAT IDs se asignan al ejecutar `/epic-generate-stories`. No se pre-asignan en la épica para evitar colisiones con otras épicas en definición simultánea.

##### Flujos Críticos / Smoke Tests
> "Define al menos un flujo crítico que, si falla, debe detener el despliegue. Para cada escenario, describe:
> - **DADO** (contexto inicial)
> - **CUANDO** (acción que desencadena el flujo)
> - **ENTONCES** (resultado esperado crítico)
>
> ¿Cuántos escenarios críticos quieres definir?"

Solicitar cada escenario por separado si el usuario prefiere. Continuar hasta que el usuario indique que terminó.

---

### Paso 5 — Completar secciones opcionales

Si `QUICK_MODE=true`: saltar toda esta fase, continuar al Paso 6.

De lo contrario, para cada sección opcional extraída en el Paso 2, preguntar:

> "¿Quieres completar la sección **[nombre de sección]**? (sí / no / saltar todas)"

- Si "sí": formular la pregunta específica de la sección (ver guía abajo) y registrar la respuesta.
- Si "no": omitir la sección del archivo final.
- Si "saltar todas": omitir todas las secciones opcionales restantes sin preguntar más.

#### Guía de preguntas para secciones opcionales del template actual

##### Requerimiento
> "¿Hay alguna regla de negocio específica que aplique a esta épica? Descríbela brevemente."

##### Impacto en Procesos Claves
> "¿Qué procesos del negocio se ven afectados por esta épica? Lista cada proceso y cómo se ve impactado."

##### Dependencias Críticas
> "¿Hay dependencias externas críticas? Para cada una, indica: descripción, dueño responsable y fecha de compromiso."

##### Riesgos
> "¿Qué riesgos identificas? Para cada riesgo, indica la descripción y la mitigación propuesta."

##### Criterios de éxito
> "¿Cuáles son los criterios de éxito medibles para esta épica? Lista cada uno como un ítem verificable."

##### Notas adicionales
> "¿Hay algún comentario adicional relevante para el equipo de desarrollo o stakeholders?"

---

### Paso 6 — Generar el archivo epic.md

Con todas las respuestas recopiladas, construir el archivo `epic.md` completo:

1. Construir el bloque frontmatter YAML con los valores del Paso 3
2. Añadir el encabezado `# Épica: {título}`
3. Para cada sección obligatoria: insertar el encabezado `## {nombre sección}` y el contenido respondido
4. Para cada sección opcional que el usuario completó: insertar el encabezado y el contenido
5. Omitir las secciones opcionales que el usuario saltó

#### Crear el directorio y escribir el archivo

```
$SPECS_BASE/specs/02-epics/<EPIC-NN-slug>/epic.md
```

Verificar que el directorio existe; si no, crearlo.

Mostrar al usuario una vista previa del archivo antes de escribirlo:

> "Voy a crear el archivo en `<ruta>`. ¿Confirmas? (sí / editar primero)"

Si el usuario pide editar: mostrar el contenido y permitir correcciones antes de guardar.

---

### Paso 7 — Validación automática

Después de escribir el archivo, invocar el skill `epic-format-validation` sobre el archivo generado.

#### Si el resultado es APROBADO

Mostrar:
```
✅ APROBADO

Archivo creado: $SPECS_BASE/specs/02-epics/<EPIC-NN-slug>/epic.md

Siguiente paso: ejecuta /epic-generate-stories para generar las historias de usuario de esta épica.
```

#### Si el resultado es REFINAR

Mostrar las secciones faltantes y ofrecer completarlas:

```
⚠️ REFINAR

Las siguientes secciones están incompletas o ausentes:
- [lista de secciones]

¿Quieres completarlas ahora de forma interactiva? (sí / no)
```

Si el usuario responde "sí": volver al Paso 4 o Paso 5 según corresponda para las secciones faltantes y regenerar el archivo.

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| Template no encontrado | `❌ No se encontró el template requerido en assets/epic-template.md. Por favor verifica que el archivo existe antes de continuar.` | Detener la ejecución |
| Conflicto de directorio | `El directorio <ruta> ya existe. ¿Qué deseas hacer? 1. Sobreescribir / 2. Usar un nombre diferente` | Esperar decisión del usuario; si elige "2", volver al Paso 1 |
| Validación retorna REFINAR | `⚠️ REFINAR — Las siguientes secciones están incompletas: [lista]` | Ofrecer completar las secciones faltantes de forma interactiva |

---

## Salida

- `$SPECS_BASE/specs/02-epics/<EPIC-NN-slug>/epic.md` — épica creada y validado, listo para `/epic-generate-stories`

### Referencias

- **Template canónico:** `assets/epic-template.md`
- **Validación de épicas:** `/epic-format-validation`
- **Generación de stories:** `/epic-generate-stories`
- **Generación desde plan:** `/epic-from-project-plan`
