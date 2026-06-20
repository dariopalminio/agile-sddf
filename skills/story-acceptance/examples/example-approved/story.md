---
type: story
id: FEAT-055
slug: FEAT-055-login-usuario
title: "Login de usuario con email y contraseña"
status: VERIFY
substatus: DONE
created: 2026-05-14
updated: 2026-05-15
---

# Historia: Login de usuario con email y contraseña

**Como** usuario registrado
**Quiero** ingresar mi email y contraseña
**Para** acceder a mi cuenta y usar las funcionalidades del sistema

## ✅ Criterios de aceptación

### Escenario principal – Login exitoso

```gherkin
Dado que el usuario tiene una cuenta registrada con email "user@test.com"
  Y el usuario ingresa su contraseña correcta "SecurePass123"
Cuando el usuario hace clic en "Iniciar sesión"
Entonces el sistema redirige al dashboard
  Y muestra el mensaje "Bienvenido, usuario"
  Y la sesión queda activa por 24 horas
```

### Escenario alternativo – Contraseña incorrecta

```gherkin
Dado que el usuario ingresa email "user@test.com" con contraseña incorrecta "wrong"
Cuando el usuario hace clic en "Iniciar sesión"
Entonces el sistema muestra el mensaje "Credenciales incorrectas"
  Y no redirige al dashboard
  Y el campo de contraseña se limpia automáticamente
```

## ⚙️ Criterios no funcionales

* Performance: El login debe completarse en menos de 2 segundos
* Seguridad: Las contraseñas se transmiten siempre por HTTPS
