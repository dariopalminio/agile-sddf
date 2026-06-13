---
type: adr
id: ADR-0002
slug: invocacion-agentes-locales-de-skill
title: "Contrato de invocación de agentes locales de skill"
status: ACCEPTED
date: 2026-06-12
supersedes: null
superseded-by: null
---

# ADR-0002: Contrato de invocación de agentes locales de skill

## Contexto y problema

Varios skills empaquetan agentes propios en su directorio `agents/` (`security-audit`, `story-code-review`, `story-verify`, `skill-master`). Estos agentes **no son tipos registrados por el harness** — solo los de `.claude/agents/` lo son. Los SKILL.md decían "Invocar `agents/tech-lead-reviewer.agent.md`" sin especificar el mecanismo: la ejecución funcionaba por inferencia del modelo, no por contrato. El patrón de *comunicación* de resultados (`.tmp/<skill>/`) estaba documentado, pero el patrón de *invocación* no existía en ningún documento. Origen: hallazgo A4 de EPIC-17 (remediating-and-improvement).

## Decisión

**Los agentes locales se invocan con un contrato explícito de 4 pasos.** Para lanzar `agents/<nombre>.agent.md`, el skill orquestador (sesión principal):

1. **Lee** el archivo del agente con `Read`.
2. **Lanza un subagente** vía Agent tool con `subagent_type: general-purpose`, cuyo prompt es: el contenido íntegro del archivo del agente + un **bloque de contexto** con las variables resueltas que el agente necesita (`$STORY_DIR`, `$SPECS_BASE`, rutas de input...). Nunca el contexto completo de la sesión.
3. El subagente **escribe su resultado** en la ruta declarada en el frontmatter `output:` del agente (bajo `.tmp/<skill-name>/`) y devuelve el control.
4. El orquestador **lee solo los outputs** de `.tmp/<skill-name>/` para consolidar.

Los agentes locales son archivos de instrucciones, no infraestructura: no aparecen como `subagent_type` del harness y solo el skill dueño los invoca.

## Rationale

- **Un agente local es un prompt empaquetado, no infraestructura.** Usar `general-purpose` como vehículo mantiene KISS (constitución, principio 4): no se agregan tipos de agente al harness para uso exclusivo de un skill.
- **El bundle de contexto explícito cumple el principio 6** (anti teléfono-descompuesto): el subagente recibe solo lo que necesita y escribe su resultado de forma independiente.
- **Coherente con la regla "un solo salto de delegación":** el orquestador (sesión principal) lanza al subagente; el agente local nunca delega en otro.
- **Portabilidad del skill:** el agente viaja empaquetado con el skill (npm), sin depender del registro global de agentes del proyecto destino.

## Alternativas consideradas

- **Registrar todos los agentes locales en `.claude/agents/`:** descartada — contamina el espacio global con agentes de uso exclusivo de un skill y rompe el empaquetado autocontenido (un skill instalado parcialmente dejaría agentes huérfanos o faltantes).
- **Inlining de las instrucciones del agente dentro del SKILL.md:** descartada — infla el contexto del orquestador con instrucciones que solo el subagente necesita y elimina el aislamiento de contexto que motiva la delegación.
- **Mantener la invocación por inferencia:** descartada — funciona hoy porque el modelo deduce el mecanismo, pero es frágil ante harness/modelos futuros y viola el principio de patrones predecibles (constitución, principio 8).

## Consecuencias

**Positivas:**
- El mecanismo es contrato verificable, no convención implícita: cualquier agente (o humano) que lea el SKILL.md sabe exactamente cómo se lanza un agente local.
- El protocolo completo vive en un solo lugar (`docs/knowledge/guides/best-practices-for-skills.md`); los SKILL.md solo lo referencian con una frase — sin duplicación masiva.
- Distinción clara entre agente local (uso exclusivo, empaquetado con el skill) y agente registrado (`.claude/agents/`, reutilizable).

**Negativas / trade-offs:**
- `skill-master/agents/` (heredado de anthropics/skills, formato `.md` sin frontmatter `.agent.md`) queda fuera de la normalización de formato para no romper la correspondencia con upstream — el contrato genérico lo cubre igualmente.
- Los subagentes `general-purpose` no tienen restricción de herramientas declarada por agente (a diferencia de los registrados con `tools:`); la restricción debe expresarse en las instrucciones del propio agente.

## Referencias

- [[EPIC-17-remediating-and-improvement]] — hallazgo A4
- `docs/knowledge/guides/best-practices-for-skills.md` — protocolo paso a paso y patrón `.tmp/<skill>/`
- `docs/knowledge/guides/harness-engineering.md` — modelo de delegación y relaciones permitidas
- [[ADR-0001-centralizar-templates-compartidos]]
