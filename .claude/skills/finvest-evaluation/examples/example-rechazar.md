# Ejemplo: Decisión Rechazar

Dos sub-casos: (A) rechazado por formato insuficiente (sin template), (B) rechazado por dimensiones INVEST críticas (con template correcto).

---

## Caso A — Rechazar por formato insuficiente (F_score < 2.5)

### Historia evaluada

> Como usuario
> Quiero login
> Para entrar
>
> Criterios de aceptación:
> - Que funcione bien
>
> Escenario: login
>   Dado que tengo usuario
>   Cuando pongo password
>   Entonces entro

### Evaluación

#### Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Sección `## 📖 Historia` con `Como/Quiero/Para` | 1 | Sin sección `## 📖 Historia`; cláusulas presentes pero semánticamente vacías: "Quiero login" no es un deseo, "Para entrar" no expresa valor |
| Sección `## ✅ Criterios de aceptación` con escenarios nombrados | 1 | Sin sección ni estructura; "Que funcione bien" es completamente inchequeable |
| Gherkin en bloques ` ```gherkin ` | 1 | Gherkin fuera de bloque de código; sin condiciones reales: "Dado que tengo usuario" no define estado, "Entonces entro" no define resultado observable |

**F_score = (1 × 0.4) + (1 × 0.3) + (1 × 0.3) = 0.4 + 0.3 + 0.3 = 1.0 / 5.0**

❌ F_score = 1.0 < 2.5 — **RECHAZADA. No se evalúa INVEST.**

#### Resultado Final

**F – Formato:** 1.0 / 5.0
**I – Independencia:** — (no evaluado)
**N – Negociable:** — (no evaluado)
**V – Valiosa:** — (no evaluado)
**E – Estimable:** — (no evaluado)
**S – Small:** — (no evaluado)
**T – Testeable:** — (no evaluado)

**FINVEST Score:** N/A
**FINVEST Decisión:** 🔴 **Rechazar — Formato insuficiente**

#### Comentarios y Recomendaciones

La historia no cumple el formato mínimo. Reescribir usando el template `story-gherkin-template.md`:

```markdown
## 📖 Historia
**Como** usuario registrado con cuenta activa
**Quiero** autenticarme con mi email y contraseña
**Para** acceder a mi cuenta de forma segura

## ✅ Criterios de aceptación

### Escenario principal – Autenticación exitosa
```gherkin
Dado que tengo email "juan@example.com" y contraseña "Pass123!"
Cuando intento iniciar sesión
Entonces accedo a mi dashboard personal
```

### Escenario alternativo / error – Contraseña incorrecta
```gherkin
Dado que ingreso una contraseña incorrecta
Cuando intento iniciar sesión
Entonces veo "Credenciales inválidas. Intenta de nuevo"
  Pero permanezco en la pantalla de login
```
```

---

## Caso B — Rechazar por dimensiones INVEST críticas (F correcto, INVEST fallido)

### Historia evaluada

---

## 📖 Historia

**Como** gerente de producto
**Quiero** migrar toda la plataforma a microservicios
**Para** mejorar la escalabilidad del sistema

## ✅ Criterios de aceptación

### Escenario principal – Módulo de usuarios migrado
```gherkin
Dado que el módulo de usuarios es un microservicio independiente
Cuando llamo al endpoint /api/users
Entonces recibo la lista de usuarios con tiempo de respuesta < 200ms
```

### Escenario alternativo / error – Módulo de pagos migrado
```gherkin
Dado que el módulo de pagos es un microservicio
Cuando proceso un pago
Entonces el microservicio de pagos responde con código 200
  Y el evento se emite al bus de mensajes
```

### Escenario con datos (Scenario Outline) – Módulos migrados
```gherkin
Escenario: Módulo migrado y operativo
  Dado que el módulo "<modulo>" está desplegado como microservicio
  Cuando llamo a su endpoint principal
  Entonces responde en < 200ms con código 200
Ejemplos:
  | modulo    |
  | usuarios  |
  | pagos     |
  | inventario|
  | reportes  |
  | notif     |
  | auth      |
```

## ⚙️ Criterios no funcionales

* Rendimiento: cada microservicio responde en < 200ms bajo carga normal
* Seguridad: comunicación interna vía mTLS

---

### Evaluación

#### Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Sección `## 📖 Historia` con `Como/Quiero/Para` | 4 | Sección presente; `Para mejorar la escalabilidad` es débil sin métrica concreta |
| Sección `## ✅ Criterios de aceptación` con escenarios nombrados | 5 | Sección presente; escenario principal + alternativo + Scenario Outline con nombres claros |
| Gherkin en bloques ` ```gherkin ` | 5 | 3 bloques gherkin; Scenario Outline con tabla de 6 filas de Ejemplos; `Y` presente |

**F_score = (4 × 0.4) + (5 × 0.3) + (5 × 0.3) = 1.6 + 1.5 + 1.5 = 4.6 / 5.0**

✅ F_score = 4.6 ≥ 2.5 — Continúa a evaluación INVEST

#### Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | ⚠️ 1 | Dependencia crítica de todos los módulos entre sí; afecta toda la plataforma en producción |
| **N** – Negociable | 2 | La solución técnica (microservicios) está pre-decidida; no deja espacio para explorar alternativas |
| **V** – Valiosa | 3 | Valor real pero indirecto; "escalabilidad" sin métrica de negocio concreta |
| **E** – Estimable | ⚠️ 1 | Imposible de estimar: alcance desconocido, tecnología de orquestación no decidida, número de módulos indefinido |
| **S** – Small | ⚠️ 1 | Épica: 6 filas en Ejemplos + múltiples módulos = ≥6 escenarios efectivos |
| **T** – Testeable | 2 | Scenario Outline con datos concretos es un punto positivo, pero requiere infraestructura completa para validar |

**INVEST_Score = (1 + 2 + 3 + 1 + 1 + 2) / 6 = 10 / 6 = 1.67 / 5.0**

#### Resultado Final

**F – Formato:** 4.6 / 5.0
**I – Independencia:** 1 / 5 ⚠️ CRÍTICO
**N – Negociable:** 2 / 5
**V – Valiosa:** 3 / 5
**E – Estimable:** 1 / 5 ⚠️ CRÍTICO
**S – Small:** 1 / 5 ⚠️ CRÍTICO
**T – Testeable:** 2 / 5

**FINVEST Score:** (4.6 + 1.67) / 2 = **3.1 / 5.0** (pero 3 dimensiones con score = 1 → veto automático)
**FINVEST Decisión:** 🔴 **Rechazar — Dimensiones críticas (I, E, S = 1)**

#### Comentarios y Recomendaciones

- **I – Independencia (1):** Esta historia es una épica sistémica. Convertirla en épica y dividir en historias por módulo (ej. "Migrar módulo de usuarios a microservicio").
- **E – Estimable (1):** Crear spike técnico de 1–2 sprints para definir tecnología de contenedores, estrategia de datos y patrones de comunicación antes de cualquier historia de migración.
- **S – Small (1):** El Scenario Outline con 6 módulos revela el alcance épico. Cada módulo = una historia independiente.
- **N – Negociable (2):** Describir el problema, no la solución: "el módulo de pagos cae bajo carga de Black Friday" en lugar de prescribir microservicios.
- **V – Valiosa (3):** Conectar a métrica concreta: "reducir downtime de pagos de 2% a < 0.1% en picos".
- **Acción:** Convertir en épica → Spike técnico → Dividir en historias por módulo.
