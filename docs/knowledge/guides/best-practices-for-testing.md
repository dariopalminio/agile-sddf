
# Mejores Prácticas para Pruebas de Software

## Pirámide de Pruebas

Los casos de prueba siguen la pirámide de pruebas:

```
        /\
       /  \      E2E Tests (10%)
      /----\     - Flujos críticos de usuario
     /      \
    /--------\   Integration + Contract Tests (20%)
   /          \  - API, DB, comunicación entre servicios
  /            \ - Contract (Pact, OpenAPI)
 /--------------\ 
/                \ Component + Unit Tests (70%)
------------------  - Componentes UI (con DOM simulado)
                    - Lógica de negocio (funciones puras)
                    - Condiciones de borde
--- Extras (fuera de la pirámide) ---
- Performance Tests (carga, estrés, resistencia)
- Eval Tests (skills, prompts, agentes) → su propia pirámide
```

---

## Tipos de Prueba clásicas

- **Unit Tests (unit):** La prueba unitaria verifica una unidad de código aislada (una función, un método, una clase) en un entorno controlado (entorno real o simulado como base de datos, servicios auxiliares, etc.), sin dependencias externas (bases de datos, APIs, el DOM). Su objetivo es confirmar que la lógica pura funciona correctamente. Las herramientas más comunes son: Jest (sin configuraciones especiales), Vitest, Mocha, Ava.
- **Component Tests (component):** La Prueba de Componente de Frontend verifica un componente de UI (ej. un botón, un formulario, una tarjeta). A menudo implica renderizar el componente (sin el navegador real, usando un DOM simulado como JSDOM) e interactuar con él (simular clics, cambios de input). Su objetivo es que el componente se renderiza correctamente y responde a las interacciones del usuario según lo esperado. Las herramientas más comunes son: Jest + React Testing Library, Vitest + Vue Testing Library, Angular TestBed.
- **Integration Tests (integration):** Las pruebas de Integración/API verifican que dos o más componentes (módulos, servicios, microservicio/endpoint, sistemas) interactúan correctamente a través de sus interfaces (APIs, bases de datos, colas de mensajes). Su objetivo es detectar errores en la comunicación (formato de datos, autenticación, manejo de errores, transacciones) entre partes que funcionan correctamente de forma aislada. Las herramientas más comunes suelen ser: Supertest (Node), Spring MockMvc (Java), pytest con requests (Python), Postman/Newman, REST Assured.
- **Contract Tests (contract):** Verifican que dos sistemas independientes (cliente y servidor, productor y consumidor) adhierten al mismo "contrato" de comunicación (mensajes, campos, tipos, formato). Su objetivo es asegurar que los cambios en un sistema no rompan la compatibilidad con el otro, sin necesidad de pruebas de integración completas. Muy usado en microservicios. Las herramientas comunes suelen ser: Pact (más popular), Spring Cloud Contract, OpenAPI (Swagger) con validación de ejemplos.
- **E2E Tests (e2e):** Las Pruebas End-to-End simulan un flujo completo de usuario, en un entorno completo (como staging), a través de todo el sistema: frontend, backend, base de datos, servicios externos. Su objetivo es validar que la aplicación funciona como un todo integrado desde la perspectiva del usuario final. Las herramientas comunes suelen ser: Cypress, Playwright, Selenium, TestCafe.
- **Performance Tests (performance):** Miden el comportamiento del sistema bajo una carga específica (número de usuarios simultáneos, peticiones por segundo, volumen de datos). Incluyen subtipos: estrés, resistencia, pico. El objetivo es identificar cuellos de botella, límites de escalabilidad, tiempos de respuesta degradados, fugas de memoria. Herramientas comunes: k6, JMeter, Gatling, Locust, Vegeta.

---

## Tipos de Prueba para Skills, Prompts y Agentes

- **Eval Tests (eval):** Un "Eval" es un caso de prueba que verifica que un LLM (como Claude), cuando utiliza un Skill, se comporta como se espera. Los Evals actúan como las pruebas unitarias y de integración para los Skills. Verifica la capacidad para desempeñar el rol completo de un agente/skill en un entorno controlado, ejecutando el LLM real, que imita la realidad. Las herramientas típicas son: skill-creator, agent-skills-eval. Las herramientas como agent-skills-eval permiten comparativa con/sin skill (baseline) y que miden pass rate, tokens y latencia.

- **Benchmarks (comparativa with/without skill):** Un benchmark es una batería de pruebas estandarizada que se ejecuta de forma controlada para medir el rendimiento de un skill de manera objetiva y repetible. La característica más importante es la comparativa directa: ejecutar el mismo conjunto de pruebas dos veces, una con el skill activado (with_skill) y otra sin él (without_skill), y luego comparar los resultados. Esto permite evaluar el impacto real del skill en el rendimiento, la precisión, la eficiencia y otros aspectos clave, proporcionando una visión clara de su valor añadido.

- **Adversarial Tests (inputs maliciosos o extraños):** Estas pruebas evalúan cómo un skill maneja entradas inesperadas, maliciosas o fuera de lo común, asegurando que el sistema sea robusto y seguro frente a posibles ataques o errores de usuario. Las pruebas adversariales verifican cómo se comporta el skill ante entradas que intentan engañarlo, confundirlo o llevarlo a estados no deseados. No se trata de "hackear" el sistema, sino de explorar los límites de la robustez del skill, agente o sistema agéntico.

- **E2E de Agente (flujo completo de varios skills encadenados):** Estas pruebas simulan un flujo completo de interacción entre múltiples skills/agentes, verificando que el agente funcione correctamente como un todo integrado y que los skills se coordinen adecuadamente para cumplir con los objetivos del usuario.

### Test-first (pruebas primero)

SDD exige diseñar especificaciones concisas de prueba antes de codificar. No es formalismo, sino una consideración práctica:

- **Los casos de prueba son requisitos ejecutables**: el formato Given-When-Then es más preciso que el lenguaje natural y elimina la ambigüedad en los requisitos
- **El test-first provee evidencia cuantificable para la revisión**: en la revisión se puede verificar la completitud funcional directamente comparando la cobertura de pruebas/criterios de aceptación como escenarios de prueba, en lugar de confiar en la revisión de código o la inspección visual de la implementación.




