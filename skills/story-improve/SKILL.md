---
name: story-improve
description: >-
  Aplica recomendaciones FINVEST (score ≤ 3) sobre story.md, generando backup y log de cambios.
  Usar para corregir una historia con decisión REFINAR o RECHAZAR.
  Invocar para "mejorar historia", "aplicar recomendaciones FINVEST" o "story-improve".
triggers:
  - "/story-improve"
  - "mejorar historia desde reporte"
  - "aplicar recomendaciones FINVEST"
  - "story-improve --story-id"
inputs:
  - "finvest-evaluation-report.md — reporte FINVEST de la historia objetivo"
  - "story.md — historia de usuario a mejorar"
outputs:
  - "story.md — historia mejorada con las dimensiones corregidas"
  - "story.md.bak — backup del contenido original antes de la mejora"
  - "story-improvement-log.md — log de cambios con dimensiones afectadas y recomendaciones aplicadas"
flags:
  - "--story-id <STORY-NNN>: ID de la historia a mejorar (obligatorio)"
---

# Skill: `/story-improve`

**Cuándo usar este skill:**
- Cuando una historia tiene `decision: REFINAR` o `decision: RECHAZAR` en su `finvest-evaluation-report.md` y se quiere mejorar automáticamente siguiendo las recomendaciones del reporte.
- Cuando el usuario dice "mejorar historia STORY-NNN", "aplicar recomendaciones del reporte FINVEST", "story-improve".
- Cuando se quiere reducir el número de ciclos manuales de refinamiento antes de volver a ejecutar `/story-evaluation`.

## Objetivo

Lee el reporte FINVEST de la historia y aplica las recomendaciones de cada dimensión con score ≤ 3 directamente sobre `story.md`, preservando el original en `story.md.bak` y documentando los cambios en `story-improvement-log.md`.

**Qué hace este skill:**
- Extrae `decision:`, tabla de scores y sección "Comentarios y Recomendaciones" del reporte FINVEST
- Verifica el gate de decisión: si `decision: APROBADA`, informa y termina sin modificar ningún archivo
- Lee `story.md` completa (frontmatter, Como/Quiero/Para, criterios Gherkin)
- Carga historias hermanas condicionalmente (solo si dimensión I tiene score ≤ 3) para contextualizar independencia
- Crea `story.md.bak` con el contenido original antes de cualquier escritura
- Aplica mínimo 1 mejora concreta por cada dimensión con score ≤ 3, usando la recomendación del reporte como guía semántica
- Escribe `story.md` mejorada (actualiza solo el campo `updated:` del frontmatter)
- Genera `story-improvement-log.md` usando `assets/improvement-log-template.md` como fuente de verdad dinámica
- Muestra resumen en consola con dimensiones mejoradas y archivos generados

**Qué NO hace este skill:**
- Modificar `finvest-evaluation-report.md` (solo lectura)
- Modificar historias hermanas ni la épica padre
- Ejecutar `/story-evaluation` automáticamente tras la mejora
- Crear o modificar artefactos de planning (`design.md`, `tasks.md`, `analyze.md`)

## Entrada

| Artefacto | Ubicación | Requerido |
|---|---|---|
| `finvest-evaluation-report.md` | `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/finvest-evaluation-report.md` | ✓ obligatorio |
| `story.md` | `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story.md` | ✓ obligatorio |
| `assets/improvement-log-template.md` | `$CLI_ROOT/skills/story-improve/assets/improvement-log-template.md` | ✓ obligatorio |

## Parámetros

- `--story-id <STORY-NNN>`: ID de la historia a mejorar (ej. `STORY-075`). Obligatorio.

## Precondiciones

- La historia identificada por `--story-id` existe bajo `$SPECS_BASE/specs/03-stories/`
- El directorio de la historia contiene `finvest-evaluation-report.md` con frontmatter YAML válido
- El directorio de la historia contiene `story.md`
- `skill-preflight` retorna estado OK (entorno válido)

## Dependencias

- Skills: [`skill-preflight`]
- Templates: [`assets/improvement-log-template.md`]

## Modos de ejecución

- **Manual**: `/story-improve --story-id <STORY-NNN>` — interactivo, muestra progreso en tiempo real
- **Automático**: invocado por orquestador — reporta resultado al finalizar sin interacción adicional

## Restricciones / Reglas

- **Nunca modificar el reporte:** `finvest-evaluation-report.md` es solo lectura en todo el flujo
- **Siempre crear backup primero:** `story.md.bak` debe escribirse antes de cualquier modificación a `story.md`
- **Idempotencia del backup:** si `story.md.bak` ya existe de una ejecución anterior, sobreescribirlo con el contenido actual de `story.md` antes de aplicar nuevos cambios
- **Cobertura mínima:** aplicar al menos 1 mejora concreta por cada dimensión con score ≤ 3
- **Guía semántica, no reemplazo mecánico:** las recomendaciones del reporte se usan como guía para comprender qué mejorar; los cambios requieren comprensión del contexto, no sustitución literal de texto
- **Revisión integral antes de escribir:** revisar todas las dimensiones con score ≤ 3 en un único ciclo antes de escribir `story.md`; no escribir cambios parciales por dimensión
- **Preservar intención original:** aplicar el mínimo cambio necesario para satisfacer la recomendación; no reescribir secciones válidas
- **Gate APROBADA es definitivo:** si `decision: APROBADA`, terminar inmediatamente sin escribir ningún archivo
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.
  
---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Resolver parámetros de entrada

#### 1a. Verificar que se proporcionó `--story-id`

Si no se proporcionó ningún argumento, preguntar:
```
¿Qué historia deseas mejorar?
Proporciona el ID (ej. STORY-075).
```

#### 1b. Resolver directorio de la historia

Buscar el directorio usando Glob con el patrón:
```
$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story.md
```
Extraer el directorio padre de la primera coincidencia cuyo nombre comienza con el ID.

**Si no se encuentra:**
```
❌ No se encontró la historia <STORY-NNN> bajo $SPECS_BASE/specs/03-stories/
Verifica el ID o ejecuta /epic-generate-stories para generar la historia.
```
Detener la ejecución.

#### 1c. Verificar existencia de artefactos obligatorios

Verificar que el directorio contiene:
- `story.md` — historia a mejorar
- `finvest-evaluation-report.md` — reporte FINVEST

**Si falta `finvest-evaluation-report.md`:**
```
❌ No se encontró finvest-evaluation-report.md en: <ruta>
La historia debe tener un reporte FINVEST antes de ejecutar story-improve.
Sugerencia: ejecuta /story-evaluation <STORY-NNN> para generar el reporte.
```
Detener la ejecución.

**Si falta `story.md`:**
```
❌ No se encontró story.md en: <ruta>
```
Detener la ejecución.

---

### Paso 2 — Leer `finvest-evaluation-report.md`

Leer el archivo `finvest-evaluation-report.md` del directorio de la historia.

Extraer y registrar internamente:

1. **Frontmatter YAML:**
   - `decision:` → valor `APROBADA | REFINAR | RECHAZAR | DIVIDIR`
   - `finvest-score:` → score global

2. **Tabla de scores del cuerpo Markdown:**
   Buscar la tabla con columnas `Dimensión | Score` (puede llamarse "Resumen de scores" u equivalente).
   Construir el mapeo: `{ dimensión → score }` para todas las dimensiones presentes.
   Ejemplo: `{ "I": 2, "N": 4, "V": 4, "E": 3, "S": 3, "T": 5 }`

3. **Sección "Comentarios y Recomendaciones":**
   Buscar la sección `## Comentarios y Recomendaciones` o `## Recomendaciones` o equivalente.
   Para cada subsección `### <dimensión>`, extraer el texto de recomendación.
   Construir el mapeo: `{ dimensión → texto_recomendación }`

#### Gate de decisión APROBADA

Si `decision: APROBADA`:
```
ℹ️ <STORY-NNN> ya tiene decisión APROBADA — no se realizan cambios
```
Terminar la ejecución sin escribir ni modificar ningún archivo.

Si `decision: REFINAR` o `decision: RECHAZAR` o `decision: DIVIDIR`, continuar al Paso 3.

---

### Paso 3 — Leer `story.md` actual

Leer el contenido completo de `story.md`.

Extraer y registrar internamente:
- Frontmatter YAML completo (incluyendo `updated:`)
- Sección `Como/Quiero/Para` (historia de usuario)
- Criterios de aceptación (escenarios Gherkin)
- Notas y contexto adicional

Este contenido es la base sobre la que se aplicarán las mejoras en el Paso 6.

---

### Paso 4 — Cargar contexto de historias hermanas (condicional)

**Solo ejecutar si la dimensión I tiene score ≤ 3** en el mapeo del Paso 2.

Si I tiene score ≤ 3:
1. Leer el frontmatter de `story.md` para obtener `parent:` y `related:`
2. Buscar historias en `$SPECS_BASE/specs/03-stories/` con el mismo `parent:` o con IDs que aparezcan en `related:`
3. Leer el frontmatter y la sección `Como/Quiero/Para` de cada historia hermana encontrada
4. Registrar internamente qué funcionalidades ya están cubiertas por las hermanas para evitar introducir dependencias redundantes

Este contexto es **solo lectura** — nunca modificar las historias hermanas.

Si I tiene score > 3: omitir este paso.

---

### Paso 5 — Crear `story.md.bak`

Antes de cualquier escritura sobre `story.md`:

1. Si `story.md.bak` **no existe**: crear el archivo con el contenido actual de `story.md`
2. Si `story.md.bak` **ya existe**: sobreescribirlo con el contenido actual de `story.md` (idempotencia — el backup siempre refleja el estado inmediatamente anterior a la última mejora)

Confirmar:
```
✓ Backup creado: story.md.bak
```

---

### Paso 6 — Aplicar mejoras por dimensión

Identificar las dimensiones con score ≤ 3 del mapeo construido en el Paso 2.

Para cada dimensión con score ≤ 3 que tenga recomendación explícita en el reporte:
- Leer la recomendación correspondiente del mapeo `{ dimensión → texto_recomendación }`
- Aplicar la recomendación como guía semántica para mejorar la sección relevante de `story.md`:

| Dimensión | Sección típica de `story.md` a mejorar |
|---|---|
| I – Independencia | Notas / contexto adicional: reducir o desacoplar dependencias; añadir cómo simular con stubs |
| N – Negociable | Historia Como/Quiero/Para: reformular para documentar qué/para qué sin prescribir implementación |
| V – Valiosa | Para (beneficio): clarificar el valor de negocio con métrica observable |
| E – Estimable | Notas / contexto adicional: añadir schema mínimo, alcance, o spike previo que reduce incertidumbre |
| S – Small | Criterios de aceptación: reducir escenarios; si S ≤ 2, considerar notificar que la historia debería dividirse |
| T – Testeable | Criterios Gherkin: añadir valores concretos, Scenario Outline con tabla Ejemplos, pasos más específicos |

**Reglas de aplicación:**
- Aplicar mínimo 1 mejora concreta por cada dimensión con score ≤ 3
- Aplicar el mínimo cambio necesario para satisfacer la recomendación; preservar la intención original
- Si la dimensión I tiene score ≤ 3, usar el contexto de hermanas cargado en el Paso 4 para verificar que la mejora no introduce dependencias ya resueltas por otras historias
- Revisar todas las dimensiones en un único ciclo antes de escribir — no escribir cambios parciales

Registrar internamente para cada dimensión mejorada:
- `recomendación_aplicada:` texto del reporte
- `cambio_realizado:` descripción concreta del cambio aplicado en `story.md`

---

### Paso 7 — Escribir `story.md` mejorada

Escribir el contenido mejorado sobre `story.md`:
- Mantener todos los campos del frontmatter intactos **excepto** `updated:`, que se actualiza a la fecha actual (YYYY-MM-DD)
- El cuerpo de la historia incluye todas las mejoras aplicadas en el Paso 6
- No añadir comentarios ni marcadores de "mejora aplicada" dentro del texto — el log en `story-improvement-log.md` es el registro externo

Confirmar:
```
✓ story.md actualizado con mejoras en dimensiones: <lista de dimensiones mejoradas>
```

---

### Paso 8 — Generar `story-improvement-log.md`

Leer el template `assets/improvement-log-template.md` como fuente de verdad dinámica para la estructura del log.

Completar el template con los datos registrados en el Paso 6:
- Rellenar el frontmatter YAML del log: `story-id:`, `improved:` (fecha actual), `dimensions-improved:` (lista), `previous-score:` (valor de `finvest-score:` del reporte)
- Para cada dimensión mejorada, completar la subsección correspondiente con:
  - `**Recomendación aplicada:**` texto extraído del reporte
  - `**Cambio realizado:**` descripción concreta del cambio en `story.md`

Escribir el resultado en `<directorio-historia>/story-improvement-log.md`.

Confirmar:
```
✓ Log generado: story-improvement-log.md
```

---

### Paso 9 — Mostrar resumen en consola

```
──────────────────────────────────────────────────
 story-improve: <STORY-NNN>
──────────────────────────────────────────────────
 Decisión previa:    REFINAR (FINVEST <score>)
 Dimensiones mejoradas: <lista ej. I, E>
──────────────────────────────────────────────────
 Archivos generados / modificados:
   ✓ story.md.bak     — backup del original
   ✓ story.md         — historia mejorada
   ✓ story-improvement-log.md — log de cambios
──────────────────────────────────────────────────
 Siguiente paso: ejecuta /story-evaluation <STORY-NNN>
 para verificar si la historia supera el umbral APROBADA.
──────────────────────────────────────────────────
```

---

## Non-Goals

- **No ejecutar `/story-evaluation` automáticamente:** la re-evaluación tras la mejora es responsabilidad del usuario (puede invocarse manualmente); fuera de scope de esta historia
- **No modificar historias hermanas:** el contexto de hermanas cargado en el Paso 4 es solo lectura
- **No modificar `finvest-evaluation-report.md`:** el reporte es solo entrada; nunca se escribe
- **No crear artefactos de planning:** `design.md`, `tasks.md` y `analyze.md` no se tocan

---

## Salida

| Artefacto | Ubicación | Condición |
|---|---|---|
| `story.md` | `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story.md` | Siempre (cuando decision ≠ APROBADA) |
| `story.md.bak` | `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story.md.bak` | Siempre (cuando decision ≠ APROBADA) |
| `story-improvement-log.md` | `$SPECS_BASE/specs/03-stories/<STORY-NNN>-*/story-improvement-log.md` | Siempre (cuando decision ≠ APROBADA) |

Cuando `decision: APROBADA`: ningún archivo se crea ni modifica.
