---
alwaysApply: false
type: story
id: STORY-201
kind: feat
slug: STORY-201-template-historia-narrativa-contexto-reglas
title: "Template de historia con narrativa, contexto y reglas de negocio"
status: PLAN
substatus: DONE
parent:
created: 2026-11-27
updated: 2026-11-27
related:
---

# 📖 Historia: Template de historia con narrativa, contexto y reglas de negocio

**Como** Solo Builder que especifica historias con agile-sddf  
**Quiero** que el template de historia tenga una sección de narrativa, una de contexto y valor y una de reglas de negocio trazadas a los AC  
**Para** que cada historia generada explique por qué importa y declare sus reglas transversales una sola vez, sin repetirlas en cada escenario

## ✅ Criterios de aceptación
<!-- Los escenarios Gherkin SON los criterios de aceptación funcionales.
     No se duplican en una sección separada. Si hay reglas transversales,
     exprésalas con "Regla:" o como comentario. -->

<!-- Regla: el frontmatter y los comentarios "escritor:" del template vigente se conservan sin cambios en el template nuevo. -->
<!-- Regla: docs/templates/story-template.md y skills/story-creation/assets/story-template.md quedan con contenido idéntico. -->

### AC-1 - Escenario principal – El template expone la estructura nueva
```gherkin
Dado el template "docs/templates/story-template.md" actualizado
Cuando el Solo Builder lo abre
Entonces ve, en este orden, los encabezados "## Narrativa", "## Contexto y valor *(si aplica)*", "## ✅ Criterios de aceptación (escenarios Gherkin)", "## Reglas (reglas de negocio) *(si aplica)*", "## ⚙️ Criterios no funcionales específicos *(si aplica)*", "## 🚫 Fuera de alcance (Non-Goals) *(si aplica)*" y "## 🔗 Notas adicionales (Dependencias, supuestos y notas) *(si aplica)*", cada uno con un solo espacio entre palabras
  Y cada encabezado de AC sigue el formato "### AC-<n> - …" con guion y ninguno usa raya "—"
  Y cada línea de ejemplo de "## Reglas" termina en "→ cubierta por [AC-1, AC-n]"
  Y el seed "skills/story-creation/assets/story-template.md" tiene el mismo contenido
```

### AC-2 - Escenario alternativo – Una historia nueva sin contexto ni reglas
```gherkin
Dado el template actualizado
  Y una necesidad descrita sin contexto de negocio ni reglas transversales
Cuando el Solo Builder ejecuta "/story-creation" con esa necesidad
Entonces el story.md generado contiene "## Narrativa" con las líneas "Como", "Quiero" y "Para"
  Y contiene "## ✅ Criterios de aceptación (escenarios Gherkin)" con al menos un AC principal y uno alternativo
  Pero no contiene las secciones "## Contexto y valor" ni "## Reglas"
```

### AC-3 - Escenario de compatibilidad – Historias existentes con encabezados anteriores
```gherkin
Dado una historia existente con los encabezados "## ✅ Criterios de aceptación" y "## 📎 Notas / contexto adicional"
Cuando se ejecuta "npm run verify:repository"
Entonces el gate termina con código 0
  Y cada skill que localiza esas secciones (story-acceptance, story-verify, story-evaluation, story-refine y epic-refine) nombra en su SKILL.md o references/ ambos títulos, o los busca por el comienzo común ("## ✅ Criterios de aceptación", "## 📎 Notas" / "## 🔗 Notas")
  Y el AC de cierre que genera epic-refine usa el formato "### AC-<k+1> - …" con guion
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Encoding:** ambos archivos del template se guardan en UTF-8 sin BOM; una búsqueda de `U+FEFF` en ellos devuelve 0 coincidencias.

## Fuera de alcance (Non-Goals)
- Migrar los `story.md` existentes (activos o archivados) a los encabezados nuevos.
- Cambiar la rúbrica FINVEST de `/story-evaluation` para puntuar las secciones `Contexto y valor` o `Reglas`.
- Actualizar las copias del template en `skills/memory-system/examples/` salvo que el gate lo exija.

## 📎 Notas / contexto adicional
- **Origen:** propuesta del Solo Builder del 2026-11-27 con la estructura completa del template nuevo (Narrativa, Contexto y valor, AC, Reglas con keywords RFC 2119, CNF, Fuera de alcance, Notas adicionales con Dependencia/Supuesto/Notas UX-UI/Datos de prueba).
- **Riesgo de compatibilidad:** dos encabezados cambian de texto. `## ✅ Criterios de aceptación (escenarios Gherkin)` conserva el prefijo anterior, pero `## 🔗 Notas adicionales` no coincide con el prefijo `## 📎 Notas` que usa `skills/epic-refine/references/sal-corrections.md`. Hoy localizan secciones por encabezado: `story-acceptance`, `story-verify`, `story-evaluation` (componente 2), `story-refine` (dimensiones I y E), `epic-refine` (SAL-01/SAL-02) y el ejemplo inline de `epic-generate-stories`.
- **Decisión:** los encabezados de AC se unifican con guion (`### AC-<n> - …`) porque no es un carácter raro. Hoy el template vigente y el AC de cierre de `epic-refine` (`skills/epic-refine/references/sal-corrections.md:83`) usan raya (`### AC-<n> — …`); ambos se alinean (AC-1, AC-3). Los consumidores buscan el prefijo `### AC-<n>`, así que las historias existentes con raya siguen siendo válidas.
- **Supuesto:** la sección `## Reglas` usa las palabras clave RFC 2119 (MUST/SHALL) tal como propone el comentario guía del template nuevo.
- Mantener frontmatter como està actualmente definido, consistente con los metadatos requeridos por el repositorio.
- **Ejemplo de template**: ver archivo story-new-template.md
