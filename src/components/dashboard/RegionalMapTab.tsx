'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Map, 
  TrendingUp, 
  ShieldAlert, 
  ThumbsUp, 
  Building2, 
  Users, 
  DollarSign, 
  Activity, 
  Sparkles, 
  Hammer, 
  Heart, 
  Home, 
  GraduationCap, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { Region, RegionalInvestmentType } from '@/game/types';

export const RegionalMapTab: React.FC = () => {
  const { state, applyRegionalInvestment } = useGame();
  const [selectedRegionId, setSelectedRegionId] = useState<string>('reg_planalto');
  const [viewMode, setViewMode] = useState<'economic' | 'crime' | 'approval' | 'infrastructure'>('economic');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!state) return null;

  const regions: Region[] = state.regions || [];
  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  // Helper para obter cor de preenchimento dinâmico do SVG conforme o modo
  const getRegionFillColor = (region: Region) => {
    const isSelected = region.id === selectedRegionId;

    if (viewMode === 'economic') {
      // PIB de 30 a 190 bi
      const ratio = Math.min(1, Math.max(0, (region.gdp - 30) / 160));
      // Gradiente de slate/azul claro (#93c5fd) a azul marinho profundo (#1d4ed8)
      return isSelected ? '#1e40af' : `rgb(${Math.round(147 - ratio * 118)}, ${Math.round(197 - ratio * 119)}, ${Math.round(253 - ratio * 37)})`;
    }

    if (viewMode === 'crime') {
      // Crime de 20 a 70
      const ratio = Math.min(1, Math.max(0, (region.crimeRate - 20) / 50));
      // Verde seguro (#10b981) -> Amarelo (#f59e0b) -> Vermelho crítico (#dc2626)
      if (ratio < 0.5) {
        return isSelected ? '#047857' : '#6ee7b7';
      } else {
        return isSelected ? '#991b1b' : '#f87171';
      }
    }

    if (viewMode === 'approval') {
      // Aprovação de 25% a 70%
      const ratio = Math.min(1, Math.max(0, (region.governmentApproval - 25) / 45));
      // Vermelho impopular (#f87171) a Esmeralda popular (#34d399)
      return isSelected ? '#047857' : ratio > 0.5 ? '#6ee7b7' : '#fca5a5';
    }

    if (viewMode === 'infrastructure') {
      // Infraestrutura de 30 a 85
      const ratio = Math.min(1, Math.max(0, (region.infrastructure - 30) / 55));
      // Roxo/Índigo
      return isSelected ? '#4338ca' : `rgb(${Math.round(199 - ratio * 90)}, ${Math.round(210 - ratio * 100)}, ${Math.round(254 - ratio * 50)})`;
    }

    return '#cbd5e1';
  };

  const handleApplyInvestment = (type: RegionalInvestmentType) => {
    if (!selectedRegion) return;
    applyRegionalInvestment(selectedRegion.id, type);
    setFeedback(`Investimento federal executado com sucesso em ${selectedRegion.name}. Efeitos imediatos contabilizados no orçamento e aprovação.`);
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast Feedback */}
      {feedback && (
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
          {feedback}
        </div>
      )}

      {/* Header com Seletor de Modo */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Map size={26} color="var(--accent-blue)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                Federação & Mapa Regional de Santa Cruz
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '680px' }}>
              Visualize a distribuição socioeconômica, política e de segurança pública entre as 5 macrorregiões da República. Clique sobre um estado para analisar seus gargalos e direcionar aportes orçamentários estratégicos.
            </p>
          </div>

          {/* Seletor de Modos do Mapa */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Camada de Visualização
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
              <button
                onClick={() => setViewMode('economic')}
                className="btn"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: viewMode === 'economic' ? '#ffffff' : 'transparent',
                  color: viewMode === 'economic' ? '#1d4ed8' : '#64748b',
                  boxShadow: viewMode === 'economic' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <TrendingUp size={14} /> Modo Econômico (PIB)
              </button>
              <button
                onClick={() => setViewMode('crime')}
                className="btn"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: viewMode === 'crime' ? '#ffffff' : 'transparent',
                  color: viewMode === 'crime' ? '#b91c1c' : '#64748b',
                  boxShadow: viewMode === 'crime' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <ShieldAlert size={14} /> Criminalidade
              </button>
              <button
                onClick={() => setViewMode('approval')}
                className="btn"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: viewMode === 'approval' ? '#ffffff' : 'transparent',
                  color: viewMode === 'approval' ? '#047857' : '#64748b',
                  boxShadow: viewMode === 'approval' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <ThumbsUp size={14} /> Apoio ao Governo
              </button>
              <button
                onClick={() => setViewMode('infrastructure')}
                className="btn"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: viewMode === 'infrastructure' ? '#ffffff' : 'transparent',
                  color: viewMode === 'infrastructure' ? '#6d28d9' : '#64748b',
                  boxShadow: viewMode === 'infrastructure' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <Building2 size={14} /> Infraestrutura
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Central: Mapa SVG 2D à Esquerda & Painel Regional Detalhado à Direita */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Lado Esquerdo: Mapa SVG Nativo */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Clique em uma macrorregião no mapa para inspecionar
            </span>
            <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
              População Total: {(state.country.population / 1_000_000).toFixed(1)}M
            </span>
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <svg
              viewBox="0 0 600 580"
              style={{ width: '100%', height: 'auto', maxHeight: '480px', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.04))' }}
            >
              {/* Contorno Geral e Regiões */}
              {regions.map(r => {
                const isSelected = r.id === selectedRegionId;
                const fill = getRegionFillColor(r);

                return (
                  <g key={r.id}>
                    <path
                      d={r.svgPath}
                      fill={fill}
                      stroke={isSelected ? '#1d4ed8' : '#64748b'}
                      strokeWidth={isSelected ? 3.5 : 1.5}
                      className={`svg-map-region ${isSelected ? 'active-region' : ''}`}
                      onClick={() => setSelectedRegionId(r.id)}
                    />
                    
                    {/* Rótulo da Região */}
                    <text
                      x={r.labelCoord.x}
                      y={r.labelCoord.y}
                      fill={isSelected ? '#ffffff' : '#0f172a'}
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      style={{ pointerEvents: 'none', textShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.9)' }}
                    >
                      {r.name.split(' ')[0]}
                    </text>
                    <text
                      x={r.labelCoord.x}
                      y={r.labelCoord.y + 14}
                      fill={isSelected ? '#e0e7ff' : '#475569'}
                      fontSize="9"
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {viewMode === 'economic' && `R$ ${r.gdp} bi`}
                      {viewMode === 'crime' && `Crime: ${r.crimeRate}`}
                      {viewMode === 'approval' && `Apoio: ${r.governmentApproval}%`}
                      {viewMode === 'infrastructure' && `Infra: ${r.infrastructure}`}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legenda Dinâmica no rodapé do mapa */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {viewMode === 'economic' && (
                <>
                  <span>🟦 Menor PIB (R$ 30 bi)</span>
                  <span>➜</span>
                  <span>🟦 Maior PIB Industrial (R$ 185 bi)</span>
                </>
              )}
              {viewMode === 'crime' && (
                <>
                  <span style={{ color: '#059669' }}>🟢 Baixa Violência (Seguro)</span>
                  <span>➜</span>
                  <span style={{ color: '#dc2626' }}>🔴 Alta Criminalidade (Facções)</span>
                </>
              )}
              {viewMode === 'approval' && (
                <>
                  <span style={{ color: '#dc2626' }}>🔴 Rejeição Forte (&lt; 35%)</span>
                  <span>➜</span>
                  <span style={{ color: '#059669' }}>🟢 Base Governista Sólida (&gt; 55%)</span>
                </>
              )}
              {viewMode === 'infrastructure' && (
                <>
                  <span>Gargalos e Rodovias Precárias</span>
                  <span>➜</span>
                  <span>Portos, Ferrovias e Energia</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lado Direito: Painel Detalhado da Região Selecionada */}
        <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {selectedRegion && (
            <>
              {/* Título da Região */}
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-blue" style={{ fontSize: '0.68rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      {selectedRegion.nickname}
                    </span>
                    <h3 className="font-title" style={{ fontSize: '1.3rem', color: '#0f172a', margin: '0.2rem 0' }}>
                      {selectedRegion.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Capital Regional: <strong>{selectedRegion.capital}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Apoio ao Governo</div>
                    <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: selectedRegion.governmentApproval >= 50 ? '#047857' : '#b91c1c' }}>
                      {selectedRegion.governmentApproval}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicadores Socioeconômicos da Região */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>POPULAÇÃO</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {(selectedRegion.population / 1_000_000).toFixed(1)} M
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PIB REGIONAL</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1d4ed8' }}>
                    R$ {selectedRegion.gdp} bi
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>DESEMPREGO</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: selectedRegion.unemployment > 14 ? '#b91c1c' : '#047857' }}>
                    {selectedRegion.unemployment}%
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>INFRAESTRUTURA</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#6d28d9' }}>
                    {selectedRegion.infrastructure}/100
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CRIMINALIDADE</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: selectedRegion.crimeRate > 50 ? '#dc2626' : '#059669' }}>
                    {selectedRegion.crimeRate}/100
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SAÚDE / EDUCAÇÃO</div>
                  <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {selectedRegion.healthIndex} / {selectedRegion.educationIndex}
                  </div>
                </div>
              </div>

              {/* Situação Política e Recursos */}
              <div style={{ background: '#eff6ff', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Situação Política & Governador
                </div>
                <div style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 600 }}>
                  {selectedRegion.politicalDominance.governorName} ({selectedRegion.politicalDominance.rulingPartyId.toUpperCase()})
                  <span className={`badge ${selectedRegion.politicalDominance.stanceToPresident === 'allied' ? 'badge-emerald' : 'badge-crimson'}`} style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>
                    {selectedRegion.politicalDominance.stanceToPresident === 'allied' ? 'Governador Aliado' : 'Governador de Oposição'}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.4' }}>
                  <strong>Demandas do Estado:</strong> {selectedRegion.politicalDominance.dominantInterests}
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {selectedRegion.naturalResources.map((res, i) => (
                    <span key={i} className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                      {res}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ações Presidenciais de Investimento Regional (Exigência Seção 9) */}
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="var(--accent-blue)" /> Direcionar Investimentos da União
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <button
                    onClick={() => handleApplyInvestment('highways')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.6rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a' }}>
                      <Hammer size={14} color="var(--accent-blue)" /> Construir Estrada/Ferrovia
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custo: R$ 1.8 bi • +12 Infra</span>
                  </button>

                  <button
                    onClick={() => handleApplyInvestment('industry_incentive')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.6rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a' }}>
                      <DollarSign size={14} color="var(--accent-gold)" /> Incentivo Industrial
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custo: R$ 2.2 bi • +PIB & Emprego</span>
                  </button>

                  <button
                    onClick={() => handleApplyInvestment('hospital')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.6rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f172a' }}>
                      <Heart size={14} color="#dc2626" /> Construir Hospital Regional
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custo: R$ 1.5 bi • +14 Saúde</span>
                  </button>

                  <button
                    onClick={() => handleApplyInvestment('housing')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.6rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#047857' }}>
                      <Home size={14} color="#047857" /> Programa Habitacional
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custo: R$ 2.0 bi • -Pobreza</span>
                  </button>

                  <button
                    onClick={() => handleApplyInvestment('education')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.6rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#7c3aed' }}>
                      <GraduationCap size={14} color="#7c3aed" /> Polo Tecnológico & Univ.
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custo: R$ 1.2 bi • +12 Educação</span>
                  </button>

                  <button
                    onClick={() => handleApplyInvestment('security')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '0.6rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#dc2626' }}>
                      <ShieldCheck size={14} color="#dc2626" /> Enviar Força Nacional
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custo: R$ 0.8 bi • -16 Crime</span>
                  </button>
                </div>
              </div>

              {/* Histórico de Aportes Recentes */}
              {selectedRegion.recentInvestments && selectedRegion.recentInvestments.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                  <strong>Aportes Recentes:</strong> {selectedRegion.recentInvestments.join(' • ')}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
