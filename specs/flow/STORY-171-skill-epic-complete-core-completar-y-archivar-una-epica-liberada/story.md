---
alwaysApply: false
type: story
id: STORY-171
kind: feat
slug: STORY-171-skill-epic-complete-core-completar-y-archivar-una-epica-liberada
title: "Skill epic-complete (Core) — completar y archivar una épica liberada"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-27
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-170-skill-epic-ship
  - STORY-172-skill-epic-complete-archivar-epicas-canceladas
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

### AC-4 — Gobierno – Archivo de épicas admitido por un ADR nuevo
```gherkin
Dado que ADR-0017 está aceptado y deja las épicas en specs/flow/
Cuando se entrega esta historia
Entonces existe un ADR nuevo que admite épicas en specs/flow/archive/
  Y ADR-0017 declara "superseded-by" ese ADR sin otros cambios en su contenido
  Y AGENTS.md, docs/constitution.md, domain-epic-lifecycle y domain-state-management documentan que epic-complete escribe COMPLETED de épica con confirmación humana
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Historial de git:** el movimiento se hace con `git mv` (o equivalente que git reconozca como rename); el skill no hace commit.
- **CNF-2 — Fecha del archivo:** el prefijo `<YYYY-MM-DD>` sale de `updated:`, `created:` o `date:` del `epic.md`, como en ADR-0017 para las historias.
- **CNF-3 — Confirmación humana:** nunca archiva sin confirmación explícita.
- **CNF-4 — Layout fijo:** declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` y resuelve solo `REPO_ROOT`.

## Fuera de alcance (Non-Goals)

- Archivar épicas canceladas (STORY-172).
- Archivar las historias hijas (lo hace `/story-complete`).
- Construir tableros de métricas.

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-171 — Skill epic-complete (Core) — completar y archivar una épica liberada.
- **Criterios de salida que cubre:** CS-19 (épicas `SHIP/DONE` y `COMPLETED/DONE`), CS-20 (ADR nuevo y documentos de dominio para `COMPLETED`) y CS-12 para `epic-complete`. Dueña de SMOKE-8.
- **Antecedente:** `/story-complete` (EPIC-27) resolvió el mismo problema para historias; reutilizar su diseño.
- **Impacto en otros skills:** al admitir épicas en `specs/flow/archive/`, los skills que hoy ignoran el archivo al buscar épicas (por ejemplo `epic-generate-stories`) deben seguir excluyéndolo como candidato activo.
- Skill Tool: se debe usar skill-master.
