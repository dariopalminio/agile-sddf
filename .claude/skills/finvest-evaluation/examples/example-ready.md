# Ejemplo: Decisión Ready

## Historia evaluada

---

## 📖 Historia

**Como** usuario registrado que olvidó su contraseña
**Quiero** recibir un enlace de recuperación a mi email
**Para** poder acceder a mi cuenta sin contactar a soporte

## ✅ Criterios de aceptación

### Escenario principal – Recuperación exitosa
```gherkin
Dado que soy un usuario registrado con email "juan@example.com"
Cuando solicito recuperar mi contraseña
Entonces recibo un email con un enlace único de recuperación
  Y el enlace expira en exactamente 1 hora
```

### Escenario alternativo / error – Email no registrado
```gherkin
Dado que solicito recuperación con email "invalido@example.com"
Cuando el sistema verifica el email
Entonces veo el mensaje "No encontramos una cuenta con ese email"
  Pero no se envía ningún email
```

### Escenario alternativo / error – Enlace expirado
```gherkin
Dado que solicité recuperación hace 2 horas
Cuando intento usar el enlace de recuperación
Entonces veo "El enlace ha expirado. Solicita uno nuevo"
  Y el enlace queda invalidado permanentemente
```

## ⚙️ Criterios no funcionales

* Seguridad: el enlace solo puede usarse una vez; se invalida tras el primer uso o expiración
* UX: se muestra mensaje de confirmación de envío inmediatamente tras la solicitud

## 📎 Notas / contexto adicional

Flujo de recuperación vía email. SMS queda fuera de scope de esta historia.

---

## Evaluación FINVEST

### Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Sección `## 📖 Historia` con `Como/Quiero/Para` | 5 | Sección presente; rol real, acción concreta, beneficio medible |
| Sección `## ✅ Criterios de aceptación` con escenarios nombrados | 5 | Sección presente; escenario principal + 2 alternativos nombrados como `###` |
| Gherkin en bloques ` ```gherkin ` | 5 | 3 bloques gherkin con Dado/Cuando/Entonces/Y/Pero; cobertura de happy path + errores |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 2.0 + 1.5 + 1.5 = 5.0 / 5.0**

✅ F_score = 5.0 ≥ 2.5 — Continúa a evaluación INVEST

### Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Requiere servicio de email (mockeable con stub) y módulo de usuarios (preexistente); sin bloqueos reales |
| **N** – Negociable | 4 | Define outcomes, no implementación; negocia: tiempo de expiración, canal (SMS en notas = fuera de scope), flujo UI |
| **V** – Valiosa | 4 | Valor claro y cualitativamente medible: reducción de tickets de soporte por contraseña olvidada |
| **E** – Estimable | 4 | Flujo estándar de password reset; cualquier equipo con experiencia en auth lo estima con confianza |
| **S** – Small | 3 | 3 escenarios Gherkin + criterios no funcionales; complejidad media ideal (token + email + expiración + UI) |
| **T** – Testeable | 5 | Gherkin con `Y` y `Pero`; condición "expira en exactamente 1 hora" y "uso único" son directamente automatizables |

**INVEST_Score = (4 + 4 + 4 + 4 + 3 + 5) / 6 = 24 / 6 = 4.0 / 5.0**

### Resultado Final

**F – Formato:** 5.0 / 5.0
**I – Independencia:** 4 / 5
**N – Negociable:** 4 / 5
**V – Valiosa:** 4 / 5
**E – Estimable:** 4 / 5
**S – Small:** 3 / 5
**T – Testeable:** 5 / 5

**FINVEST Score:** (5.0 + 4.0) / 2 = **4.5 / 5.0**
**FINVEST Decisión:** ✅ **Ready**

### Comentarios y Recomendaciones

- **S – Small (3):** Tamaño ideal. Si el equipo es nuevo en auth, separar en "Solicitar enlace de recuperación" y "Procesar uso del enlace" para reducir riesgo de integración.
- **V – Valiosa (4):** Sugerencia opcional: conectar a métrica cuantitativa (ej. "reducir tickets de soporte en 30%") para subir a 5.
- Sin dimensiones críticas. Lista para sprint.
