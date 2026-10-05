'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Scale, 
  UserCheck, 
  Award, 
  Calendar, 
  AlertCircle, 
  Gavel, 
  CheckCircle, 
  XCircle, 
  Info,
  Clock
} from 'lucide-react';
import type { SupremeJusticeCandidate, SupremeJustice } from '@/game/types';
import { SupremeCourtPlenaryView } from '@/components/institutions/SupremeCourtPlenaryView';

export const SupremeCourtTab: React.FC = () => {
  const { state, nominateJustice } = useGame();
  const [selectedCandidate, setSelectedCandidate] = useState<SupremeJusticeCandidate | null>(null);
  const [showNominateModal, setShowNominateModal] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [subTab, setSubTab] = useState<'plenary' | 'profiles'>('plenary');

  if (!state) return null;

  const { supremeCourt, constitution, congress } = state;
  const activeJustices = supremeCourt.justices.filter(j => j.status === 'active');
  const retiredJustices = supremeCourt.justices.filter(j => j.status === 'retired');

  // Composição
  const progressives = activeJustices.filter(j => j.ideology < -20);
  const conservatives = activeJustices.filter(j => j.ideology > 20);
  const moderates = activeJustices.filter(j => Math.abs(j.ideology) <= 20);

  const handleConfirmNomination = () => {
    if (!selectedCandidate) return;
    setSubmittingVote(true);
    setTimeout(() => {
      nominateJustice(selectedCandidate);
      setSubmittingVote(false);
      setShowNominateModal(false);
      setSelectedCandidate(null);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header do STF */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Scale size={26} color="var(--accent-emerald)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                Supremo Tribunal Federal da República
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '680px' }}>
              Corte de cúpula do Poder Judiciário composta por exatamente 11 Ministros vitalícios. Guarda a Constituição, julga a constitucionalidade de leis aprovadas pelo Congresso e garante o equilíbrio federativo. Aposentadoria compulsória aos {constitution.supremeCourtRetirementAge} anos.
            </p>
          </div>

          {/* Status de Vagas */}
          <div style={{
            background: supremeCourt.vacancies > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: supremeCourt.vacancies > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: supremeCourt.vacancies > 0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)', fontWeight: 600 }}>
              Cadeiras Ocupadas
            </div>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeJustices.length} / {constitution.supremeCourtSeats}
            </div>
            {supremeCourt.vacancies > 0 && (
              <button 
                onClick={() => setShowNominateModal(true)}
                className="btn btn-danger"
                style={{ marginTop: '0.5rem', padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
              >
                Indicar Novo Ministro
              </button>
            )}
          </div>
        </div>

        {/* Barra de Composição Ideológica da Corte (Exigência Seção 13) */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <span>Composição Filosófico-Ideológica dos 11 Ministros</span>
            <span>{activeJustices.length} Ativos • {supremeCourt.vacancies} Vaga(s)</span>
          </div>

          <div style={{ display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden', background: '#e2e8f0', marginBottom: '0.75rem' }}>
            <div style={{ flex: progressives.length, background: '#ec4899' }} title={`Garantistas / Progressistas: ${progressives.length}`} />
            <div style={{ flex: moderates.length, background: '#8b5cf6' }} title={`Pragmatistas Constitucionais: ${moderates.length}`} />
            <div style={{ flex: conservatives.length, background: '#10b981' }} title={`Legalistas Estritos / Conservadores: ${conservatives.length}`} />
            {supremeCourt.vacancies > 0 && (
              <div style={{ flex: supremeCourt.vacancies, background: '#ef4444' }} title={`Vagas Abertas: ${supremeCourt.vacancies}`} />
            )}
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }} />
              <span>Garantistas / Direitos Sociais: <strong>{progressives.length}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} />
              <span>Pragmatistas / Técnicos: <strong>{moderates.length}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span>Legalistas Rígidos / Ordem: <strong>{conservatives.length}</strong></span>
            </div>
            {supremeCourt.vacancies > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-crimson)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span>Cadeiras Vagas: <strong>{supremeCourt.vacancies}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternador de Visualização da Corte */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '-0.75rem' }}>
        <button
          onClick={() => setSubTab('plenary')}
          className="btn"
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            background: subTab === 'plenary' ? '#eff6ff' : '#ffffff',
            border: subTab === 'plenary' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
            color: subTab === 'plenary' ? '#1d4ed8' : '#64748b'
          }}
        >
          ⚖️ Plenário & Sessão de Julgamento (11 Ministros)
        </button>
        <button
          onClick={() => setSubTab('profiles')}
          className="btn"
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            background: subTab === 'profiles' ? '#eff6ff' : '#ffffff',
            border: subTab === 'profiles' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
            color: subTab === 'profiles' ? '#1d4ed8' : '#64748b'
          }}
        >
          📋 Lista & Perfis Biográficos
        </button>
      </div>

      {subTab === 'plenary' ? (
        <SupremeCourtPlenaryView />
      ) : (
        <>
        {/* Histórico da Última Indicação Presidencial (se houver) */}
        {supremeCourt.activeNomination && (
        <div style={{
          background: supremeCourt.activeNomination.step === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: supremeCourt.activeNomination.step === 'approved' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {supremeCourt.activeNomination.step === 'approved' ? (
            <CheckCircle size={24} color="var(--accent-emerald)" />
          ) : (
            <XCircle size={24} color="var(--accent-crimson)" />
          )}
          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Resultado da Votação no Congresso: </strong>
            <span>{supremeCourt.activeNomination.resultMessage}</span>
          </div>
        </div>
      )}

      {/* Grid dos 11 Ministros do Supremo (Seção 9) */}
      <div>
        <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gavel size={20} color="var(--accent-gold)" /> Ministros da Corte Suprema ({activeJustices.length} Ativos)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {activeJustices.map(justice => {
            const yearsToRetire = constitution.supremeCourtRetirementAge - justice.age;
            const isNearRetirement = yearsToRetire <= 1.5;

            return (
              <div
                key={justice.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: isNearRetirement ? '3px solid var(--accent-gold)' : undefined
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{justice.name}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {justice.age} anos • Posse em {justice.appointmentDate}
                      </div>
                    </div>
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                      {justice.legalPhilosophy}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                    {justice.bio}
                  </p>
                </div>

                <div>
                  {/* Atributos do Ministro */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div>Independência: <strong className="font-mono">{justice.independence}/100</strong></div>
                    <div>Integridade: <strong className="font-mono">{justice.integrity}/100</strong></div>
                    <div>Experiência: <strong className="font-mono">{justice.experience}/100</strong></div>
                    <div>Reputação: <strong className="font-mono">{justice.reputation}/100</strong></div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Indicado por: <strong>{justice.appointedBy}</strong></span>
                    <span style={{ color: isNearRetirement ? 'var(--accent-gold)' : 'var(--text-muted)', fontWeight: isNearRetirement ? 700 : 400 }}>
                      {yearsToRetire <= 0 ? 'Aposenta no próximo semestre' : `Aposentadoria em ${yearsToRetire.toFixed(1)} anos`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ministros Aposentados */}
      {retiredJustices.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Ministros Aposentados Recentemente
          </h4>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {retiredJustices.map(j => (
              <div key={j.id} style={{ background: '#ffffff', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-xs)' }}>
                <strong>{j.name}</strong> • Aposentado aos {j.age} anos ({j.legalPhilosophy})
              </div>
            ))}
          </div>
        </div>
      )}
      </>
      )}

      {/* Modal de Indicação de Novo Ministro (Seção 10 e 11) */}
      {showNominateModal && (
        <div className="modal-overlay" onClick={() => setShowNominateModal(false)}>
          <div className="glass-panel" style={{ maxWidth: '780px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Scale size={24} color="var(--accent-gold)" />
              <h2 className="font-title" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                Indicação Presidencial para o Supremo Tribunal
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Há {supremeCourt.vacancies} vaga aberta. Escolha um jurista com reputação ilibada e notável saber jurídico. O candidato será submetido a sabatina e votação nominal no Congresso Nacional (são necessários no mínimo 257 votos para aprovação).
            </p>

            {/* Lista de Candidatos Juristas Disponíveis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
              {supremeCourt.candidatePool.map(candidate => {
                const isSelected = selectedCandidate?.id === candidate.id;

                return (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                    style={{
                      padding: '1rem 1.25rem',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>{candidate.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {candidate.age} anos • Filosofia: <strong>{candidate.legalPhilosophy}</strong>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-gold font-mono" style={{ fontSize: '0.72rem' }}>
                          Alinhamento: {candidate.alignmentWithPresident}%
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: '0.5rem 0' }}>
                      {candidate.bio}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.72rem', background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                      <div>Direitos Civis: <strong>{candidate.civilRightsStance}</strong></div>
                      <div>Economia: <strong>{candidate.economicStance}</strong></div>
                      <div>Segurança: <strong>{candidate.securityStance}</strong></div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Integridade: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{candidate.integrity}/100</strong></span>
                      <span>Independência: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{candidate.independence}/100</strong></span>
                      <span>Reputação Jurídica: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{candidate.reputation}/100</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ações do Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <button onClick={() => setShowNominateModal(false)} className="btn btn-outline">
                Cancelar
              </button>

              <button
                onClick={handleConfirmNomination}
                disabled={!selectedCandidate || submittingVote}
                className="btn btn-gold"
                style={{ padding: '0.75rem 1.75rem' }}
              >
                {submittingVote ? 'Submetendo ao Congresso...' : 'Enviar Indicação ao Congresso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
