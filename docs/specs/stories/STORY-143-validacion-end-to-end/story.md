---
alwaysApply: false
type: story
id: STORY-143
kind: chore
slug: STORY-143-validacion-end-to-end
title: "Validación end-to-end"
status: SPECIFY
substatus: IN-PROGRESS
parent: EPIC-25-unificar-contrato-de-validaciones-en-skills
created: 2026-10-17
updated: 2026-10-17
related:
  - EPIC-25-unificar-contrato-de-validaciones-en-skills
  - STORY-138
  - STORY-139
  - STORY-140
  - STORY-141
  - STORY-142
  - STORY-144
  - STORY-145
---
[[EPIC-25-unificar-contrato-de-validaciones-en-skills]]

# 📖 Historia: Validación end-to-end

**Como** mantenedor de Agile-SDDF que prepara una release del framework  
**Quiero** comprobar que los seis reportes de validación cumplen el contrato y que el README lo enlaza como fuente de verdad  
**Para** que ningún consumidor encuentre variantes del vocabulario de veredictos después de publicar

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Los seis reportes cumplen el contrato
```gherkin
Dado los skills epic-analyze, story-evaluation, story-analyze, story-code-review, story-verify y story-acceptance alineados con el contrato
Cuando se generan sus reportes sobre artefactos de ejemplo
Entonces cada reporte tiene "## Veredicto" como primera sección tras el título
  Y cada uno declara en "verdict" un valor que la política permite para su skill
```

### AC-2 — Escenario alternativo — Variante heredada detectada
```gherkin
Dado el repositorio con las seis alineaciones aplicadas
Cuando se buscan "APROBADA", "Aprobada", "review-status" y el valor "approved" en skills, templates y documentación vigente
Entonces no se encuentra ninguna coincidencia
  Pero los artefactos históricos de docs/specs/ y las versiones ya publicadas del CHANGELOG quedan excluidos de la búsqueda
```

### AC-3 — Escenario de documentación — README como punto de entrada
```gherkin
Dado el README del framework
Cuando un consumidor busca cómo leer el resultado de un gate
Entonces el README enlaza docs/policies/validation-contract-policy.md como fuente de verdad del contrato de validación
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Repetible:** la búsqueda de variantes de AC-2 se puede repetir sin juicio humano (por ejemplo, como comprobación determinista dentro de `npm run verify:repository`).

## Fuera de alcance (Non-Goals)

- Cambiar el comportamiento de los skills: solo verifica y documenta.
- Migrar reportes históricos.

## 📎 Notas / contexto adicional

- **Dependencias:** depende de que STORY-139, STORY-140, STORY-141, STORY-142, STORY-144 y STORY-145 estén completas. Es la última historia de la épica.
- **Riesgo de falsos positivos en AC-2:** «approved» es una palabra inglesa común (por ejemplo, en skills heredados en inglés como `test-cypress-cucumber`). La búsqueda debe apuntar al uso como valor de veredicto (`review-status: approved`, `verdict: approved`), no a la palabra suelta. El criterio exacto se decide en el diseño.
- **Decisión de diseño:** convertir la búsqueda en un chequeo del gate determinista (`scripts/verify-*.js`) o hacerla con evals por skill (`npm run test:eval`).
- Cubre el criterio de salida de EPIC-25: **CS-2** — Los seis skills de validación (`epic-analyze`, `story-evaluation`, `story-analyze`, `story-code-review`, `story-verify`, `story-acceptance`) tienen una sección `## Veredicto` como primera sección tras el título en sus templates de reporte.
- Cubre el criterio de salida de EPIC-25: **CS-3** — Los seis templates de reporte declaran `verdict` en el frontmatter con valores del vocabulario controlado.
- Cubre el criterio de salida de EPIC-25: **CS-10** — No existe ninguna variante `APROBADA`, `Aprobada`, `review-status` ni el valor de veredicto `approved` en skills, templates ni documentación vigente del framework (se excluyen los artefactos históricos de `docs/specs/` y las versiones publicadas del CHANGELOG).
- Cubre el criterio de salida de EPIC-25: **CS-11** — El README del framework apunta a `docs/policies/validation-contract-policy.md` como fuente de verdad del contrato de validación.
- Verifica SMOKE-1 y SMOKE-3.
