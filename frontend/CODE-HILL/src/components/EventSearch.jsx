import React, { useState } from 'react';
import { Badge } from './badge';

export const EventSearch = ({ events = [], onSelectEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Extraer todas las etiquetas únicas presentes en los eventos
  const allTags = Array.from(new Set(events.flatMap((event) => event.tags || [])));

  // Filtrado de eventos
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? event.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Buscador y Filtros</h3>
      
      {/* Barra de búsqueda */}
      <input 
        type="text" 
        placeholder="Buscar por palabra clave..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      {/* Filtros por etiquetas */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '0.9rem', marginRight: '8px' }}>Filtrar por etiqueta:</span>
        <button 
          onClick={() => setSelectedTag('')} 
          style={{ padding: '2px 8px', marginRight: '4px', cursor: 'pointer' }}
        >
          Todas
        </button>
        {allTags.map((tag) => (
          <button 
            key={tag} 
            onClick={() => setSelectedTag(tag)}
            style={{
              padding: '2px 8px',
              marginRight: '4px',
              cursor: 'pointer',
              fontWeight: selectedTag === tag ? 'bold' : 'normal'
            }}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Lista de resultados */}
      <div style={{ marginTop: '10px' }}>
        {filteredEvents.length === 0 ? (
          <p>No se encontraron eventos.</p>
        ) : (
          filteredEvents.map((event) => (
            <div 
              key={event.id} 
              onClick={() => onSelectEvent(event)}
              style={{
                borderBottom: '1px solid #333',
                padding: '8px 0',
                cursor: 'pointer'
              }}
            >
              <h4 style={{ margin: '0 0 4px 0' }}>{event.title}</h4>
              <div>
                {event.tags?.map((t) => (
                  <Badge key={t} text={t} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};