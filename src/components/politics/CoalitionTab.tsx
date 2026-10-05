'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Handshake, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  AlertCircle,
  TrendingUp,
  Award,
  UserX
} from 'lucide-react';
import type { Party, CongressPartyStance } from '@/game/types';

export const CoalitionTab: React.FC = () => {
  const { state, negotiatePartyAlliance } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!state) return null;

  const { congress, allParties, ministers } = state;
  const coalitionSeats = congress.coalitionSeats;
  const majorityNeeded = 257;
  const superMajorityNeeded = 308; // 3/5 PEC

  const hasMajority = coalitionSeats >= majorityNeeded;
  const hasSuperMajority = coalitionSeats >= superMajorityNeeded;

  const handleAction = (partyId: string, action: 'offer_pork' | 'pact' | 'break_alliance') => {
    negotiatePartyAlliance(partyId, action);
    const partyName = allParties.find(p => p.id === partyId)?.name || partyId;
    if (action === 'offer_pork') {
      setFeedback(`Pacote de emendas parlamentares de R$ 2.0 bi liberado para a bancada do ${partyName}. Fidelidade reforçada.`);
    } else if (action === 'pact') {
      setFeedback(`Pacto de cooperação legislativa firmado com as lideranças do ${partyName}.`);
    } else {
      setFeedback(`Aliança com o ${partyName} rompida oficialmente. O partido passou a integrar a oposição.`);
    }
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

      {/* Header com Mapa de Correlação de Forças */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Handshake size={26} color="var(--accent-blue)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                Articulação Política & Coalizão de Governo
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '720px' }}>
              No presidencialismo de coalizão, nenhum presidente governa sozinho. Negocie apoio parlamentar, libere emendas orçamentárias ou componha o gabinete para garantir maioria absoluta (257 votos) ou quórum qualificado de emendas constitucionais (308 votos).
            </p>
          </div>

          <div style={{
            background: hasSuperMajority ? '#ecfdf5' : hasMajority ? '#eff6ff' : '#fef2f2',
            border: `1px solid ${hasSuperMajority ? '#a7f3d0' : hasMajority ? '#bfdbfe' : '#fecaca'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Status da Base Governista
            </div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: hasSuperMajority ? '#047857' : hasMajority ? '#1d4ed8' : '#b91c1c' }}>
              {coalitionSeats} / 513 Cadeiras
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: hasSuperMajority ? '#047857' : hasMajority ? '#1d4ed8' : '#b91c1c' }}>
              {hasSuperMajority ? 'Maioria Qualificada de PEC' : hasMajority ? 'Maioria Absoluta Segura' : 'Governo Minoritário (Risco de Paralisia)'}
            </span>
          </div>
        </div>

        {/* Barra de Distribuição das Cadeiras */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span>Composição Plenária (513 Deputados)</span>
            <span>Meta de Maioria: <strong>257 votos</strong> | Meta de PEC: <strong>308 votos</strong></span>
          </div>

          <div style={{ display: 'flex', height: '18px', borderRadius: '9px', overflow: 'hidden', background: '#e2e8f0', marginBottom: '0.75rem' }}>
            <div style={{ flex: congress.coalitionSeats, background: 'var(--accent-blue)' }} title={`Base Aliada: ${congress.coalitionSeats}`} />
            <div style={{ flex: congress.independentSeats, background: 'var(--accent-purple)' }} title={`Independentes / Centrão: ${congress.independentSeats}`} />
            <div style={{ flex: congress.oppositionSeats, background: 'var(--accent-crimson)' }} title={`Oposição: ${congress.oppositionSeats}`} />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-blue)' }} />
              <span>Base Governista: <strong className="font-mono">{congress.coalitionSeats}</strong> ({((congress.coalitionSeats / 513) * 100).toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-purple)' }} />
              <span>Centro Independente: <strong className="font-mono">{congress.independentSeats}</strong> ({((congress.independentSeats / 513) * 100).toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent-crimson)' }} />
              <span>Oposição: <strong className="font-mono">{congress.oppositionSeats}</strong> ({((congress.oppositionSeats / 513) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Partidos e Opções de Aliança */}
      <div>
        <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={20} color="var(--accent-blue)" /> Bancadas Partidárias no Congresso Nacional
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {congress.parties.map(p => {
            const partyInfo = allParties.find(ap => ap.id === p.partyId);
            if (!partyInfo) return null;

            const isUserParty = state.party.id === partyInfo.id;
            const relationship = p.relationshipWithPresident ?? 50;
            const isCoalition = p.stanceToPresident === 'coalition';
            const isOpposition = p.stanceToPresident === 'opposition';

            // Ministérios ocupados por este partido
            const heldMinistries = ministers.filter(m => m.partyAffiliation && m.partyAffiliation.toUpperCase().includes(partyInfo.acronym.toUpperCase()));

            return (
              <div
                key={p.partyId}
                className="glass-panel"
                style={{
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${partyInfo.color}`,
                  background: isCoalition ? '#ffffff' : isOpposition ? '#fffbfb' : '#fafafa'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="font-mono" style={{ fontWeight: 800, fontSize: '1.15rem', color: partyInfo.color }}>
                        {partyInfo.acronym}
                      </span>
                      {isUserParty && (
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                          Partido do Presidente
                        </span>
                      )}
                    </div>

                    <span className={`badge ${isCoalition ? 'badge-blue' : isOpposition ? 'badge-crimson' : 'badge-purple'}`} style={{ fontSize: '0.68rem' }}>
                      {isCoalition ? 'Base Governista' : isOpposition ? 'Oposição' : 'Independente'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    {partyInfo.name}
                  </h4>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
                    {partyInfo.description}
                  </p>

                  {/* Informações da Bancada */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    fontSize: '0.78rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Bancada na Câmara:</span>
                      <strong className="font-mono" style={{ color: '#0f172a', fontSize: '0.88rem' }}>
                        {p.seats} Deputados
                      </strong>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span>Afinidade com o Governo:</span>
                        <strong className="font-mono" style={{ color: relationship >= 60 ? 'var(--accent-emerald)' : relationship <= 35 ? 'var(--accent-crimson)' : 'var(--accent-gold)' }}>
                          {relationship}%
                        </strong>
                      </div>
                      <div className="progress-bar-bg" style={{ height: '6px' }}>
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${relationship}%`,
                            background: relationship >= 60 ? 'var(--accent-emerald)' : relationship <= 35 ? 'var(--accent-crimson)' : 'var(--accent-gold)'
                          }}
                        />
                      </div>
                    </div>

                    {heldMinistries.length > 0 && (
                      <div style={{ marginTop: '0.25rem', paddingTop: '0.4rem', borderTop: '1px dashed #e2e8f0' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Cargos na Esplanada:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.2rem' }}>
                          {heldMinistries.map(m => (
                            <span key={m.id} className="badge badge-blue" style={{ fontSize: '0.62rem' }}>
                              {m.portfolio}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ações de Negociação */}
                {!isUserParty && (
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleAction(p.partyId, 'offer_pork')}
                        className="btn btn-outline"
                        style={{ fontSize: '0.72rem', padding: '0.45rem' }}
                        title="Liberar R$ 2.0 bi em emendas para a bancada (+25 afinidade)"
                      >
                        <DollarSign size={13} color="var(--accent-gold)" /> Emendas (R$ 2 bi)
                      </button>

                      <button
                        onClick={() => handleAction(p.partyId, 'pact')}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.72rem', padding: '0.45rem' }}
                        title="Firmar acordo formal de cooperação de pauta (+15 afinidade)"
                      >
                        <Handshake size={13} color="var(--accent-blue)" /> Firmar Pacto
                      </button>
                    </div>

                    {isCoalition && (
                      <button
                        onClick={() => handleAction(p.partyId, 'break_alliance')}
                        className="btn btn-danger"
                        style={{ width: '100%', fontSize: '0.72rem', padding: '0.45rem' }}
                        title="Romper aliança e mandar o partido para a oposição"
                      >
                        <UserX size={13} /> Romper Aliança
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
