import React, { useEffect, useState } from 'react';
import { Plus, X, Shield, Eye, Wrench } from 'lucide-react';
import { usersService } from '../services/api';

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

const ROLE_ICON  = { admin: Shield, technician: Wrench, viewer: Eye };
const ROLE_COLOR = { admin: '#7c3aed', technician: '#06b6d4', viewer: '#94a3b8' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role_id: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [u, r] = await Promise.all([usersService.getAll(), usersService.getRoles()]);
      setUsers(u.data.data || []);
      setRoles(r.data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setError('');
    if (!form.full_name || !form.email || !form.password || !form.role_id) {
      setError('Todos los campos son requeridos');
      return;
    }
    setSaving(true);
    try {
      await usersService.create(form);
      setShowModal(false);
      setForm({ full_name: '', email: '', password: '', role_id: '' });
      load();
    } catch (e) {
      setError(e.response?.data?.message || 'Error al crear usuario');
    } finally { setSaving(false); }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('¿Desactivar este usuario?')) return;
    await usersService.remove(id);
    load();
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }) : 'Nunca';

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Cargando usuarios...</div>;

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Usuarios</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{users.length} usuarios registrados</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '8px', color: '#0a0e1a', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            <Plus size={16} /> Nuevo Usuario
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {['admin', 'technician', 'viewer'].map(role => {
          const count = users.filter(u => u.role === role).length;
          const Icon = ROLE_ICON[role];
          const color = ROLE_COLOR[role];
          return (
            <div key={role} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{count}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{role}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Usuario', 'Email', 'Rol', 'Último acceso', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const Icon = ROLE_ICON[u.role] || Shield;
              const color = ROLE_COLOR[u.role] || '#94a3b8';
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{u.full_name}</div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '100px', background: `${color}20`, color, fontSize: '12px' }}>
                      <Icon size={11} /> {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{formatDate(u.last_login)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '100px', background: u.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: u.is_active ? '#10b981' : '#ef4444' }}>
                      {u.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {isAdmin && u.email !== currentUser.email && (
                      <button onClick={() => handleDeactivate(u.id)}
                        style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-red)', borderRadius: '6px', color: 'var(--accent-red)', cursor: 'pointer', fontSize: '12px' }}>
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Nuevo Usuario" onClose={() => setShowModal(false)}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-red)', borderRadius: '8px', padding: '10px', marginBottom: '12px', color: 'var(--accent-red)', fontSize: '13px' }}>{error}</div>}
          <input placeholder="Nombre completo *" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} style={inputStyle} />
          <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} />
          <input placeholder="Contraseña *" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={inputStyle} />
          <select value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})} style={inputStyle}>
            <option value="">Seleccionar rol *</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '12px', background: 'var(--accent-cyan)', border: 'none', borderRadius: '8px', color: '#0a0e1a', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
            {saving ? 'Guardando...' : 'Crear Usuario'}
          </button>
        </Modal>
      )}
    </div>
  );
}