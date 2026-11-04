---
alwaysApply: false
type: story
id: STORY-301
kind: feat
slug: STORY-301-exportar-informe-csv
title: "Exportar informe a CSV"
status: SPECIFY
substatus: DONE
parent: EPIC-30-ejemplo
created: 2026-10-21
updated: 2026-10-24
related:
  - EPIC-30-ejemplo
---
[[EPIC-30-ejemplo]]

# 📖 Historia: Exportar informe a CSV

**Como** analista de ventas  
**Quiero** exportar el informe mensual a CSV  
**Para** compartirlo con finanzas

## ✅ Criterios de aceptación

### AC-1 — Escenario principal – Exportar informe a CSV
```gherkin
Dado el informe mensual de octubre
Cuando el usuario ejecuta "Exportar informe a CSV"
Entonces obtiene el resultado esperado
```

## 📎 Notas / contexto adicional

- Cubre el criterio de salida: El informe mensual se exporta a CSV con una fila por venta.
- Cubre SMOKE-1 de la épica.
