---
alwaysApply: false
type: story
id: STORY-170
kind: feat
slug: STORY-170-skill-epic-ship
title: "Skill epic-ship"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Skill `epic-ship` para preparar la versión de una épica validada

**Como** Solo Builder con una épica validada  
**Quiero** ejecutar `/epic-ship EPIC-NN` para que lea el valor entregado por las historias, actualice `CHANGELOG.md`, redacte las notas de versión para stakeholders en `release-notes.md` y me muestre los pasos de liberación que ejecuto a mano  
**Para** preparar una versión documentada sin redactarla yo y dejar la épica en `SHIP/DONE` cuando confirmo que la liberé

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Preparar la versión y confirmar la liberación
```gherkin
Dado una épica con epic-validate-report.md en "verdict: APPROVED"
Cuando el Solo Builder ejecuta "/epic-ship EPIC-NN"
Entonces CHANGELOG.md tiene una entrada nueva con las historias de la épica
  Y existe release-notes.md en el directorio de la épica
  Y se muestran los pasos de liberación manuales (commit, tag, merge y despliegue)
  Y al confirmar el Solo Builder que completó esos pasos, la épica pasa a SHIP/DONE
```

### AC-2 — Escenario alternativo – El humano no confirma la liberación
```gherkin
Dado una épica con epic-validate-report.md en "verdict: APPROVED"
Cuando el Solo Builder ejecuta "/epic-ship EPIC-NN"
  Y responde que todavía no completó los pasos de liberación
Entonces CHANGELOG.md y release-notes.md quedan escritos
  Pero el status de la épica no cambia
```

### AC-3 — Escenario de rechazo – Épica sin validación aprobada
```gherkin
Dado una épica sin epic-validate-report.md o con un veredicto distinto de "APPROVED"
Cuando el Solo Builder ejecuta "/epic-ship EPIC-NN"
Entonces informa que la épica no está validada y remite a "/epic-validate"
  Y no escribe ningún archivo
```

### AC-4 — Regla – Sin operaciones de repositorio
```gherkin
Dado cualquier ejecución de "/epic-ship"
Cuando el skill termina
Entonces no se creó ningún commit, tag, merge ni push
  Y no se disparó ningún release ni despliegue
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Confirmación humana:** `SHIP/DONE` solo se escribe tras confirmación explícita; en modo automático sin confirmación la épica no cambia de estado.
- **CNF-2 — Idempotencia:** reejecutar el skill no duplica la entrada de `CHANGELOG.md` de la épica.
- **CNF-3 — Encoding:** UTF-8 sin BOM.
- **CNF-4 — Layout fijo:** declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y resuelve solo `REPO_ROOT`.
- **CNF-5 — Progressive disclosure:** El skill debe minimizar la cantidad de tokens que se cargan en la ventana de contexto del agente, cargando únicamente la información necesaria para ejecutar la capacidad solicitada y delegando el detalle extenso a recursos que se recuperan bajo demanda (progressive disclosure).
- **CNF-6 — Tamaño del skill óptimo:** El skill debe ser lo suficientemente compacto para ser cargado y ejecutado eficientemente, evitando la sobrecarga de la ventana de contexto del agente.

## Fuera de alcance (Non-Goals)

- Ejecutar commit, tag, merge, push, release o despliegue.
- Crear el skill `epic-release-notes`: `epic-ship` absorbe ese trabajo.
- Archivar la épica (lo hace `/epic-complete`).

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-170 — Skill epic-ship.
- **Criterios de salida que cubre:** CS-17, CS-18, CS-12 para `epic-ship` y la parte de CS-20 que documenta en `domain-epic-lifecycle` y `domain-state-management` (invariante 6) que `epic-ship` escribe `SHIP` de épica con confirmación humana. Dueña de SMOKE-7.
- **SHIP simplificado (decisión del PO, 2026-10-27):** ningún skill hace despliegues, releases ni tags; quedan como acción manual. El diagrama todavía muestra `epic-release-notes → epic-ship`; se adopta el nombre `epic-ship`.
- Puede reutilizar las convenciones de `/doc-release-notes` para el formato de `CHANGELOG.md`.
- **Tamaño:** incluye un skill nuevo y el ajuste de dos documentos de dominio; evaluar en `/story-evaluation` si conviene separar el ajuste de dominio.
- Skill Tool: se debe usar skill-master.
- Cubre el criterio de salida de EPIC-23: **CS-18** — `epic-ship` no ejecuta ninguna operación de git (commit, tag, merge ni push) ni dispara releases o despliegues; muestra los pasos de liberación manuales y escribe `SHIP/DONE` en la épica solo cuando el humano confirma que los completó.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
