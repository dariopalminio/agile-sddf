---
alwaysApply: false
type: story
id: STORY-122
kind: feat
slug: STORY-122-epic-analyze-madurez-historias-hijas
title: "Señalar historias hijas no especificadas o con referencias rotas al analizar una épica"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-22-epic-analyze
created: 2026-10-08
updated: 2026-10-08
related:
  - EPIC-22-epic-analyze
  - STORY-120-epic-analyze-integridad-historias
  - STORY-121-epic-analyze-cobertura-criterios-salida
---
[[EPIC-22-epic-analyze]]

# 📖 Historia: Señalar historias hijas no especificadas o con referencias rotas al analizar una épica

**Como** Product Owner que debe decidir si una épica en `PLAN` está lista para pasar a `READY-FOR-DEV`  
**Quiero** que `/epic-analyze <EPIC-ID>` me advierta de las historias hijas que aún no terminaron su especificación o que referencian historias inexistentes  
**Para** no comprometer capacidad de desarrollo con historias que todavía no están listas para planificarse

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Historias hijas listas
```gherkin
Dado la épica "EPIC-30-ejemplo" con "STORY-201" y "STORY-202" en "SPECIFY/DONE"
  Y las entradas "related" de ambas resuelven a historias o épicas existentes
Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
Entonces el reporte no contiene hallazgos de madurez
```

### AC-2 — Escenario alternativo – Historias no listas o con referencias rotas
```gherkin
Escenario: madurez de las historias hijas
  Dado "EPIC-30-ejemplo" con la situación "<situación>"
  Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
  Entonces el reporte contiene un hallazgo WARNING que cita "<elemento>"
    Y la acción sugerida es "<acción>"
Ejemplos:
  | situación                                                   | elemento   | acción                                      |
  | "STORY-202" en "SPECIFY/IN-PROGRESS"                        | STORY-202  | completar su especificación con /story-specify |
  | "STORY-201" declara en "related" a "STORY-999" inexistente  | STORY-999  | corregir o retirar la referencia            |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Estado mínimo:** una historia hija se considera lista cuando su estado es `SPECIFY/DONE` o cualquier estado posterior del pipeline de historia; `CANCELED` no genera hallazgo de madurez.
- **CNF-2 — Mismo reporte y veredicto:** los hallazgos se añaden al `epic-analyze-report.md` y cuentan para el veredicto con la regla definida en STORY-120; el skill sigue sin modificar `epic.md` ni los `story.md`.
- **CNF-3 — Idempotencia:** sin cambios en la épica ni en sus historias, dos ejecuciones producen los mismos hallazgos.

## Fuera de alcance (Non-Goals)

- Integridad del índice de historias, reporte y veredicto → STORY-120.
- Cobertura de criterios de salida y smoke tests → STORY-121.
- Detectar ciclos en `related`: el campo expresa relación, no dependencia.
- Leer los `analyze.md` de las historias hijas (candidata a historia posterior).

## 📎 Notas / contexto adicional

- Derivada del split de STORY-120 (propuesta `.tmp/propuestas-de-mejoras/mejora-004-epc-analyze.md`, checks 8 y 9).
- El orden de estados de historia que define "posterior a `SPECIFY/DONE`" es el de `docs/domains/domain-story-lifecycle.md`.
- Requiere que exista el skill `epic-analyze` de STORY-120; amplía sus comprobaciones sobre el mismo reporte.
