---
alwaysApply: false   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (valor fijo)
type: story   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (valor fijo)
id: <STORY-NNN>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (historias hermanas)
kind: <feat | fix | chore | hotfix>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (hereda de la historia madre) — tipo de historia; determina el prefijo de rama
slug: <nombre-del-directorio-de-historia>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (renombra la core)
title: "<primer # heading del documento>"   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories
status: <ESTADO_INICIAL>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (inicial) · story-evaluation (→ SPECIFY/DONE solo con veredicto APPROVED — señal de un vistazo; el score vive en finvest-evaluation-report.md) · story-plan, story-implement, story-implement-tasks, story-code-review, story-verify, story-acceptance (transiciones)
substatus: IN-PROGRESS   # escritor: los mismos que status (story-evaluation lo lleva a DONE junto con status: SPECIFY)
parent: <nombre-del-directorio-de-la-epica>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories
created: <YYYY-MM-DD>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories
updated: <YYYY-MM-DD>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (inicial) · todo skill que edite el archivo (story-refine, story-split y los que transicionan status)
related:   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (añade la core y las hermanas) · epic-refine (retira referencias rotas, MAD-02; COH: reemplaza slugs obsoletos)
  - <nombre-del-directorio-de-la-epica o slug de la épica relacionada (si existe)> <!-- Colocar referencias solo si existe épica relacionada o historia relacionada -->
---
<!-- escritor del cuerpo: story-creation · epic-generate-stories · epic-generate-all-stories — salvo anotación distinta junto a la sección -->
<!-- Referencias: colocar referencias solo si existe épica relacionada -->
[[<nombre-del-directorio-de-la-epica o slug de la épica relacionada (si existe)>]]

# 📖 Historia: [Título de la historia o nombre de historia] <!-- escritor: defecto · story-refine (aplica recomendaciones FINVEST) · story-split (reescribe la historia core) -->

## Narrativa
**Como** [rol/persona]  
**Quiero** [acción/funcionalidad]  
**Para** [beneficio/valor]

## Contexto y valor *(si aplica)* <!-- sección opcional · escritor: defecto -->
[2–5 líneas: problema, situación actual, por qué importa, qué cambia para el usuario/negocio.]

## ✅ Criterios de aceptación (escenarios Gherkin) <!-- escritor: defecto · story-refine (aplica recomendaciones FINVEST) · story-split (reparte escenarios entre core y hermanas) · epic-refine (AC de cierre del contrato de salida, SAL-01/SAL-02) -->
<!-- Los escenarios Gherkin SON los criterios de aceptación funcionales.
     No se duplican en una sección separada. Si hay reglas transversales,
     exprésalas en sección "Reglas". -->

### AC-1 - Escenario principal – [título descriptivo]
```gherkin
Dado [contexto inicial]
  Y [otra condición si aplica]
Cuando [acción del usuario]
Entonces [resultado esperado]
  Y [otro resultado]
```
### AC-2 - Escenario alternativo / error – [título]
```gherkin
Dado [contexto]
Cuando [acción inválida o límite]
Entonces [mensaje de error o comportamiento alternativo]
  Pero [excepción si aplica]
```

### AC-3 - Escenario con datos (Scenario Outline) – opcional
```gherkin
Escenario: [título]
  Dado que el usuario tiene el rol "<rol>"
  Cuando intenta acceder a "[recurso]"
  Entonces ve "[mensaje]"
Ejemplos:
  | rol       | recurso   | mensaje               |
  | invitado  | /admin    | "Acceso denegado"     |
  | editor    | /admin    | "Acceso denegado"     |
  | admin     | /admin    | "Panel de control"    |
```

## Reglas (reglas de negocio) *(si aplica)* <!-- sección opcional · escritor: defecto -->
<!-- Listado de declaraciones normativas, con uso de palabras clave RFC 2119: MUST/SHALL, observables y verificables -->
- **Regla-1:** [regla transversal que aplica a varios escenarios] → cubierta por [AC-1, AC-n]
- **Regla-2:** [validación, cálculo, permisos, límites] → cubierta por [AC-1, AC-n]

## ⚙️ Criterios no funcionales específicos *(si aplica)* <!-- sección opcional · escritor: defecto · story-refine (aplica recomendaciones FINVEST) -->
- **CNF-[n] — [Nombre de requerimiento no funcional]:** [Descripción medible: umbral, percentil, condición, ventana de tiempo]

- **CNF-[n+1] — [Nombre de requerimiento no funcional]:** [Descripción medible: umbral, percentil, condición, ventana de tiempo]

## 🚫 Fuera de alcance (Non-Goals) *(si aplica)* <!-- sección opcional solo si es necesario indicar qué no se abordará -->
- [Lo que explícitamente NO cubre esta historia]

## 🔗 Notas adicionales (Dependencias, supuestos y notas) *(si aplica)* <!-- sección opcional · escritor: defecto · story-refine (dimensiones I y E) · story-split (contexto del split) · epic-refine (cita E1 del contrato de salida) -->
- **Dependencia:** [API, diseño, otra historia]
- **Supuesto:** [dato o condición asumida]
- **Notas UX/UI:** [enlace a prototipo]
- **Datos de prueba:** [si son relevantes]
