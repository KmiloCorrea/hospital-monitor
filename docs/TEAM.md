# Asignación del Equipo

## Microservicios y Responsables

| Servicio | Carpeta | Responsable | Estado |
|----------|---------|-------------|--------|
| Auth Service | services/auth-service | | Pendiente |
| Users Service | services/users-service | | Pendiente |
| Devices Service | services/devices-service | | Pendiente |
| Locations Service | services/locations-service | | Pendiente |
| Metrics Service | services/metrics-service | | Pendiente |
| Alerts Service | services/alerts-service | | Pendiente |
| Frontend (Dashboard) | frontend/src/pages/Dashboard.jsx | | Base lista |
| Frontend (Otros) | frontend/src/pages/ | | Pendiente |

## Qué hace cada estudiante

Cada responsable de servicio debe:
1. Revisar y probar el código base ya implementado
2. Completar la lógica de negocio específica
3. Agregar validaciones adicionales
4. Escribir al menos 1 test en `/tests/`
5. Documentar endpoints en este archivo

## Notas de Implementación

- El **Auth Service** ya está completo — sirve de referencia para el resto
- Todos los servicios comparten la misma base de datos PostgreSQL
- El middleware JWT es idéntico en todos los servicios
- El frontend se conecta siempre a través del **API Gateway** en puerto 3000
