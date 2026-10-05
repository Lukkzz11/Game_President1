'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { Landmark, Users, Handshake, ShieldAlert, Award, CheckCircle2, DollarSign, PlusCircle, LayoutGrid } from 'lucide-react';
import { LegislativeEditorModal } from '@/components/politics/LegislativeEditorModal';
import { CongressionalPlenaryView } from '@/components/politics/CongressionalPlenaryView';

export const CongressTab: React.FC = () => {
  const { state, negotiatePartyAlliance } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showEditorModal, setShowEditorModal] = useState<boolean>(false);
  const [subTab, setSubTab] = useState<'plenary' | 'benches'>('plenary');

  if (!state) return null;

  const { congress, allParties } = state;

  const handleNegotiate = (partyId: string) => {
    negotiatePartyAlliance(partyId, 'offer_pork');
    const partyName = allParties.find(p => p.id === partyId)?.name || partyId;
    setFeedback(`Acordo político firmado com a bancada do ${partyName}. Liberação de emendas orçamentárias garantiu apoio legislativo.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Feedback */}
      {feedback && (
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1d4ed8',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(37,99,235,0.1)'
        }}>
          <CheckCircle2 size={18} />
          {feedback}
        </div>
      )}

      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Landmark size={26} color="var(--accent-blue)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                Congresso Nacional (513 Cadeiras)
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '680px' }}>
              Poder Legislativo responsável por votar leis ordinárias, propor emendas modificativas, aprovar orçamentos e sabatinar indicados ao Supremo Tribunal. Maioria simples: <strong>257 votos</strong>. Emendas Constitucionais: <strong>308 votos</strong> (3/5).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'flex-end' }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Presidente da Câmara</div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{congress.congressPresidentName}</div>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{congress.congressPresidentParty}</span>
            </div>

            <button
              onClick={() => setShowEditorModal(true)}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}
            >
              <PlusCircle size={16} />
              Redigir Nova Proposição
            </button>
          </div>
        </div>

        {/* Barra de Distribuição de Forças */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span>Distribuição das 513 Cadeiras</span>
            <span>Relação com o Executivo: <strong className="font-mono" style={{ color: congress.presidentRelationship > 50 ? '#047857' : '#b91c1c' }}>{congress.presidentRelationship}%</strong></span>
          </div>

          <div style={{ display: 'flex', height: '18px', borderRadius: '9px', overflow: 'hidden', background: '#e2e8f0', marginBottom: '0.75rem' }}>
            <div style={{ flex: congress.coalitionSeats, background: 'var(--accent-blue)' }} title={`Base Governista: ${congress.coalitionSeats}`} />
            <div style={{ flex: congress.independentSeats, background: 'var(--accent-purple)' }} title={`Centro Independente: ${congress.independentSeats}`} />
            <div style={{ flex: congress.oppositionSeats, background: 'var(--accent-crimson)' }} title={`Oposição: ${congress.oppositionSeats}`} />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-blue)' }} />
              <span>Base Governista: <strong className="font-mono">{congress.coalitionSeats}</strong> ({((congress.coalitionSeats / 513) * 100).toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-purple)' }} />
              <span>Centro & Independentes: <strong className="font-mono">{congress.independentSeats}</strong> ({((congress.independentSeats / 513) * 100).toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-crimson)' }} />
              <span>Oposição: <strong className="font-mono">{congress.oppositionSeats}</strong> ({((congress.oppositionSeats / 513) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Alternador de Visualização: Plenário Visual vs Bancadas */}
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          <button
            onClick={() => setSubTab('plenary')}
            className="btn"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: subTab === 'plenary' ? '#eff6ff' : '#f8fafc',
              border: subTab === 'plenary' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              color: subTab === 'plenary' ? '#1d4ed8' : '#64748b'
            }}
          >
            🏛️ Hemiciclo Plenário Visual (513 Assentos)
          </button>
          <button
            onClick={() => setSubTab('benches')}
            className="btn"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: subTab === 'benches' ? '#eff6ff' : '#f8fafc',
              border: subTab === 'benches' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              color: subTab === 'benches' ? '#1d4ed8' : '#64748b'
            }}
          >
            👥 Bancadas Partidárias & Articulação
          </button>
        </div>
      </div>

      {subTab === 'plenary' ? (
        <CongressionalPlenaryView />
      ) : (
        /* Bancadas Partidárias e Articulação */
        <div>
          <h3 className="font-title" style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="var(--accent-blue)" /> Bancadas Partidárias & Articulação Política
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {congress.parties.map(p => {
            const partyInfo = allParties.find(ap => ap.id === p.partyId);
            if (!partyInfo) return null;

            const isUserParty = state.party.id === partyInfo.id;
            const isCoalition = p.stanceToPresident === 'coalition';

            return (
              <div
                key={p.partyId}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${partyInfo.color}`,
                  background: '#ffffff'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="font-mono" style={{ fontWeight: 800, fontSize: '1.1rem', color: partyInfo.color }}>
                        {partyInfo.acronym}
                      </span>
                      {isUserParty && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Partido do Presidente</span>}
                    </div>

                    <span className={`badge ${p.stanceToPresident === 'coalition' ? 'badge-blue' : p.stanceToPresident === 'opposition' ? 'badge-crimson' : 'badge-purple'}`} style={{ fontSize: '0.68rem' }}>
                      {p.stanceToPresident === 'coalition' ? 'Base Aliada' : p.stanceToPresident === 'opposition' ? 'Oposição' : 'Independente'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {partyInfo.name}
                  </h4>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                    {partyInfo.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    <span>Cadeiras na Câmara:</span>
                    <strong className="font-mono" style={{ color: '#0f172a', fontSize: '0.95rem' }}>{p.seats} Deputados</strong>
                  </div>

                  {!isUserParty && (
                    <button
                      onClick={() => handleNegotiate(p.partyId)}
                      className="btn btn-secondary"
                      style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
                    >
                      <DollarSign size={14} color="var(--accent-gold)" />
                      {isCoalition ? 'Reforçar Emendas (R$ 2 bi)' : 'Negociar Entrada na Base (R$ 2 bi)'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {showEditorModal && (
        <LegislativeEditorModal onClose={() => setShowEditorModal(false)} />
      )}
    </div>
  );
};
