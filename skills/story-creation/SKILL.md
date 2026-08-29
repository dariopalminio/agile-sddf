---
name: story-creation
description: "Crea historias de usuario siguiendo el template story-gherkin (Como/Quiero/Para + Gherkin). Aplica los principios 3 C's, INVEST y el formato Mike Cohn. Output diseñado para superar la evaluación FINVEST."
triggers:
  - "story-creation"
  - "crear historia"
  - "redactar historia de usuario"
  - "nueva historia"
  - "convertir requisito en historia"
  - "historia de usuario"
  - "como quiero para"
---

# Skill: `/story-creation`

## Objetivo

Crea una historia de usuario completa a partir de una necesidad o feature descrito en lenguaje natural. El output sigue **estrictamente** el template `assets/story-template.md` definido en el proyecto.

**Qué hace este skill:**
- Convierte texto libre, archivos existentes o términos de búsqueda en una historia de usuario bien formada
- Aplica los criterios de calidad de Mike Cohn (Como/Quiero/Para) y el marco 3 C's
- Genera escenarios Gherkin (Dado/Cuando/Entonces) con al menos 1 happy path y 1 escenario alternativo
- Verifica el cumplimiento de INVEST antes de guardar
- Asigna automáticamente el siguiente ID `FEAT-NNN` disponible y guarda en la ruta canónica

**Qué NO hace este skill:**
- Evaluar la calidad de la historia (eso corresponde a `/story-evaluation`)
- Dividir historias grandes en historias más pequeñas (eso corresponde a `/story-split`)
- Generar design, tasks ni artefactos de planning

---

## Entrada

El skill acepta tres tipos de input:

- **Tipo A — Texto libre**: descripción de una necesidad o feature en lenguaje natural
- **Tipo B — Ruta de archivo**: ruta relativa o absoluta a un archivo `.md` existente con contenido de historia incompleto
- **Tipo C — Término de búsqueda**: palabra o frase corta para localizar una historia existente en `$SPECS_BASE/specs/03-stories/`

Fuente estructural del output: `assets/story-template.md` (leído en tiempo de ejecución)

---

## Parámetros

- `{texto}` — descripción de la historia en lenguaje natural, ruta de archivo, o término de búsqueda (obligatorio)

---

## Precondiciones

- El archivo `assets/story-template.md` existe
- `skill-preflight` retorna estado OK (entorno válido)

---

## Dependencias

- Skills: [`skill-preflight`]
- Archivos: [`assets/story-template.md`]

---

## Modos de ejecución

- **Manual**: `/story-creation {texto de descripción}` — interactivo, muestra progreso en tiempo real
- **Automático**: invocado por orquestador de nivel superior — reporta resultado sin interacción

---

## Restricciones / Reglas

- La estructura del output la dicta el template en tiempo de ejecución — nunca se hardcodea la estructura de secciones en el skill
- El template es de solo lectura — nunca se escribe, modifica ni usa como ruta de salida
- Toda historia debe tener mínimo 1 escenario principal (happy path) y 1 escenario alternativo o de error en formato Gherkin
- Si alguna dimensión INVEST falla, se ajusta la historia antes de guardar; si `S` (Small) es demasiado grande, se sugiere `/story-split`
- El rol en `Como` debe ser específico y contextualizado — nunca "usuario" genérico ni "el sistema"
- El `Quiero` describe la acción del usuario, no la solución técnica
- El `Para` expresa beneficio real y medible, no restatement del `Quiero`
- Los pasos Gherkin (`Entonces`) deben ser verificables objetivamente — sin resultados subjetivos
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; este skill solo produce archivos de especificaciones `.md`.
- NO incluya detalles de implementación (consultas específicas, estructuras JSON, firmas de métodos, anotaciones, inventarios de la capa de componentes, lógica paso a paso); estos detalles pertenecen a la etapa de planeación del diseño.
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 0 — Verificar entorno (`skill-preflight`)

Invocar `skill-preflight`. Si retorna `✗ Entorno inválido`, detener la ejecución. Usar `$SPECS_BASE` en todas las rutas siguientes.

### Paso 1 — Leer template canónico

Leer el archivo `$SPECS_BASE/specs/templates/story-template.md` (fuente de verdad del proyecto, puede contener personalizaciones). Si no existe, usar el seed `assets/story-template.md` y emitir:
> ⚠️ Usando template seed del skill. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.

El template es la **única fuente de información estructural** para generar el output. Define qué secciones existen, en qué orden y con qué propósito. Nunca hardcodear los nombres o la estructura de las secciones — siempre derivarlos del template en tiempo de ejecución. Si el template cambia, el output generado se actualizará automáticamente.

Identificar antes de continuar:
- Todas las secciones y su jerarquía (encabezados `#`, `##`, `###`)
- Todos los placeholders en formato `{nombre_placeholder}`
- Comentarios `<!-- instrucción: ... -->` que indican cómo completar cada sección

Si el archivo **no existe**, detener y notificar (ver sección Manejo de errores).

---

### Paso 2 — Resolver el input

Detectar el tipo de input proporcionado:

#### Tipo A — Texto libre
**Señal:** El input es una descripción en prosa o una historia incompleta.
**Acción:** Continuar directamente al Paso 3.

#### Tipo B — Ruta de archivo
**Señal:** El input parece una ruta (contiene `/` o `\`, o termina en `.md`).
**Acción:** Leer el archivo en esa ruta y usar su contenido como base para crear o mejorar la historia. Continuar al Paso 3 con ese contenido.

#### Tipo C — Término de búsqueda
**Señal:** El input es una palabra o frase corta que no parece texto de historia ni ruta explícita.
**Acción:**
1. Buscar en `$SPECS_BASE/specs/03-stories/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas)
2. Si hay exactamente 1 coincidencia → leerlo y usarlo como base. Continuar al Paso 3.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → tratar el input como Tipo A (texto libre).

---

### Paso 3 — Recopilar contexto

Si el usuario no proporcionó suficiente información, preguntar:
- **¿Quién?** Persona o rol específico que se beneficia (no "usuario" genérico)
- **¿Qué?** Acción concreta que el usuario quiere realizar
- **¿Para qué?** Beneficio real, no restatement de la acción
- **¿Contexto?** Sistema, producto, restricciones relevantes

Si el input es suficiente, inferir los valores razonablemente sin preguntar.

---

### Paso 4 — Redactar `Como/Quiero/Para`

Aplicar los criterios de calidad de Mike Cohn y el marco 3 C's:

**Como** — Rol específico y contextualizado:
- ✅ "cliente registrado que olvidó su contraseña"
- ✅ "vendedor con pipeline activo"
- ❌ "usuario" (demasiado genérico)
- ❌ "el sistema" (no es un usuario)

**Quiero** — Acción orientada al usuario, no a la implementación:
- ✅ "recibir un enlace de recuperación a mi email"
- ✅ "filtrar mi lista de pedidos por estado"
- ❌ "que se implemente OAuth 2.0" (solución técnica)
- ❌ "login" (demasiado vago)

**Para** — Beneficio real y medible, no restatement:
- ✅ "acceder a mi cuenta sin contactar a soporte"
- ✅ "priorizar el seguimiento de mis leads más calientes"
- ❌ "poder entrar" (restatement de Quiero)
- ❌ "tener una mejor experiencia" (no medible)

---

### Paso 5 — Definir escenarios Gherkin

Reglas obligatorias:
1. **Mínimo 1 escenario principal** (happy path) en bloque ` ```gherkin `
2. **Mínimo 1 escenario alternativo o de error** en bloque ` ```gherkin `
3. Cada paso debe ser **específico y verificable** — incluir valores concretos cuando sea posible
4. Usar `Y` para precondiciones adicionales en `Dado`
5. Usar `Y` en `Entonces` para resultados múltiples del mismo escenario
6. Usar `Pero` para excepciones dentro de un escenario alternativo
7. Agregar **Scenario Outline** si hay variaciones por tipo de usuario, rol o datos de entrada

**Calidad de pasos Gherkin:**
- `Dado que el usuario "ana@ejemplo.com" tiene cuenta activa` ✅ (específico)
- `Dado que tengo usuario` ❌ (vago)
- `Entonces ve el mensaje "Contraseña actualizada correctamente"` ✅ (verificable)
- `Entonces funciona bien` ❌ (no testeable)

---

### Paso 6 — Verificar INVEST

Antes de guardar, hacer una revisión interna:

| Dimensión | Pregunta clave | Señal de alerta |
|---|---|---|
| **I** Independiente | ¿Se puede desarrollar sin esperar otra historia? | Menciona "depende de X primero" |
| **N** Negociable | ¿Documenta el qué/para qué sin prescribir el cómo técnico? | Incluye detalles de implementación |
| **V** Valiosa | ¿El `Para` expresa valor real para el usuario o el negocio? | `Para` es vago o solo técnico |
| **E** Estimable | ¿Un equipo puede estimar el esfuerzo con estos criterios? | Alcance indefinido o dependencias ocultas |
| **S** Small | ¿Hay ≤3 escenarios Gherkin y ≤7 pasos totales? | Muchos `Y` anidados o múltiples flujos principales |
| **T** Testeable | ¿Los `Entonces` son verificables objetivamente? | Resultados subjetivos o no observables |

Si alguna dimensión falla, ajustar la historia antes de continuar. Si `S` es demasiado grande, sugerir `/story-split`.

---

### Paso 7 — Guardar y entregar

#### Derivar el siguiente ID (FEAT-NNN)

> **IMPORTANTE:** La herramienta Glob solo encuentra **archivos**, nunca directorios. El patrón
> `specs/03-stories/FEAT-*` (apuntando a directorios) retorna siempre vacío. Usar obligatoriamente
> el patrón de archivo anidado descrito a continuación.

1. Usar Glob con el patrón `$SPECS_BASE/specs/03-stories/FEAT-*/story.md` para localizar todos los
   archivos `story.md` dentro de directorios `FEAT-NNN-*`. A partir de cada ruta retornada,
   extraer el segmento `FEAT-NNN` del nombre del directorio padre inmediato.
   Ejemplo: de `docs/specs/03-stories/FEAT-073-skill-security-audit-condicional/story.md` → `73`.
   Si Glob retorna vacío, usar como fallback:
   - Bash: `ls $SPECS_BASE/specs/03-stories/ | grep -E "^FEAT-[0-9]+"`
   - PowerShell: `Get-ChildItem $SPECS_BASE/specs/03-stories -Directory | Where-Object { $_.Name -match "^FEAT-" }`
   Nunca asumir que "sin resultados de Glob" significa "no hay historias previas".
2. Extraer los números de todos los prefijos `FEAT-NNN` encontrados
3. Tomar el número más alto y sumarle 1. Solo comenzar en `FEAT-001` si ambos mecanismos (Glob + fallback) confirman que no existe ningún directorio `FEAT-*`
4. Formatear con ceros a la izquierda hasta 3 dígitos: `FEAT-001`, `FEAT-053`, etc.

#### Reglas de nomenclatura

- **Directorio:** `FEAT-{NNN}-{slug}/`
- **Archivo:** `story.md` dentro de ese directorio
- El `{slug}` se deriva del `Quiero` de la historia: minúsculas, palabras separadas por guiones, máximo 5 palabras significativas, sin acentos ni caracteres especiales
- Ruta final: `$SPECS_BASE/specs/03-stories/FEAT-{NNN}-{slug}/story.md`

Si el directorio `FEAT-{NNN}-{slug}/` ya existe, incrementar NNN hasta encontrar uno disponible.

#### Completar frontmatter

En el archivo `story.md`, completar los campos del frontmatter con los valores resueltos:
- `id: FEAT-{NNN}`
- `slug: FEAT-{NNN}-{slug}`
- `status: SPECIFY` — estado inicial de toda historia creada directamente

#### Mostrar resumen

Después de guardar, mostrar en la conversación:

```
**Archivo generado:** `$SPECS_BASE/specs/03-stories/FEAT-{NNN}-{slug}/story.md`

[Historia completa en formato story-template.md]

---
**Nota FINVEST:** Esta historia está lista para evaluarse con `/story-evaluation`.
```

Si la historia fue simplificada para cumplir INVEST, explicar brevemente qué se dejó fuera de scope y por qué.

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Entorno inválido (preflight) | `✗ Entorno inválido` | Detener inmediatamente |
| Template no encontrado | `❌ No se encontró el template requerido en assets/story-template.md` | Detener. Pedir al usuario que verifique que el archivo existe |
| Más de 1 coincidencia en búsqueda (Tipo C) | Mostrar lista de coincidencias | Pedir al usuario que elija antes de continuar |
| Historia demasiado grande (falla `S` de INVEST) | Informar qué la hace grande | Sugerir `/story-split` antes de guardar |

---

## Salida

- `$SPECS_BASE/specs/03-stories/FEAT-{NNN}-{slug}/story.md` — historia de usuario generada
- Estado del workitem: `SPECIFY` (estado inicial; pendiente de evaluación con `/story-evaluation`)

### Ejemplo de output

```markdown
## 📖 Historia

**Como** cliente registrado que olvidó su contraseña
**Quiero** recibir un enlace de recuperación a mi email
**Para** poder acceder a mi cuenta sin contactar a soporte

## ✅ Criterios de aceptación

### Escenario principal – Recuperación exitosa
```gherkin
Dado que soy un usuario registrado con email "juan@example.com"
Cuando solicito recuperar mi contraseña
Entonces recibo un email con un enlace único de recuperación
  Y el enlace expira en exactamente 1 hora
```

### Escenario alternativo / error – Email no registrado
```gherkin
Dado que solicito recuperación con email "invalido@example.com"
Cuando el sistema verifica el email
Entonces veo el mensaje "No encontramos una cuenta con ese email"
  Pero no se envía ningún email
```

## ⚙️ Criterios no funcionales

* Seguridad: el enlace solo puede usarse una vez; se invalida tras el primer uso o expiración
* UX: se muestra confirmación de envío inmediatamente tras la solicitud

## 📎 Notas / contexto adicional

Flujo de recuperación vía email. SMS queda fuera de scope de esta historia.
```

### Referencias

- **Template canónico:** `assets/story-template.md`
- **Evaluación de calidad:** `/story-evaluation`
- **División de historias grandes:** `/story-split`
- Mike Cohn, *User Stories Applied* (2004)
- INVEST criteria — Bill Wake (2003)
