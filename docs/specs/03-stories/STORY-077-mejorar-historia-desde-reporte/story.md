---
alwaysApply: false
type: story
id: STORY-077
kind: feat
slug: STORY-077-mejorar-historia-desde-reporte
title: "story-improve: Mejora automÃ¡tica de historia desde reporte FINVEST"
status: IMPLEMENT
substatus: DONE
parent: EPIC-13-quality-gates-con-dod-en-story-workflow
created: 2026-05-17
updated: 2026-05-17
related: []
---

# ðŸ“– Historia: story-improve â€” Mejora automÃ¡tica de historia desde reporte FINVEST

**Como** desarrollador o product owner que necesita mejorar una historia con decisiÃ³n REFINAR o RECHAZAR
**Quiero** ejecutar `/story-improve` para que el skill lea el reporte FINVEST de la historia, cargue el contexto de historias hermanas y aplique las recomendaciones de cada dimensiÃ³n directamente en `story.md`
**Para** alcanzar una decisiÃ³n APROBADA sin reescribir la historia manualmente, reduciendo el nÃºmero de ciclos de refinamiento

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ Mejora automÃ¡tica de historia con decisiÃ³n REFINAR

```gherkin
Dado que la historia "STORY-075" tiene `finvest-evaluation-report.md` con `decision: REFINAR`
  Y el reporte identifica I=2 y E=3 como dimensiones con recomendaciones concretas
Cuando ejecuto `/story-improve --story-id STORY-075`
Entonces el skill crea `story.md.bak` con el contenido original sin modificarlo
  Y actualiza `story.md` aplicando las mejoras indicadas en el reporte para las dimensiones con score â‰¤ 3
  Y genera `story-improvement-log.md` con el listado de cambios realizados y las dimensiones afectadas
  Y muestra un resumen de secciones modificadas y mejoras aplicadas
```

### Escenario alternativo â€“ Historia ya APROBADA, sin cambios

```gherkin
Dado que la historia "STORY-074" tiene `finvest-evaluation-report.md` con `decision: APROBADA`
Cuando ejecuto `/story-improve --story-id STORY-074`
Entonces el skill informa "STORY-074 ya tiene decisiÃ³n APROBADA â€” no se realizan cambios"
  Y no modifica story.md ni genera story.md.bak ni story-improvement-log.md
```

## âš™ï¸ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

* **Usar skill-master:** Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-master\assets\skill-template.md`.

* **Seguridad:** el skill nunca descarta el contenido original â€” siempre genera `story.md.bak` antes de aplicar cambios; las mejoras son trazables en `story-improvement-log.md`
* **Contexto:** el skill carga las historias hermanas (mismo directorio `$SPECS_BASE/specs/stories/`, mismo `related:` o `parent:`) para contextualizar la dimensiÃ³n I y evitar introducir dependencias que ya resuelven otras historias
* **Idempotencia:** si `story.md.bak` ya existe de una ejecuciÃ³n anterior, el skill lo sobreescribe con el contenido actual de `story.md` antes de aplicar nuevos cambios
* **Cobertura mÃ­nima:** el skill aplica al menos una mejora concreta por cada dimensiÃ³n con score â‰¤ 3 presente en el reporte

## ðŸ“Ž Notas / contexto adicional

El skill lee el frontmatter de `finvest-evaluation-report.md` para extraer `decision:` y el cuerpo para extraer la tabla de scores y la secciÃ³n "Recomendaciones". Las mejoras se aplican solo sobre las dimensiones con score â‰¤ 3 y con recomendaciÃ³n explÃ­cita en el reporte.

**Fuera de scope:**
- Ejecutar `/story-evaluation` automÃ¡ticamente tras la mejora (puede invocarse manualmente o con un flag futuro)
- Modificar historias hermanas o el epic/release padre
- Modificar `finvest-evaluation-report.md`

**Caso de uso inmediato:** STORY-075 tiene decisiÃ³n REFINAR (FINVEST 3.94). Este skill aplicarÃ­a las recomendaciones de I=2 y E=3 para intentar superar el umbral 4.0.
