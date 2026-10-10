---
type: story
id: STORY-103
slug: STORY-103-replace-the-epic-template
title: "Reemplazar el template de Epic por la versiÃ³n minimalista y output-oriented"
status: COMPLETED
substatus: DONE
kind: feat
parent: EPIC-21-colapsar-specs-dos-niveles
created: 2026-09-27
updated: 2026-10-07
related: 
  - EPIC-21-colapsar-specs-dos-niveles
---
<!-- Referencias -->
[[EPIC-21-colapsar-specs-dos-niveles]]

# ðŸ“– Historia: Reemplazar el template de Epic por la versiÃ³n minimalista y output-oriented

**Como** mantenedor del framework SDDF  
**Quiero** reemplazar el template actual de Epic (`docs/templates/epic-template.md`) por una versiÃ³n minimalista, output-oriented y viva, alineada con el template de Story refinado,  
**Para** que los Epics sean artefactos que evolucionan con las Stories, sin secciones que queden vacÃ­as en la mayorÃ­a de casos, con trazabilidad explÃ­cita desde el estado "sin ID" hasta "completada", y con smoke tests numerados referenciables desde runbooks y pipelines.

---

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Template reducido a cinco secciones

```gherkin
Dado el archivo `docs/templates/epic-template.md`
Cuando se reemplaza su contenido por la versiÃ³n nueva
Entonces contiene exactamente las secciones:
  Â· Alcance
  Â· Historias
  Â· Criterios de salida
  Â· Smoke tests
  Â· Notas
 Y no contiene las secciones eliminadas:
  Â· DescripciÃ³n
  Â· Criterios de Ã©xito
  Â· Requerimiento
  Â· Impacto en Procesos Claves
  Â· Dependencias CrÃ­ticas
  Â· Riesgos
  Â· Fuera de alcance
  Â· Notas adicionales
```

### AC-2 â€” SecciÃ³n "Alcance" reemplaza a "DescripciÃ³n"

```gherkin
Dado el template nuevo
Cuando un autor lo copia para crear un Epic
Entonces la primera secciÃ³n se titula "Alcance"
 Y el comentario guÃ­a indica que se describe el output (quÃ© se construye),
   no el valor de negocio (que vive en `product/vision.md` o `requirements/`)
```

### AC-3 â€” SecciÃ³n "Historias" con tres formatos de vinculaciÃ³n

```gherkin
Dado el template nuevo
Cuando un autor lista las historias del Epic
Entonces el template documenta tres formatos:
  Â· "[Nombre]: [desc]"                     â†’ planificada, aÃºn sin ID
  Â· "- [ ] **STORY-NNN** â€” [Nombre]: [desc]" â†’ creada, con ID
  Â· "- [x] **STORY-NNN** â€” [Nombre]: [desc]" â†’ completada
 Y el ejemplo por defecto usa el primer formato (sin ID)
 Y el comentario guÃ­a explica cuÃ¡ndo aplicar cada formato
```

### AC-4 â€” SecciÃ³n "Criterios de salida" reemplaza a "Criterios de Ã©xito"

```gherkin
Dado el template nuevo
Cuando un autor define cuÃ¡ndo la Ã©pica estÃ¡ terminada
Entonces la secciÃ³n se titula "Criterios de salida"
 Y el comentario guÃ­a indica que son criterios tÃ©cnicos verificables,
   no criterios de Ã©xito de negocio
```

### AC-5 â€” Smoke tests numerados con `SMOKE-N` y formato gherkin unificado

```gherkin
Dado el template nuevo
Cuando un autor define los smoke tests del Epic
Entonces cada escenario se titula "### SMOKE-N â€” [nombre descriptivo]"
 Y el cuerpo usa un bloque gherkin con "Escenario:", "Dado", "Cuando", "Entonces"
 Y el comentario guÃ­a explica la regla de no-renumerar
 Y si el Epic tiene un solo smoke test, la numeraciÃ³n es opcional
```

### AC-6 â€” SecciÃ³n "Notas" soporta la evoluciÃ³n del Epic

```gherkin
Dado el template nuevo
Cuando un autor necesita registrar decisiones emergentes, cambios de alcance o acuerdos
Entonces la secciÃ³n "Notas" existe al final del template
 Y el comentario guÃ­a indica que es opcional y que se rellena conforme aparezcan cambios
```

### AC-7 â€” Frontmatter simplificado

```gherkin
Dado el template nuevo
Cuando se inspecciona su frontmatter
Entonces contiene los campos mÃ­nimos:
  Â· type: epic
  Â· id: <EPIC-NN>
  Â· slug: <slug>
  Â· title: "<tÃ­tulo>"
  Â· status: DEFINE
  Â· substatus: IN-PROGRESS
  Â· parent: null
  Â· created: <YYYY-MM-DD>
  Â· updated: <YYYY-MM-DD>
 Y no contiene `implements`, `deliveryModel` ni `children`
 Y el estado inicial es `DEFINE` (no `<ESTADO_INICIAL>`)
```

### AC-8 â€” Genera Epics desde `project-plan.md`

```gherkin
Dado el skill `epic-from-project-plan`
Cuando genera Epics desde `project-plan.md`
Entonces usa el template nuevo
 Y los Epics generados pasan la validaciÃ³n de formato
```

### AC-9 â€” Skills que editan el Epic actualizados

```gherkin
Dado el skill `epic-generate-stories`
Cuando asigna IDs a las historias planificadas
Entonces transforma el formato "[Nombre]: [desc]" al formato "- [ ] **STORY-NNN** â€” [Nombre]: [desc]"
 Y no modifica otras secciones del Epic

Dado el skill `epic-generate-all-stories`
Cuando procesa mÃºltiples Epics
Entonces aplica la misma transformaciÃ³n de formato

Dado el skill `story-implement`
Cuando completa una Story
Entonces marca la lÃ­nea correspondiente en la secciÃ³n "Historias" del Epic padre como "- [x] **STORY-NNN** â€” [Nombre]: [desc]"
```

### AC-10 â€” Epics existentes migrados

```gherkin
Dado un repositorio con Epics existentes en `docs/specs/02-epics/EPIC-NNN-*/epic.md`
Cuando se ejecuta la migraciÃ³n
Entonces cada Epic existente se actualiza al nuevo formato:
  Â· "DescripciÃ³n" â†’ "Alcance"
  Â· "Criterios de Ã©xito" â†’ "Criterios de salida"
  Â· Smoke tests renumerados como "SMOKE-N"
  Â· Secciones situacionales movidas a "Notas" o eliminadas si estÃ¡n vacÃ­as
  Â· Gherkin unificado al formato con bloque `gherkin`
 Y el contenido semÃ¡ntico se preserva (no se pierde informaciÃ³n)
 Y la migraciÃ³n es idempotente (ejecutarla dos veces no duplica cambios)
```

### AC-11 â€” Skill de validaciÃ³n de formato de Epic actualizado

```gherkin
Dado el skill de guardrail `epic-format-validation`
Cuando valida un `epic.md`
Entonces verifica la presencia de las cinco secciones obligatorias
 Y verifica que la secciÃ³n "Historias" usa uno de los tres formatos vÃ¡lidos
 Y verifica que los smoke tests siguen el patrÃ³n "### SMOKE-N â€” [nombre]"
 Y falla con un mensaje accionable si falta cualquier elemento
```

---

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Token efficiency:** el template nuevo debe ocupar â‰¤ 40 lÃ­neas (vs. ~60 del actual), reduciendo el coste de carga en cada Epic generado.
- **CNF-2 â€” DocumentaciÃ³n:** actualizar `docs/domains/domain-epic-lifecycle.md` (secciÃ³n de estados y secciones del Epic), `docs/templates/README.md` (si existe) y `docs/guides/how-to-write-epics.md` (si existe).
- **CNF-3 â€” CHANGELOG:** registrar el cambio como `Changed` en `[Unreleased]`.
- **CNF-4 â€” Compatibilidad:** la historia se publica con EPIC-21 en 4.0.0, asÃ­ que el formato anterior se retira en esa major (breaking change) sin compatibilidad en tiempo de ejecuciÃ³n. A cambio, la migraciÃ³n es automÃ¡tica (`/memory-system migrate --from=epic-template-v1`) y los skills que reciben una Ã©pica en el formato anterior responden con un mensaje que nombra ese comando.
- **CNF-5 â€” ConvenciÃ³n de guion:** ASCII U+002D `-` en todos los slugs y IDs.

---

## ðŸš« Fuera de alcance

- Cambios en el template de Story (`story-template.md`) â€” ya tiene su propia historia.
- Cambios en el template de Project (`project-template.md`, `project-intent-template.md`, `project-plan-template.md`).
- ModificaciÃ³n de la mÃ¡quina de estados del Epic (`domain-epic-lifecycle.md`).
- TraducciÃ³n del template a otros idiomas.
- CreaciÃ³n de un nuevo guardrail de DoD para Epic (se abordarÃ¡ en otra historia si aplica).

---

## ðŸ“Ž Notas / mapa de implementaciÃ³n

| Archivo | Cambio |
|---------|--------|
| `docs/templates/epic-template.md` | Reemplazar por la versiÃ³n minimalista output-oriented. |
| `skills/epic-format-validation/SKILL.md` | Actualizar reglas de validaciÃ³n para las cinco secciones. |
| `.claude/skills/epic-creation/SKILL.md` | Referenciar el template nuevo; ajustar DoD aplicable. |
| `.claude/skills/epic-from-project-plan/SKILL.md` | Ãdem. |
| `.claude/skills/epic-generate-stories/SKILL.md` | AÃ±adir transformaciÃ³n del formato "[Nombre]" â†’ "STORY-NNN â€” [Nombre]". |
| `.claude/skills/epic-generate-all-stories/SKILL.md` | Ãdem. |
| `.claude/skills/story-implement/SKILL.md` | AÃ±adir o validar que exista paso para marcar `[x]` en la lÃ­nea del Epic padre. |
| `.claude/skills/memory-system/SKILL.md` | AÃ±adir modo `migrate --from=epic-template-v1`. |
| `docs/domains/domain-epic-lifecycle.md` | Actualizar la secciÃ³n de estructura del Epic. |
| `docs/guides/sddf-commands-pipeline.md` | Reflejar los cambios si menciona el template de Epic. |
| `CHANGELOG.md` | Entrada `[Unreleased]` â†’ `Changed`. |
| `docs/specs/02-epics/EPIC-NNN-*/epic.md` | Migrar Epics existentes (uno por archivo). |


---

## ðŸ“Ž Referencias

- [[domain-epic-lifecycle]] â€” Ciclo de vida del Epic y estructura del artefacto
- [[domain-work-item-hierarchy]] â€” RelaciÃ³n Project â†’ Epic â†’ Story
- [[domain-knowledge-artifacts]] â€” Modelo de artefactos y TraceLinks
- [[ADR-0007-templates-como-capa-propia]] â€” Templates como capa propia
- [[ADR-0010-specs-dentro-de-docs]] â€” `specs/` dentro de `docs/`
- [[ADR-0011-archivos-canonicos-por-tipo]] â€” Archivos canÃ³nicos por tipo
- [[constitution]] â€” Principios aplicables (KISS, DRY, output-oriented)
