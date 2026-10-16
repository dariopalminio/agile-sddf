---
alwaysApply: false
type: story
id: STORY-133
kind: feat
slug: STORY-133-mover-project-ux-a-rol-local-de-project-discovery
title: "Mover project-ux a rol local de project-discovery"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-15
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Mover project-ux a rol local de project-discovery

**Como** Solo Builder y Product Owner que ejecuta `/project-discovery` desde Codex  
**Quiero** que la sesión del skill asuma el rol UX leyendo un rol local en lugar de delegar en el agente global `project-ux`  
**Para** obtener los hallazgos UX del discovery aunque mi runtime no soporte subagentes

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – La sesión del skill asume el rol UX
```gherkin
Dado que existe skills/project-discovery/assets/agents/discovery-ux.md
  Y agents/project-ux.agent.md ya no existe
Cuando ejecuto /project-discovery y el flujo llega al refinamiento UX
Entonces la sesión del skill lee discovery-ux.md y refina perfiles, journeys y navegación con el usuario
  Y los hallazgos se escriben en .tmp/project-discovery/ux-findings.md
  Y el paso de propuesta de requisitos recibe esa misma ruta como $UX_FINDINGS_PATH
```

### AC-2 — Escenario alternativo – Ninguna invocación al agente global
```gherkin
Dado el flujo de /project-discovery migrado
Cuando busco "project-ux" en skills/, agents/, config/ y test/
Entonces no hay ninguna invocación al agente project-ux
  Pero el paso de hallazgos UX de skills/project-discovery/SKILL.md sigue produciendo ux-findings.md dentro de la misma sesión
```

### AC-3 — Escenario de error – Falta el rol local
```gherkin
Dado que skills/project-discovery/assets/agents/discovery-ux.md no existe
Cuando ejecuto /project-discovery y el flujo llega al refinamiento UX
Entonces el skill informa que falta el rol local discovery-ux
  Y termina sin escribir en $SPECS_BASE
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Un solo nivel de delegación:** se cumple ADR-0002 en todo el flujo de `project-discovery`.

## Fuera de alcance (Non-Goals)

- Cambiar el formato o el contenido esperado de `ux-findings.md`.
- Migrar los roles PM y Architect de `project-discovery` (STORY-131 y STORY-132).
- Limpiar copias de `project-ux` ya instaladas en los destinos de runtime de otros proyectos.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-133 — Mover project-ux a rol local de project-discovery

- **Nombre del rol:** `skills/project-discovery/assets/agents/` recibe tres roles. Para evitar colisiones, los archivos se nombran por origen (convención acordada el 2026-10-14 y registrada en ADR-0014): `discovery-pm.md` (STORY-131), `discovery-architect.md` (STORY-132) y `discovery-ux.md` (esta historia).
- **Runtime objetivo:** `codex` es el único runtime de `config/runtimes.json` con `agentsDirectory: null`. Es el caso que valida el SMOKE-1 de la épica.
- **Delegación actual (verificado el 2026-10-14):** hoy no hay delegación anidada sobre `project-ux`. La sesión de `project-discovery` lo invoca directamente en el Paso 5 de `skills/project-discovery/SKILL.md` (un solo nivel), y ningún agente de `agents/` lo invoca. El valor de esta historia es que el rol pase a ser local y portable, no corregir una delegación anidada. Por eso la épica formula la no delegación como restricción y no como corrección: esta historia la respeta porque el rol UX se ejecuta en la sesión del skill (CNF-1).
- Cubre, para `project-discovery`, el criterio de salida de la épica «Ningún subagente local invoca a otro subagente (ADR-0002)».
- Cubre, para `project-discovery`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».
- Cubre, para el entrevistador `ux`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».
- Cubre, para `project-discovery`, los criterios de salida transversales de la épica:
  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».
  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».
  - «`npm run verify:repository` pasa».
  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».
