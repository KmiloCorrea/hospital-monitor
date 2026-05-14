import React, { useEffect, useState } from 'react';

export default function Alerts() {
  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Alerts</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Módulo en desarrollo — implementar CRUD con los servicios de API.
      </p>
      <div style={{ marginTop: '24px', padding: '24px', background: 'var(--bg-card)', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
        TODO: Conectar con el servicio correspondiente usando ../services/api.js
      </div>
    </div>
  );
}
