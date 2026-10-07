---
type: story
id: STORY-103
slug: STORY-103-replace-the-epic-template
title: "Reemplazar el template de Epic por la versión minimalista y output-oriented"
status: IMPLEMENT
substatus: IN-PROGRESS
kind: feat
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-09-27
updated: 2026-10-06
related: 
  - EPIC-21-colapsar-specs-dos-niveles
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]

# 📖 Historia: Reemplazar el template de Epic por la versión minimalista y output-oriented

**Como** mantenedor del framework SDDF  
**Quiero** reemplazar el template actual de Epic (`docs/templates/epic-template.md`) por una versión minimalista, output-oriented y viva, alineada con el template de Story refinado,  
**Para** que los Epics sean artefactos que evolucionan con las Stories, sin secciones que queden vacías en la mayoría de casos, con trazabilidad explícita desde el estado "sin ID" hasta "completada", y con smoke tests numerados referenciables desde runbooks y pipelines.

---

## ✅ Criterios de aceptación

### AC-1 — Template reducido a cinco secciones

```gherkin
Dado el archivo `docs/templates/epic-template.md`
Cuando se reemplaza su contenido por la versión nueva
Entonces contiene exactamente las secciones:
  · Alcance
  · Historias
  · Criterios de salida
  · Smoke tests
  · Notas
 Y no contiene las secciones eliminadas:
  · Descripción
  · Criterios de éxito
  · Requerimiento
  · Impacto en Procesos Claves
  · Dependencias Críticas
  · Riesgos
  · Fuera de alcance
  · Notas adicionales
```

### AC-2 — Sección "Alcance" reemplaza a "Descripción"

```gherkin
Dado el template nuevo
Cuando un autor lo copia para crear un Epic
Entonces la primera sección se titula "Alcance"
 Y el comentario guía indica que se describe el output (qué se construye),
   no el valor de negocio (que vive en `product/vision.md` o `requirements/`)
```

### AC-3 — Sección "Historias" con tres formatos de vinculación

```gherkin
Dado el template nuevo
Cuando un autor lista las historias del Epic
Entonces el template documenta tres formatos:
  · "[Nombre]: [desc]"                     → planificada, aún sin ID
  · "- [ ] **STORY-NNN** — [Nombre]: [desc]" → creada, con ID
  · "- [x] **STORY-NNN** — [Nombre]: [desc]" → completada
 Y el ejemplo por defecto usa el primer formato (sin ID)
 Y el comentario guía explica cuándo aplicar cada formato
```

### AC-4 — Sección "Criterios de salida" reemplaza a "Criterios de éxito"

```gherkin
Dado el template nuevo
Cuando un autor define cuándo la épica está terminada
Entonces la sección se titula "Criterios de salida"
 Y el comentario guía indica que son criterios técnicos verificables,
   no criterios de éxito de negocio
```

### AC-5 — Smoke tests numerados con `SMOKE-N` y formato gherkin unificado

```gherkin
Dado el template nuevo
Cuando un autor define los smoke tests del Epic
Entonces cada escenario se titula "### SMOKE-N — [nombre descriptivo]"
 Y el cuerpo usa un bloque gherkin con "Escenario:", "Dado", "Cuando", "Entonces"
 Y el comentario guía explica la regla de no-renumerar
 Y si el Epic tiene un solo smoke test, la numeración es opcional
```

### AC-6 — Sección "Notas" soporta la evolución del Epic

```gherkin
Dado el template nuevo
Cuando un autor necesita registrar decisiones emergentes, cambios de alcance o acuerdos
Entonces la sección "Notas" existe al final del template
 Y el comentario guía indica que es opcional y que se rellena conforme aparezcan cambios
```

### AC-7 — Frontmatter simplificado

```gherkin
Dado el template nuevo
Cuando se inspecciona su frontmatter
Entonces contiene los campos mínimos:
  · type: epic
  · id: <EPIC-NN>
  · slug: <slug>
  · title: "<título>"
  · status: DEFINE
  · substatus: IN-PROGRESS
  · parent: null
  · created: <YYYY-MM-DD>
  · updated: <YYYY-MM-DD>
 Y no contiene `implements`, `deliveryModel` ni `children`
 Y el estado inicial es `DEFINE` (no `<ESTADO_INICIAL>`)
```

### AC-8 — Genera Epics desde `project-plan.md`

```gherkin
Dado el skill `epic-from-project-plan`
Cuando genera Epics desde `project-plan.md`
Entonces usa el template nuevo
 Y los Epics generados pasan la validación de formato
```

### AC-9 — Skills que editan el Epic actualizados

```gherkin
Dado el skill `epic-generate-stories`
Cuando asigna IDs a las historias planificadas
Entonces transforma el formato "[Nombre]: [desc]" al formato "- [ ] **STORY-NNN** — [Nombre]: [desc]"
 Y no modifica otras secciones del Epic

Dado el skill `epic-generate-all-stories`
Cuando procesa múltiples Epics
Entonces aplica la misma transformación de formato

Dado el skill `story-implement`
Cuando completa una Story
Entonces marca la línea correspondiente en la sección "Historias" del Epic padre como "- [x] **STORY-NNN** — [Nombre]: [desc]"
```

### AC-10 — Epics existentes migrados

```gherkin
Dado un repositorio con Epics existentes en `docs/specs/02-epics/EPIC-NNN-*/epic.md`
Cuando se ejecuta la migración
Entonces cada Epic existente se actualiza al nuevo formato:
  · "Descripción" → "Alcance"
  · "Criterios de éxito" → "Criterios de salida"
  · Smoke tests renumerados como "SMOKE-N"
  · Secciones situacionales movidas a "Notas" o eliminadas si están vacías
  · Gherkin unificado al formato con bloque `gherkin`
 Y el contenido semántico se preserva (no se pierde información)
 Y la migración es idempotente (ejecutarla dos veces no duplica cambios)
```

### AC-11 — Skill de validación de formato de Epic actualizado

```gherkin
Dado el skill de guardrail `epic-format-validation`
Cuando valida un `epic.md`
Entonces verifica la presencia de las cinco secciones obligatorias
 Y verifica que la sección "Historias" usa uno de los tres formatos válidos
 Y verifica que los smoke tests siguen el patrón "### SMOKE-N — [nombre]"
 Y falla con un mensaje accionable si falta cualquier elemento
```

---

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Token efficiency:** el template nuevo debe ocupar ≤ 40 líneas (vs. ~60 del actual), reduciendo el coste de carga en cada Epic generado.
- **CNF-2 — Documentación:** actualizar `docs/domains/domain-epic-lifecycle.md` (sección de estados y secciones del Epic), `docs/templates/README.md` (si existe) y `docs/guides/how-to-write-epics.md` (si existe).
- **CNF-3 — CHANGELOG:** registrar el cambio como `Changed` en `[Unreleased]`.
- **CNF-4 — Compatibilidad:** la historia se publica con EPIC-21 en 4.0.0, así que el formato anterior se retira en esa major (breaking change) sin compatibilidad en tiempo de ejecución. A cambio, la migración es automática (`/memory-system migrate --from=epic-template-v1`) y los skills que reciben una épica en el formato anterior responden con un mensaje que nombra ese comando.
- **CNF-5 — Convención de guion:** ASCII U+002D `-` en todos los slugs y IDs.

---

## 🚫 Fuera de alcance

- Cambios en el template de Story (`story-template.md`) — ya tiene su propia historia.
- Cambios en el template de Project (`project-template.md`, `project-intent-template.md`, `project-plan-template.md`).
- Modificación de la máquina de estados del Epic (`domain-epic-lifecycle.md`).
- Traducción del template a otros idiomas.
- Creación de un nuevo guardrail de DoD para Epic (se abordará en otra historia si aplica).

---

## 📎 Notas / mapa de implementación

| Archivo | Cambio |
|---------|--------|
| `docs/templates/epic-template.md` | Reemplazar por la versión minimalista output-oriented. |
| `skills/epic-format-validation/SKILL.md` | Actualizar reglas de validación para las cinco secciones. |
| `.claude/skills/epic-creation/SKILL.md` | Referenciar el template nuevo; ajustar DoD aplicable. |
| `.claude/skills/epic-from-project-plan/SKILL.md` | Ídem. |
| `.claude/skills/epic-generate-stories/SKILL.md` | Añadir transformación del formato "[Nombre]" → "STORY-NNN — [Nombre]". |
| `.claude/skills/epic-generate-all-stories/SKILL.md` | Ídem. |
| `.claude/skills/story-implement/SKILL.md` | Añadir o validar que exista paso para marcar `[x]` en la línea del Epic padre. |
| `.claude/skills/memory-system/SKILL.md` | Añadir modo `migrate --from=epic-template-v1`. |
| `docs/domains/domain-epic-lifecycle.md` | Actualizar la sección de estructura del Epic. |
| `docs/guides/sddf-commands-pipeline.md` | Reflejar los cambios si menciona el template de Epic. |
| `CHANGELOG.md` | Entrada `[Unreleased]` → `Changed`. |
| `docs/specs/02-epics/EPIC-NNN-*/epic.md` | Migrar Epics existentes (uno por archivo). |


---

## 📎 Referencias

- [[domain-epic-lifecycle]] — Ciclo de vida del Epic y estructura del artefacto
- [[domain-work-item-hierarchy]] — Relación Project → Epic → Story
- [[domain-knowledge-artifacts]] — Modelo de artefactos y TraceLinks
- [[ADR-0007-templates-como-capa-propia]] — Templates como capa propia
- [[ADR-0010-specs-dentro-de-docs]] — `specs/` dentro de `docs/`
- [[ADR-0011-archivos-canonicos-por-tipo]] — Archivos canónicos por tipo
- [[constitution]] — Principios aplicables (KISS, DRY, output-oriented)
