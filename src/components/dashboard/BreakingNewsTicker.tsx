'use client';

import React from 'react';
import { useGame } from '@/game/state/GameContext';
import { Radio, AlertCircle } from 'lucide-react';

export const BreakingNewsTicker: React.FC = () => {
  const { state } = useGame();
  if (!state) return null;

  const tickerItems = state.breakingNewsTicker && state.breakingNewsTicker.length > 0
    ? state.breakingNewsTicker
    : [
        `INFLAÇÃO: Índice acumulado em ${state.economy.inflation}% ao ano sob vigilância do Banco Central.`,
        `CONGRESSO: Base aliada do governo conta com ${state.congress.coalitionSeats} deputados federais.`,
        `OPINIÃO PÚBLICA: Aprovação presidencial consolidada em ${state.player.popularity}%.`
      ];

  // Duplicamos para animação contínua e sem saltos no loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker-container" aria-label="Letreiro de Notícias Urgentes da República">
      <div className="ticker-badge">
        <Radio size={14} className="animate-pulse" />
        <span>Plantão Urgente</span>
      </div>

      <div className="ticker-content">
        {displayItems.map((item, idx) => (
          <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertCircle size={13} color="var(--accent-gold)" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
