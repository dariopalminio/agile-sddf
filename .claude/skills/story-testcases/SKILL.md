---
name: story-testcases
description: >-
  Genera testcases.md con tabla de casos de prueba tipificados (UT/CT/IT/API/E2E/EV)
  derivada de story.md y design.md. Usar cuando se quieran especificar pruebas antes
  de implementar, generar testcases.md, crear tabla de casos trazables a criterios de
  aceptación, o necesite el artefacto de pruebas del pipeline SDDF. Invocar también
  cuando el usuario mencione "casos de prueba", "testcases", "especificar pruebas" o
  "tabla de pruebas desde historia".
triggers:
  - "story-testcases"
  - "generar casos de prueba"
  - "testcases"
  - "tabla de pruebas"
  - "especificar pruebas"
  - "casos de prueba desde story"
version: "1.0.0"
type: delegate
input: "story.md, design.md"
output: "testcases.md"
invocable: true
alwaysApply: false
---

# Skill: /story-testcases

## Objetivo

Genera `testcases.md`: la fuente de verdad de especificación de pruebas para una historia. Produce una tabla Markdown con casos tipificados (UT, CT, IT, API, E2E, EV) derivados de los criterios de aceptación de `story.md` y las decisiones técnicas de `design.md`.

**Posición en el pipeline:**
```
story-design → story-tasking → story-testcases → story-analyze → story-implement-tasks
```

**Qué hace este skill:**
- Deriva casos de prueba desde los ACs de `story.md` y los elementos de `design.md`
- Clasifica automáticamente cada caso por tipo según reglas semánticas
- Enriquece la cobertura con `tasks.md` si está disponible (opcional)
- Integra referencias de la fase `plan` desde `sddf-config.yaml`
- Soporta `--force` para sobreescritura sin interacción (útil en CI)

**Qué NO hace este skill:**
- Generar código de tests — `testcases.md` es solo especificación
- Ejecutar tests ni verificar implementación
- Actualizar el frontmatter de `story.md` (responsabilidad de `story-analyze`)

---

## Entrada

| Artefacto | Requerido | Descripción |
|-----------|-----------|-------------|
| `story.md` | ✓ obligatorio | Fuente de ACs y escenarios Gherkin |
| `design.md` | ✓ obligatorio | Fuente de elementos estructurales (componentes, interfaces, endpoints) |
| `tasks.md` | opcional | Enriquece la cobertura con casos derivados de tareas tipo code/test |
| `sddf-config.yaml` | opcional | Referencias de la fase `plan` para enriquecer el contexto |

## Parámetros

- `{story_id}` — ID de la historia (ej. `FEAT-057`)
- `{story_path}` — ruta explícita al directorio (opcional)
- `--force` — sobreescribir `testcases.md` existente sin pedir confirmación

## Salida

- `{directorio_historia}/testcases.md` — tabla de casos de prueba tipificados y trazables

---

## Reglas de clasificación de tipos de test

Aplicar esta tabla al procesar cada elemento de `story.md` y `design.md`:

| Señal en los artefactos | Prefijo | Tipo |
|-------------------------|---------|------|
| Función/método público de módulo o servicio | UT | Unit |
| Componente UI (props, eventos, renderizado) | CT | Component |
| Integración entre dos componentes o servicios | IT | Integration |
| Endpoint REST (verbo HTTP + ruta definida) | API | API |
| Escenario Gherkin completo en story.md | E2E | End-to-End |
| Skill SDDF como sujeto de validación | EV | Eval |
| Store/gestor de estado global (si aplica al proyecto) | ST | Store |

**Cobertura mínima por tipo:**
- UT: happy path + al menos un caso de error/borde
- CT: renderizado correcto + un caso de prop/evento edge
- IT: flujo positivo de integración entre los dos componentes
- API: request válido + respuesta esperada (happy path)
- E2E: trazable 1-a-1 al escenario Gherkin de origen
- EV: happy-path del skill + caso fail-fast

---

## Flujo de ejecución

### Paso 0 — Verificar entorno y cargar referencias

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener sin generar archivos.

Usar `$SPECS_BASE` (resuelto por preflight) para todas las rutas.

Leer `docs/policies/sddf-config.yaml` (si existe). Extraer `complementary_skills.plan.skills`.
Para cada entrada con `type: reference`, leer los `.md` en `references_path` y añadirlos al contexto.
Si `sddf-config.yaml` no existe: emitir `⚠️ sddf-config.yaml no encontrado — continúa con flujo genérico`.
Si una `references_path` no existe: emitir `[WARN] referencias no encontradas para <name> — continúa sin ellas`.

---

### Paso 1 — Resolver parámetros

#### 1a. Resolución del story_id

Si no se proporcionó argumento, preguntar:
```
¿Para qué historia quieres generar los casos de prueba?
Proporciona el ID (ej. FEAT-057) o la ruta completa al directorio.
```

#### 1b. Resolución del directorio (primera coincidencia)

1. Ruta explícita `{story_path}` si se proporcionó
2. Glob `$SPECS_BASE/specs/stories/{story_id}-*/`
3. Si no se encuentra: `❌ No se encontró la historia {story_id} bajo $SPECS_BASE/specs/stories/` → detener

#### 1c. Verificar artefactos obligatorios

Si `story.md` no existe:
```
❌ No se encontró story.md en: <ruta>
   Sugerencia: ejecuta /release-generate-stories para generar la historia primero.
```
Detener.

Si `design.md` no existe:
```
❌ No se encontró design.md en: <ruta>
   Sugerencia: ejecuta /story-design {story_id} para generar el diseño técnico.
```
Detener.

#### 1d. Idempotencia — ¿testcases.md ya existe?

Si `testcases.md` ya existe en el directorio:

- **Sin `--force`:** preguntar:
  ```
  El archivo testcases.md ya existe en: <ruta>
  ¿Qué deseas hacer?
    (r) Regenerar — reemplazar el contenido existente
    (n) No modificar — saltar la generación
  ```
  - `n`: informar y terminar
  - `r`: continuar

- **Con `--force`:** continuar directamente y emitir al guardar: `[INFO] testcases.md sobreescrito con --force`

---

### Paso 2 — Leer story.md

Leer `story.md` y extraer:
- `story_id`, `story_slug`, `story_title` del frontmatter
- **Criterios de aceptación:** todos los bloques con encabezado `### Escenario` o equivalente, numerados internamente como AC-1, AC-2 … AC-N
- Requisitos no funcionales (rendimiento, seguridad, UX)

Si `story.md` no contiene ninguna sección de criterios de aceptación ni bloques Gherkin:
```
⚠️ story.md o design.md no tienen contenido suficiente para derivar casos de prueba.
   Completa los criterios de aceptación en story.md antes de continuar.
```
**No generar testcases.md.** Detener.

---

### Paso 3 — Leer design.md

Leer `design.md` y extraer:
- Componentes, servicios, interfaces y su descripción (secciones `### D-N` o equivalente)
- Para cada elemento: tipo semántico según la tabla de clasificación de este skill
- Notas de contrato o interfaces que implican integración entre componentes

Si `design.md` está vacío o no tiene decisiones técnicas:
```
⚠️ story.md o design.md no tienen contenido suficiente para derivar casos de prueba.
   Completa el diseño técnico en design.md antes de continuar.
```
**No generar testcases.md.** Detener.

---

### Paso 3b — Leer tasks.md (opcional)

Verificar si `tasks.md` existe en el directorio.

**Si no existe:** continuar sin advertencia — `tasks.md` es fuente opcional.

**Si existe:** leer y extraer tareas cuya descripción implique lógica de código:
- Keywords que sugieren tarea UT: "implementar", "crear función", "método", "servicio", "validar lógica"
- Keywords que sugieren tarea IT: "integrar", "conectar", "registrar ruta", "middleware"
- Para cada tarea relevante: registrar como candidata a caso adicional con Ref `T-NNN`

---

### Paso 4 — Leer template en tiempo de ejecución

Buscar el template en este orden:
1. `assets/testcases-template.md` relativo al directorio del skill activo
2. `$SPECS_BASE/specs/templates/testcases-template.md`
3. Template de fallback interno (sección `## Template de Fallback` al final de este archivo)

Informar: `✓ Template: <ruta> [local | global | fallback interno]`

La estructura del output la dicta el template, no este skill.

---

### Paso 5 — Derivar casos de prueba

Combinar ACs del Paso 2, elementos del Paso 3 y tareas del Paso 3b para derivar la lista completa de casos.

#### 5a. Casos E2E desde ACs de story.md

Por cada escenario Gherkin completo en story.md → generar un caso E2E trazable 1-a-1:
- ID: `E2E-001`, `E2E-002`...
- Ref: `AC-N` del escenario de origen

#### 5b. Casos técnicos desde design.md

Por cada elemento estructural en design.md → aplicar la tabla de clasificación:
- Función/método → UT (happy path + error)
- Componente UI → CT (render + edge)
- Integración → IT (flujo positivo)
- Endpoint REST → API (request válido + respuesta esperada)
- Skill SDDF → EV (happy-path + fail-fast)

Usar IDs secuenciales dentro de cada prefijo: `UT-001`, `UT-002`…; `IT-001`…

#### 5c. Casos adicionales desde tasks.md (si aplica)

Para cada tarea candidata del Paso 3b:
- Tarea tipo UT → agregar `UT-NNN` con Ref `T-NNN`
- Tarea tipo IT → agregar `IT-NNN` con Ref `T-NNN`

#### 5d. Verificar cobertura mínima

Para cada tipo de elemento en design.md, verificar que se generó la cobertura mínima definida en la tabla de clasificación. Si falta, agregar el caso faltante.

---

### Paso 6 — Completar template y guardar

Leer el template del Paso 4. Completar:
- Frontmatter: `type: testcases`, `id`, `slug`, `title`, `story`, `created`, `updated`
- Sección "Resumen de cobertura": tabla de conteo por tipo
- Sección "Tabla de casos": una fila por caso derivado en el Paso 5
- Sección "Notas de cobertura": mencionar si tasks.md fue usado, si algún AC no generó E2E, o si hay gaps detectados

Guardar en `{directorio_historia}/testcases.md`.

Si se usó `--force`, emitir: `[INFO] testcases.md sobreescrito con --force`

---

### Paso 7 — Confirmación (modo manual) / reporte (modo Agent)

**Modo manual:**
```
✅ testcases.md guardado: <ruta>

📋 Resumen:
   Historia: <FEAT-NNN> — <título>
   Casos generados: <N> total
   · UT: <N> | CT: <N> | IT: <N> | API: <N> | E2E: <N> | EV: <N>
   · Ref AC: <N> | Ref D: <N> | Ref T: <N>

Próximo paso: /story-analyze {story_id}
```

**Modo Agent:** guardar directamente y reportar al orquestador el número de casos generados.

---

## Manejo de errores

| Condición | Mensaje | Acción |
|-----------|---------|--------|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| Historia no encontrada | `❌ No se encontró la historia {story_id}` | Detener. Sugerir `/release-generate-stories` |
| `story.md` ausente | `❌ No se encontró story.md en: <ruta>` | Detener |
| `design.md` ausente | `❌ No se encontró design.md en: <ruta>` | Detener. Sugerir `/story-design` |
| `story.md` sin ACs o `design.md` vacío | `⚠️ Contenido insuficiente para derivar casos de prueba` | No generar testcases.md parcial. Sugerir completar artefactos |
| `tasks.md` ausente | — (sin mensaje) | Continuar sin enriquecimiento |
| `references_path` inexistente | `[WARN] referencias no encontradas para <name>` | Continuar con flujo genérico |
| Template no encontrado | — | Usar fallback interno. Informar al usuario |

---

## Template de Fallback

Usar solo si no se encontró ningún template externo en el Paso 4:

```markdown
---
type: testcases
id: {story_id}
slug: {story_slug}-testcases
title: "Test Cases: {story_title}"
story: {story_id}
created: {date}
updated: {date}
---

# Casos de Prueba: {story_title}

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | {count_ut} |
| IT   | {count_it} |
| E2E  | {count_e2e} |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| {id} | {tipo} | {escenario} | {dado} | {cuando} | {entonces} | {ref} |

## Notas de cobertura

{notas}
```
