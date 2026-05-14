import React, { useEffect, useState } from 'react';
import { Monitor, Bell, AlertTriangle, CheckCircle, Activity, Wifi, WifiOff } from 'lucide-react';
import { devicesService, alertsService } from '../services/api';

function StatCard({ icon: Icon, label, value, color, subtitle }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</div>
        {subtitle && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{subtitle}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [alertStats, setAlertStats] = useState({});
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      devicesService.getAll(),
      alertsService.getStats(),
      alertsService.getActive(),
    ]).then(([d, s, a]) => {
      setDevices(d.data.data || []);
      setAlertStats(s.data.data || {});
      setActiveAlerts((a.data.data || []).slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const online = devices.filter(d => d.status === 'online').length;
  const offline = devices.filter(d => d.status === 'offline').length;
  const warning = devices.filter(d => d.status === 'warning').length;

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Cargando dashboard...</div>;

  const severityColor = { emergency: '#7c3aed', critical: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>Visión general de infraestructura TI — Hospital San Rafael</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={Monitor}       label="Total dispositivos"  value={devices.length}          color="var(--accent-cyan)" />
        <StatCard icon={Wifi}          label="En línea"             value={online}                   color="var(--accent-green)" subtitle={`${devices.length ? Math.round(online/devices.length*100) : 0}% disponibilidad`} />
        <StatCard icon={WifiOff}       label="Fuera de línea"       value={offline}                  color="var(--accent-red)" />
        <StatCard icon={AlertTriangle} label="Alertas activas"      value={alertStats.active_total || 0} color="var(--accent-yellow)" />
        <StatCard icon={Bell}          label="Críticas/Emergencias"  value={(parseInt(alertStats.critical||0) + parseInt(alertStats.emergency||0))} color="var(--accent-red)" />
        <StatCard icon={CheckCircle}   label="Con advertencia"      value={warning}                  color="var(--accent-yellow)" />
      </div>

      {/* Alerts + Device status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Active alerts */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Alertas Activas</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{alertStats.active_total || 0} total</span>
          </div>
          {activeAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <CheckCircle size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.5 }} />
              Sin alertas activas
            </div>
          ) : activeAlerts.map(alert => (
            <div key={alert.id} style={{ padding: '12px', borderRadius: '8px', marginBottom: '8px', background: 'var(--bg-secondary)', borderLeft: `3px solid ${severityColor[alert.severity_name] || '#fff'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{alert.title}</span>
                <span style={{ fontSize: '11px', color: severityColor[alert.severity_name], fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{alert.severity_name}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{alert.device_name || 'Sin dispositivo'}</div>
            </div>
          ))}
        </div>

        {/* Device status list */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Estado de Dispositivos</h2>
          <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
            {devices.slice(0, 10).map(d => {
              const statusColor = { online: 'var(--accent-green)', offline: 'var(--accent-red)', warning: 'var(--accent-yellow)', unknown: 'var(--text-muted)' }[d.status] || 'var(--text-muted)';
              return (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{d.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{d.ip_address || 'Sin IP'}</div>
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: `${statusColor}20`, color: statusColor, fontFamily: 'var(--font-mono)' }}>{d.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
