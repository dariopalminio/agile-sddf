## Context

El skill `release-format-validation` ya implementa resolución de input en su Fase 0, pero ese comportamiento no está respaldado por una especificación formal. Los casos borde —múltiples coincidencias, archivo no encontrado— están documentados solo en el SKILL.md sin un contrato verificable. Este change formaliza esa especificación para que sea testeable de forma independiente y reutilizable si otros skills del pipeline necesitan resolver inputs de release en el futuro.

## Goals / Non-Goals

**Goals:**
- Especificar formalmente el comportamiento de resolución de input (nombre corto → ruta, ruta completa → uso directo)
- Cubrir casos borde: no encontrado, múltiples coincidencias
- Mantener el comportamiento ya implementado sin cambios de ruptura

**Non-Goals:**
- Extraer la resolución como un skill o herramienta independiente (no hay demanda aún)
- Soportar búsqueda en directorios distintos a `docs/specs/releases/`
- Fuzzy matching o corrección de nombres similares

## Decisions

### Decisión 1: Mantener la resolución de input en Fase 0 del SKILL.md (no extraer)

**Elegido:** Continuar la resolución dentro del SKILL.md como Fase 0, previo a la validación.

**Alternativa descartada:** Skill o función auxiliar `resolve-release-input` independiente.

**Rationale:** No hay otro skill en el pipeline que necesite resolver inputs de release ahora mismo. La extracción prematura añadiría indirección sin beneficio. Si en el futuro `generate-stories` o `generate-release` necesitan el mismo mecanismo, se puede extraer con un change dedicado.

### Decisión 2: Búsqueda por substring (case-insensitive) en nombre de archivo

**Elegido:** Comparar el término de búsqueda contra el nombre de archivo (sin extensión) usando coincidencia de substring, ignorando mayúsculas/minúsculas.

**Alternativa descartada:** Match exacto del nombre completo o match por prefijo.

**Rationale:** Los archivos de release siguen el patrón `release-NN-nombre-descriptivo.md`. El usuario tipicamente escribe solo la parte descriptiva o el número. El substring match cubre ambos casos con un solo algoritmo simple.

## Risks / Trade-offs

- **Múltiples coincidencias frecuentes** si hay muchos releases con nombres similares → El prompt al usuario ya lo resuelve; el trade-off es aceptable.
- **Falsos positivos de búsqueda** (ej. buscar "release-06" también matchea "release-060") → Mitigación: mostrar lista completa de coincidencias y dejar al usuario elegir.
