'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Scale, 
  Gavel, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  Award, 
  User, 
  BookOpen, 
  AlertCircle
} from 'lucide-react';
import type { SupremeJustice } from '@/game/types';

export const SupremeCourtPlenaryView: React.FC = () => {
  const { state } = useGame();
  const [selectedJustice, setSelectedJustice] = useState<SupremeJustice | null>(null);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [trialStep, setTrialStep] = useState<number>(0);
  const [trialCaseTitle, setTrialCaseTitle] = useState<string>('Arguição de Inconstitucionalidade da Reforma Trabalhista e Previdenciária');

  if (!state) return null;

  const { supremeCourt, constitution } = state;
  const activeJustices = supremeCourt.justices.filter(j => j.status === 'active');
  const vacancies = supremeCourt.vacancies || 0;

  // Justificativas jurídicas procedurais para a simulação de voto
  const getJusticeVote = (justice: SupremeJustice, index: number) => {
    // Progressistas/Garantistas tendem a defender direitos sociais; Legalistas tendem a defender freios fiscais/ordem
    const isFavorable = justice.ideology < 10 ? true : (justice.independence > 70 ? (index % 2 === 0) : false);
    const argument = isFavorable
      ? `Voto pela Constitucionalidade: A matéria respeita as cláusulas pétreas e assegura a supremacia do interesse coletivo da República.`
      : `Voto pela Inconstitucionalidade: O texto exorbita os limites materiais do poder de reforma e fere a segurança jurídica e o pacto federativo.`;

    return { isFavorable, argument };
  };

  const startConstitutionalTrial = () => {
    setIsTrialActive(true);
    setTrialStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTrialStep(step);
      if (step >= activeJustices.length) {
        clearInterval(interval);
      }
    }, 700);
  };

  const favorableVotesCount = activeJustices.slice(0, trialStep).filter((j, idx) => getJusticeVote(j, idx).isFavorable).length;
  const contraryVotesCount = trialStep - favorableVotesCount;
  const isTrialFinished = trialStep >= activeJustices.length && isTrialActive;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header do Plenário com Botão de Julgamento */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={22} color="var(--accent-emerald)" /> Plenário Histórico da Suprema Corte (11 Ministros)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Tribunal Constitucional responsável pelo controle concentrado de constitucionalidade. Quórum de 11 juízes vitalícios com aposentadoria compulsória aos {constitution.supremeCourtRetirementAge} anos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={startConstitutionalTrial}
            disabled={isTrialActive && !isTrialFinished}
            className="btn btn-gold"
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Gavel size={16} /> Abrir Sessão de Julgamento Constitucional
          </button>
        </div>
      </div>

      {/* Sessão Plenária de Julgamento Animada */}
      {isTrialActive && (
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '2px solid #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <div>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}>
                Ação Direta de Inconstitucionalidade (ADI em Trâmite)
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                {trialCaseTitle}
              </h4>
            </div>

            {/* Placar de Votação Dinâmico */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#f8fafc', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>CONSTITUCIONAL:</span>
                <strong className="font-mono" style={{ fontSize: '1.25rem' }}>{favorableVotesCount}</strong>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#94a3b8' }}>×</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c' }}>
                <XCircle size={18} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>INCONSTITUCIONAL:</span>
                <strong className="font-mono" style={{ fontSize: '1.25rem' }}>{contraryVotesCount}</strong>
              </div>
            </div>
          </div>

          {/* Votos Visuais em Bolhas */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {activeJustices.map((j, idx) => {
              const hasVoted = idx < trialStep;
              const vote = getJusticeVote(j, idx);

              return (
                <div
                  key={j.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 0.65rem',
                    background: hasVoted ? (vote.isFavorable ? '#ecfdf5' : '#fef2f2') : '#f8fafc',
                    border: hasVoted ? (vote.isFavorable ? '1px solid #a7f3d0' : '1px solid #fecaca') : '1px dashed #cbd5e1',
                    borderRadius: 'var(--radius-sm)',
                    minWidth: '85px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>
                    {hasVoted ? (vote.isFavorable ? '🟢' : '🔴') : '⚪'}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>
                    {j.name.split(' ').slice(1).join(' ')}
                  </span>
                  <span style={{ fontSize: '0.62rem', color: hasVoted ? (vote.isFavorable ? '#047857' : '#b91c1c') : '#94a3b8', fontWeight: 600 }}>
                    {hasVoted ? (vote.isFavorable ? 'Pela Lei' : 'Derruba') : 'Aguardando'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Banner de Decisão Final Acórdão */}
          {isTrialFinished && (
            <div style={{
              background: favorableVotesCount > contraryVotesCount ? '#ecfdf5' : '#fef2f2',
              border: favorableVotesCount > contraryVotesCount ? '2px solid #059669' : '2px solid #dc2626',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-out'
            }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: favorableVotesCount > contraryVotesCount ? '#047857' : '#b91c1c', marginBottom: '0.35rem' }}>
                {favorableVotesCount > contraryVotesCount ? 'ACÓRDÃO: LEI DECLARADA CONSTITUCIONAL (6+ Votos)' : 'ACÓRDÃO: LEI DECLARADA INCONSTITUCIONAL (Derrubada)'}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {favorableVotesCount > contraryVotesCount 
                  ? `O Supremo Tribunal Federal, por ${favorableVotesCount} a ${contraryVotesCount} votos, julgou improcedente a ação direta e manteve integralmente a eficácia da proposição legislativa.`
                  : `O Supremo Tribunal Federal, por ${contraryVotesCount} a ${favorableVotesCount} votos, julgou procedente a ação da oposição e suspendeu a eficácia dos dispositivos contestados.`}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grid: Bancada em Ferradura da Corte dos 11 Ministros */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Ferradura dos 11 Ministros (Layout Nativo de Tribunal) */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
              Mesa Julgadora dos 11 Ministros
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              {activeJustices.length} Ministros em Exercício {vacancies > 0 ? `• ${vacancies} Vaga Aberta` : ''}
            </span>
          </div>

          {/* Representação Visual da Bancada em Ferradura */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {/* Cadeira Central da Presidência da Corte */}
            {activeJustices[0] && (
              <div
                onClick={() => setSelectedJustice(activeJustices[0])}
                style={{
                  background: selectedJustice?.id === activeJustices[0].id ? '#eff6ff' : '#ffffff',
                  border: selectedJustice?.id === activeJustices[0].id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  width: '320px',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <Gavel size={18} />
                </div>
                <div>
                  <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>Presidente da Corte</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{activeJustices[0].name}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{activeJustices[0].legalPhilosophy}</span>
                </div>
              </div>
            )}

            {/* As Duas Alas Laterais de Ministros (5 à Esquerda, 5 à Direita) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', width: '100%' }}>
              {activeJustices.slice(1).map((justice, index) => {
                const isSelected = selectedJustice?.id === justice.id;
                const yearsToRetire = constitution.supremeCourtRetirementAge - justice.age;

                return (
                  <div
                    key={justice.id}
                    onClick={() => setSelectedJustice(justice)}
                    style={{
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: justice.ideology < -20 ? '#fdf2f8' : justice.ideology > 20 ? '#ecfdf5' : '#f5f3ff',
                      color: justice.ideology < -20 ? '#db2777' : justice.ideology > 20 ? '#059669' : '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      {index + 2}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {justice.name}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {justice.age}a
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {justice.legalPhilosophy}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Vaga Aberta se houver */}
              {vacancies > 0 && (
                <div style={{
                  border: '2px dashed #f87171',
                  background: '#fef2f2',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#b91c1c'
                }}>
                  <AlertCircle size={24} />
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Cadeira Vaga</h5>
                    <span style={{ fontSize: '0.72rem' }}>Aguardando indicação presidencial</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dossiê do Ministro Selecionado */}
        <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff', minHeight: '440px' }}>
          {selectedJustice ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.68rem', marginBottom: '0.35rem' }}>
                  {selectedJustice.legalPhilosophy}
                </span>
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
                  {selectedJustice.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {selectedJustice.age} anos • Posse em {selectedJustice.appointmentDate}
                </div>
              </div>

              {/* Biografia e Filosofia */}
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {selectedJustice.bio}
              </p>

              {/* Indicadores do Ministro */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>INDEPENDÊNCIA</div>
                  <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedJustice.independence}/100
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>INTEGRIDADE</div>
                  <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                    {selectedJustice.integrity}/100
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>EXPERIÊNCIA JURÍDICA</div>
                  <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2563eb' }}>
                    {selectedJustice.experience}/100
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>REPUTAÇÃO NA CORTE</div>
                  <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706' }}>
                    {selectedJustice.reputation}/100
                  </div>
                </div>
              </div>

              {/* Histórico e Quem Nomeou */}
              <div style={{ background: '#eff6ff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe', fontSize: '0.78rem' }}>
                <div>Indicado pelo Presidente: <strong>{selectedJustice.appointedBy}</strong></div>
                <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  Aposentadoria compulsória aos {constitution.supremeCourtRetirementAge} anos (restam {(constitution.supremeCourtRetirementAge - selectedJustice.age).toFixed(1)} anos).
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '360px', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
              <Scale size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>Nenhum Ministro Selecionado</h4>
              <p style={{ fontSize: '0.82rem', maxWidth: '300px', marginTop: '0.4rem' }}>
                Clique em qualquer assento da bancada em ferradura para inspecionar idade, filosofia, independência e integridade de cada ministro.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
