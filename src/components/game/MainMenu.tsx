'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { Building2, Play, FolderOpen, BookOpen, Trash2, Award, Shield, CheckCircle } from 'lucide-react';

interface MainMenuProps {
  onStartNewGame: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame }) => {
  const { savedGamesList, loadGame, refreshSavedGames } = useGame();
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [loadingSaveId, setLoadingSaveId] = useState<string | null>(null);

  const handleLoad = async (saveId: string) => {
    setLoadingSaveId(saveId);
    const success = await loadGame(saveId);
    if (!success) {
      alert('Falha ao carregar save.');
      setLoadingSaveId(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decoração de fundo com brasão */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(245, 158, 11, 0.04) 40%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '680px',
        width: '100%',
        textAlign: 'center',
        zIndex: 1
      }}>
        {/* Brasão */}
        <div style={{
          width: '74px',
          height: '74px',
          margin: '0 auto 1.5rem auto',
          background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
          border: '2px solid var(--border-gold)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Building2 size={40} color="#f59e0b" />
        </div>

        <h1 className="font-title" style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '0.08em',
          marginBottom: '0.5rem'
        }}>
          SIMULADOR POLÍTICO
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem',
          maxWidth: '520px',
          marginInline: 'auto'
        }}>
          Assuma a Presidência da República Federativa do Brasil. Negocie com o Congresso Nacional, indique ministros para o Supremo Tribunal Federal, governe os estados da Federação e exerça diplomacia global.
        </p>

        {/* Menu Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '360px', margin: '0 auto' }}>
          <button 
            onClick={onStartNewGame}
            className="btn btn-gold pulse-gold"
            style={{ padding: '0.9rem 1.5rem', fontSize: '1.05rem', width: '100%' }}
          >
            <Play size={20} fill="currentColor" /> Novo Jogo
          </button>

          <button 
            onClick={() => setShowLoadModal(true)}
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1.5rem', fontSize: '1rem', width: '100%' }}
          >
            <FolderOpen size={18} /> Carregar Jogo ({savedGamesList.length})
          </button>

          <button 
            onClick={() => setShowManualModal(true)}
            className="btn btn-outline"
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem', width: '100%' }}
          >
            <BookOpen size={18} /> Manual & Princípios
          </button>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '3.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>República Federativa do Brasil • Mandato Constitucional de 4 Anos (8 Turnos Semestrais)</div>
          <div>Tecnologia: Next.js + TypeScript + IndexedDB Dexie (Dados 100% no seu navegador)</div>
        </div>
      </div>

      {/* Modal Carregar Jogo */}
      {showLoadModal && (
        <div className="modal-overlay" onClick={() => setShowLoadModal(false)}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '1.75rem' }} onClick={e => e.stopPropagation()}>
            <h2 className="font-title" style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderOpen size={22} color="var(--accent-blue)" /> Partidas Salvas
            </h2>

            {savedGamesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                Nenhum jogo salvo encontrado no navegador.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
                {savedGamesList.map(save => (
                  <div key={save.id} style={{
                    padding: '0.85rem 1rem',
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-xs)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{save.saveName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {save.playerName} ({save.partyName}) • Turno {save.turn}/8 • {save.currentDate}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleLoad(save.id)}
                        disabled={loadingSaveId === save.id}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        {loadingSaveId === save.id ? 'Abrindo...' : 'Jogar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button onClick={() => setShowLoadModal(false)} className="btn btn-outline">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Manual & Princípios */}
      {showManualModal && (
        <div className="modal-overlay" onClick={() => setShowManualModal(false)}>
          <div className="glass-panel" style={{ maxWidth: '620px', width: '100%', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 className="font-title" style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={24} /> Princípios da Simulação
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <p>
                <strong>1. Princípio de Não-Doutrinação:</strong> Não existe ideologia obrigatoriamente correta no jogo. O liberalismo econômico, a social-democracia ou o desenvolvimentismo estatal possuem bônus, custos fiscais, riscos inflacionários e reações sociais específicas.
              </p>
              <p>
                <strong>2. O Presidente não governa sozinho:</strong> Para aprovar leis ordinárias, é necessário o apoio de pelo menos 257 deputados federais (maioria simples). Emendas Constitucionais exigem 308 votos (3/5). O Congresso Nacional tem autonomia para propor emendas modificativas ou rejeitar matérias.
              </p>
              <p>
                <strong>3. Supremo Tribunal Federal (11 Ministros):</strong> O tribunal atua como guardião da Constituição. Ministros possuem filosofias jurídicas (Garantistas, Legalistas, Pragmatistas, Ativistas Sociais). Ao completarem 75 anos, aposentam-se compulsoriamente, abrindo vagas para indicação presidencial e sabatina no Congresso.
              </p>
              <p>
                <strong>4. Consequências de Longo Prazo:</strong> Ajustes tributários, criação de programas sociais e cortes de infraestrutura reverberam turnos à frente nos índices de criminalidade, emprego, inflação e aprovação pública.
              </p>
            </div>

            <div style={{ marginTop: '1.75rem', textAlign: 'right' }}>
              <button onClick={() => setShowManualModal(false)} className="btn btn-gold">
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
