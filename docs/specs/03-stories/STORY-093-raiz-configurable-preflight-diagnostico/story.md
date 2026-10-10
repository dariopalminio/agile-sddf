---
alwaysApply: false
type: story
id: STORY-093
kind: chore
slug: STORY-093-raiz-configurable-preflight-diagnostico
title: "Resolver una raÃ­z configurable y usar preflight como diagnÃ³stico"
status: COMPLETED
substatus: DONE
parent: EPIC-19-framework-consistency
created: 2026-09-12
updated: 2026-09-12
related:
  - EPIC-19-framework-consistency
  - STORY-049-reading-of-sddf-root
  - STORY-053-centralizar-validacion-entorno-sddf
  - STORY-054-inicializar-entorno-sddf
---
<!-- Referencias -->
[[EPIC-19-framework-consistency]]
[[STORY-049-reading-of-sddf-root]]
[[STORY-053-centralizar-validacion-entorno-sddf]]
[[STORY-054-inicializar-entorno-sddf]]

# ðŸ“– Historia: Resolver una raÃ­z configurable y usar preflight como diagnÃ³stico

**Como** mantenedor del framework SDDF que trabaja en repositorios y entornos de CI con estructuras documentales distintas

**Quiero** declarar una Ãºnica raÃ­z de artefactos en configuraciÃ³n versionada, con `SDDF_ROOT` como override, y ejecutar la validaciÃ³n de entorno sÃ³lo cuando la solicito

**Para** ejecutar los skills de forma predecible sin repetir validaciÃ³n de entorno en cada invocaciÃ³n (mÃ¡s eficiente y menos consumo de tokens) ni perder trazabilidad de la configuraciÃ³n usada

## âœ… Criterios de aceptaciÃ³n

### Escenario principal â€“ ResoluciÃ³n de una raÃ­z Ãºnica por precedencia

```gherkin
Escenario Outline: Resolver SPECS_BASE desde configuraciÃ³n o entorno
  Dado que las rutas configuradas existen y son accesibles
  Y `sddf.config.yaml` declara `root: "<root_configurada>"`
  Y `SDDF_ROOT` tiene el valor "<root_entorno>"
  Cuando un skill necesita leer o escribir artefactos SDDF
  Entonces usa "<root_efectiva>" como SPECS_BASE durante toda la invocaciÃ³n
  Y conserva la estructura `specs/`, `templates/` y demÃ¡s artefactos bajo esa Ãºnica raÃ­z

Ejemplos:
  | root_configurada | root_entorno       | root_efectiva |
  | docs             | (no definida)      | docs           |
  | docs-personalizada | (no definida)    | docs-personalizada |
  | docs             | artefactos-ci      | artefactos-ci  |
```

### Escenario alternativo / error â€“ Fallback seguro y rechazo de una raÃ­z explÃ­cita invÃ¡lida

```gherkin
Escenario Outline: Resolver una configuraciÃ³n ausente o invÃ¡lida sin escribir en una ruta inesperada
  Dado que SDDF_ROOT tiene el valor "<root_entorno>"
  Y `sddf.config.yaml` declara la raÃ­z "<root_configurada>"
  Cuando un skill necesita resolver SPECS_BASE
  Entonces <resultado_esperado>
  Y <comportamiento_de_escritura>

Ejemplos:
  | root_entorno   | root_configurada | resultado_esperado | comportamiento_de_escritura |
  | (no definida)  | (no declarada)   | usa `docs` como valor por defecto | puede continuar en `docs` |
  | ruta-invalida  | docs             | informa que `SDDF_ROOT` no es utilizable | no escribe artefactos |
  | (no definida)  | ruta-invalida    | informa que `root` no es utilizable | no escribe artefactos |
```

### Escenario alternativo â€“ Preflight se ejecuta sÃ³lo como diagnÃ³stico explÃ­cito

```gherkin
Escenario: Diagnosticar el entorno bajo demanda
  Dado que el repositorio tiene una raÃ­z de artefactos resuelta correctamente
  Cuando el mantenedor invoca `/skill-preflight` de forma explÃ­cita
  Entonces el informe indica la raÃ­z efectiva y la fuente que la determinÃ³
  Y verifica la estructura y los templates requeridos sin modificar configuraciÃ³n ni artefactos
  Pero la ejecuciÃ³n normal de un skill no exige ni invoca automÃ¡ticamente ese informe antes de su lÃ³gica de negocio
```

### Requerimiento: Contrato compartido de resoluciÃ³n

- La precedencia canÃ³nica es `SDDF_ROOT` vÃ¡lido â†’ `$REPO_ROOT/sddf.config.yaml.root` vÃ¡lido â†’
  `docs` por defecto.
- `sddf-init` crea `sddf.config.yaml` con `root: docs` cuando inicializa un proyecto y no sobrescribe
  un valor `root` existente.
- Los skills que acceden a artefactos aplican el contrato directamente y conservan la resoluciÃ³n de
  `CLI_ROOT` y `REPO_ROOT` independiente de `SPECS_BASE`.
- `skill-preflight` reutiliza el mismo contrato como diagnÃ³stico bajo demanda y deja de advertir sobre
  OpenSpec retirado cuando no es relevante para el skill invocado.

## âš™ï¸ Criterios no funcionales

* **Portabilidad:** el contrato funciona en Codex, Claude Code, OpenCode y GitHub Copilot, incluido Windows,
  sin requerir herramientas de shell o parseadores externos especÃ­ficos.
* **Rendimiento:** cada skill resuelve la raÃ­z una sola vez por invocaciÃ³n y reutiliza ese resultado
  durante el resto de su workflow.
* **Compatibilidad:** si no hay configuraciÃ³n ni override, los artefactos siguen resolviÃ©ndose bajo
  `docs/`; no se altera la estructura existente de `specs/` ni los campos actuales de configuraciÃ³n.
* **DocumentaciÃ³n:** `sddf.config.yaml`, su template, `.env.template`, `README.md`, `AGENTS.md` y las
  polÃ­ticas relevantes describen la misma precedencia y el nuevo carÃ¡cter diagnÃ³stico de preflight.
* **Verificabilidad:** una comprobaciÃ³n sobre los skills fuente demuestra que no queda una invocaciÃ³n
  automÃ¡tica a `skill-preflight` en su hot path.

## Fuera de alcance (Non-Goals)

- Soportar mÃ¡s de una raÃ­z de artefactos simultÃ¡nea en un mismo proyecto.
- Decidir el mecanismo concreto de resoluciÃ³n o cachÃ© (script, librerÃ­a o capacidad del harness).
- Crear o migrar automÃ¡ticamente directorios de raÃ­z existentes fuera del comportamiento idempotente
  de `sddf-init`.
- Cambiar el modelo de entrega, los comandos de pruebas o los workers configurados actualmente.
- RediseÃ±ar la selecciÃ³n de runtime; `CLI_ROOT` debe conservar compatibilidad, no convertirse en otra
  raÃ­z de artefactos.
- Los skills de .agents/, .claude/ y .github/ no se tocan por no ser parte de las fuentes de artefactos.

## ðŸ“Ž Notas / contexto adicional

Esta historia revisa deliberadamente los contratos introducidos por STORY-049 (solo `SDDF_ROOT` con
fallback a `docs`) y STORY-053 (preflight obligatorio). La configuraciÃ³n versionada aporta
trazabilidad y el override de entorno conserva la flexibilidad necesaria para CI/CD.

La migraciÃ³n toca el contrato comÃºn, `sddf-init`, `skill-preflight`, skills consumidores, scripts y
documentaciÃ³n normativa. Si la estimaciÃ³n confirma que no cabe en un incremento, dividir primero la
migraciÃ³n de consumidores despuÃ©s de acordar y validar el contrato comÃºn, sin dejar rutas con
precedencias inconsistentes.
