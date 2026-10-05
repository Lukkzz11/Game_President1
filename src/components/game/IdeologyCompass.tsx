'use client';

import React, { useState } from 'react';
import type { Ideology } from '@/game/types';
import { getPoliticalProfileLabel } from '@/game/state/initialState';
import { Compass, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface IdeologyCompassProps {
  initialIdeology: Ideology;
  onNext: (ideology: Ideology) => void;
  onBack: () => void;
}

export const IdeologyCompass: React.FC<IdeologyCompassProps> = ({ initialIdeology, onNext, onBack }) => {
  const [ideology, setIdeology] = useState<Ideology>(initialIdeology);

  const profile = getPoliticalProfileLabel(ideology);

  const updateAxis = (axis: keyof Ideology, value: number) => {
    setIdeology(prev => ({ ...prev, [axis]: value }));
  };

  const axes = [
    {
      key: 'marketVsState' as const,
      label: 'Visão Econômica',
      left: 'Estatismo / Controle Público',
      right: 'Livre Mercado / Livre Iniciativa',
      val: ideology.marketVsState
    },
    {
      key: 'stateSize' as const,
      label: 'Tamanho do Estado',
      left: 'Estado Mínimo / Enxuto',
      right: 'Estado de Bem-Estar Amplo',
      val: ideology.stateSize
    },
    {
      key: 'taxes' as const,
      label: 'Carga Tributária',
      left: 'Impostos Baixos / Alívio Fiscal',
      right: 'Tributação Progressiva Alta',
      val: ideology.taxes
    },
    {
      key: 'regulation' as const,
      label: 'Regulação de Mercados',
      left: 'Desregulamentação',
      right: 'Forte Fiscalização & Normas',
      val: ideology.regulation
    },
    {
      key: 'socialValues' as const,
      label: 'Costumes e Sociedade',
      left: 'Conservadorismo Tradicional',
      right: 'Progressismo Social',
      val: ideology.socialValues
    },
    {
      key: 'civilLiberties' as const,
      label: 'Segurança & Liberdades',
      left: 'Lei e Ordem Rígido / Punição',
      right: 'Garantismo / Liberdades Civis',
      val: ideology.civilLiberties
    },
    {
      key: 'trade' as const,
      label: 'Comércio Exterior',
      left: 'Protecionismo à Indústria Local',
      right: 'Livre Comércio e Abertura',
      val: ideology.trade
    },
    {
      key: 'globalism' as const,
      label: 'Relações Internacionais',
      left: 'Nacionalismo Soberano',
      right: 'Multilateralismo / Globalismo',
      val: ideology.globalism
    },
    {
      key: 'socialSpending' as const,
      label: 'Prioridade de Gasto Social',
      left: 'Foco em Equilíbrio Fiscal',
      right: 'Ampla Rede de Seguridade Social',
      val: ideology.socialSpending
    },
    {
      key: 'militarySpending' as const,
      label: 'Despesas com Defesa e Forças Armadas',
      left: 'Gasto Militar Contido',
      right: 'Potência Militar Bélica',
      val: ideology.militarySpending
    }
  ];

  return (
    <div style={{ maxWidth: '980px', width: '100%', margin: '2rem auto', padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Etapa 3 de 4</span>
          <h1 className="font-title" style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Posicionamento Ideológico Independente
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Não há apenas &quot;esquerda ou direita&quot;. Defina cada vetor político individualmente para construir a identidade única do seu governo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Sliders dos Eixos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {axes.map(axis => (
              <div key={axis.key} className="slider-container" style={{
                background: '#ffffff',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <span>{axis.label}</span>
                  <span className="font-mono" style={{ color: axis.val > 0 ? 'var(--accent-blue)' : axis.val < 0 ? 'var(--accent-crimson)' : 'var(--text-muted)' }}>
                    {axis.val > 0 ? `+${axis.val}` : axis.val}
                  </span>
                </div>

                <input
                  type="range"
                  min={-100}
                  max={100}
                  step={5}
                  value={axis.val}
                  onChange={e => updateAxis(axis.key, Number(e.target.value))}
                  className="range-slider"
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>{axis.left}</span>
                  <span>{axis.right}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Painel do Perfil Calculado em Tempo Real */}
          <div>
            <div className="glass-panel-gold" style={{ padding: '1.5rem', position: 'sticky', top: '1rem', background: '#ffffff', border: '1px solid var(--border-gold)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Compass size={22} color="#f59e0b" />
                <h3 className="font-title" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Perfil Político Projetado
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Economia:</span>
                  <strong style={{ color: 'var(--accent-blue)' }}>{profile.economy}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Papel do Estado:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{profile.state}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Costumes:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{profile.customs}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Instituições:</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{profile.institutions}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Comércio:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{profile.trade}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Política Externa:</span>
                  <strong style={{ color: 'var(--accent-gold)' }}>{profile.foreignPolicy}</strong>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                💡 <em>Esta classificação é apenas diagnóstica e não limitará as suas ações quando estiver governando.</em>
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={onBack} className="btn btn-outline">
            <ArrowLeft size={16} /> Voltar ao Partido
          </button>
          <button type="button" onClick={() => onNext(ideology)} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
            Próximo: Campanha & Eleições <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
