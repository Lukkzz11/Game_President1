'use client';

import React, { useState, useRef } from 'react';
import type { WorldCountry, MapFilterMetric } from '@/game/types';
import { ZoomIn, ZoomOut, RotateCcw, Globe2, Star } from 'lucide-react';

interface WorldMapProps {
  countries: WorldCountry[];
  selectedCountryId: string | null;
  onSelectCountry: (country: WorldCountry) => void;
  activeMetric: MapFilterMetric;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  countries,
  selectedCountryId,
  onSelectCountry,
  activeMetric
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<WorldCountry | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

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

  const getFillColor = (country: WorldCountry) => {
    const isSelected = country.id === selectedCountryId;
    const isBrazil = country.id === 'BRA';

    if (isBrazil) return isSelected ? '#1e3a8a' : '#1e40af';

    switch (activeMetric) {
      case 'diplomatic_status': {
        const status = country.diplomaticRelation.status;
        if (country.diplomaticRelation.sanctionsActive) return isSelected ? '#7f1d1d' : '#991b1b';
        if (status === 'allied') return isSelected ? '#047857' : '#10b981';
        if (status === 'friendly') return isSelected ? '#1d4ed8' : '#3b82f6';
        if (status === 'neutral') return isSelected ? '#475569' : '#94a3b8';
        if (status === 'tense') return isSelected ? '#b45309' : '#f59e0b';
        if (status === 'rival') return isSelected ? '#991b1b' : '#ef4444';
        return '#cbd5e1';
      }
      case 'trade_volume': {
        const volume = country.diplomaticRelation.tradeVolumeBi;
        const ratio = Math.min(1, Math.max(0, volume / 120));
        return isSelected 
          ? '#1e40af' 
          : `rgb(${Math.round(219 - ratio * 180)}, ${Math.round(234 - ratio * 170)}, ${Math.round(254 - ratio * 70)})`;
      }
      case 'gdp': {
        // PIB de US$ 300 bi a US$ 25.000 bi
        const ratio = Math.min(1, Math.max(0, (country.gdp - 300) / 20000));
        return isSelected ? '#1e40af' : `rgb(${Math.round(186 - ratio * 156)}, ${Math.round(230 - ratio * 166)}, ${Math.round(253 - ratio * 78)})`;
      }
      case 'gdpGrowth': {
        const ratio = Math.min(1, Math.max(0, (country.gdpGrowth + 1) / 7));
        return isSelected ? '#047857' : ratio > 0.5 ? '#6ee7b7' : '#fca5a5';
      }
      default: {
        const score = country.diplomaticRelation.relationshipScore;
        const ratio = Math.min(1, Math.max(0, (score + 100) / 200));
        return isSelected ? '#1d4ed8' : ratio > 0.6 ? '#6ee7b7' : ratio < 0.4 ? '#fca5a5' : '#cbd5e1';
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', overflow: 'hidden', background: '#091e3a', borderRadius: 'var(--radius-lg)', border: '1px solid #1e3a8a' }}>
      {/* Controles de Zoom & Pan */}
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
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
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

      {/* Info Tag */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        padding: '0.4rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.75rem',
        color: '#93c5fd',
        border: '1px solid #1e40af',
        zIndex: 20
      }}>
        🌍 Mapa Geopolítico Mundial • Clique em um país soberano para interações diplomáticas
      </div>

      {/* SVG Canvas Mundial */}
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
          viewBox="0 0 1200 680"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '620px',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Oceanos & Meridianos de Fundo */}
          <rect width="1200" height="680" fill="#0d233a" />
          <line x1="0" y1="340" x2="1200" y2="340" stroke="#173552" strokeWidth={1} strokeDasharray="4,4" />
          <line x1="600" y1="0" x2="600" y2="680" stroke="#173552" strokeWidth={1} strokeDasharray="4,4" />

          {/* Continentes de Fundo Decorativos (Silhuetas Genéricas) */}
          <path d="M 120 120 L 350 140 L 340 280 L 150 250 Z" fill="#132e48" />
          <path d="M 300 350 L 450 360 L 430 630 L 310 620 Z" fill="#132e48" />
          <path d="M 520 80 L 700 80 L 680 220 L 510 200 Z" fill="#132e48" />
          <path d="M 540 240 L 720 250 L 690 520 L 530 480 Z" fill="#132e48" />
          <path d="M 720 80 L 1120 90 L 1080 380 L 730 360 Z" fill="#132e48" />
          <path d="M 940 440 L 1100 450 L 1070 580 L 950 560 Z" fill="#132e48" />

          {/* Países Soberanos Simulados */}
          {countries.map(c => {
            const isSelected = c.id === selectedCountryId;
            const isBrazil = c.id === 'BRA';
            const fill = getFillColor(c);

            return (
              <g 
                key={c.id}
                onClick={() => onSelectCountry(c)}
                onMouseEnter={() => setHoveredCountry(c)}
                onMouseLeave={() => setHoveredCountry(null)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={c.svgPath}
                  fill={fill}
                  stroke={isSelected ? '#facc15' : isBrazil ? '#38bdf8' : '#ffffff'}
                  strokeWidth={isSelected ? 3.5 : isBrazil ? 2.5 : 1.2}
                  style={{
                    filter: isSelected ? 'drop-shadow(0 4px 10px rgba(250, 204, 21, 0.5))' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />

                {/* Rótulo do País */}
                <text
                  x={c.centerCoords.x}
                  y={c.centerCoords.y}
                  fill={isSelected ? '#fef08a' : '#ffffff'}
                  fontSize={isBrazil ? '13' : '11'}
                  fontWeight={isBrazil ? '900' : 'bold'}
                  textAnchor="middle"
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 1px 4px rgba(0,0,0,0.9)'
                  }}
                >
                  {isBrazil ? '⭐ BRASIL' : c.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Card */}
      {hoveredCountry && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          background: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.25)',
          border: '1px solid #e2e8f0',
          pointerEvents: 'none',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>{hoveredCountry.continent}</span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{hoveredCountry.name}</strong>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Líder: <strong>{hoveredCountry.leader.name}</strong> ({hoveredCountry.leader.role})
          </div>
          <div style={{ fontSize: '0.78rem', color: '#1d4ed8', marginTop: '0.2rem' }}>
            Comércio Bilateral: R$ {hoveredCountry.diplomaticRelation.tradeVolumeBi} bi • Relação: {hoveredCountry.diplomaticRelation.status.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};
