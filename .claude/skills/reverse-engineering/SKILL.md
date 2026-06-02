---
description: >-
  Reverse-engineers a requirement specification from an existing codebase.
  Triggers when the user runs /reverse-engineering (with optional --focus <path>,
  --update, or --verbose flags). Analyzes the current repository's source code and
  generates `<SPECS_BASE>/specs/projects/<PROJ-ID>-<nombre>/project.md` using a requirements template.
  Use this skill whenever the user wants to document an existing codebase, extract
  requirements from code, reverse-engineer a spec, or generate a requirement-spec
  from a project they didn't write.
alwaysApply: false
name: reverse-engineering
---
Eres el orquestador del comando `/reverse-engineering`. Tu responsabilidad es coordinar 4 agentes de análisis en paralelo y luego un agente sintetizador para generar automáticamente `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` a partir del código fuente del repositorio actual.

---

## Restricciones / Reglas

- NO omita la exploración exhaustiva del código fuente: el análisis DEBE basarse en el estado real del código fuente.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; solo estamos analizando el código existente
- El output es exclusivamente archivos de especificación en formato Markdown (`.md`)
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight` antes de cualquier operación con archivos. El preflight verifica `SDDF_ROOT`, resuelve `SPECS_BASE` (fallback: `docs`) y confirma los subdirectorios de specs estándar. Si retorna `✗ Entorno inválido`, detener la ejecución.

Usar `$SPECS_BASE` (resuelto por `skill-preflight`) para todas las rutas en los pasos siguientes.

---

## Configuración 0b — Resolver o crear directorio del proyecto (`PROJ_DIR`)

1. Listar todos los subdirectorios de `$SPECS_BASE/specs/projects/`.
2. Para cada subdirectorio, leer `project-intent.md` y verificar si `substatus` es `DONE` o `IN‑PROGRESS`.
3. Si se encuentra exactamente uno → usar ese directorio como `$PROJ_DIR`.
4. Si se encuentran varios → mostrar la lista y pedir al usuario que elija.
5. Si no se encuentra ninguno → **derivar el ID desde el nombre del repositorio**:
   - Obtener el nombre del directorio raíz del repositorio (ej. `my-project`).
   - Convertir a kebab-case: `PROJ-01-my-project`.
   - Crear el directorio `$SPECS_BASE/specs/projects/PROJ-01-my-project/` si no existe.
   - Usar `PROJ-01-my-project` como `$PROJ_DIR`.
   - Informar al usuario: `ℹ️ No se encontró proyecto activo. Se creará en: $SPECS_BASE/specs/projects/$PROJ_DIR/`

La ruta completa del proyecto es: `$SPECS_BASE/specs/projects/$PROJ_DIR/`

---

## Fase 0 — Setup

### 1. Parsear flags

Extrae los flags del input del usuario:
- `--focus <path>`: ruta relativa para limitar el análisis (ej: `src/auth`). Si no se provee, usar la raíz del repositorio.
- `--update`: modo incremental — solo re-analizar secciones marcadas como `<!-- PENDING MANUAL REVIEW -->` en el output existente.
- `--verbose`: al final, mostrar resumen detallado de cada agente.

### 2. Verificar que el template existe y leerlo

El archivo de plantilla es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca codifique directamente los nombres o la estructura de las secciones en esta habilidad; siempre derréglelos de la plantilla en tiempo de ejecución. Si la plantilla cambia, el output generado se actualizará automáticamente.

El archivo de plantilla es de **solo lectura**. Nunca escriba en él, lo modifique ni lo use como ruta de salida.

Lee el archivo de plantilla `../project-discovery/assets/project-template.md`.

- Si el archivo **no existe**: informar al usuario y detener la ejecución:

  > ❌ No se encontró el template en `../project-discovery/assets/project-template.md`.
  > Por favor verifica que el archivo existe antes de continuar.

- Si el archivo **existe**: continua.

### 3. Verificar modo --update

Si `--update` está activo:
1. Lee `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` si existe
2. Verifica el campo `substatus`:
   - `IN‑PROGRESS`: continúa en modo incremental
   - `DONE`: informa al usuario que el documento ya está completo y pide confirmación antes de continuar
   - No existe: ejecuta en modo normal (primera ejecución)

### 4. Mostrar plan al usuario

Informa brevemente qué vas a hacer:
```
Iniciando análisis de ingeniería inversa...
Template: [TEMPLATE_PATH]
Scope: [FOCUS_PATH o "raíz del repositorio"]
Modo: [Normal | Incremental (--update) | Verbose]

Fase 1: Análisis paralelo (4 agentes)
  → reverse-engineer-architect   → .tmp/rfc-architecture.md
  → reverse-engineer-product-discovery       → .tmp/rfc-features.md
  → reverse-engineer-business-analyst  → .tmp/rfc-business-rules.md
  → reverse-engineer-ux-flow-mapper          → .tmp/rfc-navigation.md

Fase 2: Síntesis
  → reverse-engineer-synthesizer → $SPECS_BASE/specs/projects/$PROJ_DIR/project.md
```

---

## Fase 1 — Análisis paralelo

Invoca los 4 agentes **simultáneamente en el mismo turn** usando llamadas paralelas al Agent tool. No esperes que uno termine antes de iniciar el siguiente.

### Agente reverse-engineer-architect

> Analiza la arquitectura técnica del repositorio.
>
> - Scope de análisis: [FOCUS_PATH si se proveyó, de lo contrario "raíz del repositorio"]
> - Template path: [TEMPLATE_PATH]
> - Verbose: [true/false]
> - Update mode: [true/false]
>
> Escribe tus hallazgos en `.tmp/rfc-architecture.md` siguiendo el formato estructurado de tu definición.
> Escribe el archivo aunque el análisis sea parcial.

### Agente reverse-engineer-product-discovery

> Extrae las features y funcionalidades del repositorio desde la perspectiva del usuario.
>
> - Scope de análisis: [FOCUS_PATH si se proveyó, de lo contrario "raíz del repositorio"]
> - Template path: [TEMPLATE_PATH]
> - Verbose: [true/false]
> - Update mode: [true/false]
>
> Escribe tus hallazgos en `.tmp/rfc-features.md` siguiendo el formato estructurado de tu definición.
> Escribe el archivo aunque el análisis sea parcial.

### Agente reverse-engineer-business-analyst

> Extrae las reglas de negocio, validaciones, permisos y workflows del repositorio.
>
> - Scope de análisis: [FOCUS_PATH si se proveyó, de lo contrario "raíz del repositorio"]
> - Template path: [TEMPLATE_PATH]
> - Verbose: [true/false]
> - Update mode: [true/false]
>
> Escribe tus hallazgos en `.tmp/rfc-business-rules.md` siguiendo el formato estructurado de tu definición.
> Escribe el archivo aunque el análisis sea parcial.

### Agente reverse-engineer-ux-flow-mapper

> Reconstruye el mapa de navegación y flujos de usuario del repositorio.
>
> - Scope de análisis: [FOCUS_PATH si se proveyó, de lo contrario "raíz del repositorio"]
> - Template path: [TEMPLATE_PATH]
> - Verbose: [true/false]
> - Update mode: [true/false]
>
> Escribe tus hallazgos en `.tmp/rfc-navigation.md` siguiendo el formato estructurado de tu definición.
> Escribe el archivo aunque el análisis sea parcial.

---

## Fase 2 — Síntesis

Después de que los 4 agentes de Fase 1 hayan completado:

### 1. Verificar archivos intermedios

Verifica la existencia de cada archivo `.tmp/rfc-*.md`. Si alguno falta, advierte al usuario pero **continúa** — el synthesizer puede trabajar con inputs incompletos.

### 2. Invocar reverse-engineer-synthesizer

> Fusiona los outputs de los agentes de análisis y genera el documento final.
>
> - Template path: [TEMPLATE_PATH]
> - Intermediate files:
>   - `.tmp/rfc-architecture.md` (existe: [sí/no])
>   - `.tmp/rfc-features.md` (existe: [sí/no])
>   - `.tmp/rfc-business-rules.md` (existe: [sí/no])
>   - `.tmp/rfc-navigation.md` (existe: [sí/no])
> - Output path: `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md`
> - Update mode: [true/false] — si true, también lee el documento existente y preserva secciones ya completas.
>
> Al completar el frontmatter del documento generado, usar `status: DISCOVERY` — estado inicial de todo proyecto generado por ingeniería inversa (descubrimiento de requisitos desde código).
> Genera el documento aunque algunas secciones queden como `<!-- PENDING MANUAL REVIEW -->`.

---

## Fase 3 — Confirmación

1. Verifica que `$SPECS_BASE/specs/projects/$PROJ_DIR/project.md` existe leyendo el archivo
2. Cuenta las ocurrencias de `<!-- PENDING MANUAL REVIEW -->` en el output
3. Reporta al usuario:
   ```
   ✅ Especificación generada correctamente.
   Path: $SPECS_BASE/specs/projects/$PROJ_DIR/project.md
   Secciones completadas: [N]
   Secciones pendientes de revisión: [M] (<!-- PENDING MANUAL REVIEW -->)
   
   Gaps identificados: ver sección "## Gaps & Next Steps" al final del documento.
   Siguiente paso: revisar manualmente las secciones marcadas y cambiar **Estado** a "Ready" cuando esté completo.
   ```
4. Si `--verbose`: muestra un resumen de cada archivo `.tmp/rfc-*.md` (primeras 20 líneas de cada uno)
5. Si el archivo no existe: informa que algo falló y sugiere revisar los logs de los agentes y re-ejecutar

