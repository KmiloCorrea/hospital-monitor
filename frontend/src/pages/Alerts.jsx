import React, { useEffect, useState } from 'react';
import { Bell, Plus, CheckCircle, X } from 'lucide-react';
import { alertsService } from '../services/api';

const SEV_COLOR = {
  emergency: '#7c3aed',
  critical:  '#ef4444',
  warning:   '#f59e0b',
  info:      '#3b82f6',
};

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', background: 'var(--bg-secondary)',
  border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)',
  fontSize: '14px', outline: 'none', marginBottom: '12px',
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterResolved, setFilterResolved] = useState('false');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', severity_id: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [a, s, st] = await Promise.all([
        alertsService.getAll({ is_resolved: filterResolved, limit: 100 }),
        alertsService.getSeverities(),
        alertsService.getStats(),
      ]);
      setAlerts(a.data.data || []);
      setSeverities(s.data.data || []);
      setStats(st.data.data || {});
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterResolved]);

  const handleResolve = async (id) => {
    await alertsService.resolve(id);
    load();
  };

  const handleSubmit = async () => {
    if (!form.title || !form.message || !form.severity_id) return;
    setSaving(true);
    try {
      await alertsService.create(form);
      setShowModal(false);
      setForm({ title: '', message: '', severity_id: '' });
      load();
    } finally { setSaving(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Cargando alertas...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Alertas</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{stats.active_total || 0} alertas activas</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'var(--accent-red)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          <Plus size={16} /> Nueva Alerta
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Emergency', value: stats.emergency || 0, color: '#7c3aed' },
          { label: 'Critical',  value: stats.critical  || 0, color: '#ef4444' },
          { label: 'Warning',   value: stats.warning   || 0, color: '#f59e0b' },
          { label: 'Info',      value: stats.info      || 0, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: `1px solid ${s.color}40`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[['false', 'Activas'], ['true', 'Resueltas'], ['', 'Todas']].map(([val, label]) => (
          <button key={val} onClick={() => setFilterResolved(val)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: filterResolved === val ? 'var(--accent-cyan)' : 'var(--bg-card)', color: filterResolved === val ? '#0a0e1a' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <CheckCircle size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
            No hay alertas
          </div>
        ) : alerts.map(alert => {
          const color = SEV_COLOR[alert.severity_name] || '#94a3b8';
          return (
            <div key={alert.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderLeft: `4px solid ${color}`, borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: `${color}20`, color, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', fontWeight: 600 }}>{alert.severity_name}</span>
                  {alert.is_resolved && <span style={{ fontSize: '11px', color: 'var(--accent-green)' }}>✓ Resuelta</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{alert.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{alert.message}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {alert.device_name && `📡 ${alert.device_name}  •  `}{formatDate(alert.created_at)}
                </div>
              </div>
              {!alert.is_resolved && (
                <button onClick={() => handleResolve(alert.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-green)', borderRadius: '8px', color: 'var(--accent-green)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  <CheckCircle size={14} /> Resolver
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="Nueva Alerta" onClose={() => setShowModal(false)}>
          <input placeholder="Título *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={inputStyle} />
          <textarea placeholder="Mensaje *" value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
          <select value={form.severity_id} onChange={e => setForm({...form, severity_id: e.target.value})} style={inputStyle}>
            <option value="">Severidad *</option>
            {severities.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '12px', background: 'var(--accent-red)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            {saving ? 'Guardando...' : 'Crear Alerta'}
          </button>
        </Modal>
      )}
    </div>
  );
}