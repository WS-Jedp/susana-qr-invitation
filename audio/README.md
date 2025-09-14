# Sistema de Audio Avanzado con Transiciones Suaves

## Características principales

### 🎵 Continuidad de Audio
- El audio continúa reproduciéndose entre secciones que comparten la misma configuración
- Solo cambia cuando se detecta una nueva fuente de audio o configuración diferente

### 🎛️ Transiciones Suaves
- **Fade-out**: 600ms de transición suave al salir del audio actual
- **Fade-in**: 800ms de transición suave al entrar al nuevo audio
- **Crossfade**: Transición perfecta sin cortes abruptos

### 🔄 Auto-loop Inteligente
- Loop automático en el rango especificado para cada audio
- Mantiene la reproducción continua durante toda la sección

## Configuración de archivos de audio

Los archivos de audio deben colocarse en la carpeta `public/audio/`:

```
public/
  audio/
    superstar.mp3     # Audio principal usado en múltiples secciones
    upbeat.mp3        # Para secciones dinámicas
    fun.mp3           # Para secciones divertidas
    curious.mp3       # Para secciones de preguntas
    hopeful.mp3       # Para call-to-action
    ending.mp3        # Para la despedida
```

## Configuración en data.json

### Ejemplo de continuidad (mismo audio en múltiples secciones):
```json
{
  "id": 1,
  "audio": {
    "src": "/audio/superstar.mp3",
    "loop": { "start": 1, "end": 120 }
  }
},
{
  "id": 2,  
  "audio": {
    "src": "/audio/superstar.mp3",  // Mismo archivo = continuidad
    "loop": { "start": 30, "end": 90 }  // Puede cambiar el rango de loop
  }
}
```

### Ejemplo de transición (audio diferente):
```json
{
  "id": 3,
  "audio": {
    "src": "/audio/upbeat.mp3",  // Archivo diferente = transición suave
    "loop": { "start": 15, "end": 55 }
  }
}
```

## Estados visuales del reproductor

- 🟢 **Verde**: Reproduciendo normalmente
- 🟠 **Naranja**: Transicionando entre audios  
- ⚪ **Gris**: Pausado
- ⏳ **Spinner**: Cargando audio

## Mejores prácticas

1. **Audios de calidad**: Usa archivos MP3 de buena calidad (192kbps+)
2. **Tamaño optimizado**: Mantén los archivos bajo 5MB para carga rápida
3. **Loop suave**: Asegúrate de que el inicio y final del loop fluyan bien
4. **Volumen consistente**: Normaliza el volumen entre diferentes archivos

## Ejemplo de flujo de audio

```
Sección 1: superstar.mp3 (0s-120s) → [CONTINÚA]
Sección 2: superstar.mp3 (30s-90s) → [CONTINÚA] 
Sección 3: superstar.mp3 (30s-90s) → [FADE OUT → FADE IN]
Sección 4: upbeat.mp3 (15s-55s) → [FADE OUT → FADE IN]
Sección 5: fun.mp3 (8s-50s)
```

El sistema detecta automáticamente cuándo mantener la continuidad y cuándo hacer transiciones.
