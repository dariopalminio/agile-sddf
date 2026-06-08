---
type: story
id: FEAT-000
slug: FEAT-000-example-approved
title: "Ejemplo: Historia aprobada en code review"
status: IMPLEMENT
substatus: DONE
parent: EPIC-00-example
created: 2026-05-09
updated: 2026-05-09
---

# Historia: Ejemplo de revisión aprobada

**Como** desarrollador
**Quiero** tener una función que sume dos números
**Para** verificar que el skill story-code-review funciona correctamente en el happy path

## ✅ Criterios de aceptación

### Escenario principal – Suma correcta
```gherkin
Dado que tengo los números 2 y 3
Cuando llamo a la función sum(2, 3)
Entonces el resultado es 5
```

### Escenario alternativo – Suma con cero
```gherkin
Dado que tengo los números 0 y 7
Cuando llamo a la función sum(0, 7)
Entonces el resultado es 7
```
