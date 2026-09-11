---
alwaysApply: false   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (valor fijo)
type: story   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (valor fijo)
id: <STORY-NNN>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (historias hermanas)
kind: <feat | fix | chore | hotfix>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (hereda de la historia madre) — tipo de historia; determina el prefijo de rama
slug: <nombre-del-directorio-de-historia>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (renombra la core)
title: "<primer # heading del documento>"   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories
status: <ESTADO_INICIAL>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (inicial) · story-evaluation (→ SPECIFY/DONE solo con decisión APROBADA — señal de un vistazo; el score vive en finvest-evaluation-report.md) · story-plan, story-implement, story-implement-tasks, story-code-review, story-verify, story-acceptance (transiciones)
substatus: IN-PROGRESS   # escritor: los mismos que status (story-evaluation lo lleva a DONE junto con status: SPECIFY)
parent: <nombre-del-directorio-de-la-epica>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories
created: <YYYY-MM-DD>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories
updated: <YYYY-MM-DD>   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories (inicial) · todo skill que edite el archivo (story-improve, story-split y los que transicionan status)
related:   # escritor: story-creation · epic-generate-stories · epic-generate-all-stories · story-split (añade la core y las hermanas)
  - <nombre-del-directorio-de-la-epica o slug de la épica relacionada (si existe)> <!-- Colocar referencias solo si existe épica relacionada o historia relacionada -->
---
<!-- escritor del cuerpo: story-creation · epic-generate-stories · epic-generate-all-stories — salvo anotación distinta junto a la sección -->
<!-- Referencias: colocar referencias solo si existe épica relacionada -->
[[<nombre-del-directorio-de-la-epica o slug de la épica relacionada (si existe)>]]

# 📖 Historia: [Título de la historia o nombre de historia] <!-- escritor: defecto · story-improve (aplica recomendaciones FINVEST) · story-split (reescribe la historia core) -->

**Como** [rol o persona]  
**Quiero** [acción o funcionalidad]  
**Para** [beneficio o valor]

## ✅ Criterios de aceptación <!-- escritor: defecto · story-improve (aplica recomendaciones FINVEST) · story-split (reparte escenarios entre core y hermanas) -->

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

## ⚙️ Criterios no funcionales <!-- sección opcional · escritor: defecto · story-improve (aplica recomendaciones FINVEST) -->

* Rendimiento: [ej. la búsqueda responde en <2s]
* Seguridad: [ej. solo usuarios con rol X pueden ver Y]
* UX/Accesibilidad: [ej. compatible con lectores de pantalla]

## Fuera de alcance (Non-Goals)  <!-- sección opcional solo si es necesario indicar qué no se abordará -->
[Aspectos que no serán abordados por esta historia, para evitar malentendidos]

## 📎 Notas / contexto adicional <!-- sección opcional · escritor: defecto · story-improve (dimensiones I y E) · story-split (contexto del split) -->
[Información relevante para el equipo de desarrollo o QA]
