# Empty Project Example

Este directorio es un proyecto de ejemplo SIN archivos de código fuente reconocidos.

Su propósito es verificar el flujo AC-3 del skill `security-audit`:

> **Dado** que el repositorio no contiene ningún archivo con extensión reconocida (.js, .ts, .py, .go, .java, etc.)
> **Cuando** el ingeniero ejecuta `security-audit --repo /ruta/empty-project`
> **Entonces** el skill reporta estado "N/A" para todas las reglas
>   Y finaliza con código de salida 0
>   Y muestra el mensaje "No se encontraron archivos fuente reconocidos en el repositorio"

## Contenido del directorio

Este directorio contiene ÚNICAMENTE archivos de documentación (.md) y NO contiene ningún archivo
con extensiones reconocidas por el skill (.js, .ts, .jsx, .tsx, .py, .go, .java, .rb, .cs, .php, .rs).

## Uso en pruebas

```bash
# Verificar AC-3: todas las reglas N/A, exit 0
/security-audit --repo ./examples/empty-project
```

El reporte esperado debe mostrar:
- `source_files_found: false` en la sección de contexto detectado
- Estado N/A para todas las reglas del checklist
- Mensaje: "No se encontraron archivos fuente reconocidos en el repositorio"
