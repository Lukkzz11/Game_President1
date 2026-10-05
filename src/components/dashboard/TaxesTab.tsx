'use client';

import React, { useState, useMemo } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Scale, 
  Building2, 
  Users,
  RotateCcw,
  Zap,
  Info,
  DollarSign
} from 'lucide-react';
import type { Tax } from '@/game/types';

function computeTaxRevenue(tax: Tax, rate: number, gdp: number): number {
  let baseFactor = 1.0;
  if (tax.category === 'income') baseFactor = 0.28;
  else if (tax.category === 'corporate') baseFactor = 0.18;
  else if (tax.category === 'consumption') baseFactor = 0.35;
  else if (tax.category === 'fuel') baseFactor = 0.08;
  else if (tax.category === 'wealth') baseFactor = 0.03;
  else if (tax.category === 'import') baseFactor = 0.08;

  const rateEfficiency = rate > 38 ? Math.max(0.65, 1 - (rate - 38) * 0.016) : 1.0;
  return Math.round((gdp * baseFactor * (rate / 100) * rateEfficiency) * 10) / 10;
}

export const TaxesTab: React.FC = () => {
  const { state, updateTaxRate } = useGame();
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!state) return null;

  const { taxes, budget, economy } = state;
  const gdp = economy.gdp;

  // Calcular arrecadação total projetada em tempo real com base nas alíquotas atuais
  const { totalProjectedRevenue, initialTotalRevenue, netRevenueDelta } = useMemo(() => {
    let projectedSum = 0;
    let initialSum = 0;

    taxes.forEach(t => {
      const currentCalculated = computeTaxRevenue(t, t.rate, gdp);
      const initialCalculated = computeTaxRevenue(t, t.initialRate, gdp);
      projectedSum += currentCalculated;
      initialSum += initialCalculated;
    });

    return {
      totalProjectedRevenue: Math.round(projectedSum * 10) / 10,
      initialTotalRevenue: Math.round(initialSum * 10) / 10,
      netRevenueDelta: Math.round((projectedSum - initialSum) * 10) / 10
    };
  }, [taxes, gdp]);

  const toggleTip = (id: string) => {
    setExpandedTipId(expandedTipId === id ? null : id);
  };

  const handleResetAllTaxes = () => {
    taxes.forEach(t => {
      updateTaxRate(t.id, t.initialRate);
    });
    setFeedbackMessage('Alíquotas restauradas para os padrões originais de referência.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleApplyQuickTune = (taxId: string, currentRate: number, delta: number) => {
    const newRate = Math.max(0, Math.min(50, Math.round((currentRate + delta) * 2) / 2));
    updateTaxRate(taxId, newRate);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header com Simulador da Receita Federal em Tempo Real */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff', borderTop: '4px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Coins size={28} color="#d97706" />
              <h2 className="font-title" style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
                Sistema Tributário & Política Fiscal da República
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '740px', lineHeight: '1.5', margin: 0 }}>
              Monitore e calibre as alíquotas nacionais em tempo real. Cada ajuste recalcula imediatamente a projeção de arrecadação do Tesouro Nacional, o risco da <strong>Curva de Laffer</strong> (evasão e fuga de capitais) e o impacto sobre o consumo e investimento.
            </p>
          </div>

          {/* Painel de Impacto Fiscal ao Vivo */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.35rem',
            minWidth: '280px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.04em' }}>
                Arrecadação Projetada
              </span>
              <span className="badge font-mono" style={{
                background: netRevenueDelta >= 0 ? '#dcfce7' : '#fee2e2',
                color: netRevenueDelta >= 0 ? '#15803d' : '#b91c1c',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {netRevenueDelta >= 0 ? `+R$ ${netRevenueDelta} bi` : `-R$ ${Math.abs(netRevenueDelta)} bi`}
              </span>
            </div>

            <div className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.1', marginBottom: '0.35rem' }}>
              R$ {totalProjectedRevenue} bi
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}> / semestre</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
              <span>Carga Tributária:</span>
              <strong>~{Math.round((totalProjectedRevenue / gdp) * 100 * 10) / 10}% do PIB</strong>
            </div>

            <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: '0.6rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleResetAllTaxes}
                className="btn btn-outline"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Voltar todas as alíquotas para as taxas de referência inicial"
              >
                <RotateCcw size={12} /> Restaurar Padrões
              </button>
            </div>
          </div>
        </div>

        {feedbackMessage && (
          <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', color: '#065f46', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} /> {feedbackMessage}
          </div>
        )}
      </div>

      {/* Grid de Impostos Interativos com Transmissão Dinâmica */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.35rem' }}>
        {taxes.map(tax => {
          const isLafferWarning = tax.rate > 38;
          const isExpanded = expandedTipId === tax.id;
          const tips = tax.transmissionTips;

          // Cálculo do impacto da alíquota atual vs inicial
          const currentComputedRevenue = computeTaxRevenue(tax, tax.rate, gdp);
          const initialComputedRevenue = computeTaxRevenue(tax, tax.initialRate, gdp);
          const deltaRevenue = Math.round((currentComputedRevenue - initialComputedRevenue) * 10) / 10;
          const deltaRate = Math.round((tax.rate - tax.initialRate) * 10) / 10;

          // Eficiência tributária (penalidade se > 38%)
          const efficiencyLossPct = tax.rate > 38 ? Math.round((tax.rate - 38) * 1.6) : 0;

          return (
            <div
              key={tax.id}
              className="glass-panel"
              style={{
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
                borderTop: isLafferWarning ? '4px solid #dc2626' : '4px solid #2563eb',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}
            >
              <div>
                {/* Cabeçalho do Tributo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                      {tax.name}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Incidência: {tax.category === 'income' ? 'Renda das Famílias' : tax.category === 'corporate' ? 'Lucro Empresarial' : tax.category === 'consumption' ? 'Consumo & Serviços' : tax.category === 'fuel' ? 'Combustíveis & Energia' : tax.category === 'wealth' ? 'Grandes Patrimônios' : 'Comércio Exterior'}
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: isLafferWarning ? '#dc2626' : '#2563eb' }}>
                      {tax.rate.toFixed(1)}%
                    </div>
                    {deltaRate !== 0 && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: deltaRate > 0 ? '#15803d' : '#b91c1c' }}>
                        {deltaRate > 0 ? `+${deltaRate}%` : `${deltaRate}%`} vs base
                      </span>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.45', marginBottom: '1rem' }}>
                  {tax.description}
                </p>

                {/* Caixa de Impacto Imediato na Arrecadação (O que Sobe / O que Cai) */}
                <div style={{
                  background: deltaRevenue > 0 ? '#f0fdf4' : deltaRevenue < 0 ? '#fef2f2' : '#f8fafc',
                  border: `1px solid ${deltaRevenue > 0 ? '#bbf7d0' : deltaRevenue < 0 ? '#fecaca' : '#e2e8f0'}`,
                  borderRadius: '6px',
                  padding: '0.6rem 0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    {deltaRevenue > 0 ? (
                      <TrendingUp size={16} color="#16a34a" />
                    ) : deltaRevenue < 0 ? (
                      <TrendingDown size={16} color="#dc2626" />
                    ) : (
                      <Info size={16} color="#64748b" />
                    )}
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: deltaRevenue > 0 ? '#15803d' : deltaRevenue < 0 ? '#991b1b' : '#475569' }}>
                      {deltaRevenue > 0 ? 'Expansão de Arrecadação:' : deltaRevenue < 0 ? 'Queda de Arrecadação:' : 'Alíquota de Equilíbrio:'}
                    </span>
                  </div>

                  <span className="font-mono" style={{ fontSize: '0.88rem', fontWeight: 800, color: deltaRevenue > 0 ? '#15803d' : deltaRevenue < 0 ? '#b91c1c' : '#475569' }}>
                    {deltaRevenue > 0 ? `+R$ ${deltaRevenue} bi` : deltaRevenue < 0 ? `-R$ ${Math.abs(deltaRevenue)} bi` : 'R$ 0.0 bi'}
                  </span>
                </div>

                {/* Slider Interativo de Alíquota */}
                <div className="slider-container" style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
                    <span>0% (Isenção)</span>
                    <span style={{ color: '#0369a1', fontWeight: 600 }}>Inicial: {tax.initialRate}%</span>
                    <span>50% (Teto Máx.)</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={0.5}
                    value={tax.rate}
                    onChange={e => updateTaxRate(tax.id, Number(e.target.value))}
                    className="range-slider"
                  />

                  {/* Barra da Curva de Laffer com Zonas de Risco */}
                  <div style={{ marginTop: '0.4rem', position: 'relative' }}>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #10b981 0%, #10b981 60%, #f59e0b 76%, #ef4444 100%)'
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.64rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      <span>Zona Neutra</span>
                      <span style={{ color: '#d97706' }}>Ponto Ótimo (~35%)</span>
                      <span style={{ color: '#ef4444' }}>Perigo Laffer (&gt;38%)</span>
                    </div>
                  </div>
                </div>

                {/* Alerta de Curva de Laffer se > 38% */}
                {isLafferWarning && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    padding: '0.55rem 0.75rem',
                    marginBottom: '0.85rem',
                    fontSize: '0.74rem',
                    color: '#991b1b',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.45rem'
                  }}>
                    <AlertTriangle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Evasão Fiscal Ativa:</strong> Alíquota em {tax.rate}% desestimula a formalização. Fuga de capitais e sonegação reduzem a eficácia de arrecadação em <strong>-{efficiencyLossPct}%</strong>.
                    </div>
                  </div>
                )}

                {/* Botões de Ajuste Fino (+0.5%, -0.5%) */}
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTune(tax.id, tax.rate, -1)}
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: '0.74rem', padding: '0.3rem 0.5rem' }}
                    title="Diminuir alíquota em 1%"
                  >
                    -1.0%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTune(tax.id, tax.rate, -0.5)}
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: '0.74rem', padding: '0.3rem 0.5rem' }}
                    title="Diminuir alíquota em 0.5%"
                  >
                    -0.5%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTune(tax.id, tax.rate, 0.5)}
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: '0.74rem', padding: '0.3rem 0.5rem' }}
                    title="Aumentar alíquota em 0.5%"
                  >
                    +0.5%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTune(tax.id, tax.rate, 1)}
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: '0.74rem', padding: '0.3rem 0.5rem' }}
                    title="Aumentar alíquota em 1%"
                  >
                    +1.0%
                  </button>
                </div>

                {/* Botão de Dica Econômica / Transmissão */}
                <button
                  type="button"
                  onClick={() => toggleTip(tax.id)}
                  style={{
                    width: '100%',
                    background: isExpanded ? '#eff6ff' : '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: isExpanded ? '#1d4ed8' : '#475569',
                    marginBottom: '0.85rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <HelpCircle size={15} color={isExpanded ? '#1d4ed8' : '#64748b'} />
                    💡 Mecanismos Econômicos & Efeitos no Mundo Real
                  </span>
                  {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                {/* Gaveta de Transmissão Econômica */}
                {isExpanded && tips && (
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.85rem',
                    marginBottom: '1rem',
                    fontSize: '0.76rem',
                    lineHeight: '1.45',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    {/* Curto Prazo */}
                    <div style={{ marginBottom: '0.65rem' }}>
                      <div style={{ fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.04em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} /> Curto Prazo (Efeito Imediato):
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#334155' }}>
                        {tips.shortTermEffects.map((eff, i) => (
                          <li key={i}>{eff}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Médio Prazo */}
                    <div style={{ marginBottom: '0.65rem' }}>
                      <div style={{ fontWeight: 800, color: '#b45309', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.04em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <TrendingUp size={12} /> Médio Prazo (Ajuste de Mercado):
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#334155' }}>
                        {tips.mediumTermEffects.map((eff, i) => (
                          <li key={i}>{eff}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Longo Prazo */}
                    <div style={{ marginBottom: '0.65rem' }}>
                      <div style={{ fontWeight: 800, color: '#15803d', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.04em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Building2 size={12} /> Longo Prazo (Capacidade Produtiva):
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#334155' }}>
                        {tips.longTermEffects.map((eff, i) => (
                          <li key={i}>{eff}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Trade-Off Central */}
                    <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.45rem', marginTop: '0.45rem', color: '#475569', fontStyle: 'italic' }}>
                      ⚖️ <strong>Trade-off:</strong> {tips.tradeOffSummary}
                    </div>
                  </div>
                )}
              </div>

              {/* Rodapé com Arrecadação Real Atualizada */}
              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Arrecadação Projetada:</span>
                <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                  R$ {currentComputedRevenue} bi/sem
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
