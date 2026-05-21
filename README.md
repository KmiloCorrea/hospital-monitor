# 🏥 Sistema de Monitoreo de Infraestructura TI

## Versión Final

## Hospital Universitario San Rafael de Tunja

> Plataforma de microservicios para monitoreo en tiempo real de infraestructura tecnológica hospitalaria.

---

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Microservicios](#microservicios)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Equipo](#equipo)

---

## 🏗️ Arquitectura

```
                    ┌─────────────────┐
                    │    Frontend     │
                    │   (React+Vite)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   Puerto 3000   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                   │                    │
   ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
   │  Auth   │         │ Users   │         │Devices  │
   │  :3001  │         │  :3002  │         │  :3003  │
   └─────────┘         └─────────┘         └─────────┘
        │                   │                    │
   ┌────▼────┐         ┌────▼────┐         ┌────▼────┐
   │Locations│         │Metrics  │         │ Alerts  │
   │  :3004  │         │  :3005  │         │  :3006  │
   └─────────┘         └─────────┘         └─────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │    + Redis      │
                    └─────────────────┘
```

## 🔧 Microservicios

| Servicio          | Puerto | Descripción                            |
| ----------------- | ------ | -------------------------------------- |
| Auth Service      | 3001   | Autenticación y autorización JWT       |
| Users Service     | 3002   | Gestión de usuarios y roles            |
| Devices Service   | 3003   | Inventario de dispositivos             |
| Locations Service | 3004   | Ubicaciones físicas del hospital       |
| Metrics Service   | 3005   | Métricas de rendimiento en tiempo real |
| Alerts Service    | 3006   | Sistema de alertas y notificaciones    |

## ✅ Requisitos Previos

- Node.js >= 18.x
- PostgreSQL >= 14
- Redis >= 7
- npm o yarn

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd hospital-monitor

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Instalar dependencias de todos los servicios
npm run install:all

# 4. Configurar base de datos
npm run db:migrate
npm run db:seed

# 5. Iniciar todos los servicios
npm run dev
```

## 👥 Equipo de Desarrollo

| Nombre                           |
| -------------------------------- |
| Camilo Enrique Correa Barón      |
| Andrés Felipe Valderrama Montaña |
| Kevin Alejandro Rodríguez Vargas |

---

_Proyecto Integrador - Diseño e Implementación de Microservicios_
