'use client';

import React, { useState, useRef } from 'react';
import type { Region, MapFilterMetric, CityInfo } from '@/game/types';
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Star } from 'lucide-react';

interface NationalMapProps {
  regions: Region[];
  selectedRegionId: string | null;
  onSelectRegion: (region: Region) => void;
  activeMetric: MapFilterMetric;
}

export const NationalMap: React.FC<NationalMapProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion,
  activeMetric
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Color calculation based on activeMetric
  const getFillColor = (region: Region) => {
    const isSelected = region.id === selectedRegionId;

    switch (activeMetric) {
      case 'gdp': {
        // PIB de 70 a 920 bi
        const ratio = Math.min(1, Math.max(0, (region.gdp - 70) / 850));
        return isSelected 
          ? '#1e40af' 
          : `rgb(${Math.round(186 - ratio * 156)}, ${Math.round(230 - ratio * 166)}, ${Math.round(253 - ratio * 78)})`;
      }
      case 'gdpPerCapita': {
        const perCapita = region.gdpPerCapita || (region.gdp * 1_000_000_000 / region.population);
        const ratio = Math.min(1, Math.max(0, (perCapita - 10000) / 42000));
        return isSelected ? '#0f766e' : `rgb(${Math.round(204 - ratio * 190)}, ${Math.round(251 - ratio * 133)}, ${Math.round(241 - ratio * 131)})`;
      }
      case 'unemployment': {
        const ratio = Math.min(1, Math.max(0, (region.unemployment - 4) / 10));
        // Verde (baixo) -> Vermelho (alto)
        return isSelected 
          ? '#991b1b' 
          : ratio < 0.5 
            ? `rgb(${Math.round(167 + ratio * 150)}, 243, 208)` 
            : `rgb(254, ${Math.round(202 - (ratio - 0.5) * 160)}, ${Math.round(202 - (ratio - 0.5) * 160)})`;
      }
      case 'governmentApproval': {
        const ratio = Math.min(1, Math.max(0, (region.governmentApproval - 35) / 35));
        return isSelected 
          ? '#047857' 
          : ratio > 0.5 
            ? `rgb(${Math.round(167 - (ratio - 0.5) * 100)}, 243, ${Math.round(208 - (ratio - 0.5) * 60)})`
            : `rgb(254, ${Math.round(202 * ratio * 2)}, ${Math.round(202 * ratio * 2)})`;
      }
      case 'crime': {
        const ratio = Math.min(1, Math.max(0, (region.crimeRate - 20) / 50));
        return isSelected 
          ? '#7f1d1d' 
          : ratio < 0.5 
            ? '#a7f3d0' 
            : '#fca5a5';
      }
      case 'infrastructure_overall':
      case 'infrastructure_transport':
      case 'infrastructure_energy': {
        const ratio = Math.min(1, Math.max(0, (region.infrastructure - 40) / 50));
        return isSelected 
          ? '#4338ca' 
          : `rgb(${Math.round(224 - ratio * 125)}, ${Math.round(231 - ratio * 126)}, ${Math.round(255 - ratio * 52)})`;
      }
      case 'education': {
        const ratio = Math.min(1, Math.max(0, (region.educationIndex - 50) / 40));
        return isSelected ? '#0e7490' : `rgb(${Math.round(207 - ratio * 170)}, ${Math.round(250 - ratio * 134)}, ${Math.round(254 - ratio * 110)})`;
      }
      case 'health': {
        const ratio = Math.min(1, Math.max(0, (region.healthIndex - 50) / 40));
        return isSelected ? '#b91c1c' : `rgb(254, ${Math.round(226 - ratio * 150)}, ${Math.round(226 - ratio * 150)})`;
      }
      case 'rulingParty': {
        const partyId = region.politicalDominance.rulingPartyId.toLowerCase();
        if (partyId === 'ptp') return isSelected ? '#991b1b' : '#f87171';
        if (partyId === 'pln') return isSelected ? '#1e3a8a' : '#60a5fa';
        if (partyId === 'bci') return isSelected ? '#b45309' : '#fbbf24';
        if (partyId === 'msd') return isSelected ? '#0f766e' : '#2dd4bf';
        if (partyId === 'por') return isSelected ? '#312e81' : '#818cf8';
        return '#94a3b8';
      }
      default:
        return isSelected ? '#1d4ed8' : '#cbd5e1';
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', overflow: 'hidden', background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
      {/* Barra de Controles de Zoom & Pan */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        zIndex: 20,
        background: '#ffffff',
        padding: '0.35rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <button
          onClick={handleZoomIn}
          title="Aumentar Zoom"
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
        >
          <ZoomIn size={18} color="#334155" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Diminuir Zoom"
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
        >
          <ZoomOut size={18} color="#334155" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Resetar Posição e Zoom"
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}
        >
          <RotateCcw size={16} color="#64748b" />
        </button>
      </div>

      {/* Indicador de Ajuda de Navegação */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        padding: '0.4rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        color: '#64748b',
        border: '1px solid #e2e8f0',
        zIndex: 20
      }}>
        💡 Arraste para mover • Clique em um estado para inspecionar
      </div>

      {/* Canvas SVG Nativo com Pan e Zoom */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          viewBox="0 0 780 820"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '620px',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Estados da Federação */}
          {regions.map(r => {
            const isSelected = r.id === selectedRegionId;
            const fill = getFillColor(r);

            return (
              <g 
                key={r.id} 
                onClick={() => onSelectRegion(r)}
                onMouseEnter={() => setHoveredRegion(r)}
                onMouseLeave={() => setHoveredRegion(null)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={r.svgPath}
                  fill={fill}
                  stroke={isSelected ? '#1d4ed8' : '#ffffff'}
                  strokeWidth={isSelected ? 3.5 : 1.5}
                  style={{
                    filter: isSelected ? 'drop-shadow(0 4px 8px rgba(29, 78, 216, 0.35))' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />

                {/* Sigla e Nome do Estado */}
                <text
                  x={r.labelCoord.x}
                  y={r.labelCoord.y}
                  fill={isSelected ? '#ffffff' : '#0f172a'}
                  fontSize={isSelected ? '13' : '11'}
                  fontWeight="bold"
                  textAnchor="middle"
                  style={{
                    pointerEvents: 'none',
                    textShadow: isSelected ? '0 1px 4px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.9)'
                  }}
                >
                  {r.acronym || r.id}
                </text>
              </g>
            );
          })}

          {/* Marcadores de Capitais & Cidades Estratégicas */}
          {regions.flatMap(r => (r.majorCities || []).filter(c => c.isCapital)).map((city, idx) => {
            const isBrasilia = city.name.includes('Brasília');
            return (
              <g key={`cap_${idx}`} style={{ pointerEvents: 'none' }}>
                {isBrasilia ? (
                  <>
                    <circle cx={city.coord.x} cy={city.coord.y} r={7} fill="#fbbf24" stroke="#ffffff" strokeWidth={2} />
                    <circle cx={city.coord.x} cy={city.coord.y} r={11} fill="none" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="3,3" />
                    <text x={city.coord.x + 10} y={city.coord.y + 4} fontSize="11" fontWeight="800" fill="#1e293b" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.95)' }}>
                      ⭐ Brasília (Capital Federal)
                    </text>
                  </>
                ) : (
                  <>
                    <circle cx={city.coord.x} cy={city.coord.y} r={4} fill="#0f172a" stroke="#ffffff" strokeWidth={1.5} />
                    <text x={city.coord.x + 6} y={city.coord.y + 3} fontSize="9" fontWeight="600" fill="#334155" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.9)' }}>
                      {city.name}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Card */}
      {hoveredRegion && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          background: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
          border: '1px solid #e2e8f0',
          pointerEvents: 'none',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{hoveredRegion.acronym || hoveredRegion.id}</span>
            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{hoveredRegion.name}</strong>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            PIB: R$ {hoveredRegion.gdp} bi • Desemprego: {hoveredRegion.unemployment}% • Aprovação: {hoveredRegion.governmentApproval}%
          </div>
        </div>
      )}
    </div>
  );
};
