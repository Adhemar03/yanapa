# Requests Microservice

Microservice para gestionar solicitudes de servicio en la plataforma Yanapa.

## Requisitos

- Node.js 16+
- npm
- Supabase account con base de datos PostgreSQL

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno en `.env`:
```
PORT=4002
JWT_SECRET=your-jwt-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGIN=*
```

3. Crear el schema en Supabase ejecutando el archivo `create_schema.sql` en el editor SQL de Supabase:
   - Ve a Supabase dashboard
   - SQL Editor → New query
   - Copia el contenido de `create_schema.sql`
   - Ejecuta

## Uso

### Modo desarrollo (con nodemon):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servicio escuchará en `http://localhost:4002`

## Endpoints

### Crear nueva solicitud
```
POST /requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "categoryId": "1",
  "categoryName": "Reparación",
  "description": "Necesito reparar el aire acondicionado",
  "address": "Calle Principal 123",
  "phone": "1234567",
  "preferredDate": "2024-01-15"  // opcional
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user@example.com",
    "category_id": "1",
    "category_name": "Reparación",
    "description": "...",
    "address": "...",
    "phone": "...",
    "preferred_date": "...",
    "status": "pendiente",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### Obtener mis solicitudes
```
GET /requests/my
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [...]
}
```

### Obtener solicitudes activas
```
GET /requests/active
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [...]
}
```

### Obtener historial de solicitudes
```
GET /requests/history
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": [...]
}
```

### Obtener detalles de solicitud
```
GET /requests/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "data": {...}
}
```

### Actualizar estado de solicitud
```
PUT /requests/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "aceptada|rechazada|en_proceso|finalizada|cancelada"
}

Response (200):
{
  "success": true,
  "data": {...}
}
```

### Cancelar solicitud
```
DELETE /requests/:id
Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "message": "Request cancelled",
  "data": {...}
}
```

## Estados posibles

- `pendiente` - Solicitud creada, esperando respuesta
- `aceptada` - Técnico aceptó la solicitud
- `rechazada` - Técnico rechazó la solicitud
- `en_proceso` - Servicio en ejecución
- `finalizada` - Servicio completado
- `cancelada` - Solicitud cancelada por el cliente

## Estructura del proyecto

```
requests/
├── src/
│   ├── server.js              # Servidor Express principal
│   ├── requests.service.js    # Lógica de negocio
│   └── middleware/
│       └── auth.js            # Middleware de autenticación JWT
├── package.json
├── .env
└── create_schema.sql          # Script para crear schema en Supabase
```

## Validaciones

- **description**: Mínimo 10 caracteres
- **phone**: Mínimo 7 caracteres
- **categoryId, categoryName, address**: Requeridos, no pueden estar vacíos
- **status**: Debe ser uno de los estados válidos

## Seguridad

- Todas las rutas requieren autenticación JWT
- Los usuarios solo pueden ver/modificar sus propias solicitudes (RLS)
- Validación de entrada en todos los endpoints
