'use client';

import React from 'react';
import { useGame } from '@/game/state/GameContext';
import { Users2, TrendingUp, TrendingDown, Percent, Star } from 'lucide-react';

export const SocialGroupsTab: React.FC = () => {
  const { state } = useGame();
  if (!state) return null;

  const { socialGroups } = state;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Users2 size={26} color="var(--accent-blue)" />
          <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
            Segmentos Sociais & Base Eleitoral (Democracy 4 Style)
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '720px' }}>
          Monitore o nível de aprovação, influência política e demandas prioritárias de cada estrato da população. Nenhuma medida agrada a todos: cortar impostos alegra os empresários, mas enfurece servidores públicos; aumentar benefícios sociais conquista as famílias de baixa renda, mas gera preocupação fiscal na classe média.
        </p>
      </div>

      {/* Grid de Grupos Sociais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '1.25rem' }}>
        {socialGroups.map(group => {
          const isHighApproval = group.approval >= 50;
          const isLowApproval = group.approval < 30;

          return (
            <div
              key={group.id}
              className="glass-panel"
              style={{
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: `4px solid ${isHighApproval ? 'var(--accent-emerald)' : isLowApproval ? 'var(--accent-crimson)' : 'var(--accent-gold)'}`,
                background: '#ffffff'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{group.name}</h4>
                  <span className="font-mono" style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: isHighApproval ? '#047857' : isLowApproval ? '#b91c1c' : '#b45309'
                  }}>
                    {group.approval}%
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  <span>População: <strong>{group.populationShare}%</strong></span>
                  <span>Influência Política: <strong>{group.influence}/100</strong></span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
                  {group.description}
                </p>

                {/* Barra de Aprovação */}
                <div className="progress-bar-bg" style={{ marginBottom: '1rem', height: '6px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${group.approval}%`,
                      background: isHighApproval ? '#059669' : isLowApproval ? '#dc2626' : '#d97706'
                    }}
                  />
                </div>
              </div>

              {/* Demandas Prioritárias */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Pautas Prioritárias
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {group.keyInterests.map((interest, i) => (
                    <span key={i} className="badge badge-blue" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
