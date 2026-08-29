---
alwaysApply: false
type: story
id: <FEAT-NNN>
slug: <nombre-del-directorio-de-historia>
title: "<primer # heading del documento>"
status: <ESTADO_INICIAL>
substatus: IN‑PROGRESS
parent: <nombre-del-directorio-de-la-epica>
created: <YYYY-MM-DD>
updated: <YYYY-MM-DD>
related:
  - <nombre-del-directorio-de-la-epica o slug de la épica relacionada (si existe)> <!-- Colocar referencias solo si existe épica relacionada o historia relacionada -->
---
**FINVEST Score:** [FINVEST Score]
**FINVEST Decisión:** [APROBADA | REFINAR | RECHAZAR]
---
<!-- Referencias: colocar referencias solo si existe épica relacionada -->
[[<nombre-del-directorio-de-la-epica o slug de la épica relacionada (si existe)>]]

# 📖 Historia: [Título de la historia o nombre de historia]

**Como** [rol o persona]  
**Quiero** [acción o funcionalidad]  
**Para** [beneficio o valor]

## ✅ Criterios de aceptación

### Escenario principal – [título descriptivo]
```gherkin
Dado [contexto inicial]
  Y [otra condición si aplica]
Cuando [acción del usuario]
Entonces [resultado esperado]
  Y [otro resultado]
```
### Escenario alternativo / error – [título]
```gherkin
Dado [contexto]
Cuando [acción inválida o límite]
Entonces [mensaje de error o comportamiento alternativo]
  Pero [excepción si aplica]
```

### Escenario con datos (Scenario Outline) – opcional
```gherkin
Escenario: [título]
  Dado que el usuario tiene el rol "<rol>"
  Cuando intenta acceder a "[recurso]"
  Entonces ve "[mensaje]"
Ejemplos:
  | rol       | recurso   | mensaje               |
  | invitado  | /admin    | "Acceso denegado"     |
  | editor    | /admin    | "Acceso denegado"     |
  | admin     | /admin    | "Panel de control"    |
```

### Requerimiento: [Título del requerimiento] <!-- sección opcional-->
[Requerimiento específicos (como regla de negocio) relacionado con la historia, si aplica]

## ⚙️ Criterios no funcionales <!-- sección opcional-->

* Rendimiento: [ej. la búsqueda responde en <2s]
* Seguridad: [ej. solo usuarios con rol X pueden ver Y]
* UX/Accesibilidad: [ej. compatible con lectores de pantalla]

## 📎 Notas / contexto adicional <!-- sección opcional-->
[Información relevante para el equipo de desarrollo o QA]
