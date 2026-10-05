'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  FileText, 
  Send, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Coins, 
  TrendingUp, 
  TrendingDown,
  Scale,
  Sparkles,
  Landmark,
  ShieldAlert,
  ArrowRight,
  HandCoins,
  History,
  PlusCircle,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Play
} from 'lucide-react';
import type { Law, CongressAmendment } from '@/game/types';
import { LegislativeEditorModal } from '@/components/politics/LegislativeEditorModal';
import { CongressionalVoteSessionModal } from '@/components/politics/CongressionalVoteSessionModal';

export const LawsTab: React.FC = () => {
  const { 
    state, 
    proposeNewLaw, 
    negotiateLawWithPork, 
    acceptLawAmendment, 
    vetoLawArticles,
    vetoOrRejectLaw,
    respondToParliamentarianBargain
  } = useGame();

  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [porkAmountSelected, setPorkAmountSelected] = useState<number>(2.0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showEditorModal, setShowEditorModal] = useState<boolean>(false);
  const [expandedArticlesLawId, setExpandedArticlesLawId] = useState<string | null>(null);
  const [liveVotingLaw, setLiveVotingLaw] = useState<Law | null>(null);

  // Estado para Veto Parcial
  const [vetoModalLaw, setVetoModalLaw] = useState<Law | null>(null);
  const [selectedVetoAmendments, setSelectedVetoAmendments] = useState<string[]>([]);
  const [selectedVetoArticles, setSelectedVetoArticles] = useState<number[]>([]);

  if (!state) return null;

  const handleVoteCompleted = (passed: boolean, finalYes: number, finalNo: number) => {
    if (!liveVotingLaw) return;
    if (passed) {
      acceptLawAmendment(liveVotingLaw.id);
    } else {
      vetoOrRejectLaw(liveVotingLaw.id);
    }
    setLiveVotingLaw(null);
  };

  const { laws, congress, budget } = state;

  const filteredLaws = laws.filter(l => {
    if (categoryFilter === 'all') return true;
    return l.category === categoryFilter;
  });

  const draftLaws = filteredLaws.filter(l => l.status === 'draft');
  const amendedLaws = filteredLaws.filter(l => l.status === 'amended_by_congress' || l.status === 'in_congress' || l.status === 'approved_congress');
  const enactedLaws = filteredLaws.filter(l => l.status === 'enacted');

  const handlePropose = (lawId: string) => {
    setSubmittingId(lawId);
    setTimeout(() => {
      proposeNewLaw(lawId);
      setSubmittingId(null);
    }, 600);
  };

  const handleBargainPork = (lawId: string) => {
    setSubmittingId(lawId);
    setTimeout(() => {
      negotiateLawWithPork(lawId, porkAmountSelected);
      setSubmittingId(null);
    }, 600);
  };

  const handleOpenPartialVeto = (law: Law) => {
    setVetoModalLaw(law);
    // Por padrão, sugere vetar jabutis paroquiais se houver
    const jabutiIds = law.congressAmendments.filter(a => a.type === 'jabuti' && a.status === 'approved_by_congress').map(a => a.id);
    setSelectedVetoAmendments(jabutiIds);
    setSelectedVetoArticles([]);
  };

  const handleConfirmPartialVeto = () => {
    if (!vetoModalLaw) return;
    vetoLawArticles(vetoModalLaw.id, selectedVetoArticles, selectedVetoAmendments);
    setVetoModalLaw(null);
  };

  const getAmendmentBadge = (type: CongressAmendment['type']) => {
    switch (type) {
      case 'jabuti':
        return <span className="stamp-rider">Jabuti / Emenda Paroquial</span>;
      case 'fatiamento':
        return <span className="badge badge-crimson">Fatiamento Orçamentário</span>;
      case 'modificativa':
        return <span className="badge badge-blue">Emenda Modificativa</span>;
      case 'supressiva':
        return <span className="badge badge-crimson">Emenda Supressiva</span>;
      case 'aditiva':
        return <span className="badge badge-emerald">Emenda Aditiva</span>;
      default:
        return <span className="badge badge-gold">Emenda de Relator</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Presidencial */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <FileText size={26} color="var(--accent-blue)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                Processo Legislativo & Redação de Leis
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '750px', lineHeight: '1.5' }}>
              Redija e envie projetos de lei, reformas ou emendas constitucionais. O Congresso analisa seus artigos, apresenta emendas modificativas ou jabutis corporativos, e devolve o autógrafo para deliberação de <strong>Sanção Integral</strong>, <strong>Veto Parcial</strong> ou <strong>Veto Total</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1.25rem',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Emendas Empenhadas</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                R$ {state.porkBudgetSpent || 0} bi
              </div>
            </div>

            <button
              onClick={() => setShowEditorModal(true)}
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <PlusCircle size={16} /> Redigir Nova Proposição
            </button>
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
          {[
            { id: 'all', label: 'Todas as Matérias' },
            { id: 'economic', label: 'Econômica & Fiscal' },
            { id: 'social', label: 'Social & Cidadania' },
            { id: 'infrastructure', label: 'Infraestrutura' },
            { id: 'labor', label: 'Trabalho & Renda' },
            { id: 'security', label: 'Segurança & Justiça' },
            { id: 'political', label: 'Institucional' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setCategoryFilter(f.id)}
              className={`badge ${categoryFilter === f.id ? 'badge-blue' : 'badge-purple'}`}
              style={{
                cursor: 'pointer',
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                background: categoryFilter === f.id ? '#eff6ff' : '#ffffff',
                border: categoryFilter === f.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                color: categoryFilter === f.id ? '#1d4ed8' : '#475569'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SEÇÃO 1: MATÉRIAS EM TRAMITAÇÃO COM EMENDAS E AUTÓGRAFO PRESIDENCIAL */}
      {amendedLaws.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Landmark size={20} color="var(--accent-gold)" />
            <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
              Em Tramitação / Autógrafo do Congresso ({amendedLaws.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {amendedLaws.map(law => {
              const currentVotes = law.congressSupport;
              const majorityNeeded = law.propositionType === 'constitutional_amendment' ? 308 : 257;
              const willPass = currentVotes >= majorityNeeded;
              const isArticlesExpanded = expandedArticlesLawId === law.id;

              return (
                <div
                  key={law.id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    borderLeft: `4px solid ${willPass ? 'var(--accent-emerald)' : 'var(--accent-gold)'}`,
                    background: '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span className="badge badge-blue font-mono" style={{ fontSize: '0.7rem' }}>
                          {law.numberCode || 'PL Executivo'}
                        </span>
                        <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                          {law.category.toUpperCase()}
                        </span>
                        {law.congressAmendments && law.congressAmendments.length > 0 && (
                          <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                            Substitutivo do Relator com Emendas
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        {law.title}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Quórum no Plenário ({majorityNeeded} necessários)
                      </div>
                      <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: willPass ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                        {currentVotes} / 513 Votos
                      </div>
                      <span style={{ fontSize: '0.72rem', color: willPass ? '#047857' : '#b91c1c', fontWeight: 600 }}>
                        {willPass ? 'Aprovado pelo Plenário' : 'Faltam ' + (majorityNeeded - currentVotes) + ' votos'}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
                    {law.summaryEmenta || law.description}
                  </p>

                  {/* Toggle para visualizar redação dos artigos originais */}
                  {law.articles && law.articles.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => setExpandedArticlesLawId(isArticlesExpanded ? null : law.id)}
                        className="btn btn-outline"
                        style={{ fontSize: '0.76rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Eye size={13} />
                        {isArticlesExpanded ? 'Ocultar Texto da Minuta' : `Ver Texto Original dos ${law.articles.length} Artigos`}
                        {isArticlesExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isArticlesExpanded && (
                        <div style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          marginTop: '0.5rem',
                          fontSize: '0.82rem',
                          color: '#334155',
                          lineHeight: '1.5'
                        }}>
                          {law.articles.map(art => (
                            <div key={art.id} style={{ marginBottom: '0.45rem' }}>
                              <strong>{art.text.slice(0, 8)}</strong> {art.text.slice(8)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Emendas e Jabutis do Congresso */}
                  {law.congressAmendments && law.congressAmendments.length > 0 && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '1.15rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 800, fontSize: '0.86rem' }}>
                          <ShieldAlert size={16} /> Emendas Parlamentares Votadas nas Comissões:
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#92400e' }}>
                          O Presidente pode sancionar o substitutivo ou aplicar Veto Parcial
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {law.congressAmendments.map(am => {
                          const isApproved = am.status === 'approved_by_congress';
                          return (
                            <div 
                              key={am.id} 
                              style={{ 
                                background: '#ffffff', 
                                padding: '0.75rem 1rem', 
                                borderRadius: 'var(--radius-sm)', 
                                border: isApproved ? '1px solid #bbf7d0' : '1px solid #fecdd3', 
                                fontSize: '0.82rem' 
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  {getAmendmentBadge(am.type)}
                                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{am.title || am.description}</span>
                                </div>
                                <span className={isApproved ? 'badge badge-emerald' : 'badge badge-crimson'} style={{ fontSize: '0.68rem' }}>
                                  {isApproved ? `Aprovada (${am.votesFavor || 280} x ${am.votesAgainst || 233})` : `Rejeitada (${am.votesFavor || 190} x ${am.votesAgainst || 323})`}
                                </span>
                              </div>

                              <p style={{ color: '#475569', fontSize: '0.78rem', margin: '0 0 0.35rem 0', lineHeight: '1.4' }}>
                                {am.description}
                              </p>

                              {am.proposedArticleText && (
                                <div style={{ fontSize: '0.76rem', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', borderLeft: '2px solid #3b82f6', color: '#1e293b', fontStyle: 'italic', marginBottom: '0.35rem' }}>
                                  Texto Modificado: &quot;{am.proposedArticleText}&quot;
                                </div>
                              )}

                              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                                {am.impactSummary}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* NEGOCIAÇÃO DIRETA COM PARLAMENTARES & LÍDERES DE BANCADA */}
                  {law.directBargains && law.directBargains.length > 0 && (
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <HandCoins size={16} color="var(--accent-gold)" />
                        Negociações Individuais & Demandas de Bancadas Estaduais
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {law.directBargains.map(b => (
                          <div 
                            key={b.id}
                            style={{
                              background: '#ffffff',
                              border: b.status === 'accepted' ? '1px solid #86efac' : b.status === 'refused' ? '1px solid #fca5a5' : b.status === 'counter_offered' ? '1px solid #93c5fd' : '1px solid #cbd5e1',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.85rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>{b.parliamentarianName}</span>
                                <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>{b.party} • {b.stateName}</span>
                              </div>
                              <div>
                                {b.status === 'pending' && <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>Demanda Pendente de Resposta</span>}
                                {b.status === 'accepted' && <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Acordo Firmado (+{b.votesOffered} votos)</span>}
                                {b.status === 'refused' && <span className="badge badge-crimson" style={{ fontSize: '0.68rem' }}>Demanda Recusada (Voto Contrário)</span>}
                                {b.status === 'counter_offered' && <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>Contraproposta Homologada (+{Math.round(b.votesOffered * 0.75)} votos)</span>}
                              </div>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#334155', fontStyle: 'italic', margin: 0, lineHeight: '1.4' }}>
                              &quot;{b.demandText}&quot;
                            </p>

                            {b.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                                <button
                                  type="button"
                                  onClick={() => respondToParliamentarianBargain(law.id, b.id, 'accept')}
                                  className="btn btn-primary"
                                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem' }}
                                >
                                  Aceitar Demanda (+{b.votesOffered} votos, -R$ {b.fiscalCostBi} bi)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => respondToParliamentarianBargain(law.id, b.id, 'counter')}
                                  className="btn btn-secondary"
                                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem' }}
                                >
                                  Contraproposta (-6 Cap. Político, Meio-Termo R$ {(b.fiscalCostBi / 2).toFixed(1)} bi)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => respondToParliamentarianBargain(law.id, b.id, 'refuse')}
                                  className="btn btn-outline"
                                  style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', color: '#b91c1c', borderColor: '#fca5a5' }}
                                >
                                  Recusar Pedido (Manter Disciplina Fiscal)
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Autógrafo Presidencial e Articulação de Votos */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                        Emendas Orçamentárias:
                      </span>
                      <select
                        value={porkAmountSelected}
                        onChange={e => setPorkAmountSelected(Number(e.target.value))}
                        className="input-select"
                        style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <option value={1.0}>Liberar R$ 1.0 bi (+14 votos)</option>
                        <option value={2.0}>Liberar R$ 2.0 bi (+28 votos)</option>
                        <option value={3.5}>Liberar R$ 3.5 bi (+45 votos)</option>
                      </select>

                      <button
                        onClick={() => handleBargainPork(law.id)}
                        disabled={submittingId === law.id}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                      >
                        <HandCoins size={14} color="var(--accent-gold)" /> Articular Apoio
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setLiveVotingLaw(law)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', fontWeight: 700 }}
                      >
                        <Play size={14} /> Votação no Plenário
                      </button>

                      <button
                        onClick={() => vetoOrRejectLaw(law.id)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                      >
                        <X size={14} /> Veto Total
                      </button>

                      {law.congressAmendments && law.congressAmendments.length > 0 && (
                        <button
                          onClick={() => handleOpenPartialVeto(law)}
                          className="btn btn-outline"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem', borderColor: '#d97706', color: '#b45309' }}
                        >
                          <Scale size={14} /> Veto Parcial
                        </button>
                      )}

                      <button
                        onClick={() => acceptLawAmendment(law.id)}
                        className="btn btn-emerald"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 1.15rem', fontWeight: 700 }}
                      >
                        <Check size={14} /> Sancionar e Promulgar Lei
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEÇÃO 2: MATÉRIAS PRONTAS PARA ENVIAR AO PLENÁRIO */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="var(--accent-blue)" />
          <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
            Propostas do Executivo Aguardando Envio ({draftLaws.length})
          </h3>
        </div>

        {draftLaws.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhum projeto pendente nesta categoria. Clique em <strong>&quot;Redigir Nova Proposição&quot;</strong> para formular um projeto estruturado.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {draftLaws.map(law => {
              const estimatedSupport = congress.coalitionSeats;
              const willPass = estimatedSupport >= 257;

              return (
                <div
                  key={law.id}
                  className="glass-panel"
                  style={{
                    padding: '1.35rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#ffffff'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                        {law.category.toUpperCase()}
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: law.costPerYear > 0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)' }}>
                        {law.costPerYear > 0 ? `Custo: R$ ${law.costPerYear} bi/ano` : `Economia: R$ ${Math.abs(law.costPerYear)} bi/ano`}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                      {law.title}
                    </h4>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
                      {law.summaryEmenta || law.description}
                    </p>

                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.76rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      marginBottom: '1rem'
                    }}>
                      <div><strong>Impacto Econômico:</strong> {law.economicImpactSummary}</div>
                      <div><strong>Impacto Social:</strong> {law.socialImpactSummary}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: willPass ? '#047857' : '#b45309', fontWeight: 600 }}>
                      Base Estimada: {estimatedSupport} / 513
                    </div>

                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      <button
                        type="button"
                        onClick={() => setLiveVotingLaw(law)}
                        className="btn btn-gold"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.95rem', fontWeight: 700 }}
                      >
                        <Play size={14} /> Votação ao Vivo
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePropose(law.id)}
                        disabled={submittingId === law.id}
                        className="btn btn-outline"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                      >
                        <Send size={14} /> Protocolar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEÇÃO 3: LEIS PROMULGADAS & HISTÓRICO DE REFORMAS */}
      {enactedLaws.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FileCheck size={20} color="var(--accent-emerald)" />
            <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
              Leis e Reformas Promulgadas em Vigor ({enactedLaws.length})
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {enactedLaws.map(law => (
              <div 
                key={law.id}
                className="glass-panel"
                style={{
                  padding: '1.15rem',
                  borderLeft: '4px solid var(--accent-emerald)',
                  background: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-emerald font-mono" style={{ fontSize: '0.68rem' }}>
                    {law.numberCode || 'LEI ORDINÁRIA'}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Turno {law.turnEnacted || law.turnProposed}
                  </span>
                </div>

                <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem', marginBottom: '0.35rem' }}>
                  {law.title}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                  {law.summaryEmenta || law.description}
                </p>

                <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 600 }}>
                  Impacto: R$ {law.costPerYear} bi/ano • +{law.popularityImpact}% aprovação popular
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal do Editor Legislativo Oficial */}
      {showEditorModal && (
        <LegislativeEditorModal onClose={() => setShowEditorModal(false)} />
      )}

      {/* Modal de Deliberação de Veto Parcial */}
      {vetoModalLaw && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '680px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
              <div>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>Prerrogativa Presidencial</span>
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0.2rem 0 0 0' }}>
                  Autógrafo da Lei: Aplicar Veto Parcial
                </h3>
              </div>
              <button onClick={() => setVetoModalLaw(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Selecione quais emendas ou jabutis corporativos aprovados pelo Congresso Nacional você deseja <strong>VETAR</strong> antes de sancionar a lei:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1.5rem' }}>
              {vetoModalLaw.congressAmendments.filter(a => a.status === 'approved_by_congress').map(am => {
                const isSelected = selectedVetoAmendments.includes(am.id);
                return (
                  <div
                    key={am.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedVetoAmendments(selectedVetoAmendments.filter(id => id !== am.id));
                      } else {
                        setSelectedVetoAmendments([...selectedVetoAmendments, am.id]);
                      }
                    }}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid #ef4444' : '1px solid #cbd5e1',
                      background: isSelected ? '#fef2f2' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <strong style={{ color: isSelected ? '#b91c1c' : '#0f172a', fontSize: '0.88rem' }}>
                        {isSelected ? '❌ VETAR: ' : '✓ MANTER: '}{am.title || am.description}
                      </strong>
                      <span className="badge badge-gold font-mono" style={{ fontSize: '0.68rem' }}>
                        {am.type.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                      {am.description}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
              <button onClick={() => setVetoModalLaw(null)} className="btn btn-outline">
                Cancelar
              </button>
              <button onClick={handleConfirmPartialVeto} className="btn btn-danger" style={{ padding: '0.65rem 1.5rem', fontWeight: 700 }}>
                <Scale size={16} /> Homologar Veto Parcial e Promulgar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSÃO PLENÁRIA DE VOTAÇÃO AO VIVO NO CONGRESSO */}
      {liveVotingLaw && (
        <CongressionalVoteSessionModal
          law={liveVotingLaw}
          onClose={() => setLiveVotingLaw(null)}
          onVoteCompleted={handleVoteCompleted}
        />
      )}
    </div>
  );
};
