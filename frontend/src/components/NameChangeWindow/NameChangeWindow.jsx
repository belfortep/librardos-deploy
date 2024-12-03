import React, { useState, useCallback } from 'react';
import axios from 'axios';

export default function CommunityNameChange({ communityId, currentName, onNameChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setNewName(currentName);
    setError('');
  }, [currentName]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setNewName('');
    setError('');
  }, []);

  const handleNameChange = useCallback((e) => {
    setNewName(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (newName && newName !== currentName) {
      setIsLoading(true);
      setError('');
      try {
        await axios.patch(`/api/community/${communityId}`, { name: newName });
        onNameChange(newName);
        handleClose();
      } catch (error) {
        console.error('Error al actualizar el nombre de la comunidad:', error);
        setError('No se pudo actualizar el nombre de la comunidad. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [communityId, newName, currentName, onNameChange, handleClose]);

  if (!isOpen) {
    return (
      <button onClick={handleOpen}>Cambiar nombre de la comunidad</button>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Cambiar nombre de la comunidad</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={handleNameChange}
            placeholder="Nuevo nombre de la comunidad"
          />
          {error && <p className="error">{error}</p>}
          <div className="button-group">
            <button type="button" onClick={handleClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !newName || newName === currentName}
            >
              {isLoading ? "Actualizando..." : "Actualizar nombre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}