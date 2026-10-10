---
alwaysApply: false
type: story
id: STORY-063
kind: feat
slug: STORY-063-reutilizar-directorio-como-historia-core
title: "Reutilizar directorio original como historia core al dividir"
status: COMPLETED
substatus: DONE
parent: EPIC-12-story-sdd-workflow
created: 2026-05-09
updated: 2026-05-09
related:
  - EPIC-12-story-sdd-workflow
---
<!-- Referencias -->
[[EPIC-12-story-sdd-workflow]]

# ðŸ“– Historia: Reutilizar directorio original como historia core al dividir

**Como** desarrollador del framework SDDF que usa el skill story-split  
**Quiero** que el skill reutilice el directorio y archivo originales como la historia core (happy path) al dividir  
**Para** eliminar IDs huÃ©rfanos del backlog y preservar la trazabilidad en el historial de git

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Split exitoso reutilizando el directorio original como core
```gherkin
Dado que existe la historia "STORY-063-story-code-review" con status SPLIT candidata a dividir
  Y el skill story-split identifica el happy path como la historia core
Cuando se ejecuta la Fase 6 del skill (guardar y entregar el output)
Entonces el directorio original "STORY-063-story-code-review/" es renombrado al slug de la historia core
  Y el archivo story.md dentro del directorio renombrado contiene la historia core con id: STORY-063
  Y el frontmatter de la historia core incluye status: SPECIFY y substatus: IN-PROGRESS
  Y el frontmatter de la historia core incluye el campo related: con los IDs de las historias adicionales
  Y se crean nuevos directorios para cada historia adicional con IDs consecutivos a partir de STORY-(N+1)
```

### Escenario alternativo / error â€“ No quedan historias con status SPLIT huÃ©rfanas
```gherkin
Dado que se ejecutÃ³ story-split sobre cualquier historia
Cuando se completa el proceso
Entonces no existe ningÃºn story.md con status: SPLIT y substatus: DONE en specs/stories/
  Pero sÃ­ existe exactamente una historia core con el ID original renombrada y reescrita
```

### Escenario alternativo / error â€“ El slug del directorio cambia por la historia core
```gherkin
Dado que la historia core tiene un "Quiero" diferente al slug del directorio original
Cuando el skill renombra el directorio
Entonces el resumen muestra una advertencia explÃ­cita indicando que el directorio fue renombrado
  Y se indica quÃ© slug anterior debe buscarse y actualizarse manualmente en otros documentos
```

### Escenario con datos (Scenario Outline) â€“ IDs asignados segÃºn posiciÃ³n en el split
```gherkin
Escenario: AsignaciÃ³n de IDs tras dividir STORY-063 en tres historias
  Dado que la historia mÃ¡s alta en specs/stories/ es "STORY-<ultimo>"
  Cuando el skill divide la historia en una core y "<adicionales>" historias adicionales
  Entonces la historia core conserva el id "STORY-063"
  Y las historias adicionales reciben ids desde "STORY-<ultimo+1>" consecutivamente
Ejemplos:
  | ultimo | adicionales | primer_adicional |
  | 064    | 2           | STORY-065         |
  | 070    | 1           | STORY-071         |
```

### Requirement: El directorio original nunca se elimina, solo se renombra
El skill debe usar una operaciÃ³n de renombrado (rename/move) sobre el directorio existente, no crear uno nuevo y eliminar el anterior. Esto preserva el historial de git vinculado al path original del archivo.

## âš™ï¸ Criterios no funcionales

* Idempotencia: si el directorio ya fue renombrado al slug-core, el skill no falla ni crea duplicados
* Trazabilidad: la operaciÃ³n de renombrado debe ser perceptible en `git status` como un rename, no como delete + add

## ðŸ“Ž Notas / contexto adicional

Contexto: el skill story-split actualmente deja la historia original con `status: SPLIT / substatus: DONE`, generando un ID inutilizable y ruido en el backlog.

SoluciÃ³n aprobada (OpciÃ³n A): repurpose del directorio original como historia core.

Archivo a modificar: `.claude/skills/story-split/SKILL.md`

Cambios requeridos en SKILL.md:
1. Insertar **Fase 3.5** (identificar historia core) entre Fase 3 y Fase 4
2. En **Fase 6**: reemplazar la subsecciÃ³n "Derivar IDs consecutivos" para distinguir core (conserva ID) vs. adicionales (IDs nuevos)
3. En **Fase 6**: insertar subsecciÃ³n "Repurpose del directorio original" antes de "Guardar cada historia adicional"
4. Actualizar la secciÃ³n "Mostrar resumen en pantalla" para indicar `repurposed` vs `nuevo`
5. AÃ±adir fila a la tabla de anti-patrones: "Dejar historia original como huÃ©rfana"

Fuera de scope: cambios en scripts, assets o en otros skills.
