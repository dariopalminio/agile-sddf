---
alwaysApply: false
type: story
id: STORY-135
kind: feat
slug: STORY-135-migrar-story-product-owner-a-rol-local
title: "Migrar story-product-owner a rol local"
status: CODE-REVIEW
substatus: IN-PROGRESS
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

### AC-3 — Escenario de cierre – Retiro de la carpeta global agents/
```gherkin
Dado que STORY-129 y STORY-131 a STORY-134 están implementadas
  Y tras migrar story-product-owner, git ls-files "agents/*.agent.md" no lista ningún archivo
Cuando retiro la carpeta agents/ del paquete
Entonces agents/ no existe en el repositorio y "agents/" no figura en package.json → files
  Y npx agile-sddf install --target termina con código 0 para cada runtime de config/runtimes.json
  Y npm run verify:repository pasa
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Interacción garantizada:** el rol se ejecuta en la sesión del skill, que puede preguntar al usuario (ADR-0014, trade-offs).

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-135 — Migrar story-product-owner a rol local

- `skills/story-specify/SKILL.md` menciona `story-product-owner` en varios puntos (orquestación, Dependencias y pasos de invocación); todos deben apuntar al rol local.
- **Cierre de la épica (AC-3):** como última migración del orden sugerido, esta historia asume el retiro de `agents/`, que la épica había dejado como chore sin historia propia. El retiro consiste en eliminar `agents/`, quitar `"agents/"` de `package.json` → `files` y adaptar las pruebas que exigen la carpeta: `test/install.test.js:126`, que lee `agents/` del repo, y `assertSameTree` en `scripts/smoke-package-install.js:226,236`. El instalador ya omite la copia cuando falta la fuente (`copyDir` en `scripts/install.js:104`), así que `agentsDirectory: "agents"` se mantiene en `config/runtimes.json`. Se implementa después de STORY-129 y STORY-131 a STORY-134.
- Cubre, como cierre de la épica, el criterio de salida «La carpeta `agents/` queda vacía y se elimina como consecuencia de la migración (ADR-0014, Regla 2), `package.json` → `files` no incluye `agents/`, y `npx agile-sddf install --target <runtime>` termina con código 0 para cada runtime de `config/runtimes.json`».
- Cubre, para `story-specify`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».
- Cubre, para el entrevistador `product-owner`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».
- Cubre, para `story-specify`, los criterios de salida transversales de la épica:
  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».
  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».
  - «`npm run verify:repository` pasa».
  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».
