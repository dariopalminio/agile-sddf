---
name: release-generate-all-stories
description: "Genera archivos de historia de usuario (story-[ID]-[Nombre-kebab].md) para todos los releases existentes en docs/specs/releases/, aplicando el mismo flujo de extracción y generación del skill release-generate-stories. Procesa todos los archivos de release en orden alfabético en una sola invocación."
---
# Skill: /release-generate-all-stories

Escanea todos los archivos de release en `docs/specs/releases/` y genera automáticamente un archivo `story-[ID]-[Nombre-kebab].md` por cada feature encontrada en cada release, siguiendo exactamente la estructura de `.claude/skills/release-generate-all-stories/templates/story-gherkin-template.md`. Es el equivalente batch de `/release-generate-stories`.

**Usar cuando:**
- Se quiere poblar `docs/specs/stories/` de forma completa a partir de todos los releases del proyecto
- Al iniciar un sprint planning y se necesitan todas las historias de todos los releases en un solo paso
- Como alternativa a invocar `/release-generate-stories` individualmente por cada archivo de release

---

## Fase 0 — Descubrir archivos de release

Listar todos los archivos con extensión `.md` en `docs/specs/releases/`, ordenados alfabéticamente por nombre de archivo.

**Si el directorio `docs/specs/releases/` no existe o no contiene ningún archivo `.md`**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontraron archivos de release en docs/specs/releases/

Asegúrate de haber ejecutado el skill /releases-from-project-plan antes de usar este skill,
o verifica que el directorio contiene archivos de release con extensión .md.
```

Mostrar al usuario la lista de releases descubiertos antes de continuar:
```
Se encontraron [N] archivos de release en docs/specs/releases/:
- release-00-nombre.md
- release-01-nombre.md
...
Procesando en orden alfabético.
```

---

## Fase 1 — Detección anticipada de conflictos

Antes de procesar ningún release, verificar qué historias ya existen en `docs/specs/stories/` que serían generadas en este batch.

Para ello, leer la sección `## Features` de cada release descubierto en Fase 0 y calcular los nombres de archivo que se generarían (`story-[ID]-[nombre-kebab].md`). Verificar cuáles de esos nombres ya existen en `docs/specs/stories/`.

**Si no hay ningún conflicto**, continuar directamente a Fase 2 sin mostrar pantalla de confirmación.

**Si hay al menos un conflicto**, mostrar la lista de archivos en conflicto y presentar la siguiente pregunta antes de comenzar el procesamiento:

```
Se detectaron [N] archivos de historia que ya existen y serían sobreescritos:
- docs/specs/stories/story-FEAT-NNN-nombre.md (release-XX)
- docs/specs/stories/story-FEAT-NNN-nombre.md (release-YY)
...

¿Cómo deseas manejar los conflictos?
  (a) Sobreescribir todos los existentes
  (b) Saltar todos los existentes (generar solo los nuevos)
  (c) Decidir uno por uno durante el procesamiento
```

Esperar la respuesta del usuario antes de continuar a Fase 2. Registrar la decisión para aplicarla durante Fase 3.

---

## Fase 2 — Preparar directorio de destino

Verificar si el directorio `docs/specs/stories/` existe.

Si no existe, crearlo antes de continuar.

---

## Fase 3 — Procesar releases en batch

Iterar sobre cada archivo de release en el orden alfabético establecido en Fase 0. Para cada release, ejecutar los siguientes pasos:

### 3a. Extraer features del release

Leer la sección `## Features` del archivo de release. Extraer cada línea de feature con el formato:
- `- [ ] FEAT-NNN — Nombre: descripción` (pendiente)
- `- [x] FEAT-NNN — Nombre: descripción` (completada)
- Variantes con `**` (bold), guion largo `—`, doble guión `--` o dos puntos como separador

Capturar para cada feature: **ID** (ej. `FEAT-027`), **Nombre** (texto después del ID hasta el separador), **Descripción** (texto después del separador, si existe).

**Si la sección `## Features` no existe o está vacía:**
- Registrar: `[nombre-release] — saltado (sin features)`
- Continuar con el siguiente release **sin interrumpir el batch**

### 3b. Generar archivo de historia por feature

Para cada feature extraída del release:

**1. Construir el nombre de archivo:**

Convertir el nombre de la feature a kebab-case:
1. Convertir a minúsculas
2. Normalizar acentos: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y caracteres no alfanuméricos por guion `-`
4. Eliminar guiones consecutivos y al inicio/final

Nombre resultante: `story-[ID]-[nombre-kebab].md`

**2. Gestionar idempotencia según la decisión de Fase 1:**
- **(a) Sobreescribir todos:** sobreescribir sin preguntar
- **(b) Saltar todos los existentes:** si el archivo ya existe, registrar como saltado y continuar con la siguiente feature
- **(c) Decidir uno por uno:** si el archivo ya existe, preguntar al usuario antes de continuar

**3. Inferir el contenido de la historia:**

Usando el nombre y la descripción de la feature, inferir:
- **Como**: rol específico que se beneficia dentro del sistema SDDF (desarrollador, PM, practitioner — ser específico, no "usuario")
- **Quiero**: acción concreta orientada al usuario, no a la implementación técnica
- **Para**: beneficio real y medible, no restatement de la acción

Generar al menos un escenario Gherkin principal (happy path) y uno alternativo/error, con pasos `Dado/Cuando/Entonces` específicos y verificables.

**4. Escribir el archivo:**

Crear `docs/specs/stories/story-[ID]-[nombre-kebab].md` con la siguiente estructura:

```markdown
---
alwaysApply: false
---
**Título**: [Nombre de la feature]
**Versión**: 1.0
**Estado**: Doing
**Fecha**: [Fecha actual YYYY-MM-DD]
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: [Nombre de la feature]

**Como** [rol específico inferido]
**Quiero** [acción concreta orientada al usuario]
**Para** [beneficio real y medible]

## ✅ Criterios de aceptación

### Escenario principal – [título descriptivo]
```gherkin
Dado [contexto inicial específico]
  Y [condición adicional si aplica]
Cuando [acción del usuario]
Entonces [resultado esperado concreto]
  Y [resultado adicional si aplica]
```

### Escenario alternativo / error – [título]
```gherkin
Dado [contexto de fallo]
Cuando [acción inválida o condición de error]
Entonces [mensaje de error o comportamiento alternativo]
  Pero [excepción si aplica]
```

## ⚙️ Criterios no funcionales

[Por completar]

## 📎 Notas / contexto adicional

Generado automáticamente desde el release: [nombre del archivo de release]
Feature origen: [ID] — [Nombre de la feature]
```

---

## Fase 4 — Resumen consolidado

Al finalizar el procesamiento de todos los releases, mostrar el resumen:

```
## Historias generadas — Resumen batch

**Releases procesados:** [N total]
**Historias generadas:** [N creadas]
**Historias saltadas:** [N saltadas por conflicto]
**Releases sin features:** [N releases que no tenían features]

### Archivos creados
- docs/specs/stories/story-FEAT-NNN-nombre.md  (release-XX)
- docs/specs/stories/story-FEAT-NNN-nombre.md  (release-YY)
...

### Archivos saltados (ya existían)
- docs/specs/stories/story-FEAT-NNN-nombre.md  (release-XX)
...

### Releases sin features (no procesados)
- docs/specs/releases/release-NN-nombre.md

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de las historias generadas, o `/story-refine` para refinarlas de forma interactiva.
```

---

## Notas de implementación

- El skill **no valida** la calidad FINVEST de las historias — esa responsabilidad es de `/story-evaluation`.
- El skill **no modifica** los archivos de release.
- El skill procesa **todas** las features de cada release (pendientes `[ ]` y completadas `[x]`).
- Si dos features en distintos releases generan el mismo nombre de archivo (mismo ID y mismo slug), el segundo archivo se nombra con sufijo `-bis` (ej. `story-FEAT-027-nombre-bis.md`) e informa al usuario en el resumen.
- Las secciones opcionales de cada historia siempre se incluyen con placeholder `[Por completar]` para facilitar la edición posterior.
- El orden de procesamiento es siempre alfabético por nombre de archivo de release, lo que equivale al orden numérico dado el patrón `release-NN-nombre.md`.
