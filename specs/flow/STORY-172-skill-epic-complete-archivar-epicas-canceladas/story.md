---
alwaysApply: false
type: story
id: STORY-172
kind: feat
slug: STORY-172-skill-epic-complete-archivar-epicas-canceladas
title: "Skill epic-complete — archivar épicas canceladas"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Archivar épicas canceladas con `epic-complete`

**Como** Solo Builder que canceló una épica  
**Quiero** archivarla con `/epic-complete EPIC-NN` en `specs/flow/archive/` sin que deje de figurar como `CANCELED`  
**Para** sacar de `specs/flow/` el trabajo que ya no se hará sin que una épica cancelada se confunda con una liberada en el registro histórico

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Archivar una épica cancelada
```gherkin
Dado una épica en CANCELED/DONE en specs/flow/
Cuando el Solo Builder ejecuta "/epic-complete EPIC-NN"
  Y confirma el archivado
Entonces su directorio se mueve a specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/ conservando el historial de git
  Y epic.md conserva status CANCELED y substatus DONE
  Y ya no aparece en specs/flow/
```

### AC-2 — Escenario alternativo – Épica cancelada sin cerrar
```gherkin
Dado una épica en CANCELED/IN-PROGRESS
Cuando el Solo Builder ejecuta "/epic-complete EPIC-NN"
Entonces informa que solo se archivan las épicas canceladas con substatus DONE
  Y ningún archivo cambia ni se mueve
```

### AC-3 — Escenario de conflicto – Destino de archivo existente
```gherkin
Dado una épica en CANCELED/DONE
  Y ya existe specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/
Cuando el Solo Builder ejecuta "/epic-complete EPIC-NN"
Entonces informa la ruta en conflicto
  Y no sobreescribe ni mueve ningún archivo
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Status inmutable:** el archivado de una épica cancelada no escribe `status` ni `substatus`.
- **CNF-2 — Confirmación humana:** nunca archiva sin confirmación explícita.
- **CNF-3 — Progressive disclosure:** El skill debe minimizar la cantidad de tokens que se cargan en la ventana de contexto del agente, cargando únicamente la información necesaria para ejecutar la capacidad solicitada y delegando el detalle extenso a recursos que se recuperan bajo demanda (progressive disclosure).
- **CNF-4 — Tamaño del skill óptimo:** El skill debe ser lo suficientemente compacto para ser cargado y ejecutado eficientemente, evitando la sobrecarga de la ventana de contexto del agente.

## Fuera de alcance (Non-Goals)

- Cancelar una épica (cambiar su status a `CANCELED`).
- Archivar las historias hijas de la épica cancelada.

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-172 — Skill epic-complete — archivar épicas canceladas.
- **Criterios de salida que cubre:** CS-19 (rama `CANCELED/DONE`, que conserva su status).
- **Dependencia:** requiere el skill y el ADR de STORY-171.
- **Antecedente:** `/story-complete` ya archiva historias `CANCELED/DONE` sin cambiar su status.
- Cubre el criterio de salida de EPIC-23: **CS-19** — `epic-complete` rechaza una épica que no esté en `SHIP/DONE`, `COMPLETED/DONE` ni `CANCELED/DONE` y archiva las que sí lo están en `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/` conservando su historial de git: las `SHIP` pasan a `status: COMPLETED` y las `CANCELED` conservan su status. Lo completa junto con STORY-171, que cubre las épicas SHIP/DONE y COMPLETED/DONE.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
