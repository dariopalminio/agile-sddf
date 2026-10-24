---
alwaysApply: false
type: story
id: STORY-131
kind: feat
slug: STORY-131-partir-project-pm-en-roles-locales
title: "Partir project-pm en roles locales"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-14
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Partir project-pm en roles locales

**Como** mantenedor de Agile-SDDF que evoluciona `project-begin` y `project-discovery`  
**Quiero** separar `project-pm` en el rol `begin-intent` de `project-begin` y el rol `discovery` de `project-discovery`  
**Para** que cada skill cargue solo las instrucciones de PM de su fase y funcione sin la carpeta global `agents/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Cada skill lee su propio rol de PM
```gherkin
Dado que existen skills/project-begin/assets/agents/begin-intent.md y el rol de PM en skills/project-discovery/assets/agents/
  Y agents/project-pm.agent.md ya no existe
Cuando ejecuto /project-begin y luego /project-discovery
Entonces la sesión de cada skill lee su archivo de rol y conduce la entrevista con el usuario
  Y ningún skill invoca a project-pm como subagente
```

### AC-2 — Escenario alternativo / error – Rol local ausente
```gherkin
Dado que falta el archivo de rol begin-intent en skills/project-begin/assets/agents/
Cuando ejecuto /project-begin
Entonces el skill se detiene e informa la ruta del rol que falta
  Pero no recurre a agents/project-pm.agent.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin pérdida de instrucciones:** todo principio y protocolo de `project-pm` (incluido el protocolo de resiliencia para entrevistas multivuelta) queda en al menos uno de los dos roles.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-131 — Partir project-pm en roles locales

- La épica habla de la sección "Begin Intention", pero hoy `agents/project-pm.agent.md` la titula "Estado Visión — Capturar y refinar la visión del producto". Confirmar la correspondencia al especificar.
- Los entrevistadores son archivos de rol y no subagentes, porque no está garantizado que un subagente pueda preguntar al usuario (ADR-0014).
