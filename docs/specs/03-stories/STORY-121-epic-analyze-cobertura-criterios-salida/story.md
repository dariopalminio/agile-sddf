---
alwaysApply: false
type: story
id: STORY-121
kind: feat
slug: STORY-121-epic-analyze-cobertura-criterios-salida
title: "Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-22-epic-analyze
created: 2026-10-08
updated: 2026-10-08
related:
  - EPIC-22-epic-analyze
  - STORY-120-epic-analyze-integridad-historias
  - STORY-122-epic-analyze-madurez-historias-hijas
---
[[EPIC-22-epic-analyze]]

# 📖 Historia: Verificar que cada criterio de salida y smoke test de una épica está cubierto por sus historias

**Como** Product Owner que debe decidir si una épica en `PLAN` está lista para pasar a `READY-FOR-DEV`  
**Quiero** que `/epic-analyze <EPIC-ID>` muestre qué historia cubre cada criterio de salida y cada smoke test de la épica, y señale los que nadie cubre  
**Para** saber antes de desarrollar si terminar todas las historias realmente cumple el contrato de "épica terminada", en lugar de descubrir el hueco en `VALIDATE`

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Contrato de salida cubierto
```gherkin
Dado la épica "EPIC-30-ejemplo" con 2 criterios de salida y "SMOKE-1"
  Y "STORY-201" cubre el primer criterio y "SMOKE-1"
  Y "STORY-202" cubre el segundo criterio
Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
Entonces el reporte incluye una tabla de cobertura que asocia cada criterio y "SMOKE-1" con la historia que lo cubre
  Y no contiene hallazgos de cobertura
```

### AC-2 — Escenario alternativo / error – Elementos del contrato sin cubrir o ausentes
```gherkin
Escenario: huecos en el contrato de salida
  Dado "EPIC-30-ejemplo" con la situación "<situación>"
  Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
  Entonces el reporte contiene un hallazgo "<severidad>" que cita "<elemento>"
Ejemplos:
  | situación                                         | severidad | elemento               |
  | un criterio de salida sin historia que lo cubra   | ERROR     | el texto del criterio  |
  | "SMOKE-2" sin historia que lo cubra               | WARNING   | SMOKE-2                |
  | sección "Criterios de salida" vacía o ausente     | ERROR     | Criterios de salida    |
  | sección "Smoke tests" vacía o ausente             | ERROR     | Smoke tests            |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Evidencia de cobertura:** toda asociación criterio/SMOKE → historia cita la evidencia que la sostiene (mención explícita en `story.md` o el AC de la historia que lo verifica), de modo que el Product Owner pueda revisar la decisión sin repetir el análisis.
- **CNF-2 — Mismo reporte y veredicto:** los hallazgos se añaden al `epic-analyze-report.md` y cuentan para el veredicto con la regla definida en STORY-120; el skill sigue sin modificar `epic.md` ni los `story.md`.
- **CNF-3 — Idempotencia:** sin cambios en la épica ni en sus historias, dos ejecuciones producen la misma tabla de cobertura y los mismos hallazgos.

## Fuera de alcance (Non-Goals)

- Integridad del índice de historias, reporte y veredicto → STORY-120.
- Madurez de las historias hijas → STORY-122.
- Proponer o crear historias que cubran los huecos detectados (el skill reporta, no corrige).

## 📎 Notas / contexto adicional

- Derivada del split de STORY-120 (propuesta `.tmp/propuestas-de-mejoras/mejora-004-epc-analyze.md`, checks 3, 4 y 10).
- Se apoya en las secciones obligatorias "Criterios de salida" y "Smoke tests" del template de épica v2 (STORY-103); los IDs `SMOKE-N` son estables, por lo que el reporte los cita por ID.
- Requiere que exista el skill `epic-analyze` de STORY-120; amplía sus comprobaciones sobre el mismo reporte.
- La cobertura es un juicio sobre texto (criterios en lenguaje natural): por eso CNF-1 exige citar la evidencia en vez de afirmar la cobertura sin respaldo.
