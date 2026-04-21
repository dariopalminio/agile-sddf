## 1. Actualizar Fase 0 del SKILL.md

- [x] 1.1 Verificar que la detección de Tipo A (ruta relativa con `/`, `\` o terminada en `.md`) usa la ruta directamente sin búsqueda adicional
- [x] 1.2 Verificar que la detección de Tipo B (nombre corto) busca por substring case-insensitive en `docs/specs/releases/`
- [x] 1.3 Verificar que con exactamente 1 coincidencia el skill continúa sin prompt
- [x] 1.4 Verificar que con múltiples coincidencias el skill muestra la lista completa y solicita selección al usuario
- [x] 1.5 Verificar que con 0 coincidencias el skill emite el mensaje "Archivo no encontrado: <término>" y termina con resultado RECHAZADO

## 2. Verificación manual

- [x] 2.1 Invocar el skill con nombre corto sin extensión y verificar resolución correcta de ruta
- [x] 2.2 Invocar el skill con ruta relativa completa y verificar que se usa directamente
- [x] 2.3 Invocar el skill con un término que no coincide con ningún archivo y verificar resultado RECHAZADO con mensaje de error
