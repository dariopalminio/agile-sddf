---
alwaysApply: false
type: story
id: STORY-093
kind: chore
slug: STORY-093-raiz-configurable-preflight-diagnostico
title: "Resolver una raíz configurable y usar preflight como diagnóstico"
status: IMPLEMENT
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

# 📖 Historia: Resolver una raíz configurable y usar preflight como diagnóstico

**Como** mantenedor del framework SDDF que trabaja en repositorios y entornos de CI con estructuras documentales distintas

**Quiero** declarar una única raíz de artefactos en configuración versionada, con `SDDF_ROOT` como override, y ejecutar la validación de entorno sólo cuando la solicito

**Para** ejecutar los skills de forma predecible sin repetir validación de entorno en cada invocación (más eficiente y menos consumo de tokens) ni perder trazabilidad de la configuración usada

## ✅ Criterios de aceptación

### Escenario principal – Resolución de una raíz única por precedencia

```gherkin
Escenario Outline: Resolver SPECS_BASE desde configuración o entorno
  Dado que las rutas configuradas existen y son accesibles
  Y `sddf.config.yaml` declara `root: "<root_configurada>"`
  Y `SDDF_ROOT` tiene el valor "<root_entorno>"
  Cuando un skill necesita leer o escribir artefactos SDDF
  Entonces usa "<root_efectiva>" como SPECS_BASE durante toda la invocación
  Y conserva la estructura `specs/`, `templates/` y demás artefactos bajo esa única raíz

Ejemplos:
  | root_configurada | root_entorno       | root_efectiva |
  | docs             | (no definida)      | docs           |
  | docs-personalizada | (no definida)    | docs-personalizada |
  | docs             | artefactos-ci      | artefactos-ci  |
```

### Escenario alternativo / error – Fallback seguro y rechazo de una raíz explícita inválida

```gherkin
Escenario Outline: Resolver una configuración ausente o inválida sin escribir en una ruta inesperada
  Dado que SDDF_ROOT tiene el valor "<root_entorno>"
  Y `sddf.config.yaml` declara la raíz "<root_configurada>"
  Cuando un skill necesita resolver SPECS_BASE
  Entonces <resultado_esperado>
  Y <comportamiento_de_escritura>

Ejemplos:
  | root_entorno   | root_configurada | resultado_esperado | comportamiento_de_escritura |
  | (no definida)  | (no declarada)   | usa `docs` como valor por defecto | puede continuar en `docs` |
  | ruta-invalida  | docs             | informa que `SDDF_ROOT` no es utilizable | no escribe artefactos |
  | (no definida)  | ruta-invalida    | informa que `root` no es utilizable | no escribe artefactos |
```

### Escenario alternativo – Preflight se ejecuta sólo como diagnóstico explícito

```gherkin
Escenario: Diagnosticar el entorno bajo demanda
  Dado que el repositorio tiene una raíz de artefactos resuelta correctamente
  Cuando el mantenedor invoca `/skill-preflight` de forma explícita
  Entonces el informe indica la raíz efectiva y la fuente que la determinó
  Y verifica la estructura y los templates requeridos sin modificar configuración ni artefactos
  Pero la ejecución normal de un skill no exige ni invoca automáticamente ese informe antes de su lógica de negocio
```

### Requerimiento: Contrato compartido de resolución

- La precedencia canónica es `SDDF_ROOT` válido → `$REPO_ROOT/sddf.config.yaml.root` válido →
  `docs` por defecto.
- `sddf-init` crea `sddf.config.yaml` con `root: docs` cuando inicializa un proyecto y no sobrescribe
  un valor `root` existente.
- Los skills que acceden a artefactos aplican el contrato directamente y conservan la resolución de
  `CLI_ROOT` y `REPO_ROOT` independiente de `SPECS_BASE`.
- `skill-preflight` reutiliza el mismo contrato como diagnóstico bajo demanda y deja de advertir sobre
  OpenSpec retirado cuando no es relevante para el skill invocado.

## ⚙️ Criterios no funcionales

* **Portabilidad:** el contrato funciona en Codex, Claude Code, OpenCode y GitHub Copilot, incluido Windows,
  sin requerir herramientas de shell o parseadores externos específicos.
* **Rendimiento:** cada skill resuelve la raíz una sola vez por invocación y reutiliza ese resultado
  durante el resto de su workflow.
* **Compatibilidad:** si no hay configuración ni override, los artefactos siguen resolviéndose bajo
  `docs/`; no se altera la estructura existente de `specs/` ni los campos actuales de configuración.
* **Documentación:** `sddf.config.yaml`, su template, `.env.template`, `README.md`, `AGENTS.md` y las
  políticas relevantes describen la misma precedencia y el nuevo carácter diagnóstico de preflight.
* **Verificabilidad:** una comprobación sobre los skills fuente demuestra que no queda una invocación
  automática a `skill-preflight` en su hot path.

## Fuera de alcance (Non-Goals)

- Soportar más de una raíz de artefactos simultánea en un mismo proyecto.
- Decidir el mecanismo concreto de resolución o caché (script, librería o capacidad del harness).
- Crear o migrar automáticamente directorios de raíz existentes fuera del comportamiento idempotente
  de `sddf-init`.
- Cambiar el modelo de entrega, los comandos de pruebas o los workers configurados actualmente.
- Rediseñar la selección de runtime; `CLI_ROOT` debe conservar compatibilidad, no convertirse en otra
  raíz de artefactos.
- Los skills de .agents/, .claude/ y .github/ no se tocan por no ser parte de las fuentes de artefactos.

## 📎 Notas / contexto adicional

Esta historia revisa deliberadamente los contratos introducidos por STORY-049 (solo `SDDF_ROOT` con
fallback a `docs`) y STORY-053 (preflight obligatorio). La configuración versionada aporta
trazabilidad y el override de entorno conserva la flexibilidad necesaria para CI/CD.

La migración toca el contrato común, `sddf-init`, `skill-preflight`, skills consumidores, scripts y
documentación normativa. Si la estimación confirma que no cabe en un incremento, dividir primero la
migración de consumidores después de acordar y validar el contrato común, sin dejar rutas con
precedencias inconsistentes.
