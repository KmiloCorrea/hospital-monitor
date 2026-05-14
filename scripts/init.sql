-- ============================================
-- HOSPITAL UNIVERSITARIO SAN RAFAEL DE TUNJA
-- Sistema de Monitoreo de Infraestructura TI
-- Script de Inicialización de Base de Datos
-- ============================================

CREATE DATABASE hospital_monitor;
\c hospital_monitor;

-- ============================================
-- TABLA: roles
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: locations
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: device_types
-- ============================================
CREATE TABLE IF NOT EXISTS device_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: devices
-- ============================================
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    device_type_id INTEGER REFERENCES device_types(id) ON DELETE SET NULL,
    location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance', 'error')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: metric_types
-- ============================================
CREATE TABLE IF NOT EXISTS metric_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    unit VARCHAR(30),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: metrics
-- ============================================
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
    metric_type_id INTEGER REFERENCES metric_types(id) ON DELETE SET NULL,
    value DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: alert_severities
-- ============================================
CREATE TABLE IF NOT EXISTS alert_severities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    level INTEGER UNIQUE NOT NULL,
    color VARCHAR(7),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA: alerts
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id) ON DELETE CASCADE,
    severity_id INTEGER REFERENCES alert_severities(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES para mejor rendimiento
-- ============================================
CREATE INDEX idx_metrics_device_id ON metrics(device_id);
CREATE INDEX idx_metrics_recorded_at ON metrics(recorded_at);
CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_is_resolved ON alerts(is_resolved);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- DATOS INICIALES (Seeds)
-- ============================================

-- Roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrador del sistema con acceso total'),
    ('technician', 'Técnico de TI con acceso a monitoreo y dispositivos'),
    ('viewer', 'Solo puede visualizar el dashboard')
ON CONFLICT (name) DO NOTHING;

-- Severidades de alertas
INSERT INTO alert_severities (name, level, color, description) VALUES
    ('info',     1, '#3B82F6', 'Información general, sin acción requerida'),
    ('warning',  2, '#F59E0B', 'Advertencia, revisar pronto'),
    ('critical', 3, '#EF4444', 'Crítico, requiere atención inmediata'),
    ('emergency',4, '#7C3AED', 'Emergencia, sistema en riesgo')
ON CONFLICT (name) DO NOTHING;

-- Tipos de dispositivos
INSERT INTO device_types (name, description) VALUES
    ('server',          'Servidor físico o virtual'),
    ('network_switch',  'Switch de red'),
    ('router',          'Router o firewall'),
    ('workstation',     'Equipo de escritorio'),
    ('medical_device',  'Equipo médico conectado'),
    ('printer',         'Impresora de red'),
    ('ups',             'Sistema de alimentación ininterrumpida'),
    ('camera',          'Cámara de seguridad IP')
ON CONFLICT (name) DO NOTHING;

-- Tipos de métricas
INSERT INTO metric_types (name, unit, description) VALUES
    ('cpu_usage',       '%',    'Uso del procesador'),
    ('memory_usage',    '%',    'Uso de memoria RAM'),
    ('disk_usage',      '%',    'Uso del disco duro'),
    ('network_in',      'Mbps', 'Tráfico de red entrante'),
    ('network_out',     'Mbps', 'Tráfico de red saliente'),
    ('temperature',     '°C',   'Temperatura del dispositivo'),
    ('response_time',   'ms',   'Tiempo de respuesta'),
    ('uptime',          'h',    'Tiempo en línea')
ON CONFLICT (name) DO NOTHING;

-- Ubicaciones del hospital
INSERT INTO locations (name, building, floor, description) VALUES
    ('Centro de Datos Principal',   'Edificio Administrativo', 'Sótano', 'Sala principal de servidores'),
    ('Urgencias',                   'Edificio Central',        '1',      'Área de urgencias y emergencias'),
    ('UCI',                         'Edificio Central',        '3',      'Unidad de Cuidados Intensivos'),
    ('Radiología',                   'Edificio Diagnóstico',    '1',      'Departamento de imágenes diagnósticas'),
    ('Consultorios',                 'Edificio Consultas',      '2',      'Área de consultas externas'),
    ('Laboratorio Clínico',          'Edificio Diagnóstico',    'Sótano', 'Laboratorios clínicos'),
    ('Administración',               'Edificio Administrativo', '2',      'Área administrativa y directiva')
ON CONFLICT DO NOTHING;

-- Usuario administrador por defecto (password: Admin2024!)
-- Hash bcrypt de "Admin2024!"
INSERT INTO users (name, email, password, role_id, is_active) VALUES
    ('Administrador Sistema', 'admin@hospitaltunja.gov.co',
     '$2b$10$rOzJqhFpMkFKvbKmTL4nj.MWWv3rFNXz9IKvxgHaX6nBXYe1VQJRC',
     (SELECT id FROM roles WHERE name = 'admin'), TRUE)
ON CONFLICT (email) DO NOTHING;

RAISE NOTICE '✅ Base de datos inicializada correctamente';
