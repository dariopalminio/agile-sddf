---
alwaysApply: false
type: story
id: STORY-131
kind: feat
slug: STORY-131-partir-project-pm-en-roles-locales
title: "Partir project-pm en roles locales"
status: COMPLETED
substatus: DONE
parent: EPIC-24-agentes-locales-por-skill
created: 2026-10-14
updated: 2026-10-16
related:
  - EPIC-24-agentes-locales-por-skill
---
[[EPIC-24-agentes-locales-por-skill]]

# 📖 Historia: Partir project-pm en roles locales

**Como** Solo Builder y Product Owner que evoluciona `project-begin` y `project-discovery`  
**Quiero** separar `project-pm` en un rol de visión propio de `project-begin` y un rol de discovery propio de `project-discovery`  
**Para** que la entrevista de visión y la de discovery funcionen en cualquier runtime, aunque un subagente no pueda preguntar al usuario, y que los skills instalados no dependan de la carpeta global `agents/`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Cada skill lee su propio rol de PM
```gherkin
Escenario: Cada skill lee su propio rol de PM
  Dado que existe el archivo de rol "<rol>" en "skills/<skill>/assets/agents/"
    Y agents/project-pm.agent.md ya no existe
  Cuando ejecuto "/<skill>"
  Entonces la sesión del skill lee "<rol>" y conduce la entrevista con el usuario
    Pero no invoca a project-pm como subagente
  Ejemplos:
    | skill             | rol             |
    | project-begin     | begin-intent.md |
    | project-discovery | discovery-pm.md |
```

### AC-2 — Escenario alternativo / error – Rol local ausente
```gherkin
Dado que falta el archivo de rol begin-intent en skills/project-begin/assets/agents/
Cuando ejecuto /project-begin
Entonces el skill se detiene e informa la ruta del rol que falta
  Pero no recurre a agents/project-pm.agent.md
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Sin pérdida de instrucciones:** cada sección de `agents/project-pm.agent.md` queda en el rol que indica la tabla. Las secciones transversales van en **ambos** roles. Se comprueba recorriendo la tabla contra los dos archivos de rol.

  | Sección de `project-pm.agent.md` | `begin-intent.md` | `discovery-pm.md` |
  |---|:---:|:---:|
  | Principios de PM | ✓ | ✓ |
  | Protocolo de Resiliencia para Entrevistas Multivuelta | ✓ | ✓ |
  | Estado Visión — Capturar y refinar la visión del producto | ✓ | — |
  | Estado Discovery — Discovery de usuarios y refinamiento | — | ✓ |

- **CNF-2 — Contexto acotado por fase:** cada rol contiene solo la sección de estado de su fase, de modo que cada skill carga menos líneas de instrucciones de PM que las 57 de `agents/project-pm.agent.md` completo.

## 📎 Notas / contexto adicional

Generado automáticamente desde la épica: EPIC-24-agentes-locales-por-skill/epic.md
Historia origen: STORY-131 — Partir project-pm en roles locales

- La sección "Begin Intention" de la épica corresponde a "Estado Visión — Capturar y refinar la visión del producto" de `agents/project-pm.agent.md`; es el contenido que pasa a `begin-intent.md`.
- Los entrevistadores son archivos de rol y no subagentes, porque no está garantizado que un subagente pueda preguntar al usuario (ADR-0014).
- **Nombre del rol de discovery:** los roles de PM, arquitecto y UX quedan juntos en `skills/project-discovery/assets/agents/`. Para que STORY-131, STORY-132 y STORY-133 no escriban el mismo archivo, se nombran por origen (convención acordada el 2026-10-14 y registrada en ADR-0014): `discovery-pm.md` (esta historia), `discovery-architect.md` (STORY-132) y `discovery-ux.md` (STORY-133).
- **Alcance:** además de los `SKILL.md` de `project-begin` y `project-discovery`, se actualizan las menciones a `project-pm` en `skills/project-begin/README.md`, en los comentarios `# escritor:` de `skills/project-begin/assets/vision-template.md` y de su copia central `docs/templates/vision-template.md` (que siguen idénticas, CR-001), y en el párrafo «Excepción documentada — Subagente interactivo» de `docs/guides/harness-eng-agents-orchestration.md:182` (CR-002), para que no apunten a un agente que ya no existe.
- Cubre, para `project-begin` y `project-discovery`, el criterio de salida de la épica «Cada skill que invocaba un agente global tiene sus roles o subagentes locales en `skills/<skill>/assets/agents/`».
- Cubre, para el entrevistador `pm`, el criterio de salida de la épica «Los agentes entrevistadores (`pm`, `architect`, `ux`, `story-mapper`, `product-owner`) son archivos de rol que lee la sesión del skill, no subagentes invocados».
- Cubre, para `project-begin` y `project-discovery`, los criterios de salida transversales de la épica:
  - «Ningún `SKILL.md` de `skills/` referencia `agents/` ni a un agente global fuera de su sección "Dependencias"».
  - «Los `evals/evals.json` de los skills afectados están actualizados y pasan con `npm run test:eval`».
  - «`npm run verify:repository` pasa».
  - «Los skills migrados funcionan en el runtime `codex` (`agentsDirectory: null` en `config/runtimes.json`)».
