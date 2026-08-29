---
type: story
id: FEAT-023
slug: FEAT-023-scope-acotado-focus
title: "Scope acotado — Flag --focus para reverse-engineering"
date: 2026-04-22
status: COMPLETED
substatus: READY
parent: EPIC-03-reverse-engineering
---

<!-- Referencias -->
[[EPIC-03-reverse-engineering]]

# Historia de Usuario

## ?? Historia: Scope acotado — Flag --focus para reverse-engineering

**Como** developer que ejecuta ingeniería inversa sobre un repositorio grande con múltiples módulos
**Quiero** usar el flag `--focus <path>` con el skill `reverse-engineering` para limitar el análisis a una ruta específica del repositorio
**Para** obtener resultados más precisos y rápidos sobre el módulo de interés, sin analizar código irrelevante al contexto actual

## ? Criterios de aceptación

### Escenario principal – Análisis acotado a un path específico
```gherkin
Dado que el repositorio tiene los módulos "src/auth/", "src/billing/" y "src/admin/"
Cuando el desarrollador ejecuta "/reverse-engineering --focus src/auth/"
Entonces los cuatro agentes limitan su análisis al contenido de "src/auth/"
  Y el "requirement-spec.md" generado refleja únicamente las features, reglas y navegación de ese módulo
```

### Escenario alternativo / error – Path indicado no existe
```gherkin
Dado que el desarrollador indica "--focus src/inexistente/"
Cuando el skill intenta acotar el análisis
Entonces muestra "El path 'src/inexistente/' no existe en el repositorio"
  Pero no inicia el análisis con un scope inválido
```

## ?? Criterios no funcionales

[Por completar]

## ?? Notas / contexto adicional

Generado automáticamente desde el release: release-03-reverse-engineering.md
Feature origen: FEAT-023 — Scope acotado (--focus)
