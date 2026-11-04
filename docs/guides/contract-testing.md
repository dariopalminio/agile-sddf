---
type: guide
slug: contract-testing
title: "Guía Ejecutiva: Contract Testing y Contratos Centralizados"
date: 2026-11-03
parent: null
---

# Guía Ejecutiva: Contract Testing y Contratos Centralizados

> **Referencia:** [ADR-0020](../adr/ADR-0020-contratos-centralizados-para-spec-living.md) | [sdd-with-bcdd.md](sdd-with-bcdd.md)
>
> Qué es Contract Testing, cómo organizar contratos centralizados en `specs/living/contracts/`, y el flujo de validación en CI/CD.

---

## ¿Qué es Contract Testing?

**Contract Testing** valida automáticamente que productores (APIs, servicios) y consumidores (clientes, gateways) respetan un contrato compartido (especificación de interfaz).

### Por qué centralizar contratos

| Problema | Solución BCDD |
|----------|---|
| N productores × M consumidores = N×M tests (caro, lento) | Contract SSOT: N + M tests |
| Contratos dispersos en múltiples repos (divergencia) | Único `specs-repo/specs/living/contracts/` |
| Cambios de API sorpresa en producción | Validación automática en cada PR |
| Documentación desincronizada del código | Especificación ejecutable y sincronizada |

---

## Estructura: Dónde Viven los Contratos

```
specs-repo/
└── specs/living/
    ├── features/          # Escenarios Gherkin (BDD)
    └── contracts/         # SSOT: Contratos ejecutables
        ├── openapi/       # REST: orders-api.yaml, payments-api.yaml
        └── asyncapi/      # Eventos: order-events.yaml, payment-events.yaml
```

**Cada repositorio (productor o consumidor)** apunta a esta SSOT central:
- Productor valida: su implementación cumple el contrato OpenAPI/AsyncAPI
- Consumidor valida: su consumo es compatible con el contrato

---

## Escribir Contratos: Conceptos Clave

### OpenAPI (REST / HTTP síncrono)

Usa `docs/templates/openapi-contract-template.yaml` como base. Define:

- **Metadatos:** título, versión, descripción, equipo propietario
- **Servidores:** producción, staging, local
- **Paths (endpoints):** GET /orders, POST /orders/{id}, etc.
- **Parámetros:** path, query, headers
- **RequestBody:** estructura esperada
- **Responses:** status codes y schemas por estado
- **Esquemas compartidos:** tipos reutilizables

**Principios:**
- Usa referencias (`$ref`) para evitar duplicación
- Documenta cada campo (description)
- Marca campos obligatorios (`required: [...]`)
- Define enumeraciones explícitas (`enum: [ACTIVE, INACTIVE]`)

### AsyncAPI (Eventos / Kafka, SQS, etc.)

Usa `docs/templates/asyncapi-contract-template.yaml` como base. Define:

- **Metadatos:** título, versión, descripción
- **Servidores (brokers):** Kafka production, staging, local
- **Canales (topics):** `order.created`, `order.shipped`, etc.
- **Mensajes:** estructura del evento
- **Esquemas:** tipos en el payload

**Patrón estándar de evento:**
```
eventId              → deduplicación (UUID)
eventType            → qué sucedió
eventVersion         → versionado del schema
timestamp            → cuándo
aggregateId          → qué cambió (ID orden, usuario, etc.)
aggregateType        → tipo de recurso
aggregateVersion     → contador de cambios
data                 → campos específicos que cambiaron
causation (opcional) → qué lo causó
metadata (opcional)  → dominio, sistema, ambiente
```

---

## Validación de Contratos

### Antes de mergear una PR en `specs-repo/`

| Aspecto | Herramienta | Objetivo |
|---------|---|---|
| **Sintaxis OpenAPI** | `@openapitools/openapi-generator-cli` | ¿Válido según spec OpenAPI 3.0.3? |
| **Sintaxis AsyncAPI** | `@asyncapi/cli` | ¿Válido según spec AsyncAPI 2.6.0? |
| **Breaking changes** | `@specmatic/specmatic check-backwards-compatibility` | ¿Cambio MAJOR que afecta consumidores? |
| **Estilos** | `@stoplight/spectral` | ¿Sigue convenciones del proyecto? |

**Resultado esperado:** ✅ PASS en todos → OK para mergear

### En repositorios productores y consumidores

| Rol | Flujo | Herramienta |
|---|---|---|
| **Productor** | Levanta servicio local → valida contra contrato | `@specmatic/specmatic test` |
| **Consumidor** | Genera stubs → valida consumo contra stubs | `@specmatic/specmatic stub` + tests |

**Resultado esperado:** ✅ PASS en ambos → cambio sincronizado

---

## Flujo de Validación End-to-End

```
1. Engineer cambia contrato en specs-repo (ej. versión 1.1.0)
   ↓
2. CI valida sintaxis + backward compatibility
   ✅ PASS → crea PR
   
3. PR comentario automático: "Breaking change? Afecta a [teams]"
   
4. Engineer revisa y mergea
   ↓
5. orders-service CI: levanta servicio, ejecuta "contract test"
   ✅ PASS → merge autorizado
   
6. web-gateway CI: genera stubs, ejecuta tests de consumo
   ✅ PASS → merge autorizado
   
7. mobile-app CI: mismo proceso
   ✅ PASS → merge autorizado
   
Resultado: Tres equipos, cambios coordinados, cero sorpresas
```

---

## Versionado Semántico de Contratos

Usa `info.version` siguiendo semántico: MAJOR.MINOR.PATCH

| Cambio | Ejemplo | Impacto |
|--------|---------|--------|
| **PATCH** (1.0.0 → 1.0.1) | Docstring, reordenamiento, comentarios | ✅ Compatible |
| **MINOR** (1.0.0 → 1.1.0) | Campo opcional nuevo, nuevo endpoint, extensión de enum | ✅ Compatible |
| **MAJOR** (1.0.0 → 2.0.0) | Eliminar campo obligatorio, cambiar tipo, remover endpoint | 🚨 Requiere coordinación |

**Regla:** Si no sabes qué tipo de cambio es, pregunta: "¿Mi consumidor viejo seguiría funcionando?" 
- Si es NO → es MAJOR

---

## Cambiar un Contrato: Checklist

1. **Valida sintaxis** antes de PR (OpenAPI o AsyncAPI)
2. **Detecta breaking changes** con herramienta automática
3. Si es MAJOR: **comunica a equipos afectados con anticipación**
4. **Documenta el cambio** en campo `description` del `info`
5. **Actualiza version** en `info.version` con semántico
6. **Mergea** cuando productores y consumidores estén listos
7. **Monitorea** que los CI/CD de los afectados pasen

---

## Casos de Uso Comunes

### Agregar campo opcional a respuesta (MINOR)

```
Cambio:    Agregar "discount" a Order response
Impacto:   Consumidores viejos ignoran el nuevo campo (opcional)
Acción:    Version 1.0.0 → 1.1.0, sin coordinación urgente
```

### Eliminar campo obligatorio (MAJOR)

```
Cambio:    Eliminar "total" de Order (cliente calcula ahora)
Impacto:   Consumidores viejos fallan (esperaban "total")
Acción:    Comunicar a todos → coordinación de merge
Versión:   1.0.0 → 2.0.0
```

### Cambiar tipo de dato (MAJOR)

```
Cambio:    Cambiar "price: number" a "price: string" (decimal)
Impacto:   Consumidores fallan (esperaban número)
Acción:    Coordinación requerida
```

### Agregar nuevo endpoint (MINOR)

```
Cambio:    POST /orders/{id}/refund nuevo
Impacto:   Consumidores viejos no lo usan, está OK
Acción:    Version 1.0.0 → 1.1.0
```

---

## Herramientas del Ecosistema

| Herramienta | Función |
|---|---|
| **Specmatic** | Contract testing para REST y Kafka; genera stubs |
| **Pact** | Consumer-driven contracts; testing bilateral |
| **OpenAPI Generator** | Valida y genera clientes/servidores desde OpenAPI |
| **AsyncAPI CLI** | Valida y procesa AsyncAPI |
| **Spectral** | Linting de estilos y convenciones en OpenAPI |
| **Prism** | Mock server desde OpenAPI (desarrollo aislado) |
| **OpenAPI-diff** | Detecta cambios entre versiones de contrato |

---

## Integración con agile-sddf

### En `specs-repo/` (este proyecto)

- **Estructura:** `specs/living/contracts/{openapi,asyncapi}/`
- **Validación en CI/CD:** linting + backward compatibility check (setup en `.github/workflows/`)
- **Plantillas reutilizables:** `docs/templates/openapi-contract-template.yaml`, `docs/templates/asyncapi-contract-template.yaml`
- **Documentación:** [ADR-0020](../adr/ADR-0020-contratos-centralizados-para-spec-living.md), [ADR-0018](../adr/ADR-0018-adoptar-cucumber-para-specs-living.md)

### En cada `producer-repo` y `consumer-repo`

- Descargar contrato central (tag/commit fijo)
- Crear `specmatic.json` que apunta a la SSOT
- Agregar paso en CI/CD que ejecuta contract test
- Bloquear merge si contract test falla

---

## Antipatrones a Evitar

| ❌ Antipatrón | ✅ Solución |
|---|---|
| Specs sin ejecutar en CI/CD | Integrar validación automática en cada PR |
| Múltiples versiones del mismo contrato | Una versión en `specs-repo/`, pineable por tag |
| Cambios MAJOR sin comunicar a consumidores | Detección automática + comunicación en PR |
| Mezclar contratos de UI con dominio | Specs agnósticas; UI en repos de frontend |
| Campos sin descripción | Documentar cada campo, para qué sirve |
| Sin versionado de eventos | Siempre incluir eventVersion en AsyncAPI |

---

## FAQ

**P: ¿Qué pasa si hago un cambio MAJOR accidentalmente?**  
R: La herramienta de backward compatibility lo detecta en la PR. Reviertes, lo haces MINOR o PATCH, y lo mergeas de nuevo.

**P: ¿Puedo tener múltiples versiones activas del mismo contrato?**  
R: No recomendado. En su lugar, diseña APIs tolerantes a cambios (campos opcionales nuevos, parámetros abiertos). Si realmente necesitas v1 y v2, usa URLs diferentes: `/v1/orders` vs `/v2/orders`.

**P: ¿El contrato es suficiente para garantizar compatibilidad?**  
R: No. El contrato valida *sintaxis* (formato de datos, códigos HTTP). No valida *semántica* (lógica correcta). Complementa con integration tests en staging.

**P: ¿Qué pasa si un consumidor queda out-of-sync con el contrato?**  
R: Su CI/CD falla cuando intenta consumir una versión vieja del contrato. Actualiza pinning del contrato en su `specmatic.json` y ejecuta contract tests nuevamente.

---

## Lectura Recomendada

- Gojko Adzic — *Living Documentation: Continuous Knowledge Sharing by Examples*
- Specmatic documentation — https://specmatic.io/
- OpenAPI 3.0 specification — https://spec.openapis.org/oas/v3.0.3
- AsyncAPI 2.6 specification — https://www.asyncapi.com/docs/specifications/v2.6.0
- Sam Newman — *Building Microservices* (Capítulo: Consumer-Driven Contracts)
