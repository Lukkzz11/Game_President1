'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { Newspaper, Radio, ExternalLink, Calendar, Eye, Filter } from 'lucide-react';
import pressOutletsData from '@/data/press.json';
import type { PressOutlet } from '@/game/types';

export const PressTab: React.FC = () => {
  const { state } = useGame();
  const [selectedOutletFilter, setSelectedOutletFilter] = useState<string>('all');

  if (!state) return null;

  const { news } = state;
  const pressOutlets = pressOutletsData as PressOutlet[];

  const filteredNews = selectedOutletFilter === 'all'
    ? news
    : news.filter(n => n.outletId === selectedOutletFilter);

  const getOutletMeta = (outletId: string) => {
    const o = pressOutlets.find(p => p.id === outletId);
    if (!o) return { name: 'Diário da República', subtitle: 'Edição Geral' };
    switch (o.id) {
      case 'press_gazeta':
        return { name: 'GAZETA DO MERCADO', subtitle: 'Finanças, Comércio & Análise Econômica • Fundado em 1948' };
      case 'press_tribuna':
        return { name: 'A VOZ DO TRABALHO', subtitle: 'Órgão dos Sindicatos, Movimentos e Direitos Sociais' };
      case 'press_opiniao':
        return { name: 'O CLARIM NACIONAL', subtitle: 'Defesa da Soberania, Ordem e Instituições Republicanas' };
      default:
        return { name: 'DIÁRIO DA REPÚBLICA', subtitle: 'O Maior Jornal de Circulação Nacional • Edição Diária' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Institucional da Imprensa */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <Newspaper size={26} color="var(--accent-gold)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                Imprensa Livre & Capas dos Grandes Jornais
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '720px', lineHeight: '1.5' }}>
              A opinião pública e o humor dos mercados são esculpidos diariamente pelos editoriais e manchetes. Veículos de orientação liberal, operária ou conservadora interpretam cada ato do governo com lentes ideológicas próprias.
            </p>
          </div>

          {/* Filtro de Veículos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              value={selectedOutletFilter}
              onChange={e => setSelectedOutletFilter(e.target.value)}
              className="input-select"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', width: 'auto' }}
            >
              <option value="all">Todas as Manchetes</option>
              {pressOutlets.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mini Roster dos Jornais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '1.5rem' }}>
          {pressOutlets.map(outlet => (
            <div 
              key={outlet.id} 
              onClick={() => setSelectedOutletFilter(outlet.id === selectedOutletFilter ? 'all' : outlet.id)}
              style={{
                background: selectedOutletFilter === outlet.id ? '#eff6ff' : '#ffffff',
                border: selectedOutletFilter === outlet.id ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-xs)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{outlet.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', marginTop: '0.15rem' }}>
                {outlet.orientation === 'liberal_market' ? 'Economia Liberal & Mercado' : outlet.orientation === 'labor_left' ? 'Pauta Trabalhista & Social' : outlet.orientation === 'national_conservative' ? 'Conservador & Segurança' : 'Centro & Interesse Popular'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                <span>Credibilidade: {outlet.credibility}%</span>
                <span>Alcance: {outlet.reach}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparativo de Cobertura Editorial Antagônica (Exigência Seção 5/7) */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Radio size={18} color="var(--accent-crimson)" />
          <h3 className="font-title" style={{ fontSize: '1.1rem', color: '#0f172a' }}>
            Comparativo de Enquadramento Editorial: O Mesmo Fato sob Diferentes Lentes
          </h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Veja como a linha editorial e os interesses de classe transformam a narrativa de cada política pública implementada pelo Planalto.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Veículo Liberal */}
          <div style={{ background: '#fdfbf7', border: '1px solid #d6d3d1', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'Georgia, serif' }}>
            <div style={{ borderBottom: '2px solid #1c1917', paddingBottom: '0.35rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>GAZETA DO MERCADO</strong>
              <span className="badge badge-crimson" style={{ fontSize: '0.62rem' }}>Óptica Fiscal / Mercado</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1917', lineHeight: '1.3', marginBottom: '0.5rem' }}>
              "Governo expande gastos e subsídios enquanto dívida pública pressiona juros e taxa Selic"
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#44403c', lineHeight: '1.5', textAlign: 'justify' }}>
              Analistas da Faria Lima advertem que aportes estatais e emendas parlamentares agravam o déficit nominal, gerando fuga de capitais e risco de repique inflacionário nos próximos trimestres.
            </p>
          </div>

          {/* Veículo Trabalhista */}
          <div style={{ background: '#fdfbf7', border: '1px solid #d6d3d1', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'Georgia, serif' }}>
            <div style={{ borderBottom: '2px solid #1c1917', paddingBottom: '0.35rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>A VOZ DO TRABALHO</strong>
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>Óptica Social / Popular</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1c1917', lineHeight: '1.3', marginBottom: '0.5rem' }}>
              "Investimento histórico em infraestrutura e programas sociais fortalece o poder de compra do povo"
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#44403c', lineHeight: '1.5', textAlign: 'justify' }}>
              Lideranças sindicais e movimentos populares comemoram a destinação de recursos para obras regionais e habitação popular, cobrando do Banco Central a redução imediata da taxa de juros.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Capas de Jornal Autênticas (Estética Real de Jornal Impresso) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
            Edições & Capas Publicadas ({filteredNews.length})
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Atualizado a cada semestre de mandato
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredNews.map(item => {
            const outlet = pressOutlets.find(o => o.id === item.outletId);
            const meta = getOutletMeta(item.outletId);

            return (
              <div key={item.id} className="newspaper-card">
                {/* Cabeçalho do Jornal Impresso */}
                <div className="newspaper-masthead">
                  <div className="newspaper-title">{meta.name}</div>
                  <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', color: '#666', marginTop: '0.2rem' }}>
                    {meta.subtitle}
                  </div>
                </div>

                <div className="newspaper-meta">
                  <span>Edição Semestre {item.turn} • Ano {2026 + Math.floor(item.turn / 2)}</span>
                  <span>Preço: R$ 4,50</span>
                  <span style={{ fontWeight: 'bold' }}>Tiragem Nacional</span>
                </div>

                {/* Manchete Principal */}
                <h4 className="newspaper-headline">
                  &ldquo;{item.headline}&rdquo;
                </h4>

                {/* Corpo do Artigo de Primeira Página */}
                <p className="newspaper-body">
                  {item.summary}
                </p>

                {/* Rodapé da Capa */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.25rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid #d4c5b9',
                  fontSize: '0.72rem',
                  color: '#666',
                  fontFamily: 'sans-serif'
                }}>
                  <span>Linha Editorial: <strong>{outlet?.name || 'Redação'}</strong></span>
                  <span style={{
                    padding: '0.15rem 0.45rem',
                    borderRadius: '3px',
                    fontWeight: 'bold',
                    fontSize: '0.68rem',
                    background: item.sentiment === 'positive' ? '#dcfce7' : item.sentiment === 'negative' ? '#fee2e2' : '#f1f5f9',
                    color: item.sentiment === 'positive' ? '#166534' : item.sentiment === 'negative' ? '#991b1b' : '#334155'
                  }}>
                    {item.sentiment === 'positive' ? 'Editorial Favorável' : item.sentiment === 'negative' ? 'Editorial Crítico' : 'Análise Neutra'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
