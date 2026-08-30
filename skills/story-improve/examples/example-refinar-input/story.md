---
alwaysApply: false
type: story
id: STORY-075
slug: STORY-075-integrar-historia-modo-manual-dryrun
title: "story-integrate: Modos de ejecución (manual y dry-run)"
status: SPECIFY
substatus: DONE
parent: <nombre-del-directorio-de-la-epica-padre>
created: 2026-05-17
updated: 2026-05-17
related:
  - STORY-074
  - STORY-076
---
**FINVEST Score:** 3.94
**FINVEST Decisión:** REFINAR
---

# 📖 Historia: story-integrate — Modos de ejecución (manual y dry-run)

**Como** desarrollador que opera story-integrate en entornos con distintos niveles de automatización
**Quiero** que story-integrate soporte modos de ejecución manual y dry-run
**Para** poder verificar qué acciones ejecutaría el skill antes de confirmarlas, o forzar la integración sin confirmación automática en pipelines CI/CD

## ✅ Criterios de aceptación

### Escenario principal – Integración en modo dry-run

```gherkin
Dado que la historia "STORY-042" está lista para integrar
  Y ejecuto story-integrate con el flag "--dry-run"
Cuando el skill procesa la historia
Entonces el skill muestra las acciones que ejecutaría (rama objetivo, commit, merge)
  Y no ejecuta ninguna acción real sobre el repositorio
  Y no modifica ningún archivo ni rama
```

### Escenario alternativo – Modo manual: confirmación explícita requerida

```gherkin
Dado que la historia "STORY-042" está lista para integrar
  Y ejecuto story-integrate con el flag "--manual"
Cuando el skill llega al paso de integración
Entonces el skill muestra un resumen de las acciones pendientes
  Y espera confirmación explícita del usuario antes de ejecutar cualquier acción
  Y si el usuario confirma, ejecuta la integración normalmente
```

## ⚙️ Criterios no funcionales

* **Seguridad:** el modo dry-run nunca escribe archivos ni ejecuta comandos git que modifiquen el estado del repositorio
* **Usabilidad:** el output del modo dry-run es idéntico en estructura al output de una ejecución real, diferenciado únicamente por un prefijo `[DRY-RUN]`

## 📎 Notas / contexto adicional

Historia adicional resultante del split de STORY-074 (épica original).
Precondición de implementación: STORY-074 debe estar completa para poder implementar los modos manual y dry-run.
Historias hermanas: STORY-074 (batch configurable — core), STORY-076 (multi-modelo de entrega).
