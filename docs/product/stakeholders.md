---
type: product
slug: stakeholders
title: "Stakeholders"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-09-22
updated: 2026-10-10
---

# Stakeholders

## Usuarios y roles

- **US-001**: Desarrollador (Cloud) / Developer (Cloud)
    - **Descripción**: Desarrollador o freelancer que usa un runtime de IA para crear software con suscripción (Claude, Codex, Github Copilot).
      Necesita estructurar su proceso sin overhead metodológico. Invoca skills directamente desde el
      CLI del agente de IA y trabaja normalmente una historia a la vez.

- **US-002**: Equipo Ágil
    - **Descripción**: Equipo que adopta el framework para estandarizar la especificación y la
      implementación. Usa el pipeline de proyecto y de épicas para generar un backlog compartido que
      sirve de fuente de verdad. Cada miembro puede usar el runtime que prefiera.

- **US-003**: Product Owner / Analista de Negocio
    - **Descripción**: Responsable de la calidad de las historias. Usa `story-specify`,
      `story-evaluation`, `story-split` e `story-improve` para garantizar que las historias cumplen
      la rúbrica FINVEST antes de entrar a planning, y `story-acceptance` para la validación humana
      final.

- **US-004**: Arquitecto de Software
    - **Descripción**: Rol representado por el agente `project-architect`. Conduce la entrevista de
      requisitos, extrae las historias y planifica las épicas con criterio de priorización (valor de
      negocio → dependencias → riesgo técnico → esfuerzo). También consume `story-design` y
      `project-context-diagram`.

- **US-005**: Mantenedor del Framework
    - **Descripción**: Quien evoluciona el propio SDDF. Usa el framework sobre sí mismo
      (*dogfooding*): las capacidades nuevas del framework se especifican como historias en
      `docs/specs/03-stories/` y se implementan con `story-implement`. Necesita además `security-audit`,
      los `evals/evals.json` de cada skill y el runbook de publicación en npm.

- **US-006**: Agente de IA consumidor
    - **Descripción**: No es una persona: es el propio LLM que opera dentro del runtime. Lee
      `docs/index.md` como cursor de entrada, abre solo los nodos que necesita y escribe artefactos
      conformes al template activo. Es el usuario para el que están escritos el frontmatter, los
      wikilinks y el contrato `.tmp/<skill-name>/`.

## Patrocinadores y decisores

[Por completar: quién aprueba, financia o prioriza]

## Intereses y conflictos

[Por completar: qué espera cada parte y dónde chocan esas expectativas]

Volver al mapa: [[index]].
