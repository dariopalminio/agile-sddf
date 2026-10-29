---
alwaysApply: false
type: story
id: STORY-171
kind: feat
slug: STORY-171-completar-archivar-epica-liberada
title: "Skill epic-complete (Core) — completar y archivar una épica liberada"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-170-skill-epic-ship
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
  - STORY-175
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Skill `epic-complete` (Core) para completar y archivar una épica liberada

**Como** Solo Builder que liberó una épica con SDD flow-forward  
**Quiero** completarla con `/epic-complete EPIC-NN` tras verificar su operatividad post-despliegue  
**Para** que quede en `COMPLETED/DONE` dentro de `specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/`, `specs/flow/` conserve solo el trabajo activo y la épica quede como registro histórico con su historial de git intacto

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Cierre y archivado de una épica liberada
```gherkin
Dado una épica en SHIP/DONE
Cuando el Solo Builder ejecuta "/epic-complete EPIC-NN"
  Y confirma que la versión liberada opera correctamente y que quiere cerrarla
Entonces la épica queda con status COMPLETED y substatus DONE
  Y su directorio se mueve a specs/flow/archive/<YYYY-MM-DD>-EPIC-NN-<slug>/ conservando el historial de git
  Y ya no aparece en specs/flow/
  Y epic.md conserva legibles las fechas de cierre y la versión liberada
```

### AC-2 — Escenario alternativo – Épica que no está liberada
```gherkin
Dado una épica en VALIDATE/DONE
Cuando el Solo Builder ejecuta "/epic-complete EPIC-NN"
Entonces informa que solo se completan épicas en SHIP/DONE, COMPLETED/DONE o CANCELED/DONE
  Y ningún archivo cambia ni se mueve
```

### AC-3 — Escenario de cancelación – El humano no confirma
```gherkin
Dado una épica en SHIP/DONE
Cuando el Solo Builder ejecuta "/epic-complete EPIC-NN"
  Y no confirma el cierre
Entonces la épica conserva SHIP/DONE en specs/flow/
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Historial de git:** el movimiento se hace con `git mv` (o equivalente que git reconozca como rename); el skill no hace commit.
- **CNF-2 — Fecha del archivo:** el prefijo `<YYYY-MM-DD>` sale de `updated:`, `created:` o `date:` del `epic.md`, como en ADR-0017 para las historias.
- **CNF-3 — Confirmación humana:** nunca archiva sin confirmación explícita.
- **CNF-4 — Layout fijo:** declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y resuelve solo `REPO_ROOT`.
- **CNF-5 — Progressive disclosure:** El skill debe minimizar la cantidad de tokens que se cargan en la ventana de contexto del agente, cargando únicamente la información necesaria para ejecutar la capacidad solicitada y delegando el detalle extenso a recursos que se recuperan bajo demanda (progressive disclosure).
- **CNF-6 — Tamaño del skill óptimo:** El skill debe ser lo suficientemente compacto para ser cargado y ejecutado eficientemente, evitando la sobrecarga de la ventana de contexto del agente.

## Fuera de alcance (Non-Goals)

- Archivar épicas canceladas (STORY-172).
- Archivar las historias hijas (lo hace `/story-complete`).
- El ADR nuevo que admite épicas en `specs/flow/archive/` y el ajuste de `AGENTS.md`, `docs/constitution.md` y los documentos de dominio (STORY-175).
- Construir tableros de métricas.

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-171 — Skill epic-complete (Core) — completar y archivar una épica liberada.
- **Split (2026-10-29):** `/story-split` con el patrón 4 (complejidad de criterios de aceptación) separó el antiguo AC-4 (gobierno: ADR nuevo y documentos de autoridad) en STORY-175. Esta historia conserva el cierre y archivado de la épica.
- **Orden de entrega:** STORY-175 se entrega antes de esta historia. Su ADR es lo que habilita archivar épicas sin contradecir ADR-0017; el skill puede desarrollarse y probarse en paralelo con un `epic.md` fixture en `SHIP/DONE`.
- **Criterios de salida que cubre:** CS-19 (épicas `SHIP/DONE` y `COMPLETED/DONE`) y CS-12 para `epic-complete`. Dueña de SMOKE-8.
- **Antecedente:** `/story-complete` (EPIC-27) resolvió el mismo problema para historias; reutilizar su diseño.
- Skill Tool: se debe usar skill-master.
- Cubre el criterio de salida de EPIC-23: **CS-12** — `skills/<skill>/SKILL.md` existe para `epic-improve`, `epic-refine`, `epic-track-progress`, `epic-ship` y `epic-complete`; cada uno declara `<!-- SDDF-FIXED-LAYOUT: v1 -->`, figura en el arreglo `files` de `package.json` y tiene `evals/evals.json`. Lo completa junto con STORY-165, STORY-167, STORY-168 y STORY-170, cada una para su skill.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
