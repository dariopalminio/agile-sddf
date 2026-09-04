---
type: guide
slug: best-practices-for-testing
title: "Mejores Prácticas para Pruebas de Software"
date: 2026-05-23
status: null
substatus: null
parent: null
related:
  - best-practices-for-skill-testing
---
<!-- Referencias -->
[[best-practices-for-skill-testing]]

# Mejores Prácticas para Pruebas de Software

## Pirámide de Pruebas

Los casos de prueba siguen la pirámide de pruebas:

```
        /\
       /  \      E2E (10%)
      /----\     - Flujos críticos de usuario
     /      \    - Acceptance tests (criterios de aceptación como casos de prueba)
    /        \   Integration (20%)
   /          \  - API: API, DB, comunicación entre servicios
  /------------\ - Contract Tests (Pact, OpenAPI)
 /              \   Unit (70%)
/                \  - CT: Componentes UI (con DOM simulado)
------------------  - UT: Lógica de negocio (funciones puras)
                    - Condiciones de borde
--- Extras (fuera de la pirámide) ---
- PT: Performance Tests (carga, estrés, resistencia)
- EV: Eval Tests (skills, prompts, agentes) → su propia pirámide
```

---

## Reglas de clasificación de tipos de test

Aplicar esta tabla a la clasificación de pruebas para asegurar consistencia y claridad en la comunicación:

| Señal en los artefactos | Prefijo | Tipo |
|-------------------------|---------|------|
| Escenario Gherkin completo en story.md | E2E | End-to-End |
| Integración entre dos componentes o servicios | IT | Integration |
| Endpoint REST (verbo HTTP + ruta definida) | API | API |
| Store/gestor de estado global (si aplica al proyecto) | ST | Store |
| Carga esperada o estrés definido en criterios de aceptación | PT | Performance |
| Contrato definido entre sistemas | CON | Contract |
| Función/método público de módulo o servicio | UT | Unit |
| Componente UI (props, eventos, renderizado) | CT | Component |
| Skill SDDF como sujeto de validación | EV | Eval |


**Cobertura mínima por tipo:**
- UT: happy path + al menos un caso de error/borde
- CT: renderizado correcto + un caso de prop/evento edge
- IT: flujo positivo de integración entre los dos componentes
- API: request válido + respuesta esperada (happy path)
- E2E: trazable 1-a-1 al escenario Gherkin de origen
- PT: carga esperada + estrés (si aplica)
- CON: contrato definido + validación de contrato (si aplica)
- EV: happy-path del skill + caso fail-fast
---

## Tipos de Prueba clásicas

- **Unit Tests (unit/UT):** La prueba unitaria verifica una unidad de código aislada (una función, un método, una clase) en un entorno controlado (entorno real o simulado como base de datos, servicios auxiliares, etc.), sin dependencias externas (bases de datos, APIs, el DOM). Su objetivo es confirmar que la lógica pura funciona correctamente. Las herramientas más comunes son: Jest (sin configuraciones especiales), Vitest, Mocha, Ava.

- **Component Tests (component/CT):** La Prueba de Componente de Frontend verifica un componente de UI (ej. un botón, un formulario, una tarjeta). A menudo implica renderizar el componente (sin el navegador real, usando un DOM simulado como JSDOM) e interactuar con él (simular clics, cambios de input). Su objetivo es que el componente se renderiza correctamente y responde a las interacciones del usuario según lo esperado. Las herramientas más comunes son: Jest + React Testing Library, Vitest + Vue Testing Library, Angular TestBed.

- **Integration Tests (integration/IT):** Las pruebas de Integración/API verifican que dos o más componentes (módulos, servicios, microservicio/endpoint, sistemas) interactúan correctamente a través de sus interfaces (APIs, bases de datos, colas de mensajes). Su objetivo es detectar errores en la comunicación (formato de datos, autenticación, manejo de errores, transacciones) entre partes que funcionan correctamente de forma aislada. Las herramientas más comunes suelen ser: Supertest (Node), Spring MockMvc (Java), pytest con requests (Python), Postman/Newman, REST Assured.

- **API testing (API):** es el proceso de probar directamente las interfaces de programación de aplicaciones (APIs) para verificar que cumplen con los requisitos de funcionalidad, fiabilidad, rendimiento, usabilidad y seguridad. Consiste en enviar peticiones a los endpoints de la API y validar las respuestas recibidas. A diferencia de las pruebas de interfaz de usuario, las pruebas de API se centran en la lógica de negocio y la capa de integración, lo que las hace ideales para la automatización en pipelines de CI/CD. Se usan herramientas como: SuperTest (Pruebas de integración API en Node.js, NestJS, Express), Cucumber.js + SuperTest, Testclient (Fastapi & Python), pytest + requests (Pruebas de API en Python), Postman, Bruno (Bruno is the Git-native API client for REST, GraphQL, gRPC and Websocket), Preman, ApiDog (https://apidog.com/es/), Karate DSL (Pruebas de API con un lenguaje basado en Gherkin, ideal para BDD y pruebas de contrato), Rest Assured (Librería Java). Las pruebas de API también se pueden clasificar como Pruebas de Integración de API cuando se hace con mocks y Pruebas E2E de API cuando se hace con dependencias reales.

- **Contract Tests (contract/CON):** Verifican que dos sistemas independientes (cliente y servidor, productor y consumidor) adhierten al mismo "contrato" de comunicación (mensajes, campos, tipos, formato). Su objetivo es asegurar que los cambios en un sistema no rompan la compatibilidad con el otro, sin necesidad de pruebas de integración completas. Muy usado en microservicios. Las herramientas comunes suelen ser: Pact (más popular), Spring Cloud Contract, OpenAPI (Swagger) con validación de ejemplos.

- **UI Test (UI):** Las pruebas UI buscan asegurar la corrección visual y de interacción de la interfaz, independientemente del backend ya que se enfoca únicamente en la capa de presentación (frontend). Verifica que los componentes de la interfaz se rendericen correctamente, que los elementos sean visibles, que los eventos de usuario (clics, entradas de texto) provoquen las acciones esperadas en la UI, pero sin necesidad de que el backend real esté presente (se pueden usar mocks o stubs). Las herramientas comunes suelen ser: Testing Library, Vitest, Jest, Storybook (para pruebas visuales), y también herramientas como Playwright o Cypress.

- **E2E Tests (e2e/E2E):** Las Pruebas End-to-End simulan un flujo completo de usuario, en un entorno completo (como staging), a través de todo el sistema: frontend, backend, base de datos, servicios externos. Su objetivo es validar que la aplicación funciona como un todo integrado desde la perspectiva del usuario final. Las herramientas comunes suelen ser: Cypress, Playwright, Selenium, TestCafe, Cucumber, SpecFlow o Behave.

- **Acceptance Tests (acceptance/AT):** Las pruebas de aceptación son un tipo de pruebas de sistema end-to-end que verifican que el sistema cumple con los requisitos y expectativas del usuario final. Se suelen generar desde historias de usuario y se centran en escenarios de negocio y flujos de trabajo completos, asegurando que las funcionalidades implementadas satisfacen las necesidades del cliente. Las pruebas de aceptación también se utilizan como pruebas de regresión antes del lanzamiento a producción. A menudo se escriben en lenguaje natural (Gherkin) y se ejecutan con herramientas como Cucumber, SpecFlow o Behave. Las pruebas de aceptación son más orientadas al negocio y a los criterios del cliente (criterios de aceptación). En la práctica, la implementación técnica de una prueba de aceptación en "Extreme Programming" suele ser una prueba E2E, por lo que se usa el término indistintamente.

- **Visual Tests (visual/VT):** Las pruebas visuales son una especia de UI Test y verifican aspectos no funcionales (apariencia, diseño, layout). Se considera fuera de la Pirámide de Pruebas tradicional, pero es crucial para garantizar una experiencia de usuario consistente y de alta calidad, especialmente en aplicaciones con interfaces de usuario complejas o que dependen en gran medida del diseño visual. Las pruebas visuales pueden incluir pruebas de regresión visual (comparar capturas de pantalla con versiones anteriores), pruebas de diseño responsivo (verificar que la UI se adapte correctamente a diferentes tamaños de pantalla) y pruebas de accesibilidad visual (asegurar que los elementos sean visibles y legibles para todos los usuarios). Estas pruebas ayudan a detectar problemas que podrían no ser evidentes a través de pruebas funcionales tradicionales, como cambios no intencionados en el diseño, problemas de contraste o errores en la disposición de los elementos. Herramientas: Chromatic, Percy, Playwright.

- **Performance Tests (performance/PT):** Miden el comportamiento del sistema bajo una carga específica (número de usuarios simultáneos, peticiones por segundo, volumen de datos). Incluyen subtipos: estrés, resistencia, pico. El objetivo es identificar cuellos de botella, límites de escalabilidad, tiempos de respuesta degradados, fugas de memoria. Herramientas comunes: k6, JMeter, Gatling, Locust, Vegeta.

---

## Tipos de Prueba para Skills, Prompts y Agentes

- **Eval Tests (eval/EV):** Un "Eval" es un caso de prueba que verifica que un LLM (como Claude), cuando utiliza un Skill, se comporta como se espera. Los Evals actúan como las pruebas unitarias y de integración para los Skills. Verifica la capacidad para desempeñar el rol completo de un agente/skill en un entorno controlado, ejecutando el LLM real, que imita la realidad. Las herramientas típicas son: skill-master, agent-skills-eval. Las herramientas como agent-skills-eval permiten comparativa con/sin skill (baseline) y que miden pass rate, tokens y latencia.

- **Benchmarks (comparativa with/without skill):** Un benchmark es una batería de pruebas estandarizada que se ejecuta de forma controlada para medir el rendimiento de un skill de manera objetiva y repetible. La característica más importante es la comparativa directa: ejecutar el mismo conjunto de pruebas dos veces, una con el skill activado (with_skill) y otra sin él (without_skill), y luego comparar los resultados. Esto permite evaluar el impacto real del skill en el rendimiento, la precisión, la eficiencia y otros aspectos clave, proporcionando una visión clara de su valor añadido.

- **Adversarial Tests (inputs maliciosos o extraños):** Estas pruebas evalúan cómo un skill maneja entradas inesperadas, maliciosas o fuera de lo común, asegurando que el sistema sea robusto y seguro frente a posibles ataques o errores de usuario. Las pruebas adversariales verifican cómo se comporta el skill ante entradas que intentan engañarlo, confundirlo o llevarlo a estados no deseados. No se trata de "hackear" el sistema, sino de explorar los límites de la robustez del skill, agente o sistema agéntico.

- **E2E de Agente (flujo completo de varios skills encadenados):** Estas pruebas simulan un flujo completo de interacción entre múltiples skills/agentes, verificando que el agente funcione correctamente como un todo integrado y que los skills se coordinen adecuadamente para cumplir con los objetivos del usuario.

## Pruebas de regresión (regression)

Regression testing es el proceso de verificar que la funcionalidad que funcionaba anteriormente sigue funcionando correctamente después de cambios de código, detectando bugs donde código nuevo hace que features existentes fallen.

## Regression Suite

Según SmartBear State of Software Quality 2025, el 68% de los equipos de desarrollo identifican los bugs de regresión como el tipo de defecto más costoso de corregir en producción. La escala de este problema crece con la complejidad: la investigación de ISTQB muestra que en un sistema con 50 features hay más de 1.200 puntos de interacción potenciales — mucho más de lo que cualquier proceso de regresión manual puede cubrir confiablemente. Es por eso que el regression testing automatizado se ha convertido en un requisito para la entrega continua: sin él, los equipos no pueden hacer múltiples deployments por día sin riesgo inaceptable. Un regression suite efectivo protege los paths críticos de usuario, se ejecuta automáticamente en cada pull request y escala con el codebase.

### Alcance de la Regression Suite

- **Regresión Selectiva (selective):** Ejecuta solo los tests relevantes para el cambio específico (una feature/story), identificados mediante análisis de impacto o etiquetado. Suele durar entre 5 y 30 minutos. Ideal para ejecutar en desarrollo y/o cada pull request, optimizando el tiempo de feedback sin sacrificar la cobertura crítica.

- **Smoke tests (smoke):** El Smoke tests es una regresión corta y rápida que ejecuta solo un subconjunto representativo de los tests E2E e integración (escenarios felices y críticos). Suele durar < 5 minutos. Ideal para ejecutar en cada commit, en cada pull request o en producción post-deploy, después de un cambio en una feature o con estrategia de despliegue Continuous Deployment (continuous) donde se desarrolla y despliega por historia. Usado para estrategias de despliegue acumulativa (batch) a nivel de historia donde se desarrolla por historia, con regresión corta, pero se despliega por épica (allì con regresión larga). 

- **Core regression (sanity):** La prueba core o de sanidad ejecuta un subconjunto más amplio de tests que la regresión corta, incluyendo escenarios críticos y algunos escenarios adicionales. Suele durar entre 5 y 30 minutos. Ideal para ejecutar en cada pull request importante o en builds nocturnos o en Pull Request.

- **Regresión completa (regression/full):** Ejecuta toda la suite (E2E, integración, contract, rendimiento). Puede durar horas. Se ejecuta antes de épicas mayores, refactorizaciones, despues de largos períodos de desarrollo, en nightly builds, o bajo demanda. Ideal para validar la estabilidad general del sistema, detectar regresiones sutiles, y tener una visión completa del impacto de los cambios. Usado para estrategias de despliegue acumulativa (batch) a nivel de épica donde se desarrolla por historia pero se despliega por épica. Usado también para ejecutar en cada pull request a producción (main) o con estrategia de despliegue Continuous Deployment (continuous) donde se desarrolla y despliega por historia.

### Cuándo Correr Tests de Regresión

Se recomiendan diferentes tipos de regresión según el entorno:

- Desarrollo → Smoke tests (rápido)
- Desarrollo → Selective test (rápido)
- Pull Request → Core regression (medio)
- Staging → Full regression (completo)
- Production → Smoke tests (post-deploy)

### Desafíos Comunes 

#### Desafío 1: Test Suites Lentos
Problema: Regresión completa toma demasiado tiempo. Para checks de pull request, tests de regresión deben completarse en 15 minutos para no bloquear desarrolladores. Suites de regresión completos pueden correr 1-2 horas o más, lo que no es práctico para cada pull request.

Soluciones:
- Paraleliza tests
- Corre subset en PRs, suite completo de noche
- Optimiza tests lentos

#### Desafío 2: Flaky Tests
Problema: Tests que fallan aleatoriamente

Soluciones:
- Pon en cuarentena tests flaky
- Arregla o remueve después de X fallos
- Agrega retry con umbral de fallos

#### Desafío 3: Mantenimiento de Tests

Problema: Tests se rompen con cada cambio

Soluciones:
- Usa selectores estables (data-testid)
- Testea comportamiento, no implementación
- Crea utilidades de test compartidas

### IA en Regression Testing

Las herramientas de IA pueden ayudar a construir y mantener regression suites.

Lo que la IA hace bien:
- Generar test cases desde cambios de código
- Identificar áreas que necesitan cobertura de regresión
- Sugerir qué tests correr basado en archivos cambiados
- Crear datos de test para escenarios de regresión

Lo que aún necesita humanos:
- Decidir qué paths críticos proteger
- Evaluar si fallos de tests son regresiones reales
- Diseñar la estrategia general de testing
- Balancear cobertura con velocidad de ejecución


## Pruebas primero (test-first)

SDD exige diseñar especificaciones concisas de prueba antes de codificar. No es formalismo, sino una consideración práctica:

- **Los casos de prueba son requisitos ejecutables**: el formato Given-When-Then es más preciso que el lenguaje natural y elimina la ambigüedad en los requisitos.

- **El test-first provee evidencia cuantificable para la revisión**: en la revisión se puede verificar la completitud funcional directamente comparando la cobertura de pruebas/criterios de aceptación como escenarios de prueba, en lugar de confiar en la revisión de código o la inspección visual de la implementación.

- **TDD es una práctica de diseño y desarrollo**: escribir el test primero obliga a pensar en la interfaz, los casos de uso y los escenarios de borde antes de la implementación, lo que conduce a un diseño más limpio, modular y testeable. Luego se practica el proceso TDD en tres pasos principales: 1) Rojo (fallo del test) donde se escribe el test, 2) Verde (paso del test) donde se escribe el código funcional y 3) Refactorización, donde se mejora el código.

- Todo el código debe tener pruebas unitarias.

- Todo el código debe superar todas las pruebas unitarias antes de su lanzamiento.

- Cuando se encuentra un error, se crean pruebas.

- Las pruebas de aceptación se ejecutan con frecuencia.

- Una historia de usuario no se considera completa hasta que haya superado sus pruebas de aceptación.


## Fuentes y Lectura Adicional
- [Glosario ISTQB: Regression Testing — Definición oficial y terminología de testing](https://glossary.istqb.org/en_US/search?term=&exact_matches_first=true)
- [SmartBear State of Software Quality 2025 — Datos de industria sobre costos de defectos de regresión](https://smartbear.com/)
- [Martin Fowler: Test Driven Development — La práctica test-first de XP y el ciclo Red-Green-Refactor](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
