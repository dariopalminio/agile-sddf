---
name: story-evaluation
description: "Evalúa la calidad de una historia de usuario aplicando la rúbrica FINVEST (Formato + INVEST) con escala Likert 1–5. Produce un score por dimensión, score global, decisión (APROBADA / REFINAR / RECHAZAR) y recomendaciones accionables."
---
# Skill: /story-evaluation

Evalúa la calidad de una historia de usuario aplicando la rúbrica **FINVEST** (Format + INVEST) con escala Likert 1–5. Produce un score por dimensión, score global, decisión (APROBADA / REFINAR / RECHAZAR / DIVIDIR) y recomendaciones accionables.

**Cuándo usar este skill:**
- Antes de llevar una historia de usuario a sprint planning
- Durante sesiones de backlog grooming o backlog refinement
- Para comparar la madurez de un conjunto de historias

---

## Restricciones de entrada

**Imágenes adjuntas:** Si el input incluye imágenes adjuntas (wireframes, screenshots u otros archivos binarios de imagen), **ignóralas completamente**. No intentes procesarlas, interpretarlas ni extraer información de ellas. Evalúa únicamente el contenido en texto (Markdown) de la historia de usuario.

Si el usuario adjunta solo una imagen sin proporcionar texto de historia de usuario, responde indicando que el skill requiere el texto de la historia para poder evaluar.

---

## Formato de referencia

La dimensión **F (Formato)** evalúa qué tan cerca está la historia del template canónico definido en `.claude/skills/story-evaluation/templates/story-gherkin-template.md`:

```markdown
## 📖 Historia
**Como** {rol}  
**Quiero** {acción}  
**Para** {beneficio}

## ✅ Criterios de aceptación

### Escenario principal – {título}
Dado {contexto}
  Y {condición adicional}
Cuando {acción}
Entonces {resultado}
  Y {otro resultado}

### Escenario alternativo / error – {título}
Dado {contexto}
Cuando {acción inválida}
Entonces {error o comportamiento alternativo}
  Pero {excepción}

### Escenario con datos (Scenario Outline) – opcional
Escenario: {título}
  Dado que el usuario tiene el rol "<rol>"
Ejemplos:
  | col1 | col2 |
  | val1 | val2 |

### Requerimiento (opcional)
{Requerimiento específico (como regla de negocio) relacionado con la historia, si aplica}

## ⚙️ Criterios no funcionales (opcional)
## 📎 Notas / contexto adicional (opcional)
```

Una historia que no usa la plantilla story-gherkin-template.md (o este template) puede igual ser evaluada, pero obtendrá scores más bajos en F en función de cuánto se aleja de esta estructura.

---

## Algoritmo de Evaluación FINVEST

### FASE 1: Evaluar F (Formato) — Gateway

Evaluar tres componentes de forma independiente en escala 0–5, luego calcular el F_score ponderado:

```
F_score = (puntaje_historia × 0.4) + (puntaje_criterios × 0.3) + (puntaje_gherkin × 0.3)
```

**Si F_score < 2.5 → RECHAZAR sin evaluar INVEST. Indicar el motivo y recomendaciones de formato.**

**Si F_score ≥ 2.5 → Continuar con FASE 2.**

---

### FASE 2: Evaluar dimensiones INVEST (solo si F_score ≥ 2.5)

Asignar un score 1–5 a cada dimensión usando las rúbricas de esta sección.

```
INVEST_Score = (I + N + V + E + S + T) / 6
FINVEST_Score = (F_score + INVEST_Score) / 2
```

**Reglas críticas:**
1. Si la dimensión S – Small (Tamaño) es 1 → Decisión automática **DIVIDIR**, independientemente del score total — Tamaño muy grande para una historia única.
2. Si cualquier dimensión INVE-T (cualquier dimensión INVEST excepto S) tiene score = 1 → Decisión automática **RECHAZAR**, independientemente del score total.

---

### Tabla de decisión final

| Condición | Decisión |
|-----------|----------|
| F_score < 2.5 | **RECHAZAR** — Formato insuficiente |
| F_score ≥ 2.5 y alguna dimensión INVEST = 1 | **RECHAZAR** — Dimensión crítica |
| F_score ≥ 2.5 y FINVEST_Score ≥ 4.0 | **APROBADA** |
| F_score ≥ 2.5 y 3.0 ≤ FINVEST_Score < 4.0 | **REFINAR** |
| F_score ≥ 2.5 y FINVEST_Score < 3.0 | **RECHAZAR** — Score insuficiente |
| S – Small (Tamaño) = 1 | **DIVIDIR** — Tamaño muy grande |

---

## Rúbricas Likert (1–5)

### F – Formato (3 componentes ponderados, basados en `story-gherkin-template.md`)

#### Componente 1: Sección Historia `## 📖 Historia` con `Como/Quiero/Para` (peso 40%)

| Score | Criterio |
|:---:|---|
| 5 | Sección `## 📖 Historia` presente + `Como/Quiero/Para` completo y semánticamente correcto: rol real, acción concreta, beneficio medible |
| 4 | `Como/Quiero/Para` completo y correcto, pero falta el encabezado `## 📖 Historia` o alguna cláusula es débil (ej. `Para` genérico) |
| 3 | `Como/Quiero/Para` presente pero alguna cláusula es incorrecta (ej. `Como` es un sistema, `Quiero` describe implementación técnica) |
| 2 | Falta una cláusula o el formato es libre sin estructura de sección reconocible |
| 1 | Las cláusulas presentes son semánticamente vacías (ej. "Como usuario, Quiero login, Para entrar") |
| 0 | Sin intento de formato historia de usuario |

#### Componente 2: Sección `## ✅ Criterios de aceptación` con escenarios nombrados (peso 30%)

| Score | Criterio |
|:---:|---|
| 5 | Sección `## ✅ Criterios de aceptación` presente + ≥1 **Escenario principal** + ≥1 **Escenario alternativo/error** claramente nombrados como subapartados (`###`) |
| 4 | Sección presente + Escenario principal bien identificado + al menos 1 criterio adicional (no necesariamente alternativo nombrado) |
| 3 | Sección `## ✅ Criterios de aceptación` presente con al menos 1 escenario o criterio reconocible, sin estructura de subapartados |
| 2 | Criterios presentes como lista libre o texto sin la sección de encabezado |
| 1 | Criterios presentes pero completamente vagos o inchequeables (ej. "que funcione bien") |
| 0 | Sin criterios de aceptación |

#### Componente 3: Escenarios Gherkin en bloques ` ```gherkin ` (peso 30%)

| Score | Criterio |
|:---:|---|
| 5 | ≥2 escenarios en bloques ` ```gherkin ` con `Dado/Y/Cuando/Entonces/Pero`; incluye **Scenario Outline con tabla `Ejemplos`** o escenario alternativo con `Pero` |
| 4 | ≥2 escenarios en bloques ` ```gherkin ` bien formados (Dado/Cuando/Entonces), con `Y` en al menos uno |
| 3 | 1 escenario en bloque ` ```gherkin ` bien formado (Dado/Cuando/Entonces mínimo) |
| 2 | Gherkin presente pero fuera de bloques de código, o dentro de bloques sin la sintaxis `Dado/Cuando/Entonces` reconocible |
| 1 | Intento de Gherkin incompleto (falta Given, When o Then) sin bloque de código |
| 0 | Sin escenarios Gherkin |

---

### I – Independencia

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Completamente independiente; no comparte recursos ni datos con otras historias | "Cambiar color del botón de CTA en landing page" |
| 4 | Puede ordenarse con otras historias en cualquier secuencia; no hay bloqueos reales | Puede ir antes o después de otra historia sin impacto |
| 3 | Dependencias externas existen pero están desacopladas (orden flexible, mockeable) | Requiere servicio de email, pero se puede probar con stub local |
| 2 | Depende de una historia no entregada, pero se puede simular parcialmente | Depende de API inexistente pero mockeable con datos fijos |
| 1 | Depende críticamente de otra historia no entregada; no puede iniciarse sin ella | "Ver dashboard" (depende de login + API de datos + widget X, todos incompletos) |

---

### N – Negociable

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Existe como recordatorio para una conversación; apenas texto, mucho contexto compartido | Tarjeta con título "Exportar reporte → conversar sobre formatos" |
| 4 | Documenta criterios de éxito, no soluciones; promueve conversación sobre el cómo | "Como vendedor quiero ver el top 5 de leads para priorizar seguimiento" |
| 3 | Tiene el qué y el por qué, pero deja espacio limitado para negociar el cómo | "Como usuario quiero resetear mi password para recuperar acceso" |
| 2 | Demasiado vaga (sin contexto) o demasiado específica (pre-decide la solución técnica) | "Mejorar el rendimiento" (sin métrica) |
| 1 | Especificación exhaustiva tipo BRD; no hay espacio para discusión | "El campo email debe validar con regex: ^[A-Za-z0-9...]" |

---

### V – Valiosa

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Valor claro y cuantitativamente medible con métrica de negocio | "Aumentar conversión de checkout en un 5%" |
| 4 | Valor claro y cualitativamente medible (NPS, encuesta, satisfacción observable) | "Reducir fricción al registrar tarjeta de crédito" |
| 3 | Valor claro para un usuario, pero subjetivo o no medible sin instrumentación adicional | "Mejorar la experiencia de onboarding" |
| 2 | Valor indirecto, difícil de explicar al usuario final | "Mejorar la cobertura de tests al 80%" |
| 1 | Valor solo para el equipo técnico o para la arquitectura (deuda interna sin beneficio de negocio) | "Refactorizar la capa de persistencia" |

---

### E – Estimable

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Estimación trivial (< 1 día/persona) y unánime en el equipo | "Cambiar texto de botón de 'Enviar' a 'Continuar'" |
| 4 | Estimación confiable por cualquier miembro del equipo con experiencia similar | "Añadir campo 'teléfono' a formulario de contacto con validación" |
| 3 | Estimación gruesa posible (T-shirt sizes) pero con incertidumbre por volumen o dependencias | "Implementar búsqueda de texto completo" (depende de volumen de datos) |
| 2 | Solo estimable después de un spike o investigación técnica previa | "Integrar con API de MercadoPago" (requiere spike de autenticación OAuth) |
| 1 | Imposible de estimar; gaps masivos de conocimiento técnico o de dominio | "Migrar a microservicios" (sin saber alcance, tecnología, ni número de módulos) |

---

### S – Small (Tamaño)

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

### T – Testeable

| Score | Criterio | Ejemplo |
|:---:|---|---|
| 5 | Condiciones en Gherkin directamente automatizables (booleanas, comparaciones exactas, Scenario Outline con datos) | `Ejemplos:` con tabla de valores concretos |
| 4 | Gherkin completo con escenarios alternativos, `Pero` o `Y` en Entonces; cubre happy path + errores | Escenario principal + escenario alternativo/error bien formados |
| 3 | 1 escenario Gherkin claro en bloque de código cubriendo el caso feliz | Dado/Cuando/Entonces con condiciones específicas |
| 2 | Prueba posible pero costosa (manual, entornos especiales, sin Gherkin formal) | "Verificar que el backup se ejecuta a las 3 AM los domingos" |
| 1 | No se puede probar objetivamente; subjetivo o no observable | "El sistema debe sentirse rápido y moderno" |

---

## Instrucciones de Output

1. Usar la estructura del template en `.claude/skills/story-evaluation/templates/evaluation-output-template.md`.
2. Calcular F_score con dos decimales de precisión.
3. Si F_score < 2.5, detenerse en Fase 1 y no calcular INVEST.
4. Para cada dimensión con score ≤ 3, incluir al menos 1 recomendación concreta y accionable en la sección "Comentarios".
5. Marcar con ⚠️ las dimensiones con score = 1 (críticas).
6. Si la historia no sigue el formato del template, indicar qué secciones faltan o están incorrectas y mostrar el fragmento del template correspondiente como guía.
7. Responder en el mismo idioma que la historia de entrada.

---

## Ejemplos de referencia (few-shot)

Los 3 ejemplos muestran historias escritas con el template `story-gherkin-template.md`:

- `examples/example-ready.md` — Historia con secciones completas → F_score 5.0, FINVEST Score 4.4 → **APROBADA**
- `examples/example-refinar.md` — Historia sin encabezados de sección ni bloques gherkin → F_score 2.5, FINVEST Score 3.0 → **REFINAR**
- `examples/example-rechazar.md` — Dos casos:
  - Caso A: Sin secciones ni Gherkin formal → F_score 1.4 → **RECHAZAR** por formato insuficiente
  - Caso B: Secciones completas pero dimensiones INVEST críticas → **RECHAZAR** por I, E, S = 1
