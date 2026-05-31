## Context

El `skill-master` es el skill central para crear y mejorar skills en el framework SDDF. Su sección "Write the SKILL.md" actualmente lista componentes fijos (`name`, `description`, `compatibility`) hardcodeados en el prose de SKILL.md, ignorando el template canónico en `assets/skill-template.md`.

El principio "Template como fuente de verdad dinámica" (constitution.md §5) establece que los skills NO deben hardcodear la estructura del output — deben leerla del template en runtime y extraer secciones dinámicamente. El propio SKILL.md del skill-master documenta este principio en la sección "Templates & Multi-Client Design", pero no lo aplica a sí mismo.

El `assets/skill-template.md` actual también está incompleto: le falta el frontmatter YAML estándar SDDF y sus secciones de cuerpo son genéricas en lugar de seguir las convenciones del framework (flujo de ejecución por pasos, restricciones, modos de ejecución).

## Goals / Non-Goals

**Goals:**
- El skill-master lee `assets/skill-template.md` en runtime al crear un SKILL.md nuevo.
- Las secciones del nuevo SKILL.md se derivan del template, no del prose hardcodeado en SKILL.md.
- El template `assets/skill-template.md` es un contrato estructural completo: frontmatter YAML + cuerpo SDDF-alineado.
- El comportamiento se adapta automáticamente si el template evoluciona.

**Non-Goals:**
- No cambia el eval loop, la optimización de descripciones ni la mejora iterativa de skills existentes.
- No introduce scripts ejecutables ni nuevas dependencias.
- No altera el proceso de modificación de skills ya existentes.
- No crea un mecanismo de validación automática del SKILL.md generado.

## Decisions

### D1 — Instrucción de lectura dinámica integrada en "Write the SKILL.md"

Insertar la instrucción de lectura del template dentro de la sección "Write the SKILL.md" existente, antes de cualquier detalle de componentes. El modelo debe leer el template primero, extraer sus secciones y completarlas con la información del skill.

**Alternativa considerada**: sección dedicada "Template Loading". Descartada porque fragmenta el flujo y la sección "Write the SKILL.md" ya es el lugar natural donde ocurre la autoría.

**Rationale**: co-ubicación con el flujo de autoría → menor riesgo de que el modelo omita el paso.

### D2 — Fallback chain estándar para localizar assets/skill-template.md

Usar el mismo fallback chain ya documentado en la sección "Templates & Multi-Client Design" del SKILL.md:
1. `assets/skill-template.md` (relativo al directorio activo del skill)
2. Buscar `skill-template.md` en el directorio `assets/` del skill-master usando el contexto de runtime.
3. Si no se encuentra: generar SKILL.md con estructura mínima válida a partir de las instrucciones en prosa del SKILL.md.

**Rationale**: consistencia con el patrón establecido en el proyecto; garantiza portabilidad multi-cliente sin rutas absolutas.

### D3 — Actualizar skill-template.md con frontmatter YAML + estructura SDDF completa

El template pasa de tener solo secciones de cuerpo genéricas a incluir:
- Bloque frontmatter YAML con `name`, `description`, `triggers` como placeholders.
- Secciones de cuerpo alineadas con el patrón SDDF: Objetivo, Entrada, Parámetros, Dependencias, Modos de ejecución, Restricciones/Reglas, Flujo de ejecución (pasos numerados), Salida.

**Alternativa considerada**: mantener el template mínimo y dejar que el modelo infiera la estructura. Descartada porque sin frontmatter el modelo podría omitir el bloque YAML, que es obligatorio según skill-template-autonomy spec.

**Rationale**: el template como "contrato listo para completar" reduce la ambigüedad y garantiza que todos los SKILL.md nuevos sean estructuralmente homogéneos.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|-----------|
| El modelo no lee el template si el path no resuelve en el runtime del usuario | El fallback chain garantiza que, en el peor caso, el modelo genera un SKILL.md válido desde las instrucciones en prosa |
| Template muy verboso aumenta el contexto consumido en cada creación de skill | El template debe mantenerse compacto (< 60 líneas), con placeholders concisos |
| Las secciones del template pueden no mapear 1:1 con skills de dominio muy específico | La instrucción deja claro que el modelo adapta o omite secciones irrelevantes para el skill en cuestión |

## Open Questions

- ¿Debe el skill-master validar que el SKILL.md generado contiene todas las secciones del template? Por ahora queda fuera de scope (Non-Goal).
- ¿El template debe incluir ejemplos de frontmatter completados, o solo placeholders? Se decide por placeholders para mantener el template conciso.
