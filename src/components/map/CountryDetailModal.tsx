'use client';

import React, { useState } from 'react';
import { 
  X, 
  Globe2, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  Handshake, 
  FileText, 
  Coins, 
  AlertTriangle,
  CheckCircle2,
  Users
} from 'lucide-react';
import type { WorldCountry } from '@/game/types';
import { useGame } from '@/game/state/GameContext';

interface CountryDetailModalProps {
  country: WorldCountry;
  onClose: () => void;
}

export const CountryDetailModal: React.FC<CountryDetailModalProps> = ({ country, onClose }) => {
  const { 
    state, 
    negotiateDiplomaticTreaty, 
    applyDiplomaticSanction, 
    sendDiplomaticAid, 
    conductBilateralSummit 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'overview' | 'diplomacy' | 'trade' | 'leader'>('overview');
  const [selectedTreaty, setSelectedTreaty] = useState<string>('Tratado de Livre Comércio & Redução Tarifária');
  const [aidAmount, setAidAmount] = useState<number>(2.0);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!state) return null;

  const relation = country.diplomaticRelation;
  const isBrazil = country.id === 'BRA';

  const handleProposeTreaty = () => {
    negotiateDiplomaticTreaty(country.id, selectedTreaty);
    setFeedback(`Tratado "${selectedTreaty}" firmado com sucesso com ${country.name}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleSanction = () => {
    applyDiplomaticSanction(country.id);
    setFeedback(`Status de sanções alterado para ${country.name}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSendAid = () => {
    sendDiplomaticAid(country.id, aidAmount);
    setFeedback(`Linha de crédito e ajuda de R$ ${aidAmount} bi concedida a ${country.name}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleSummit = () => {
    conductBilateralSummit(country.id);
    setFeedback(`Cúpula Bilateral de Chefes de Estado realizada com ${country.leader.name}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const getStatusBadge = () => {
    switch (relation.status) {
      case 'allied': return <span className="badge badge-emerald">Aliado Estratégico</span>;
      case 'friendly': return <span className="badge badge-blue">Relações Amigáveis</span>;
      case 'neutral': return <span className="badge badge-gray">Neutro / Pragmático</span>;
      case 'tense': return <span className="badge badge-amber">Relações Tensas</span>;
      case 'rival': return <span className="badge badge-crimson">Rival Geopolítico</span>;
      case 'sanctioned': return <span className="badge badge-crimson">País Sancionado</span>;
      default: return null;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '860px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header do Modal */}
        <div style={{
          padding: '1.5rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span className="badge badge-blue" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {country.continent}
              </span>
              {getStatusBadge()}
            </div>
            <h2 className="font-title" style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
              {country.name.toUpperCase()}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: '0.2rem 0 0 0' }}>
              Capital: <strong>{country.capital}</strong> • Sistema Político: <strong>{country.politicalSystem === 'parliamentary' ? 'Parlamentarismo' : country.politicalSystem === 'semi_presidential' ? 'Semipresidencialismo' : 'Presidencialismo'}</strong>
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div style={{
            background: '#ecfdf5',
            color: '#065f46',
            borderBottom: '1px solid #a7f3d0',
            padding: '0.75rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            {feedback}
          </div>
        )}

        {/* Sub-Abas do Painel */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 1.5rem' }}>
          {[
            { id: 'overview', label: 'Panorama Macroeconômico' },
            { id: 'leader', label: 'Liderança Política Fictícia' },
            { id: 'trade', label: 'Comércio Exterior & Balança' },
            { id: 'diplomacy', label: 'Relações Diplomáticas & Ações' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.85rem 1.25rem',
                border: 'none',
                background: 'transparent',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#1d4ed8' : '#64748b',
                borderBottom: activeTab === tab.id ? '3px solid #1d4ed8' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '1.75rem', flex: 1 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>População</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                    {country.population}M
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>habitantes</span>
                </div>

                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>PIB Anual</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8', margin: '0.2rem 0' }}>
                    US$ {country.gdp.toLocaleString('pt-BR')} bi
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Per capita: US$ {country.gdpPerCapita.toLocaleString('pt-BR')}</span>
                </div>

                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Crescimento do PIB</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: country.gdpGrowth >= 2 ? '#047857' : country.gdpGrowth < 0 ? '#b91c1c' : '#f59e0b', margin: '0.2rem 0' }}>
                    {country.gdpGrowth > 0 ? `+${country.gdpGrowth}` : country.gdpGrowth}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Inflação: {country.inflation}%</span>
                </div>

                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Poder Militar</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4338ca', margin: '0.2rem 0' }}>
                    {country.militaryStrength}/100
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Estabilidade: {country.politicalStability}/100</span>
                </div>
              </div>

              {/* Destaque de Evento Recente */}
              <div style={{ padding: '1.25rem', background: '#f1f5f9', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Situação Política & Geopolítica Atual
                </span>
                <p style={{ fontSize: '0.9rem', color: '#1e293b', margin: '0.4rem 0 0 0', lineHeight: 1.5 }}>
                  {country.recentEvent}
                </p>
              </div>

              {/* Recursos Estratégicos */}
              <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                  🌐 Recursos Estratégicos & Vantagens Comparativas
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {country.mainResources.map((res, i) => (
                    <span key={i} className="badge badge-gray" style={{ fontSize: '0.78rem' }}>
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leader' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'center',
                padding: '1.5rem',
                background: '#f8fafc',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.6rem',
                  fontWeight: 800
                }}>
                  {country.leader.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {country.leader.name}
                    </h3>
                    <span className="badge badge-blue">{country.leader.party}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.2rem 0' }}>
                    {country.leader.role} • {country.leader.age} anos • Personalidade: <strong>{country.leader.personality.toUpperCase()}</strong>
                  </p>
                  <p style={{ color: '#334155', fontSize: '0.82rem', margin: '0.3rem 0 0 0' }}>
                    Ideologia de Governo: <strong>{country.leader.ideology}</strong>
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Popularidade Interna</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857' }}>
                    {country.leader.popularity}%
                  </div>
                </div>
              </div>

              {/* Atributos do Líder Estrangeiro */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Competência</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{country.leader.competence}/100</div>
                </div>
                <div style={{ padding: '0.85rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Negociação</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{country.leader.negotiationSkill}/100</div>
                </div>
                <div style={{ padding: '0.85rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Influência Global</span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{country.leader.influence}/100</div>
                </div>
                <div style={{ padding: '0.85rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Postura Externa</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.2rem' }}>
                    {country.leader.foreignPolicyStance.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trade' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                padding: '1.25rem',
                background: '#eff6ff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bfdbfe',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#1e40af', fontWeight: 700 }}>
                    Comércio Bilateral com o Brasil
                  </span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e40af' }}>
                    R$ {relation.tradeVolumeBi} bilhões / semestre
                  </div>
                </div>
                <span className="badge badge-blue">
                  {country.topTradingPartners.includes('Brasil') ? 'Parceiro Comercial Prioritário' : 'Fluxo Regular'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    🚢 Principais Exportações de {country.name}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {country.mainExports.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    📦 Principais Importações de {country.name}
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {country.mainImports.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diplomacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isBrazil ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  Este é o território soberano do Brasil, sob comando direto da sua Presidência da República.
                </div>
              ) : (
                <>
                  {/* Termômetro Diplomático */}
                  <div style={{
                    padding: '1.25rem',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        Termômetro de Afinidade Diplomática
                      </span>
                      <strong style={{
                        fontSize: '1rem',
                        color: relation.relationshipScore >= 50 ? '#047857' : relation.relationshipScore <= -20 ? '#b91c1c' : '#f59e0b'
                      }}>
                        {relation.relationshipScore > 0 ? `+${relation.relationshipScore}` : relation.relationshipScore} / 100 pts
                      </strong>
                    </div>

                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.max(5, Math.min(100, (relation.relationshipScore + 100) / 2))}%`,
                        height: '100%',
                        background: relation.relationshipScore >= 50 ? '#047857' : relation.relationshipScore <= -20 ? '#b91c1c' : '#f59e0b'
                      }} />
                    </div>
                  </div>

                  {/* Tratados Vigentes */}
                  <div style={{ padding: '1.25rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                      📜 Tratados & Acordos Bilaterais Ratificados
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {relation.treaties.map((tr, i) => (
                        <span key={i} className="badge badge-blue" style={{ fontSize: '0.78rem' }}>
                          ✓ {tr}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ações Diplomáticas Executáveis */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    padding: '1.25rem',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid #e2e8f0'
                  }}>
                    {/* Propor Tratado */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                        Propor Novo Tratado Bilateral
                      </label>
                      <select
                        value={selectedTreaty}
                        onChange={e => setSelectedTreaty(e.target.value)}
                        style={{ padding: '0.45rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      >
                        <option value="Tratado de Livre Comércio & Redução Tarifária">Tratado de Livre Comércio (Impulsiona exportações)</option>
                        <option value="Aliança Estratégica & Parceria de Defesa">Aliança Estratégica & Defesa (Segurança mútua)</option>
                        <option value="Cooperação Científica & Tecnológica">Cooperação Científica & Tecnológica (Inovação)</option>
                        <option value="Isenção Mútua de Vistos de Turismo e Negócios">Isenção Mútua de Vistos (Aumenta turismo)</option>
                      </select>
                      <button
                        onClick={handleProposeTreaty}
                        className="btn btn-primary"
                        style={{ fontSize: '0.78rem', padding: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                      >
                        <Handshake size={14} /> Ratificar Tratado
                      </button>
                    </div>

                    {/* Cúpula Bilateral & Sanções */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleSummit}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                      >
                        <Users size={14} /> Realizar Cúpula Bilateral Presidencial
                      </button>

                      <button
                        onClick={handleToggleSanction}
                        className="btn"
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.5rem',
                          background: relation.sanctionsActive ? '#fef2f2' : '#ffffff',
                          color: relation.sanctionsActive ? '#b91c1c' : '#dc2626',
                          border: '1px solid #f87171',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <ShieldAlert size={14} /> {relation.sanctionsActive ? 'Revogar Sanções Econômicas' : 'Aplicar Sanções Diplomáticas/Comerciais'}
                      </button>
                    </div>
                  </div>

                  {/* Memória Diplomática */}
                  <div style={{ padding: '1rem', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Memória Diplomática Histórica
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
                      {relation.historicalMemoryLog.map((log, i) => (
                        <div key={i} style={{ padding: '0.25rem 0', borderBottom: '1px dashed #f1f5f9' }}>
                          • {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
