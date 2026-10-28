---
alwaysApply: false
type: story
id: STORY-137
kind: feat
slug: STORY-137-controlar-detalle-ejecucion-validacion-epica
title: "Controlar el detalle y los límites de la ejecución de la validación de épicas"
status: SPECIFY
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-17
updated: 2026-10-27
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-125
  - STORY-126
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Controlar el detalle y los límites de la ejecución de la validación de épicas

**Como** Solo Builder y mantenedor de Agile-SDDF que valida una épica antes de liberarla  
**Quiero** pedir la salida completa de los comandos de prueba y recibir un rechazo claro cuando fuerzo la ejecución automática sin pruebas configuradas  
**Para** diagnosticar por qué una épica queda BLOCKED sin repetir los comandos a mano

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Detalle de salida según --verbose
```gherkin
Esquema del escenario: Detalle de salida según --verbose
  Dado una épica cuya validación en --mode auto ejecuta comandos de prueba
  Cuando se solicita la validación con --mode auto <flags>
  Entonces la salida muestra <detalle> de cada comando ejecutado
    Y el veredicto y el contenido de epic-validate-report.md son los mismos en ambos casos
Ejemplos:
  | flags     | detalle                         |
  | --verbose | la salida completa              |
  | (ninguno) | solo el resumen con su resultado |
```

### AC-2 — Escenario de error — --mode auto sin pruebas configuradas
```gherkin
Dado una épica existente sin pruebas configuradas para ejecutar
Cuando se solicita la validación con --mode auto
Entonces la ejecución termina con fallo e informa que no hay pruebas configuradas
  Pero no se crea ni modifica ningún archivo
```

### AC-3 — Escenario alternativo — --verbose combinado con --dry-run
```gherkin
Dado una épica válida para validar
Cuando se solicita la validación con --dry-run --verbose
Entonces la salida indica que no se ejecutó ningún comando de prueba
  Y no se crea ni modifica ningún archivo
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Salida sin efecto en el resultado:** `--verbose` solo cambia lo que se muestra en consola. Nunca altera el veredicto, los hallazgos ni el contenido de `epic-validate-report.md`.
- **CNF-2 — Flags combinables:** `--mode`, `--dry-run` y `--verbose` se pueden combinar y su orden no cambia el resultado.

## 🚫 Fuera de alcance

- Definir la fuente de evidencia de cada modo (STORY-125).
- Seleccionar el modo, la previsualización con `--dry-run` y la idempotencia (STORY-126).
- Incorporar comprobaciones estructurales u operativas nuevas.

## 📎 Notas / contexto adicional

- **Dependencias:** usa los comandos de prueba que ejecuta STORY-125 y la lectura de flags de STORY-126, que aún no están entregadas. Se puede desarrollar y probar sin esperarlas, con un validador stub de veredicto fijo y un comando de prueba falso que produzca una salida conocida.
- **Decisión abierta para el diseño:** cómo se detecta que hay «pruebas configuradas» (por ejemplo, la sección `verify` de `sddf.config.yaml` o la presencia de `SMOKE-N` en `epic.md`). El rechazo de AC-2 sigue el mismo criterio que el modo no reconocido de STORY-126 AC-3: es un error de invocación y no genera reporte.
- **Tabla de flags de EPIC-23:** `--mode auto` fuerza la ejecución automática y falla si no hay tests configurados. `--verbose` muestra la salida completa de los comandos de prueba.
- Cubre el criterio de salida de EPIC-23: **CS-10** — Se reconocen y manejan correctamente los flags `--mode manual`, `--mode auto`, `--dry-run` y `--verbose`. Lo completa junto con STORY-126, que cubre `--mode manual`, `--mode auto` y `--dry-run`.
