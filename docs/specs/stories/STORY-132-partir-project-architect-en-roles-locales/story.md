---
alwaysApply: false
type: story
id: STORY-132
kind: feat
slug: STORY-132-partir-project-architect-en-roles-locales
title: "Partir project-architect en roles locales"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-15
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Partir project-architect en roles locales

**Como** Solo Builder y Product Owner que evoluciona `project-discovery` y `project-planning`  
**Quiero** separar `project-architect` en un rol de arquitecto para `project-discovery` y el rol `planning` de `project-planning`  
**Para** que cada skill cargue solo las instrucciones de arquitectura de su fase y funcione sin la carpeta global `agents/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Cada skill lee su propio rol de arquitecto
```gherkin
Dado que existen skills/project-discovery/assets/agents/discovery-architect.md y skills/project-planning/assets/agents/planning.md
  Y agents/project-architect.agent.md ya no existe
Cuando ejecuto /project-planning sobre un proyecto con requisitos funcionales
Entonces la sesión del skill lee su rol planning y propone las épicas del roadmap
  Y la propuesta se agrega de forma append-only en product/roadmap.md tras confirmación, como antes de la migración
```

### AC-2 — Escenario alternativo / error – Rol local ausente
```gherkin
Dado que falta skills/project-planning/assets/agents/planning.md
Cuando ejecuto /project-planning
Entonces el skill se detiene e informa la ruta del rol que falta
  Pero no modifica product/roadmap.md ni recurre a agents/project-architect.agent.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin pérdida de instrucciones:** los principios y los estados Discovery y Planning de `project-architect` quedan cubiertos entre los dos roles.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-132 — Partir project-architect en roles locales

- `agents/project-architect.agent.md` tiene hoy las secciones "Estado Discovery — Propuesta fragmentada" y "Estado Planning — Propuesta de roadmap".
- **Nombre del rol de discovery:** los roles de PM, arquitecto y UX quedan juntos en `skills/project-discovery/assets/agents/`. Para evitar colisiones, se nombran por origen (convención acordada el 2026-10-14 y registrada en ADR-0014): `discovery-pm.md` (STORY-131), `discovery-architect.md` (esta historia) y `discovery-ux.md` (STORY-133).
- Comparte `project-discovery` con STORY-131 y STORY-133: conviene implementarlas en ese orden para no tocar el mismo `SKILL.md` en paralelo (WIP = 1).
- Cubre, para `project-discovery` y `project-planning`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».
- Cubre, para el entrevistador `architect`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».
- Cubre, para `project-discovery` y `project-planning`, los criterios de salida transversales de la épica:
  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».
  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».
  - «`npm run verify:repository` pasa».
  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».
