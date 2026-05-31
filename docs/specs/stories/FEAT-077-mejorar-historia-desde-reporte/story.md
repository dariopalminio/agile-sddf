---
alwaysApply: false
type: story
id: FEAT-077
slug: FEAT-077-mejorar-historia-desde-reporte
title: "story-improve: Mejora automática de historia desde reporte FINVEST"
status: IMPLEMENTING
substatus: DONE
parent: <nombre-del-release-padre>
created: 2026-05-17
updated: 2026-05-17
related: []
---
**FINVEST Score:** [pendiente — ejecutar `/story-evaluation`]
**FINVEST Decisión:** [pendiente]
---

# 📖 Historia: story-improve — Mejora automática de historia desde reporte FINVEST

**Como** desarrollador o product owner que necesita mejorar una historia con decisión REFINAR o RECHAZAR
**Quiero** ejecutar `/story-improve` para que el skill lea el reporte FINVEST de la historia, cargue el contexto de historias hermanas y aplique las recomendaciones de cada dimensión directamente en `story.md`
**Para** alcanzar una decisión APROBADA sin reescribir la historia manualmente, reduciendo el número de ciclos de refinamiento

## ✅ Criterios de aceptación

### Escenario principal – Mejora automática de historia con decisión REFINAR

```gherkin
Dado que la historia "FEAT-075" tiene `finvest-evaluation-report.md` con `decision: REFINAR`
  Y el reporte identifica I=2 y E=3 como dimensiones con recomendaciones concretas
Cuando ejecuto `/story-improve --story-id FEAT-075`
Entonces el skill crea `story.md.bak` con el contenido original sin modificarlo
  Y actualiza `story.md` aplicando las mejoras indicadas en el reporte para las dimensiones con score ≤ 3
  Y genera `story-improvement-log.md` con el listado de cambios realizados y las dimensiones afectadas
  Y muestra un resumen de secciones modificadas y mejoras aplicadas
```

### Escenario alternativo – Historia ya APROBADA, sin cambios

```gherkin
Dado que la historia "FEAT-074" tiene `finvest-evaluation-report.md` con `decision: APROBADA`
Cuando ejecuto `/story-improve --story-id FEAT-074`
Entonces el skill informa "FEAT-074 ya tiene decisión APROBADA — no se realizan cambios"
  Y no modifica story.md ni genera story.md.bak ni story-improvement-log.md
```

## ⚙️ Criterios no funcionales

* **Pautas del skill:** Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

* **Usar skill-master:** Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estándares de estructura, documentación, funcionalidad y pruebas con ejemplos. La estructura del markdown del skill debe respetar la estructura definida en `.claude\skills\skill-master\assets\skill-template.md`.

* **Seguridad:** el skill nunca descarta el contenido original — siempre genera `story.md.bak` antes de aplicar cambios; las mejoras son trazables en `story-improvement-log.md`
* **Contexto:** el skill carga las historias hermanas (mismo directorio `$SPECS_BASE/specs/stories/`, mismo `related:` o `parent:`) para contextualizar la dimensión I y evitar introducir dependencias que ya resuelven otras historias
* **Idempotencia:** si `story.md.bak` ya existe de una ejecución anterior, el skill lo sobreescribe con el contenido actual de `story.md` antes de aplicar nuevos cambios
* **Cobertura mínima:** el skill aplica al menos una mejora concreta por cada dimensión con score ≤ 3 presente en el reporte

## 📎 Notas / contexto adicional

El skill lee el frontmatter de `finvest-evaluation-report.md` para extraer `decision:` y el cuerpo para extraer la tabla de scores y la sección "Recomendaciones". Las mejoras se aplican solo sobre las dimensiones con score ≤ 3 y con recomendación explícita en el reporte.

**Fuera de scope:**
- Ejecutar `/story-evaluation` automáticamente tras la mejora (puede invocarse manualmente o con un flag futuro)
- Modificar historias hermanas o el epic/release padre
- Modificar `finvest-evaluation-report.md`

**Caso de uso inmediato:** FEAT-075 tiene decisión REFINAR (FINVEST 3.94). Este skill aplicaría las recomendaciones de I=2 y E=3 para intentar superar el umbral 4.0.
