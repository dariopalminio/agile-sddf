---
alwaysApply: false
type: story
id: STORY-130
kind: feat
slug: STORY-130-project-flow-invoca-los-skills-de-fase
title: "project-flow invoca los skills de fase"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-14
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: project-flow invoca los skills de fase

**Como** practitioner que recorre el ciclo de proyecto con `/project-flow`  
**Quiero** que `project-flow` invoque `project-begin`, `project-discovery` y `project-planning` en lugar de replicar sus pasos y agentes  
**Para** obtener el mismo resultado que si ejecutara cada fase por separado, sin dos versiones del mismo flujo que divergen

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Orquestación por invocación de skills
```gherkin
Dado un proyecto sin documentos de producto
Cuando ejecuto /project-flow
Entonces el skill invoca en orden project-begin, project-discovery y project-planning
  Y los artefactos generados son los mismos que produce cada skill de fase ejecutado por separado
  Y skills/project-flow/SKILL.md no referencia ningún agente propio ni de agents/
```

### AC-2 — Escenario alternativo / error – Proyecto con una fase ya completada
```gherkin
Dado un proyecto cuyo discovery ya está completo
Cuando ejecuto /project-flow
Entonces el skill reconoce la fase completada y continúa con project-planning
  Pero no repite la entrevista de discovery
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin duplicación:** `skills/project-flow/SKILL.md` no contiene pasos copiados de los skills de fase; cualquier cambio en una fase se refleja en `project-flow` sin editarlo.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-130 — project-flow invoca los skills de fase

- AC-2 es una inferencia razonable del generador; validar con `/story-evaluation` si la detección de fases ya completadas entra en el alcance o se difiere.
- Actualizar `skills/project-flow/evals/evals.json`.
