---
alwaysApply: false
type: story
id: STORY-124
kind: feat
slug: STORY-124-validar-preparacion-estructural-epica
title: "Validar la preparación estructural de una épica"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-12
updated: 2026-10-28
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-125
  - STORY-126
  - STORY-127
  - STORY-128
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Validar la preparación estructural de una épica

**Como** Solo Builder y mantenedor de Agile-SDDF que prepara una épica para su liberación  
**Quiero** obtener un veredicto de preparación basado en el cierre de sus historias y en el análisis de la épica  
**Para** identificar de forma objetiva los impedimentos antes de que la épica avance en su ciclo de vida

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Validación estructural aprobada
```gherkin
Dado una épica existente cuyas historias hijas están cerradas
  Y cuyo análisis declara el veredicto APPROVED
Cuando el mantenedor solicita validar la épica por su identificador o ruta
Entonces se escribe epic-validate-report.md desde su plantilla con el veredicto APPROVED en su primera sección
  Y en el campo verdict del frontmatter
```

### AC-2 — Escenario alternativo — Hallazgo de evidencia estructural incompleta
```gherkin
Dado una épica con una historia hija no terminal o un análisis sin APPROVED
Cuando el mantenedor solicita validar la épica
Entonces el reporte declara BLOCKED e identifica cada historia no terminal con su estado, o el análisis con su veredicto
```

### AC-3 — Escenario de error — Épica inexistente
```gherkin
Dado un identificador o ruta que no corresponde a una épica
Cuando el mantenedor solicita validarla
Entonces recibe un error con la ubicación buscada y no se crea un reporte
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Resolución portable:** la validación resuelve la raíz de artefactos con la precedencia vigente de SDDF antes de localizar la épica.
- **CNF-2 — Reporte legible:** el reporte muestra el veredicto y los resultados de las comprobaciones realizadas sin dejar marcadores de plantilla; la plantilla declara en cada sección su marcador y tiene `## Veredicto` como primera sección tras el título.

## 🚫 Fuera de alcance

- Ejecutar smoke tests, el comando de verificación de release o el checklist DoD.
- Cambiar el estado de la épica o de cualquiera de sus historias.
- Integrar el veredicto en la transición del ciclo de vida.

## 📎 Notas / contexto adicional

- Esta es la historia core del split de STORY-124. Conserva el directorio e ID originales.
- El informe FINVEST de la historia original decidió `DIVIDIR`; su evidencia se conserva en este directorio.
- El reporte de validación establece un veredicto binario a partir de los hallazgos de esta historia. Las comprobaciones adicionales se incorporan en STORY-125.
- Cubre el criterio de salida de EPIC-23: **CS-1** — `skills/epic-validate/SKILL.md` existe, resuelve solo `REPO_ROOT` y declara `<!-- SDDF-FIXED-LAYOUT: v1 -->` (ADR-0017).
- Cubre el criterio de salida de EPIC-23: **CS-2** — `skills/epic-validate/assets/epic-validate-report-template.md` existe, declara en cada sección su marcador `sección obligatoria · clave · escritor` y tiene `## Veredicto` como primera sección tras el título.
- Cubre el criterio de salida de EPIC-23: **CS-3** — Se verifican el estado terminal de las historias y el veredicto APPROVED del análisis de la épica.
- Cubre el criterio de salida de EPIC-23: **CS-5** — El reporte se genera desde su plantilla sin marcadores sin resolver, declara el veredicto en su primera sección y en el campo `verdict` del frontmatter con el vocabulario único `APPROVED`, `NEEDS-CHANGES` o `BLOCKED`.
- Cubre el criterio de salida de EPIC-23: **CS-6** — Una épica inexistente informa la ruta buscada y no genera reporte.
- Cubre SMOKE-2 de EPIC-23 (AC-3) y SMOKE-3 de EPIC-23 (AC-2).
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
