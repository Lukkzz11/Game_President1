'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  AlertTriangle, 
  Flame, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShieldAlert, 
  Check, 
  Clock,
  Landmark
} from 'lucide-react';
import type { GameEventOption } from '@/game/types';

export const UrgentCrisisModal: React.FC = () => {
  const { state, resolveActiveEvent, dismissUrgentDilemma } = useGame();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  if (!state || !state.urgentDilemma) return null;

  const dilemma = state.urgentDilemma;

  const handleExecute = (optionId: string) => {
    setIsExecuting(true);
    setTimeout(() => {
      resolveActiveEvent(dilemma.id, optionId);
      setIsExecuting(false);
      setSelectedOptionId(null);
    }, 600);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'scandal':
        return <span className="badge badge-crimson"><Flame size={12} /> Escândalo & Corrupção</span>;
      case 'economic':
        return <span className="badge badge-gold"><TrendingDown size={12} /> Choque Econômico</span>;
      case 'judicial':
        return <span className="badge badge-purple"><Scale size={12} /> Conflito Judiciário</span>;
      case 'political':
        return <span className="badge badge-blue"><Landmark size={12} /> Pressão Parlamentar</span>;
      default:
        return <span className="badge badge-crimson"><ShieldAlert size={12} /> Crise de Segurança & Social</span>;
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100, padding: '1rem' }}>
      <div className="crisis-modal">
        {/* Banner de Emergência Nacional - Fixo no Topo */}
        <div className="crisis-alert-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={17} className="pulse-red" />
            <span style={{ fontWeight: 800, fontSize: '0.82rem' }}>Gabinete de Crise • Despacho Imediato</span>
          </div>
          <span className="badge" style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>
            Semestre {dilemma.turn}
          </span>
        </div>

        {/* Corpo com Scroll Automático e Tamanho Otimizado */}
        <div className="crisis-modal-body">
          {/* Caixa Estilo Telex / Gabinete de Crise */}
          <div style={{
            border: '1.5px solid #ef4444',
            borderRadius: '8px',
            background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)',
            padding: '0.75rem 1rem',
            marginBottom: '0.85rem',
            boxShadow: '0 2px 10px rgba(239, 68, 68, 0.08)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px dashed #fca5a5',
              paddingBottom: '0.4rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#b91c1c', fontSize: '0.74rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} className="urgent-pulse" />
                DESPACHO DE EMERGÊNCIA NACIONAL
              </div>
              {getCategoryBadge(dilemma.category)}
            </div>

            <h2 className="font-title" style={{ fontSize: '1.12rem', color: '#1e293b', lineHeight: '1.25', marginBottom: '0.45rem', fontWeight: 800 }}>
              {dilemma.title}
            </h2>

            <p style={{
              fontSize: '0.82rem',
              color: '#334155',
              lineHeight: '1.45',
              marginBottom: '0.65rem'
            }}>
              {dilemma.description}
            </p>

            {/* Quadro de Projeção de Choque Imediato */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #fecaca',
              borderRadius: '5px',
              padding: '0.45rem 0.75rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Impacto Preliminar:
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {dilemma.category === 'economic' && (
                  <>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: 700 }}>
                      ⚡ Choque na Oferta
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontWeight: 700 }}>
                      📈 Pressão Inflacionária
                    </span>
                  </>
                )}
                {dilemma.category === 'scandal' && (
                  <>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: 700 }}>
                      📰 Manchetes Negativas
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#ede9fe', color: '#5b21b6', borderRadius: '4px', fontWeight: 700 }}>
                      🏛️ Risco de CPI no Congresso
                    </span>
                  </>
                )}
                {dilemma.category === 'judicial' && (
                  <>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#ede9fe', color: '#5b21b6', borderRadius: '4px', fontWeight: 700 }}>
                      ⚖️ ADI em Pauta no STF
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: 700 }}>
                      ⚠️ Tensão Institucional
                    </span>
                  </>
                )}
                {dilemma.category === 'political' && (
                  <>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: 700 }}>
                      🗳️ Risco à Base Aliada
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: 700 }}>
                      📜 Bloqueio de Pautas
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Deliberações Oficiais do Presidente da República:
          </div>

          {/* Opções de Decisão com Trade-offs Explícitos e Compactos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {dilemma.options.map((option: GameEventOption) => {
              const isSelected = selectedOptionId === option.id;
              const c = option.consequences;

              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedOptionId(option.id)}
                  className="crisis-choice-card"
                  style={{
                    borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    boxShadow: isSelected ? '0 0 10px rgba(37, 99, 235, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)', fontSize: '0.88rem' }}>
                      {option.label}
                    </div>
                    {isSelected && (
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                        <Check size={11} /> Selecionada
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.45rem', lineHeight: '1.35' }}>
                    {option.description}
                  </p>

                  {/* Badges de Impacto (Ganhos / Custos) */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.35rem' }}>
                    {/* Ganhos */}
                    {c.popularityChange && c.popularityChange > 0 && (
                      <span className="tradeoff-gain" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <TrendingUp size={11} /> +{c.popularityChange}% Aprovação
                      </span>
                    )}
                    {c.inflationChange && c.inflationChange < 0 && (
                      <span className="tradeoff-gain" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <TrendingDown size={11} /> {c.inflationChange}% Inflação
                      </span>
                    )}
                    {c.congressSupportChange && c.congressSupportChange > 0 && (
                      <span className="tradeoff-gain" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <Landmark size={11} /> +{c.congressSupportChange} Votos Base
                      </span>
                    )}
                    {c.gdpGrowthChange && c.gdpGrowthChange > 0 && (
                      <span className="tradeoff-gain" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <TrendingUp size={11} /> +{c.gdpGrowthChange}% PIB
                      </span>
                    )}

                    {/* Perdas / Custos */}
                    {option.costs?.money && (
                      <span className="tradeoff-loss" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        💰 Custo: R$ {option.costs.money} bi
                      </span>
                    )}
                    {c.popularityChange && c.popularityChange < 0 && (
                      <span className="tradeoff-loss" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <TrendingDown size={11} /> {c.popularityChange}% Aprovação
                      </span>
                    )}
                    {c.inflationChange && c.inflationChange > 0 && (
                      <span className="tradeoff-loss" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <TrendingUp size={11} /> +{c.inflationChange}% Inflação
                      </span>
                    )}
                    {c.congressSupportChange && c.congressSupportChange < 0 && (
                      <span className="tradeoff-loss" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <Landmark size={11} /> {c.congressSupportChange} Votos Base
                      </span>
                    )}
                    {c.publicDebtChange && c.publicDebtChange > 0 && (
                      <span className="tradeoff-loss" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                        <TrendingUp size={11} /> +{c.publicDebtChange}% Dívida Pública
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.25rem' }}>
                    &ldquo;{c.description}&rdquo;
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé Fixo com Botões Sempre Visíveis */}
        <div className="crisis-modal-footer">
          <button
            onClick={dismissUrgentDilemma}
            className="btn btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
            title="Postergar decisão e analisar painéis de governo"
          >
            <Clock size={13} /> Adiar para Depois
          </button>

          <button
            onClick={() => selectedOptionId && handleExecute(selectedOptionId)}
            disabled={!selectedOptionId || isExecuting}
            className="btn btn-gold"
            style={{
              fontSize: '0.84rem',
              padding: '0.5rem 1.25rem',
              fontWeight: 700,
              opacity: selectedOptionId ? 1 : 0.45,
              boxShadow: selectedOptionId ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none'
            }}
          >
            {isExecuting ? 'Promulgando Decisão...' : 'Executar Diretriz Presidencial'}
          </button>
        </div>
      </div>
    </div>
  );
};
