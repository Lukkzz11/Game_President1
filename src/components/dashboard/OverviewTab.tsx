'use client';

import React from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Scale, 
  Newspaper, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Flame, 
  CheckCircle2,
  X,
  Zap,
  Building2,
  AlertTriangle,
  History,
  FileText,
  DollarSign,
  Map
} from 'lucide-react';
import type { NavTab } from '@/components/dashboard/SidebarNav';
import { EconomicTrendCharts } from '@/components/dashboard/EconomicTrendCharts';
import { CongressionalHemiciclo } from '@/components/dashboard/CongressionalHemiciclo';
import { PresidentialAgendaCard } from '@/components/dashboard/PresidentialAgendaCard';

interface OverviewTabProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab }) => {
  const { state, executePresidentialDossier, clearActionFeedback } = useGame();
  if (!state) return null;

  const { 
    economy, 
    budget, 
    congress, 
    supremeCourt, 
    news, 
    polls, 
    delayedConsequences, 
    presidentialDossiers, 
    lastActionFeedback, 
    timeline 
  } = state;

  const activeJustices = supremeCourt.justices.filter(j => j.status === 'active');
  const progressives = activeJustices.filter(j => j.ideology < -20).length;
  const conservatives = activeJustices.filter(j => j.ideology > 20).length;
  const moderates = activeJustices.filter(j => Math.abs(j.ideology) <= 20).length;

  const latestPoll = polls[0] || {
    governmentApproval: state.player.popularity,
    governmentDisapproval: 50,
    ifElectionToday: []
  };

  const pendingDelayed = delayedConsequences || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. BANNER DE FEEDBACK IMEDIATO: CONSEQUÊNCIA DO DESPACHO */}
      {lastActionFeedback && (
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.1)',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803d'
              }}>
                <CheckCircle2 size={20} />
              </div>
              <h4 style={{ fontWeight: 800, color: '#14532d', fontSize: '1.05rem', margin: 0 }}>
                Despacho Presidencial Homologado: {lastActionFeedback.title}
              </h4>
            </div>
            <button 
              onClick={clearActionFeedback}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#166534',
                padding: '0.25rem',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Dispensar aviso"
            >
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#166534', margin: '0 0 0.85rem 0', lineHeight: '1.45' }}>
            {lastActionFeedback.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {lastActionFeedback.deltas.map((d, i) => (
              <span 
                key={i} 
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: d.isPositive ? '#dcfce7' : '#fee2e2',
                  color: d.isPositive ? '#15803d' : '#b91c1c',
                  border: `1px solid ${d.isPositive ? '#bbf7d0' : '#fecaca'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {d.label}: <strong>{d.value}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. AGENDA DO PRESIDENTE: GESTÃO DE TEMPO & ESCOLHAS ESTRATÉGICAS */}
      <PresidentialAgendaCard />

      {/* 3. MESA DE DESPACHO PRESIDENCIAL: SITUAÇÃO -> DECISÃO -> CONSEQUÊNCIA */}
      <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-crimson" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                Centro de Comando
              </span>
              <h2 className="font-title" style={{ fontSize: '1.35rem', color: '#0f172a', margin: 0 }}>
                Mesa de Despacho Presidencial
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0 }}>
              Situações que exigem deliberação direta do Chefe de Estado. Suas escolhas geram impactos imediatos e reverberam nos semestres seguintes.
            </p>
          </div>

          <span className="badge badge-neutral font-mono" style={{ fontSize: '0.8rem' }}>
            {presidentialDossiers.length} {presidentialDossiers.length === 1 ? 'dossiê pendente' : 'dossiês pendentes'}
          </span>
        </div>

        {presidentialDossiers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {presidentialDossiers.map(dossier => (
              <div 
                key={dossier.id}
                style={{
                  background: '#f8fafc',
                  border: dossier.urgency === 'critical' ? '1.5px solid #f87171' : '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                {/* Cabeçalho do Dossiê */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span 
                      className={dossier.urgency === 'critical' ? 'badge badge-crimson' : dossier.urgency === 'high' ? 'badge badge-gold' : 'badge badge-blue'}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {dossier.urgency === 'critical' ? 'URGÊNCIA MÁXIMA' : dossier.urgency === 'high' ? 'PRIORIDADE ALTA' : 'ANÁLISE DE ROTINA'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Origem: {dossier.source}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.45rem' }}>
                  {dossier.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1.25rem' }}>
                  {dossier.description}
                </p>

                {/* Opções de Decisão */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                  {dossier.options.map(opt => (
                    <div 
                      key={opt.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-xs)',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                          {opt.description}
                        </div>
                      </div>

                      <div>
                        {/* Tags de Previsão de Impacto */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                          {opt.consequences.popularityDelta !== undefined && opt.consequences.popularityDelta !== 0 && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: opt.consequences.popularityDelta > 0 ? '#15803d' : '#b91c1c' }}>
                              {opt.consequences.popularityDelta > 0 ? '+' : ''}{opt.consequences.popularityDelta}% Aprovação
                            </span>
                          )}
                          {opt.consequences.budgetDelta !== undefined && opt.consequences.budgetDelta !== 0 && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: opt.consequences.budgetDelta > 0 ? '#b91c1c' : '#15803d' }}>
                              {opt.consequences.budgetDelta > 0 ? `-R$ ${opt.consequences.budgetDelta} bi` : `+R$ ${Math.abs(opt.consequences.budgetDelta)} bi`}
                            </span>
                          )}
                          {opt.consequences.inflationDelta !== undefined && opt.consequences.inflationDelta !== 0 && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: opt.consequences.inflationDelta < 0 ? '#15803d' : '#b91c1c' }}>
                              {opt.consequences.inflationDelta > 0 ? '+' : ''}{opt.consequences.inflationDelta}% Inflação
                            </span>
                          )}
                          {opt.consequences.congressSupportDelta !== undefined && opt.consequences.congressSupportDelta !== 0 && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: opt.consequences.congressSupportDelta > 0 ? '#15803d' : '#b91c1c' }}>
                              {opt.consequences.congressSupportDelta > 0 ? '+' : ''}{opt.consequences.congressSupportDelta} Deputados
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => executePresidentialDossier(dossier.id, opt.id)}
                          className="btn btn-primary"
                          style={{ width: '100%', fontSize: '0.82rem', padding: '0.55rem' }}
                        >
                          <Zap size={14} /> Despachar Decisão
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 0.75rem auto',
              borderRadius: '50%',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#047857'
            }}>
              <CheckCircle2 size={26} />
            </div>
            <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
              Mesa de Despacho Limpa
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '580px', margin: '0 auto' }}>
              Todas as crises e decisões imediatas deste semestre foram resolvidas. Você pode articular projetos de lei com o Congresso, ajustar alíquotas ou clicar em <strong>&quot;Avançar Semestre (6 Meses)&quot;</strong> no topo da tela.
            </p>
          </div>
        )}
      </div>

      {/* Alerta de Vaga Aberta no Supremo Tribunal */}
      {supremeCourt.vacancies > 0 && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-lg)',
          padding: '1.15rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #fca5a5'
            }}>
              <Scale size={22} color="var(--accent-crimson)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                Vaga aberta no Supremo Tribunal Federal ({supremeCourt.vacancies} vaga{supremeCourt.vacancies > 1 ? 's' : ''})
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                A Corte Suprema aguarda indicação presidencial para sabatina e votação nominal pelo Congresso Nacional.
              </div>
            </div>
          </div>
          <button onClick={() => onNavigateTab('supreme_court')} className="btn btn-danger" style={{ whiteSpace: 'nowrap' }}>
            Indicar Ministro <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Alerta de Consequências de Longo Prazo em Maturação */}
      {pendingDelayed.length > 0 && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Clock size={18} color="var(--accent-gold)" />
            <h4 className="font-title" style={{ fontSize: '1rem', color: '#0f172a' }}>
              Consequências de Longo Prazo em Maturação ({pendingDelayed.length})
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {pendingDelayed.map(c => {
              const turnsRemaining = c.triggerTurn - state.turn;
              return (
                <div key={c.id} style={{
                  background: '#ffffff',
                  border: '1px solid #fde68a',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: '#b45309', fontSize: '0.84rem' }}>{c.title}</span>
                    <span className="badge badge-gold font-mono" style={{ fontSize: '0.68rem' }}>
                      Eclode em {turnsRemaining > 0 ? `${turnsRemaining} semestre${turnsRemaining > 1 ? 's' : ''}` : 'Breve'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.35' }}>
                    Origem: <strong>{c.source}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. GRID PRINCIPAL DE INDICADORES DA REPÚBLICA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        {/* PIB */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Produto Interno Bruto (PIB)
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
            R$ {economy.gdp} bi
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: economy.gdpGrowth >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)', fontWeight: 600 }}>
            {economy.gdpGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{economy.gdpGrowth > 0 ? `+${economy.gdpGrowth}%` : `${economy.gdpGrowth}%`} ao ano</span>
          </div>
        </div>

        {/* Inflação */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Inflação Anual Acumulada
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: economy.inflation > 9 ? 'var(--accent-crimson)' : 'var(--accent-gold)', margin: '0.3rem 0' }}>
            {economy.inflation}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Meta Central BC: 4.5% a.a.
          </div>
        </div>

        {/* Desemprego */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Taxa de Desemprego
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: economy.unemployment > 12 ? 'var(--accent-crimson)' : '#0f172a', margin: '0.3rem 0' }}>
            {economy.unemployment}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            População Ativa: ~28 Milhões
          </div>
        </div>

        {/* Dívida Pública */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dívida Pública / PIB
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: economy.publicDebt > 80 ? 'var(--accent-crimson)' : 'var(--accent-emerald)', margin: '0.3rem 0' }}>
            {economy.publicDebt}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Taxa de Juros Básica: {economy.interestRate}% a.a.
          </div>
        </div>

        {/* Balanço Fiscal */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: '#ffffff' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Resultado Fiscal Nominal
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: budget.nominalBalance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)', margin: '0.3rem 0' }}>
            {budget.nominalBalance >= 0 ? `+${budget.nominalBalance} bi` : `${budget.nominalBalance} bi`}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Receita: {budget.totalRevenue} bi • Gasto: {budget.totalSpending} bi
          </div>
        </div>

        {/* Investimento & Economia Real */}
        <div className="glass-panel" style={{ padding: '1.25rem', background: '#ffffff', cursor: 'pointer' }} onClick={() => onNavigateTab('enterprises')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Investimento Total / PIB
            </div>
            <span className="badge badge-blue font-mono" style={{ fontSize: '0.65rem' }}>Estatais & Privado</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', margin: '0.3rem 0' }}>
            {economy.investmentRate}%
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Privado: {economy.privateInvestmentRate || 11.2}%</span>
            <span>Público: {economy.publicInvestmentRate || 3.3}%</span>
          </div>
        </div>
      </div>

      {/* BANNER RÁPIDO DO MAPA DA FEDERAÇÃO 2D */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
        border: '1px solid #bae6fd',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 10px rgba(14, 165, 233, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1px solid #7dd3fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284c7',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.15)'
          }}>
            <Map size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ fontWeight: 800, color: '#0369a1', fontSize: '1.05rem', margin: 0 }}>
                Federação & Território: 5 Estados Federados
              </h4>
              <span className="badge badge-blue font-mono" style={{ fontSize: '0.7rem' }}>
                Mapa SVG Interativo
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
              Acompanhe PIB regional, criminalidade, aprovação popular e destine aportes federais para infraestrutura, saúde e segurança nos estados.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {state.regions?.map(r => (
              <div 
                key={r.id}
                title={`${r.name}: ${r.governmentApproval}% de aprovação | PIB R$ ${r.gdp} bi`}
                style={{
                  padding: '0.3rem 0.55rem',
                  borderRadius: '6px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: r.governmentApproval >= 50 ? '#15803d' : '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>{r.name.split(' ')[0]}</span>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748b' }}>{r.governmentApproval}%</span>
              </div>
            ))}
          </div>

          <button 
            type="button" 
            onClick={() => onNavigateTab('regional_map')}
            className="btn btn-primary"
            style={{ fontSize: '0.84rem', padding: '0.55rem 1.1rem', whiteSpace: 'nowrap' }}
          >
            Abrir Mapa da Federação <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* 4. LINHA DO TEMPO DA REPÚBLICA + PESQUISAS ELEITORAIS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem' }}>
        
        {/* Linha do Tempo Cronológica */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="var(--accent-blue)" /> Linha do Tempo da República
            </h3>
            <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
              Histórico Político Mês a Mês
            </span>
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingRight: '0.35rem' }}>
            {timeline && timeline.length > 0 ? (
              timeline.map(item => {
                const badgeColor = 
                  item.type === 'positive' ? '#10b981' :
                  item.type === 'warning' ? '#f59e0b' :
                  item.type === 'negative' ? '#ef4444' : '#64748b';

                return (
                  <div 
                    key={item.id}
                    style={{
                      borderLeft: `3px solid ${badgeColor}`,
                      paddingLeft: '0.85rem',
                      background: '#f8fafc',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                      borderTop: '1px solid #f1f5f9',
                      borderBottom: '1px solid #f1f5f9',
                      borderRight: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span className="badge font-mono" style={{ fontSize: '0.68rem', background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a' }}>
                        {item.monthYear}
                      </span>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700, color: badgeColor }}>
                        {item.category}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem', marginBottom: '0.2rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: '1.35' }}>
                      {item.description}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                Nenhum acontecimento registrado na linha do tempo ainda.
              </div>
            )}
          </div>
        </div>

        {/* Pesquisas Eleitorais & Aprovação Popular */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--accent-blue)" /> Pesquisa de Aprovação Popular
            </h3>
            <span className="badge badge-blue">{latestPoll.date}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#047857', textTransform: 'uppercase', fontWeight: 700 }}>Aprova o Governo</div>
              <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857' }}>
                {latestPoll.governmentApproval}%
              </div>
            </div>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#b91c1c', textTransform: 'uppercase', fontWeight: 700 }}>Desaprova o Governo</div>
              <div className="font-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b91c1c' }}>
                {latestPoll.governmentDisapproval}%
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Cenário Eleitoral Espontâneo
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {latestPoll.ifElectionToday.map((cand, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? 'var(--accent-blue)' : '#0f172a' }}>
                      {cand.candidateName} ({cand.partyName})
                    </span>
                    <span className="font-mono" style={{ fontWeight: 700 }}>{cand.percentage}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${cand.percentage}%`,
                        background: idx === 0 ? '#2563eb' : '#94a3b8'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. GRÁFICOS DE TENDÊNCIA HISTÓRICA + HEMICICLO PARLAMENTAR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        <EconomicTrendCharts state={state} />
        <CongressionalHemiciclo congress={congress} onNavigateTab={onNavigateTab} />
      </div>

      {/* 6. EQUILÍBRIO NO STF + SALA DE IMPRENSA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Painel do STF */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} color="var(--accent-purple)" /> Equilíbrio no Supremo Tribunal Federal
            </h3>
            <button onClick={() => onNavigateTab('supreme_court')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
              Ver Plenário
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.68rem', color: '#6d28d9', fontWeight: 700 }}>PROGRESSISTAS</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#6d28d9' }}>{progressives}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.68rem', color: '#475569', fontWeight: 700 }}>MODERADOS</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#475569' }}>{moderates}</div>
            </div>
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700 }}>CONSERVADORES</div>
              <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#047857' }}>{conservatives}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
            A composição atual de 11 magistrados define probabilisticamente a constitucionalidade de reformas fiscais e atos do Executivo questionados por ADIs da oposição.
          </div>
        </div>

        {/* Sala de Imprensa & Opinião Pública */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 className="font-title" style={{ fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Newspaper size={18} color="var(--accent-blue)" /> Sala de Imprensa & Editoriais
            </h4>
            <button onClick={() => onNavigateTab('press')} className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}>
              Ver Todos os Jornais
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {news.slice(0, 3).map(n => (
              <div key={n.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem' }}>
                  &quot;{n.headline}&quot;
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {n.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
