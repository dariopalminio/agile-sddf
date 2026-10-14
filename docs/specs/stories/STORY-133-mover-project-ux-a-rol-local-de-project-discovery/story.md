---
alwaysApply: false
type: story
id: STORY-133
kind: feat
slug: STORY-133-mover-project-ux-a-rol-local-de-project-discovery
title: "Mover project-ux a rol local de project-discovery"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-14
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Mover project-ux a rol local de project-discovery

**Como** practitioner que ejecuta `/project-discovery` con refinamiento UX  
**Quiero** que `project-ux` sea un archivo de rol que lee la sesión de `project-discovery`  
**Para** que el refinamiento UX funcione en cualquier runtime y no haya delegación de subagente a subagente

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – La sesión del skill asume el rol UX
```gherkin
Dado que existe el rol UX en skills/project-discovery/assets/agents/
  Y agents/project-ux.agent.md ya no existe
Cuando ejecuto /project-discovery y el flujo llega al refinamiento UX
Entonces la sesión del skill lee el rol UX y refina perfiles, journeys y navegación con el usuario
  Y los hallazgos se escriben en la ruta inyectada que usaba project-ux
```

### AC-2 — Escenario alternativo / error – Sin delegación anidada
```gherkin
Dado el flujo de /project-discovery migrado
Cuando reviso las instrucciones del skill y de sus roles locales
Entonces ninguna instrucción pide a un subagente que invoque a otro subagente
  Pero el refinamiento UX sigue ocurriendo dentro de la misma sesión
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Un solo nivel de delegación:** se cumple ADR-0002 en todo el flujo de `project-discovery`.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-133 — Mover project-ux a rol local de project-discovery

- Cubre el criterio de salida "Ningún subagente delega en otro subagente" de la épica.
- Al especificar, ubicar con precisión dónde ocurre hoy la delegación anidada: `agents/project-ux.agent.md` declara "no delegas trabajo", así que el anidamiento está en quien lo invoca.
