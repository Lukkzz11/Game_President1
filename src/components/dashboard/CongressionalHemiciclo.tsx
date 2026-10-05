'use client';

import React from 'react';
import type { Congress } from '@/game/types';
import { Landmark, Users, Shield } from 'lucide-react';

interface CongressionalHemicicloProps {
  congress: Congress;
  onNavigateTab?: (tab: any) => void;
}

export const CongressionalHemiciclo: React.FC<CongressionalHemicicloProps> = ({ 
  congress, 
  onNavigateTab 
}) => {
  const total = congress.totalSeats || 513;
  const coalition = congress.coalitionSeats;
  const independent = congress.independentSeats;
  const opposition = congress.oppositionSeats;

  const coalitionPct = Math.round((coalition / total) * 100);
  const indepPct = Math.round((independent / total) * 100);
  const oppPct = Math.round((opposition / total) * 100);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 className="font-title" style={{ fontSize: '1.1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark size={18} color="var(--accent-blue)" /> Plenário do Congresso (513 Assentos)
          </h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Presidente da Câmara: <strong>{congress.congressPresidentName}</strong> ({congress.congressPresidentParty})
          </div>
        </div>

        {onNavigateTab && (
          <button 
            onClick={() => onNavigateTab('coalition')} 
            className="btn btn-outline" 
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
          >
            Articulação Política
          </button>
        )}
      </div>

      {/* Visualização do Hemiciclo em Arco */}
      <div style={{
        background: '#f8fafc',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem 1rem 1rem 1rem',
        border: '1px solid #e2e8f0',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto', height: '140px' }}>
          <svg viewBox="0 0 420 160" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Linha de fundo */}
            <path
              d="M 60 150 A 150 150 0 0 1 360 150"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* Arco da Oposição */}
            <path
              d="M 60 150 A 150 150 0 0 1 360 150"
              fill="none"
              stroke="#dc2626"
              strokeWidth="14"
              strokeDasharray="470"
              strokeDashoffset={470 - (470 * (oppPct / 100))}
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Arco do Centro */}
            <path
              d="M 60 150 A 150 150 0 0 1 360 150"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="14"
              strokeDasharray="470"
              strokeDashoffset={470 - (470 * ((oppPct + indepPct) / 100))}
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Arco da Base */}
            <path
              d="M 60 150 A 150 150 0 0 1 360 150"
              fill="none"
              stroke="#2563eb"
              strokeWidth="14"
              strokeDasharray="470"
              strokeDashoffset={470 - (470 * (coalitionPct / 100))}
              strokeLinecap="round"
            />

            {/* Marcador Central de Tribuna */}
            <circle cx="210" cy="145" r="16" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
            <text x="210" y="149" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">513</text>
          </svg>
        </div>

        {/* Linhas de Quórum Crítico */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: coalition >= 257 ? '#047857' : '#64748b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: coalition >= 257 ? '#059669' : '#94a3b8' }} />
            <span>Maioria Simples: <strong>257 votos</strong> {coalition >= 257 ? '(Alcançada)' : '(Déficit)'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: coalition >= 308 ? '#047857' : '#64748b' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: coalition >= 308 ? '#059669' : '#94a3b8' }} />
            <span>Quórum de PEC (3/5): <strong>308 votos</strong> {coalition >= 308 ? '(Alcançada)' : '(Necessita Acordo)'}</span>
          </div>
        </div>
      </div>

      {/* Legenda Resumida */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', textAlign: 'center' }}>
        <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: 700 }}>BASE GOVERNISTA</div>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1d4ed8' }}>{coalition}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{coalitionPct}% das cadeiras</div>
        </div>

        <div style={{ background: '#f5f3ff', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd6fe' }}>
          <div style={{ fontSize: '0.68rem', color: '#6d28d9', fontWeight: 700 }}>CENTRÃO / INDEP.</div>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#6d28d9' }}>{independent}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{indepPct}% das cadeiras</div>
        </div>

        <div style={{ background: '#fef2f2', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '0.68rem', color: '#b91c1c', fontWeight: 700 }}>OPOSIÇÃO</div>
          <div className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b91c1c' }}>{opposition}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{oppPct}% das cadeiras</div>
        </div>
      </div>
    </div>
  );
};
