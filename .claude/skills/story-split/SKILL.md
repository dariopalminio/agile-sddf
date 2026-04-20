---
name: story-split
description: "Divide una historia de usuario grande en historias más pequeñas e independientes usando los 8 patrones de splitting. Cada historia resultante sigue el template story-gherkin (Como/Quiero/Para + Gherkin) y cumple INVEST."
---

# Skill: /story-split

Toma una historia grande, épica o feature demasiado amplio y lo divide en historias más pequeñas e independientes. Cada historia resultante sigue **estrictamente** el template `docs/specs/templates/story-gherkin-template.md`.

**Usar cuando:**
- Una historia tiene ≥ 4 escenarios Gherkin o ≥ 8 pasos totales
- Hay múltiples flujos principales (varios `Cuando` independientes)
- El equipo no puede estimar la historia con confianza
- La historia mezcla varios roles, tipos de datos o reglas de negocio distintas
- `/story-evaluation` da score S ≤ 2 (Grande o Épica)

**No usar cuando:**
- La historia ya es pequeña y bien acotada (no sobre-dividir)
- El splitting crearía dependencias que bloquean entrega
- Es una tarea técnica sin valor de usuario directo

---

## Proceso de división

### Fase 0 — Resolver el input

El skill acepta tres tipos de input. Detectar cuál aplica antes de continuar:

#### Tipo A — Texto libre (historia completa o descripción en prosa)
**Señal:** El input es texto de una historia de usuario o descripción de feature.
**Acción:** Continuar directamente a la Fase 1.

#### Tipo B — Ruta de archivo relativa
**Señal:** El input parece una ruta (contiene `/` o `\`, o termina en `.md`).
**Acción:** Leer el archivo en esa ruta y usar su contenido como historia a dividir. Continuar a la Fase 1.

#### Tipo C — Nombre de archivo o término de búsqueda
**Señal:** El input es una palabra o frase corta que no parece texto de historia ni ruta explícita.
**Acción:**
1. Buscar en `docs/specs/stories/` archivos cuyo nombre contenga el término (sin distinguir mayúsculas)
2. Si hay exactamente 1 coincidencia → leerlo y usarlo como historia a dividir. Continuar a la Fase 1.
3. Si hay más de 1 coincidencia → mostrar la lista y pedir al usuario que elija antes de continuar.
4. Si no hay coincidencias → tratar el input como Tipo A (texto libre).

---

### Fase 1 — Diagnosticar la historia original

Leer la historia completa y responder:

1. ¿Cuántos escenarios Gherkin tiene? ¿Cuántos pasos totales?
2. ¿Hay múltiples flujos de usuario independientes bundleados?
3. ¿Mezcla varios roles, tipos de datos o reglas de negocio?
4. ¿Tiene dependencias externas múltiples?
5. ¿Por qué es difícil de estimar?

Identificar el **patrón de splitting más apropiado** (ver Fase 2). Si aplican varios, aplicarlos en orden.

---

### Fase 2 — Seleccionar el patrón de splitting

Aplicar en orden hasta encontrar el que encaja:

#### Patrón 1 — Pasos del flujo de trabajo
**Cuándo:** La historia cubre pasos secuenciales de un mismo journey.

**Señal:** Los escenarios describen etapas de un proceso en cadena.

```
Original: "Como usuario quiero registrarme, verificar mi email y completar mi perfil"
↓
Split A: "Como visitante quiero registrarme con email/contraseña..."
Split B: "Como usuario registrado quiero verificar mi email..."
Split C: "Como usuario verificado quiero completar mi perfil..."
```

---

#### Patrón 2 — Variaciones de reglas de negocio
**Cuándo:** La historia aplica reglas diferentes según condiciones (roles, permisos, cálculos).

**Señal:** Un Scenario Outline con múltiples filas donde cada fila tiene lógica diferente.

```
Original: "Como usuario quiero aplicar descuentos (10% miembro, 20% VIP, 5% primer compra)"
↓
Split A: "Como miembro quiero aplicar 10% de descuento..."
Split B: "Como usuario VIP quiero aplicar 20% de descuento..."
Split C: "Como comprador primerizo quiero aplicar 5% de descuento..."
```

---

#### Patrón 3 — Variaciones de datos
**Cuándo:** La historia maneja tipos de datos o inputs distintos que tienen comportamientos propios.

**Señal:** Escenarios que difieren solo en el tipo de archivo, formato o dato de entrada.

```
Original: "Como usuario quiero subir archivos (imágenes, PDFs, videos)"
↓
Split A: "Como usuario quiero subir imágenes (JPG, PNG)..."
Split B: "Como usuario quiero subir documentos PDF..."
Split C: "Como usuario quiero subir videos (MP4, MOV)..."
```

---

#### Patrón 4 — Complejidad de criterios de aceptación *(más común)*
**Cuándo:** La historia tiene múltiples escenarios principales independientes (varios `Cuando` distintos).

**Señal:** Más de 1 escenario principal, o escenarios alternativos que son en realidad flujos completos.

```
Original: "Como usuario quiero gestionar mi carrito"
  Escenario: agregar ítem → carrito actualizado
  Escenario: eliminar ítem → carrito actualizado
  Escenario: cambiar cantidad → total recalculado
↓
Split A: "Como comprador quiero agregar ítems a mi carrito..."
Split B: "Como comprador quiero eliminar ítems de mi carrito..."
Split C: "Como comprador quiero actualizar la cantidad de un ítem..."
```

---

#### Patrón 5 — Esfuerzo mayor (incrementos técnicos)
**Cuándo:** La implementación requiere fases técnicas que pueden entregarse incrementalmente con valor en cada etapa.

**Señal:** El equipo dice "primero necesitamos X para poder hacer Y".

```
Original: "Como usuario quiero colaboración en tiempo real en documentos"
↓
Split A: "Como usuario quiero ver quién más está viendo el documento (presencia read-only)"
Split B: "Como usuario quiero ver los cursores en tiempo real de otros editores"
Split C: "Como usuario quiero ver las ediciones de otros en tiempo real"
```

---

#### Patrón 6 — Dependencias externas
**Cuándo:** La historia depende de múltiples sistemas, APIs o terceros distintos.

**Señal:** Escenarios que varían solo por el proveedor externo.

```
Original: "Como usuario quiero iniciar sesión con Google, Facebook o Twitter"
↓
Split A: "Como usuario quiero iniciar sesión con Google OAuth"
Split B: "Como usuario quiero iniciar sesión con Facebook OAuth"
Split C: "Como usuario quiero iniciar sesión con Twitter OAuth"
```

---

#### Patrón 7 — Pasos DevOps / infraestructura
**Cuándo:** La historia incluye requerimientos de despliegue o infraestructura que escalan por etapas.

**Señal:** El alcance cambia significativamente según el entorno o el volumen.

```
Original: "Como usuario quiero subir archivos grandes a la nube"
↓
Split A: "Como usuario quiero subir archivos pequeños (<10MB)"
Split B: "Como usuario quiero subir archivos medianos (10MB–1GB) con barra de progreso"
Split C: "Como usuario quiero retomar una subida interrumpida"
```

---

#### Patrón 8 — Tiny Acts of Discovery (TADs)
**Cuándo:** Ninguno de los patrones anteriores aplica porque hay demasiadas incógnitas para escribir historias concretas.

**Señal:** El equipo no puede imaginar los escenarios Gherkin porque no entiende el problema.

> Los TADs **no son historias** — son experimentos o spikes de investigación. Producir TADs en lugar de historias y volver a `/story-split` una vez que haya claridad.

```
Original: "Como usuario quiero recomendaciones con IA" (demasiado vago)
↓
TAD 1: Prototipar 3 algoritmos de recomendación y testear con 10 usuarios
TAD 2: Definir métricas de éxito (tasa de clicks, satisfacción)
TAD 3: Construir el motor de recomendación más simple posible
```

---

### Fase 3 — Escribir cada historia resultante

Cada historia del split debe seguir **estrictamente** el template `docs/specs/templates/story-gherkin-template.md`:

```markdown
## 📖 Historia

**Como** {rol específico}
**Quiero** {acción concreta}
**Para** {beneficio real}

## ✅ Criterios de aceptación

### Escenario principal – {título}
```gherkin
Dado {contexto específico}
Cuando {acción}
Entonces {resultado verificable}
```

### Escenario alternativo / error – {título}
```gherkin
Dado {contexto}
Cuando {acción inválida}
Entonces {error o comportamiento alternativo}
  Pero {excepción}
```

### Requerimiento (opcional)
{Requerimiento específico (como regla de negocio) relacionado con la historia, si aplica}

## ⚙️ Criterios no funcionales (opcional)
## 📎 Notas / contexto adicional
```

Aplicar las mismas reglas de calidad de `/story-creation`:
- `Como` → rol específico, no "usuario" genérico
- `Quiero` → acción del usuario, no implementación técnica
- `Para` → beneficio real, no restatement de `Quiero`
- Pasos Gherkin → específicos y verificables, con valores concretos cuando sea posible

---

### Fase 4 — Validar cada split

Antes de entregar, verificar que **cada historia** cumple:

| Criterio | Pregunta |
|---|---|
| **I** Independiente | ¿Se puede desarrollar sin esperar las demás historias del split? |
| **N** Negociable | ¿Documenta el qué/para qué sin prescribir el cómo técnico? |
| **V** Valiosa | ¿Entrega valor al usuario aunque las demás historias no estén hechas? |
| **E** Estimable | ¿El equipo puede estimar sin investigación previa? |
| **S** Small | ¿Tiene ≤ 3 escenarios Gherkin y ≤ 7 pasos totales? |
| **T** Testeable | ¿Los `Entonces` son verificables objetivamente? |

Si alguna historia no cumple **V** (no entrega valor por sí sola), revisar el patrón de splitting — probablemente se hizo corte horizontal en lugar de vertical.

---

### Fase 5 — Guardar y entregar el output

#### Guardar cada historia como archivo `.md`

Por cada historia resultante del split, crear un archivo en `docs/specs/stories/`.

**Reglas de nomenclatura:**
- Formato: `story-{slug}.md`
- El `{slug}` se deriva del `Quiero` de la historia: minúsculas, palabras separadas por guiones, máximo 5 palabras significativas
- Ejemplos: `story-subir-imagenes.md`, `story-recuperar-contrasena.md`, `story-aplicar-descuento-miembro.md`

**Verificar que el directorio existe antes de escribir:**
```bash
docs/specs/stories/
```
Si no existe, crearlo.

**Contenido de cada archivo:** la historia completa en formato `story-gherkin-template.md`, sin encabezados adicionales de sección (`## Historia 1`, etc.) — solo el contenido de la historia.

#### Mostrar resumen en pantalla

Después de guardar los archivos, mostrar el siguiente resumen en la conversación:

```
## Historia original
[Reproducir la historia tal como fue recibida]

## Diagnóstico
[Explicar por qué era demasiado grande y qué patrón se aplicó]

## Historias resultantes

### Historia 1 — {título corto}
**Archivo:** `docs/specs/stories/story-{slug}.md`
[Historia completa en formato story-gherkin-template.md]

### Historia 2 — {título corto}
**Archivo:** `docs/specs/stories/story-{slug}.md`
[Historia completa en formato story-gherkin-template.md]

...

## Notas del splitting
[Qué quedó fuera de scope, dependencias entre historias si las hay, sugerencias de orden de implementación]

## Archivos generados
- `docs/specs/stories/story-{slug-1}.md`
- `docs/specs/stories/story-{slug-2}.md`
- ...
```

Si se generaron TADs en lugar de historias, explicar claramente que son experimentos previos a la escritura de historias. Los TADs **no se guardan como archivos**.

---

## Anti-patrones de splitting

| Anti-patrón | Problema | Corrección |
|---|---|---|
| Corte horizontal: "Historia 1: API. Historia 2: UI" | Ninguna entrega valor por sí sola | Corte vertical: cada historia incluye lo necesario para ser usable |
| Over-splitting: historia de 2 días dividida en 5 | Overhead innecesario | Solo dividir cuando hay señales claras de tamaño grande |
| Splits con el mismo `Para` | Se dividió la acción pero no el valor | Cada split debe tener un beneficio diferenciado |
| Dependencias duras entre splits: "el 2 bloquea al 3" | Anula el beneficio del splitting | Reordenar o replantear el patrón para minimizar bloqueos |
| Split arbitrario: "primera mitad / segunda mitad" | Sin racionalidad de valor o workflow | Usar uno de los 8 patrones con justificación explícita |

---

## Referencias

- **Template canónico:** `docs/specs/templates/story-gherkin-template.md`
- **Creación de historias:** `/story-creation`
- **Evaluación de calidad:** `/story-evaluation`
- Richard Lawrence & Peter Green, *Humanizing Work Guide to Splitting User Stories* — origen de los 8 patrones
- Bill Wake, *INVEST in Good Stories* (2003)
- Mike Cohn, *User Stories Applied* (2004)
