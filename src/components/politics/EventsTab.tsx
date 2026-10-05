'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, DollarSign } from 'lucide-react';
import type { GameEvent, GameEventOption } from '@/game/types';

export const EventsTab: React.FC = () => {
  const { state, resolveActiveEvent } = useGame();
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  if (!state) return null;

  const { activeEvents, resolvedEvents } = state;

  const handleChoose = (eventId: string, optionId: string) => {
    setResolvingId(`${eventId}_${optionId}`);
    setTimeout(() => {
      resolveActiveEvent(eventId, optionId);
      setResolvingId(null);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <AlertTriangle size={26} color="var(--accent-crimson)" />
          <h2 className="font-title" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Crises Nacionais & Dilemas de Governo
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '680px' }}>
          Eventos imprevistos, greves, escândalos e pressões institucionais exigem tomada de decisão rápida pelo Presidente da República. Toda escolha acarreta trade-offs: ganhos de curto prazo podem minar alianças no Congresso ou gerar passivos fiscais no futuro.
        </p>
      </div>

      {/* Crises Ativas */}
      <div>
        <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} color="var(--accent-gold)" /> Dilemas Ativos Aguardando Decisão ({activeEvents.length})
        </h3>

        {activeEvents.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={36} color="var(--accent-emerald)" style={{ margin: '0 auto 0.75rem auto' }} />
            <div>Nenhuma crise urgente em andamento neste semestre. O país desfruta de estabilidade relativa.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeEvents.map(event => (
              <div
                key={event.id}
                className="glass-panel"
                style={{
                  padding: '1.75rem',
                  borderLeft: '4px solid var(--accent-crimson)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {event.title}
                  </h4>
                  <span className="badge badge-crimson">Crise do Turno {event.turn}</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  {event.description}
                </p>

                {/* Opções de Decisão Presidencial */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {event.options.map(option => {
                    const isProcessing = resolvingId === `${event.id}_${option.id}`;

                    return (
                      <div
                        key={option.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: 'var(--shadow-xs)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem 1.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                            {option.label}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                            {option.description}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>
                            Impactos Esperados: {option.consequences.description}
                          </div>
                        </div>

                        <button
                          onClick={() => handleChoose(event.id, option.id)}
                          disabled={isProcessing}
                          className="btn btn-primary"
                          style={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}
                        >
                          {isProcessing ? 'Executando...' : 'Tomar Esta Decisão'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Histórico de Crises Resolvidas */}
      {resolvedEvents.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3 className="font-title" style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Histórico de Decisões Tomadas ({resolvedEvents.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resolvedEvents.map(event => {
              const chosen = event.options.find(o => o.id === event.chosenOptionId);

              return (
                <div key={event.id} style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-xs)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{event.title}</strong>
                    <span className="badge badge-emerald">Resolvido no Turno {event.turn}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Opção Adotada: <strong>{chosen?.label}</strong>
                  </div>
                  <div style={{ color: 'var(--accent-gold)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    {chosen?.consequences.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
