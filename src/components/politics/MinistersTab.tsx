'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Briefcase, 
  UserCheck, 
  Shield, 
  Award, 
  UserX, 
  UserPlus, 
  Search, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Building2,
  X,
  FileSearch,
  ThumbsUp,
  MessageSquare,
  AlertOctagon,
  Users
} from 'lucide-react';
import type { Minister, MinisterCandidate } from '@/game/types';
import candidatesPoolData from '@/data/ministers-pool.json';

export const MinistersTab: React.FC = () => {
  const { state, dismissMinister, appointMinister, investigateMinister, praiseMinister, warnMinister } = useGame();
  const [selectedPortfolioForNomination, setSelectedPortfolioForNomination] = useState<string | null>(null);
  const [selectedMinisterForDetail, setSelectedMinisterForDetail] = useState<Minister | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!state) return null;

  const { ministers } = state;
  const allCandidates = candidatesPoolData as MinisterCandidate[];

  const vacantCount = ministers.filter(m => m.status === 'vacant').length;
  const occupiedMinisters = ministers.filter(m => m.status === 'appointed');
  const avgCompetence = occupiedMinisters.length > 0
    ? Math.round(occupiedMinisters.reduce((acc, m) => acc + m.competence, 0) / occupiedMinisters.length)
    : 0;
  const avgLoyalty = occupiedMinisters.length > 0
    ? Math.round(occupiedMinisters.reduce((acc, m) => acc + m.loyalty, 0) / occupiedMinisters.length)
    : 0;
  const maxScandalRisk = occupiedMinisters.length > 0
    ? Math.max(...occupiedMinisters.map(m => m.scandalRisk || (100 - m.integrity)))
    : 0;

  const handleDismiss = (ministerId: string, portfolioName: string) => {
    if (confirm(`Tem certeza de que deseja exonerar o titular do Ministério de ${portfolioName}? A pasta ficará vaga e isso pode estremecer as relações com a base aliada.`)) {
      dismissMinister(ministerId);
      setFeedbackMessage(`Titular do Ministério de ${portfolioName} exonerado com sucesso.`);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleAppoint = (portfolioId: string, candidate: MinisterCandidate) => {
    appointMinister(portfolioId, candidate);
    setSelectedPortfolioForNomination(null);
    setFeedbackMessage(`${candidate.name} foi nomeado(a) oficialmente para o cargo.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleInvestigate = (ministerId: string, ministerName: string) => {
    investigateMinister(ministerId);
    setFeedbackMessage(`Polícia Federal instaurou averiguação interna preliminar sobre a gestão de ${ministerName}. Risco de escândalo reduzido.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handlePraise = (ministerId: string, ministerName: string) => {
    praiseMinister(ministerId);
    setFeedbackMessage(`Declaração pública de apoio a ${ministerName} fortaleceu sua lealdade com o Planalto.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleWarn = (ministerId: string, ministerName: string) => {
    warnMinister(ministerId);
    setFeedbackMessage(`Advertência reservada aplicada ao Ministro ${ministerName}. O rigor na pasta aumentou e o risco de escândalos foi reduzido.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleTalk = (minister: Minister) => {
    praiseMinister(minister.id);
    setFeedbackMessage(`Reunião bilateral com ${minister.name} alinhou as prioridades estratégicas da pasta de ${minister.portfolio}. (+3 Lealdade)`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Candidatos filtrados para a pasta em seleção
  const filteredCandidates = selectedPortfolioForNomination
    ? allCandidates.filter(c => c.portfolioId === selectedPortfolioForNomination || c.portfolioId === 'general')
    : [];

  const targetMinister = selectedPortfolioForNomination
    ? ministers.find(m => m.portfolioId === selectedPortfolioForNomination)
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Feedback */}
      {feedbackMessage && (
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
          {feedbackMessage}
        </div>
      )}

      {/* Header com Indicadores do Gabinete */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Briefcase size={26} color="var(--accent-blue)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                Gabinete de Ministros & Esplanada
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '720px' }}>
              Os ministros gerenciam o orçamento das políticas públicas e articulam com setores da sociedade. Titulares técnicos reduzem o desperdício fiscal e aceleram obras; quadros políticos garantem votos nas votações do Congresso Nacional.
            </p>
          </div>

          {/* Medidores de Saúde do Gabinete */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="stat-gauge" style={{ minWidth: '120px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pastas Vagas</span>
              <strong className="font-mono" style={{ fontSize: '1.2rem', color: vacantCount > 0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)' }}>
                {vacantCount > 0 ? `${vacantCount} Vaga${vacantCount > 1 ? 's' : ''}` : 'Gabinete Pleno'}
              </strong>
            </div>

            <div className="stat-gauge" style={{ minWidth: '120px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Competência Média</span>
              <strong className="font-mono" style={{ fontSize: '1.2rem', color: 'var(--accent-blue)' }}>
                {avgCompetence}/100
              </strong>
            </div>

            <div className="stat-gauge" style={{ minWidth: '120px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Lealdade Média</span>
              <strong className="font-mono" style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)' }}>
                {avgLoyalty}/100
              </strong>
            </div>

            <div className="stat-gauge" style={{ minWidth: '120px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pico de Risco</span>
              <strong className="font-mono" style={{ fontSize: '1.2rem', color: maxScandalRisk > 30 ? 'var(--accent-crimson)' : 'var(--text-primary)' }}>
                {maxScandalRisk}%
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Mesa Ministerial do Conselho de Governo (Representação Visual Nativa) */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 className="font-title" style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--accent-blue)" /> Mesa Redonda do Conselho de Ministros (Palácio do Planalto)
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Clique sobre a cadeira de qualquer ministro para despachar, alinhar diretrizes, advertir ou substituir.
            </span>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
            Presidência da República em Sessão
          </span>
        </div>

        <div style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 1.5rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Cadeira Presidencial */}
          <div style={{
            background: '#0f172a',
            color: '#ffffff',
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 6px 16px rgba(15,23,42,0.2)',
            border: '2px solid #d97706'
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d97706', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              PR
            </div>
            <div>
              <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>Chefe de Estado & Governo</span>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{state.player.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Capital Político: <strong>{state.politicalCapital || 60} pts</strong> • Popularidade: <strong>{state.player.popularity}%</strong></div>
            </div>
          </div>

          {/* Mesa de Reunião com os Ministros Dispostos ao Redor */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '0.85rem',
            width: '100%',
            maxWidth: '1100px'
          }}>
            {ministers.map(minister => {
              const isVacant = minister.status === 'vacant';
              return (
                <div
                  key={minister.id}
                  onClick={() => setSelectedMinisterForDetail(minister)}
                  style={{
                    background: isVacant ? '#fff5f5' : '#ffffff',
                    border: isVacant ? '1px dashed #f87171' : '1px solid #cbd5e1',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                      {minister.portfolio.split(' ')[0]}
                    </span>
                    {!isVacant && (
                      <span className="font-mono" style={{ fontSize: '0.68rem', color: minister.loyalty > 60 ? '#047857' : '#b91c1c', fontWeight: 700 }}>
                        {minister.loyalty}% Leal
                      </span>
                    )}
                  </div>

                  {isVacant ? (
                    <div style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 700, padding: '0.5rem 0' }}>
                      + Cadeira Vaga
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {minister.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Comp: <strong>{minister.competence}</strong> • {minister.ideologyLean}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid de Ministérios */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {ministers.map(minister => {
          const isVacant = minister.status === 'vacant';
          const scandal = minister.scandalRisk || (100 - minister.integrity);

          return (
            <div
              key={minister.id}
              className="glass-panel"
              style={{
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: isVacant ? '4px solid var(--accent-crimson)' : '4px solid var(--accent-blue)',
                background: isVacant ? '#fffaf0' : '#ffffff'
              }}
            >
              <div>
                {/* Cabeçalho da Pasta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                    {minister.portfolio}
                  </span>

                  {isVacant ? (
                    <span className="badge badge-crimson" style={{ fontSize: '0.68rem' }}>
                      Pasta Vaga
                    </span>
                  ) : (
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                      {minister.partyAffiliation || 'Técnico'}
                    </span>
                  )}
                </div>

                {isVacant ? (
                  <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                      <AlertTriangle size={24} />
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b91c1c', marginBottom: '0.3rem' }}>
                      Sem Titular Nomeado
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4', maxWidth: '280px', margin: '0 auto' }}>
                      A ausência de comando reduz a eficiência da pasta e paralisa a execução de projetos prioritários.
                    </p>
                  </div>
                ) : (
                  <>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0.4rem 0 0.15rem 0' }}>
                      {minister.name}
                    </h4>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      {minister.age} anos • {minister.experience} anos no setor público • <strong>{minister.ideologyLean}</strong>
                    </div>

                    {/* Matriz de Atributos */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.6rem',
                      fontSize: '0.78rem',
                      marginBottom: '0.85rem'
                    }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Competência:</div>
                        <strong className="font-mono" style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>
                          {minister.competence}/100
                        </strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Lealdade:</div>
                        <strong className="font-mono" style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem' }}>
                          {minister.loyalty}/100
                        </strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Integridade:</div>
                        <strong className="font-mono" style={{ color: '#0f172a', fontSize: '0.9rem' }}>
                          {minister.integrity}/100
                        </strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Risco de Escândalo:</div>
                        <strong className="font-mono" style={{ color: scandal > 25 ? 'var(--accent-crimson)' : 'var(--accent-emerald)', fontSize: '0.9rem' }}>
                          {scandal}%
                        </strong>
                      </div>
                    </div>

                    {minister.effectsSummary && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem', fontStyle: 'italic' }}>
                        "{minister.effectsSummary}"
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Barra de Ações */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {isVacant ? (
                  <button
                    onClick={() => setSelectedPortfolioForNomination(minister.portfolioId)}
                    className="btn btn-primary"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '0.55rem' }}
                  >
                    <UserPlus size={15} /> Nomear Titular para o Ministério
                  </button>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <button
                      onClick={() => handlePraise(minister.id, minister.name)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.72rem', padding: '0.45rem' }}
                      title="Fazer declaração pública de apoio (aumenta lealdade)"
                    >
                      <ThumbsUp size={13} color="var(--accent-emerald)" /> Elogiar
                    </button>

                    <button
                      onClick={() => handleInvestigate(minister.id, minister.name)}
                      className="btn btn-outline"
                      style={{ fontSize: '0.72rem', padding: '0.45rem' }}
                      title="Averiguação interna preventiva da Polícia Federal (reduz risco de escândalo)"
                    >
                      <FileSearch size={13} color="var(--accent-blue)" /> Auditar PF
                    </button>

                    <button
                      onClick={() => setSelectedPortfolioForNomination(minister.portfolioId)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '0.45rem' }}
                    >
                      <UserCheck size={13} /> Substituir
                    </button>

                    <button
                      onClick={() => handleDismiss(minister.id, minister.portfolio)}
                      className="btn btn-danger"
                      style={{ fontSize: '0.72rem', padding: '0.45rem' }}
                    >
                      <UserX size={13} /> Demitir
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Escolha e Nomeação de Ministros */}
      {selectedPortfolioForNomination && targetMinister && (
        <div className="modal-overlay">
          <div className="glass-panel" style={{ maxWidth: '850px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <span className="badge badge-blue" style={{ marginBottom: '0.35rem' }}>
                  Banco de Talentos Republicano
                </span>
                <h3 className="font-title" style={{ fontSize: '1.35rem', color: '#0f172a' }}>
                  Nomear Titular: Ministério de {targetMinister.portfolio}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Selecione um candidato qualificado para assumir a pasta. Observe o alinhamento ideológico, base partidária e impacto na governabilidade.
                </p>
              </div>

              <button
                onClick={() => setSelectedPortfolioForNomination(null)}
                className="btn btn-outline"
                style={{ padding: '0.4rem' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Lista de Candidatos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredCandidates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Nenhum candidato especializado disponível no momento para esta pasta.
                </div>
              ) : (
                filteredCandidates.map(cand => (
                  <div
                    key={cand.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            {cand.name}
                          </h4>
                          <span className="badge badge-purple font-mono" style={{ fontSize: '0.68rem' }}>
                            {cand.partyAffiliation}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {cand.age} anos • {cand.experience} anos de experiência • <strong>{cand.ideologyLean}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAppoint(targetMinister.portfolioId, cand)}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.82rem' }}
                      >
                        <UserCheck size={15} /> Nomear para o Cargo
                      </button>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                      {cand.bio}
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                      <div>Competência: <strong className="font-mono" style={{ color: 'var(--accent-blue)' }}>{cand.competence}/100</strong></div>
                      <div>Lealdade: <strong className="font-mono" style={{ color: 'var(--accent-emerald)' }}>{cand.loyalty}/100</strong></div>
                      <div>Integridade: <strong className="font-mono">{cand.integrity}/100</strong></div>
                      <div>Popularidade: <strong className="font-mono">{cand.popularity}/100</strong></div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#0f172a', background: '#eff6ff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bfdbfe' }}>
                      <strong>Impacto Estratégico:</strong> {cand.effectsSummary}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Despacho & Ações Presidenciais com o Ministro */}
      {selectedMinisterForDetail && (
        <div className="modal-overlay" onClick={() => setSelectedMinisterForDetail(null)}>
          <div className="glass-panel" style={{ maxWidth: '640px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-blue" style={{ fontSize: '0.7rem', marginBottom: '0.35rem' }}>
                  {selectedMinisterForDetail.portfolio}
                </span>
                <h3 className="font-title" style={{ fontSize: '1.3rem', color: '#0f172a' }}>
                  {selectedMinisterForDetail.status === 'vacant' ? 'Cadeira Vaga' : selectedMinisterForDetail.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {selectedMinisterForDetail.status === 'vacant' ? 'Sem titular designado' : `${selectedMinisterForDetail.age} anos • ${selectedMinisterForDetail.partyAffiliation || 'Técnico Republicano'}`}
                </div>
              </div>

              <button onClick={() => setSelectedMinisterForDetail(null)} className="btn btn-outline" style={{ padding: '0.4rem' }}>
                <X size={18} />
              </button>
            </div>

            {selectedMinisterForDetail.status === 'vacant' ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Esta pasta ministerial está atualmente sem comando. A ausência de titular paralisa a execução orçamentária e a articulação no Congresso.
                </p>
                <button
                  onClick={() => {
                    const portId = selectedMinisterForDetail.portfolioId;
                    setSelectedMinisterForDetail(null);
                    setSelectedPortfolioForNomination(portId);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem' }}
                >
                  <UserPlus size={16} /> Abrir Banco de Talentos e Nomear Titular
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Atributos */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>COMPETÊNCIA</div>
                    <strong className="font-mono" style={{ color: 'var(--accent-blue)', fontSize: '1.1rem' }}>{selectedMinisterForDetail.competence}/100</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>LEALDADE</div>
                    <strong className="font-mono" style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>{selectedMinisterForDetail.loyalty}/100</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>INTEGRIDADE</div>
                    <strong className="font-mono" style={{ fontSize: '1.1rem' }}>{selectedMinisterForDetail.integrity}/100</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>RISCO ESCÂNDALO</div>
                    <strong className="font-mono" style={{ color: (selectedMinisterForDetail.scandalRisk || 20) > 25 ? 'var(--accent-crimson)' : 'var(--accent-emerald)', fontSize: '1.1rem' }}>
                      {selectedMinisterForDetail.scandalRisk || (100 - selectedMinisterForDetail.integrity)}%
                    </strong>
                  </div>
                </div>

                {/* Perfil & Conselho do Ministro */}
                <div style={{ background: '#eff6ff', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Avaliação do Titular sobre a Pasta
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#1e293b', lineHeight: '1.45' }}>
                    "{selectedMinisterForDetail.effectsSummary || 'O ministério está em ritmo constante de execução orçamentária e aguarda diretrizes do Palácio do Planalto.'}"
                  </p>
                </div>

                {/* Ações Presidenciais Disponíveis */}
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    Ordens & Despacho do Presidente
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <button
                      onClick={() => {
                        handleTalk(selectedMinisterForDetail);
                        setSelectedMinisterForDetail(null);
                      }}
                      className="btn btn-outline"
                      style={{ padding: '0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-start' }}
                    >
                      <MessageSquare size={16} color="var(--accent-blue)" /> Conversar & Alinhar Metas
                    </button>

                    <button
                      onClick={() => {
                        handlePraise(selectedMinisterForDetail.id, selectedMinisterForDetail.name);
                        setSelectedMinisterForDetail(null);
                      }}
                      className="btn btn-outline"
                      style={{ padding: '0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-start' }}
                    >
                      <ThumbsUp size={16} color="var(--accent-emerald)" /> Apoiar Publicamente (+Lealdade)
                    </button>

                    <button
                      onClick={() => {
                        handleWarn(selectedMinisterForDetail.id, selectedMinisterForDetail.name);
                        setSelectedMinisterForDetail(null);
                      }}
                      className="btn btn-outline"
                      style={{ padding: '0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-start' }}
                    >
                      <AlertOctagon size={16} color="#d97706" /> Advertir Reservadamente (-Risco)
                    </button>

                    <button
                      onClick={() => {
                        handleInvestigate(selectedMinisterForDetail.id, selectedMinisterForDetail.name);
                        setSelectedMinisterForDetail(null);
                      }}
                      className="btn btn-outline"
                      style={{ padding: '0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-start' }}
                    >
                      <FileSearch size={16} color="var(--accent-purple)" /> Investigar / Auditar pela CGU
                    </button>

                    <button
                      onClick={() => {
                        const portId = selectedMinisterForDetail.portfolioId;
                        setSelectedMinisterForDetail(null);
                        setSelectedPortfolioForNomination(portId);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-start' }}
                    >
                      <UserCheck size={16} /> Substituir Titular
                    </button>

                    <button
                      onClick={() => {
                        handleDismiss(selectedMinisterForDetail.id, selectedMinisterForDetail.portfolio);
                        setSelectedMinisterForDetail(null);
                      }}
                      className="btn btn-danger"
                      style={{ padding: '0.6rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-start' }}
                    >
                      <UserX size={16} /> Demitir do Cargo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
  );
};
