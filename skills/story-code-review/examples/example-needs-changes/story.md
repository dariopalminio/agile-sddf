---
type: story
id: STORY-000
slug: STORY-000-example-needs-changes
title: "Ejemplo: Historia con hallazgos bloqueantes en code review"
status: IMPLEMENT
substatus: DONE
parent: EPIC-00-example
created: 2026-05-09
updated: 2026-05-09
---

# Historia: Ejemplo de revisión con bloqueantes

**Como** desarrollador
**Quiero** tener un endpoint que lea datos de usuario desde la base de datos
**Para** verificar el flujo de revisión con hallazgos HIGH (referencia para STORY-065)

## ✅ Criterios de aceptación

### Escenario principal – Lectura de usuario existente
```gherkin
Dado que existe un usuario con id "123" en la base de datos
Cuando llamo a GET /users/123
Entonces el response es 200 con los datos del usuario
```

### Escenario – Usuario no encontrado
```gherkin
Dado que no existe ningún usuario con id "999"
Cuando llamo a GET /users/999
Entonces el response es 404 con mensaje "User not found"
```
