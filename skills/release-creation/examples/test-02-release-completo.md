# Test Case 02 — Release completo (todas las secciones opcionales respondidas)

**Descripción:** El usuario invoca el skill sin `--quick` y responde "sí" a todas las secciones opcionales. El archivo final incluye todas las secciones del template.

---

## Input del usuario

```
/release-creation Sistema de pagos
```

---

## Flujo esperado

### Fase 0 — Modo de ejecución
- No se detecta `--quick` → `QUICK_MODE=false`
- Nombre del release provisto en el input: `"Sistema de pagos"`
- Slug derivado: `sistema-de-pagos`
- Identificador sugerido: `EPIC-02` (asumiendo que EPIC-01 ya existe)
- Usuario acepta
- Ruta de salida: `$SPECS_BASE/specs/releases/EPIC-02-sistema-de-pagos/release.md`
- El directorio no existe → continuar

### Fase 1 — Leer template
- Se lee `$SPECS_BASE/specs/templates/release-spec-template.md`
- Secciones obligatorias: `Descripción`, `Features`, `Flujos Críticos / Smoke Tests`
- Secciones opcionales: `Requerimiento`, `Impacto en Procesos Claves`, `Dependencias Críticas`, `Riesgos`, `Criterios de éxito`, `Notas adicionales`

### Fase 2 — Frontmatter
| Campo | Valor ingresado |
|---|---|
| title | "Sistema de pagos" (aceptado) |
| date | 2026-05-15 (usuario modifica la fecha sugerida) |
| status | BACKLOG (default aceptado) |
| substatus | IN‑PROGRESS (default aceptado) |
| slug | `sistema-de-pagos` (confirmado) |

### Fase 3 — Secciones obligatorias
- **Descripción:** "Integra la pasarela de pagos para permitir que usuarios realicen compras con tarjeta de crédito/débito. Resuelve la falta de monetización directa en la plataforma."
- **Features:**
  - `FEAT-001 - Pago con tarjeta: Procesar pagos con tarjeta Visa/Mastercard vía Stripe`
  - `FEAT-002 - Historial de transacciones: Ver pagos realizados con fecha, monto y estado`
  - `FEAT-003 - Reembolsos: Solicitar devolución de pago dentro de 30 días`
- **Flujos Críticos / Smoke Tests:**
  - Escenario 1: Pago exitoso — DADO usuario con tarjeta válida / CUANDO realiza pago / ENTONCES transacción aprobada y saldo debitado
  - Escenario 2: Pago rechazado — DADO usuario con fondos insuficientes / CUANDO intenta pagar / ENTONCES transacción rechazada sin cargo

### Fase 4 — Secciones opcionales (usuario responde "sí" a todas)

**Requerimiento:** "Las transacciones deben cumplir PCI DSS nivel 1. No almacenar datos de tarjeta en los servidores propios."

**Impacto en Procesos Claves:**
- Proceso de ventas: Habilita ventas directas en plataforma sin redirección a terceros
- Proceso de soporte: Agrega flujo de gestión de disputas y reembolsos
- Proceso contable: Requiere reconciliación automática con Stripe Dashboard

**Dependencias Críticas:**
- Integración con API de Stripe — Dueño: equipo backend — Fecha compromiso: 2026-05-10
- Certificación PCI DSS — Dueño: equipo de seguridad — Fecha compromiso: 2026-05-12

**Riesgos:**
- Riesgo: Rechazo de transacciones por proveedor antifraude — Mitigación: Testear con tarjetas de prueba y revisar reglas de Stripe Radar antes del lanzamiento
- Riesgo: Fallo en webhook de confirmación — Mitigación: Implementar sistema de reintentos con idempotencia

**Criterios de éxito:**
- [ ] Tasa de aprobación de pagos ≥ 95% en las primeras 48 horas
- [ ] Tiempo de procesamiento < 3 segundos por transacción
- [ ] Cero incidentes de seguridad en primer mes

**Notas adicionales:** "Coordinar con marketing para comunicado de lanzamiento de la funcionalidad de pagos."

### Fase 5 — Archivo generado
```
docs/specs/releases/EPIC-02-sistema-de-pagos/release.md
```
(Contiene todas las secciones del template)

### Fase 6 — Validación
- `release-format-validation` retorna **APROBADO**

---

## Criterios de éxito del test

- [ ] El skill preguntó por cada sección opcional individualmente
- [ ] El archivo generado contiene frontmatter completo
- [ ] El archivo contiene las 3 secciones obligatorias con contenido
- [ ] El archivo contiene las 6 secciones opcionales con contenido respondido
- [ ] `release-format-validation` retorna APROBADO sin refinamiento
