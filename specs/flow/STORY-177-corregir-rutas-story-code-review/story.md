---
alwaysApply: false
type: story
id: STORY-177
kind: fix
slug: STORY-177-corregir-rutas-story-code-review
title: "Corregir rutas de story-code-review"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-08
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: Corregir rutas de story-code-review

**Como** Solo Builder que ejecuta `/story-code-review` como gate tras implementar una historia  
**Quiero** que los cuatro revisores dejen sus informes en `.tmp/story-code-review/{story_id}/`, la ruta que lee el orquestador, y que el Security-Reviewer encuentre los checklists de seguridad en `docs/guardrails/`  
**Para** que el veredicto se base en los cuatro informes de la historia revisada y en las reglas de seguridad del proyecto, sin depender de que el agente concilie rutas contradictorias ni de los enlaces de `constitution.md`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Los informes parciales quedan en el directorio de la historia
```gherkin
Dado una historia "STORY-NNN" en IMPLEMENT/DONE
Cuando el usuario ejecuta /story-code-review STORY-NNN
Entonces existen "tech-lead-report.md", "product-owner-report.md", "integration-report.md" y "security-report.md" en ".tmp/story-code-review/STORY-NNN/"
  Y ninguno de esos cuatro archivos se escribe directamente en ".tmp/story-code-review/"
```

### AC-2 — Escenario principal – Checklists de seguridad descubiertos en docs/guardrails/
```gherkin
Dado un proyecto con "docs/guardrails/gr-code-security-checklist.md"
  Y una "docs/constitution.md" que no enlaza ese checklist
Cuando el Security-Reviewer audita la historia "STORY-NNN"
Entonces "security-report.md" cita "gr-code-security-checklist.md" como fuente de reglas
  Y no declara haber aplicado el baseline embebido
```

### AC-3 — Escenario alternativo – Proyecto sin checklists de seguridad
```gherkin
Dado un proyecto sin archivos "docs/guardrails/gr-*security*"
Cuando el Security-Reviewer audita la historia "STORY-NNN"
Entonces "security-report.md" declara que aplicó el baseline embebido
  Pero la revisión termina y genera "code-review-report.md" con su veredicto
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Una sola ruta declarada:** el `SKILL.md` de `story-code-review` y los cuatro agentes declaran la misma ruta de informe parcial y la misma ubicación de checklists de seguridad; ninguno menciona `docs/policies/*security-checklist*.md`.

- **CNF-2 — Evals primero (principio 11):** `skills/story-code-review/evals/evals.json` incluye casos que cubren AC-1, AC-2 y AC-3 antes de modificar el skill; `npm run verify:repository` y `npm test` pasan.

## Fuera de alcance (Non-Goals)

- Mantener `docs/policies/` como ruta heredada de los checklists: el layout legado lo diagnostica `/skill-preflight` (ADR-0019).
- Leer `REVIEW.md`, la categoría PREEXISTENTE, la deduplicación, el tope de LOW y la retirada de las reglas propias de agile-sddf de los agentes: son otras historias de EPIC-28.
- Cambiar el contrato de `code-review-report.md` (frontmatter, secciones y veredicto).

## 📎 Notas / contexto adicional

- **Defecto verificado (2026-11-08):** `SKILL.md` limpia y lee `.tmp/story-code-review/{story_id}/`, pero el `output:` y el cuerpo de `tech-lead-reviewer`, `product-owner-reviewer`, `integration-reviewer` y `security-reviewer` (en `skills/story-code-review/agents/`) apuntan a `.tmp/story-code-review/<rol>-report.md`, sin el directorio de la historia.
- **Checklists:** `security-reviewer.agent.md` y la sección del Auditor de Seguridad de `SKILL.md` buscan `docs/policies/*security-checklist*.md`, que no existe; los checklists reales son `docs/guardrails/gr-code-security-checklist.md` y `docs/guardrails/gr-ai-security-checklist.md`, y hoy solo se encuentran a través de los enlaces de `constitution.md`.
- Corresponde al criterio de salida **CS-7** de EPIC-28. La épica admite tramitarla como `BUG-NN` si se quiere resolver antes de activarla.
