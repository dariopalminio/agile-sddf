---
alwaysApply: false
type: design
id: FEAT-065
slug: FEAT-065-revision-con-bloqueantes-design
title: "Design: Skill story-code-review — instrucciones de corrección cuando la revisión detecta bloqueantes"
story: FEAT-065
created: 2026-05-09
updated: 2026-05-09
status: PLANNING
substatus: IN-PROGRESS
related:
  - FEAT-065-revision-con-bloqueantes
  - FEAT-064-revision-codigo-multi-agente
---

<!-- Referencias -->
[[FEAT-065-revision-con-bloqueantes]]
[[FEAT-064-revision-codigo-multi-agente]]

## Context

Este diseño extiende el skill `story-code-review` definido en FEAT-064 para cubrir el flujo de revisión con bloqueantes: cuando el árbitro determina `review-status: needs-changes` (al menos un hallazgo de severidad HIGH o MEDIUM), el skill debe generar `fix-directives.md` con instrucciones concretas de corrección y garantizar que `story.md` permanezca en `status: IMPLEMENTING / substatus: IN-PROGRESS`.

**Relación con FEAT-064:**
- FEAT-064 diseñó el happy path (review aprobado → `code-review-report.md` → story.md pasa a READY-FOR-VERIFY).
- FEAT-065 diseña el flujo alternativo (needs-changes → `fix-directives.md` → story.md permanece en IMPLEMENTING).
- El árbitro y la regla de consolidación (`max_severity ∈ {HIGH, MEDIUM} → needs-changes`) ya están definidos en D-3 de FEAT-064. Este diseño solo amplía el comportamiento post-árbitro cuando el resultado es `needs-changes`.

**Contexto técnico detectado (heredado de FEAT-064):**
- Skills en `.claude/skills/{nombre}/SKILL.md` — orquestadores Markdown
- Agentes locales al skill en `.claude/skills/{nombre}/agents/`
- Convención de nombres: kebab-case
- Templates en `docs/specs/templates/` y en `assets/` del skill — fuente de verdad de estructura de output
- Patrón de output de historia: `docs/specs/stories/FEAT-NNN/`
- Directorio temporal de trabajo: `.tmp/story-code-review/`

---

## Goals / Non-Goals

**Goals:**
- Definir cómo el árbitro en `SKILL.md` genera `fix-directives.md` cuando `review-status = needs-changes` // satisface: AC-1, AC-2
- Especificar el formato y contenido de `fix-directives.md` con trazabilidad a hallazgos // satisface: AC-1, NF-1
- Definir la lista blanca de archivos permitidos para modificar // satisface: AC-1
- Garantizar que `story.md` no avanza de estado cuando hay bloqueantes // satisface: AC-1
- Asegurar idempotencia: mismos hallazgos → mismo `fix-directives.md` // satisface: NF-2

**Non-Goals:**
- Rediseñar la lógica del árbitro ni los agentes revisores (definidos en FEAT-064)
- Diseñar la validación de precondiciones antes de ejecutar el review (FEAT-066)
- Implementar el flujo de corrección iterativa (aplicar las directivas y re-ejecutar el review)

---

## Decisions

### D-1: Dónde vive la lógica de generación de fix-directives // satisface: AC-1, AC-2

**Opción elegida:** En `SKILL.md` (el orquestador/árbitro), como extensión del bloque post-árbitro de FEAT-064.

El árbitro ya lee los tres informes parciales de `.tmp/story-code-review/` y calcula `review-status`. Cuando `review-status = needs-changes`, el mismo bloque (árbitro) invoca la generación de `fix-directives.md`. No se crea ningún agente adicional porque la tarea es transformación de datos (hallazgos → instrucciones), no análisis de dominio.

```
SKILL.md (orquestador)
  ├── [paralelo] tech-lead-reviewer.agent.md  → .tmp/.../tech-lead-report.md
  ├── [paralelo] product-owner-reviewer.agent.md → .tmp/.../product-owner-report.md
  ├── [paralelo] integration-reviewer.agent.md → .tmp/.../integration-report.md
  └── [árbitro, secuencial]
        ├── review-status = approved → code-review-report.md + story.md → READY-FOR-VERIFY (FEAT-064)
        └── review-status = needs-changes → fix-directives.md + story.md PERMANECE en IMPLEMENTING (FEAT-065)
```

**Alternativas rechazadas:**
- Agente `fix-director.agent.md` separado: agrega un nivel de indirección para una tarea que es solo templating de los hallazgos ya consolidados; viola P12 (KISS/YAGNI) y añade complejidad sin justificación.
- Generar `fix-directives.md` en un skill independiente: rompe la secuencia atómica del review; el desarrollador tendría que invocar dos comandos para obtener el resultado del review con bloqueantes.

---

### D-2: Estructura y contenido de fix-directives.md // satisface: AC-1, NF-1, NF-2

**Opción elegida:** Template en `assets/fix-directives-template.md`, leído en runtime por el árbitro (fuente de verdad dinámica — Principio 5 de constitution.md).

**Formato del documento generado:**

```markdown
---
type: fix-directives
story: FEAT-NNN
review-status: needs-changes
date: YYYY-MM-DD
max-severity: HIGH | MEDIUM
based-on: code-review-report.md
---

# Fix Directives: FEAT-NNN

## Resumen de bloqueantes
- **Story:** FEAT-NNN — título
- **Review status:** needs-changes
- **Severidad máxima:** HIGH | MEDIUM
- **Total de hallazgos bloqueantes:** N

## Instrucciones de corrección

| # | Archivo:Línea | Dimensión | Severidad | Hallazgo | Acción requerida |
|---|---------------|-----------|-----------|----------|-----------------|
| 1 | path/file.ts:42 | code-quality | HIGH | descripción exacta | acción concreta |
| 2 | path/file.ts:10 | requirements-coverage | MEDIUM | descripción exacta | acción concreta |

## Lista blanca de archivos permitidos para modificar

Los siguientes archivos pueden ser modificados al aplicar las correcciones:
- `path/file.ts` (hallazgo #1, #2)
- `path/other-file.ts` (hallazgo #3)

No deben modificarse archivos fuera de esta lista sin previa aprobación.

## Ciclo de corrección

1. Aplica las correcciones indicadas en la tabla de instrucciones.
2. Limita los cambios a los archivos de la lista blanca.
3. Re-ejecuta `/story-code-review FEAT-NNN`.
4. Si el resultado es `approved`, la historia avanza a READY-FOR-VERIFY.
```

**Alternativas rechazadas:**
- Documento en texto libre sin tabla estructurada: viola NF-1 (trazabilidad a archivo:línea) y dificulta el procesamiento automatizado.
- Incluir `fix-directives.md` dentro de `code-review-report.md`: mezcla el diagnóstico con las directivas; los documentos tienen audiencias distintas (árbitro vs. desarrollador).

---

### D-3: Construcción de la lista blanca de archivos // satisface: AC-1, NF-1

**Opción elegida:** La lista blanca se construye dinámicamente a partir de las rutas `Archivo:Línea` presentes en los hallazgos de severidad HIGH o MEDIUM de los informes parciales.

Algoritmo:
1. Leer los tres informes de `.tmp/story-code-review/`
2. Filtrar hallazgos con `Severidad ∈ {HIGH, MEDIUM}`
3. Extraer la columna `Archivo:Línea` de cada hallazgo → tomar solo la parte de archivo (antes de `:`)
4. Deduplicar las rutas → lista blanca

Cada archivo de la lista blanca anota qué hallazgo(s) lo referencian (`hallazgo #N, #M`).

**Alternativas rechazadas:**
- Lista blanca manual definida por el desarrollador: no puede derivarse automáticamente ni garantizarse idempotencia (NF-2).
- Incluir todos los archivos mencionados en `tasks.md`: el scope es más amplio que los archivos con problemas; el desarrollador podría modificar archivos sin relación con los hallazgos.

---

### D-4: Comportamiento de story.md cuando hay bloqueantes // satisface: AC-1

**Opción elegida:** El árbitro NO actualiza `story.md` cuando `review-status = needs-changes`. El frontmatter permanece tal cual (status: IMPLEMENTING, substatus: IN-PROGRESS).

Esta decisión es consistente con D-6 de FEAT-064: la actualización de `story.md` solo ocurre cuando `review-status = approved`. El comportamiento "permanece en IMPLEMENTING" es el comportamiento por defecto del skill cuando no hay aprobación.

El árbitro registra en la salida del skill:
```
⚠️ Review: needs-changes — story.md permanece en IMPLEMENT/IN-PROGRESS
→ Revisa: docs/specs/stories/FEAT-NNN/fix-directives.md
```

**Alternativas rechazadas:**
- Actualizar story.md a `status: NEEDS-CHANGES / substatus: IN-PROGRESS`: introduce un nuevo estado en el ciclo de vida del pipeline que no está definido en constitution.md; agrega complejidad sin beneficio sobre "permanecer en IMPLEMENTING".
- Actualizar `substatus: REJECTED`: semánticamente incorrecto; la historia no está bloqueada por dependencias externas, sino por hallazgos de revisión propios.

---

### D-5: Idempotencia de fix-directives.md // satisface: NF-2

**Opción elegida:** Si `fix-directives.md` ya existe, el árbitro lo sobrescribe incondicionalmente cuando `review-status = needs-changes`.

La idempotencia se garantiza porque el contenido de `fix-directives.md` se deriva determinísticamente de los informes parciales en `.tmp/story-code-review/`, los cuales a su vez se derivan del código fuente. Mismos hallazgos → mismo `fix-directives.md`.

El directorio `.tmp/story-code-review/` se limpia al inicio de cada ejecución del skill (heredado de D-3 FEAT-064 — NF-2 idempotencia), por lo que no pueden acumularse informes de ejecuciones anteriores.

**Alternativas rechazadas:**
- Preguntar al usuario si desea sobreescribir: interrumpe el flujo automatizado; el documento refleja el estado actual del review, no tiene valor histórico propio (el historial está en git).

---

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Hallazgo en informe parcial sin `Archivo:Línea` → lista blanca incompleta | El árbitro valida que cada hallazgo tenga `Archivo:Línea`; si falta, registra el hallazgo sin archivo y lo señala en `fix-directives.md` con `[archivo no especificado]` |
| El desarrollador modifica archivos fuera de la lista blanca → el siguiente review detecta cambios inesperados | La lista blanca es informativa, no técnicamente restrictiva; su enforcement es responsabilidad del revisor humano o de FEAT-066 |
| `fix-directives.md` creado en una revisión anterior sigue presente cuando el re-review retorna `approved` | Cuando review-status = `approved`, el árbitro elimina `fix-directives.md` (si existe) antes de escribir `code-review-report.md`, dejando el directorio limpio |
| Muchos hallazgos generan una tabla larga → documento poco accionable | No se limita el número de hallazgos; el árbitro los incluye todos; la accionabilidad es responsabilidad de los agentes revisores (que deben ser específicos en sus instrucciones) |

---

## Open Questions

Sin preguntas abiertas. El diseño cubre todos los ACs de FEAT-065. Los flujos de precondiciones (FEAT-066) tienen diseño separado.

---

## Registro de Cambios (CR)

Sin CRs detectados.
