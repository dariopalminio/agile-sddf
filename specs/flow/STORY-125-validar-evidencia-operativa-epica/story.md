---
alwaysApply: false
type: story
id: STORY-125
kind: feat
slug: STORY-125-validar-evidencia-operativa-epica
title: "Validar la evidencia operativa de una épica"
status: IMPLEMENT
substatus: DONE
parent: EPIC-23-completar-flujo-de-epic
created: 2026-10-12
updated: 2026-10-30
related:
  - EPIC-23-completar-flujo-de-epic
  - STORY-124
  - STORY-126
  - STORY-127
  - STORY-128
---
[[EPIC-23-completar-flujo-de-epic]]

# 📖 Historia: Validar la evidencia operativa de una épica

**Como** Solo Builder y mantenedor de Agile-SDDF que debe confirmar que una épica funciona antes de liberarla  
**Quiero** incorporar al veredicto la evidencia de smoke tests, verificación de release y DoD aplicable  
**Para** evitar liberar una épica cuyo comportamiento operativo o controles de calidad fallan

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Evidencia operativa aprobada según el modo
```gherkin
Esquema del escenario: Evidencia operativa aprobada según el modo
  Dado una épica cuya validación estructural es APPROVED
    Y cuyos smoke tests SMOKE-N quedan aprobados mediante "<fuente>"
    Y cuyo comando verify:release termina sin errores
  Cuando el mantenedor valida la épica con --mode <modo>
  Entonces se escribe epic-validate-report.md con el veredicto APPROVED
    Y registra cada SMOKE-N como aprobado junto con "<fuente>"
    Y no hay motivos de bloqueo
Ejemplos:
  | modo   | fuente                                |
  | auto   | su ejecución                          |
  | manual | un reporte existente que lo aprueba   |
  | manual | la confirmación manual del mantenedor |
```

### AC-2 — Escenario alternativo — Evidencia operativa fallida
```gherkin
Dado una épica cuya validación estructural es APPROVED
  Y una comprobación configurada que falla: un smoke test, el comando verify:release o un criterio del DoD de épica existente
Cuando se valida la épica
Entonces el reporte queda NEEDS-CHANGES
  Y identifica la comprobación fallida, su resultado y la evidencia de la que proviene
```

### AC-3 — Escenario alternativo — Controles opcionales no configurados
```gherkin
Dado una épica cuya validación estructural es APPROVED
  Y un proyecto sin comando verify:release ni DoD de épica
Cuando se valida la épica
Entonces el reporte registra ambas comprobaciones como omitidas con una advertencia
  Y el veredicto no se degrada por su ausencia
  Pero los smoke tests de la épica se evalúan igualmente
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Trazabilidad:** cada resultado identifica el smoke test, comando o criterio DoD evaluado y la fuente de su evidencia.
- **CNF-2 — Alcance acotado:** la validación ejecuta `verify:release` y, solo en `--mode auto`, los smoke tests de la épica; no vuelve a ejecutar las verificaciones de las historias hijas ya reportadas.

## 🚫 Fuera de alcance

- Determinar el cierre de historias y el estado del análisis de la épica.
- Definir nuevos smoke tests o modificar el checklist DoD.
- Integrar el veredicto con una transición de estado.
- Definir la mecánica de invocación de los modos, la previsualización y los códigos de salida (STORY-126).

## 📎 Notas / contexto adicional

- Amplía el veredicto estructural entregado por STORY-124: consume su veredicto y agrega a `epic-validate-report.md` una sección de comprobaciones operativas. El veredicto final combina el estructural y el operativo según G-05. Se puede desarrollar con un reporte de prueba que fije el veredicto estructural, sin esperar a que STORY-124 se entregue.
- **Regla — Fuente de evidencia de los smoke tests según el modo:**
  - `--mode auto`: cada `SMOKE-N` de `epic.md` se ejecuta, sin pedir ninguna confirmación interactiva.
  - `--mode manual`: no se ejecuta ningún smoke test. Se toma como evidencia un reporte existente que lo registre como aprobado (por ejemplo, `verify-report.md` o `acceptance-report.md` de la historia dueña) y, si no hay ninguno, se pide confirmación al mantenedor. Una confirmación negativa cuenta como comprobación fallida (AC-2).
- Esta historia fija la fuente de evidencia de cada modo. La mecánica de `--mode`, la previsualización y los códigos de salida pertenecen a STORY-126. Mientras STORY-126 no se entregue, el modo se puede simular como un parámetro de entrada.
- **Regla — DoD de épica:** se evalúa solo si existe. Hoy el repositorio no define ninguno (`docs/guardrails/` solo contiene `dod-story-*`), así que su ausencia se registra como comprobación omitida (AC-3).
- Una comprobación cuya evidencia no se puede obtener (smoke test no ejecutable o sin confirmación) deja el reporte en BLOCKED, salvo que otra falle (G-05).
- La falta de una comprobación opcional se comunica como advertencia; un fallo de una comprobación configurada bloquea la liberación.
- Cubre el criterio de salida de EPIC-23: **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista.
- Cubre SMOKE-1 de EPIC-23 (AC-1).
- Cumple antes de entregarse el criterio transversal de EPIC-23: **CS-21** — `npm run verify:repository` y `npm test` pasan sin errores.
