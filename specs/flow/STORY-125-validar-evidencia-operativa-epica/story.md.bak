---
alwaysApply: false
type: story
id: STORY-125
kind: feat
slug: STORY-125-validar-evidencia-operativa-epica
title: "Validar la evidencia operativa de una épica"
status: SPECIFY
substatus: DONE
parent: EPIC-23-skill-epic-validate
created: 2026-10-12
updated: 2026-10-17
related:
  - EPIC-23-skill-epic-validate
  - STORY-124
  - STORY-126
  - STORY-127
  - STORY-128
---
[[EPIC-23-skill-epic-validate]]

# 📖 Historia: Validar la evidencia operativa de una épica

**Como** Solo Builder y mantenedor de Agile-SDDF que debe confirmar que una épica funciona antes de liberarla  
**Quiero** incorporar al veredicto la evidencia de smoke tests, verificación de release y DoD aplicable  
**Para** evitar liberar una épica cuyo comportamiento operativo o controles de calidad fallan

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Evidencia operativa aprobada
```gherkin
Dado una épica con historias terminales y análisis APPROVED
  Y con smoke tests y verificación de release (verify:release) aprobados
Cuando se valida la épica
Entonces se escribe epic-validate-report.md con APPROVED
  Y registra cada smoke test como aprobado
  Y no hay motivos de bloqueo
```

### AC-2 — Escenario alternativo — Evidencia operativa fallida
```gherkin
Dado un smoke test, el comando verify:release o un criterio del DoD de épica que falla
Cuando se valida la épica
Entonces el reporte queda BLOCKED e identifica la comprobación y su resultado
```

### AC-3 — Escenario alternativo — Control opcional no configurado
```gherkin
Dado que falta el comando verify:release o no existe un DoD de épica
Cuando se valida la épica
Entonces el reporte registra la comprobación como omitida sin bloquear por su ausencia
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Trazabilidad:** cada resultado identifica el smoke test, comando o criterio DoD evaluado.
- **CNF-2 — Alcance acotado:** la validación solo consume la evidencia necesaria y no vuelve a ejecutar verificaciones de historias hijas ya reportadas.

## 🚫 Fuera de alcance

- Determinar el cierre de historias y el estado del análisis de la épica.
- Definir nuevos smoke tests o modificar el checklist DoD.
- Integrar el veredicto con una transición de estado.

## 📎 Notas / contexto adicional

- Amplía el veredicto estructural entregado por STORY-124.
- La falta de una comprobación opcional se comunica como advertencia; un fallo de una comprobación configurada bloquea la liberación.
- Cubre el criterio de salida de EPIC-23: **CS-4** — Se verifican los smoke tests, `verify:release` y el DoD de épica cuando exista.
- Cubre SMOKE-1 de EPIC-23 (AC-1).
