---
alwaysApply: false
type: story
id: STORY-184
kind: feat
slug: STORY-184-review-md-semilla-para-proyectos-consumidores
title: "REVIEW.md semilla para proyectos consumidores"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-08
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-178-adr-guia-de-revision
  - STORY-179-review-md-de-agile-sddf
  - STORY-180-story-code-review-lee-review-md
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: REVIEW.md semilla para proyectos consumidores

**Como** Solo Builder que adopta agile-sddf en su proyecto  
**Quiero** que `/sddf-constitution` cree un `REVIEW.md` inicial desde una plantilla cuando el proyecto no tiene uno, sin sobrescribir uno existente  
**Para** calibrar `/story-code-review` desde el primer día sin tener que conocer la convención de Claude Code Review

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Proyecto sin REVIEW.md
```gherkin
Dado un proyecto que instaló agile-sddf y no tiene "REVIEW.md" en la raíz
Cuando el usuario ejecuta "/sddf-constitution"
Entonces se crea "REVIEW.md" en la raíz desde la plantilla del skill
  Y tiene las secciones "Qué es «Importante» aquí", "Tope de Minor", "No reportar" y "Verificar siempre"
  Y el skill informa "✅ Creado: REVIEW.md"
```

### AC-2 — Escenario alternativo – REVIEW.md ya existe
```gherkin
Dado un proyecto con un "REVIEW.md" en la raíz
Cuando el usuario ejecuta "/sddf-constitution"
Entonces "REVIEW.md" queda byte a byte igual
  Y el skill informa que lo conserva
  Pero el resto del flujo (constitución y DoD por etapa) continúa como hoy
```

### AC-3 — Escenario alternativo – Ejecución repetida
```gherkin
Dado un proyecto sin "REVIEW.md"
Cuando el usuario ejecuta "/sddf-constitution" dos veces
Entonces la primera ejecución crea "REVIEW.md"
  Y la segunda no lo modifica
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Plantilla única:** la plantilla vive en `skills/sddf-constitution/assets/` con el mismo contenido que `docs/templates/REVIEW-template.md`, y es de solo lectura como las demás plantillas del skill.
- **CNF-2 — Publicación:** la plantilla se publica en npm porque `package.json › files` incluye `skills/`; el `REVIEW.md` de la raíz de agile-sddf no se publica.
- **CNF-3 — Evals primero:** los casos «crea `REVIEW.md`» y «no sobrescribe `REVIEW.md`» se escriben en `skills/sddf-constitution/evals/evals.json` antes de cambiar el skill (principio 11 de la constitución). El skill aún no tiene `evals/`: esta historia lo crea.
- **CNF-4 — Idioma y codificación:** español, UTF-8 sin BOM y sin caracteres invisibles.

## Fuera de alcance (Non-Goals)

- Rellenar `REVIEW.md` con los riesgos reales del proyecto: la semilla conserva los placeholders de la plantilla para que los edite el usuario.
- El `REVIEW.md` de agile-sddf: STORY-179.

## 📎 Notas / contexto adicional

- Cubre **CS-6** de EPIC-28 y el escenario **SMOKE-4**.
- **Comportamiento análogo:** `sddf-constitution` ya crea los `dod-story-<etapa>.md` que faltan desde `assets/dod-story/` y nunca los sobrescribe (Paso «Crea los archivos `dod-story-<etapa>.md` que falten» de `skills/sddf-constitution/SKILL.md`). La semilla de `REVIEW.md` sigue esa regla.
- **Ubicación:** `REVIEW.md` va en la raíz por convención de la herramienta, como `AGENTS.md` y `CLAUDE.md`, según el ADR de STORY-178.
- Implementar después de STORY-180, para que la semilla tenga efecto en `/story-code-review`.
