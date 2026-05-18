---
alwaysApply: false
type: story
id: FEAT-074
slug: FEAT-074-integrar-historia-batch-configurable
title: "story-integrate: Integración batch configurable"
status: SPECIFYING
substatus: DONE
parent: <nombre-del-release-padre>
created: 2026-05-17
updated: 2026-05-17
related:
  - FEAT-075
  - FEAT-076
---
**FINVEST Score:** 4.19
**FINVEST Decisión:** APROBADA
---

# 📖 Historia: story-integrate — Integración batch configurable

**Como** desarrollador que trabaja con modelos de entrega batch (releases periódicos)
**Quiero** que story-integrate integre automáticamente una historia aprobada hacia la rama de release configurada
**Para** poder cerrar el ciclo de desarrollo de una historia sin intervención manual en el flujo de integración

## ✅ Criterios de aceptación

### Escenario principal – Integración exitosa hacia rama de release

```gherkin
Dado que la historia "FEAT-042" tiene status: IMPLEMENTING / substatus: DONE
  Y el modelo de entrega configurado es "batch" con rama objetivo "release/v1.2.0"
Cuando ejecuto story-integrate para la historia "FEAT-042"
Entonces el skill crea un commit de integración en la rama "release/v1.2.0"
  Y actualiza el frontmatter de story.md con status: INTEGRATION / substatus: DONE
  Y genera un reporte de integración con el resultado de la operación
```

### Escenario alternativo – Historia no lista para integrar

```gherkin
Dado que la historia "FEAT-042" tiene status: IMPLEMENTING / substatus: IN-PROGRESS
Cuando ejecuto story-integrate para la historia "FEAT-042"
Entonces el skill informa que la historia no está lista para integrar
  Y muestra el estado actual y el estado requerido
  Y no ejecuta ninguna acción de integración
```

## ⚙️ Criterios no funcionales

* **Idempotencia:** si la historia ya fue integrada, el skill lo detecta y no duplica el commit de integración
* **Trazabilidad:** el reporte de integración incluye el hash del commit, la rama objetivo y la fecha

## 📎 Notas / contexto adicional

Historia core resultante del split de FEAT-074 (épica original de integración batch).
Historias hermanas: FEAT-075 (modos manual/dry-run), FEAT-076 (multi-modelo de entrega).
