---
type: guide
slug: sdd-with-bcdd
title: "SDD con Behavior & Contract-Driven Development (BCDD)"
date: 2026-11-03
parent: null
---

# SDD con Behavior & Contract-Driven Development (BCDD)

> **Referencia:** [ADR-0020](../adr/ADR-0020-contratos-centralizados-para-spec-living.md) | [ADR-0018](../adr/ADR-0018-adoptar-cucumber-para-specs-living.md)
>
> Guía arquitectónica: cómo integrar Spec-Driven Development, Behavior-Driven Development y Contract Testing como un sistema holístico de especificaciones vivas ejecutables.

---

## El Paradigma BCDD: ¿Qué es?

**Behavior & Contract-Driven Development (BCDD)** integra tres disciplinas formalmente:

1. **SDD:** software guiado por especificaciones ejecutables
2. **BDD:** comportamiento expresado en Gherkin (Specification by Example)
3. **Contract Testing:** validación automática de que productores y consumidores respetan contratos centralizados

Resultado: **Arquitectura de Especificaciones Vivas (Living Documentation & Executable Specifications Architecture)**, donde requisitos de negocio y contratos técnicos dejan de ser documentación estática para convertirse en la **única fuente de verdad ejecutable (SSOT)** que valida continuamente el software en CI/CD.

### El Problema que Resuelve

**Arquitectura tradicional (sin BCDD):**
- Documentación estática (requirements.doc, design.pdf)
- Specs desincronizadas (api-spec.yaml v1.2 vs v1.5 en prod)
- Tests cubren solo casos "felices"
- Resultado: Broken implementations en sorpresa

**Con BCDD:**
- Especificaciones ejecutables centralizadas (Gherkin + OpenAPI/AsyncAPI)
- Validación continua en CI/CD
- Productores y consumidores validados automáticamente
- Resultado: specs = código (sincronizados siempre)

---

## Estructura: Dónde Viven las Especificaciones

```
specs-repo/ (SSOT - Fuente de Verdad Central)

├── .github/workflows/
│   ├── contract-linting.yml
│   ├── backward-compatibility.yml
│   └── feature-linting.yml
│
└── specs/living/
    ├── features/           # Gherkin: comportamiento de negocio
    │   ├── orders/
    │   ├── payments/
    │   └── fulfillment/
    │
    ├── contracts/          # SSOT: Contratos técnicos ejecutables
    │   ├── openapi/        # REST/HTTP: orders-api.yaml, payments-api.yaml
    │   └── asyncapi/       # Eventos: order-events.yaml, payment-events.yaml
    │
    └── step-definitions/   # Implementación de pasos Gherkin
```

**Cada repositorio (productor o consumidor)** apunta a esta SSOT central con version fija (tag/commit).

---

## Dos Capas Complementarias de Especificación Viva

### Capa 1: Técnica-Sintáctica (OpenAPI/AsyncAPI)

**Protege:** protocolos y esquemas de datos

**Valida:**
- Formato de requests/responses
- Tipos de datos
- Campos requeridos vs opcionales
- Códigos HTTP esperados
- Paginación, errores estándares

**Herramientas:** Specmatic, Pact, OpenAPI Generator

### Capa 2: Funcional-Semántica (Gherkin / .feature)

**Protege:** reglas del negocio

**Valida:**
- Reglas de descuento, políticas de negocio
- Validaciones de datos
- Efectos secundarios (inventario, eventos)
- Casos límite y flujos de error

**Herramientas:** Cucumber, Specmatic, BDD runners

---

## La Sinergia: Flujo CI/CD

```
1. specs-repo: cambio en contrato o feature
   ↓
   CI: linting + backward compatibility check

2. orders-service (Productor)
   CI: unit tests → contract test → feature test
   ✅ PASS → merge

3. web-gateway (Consumidor)
   CI: unit tests → contract test (contra stubs) → feature test
   ✅ PASS → merge

Resultado: Cambios coordinados, cero sorpresas
```

### Evolución Segura de Contrato (Versionado Semántico)

```
1.0.0: spec { customerId, items[], total }

         ↓ MINOR
         
1.1.0: spec { customerId, items[], total, discount? }
       ✅ Consumidores viejos ignoran discount (opcional)

         ↓ MAJOR
         
2.0.0: spec { customerId, items[], discount? }  # "total" eliminado
       ⚠️ Consumidores viejos fallan
       ⚠️ Requiere coordinación
```

---

## Restricción Crítica: Agnóstico a UI

### ✅ Qué SÍ va en `specs/living/`

- Contratos REST (OpenAPI): endpoints, esquemas, códigos HTTP
- Contratos de eventos (AsyncAPI): tópicos, mensajes
- Reglas de negocio (Gherkin): descuentos, validaciones, políticas
- Step definitions: implementación de pasos

### ❌ Qué NO va en `specs/living/`

- Flujos de navegación UI ("haz clic en...")
- Layouts de pantalla, posiciones de elementos
- Interacciones de frontend (drag-drop, animations)
- Mocks de diseño, links a Figma/Storybook

**Rationale:** UI es acoplada a tecnología y varía por plataforma. Aislándola evitas contaminar la SSOT con detalles efímeros.

**Ubicación correcta de UI specs:** `web-frontend-repo/tests/e2e/` + `web-frontend-repo/stories/`

---

## Implementación: Roadmap de Adopción

### Fase 0: Estado Actual (Tradicional)

```
orders-service/               web-gateway/
  ├── tests/unit/              ├── tests/unit/
  ├── tests/integration/       ├── tests/e2e/
  └── (contra BD real)         └── (contra servidor real)
```

Problema: fuerte acoplamiento, tests lentos, cambios frágiles

### Fase 1: Introducir Contract Testing

```
specs-repo/specs/living/contracts/openapi/orders-api.yaml  ← NUEVA SSOT

orders-service/                web-gateway/
  ├── tests/unit/              ├── tests/unit/
  ├── tests/integration/       ├── tests/contract/
  ├── tests/contract/          ├── specmatic.json
  └── specmatic.json           └── (consume stubs)
```

### Fase 2: Integrar Gherkin (BCDD Completo)

```
specs-repo/specs/living/
  ├── features/orders/*.feature
  ├── contracts/openapi/
  └── contracts/asyncapi/

orders-service/               web-gateway/
  └── tests/contract/         └── tests/contract/
      (ejecuta features         (ejecuta features
       + contratos)             + contratos)
```

### Fase 3: Madurez Total

✅ Specs ejecutables y centralizadas
✅ Validación automática en CI/CD
✅ Cambios coordinados entre equipos
✅ Cero surpresas en producción
✅ Documentación siempre sincronizada

---

## Nivel 4 de Madurez de QA

Esta arquitectura posiciona equipos en **Nivel 4 (Adaptive):**

| Nivel | Característica | Con BCDD |
|-------|---|---|
| 1 | Testing reactivo, manual | ❌ |
| 2 | Plan de testing, automatización básica | ❌ |
| 3 | Métricas, testing integrado | ⚠️ Parcial |
| **4** | **Specs = código, validación continua, cambios seguros** | ✅ **SÍ** |
| 5 | Optimización automática continua | ✅ Camino claro |

**Indicadores de Nivel 4 con BCDD:**
- ✅ Especificaciones ejecutables (Gherkin + OpenAPI/AsyncAPI)
- ✅ Validación automática en cada PR
- ✅ Breaking change detection integrado
- ✅ Equipos independientes validando en paralelo
- ✅ Cero surpresas en producción

---

## Casos de Uso Comunes

### Agregar campo opcional (MINOR)

```
Cambio: Agregar "discount" a Order response
Impacto: Consumidores viejos ignoran (opcional)
Acción: Version 1.0.0 → 1.1.0, sin urgencia
```

### Eliminar campo obligatorio (MAJOR)

```
Cambio: Eliminar "total" de Order
Impacto: Consumidores fallan
Acción: Coordinación requerida → 1.0.0 → 2.0.0
```

### Cambiar tipo de dato (MAJOR)

```
Cambio: "price: number" → "price: string"
Impacto: Consumidores fallan
Acción: Coordinación requerida
```

### Agregar nuevo endpoint (MINOR)

```
Cambio: POST /orders/{id}/refund nuevo
Impacto: Consumidores viejos OK (no lo usan)
Acción: Version 1.0.0 → 1.1.0
```

---

## Herramientas del Ecosistema

| Herramienta | Función |
|---|---|
| **Specmatic** | Contract testing REST & Kafka; genera stubs |
| **Pact** | Consumer-driven contracts; testing bilateral |
| **Cucumber** | Ejecutar escenarios Gherkin |
| **OpenAPI Generator** | Validar + generar código desde OpenAPI |
| **AsyncAPI CLI** | Validar + procesar AsyncAPI |
| **Spectral** | Linting de estilos OpenAPI |
| **Prism** | Mock server desde OpenAPI |
| **OpenAPI-diff** | Detectar cambios entre versiones |

---

## Integración con agile-sddf

### En `specs-repo/` (este proyecto)

- **Estructura:** `specs/living/contracts/{openapi,asyncapi}/`
- **Validación CI/CD:** linting + backward compatibility (`.github/workflows/`)
- **Plantillas:** `docs/templates/openapi-contract-template.yaml`, `asyncapi-contract-template.yaml`
- **Documentación:** [ADR-0020](../adr/ADR-0020-contratos-centralizados-para-spec-living.md), [contract-testing.md](contract-testing.md)

### En cada `producer-repo` y `consumer-repo`

- Descargar contrato central (tag/commit fijo)
- Crear `specmatic.json` que apunta a SSOT
- Agregar step en CI/CD: contract test
- Bloquear merge si falla

---

## Antipatrones a Evitar

| ❌ Antipatrón | ✅ Solución |
|---|---|
| Specs sin ejecutar en CI/CD | Validación automática en cada PR |
| Múltiples versiones del mismo contrato | Una versión en `specs-repo/`, pineable por tag |
| Cambios MAJOR sin comunicar | Detección automática + comunicación en PR |
| Mezclar UI con dominio | Agnóstico a presentación; UI en repos frontend |
| Campos sin descripción | Documentar cada campo |
| Sin versionado de eventos | Siempre incluir eventVersion en AsyncAPI |

---

## FAQ

**P: ¿Qué pasa si hago un cambio MAJOR accidentalmente?**  
R: Backward compatibility tool lo detecta en PR. Reviertes, lo haces MINOR/PATCH, y lo mergeas de nuevo.

**P: ¿Puedo tener múltiples versiones activas?**  
R: No recomendado. Diseña APIs tolerantes a cambios. Si necesitas v1 y v2, usa URLs diferentes: `/v1/orders` vs `/v2/orders`.

**P: ¿El contrato garantiza compatibilidad total?**  
R: No. Valida *sintaxis* (formato, códigos HTTP). No valida *semántica* (lógica). Complementa con integration tests en staging.

**P: ¿Qué pasa si un consumidor queda out-of-sync?**  
R: Su CI/CD falla. Actualiza pinning en `specmatic.json` y ejecuta contract tests de nuevo.

---

## Lectura Recomendada

- Gojko Adzic — *Living Documentation: Continuous Knowledge Sharing by Examples*
- Lisa Crispin, Janet Gregory — *Agile Testing: A Practical Guide*
- Jez Humble, David Farley — *Continuous Delivery: Reliable Software Releases*
- Sam Newman — *Building Microservices* (Capítulo: Consumer-Driven Contracts)
- Specmatic — https://specmatic.io/
- OpenAPI 3.0 — https://spec.openapis.org/oas/v3.0.3
- AsyncAPI 2.6 — https://www.asyncapi.com/docs/specifications/v2.6.0
