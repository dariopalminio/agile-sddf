---
alwaysApply: false
type: story
id: STORY-168
kind: feat
slug: STORY-168-skill-epic-track-progress
title: "Skill epic-track-progress"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Skill `epic-track-progress` como semáforo de solo lectura de la épica

**Como** Solo Builder con una épica en `DEVELOP`  
**Quiero** ejecutar `/epic-track-progress EPIC-NN` para ver el status y substatus de cada historia hija, incluidas las archivadas, y saber si todas están terminadas  
**Para** pasar a `/epic-validate` solo cuando no queda ninguna historia pendiente, sin que se modifique ningún archivo

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Todas las historias terminadas
```gherkin
Dado una épica con tres historias hijas
  Y dos están en DELIVER/DONE en specs/flow/
  Y una está en COMPLETED/DONE en specs/flow/archive/
Cuando el Solo Builder ejecuta "/epic-track-progress EPIC-NN"
Entonces se muestra una fila por historia con su ID, status, substatus y ubicación (activa o archivada)
  Y la respuesta indica que todas las historias están terminadas
  Y sugiere "/epic-validate EPIC-NN" como siguiente paso
```

### AC-2 — Escenario alternativo – Historia pendiente impide avanzar
```gherkin
Dado una épica con una historia en IMPLEMENT/IN-PROGRESS y el resto en DELIVER/DONE
Cuando el Solo Builder ejecuta "/epic-track-progress EPIC-NN"
Entonces informa que no todas las historias están terminadas
  Y identifica la historia pendiente con su status y substatus
  Y ningún archivo cambia
```

### AC-3 — Escenario de inconsistencia – Historia del índice sin directorio
```gherkin
Dado una épica cuyo índice de historias incluye STORY-200
  Pero no existe STORY-200 ni en specs/flow/ ni en specs/flow/archive/
Cuando el Solo Builder ejecuta "/epic-track-progress EPIC-NN"
Entonces STORY-200 figura como "no encontrada"
  Y la respuesta indica que no todas las historias están terminadas
```

### AC-4 — Escenario de error – Épica inexistente
```gherkin
Dado que no existe ningún directorio para EPIC-77 en specs/flow/
Cuando el Solo Builder ejecuta "/epic-track-progress EPIC-77"
Entonces informa la ruta buscada y finaliza con error
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Solo lectura:** no escribe ningún archivo, ni siquiera en `.tmp/`.
- **CNF-2 — Fuentes de historias:** une el índice de `epic.md` con los `story.md` que declaran `parent` igual al directorio de la épica, en `specs/flow/` y en `specs/flow/archive/`.
- **CNF-3 — Layout fijo:** declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y resuelve solo `REPO_ROOT`.
- **CNF-4 — Progressive disclosure:** El skill debe minimizar la cantidad de tokens que se cargan en la ventana de contexto del agente, cargando únicamente la información necesaria para ejecutar la capacidad solicitada y delegando el detalle extenso a recursos que se recuperan bajo demanda (progressive disclosure).
- **CNF-5 — Tamaño del skill óptimo:** El skill debe ser lo suficientemente compacto para ser cargado y ejecutado eficientemente, evitando la sobrecarga de la ventana de contexto del agente.

## Fuera de alcance (Non-Goals)

- Cambiar el estado de la épica o de las historias.
- Validar la evidencia operativa de la épica (lo hace `/epic-validate`).

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-168 — Skill epic-track-progress.
- **Criterios de salida que cubre:** CS-16 y CS-12 para `epic-track-progress`. Dueña de SMOKE-6.
- **Historia terminada:** cuentan como terminadas las `DELIVER/DONE` y `COMPLETED/DONE` (invariante 3 de `domain-epic-lifecycle`). El tratamiento de las `CANCELED/DONE` se decide al refinar esta historia.
- **Gate del diagrama:** resuelve la decisión «all stories done?» de `DEVELOP → VALIDATE`.
- Skill Tool: se debe usar skill-master.
- Cubre el criterio de salida de EPIC-23: **CS-16** — `epic-track-progress` lista el status y substatus de cada historia hija, incluidas las archivadas, responde si todas están terminadas y no escribe ningún archivo.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
