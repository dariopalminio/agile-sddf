---
alwaysApply: false
type: runbook
kind: configuration
enforcement: info
applies-to: graph
slug: runbook-configurar-gemini-en-graphify
title: "Runbook: Configurar Gemini como backend de Graphify"
created: 2026-10-10
updated: 2026-10-10
---

# Runbook: Configurar Gemini como backend de Graphify

Procedimiento para habilitar Gemini como proveedor de LLM en Graphify,
gestionar la cuota de la API, controlar el costo por pasada y resolver los
errores 429 durante la extracción semántica.

## Cuándo ejecutarlo

- Al montar Graphify en una máquina o cuenta nueva.
- Cuando se cambia de proveedor LLM (por ejemplo, de Gemini a OpenAI).
- Si aparecen errores 429 (Too Many Requests) durante la indexación.
- Si el costo por pasada sube por encima del presupuesto esperado.
- Al rotar la API key por seguridad.

## Prerrequisitos

- Cuenta de Google con acceso a la API de Gemini (AI Studio).
- Graphify instalado. Ver `runbook-usar-graphify-en-codex.md` para la
  integración con Codex.
- Estar en la raíz del proyecto.
- Terminal en `cmd` o PowerShell.

## Conceptos clave

| Concepto | Valor por defecto en este proyecto |
|---|---|
| Backend | `gemini` |
| Modelo recomendado | `gemini-3.1-flash-lite` |
| Variables de entorno esperadas | `GEMINI_API_KEY` (o `GOOGLE_API_KEY`) |
| Costo por pasada completa | ~0.5 USD (repo mediano, ~850K tokens de entrada) |
| Concurrencia recomendada | `1` (free tier) o `2-4` (pago, según cuota) |
| Archivo de salida | `graphify-out/graph.json` |

## Procedimiento

### 1. Obtener la API key

1. Abrir `https://aistudio.google.com/app/apikey`.
2. Crear una API key nueva para el proyecto.
3. Copiarla (solo se muestra una vez).

### 2. Configurar la variable de entorno

En Windows, la forma persistente es `setx` (requiere abrir una terminal nueva
después):

```cmd
setx GEMINI_API_KEY "AIza...tu_clave..."
```

Alternativa temporal solo para la sesión actual:

```cmd
set GEMINI_API_KEY=AIza...tu_clave...
```

Verificar que se lee correctamente:

```cmd
echo %GEMINI_API_KEY%
```

En PowerShell:

```powershell
$env:GEMINI_API_KEY = "AIza...tu_clave..."
```

Nunca escribir la clave en un archivo que se suba al repositorio. Si el
proyecto usa `.env`, añadir `.env` a `.gitignore`.

### 3. Instalar la extra de Gemini

El paquete base no incluye el SDK de Gemini. Instalar la extra explícita:

**Si se usa `uv tool`:**

```cmd
uv tool install "graphifyy[gemini]" --force
```

**Si se usa `pip --user`:**

```cmd
C:\Python314\python.exe -m pip install "graphifyy[gemini]" --user --no-warn-script-location
```

La extra `[gemini]` es independiente de `[mcp]`. Para tener ambas:

```cmd
uv tool install "graphifyy[gemini,mcp]" --force
```

### 4. Verificar que Graphify detecta la clave

```cmd
graphify --help
```

Buscar en la salida la mención a backends soportados. Si no aparece `gemini`,
la extra no se instaló correctamente.

### 5. Ejecutar una extracción de prueba

Antes de lanzar una indexación completa, probar con un subdirectorio pequeño
para validar clave y modelo:

```cmd
graphify docs --backend gemini --model gemini-3.1-flash-lite --concurrency 1
```

Si completa sin errores y reporta tokens consumidos, la configuración está
lista. Continuar con la indexación completa.

### 6. Indexación completa

```cmd
graphify . --backend gemini --model gemini-3.1-flash-lite --concurrency 1
```

La primera vez re-extrae todo. Las siguientes pasadas usan la caché
incremental y solo procesan archivos modificados.

## Elección del modelo

| Modelo | Uso recomendado | Notas |
|---|---|---|
| `gemini-3.1-flash-lite` | Indexación de volumen | Más barato y rápido. Recomendado por defecto. |
| `gemini-3.1-flash` | Extracción con más contexto | Mejor calidad, más caro. |
| `gemini-3.1-pro` | Tareas puntuales de análisis | Solo si se necesita razonamiento profundo. |

`flash-lite` es el modelo por defecto en este proyecto porque las tareas de
extracción semántica (clasificar, etiquetar, describir relaciones) no
requieren razonamiento profundo. Subir de modelo casi triplica el costo sin
mejora proporcional en la calidad del grafo.

## Gestión de cuota

### Síntoma de cuota agotada

La ejecución se interrumpe o emite warnings del tipo:

```
429 Too Many Requests
Retry-After: 54
```

Graphify continúa con otros lotes y deja pendientes los que fallaron. La
salida final reporta algo como:

```
failed batches: N of M
```

### Estrategia recomendada

1. **Concurrencia 1**: elimina los 429 en la mayoría de casos.
   ```cmd
   graphify . --backend gemini --model gemini-3.1-flash-lite --concurrency 1
   ```
2. **Respetar el `Retry-After`**: si Graphify lo expone como flag, configurarlo.
   Si no, esperar el tiempo indicado antes de relanzar.
3. **Reanudación incremental**: relanzar con los mismos flags. La caché
   re-procesa solo los lotes pendientes.
4. **Verificar el resultado final**: los nodos y aristas deben ser mayores o
   iguales que en la pasada parcial anterior. Si bajan, algún lote
   sobrescribió en lugar de fusionar.

### Si aún así falla

- Bajar el modelo a `gemini-3.1-flash-lite` si no lo estaba ya.
- Reducir el tamaño del proyecto indexado (usar `.graphifyignore`).
- Cambiar de backend temporalmente para los pendientes, si Graphify lo permite.
- Esperar al reinicio diario de la cuota (medianoche PT para el free tier).

## Control de costo

### Estimar antes de ejecutar

Graphify no ofrece un flag `--dry-run` universal, pero se puede acotar con un
subdirectorio pequeño para calibrar el costo por archivo:

```cmd
graphify docs --backend gemini --model gemini-3.1-flash-lite --concurrency 1
```

Multiplicar por el número total de archivos indexables (`Get-ChildItem`).

### Referencia medida en este proyecto

| Métrica | Valor típico |
|---|---|
| Archivos re-extraídos (completo) | ~700-900 |
| Archivos cacheados (incremental) | 100-300 |
| Tokens de entrada | ~850K |
| Tokens de salida | ~26K |
| Costo estimado | ~0.5 USD |

### Reducir costo

- Usar `.graphifyignore` para excluir `node_modules/`, `dist/`, `build/`,
  carpetas de tests, archivos generados.
- Aprovechar la caché: no borrar `graphify-out/` ni su carpeta de estado.
- Ejecutar solo tras cambios significativos, no en cada commit.
- Programar la indexación completa en CI nocturno si el equipo consume el
  grafo de forma intensiva.

## Rotación de la API key

1. Crear la nueva key en AI Studio.
2. Actualizar la variable de entorno:
   ```cmd
   setx GEMINI_API_KEY "AIza...nueva..."
   ```
3. Abrir una terminal nueva (obligatorio, `setx` no afecta la sesión actual).
4. Revocar la key antigua en AI Studio.
5. Ejecutar una extracción de prueba para confirmar que la nueva funciona.

## Solución de problemas

### `ModuleNotFoundError: No module named 'google.generativeai'` (o similar)

La extra `[gemini]` no está instalada en el entorno que ejecuta Graphify.
Aplicar el paso 3 con la herramienta correcta (`uv tool` o `pip --user`).

### `401 Unauthorized` o `API key not valid`

- La variable de entorno no se lee: verificar con `echo %GEMINI_API_KEY%` en
  una terminal nueva.
- La key se revocó o se copió incompleta.
- El proyecto en AI Studio no tiene la API habilitada.

### `403 Forbidden` (API not enabled)

Habilitar la Generative Language API en la consola de Google Cloud para el
proyecto asociado a la key.

### `429` persistente con `--concurrency 1`

- El free tier diario se agotó. Esperar al reinicio o pasar a plan de pago.
- Múltiples procesos Graphify corriendo en paralelo consumen la misma cuota.
- Otros scripts de la máquina usando la misma key.

### Costo muy alto

- Verificar que no se está reindexando sin caché (revisar la línea
  `incremental summary` en la salida).
- Confirmar que el modelo es `flash-lite` y no uno mayor.
- Añadir exclusiones a `.graphifyignore`.

## Seguridad

- **Nunca** escribir la API key en el repositorio, en scripts versionados, ni
  en el frontmatter de documentos.
- **Nunca** pegarla en capturas de pantalla ni en issues públicos.
- Si se filtra accidentalmente: revocar en AI Studio inmediatamente, crear una
  nueva, actualizar la variable de entorno y buscar rastros en el historial de
  git (`git log -p -S "AIza"`).
- En máquinas compartidas, preferir variables de sesión (`set`) sobre `setx`.
- Considerar un archivo `.env` local para el desarrollo, con `.env` en
  `.gitignore` y un `.env.example` versionado sin la clave real.

## Variables de entorno relacionadas

| Variable | Uso | Obligatoria |
|---|---|---|
| `GEMINI_API_KEY` | Autenticación con la API de Gemini | Sí |
| `GOOGLE_API_KEY` | Alias aceptado por algunos SDKs | Alternativa |
| `GRAPHIFY_BACKEND` | Backend por defecto si no se pasa `--backend` | Opcional |
| `GRAPHIFY_MODEL` | Modelo por defecto si no se pasa `--model` | Opcional |

## Referencias

- `runbook-regenerar-grafo.md` para reindexar tras cambios.
- `runbook-usar-graphify-en-codex.md` para exponer el grafo a Codex.
- AI Studio: `https://aistudio.google.com/app/apikey`.
- Documentación de cuotas de Gemini en la consola de Google Cloud.
