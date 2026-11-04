---
type: epic
id: EPIC-91
slug: EPIC-91-gestion-de-datos
title: "Gestión de datos"
status: DEFINE
substatus: IN-PROGRESS
parent: null
created: 2026-10-20
updated: 2026-10-20
related: []
---

# Épica: Gestión de datos

## Objetivo
Mejorar la gestión de datos de la plataforma.

## Alcance
Mejoras varias en el manejo de datos.

## Historias
- [ ] Exportar CSV — permite exportar datos

## Smoke tests
### Exportación de datos
```gherkin
Escenario: Exportación de datos
  Dado un usuario con datos cargados
  Cuando exporta sus datos
  Entonces obtiene un archivo con sus datos
```

## Notas
