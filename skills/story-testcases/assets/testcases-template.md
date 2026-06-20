---
type: testcases
id: {story_id}
slug: {story_slug}-testcases
title: "Test Cases: {story_title}"
story: {story_id}
created: {date}
updated: {date}
related:
  - {story_slug}
---

<!-- Referencias -->
[[{story_slug}]]

# Casos de Prueba: {story_title}

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT   | {count_ut} |
| CT   | {count_ct} |
| IT   | {count_it} |
| API  | {count_api} |
| E2E  | {count_e2e} |
| EV   | {count_ev} |

<!-- Incluir ST solo si el proyecto tiene store/gestor de estado global -->
<!-- | ST   | {count_st} | -->

## Tabla de casos

<!-- Reglas de columnas:
  ID      : prefijo-NNN donde prefijo ∈ {UT, CT, IT, API, E2E, EV, ST}; NNN secuencial desde 001
  Tipo    : Unit | Component | Integration | API | End-to-End | Eval | Store
  Escenario: descripción breve en lenguaje natural — no Gherkin estricto
  Dado    : precondición del escenario
  Cuando  : acción que dispara el comportamiento
  Entonces: resultado esperado verificable
  Ref     : AC-N (origen story.md) | D-N / sección X.Y (origen design.md) | T-NNN (origen tasks.md)
-->

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| {id} | {tipo} | {escenario} | {dado} | {cuando} | {entonces} | {ref} |

## Notas de cobertura

<!-- Observaciones sobre la derivación de casos, gaps de cobertura detectados,
     o decisiones sobre qué no cubrir en este artefacto. -->

## Test Cases Progress for {story_id}

<!-- Generado automáticamente por story-testcases. Actualizado por story-implement en fase GREEN.
     [x] = test pasó | [ ] = pendiente | [!] = test falló -->
{progress_checklist}
