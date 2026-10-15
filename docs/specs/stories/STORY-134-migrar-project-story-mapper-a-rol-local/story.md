---
alwaysApply: false
type: story
id: STORY-134
kind: feat
slug: STORY-134-migrar-project-story-mapper-a-rol-local
title: "Migrar project-story-mapper a rol local"
status: SPECIFY
substatus: DONE
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-15
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Migrar project-story-mapper a rol local

**Como** Solo Builder y Product Owner que construye el story map con `/project-story-mapping`  
**Quiero** que `project-story-mapper` sea un archivo de rol de `project-story-mapping` leído por la sesión del skill  
**Para** conducir la sesión de User Story Mapping con preguntas al usuario en cualquier runtime, sin la carpeta global `agents/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Sesión de story mapping con rol local
```gherkin
Dado que existe el rol story-mapper en skills/project-story-mapping/assets/agents/
  Y agents/project-story-mapper.agent.md ya no existe
Cuando ejecuto /project-story-mapping sobre un proyecto con product/ y requirements/
Entonces la sesión del skill lee el rol y conduce la entrevista con el usuario
  Y escribe el cuerpo del mapa en staging y, tras validarlo, product/story-map.md
```

### AC-2 — Escenario alternativo / error – Rol local ausente
```gherkin
Dado que falta el rol story-mapper en skills/project-story-mapping/assets/agents/
Cuando ejecuto /project-story-mapping
Entonces el skill se detiene e informa la ruta del rol que falta
  Pero no escribe product/story-map.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Interacción garantizada:** el rol se ejecuta en la sesión del skill, que puede preguntar al usuario; no depende de que un subagente genérico pueda hacerlo (ADR-0014, trade-offs).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-134 — Migrar project-story-mapper a rol local

- Hoy `skills/project-story-mapping/SKILL.md` declara `project-story-mapper` en Dependencias y lo ejecuta con `$INPUT_PATHS`, `$REQUIREMENTS_INVENTORY` y `$STAGING_PATH`; el rol local debe recibir las mismas entradas.
- Cubre, para `project-story-mapping`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».
- Cubre, para el entrevistador `story-mapper`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».
- Cubre, para `project-story-mapping`, los criterios de salida transversales de la épica:
  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».
  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».
  - «`npm run verify:repository` pasa».
  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».
