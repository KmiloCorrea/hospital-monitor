import React, { useEffect, useState } from 'react';
import { Monitor, Plus, Search, Wifi, WifiOff, AlertTriangle, HelpCircle, X } from 'lucide-react';
import { devicesService, locationsService } from '../services/api';

const STATUS_COLOR = {
  online:  { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
  offline: { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
  unknown: { bg: 'rgba(148,163,184,0.15)',color: '#94a3b8' },
};

const STATUS_ICON = { online: Wifi, offline: WifiOff, warning: AlertTriangle, unknown: HelpCircle };

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
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

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', hostname: '', ip_address: '', mac_address: '', device_type_id: '', location_id: '', manufacturer: '', model: '', is_critical: false });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [d, t, l] = await Promise.all([
        devicesService.getAll(),
        devicesService.getTypes(),
        locationsService.getAll(),
      ]);
      setDevices(d.data.data || []);
      setTypes(t.data.data || []);
      setLocations(l.data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || (d.ip_address || '').includes(search);
    const matchStatus = filterStatus ? d.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const handleSubmit = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      await devicesService.create(form);
      setShowModal(false);
      setForm({ name: '', hostname: '', ip_address: '', mac_address: '', device_type_id: '', location_id: '', manufacturer: '', model: '', is_critical: false });
      load();
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id, status) => {
    await devicesService.updateStatus(id, status);
    load();
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Cargando dispositivos...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Dispositivos</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{devices.length} dispositivos registrados</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '8px', color: '#0a0e1a', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          <Plus size={16} /> Nuevo Dispositivo
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o IP..."
            style={{ ...inputStyle, paddingLeft: '38px', marginBottom: 0 }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ ...inputStyle, width: 'auto', marginBottom: 0 }}>
          <option value="">Todos los estados</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="warning">Warning</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Dispositivo', 'IP', 'Tipo', 'Ubicación', 'Estado', 'Crítico', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => {
              const s = STATUS_COLOR[d.status] || STATUS_COLOR.unknown;
              const Icon = STATUS_ICON[d.status] || HelpCircle;
              return (
                <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{d.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{d.hostname || '—'}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.ip_address || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.type_name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>{d.location_name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '100px', background: s.bg, color: s.color, fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                      <Icon size={12} /> {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', color: d.is_critical ? 'var(--accent-red)' : 'var(--text-muted)' }}>{d.is_critical ? '⚠ Crítico' : '—'}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={d.status} onChange={e => handleStatusChange(d.id, e.target.value)}
                      style={{ padding: '4px 8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px', cursor: 'pointer' }}>
                      <option value="online">online</option>
                      <option value="offline">offline</option>
                      <option value="warning">warning</option>
                      <option value="unknown">unknown</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <Monitor size={32} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
            No se encontraron dispositivos
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Nuevo Dispositivo" onClose={() => setShowModal(false)}>
          <input placeholder="Nombre *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="Hostname" value={form.hostname} onChange={e => setForm({...form, hostname: e.target.value})} style={inputStyle} />
          <input placeholder="Dirección IP" value={form.ip_address} onChange={e => setForm({...form, ip_address: e.target.value})} style={inputStyle} />
          <input placeholder="MAC Address" value={form.mac_address} onChange={e => setForm({...form, mac_address: e.target.value})} style={inputStyle} />
          <select value={form.device_type_id} onChange={e => setForm({...form, device_type_id: e.target.value})} style={inputStyle}>
            <option value="">Tipo de dispositivo</option>
            {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={form.location_id} onChange={e => setForm({...form, location_id: e.target.value})} style={inputStyle}>
            <option value="">Ubicación</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <input placeholder="Fabricante" value={form.manufacturer} onChange={e => setForm({...form, manufacturer: e.target.value})} style={inputStyle} />
          <input placeholder="Modelo" value={form.model} onChange={e => setForm({...form, model: e.target.value})} style={inputStyle} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_critical} onChange={e => setForm({...form, is_critical: e.target.checked})} />
            Dispositivo crítico
          </label>
          <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '12px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '8px', color: '#0a0e1a', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            {saving ? 'Guardando...' : 'Crear Dispositivo'}
          </button>
        </Modal>
      )}
    </div>
  );
}
