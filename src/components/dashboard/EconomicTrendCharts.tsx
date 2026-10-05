'use client';

import React, { useState } from 'react';
import type { GameState } from '@/game/types';
import { 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Users, 
  ShieldAlert, 
  PieChart, 
  LineChart,
  Calendar
} from 'lucide-react';

interface EconomicTrendChartsProps {
  state: GameState;
}

type MetricCategory = 'macro' | 'fiscal' | 'social';

export const EconomicTrendCharts: React.FC<EconomicTrendChartsProps> = ({ state }) => {
  const [category, setCategory] = useState<MetricCategory>('macro');
  const [activeMetricId, setActiveMetricId] = useState<string>('inflation');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Histórico ordenado cronologicamente (Turno 1 ao Turno Atual)
  const history = [...state.turnHistory].reverse();
  const currentTurn = state.turn;

  // Rótulos do eixo X (ex: "2027-1", "2027-2")
  const xLabels = Array.from({ length: currentTurn }, (_, i) => {
    const turnNum = i + 1;
    const year = 2027 + Math.floor((turnNum - 1) / 2);
    const sem = turnNum % 2 === 1 ? '1' : '2';
    return `${year}.${sem}`;
  });

  // Extração ou inferência das séries a partir do GameState e do TurnReport
  // 1. Inflação
  const inflationData = [12.4];
  // 2. Desemprego
  const unempData = [14.2];
  // 3. PIB
  const gdpData = [420.0];
  // 4. Crescimento PIB
  const gdpGrowthData = [0.5];
  // 5. Dívida Pública
  const debtData = [82.0];
  // 6. Gastos Públicos
  const spendingData = [state.budget.totalSpending];
  // 7. Receita Federal
  const revenueData = [state.budget.totalRevenue];
  // 8. Saldo / Déficit
  const balanceData = [state.budget.nominalBalance];
  // 9. Aprovação Popular
  const approvalData = [34];
  // 10. Taxa de Pobreza
  const povertyData = [24];
  // 11. Desigualdade (Gini)
  const inequalityData = [0.51];
  // 12. Criminalidade
  const crimeData = [48];

  history.forEach(h => {
    if (h.inflation !== undefined) inflationData.push(h.inflation);
    else inflationData.push(Math.round((inflationData[inflationData.length - 1] + h.inflationDelta) * 10) / 10);

    if (h.unemployment !== undefined) unempData.push(h.unemployment);
    else unempData.push(Math.round((unempData[unempData.length - 1] + h.unemploymentDelta) * 10) / 10);

    if (h.gdp !== undefined) gdpData.push(h.gdp);
    else gdpData.push(Math.round((gdpData[gdpData.length - 1] + (h.gdpDelta || 0.3)) * 10) / 10);

    gdpGrowthData.push(h.gdpDelta);
    debtData.push(h.publicDebt !== undefined ? h.publicDebt : Math.round((debtData[debtData.length - 1] + h.publicDebtDelta) * 10) / 10);
    spendingData.push(h.spending);
    revenueData.push(h.revenue);
    balanceData.push(h.balance);
    approvalData.push(h.approval !== undefined ? h.approval : Math.max(5, Math.min(95, approvalData[approvalData.length - 1] + h.approvalDelta)));
    povertyData.push(h.povertyRate !== undefined ? h.povertyRate : 23);
    inequalityData.push(h.inequalityGini !== undefined ? h.inequalityGini : 0.50);
    crimeData.push(h.crimeRate !== undefined ? h.crimeRate : 46);
  });

  // Garantir que o valor atual no turno seja igual ao do GameState
  inflationData[inflationData.length - 1] = state.economy.inflation;
  unempData[unempData.length - 1] = state.economy.unemployment;
  gdpData[gdpData.length - 1] = state.economy.gdp;
  gdpGrowthData[gdpGrowthData.length - 1] = state.economy.gdpGrowth;
  debtData[debtData.length - 1] = state.economy.publicDebt;
  spendingData[spendingData.length - 1] = state.budget.totalSpending;
  revenueData[revenueData.length - 1] = state.budget.totalRevenue;
  balanceData[balanceData.length - 1] = state.budget.nominalBalance;
  approvalData[approvalData.length - 1] = state.player.popularity;

  // Catálogo de Métricas
  const metricsCatalog = {
    // Macro
    inflation: { name: 'Inflação Acumulada', unit: '% a.a.', data: inflationData, color: '#dc2626', min: 0, max: 20, desc: 'Índice Geral de Preços ao Consumidor. Meta Central: 4.5%.' },
    unemployment: { name: 'Taxa de Desemprego', unit: '%', data: unempData, color: '#d97706', min: 0, max: 22, desc: 'Percentual da População Economicamente Ativa desocupada.' },
    gdp: { name: 'PIB da República', unit: 'R$ bi', data: gdpData, color: '#2563eb', min: 380, max: 500, desc: 'Produto Interno Bruto em bilhões de unidades monetárias.' },
    gdpGrowth: { name: 'Crescimento Real do PIB', unit: '%', data: gdpGrowthData, color: '#059669', min: -4, max: 8, desc: 'Variação percentual semestral da atividade econômica.' },
    
    // Fiscal
    debt: { name: 'Dívida Pública Bruta', unit: '% do PIB', data: debtData, color: '#7c3aed', min: 40, max: 110, desc: 'Passivo consolidado do governo federal em proporção à riqueza anual.' },
    spending: { name: 'Despesas Públicas Totais', unit: 'R$ bi', data: spendingData, color: '#ea580c', min: 80, max: 220, desc: 'Gastos primários e despesas obrigatórias da União por semestre.' },
    revenue: { name: 'Receita Arrecadada', unit: 'R$ bi', data: revenueData, color: '#0284c7', min: 80, max: 220, desc: 'Tributos, taxas e contribuições recolhidas pela Receita Federal.' },
    balance: { name: 'Resultado Nominal (Balanço)', unit: 'R$ bi', data: balanceData, color: '#047857', min: -40, max: 30, desc: 'Superávit (+) ou Déficit (-) nominal após encargos da dívida.' },

    // Social
    approval: { name: 'Aprovação Presidencial', unit: '%', data: approvalData, color: '#2563eb', min: 0, max: 100, desc: 'Apoio popular aferido pelo Instituto Nacional de Opinião Pública.' },
    poverty: { name: 'Taxa de Pobreza', unit: '%', data: povertyData, color: '#b91c1c', min: 0, max: 50, desc: 'Parcela da população vivendo abaixo da linha de vulnerabilidade básica.' },
    inequality: { name: 'Desigualdade (Índice de Gini)', unit: 'pts', data: inequalityData, color: '#9333ea', min: 0.35, max: 0.65, desc: 'Concentração de renda (0 = igualdade plena, 1 = concentração absoluta).' },
    crime: { name: 'Índice de Criminalidade', unit: '/100', data: crimeData, color: '#b91c1c', min: 0, max: 100, desc: 'Taxa agregada de homicídios e delitos violentos por 100 mil habitantes.' }
  };

  const currentMetric = metricsCatalog[activeMetricId as keyof typeof metricsCatalog] || metricsCatalog.inflation;

  // Renderizador SVG de Gráfico Dinâmico Nativo com Escala Real
  const renderInteractiveChart = (
    data: number[],
    color: string,
    minVal: number,
    maxVal: number,
    unit: string
  ) => {
    const width = 640;
    const height = 190;
    const paddingLeft = 45;
    const paddingRight = 25;
    const paddingTop = 25;
    const paddingBottom = 35;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Calcular min e max reais ajustados
    const actualMin = Math.min(minVal, ...data);
    const actualMax = Math.max(maxVal, ...data);
    const range = actualMax - actualMin || 1;

    // Linhas de Grade Verticais e Horizontais (4 faixas)
    const gridYLevels = [0, 0.33, 0.66, 1];

    const getX = (index: number) => {
      if (data.length <= 1) return paddingLeft + chartWidth / 2;
      return paddingLeft + (index / (data.length - 1)) * chartWidth;
    };

    const getY = (val: number) => {
      const normalized = (val - actualMin) / range;
      return paddingTop + chartHeight - normalized * chartHeight;
    };

    const points = data.map((val, idx) => `${getX(idx)},${getY(val)}`).join(' ');

    // Área sob a curva
    const areaPoints = data.length > 1
      ? `${getX(0)},${paddingTop + chartHeight} ${points} ${getX(data.length - 1)},${paddingTop + chartHeight}`
      : '';

    return (
      <div style={{ position: 'relative', width: '100%', userSelect: 'none' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <defs>
            <linearGradient id={`grad-${activeMetricId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas de Grade Horizontais */}
          {gridYLevels.map((lvl, i) => {
            const y = paddingTop + chartHeight - lvl * chartHeight;
            const val = actualMin + lvl * range;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                >
                  {val.toFixed(val > 10 ? 0 : 1)}
                </text>
              </g>
            );
          })}

          {/* Área preenchida */}
          {areaPoints && (
            <polygon points={areaPoints} fill={`url(#grad-${activeMetricId})`} />
          )}

          {/* Linha principal */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Pontos de dados e tooltips nativos */}
          {data.map((val, idx) => {
            const cx = getX(idx);
            const cy = getY(val);
            const isHovered = hoveredPointIndex === idx;
            const isLast = idx === data.length - 1;

            return (
              <g 
                key={idx}
                onMouseEnter={() => setHoveredPointIndex(idx)}
                onMouseLeave={() => setHoveredPointIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : isLast ? 5 : 3.5}
                  fill={isHovered ? '#ffffff' : color}
                  stroke={color}
                  strokeWidth={isHovered ? 3 : 1.5}
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Rótulo do Eixo X no rodapé */}
                <text
                  x={cx}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isLast ? '#0f172a' : '#64748b'}
                  fontSize="9.5"
                  fontWeight={isLast ? 'bold' : 'normal'}
                  fontFamily="var(--font-mono)"
                >
                  {xLabels[idx] || `S${idx + 1}`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip Flutuante */}
        {hoveredPointIndex !== null && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '15px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.78rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            pointerEvents: 'none',
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <span>Semestre {hoveredPointIndex + 1} ({xLabels[hoveredPointIndex]}):</span>
            <strong className="font-mono" style={{ color: '#60a5fa', fontSize: '0.9rem' }}>
              {data[hoveredPointIndex]} {unit}
            </strong>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
      {/* Cabeçalho do Card de Gráficos */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 className="font-title" style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} color="var(--accent-blue)" /> Trajetória Histórica das Métricas Nacionais
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Gráficos dinâmicos que registram a evolução a cada 6 meses de mandato. Passe o mouse nos pontos para inspecionar os valores exatos.
          </p>
        </div>

        {/* Seletor de Categoria */}
        <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => { setCategory('macro'); setActiveMetricId('inflation'); }}
            className="btn"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: category === 'macro' ? '#ffffff' : 'transparent',
              color: category === 'macro' ? '#1d4ed8' : '#64748b',
              boxShadow: category === 'macro' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <TrendingUp size={13} style={{ marginRight: '0.3rem' }} /> Macroeconômico
          </button>

          <button
            onClick={() => { setCategory('fiscal'); setActiveMetricId('debt'); }}
            className="btn"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: category === 'fiscal' ? '#ffffff' : 'transparent',
              color: category === 'fiscal' ? '#7c3aed' : '#64748b',
              boxShadow: category === 'fiscal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <DollarSign size={13} style={{ marginRight: '0.3rem' }} /> Orçamento & Dívida
          </button>

          <button
            onClick={() => { setCategory('social'); setActiveMetricId('approval'); }}
            className="btn"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: category === 'social' ? '#ffffff' : 'transparent',
              color: category === 'social' ? '#059669' : '#64748b',
              boxShadow: category === 'social' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Users size={13} style={{ marginRight: '0.3rem' }} /> Social & Opinião
          </button>
        </div>
      </div>

      {/* Título da Métrica Selecionada com Valor Atual e Descrição */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem', paddingBottom: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: currentMetric.color }} />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              {currentMetric.name}
            </h4>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {currentMetric.desc}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Posição no Turno {currentTurn}</div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: currentMetric.color }}>
            {currentMetric.data[currentMetric.data.length - 1]} {currentMetric.unit}
          </div>
        </div>
      </div>

      {/* Renderização do Gráfico SVG */}
      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
        {renderInteractiveChart(
          currentMetric.data,
          currentMetric.color,
          currentMetric.min,
          currentMetric.max,
          currentMetric.unit
        )}
      </div>

      {/* Seletor Rápido de Métricas da Categoria */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
        {category === 'macro' && (
          <>
            <button
              onClick={() => setActiveMetricId('inflation')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'inflation' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                background: activeMetricId === 'inflation' ? '#fef2f2' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Inflação</div>
              <strong className="font-mono" style={{ color: '#dc2626' }}>{state.economy.inflation}%</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('unemployment')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'unemployment' ? '2px solid #d97706' : '1px solid #e2e8f0',
                background: activeMetricId === 'unemployment' ? '#fffbeb' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Desemprego</div>
              <strong className="font-mono" style={{ color: '#d97706' }}>{state.economy.unemployment}%</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('gdp')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'gdp' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: activeMetricId === 'gdp' ? '#eff6ff' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>PIB Total</div>
              <strong className="font-mono" style={{ color: '#2563eb' }}>R$ {state.economy.gdp} bi</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('gdpGrowth')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'gdpGrowth' ? '2px solid #059669' : '1px solid #e2e8f0',
                background: activeMetricId === 'gdpGrowth' ? '#ecfdf5' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Crescimento</div>
              <strong className="font-mono" style={{ color: '#059669' }}>{state.economy.gdpGrowth}%</strong>
            </button>
          </>
        )}

        {category === 'fiscal' && (
          <>
            <button
              onClick={() => setActiveMetricId('debt')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'debt' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                background: activeMetricId === 'debt' ? '#f5f3ff' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Dívida / PIB</div>
              <strong className="font-mono" style={{ color: '#7c3aed' }}>{state.economy.publicDebt}%</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('spending')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'spending' ? '2px solid #ea580c' : '1px solid #e2e8f0',
                background: activeMetricId === 'spending' ? '#fff7ed' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Despesas</div>
              <strong className="font-mono" style={{ color: '#ea580c' }}>R$ {state.budget.totalSpending} bi</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('revenue')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'revenue' ? '2px solid #0284c7' : '1px solid #e2e8f0',
                background: activeMetricId === 'revenue' ? '#f0f9ff' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Receita</div>
              <strong className="font-mono" style={{ color: '#0284c7' }}>R$ {state.budget.totalRevenue} bi</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('balance')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'balance' ? '2px solid #047857' : '1px solid #e2e8f0',
                background: activeMetricId === 'balance' ? '#ecfdf5' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Saldo Nominal</div>
              <strong className="font-mono" style={{ color: state.budget.nominalBalance >= 0 ? '#047857' : '#b91c1c' }}>
                R$ {state.budget.nominalBalance} bi
              </strong>
            </button>
          </>
        )}

        {category === 'social' && (
          <>
            <button
              onClick={() => setActiveMetricId('approval')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'approval' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                background: activeMetricId === 'approval' ? '#eff6ff' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Aprovação</div>
              <strong className="font-mono" style={{ color: '#2563eb' }}>{state.player.popularity}%</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('poverty')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'poverty' ? '2px solid #b91c1c' : '1px solid #e2e8f0',
                background: activeMetricId === 'poverty' ? '#fef2f2' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Pobreza</div>
              <strong className="font-mono" style={{ color: '#b91c1c' }}>24%</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('inequality')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'inequality' ? '2px solid #9333ea' : '1px solid #e2e8f0',
                background: activeMetricId === 'inequality' ? '#faf5ff' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Gini</div>
              <strong className="font-mono" style={{ color: '#9333ea' }}>0.51</strong>
            </button>

            <button
              onClick={() => setActiveMetricId('crime')}
              className="btn btn-outline"
              style={{
                padding: '0.45rem',
                fontSize: '0.72rem',
                textAlign: 'left',
                border: activeMetricId === 'crime' ? '2px solid #b91c1c' : '1px solid #e2e8f0',
                background: activeMetricId === 'crime' ? '#fef2f2' : '#ffffff'
              }}
            >
              <div style={{ color: 'var(--text-muted)' }}>Criminalidade</div>
              <strong className="font-mono" style={{ color: '#b91c1c' }}>48/100</strong>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
