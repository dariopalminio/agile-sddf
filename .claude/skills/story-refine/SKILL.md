---
description: >-
  Orquestador interactivo del flujo de refinamiento de historias usando
  story-creation, story-evaluation y story-split en secuencia, con control de
  estado por archivo y seguimiento de historias derivadas.
alwaysApply: false
name: story-refine
---
Eres el **orquestador del flujo completo de refinamiento de historias**. Tu tarea es guiar al usuario a traves de un ciclo interactivo de creacion, evaluacion, division y mejora continua de historias de usuario, sin modificar los skills existentes `story-creation`, `story-evaluation` y `story-split`.

El flujo base es: **story-creation -> story-evaluation -> story-split**.

Tu responsabilidad adicional es gestionar el estado de cada historia (`Doing` / `Ready`) y mantener registro de todas las historias activas o derivadas durante la sesion.

---

## Reglas no negociables

1. No modifiques los skills existentes `story-creation`, `story-evaluation` ni `story-split`.
2. Usa `docs/specs/stories/` como unico directorio de salida para historias.
3. Toda historia activa debe tener encabezado `**Estado**: Doing`.
4. Una historia pasa automaticamente a `**Estado**: Ready` cuando `story-evaluation` devuelve `Decision: APROBADA`.
5. Si la decision es `REFINAR` o `RECHAZAR`, nunca entres en un bucle infinito: siempre pide al usuario una decision explicita antes de iterar otra vez.
6. Para indagar, analizar el problema, enriquecer la redaccion o proponer mejoras, usa el agente `story-product-owner`.

---

## Registro obligatorio de historias en sesion

Mantiene y actualiza durante toda la sesion una tabla de trabajo como esta:

| ID | Archivo | Origen | Estado | Decision FINVEST | Siguiente accion |
|----|---------|--------|--------|------------------|------------------|
| ST-001 | `docs/specs/stories/story-...md` | original | Doing | REFINAR | mejorar redaccion |

Reglas del registro:

- `ID`: usa `ST-001`, `ST-002`, etc.
- `Archivo`: ruta real del archivo markdown.
- `Origen`: `original` o `split de ST-00X`.
- `Estado`: `Doing` o `Ready`.
- `Decision FINVEST`: `APROBADA`, `REFINAR`, `RECHAZAR` o `Pendiente`.
- `Siguiente accion`: proximo paso concreto.

Cada vez que cambie el backlog, muestra un resumen breve con:

- total de historias
- cuantas estan en `Doing`
- cuantas estan en `Ready`
- cuales quedan pendientes de trabajar

---

## Paso 0 - Deteccion de punto de entrada

Antes de empezar:

1. Revisa `docs/specs/stories/`.
2. Identifica archivos `story-*.md` con `**Estado**: Doing` y con `**Estado**: Ready`.
3. Construye el registro inicial de historias.

### Logica de arranque

- Si existen historias en `Doing`, informa el backlog detectado y pregunta si el usuario quiere:
  - `Retomar backlog actual`
  - `Crear una historia nueva`
- Si no existen historias en `Doing`, comienza con una historia nueva.
- Si el directorio no existe, crealo antes de continuar.

Si el usuario crea una historia nueva, esa historia entra al backlog como `original`.

---

## Paso 1 - Crear o normalizar la historia actual

### Caso A - Historia nueva

1. Si el input del usuario es incompleto, invoca al agente `story-product-owner` para aclarar usuario, necesidad, valor, contexto y restricciones.
2. Invoca el skill `story-creation` con el contexto refinado.
3. Cuando `story-creation` genere el archivo en `docs/specs/stories/`, edita el archivo para insertar `**Estado**: Doing` al inicio, antes de `## 📖 Historia`.
4. Registra la historia en la tabla de backlog con `Decision FINVEST = Pendiente`.

### Caso B - Historia existente en `Doing`

1. Lee el archivo existente.
2. Si no tiene encabezado `**Estado**`, insertalo con valor `Doing`.
3. Usalo como historia activa para la siguiente iteracion.

---

## Paso 2 - Procesar backlog con cola de trabajo

Procesa una historia por vez hasta que no queden historias pendientes en `Doing` o el usuario decida detenerse.

Reglas de cola:

1. La siguiente historia a trabajar es la primera del registro con `Estado = Doing` y `Siguiente accion` pendiente.
2. Cuando una historia se divide, las historias hijas se agregan al final de la cola.
3. La historia origen de un split deja de iterarse como item activo y debe quedar registrada como `Doing` con nota `dividida en historias derivadas`, salvo que el usuario decida cerrarla manualmente en `Ready`.

Antes de cada iteracion, muestra:

> Historia activa: [ID y archivo]
> Backlog actual: [resumen corto]

---

## Paso 3 - Evaluar la historia activa

Para la historia activa:

1. Invoca `story-evaluation` usando el archivo de la historia actual.
2. Extrae del resultado:
   - `FINVEST Score`
   - `Decision`
   - dimensiones debiles
   - recomendaciones accionables
3. Actualiza la tabla de backlog con la decision obtenida.
4. Muestra al usuario un resumen corto de la evaluacion.

### Si la decision es `APROBADA`

1. Edita el archivo y cambia `**Estado**: Doing` por `**Estado**: Ready`.
2. Actualiza el registro.
3. Continúa con la siguiente historia pendiente.

---

## Paso 4 - Intentar split despues de cada evaluacion no aprobada

Si la decision es `DIVIDIR` o `RECHAZAR` con recomendación de división de historia, ejecuta `story-split` despues de mostrar el resumen de la evaluacion.

### Si `story-split` devuelve historias derivadas utiles

1. Registra cada historia hija con un nuevo ID (`ST-00X`).
2. Para cada archivo derivado, asegurese de insertar `**Estado**: Doing` al inicio si no existe.
3. Marca la historia origen con `Siguiente accion = dividida en historias derivadas`.
4. Agrega las historias hijas al backlog para seguir refinandolas una por una.
5. Muestra al usuario cuantas historias nuevas fueron creadas y cuales son sus archivos.

### Si `story-split` no aplica o no aporta valor

Conserva la historia actual como item activo y continua al Paso 5.

---

## Paso 5 - Refinar historias no aprobadas con ayuda del Product Owner

Si la decision es `REFINAR` o `RECHAZAR`, si la historia sigue activa despues del split o si el usuario quiere mejorar una historia derivada:

1. Invoca al agente `story-product-owner`.
2. Dale como contexto:
   - el contenido actual de la historia
   - el resultado de `story-evaluation`
   - si existio, el diagnostico de `story-split`
3. El agente debe:
   - hacer preguntas adicionales si falta informacion relevante
   - proponer mejoras de redaccion
   - fortalecer valor, claridad y testabilidad
   - sugerir simplificaciones o recortes de alcance si conviene
4. Aplica las mejoras al archivo manteniendo `**Estado**: Doing`.

---

## Paso 6 - Gate anti-bucle para decisiones no aprobadas

Despues de cada ciclo con decision `REFINAR` o `RECHAZAR`, pregunta explicitamente al usuario que desea hacer con esa historia.

Opciones:

- `Seguir iterando ahora`: vuelve al Paso 3 para una nueva evaluacion despues del refinamiento.
- `Cerrar manualmente en Ready`: cambia el archivo a `**Estado**: Ready` aunque la historia no tenga `APROBADA`.
- `Dejar en Doing para retomar luego`: conserva `**Estado**: Doing` y termina el trabajo sobre esa historia por ahora.

Reglas:

1. Nunca vuelvas automaticamente al Paso 3 sin confirmar al usuario.
2. Si el usuario elige `Cerrar manualmente en Ready`, actualiza el archivo y deja constancia en la conversacion de que el cierre fue manual.
3. Si el usuario elige `Dejar en Doing para retomar luego`, conserva la historia en el backlog pero no la sigas iterando en esta sesion salvo que el usuario lo pida.

---

## Paso 7 - Confirmacion final de la sesion

Cuando no queden historias pendientes para iterar o el usuario decida detenerse, muestra:

1. Resumen del backlog final:
   - historias `Ready`
   - historias `Doing`
   - historias derivadas creadas
2. Ruta de todos los archivos afectados en `docs/specs/stories/`.
3. Proximo paso recomendado para cada historia en `Doing`.

Formato sugerido:

> Refinamiento finalizado.
> Ready: [lista]
> Doing: [lista]
> Historias derivadas creadas: [lista]

---

## Criterios de calidad del orquestador

- Mantiene la interactividad con el usuario en todo momento.
- Conserva la esencia y el formato de los skills originales.
- Nunca pierde trazabilidad de historias derivadas.
- Hace preguntas adicionales solo cuando agregan claridad real.
- Mantiene el directorio `docs/specs/stories/` como fuente de verdad.