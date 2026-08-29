---
name: story-evaluation
description: "Evalúa la calidad de una historia de usuario aplicando la rúbrica FINVEST (Formato + INVEST) con escala Likert 1–5. Produce un score por dimensión, score global, decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) y recomendaciones accionables."
triggers:
  - "story-evaluation"
  - "evaluar historia"
  - "FINVEST"
  - "calidad de historia"
  - "score historia"
  - "revisar historia de usuario"
---

# Skill: `/story-evaluation`

## Objetivo

Evalúa la calidad de una historia de usuario aplicando la rúbrica **FINVEST** (Formato + INVEST) con escala Likert 1–5. Produce un score por dimensión, score global, decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) y recomendaciones accionables.

**Qué hace este skill:**
- Evalúa el formato de la historia contra el template canónico `story-template.md` (dimensión F)
- Aplica las 6 dimensiones INVEST con rúbricas Likert 1–5
- Calcula F_score, INVEST_Score y FINVEST_Score
- Emite una decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) con recomendaciones accionables
- Genera el reporte en `finvest-evaluation-report.md` dentro del directorio de la historia (si el input fue ID o ruta de archivo)
- Si la decisión es `APROBADA` y el input fue una ruta de archivo, actualiza el frontmatter de `story.md` con `status: SPECIFY` / `substatus: DONE`

**Qué NO hace este skill:**
- Generar diseño, tasks ni artefactos de planning
- Corregir o reescribir la historia automáticamente
- Crear artefactos distintos de `finvest-evaluation-report.md` en `$SPECS_BASE/specs/`

---

## Entrada

- Texto libre de historia de usuario
- Identificador `FEAT-NNN` de una historia existente en `$SPECS_BASE/specs/03-stories/`
- Ruta de archivo `story.md`

---

## Parámetros

- `{story ID}` — texto libre, ID (ej. `FEAT-057`) o ruta de archivo de la historia a evaluar (obligatorio)

---

## Precondiciones

- Si el input es una ruta de archivo: el archivo debe existir y ser legible
- El template `$SPECS_BASE/specs/templates/story-template.md` debe existir (requerido para evaluar la dimensión F)

---

## Dependencias

- Skills: ninguno
- Archivos: [`$SPECS_BASE/specs/templates/story-template.md`], [`assets/evaluation-output-template.md`]

---

## Modos de ejecución

- **Modo manual** (`/story-evaluation`): el usuario proporciona el texto, identificador o ruta de la historia; el skill muestra el reporte completo con scores, decisión y recomendaciones
- **Modo Agent** (invocado por `story-specify` u orquestador): automático, recibe la historia como contexto, retorna la decisión y el reporte; si la decisión es `APROBADA` y el input fue una ruta de archivo, actualiza el frontmatter de `story.md` directamente

---

## Restricciones / Reglas

- Este skill no invoca `skill-preflight` — su único output en disco son `finvest-evaluation-report.md` (siempre que el input sea ID o ruta de archivo) y la actualización del frontmatter de `story.md` (solo si la decisión es `APROBADA`).
- El template `story-template.md` es de solo lectura — nunca escribir en él ni usarlo como ruta de salida.
- Si `F_score < 2.5`, no evaluar dimensiones INVEST — emitir `RECHAZAR` directamente por formato insuficiente.
- **Imágenes adjuntas:** si el input incluye imágenes adjuntas (wireframes, screenshots u otros archivos binarios de imagen), ignorarlas completamente. Evaluar únicamente el contenido en texto (Markdown) de la historia de usuario. Si el usuario adjunta solo una imagen sin texto de historia, indicar que el skill requiere texto para evaluar.
- Responder siempre en el mismo idioma que la historia de entrada.
- NO modifique ningún archivo existente en el código fuente (estamos en etapa de especificación, no de implementación)
- NO genere código; este skill solo evalúa, no crea archivos.
- **Encoding**: All generated `.md` files MUST be saved as **UTF-8 without BOM**. 
  Do not use Latin-1, CP-1252, or any other encoding. 
  If you see characters like `Ã³` or `ðŸ“–`, that indicates an encoding error — fix it.

---

## Flujo de ejecución

### Paso 1 — Leer template canónico

El archivo `$SPECS_BASE/specs/templates/story-template.md` es la **única fuente de información estructural** para la dimensión F. Define qué secciones existen, en qué orden y con qué propósito. Nunca hardcodear los nombres o la estructura de las secciones — siempre derivarlos del template en tiempo de ejecución. El template es de **solo lectura**.

Leer el archivo `$SPECS_BASE/specs/templates/story-template.md`.

- Si el archivo central **no existe**: usar el fallback `$CLI_ROOT/skills/story-creation/assets/story-template.md` y emitir:
  > ⚠️ Usando template del skill story-creation. Ejecuta `sddf-init` para centralizarlo en `$SPECS_BASE/specs/templates/`.
- Si tampoco existe el fallback: detener la ejecución (ver Manejo de errores).
- Si alguno de los dos **existe**: continuar al Paso 2.

La dimensión **F (Formato)** evalúa qué tan cerca está la historia de este template. Una historia que no sigue el template puede igualmente evaluarse, pero obtendrá scores más bajos en F en función de cuánto se aleja de la estructura definida.

---

### Paso 2 — Evaluar F (Formato) — Gateway

Evaluar tres componentes de forma independiente en escala 0–5, luego calcular el F_score ponderado:

```
F_score = (puntaje_historia × 0.4) + (puntaje_criterios × 0.3) + (puntaje_gherkin × 0.3)
```

**Si F_score < 2.5 → RECHAZAR sin evaluar INVEST. Indicar el motivo y recomendaciones de formato.**

**Si F_score ≥ 2.5 → Continuar con el Paso 3.**

---

### Paso 3 — Evaluar dimensiones INVEST

Asignar un score 1–5 a cada dimensión usando las rúbricas de referencia al final de este flujo.

```
INVEST_Score = (I + N + V + E + S + T) / 6
FINVEST_Score = (F_score + INVEST_Score) / 2
```

**Reglas críticas:**
1. Si la dimensión S – Small (Tamaño) es 1 → Decisión automática **DIVIDIR**, independientemente del score total — Tamaño muy grande para una historia única.
2. Si cualquier dimensión INVEST (excepto S) tiene score = 1 → Decisión automática **RECHAZAR**, independientemente del score total.

---

### Paso 4 — Aplicar tabla de decisión

| Condición | Decisión |
|-----------|----------|
| F_score < 2.5 | **RECHAZAR** — Formato insuficiente |
| F_score ≥ 2.5 y alguna dimensión INVEST = 1 | **RECHAZAR** — Dimensión crítica |
| F_score ≥ 2.5 y FINVEST_Score ≥ 4.0 | **APROBADA** |
| F_score ≥ 2.5 y 3.0 ≤ FINVEST_Score < 4.0 | **REFINAR** |
| F_score ≥ 2.5 y FINVEST_Score < 3.0 | **RECHAZAR** — Score insuficiente |
| S – Small (Tamaño) = 1 | **DIVIDIR** — Tamaño muy grande |

---

### Paso 5 — Generar output

1. Usar la estructura del template en `assets/evaluation-output-template.md`.
2. Calcular F_score con dos decimales de precisión.
3. Si F_score < 2.5, detenerse en el Paso 2 y no calcular INVEST.
4. Para cada dimensión con score ≤ 3, incluir al menos 1 recomendación concreta y accionable en la sección "Comentarios".
5. Marcar con ⚠️ las dimensiones con score = 1 (críticas).
6. Si la historia no sigue el formato del template, indicar qué secciones faltan o están incorrectas y mostrar el fragmento del template correspondiente como guía.
7. Responder en el mismo idioma que la historia de entrada.

---

### Paso 6 — Guardar reporte en archivo

**Condición:** el input fue proporcionado como ID (`FEAT-NNN`) o como ruta de archivo (no texto libre).

1. Resolver la ruta del directorio de la historia:
   - Si el input fue un ID → buscar el directorio `$SPECS_BASE/specs/03-stories/FEAT-NNN-*/` usando Glob con el patrón `$SPECS_BASE/specs/03-stories/FEAT-NNN-*/story.md` y extraer el directorio padre.
   - Si el input fue una ruta de archivo → usar el directorio que contiene ese archivo.
2. Escribir el reporte completo (el mismo contenido mostrado en conversación) en:
   `<directorio-de-la-historia>/finvest-evaluation-report.md`
3. El archivo usa frontmatter mínimo:
   ```yaml
   ---
   type: finvest-evaluation
   story-id: <FEAT-NNN>
   finvest-score: <score>
   decision: <APROBADA|REFINAR|RECHAZAR|DIVIDIR>
   evaluated: <YYYY-MM-DD>
   ---
   ```
   seguido del reporte completo en Markdown.
4. Si el archivo ya existe, sobreescribirlo (la evaluación más reciente siempre reemplaza la anterior).
5. Confirmar en el output: `✓ Reporte guardado: <ruta>/finvest-evaluation-report.md`
6. Si el directorio no es accesible, emitir advertencia y continuar sin bloquear:
   `⚠️ No se pudo guardar el reporte en: <ruta> — verifica permisos`

---

### Paso 7 — Actualizar frontmatter si APROBADA

**Condición:** decisión = `APROBADA` Y el input fue proporcionado como ruta de archivo (no como texto libre) o ID de story (ubicada en un archivo).

1. Verificar que el archivo existe en la ruta proporcionada o con el `{story ID}` proporcionado.
2. Actualizar únicamente los campos `status` y `substatus` en el frontmatter YAML del archivo:
   - `status: SPECIFY`
   - `substatus: DONE`
3. Si los campos no existen en el frontmatter, agregarlos.
4. No modificar ningún otro campo del frontmatter ni el cuerpo del archivo.
5. Confirmar en el output: `✓ Frontmatter actualizado: status: SPECIFY / substatus: DONE`
6. Si el archivo no es accesible o no tiene frontmatter YAML válido, emitir advertencia y continuar sin bloquear:
   `⚠️ No se pudo actualizar el frontmatter de: <ruta> — verifica permisos y formato`

---

### Rúbricas de referencia (F, I, N, V, E, S, T)

#### F – Formato (3 componentes ponderados, basados en `story-template.md`)

##### Componente 1: Sección Historia `## 📖 Historia` con `Como/Quiero/Para` (peso 40%)

| Score | Criterio |
|:---:|---|
| 5 | Sección `## 📖 Historia` presente + `Como/Quiero/Para` completo y semánticamente correcto: rol real, acción concreta, beneficio medible |
| 4 | `Como/Quiero/Para` completo y correcto, pero falta el encabezado `## 📖 Historia` o alguna cláusula es débil (ej. `Para` genérico) |
| 3 | `Como/Quiero/Para` presente pero alguna cláusula es incorrecta (ej. `Como` es un sistema, `Quiero` describe implementación técnica) |
| 2 | Falta una cláusula o el formato es libre sin estructura de sección reconocible |
| 1 | Las cláusulas presentes son semánticamente vacías (ej. "Como usuario, Quiero login, Para entrar") |
| 0 | Sin intento de formato historia de usuario |

##### Componente 2: Sección `## ✅ Criterios de aceptación` con escenarios nombrados (peso 30%)

| Score | Criterio |
|:---:|---|
| 5 | Sección `## ✅ Criterios de aceptación` presente + ≥1 **Escenario principal** + ≥1 **Escenario alternativo/error** claramente nombrados como subapartados (`###`) |
| 4 | Sección presente + Escenario principal bien identificado + al menos 1 criterio adicional (no necesariamente alternativo nombrado) |
| 3 | Sección `## ✅ Criterios de aceptación` presente con al menos 1 escenario o criterio reconocible, sin estructura de subapartados |
| 2 | Criterios presentes como lista libre o texto sin la sección de encabezado |
| 1 | Criterios presentes pero completamente vagos o inchequeables (ej. "que funcione bien") |
| 0 | Sin criterios de aceptación |

##### Componente 3: Escenarios Gherkin en bloques ` ```gherkin ` (peso 30%)

| Score | Criterio |
|:---:|---|
| 5 | ≥2 escenarios en bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`; incluye **Scenario Outline con tabla `Ejemplos`** o escenario alternativo con `Pero` |
| 4 | ≥2 escenarios en bloques ` ```gherkin ` bien formados (Dado/Cuando/Entonces), con `Y` en al menos uno |
| 3 | 1 escenario en bloque ` ```gherkin ` bien formado (Dado/Cuando/Entonces mínimo) |
| 2 | Gherkin presente pero fuera de bloques de código, o dentro de bloques sin la sintaxis `Dado/Cuando/Entonces` reconocible |
| 1 | Intento de Gherkin incompleto (falta Given, When o Then) sin bloque de código |
| 0 | Sin escenarios Gherkin |

---

#### I – Independencia

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Completamente independiente; no comparte recursos ni datos con otras historias | "Cambiar color del botón de CTA en landing page" |
| 4 | Puede ordenarse con otras historias en cualquier secuencia; no hay bloqueos reales | Puede ir antes o después de otra historia sin impacto |
| 3 | Dependencias externas existen pero están desacopladas (orden flexible, mockeable) | Requiere servicio de email, pero se puede probar con stub local |
| 2 | Depende de una historia no entregada, pero se puede simular parcialmente | Depende de API inexistente pero mockeable con datos fijos |
| 1 | Depende críticamente de otra historia no entregada; no puede iniciarse sin ella | "Ver dashboard" (depende de login + API de datos + widget X, todos incompletos) |

---

#### N – Negociable

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Existe como recordatorio para una conversación; apenas texto, mucho contexto compartido | Tarjeta con título "Exportar reporte → conversar sobre formatos" |
| 4 | Documenta criterios de éxito, no soluciones; promueve conversación sobre el cómo | "Como vendedor quiero ver el top 5 de leads para priorizar seguimiento" |
| 3 | Tiene el qué y el por qué, pero deja espacio limitado para negociar el cómo | "Como usuario quiero resetear mi password para recuperar acceso" |
| 2 | Demasiado vaga (sin contexto) o demasiado específica (pre-decide la solución técnica) | "Mejorar el rendimiento" (sin métrica) |
| 1 | Especificación exhaustiva tipo BRD; no hay espacio para discusión | "El campo email debe validar con regex: ^[A-Za-z0-9...]" |

---

#### V – Valiosa

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Valor claro y cuantitativamente medible con métrica de negocio | "Aumentar conversión de checkout en un 5%" |
| 4 | Valor claro y cualitativamente medible (NPS, encuesta, satisfacción observable) | "Reducir fricción al registrar tarjeta de crédito" |
| 3 | Valor claro para un usuario, pero subjetivo o no medible sin instrumentación adicional | "Mejorar la experiencia de onboarding" |
| 2 | Valor indirecto, difícil de explicar al usuario final | "Mejorar la cobertura de tests al 80%" |
| 1 | Valor solo para el equipo técnico o para la arquitectura (deuda interna sin beneficio de negocio) | "Refactorizar la capa de persistencia" |

---

#### E – Estimable

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Estimación trivial (< 1 día/persona) y unánime en el equipo | "Cambiar texto de botón de 'Enviar' a 'Continuar'" |
| 4 | Estimación confiable por cualquier miembro del equipo con experiencia similar | "Añadir campo 'teléfono' a formulario de contacto con validación" |
| 3 | Estimación gruesa posible (T-shirt sizes) pero con incertidumbre por volumen o dependencias | "Implementar búsqueda de texto completo" (depende de volumen de datos) |
| 2 | Solo estimable después de un spike o investigación técnica previa | "Integrar con API de MercadoPago" (requiere spike de autenticación OAuth) |
| 1 | Imposible de estimar; gaps masivos de conocimiento técnico o de dominio | "Migrar a microservicios" (sin saber alcance, tecnología, ni número de módulos) |

---

#### S – Small (Tamaño)

Usar la cantidad de escenarios Gherkin (incluyendo filas de Scenario Outline) como señal primaria:

| Score | Categoría | N° escenarios / filas Ejemplos | Complejidad de pasos | Señal de alerta |
|:---:|---|:---:|---|---|
| 5 | Trivial | 1 | ≤ 3 pasos totales | Ninguna |
| 4 | Muy pequeña | 1–2 | 4–5 pasos | Un solo `Y` |
| 3 | Pequeña (ideal) | 2–3 | 5–7 pasos | 1 escenario alternativo claro |
| 2 | Grande | 4–5 | 8–10 pasos | Múltiples `Y` o tablas pequeñas |
| 1 | Épica / Demasiado grande | ≥ 6 | ≥ 11 pasos | Tablas con ≥ 4 filas o `Y` anidados |

Si la historia no tiene escenarios Gherkin, estimar por complejidad implícita del texto.

---

#### T – Testeable

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Condiciones en Gherkin directamente automatizables (booleanas, comparaciones exactas, Scenario Outline con datos) | `Ejemplos:` con tabla de valores concretos |
| 4 | Gherkin completo con escenarios alternativos, `Pero` o `Y` en Entonces; cubre happy path + errores | Escenario principal + escenario alternativo/error bien formados |
| 3 | 1 escenario Gherkin claro en bloque de código cubriendo el caso feliz | Dado/Cuando/Entonces con condiciones específicas |
| 2 | Prueba posible pero costosa (manual, entornos especiales, sin Gherkin formal) | "Verificar que el backup se ejecuta a las 3 AM los domingos" |
| 1 | No se puede probar objetivamente; subjetivo o no observable | "El sistema debe sentirse rápido y moderno" |

---

### Manejo de errores

| Condición | Mensaje | Acción |
|---|---|---|
| Template no encontrado | `❌ No se encontró el template requerido en $SPECS_BASE/specs/templates/story-template.md. Por favor verifica que el archivo existe antes de continuar.` | Detener la ejecución |
| Archivo de historia no accesible (input fue ruta) | `⚠️ No se pudo leer el archivo: <ruta>` | Notificar y detener |
| Input es solo imagen sin texto de historia | `ℹ️ El skill requiere el texto de la historia para evaluar. Las imágenes adjuntas no pueden procesarse.` | Solicitar texto y detener |
| Frontmatter no actualizable (APROBADA + ruta) | `⚠️ No se pudo actualizar el frontmatter de: <ruta> — verifica permisos y formato` | Emitir advertencia y continuar sin bloquear |

---

## Salida

- Reporte mostrado en conversación con la estructura de `assets/evaluation-output-template.md`
- `<directorio-historia>/finvest-evaluation-report.md` — reporte persistido en disco (si el input fue ID o ruta de archivo)
- Frontmatter de `story.md` actualizado (únicamente si decisión = `APROBADA` y el input fue ID o ruta de archivo): `status: SPECIFY` / `substatus: DONE`

### Ejemplos de referencia

Los 3 ejemplos muestran historias escritas con el template `story-template.md`:

- `examples/example-ready.md` — Historia con secciones completas → F_score 5.0, FINVEST Score 4.4 → **APROBADA**
- `examples/example-refinar.md` — Historia sin encabezados de sección ni bloques gherkin → F_score 2.5, FINVEST Score 3.0 → **REFINAR**
- `examples/example-rechazar.md` — Dos casos:
  - Caso A: Sin secciones ni Gherkin formal → F_score 1.4 → **RECHAZAR** por formato insuficiente
  - Caso B: Secciones completas pero dimensiones INVEST críticas → **RECHAZAR** por I, E, S = 1
