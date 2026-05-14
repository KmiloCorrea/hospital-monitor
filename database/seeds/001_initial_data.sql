-- ============================================================
-- Datos iniciales del sistema
-- ============================================================

INSERT INTO roles (name, description, permissions) VALUES
('admin',       'Administrador del sistema',    '{"all": true}'),
('technician',  'Tecnico de TI',               '{"read": true, "write": true, "resolve_alerts": true}'),
('viewer',      'Solo lectura',                 '{"read": true}')
ON CONFLICT (name) DO NOTHING;

INSERT INTO device_types (name, icon, description) VALUES
('server',            'server',      'Servidores fisicos y virtuales'),
('switch',            'network',     'Switches de red'),
('router',            'router',      'Routers y equipos de enrutamiento'),
('printer',           'printer',     'Impresoras y multifuncionales'),
('workstation',       'monitor',     'Computadores de escritorio'),
('medical_equipment', 'activity',    'Equipos medicos conectados'),
('ups',               'battery',     'UPS y sistemas de alimentacion'),
('camera',            'camera',      'Camaras de seguridad IP')
ON CONFLICT (name) DO NOTHING;

INSERT INTO metric_types (name, unit, description, threshold_warning, threshold_critical) VALUES
('cpu_usage',       '%',   'Uso de CPU',                    80.00,  95.00),
('memory_usage',    '%',   'Uso de memoria RAM',            85.00,  95.00),
('disk_usage',      '%',   'Uso de disco duro',             85.00,  95.00),
('response_time',   'ms',  'Tiempo de respuesta',           500.00, 2000.00),
('bandwidth_in',    'Mbps','Ancho de banda entrante',       800.00, 950.00),
('bandwidth_out',   'Mbps','Ancho de banda saliente',       800.00, 950.00),
('temperature',     'C',   'Temperatura del dispositivo',   70.00,  85.00),
('packet_loss',     '%',   'Perdida de paquetes',           5.00,   20.00)
ON CONFLICT (name) DO NOTHING;

INSERT INTO alert_severities (name, color_hex, priority) VALUES
('info',        '#3B82F6', 4),
('warning',     '#F59E0B', 3),
('critical',    '#EF4444', 2),
('emergency',   '#7C3AED', 1)
ON CONFLICT (name) DO NOTHING;

INSERT INTO locations (name, floor, building, description) VALUES
('Centro de Datos',         'Sotano',   'Edificio Principal',  'Sala principal de servidores'),
('Urgencias',               'Piso 1',   'Edificio Principal',  'Unidad de Urgencias'),
('UCI Adultos',              'Piso 2',   'Edificio Principal',  'Unidad de Cuidados Intensivos Adultos'),
('UCI Neonatal',             'Piso 2',   'Edificio Principal',  'UCI Neonatal'),
('Radiologia e Imagenes',    'Piso 1',   'Edificio Anexo',      'Radiologia, TAC, Resonancia'),
('Laboratorio Clinico',      'Piso 1',   'Edificio Principal',  'Laboratorio de analisis'),
('Cirugia',                  'Piso 3',   'Edificio Principal',  'Salas de cirugia'),
('Administracion',           'Piso 4',   'Edificio Principal',  'Oficinas administrativas'),
('Farmacia',                 'Piso 1',   'Edificio Principal',  'Farmacia hospitalaria'),
('Sala de Servidores - Anexo','Sotano',  'Edificio Anexo',      'Sala de servidores secundaria');
