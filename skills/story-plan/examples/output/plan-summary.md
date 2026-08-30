# Ejemplo de output esperado: /story-plan STORY-099

Este documento muestra el resumen final que `story-plan` produce al completar el pipeline de planning para la historia de ejemplo `STORY-099`.

---

## Output en consola durante la ejecución

```
🚀 Iniciando pipeline de planning para: STORY-099
   Directorio: docs/specs/03-stories/STORY-099-exportar-reporte-pdf/
   Pasos: story-design → story-tasking → story-analyze

[Paso 0] ✓ Entorno verificado — SPECS_BASE = docs

[1/3] → story-design...
[1/3] ✓ story-design — design.md generado

[2/3] → story-tasking...
[2/3] ✓ story-tasking — tasks.md generado

[3/3] → story-analyze...
[3/3] ✓ story-analyze — analyze.md generado, sin inconsistencias
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
```

---

## Resumen final — caso con inconsistencias en analyze

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

Se detectaron inconsistencias entre los artefactos. Revisa antes de implementar:
→ docs/specs/03-stories/STORY-099-exportar-reporte-pdf/analyze.md

Puedes ajustar design.md o tasks.md y re-ejecutar /story-analyze cuando estés listo.
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
  docs/specs/03-stories/STORY-099-exportar-reporte-pdf/

Corrige el problema indicado arriba y re-ejecuta /story-plan STORY-099.

Nota: al re-ejecutar, cada sub-skill preguntará si deseas sobreescribir los artefactos existentes.
```

---

## Artefactos generados en el directorio de la historia

Tras una ejecución exitosa, el directorio de la historia contendrá:

```
docs/specs/03-stories/STORY-099-exportar-reporte-pdf/
├── story.md      (existía antes — no modificado)
├── design.md     (generado por story-design)
├── tasks.md      (generado por story-tasking)
└── analyze.md    (generado por story-analyze)
```
