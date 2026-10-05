'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { Save, Check, X } from 'lucide-react';

interface SaveModalProps {
  onClose: () => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ onClose }) => {
  const { state, saveGame } = useGame();
  const [saveName, setSaveName] = useState(state ? `Mandato ${state.player.name} - ${state.currentDate}` : '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveName.trim() || saving) return;
    setSaving(true);
    const res = await saveGame(saveName);
    setSaving(false);
    if (res) {
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      alert('Erro ao salvar no banco local.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Save size={24} color="var(--accent-gold)" />
          <h3 className="font-title" style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
            Salvar Partida no Navegador
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          O jogo utiliza IndexedDB com Dexie. Seus dados ficam salvos localmente e seguros no seu navegador.
        </p>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Identificação do Ponto de Salvamento
            </label>
            <input
              type="text"
              className="input-text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Nome do save..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancelar
            </button>
            <button type="submit" disabled={saving || savedSuccess} className="btn btn-gold">
              {savedSuccess ? (
                <>
                  <Check size={16} /> Salvo com Sucesso!
                </>
              ) : saving ? (
                'Salvando...'
              ) : (
                'Salvar Partida'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
