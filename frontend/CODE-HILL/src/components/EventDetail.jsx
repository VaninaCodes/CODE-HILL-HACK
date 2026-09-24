import React, { useState } from 'react';
import { Badge } from './badge';

export const EventDetail = ({ event }) => {
  const [isAttending, setIsAttending] = useState(false);
  const [hasStand, setHasStand] = useState(false);

  if (!event) {
    return (
      <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
        <p>Selecciona un evento de la lista para ver su detalle.</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      
      <div style={{ marginBottom: '15px' }}>
        {event.tags?.map((tag) => (
          <Badge key={tag} text={tag} />
        ))}
      </div>

      {/* Acciones de Asistencia / Stand */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setIsAttending(!isAttending)}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: isAttending ? '#16a34a' : '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {isAttending ? '✓ Asistirás a este evento' : 'Confirmar Asistencia'}
        </button>

        <button 
          onClick={() => setHasStand(!hasStand)}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: hasStand ? '#059669' : '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {hasStand ? '✓ Stand Reservado' : 'Confirmar Stand'}
        </button>
      </div>
    </div>
  );
};