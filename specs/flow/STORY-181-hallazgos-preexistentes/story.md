---
alwaysApply: false
type: story
id: STORY-181
kind: feat
slug: STORY-181-hallazgos-preexistentes
title: "Hallazgos preexistentes"
status: IMPLEMENT
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-10
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-180-story-code-review-lee-review-md
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: Hallazgos preexistentes

**Como** Solo Builder que pasa sus historias por el gate `/story-code-review`  
**Quiero** que un defecto en líneas que la historia no tocó se informe como PREEXISTENTE, sin contar para `max-severity` ni entrar en `fix-directives.md`  
**Para** no pagar rondas de corrección por problemas que la historia no introdujo, sin perder la visibilidad de esos defectos

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Un defecto preexistente no bloquea
```gherkin
Dado una historia STORY-NNN en IMPLEMENT/DONE sin defectos propios
  Y su alcance incluye un archivo con un defecto en líneas que la historia no tocó
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces el defecto figura en "code-review-report.md" con la categoría PREEXISTENTE
  Y no cuenta para "max-severity"
  Y el veredicto es APPROVED
  Y no se genera "fix-directives.md"
```

### AC-2 — Escenario alternativo – El mismo defecto en líneas tocadas sí bloquea
```gherkin
Dado una historia STORY-NNN en IMPLEMENT/DONE
  Y un defecto de severidad MEDIUM en una línea que la historia añadió o modificó
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces el hallazgo conserva su severidad MEDIUM y no es PREEXISTENTE
  Y el veredicto es NEEDS-CHANGES
  Y el hallazgo aparece en "fix-directives.md"
```

### AC-3 — Escenario alternativo – No se pueden determinar las líneas tocadas
```gherkin
Dado una historia STORY-NNN cuyas líneas modificadas no se pueden identificar con el método que fija el ADR de la guía de revisión
Cuando el usuario ejecuta "/story-code-review STORY-NNN"
Entonces ningún hallazgo se clasifica como PREEXISTENTE
  Y el informe indica que la clasificación PREEXISTENTE no se aplicó y por qué
  Pero los hallazgos conservan su severidad y el veredicto se calcula como hoy
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Vocabulario:** PREEXISTENTE corresponde a 🟣 Pre-existing de Claude Code Review, con la traducción que fije el ADR de STORY-178.
- **CNF-2 — Contrato del informe:** la categoría se añade a la plantilla `skills/story-code-review/assets/code-review-report-template.md` sin cambiar los valores de `verdict` ni el significado de `max-severity`.
- **CNF-3 — Evals primero:** el caso «hallazgo preexistente» se escribe en `skills/story-code-review/evals/evals.json` antes de cambiar el skill (CS-8).

## Fuera de alcance (Non-Goals)

- Corregir los defectos preexistentes: se informan; su corrección es otra historia o un `BUG-NN`.
- Verificación de evidencia, deduplicación y tope de LOW: STORY-182.

## 📎 Notas / contexto adicional

- Cubre la parte PREEXISTENTE de **CS-4** de EPIC-28 y el escenario **SMOKE-2**.
- **Depende de STORY-178:** el ADR decide cómo identificar las líneas no tocadas (decisión (b) de las notas de la épica); hoy el skill no usa `git diff` y conoce los archivos de la historia por `$IMPL_FILES` (Paso 2c, desde `implement-report.md`).
- **Punto de inserción:** el cálculo de `max_severity` (Paso 4b) y del veredicto (Pasos 4c y 4c.1), y la lista blanca de `fix-directives.md` (Pasos 4e-4f) de `skills/story-code-review/SKILL.md`.
- Implementar después de STORY-180.
