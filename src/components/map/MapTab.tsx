'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Map as MapIcon, 
  Globe2, 
  TrendingUp, 
  Users, 
  Building2, 
  DollarSign, 
  Flag,
  Handshake,
  Layers
} from 'lucide-react';
import type { Region, WorldCountry, MapFilterCategory, MapFilterMetric } from '@/game/types';
import dynamic from 'next/dynamic';
import { MapFilterBar } from '@/components/map/MapFilterBar';
import { RegionDetailModal } from '@/components/map/RegionDetailModal';
import { CountryDetailModal } from '@/components/map/CountryDetailModal';

const ProfessionalGeoMap = dynamic(
  () => import('@/components/map/ProfessionalGeoMap').then(m => m.ProfessionalGeoMap),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        height: '620px',
        width: '100%',
        borderRadius: 'var(--radius-xl)',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        gap: '0.75rem'
      }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Inicializando Cartografia de Alta Definição...</div>
      </div>
    )
  }
);

export const MapTab: React.FC = () => {
  const { state, setActiveMapMode } = useGame();
  
  const [mapMode, setMapMode] = useState<'national' | 'world'>('national');
  const [activeCategory, setActiveCategory] = useState<MapFilterCategory>('economy');
  const [activeMetric, setActiveMetric] = useState<MapFilterMetric>('gdp');
  
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<WorldCountry | null>(null);

  if (!state) return null;

  const regions: Region[] = state.regions || [];
  const worldCountries: WorldCountry[] = state.worldCountries || [];

  const handleToggleMode = (mode: 'national' | 'world') => {
    setMapMode(mode);
    setActiveMapMode(mode);
    if (mode === 'world' && (activeCategory === 'society' || activeCategory === 'infrastructure')) {
      setActiveCategory('diplomacy');
      setActiveMetric('diplomatic_status');
    }
  };

  const handleSelectMetric = (cat: MapFilterCategory, metric: MapFilterMetric) => {
    setActiveCategory(cat);
    setActiveMetric(metric);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Principal do Mapa */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <MapIcon size={26} color="var(--accent-blue)" />
              <h2 className="font-title" style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
                {mapMode === 'national' ? 'Mapa Político & Federativo do Brasil' : 'Mapa Geopolítico & Relações Mundiais'}
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, maxWidth: '720px' }}>
              {mapMode === 'national' 
                ? 'Navegue pelos 27 estados e macrorregiões da Federação. Monitore indicadores econômicos, infraestrutura, criminalidade e articule acordos com governadores e prefeitos fictícios.'
                : 'Acompanhe a geopolítica viva global. Cada nação estrangeira realiza eleições autônomas, troca presidentes fictícios e reage às decisões diplomáticas e comerciais do Brasil.'
              }
            </p>
          </div>

          {/* Toggle Nacional / Mundial */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.35rem', borderRadius: 'var(--radius-lg)' }}>
            <button
              onClick={() => handleToggleMode('national')}
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.82rem',
                fontWeight: mapMode === 'national' ? 700 : 500,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: mapMode === 'national' ? '#ffffff' : 'transparent',
                color: mapMode === 'national' ? '#1d4ed8' : '#64748b',
                boxShadow: mapMode === 'national' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              🇧🇷 Brasil (Nacional)
            </button>
            <button
              onClick={() => handleToggleMode('world')}
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.82rem',
                fontWeight: mapMode === 'world' ? 700 : 500,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: mapMode === 'world' ? '#ffffff' : 'transparent',
                color: mapMode === 'world' ? '#1d4ed8' : '#64748b',
                boxShadow: mapMode === 'world' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              🌍 Mundo (Geopolítica)
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Temáticos Dinâmicos */}
      <MapFilterBar
        activeCategory={activeCategory}
        activeMetric={activeMetric}
        onSelectMetric={handleSelectMetric}
        isWorldMode={mapMode === 'world'}
      />

      {/* Cartografia Geoespacial Profissional de Alta Definição */}
      <ProfessionalGeoMap
        mode={mapMode}
        regions={regions}
        worldCountries={worldCountries}
        activeCategory={activeCategory}
        activeMetric={activeMetric}
        onSelectRegion={(reg) => setSelectedRegion(reg)}
        onSelectCountry={(ctry) => setSelectedCountry(ctry)}
      />

      {/* Modais de Inspeção Detalhada */}
      {selectedRegion && (
        <RegionDetailModal
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
        />
      )}

      {selectedCountry && (
        <CountryDetailModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
};
