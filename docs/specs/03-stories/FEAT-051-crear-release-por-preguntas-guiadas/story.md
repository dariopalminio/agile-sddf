---
alwaysApply: false
type: story
id: FEAT-051
slug: FEAT-051-crear-release-por-preguntas-guiadas
title: "Crear un release.md válido respondiendo preguntas guiadas por el template"
status: COMPLETED
substatus: READY
parent: EPIC-10-mejora-estructura-artefactos-nuevos-skills
created: 2026-05-01
updated: 2026-05-01
---
**FINVEST Score:** pendiente
**FINVEST Decisión:** pendiente
---
<!-- Referencias -->
[[EPIC-10-mejora-estructura-artefactos-nuevos-skills]]

# 📖 Historia: Crear un release.md válido respondiendo preguntas guiadas por el template

**Como** developer de proyectos SDDF que necesita documentar un nuevo release sin tener un `project-plan.md` existente  
**Quiero** crear el archivo `release.md` respondiendo preguntas guiadas por cada sección del template en tiempo de ejecución  
**Para** obtener un release completamente documentado y validado, listo para generar historias de usuario, sin tener que construir el archivo manualmente

## ✅ Criterios de aceptación

### Escenario principal – Creación guiada produce un release.md aprobado
```gherkin
Dado que ejecuto el skill `/release-creation` en un proyecto sin `project-plan.md`
  Y el archivo `assets/release-spec-template.md` existe en el skill
Cuando respondo las preguntas para cada sección obligatoria (Descripción, Features, Smoke Tests)
Entonces el skill crea el archivo en `$SPECS_BASE/specs/releases/EPIC-NN-<slug>/release.md`
  Y el skill invoca automáticamente `release-format-validation` sobre el archivo creado
  Y el resultado de la validación es APROBADO
```

### Escenario alternativo – Modo rápido omite secciones opcionales
```gherkin
Dado que ejecuto el skill `/release-creation --quick`
Cuando el skill procesa el template
Entonces el skill formula preguntas únicamente para las secciones marcadas como obligatorias
  Y omite todas las secciones opcionales sin preguntar por ellas
  Y el archivo generado contiene solo las secciones obligatorias completadas
```

### Escenario alternativo / error – Template no encontrado
```gherkin
Dado que el archivo `assets/release-spec-template.md` no existe en el skill
Cuando inicio el skill `/release-creation`
Entonces el skill detiene la ejecución antes de formular cualquier pregunta
  Y muestra el mensaje "❌ No se encontró el template requerido en assets/release-spec-template.md"
```

## ⚙️ Criterios no funcionales

* Autonomía: el skill extrae las secciones del template dinámicamente en tiempo de ejecución — no las hardcodea; si el template cambia, el flujo de preguntas se actualiza automáticamente
* Convención: el nombre del directorio de salida sigue el formato `EPIC-NN-<slug-kebab>` con NN derivado de los directorios existentes en `releases/`

## 📎 Notas / contexto adicional

Los siguientes aspectos quedan fuera de scope de esta historia y se cubren por separado:
- Lógica de asignación de IDs a features (`FEAT-NNN`): la historia que cubre la convención de directorios (FEAT-050) aborda la estructura; la asignación de IDs sin colisión es un detalle de implementación del skill
- Flujo de conflicto cuando el directorio destino ya existe (escenario cubierto por la especificación de implementación del skill)
- Migración de releases existentes al nuevo formato de directorio

`release-creation` complementa `releases-from-project-plan`: este skill es el punto de entrada para equipos que crean releases de forma ad-hoc.
