---
alwaysApply: false
type: design
id: FEAT-057
slug: FEAT-057-example-skill-design
title: "Design: Skill para Diseño (story-design)"
story: FEAT-057-example-skill
created: 2026-05-06
updated: 2026-05-06
related:                              
  - <FEAT-057-example-skill>
---

<!-- Referencias -->
[[<FEAT-057-example-skill>]]

# Design: Skill para Diseño (story-design)

<!-- TRAZABILIDAD: este diseño cubre los criterios de aceptación de FEAT-057:
     AC-1: Generación exitosa de design.md a partir de story.md válido
     AC-2: Error descriptivo si el template no existe -->

---

## 📋 Contexto

**Historia de origen:** `FEAT-057` — Skill para Diseño (story-design)

**Problema técnico:**
El workflow SDD de SDDF carece de un artefacto formal entre `story.md` (el qué) y la implementación (el código). El skill `story-design` debe leer un `story.md` válido y generar un `design.md` estructurado que documente las alternativas técnicas evaluadas, la decisión tomada y el plan de construcción, garantizando trazabilidad desde los criterios de aceptación hasta la arquitectura de la solución.

**Restricciones del proyecto:**
- Stack principal: Claude Code + Markdown — toda la lógica vive en instrucciones Markdown, sin código ejecutable en el skill
- Convención kebab-case para nombres de archivos y directorios (constitution.md)
- Template como única fuente de verdad estructural del output (patrón #5 SDDF)
- Un solo nivel de delegación: skill orquesta directamente sin subagentes intermedios

---

## 🔍 Decisiones de Diseño

### Decisión: Estrategia de generación del design.md

<!-- satisface: AC-1 -->

**Opción elegida:** Template dinámico leído en runtime + contexto del proyecto

**Justificación:**
Esta alternativa es coherente con el patrón arquitectónico #5 del framework SDDF y con la filosofía del proyecto: "templates como fuente de verdad estructural". Permite que el skill evolucione junto con las prácticas del equipo sin modificar instrucciones. La dependencia del template se gestiona con validación explícita en el Paso 1.

#### Alternativa A: Skill directo sin template dinámico

**Descripción:** Hardcodear en `SKILL.md` las secciones que debe tener `design.md` y generarlas sin leer un template externo.

**Ventajas:**
- Implementación más simple y directa
- Sin dependencia de archivo externo
- Fácil de leer en una sola pasada del SKILL.md

**Desventajas:**
- Si la estructura del design cambia, hay que editar SKILL.md (viola el patrón #5)
- El skill no se adapta a proyectos que definen su propio template de diseño
- Mezcla estructura y lógica de generación en el mismo artefacto

**Descartada porque:** viola patrón #5 SDDF y crea acoplamiento entre el skill y la estructura del output.

---

#### Alternativa B: Template dinámico leído en runtime (elegida)

**Descripción:** El skill lee `story-design-template.md` en runtime y lo usa como fuente de verdad estructural. El contenido se genera combinando el template con el contexto extraído de `story.md` y `constitution.md`.

**Ventajas:**
- Si el template evoluciona, el skill se adapta automáticamente (patrón #5)
- Cada proyecto puede personalizar el template sin tocar el skill
- Separación clara: el skill orquesta, el template define estructura, el LLM genera contenido

**Desventajas:**
- Requiere que el template exista en la ruta estándar
- Una sesión sin el template falla explícitamente (comportamiento correcto, no un defecto)

**Descartada porque:** N/A — esta es la alternativa elegida.

---

### Decisión: Uso de subagentes para la generación

<!-- satisface: AC-1 -->

**Opción elegida:** Sin subagentes — skill orquesta directamente

**Justificación:**
La generación del `design.md` es una tarea única con inputs bien definidos. No hay análisis paralelos ni múltiples perspectivas especializadas. Un skill orquestador directo mantiene la arquitectura simple (patrón #4) y reduce la complejidad.

#### Alternativa A: Subagente story-design-agent

**Descripción:** Crear un agente especializado que recibe el contexto y genera el design.md, invocado desde el skill.

**Ventajas:**
- Separación de responsabilidades más explícita
- El agente puede tener su propio contexto aislado

**Desventajas:**
- Complejidad innecesaria para una tarea de un solo artefacto
- Viola KISS (P12): agrega una capa de indirección sin beneficio real

**Descartada porque:** añade complejidad sin justificación para este caso de uso.

---

## 🏗️ Plan de Implementación

### Flujo principal

```
/story-design FEAT-057
  → Paso 0: skill-preflight (verificar entorno, resolver SPECS_BASE)
  → Paso 1: resolver parámetros
      ├── directorio historia: glob SPECS_BASE/specs/stories/FEAT-057-*/
      ├── template: SPECS_BASE/specs/templates/story-design-template.md
      └── salida: {directorio}/design.md
  → Paso 2: leer story.md → extraer AC-1, AC-2 + contexto
  → Paso 3: leer constitution.md + package.json (si existe) → stack real
  → Paso 4: leer template → identificar secciones, placeholders, comentarios
  → Paso 5: completar template con contenido del proyecto (con anotaciones AC-N)
  → Paso 6: ejecutar checklist de principios P1-P11
  → Paso 7: detectar CRs si los hay
  → Paso 8: guardar design.md en directorio de la historia
  → Paso 9 (modo manual): mostrar resumen y pedir confirmación
```

### Componentes Afectados

| Componente | Acción | Ubicación | AC que satisface |
|---|---|---|---|
| SKILL.md | crear | `.claude/skills/story-design/SKILL.md` | AC-1, AC-2 |
| story-design-template.md | crear | `docs/specs/templates/story-design-template.md` | AC-1 |
| assets/README.md | crear | `.claude/skills/story-design/assets/README.md` | AC-1 |
| examples/input/story.md | crear | `.claude/skills/story-design/examples/input/story.md` | AC-1 |
| examples/output/design.md | crear | `.claude/skills/story-design/examples/output/design.md` | AC-1 |

### Interfaces

| Interfaz | Contrato | AC que satisface |
|---|---|---|
| Invocación del skill | Input: `{story_id}` o `{story_path}` → Output: `design.md` creado | AC-1 |
| Lectura de template | Input: ruta del template → Output: estructura de secciones extraída en runtime | AC-1 |
| skill-preflight | Input: ninguno → Output: `SPECS_BASE` resuelto + estado del entorno | AC-1, AC-2 |

### Puntos de Variación

- **Template personalizado**: el skill acepta `--template {path}`, permitiendo que cada proyecto use su propio template sin modificar el skill
- **Ruta de salida**: el skill acepta `--output {path}` para casos donde el layout de directorios no es el estándar SDDF

### Comportamiento ante Fallos

| Dependencia | Comportamiento ante fallo | Estrategia |
|---|---|---|
| story-design-template.md no existe | Usa template de fallback interno | Fallback al template embebido en SKILL.md |
| constitution.md no existe | Advierte y continúa sin restricciones técnicas | Warning + generación con contexto parcial |
| story.md no existe | Muestra error descriptivo y sugiere acción | Fail-fast con mensaje accionable |
| skill-preflight falla | Detiene la ejecución completamente | Fail-fast, no genera ningún archivo |

---

## 🔎 Contratos de Verificación

| # | Criterio | Método de verificación | AC origen |
|---|---|---|---|
| 1 | Ejecutar `/story-design FEAT-057` genera `design.md` en `docs/specs/stories/FEAT-057-skill-para-diseno/` | Manual: verificar existencia del archivo | AC-1 |
| 2 | El `design.md` generado tiene frontmatter con `type: design` e `id: FEAT-057` | Manual: leer frontmatter del archivo | AC-1 |
| 3 | El `design.md` contiene al menos dos alternativas técnicas documentadas | Manual: contar secciones de alternativas | AC-1 |
| 4 | Si se elimina `story-design-template.md`, el skill usa el fallback interno sin error bloqueante | Manual: eliminar template y ejecutar el skill | AC-2 |
| 5 | Si `story.md` no existe en el directorio, el error sugiere ejecutar `/release-generate-stories` | Manual: apuntar a directorio sin story.md | AC-2 |

---

## 🧩 Decisiones de Complejidad Justificada

- **Fallback chain de 3 niveles para template**: se añade un tercer nivel (template embebido) además de la ruta explícita y la ruta estándar. La complejidad es mínima y evita que el skill falle completamente si el template externo no existe, que es un escenario de onboarding frecuente.
- **12 principios de diseño como checklist**: podría ser más simple solo generar el archivo. Se añaden los principios porque la calidad del diseño es el propósito central del skill — sin ellos, el output sería textualmente válido pero técnicamente deficiente.

---

## 📎 Registro de Cambios (CR)

Sin CRs detectados.

---

<!-- Resumen del checklist de principios (generado en Paso 9):

✔ Checklist de principios: 12/12 ítems pasados
   ✔ P1  Alternativas consideradas — 2 decisiones con alternativas documentadas
   ✔ P2  Trazabilidad — todos los elementos anotados con AC-1 o AC-2
   ✔ P3  Reutilización — skill-preflight reutilizado como Paso 0
   ✔ P4  Vocabulario de dominio — "historia", "diseño", "template" del dominio SDDF
   ✔ P5  Uniformidad — convenciones kebab-case y SPECS_BASE respetadas
   ✔ P6  Diseño para el cambio — 2 puntos de variación documentados
   ✔ P7  Degradación gradual — todos los fallos documentados con estrategia
   ✔ P8  Sin código de implementación — solo contratos y estructuras
   ✔ P9  Sin dependencias cíclicas, interfaces estrechas
   ✔ P10 Sin omisiones ni ambigüedades conceptuales
   ✔ P11 skill-preflight depende de su contrato, no de su implementación interna
   ✔ P12 Complejidad añadida justificada (fallback chain y principios)
-->
