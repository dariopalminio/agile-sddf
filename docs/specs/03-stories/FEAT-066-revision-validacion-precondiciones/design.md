---
alwaysApply: false
type: design
id: FEAT-066
slug: FEAT-066-validacion-precondiciones-revision-design
title: "Design: Skill story-code-review — validación de artefactos requeridos antes de revisar"
story: FEAT-066
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: IN-PROGRESS
related:
  - FEAT-066-validacion-precondiciones-revision
  - FEAT-064-revision-codigo-multi-agente
---

<!-- Referencias -->
[[FEAT-066-validacion-precondiciones-revision]]
[[FEAT-064-revision-codigo-multi-agente]]

## Context

Este diseño añade una comprobación de precondiciones al skill `story-code-review` definido en FEAT-064. El Paso 1 actual del skill solo verifica que `story.md` exista antes de actualizar el frontmatter y lanzar los agentes. FEAT-066 extiende esa verificación para cubrir también `design.md` e `implement-report.md`, con reporte completo de todos los faltantes y sin dejar efectos secundarios parciales cuando la validación falla.

**Relación con FEAT-064 y FEAT-065:**
- FEAT-064 define el flujo completo del happy path. Su Paso 1 actualiza el frontmatter de `story.md` a `CODE-REVIEW / IN-PROGRESS` tras verificar únicamente `story.md`.
- FEAT-065 define el flujo de bloqueantes (needs-changes → `fix-directives.md`).
- FEAT-066 modifica el Paso 1 de FEAT-064 para que la actualización del frontmatter solo ocurra después de que los tres artefactos requeridos estén presentes. No toca la lógica de FEAT-065.

**Contexto técnico detectado (heredado de FEAT-064):**
- Skills en `.claude/skills/{nombre}/SKILL.md` — orquestadores Markdown
- Convención de nombres: kebab-case
- Patrón de output de historia: `docs/specs/stories/FEAT-NNN/`
- Directorio temporal: `.tmp/story-code-review/`

---

## Goals / Non-Goals

**Goals:**
- Definir qué artefactos son requeridos y cuáles son opcionales para ejecutar el review // satisface: AC-1, AC-2
- Diseñar la secuencia de comprobación all-at-once que lista todos los faltantes en un solo mensaje // satisface: AC-2, NF-1
- Garantizar que ningún efecto secundario ocurre cuando la validación falla (sin frontmatter update, sin agentes, sin output) // satisface: AC-2
- Especificar el punto exacto dentro del Paso 1 de SKILL.md donde la validación se inserta // satisface: AC-1, AC-2

**Non-Goals:**
- Rediseñar el flujo happy path (FEAT-064) o el flujo de bloqueantes (FEAT-065)
- Validar el contenido de los artefactos (solo verifica existencia)
- Validar artefactos opcionales como precondición

---

## Decisions

### D-1: Punto de inserción dentro de SKILL.md // satisface: AC-1, AC-2

**Opción elegida:** La validación multi-artefacto se ejecuta dentro del Paso 1 de SKILL.md, inmediatamente después de resolver `$STORY_DIR` y antes de cualquier actualización de estado o efecto secundario.

La secuencia modificada queda:
```
Paso 1 — Resolver input
  1a. Resolver $STORY_DIR (por ID o ruta explícita)
  1b. Validar artefactos requeridos [FEAT-066] ← nuevo
      → Si alguno falta: mostrar error + detener
  1c. Actualizar frontmatter de story.md a CODE-REVIEW / IN-PROGRESS
  1d. Cargar contexto (story.md, design.md, tasks.md, constitution.md, definition-of-done-story.md)
```

Insertar la validación entre 1a y 1c garantiza que si falla, `story.md` no se modifica (no hay rastro en el frontmatter), `.tmp/` no se toca y ningún agente se lanza.

**Alternativas rechazadas:**
- Como Paso 0.5 independiente (antes del preflight de entorno): el preflight verifica el entorno del framework, no los artefactos de la historia; mezclar ambas responsabilidades en un solo paso viola P11 (cohesión).
- Como verificación dentro de cada agente por separado: cada agente detectaría su propio faltante y fallaría individualmente; viola NF-1 (todos los faltantes en una sola llamada) y podría dejar efectos parciales si un agente alcanza a escribir en `.tmp/` antes de fallar.

---

### D-2: Estrategia de comprobación — all-at-once vs. fail-fast // satisface: NF-1

**Opción elegida:** All-at-once: el validador comprueba los tres artefactos requeridos (`story.md`, `design.md`, `implement-report.md`) en una sola pasada, acumula todos los faltantes y emite el mensaje de error una sola vez.

Esta estrategia satisface directamente NF-1: el desarrollador recibe la lista completa en una llamada y puede resolver todas las ausencias antes de reintentar.

**Alternativas rechazadas:**
- Fail-fast (detener al primer faltante): requeriría al menos tantas iteraciones como artefactos faltan, violando NF-1.
- Comprobación lazy (verificar cada artefacto justo antes de usarlo): introduce fallos silenciosos en pasos tardíos del skill, potencialmente después de efectos secundarios ya realizados; viola AC-2 ("sin output parcial").

---

### D-3: Formato del mensaje de error // satisface: AC-2, NF-1

**Opción elegida:** Mensaje estructurado con línea cabecera + lista de faltantes + instrucción de corrección, todo en una sola salida:

```
❌ Artefactos requeridos no encontrados en: docs/specs/stories/FEAT-NNN/

   Faltantes:
   · story.md
   · implement-report.md

Completa los artefactos faltantes y vuelve a ejecutar /story-code-review FEAT-NNN.
```

El path de la historia se incluye en la cabecera para permitir diagnóstico rápido en entornos con múltiples historias activas. Los artefactos faltantes se listan como viñetas independientes para facilitar la lectura y la acción.

**Alternativas rechazadas:**
- Mensaje de una sola línea (ej. `❌ Faltan: story.md, implement-report.md`): funcional pero dificulta la lectura cuando faltan tres archivos; no incluye la ruta para diagnóstico.
- Emitir un mensaje por archivo faltante en llamadas separadas: viola NF-1 explícitamente.

---

### D-4: Artefactos requeridos vs. opcionales // satisface: AC-1, AC-2

**Opción elegida:**

| Artefacto | Categoría | Razón |
|---|---|---|
| `story.md` | Requerido | Fuente de criterios de aceptación — sin él, el Product-Owner-Reviewer no puede operar |
| `design.md` | Requerido | Fuente de arquitectura esperada — sin él, el Integration-Reviewer no puede operar |
| `implement-report.md` | Requerido | Evidencia de implementación — sin él, ningún agente tiene qué revisar |
| `tasks.md` | Opcional | El Tech-Lead-Reviewer puede revisar calidad de código sin lista de tareas |
| `constitution.md` | Opcional | Mejora la revisión pero no la bloquea si no existe (ya tiene su propio aviso en FEAT-064 Paso 2) |
| `definition-of-done-story.md` | Opcional | Mismo caso que `constitution.md` |

La validación de FEAT-066 solo cubre los tres requeridos. Los opcionales se cargan con `if exists` sin generar error (comportamiento heredado de FEAT-064).

**Alternativas rechazadas:**
- Incluir `tasks.md` como requerido: el skill puede producir un review de calidad sin él; hacerlo requerido bloquearía casos válidos donde la historia fue implementada sin planificación formal.
- Hacer todos opcionales con advertencia: desvirtúa el concepto de quality gate; un review sin `implement-report.md` no tiene objeto.

---

### D-5: Efecto sobre el estado de story.md cuando la validación falla // satisface: AC-2

**Opción elegida:** Si la validación falla, el frontmatter de `story.md` NO se modifica. El skill muestra el error y termina sin alterar ningún archivo.

Esta decisión es consecuencia directa de D-1 (la validación precede a la actualización del frontmatter). El estado de `story.md` permanece tal cual (ej. `READY-FOR-CODE-REVIEW / DONE` si viene del flujo normal de `story-implement`).

**Alternativas rechazadas:**
- Actualizar frontmatter a `CODE-REVIEW / BLOCKED` antes de mostrar el error: introduce un estado nuevo no definido en el ciclo de vida del pipeline; añade complejidad y requiere que el desarrollador limpie el estado manualmente antes de reintentar.

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| El desarrollador crea `implement-report.md` vacío para pasar la validación | La validación solo comprueba existencia, no contenido; el comportamiento ante un report vacío es responsabilidad de los agentes revisores (fuera de scope de FEAT-066) |
| Cambio en la lista de artefactos requeridos en el futuro → SKILL.md hardcodeado | La lista de artefactos requeridos se define en una sección explícita de SKILL.md (`## Artefactos requeridos`) para que sea fácil de localizar y actualizar sin buscar en el cuerpo del Paso 1 |

---

## Open Questions

Sin preguntas abiertas. El diseño cubre los dos ACs y el NF de FEAT-066.

---

## Registro de Cambios (CR)

Sin CRs detectados.
