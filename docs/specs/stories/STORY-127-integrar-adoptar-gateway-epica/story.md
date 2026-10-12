---
alwaysApply: false
type: story
id: STORY-127
kind: feat
slug: STORY-127-integrar-adoptar-gateway-epica
title: "Integrar y documentar el gateway de validación de épicas"
status: SPECIFY
substatus: DONE
parent: EPIC-23-skill-epic-validate
created: 2026-10-12
updated: 2026-10-12
related:
  - EPIC-23-skill-epic-validate
  - STORY-124
  - STORY-125
  - STORY-126
  - STORY-128
---
[[EPIC-23-skill-epic-validate]]

# 📖 Historia: Integrar y documentar el gateway de validación de épicas

**Como** responsable del ciclo de vida de épicas en Agile-SDDF  
**Quiero** que el gateway de validación se aplique antes de la transición correspondiente y esté disponible y documentado para los runtimes soportados  
**Para** que el equipo use una única regla de liberación comprensible y ejecutable

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Transición permitida
```gherkin
Dado una épica en DEVELOP lista según su validación automática
Cuando intenta avanzar a VALIDATE
Entonces la transición continúa y conserva la evidencia del veredicto READY-TO-SHIP
```

### AC-2 — Escenario alternativo — Transición bloqueada
```gherkin
Dado una épica cuyo veredicto de validación es BLOCKED
Cuando intenta avanzar a VALIDATE
Entonces la transición se detiene y muestra los impedimentos que debe resolver el mantenedor
```

### AC-3 — Escenario de adopción — Gateway disponible y explicado
```gherkin
Dado una instalación explícita del framework en un runtime soportado
Cuando el mantenedor consulta la guía del pipeline de épicas
Entonces encuentra el gateway instalado, su uso y su posición antes de VALIDATE
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Consistencia:** la documentación canónica y la distribución del paquete describen el mismo punto de entrada y la misma transición.
- **CNF-2 — Portabilidad:** la disponibilidad no depende de una carpeta de runtime concreta dentro del repositorio fuente.

## 🚫 Fuera de alcance

- Implementar las comprobaciones que forman el veredicto.
- Cambiar otros estados o transiciones del ciclo de vida de épicas.
- Medir la calidad del gateway mediante casos de evaluación.

## 📎 Notas / contexto adicional

- Esta historia consume el contrato de validación de STORY-124, STORY-125 y STORY-126.
- La fuente del framework permanece en `skills/`; la instalación explícita genera los destinos de runtime.
