---
name: project-policies-generation
description: >-
  Inicializa o actualiza los documentos de políticas y constitución del proyecto SDDF
  (constitution.md y definition-of-done-story.md) a partir de templates Markdown, y
  registra las referencias en CLAUDE.md / AGENTS.md para que los agentes IA los lean
  automáticamente. Usar cuando se quiere establecer o actualizar las reglas técnicas,
  convenciones y criterios de calidad del proyecto.
  Invocar también cuando el usuario mencione "generar políticas", "actualizar constitución",
  "definition of done", "project-policies-generation" o equivalentes.
triggers:
  - project-policies-generation
  - /project-policies-generation
  - generar políticas del proyecto
  - actualizar políticas
  - constitution.md
  - definition of done
---

# Skill: `/project-policies-generation`

**Cuándo usar este skill:**
Usar cuando se configura un proyecto SDDF por primera vez y se necesitan documentos de
políticas, cuando se quiere actualizar las políticas existentes (stack tecnológico, criterios
de DoD, etc.), o cuando se quiere asegurar que los agentes IA operen con las mismas reglas
y estándares. Invocar también cuando el usuario mencione "generar políticas", "actualizar
constitución", "definition of done", "project-policies-generation" o equivalentes.

## Objetivo

Genera o actualiza los documentos de políticas del proyecto SDDF a partir de templates
Markdown y registra sus referencias en `CLAUDE.md` / `AGENTS.md` para que todos los
agentes IA los lean automáticamente antes de cualquier acción:

- `$SPECS_BASE/policies/constitution.md` — principios técnicos inamovibles del proyecto (stack, convenciones, metodologías)
- `$SPECS_BASE/policies/definition-of-done-story.md` — criterios de calidad para considerar una historia completada

**Qué hace este skill:**
- Crea o actualiza `constitution.md` desde el template, con confirmación del usuario si ya existe
- Crea o actualiza `definition-of-done-story.md` desde el template, con confirmación del usuario si ya existe
- Registra referencias a las políticas en `CLAUDE.md` o `AGENTS.md`

**Qué NO hace este skill:**
- En modo template en blanco, no rellena el contenido — el usuario es responsable de editarlo; usa la opción auto-completar para que el agente complete los placeholders con datos reales del proyecto
- No modifica el contenido de archivos existentes sin confirmación explícita del usuario

## Entrada

- `assets/project-constitution-template.md` — template fuente para constitution (solo lectura)
- `assets/definition-of-done-story-template.md` — template fuente para DoD (solo lectura)
- `CLAUDE.md` o `AGENTS.md` en la raíz del repositorio — archivo de entrada del agente donde se registran las referencias

## Parámetros

- Ninguno — el skill opera de forma interactiva cuando detecta archivos existentes

## Precondiciones

- El entorno debe superar el preflight (`skill-preflight`) sin errores
- `assets/project-constitution-template.md` debe existir
- `assets/definition-of-done-story-template.md` debe existir

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`assets/project-constitution-template.md`, `assets/definition-of-done-story-template.md`]

## Modos de ejecución

- **Manual** (`/project-policies-generation`): interactivo — pide confirmación antes de sobreescribir archivos existentes.
- **Automático**: invocado por `sddf-init` como parte de la inicialización — reporta resultado sin interacción adicional.

## Restricciones / Reglas

- **Templates de solo lectura:** los templates fuente nunca se modifican ni se usan como ruta de salida.
- **Sin sobreescritura silenciosa:** si un archivo de políticas ya existe, siempre se pide confirmación antes de sobreescribir.
- **Inserción conservadora en CLAUDE.md:** si no se puede identificar la sección correcta para insertar referencias, el skill muestra las líneas a agregar manualmente en lugar de modificar el archivo.
- **Extracción dinámica:** la estructura de los documentos de políticas se deriva en runtime del template; si los templates cambian, el output se actualiza automáticamente.
- NO modifique ningún archivo existente en el código fuente (estamos especificando políticas de desarrollo, no implementando los artefactos técnicos)
- NO genere código; estas especificando políticas de desarrollo, no implementando los artefactos técnicos
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

Verificar adicionalmente que existen los templates requeridos:
- `assets/project-constitution-template.md`
- `assets/definition-of-done-story-template.md`

Si alguno de los templates no existe, mostrar el mensaje y detener la ejecución:

```
❌ No se encontró el template requerido en: assets/<nombre>.md

Por favor verifica que el archivo existe o ejecuta `sddf-init` para inicializar la estructura base.
```

### Paso 1 — Preparar directorio de políticas

Verificar si el directorio `$SPECS_BASE/policies/` existe.

Si no existe, crearlo antes de continuar e informar al usuario:
```
📁 Directorio creado: $SPECS_BASE/policies/
```

### Paso 2 — Generar constitution.md

#### 2a. Leer el template

Leer el archivo `assets/project-constitution-template.md`.

La estructura del output la define íntegramente el template — nunca hardcodear secciones en este skill.

#### 2b. Verificar existencia previa

Si `$SPECS_BASE/policies/constitution.md` **no existe**, preguntar al usuario:

```
$SPECS_BASE/policies/constitution.md no existe. ¿Cómo deseas crearlo?
  (a) Auto-completar — leer el proyecto y completar los placeholders con datos reales (Recomendado)
  (b) Template en blanco — crear con los placeholders sin completar
```

Esperar respuesta antes de continuar:
- `a` / `auto-completar`: ejecutar el **Paso 2c** (Auto-completado)
- `b` / `blanco`: crear el archivo con el contenido del template, completando el frontmatter con `created` y `updated` (fecha actual). Informar: `✅ Creado: $SPECS_BASE/policies/constitution.md`

Si `$SPECS_BASE/policies/constitution.md` **ya existe**, preguntar al usuario:

```
El archivo $SPECS_BASE/policies/constitution.md ya existe.
¿Qué deseas hacer?
  (a) Auto-completar — leer el proyecto y completar los placeholders con datos reales
  (e) Editar el contenido existente
  (s) Sobreescribir con el template en blanco
  (n) Saltar este archivo
```

Esperar respuesta antes de continuar:
- `a` / `auto-completar`: ejecutar el **Paso 2c** (Auto-completado)
- `e` / `editar`: abrir el archivo para que el usuario lo edite; no modificar su contenido
- `s` / `sobreescribir`: reemplazar el contenido con el template y actualizar el campo `updated`
- `n` / `saltar`: no modificar el archivo y continuar con el Paso 3

### Paso 2c — Auto-completar constitution.md

Este paso se ejecuta cuando el usuario elige la opción `(a)` en el Paso 2b.

#### Recopilación de contexto del proyecto

Leer los siguientes archivos en orden para extraer datos del proyecto. No todos existirán — omitir silenciosamente los que no existan:

1. `package.json` (raíz) → `name`, `version`, `packageManager`, `scripts`
2. `packages/*/package.json` y `apps/*/package.json` → `dependencies`, `devDependencies`, `peerDependencies` (de todos los paquetes)
3. `CLAUDE.md` → convenciones, stack, arquitectura, commits, branching ya documentados
4. `.github/workflows/*.yml` → detectar CI/CD: jobs, node-version, plataforma
5. `turbo.json` o `nx.json` → detectar monorepo y pipeline
6. `tsconfig.json` o `tsconfig.base.json` → detectar TypeScript: `strict`, `target`, `lib`
7. `.prettierrc`, `.prettierrc.json` o campo `prettier` en `package.json` → configuración de formato
8. `.eslintrc*` o campo `eslintConfig` en `package.json` → configuración de linting
9. `Dockerfile` o `docker-compose.yml` → detectar contenedores
10. `.specify/memory/constitution.md` → si existe, usarla como fuente adicional de principios y convenciones

#### Mapeo de datos a placeholders

Completar cada placeholder del template con los datos extraídos siguiendo esta tabla:

| Sección | Placeholder original | Fuente de datos |
|---------|----------------------|-----------------|
| Lenguaje | `[ej. TypeScript 5.x ...]` | tsconfig + package.json devDependencies (typescript version) |
| Runtime / Entorno | `[ej. Node.js 20 LTS ...]` | CI yml → `node-version`, package.json → `engines` |
| Frameworks y librerías core | `[Nombre]` / `[versión]` / `[propósito]` | Principales packages de dependencies + peerDependencies |
| Base de datos | `[ej. PostgreSQL 16 ...]` | Detectar paquetes: prisma, mongoose, pg, mysql2, sqlite3, etc. |
| Cloud / Hosting | `[ej. AWS / GCP / Vercel ...]` |  CLAUDE.md / AGENTS.md, detectar paquetes: @vercel/*, aws-sdk, firebase, etc. |
| Contenedores | `[ej. Docker ...]` | Detectar Dockerfile o docker-compose.yml |
| CI/CD | `[ej. GitHub Actions ...]` | .github/workflows/ → detectar tipo de CI |
| Formateador | `[ej. Prettier ...]` | package.json → prettier version |
| Linter | `[ej. ESLint ...]` | package.json → eslint version |
| Convención de nombres | `[ej. camelCase ...]` |  CLAUDE.md / AGENTS.md → sección de convenciones |
| Longitud máxima de línea | `[ej. 100 caracteres]` | .prettierrc → `printWidth`, .eslintrc → `max-len` |
| Estructura de directorios | `[describe la organización...]` |  CLAUDE.md / AGENTS.md → sección de arquitectura |
| Convención de imports | `[ej. imports agrupados...]` |  CLAUDE.md / AGENTS.md, .eslintrc → `import/order` |
| Branch principal | `main` |  CLAUDE.md / AGENTS.md o dejar `main` por defecto |
| Estrategia de branching | `[ej. Conventional Branch...]` | CLAUDE.md / AGENTS.md |
| Formato de commits | `[ej. Conventional Commits...]` | CLAUDE.md / AGENTS.md |
| Pull requests | `[ej. se requiere 1 aprobación...]` | CLAUDE.md / AGENTS.md |
| Comentarios | `[ej. solo cuando el WHY...]` | CLAUDE.md / AGENTS.md |
| Docstrings / JSDoc | `[ej. obligatorio en funciones...]` | CLAUDE.md / AGENTS.md |
| Metodología | `[ej. SDD...]` |  CLAUDE.md / AGENTS.md |
| Testing | `[ej. TDD...]` |  CLAUDE.md / AGENTS.md + detectar: vitest, jest, playwright, cypress |
| Code review | `[ej. pair review...]` |  CLAUDE.md / AGENTS.md |
| Patrón principal | `[ej. Clean Architecture...]` | CLAUDE.md / AGENTS.md |
| Gestión de estado | `[ej. Redux...]` | package.json → redux, zustand, jotai, etc. |
| Restricciones de diseño | `[ej. No usar ORMs...]` |  CLAUDE.md / AGENTS.md / .specify/memory/constitution.md / .github/instructions / .github/copilot-instructions.md |
| Principios Técnicos Inamovibles | `[Principio N]` / `[descripción y razón]` |  CLAUDE.md / AGENTS.md / .specify/memory/constitution.md / .github/instructions / .github/copilot-instructions.md |
| Notas adicionales | `[Por completar]` | .specify/memory/constitution.md si existe / .github/instructions / .github/copilot-instructions.md si existe |

#### Reglas de completado

- Reemplazar cada placeholder `[ej. ...]` con el valor real detectado, **sin** mantener el prefijo `ej. `.
- Si un campo no puede inferirse de ninguna fuente, reemplazar con `[TBD]` (no dejar el placeholder original `[ej. ...]`).
- Si hay múltiples frameworks relevantes, listar cada uno en su propia línea con el formato `- **Nombre:** versión — propósito`.
- Completar el frontmatter con `created` y `updated` = fecha actual (`YYYY-MM-DD`).
- Respetar la estructura y orden de secciones del template — no agregar ni eliminar secciones.

#### Guardar y reportar

Guardar el archivo en `$SPECS_BASE/policies/constitution.md` (UTF-8 sin BOM).

Informar al usuario:

```
✅ Auto-completado: $SPECS_BASE/policies/constitution.md

Campos completados automáticamente: N
Campos que requieren revisión manual [TBD]: M
  - [lista de campos marcados como TBD]

Revisa el archivo generado y completa los campos [TBD] con la información específica de tu proyecto.
```

Continuar con el Paso 3.

### Paso 3 — Generar definition-of-done-story.md

#### 3a. Leer el template

Leer el archivo `assets/definition-of-done-story-template.md`.

La estructura del output la define íntegramente el template.

#### 3b. Verificar existencia previa

Si `$SPECS_BASE/policies/definition-of-done-story.md` **no existe**, preguntar al usuario:

```
$SPECS_BASE/policies/definition-of-done-story.md no existe. ¿Cómo deseas crearlo?
  (a) Auto-completar — completar las notas adicionales con criterios específicos del stack detectado (Recomendado)
  (b) Template en blanco — crear con los placeholders sin completar
```

Esperar respuesta antes de continuar:
- `a` / `auto-completar`: ejecutar el **Paso 3c** (Auto-completado)
- `b` / `blanco`: crear el archivo con el contenido del template, completando el frontmatter con `created` y `updated` (fecha actual). Informar: `✅ Creado: $SPECS_BASE/policies/definition-of-done-story.md`

Si `$SPECS_BASE/policies/definition-of-done-story.md` **ya existe**, preguntar al usuario:

```
El archivo $SPECS_BASE/policies/definition-of-done-story.md ya existe.
¿Qué deseas hacer?
  (a) Auto-completar — completar las notas adicionales con criterios específicos del stack detectado
  (e) Editar el contenido existente
  (s) Sobreescribir con el template en blanco
  (n) Saltar este archivo
```

Esperar respuesta antes de continuar:
- `a` / `auto-completar`: ejecutar el **Paso 3c** (Auto-completado)
- `e` / `editar`: abrir el archivo para que el usuario lo edite; no modificar su contenido
- `s` / `sobreescribir`: reemplazar el contenido con el template y actualizar el campo `updated`
- `n` / `saltar`: no modificar el archivo y continuar con el Paso 4

### Paso 3c — Auto-completar definition-of-done-story.md

Este paso se ejecuta cuando el usuario elige la opción `(a)` en el Paso 3b.

El template de DoD contiene checkboxes predefinidos y no tiene placeholders de contenido significativos, salvo la sección **Notas adicionales** (`[Por completar]`) y el frontmatter. El auto-completado se enfoca en esas dos partes.

#### Recopilación de contexto de testing

Leer `package.json` (raíz y paquetes) para detectar las herramientas de testing presentes:

| Paquete detectado | Criterio adicional a agregar en Notas adicionales |
|-------------------|---------------------------------------------------|
| `vitest` / `jest` | Los tests unitarios deben ejecutarse con `pnpm test` sin errores |
| `@playwright/test` | Los tests E2E deben pasar en el proyecto `apps/demo` o equivalente |
| `cypress` | Los tests E2E Cypress deben ejecutarse sin fallos en los flujos críticos |
| `axe-core` / `vitest-axe` / `@axe-core/playwright` | Los componentes deben superar la auditoría de accesibilidad con axe sin violaciones |
| `@testing-library/*` | Cada componente interactivo debe tener al menos un test con Testing Library |
| `storybook` | Cada componente debe tener una Story funcional en Storybook |

#### Completado

1. Reemplazar `[Por completar]` en la sección "Notas adicionales" con la lista de criterios específicos detectados.
2. Si no se detecta ninguna herramienta adicional, reemplazar `[Por completar]` con: `Sin criterios adicionales identificados para este proyecto.`
3. Completar el frontmatter con `created` y `updated` = fecha actual (`YYYY-MM-DD`).

#### Guardar y reportar

Guardar el archivo en `$SPECS_BASE/policies/definition-of-done-story.md` (UTF-8 sin BOM).

Informar al usuario:

```
✅ Auto-completado: $SPECS_BASE/policies/definition-of-done-story.md

Herramientas detectadas: [lista]
Criterios adicionales generados en "Notas adicionales": N

Revisa el archivo y ajusta los criterios según el contexto específico de tu proyecto.
```

Continuar con el Paso 4.

### Paso 4 — Registrar referencias en CLAUDE.md / AGENTS.md

#### 4a. Detectar archivo de entrada del agente

Verificar en la raíz del repositorio:
1. Si existe `CLAUDE.md` → usarlo
2. Si no existe `CLAUDE.md` pero existe `AGENTS.md` → usarlo
3. Si no existe ninguno → notificar al usuario y mostrar las líneas a agregar manualmente:

```
⚠️ No se encontró CLAUDE.md ni AGENTS.md en la raíz del repositorio.

Agrega las siguientes líneas manualmente a tu archivo de entrada del agente:

@docs/policies/constitution.md
@docs/policies/definition-of-done-story.md
```

#### 4b. Verificar referencias existentes

Buscar en el archivo detectado si ya contiene referencias a los archivos de políticas:
- `@$SPECS_BASE/policies/constitution.md` (o la ruta relativa equivalente)
- `@$SPECS_BASE/policies/definition-of-done-story.md`

Si **ambas referencias ya existen**: informar que no es necesario modificar el archivo:
```
ℹ️ Las referencias a las políticas ya están registradas en CLAUDE.md — sin cambios.
```

#### 4c. Agregar referencias faltantes

Si alguna referencia no está presente, intentar insertarla al final del archivo.

Si el archivo tiene una sección de contexto identificable (por ejemplo, un bloque con encabezado `# Contexto` o similar), insertar antes del cierre de esa sección.

Si el formato del archivo es no estándar o no se puede determinar la sección correcta, **no modificar el archivo** y mostrar las líneas a agregar manualmente:

```
⚠️ No se pudo determinar el lugar correcto en CLAUDE.md para insertar las referencias.

Agrega las siguientes líneas manualmente:

@docs/policies/constitution.md
@docs/policies/definition-of-done-story.md
```

Si se insertaron las referencias exitosamente:
```
✅ Referencias agregadas en CLAUDE.md:
   @docs/policies/constitution.md
   @docs/policies/definition-of-done-story.md
```

### Paso 5 — Resumen

Mostrar el resumen de la ejecución:

```
## Políticas del proyecto generadas

📄 Archivos de políticas:
- $SPECS_BASE/policies/constitution.md    [creado | auto-completado | actualizado | saltado]
- $SPECS_BASE/policies/definition-of-done-story.md  [creado | auto-completado | actualizado | saltado]

🔗 Referencias en CLAUDE.md:
- [registradas | ya existían | requieren acción manual]

**Siguiente paso:**
Revisa los archivos de políticas generados. Si elegiste auto-completado, completa los campos marcados como [TBD].
Luego ejecuta `/story-design` para comenzar a diseñar la implementación de una historia.
```

## Salida

- `$SPECS_BASE/policies/constitution.md` — documento de constitución del proyecto con principios técnicos inamovibles.
- `$SPECS_BASE/policies/definition-of-done-story.md` — documento de criterios DoD para historias de usuario.
- Actualizaciones en `CLAUDE.md` o `AGENTS.md` con referencias `@` a los archivos de políticas generados.
