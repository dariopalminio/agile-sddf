---
alwaysApply: false
type: story
id: STORY-124
kind: feat
slug: STORY-124-validar-preparacion-estructural-epica
title: "Validar la preparación estructural de una épica"
status: SPECIFY
substatus: DONE
parent: EPIC-23-skill-epic-validate
created: 2026-10-12
updated: 2026-10-12
related:
  - EPIC-23-skill-epic-validate
  - STORY-125
  - STORY-126
  - STORY-127
  - STORY-128
---
[[EPIC-23-skill-epic-validate]]

# 📖 Historia: Validar la preparación estructural de una épica

**Como** mantenedor de Agile-SDDF que prepara una épica para su liberación  
**Quiero** obtener un veredicto de preparación basado en el cierre de sus historias y en el análisis de la épica  
**Para** identificar de forma objetiva los impedimentos antes de que la épica avance en su ciclo de vida

## ✅ Criterios de aceptación

### AC-1 — Escenario principal — Validación estructural aprobada
```gherkin
Dado una épica existente cuyas historias hijas están cerradas
  Y cuyo análisis declara el veredicto APPROVED
Cuando el mantenedor solicita validar la épica por su identificador o ruta
Entonces recibe un reporte con el veredicto READY-TO-SHIP
```

### AC-2 — Escenario alternativo — Hallazgo de evidencia estructural incompleta
```gherkin
Dado una épica con una historia hija no terminal o un análisis sin APPROVED
Cuando el mantenedor solicita validar la épica
Entonces el reporte declara BLOCKED e identifica la evidencia que debe corregirse
```

### AC-3 — Escenario de error — Épica inexistente
```gherkin
Dado un identificador o ruta que no corresponde a una épica
Cuando el mantenedor solicita validarla
Entonces recibe un error con la ubicación buscada y no se crea un reporte
```

## ⚙️ Criterios no funcionales específicos

- **CNF-1 — Resolución portable:** la validación resuelve la raíz de artefactos con la precedencia vigente de SDDF antes de localizar la épica.
- **CNF-2 — Reporte legible:** el reporte muestra el veredicto y los resultados de las comprobaciones realizadas sin dejar marcadores de plantilla.

## 🚫 Fuera de alcance

- Ejecutar smoke tests, el comando de verificación de release o el checklist DoD.
- Cambiar el estado de la épica o de cualquiera de sus historias.
- Integrar el veredicto en la transición del ciclo de vida.

## 📎 Notas / contexto adicional

- Esta es la historia core del split de STORY-124. Conserva el directorio e ID originales.
- El informe FINVEST de la historia original decidió `DIVIDIR`; su evidencia se conserva en este directorio.
- El reporte de validación establece un veredicto binario a partir de los hallazgos de esta historia. Las comprobaciones adicionales se incorporan en STORY-125.
