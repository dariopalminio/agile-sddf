---
alwaysApply: false
type: release
id: EPIC-16
slug: EPIC-16-enhancement
title: "enhancement"
status: INPROGRESS
substatus: DONE
parent: null
created: 2026-06-05
updated: 2026-06-05
related: []
---

# Release/Epic: enhancement

## Descripción

Amplía las capacidades del framework SDDF con skills especializados de testing: implementación de componentes de librerías React, tests de componentes con React Testing Library, y tests E2E con Cypress+Cucumber y Playwright+Cucumber. El objetivo es que los agentes puedan generar pruebas reales ejecutables en proyectos reales, cerrando el ciclo TDD desde la especificación hasta la validación automatizada en un stack frontend moderno.

## Features

- [x] **Integrar Skill Shielder en Dockerfile.dev**: Clonar el repositorio de Skill Shielder durante el build de la imagen de desarrollo, hacer ejecutables los scripts y exponer el comando shield en el PATH del sistema para permitir auditorías de seguridad de skills bajo demanda desde dentro del contenedor.
- [x] **Skill Security Audit en el pipeline de CI**: Agregar un nuevo job en el pipeline de CI que ejecute el comando shield audit en cada push a main y en cada PR. 
- [x] **Checklist for Test Cases Progress**: Add checklist for Test Cases Progress in testcases.md. Modificar testcases-template.md con nueva sección final ## Test Cases Progress for {story_id} con el placeholder {progress_checklist} y comentario explicativo sobre los estados [x] / [ ] / [!]. Modificar story-testcases/SKILL.md — Paso 6 ahora incluye instrucción explícita para generar la sección de progreso: itera cada fila de la tabla y produce - [ ] {ID}: {Escenario}. El fallback template interno también fue actualizado con la nueva sección. Modificar examples/output/testcases.md — Ejemplo de output actualizado con los 13 checkboxes vacíos correspondientes a los casos del ejemplo FEAT-099. Y modificar story-implement/SKILL.md — Paso 9b ahora, tras ejecutar el comando de test, actualiza los checkboxes de testcases.md: [x] si el tipo pasa, [!] si falla. Incluye el mapping completo unit→UT, component→CT, integration→IT, etc. La actualización es silenciosa si testcases.md no existe o no tiene la sección.
