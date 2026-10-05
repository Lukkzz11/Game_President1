'use client';

import React from 'react';
import { useGame } from '@/game/state/GameContext';
import { PieChart, TrendingDown, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const BudgetTab: React.FC = () => {
  const { state, updateBudgetAmount } = useGame();
  if (!state) return null;

  const { budget, economy } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header com Balanço Orçamentário */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <PieChart size={26} color="var(--accent-blue)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                Orçamento Geral da União
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '680px' }}>
              Aloque os recursos federais entre as 12 áreas estratégicas da administração. Ajustes produzem efeitos imediatos na aprovação de grupos sociais e reverberam a médio prazo nos indicadores sociais e fiscais do país.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Despesas Primárias</div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                R$ {budget.totalSpending - budget.debtInterestCost} bi
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Juros da Dívida</div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-crimson)' }}>
                R$ {budget.debtInterestCost} bi
              </div>
            </div>

            <div style={{
              background: budget.nominalBalance >= 0 ? '#ecfdf5' : '#fef2f2',
              border: budget.nominalBalance >= 0 ? '1px solid #a7f3d0' : '1px solid #fecaca',
              boxShadow: 'var(--shadow-sm)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: budget.nominalBalance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)', fontWeight: 700 }}>
                {budget.nominalBalance >= 0 ? 'Superávit Nominal' : 'Déficit Nominal'}
              </div>
              <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: budget.nominalBalance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
                {budget.nominalBalance >= 0 ? `+${budget.nominalBalance}` : budget.nominalBalance} bi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Categorias Orçamentárias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {budget.categories.map(cat => (
          <div
            key={cat.id}
            className="glass-panel"
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</h4>
                <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  R$ {cat.amount.toFixed(1)} bi
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                {cat.description}
              </p>

              {/* Slider de Alocação */}
              <div className="slider-container" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>R$ 0 bi</span>
                  <span>{cat.percentOfTotal}% do Total</span>
                  <span>R$ 45 bi</span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={45}
                  step={0.5}
                  value={cat.amount}
                  onChange={e => updateBudgetAmount(cat.id, Number(e.target.value))}
                  className="range-slider"
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Participação no Gasto Federal: <strong>{cat.percentOfTotal}%</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
