---
type: project
id: PROJ-01
slug: PROJ-01-demo
title: "Demo"
status: READY
---

# Proyecto

## Características de los usuarios

- Equipo de producto

## Requisitos

### Funcionales

- **FR-001**: Migrar proyectos
  - **Descripción**: Ejecuta la migración.
  - **Prioridad**: Alta
  - **Usuario**: Equipo
  - **Fuente**: Demo

- **FR-002**: Simular cambios
  - **Descripción**: Soporta dry-run.

- **FR-003**: Preservar contenido
  - **Descripción**: No pierde documentos.

### No funcionales

- **NFR-001**: Idempotencia
  - **Descripción**: Repetir no cambia nada.
  - **Criterio de aceptación**: La segunda ejecución informa cero cambios.

- **NFR-002**: Seguridad
  - **Descripción**: No sale de docs.
