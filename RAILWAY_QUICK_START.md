# 🚀 RAILWAY - DESPLIEGUE RÁPIDO (Para ti)

## ✅ Estado Actual
- ✅ Código en GitHub (rama `develop`)
- ✅ Supabase configurado
- ✅ Credenciales locales actualizadas
- ✅ Services listos
- ✅ **Dockerfiles configurados** (Railway auto-detecta)

## 🎯 Tu Checklist - 5 Pasos (15 minutos)

### PASO 1: Ve a Railway
1. Abre https://railway.app
2. Click "Login" → "Continue with GitHub"
3. Autoriza y selecciona tu cuenta

### PASO 2: Crea Proyecto y Deploya Users Service

**En Railway Dashboard:**
1. Click **"+ New Project"**
2. Click **"Deploy from GitHub repo"**
3. Railway pide autorización → autoriza
4. Busca `Adhemar03/yanapa` → click
5. Click "Confirm"
6. **IMPORTANTE**: Select `services/users` en la carpeta
7. Click "Deploy"

**Espera 2-3 minutos**

Cuando veas ✅ "Deployment Successful":
*(Railway automáticamente detecta el Dockerfile en services/users y lo usa para buildear)*

1. Click en el servicio "yanapa" (users)
2. Ve a tab **"Variables"**
3. Verifica que tenga estos valores (ya están):
   ```
   PORT=4000
   JWT_SECRET=yanapa-users-secret-dev
   SUPABASE_URL=https://xtzomnweoicmnrfsijfy.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   CORS_ORIGIN=*
   ```
4. Railway redeploya automáticamente si cambias algo

**Anota tu URL de Users Service** (ejemplo):
```
https://yanapa-users-prod-xxxx.railway.app
```

---

### PASO 3: Deploya Requests Service

**En Railway Dashboard:**
1. Click **"+ New Service"**
2. Click **"Deploy from GitHub repo"**
3. Busca `Adhemar03/yanapa` → click
4. Click "Confirm"
5. **IMPORTANTE**: Select `services/requests` en la carpeta
6. Click "Deploy"

**Espera 2-3 minutos**

Cuando veas ✅ "Deployment Successful":
1. Click en el servicio "requests"
2. Ve a tab **"Variables"**
3. Verifica que tenga (ya están):
   ```
   PORT=4002
   JWT_SECRET=yanapa-users-secret-dev
   SUPABASE_URL=https://xtzomnweoicmnrfsijfy.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   CORS_ORIGIN=*
   ```

**Anota tu URL de Requests Service** (ejemplo):
```
https://yanapa-requests-prod-yyyy.railway.app
```

---

### PASO 4: Deploya Technicians Service

**En Railway Dashboard:**
1. Click **"+ New Service"**
2. Click **"Deploy from GitHub repo"**
3. Busca `Adhemar03/yanapa` → click
4. Click "Confirm"
5. **IMPORTANTE**: Select `services/technicians` en la carpeta
6. Click "Deploy"

**Espera 2-3 minutos**

Cuando veas ✅ "Deployment Successful":
1. Click en el servicio "technicians"
2. Ve a tab **"Variables"**
3. Verifica que tenga (ya están):
   ```
   PORT=4001
   JWT_SECRET=yanapa-users-secret-dev
   SUPABASE_URL=https://xtzomnweoicmnrfsijfy.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   CORS_ORIGIN=*
   ```

**Anota tu URL de Technicians Service** (ejemplo):
```
https://yanapa-technicians-prod-zzzz.railway.app
```

---

### PASO 5: Actualiza Flutter y Compila APK

Edita tu archivo `.env` en `c:\Users\adhem\yanapa\.env`:

```env
# Reemplaza con tus URLs de Railway
USERS_API_BASE_URL=https://yanapa-users-prod-xxxx.railway.app
REQUESTS_API_BASE_URL=https://yanapa-requests-prod-yyyy.railway.app
TECHNICIANS_API_BASE_URL=https://yanapa-technicians-prod-zzzz.railway.app
```

Luego, compila el APK:
```bash
cd c:\Users\adhem\yanapa
flutter build apk --release
```

El APK estará en:
```
build/app/outputs/flutter-apk/app-release.apk
```

Transfiere e instala en tu móvil. ¡Listo!

---

## 🔍 Verificar que Funciona

**En tu PC, abre navegador:**
```
https://yanapa-users-prod-xxxx.railway.app/health
```
Deberías ver:
```json
{"service":"users","status":"ok"}
```

**En tu móvil:**
1. Abre la app Yanapa
2. Click "CREAR CUENTA"
3. Completa el formulario
4. Si ves "Registro exitoso" → ✅ **¡FUNCIONA!**

---

## ⚡ Notas Importantes

| Item | Valor |
|------|-------|
| GitHub Repo | https://github.com/Adhemar03/yanapa |
| Rama | develop |
| Supabase URL | https://xtzomnweoicmnrfsijfy.supabase.co |
| JWT_SECRET | yanapa-users-secret-dev (igual en ambos services) |
| CORS | * (permite todos los orígenes en dev) |

---

## 🆘 Si Algo Falla

**❌ "Deployment failed"**
- Verifica que seleccionaste la carpeta correcta (`services/users`, no raíz)
- Verifica que el repo es público o que Railway tiene acceso
- Ver [DOCKER_GUIDE.md](DOCKER_GUIDE.md) para troubleshooting de build

**❌ "Connection refused" desde el móvil**
- Verifica que las URLs en `.env` son las de Railway (no localhost)
- Recompila el APK
- Ver "Verificar que Funciona" arriba

**❌ "401 Unauthorized"**
- Verifica que JWT_SECRET es igual en ambos services
- En Railway, vuelve a agregar la variable exacta

**❌ CORS error en logs**
- Verifica que CORS_ORIGIN está en variables
- Agrega: CORS_ORIGIN=*

**❌ Service no se despliega (build failed)**
- Ve a Railway → Logs → mira el error exacto
- 99% de casos: problema en Dockerfile o dependencias
- Ver [DOCKER_GUIDE.md](DOCKER_GUIDE.md) → Troubleshooting

---

## 📚 Documentación Extra

- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Guía completa de Dockerfiles
- [DEPLOYMENT_RAILWAY.md](DEPLOYMENT_RAILWAY.md) - Guía técnica detallada
- [MOBILE_DEPLOYMENT_GUIDE.md](MOBILE_DEPLOYMENT_GUIDE.md) - Para móvil

```
Users:       https://yanapa-users-prod-XXXX.railway.app
Requests:    https://yanapa-requests-prod-YYYY.railway.app
Technicians: https://yanapa-technicians-prod-ZZZZ.railway.app

GitHub:      https://github.com/Adhemar03/yanapa
Supabase:    https://xtzomnweoicmnrfsijfy.supabase.co
```

---

¡Ya está! 🎉 Tu app será accesible globalmente desde cualquier móvil.
