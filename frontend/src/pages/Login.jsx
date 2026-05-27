import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await authService.login(form.email, form.password);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: '20px' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.05) 0%, transparent 50%)' }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '90px', height: '90px', margin: '0 auto 16px' }}>
            <img src="/src/assets/logo-hospital.png" alt="Logo Hospital San Rafael" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Monitor TI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Hospital Universitario San Rafael · Tunja</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Iniciar Sesión</h2>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-red)', borderRadius: '8px', padding: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontSize: '13px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Correo electrónico</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                  placeholder="admin@husrt.gov.co" />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required
                  style={{ width: '100%', padding: '10px 12px 10px 38px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                  placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              background: loading ? 'var(--text-muted)' : 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-main)'
            }}>
              {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}