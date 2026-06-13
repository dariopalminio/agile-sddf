---
type: plan
id: plan-4
slug: plan-4-fix-story-code-review
title: "Fix inconsistencia interna en story-code-review — Feature del EPIC-17"
status: DEFINITION
substatus: DONE
parent: EPIC-17
created: 2026-06-13
updated: 2026-06-13
related:
  - EPIC-17-remediating-and-improvement
---

# Plan: Fix inconsistencia interna en story-code-review — Feature del EPIC-17

## Context

El skill `story-code-review` tiene dos modelos mentales en el mismo artefacto:

- **Frontmatter `description`**: dice *"4 subagentes: código, requisitos, integración, seguridad"* — cuenta security-audit como un subagente más y usa nombres genéricos.
- **Body del skill**: lanza en realidad *3 subagentes* (tech-lead-reviewer, product-owner-reviewer, integration-reviewer) más *1 skill compuesto inline* (security-audit). Los subagentes tienen roles oficiales precisos: Inspector de Código, Guardián de Requisitos, Inspector de Integración.

Resultado: quien lee la `description` espera 4 subagentes; quien lee el body ve 3 subagentes + 1 skill. La `description` es la que está equivocada — el body es la implementación real y ya es consistente.

---

## Cambio a realizar

**Archivo:** `.claude/skills/story-code-review/SKILL.md`

**Campo:** `description` en el frontmatter YAML (líneas 3–7 aproximadamente).

**De:**
```yaml
description: >-
  Genera code-review-report.md con revisión multi-agente (4 subagentes: código, requisitos, integración, seguridad).
  Usar después de story-implement como quality gate antes de Done.
  Invocar para "code review", "revisar código", "story-code-review",
  "quality gate post-implement" o "validar implementación".
```

**A:**
```yaml
description: >-
  Genera code-review-report.md con revisión multi-agente: 3 subagentes (Inspector de Código,
  Guardián de Requisitos, Inspector de Integración) + skill security-audit en paralelo.
  Usar después de story-implement como quality gate antes de Done.
  Invocar para "code review", "revisar código", "story-code-review",
  "quality gate post-implement" o "validar implementación".
```

**Qué cambia:**
- "4 subagentes" → "3 subagentes ... + skill security-audit" (modelo correcto)
- Nombres genéricos ("código, requisitos, integración, seguridad") → nombres de rol oficiales del body ("Inspector de Código, Guardián de Requisitos, Inspector de Integración")
- Se preservan intactas las líneas de triggers

---

## Verificación

1. Confirmar que el frontmatter `description` ya no contiene "4 subagentes".
2. Confirmar que los tres roles listados en la description coinciden con los campos `role` de los agentes en `agents/`.
3. Sin cambios en el body ni en los archivos de agentes — solo la description.
