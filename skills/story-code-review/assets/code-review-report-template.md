---
type: code-review-report
story: {{STORY_ID}}
title: "Code Review Report: {{STORY_TITLE}}"
review-status: {{REVIEW_STATUS}}
date: {{DATE}}
max-severity: {{MAX_SEVERITY}}
reviewers:
  - tech-lead-reviewer
  - product-owner-reviewer
  - integration-reviewer
  - security-reviewer
---

# Code Review Report: {{STORY_ID}}

## Resumen

| Campo | Valor |
|-------|-------|
| Historia | {{STORY_ID}} — {{STORY_TITLE}} |
| Review status | {{REVIEW_STATUS}} |
| Severidad máxima detectada | {{MAX_SEVERITY}} |
| Revisores | Tech-Lead-Reviewer, Product-Owner-Reviewer, Integration-Reviewer, Security-Reviewer |
| testcases.md | {{TESTCASES_STATUS}} |
| Fecha | {{DATE}} |

---

## Hallazgos por dimensión

### Calidad de Código (Tech-Lead-Reviewer)

{{TECH_LEAD_FINDINGS}}

---

### Cobertura de Requisitos (Product-Owner-Reviewer)

{{PRODUCT_OWNER_FINDINGS}}

---

### Integración y Arquitectura (Integration-Reviewer)

{{INTEGRATION_FINDINGS}}

---

### Seguridad (Security-Reviewer)

{{SECURITY_FINDINGS}}

---

### Nota de Tamaño de Cambio

{{CHANGE_SIZE_NOTE}}

---

### Cobertura de Casos de Prueba (testcases.md)

{{TESTCASES_COVERAGE_SECTION}}

---

## Decisión final

**review-status: {{REVIEW_STATUS}}**

{{DECISION_RATIONALE}}

---

## Siguiente acción

{{NEXT_ACTION}}

---

## Cumplimiento DoD — Fase CODE-REVIEW

<!-- Si $DOD_CODE_REVIEW_CRITERIA estaba vacío, mostrar el aviso de abajo y omitir la tabla -->
<!-- Si hay criterios evaluados, completar la tabla con resultados de $DOD_CODE_REVIEW_RESULT -->

{{DOD_CODE_REVIEW_SECTION}}
