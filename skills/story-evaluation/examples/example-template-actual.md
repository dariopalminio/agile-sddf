# Ejemplo: veredicto APPROVED con la estructura del template actual

Misma historia que `example-ready.md`, escrita con la estructura del template actual: el par `# 📖 Historia:` + `## Narrativa`, `## ✅ Criterios de aceptación (escenarios Gherkin)` con títulos `### AC-<n> - …`, `## Reglas` trazadas a los AC y `## 🔗 Notas adicionales`. Fija que los componentes 1 y 2 de la rúbrica F la puntúan igual que a la forma anterior.

## Historia evaluada

---

# 📖 Historia: Recuperar la contraseña por email

## Narrativa
**Como** usuario registrado que olvidó su contraseña
**Quiero** recibir un enlace de recuperación a mi email
**Para** poder acceder a mi cuenta sin contactar a soporte

## ✅ Criterios de aceptación (escenarios Gherkin)

### AC-1 - Escenario principal – Recuperación exitosa
```gherkin
Dado que soy un usuario registrado con email "juan@example.com"
Cuando solicito recuperar mi contraseña
Entonces recibo un email con un enlace único de recuperación
  Y el enlace expira en exactamente 1 hora
```

### AC-2 - Escenario alternativo / error – Email no registrado
```gherkin
Dado que solicito recuperación con email "invalido@example.com"
Cuando el sistema verifica el email
Entonces veo el mensaje "No encontramos una cuenta con ese email"
  Pero no se envía ningún email
```

### AC-3 - Escenario alternativo / error – Enlace expirado
```gherkin
Dado que solicité recuperación hace 2 horas
Cuando intento usar el enlace de recuperación
Entonces veo "El enlace ha expirado. Solicita uno nuevo"
  Y el enlace queda invalidado permanentemente
```

## Reglas (reglas de negocio) *(si aplica)*
- **Regla-1:** el enlace de recuperación MUST expirar 1 hora después de emitido → cubierta por [AC-1, AC-3]

## ⚙️ Criterios no funcionales específicos *(si aplica)*
- **CNF-1 — Seguridad:** el enlace solo puede usarse una vez; se invalida tras el primer uso o expiración
- **CNF-2 — UX:** se muestra mensaje de confirmación de envío inmediatamente tras la solicitud

## 🚫 Fuera de alcance (Non-Goals) *(si aplica)*
- Recuperación por SMS.

## 🔗 Notas adicionales (Dependencias, supuestos y notas) *(si aplica)*
- **Supuesto:** el flujo de recuperación es solo por email.

---

## Evaluación FINVEST

### Veredicto

**Veredicto:** `APPROVED` — FINVEST 4.50 ≥ 4.0, sin dimensiones críticas

### Fase 1: Evaluación de Formato (F — Gateway)

| Componente | Score (1–5) | Observación |
|------------|:-----------:|-------------|
| Sección Historia con `Como/Quiero/Para` | 5 | Par `# 📖 Historia:` + `## Narrativa` presente (template actual); rol real, acción concreta, beneficio medible |
| Sección `## ✅ Criterios de aceptación (escenarios Gherkin)` con escenarios nombrados | 5 | Sección presente; escenario principal + 2 alternativos nombrados como `###` |
| Gherkin en bloques ` ```gherkin ` | 5 | 3 bloques gherkin con Dado/Cuando/Entonces/Y/Pero; cobertura de happy path + errores |

**F_score = (5 × 0.4) + (5 × 0.3) + (5 × 0.3) = 2.0 + 1.5 + 1.5 = 5.0 / 5.0**

✅ F_score ≥ 2.5 — se evalúa INVEST.

### Fase 2: Evaluación INVEST

| Dimensión | Score (1–5) | Observación |
|-----------|:-----------:|-------------|
| **I** – Independencia | 4 | Requiere servicio de email (mockeable con stub) y módulo de usuarios (preexistente); sin bloqueos reales |
| **N** – Negociable | 4 | Define outcomes, no implementación; negocia: tiempo de expiración, canal (SMS fuera de alcance), flujo UI |
| **V** – Valiosa | 4 | Valor claro y cualitativamente medible: reducción de tickets de soporte por contraseña olvidada |
| **E** – Estimable | 4 | Flujo estándar de password reset; cualquier equipo con experiencia en auth lo estima con confianza |
| **S** – Small | 3 | 3 escenarios Gherkin + criterios no funcionales; complejidad media ideal (token + email + expiración + UI) |
| **T** – Testeable | 5 | Gherkin con `Y` y `Pero`; la regla de expiración y el "uso único" son directamente automatizables |

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

### Comentarios y Recomendaciones

- **F – Formato (5):** la estructura del template actual (`## Narrativa`, criterios con sufijo `(escenarios Gherkin)`) puntúa igual que `## 📖 Historia` y `## ✅ Criterios de aceptación`.
- **S – Small (3):** Tamaño ideal. Si el equipo es nuevo en auth, separar en "Solicitar enlace de recuperación" y "Procesar uso del enlace" para reducir riesgo de integración.
- Sin dimensiones críticas. Lista para sprint.
