---
name: release-generate-stories
description: "Genera archivos de historia de usuario (story-[ID]-[Nombre-kebab].md) a partir de las features definidas en un archivo de release, usando el template story-gherkin-template.md. El usuario puede indicar el nombre del archivo de release o su ruta relativa."
---
# Skill: /release-generate-stories

Lee un archivo de release de `docs/specs/releases/` y genera automáticamente un archivo `story-[ID]-[Nombre-kebab].md` por cada feature definida en la sección `## Features` del release. Cada archivo generado sigue exactamente la estructura de `.claude/skills/release-generate-stories/templates/story-gherkin-template.md`.

**Usar cuando:**
- Se quiere derivar historias de usuario listas para sprint planning a partir de un archivo de release
- Como paso siguiente a ejecutar `/releases-from-project-plan`
- Para poblar `docs/specs/stories/` de forma automatizada antes de refinar con `/story-refine`

---

## Fase 0 — Resolver el input

El skill acepta dos formatos de input:

### Formato A — Nombre de archivo (con o sin extensión `.md`)

**Señal:** el input no contiene separadores de directorio (`/` o `\`).

**Acción:**
1. Buscar en `docs/specs/releases/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas ni extensión).
2. Si hay exactamente 1 coincidencia → usar ese archivo. Continuar a Fase 1.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que especifique cuál usar antes de continuar.
4. Si no hay ninguna coincidencia → mostrar el mensaje de error y terminar:

```
No se encontró el archivo de release: <término>

Asegúrate de que el archivo existe en docs/specs/releases/ y vuelve a intentarlo.
```

### Formato B — Ruta relativa completa

**Señal:** el input contiene separadores de directorio (`/` o `\`) o empieza con `docs/`.

**Acción:** usar la ruta directamente. Si el archivo no existe, mostrar el mensaje de error y terminar:

```
No se encontró el archivo de release: <ruta>

Asegúrate de que la ruta es correcta y vuelve a intentarlo.
```

**En ambos casos, si el archivo no se encuentra: terminar inmediatamente sin generar ningún archivo de historia.**

---

## Fase 1 — Leer el release y extraer features

Leer el archivo de release resuelto en Fase 0.

Localizar la sección `## Features`. Solo analizar el contenido dentro de esa sección.

Dentro de esa sección, extraer cada línea de feature con el formato:
- `- [ ] FEAT-NNN — Nombre: descripción` (pendiente)
- `- [x] FEAT-NNN — Nombre: descripción` (completada)
- `- [ ] **FEAT-NNN — Nombre:** descripción`
- Variantes con guion largo `—`, doble guión `--` o dos puntos como separador

Para cada feature, capturar:
- **ID**: el identificador de la feature (ej. `FEAT-027`, `FEAT-029`)
- **Nombre**: el texto después del ID hasta el separador (ej. `Validación de formato de Release`)
- **Descripción**: el texto después del separador, si existe
- **Estado**: `[ ]` (pendiente) o `[x]` (completada) — se procesan todas independientemente del estado

**Si la sección `## Features` no existe o no contiene ninguna entrada**, mostrar el siguiente mensaje y terminar sin generar ningún archivo:

```
No se encontraron features en el archivo de release indicado.

Asegúrate de que el archivo contiene una sección "## Features" con al menos una entrada de feature.
```

---

## Fase 2 — Preparar directorio de destino

Verificar si el directorio `docs/specs/stories/` existe.

Si no existe, crearlo antes de continuar.

---

## Fase 3 — Generar archivos de historia

Para cada feature extraída en Fase 1, ejecutar los siguientes pasos:

### 3a. Construir el nombre de archivo

Convertir el nombre de la feature a kebab-case siguiendo estas reglas:
1. Convertir a minúsculas
2. Normalizar caracteres acentuados: á→a, é→e, í→i, ó→o, ú→u, ü→u, ñ→n
3. Reemplazar espacios y cualquier carácter que no sea letra o número por un guion `-`
4. Eliminar guiones consecutivos (`--` → `-`)
5. Eliminar guiones al inicio o al final

Nombre de archivo resultante: `story-[ID]-[nombre-kebab].md`

**Ejemplo:** `FEAT-029 — Generar stories` → `story-FEAT-029-generar-stories.md`

### 3b. Verificar existencia previa

Si ya existe un archivo con ese nombre en `docs/specs/stories/`, informar al usuario:

```
El archivo docs/specs/stories/story-[ID]-[nombre-kebab].md ya existe.
¿Deseas sobreescribirlo? (s/n)
```

Esperar confirmación antes de continuar. Si el usuario responde `n` o `no`, saltar esta feature y continuar con la siguiente.

### 3c. Inferir el contenido de la historia

Usando el nombre y la descripción de la feature, inferir:

- **Rol** (`Como`): el desarrollador, PM o practitioner que ejecuta o se beneficia de esta feature dentro del sistema SDDF. Ser específico — evitar "usuario" genérico.
- **Acción** (`Quiero`): la acción concreta que habilita la feature, orientada al usuario y no a la implementación técnica.
- **Beneficio** (`Para`): el valor real que aporta al flujo de trabajo, medible o concreto.

Generar al menos:
- **1 escenario Gherkin principal** (happy path): con `Dado/Cuando/Entonces` específicos y verificables.
- **1 escenario alternativo/error**: con condición de fallo y comportamiento esperado.

Si la feature tiene descripción detallada, usarla para enriquecer los escenarios. Si la descripción es mínima, inferir escenarios razonables desde el nombre y el contexto del sistema SDDF (framework de especificación de software con skills, agents y templates Markdown).

Las secciones opcionales (`⚙️ Criterios no funcionales`, `📎 Notas`) se incluyen con placeholder `[Por completar]` si no hay datos suficientes.

### 3d. Escribir el archivo de historia

Crear el archivo `docs/specs/stories/story-[ID]-[nombre-kebab].md` con la siguiente estructura:

```markdown
---
alwaysApply: false
---
**Título**: [Nombre de la feature como título de la historia]
**Versión**: 1.0
**Estado**: Doing
**Fecha**: [Fecha actual en formato YYYY-MM-DD]
**FINVEST Score:** —
**FINVEST Decisión:** —
---

# Historia de Usuario

## 📖 Historia: [Nombre de la feature]

**Como** [rol específico inferido]
**Quiero** [acción concreta orientada al usuario]
**Para** [beneficio real y medible]

## ✅ Criterios de aceptación

### Escenario principal – [título descriptivo del happy path]
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

## Fase 4 — Resumen

Al terminar de procesar todas las features, mostrar un resumen en pantalla:

```
## Historias generadas

Se generaron [N] archivos de historia en docs/specs/stories/:

- docs/specs/stories/story-FEAT-NNN-nombre.md
- docs/specs/stories/story-FEAT-NNN-nombre.md
...

**Siguiente paso:** Ejecuta `/story-evaluation` para verificar la calidad de cada historia generada, o `/story-refine` para refinarlas de forma interactiva.
```

Si alguna feature fue saltada (usuario eligió no sobreescribir), listarla como:
```
- docs/specs/stories/story-FEAT-NNN-nombre.md — saltada (ya existía)
```

Si alguna feature no pudo procesarse por formato inesperado, listarla como:
```
- FEAT-NNN — [Nombre] — no procesada (formato no reconocido)
```

---

## Notas de implementación

- El skill **no valida** la calidad FINVEST de las historias generadas — esa responsabilidad es de `/story-evaluation`.
- El skill **no modifica** el archivo de release.
- El skill procesa **todas** las features del release (pendientes y completadas).
- Si dos features tienen el mismo ID (duplicado en el release), añadir sufijo `-bis` al segundo archivo (ej. `story-FEAT-029-nombre-bis.md`) e informar al usuario.
- Las secciones opcionales siempre se incluyen con placeholder `[Por completar]` para facilitar la edición posterior.
- El skill no realiza evaluación INVEST ni splitting — si una historia generada parece demasiado grande, sugerirlo en las notas pero no dividirla automáticamente.
