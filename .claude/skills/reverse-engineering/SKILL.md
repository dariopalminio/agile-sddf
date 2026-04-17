---
description: >-
  Reverse-engineers a requirement specification from an existing codebase.
  Triggers when the user runs /reverse-engineering (with optional --focus <path>,
  --update, or --verbose flags). Analyzes the current repository's source code and
  generates docs/specs/project/requirement-spec.md using a requirements template.
  Use this skill whenever the user wants to document an existing codebase, extract
  requirements from code, reverse-engineer a spec, or generate a requirement-spec
  from a project they didn't write.
alwaysApply: false
name: reverse-engineering
---
Eres el orquestador del comando `/reverse-engineering`. Tu responsabilidad es coordinar 4 agentes de análisis en paralelo y luego un agente sintetizador para generar automáticamente `docs/specs/project/requirement-spec.md` a partir del código fuente del repositorio actual.

## Fase 0 — Setup

### 1. Parsear flags

Extrae los flags del input del usuario:
- `--focus <path>`: ruta relativa para limitar el análisis (ej: `src/auth`). Si no se provee, usar la raíz del repositorio.
- `--update`: modo incremental — solo re-analizar secciones marcadas como `<!-- PENDING MANUAL REVIEW -->` en el output existente.
- `--verbose`: al final, mostrar resumen detallado de cada agente.

### 2. Resolver ruta del template

Busca el template en este orden:
1. `requirements-spec-template.md` en el directorio `templates` de este skill (`..\skills\reverse-engineering\templates`)
2. si no existe busca en `.agents\skills\reverse-engineering`
3. Si no existe: usa `requirements-spec-template.md` en la raíz del proyecto `cli-reverse` (donde está este skill)

Guarda la ruta resuelta como `TEMPLATE_PATH` — la pasarás a todos los agentes.

### 3. Verificar modo --update

Si `--update` está activo:
1. Lee `docs/specs/project/requirement-spec.md` si existe
2. Verifica el campo `**Estado**`:
   - `Doing`: continúa en modo incremental
   - `Ready`: informa al usuario que el documento ya está completo y pide confirmación antes de continuar
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
  → reverse-engineer-synthesizer → docs/specs/project/requirement-spec.md
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
> - Output path: `docs/specs/project/requirement-spec.md`
> - Update mode: [true/false] — si true, también lee el documento existente y preserva secciones ya completas.
>
> Genera el documento aunque algunas secciones queden como `<!-- PENDING MANUAL REVIEW -->`.

---

## Fase 3 — Confirmación

1. Verifica que `docs/specs/project/requirement-spec.md` existe leyendo el archivo
2. Cuenta las ocurrencias de `<!-- PENDING MANUAL REVIEW -->` en el output
3. Reporta al usuario:
   ```
   ✅ Especificación generada correctamente.
   Path: docs/specs/project/requirement-spec.md
   Secciones completadas: [N]
   Secciones pendientes de revisión: [M] (<!-- PENDING MANUAL REVIEW -->)
   
   Gaps identificados: ver sección "## Gaps & Next Steps" al final del documento.
   Siguiente paso: revisar manualmente las secciones marcadas y cambiar **Estado** a "Ready" cuando esté completo.
   ```
4. Si `--verbose`: muestra un resumen de cada archivo `.tmp/rfc-*.md` (primeras 20 líneas de cada uno)
5. Si el archivo no existe: informa que algo falló y sugiere revisar los logs de los agentes y re-ejecutar
