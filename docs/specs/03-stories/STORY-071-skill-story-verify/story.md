---
alwaysApply: false
type: story
id: STORY-071
kind: feat
slug: STORY-071-skill-story-verify
title: "Skill story-verify: Orquestar la fase VERIFY de pruebas de una historia"
status: READY-FOR-CODE-REVIEW
substatus: DONE
parent: EPIC-13-quality-gates-con-dod-en-story-workflow
created: 2026-05-14
updated: 2026-05-14
related:
  - STORY-068-dod-plan-en-story-analyze
  - STORY-069-dod-IMPLEMENT-en-story-implement
  - STORY-070-dod-code-review-en-story-code-review
---
<!-- Referencias -->
[[quality-gates-con-dod-en-story-workflow]]
[[dod-plan-en-story-analyze]]
[[dod-IMPLEMENT-en-story-implement]]
[[dod-code-review-en-story-code-review]]

# ðŸ“– Historia: Skill story-verify: Orquestar la fase VERIFY de pruebas de una historia

**Como** desarrollador que acaba de completar la implementaciÃ³n de una historia de usuario  
**Quiero** ejecutar el skill `story-verify` para orquestar la fase VERIFY de pruebas de la historia  
**Para** validar que la implementaciÃ³n cumple los criterios del Definition of Done de VERIFY, documentar los resultados en un informe y actualizar el estado de la historia de forma trazable

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ VerificaciÃ³n automÃ¡tica en proyecto con unit tests

```gherkin
Dado que existe una historia "STORY-050" con status CODE-REVIEW y substatus DONE
  Y el proyecto tiene tests automÃ¡ticos configurados (pytest, jest, etc.)
  Y existe el archivo "$SPECS_BASE/policies/dod-story.md" con secciÃ³n VERIFY
Cuando el desarrollador ejecuta el skill `story-verify` con el ID "STORY-050"
Entonces el skill lee la secciÃ³n VERIFY del DoD y extrae los criterios a cumplir
  Y ejecuta los comandos de prueba detectados para el stack del proyecto
  Y genera el archivo "$SPECS_BASE/specs/stories/STORY-050/verify-report.md" con resultados, defectos y estado de cada criterio DoD
  Y actualiza el frontmatter de "story.md" con status VERIFY y substatus DONE si todos los criterios pasan
  Y muestra un resumen de resultados en pantalla con nÃºmero de tests pasados, fallados y defectos encontrados
```

### Escenario alternativo â€“ VerificaciÃ³n en proyecto con E2E (Playwright / Cypress / Cucumber)

```gherkin
Dado que existe una historia "STORY-055" con status CODE-REVIEW
  Y el proyecto tiene configuraciÃ³n de tests E2E detectada (playwright.config, cypress.config, etc.)
Cuando el desarrollador ejecuta `story-verify` con el ID "STORY-055"
Entonces el skill detecta el framework E2E instalado
  Y ejecuta los tests E2E correspondientes a los escenarios Gherkin de la historia
  Y registra en "verify-report.md" cada escenario Gherkin con resultado PASS / FAIL / SKIP
  Y si detecta un skill especÃ­fico de testing instalado en el proyecto, lo invoca o delega la ejecuciÃ³n al agente de testing
```

### Escenario alternativo â€“ VerificaciÃ³n manual en proyecto sin tests automÃ¡ticos

```gherkin
Dado que existe una historia "STORY-060" con status CODE-REVIEW
  Y el proyecto no tiene tests automÃ¡ticos configurados (proyecto de IA, desarrollo de SKILLs, etc.)
Cuando el desarrollador ejecuta `story-verify` con el ID "STORY-060"
Entonces el skill entra en modo manual e interactivo
  Y guÃ­a al usuario escenario por escenario desde los criterios de aceptaciÃ³n de "story.md"
  Y solicita al usuario registrar el resultado de cada escenario (PASS / FAIL / BLOCKED + observaciones)
  Y documenta los resultados ingresados manualmente en "verify-report.md"
  Y valida los criterios del DoD VERIFY contra los resultados registrados
```

### Escenario alternativo / error â€“ Historia en estado incorrecto para VERIFY

```gherkin
Dado que existe una historia "STORY-040" con status IMPLEMENT y substatus IN-PROGRESS
Cuando el desarrollador ejecuta `story-verify` con el ID "STORY-040"
Entonces el skill detecta que la historia no cumple la precondiciÃ³n de estado (CODE-REVIEW o IMPLEMENT/DONE)
  Y muestra el mensaje "La historia STORY-040 tiene status IMPLEMENT/IN-PROGRESS. Ejecuta story-code-review antes de continuar."
  Pero no genera ni sobreescribe ningÃºn archivo existente
```

### Escenario alternativo / error â€“ Criterios DoD VERIFY no superados

```gherkin
Dado que la historia "STORY-062" tiene tests que fallan al ejecutar
  Y el DoD VERIFY requiere que todos los tests pasen
Cuando el skill ejecuta las pruebas
Entonces genera "verify-report.md" con los defectos identificados y su severidad
  Y actualiza el frontmatter de "story.md" con substatus BLOCKED
  Y muestra en pantalla "VERIFY BLOQUEADO: se encontraron N defectos. Revisa verify-report.md para detalles."
  Pero no modifica el status principal de la historia
```

### Escenario con datos (Scenario Outline) â€“ DetecciÃ³n del modo de ejecuciÃ³n segÃºn stack del proyecto

```gherkin
Escenario: DetecciÃ³n automÃ¡tica del modo de verificaciÃ³n
  Dado que el proyecto tiene "<configuracion_detectada>"
  Cuando el skill inicia la fase VERIFY
  Entonces el skill opera en modo "<modo_ejecucion>"
Ejemplos:
  | configuracion_detectada             | modo_ejecucion |
  | pytest.ini / setup.cfg              | automatico-unit |
  | playwright.config.ts                | automatico-e2e  |
  | cypress.config.js                   | automatico-e2e  |
  | cucumber.js / features/             | automatico-e2e  |
  | sin configuraciÃ³n de tests          | manual          |
  | skill de testing personalizado      | delegado        |
```

### Requerimiento: Idempotencia y no-destructividad

El skill puede ejecutarse mÃºltiples veces sobre la misma historia sin efectos adversos. Si `verify-report.md` ya existe, lo sobreescribe con los nuevos resultados manteniendo historial de ejecuciones anteriores en una secciÃ³n de "Historial". Nunca elimina artefactos previos de la historia.

### Requerimiento: Lectura dinÃ¡mica del DoD VERIFY

El skill lee la secciÃ³n VERIFY (o "DefiniciÃ³n de Hecho para la fase de VERIFY") de `$SPECS_BASE/policies/dod-story.md` en tiempo de ejecuciÃ³n. Si el DoD evoluciona, el skill lo refleja automÃ¡ticamente sin modificaciones. Si la secciÃ³n VERIFY no existe en el DoD, muestra advertencia y usa criterios mÃ­nimos genÃ©ricos.

### Requerimiento: Severity Definitions
```
### Severity Definitions

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss, system crash |
| **HIGH** | Major functionality broken, severe performance |
| **MEDIUM** | Feature partially working, workaround exists |
| **LOW** | Minor issue, cosmetic, edge case |

## Findings

### [CRITICAL] {Issue Title}
- **Location**: src/api/users.ts:45
- **Steps to Reproduce**:
  1. Send POST to /api/users without auth
  2. Request succeeds with 201
- **Expected**: 401 Unauthorized
- **Actual**: 201 Created
- **Impact**: Unauthorized user creation
- **Fix**: Add auth middleware

### [HIGH] {Issue Title}
- **Location**: src/services/orders.ts:123
- **Description**: N+1 query in order list
- **Impact**: 3s response time with 100 orders
- **Fix**: Add eager loading for order items

### [MEDIUM] {Issue Title}
- **Details**: ...

### [LOW] {Issue Title}
- **Details**: ...
```

### Requerimiento: DetecciÃ³n de modo de ejecuciÃ³n
Si el usuario no indica ni estÃ¡ configurado debe detectar si hay testing: Unit tests, Integration tests, E2E tests, Performance tests y Security tests; y debe descubrir modos de ejecutar los tests (comandos npm, pytest, etc.) para ejecutar la baterÃ­a de pruebas correspondiente a cada historia. Si no detecta ningÃºn framework de testing, debe entrar en modo manual. Si detecta un skill de testing especÃ­fico instalado en el proyecto, debe delegar la ejecuciÃ³n o invocar al agente de testing correspondiente.

### Requerimiento: Verify Report Template
El template del reporte debe ser leido de $SPECS_BASE/specs/templates y completado en tiempo de ejecuciÃ³n.
Basarse en el siguiente template de test report para generar el `verify-report.md`:
```
# Test Report: {Feature Name}

**Date**: YYYY-MM-DD
**Tester**: {Name}
**Version**: {App Version}

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | X |
| Passed | X |
| Failed | X |
| Skipped | X |
| Coverage | X% |

## Test Scope

- [x] Unit tests
- [x] Integration tests
- [x] E2E tests
- [ ] Performance tests
- [ ] Security tests

## Findings

### [CRITICAL] {Issue Title}
- **Location**: src/api/users.ts:45
- **Steps to Reproduce**:
  1. Send POST to /api/users without auth
  2. Request succeeds with 201
- **Expected**: 401 Unauthorized
- **Actual**: 201 Created
- **Impact**: Unauthorized user creation
- **Fix**: Add auth middleware

### [HIGH] {Issue Title}
- **Location**: src/services/orders.ts:123
- **Description**: N+1 query in order list
- **Impact**: 3s response time with 100 orders
- **Fix**: Add eager loading for order items

### [MEDIUM] {Issue Title}
- **Details**: ...

### [LOW] {Issue Title}
- **Details**: ...

## Coverage Analysis

| Module | Lines | Branches | Functions |
|--------|-------|----------|-----------|
| api/ | 85% | 78% | 90% |
| services/ | 92% | 85% | 95% |
| utils/ | 100% | 100% | 100% |

### Coverage Gaps
- `src/api/admin.ts` - 0% (no tests)
- `src/services/payment.ts:45-60` - Error handling untested

## Recommendations

1. **Immediate**: Add auth middleware to admin routes
2. **High Priority**: Optimize order queries
3. **Medium Priority**: Add tests for payment error handling
4. **Low Priority**: Increase branch coverage in api/

## Performance Results

| Endpoint | p50 | p95 | p99 |
|----------|-----|-----|-----|
| GET /users | 45ms | 120ms | 250ms |
| POST /orders | 150ms | 400ms | 800ms |

## Sign-off

- [ ] All critical issues addressed
- [ ] Coverage meets threshold (80%)
- [ ] Performance meets SLA

## Severity Definitions

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | Security vulnerability, data loss, system crash |
| **HIGH** | Major functionality broken, severe performance |
| **MEDIUM** | Feature partially working, workaround exists |
| **LOW** | Minor issue, cosmetic, edge case |

## Quick Reference

| Section | Content |
|---------|---------|
| Summary | High-level metrics |
| Findings | Issues by severity |
| Coverage | Code coverage analysis |
| Recommendations | Prioritized actions |
| Sign-off | Approval criteria |
```
### Requerimiento: Patrones estructurales de Skills (Skill Structural patterns)
Se debe seguir y respetar los lineamientos estructurales de skills definido en `docs\knowledge\guides\skill-structural-pattern.md`.

### Requerimiento: Seguir lineamientos de skill-master
Se debe seguir y respetar los lineamientos del skill `skill-master` para asegurar que el skill siga los estÃ¡ndares de estructura, documentaciÃ³n, funcionalidad y pruebas con ejemplos.

### Requerimiento: No modifica cÃ³digo ni artefactos 
El skill `story-verify` no debe modificar ningÃºn cÃ³digo fuente ni artefacto de la historia (excepto generar o actualizar `verify-report.md` y el frontmatter de `story.md` para reflejar el resultado de la verificaciÃ³n). No debe eliminar ni sobreescribir archivos existentes sin confirmaciÃ³n explÃ­cita del usuario. Su funciÃ³n es exclusivamente orquestar la ejecuciÃ³n de pruebas y documentar resultados, sin alterar la implementaciÃ³n de la historia.

## âš™ï¸ Criterios no funcionales

* Rendimiento: Si los comandos de prueba superan los 30 segundos, el skill muestra progreso periÃ³dico (cada 15s) con el estado actual de ejecuciÃ³n
* Idempotencia: Ejecutable mÃºltiples veces sin efectos adversos; sobreescribe `verify-report.md` preservando historial
* Portabilidad: Compatible con proyectos Node.js, Python, Go y proyectos de IA/SKILL sin tests clÃ¡sicos
* SeparaciÃ³n de responsabilidades: El SKILL orquesta (archivos, comandos, informes, estado); el agente de testing (si se usa) solo aporta rol y conocimiento de dominio de pruebas
* Trazabilidad: Cada criterio del DoD VERIFY queda mapeado a un resultado verificable en `verify-report.md`

## ðŸ“Ž Notas / contexto adicional

**SeparaciÃ³n de responsabilidades SKILL / Agente:**
- El SKILL `story-verify` es responsable de: leer artefactos (story.md, DoD), detectar el modo de ejecuciÃ³n, invocar comandos, generar `verify-report.md`, actualizar frontmatter de `story.md` y mostrar resumen al usuario.
- El Agente de testing (si existe) solo contiene: rol de QA Engineer, conocimiento de estrategias de prueba, criterios de calidad y juicio para modo manual. No accede a archivos directamente.

**Estructura del `verify-report.md` generado:**
- Metadata: ID historia, fecha, modo de ejecuciÃ³n, versiÃ³n del DoD leÃ­da
- Resumen ejecutivo: total tests, pasados, fallados, bloqueados/Skipped
- Resultados por escenario Gherkin: PASS / FAIL / SKIP + evidencia
- Criterios DoD VERIFY: lista con estado cumplido / no cumplido
- Defectos encontrados: descripciÃ³n, severidad, escenario relacionado
- Historial de ejecuciones anteriores (si existen)
- Test Scope:
```
- [x] Unit tests
- [x] Integration tests
- [x] E2E tests
- [ ] Performance tests
- [ ] Security tests
```
- Estado final: VERIFY-PASSED / VERIFY-REJECTED

**Precondiciones requeridas:**
- Historia con `status: CODE-REVIEW` (o `IMPLEMENT/DONE` como mÃ­nimo aceptable)
- Archivo `story.md` accesible en `$SPECS_BASE/specs/stories/<story-id>/`
- Archivo DoD en `$SPECS_BASE/policies/dod-story.md`
- Para modo automÃ¡tico: herramientas del stack instaladas (node, python, etc.)

**Flags de entrada aceptados:**
- `--story <ID>` o primer argumento posicional: ID de la historia a verificar
- `--mode manual`: forzar modo interactivo aunque existan tests automÃ¡ticos
- `--mode auto`: forzar ejecuciÃ³n automÃ¡tica (falla si no hay tests configurados)
- `--dry-run`: simula la ejecuciÃ³n sin escribir archivos ni ejecutar tests
- `--verbose`: muestra salida completa de los comandos de prueba

**Alcance fuera de scope de esta historia:**
- Despliegue a producciÃ³n (eso corresponde a un skill `story-deploy`)
- GeneraciÃ³n de tests que no existen (eso corresponde a `story-implement`)
- RevisiÃ³n de cÃ³digo (eso corresponde a `story-code-review`)
- IntegraciÃ³n con CI/CD externo (queda para una historia posterior)

