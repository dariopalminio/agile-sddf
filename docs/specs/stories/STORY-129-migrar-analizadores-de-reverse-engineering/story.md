---
alwaysApply: false
type: story
id: STORY-129
kind: feat
slug: STORY-129-migrar-analizadores-de-reverse-engineering
title: "Migrar analizadores de reverse-engineering"
status: VERIFY
substatus: DONE
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-16
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Migrar analizadores de reverse-engineering

**Como** Solo Builder que distribuye el skill `reverse-engineering`  
**Quiero** que los cinco analizadores `reverse-engineer-*` vivan como subagentes locales en `skills/reverse-engineering/assets/agents/`  
**Para** que el skill funcione de forma autocontenida, sin depender de la carpeta global `agents/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – El skill invoca sus subagentes locales
```gherkin
Dado que existen en skills/reverse-engineering/assets/agents/ los subagentes architect, product-discovery, business-analyst, ux-flow-mapper y synthesizer
  Y agents/ ya no contiene ningún archivo reverse-engineer-*
Cuando ejecuto /reverse-engineering sobre un repositorio
Entonces el skill invoca los cuatro analizadores locales en paralelo y luego el synthesizer local
  Y cada analizador escribe su resultado en .tmp/reverse-engineering/ con el mismo nombre de archivo que antes de la migración
```

### AC-2 — Escenario alternativo / error – Falta un subagente local
```gherkin
Dado que falta uno de los cinco archivos de subagente en skills/reverse-engineering/assets/agents/
Cuando ejecuto /reverse-engineering
Entonces el skill se detiene antes de lanzar analizadores e informa qué subagente local falta
  Pero no busca el agente en la carpeta global agents/
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Contrato de `.tmp/` estable:** el directorio temporal del skill es `.tmp/reverse-engineering/`; los nombres y el formato de los archivos intermedios (`.tmp/reverse-engineering/rfc-*.md`) no cambian, de modo que la síntesis y los evals existentes siguen siendo válidos. Los agentes de análisis escriben únicamente en `.tmp/reverse-engineering/`.
- **CNF-2 — Un solo nivel de delegación:** ningún subagente local invoca a otro subagente (ADR-0002).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-129 — Migrar analizadores de reverse-engineering

- Primera historia del orden sugerido por la épica (menor riesgo).
- Actualizar `skills/reverse-engineering/evals/evals.json` si referencia rutas de `agents/`.
- Cubre, para `reverse-engineering`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».
- Cubre el criterio de salida de la épica «Los agentes analizadores (`reverse-engineer-*`) son subagentes locales que invoca `reverse-engineering`».
- Cubre, para `reverse-engineering`, los criterios de salida transversales de la épica:
  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».
  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».
  - «`npm run verify:repository` pasa».
  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».
