# Ejemplo de output esperado: /story-plan STORY-099

Este documento muestra el resumen final que `story-plan` produce al completar el pipeline de planning para la historia de ejemplo `STORY-099`.

---

## Output en consola durante la ejecución

```
🚀 Iniciando pipeline de planning para: STORY-099
   Directorio: specs/flow/STORY-099-exportar-reporte-pdf/
   Pasos: story-design → story-tasking → story-analyze

[Paso 0] ✓ REPO_ROOT resuelto — layout fijo

[1/3] → story-design...
[1/3] ✓ story-design — design.md generado

[2/3] → story-tasking...
[2/3] ✓ story-tasking — tasks.md generado

[3/3] → story-analyze...
[3/3] ✓ story-analyze — analyze.md generado (verdict: APPROVED)
```

## Resumen final — caso exitoso

```
─────────────────────────────────────────────────────────────────────
 Planning: STORY-099 — Exportar reporte de actividad como PDF
─────────────────────────────────────────────────────────────────────
 Paso            │ Estado │ Artefacto
─────────────────────────────────────────────────────────────────────
 story-design    │   ✓    │ design.md
 story-tasking   │   ✓    │ tasks.md
 story-analyze   │   ✓    │ analyze.md
─────────────────────────────────────────────────────────────────────

✅ Planning completo

Todos los artefactos están listos. La historia puede pasar a implementación.
Veredicto de story-analyze: APPROVED — sin inconsistencias
Estado de story.md: READY-FOR-IMPLEMENT/DONE ✓
```

---

## Resumen final — caso con veredicto NEEDS-CHANGES

Línea de progreso previa: `[3/3] ⚠️ story-analyze — analyze.md generado (verdict: NEEDS-CHANGES)`.

```
─────────────────────────────────────────────────────────────────────
 Planning: STORY-099 — Exportar reporte de actividad como PDF
─────────────────────────────────────────────────────────────────────
 Paso            │ Estado │ Artefacto
─────────────────────────────────────────────────────────────────────
 story-design    │   ✓    │ design.md
 story-tasking   │   ✓    │ tasks.md
 story-analyze   │   ⚠️   │ analyze.md
─────────────────────────────────────────────────────────────────────

⚠️ Planning completado — requiere revisión

Veredicto de story-analyze: NEEDS-CHANGES — ERROR de tipo A
→ specs/flow/STORY-099-exportar-reporte-pdf/analyze.md

Estado de story.md: PLAN/IN-PROGRESS (veredicto NEEDS-CHANGES)
Corrige el plan con /story-fix-plan STORY-099 y vuelve a ejecutar /story-analyze STORY-099.
```

---

## Resumen final — caso con fallo en story-design

```
─────────────────────────────────────────────────────────────────────
 Planning: STORY-099 — Exportar reporte de actividad como PDF
─────────────────────────────────────────────────────────────────────
 Paso            │ Estado │ Artefacto
─────────────────────────────────────────────────────────────────────
 story-design    │   ✗    │ —
 story-tasking   │   —    │ —
 story-analyze   │   —    │ —
─────────────────────────────────────────────────────────────────────

✗ Pipeline interrumpido en: story-design

Los artefactos generados antes del fallo están disponibles en:
  specs/flow/STORY-099-exportar-reporte-pdf/

Corrige el problema indicado arriba y re-ejecuta /story-plan STORY-099.

Nota: al re-ejecutar, cada sub-skill preguntará si deseas sobreescribir los artefactos existentes.
```

---

## Artefactos generados en el directorio de la historia

Tras una ejecución exitosa, el directorio de la historia contendrá:

```
specs/flow/STORY-099-exportar-reporte-pdf/
├── story.md      (existía antes — no modificado)
├── design.md     (generado por story-design)
├── tasks.md      (generado por story-tasking)
└── analyze.md    (generado por story-analyze)
```
