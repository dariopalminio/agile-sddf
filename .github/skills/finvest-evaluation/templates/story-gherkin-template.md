# Historia de Usuario

## 📖 Historia

**Como** {rol o persona}  
**Quiero** {acción o funcionalidad}  
**Para** {beneficio o valor}

## ✅ Criterios de aceptación

### Escenario principal – {título descriptivo}
```gherkin
Dado {contexto inicial}
  Y {otra condición si aplica}
Cuando {acción del usuario}
Entonces {resultado esperado}
  Y {otro resultado}
```
### Escenario alternativo / error – {título}
```gherkin
Dado {contexto}
Cuando {acción inválida o límite}
Entonces {mensaje de error o comportamiento alternativo}
  Pero {excepción si aplica}
```

### Escenario con datos (Scenario Outline) – opcional
```gherkin
Escenario: {título}
  Dado que el usuario tiene el rol "<rol>"
  Cuando intenta acceder a "{recurso}"
  Entonces ve "{mensaje}"
Ejemplos:
  | rol       | recurso   | mensaje               |
  | invitado  | /admin    | "Acceso denegado"     |
  | editor    | /admin    | "Acceso denegado"     |
  | admin     | /admin    | "Panel de control"    |
```

## ⚙️ Criterios no funcionales (opcional)

* Rendimiento: {ej. la búsqueda responde en <2s}
* Seguridad: {ej. solo usuarios con rol X pueden ver Y}
* UX/Accesibilidad: {ej. compatible con lectores de pantalla}

## 📎 Notas / contexto adicional
{Información relevante para el equipo de desarrollo o QA}

