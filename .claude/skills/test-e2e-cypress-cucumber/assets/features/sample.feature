# language: es
@auth @smoke
Característica: Autenticación de usuario
  Como usuario registrado
  Quiero iniciar sesión en la aplicación
  Para poder acceder a mi cuenta

  Antecedentes:
    Dado que el usuario está en la página de inicio de sesión

  @smoke
  Escenario: Inicio de sesión exitoso con credenciales válidas
    Cuando el usuario ingresa credenciales válidas
    Entonces debería ser redirigido al panel de control
    Y debería ver su nombre de usuario en el encabezado

  @regression
  Escenario: Inicio de sesión fallido con contraseña incorrecta
    Cuando el usuario ingresa una contraseña incorrecta
    Entonces debería ver el mensaje de error "Credenciales inválidas"
    Y debería permanecer en la página de inicio de sesión

  @regression
  Esquema del escenario: Inicio de sesión fallido con campos vacíos
    Cuando el usuario envía el formulario con email "<email>" y contraseña "<contraseña>"
    Entonces debería ver un error de validación para el campo "<campo>"

    Ejemplos:
      | email             | contraseña  | campo      |
      |                   | password123 | email      |
      | user@example.com  |             | contraseña |
      |                   |             | email      |
