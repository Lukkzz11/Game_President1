'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  ScrollText, 
  Shield, 
  Scale, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Building
} from 'lucide-react';
import type { ConstitutionalAmendmentProposal } from '@/game/types';

export const ConstitutionTab: React.FC = () => {
  const { state, proposeConstitutionalAmendment, voteConstitutionalAmendment } = useGame();
  const [selectedProposalIndex, setSelectedProposalIndex] = useState(0);
  const [votingId, setVotingId] = useState<string | null>(null);

  if (!state) return null;

  const { constitution, activeConstitutionalProposals, congress } = state;

  const availableProposals = [
    {
      id: 'pec_term_extension',
      title: 'PEC do Mandato Presidencial de 5 Anos sem Reeleição',
      articleTarget: 'Artigo 14 da Constituição',
      proposedChangeDescription: 'Aumenta a duração do mandato do Presidente de 4 para 5 anos, vedando qualquer reeleição consecutiva.',
      congressVotesNeeded: 308,
      currentStage: 'proposal' as const,
      impactSummary: 'Garante mais tempo para reformas de longo prazo e estabilidade política, eliminando o fisiologismo pré-eleitoral.'
    },
    {
      id: 'pec_supreme_court_term',
      title: 'PEC do Mandato Fixo para Ministros do Supremo Tribunal Federal',
      articleTarget: 'Artigo 101 da Constituição',
      proposedChangeDescription: 'Substitui a vitaliciedade até os 75 anos por mandato improrrogável de 10 anos para os 11 ministros.',
      congressVotesNeeded: 308,
      currentStage: 'proposal' as const,
      impactSummary: 'Aumenta a rotatividade na Corte Suprema e diminui a politização vitalícia, mas pode gerar instabilidade na jurisprudência.'
    },
    {
      id: 'pec_tax_limit',
      title: 'PEC do Limite Constitucional da Carga Tributária',
      articleTarget: 'Artigo 150 da Constituição',
      proposedChangeDescription: 'Proíbe que a soma de todos os tributos federais ultrapasse 30% do Produto Interno Bruto (PIB).',
      congressVotesNeeded: 308,
      currentStage: 'proposal' as const,
      impactSummary: 'Alívio fiscal permanente para empresas e famílias, mas impõe teto severo para despesas com programas sociais.'
    }
  ];

  const handleProposePec = (prop: typeof availableProposals[0]) => {
    proposeConstitutionalAmendment(prop);
  };

  const handleVotePec = (proposalId: string) => {
    setVotingId(proposalId);
    setTimeout(() => {
      voteConstitutionalAmendment(proposalId);
      setVotingId(null);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <ScrollText size={26} color="var(--accent-gold)" />
          <h2 className="font-title" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            {constitution.name} (Promulgada em {constitution.promulgationYear})
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '680px' }}>
          A Carta Magna é a lei suprema do país. Define o regime político, o mandato de {constitution.presidentialTermYears} anos, a composição de {constitution.supremeCourtSeats} ministros do Supremo Tribunal e a separação dos poderes. Para alterá-la, exige-se quórum qualificado de <strong>3/5 do Congresso (308 votos)</strong> e controle de constitucionalidade pelo STF.
        </p>
      </div>

      {/* Regras Institucionais Fundamentais */}
      <div>
        <h3 className="font-title" style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Estrutura Institucional Vigente
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Regime de Governo</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Presidencialismo Republicano
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Mandato de {constitution.presidentialTermYears} anos • 1 Reeleição
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Supremo Tribunal Federal</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {constitution.supremeCourtSeats} Ministros Vitalícios
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Aposentadoria compulsória aos {constitution.supremeCourtRetirementAge} anos
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Banco Central da República</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Autonomia Operacional Formal
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Fixa juros sem ingerência política direta
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Quórum para PEC</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
              308 Votos (3/5)
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Exige crivo de cláusula pétrea no STF
            </div>
          </div>
        </div>
      </div>

      {/* Propostas de Emenda Constitucional Ativas (Seção 14 e 15) */}
      {activeConstitutionalProposals.length > 0 && (
        <div>
          <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Propostas de Emenda Constitucional em Tramitação
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeConstitutionalProposals.map(prop => (
              <div
                key={prop.id}
                style={{
                  background: prop.currentStage === 'promulgated' ? '#ecfdf5' : prop.currentStage === 'rejected' ? '#fef2f2' : '#ffffff',
                  border: prop.currentStage === 'promulgated' ? '1px solid #a7f3d0' : prop.currentStage === 'rejected' ? '1px solid #fecaca' : '1px solid var(--border-gold)',
                  boxShadow: 'var(--shadow-sm)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{prop.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}>{prop.articleTarget}</span>
                  </div>

                  <span className={`badge ${prop.currentStage === 'promulgated' ? 'badge-emerald' : prop.currentStage === 'rejected' ? 'badge-crimson' : 'badge-gold'}`}>
                    {prop.currentStage === 'promulgated' ? 'Emenda Promulgada' : prop.currentStage === 'rejected' ? 'Rejeitada' : 'Aguardando Votação de 3/5'}
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {prop.proposedChangeDescription}
                </p>

                {prop.votesInFavor !== undefined && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    Resultado no Congresso: <strong>{prop.votesInFavor} a favor</strong>, {prop.votesAgainst} contra (necessários: 308).
                    {prop.justicesRuling && ` STF: ${prop.justicesRuling.rulingSummary}`}
                  </div>
                )}

                {prop.currentStage === 'proposal' && (
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleVotePec(prop.id)}
                      disabled={votingId === prop.id}
                      className="btn btn-gold"
                      style={{ fontSize: '0.82rem' }}
                    >
                      {votingId === prop.id ? 'Votando 3/5 no Congresso...' : 'Levar a Plenário (Quórum de 308 Votos)'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Propor Nova PEC */}
      <div>
        <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Propor Emenda à Constituição (PEC)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {availableProposals
            .filter(p => !activeConstitutionalProposals.some(ap => ap.id === p.id))
            .map(prop => (
              <div
                key={prop.id}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                    {prop.articleTarget}
                  </span>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {prop.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                    {prop.proposedChangeDescription}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {prop.impactSummary}
                  </div>
                </div>

                <button
                  onClick={() => handleProposePec(prop)}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                >
                  <Send size={14} /> Redigir e Protocolar PEC
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
