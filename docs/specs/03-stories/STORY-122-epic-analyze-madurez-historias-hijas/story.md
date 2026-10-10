---
alwaysApply: false
type: story
id: STORY-122
kind: feat
slug: STORY-122-epic-analyze-madurez-historias-hijas
title: "SeÃ±alar historias hijas no especificadas o con referencias rotas al analizar una Ã©pica"
status: CODE-REVIEW
substatus: DONE
parent: EPIC-22-epic-analyze
created: 2026-10-08
updated: 2026-10-09
related:
  - EPIC-22-epic-analyze
  - STORY-120-epic-analyze-integridad-historias
  - STORY-121-epic-analyze-cobertura-criterios-salida
---
[[EPIC-22-epic-analyze]]

# ðŸ“– Historia: SeÃ±alar historias hijas no especificadas o con referencias rotas al analizar una Ã©pica

**Como** Product Owner que debe decidir si una Ã©pica en `PLAN` estÃ¡ lista para pasar a `READY-FOR-DEV`  
**Quiero** que `/epic-analyze <EPIC-ID>` me advierta de las historias hijas que aÃºn no terminaron su especificaciÃ³n o que referencian historias inexistentes  
**Para** no comprometer capacidad de desarrollo con historias que todavÃ­a no estÃ¡n listas para planificarse

## âœ… Criterios de aceptaciÃ³n

### AC-1 â€” Escenario principal â€“ Historias hijas listas
```gherkin
Dado la Ã©pica "EPIC-30-ejemplo" con "STORY-201" y "STORY-202" en "SPECIFY/DONE"
  Y las entradas "related" de ambas resuelven a historias o Ã©picas existentes
Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
Entonces el reporte no contiene hallazgos de madurez
```

### AC-2 â€” Escenario alternativo â€“ Historias no listas o con referencias rotas
```gherkin
Escenario: madurez de las historias hijas
  Dado "EPIC-30-ejemplo" con la situaciÃ³n "<situaciÃ³n>"
  Cuando el Product Owner ejecuta "/epic-analyze EPIC-30"
  Entonces el reporte contiene un hallazgo WARNING que cita "<elemento>"
    Y la acciÃ³n sugerida es "<acciÃ³n>"
Ejemplos:
  | situaciÃ³n                                                   | elemento   | acciÃ³n                                      |
  | "STORY-202" en "SPECIFY/IN-PROGRESS"                        | STORY-202  | completar su especificaciÃ³n con /story-specify |
  | "STORY-201" declara en "related" a "STORY-999" inexistente  | STORY-999  | corregir o retirar la referencia            |
```

## âš™ï¸ Criterios no funcionales especÃ­ficos

- **CNF-1 â€” Estado mÃ­nimo:** una historia hija se considera lista cuando su estado es `SPECIFY/DONE` o cualquier estado posterior del pipeline de historia; `CANCELED` no genera hallazgo de madurez.
- **CNF-2 â€” Mismo reporte y veredicto:** los hallazgos se aÃ±aden al `epic-analyze-report.md` y cuentan para el veredicto con la regla definida en STORY-120; el skill sigue sin modificar `epic.md` ni los `story.md`.
- **CNF-3 â€” Idempotencia:** sin cambios en la Ã©pica ni en sus historias, dos ejecuciones producen los mismos hallazgos.
- **CNF-4 â€” Cobertura de README:** se espera que exista un README.md siguiendo el template de skill-master, describiendo el propÃ³sito y uso del skill `epic-analyze`.

## Fuera de alcance (Non-Goals)

- Integridad del Ã­ndice de historias, reporte y veredicto â†’ STORY-120.
- Cobertura de criterios de salida y smoke tests â†’ STORY-121.
- Detectar ciclos en `related`: el campo expresa relaciÃ³n, no dependencia.
- Leer los `analyze.md` de las historias hijas (candidata a historia posterior).

## ðŸ“Ž Notas / contexto adicional

- Derivada del split de STORY-120 (propuesta `.tmp/propuestas-de-mejoras/mejora-004-epc-analyze.md`, checks 8 y 9).
- El orden de estados de historia que define "posterior a `SPECIFY/DONE`" es el de `docs/domains/domain-story-lifecycle.md`.
- Requiere que exista el skill `epic-analyze` de STORY-120; amplÃ­a sus comprobaciones sobre el mismo reporte.
