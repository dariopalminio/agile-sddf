---
alwaysApply: false
type: story
id: STORY-182
kind: feat
slug: STORY-182-verificar-y-deduplicar-hallazgos
title: "Verificación y deduplicación de hallazgos del árbitro"
status: DELIVER
substatus: DONE
parent: EPIC-28-calibrar-story-code-review-con-review-md
created: 2026-11-08
updated: 2026-11-12
related:
  - EPIC-28-calibrar-story-code-review-con-review-md
  - STORY-185-tope-de-low-y-arrastres
  - STORY-178-adr-guia-de-revision
  - STORY-180-story-code-review-lee-review-md
  - STORY-181-hallazgos-preexistentes
---
[[EPIC-28-calibrar-story-code-review-con-review-md]]

# 📖 Historia: Verificación y deduplicación de hallazgos del árbitro

**Como** Solo Builder que lee `code-review-report.md` para decidir si corrige o avanza  
**Quiero** que el árbitro de `/story-code-review` no trate como bloqueante un HIGH o MEDIUM sin `Archivo:Línea` y escenario de fallo concreto, y que fusione en un solo hallazgo los repetidos entre revisores  
**Para** que un falso positivo no me cueste una ronda completa de corrección y que cada defecto aparezca una sola vez en el informe

## ✅ Criterios de aceptación

### AC-1 — Escenario con datos (Scenario Outline) – Un bloqueante sin evidencia no bloquea
```gherkin
Escenario: el árbitro verifica la evidencia de un hallazgo bloqueante
  Dado que un revisor reporta un hallazgo <severidad> <ubicación> "Archivo:Línea" y <escenario> escenario de fallo concreto
  Cuando el árbitro consolida los informes
  Entonces el hallazgo figura en "code-review-report.md" como "<estado>"
    Y <efecto> para "max-severity", para el veredicto y para "fix-directives.md"
Ejemplos:
  | severidad | ubicación | escenario | estado        | efecto    |
  | MEDIUM    | sin       | con       | no verificado | no cuenta |
  | HIGH      | con       | sin       | no verificado | no cuenta |
  | HIGH      | con       | con       | bloqueante    | cuenta    |
```

### AC-2 — Escenario principal – Deduplicación: un hallazgo repetido aparece una vez
```gherkin
Dado que el Tech-Lead-Reviewer reporta como MEDIUM y el Security-Reviewer como HIGH el mismo defecto en "src/auth.js:42"
Cuando el árbitro consolida los informes
Entonces "code-review-report.md" y "fix-directives.md" lo muestran una sola vez, como HIGH y citando a los dos revisores
```

### AC-3 — Escenario alternativo – Hallazgos distintos no se fusionan
```gherkin
Dado que el Tech-Lead-Reviewer reporta un hallazgo en "src/auth.js:42" y el Security-Reviewer otro en "src/auth.js:90"
  Y el Integration-Reviewer reporta en "src/auth.js:42" un defecto que pide otra corrección
Cuando el árbitro consolida los informes
Entonces "code-review-report.md" muestra los tres hallazgos por separado
  Pero ninguno de ellos cita a más de un revisor
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Contrato del informe:** los valores de `verdict` y el significado de `max-severity` no cambian; la consolidación cambia qué hallazgos cuentan, no el formato (CS-2, CS-4).
- **CNF-2 — Evals primero:** un caso de hallazgo duplicado, uno de hallazgos distintos que no se fusionan y uno de hallazgo sin evidencia se escriben en `skills/story-code-review/evals/evals.json` antes de cambiar el skill (CS-8).
- **CNF-3 — Exigencia de evidencia en los revisores:** los cuatro agentes piden `Archivo:Línea` y escenario de fallo para HIGH/MEDIUM, para que el árbitro no tenga que degradar hallazgos válidos mal redactados.

## Fuera de alcance (Non-Goals)

- El tope de LOW por revisor y los LOW arrastrados entre rondas: STORY-185.
- La categoría PREEXISTENTE: STORY-181.
- Los hallazgos que crea el propio DoD CODE-REVIEW: STORY-183.

## 📎 Notas / contexto adicional

- Cubre el criterio de salida de EPIC-28 **CS-4b** — Un HIGH/MEDIUM sin `Archivo:Línea` y escenario de fallo no cambia el veredicto ni entra en `fix-directives.md`, y un hallazgo repetido entre revisores aparece una sola vez. El control de ruido (tope y arrastres de LOW, **CS-4c**) es STORY-185. Esta historia nace de dividir la STORY-182 original (patrón 4, complejidad de criterios de aceptación; la core conserva el ID y los escenarios de verificación y deduplicación).
- **Escenario de fallo concreto:** nombra una entrada o un estado de partida y el resultado erróneo observable que produce (p. ej., «con un `story.md` sin `parent:`, el Paso 1b aborta con `undefined`»). «Podría fallar» o «puede ser inseguro» no lo son. Solo se verifica HIGH y MEDIUM: un LOW no bloquea.
- **`Archivo:Línea` válido:** ruta de archivo y número de línea o rango (`src/auth.js:42`, `src/auth.js:40-45`). Una ruta sin línea o un texto como «varios archivos» no lo es.
- **Criterio de igualdad («mismo defecto»):** dos hallazgos son el mismo defecto si citan el mismo archivo, la misma línea o rangos que se solapan, y la misma corrección los resuelve.
  - `src/auth.js:42` y `src/auth.js:40-45`, ambos «falta validar el token» → se fusionan.
  - `src/auth.js:42` y `src/auth.js:90` → no se fusionan.
  - `src/auth.js:42` «falta validar el token» y `src/auth.js:42` «nombre de variable engañoso» → no se fusionan.
  - No se compara la columna `Dimensión`: cada revisor escribe la suya (`code-quality`, `requirements-coverage`, `integration-architecture`, `security`, Paso 4f de `skills/story-code-review/SKILL.md`), así que exigirla haría imposible fusionar entre revisores. El hallazgo fusionado lista las dimensiones de quienes lo reportaron. El mecanismo de comparación se decide en `/story-design`.
- **Punto de inserción y entrega indivisible:** Paso 4 (árbitro) de `skills/story-code-review/SKILL.md`, entre la lectura de informes (4a) y el cálculo de severidad (4b). La verificación y la deduplicación comparten ese punto y se entregan juntas: las dos deciden qué hallazgos cuentan antes de calcular `max-severity`.
- **Línea base (2026-11-07):** en STORY-125 un LOW se duplicó entre revisores.
- **Dependencias — orden recomendado, no precondición:** la verificación y la deduplicación solo leen los informes de los cuatro revisores (Paso 4a) y no usan `REVIEW.md`, así que funcionan igual con o sin STORY-180. Se recomienda implementarla después de STORY-180 solo para no editar a la vez el Paso 4, donde STORY-180 hace que el árbitro aplique `REVIEW.md`. Es independiente de STORY-185, que puede implementarse antes, después o en paralelo.
