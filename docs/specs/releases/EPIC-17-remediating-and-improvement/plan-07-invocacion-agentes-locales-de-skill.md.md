---
type: plan
id: plan-7
slug: plan-7-invocacion-agentes-locales-de-skill
title: "Contrato explícito de invocación de agentes locales de skill — Feature del EPIC-17"
status: DEFINITION
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: A4 — Contrato explícito de invocación de agentes locales de skill — Feature del EPIC-17

## Context

5 skills tienen directorios `agents/` con agentes locales (no registrados por el harness — solo `.claude/agents/` lo está): `security-audit` (3), `story-code-review` (3), `story-verify` (1), `skill-master` (3, formato upstream) y `story-improve` (vacío). Los SKILL.md dicen "Invocar `agents/x.agent.md`" sin especificar el mecanismo — funciona por inferencia del modelo, no por contrato. El patrón de *comunicación* (output a `.tmp/<skill>/`) sí está documentado en `docs/knowledge/guides/best-practices-for-skills.md`, pero el patrón de *invocación* no existe en ningún documento.

**Decisiones del usuario:** formalizar con ADR-0002 + protocolo en best-practices-for-skills.md + bloque breve en cada SKILL.md; dejar `skill-master/agents/` como está (heredado de upstream anthropics/skills).

### El contrato a formalizar

> **Invocación de agente local:** para lanzar `agents/<nombre>.agent.md`, el skill orquestador (sesión principal):
> 1. **Lee** el archivo del agente con `Read`.
> 2. **Lanza un subagente** vía Agent tool con `subagent_type: general-purpose`, cuyo prompt es: el contenido íntegro del archivo del agente + un **bloque de contexto** con las variables resueltas que el agente necesita (`$STORY_DIR`, `$SPECS_BASE`, rutas de input...). Nunca el contexto completo de la sesión (anti teléfono-descompuesto).
> 3. El subagente **escribe su resultado** en la ruta declarada en el frontmatter `output:` del agente (bajo `.tmp/<skill-name>/`) y devuelve el control.
> 4. El orquestador **lee solo los outputs** de `.tmp/<skill-name>/` para consolidar.
>
> Los agentes locales son archivos de instrucciones, no tipos registrados: no aparecen como `subagent_type` y solo el skill dueño los invoca.

---

## Cambios

### 1. `docs/adr/ADR-0002-invocacion-agentes-locales-de-skill.md` (nuevo)
ADR estado ACCEPTED siguiendo `docs/adr/adr-template.md`:
- **Contexto:** hallazgo A4 — invocación por inferencia, sin contrato.
- **Decisión:** el contrato de 4 pasos de arriba.
- **Rationale:** un agente local es un prompt empaquetado, no infraestructura; usar general-purpose mantiene KISS (principio 4) y el bundle de contexto explícito cumple el principio 6 (anti teléfono-descompuesto); coherente con la regla "un solo salto de delegación".
- **Alternativas descartadas:** (a) registrar todos los agentes locales en `.claude/agents/` — contamina el espacio global con agentes de uso exclusivo de un skill y rompe el empaquetado autocontenido del skill; (b) inlining de las instrucciones del agente dentro del SKILL.md — infla el contexto del orquestador y elimina el aislamiento; (c) dejar la inferencia — funciona hoy pero es frágil ante modelos/harness futuros.
- **Referencias:** `[[EPIC-17-remediating-and-improvement]]`, best-practices-for-skills.md, harness-engineering.md.

### 2. `docs/adr/README.md` — agregar ADR-0002 a la tabla índice.

### 3. `docs/index.md` — agregar wikilink `[[ADR-0002-invocacion-agentes-locales-de-skill]]` en la sección "Decisiones de arquitectura".

### 4. `docs/knowledge/guides/best-practices-for-skills.md` — nueva sección
Insertar después de la sección "Patrón de comunicación inter-agente: `.tmp/<skill>/`" (líneas ~76-107) la sección **"Patrón de invocación de agentes locales (`<skill>/agents/`)"** con:
- Cuándo usar un agente local vs. un agente registrado en `.claude/agents/` (local = uso exclusivo del skill, viaja empaquetado con él; registrado = reutilizable por varios skills/sesión)
- El contrato de 4 pasos (texto canónico)
- Formato del archivo agente: frontmatter `name`, `description`, `role`, `output` + instrucciones en el body
- Nota: ambos patrones (invocación + comunicación `.tmp/`) son las dos mitades del mismo contrato; referencia a ADR-0002

### 5. Bloque estándar en los 3 SKILL.md afectados
En `security-audit`, `story-code-review` y `story-verify`, insertar una sola vez (antes del primer paso que lanza agentes) el bloque breve:

> **Mecanismo de invocación:** cada agente local se lanza leyendo su archivo `agents/<nombre>.agent.md` y creando un subagente `general-purpose` cuyo prompt es el contenido del archivo más el bloque de contexto con las variables resueltas. El subagente escribe en el `output:` declarado en su frontmatter y devuelve el control. Ver contrato completo en `docs/knowledge/guides/best-practices-for-skills.md` (ADR-0002).

No repetir el contrato completo — una frase + referencia (evita el anti-patrón del párrafo de preflight copiado 30 veces).

`skill-master` no se toca (decisión: heredado de upstream, el contrato lo cubre genéricamente).

### 6. Eliminar `story-improve/agents/` (directorio vacío).

### 7. Trazabilidad: marcar A4 `[x]` en `docs/specs/releases/EPIC-17-remediating-and-improvement/release.md` con nota de resolución.

---

## Verificación

1. `ls docs/adr/` incluye ADR-0002; su tabla en README.md y el wikilink en index.md existen.
2. `grep -n "general-purpose" .claude/skills/{security-audit,story-code-review,story-verify}/SKILL.md` — cada uno tiene el bloque de mecanismo exactamente una vez.
3. `grep -n "Patrón de invocación" docs/knowledge/guides/best-practices-for-skills.md` — sección presente.
4. `Test-Path .claude/skills/story-improve/agents` → False.
5. Los frontmatter `output:` de los 7 agentes locales (.agent.md) apuntan a `.tmp/<skill-name>/` — consistencia con el contrato (solo verificación, sin cambios esperados).

## Reporte de implementación

Plan-07 (A4) implementado y verificado. El mecanismo de invocación de agentes locales pasó de inferencia a contrato explícito:

Contrato formalizado (4 pasos): leer agents/<nombre>.agent.md con Read → lanzar subagente general-purpose con el contenido del archivo + bloque de contexto con variables resueltas (nunca el contexto completo de la sesión) → el subagente escribe en el output: declarado en su frontmatter bajo .tmp/<skill>/ → el orquestador consolida leyendo solo esos outputs.

Dónde quedó documentado:

ADR-0002 — la decisión, con 3 alternativas descartadas (registrar en .claude/agents/, inlining en SKILL.md, mantener inferencia). Indexado en adr/README.md y docs/index.md.
best-practices-for-skills.md:109 — nueva sección "Patrón de invocación de agentes locales" junto al patrón .tmp/ (las dos mitades del mismo contrato), con la tabla local vs. registrado y el formato del archivo agente.
Los 3 SKILL.md afectados (security-audit, story-code-review, story-verify) tienen el bloque de mecanismo exactamente una vez cada uno — frase breve + referencia, sin duplicar el contrato completo.
Además:

story-improve/agents/ (vacío) eliminado.
La verificación detectó que qa-engineer.agent.md no declaraba output: en su frontmatter — corregido (output: .tmp/story-verify/qa-output.json) y de paso eliminé su invocable: false (metadata muerta según la normalización de plan-05). Los otros 6 agentes locales ya cumplían.
skill-master/agents/ intacto (formato upstream de anthropics/skills, según lo decidido).
plan-07 marcado [x] en EPIC-17 con nota de resolución.
