---
type: adr
id: ADR-0020
slug: contratos-centralizados-para-spec-living
title: "Contratos centralizados en OpenAPI/AsyncAPI para specs/living/"
status: PROPOSED
date: 2026-11-03
supersedes: null
superseded-by: null
---

# ADR-0020: Contratos centralizados en OpenAPI/AsyncAPI para specs/living/

## Contexto y problema

[ADR-0018](ADR-0018-adoptar-cucumber-para-specs-living.md) propone usar Gherkin en archivos `.feature` dentro de `specs/living/features/` para describir el comportamiento vigente del sistema desde la perspectiva de escenarios de negocio. Sin embargo, las especificaciones vivas (Living Specs) requieren dos capas complementarias:

1. **Comportamiento de negocio (BDD):** escenarios Gherkin que validan las reglas de lógica empresarial.
2. **Contratos técnicos (protocolos y esquemas):** especificaciones ejecutables de las interfaces de comunicación entre sistemas (REST, eventos asincronos, etc.).

La estructura actual no define dónde residen los contratos técnicos de una arquitectura de microservicios o una topología de sistemas distribuidos. Sin una fuente única de verdad (Single Source of Truth - SSOT) centralizada para las interfaces técnicas, surgen problemas conocidos:

- **Contratos dispersos y duplicados** en repositorios de productores (servicios API) y consumidores (clientes, gateways), generando desalineamientos y breaking changes no detectados.
- **Dead documentation:** especificaciones OpenAPI/AsyncAPI en cada repositorio se desincronizaban rápidamente con las implementaciones reales.
- **Sin validación cruzada:** cambios en un contrato no se verifican automáticamente contra las implementaciones de productores y consumidores en el pipeline de CI/CD.
- **Coupling tight entre repositorios:** sin un contrato de verdad central, la evolución de interfaces genera fricción y requiere coordinación manual.

Origen: la épica de Living Spec (ADR-0017, ADR-0018, ADR-0019) anticipa que `specs/living/` es el espacio para especificación viva del sistema; la decisión de arquitectura de microservicios y el flujo de CI/CD que empuja hacia Contract Testing (Specmatic, Pact, Spring Cloud Contract) como práctica de ingeniería de software de madurez alta.

## Decisión

El repositorio centraliza los contratos técnicos (OpenAPI, AsyncAPI) en `specs/living/contracts/` como única fuente de verdad (SSOT) para las interfaces entre sistemas:

```
specs/living/
├── features/                          # Escenarios Gherkin de comportamiento de negocio (BDD)
│   ├── pagos/
│   │   ├── checkout.feature
│   │   ├── reembolsos.feature
│   │   └── checkout.md
│   ├── autenticacion/
│   │   ├── login.feature
│   │   └── recuperacion-password.feature
│   └── catalogo/
│
└── contracts/                         # SSOT: contratos técnicos ejecutables
    ├── openapi/                       # Contratos REST / HTTP síncronos
    │   ├── orders-api.yaml            # Especificación ejecutable del API de órdenes
    │   ├── payments-api.yaml
    │   ├── auth-api.yaml
    │   └── README.md                  # Documentación de los contratos REST
    │
    └── asyncapi/                      # Contratos orientados a eventos (Kafka, SQS, RabbitMQ)
        ├── order-events.yaml          # Especificación ejecutable de eventos de órdenes
        ├── payment-events.yaml
        └── README.md                  # Documentación de los contratos de eventos
```

### Estructura de un contrato OpenAPI en `specs/living/contracts/openapi/`:

Cada archivo `.yaml` contiene la especificación OpenAPI 3.0+ completa (no fragmentos parciales):

```yaml
openapi: 3.0.3
info:
  title: Orders API
  version: 1.0.0
  description: |
    API central para gestión de órdenes.
    Esta es una especificación viva: se valida continuamente contra
    las implementaciones de productores y consumidores en el CI/CD.
    
servers:
  - url: https://api.example.com
    description: Production
  - url: http://localhost:8080
    description: Local

paths:
  /orders:
    post:
      summary: Crear una nueva orden
      operationId: createOrder
      tags:
        - Orders
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderRequest'
      responses:
        '201':
          description: Orden creada exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          description: Solicitud inválida
        '401':
          description: No autorizado
        
  /orders/{orderId}:
    get:
      summary: Obtener detalles de una orden
      operationId: getOrder
      parameters:
        - name: orderId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Orden encontrada
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '404':
          description: Orden no encontrada

components:
  schemas:
    Order:
      type: object
      required:
        - id
        - customerId
        - total
        - status
        - createdAt
      properties:
        id:
          type: string
          format: uuid
        customerId:
          type: string
          format: uuid
        total:
          type: number
          format: float
          minimum: 0
        status:
          type: string
          enum: [PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
        createdAt:
          type: string
          format: date-time
```

### Estructura de un contrato AsyncAPI en `specs/living/contracts/asyncapi/`:

Cada archivo `.yaml` describe los eventos de una entidad o dominio:

```yaml
asyncapi: 2.6.0
info:
  title: Order Events
  version: 1.0.0
  description: |
    Eventos de órdenes: especificación viva para el bus de eventos.
    Válida contra productores (servicios que publican) y consumidores
    (servicios que se suscriben) en el CI/CD.

servers:
  production:
    url: kafka.example.com:9092
    protocol: kafka
    description: Kafka cluster de producción

channels:
  order-created:
    subscribe:
      message:
        $ref: '#/components/messages/OrderCreated'
      
  order-shipped:
    subscribe:
      message:
        $ref: '#/components/messages/OrderShipped'

components:
  messages:
    OrderCreated:
      payload:
        $ref: '#/components/schemas/OrderCreatedEvent'
        
    OrderShipped:
      payload:
        $ref: '#/components/schemas/OrderShippedEvent'
        
  schemas:
    OrderCreatedEvent:
      type: object
      required:
        - eventId
        - eventType
        - timestamp
        - orderId
        - customerId
      properties:
        eventId:
          type: string
          format: uuid
        eventType:
          type: string
          enum: [OrderCreated]
        timestamp:
          type: string
          format: date-time
        orderId:
          type: string
          format: uuid
        customerId:
          type: string
          format: uuid
```

## Restricción crítica: sin UI dentro del repositorio central

Los contratos en `specs/living/contracts/` describen **únicamente especificaciones agnósticas a la presentación**:

- ✅ Contratos REST (OpenAPI): endpoints de API, esquemas de datos, códigos de error.
- ✅ Contratos de eventos (AsyncAPI): tópicos, esquemas de mensajes, topologías de Kafka/SQS/RabbitMQ.
- ✅ Reglas de negocio expresadas en Gherkin (`specs/living/features/`): validación de lógica empresarial.

- ❌ No residen en `specs/living/` los escenarios de interacción de UI (flujos de navegación, layouts, capas de presentación).
- ❌ Especificaciones de UI (Storybook, figma links, mocks de pantalla) van en repositorios de frontend separados.

**Rationale:** la UI es acoplada a tecnología (React, Vue, Flutter, etc.) y varía por plataforma (web, móvil, desktop). Mezclarla con contratos técnicos neutrales contamina la SSOT y acelera su obsolescencia.

## Integración con productores y consumidores

Cada repositorio de microservicio declara su contrato en `specs/living/contracts/` de este repositorio central. Los clientes (consumidores) usan Contract Testing para validar que sus implementaciones cumplen:

### En un repositorio productor (por ejemplo, `orders-service`):

```json
{
  "specmatic.json": {
    "contractsSource": "https://github.com/organization/specs-repo/tree/main/specs/living/contracts/openapi/orders-api.yaml",
    "contractsVersion": "orders-api.yaml@1.0.0"
  }
}
```

El pipeline de CI/CD del productor ejecuta:

```bash
specmatic test \
  --contract specs/living/contracts/openapi/orders-api.yaml \
  --backend http://localhost:8080
```

Valida que la implementación cumple con el contrato centralizado.

### En un repositorio consumidor (por ejemplo, `web-gateway`):

```json
{
  "specmatic.json": {
    "contractsSource": "https://github.com/organization/specs-repo/tree/main/specs/living/contracts/openapi/orders-api.yaml",
    "contractsVersion": "orders-api.yaml@1.0.0"
  }
}
```

El pipeline del consumidor genera stubs automáticamente desde el contrato:

```bash
specmatic stub --contract specs/living/contracts/openapi/orders-api.yaml
```

Y ejecuta tests de contrato contra los stubs, garantizando que los cambios en el contrato se propagan de inmediato.

## Versionado de contratos

Cada contrato en `specs/living/contracts/` sigue versionado semántico (MAJOR.MINOR.PATCH) en su campo `info.version`:

- **PATCH:** cambios internos del esquema, reordenamiento de campos, clarificaciones de documentación. No requiere cambios en productores o consumidores.
- **MINOR:** adición de campos opcionales, nuevos endpoints o tópicos, extensión de enumeraciones. Productores y consumidores existentes siguen siendo compatibles.
- **MAJOR:** eliminación de campos obligatorios, cambio de tipos, eliminación de endpoints. Requiere actualización coordinada de productores y consumidores.

Los repositorios dependientes pinean a una versión fija (tag o commit) del contrato para evitar breaking changes no esperados.

## Esqueleto de cambio en un contrato

Cuando un equipo necesita cambiar un contrato vigente:

1. **Pull request en el repositorio central** (`specs-repo`) que edita el archivo `.yaml` en `specs/living/contracts/`.
2. **Validación del PR:** un script de CI verifica que el contrato es OpenAPI/AsyncAPI válido (sintaxis, esquemas bien formados).
3. **Contract breaking change detection:** una herramienta automática (por ejemplo, Specmatic CLI o Dredd) analiza si el cambio es retrocompatible. Si no, la PR requiere justificación y sincronización con productores/consumidores.
4. **Merge:** una vez que productores y consumidores están listos, se mergea el contrato actualizado.
5. **Propagación:** cada repositorio dependiente actualiza su `specmatic.json` a la nueva versión del contrato y ejecuta su suite de tests de contrato.

## Rationale

1. **Arquitectura de especificaciones vivas (Living Documentation & Executable Specifications Architecture):** los requisitos de negocio (Gherkin) y los contratos técnicos (OpenAPI/AsyncAPI) son el artefacto único y ejecutable que guía el diseño (SSOT).

2. **Behavior & Contract-Driven Development (BCDD):** combina BDD (Specification by Example) y Contract Testing en un paradigma holístico de arquitectura de software de madurez alta.

3. **Automatización de regresiones de contrato:** Contract Testing en el pipeline de CI/CD de productores y consumidores detecta breaking changes antes de que causen incidentes en producción.

4. **Separación de concerns:** UI (acoplada a tecnología) queda fuera; contratos neutrales residen en la SSOT.

5. **Escalabilidad:** arquitecturas de microservicios con N productores y M consumidores evitan explosión combinatoria de tests de integración pairwise gracias a un contrato central validado.

## Alternativas consideradas

- **Cada repositorio mantiene su propio contrato:** descartada porque genera duplicación, desincronización y breaking changes no detectados.
- **Un archivo monolítico `contracts.yaml`:** descartada porque dificulta el merge paralelo en PRs de diferentes dominios y equipos; preferible un archivo por entidad/dominio.
- **Versionado por git tag en lugar de campo `info.version`:** descartada porque pierde la trazabilidad dentro del archivo y complica el análisis de retrocompatibilidad.
- **Centralizar también las especificaciones de UI (Figma, Storybook):** descartada por la restricción crítica: UI está acoplada a tecnología y plataforma, y contaminaría la SSOT.
- **Usar GraphQL en lugar de REST/AsyncAPI:** descartada porque no restringe la decisión de protocolo; GraphQL es ortogonal y puede tener su propio contrato central si la topología lo requiere.

## Consecuencias

**Positivas:**

- Una única fuente de verdad (SSOT) para contratos técnicos: evita desincronización y breaking changes en sorpresa.
- Contract Testing automatizado: cada cambio de contrato se valida inmediatamente contra todas las implementaciones en el CI/CD.
- Escalabilidad de arquitecturas distribuidas: N productores y M consumidores validan contra un contrato, no contra cada combinación pairwise.
- Arquitectura de especificaciones vivas: requisitos de negocio (Gherkin) y contratos técnicos (OpenAPI/AsyncAPI) son artefactos ejecutables que guían el diseño.
- Migración guiada de cambios: versionado semántico + detección automática de breaking changes comunica claramente qué equipos deben actuar.

**Negativas:**

- Sincronización requerida: cambios de contrato MAJOR requieren coordinación entre equipos.
- Complejidad inicial: introducir tooling de Contract Testing (Specmatic, Pact, etc.) requiere inversión en CI/CD y capacitación.
- Git merge conflicts: si múltiples equipos editan el mismo `.yaml` en paralelo, aumentan los conflictos (mitigable con separación por dominio).

**Riesgos:**

- **Contrato sin consumidores validados:** un contrato puede envejecer sin que ningún consumidor lo implemente. Mitigable con garbage collection periódico y métricas de adopción.
- **Cambios de contrato MINOR malinterpretados como PATCH:** requiere una cultura fuerte de revisión y validación en PR.

## Implementación esperada

1. Crear la estructura `specs/living/contracts/openapi/` y `specs/living/contracts/asyncapi/` con archivos `.yaml` de plantilla.
2. Documentar guías de cómo escribir contratos OpenAPI/AsyncAPI en `docs/guides/contract-testing.md` o similar.
3. Agregar validación de sintaxis en el pipeline de CI (OpenAPI/AsyncAPI schema validation).
4. Proporcionar plantillas en `docs/templates/openapi-template.yaml` y `docs/templates/asyncapi-template.yaml`.
5. En futuras épicas: integración de Specmatic u otra herramienta de Contract Testing en los pipelines de CI/CD de equipos de producto.

## Referencias

- Gojko Adzic. *Living Documentation: Continuous Knowledge Sharing by Examples.* Neuri Limited, 2019.
- Lisa Crispin, Janet Gregory. *Agile Testing: A Practical Guide for Testers and Agile Teams.* Pearson, 2nd edition, 2014.
- Jez Humble, David Farley. *Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation.* Pearson, 2010.
- Specmatic documentation: https://specmatic.io/
- OpenAPI 3.0 specification: https://spec.openapis.org/oas/v3.0.3
- AsyncAPI 2.6 specification: https://www.asyncapi.com/docs/specifications/v2.6.0
