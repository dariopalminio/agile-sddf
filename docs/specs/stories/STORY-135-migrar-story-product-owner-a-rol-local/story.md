---
alwaysApply: false
type: story
id: STORY-135
kind: feat
slug: STORY-135-migrar-story-product-owner-a-rol-local
title: "Migrar story-product-owner a rol local"
status: SPECIFY
substatus: DONE
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-15
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Migrar story-product-owner a rol local

**Como** practitioner que especifica historias con `/story-specify`  
**Quiero** que `story-product-owner` sea un archivo de rol de `story-specify` leído por la sesión del skill  
**Para** resolver los huecos de contexto de una historia con preguntas al usuario en cualquier runtime, sin la carpeta global `agents/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Aclaración de contexto con rol local
```gherkin
Dado que existe el rol product-owner en skills/story-specify/assets/agents/
  Y agents/story-product-owner.agent.md ya no existe
Cuando ejecuto /story-specify con un input incompleto
Entonces la sesión del skill lee el rol y pregunta al usuario por usuario, necesidad, valor, contexto y restricciones
  Y continúa el ciclo story-creation → story-evaluation → story-split → story-improve
```

### AC-2 — Escenario alternativo / error – Rol local ausente
```gherkin
Dado que falta el rol product-owner en skills/story-specify/assets/agents/
Cuando ejecuto /story-specify y el flujo necesita aclarar contexto
Entonces el skill se detiene e informa la ruta del rol que falta
  Pero no modifica el story.md en curso
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Interacción garantizada:** el rol se ejecuta en la sesión del skill, que puede preguntar al usuario (ADR-0014, trade-offs).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-135 — Migrar story-product-owner a rol local

- `skills/story-specify/SKILL.md` menciona `story-product-owner` en varios puntos (orquestación, Dependencias y pasos de invocación); todos deben apuntar al rol local.
- Cubre, para `story-specify`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».
- Cubre, para el entrevistador `product-owner`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».
- Cubre, para `story-specify`, los criterios de salida transversales de la épica:
  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».
  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».
  - «`npm run verify:repository` pasa».
  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».
