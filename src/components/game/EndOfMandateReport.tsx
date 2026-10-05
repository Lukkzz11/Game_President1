'use client';

import React from 'react';
import { useGame } from '@/game/state/GameContext';
import { Award, Trophy, Scale, FileText, TrendingUp, CheckCircle, RotateCcw, Vote, Sparkles, ArrowRight } from 'lucide-react';

export const EndOfMandateReport: React.FC = () => {
  const { state, startNewGame, setGamePhase } = useGame();
  if (!state) return null;

  const currentMandateNumber = Math.max(1, Math.floor((state.turn - 1) / 8));
  const startYear = 2027 + (currentMandateNumber - 1) * 4;
  const endYear = startYear + 3;
  const nextMandateNumber = currentMandateNumber + 1;
  const nextStartYear = endYear + 1;

  const initialGdp = 420.0;
  const initialInflation = 12.4;
  const initialUnemployment = 14.2;
  const initialDebt = 82.0;
  const initialApproval = 34.0;

  const enactedLawsCount = state.laws.filter(l => l.status === 'enacted').length;
  const stfAppointedByPlayer = state.supremeCourt.justices.filter(j => j.appointedBy.includes(state.player.name)).length;
  const resolvedCrisesCount = state.resolvedEvents.length;

  const handleContinueInfiniteMandate = () => {
    // Adicionar bônus e registro histórico de reeleição
    state.politicalCapital = Math.min(100, (state.politicalCapital || 50) + 20);
    state.agenda = {
      totalActionPoints: 3,
      remainingActionPoints: 3,
      actionsTakenLog: []
    };
    state.timeline = [
      {
        id: `tl_reelection_${Date.now()}`,
        monthYear: `Jan/${nextStartYear}`,
        title: `Consagração Política: Início do ${nextMandateNumber}º Mandato (${nextStartYear}–${nextStartYear + 3})`,
        description: `O Presidente ${state.player.name} renova seu compromisso com a Nação e inicia um novo ciclo de quatro anos com aprovação de ${state.player.popularity}%.`,
        category: 'start',
        type: 'positive'
      },
      ...(state.timeline || [])
    ];
    setGamePhase('governing');
  };

  return (
    <div style={{ maxWidth: '860px', width: '100%', margin: '3rem auto', padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff' }}>
        <div style={{
          width: '74px',
          height: '74px',
          margin: '0 auto 1.25rem auto',
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '2px solid var(--border-gold)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Trophy size={40} color="#b45309" />
        </div>

        <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}>
            {currentMandateNumber}º Ciclo Presidencial Concluído (4 Anos de Governo)
          </span>
        </div>

        <h1 className="font-title" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Legado Político: Governo {startYear}–{endYear}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
          O mandato presidencial de <strong>{state.player.name}</strong> ({state.party.name}) atinge o término dos seus 8 semestres de gestão. As decisões econômicas, reformas tributárias e articulações no Congresso moldaram o destino da República.
        </p>

        {/* Tabela de Indicadores Inicial vs Final */}
        <div style={{
          background: '#f8fafc',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Balanço Comparativo da República
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PIB Nacional</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>
                R$ {state.economy.gdp} bi
              </div>
              <div style={{ fontSize: '0.68rem', color: state.economy.gdp > initialGdp ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                {state.economy.gdp > initialGdp ? `+${(state.economy.gdp - initialGdp).toFixed(1)} bi no período` : `${(state.economy.gdp - initialGdp).toFixed(1)} bi`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Inflação Anual</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: state.economy.inflation < initialInflation ? 'var(--accent-emerald)' : 'var(--accent-crimson)', margin: '0.25rem 0' }}>
                {state.economy.inflation}%
              </div>
              <div style={{ fontSize: '0.68rem', color: state.economy.inflation < initialInflation ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                {initialInflation}% → {state.economy.inflation}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Desemprego</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: state.economy.unemployment < initialUnemployment ? 'var(--accent-emerald)' : 'var(--accent-crimson)', margin: '0.25rem 0' }}>
                {state.economy.unemployment}%
              </div>
              <div style={{ fontSize: '0.68rem', color: state.economy.unemployment < initialUnemployment ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                {initialUnemployment}% → {state.economy.unemployment}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Dívida Pública</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: state.economy.publicDebt < initialDebt ? 'var(--accent-emerald)' : 'var(--accent-crimson)', margin: '0.25rem 0' }}>
                {state.economy.publicDebt}%
              </div>
              <div style={{ fontSize: '0.68rem', color: state.economy.publicDebt < initialDebt ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                {initialDebt}% → {state.economy.publicDebt}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Aprovação Popular</div>
              <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: state.player.popularity >= 50 ? 'var(--accent-emerald)' : 'var(--accent-gold)', margin: '0.25rem 0' }}>
                {state.player.popularity}%
              </div>
              <div style={{ fontSize: '0.68rem', color: state.player.popularity >= initialApproval ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                {initialApproval}% → {state.player.popularity}%
              </div>
            </div>
          </div>
        </div>

        {/* Resumo de Conquistas Institucionais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
            <FileText size={22} color="var(--accent-blue)" style={{ margin: '0 auto 0.4rem auto' }} />
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{enactedLawsCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Leis Promulgadas</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
            <Scale size={22} color="var(--accent-emerald)" style={{ margin: '0 auto 0.4rem auto' }} />
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stfAppointedByPlayer}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ministros Indicados ao STF</div>
          </div>

          <div style={{ background: '#ffffff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)' }}>
            <CheckCircle size={22} color="var(--accent-gold)" style={{ margin: '0 auto 0.4rem auto' }} />
            <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{resolvedCrisesCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Crises Nacionais Pacificadas</div>
          </div>
        </div>

        {/* AÇÕES DE TRANSIÇÃO E MODO INFINITO */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '1px solid #86efac',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#166534', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
            <Sparkles size={20} color="#15803d" /> Modo Infinito: Continuar no Poder
          </div>
          <p style={{ fontSize: '0.85rem', color: '#14532d', lineHeight: '1.45', margin: 0 }}>
            Você não precisa parar aqui! O simulador permite governar indefinidamente por múltiplos mandatos consecutivos (2031, 2035, 2040+), mantendo todas as estatais criadas, leis aprovadas, ministros nomeados e o patrimônio da sua nação intactos.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={handleContinueInfiniteMandate}
            className="btn btn-emerald pulse-gold"
            style={{ padding: '0.9rem 2.75rem', fontSize: '1.05rem', fontWeight: 800, width: '100%', maxWidth: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
          >
            <Award size={20} /> Iniciar {nextMandateNumber}º Mandato Presidencial ({nextStartYear}–{nextStartYear + 3}) <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={() => setGamePhase('campaign')}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
            >
              <Vote size={15} /> Disputar Eleição nas Urnas Novamente
            </button>

            <button
              onClick={() => startNewGame()}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem', color: '#64748b' }}
            >
              <RotateCcw size={15} /> Encerrar Carreira e Reiniciar do Zero
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
