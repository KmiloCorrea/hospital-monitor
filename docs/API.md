# API Reference - Hospital San Rafael IT Monitor

Base URL: `http://localhost:3000`

---

## Auth Service (Puerto 3001)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/logout | Cerrar sesión |
| GET  | /api/auth/me | Usuario actual |
| POST | /api/auth/refresh | Renovar token |

### Login - Ejemplo
```json
POST /api/auth/login
{ "email": "admin@husrt.gov.co", "password": "Admin1234!" }
```

---

## Users Service (Puerto 3002)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET    | /api/users | admin/tech/viewer | Listar usuarios |
| GET    | /api/users/:id | todos | Obtener usuario |
| POST   | /api/users | admin | Crear usuario |
| PUT    | /api/users/:id | admin | Actualizar |
| DELETE | /api/users/:id | admin | Desactivar |
| GET    | /api/users/roles/all | todos | Listar roles |

---

## Devices Service (Puerto 3003)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET    | /api/devices | todos | Listar dispositivos |
| GET    | /api/devices/types | todos | Tipos de dispositivos |
| GET    | /api/devices/:id | todos | Obtener dispositivo |
| POST   | /api/devices | admin/tech | Crear |
| PUT    | /api/devices/:id | admin/tech | Actualizar |
| PATCH  | /api/devices/:id/status | admin/tech | Cambiar estado |
| DELETE | /api/devices/:id | admin | Eliminar |

**Filtros GET /api/devices:** `?status=online&location_id=1&type_id=1`

---

## Locations Service (Puerto 3004)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET    | /api/locations | todos | Listar ubicaciones |
| GET    | /api/locations/:id | todos | Detalle |
| GET    | /api/locations/:id/devices | todos | Dispositivos en ubicación |
| POST   | /api/locations | admin | Crear |
| PUT    | /api/locations/:id | admin | Actualizar |
| DELETE | /api/locations/:id | admin | Eliminar |

---

## Metrics Service (Puerto 3005)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET    | /api/metrics/types | todos | Tipos de métricas |
| GET    | /api/metrics/device/:id | todos | Métricas de un dispositivo |
| GET    | /api/metrics/device/:id/latest | todos | Última métrica por tipo |
| GET    | /api/metrics/summary | todos | Resumen general |
| POST   | /api/metrics | admin/tech | Registrar métrica |
| POST   | /api/metrics/bulk | admin/tech | Registrar múltiples |

---

## Alerts Service (Puerto 3006)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET    | /api/alerts | todos | Listar alertas |
| GET    | /api/alerts/active | todos | Alertas activas |
| GET    | /api/alerts/severities | todos | Severidades |
| GET    | /api/alerts/stats | todos | Estadísticas |
| GET    | /api/alerts/:id | todos | Detalle |
| POST   | /api/alerts | admin/tech | Crear alerta |
| PATCH  | /api/alerts/:id/resolve | admin/tech | Resolver |
| DELETE | /api/alerts/:id | admin | Eliminar |

---

## Autenticación

Todas las rutas protegidas requieren:
```
Authorization: Bearer <token_jwt>
```
