# 🐳 Dockerfiles - Guía Completa

## Estructura

```
yanapa/
├── Dockerfile                          ← Flutter web app (opcional)
├── nginx.conf                          ← Config para servir Flutter web
├── .dockerignore                       ← Archivos a excluir del Docker
├── services/
│   ├── users/
│   │   ├── Dockerfile                  ← Build para Users service
│   │   └── .dockerignore
│   ├── requests/
│   │   ├── Dockerfile                  ← Build para Requests service
│   │   └── .dockerignore
│   └── technicians/
│       ├── Dockerfile                  ← Build para Technicians service
│       └── .dockerignore
```

---

## 📋 Dockerfiles Disponibles

### 1️⃣ Microservicios (Node.js)

**Ubicación**: `services/{users,requests,technicians}/Dockerfile`

**Qué hace**:
- Instala Node.js 18 Alpine (ligero)
- Instala dependencias npm
- Copia código de la app
- Expone puerto del servicio
- Ejecuta health check
- Inicia con `npm start`

**Características**:
- ✅ Multi-stage build (más eficiente)
- ✅ Production-ready
- ✅ Health checks integrados
- ✅ Gzip compression ready

---

### 2️⃣ Flutter Web App (Opcional)

**Ubicación**: `./Dockerfile` (raíz del proyecto)

**Qué hace**:
- Compila la app Flutter a web
- Sirve con Nginx (ultra-rápido)
- Incluye caching inteligente
- Health check automático

**Cuándo usarlo**:
- Si quieres servir la app en un navegador web
- Para usuarios que accedan desde PC
- Como dashboard web complementario

**NO lo uses si**:
- Solo necesitas la app móvil (APK/iOS)
- Los usuarios acceden por móvil

---

## 🚀 Cómo Railway Usa los Dockerfiles

### Escenario 1: Desplegar Users Service

```
Railway detecta:
1. Carpeta: services/users
2. Archivo: services/users/Dockerfile
3. Ejecuta: docker build -t users .
4. Corre: npm start (del Dockerfile)
5. Expone puerto: 4000
```

### Escenario 2: Desplegar Flutter Web (Opcional)

```
Railway detecta:
1. Raíz del repo
2. Archivo: ./Dockerfile
3. Ejecuta: docker build -t yanapa-web .
4. Corre: nginx -g daemon off
5. Expone puerto: 80 (web)
```

---

## 🔧 Cómo Desplegar en Railway (Actualizado)

### Para Microservicios (Recomendado)

**En Railway Dashboard:**

**Paso 1: Users Service**
```
+ New Project
  → Deploy from GitHub repo
  → Selecciona: Adhemar03/yanapa
  → Rama: develop
  → Carpeta: services/users    ← IMPORTANTE
  → Click Deploy
  → Railway detecta Dockerfile automáticamente
```

**Paso 2: Requests Service**
```
+ New Service
  → Deploy from GitHub repo
  → Carpeta: services/requests
  → Click Deploy
```

**Paso 3: Technicians Service**
```
+ New Service
  → Deploy from GitHub repo
  → Carpeta: services/technicians
  → Click Deploy
```

---

### Para Flutter Web (Opcional)

⚠️ **Solo si quieres servir la app en web**

```
+ New Service
  → Deploy from GitHub repo
  → Selecciona la raíz del repo
  → Click Deploy
  → Railway detecta ./Dockerfile
```

---

## ✅ Verificar que Funciona

### Microservicios

En el navegador, abre cada URL:

```
https://yanapa-users-prod-xxx.railway.app/health
→ {"service":"users","status":"ok"}

https://yanapa-requests-prod-yyy.railway.app/health
→ {"service":"requests","status":"ok"}

https://yanapa-technicians-prod-zzz.railway.app/health
→ {"service":"technicians","status":"ok"}
```

### Flutter Web (si desplegaste)

```
https://yanapa-web-xxx.railway.app
→ Abre la app en el navegador
```

---

## 🔍 Ver Logs en Railway

Si algo falla:

1. **Railway Dashboard** → Selecciona servicio
2. **Tab "Logs"** → Ver en vivo
3. Busca errores rojos
4. Si ves: `Error building` → revisa el Dockerfile
5. Si ves: `npm ERR!` → problema en dependencias

---

## 📦 .dockerignore

Archivos que NO se incluyen en la imagen Docker:

```
node_modules/      ← Se instalan en el build
.git/              ← No necesario
.env               ← Se pasan como variables en Railway
build/             ← Binarios no necesarios
.dart_tool/        ← Cachés Flutter
```

Esto hace las imágenes más pequeñas y rápidas.

---

## 🛠️ Troubleshooting

### ❌ "Build failed" en Railway

**Soluciones en orden**:

1. **Verifica el Dockerfile está en la carpeta correcta**
   ```
   services/users/Dockerfile        ✅
   Dockerfile (raíz)                ✅
   ```

2. **Ve a Logs en Railway**
   - Click servicio → "Logs"
   - Copia el error exacto

3. **Problemas comunes**:
   ```
   ERROR: npm WARN peer dep
   → Agrega --legacy-peer-deps en el Dockerfile
   
   ERROR: not found: /app/package.json
   → Verifica que COPY . . está después de WORKDIR
   
   ERROR: node: not found
   → Dockerfile está en carpeta equivocada
   ```

4. **Si nada funciona**:
   - Prueba build localmente:
     ```bash
     cd services/users
     docker build -t users-test .
     docker run -p 4000:4000 users-test
     ```
   - Si funciona localmente pero no en Railway, es problema de Railway config

---

## ✨ Ventajas de los Dockerfiles

| Ventaja | Detalles |
|---------|----------|
| **Consistencia** | Mismo build local y Railway |
| **Control** | Exactamente qué se instala |
| **Velocidad** | Multi-stage builds optimizados |
| **Seguridad** | Alpine Linux (muy ligero) |
| **Portabilidad** | Funciona en cualquier servidor Docker |
| **Health Checks** | Railway puede reiniciar si falla |

---

## 🚀 Próximos Pasos

1. ✅ Dockerfiles creados
2. **Próximo**: Desplegar en Railway con los Dockerfiles
3. **Verificar**: Health check endpoints
4. **Testing**: Registrar usuario → crear solicitud → ver en app

---

## 📚 Referencia Rápida

**Para desplegar un servicio en Railway:**
```
1. Voy a railway.app
2. + New Service
3. Deploy from GitHub
4. Selecciono carpeta correcta
5. Railway ve el Dockerfile
6. Build automático
7. Deploy automático
```

¡Los Dockerfiles están listos! 🎉
