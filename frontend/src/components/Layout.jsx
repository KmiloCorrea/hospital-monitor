import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Monitor, Bell, MapPin, Users, LogOut, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/',          label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/devices',   label: 'Dispositivos', icon: Monitor },
  { path: '/alerts',    label: 'Alertas',      icon: Bell },
  { path: '/locations', label: 'Ubicaciones',  icon: MapPin },
  { path: '/users',     label: 'Usuarios',     icon: Users },
];

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [open, setOpen] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <aside style={{
        width: open ? '240px' : '64px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s', overflow: 'hidden',
        position: 'sticky', top: 0, height: '100vh'
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', flexShrink: 0 }}>
            <img src="/src/assets/logo-hospital.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          {open && <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>HUSRT Monitor</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Hospital San Rafael</div>
          </div>}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end={path === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 10px', borderRadius: '8px', marginBottom: '4px',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(6,182,212,0.1)' : 'transparent',
                textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              })}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {open && label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)' }}>
          {open && <div style={{ padding: '8px 10px', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name || 'Usuario'}</div>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{user.role}</div>
          </div>}
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px', borderRadius: '8px', width: '100%',
            background: 'transparent', border: 'none', color: 'var(--accent-red)',
            cursor: 'pointer', fontSize: '14px', fontWeight: 500
          }}>
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {open && 'Cerrar sesión'}
          </button>
        </div>

        {/* Toggle */}
        <button onClick={() => setOpen(!open)} style={{
          position: 'absolute', top: '22px', right: '-12px',
          width: '24px', height: '24px', borderRadius: '50%',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {open ? <X size={12} /> : <Menu size={12} />}
        </button>
      </aside>

      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}