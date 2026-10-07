---
alwaysApply: false
type: epic
id: EPIC-15
slug: e2e-capability
title: "Skills de Testing Especializado y E2E Capability"
status: COMPLETED
substatus: DONE
parent: PROJ-01-agile-sddf
created: 2026-05-31
updated: 2026-05-31
related: []
---

# Release/Epic: Skills de Testing Especializado y E2E Capability

## Alcance

Amplía las capacidades del framework SDDF con skills especializados de testing: implementación de componentes de librerías React, tests de componentes con React Testing Library, y tests E2E con Cypress+Cucumber y Playwright+Cucumber. El objetivo es que los agentes puedan generar pruebas reales ejecutables en proyectos reales, cerrando el ciclo TDD desde la especificación hasta la validación automatizada en un stack frontend moderno.

## Historias

- [x] **STORY-084** — Skill `impl-frontend-library-react-component`: Skill que implementa componentes de librerías frontend existentes (Material UI, Shadcn, Ant Design, etc.) a partir de `story.md` y `design.md`; genera el componente React en TypeScript siguiendo las convenciones del proyecto y las props definidas en el diseño técnico
- [x] **STORY-085** — Skill `test-react-testing-library`: Skill que genera tests de componentes React con React Testing Library (RTL) a partir de `story.md` y `design.md`; cubre renderizado, interacciones de usuario, accesibilidad y casos de borde; los tests deben pasar con el componente generado por `impl-frontend-library-react-component`

## Criterios de salida

- [x] Los 4 skills están publicados en `package.json` files array y disponibles tras `npm install agile-sddf`
- [x] Los tests generados por cada skill pasan en al menos un proyecto de referencia real (demo project)
- [x] Trazabilidad Gherkin → test verificada en al menos 2 historias reales por skill

## Smoke tests

*Si alguno de estos falla, se debe detener el despliegue (o se debe hacer rollback automático).*

### SMOKE-1 — Generación de componente React + test RTL ejecutable
```gherkin
Escenario: Generación de componente React + test RTL ejecutable
  Dado una historia STORY-NNN con `story.md`, `design.md` y criterios de aceptación Gherkin definidos, y un proyecto React con RTL configurado
  Cuando se invocan `/impl-frontend-library-react-component STORY-NNN` y luego `/test-react-testing-library STORY-NNN`
  Entonces el componente generado existe en la ruta definida en `design.md`, los tests generados referencian el componente correctamente, y `npm test` (o equivalente) pasa sin errores
```

### SMOKE-2 — Generación de test E2E Cypress desde escenario Gherkin
```gherkin
Escenario: Generación de test E2E Cypress desde escenario Gherkin
  Dado una historia con al menos un escenario Gherkin completo (DADO/CUANDO/ENTONCES) y un proyecto con Cypress + Cucumber configurado
  Cuando se invoca `/test-e2e-cypress-cucumber STORY-NNN`
  Entonces se genera un archivo `.feature` con los escenarios de `story.md` y los step definitions correspondientes en TypeScript; el test es ejecutable con `npx cypress run`
```

### SMOKE-3 — Generación de test E2E Playwright desde escenario Gherkin
```gherkin
Escenario: Generación de test E2E Playwright desde escenario Gherkin
  Dado una historia con escenarios Gherkin y un proyecto con Playwright + Cucumber configurado
  Cuando se invoca `/test-e2e-playwright-cucumber STORY-NNN`
  Entonces se generan archivos `.feature` y steps en TypeScript compatibles con `@cucumber/cucumber` + Playwright; ejecutable con `npx cucumber-js`
```

## Notas

Este epic cierra una brecha importante del pipeline SDDF: hasta ahora los skills generaban código de producción pero no tests de integración ni E2E ejecutables. Con estos skills, el ciclo RED→GREEN→REFACTOR del `story-implement` puede incluir tests de componentes y E2E reales, no solo tests unitarios. Los skills deben estar integrados en `sddf.config.yaml` como opciones de `test_generators`.

### Requerimiento

Los skills de testing deben generar pruebas **ejecutables sin modificación manual** en el contexto del proyecto destino. La trazabilidad Gherkin → test es obligatoria: cada escenario del `story.md` debe tener correspondencia directa en el test generado (1:1).

### Riesgos

- **Diversidad de configuraciones de proyectos:** Cada proyecto puede tener configuraciones distintas de Cypress/Playwright/RTL — **Mitigación:** los skills leen `package.json` y archivos de configuración del proyecto destino para adaptar los tests generados; incluyen detección automática del framework de testing
- **Tests que compilan pero no pasan:** Los skills generan tests sintácticamente correctos pero el comportamiento puede diferir del componente real — **Mitigación:** incluir instrucciones explícitas en `tasks.md` para ejecutar los tests y corregir divergencias antes de cerrar la historia
