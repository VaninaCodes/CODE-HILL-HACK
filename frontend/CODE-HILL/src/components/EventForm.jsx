import React, { useState } from 'react';
import { Badge } from './badge';

export const EventForm = ({ onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  // Tagger dinámico: agrega etiqueta al presionar Enter o Coma
  const handleKeyDownTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(',', '');
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newEvent = {
      id: Date.now(),
      title,
      description,
      tags,
      attendeesCount: 0,
      hasStandConfirmed: false,
    };

    if (onAddEvent) onAddEvent(newEvent);

    // Resetear formulario
    setTitle('');
    setDescription('');
    setTags([]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
      <h3>Crear Publicación / Evento</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          placeholder="Título del evento..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ width: '100%', padding: '8px' }}
          required 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <textarea 
          placeholder="Descripción del evento..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          style={{ width: '100%', padding: '8px', minHeight: '80px' }}
          required 
        />
      </div>

      {/* Tagger Dinámico */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ fontSize: '0.9rem' }}>Etiquetas (Presiona Enter para agregar):</label>
        <input 
          type="text" 
          value={tagInput} 
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDownTag}
          placeholder="Ej: React, Hackathon, Tech"
          style={{ width: '100%', padding: '8px', marginTop: '4px' }}
        />
        <div style={{ marginTop: '8px' }}>
          {tags.map((tag) => (
            <Badge key={tag} text={tag} onRemove={() => handleRemoveTag(tag)} />
          ))}
        </div>
      </div>

      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Publicar Evento
      </button>
    </form>
  );
};