---
type: product
slug: objectives
title: "Objetivos"
status: IN-PROGRESS
substatus: TODO
parent: null
created: 2026-09-22
updated: 2026-10-10
---

# Objetivos

---

## Objetivo de negocio principal

### OBJ-1 — Framework SDD de extremo a extremo
Construir un framework (harness) CLI multiagente, declarativo y basado en Markdown, que haga del Spec-Driven Development una práctica operativa de extremo a extremo — desde la intención inicial hasta el incremento verificado — con control de WIP, trazabilidad completa y compatibilidad con múltiples runtimes de IA.

---

## Objetivos secundarios

### OBJ-2 — Habilitar Spec-as-Code

**Descripción:** Permitir que las especificaciones sean tratadas como código: versionadas, revisadas, trazables, con diff y merge en Git, y capaces de generar artefactos derivados (backlog, tareas, pruebas, documentación) de forma determinista.

**Indicador:** el framework soporta los tres modos de SDD (Intent-First, Spec-Anchored, Spec-as-Source) sin cambiar de modelo de datos.

**Justificación:** sin Spec-as-Code, el framework sería solo un generador de documentos. Con él, las specs se vuelven el artefacto central del ciclo de vida.

---

### OBJ-3 — Ser agnóstico al runtime de IA (Interoperabilidad)

**Descripción:** Funcionar en cualquier runtime que soporte lectura/escritura de archivos e invocación de skills: Claude Code, Codex, Copilot, Cursor, llama.cpp, Ollama. Sin dependencia de `agents/`, sin invocación anidada obligatoria.

**Justificación:** un framework que solo funciona en un runtime no es un framework, es un plugin. La portabilidad es la propuesta de valor.

**Indicador:** los skills se ejecutan sin cambios en ≥ 4 runtimes distintos, verificable con `scripts/verify-skill-independence.js`.

---

### OBJ-4 — Garantizar trazabilidad de extremo a extremo

**Descripción:** Cada incremento verificado debe poder rastrearse hacia atrás hasta la intención que lo originó: `DELIVER ← VERIFY ← IMPLEMENT ← PLAN ← SPECIFY ← FR/NFR ← vision`.

**Justificación:** sin trazabilidad, la pregunta "¿por qué existe este código?" no tiene respuesta. La trazabilidad es lo que diferencia SDD de "escribir prompts".

**Indicador:** 100% de historias declaran `implements` con FR/NFR existentes; `memory-system check` no reporta wikilinks roscos; `epic-analyze` y `epic-validate` reportan cobertura completa.

---

### OBJ-5 — Imponer gates de calidad antes de cada avance

**Descripción:** Cada transición de estado debe estar precedida por un gate verificable: `story-analyze`, `story-verify`, `story-acceptance`, `epic-analyze`, `epic-validate`. Sin gate superado, no hay avance.

**Justificación:** la calidad no es un paso final, es una propiedad de cada transición. Los gates hacen que el framework sea predecible.

**Indicador:** 100% de transiciones críticas tienen un gate asociado; ningún skill puede saltarse el gate.


---

### OBJ-6 — Ser minimalista y declarativo

**Descripción:** Todo el framework se expresa en Markdown y YAML. Sin build, sin transpilación, sin dependencias runtime más allá de `fs-extra`. Lo que se escribe es lo que se distribuye.

**Justificación:** el minimalismo es una decisión de diseño, no una limitación. Reduce la superficie de ataque, la deuda de mantenimiento y la curva de aprendizaje.

**Indicador:** `package.json` declara ≤ 1 dependencia runtime; `npm install -g agile-sddf` funciona sin pasos adicionales; el bundle se puede inspeccionar con `cat`.

---

### OBJ-7 — Ser extensible y multi-stack

**Descripción:** El core es agnóstico al stack. Los workers específicos (generadores de código, generadores de tests, validadores) viven en un repositorio de extensión externo y se declaran en `sddf.config.yaml`.

**Justificación:** un framework que asume un stack no escala. La extensión externa separa el core del meta-framework y permite que cada equipo instale solo lo que necesita.

**Indicador:** el core no contiene referencias a React, Python, Go ni ningún stack; existe `agile-sddf-extension` con al menos un worker por stack documentado.

---

### OBJ-8 — Interoperar con estándares abiertos

**Descripción:** Exportar el bundle de memoria a OKF v0.2, consumir bundles OKF de terceros, integrarse con Graphify vía `graphify-okf-bridge`. El conocimiento del proyecto debe ser portable entre organizaciones.

**Justificación:** la interoperabilidad organizacional es un diferenciador frente a frameworks propietarios. OKF es el estándar emergente.

**Indicador:** `okf-toolkit validate` pasa sobre el bundle exportado; un bundle OKF externo se puede importar sin transformaciones.

---

### OBJ-9 — Ser auto-hospedado (dogfooding)

**Descripción:** El framework se construye a sí mismo: cada mejora se especifica e implementa dentro del propio framework.

**Justificación:** el dogfooding es la única manera de validar el framework en uso real. Si el framework no sirve para construirse a sí mismo, no sirve para nada.

**Indicador:** el repositorio `agile-sddf` no contiene código de producción que no haya pasado por el pipeline SDDF; el `CHANGELOG.md` refleja solo historias completadas.

---

### OBJ-10 — Controlar el WIP y respetar el flujo

**Descripción:** Aplicar los principios de Kanban y Flight Levels: buffers con WIP limitado, gates de transición, detección de cuellos de botella, métricas de flujo por nivel.

**Justificación:** sin control de flujo, el framework sería un generador de deuda técnica. Kanban y Flight Levels ya están integrados en el modelo de estados.

**Indicador:** los buffers (`READY-FOR-IMPLEMENT`, `READY-FOR-DEV`) tienen WIP configurable; el framework expone lead time y throughput por nivel.

---

### OBJ-11 — Ser económicamente viable para usuarios con suscripción
**Descripción:** Diseñar el framework para que un Solo Builder con una cuota mensual típica (Claude Pro, ChatGPT Plus, Copilot) pueda completar un número significativo de historias sin agotar su cuota. La eficiencia de tokens no es un detalle de optimización: es una condición de adopción.

**Justificación:** el Local Builder puede escalar horizontalmente comprando VRAM. El Solo Builder no: si el framework consume 300k tokens por historia, agota su cuota en 2–3 historias y abandona. La eficiencia es lo que hace que el framework sea usable en el día a día, no solo en demos.

**Indicador:** un Desarrollador Claude (Solo Builder) con Claude Pro completa ≥ 6 historias medianas por mes sin agotar la cuota, con un consumo objetivo de ≤ 200k tokens por historia.

---

### OBJ-12 — Eficiencia Local-first (Local Builder)

**Descripción:** Diseñar el framework para que un Local Builder con VRAM limitada pero aceptable pueda
completar historias sin desbordar el contexto del modelo ni agotar la VRAM disponible.

**Indicador:** un Local Builder con 24 GB de VRAM (ejemplo con RTX-5090) completa ≥ 3 historias medianas por
sesión sin reiniciar el modelo.

## Métricas de éxito (Medidas de Éxito)

### 1. Interoperabilidad
- **Objetivos relacionados:** OBJ-3
- **Pregunta:** ¿En cuántos runtimes distintos puede ejecutarse el harness agile‑sddf sin reescribir sus skills, agentes y gates?
- **Indicador:** Runtimes soportados
- **Meta:** ≥ 4 (Claude Code, Codex, Copilot, llama.cpp)
- **Cómo se mide:** Documentación + tests manuales

### 2. Eficiencia Claude (Desarrollador Cloud) 
- **Objetivos relacionados:** OBJ-11
- **Pregunta:** De todo el presupuesto mensual de la suscripción (Claude) que tengo contratado, ¿qué fracción se va en cerrar una historia de usuario?
- **Indicador:** Porcentaje de cuota mensual consumida por historia
- **Meta:** ≤ 15%
- **Cómo se mide:** tokens/story ÷ tokens/mes

### 3. Eficiencia Local-first (Local Builder)
- **Objetivos relacionados:** OBJ-12
- **Pregunta:** ¿Cuánto contexto máximo necesita un skill o tarea del harness para ejecutarse de principio a fin en una sesión de usuario, expresado en tokens?
- **Indicador:** Ventana de contexto de la IA local
- **Meta:** <= 131k tokens
- **Cómo se mide:** `/usage` + `token-cost` en sesiones de referencia

### 4. Tokens Máximos por historia completadas
- **Objetivos relacionados:** OBJ-11 y OBJ-12
- **Pregunta:** ¿cuánto cuesta en total completar una historia medido en tokens?
- **Indicador:** Tokens Máximos por historia completada
- **Meta:** <= 200k
- **Cómo se mide:** `/usage` + `token-cost` en sesiones de referencia

### 5. Tokens Promedio por historia completadas
- **Objetivos relacionados:** OBJ-11 y OBJ-12
- **Pregunta:** ¿cuánto cuesta en promedio completar una historia medido en tokens?
- **Indicador:** Tokens Promedio por historia completada
- **Meta:** <= 150k
- **Cómo se mide:** `/usage` + `token-cost` en sesiones de referencia

### 6. Adopción (Downloads)
- **Objetivos relacionados:** OBJ-1 y OBJ-3
- **Pregunta:** ¿Cuántas descargas tiene desde npm cada mes?
- **Indicador:** Descargas mensuales en npm (promedio de la ventana estabilizada)
- **Meta:**  ≥ 500 en los primeros 6 meses
- **Cómo se mide:** analytics de npm + https://api.npmjs.org/downloads/range/<inicio>:<fin>/agile-sddf, agregado por mes

