---
type: testcases
id: STORY-093
slug: STORY-093-raiz-configurable-preflight-diagnostico-testcases
title: "Test Cases: Resolver una raíz configurable y usar preflight como diagnóstico"
story: STORY-093
created: 2026-09-12
updated: 2026-09-12
related:
  - STORY-093-raiz-configurable-preflight-diagnostico
---

<!-- Referencias -->
[[STORY-093-raiz-configurable-preflight-diagnostico]]

# Casos de Prueba: Resolver una raíz configurable y usar preflight como diagnóstico

## Resumen de cobertura

| Tipo | Cantidad |
|------|----------|
| UT | 0 |
| CT | 0 |
| IT | 2 |
| API | 0 |
| E2E | 3 |
| EV | 12 |

## Tabla de casos

| ID | Tipo | Escenario | Dado | Cuando | Entonces | Ref |
|----|------|-----------|------|--------|----------|-----|
| E2E-001 | End-to-End | Precedencia de raíz única | Un repositorio con root en configuración y combinaciones válidas de SDDF_ROOT | Un skill consumidor resuelve sus artefactos | Usa SDDF_ROOT si existe sin parsear YAML; si no, root de configuración; y conserva docs como default | AC-1, D-1, V-1 |
| E2E-002 | End-to-End | Ausencia o invalidez de fuente | Configuración sin root, SDDF_ROOT inválida o root inválido | Un skill intenta resolver SPECS_BASE | La ausencia usa docs y conserva la creación de salida propia; una fuente explícita inválida informa la causa y no escribe | AC-2, D-1, V-2 |
| E2E-003 | End-to-End | Diagnóstico bajo demanda | Un repositorio con raíz válida y estructura inicializada | El mantenedor ejecuta skill-preflight explícitamente y luego un skill normal | El informe es de solo lectura y el skill normal no lo invoca automáticamente | AC-3, D-4, V-3 |
| IT-001 | Integration | Bootstrap con configuración versionada | Un repositorio sin configuración ni override, uno con root existente, o uno con root relativo versionado aún sin directorio | Se ejecuta sddf-init dos veces | En el primer caso crea docs y root: docs; conserva root existente; y crea una raíz versionada relativa solo en la primera ejecución, de forma idempotente | AC-1, AC-2, D-3, V-4 |
| IT-002 | Integration | Separación de raíces en consumidores especiales | root apunta a una carpeta distinta de docs y existen código, config y un runtime ya soportado | Se ejecutan story-verify y story-code-review | El primero lee configuración desde REPO_ROOT, el segundo revisa código desde REPO_ROOT, ambos guardan artefactos en SPECS_BASE y CLI_ROOT no se deriva de esa raíz | AC-1, D-5, V-5 |
| EV-001 | Eval | Auditoría de contrato en skills fuente | El inventario de SKILL.md fuente y soportes que declaran preflight | Se ejecuta el auditor no mutante | Cada skill consumidor declara resolución local y no hay Paso 0 automático residual ni evidencia que lo espere | AC-1, AC-3, D-2, D-6 |
| EV-002 | Eval | Configuración y plantilla compatibles | sddf.config.yaml y la plantilla de sddf-init | Se valida su contenido y se instancia un proyecto por defecto | root: docs existe, las secciones vigentes se conservan y .env.template no fuerza SDDF_ROOT | AC-1, D-3, V-4 |
| EV-003 | Eval | Error seguro de override de entorno | SDDF_ROOT contiene una ruta inexistente y la configuración es válida | Se invoca un skill de escritura | La salida nombra SDDF_ROOT como causa y el árbol de artefactos no cambia | AC-2, D-1, V-2 |
| EV-004 | Eval | Error seguro de configuración | SDDF_ROOT no está definida y el YAML es ilegible, root es vacío o apunta a una ruta inexistente | Se invoca un skill de escritura | La salida nombra sddf.config.yaml o root y no se escribe en docs por fallback | AC-2, D-1, V-2 |
| EV-005 | Eval | Preflight no mutante y sin dependencia legada | Un repositorio válido sin openspec/config.yaml y con los cinco templates centrales | Se invoca skill-preflight | Reporta raíz, fuente y estado de los cinco templates, no modifica archivos y no emite warning de OpenSpec no solicitado | AC-3, D-4, V-3 |
| EV-006 | Eval | Portabilidad, CLI_ROOT y resolución única | Los SKILL.md actualizados y un runtime ya soportado instalado de prueba | Se revisan dependencias, selección de runtime y lecturas de configuración por invocación | No se exige yq, Bash ni helper no distribuido; CLI_ROOT mantiene su selección existente y la resolución se reutiliza dentro del workflow | AC-1, AC-3, D-2, D-5, D-6 |
| EV-007 | Eval | Bootstrap no persiste override temporal | SDDF_ROOT válida está definida y todavía no existe sddf.config.yaml | Se ejecuta sddf-init | Se detiene antes de escribir y pide quitar el override o declarar root versionado; no convierte el valor de entorno en configuración | AC-1, AC-2, D-3 |
| EV-008 | Eval | Default conserva creación de salida propia | No existe docs ni hay SDDF_ROOT o root configurado | Se ejecuta un fixture de docs-wiki-builder o story-specify | Usa docs y crea solo el directorio de salida que el skill ya posee; no crea una raíz alternativa | AC-2, D-1 |
| EV-009 | Eval | Evals y ejemplos no conservan contrato retirado | Los soportes inventariados de skills | Se ejecutan o inspeccionan sus expectativas | No esperan preflight automático y mantienen la invocación explícita solo donde corresponda | AC-3, D-6 |
| EV-010 | Eval | Normalización de rutas configuradas | Raíces relativas, absolutas existentes y rutas relativas con espacios | Un skill resuelve SPECS_BASE | Ancla las relativas en REPO_ROOT, conserva las absolutas y no altera espacios internos | AC-1, D-1 |
| EV-011 | Eval | Override válido evita YAML defectuoso | SDDF_ROOT apunta a un directorio existente y sddf.config.yaml es ilegible | Un skill resuelve SPECS_BASE | Usa SDDF_ROOT sin intentar parsear ni fallar por el YAML | AC-1, D-1 |
| EV-012 | Eval | Documentación activa coherente | Políticas, README, guías activas y EPIC-19 actualizados | Se inspeccionan las afirmaciones de arranque y precedencia | No declaran preflight automático ni OpenSpec como requisito, y describen la misma precedencia | AC-1, AC-3, D-7 |

## Notas de cobertura

Los tres E2E corresponden uno a uno a los tres bloques Gherkin de story.md; los ejemplos
de los Scenario Outline se ejecutan como variantes de E2E-001 y E2E-002. No se definen
UT ni CT porque el cambio principal es un contrato de skills, configuración y
documentación, no un componente de aplicación aislado.

Los casos EV cubren tanto el contenido de las fuentes como los fallos de seguridad de
ruta y la compatibilidad de las evidencias de los skills. Las tareas T019 a T021 cierran la ejecución de esta matriz, incluido el smoke test
de distribución.

## Test Cases Progress for STORY-093

> La matriz automatizada de `skill-preflight` y `sddf-init` fue intentada, pero el
> runner de modelo alcanzó su cuota semanal antes de evaluar los prompts. Los checks
> quedan pendientes para no declarar un PASS inexistente; la evidencia estática y el
> smoke de instalación quedan registrados en `implement-report.md`.

- [ ] E2E-001 Precedencia de raíz única
- [ ] E2E-002 Ausencia o invalidez de fuente
- [ ] E2E-003 Diagnóstico bajo demanda
- [ ] IT-001 Bootstrap con configuración versionada
- [ ] IT-002 Separación de raíces en consumidores especiales
- [ ] EV-001 Auditoría de contrato en skills fuente
- [ ] EV-002 Configuración y plantilla compatibles
- [ ] EV-003 Error seguro de override de entorno
- [ ] EV-004 Error seguro de configuración
- [ ] EV-005 Preflight no mutante y sin dependencia legada
- [ ] EV-006 Portabilidad y resolución única
- [ ] EV-007 Bootstrap no persiste override temporal
- [ ] EV-008 Default conserva creación de salida propia
- [ ] EV-009 Evals y ejemplos no conservan contrato retirado
- [ ] EV-010 Normalización de rutas configuradas
- [ ] EV-011 Override válido evita YAML defectuoso
- [ ] EV-012 Documentación activa coherente
