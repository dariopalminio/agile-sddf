---
type: implement-report
id: STORY-093
story: STORY-093
slug: STORY-093-raiz-configurable-preflight-diagnostico-implement-report
created: 2026-09-12
updated: 2026-09-12
parent: EPIC-19-framework-consistency
related:
  - STORY-093-raiz-configurable-preflight-diagnostico
  - STORY-049-reading-of-sddf-root
  - STORY-053-centralizar-validacion-entorno-sddf
  - STORY-054-inicializar-entorno-sddf
---

<!-- Referencias -->
[[STORY-093-raiz-configurable-preflight-diagnostico]]

# Implement Report: Resolver una raíz configurable y usar preflight como diagnóstico

## Resumen

| Métrica | Valor |
|---|---|
| Fase RED confirmada | sí — el auditor nuevo falló contra el contrato anterior antes de aplicar la migración. |
| Fase GREEN confirmada | sí — `node scripts/audit-root-resolution.js` verifica el contrato fuente en los 32 skills. |
| Fase REFACTOR confirmada | sí — comprobaciones de sintaxis, JSON, distribución y `git diff --check` sin errores. |
| Archivos de prueba generados | 1 nuevo (`scripts/audit-root-resolution.js`) y 4 soportes de eval actualizados. |
| Archivos de producción generados | 0 nuevos; configuración, 32 skills fuente, documentación y trazabilidad actualizados. |
| Modo de ejecución | interactivo, sin rework (`fix-directives.md` ausente). |

> Advertencia de infraestructura: se intentó ejecutar `npm run test:eval -- skill-preflight sddf-init`, pero el runner devolvió únicamente el límite semanal de uso del modelo. Los ocho resultados `FAIL` de esos reportes no son fallos funcionales del contrato y no se marcan como PASS. El detalle queda en `.tmp/skill-test-evals/` y los checkboxes de `testcases.md` permanecen pendientes.

## Ciclo TDD

| Fase | Estado | Detalle |
|---|---|---|
| RED | ✅ | Se creó el auditor no mutante y falló contra el estado inicial: faltaba `root`, `.env.template` fijaba `SDDF_ROOT`, no existía el contrato local en los skills y quedaban dependencias de preflight automático. Se actualizaron los fixtures de `skill-preflight` y `sddf-init`. |
| GREEN | ✅ | Se añadió `root: docs` a la configuración y sus plantillas; `sddf-init` aplica el bootstrap seguro; `skill-preflight` pasó a ser explícito y de solo lectura; los 32 `SKILL.md` fuente resuelven la raíz localmente; se retiró el normalizador que reinsertaba el Paso 0. El auditor termina correctamente. |
| REFACTOR | ✅ | Se normalizaron las rutas especiales de `story-verify` y `story-code-review`, se hizo dinámico el informe de `sddf-init` para una raíz configurada y se actualizaron las guías normativas sin alterar copias instaladas. |

## Verificaciones ejecutadas

| Comprobación | Resultado |
|---|---|
| `node scripts/audit-root-resolution.js` | ✅ Contrato verificado en 32 skills fuente. |
| `node --check scripts/audit-root-resolution.js` y `node --check scripts/install.js` | ✅ Sintaxis válida. |
| Parseo de los `evals/evals.json` modificados | ✅ JSON válido. |
| `npm run test:eval -- skill-preflight sddf-init --dry-run` | ✅ Runner y ocho fixtures detectados correctamente. |
| Ejecución real de los ocho evals | ⚠️ Bloqueada por la cuota semanal del modelo; no se infiere un PASS. |
| Smoke de instalación temporal con `node scripts/cli.js install --target .agents --force` | ✅ 32 skills y 10 agentes instalados; se verificaron el marcador de contrato y el template con `root: docs`. |
| `git diff --check` | ✅ Sin errores de whitespace; solo avisos de conversión LF/CRLF de Git. |

## DoD IMPLEMENT

| Criterio | Estado | Observación |
|---|---|---|
| Todos los escenarios Gherkin pasan | ⚠️ | El auditor y el smoke cubren el contrato estático; la ejecución de evals con modelo quedó bloqueada externamente. |
| Criterios no funcionales verificados | ✓ | Resolución única, rutas portables, separación `REPO_ROOT`/`SPECS_BASE`/`CLI_ROOT`, documentación y distribución comprobadas. |
| Comportamiento alineado con `design.md` | ✓ | D-1 a D-7 se reflejan en configuración, bootstrap, diagnóstico, consumidores, auditor y documentación. |
| Sin regresiones | ✓ | Auditor, sintaxis, JSON, instalación temporal y chequeo de diff superados. |
| Convenciones de `constitution.md` | ✓ | Se editó exclusivamente la fuente `skills/`; las copias instaladas se validaron mediante una instalación limpia. |
| Sin código comentado ni `TODO` nuevo | ✓ | El script nuevo usa comentarios de documentación, sin código deshabilitado ni `TODO`. |
| Sin variables o imports sin usar | ✓ | `audit-root-resolution.js` pasó comprobación de sintaxis y sus imports se utilizan. |
| Linter/formateador | ⚠️ | El repositorio no configura linter ni formateador para Markdown/JSON; se usaron los chequeos disponibles. |
| Sin dependencias nuevas | ✓ | Ninguna. |
| Uso de `skill-master` para skills nuevos | ✓ | No se creó un skill nuevo; se modificaron contratos de skills existentes y un script de auditoría. |
| Nueva ruta de skill en `package.json` | ✓ | No aplica: `scripts/` ya está incluido en `files`. |
| Checklists de seguridad | ⚠️ | No se ejecutaron como gate separado; no se añadieron secretos, red ni dependencias. Pendiente de la revisión posterior. |
| Skills críticos con `evals/evals.json` | ✓ | `skill-preflight` y `sddf-init` tienen matrices v2.0.0 actualizadas. |
| Casos evaluados automáticamente | ⚠️ | El dry-run pasó; la evaluación LLM real no pudo iniciar por cuota semanal. |
| `tasks.md` completo | ⚠️ | T019 queda pendiente exclusivamente de reintentar la matriz cuando el runner esté disponible; T020 y T021 pasaron. |
| README y documentación actualizados | ✓ | Configuración, políticas, dominio y guías activas describen el mismo contrato. |
| Decisiones imprevistas documentadas | ✓ | No se introdujeron decisiones nuevas fuera de D-1 a D-7. |
| CHANGELOG actualizado si aplica | ✓ | No se prepara una publicación en esta historia; no se requiere entrada de release. |
| Build de CI | ⚠️ | El repositorio no tiene pipeline funcional de build/test/lint para este tipo de artefacto. |
| Sin secretos expuestos | ✓ | Revisión de los cambios: no se añadieron credenciales ni valores sensibles. |
| Variables de entorno documentadas | ✓ | `SDDF_ROOT` se documenta como override opcional y validado. |
| Despliegue reversible | ✓ | Cambios versionables; la instalación se validó en un directorio temporal. |

> No hay criterios con `❌`; las advertencias corresponden a capacidad externa o a checks no configurados. La historia queda en `IMPLEMENT/DONE` y pasa al gate de revisión.

## Pendiente operativo

Cuando la cuota del runner se restablezca, ejecutar:

```text
npm run test:eval -- skill-preflight sddf-init
```

Después, actualizar los checkboxes EV de `testcases.md` con el resultado real. El siguiente paso normal del pipeline sigue siendo:

```text
/story-code-review STORY-093
```
