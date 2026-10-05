'use client';

import React from 'react';
import { 
  TrendingUp, 
  Landmark, 
  Users, 
  Hammer, 
  Globe2,
  DollarSign,
  Activity,
  ShieldAlert,
  ThumbsUp,
  Scale
} from 'lucide-react';
import type { MapFilterCategory, MapFilterMetric } from '@/game/types';

interface MapFilterBarProps {
  activeCategory: MapFilterCategory;
  activeMetric: MapFilterMetric;
  onSelectMetric: (category: MapFilterCategory, metric: MapFilterMetric) => void;
  isWorldMode: boolean;
}

export const MapFilterBar: React.FC<MapFilterBarProps> = ({
  activeCategory,
  activeMetric,
  onSelectMetric,
  isWorldMode
}) => {
  const categories: { id: MapFilterCategory; label: string; icon: any; availableInWorld: boolean }[] = [
    { id: 'economy', label: 'Economia', icon: TrendingUp, availableInWorld: true },
    { id: 'politics', label: 'Política', icon: Landmark, availableInWorld: true },
    { id: 'society', label: 'Sociedade', icon: Users, availableInWorld: false },
    { id: 'infrastructure', label: 'Infraestrutura', icon: Hammer, availableInWorld: false },
    { id: 'diplomacy', label: 'Diplomacia & Comércio', icon: Globe2, availableInWorld: true }
  ];

  const metricsByCategory: Record<MapFilterCategory, { id: MapFilterMetric; label: string }[]> = {
    economy: [
      { id: 'gdp', label: 'PIB Total' },
      { id: 'gdpPerCapita', label: 'PIB per Capita' },
      { id: 'gdpGrowth', label: 'Crescimento (%)' },
      { id: 'unemployment', label: 'Desemprego' },
      { id: 'inflation', label: 'Inflação' }
    ],
    politics: [
      { id: 'rulingParty', label: 'Partido no Poder' },
      { id: 'governmentApproval', label: 'Aprovação Popular' },
      { id: 'politicalStability', label: 'Estabilidade' }
    ],
    society: [
      { id: 'poverty', label: 'Pobreza' },
      { id: 'education', label: 'Educação' },
      { id: 'health', label: 'Saúde' },
      { id: 'crime', label: 'Criminalidade' }
    ],
    infrastructure: [
      { id: 'infrastructure_overall', label: 'Infraestrutura Geral' },
      { id: 'infrastructure_transport', label: 'Transporte & Rodovias' },
      { id: 'infrastructure_energy', label: 'Energia & Saneamento' }
    ],
    diplomacy: [
      { id: 'diplomatic_status', label: 'Afinidade Diplomática' },
      { id: 'trade_volume', label: 'Comércio Bilateral' }
    ]
  };

  const currentMetrics = metricsByCategory[activeCategory] || [];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.25rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* Linha 1: Categorias Principais */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            const disabled = isWorldMode && !cat.availableInWorld;

            return (
              <button
                key={cat.id}
                disabled={disabled}
                onClick={() => {
                  const defaultMetric = metricsByCategory[cat.id][0]?.id || 'gdp';
                  onSelectMetric(cat.id, defaultMetric);
                }}
                className="btn"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: isSelected ? '#1d4ed8' : '#f8fafc',
                  color: isSelected ? '#ffffff' : disabled ? '#cbd5e1' : '#475569',
                  border: isSelected ? '1px solid #1d4ed8' : '1px solid #e2e8f0',
                  opacity: disabled ? 0.45 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer'
                }}
              >
                <Icon size={15} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Indicador de Filtro Ativo */}
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
          Visualização Ativa: <span style={{ color: '#1d4ed8' }}>{currentMetrics.find(m => m.id === activeMetric)?.label || activeMetric}</span>
        </span>
      </div>

      {/* Linha 2: Métricas Específicas da Categoria Selecionada */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, alignSelf: 'center', marginRight: '0.3rem' }}>
          Filtros:
        </span>
        {currentMetrics.map(metric => {
          const isSelected = activeMetric === metric.id;
          return (
            <button
              key={metric.id}
              onClick={() => onSelectMetric(activeCategory, metric.id)}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: isSelected ? 700 : 500,
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                background: isSelected ? '#eff6ff' : '#ffffff',
                color: isSelected ? '#1d4ed8' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {metric.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
