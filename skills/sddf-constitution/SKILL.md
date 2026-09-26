---
name: sddf-constitution
description: >-
  Inicializa o actualiza constitution.md y el DoD de historia por etapa (guardrails/dod-story-*.md) registrando la constitución en CLAUDE.md.
  Usar para establecer reglas técnicas y criterios de calidad del proyecto.
  Invocar para "generar políticas", "actualizar constitución",
  "definition of done" o "sddf-constitution".
---

# Skill: `/sddf-constitution`

**Cuándo usar este skill:**
Usar cuando se configura un proyecto SDDF por primera vez y se necesitan documentos de
políticas, cuando se quiere actualizar las políticas existentes (stack tecnológico, criterios
de DoD, etc.), o cuando se quiere asegurar que los agentes IA operen con las mismas reglas
y estándares. Invocar también cuando el usuario mencione "generar políticas", "actualizar
constitución", "definition of done", "sddf-constitution" o equivalentes.

## Objetivo

Genera o actualiza los documentos de gobernanza del proyecto SDDF a partir de templates
Markdown y registra sus referencias en `CLAUDE.md` / `AGENTS.md` para que todos los
agentes IA los lean automáticamente antes de cualquier acción:

- `$SPECS_BASE/constitution.md` — documento supremo: principios técnicos inamovibles del proyecto (stack, convenciones, metodologías). Vive en la raíz de `docs/`, un nivel por encima de `policies/` y `guardrails/`, porque ambas capas derivan de él
- `$SPECS_BASE/guardrails/dod-story-<etapa>.md` — transition guardrails: un archivo por etapa con los criterios que una historia debe cumplir para avanzar de estado

**Qué hace este skill:**
- Crea o actualiza `constitution.md` desde el template, con confirmación del usuario si ya existe
- Crea los archivos `dod-story-<etapa>.md` que falten desde las plantillas de `assets/dod-story/` (nunca sobrescribe)
- Ofrece mover un `policies/constitution.md` heredado a la raíz de `docs/`; para un DoD de historia sin dividir, remite a `/memory-system migrate --from=dod-monolithic`
- Crea `policies/README.md` (índice de la capa) si no existe
- Registra referencias a las políticas en `CLAUDE.md` o `AGENTS.md`

**Qué NO hace este skill:**
- En modo template en blanco, no rellena el contenido — el usuario es responsable de editarlo; usa la opción auto-completar para que el agente complete los placeholders con datos reales del proyecto
- No modifica el contenido de archivos existentes sin confirmación explícita del usuario

## Entrada

- `assets/project-constitution-template.md` — template fuente para constitution (solo lectura)
- `assets/dod-story/dod-story-<etapa>.md` — seis plantillas fuente del DoD por etapa (solo lectura)
- `CLAUDE.md` o `AGENTS.md` en la raíz del repositorio — archivo de entrada del agente donde se registran las referencias

## Parámetros

- Ninguno — el skill opera de forma interactiva cuando detecta archivos existentes

## Precondiciones

- La raíz de artefactos debe resolverse mediante el contrato local antes de continuar.
- `assets/project-constitution-template.md` debe existir
- Las seis plantillas de `assets/dod-story/` deben existir

## Dependencias

- Archivos: [`assets/project-constitution-template.md`, `assets/dod-story/*.md`]
- Skills: `memory-system` (opcional; solo se sugiere `migrate --from=dod-monolithic` para un DoD heredado)

## Modos de ejecución

- **Manual** (`/sddf-constitution`): interactivo — pide confirmación antes de sobreescribir archivos existentes.
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

### Paso 0 — Resolver contexto local

<!-- SDDF-ROOT-RESOLUTION: v1 -->

Resuelve una sola vez `REPO_ROOT` y el contexto local antes de leer o escribir artefactos:

1. Si `SDDF_ROOT` está definida, exige un valor no vacío que apunte a un directorio accesible; úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = SDDF_ROOT`. Si no es utilizable, informa la fuente y el valor y detén el workflow antes de cualquier escritura.
2. Solo si `SDDF_ROOT` no está definida, lee `<REPO_ROOT>/sddf.config.yaml`. Si su clave superior `root` existe, debe ser un escalar no vacío que resuelva a un directorio accesible (las rutas relativas se anclan en `REPO_ROOT`); úsalo como `SPECS_BASE` y registra `ROOT_SOURCE = sddf.config.yaml`. Una configuración o raíz explícita inválida detiene el workflow sin fallback ni escrituras.
3. Si no existe ninguna fuente explícita, usa `docs` relativo a `REPO_ROOT` y registra `ROOT_SOURCE = default`. Conserva `SPECS_BASE` y `ROOT_SOURCE` durante toda la invocación.
4. Resuelve `CLI_ROOT` independientemente y solo cuando el workflow necesite skills, agentes o comandos del runtime; nunca lo derives de `SPECS_BASE`.

El diagnóstico de entorno se solicita explícitamente con `/skill-preflight`; este workflow no lo invoca en su hot path.


### Paso 1 — Preparar directorios de políticas y guardrails

Verificar si existen los directorios `$SPECS_BASE/policies/` y `$SPECS_BASE/guardrails/`.

Por cada uno que no exista, crearlo antes de continuar e informar al usuario:
```
📁 Directorio creado: $SPECS_BASE/policies/
📁 Directorio creado: $SPECS_BASE/guardrails/
```

Si `$SPECS_BASE/policies/README.md` no existe, crearlo con un índice mínimo de la capa: qué es una policy,
que la constitución vive un nivel arriba en `$SPECS_BASE/constitution.md`, la convención `<ámbito>-policy.md`
y una tabla de índice vacía. Informar `📄 Creado: $SPECS_BASE/policies/README.md`.

### Paso 2 — Generar constitution.md

La constitución es el documento supremo de gobernanza: vive en `$SPECS_BASE/constitution.md`, **no** dentro
de `policies/`, porque las policies y los guardrails derivan de ella.

#### 2a. Leer el template

Leer el archivo `assets/project-constitution-template.md`.

La estructura del output la define íntegramente el template — nunca hardcodear secciones en este skill.

#### 2b. Migrar una constitución heredada

Si `$SPECS_BASE/constitution.md` **no existe** pero `$SPECS_BASE/policies/constitution.md` **sí**, preguntar al usuario:

```
⚠️ policies/constitution.md está deprecado: la constitución es la raíz de la gobernanza y ahora vive en la raíz de docs/.
  (m) Mover policies/constitution.md → constitution.md conservando su contenido (Recomendado)
  (n) No mover — continuar y crear uno nuevo desde el template
```

- `m` / `mover`: mover el archivo (con `git mv` si el repositorio está versionado), actualizar en su frontmatter `type: constitution` y `updated` (fecha actual), y reescribir los enlaces relativos internos (`../guardrails/` → `guardrails/`, `../policies/` → `policies/`). Informar `✅ Movido: $SPECS_BASE/constitution.md` y continuar con el **Paso 2c** tratando el archivo como existente.
- `n` / `no`: continuar con el **Paso 2c** sin tocar el archivo heredado.

#### 2c. Verificar existencia previa

Si `$SPECS_BASE/constitution.md` **no existe**, preguntar al usuario:

```
$SPECS_BASE/constitution.md no existe. ¿Cómo deseas crearlo?
  (a) Auto-completar — leer el proyecto y completar los placeholders con datos reales (Recomendado)
  (b) Template en blanco — crear con los placeholders sin completar
```

Esperar respuesta antes de continuar:
- `a` / `auto-completar`: ejecutar el **Paso 2d** (Auto-completado)
- `b` / `blanco`: crear el archivo con el contenido del template, completando el frontmatter con `created` y `updated` (fecha actual). Informar: `✅ Creado: $SPECS_BASE/constitution.md`

Si `$SPECS_BASE/constitution.md` **ya existe**, preguntar al usuario:

```
El archivo $SPECS_BASE/constitution.md ya existe.
¿Qué deseas hacer?
  (a) Auto-completar — leer el proyecto y completar los placeholders con datos reales
  (e) Editar el contenido existente
  (s) Sobreescribir con el template en blanco
  (n) Saltar este archivo
```

Esperar respuesta antes de continuar:
- `a` / `auto-completar`: ejecutar el **Paso 2d** (Auto-completado)
- `e` / `editar`: abrir el archivo para que el usuario lo edite; no modificar su contenido
- `s` / `sobreescribir`: reemplazar el contenido con el template y actualizar el campo `updated`
- `n` / `saltar`: no modificar el archivo y continuar con el Paso 3

### Paso 2d — Auto-completar constitution.md

Este paso se ejecuta cuando el usuario elige la opción `(a)` en el Paso 2c.

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

Guardar el archivo en `$SPECS_BASE/constitution.md` (UTF-8 sin BOM).

Informar al usuario:

```
✅ Auto-completado: $SPECS_BASE/constitution.md

Campos completados automáticamente: N
Campos que requieren revisión manual [TBD]: M
  - [lista de campos marcados como TBD]

Revisa el archivo generado y completa los campos [TBD] con la información específica de tu proyecto.
```

Continuar con el Paso 3.

### Paso 3 — Generar el DoD de historia por etapa

El DoD es un **transition guardrail** (checklist que bloquea transiciones de estado de una historia), por
eso vive en `$SPECS_BASE/guardrails/`, no en `policies/`. Está dividido en un archivo por etapa: cada
skill del pipeline carga solo el suyo (sección `## DoD aplicable` de su `SKILL.md`).

| Plantilla | Destino | Etapa |
|---|---|---|
| `assets/dod-story/dod-story-specify.md` | `$SPECS_BASE/guardrails/dod-story-specify.md` | SPECIFY (`enforcement: warn`) |
| `assets/dod-story/dod-story-plan.md` | `$SPECS_BASE/guardrails/dod-story-plan.md` | PLAN |
| `assets/dod-story/dod-story-implement.md` | `$SPECS_BASE/guardrails/dod-story-implement.md` | IMPLEMENT |
| `assets/dod-story/dod-story-code-review.md` | `$SPECS_BASE/guardrails/dod-story-code-review.md` | CODE-REVIEW |
| `assets/dod-story/dod-story-verify.md` | `$SPECS_BASE/guardrails/dod-story-verify.md` | VERIFY |
| `assets/dod-story/dod-story-acceptance.md` | `$SPECS_BASE/guardrails/dod-story-acceptance.md` | ACCEPTANCE |

Si `sddf.config.yaml › guardrails.dod.story.<etapa>` declara otro slug para una etapa, el destino de esa
etapa es `$SPECS_BASE/guardrails/<slug>.md`. El checklist de despliegue (`deliver`) es propio de cada
proyecto y no tiene plantilla.

#### 3a. DoD heredado sin dividir

Si **no existe ningún** `dod-story-<etapa>.md` pero el proyecto tiene un DoD de historia heredado de una
versión anterior (un único archivo con todas las etapas en `guardrails/`, o el antiguo `dod-story.md` en
`policies/`), **no** generar las plantillas por encima: mostrar

```
⚠️ Este proyecto tiene un DoD de historia sin dividir por etapa.
   Divídelo conservando tu contenido: /memory-system migrate --from=dod-monolithic
   (añade --dry-run para ver el plan antes de escribir)
```

y continuar con el Paso 4 sin crear archivos de DoD.

#### 3b. Verificar existencia previa

Si **ninguno** de los archivos de la tabla existe, preguntar al usuario:

```
El DoD de historia por etapa no existe en $SPECS_BASE/guardrails/. ¿Cómo deseas crearlo?
  (a) Auto-completar — añadir al DoD IMPLEMENT criterios específicos del stack detectado (Recomendado)
  (b) Plantillas en blanco — crear los seis archivos tal como están en assets/dod-story/
```

Esperar respuesta antes de continuar:
- `a` / `auto-completar`: crear los seis archivos (como en `b`) y ejecutar el **Paso 3c**
- `b` / `blanco`: copiar cada plantilla a su destino completando `created` y `updated` (fecha actual).
  Informar una línea `✅ Creado: <ruta>` por archivo.

Si **alguno** existe, crear solo los que faltan (copia-si-falta, sin preguntar por archivo) e informar
`✅ Creado: <ruta>` / `ℹ️ Ya existía: <ruta>` por archivo. Después preguntar:

```
El DoD de historia por etapa ya existe en $SPECS_BASE/guardrails/.
¿Qué deseas hacer?
  (a) Auto-completar — añadir al DoD IMPLEMENT criterios específicos del stack detectado
  (e) Editar el contenido existente
  (n) Saltar
```

- `a` / `auto-completar`: ejecutar el **Paso 3c**
- `e` / `editar`: indicar las rutas para que el usuario las edite; no modificar su contenido
- `n` / `saltar`: no modificar ningún archivo y continuar con el Paso 4

Ningún archivo existente se sobrescribe desde este paso.

### Paso 3c — Auto-completar el DoD IMPLEMENT

Este paso se ejecuta cuando el usuario elige la opción `(a)` en el Paso 3b. Solo modifica
`$SPECS_BASE/guardrails/dod-story-implement.md` (o el slug que declare el mapeo de configuración).

#### Recopilación de contexto de testing

Leer `package.json` (raíz y paquetes) para detectar las herramientas de testing presentes:

| Paquete detectado | Criterio adicional |
|-------------------|--------------------|
| `vitest` / `jest` | Los tests unitarios deben ejecutarse con `pnpm test` sin errores |
| `@playwright/test` | Los tests E2E deben pasar en el proyecto `apps/demo` o equivalente |
| `cypress` | Los tests E2E Cypress deben ejecutarse sin fallos en los flujos críticos |
| `axe-core` / `vitest-axe` / `@axe-core/playwright` | Los componentes deben superar la auditoría de accesibilidad con axe sin violaciones |
| `@testing-library/*` | Cada componente interactivo debe tener al menos un test con Testing Library |
| `storybook` | Cada componente debe tener una Story funcional en Storybook |

#### Completado

1. Añadir al final de `dod-story-implement.md` un subgrupo `## 🧩 Criterios del stack` con un
   `- [ ] <criterio>` por herramienta detectada. Si el subgrupo ya existe, añadir solo los criterios que falten.
2. Si no se detecta ninguna herramienta adicional, no añadir el subgrupo.
3. Actualizar `updated` = fecha actual (`YYYY-MM-DD`) en el frontmatter.

#### Guardar y reportar

Guardar el archivo (UTF-8 sin BOM) e informar:

```
✅ Auto-completado: $SPECS_BASE/guardrails/dod-story-implement.md

Herramientas detectadas: [lista]
Criterios añadidos en "Criterios del stack": N

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

@docs/constitution.md
```

#### 4b. Verificar referencias existentes

Buscar en el archivo detectado si ya contiene referencias a los archivos de políticas:
- `@$SPECS_BASE/constitution.md` (o la ruta relativa equivalente)

El DoD de historia **no** se registra con `@`: importarlo cargaría todas las etapas en cada sesión, y cada
skill del pipeline ya carga solo el de su etapa. Si el archivo contiene un import heredado del DoD
(cualquier línea `@…` que apunte a un DoD de historia en `guardrails/` o en `policies/`), eliminar esa línea e informarlo.

Si el archivo contiene la referencia heredada `@$SPECS_BASE/policies/constitution.md` y el documento ya vive en su ubicación actual, reemplazarla por la nueva ruta en lugar de añadir una segunda línea.

Si **la referencia ya existe**: informar que no es necesario modificar el archivo:
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

@docs/constitution.md
```

Si se insertaron las referencias exitosamente:
```
✅ Referencias agregadas en CLAUDE.md:
   @docs/constitution.md
```

### Paso 5 — Resumen

Mostrar el resumen de la ejecución:

```
## Políticas del proyecto generadas

📄 Archivos de políticas:
- $SPECS_BASE/constitution.md                     [creado | movido | auto-completado | actualizado | saltado]
- $SPECS_BASE/guardrails/dod-story-<etapa>.md    [creados N | ya existían M | auto-completado | migración sugerida | saltado]

🔗 Referencias en CLAUDE.md:
- [registradas | ya existían | requieren acción manual]

**Siguiente paso:**
Revisa los archivos de políticas generados. Si elegiste auto-completado, completa los campos marcados como [TBD].
Luego ejecuta `/story-design` para comenzar a diseñar la implementación de una historia.
```

## Salida

- `$SPECS_BASE/constitution.md` — constitución del proyecto: documento supremo con los principios técnicos inamovibles.
- `$SPECS_BASE/policies/README.md` — índice de la capa de policies (creado si no existía).
- `$SPECS_BASE/guardrails/dod-story-{specify,plan,implement,code-review,verify,acceptance}.md` — transition guardrails con los criterios DoD de cada etapa de una historia.
- Actualizaciones en `CLAUDE.md` o `AGENTS.md` con referencias `@` a los archivos de políticas generados.
