---
type: adr
id: ADR-0011
slug: archivos-canonicos-por-tipo
title: "Los archivos canónicos de work items se nombran por tipo (story.md, epic.md, project.md)"
status: PROPOSED
date: 2026-09-22
supersedes: null
superseded-by: null
---

# ADR-0011: Los archivos canónicos de work items se nombran por tipo (story.md, epic.md, project.md)

## Contexto y problema

Los frameworks SDD de referencia, como Spec Kit y OpenSpec, nombran el archivo principal de cada work item `spec.md`, confiando en el directorio contenedor (`STORY-NNN/`, `EPIC-NNN/`, etc.) para indicar el tipo del work item.

SDDF adoptó la convención contraria desde su diseño inicial: nombrar el archivo según el tipo del work item (`story.md`, `epic.md`, `project.md`), coincidiendo con el nombre del directorio contenedor.

La pregunta que motiva este ADR es: **¿debería SDDF alinearse con la convención de facto (`spec.md`) o mantener su convención propia (`story.md` / `epic.md`)?**

Esta decisión se relaciona con:

- La estructura del sistema de memoria descrita en [[memory-system]].
- La decisión previa sobre la ubicación de `specs/` en [[perfiles-runtimes-e-instalacion-explicita]].
- El modelo de tres niveles (Project → Epic → Story) definido en [[domain-work-item-hierarchy]].
- La identidad de SDDF como **alternativa profesional a Speckit y OpenSpec**, no como clon.

Los usuarios que vienen de Speckit u OpenSpec esperarán encontrar `spec.md`. Los agentes IA que operan sobre la memoria necesitan identificar el tipo del work item sin inferirlo desde la ruta. Ambos intereses deben equilibrarse.

## Decisión

Los archivos canónicos de los work items SDDF se nombran **según su tipo**:

| Nivel | Archivo canónico | Directorio contenedor |
|-------|------------------|-----------------------|
| L3 | `project.md` | `PROJ-NNN-slug/` |
| L2 | `epic.md` | `EPIC-NNN-slug/` |
| L1 | `story.md` | `STORY-NNN-slug/` |

No se adopta `spec.md` como nombre canónico. La compatibilidad con herramientas que esperan `spec.md` se resuelve mediante **symlinks generados por el skill `memory-system`** (modo `--create-spec-aliases`), no renombrando los archivos.

## Rationale

La decisión se sostiene en seis argumentos:

1. **Auto-descriptivo para agentes IA.** Un agente que recibe `docs/specs/03-stories/STORY-042/story.md` sabe inmediatamente qué tipo de artefacto maneja. Con `spec.md`, debe inferir el tipo desde la ruta, lo que añade complejidad y riesgo de error en la resolución.

2. **Coherencia estructural.** El nombre del archivo coincide con el nombre de la carpeta y con el tipo del work item. Esto refuerza el modelo de tres niveles (Project → Epic → Story) y reduce la carga cognitiva de humanos y agentes.

3. **Diferenciación visual inmediata.** En un listado, en un índice (`docs/index.md`), o en un `git diff`, `story.md` y `epic.md` son inequívocos. N archivos llamados `spec.md` obligan a leer la ruta para distinguirlos, lo que ralentiza la navegación y la revisión.

4. **Identidad propia del framework.** SDDF se posiciona como **alternativa profesional a Speckit y OpenSpec**, no como clon. Las convenciones propias justificadas son parte de esa identidad. Adoptar `spec.md` por mimetismo debilitaría la propuesta de valor.

5. **La compatibilidad no requiere renombrar.** Un symlink `spec.md → story.md` (o `→ epic.md`) satisface a cualquier herramienta que espere `spec.md`, sin renunciar al nombre canónico. El symlink se genera de forma idempotente por `memory-system`, y se puede añadir a `.gitignore` si el equipo prefiere no versionarlo.

6. **El coste del cambio sería alto y sin beneficio funcional.** Renombrar implicaría actualizar:

   - Los skills del core (`story-*`, `epic-*`, `project-*`, `memory-system`, `header-aggregation`).
   - Los wikilinks existentes (`[[story-042]]` → resolvería a `spec.md`).
   - Las referencias en `sddf.config.yaml` y en la documentación.
   - Los enlaces externos (README, homepage, CHANGELOG).
   - Los consumidores que ya usan SDDF con la convención actual.

   Nada de esto aporta valor funcional que el symlink no resuelva ya.

Además, la decisión respeta los principios de la constitución:

- **KISS**: la convención más simple de explicar y de aplicar es la que coincide con el tipo.
- **Repositorio-como-sistema**: el nombre del archivo forma parte del contrato con el agente.
- **Agnóstico al harness**: SDDF no necesita adoptar la convención de Speckit/OpenSpec para ser interoperable con ellos.

## Alternativas consideradas

- **Adoptar `spec.md` (convención Spec Kit / OpenSpec):** descartada porque pierde auto-descripción, coherencia con el directorio y diferenciación visual, y obliga a inferir el tipo desde la ruta. Además, debilita la identidad propia del framework y obliga a un renombrado masivo sin beneficio funcional.

- **`spec-story.md` / `spec-epic.md` (híbrido):** descartada porque combina el prefijo genérico de `spec` con el sufijo específico del tipo, sin ser estándar ni auto-descriptivo. Es un híbrido redundante: ni se alinea con Speckit ni aprovecha las ventajas de `story.md`. Ninguna herramienta conocida lo espera.

- **Unificar todos los tipos bajo `spec.md` y dejar que el directorio determine el contexto:** descartada por los mismos motivos que la primera alternativa. El directorio ya determina el tipo, pero el archivo debería reforzarlo, no ocultarlo.

- **Symlinks `spec.md` como mecanismo de compatibilidad:** no es una alternativa a la decisión, sino su **mecanismo operativo**. Se adopta junto con la decisión, y se implementa en `memory-system`.

- **Mantener `story.md` / `epic.md` (decisión adoptada):** elegida por coherencia, claridad e identidad propia, con symlinks como puente de interoperabilidad.

## Consecuencias

**Positivas:**

- Los agentes IA identifican el tipo de artefacto sin abrir el archivo ni inferir desde la ruta, reduciendo la carga cognitiva y el riesgo de error.
- La estructura del repositorio es más legible en listados, índices y diffs.
- SDDF mantiene identidad propia frente a otros frameworks SDD.
- El modelo de tres niveles (Project → Epic → Story) se refleja de forma explícita en los nombres de archivo.
- La compatibilidad con herramientas externas que esperan `spec.md` queda garantizada por symlinks generados automáticamente, sin renombrar los archivos canónicos.
- El coste de cambio a `spec.md` se evita; el coste de mantener `story.md` es cero (ya está implementado).

**Negativas / trade-offs:**

- Los usuarios familiarizados con Speckit u OpenSpec esperarán `spec.md` y deberán adaptarse. Se mitiga con documentación de onboarding y con el symlink automático.
- Algunas herramientas externas que asumen `spec.md` requerirán el symlink o configuración adicional. Se mitiga con `memory-system --create-spec-aliases`.
- Si en el futuro SDDF adopta Speckit u OpenSpec como motor interno, habrá que generar los symlinks de forma sistemática y asegurar su mantenimiento. Se mitiga documentando la decisión y el mecanismo.
- Los symlinks pueden dar problemas en Windows si no se gestionan con privilegios adecuados. Se mitiga generando copias físicas en su lugar cuando el sistema no soporte symlinks (opción `--create-spec-aliases-mode=copy`).

## Referencias

- [[perfiles-runtimes-e-instalacion-explicita]] — `specs/` dentro de `docs/` (decisión hermana sobre layout)
- [[memory-system]] — Sistema de memoria y árbol canónico
- [[domain-work-item-hierarchy]] — Estructura Project → Epic → Story
- [[domain-knowledge-artifacts]] — Modelo de artefactos y tipos
- [[constitution]] — Principios aplicables (KISS, repositorio-como-sistema, agnóstico al harness)
