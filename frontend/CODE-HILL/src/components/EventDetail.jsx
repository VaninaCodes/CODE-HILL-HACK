import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from "../components/badge";
import { attendEvent, cancelAttendance, getEventAttendees } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const EventDetail = ({ event }) => {
  const { usuario } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [standName, setStandName] = useState('');
  const [error, setError] = useState('');

  const loadAttendees = useCallback(async () => {
    if (!event) return;
    try {
      const data = await getEventAttendees(event.id);
      setAttendees(data);
    } catch (err) {
      console.error(err);
    }
  }, [event]);

  useEffect(() => {
    loadAttendees();
  }, [loadAttendees]);

  if (!event) {
    return (
      <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
        <p>Selecciona un evento de la lista para ver su detalle.</p>
      </div>
    );
  }

  const miAsistencia = usuario
    ? attendees.find((a) => a.userId === usuario.id)
    : null;

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleString('es-AR', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : null;

  const handleToggleAttend = async () => {
    if (!usuario) {
      setError('Tenés que iniciar sesión para confirmar tu asistencia.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (miAsistencia) {
        await cancelAttendance(event.id, usuario.id);
      } else {
        await attendEvent(event.id, { userId: usuario.id });
      }
      await loadAttendees();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al confirmar la asistencia');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStand = async () => {
    if (!usuario) {
      setError('Tenés que iniciar sesión para confirmar tu stand.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (miAsistencia?.standName) {
        await cancelAttendance(event.id, usuario.id);
      } else {
        await attendEvent(event.id, { userId: usuario.id, standName: standName || 'Mi stand' });
      }
      await loadAttendees();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al confirmar el stand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
      {event.image && (
        <img
          src={event.image.startsWith('http') ? event.image : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${event.image}`}
          alt={event.title}
          style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }}
        />
      )}

      <h2>{event.title}</h2>
      <p>{event.description}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '10px 0', fontSize: '0.9rem', color: '#ccc' }}>
        {formattedDate && <span>📅 {formattedDate}</span>}
        {event.location && <span>📍 {event.location}</span>}
        {event.organizer && <span>🏢 Organiza: {event.organizer.username}</span>}
      </div>

      <div style={{ marginBottom: '15px' }}>
        {event.tags?.map((tag) => (
          <Badge key={tag.id || tag} text={tag.name || tag} />
        ))}
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '0.9rem' }}>{error}</p>}

      {/* Acciones de Asistencia / Stand */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={handleToggleAttend}
          disabled={loading}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: miAsistencia ? '#16a34a' : '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {miAsistencia ? '✓ Asistirás a este evento' : 'Confirmar Asistencia'}
        </button>

        {!miAsistencia?.standName && (
          <input
            type="text"
            placeholder="Nombre del stand"
            value={standName}
            onChange={(e) => setStandName(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444' }}
          />
        )}

        <button
          onClick={handleToggleStand}
          disabled={loading}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: miAsistencia?.standName ? '#059669' : '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {miAsistencia?.standName ? '✓ Stand Reservado' : 'Confirmar Stand'}
        </button>
      </div>

      {/* Lista de asistentes / stands confirmados */}
      <div style={{ marginTop: '20px' }}>
        <h4>Asistentes confirmados ({attendees.length})</h4>
        {attendees.length === 0 ? (
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Todavía nadie confirmó asistencia.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {attendees.map((a) => (
              <li key={a.id} style={{ fontSize: '0.9rem', borderBottom: '1px solid #333', padding: '4px 0' }}>
                {a.User?.username || 'Usuario'}
                {a.standName ? ` — 🏪 ${a.standName}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};