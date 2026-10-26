---
alwaysApply: false
type: delivery-report
id: {story_id}
slug: {story_slug}-delivery-report
title: "Delivery report: {story_title}"
story: {story_id}
created: {date}
updated: {date}
related:
  - {story_slug}
---

[[{story_slug}]]

# Delivery report: {story_id} — {story_title}

Registro append-only de las entregas forzadas con `/story-delivery {story_id} --force`. Cada override añade una sección `## Override <n> — <fecha>` al final; las secciones previas no se reescriben.

<!-- Sección repetible: una por override -->

## Override {n} — {date}

- Fecha del override: {date}
- Estado previo: {estado_previo}
- Estado escrito: DELIVER/DONE
- Gates omitidos:
{gates_omitidos}
- Confirmado por: confirmación humana en la sesión

### Criterios incumplidos

<!-- Tabla con los ❌ del DoD de entrega; «Ninguno» si solo se omitió la precondición de estado -->

| # | Criterio | Evidencia |
|---|---|---|
{criterios_incumplidos}

### Criterios no aplicables

<!-- Criterios «no aplica en batch»; «Ninguno» si no hay -->

{criterios_no_aplicables}
