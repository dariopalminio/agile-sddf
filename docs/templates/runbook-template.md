# Runbook: [Operational task]

- **Último ensayo:** [fecha]
- **Resultado esperado:** [resultado observable]

## Cuándo usar
<!--Describe la tarea y las condiciones bajo las cuales se aplica este procedimiento. -->

## Preparación
<!-- Precondiciones necesarias antes de ejecutar la tarea -->

- Herramientas y acceso necesarios:
- Servicio y entorno de destino:
- Ventana de ejecución aprobada:
- Paneles de control y documentación pertinentes:

## Procedimiento
<!-- Procedimiento paso a paso para ejecutar la tarea operacional -->

1. **Verificar el entorno de destino**
   - Instrucción: Confirma que Git, Spec Kit y el repositorio están disponibles
   - Comandos: `specify --version`, `git status`, `Test-Path .specify -Type Container`
   - Observación esperada: Los comandos se ejecutan sin errores; el repositorio está disponible

2. **Ubicar el archivo de configuración**
   - Instrucción: Verifica que existe `.specify/extensions/git/git-config.yml`
   - Comando: `Test-Path .specify\extensions\git\git-config.yml -Type Leaf`
   - Observación esperada: Devuelve `True`


## Si un paso falla
<!-- Explicar acciones ante casos de errores o fallos.
Detenerse ante [condición definida]. Registrar el paso fallido y su resultado. Seguir el procedimiento de recuperación revisado en [enlace] o ponerse en contacto a través del [canal de guardia].
-->

## Checklist de completitud:
<!-- Checklist de completitud o verificaciòn final -->

- [ ] Resultado esperado verificado
- [ ] Trabajo registrado en el historial de cambios
- [ ] Documentación actualizada en caso de modificación del procedimiento
