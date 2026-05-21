import React, { useEffect, useState } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import { locationsService } from '../services/api';

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '24px' }}>
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

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({ name: '', floor: '', building: '', description: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await locationsService.getAll();
      setLocations(data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSelect = async (loc) => {
    setSelected(loc);
    const { data } = await locationsService.getDevices(loc.id);
    setDevices(data.data || []);
  };

  const handleSubmit = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      await locationsService.create(form);
      setShowModal(false);
      setForm({ name: '', floor: '', building: '', description: '' });
      load();
    } finally { setSaving(false); }
  };

  const statusColor = { online: '#10b981', offline: '#ef4444', warning: '#f59e0b', unknown: '#94a3b8' };

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Cargando ubicaciones...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Ubicaciones</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{locations.length} ubicaciones registradas</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '8px', color: '#0a0e1a', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          <Plus size={16} /> Nueva Ubicación
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', alignContent: 'start' }}>
          {locations.map(loc => (
            <div key={loc.id} onClick={() => handleSelect(loc)}
              style={{ background: selected?.id === loc.id ? 'var(--bg-hover)' : 'var(--bg-card)', border: `1px solid ${selected?.id === loc.id ? 'var(--accent-cyan)' : 'var(--border)'}`, borderRadius: '12px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="var(--accent-cyan)" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{loc.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{loc.floor} — {loc.building}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{loc.description}</span>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {loc.device_count || 0} dispositivos
                </span>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Dispositivos en {selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            {devices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>Sin dispositivos en esta ubicación</div>
            ) : devices.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{d.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{d.ip_address || '—'}</div>
                </div>
                <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: `${statusColor[d.status]}20`, color: statusColor[d.status] }}>{d.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Nueva Ubicación" onClose={() => setShowModal(false)}>
          <input placeholder="Nombre *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="Piso (ej: Piso 1, Sótano)" value={form.floor} onChange={e => setForm({...form, floor: e.target.value})} style={inputStyle} />
          <input placeholder="Edificio" value={form.building} onChange={e => setForm({...form, building: e.target.value})} style={inputStyle} />
          <input placeholder="Descripción" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={inputStyle} />
          <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '12px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '8px', color: '#0a0e1a', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            {saving ? 'Guardando...' : 'Crear Ubicación'}
          </button>
        </Modal>
      )}
    </div>
  );
}