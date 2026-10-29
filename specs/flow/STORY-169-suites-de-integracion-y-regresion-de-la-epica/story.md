---
alwaysApply: false
type: story
id: STORY-169
kind: feat
slug: STORY-169-suites-de-integracion-y-regresion-de-la-epica
title: "Suites de integración y regresión de la épica"
status: READY-FOR-IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-27
updated: 2026-10-29
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-124-validar-preparacion-estructural-epica
  - STORY-125-validar-evidencia-operativa-epica
  - STORY-126-operar-validacion-epica-segura
  - STORY-137-controlar-detalle-ejecucion-validacion-epica
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Ejecutar las suites de nivel épica y comprobar su DoD en `/epic-validate`

**Como** Solo Builder que valida una épica antes de liberarla  
**Quiero** que `/epic-validate --mode auto` ejecute, en el entorno desde el que lo invoco, las suites de nivel épica declaradas en `verify` de `sddf.config.yaml` (integración, E2E y regresión completa), compruebe el DoD de validación de épica (`docs/guardrails/dod-epic-validate.md`) si existe e incorpore ambos resultados al veredicto  
**Para** certificar que el conjunto de historias funciona como un release unificado

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Todas las suites pasan
```gherkin
Dado que sddf.config.yaml declara en "verify" las suites "integration", "e2e" y "e2e-regression"
  Y no existe docs/guardrails/dod-epic-validate.md
  Y ninguna otra verificación de epic-validate reporta hallazgos
Cuando el Solo Builder ejecuta "/epic-validate EPIC-NN --mode auto"
Entonces se ejecuta el comando de cada suite
  Y epic-validate-report.md registra por suite su comando, su resultado y su duración en segundos con un decimal
  Y el veredicto es "APPROVED"
```

### AC-2 — Resultado de una suite y su efecto en el veredicto
```gherkin
Esquema del escenario: Una suite no pasa
  Dado que la suite "<suite>" está declarada en "verify" con required: <required>
    Y su comando <resultado>
    Y las demás suites de nivel épica pasan
    Y ninguna otra verificación de epic-validate reporta hallazgos
  Cuando el Solo Builder ejecuta "/epic-validate EPIC-NN --mode auto"
  Entonces el reporte registra la suite como "<registro>"
    Y el veredicto es "<veredicto>"
Ejemplos:
  | suite          | required | resultado                                         | registro                     | veredicto     |
  | integration    | true     | termina con código de salida 1                    | fallida                      | NEEDS-CHANGES |
  | integration    | true     | invoca un script npm no declarado en package.json | no ejecutable, con el motivo | BLOCKED       |
  | e2e-regression | false    | invoca un script npm no declarado en package.json | omitida, con el motivo       | APPROVED      |
  | e2e-regression | false    | termina con código de salida 1                    | fallida                      | NEEDS-CHANGES |
```

### AC-3 — Regla de precedencia – Fallo y bloqueo a la vez
```gherkin
Dado que la suite "integration", con required: true, termina con código de salida 1
  Y la suite "e2e", declarada con required: true, invoca un script npm no declarado en package.json
Cuando el Solo Builder ejecuta "/epic-validate EPIC-NN --mode auto"
Entonces el reporte registra "integration" como fallida y "e2e" como no ejecutable
  Y el veredicto es "NEEDS-CHANGES"
```

### AC-4 — DoD de validación de épica
```gherkin
Esquema del escenario: Comprobación del DoD de validación de épica
  Dado que todas las suites de nivel épica pasan
    Y ninguna otra verificación de epic-validate reporta hallazgos
    Y docs/guardrails/dod-epic-validate.md <estado del DoD>
  Cuando el Solo Builder ejecuta "/epic-validate EPIC-NN --mode auto"
  Entonces el reporte <registro del DoD>
    Y el veredicto es "<veredicto>"
Ejemplos:
  | estado del DoD                                           | registro del DoD                                                         | veredicto     |
  | no existe                                                | registra el DoD como omitido con una advertencia                         | APPROVED      |
  | existe y todos sus criterios se cumplen                  | registra cada criterio como cumplido con su evidencia                    | APPROVED      |
  | existe y un criterio no se cumple                        | registra ese criterio como incumplido con su evidencia                   | NEEDS-CHANGES |
  | existe y un criterio no tiene evidencia y ninguno falla  | registra ese criterio como sin evidencia                                 | BLOCKED       |
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Configuración como fuente única:** los comandos de las suites se leen de `verify` en `sddf.config.yaml` y los criterios del DoD, de `docs/guardrails/dod-epic-validate.md` en tiempo de ejecución; el skill no hardcodea comandos ni criterios.
- **CNF-2 — Suites opcionales:** una suite con `required: false` que no se puede ejecutar se registra como omitida y no produce `BLOCKED` (AC-2).
- **CNF-3 — Sin control del entorno:** el skill ejecuta los comandos en el entorno desde el que se invoca. No selecciona, prepara ni comprueba la disponibilidad de ningún entorno (staging u otro); si el entorno no responde, la suite fallará y se registrará como tal.

## Fuera de alcance (Non-Goals)

- Reejecutar las pruebas unitarias o de componente de cada historia que ya tiene evidencia.
- Declarar, provisionar, desplegar, seleccionar o comprobar un entorno de staging u otro entorno. Lo prepara el Solo Builder antes de invocar `/epic-validate`.
- Crear o definir el contenido de `docs/guardrails/dod-epic-validate.md`.
- La previsualización con `--dry-run` y el detalle de salida con `--verbose`: pertenecen a STORY-126 y STORY-137.

## 📎 Notas / contexto adicional

- Generado automáticamente desde la épica: `specs/flow/EPIC-23-completar-flujo-de-epic/epic.md`.
- Feature origen: STORY-169 — Suites de integración y regresión de la épica.
- **Criterios de salida que cubre:** CS-11.
- **Prerrequisitos de implementación:** STORY-124 crea el skill `epic-validate` y `epic-validate-report.md`; STORY-126 define `--mode`. Esta historia agrega al reporte una sección de suites y otra de DoD. Se puede desarrollar con un stub del resto de la evidencia (AC-1: «ninguna otra verificación reporta hallazgos») y con el modo simulado como parámetro de entrada, sin esperar a que STORY-125 se entregue.
- **Decisión — Suites de nivel épica:** son la lista fija de claves `integration`, `e2e` y `e2e-regression` de `verify`, la misma que nombra CS-11. Una clave ausente de `verify` se registra como omitida con una advertencia. Las demás claves de `verify` (`unit`, `component`, `contract`, `e2e-smoke`, `e2e-sanity`, `e2e-file`, `performance`, `eval`) no se ejecutan en esta validación.
- **Decisión — Entorno:** el skill no controla el entorno (CNF-3), así que no hace falta declararlo en `sddf.config.yaml` ni decidirlo con el PO. Si una suite necesita staging, su propio comando lo resuelve (por ejemplo, con variables de entorno que el Solo Builder exporta antes de invocar).
- **Definición observable de «no ejecutable»:** el comando no llega a iniciarse porque invoca un script npm que no está declarado en `package.json` o porque el ejecutable no se encuentra (código de salida 127). Cualquier otro código de salida distinto de 0 es una suite fallida, aunque la causa sea el entorno. Por ejemplo, con la configuración actual, `e2e` y `e2e-regression` (`required: false`) invocan scripts que `package.json` no declara, así que se registran como omitidas.
- **DoD de validación de épica:** se lee de `docs/guardrails/dod-epic-validate.md`, con el mismo formato de checklist que los `dod-story-*.md`. Hoy el archivo no existe, así que se registra como omitido (AC-4). Un criterio incumplido produce `NEEDS-CHANGES` y uno sin evidencia, `BLOCKED`.
- **Solapamiento con STORY-125:** STORY-125 (CS-4) también evalúa «el DoD de épica existente» y trata su fallo como `BLOCKED`, con el vocabulario anterior. Esta historia fija el archivo (`dod-epic-validate.md`) y aplica el vocabulario vigente. Hay que reconciliarlas al refinar la épica para que el DoD se evalúe una sola vez.
- **Vocabulario del veredicto:** sigue la decisión del PO del 2026-10-17 y la regla G-05 de `validation-contract-policy`.
- **Tamaño:** si la comprobación del DoD resulta grande, evaluar un split con `/story-split` (ejecución de suites / comprobación del DoD).
- Cubre el criterio de salida de EPIC-23: **CS-11** — En `--mode auto`, `epic-validate` ejecuta las suites de nivel épica declaradas en `verify` de `sddf.config.yaml` (integración, E2E y regresión completa) y registra el resultado de cada una en el reporte; una suite que falla produce `NEEDS-CHANGES` y una que no se puede ejecutar, `BLOCKED`.
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
