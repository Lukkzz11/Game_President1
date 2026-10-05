'use client';

import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Users, 
  DollarSign, 
  Activity, 
  ShieldAlert, 
  GraduationCap, 
  Heart, 
  Hammer, 
  Handshake, 
  MapPin, 
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { Region, RegionalInvestmentType } from '@/game/types';
import { useGame } from '@/game/state/GameContext';

interface RegionDetailModalProps {
  region: Region;
  onClose: () => void;
}

export const RegionDetailModal: React.FC<RegionDetailModalProps> = ({ region, onClose }) => {
  const { state, applyRegionalInvestment, negotiateWithGovernor } = useGame();
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'cities' | 'governor'>('overview');
  const [porkOfferBi, setPorkOfferBi] = useState<number>(1.5);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!state) return null;

  const governor = region.governor || {
    id: `gov_${region.id}`,
    name: region.politicalDominance.governorName,
    age: 52,
    role: `Governador de ${region.name}`,
    country: 'Brasil',
    party: region.politicalDominance.rulingPartyId.toUpperCase(),
    partyAcronym: region.politicalDominance.rulingPartyId.toUpperCase(),
    ideology: 'Pragmático / Regional',
    personality: 'conciliador' as const,
    popularity: region.governmentApproval,
    competence: 80,
    integrity: 78,
    experience: 82,
    influence: 80,
    ambition: 75,
    loyalty: region.politicalDominance.stanceToPresident === 'allied' ? 80 : 35,
    negotiationSkill: 80,
    economicStance: 'misto' as const,
    socialStance: 'moderado' as const,
    securityStance: 'equilibrada' as const,
    foreignPolicyStance: 'pragmatico' as const,
    playerRelationship: region.politicalDominance.stanceToPresident === 'allied' ? 30 : -10
  };

  const handleInvestment = (type: RegionalInvestmentType) => {
    applyRegionalInvestment(region.id, type);
    setFeedback(`Investimento federal alocado com sucesso no estado de ${region.name}!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleGovernorPact = () => {
    negotiateWithGovernor(region.id, { porkBarrelsBi: porkOfferBi });
    setFeedback(`Pacto Federativo firmado com o Governador ${governor.name}! Apoio parlamentar adicionado à base aliada.`);
    setTimeout(() => setFeedback(null), 4000);
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
        maxWidth: '840px',
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
                {region.acronym || region.id} • {region.macroRegion || 'Brasil'}
              </span>
              <span className={`badge ${region.politicalDominance.stanceToPresident === 'allied' ? 'badge-emerald' : 'badge-crimson'}`} style={{ fontSize: '0.75rem' }}>
                Governo Estadual: {region.politicalDominance.stanceToPresident === 'allied' ? 'Aliado ao Planalto' : 'Oposição Regional'}
              </span>
            </div>
            <h2 className="font-title" style={{ fontSize: '1.6rem', color: '#0f172a', margin: 0 }}>
              ESTADO DE {region.name.toUpperCase()}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: '0.2rem 0 0 0' }}>
              {region.nickname} • Capital: <strong>{region.capital}</strong>
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
            { id: 'overview', label: 'Panorama Socioeconômico' },
            { id: 'governor', label: 'Governador & Articulação' },
            { id: 'cities', label: 'Cidades & Prefeitos' },
            { id: 'actions', label: 'Ações & Investimentos Federais' }
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

        {/* Conteúdo das Sub-Abas */}
        <div style={{ padding: '1.75rem', flex: 1 }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Grid de Métricas Principais */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>População</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                    {(region.population / 1_000_000).toFixed(1)}M
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>habitantes</span>
                </div>

                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>PIB Estadual</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8', margin: '0.2rem 0' }}>
                    R$ {region.gdp.toFixed(1)} bi
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PIB per capita: R$ {(region.gdpPerCapita || (region.gdp * 1_000_000_000 / region.population)).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                </div>

                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Desemprego</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: region.unemployment > 10 ? '#b91c1c' : '#047857', margin: '0.2rem 0' }}>
                    {region.unemployment}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Inflação: {region.inflationRegional || 4.5}%</span>
                </div>

                <div className="stat-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Aprovação Presidencial</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: region.governmentApproval >= 50 ? '#047857' : '#b91c1c', margin: '0.2rem 0' }}>
                    {region.governmentApproval}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Apoio popular local</span>
                </div>
              </div>

              {/* Indicadores Sociais e de Infraestrutura */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Hammer size={16} color="#4338ca" /> Infraestrutura
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#4338ca' }}>{region.infrastructure}/100</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${region.infrastructure}%`, height: '100%', background: '#4338ca' }} />
                  </div>
                </div>

                <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={16} color="#0891b2" /> Educação
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#0891b2' }}>{region.educationIndex}/100</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${region.educationIndex}%`, height: '100%', background: '#0891b2' }} />
                  </div>
                </div>

                <div style={{ padding: '1rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Heart size={16} color="#dc2626" /> Saúde Pública
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#dc2626' }}>{region.healthIndex}/100</strong>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${region.healthIndex}%`, height: '100%', background: '#dc2626' }} />
                  </div>
                </div>
              </div>

              {/* Recursos Naturais & Setores Econômicos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                    🌾 Recursos Estratégicos & Naturais
                  </h4>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {region.naturalResources.map((res, i) => (
                      <li key={i}>{res}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem' }}>
                    🏭 Setores Predominantes & Empresas Relevantes
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.6rem' }}>
                    {(region.economicSectors || ['Indústria', 'Serviços', 'Agropecuária']).map((sec, i) => (
                      <span key={i} className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                        {sec}
                      </span>
                    ))}
                  </div>
                  {region.relevantEnterprises && region.relevantEnterprises.length > 0 && (
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      <strong>Grandes Companhias:</strong> {region.relevantEnterprises.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'governor' && (
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
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  fontWeight: 800
                }}>
                  {governor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {governor.name}
                    </h3>
                    <span className="badge badge-blue">{governor.party}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '0.2rem 0' }}>
                    {governor.age} anos • Ideologia: <strong>{governor.ideology}</strong> • Perfil: <strong>{governor.personality.toUpperCase()}</strong>
                  </p>
                  <p style={{ color: '#334155', fontSize: '0.82rem', margin: '0.4rem 0 0 0', fontStyle: 'italic' }}>
                    &ldquo;{region.politicalDominance.dominantInterests}&rdquo;
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Relação com o Presidente</span>
                  <div style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    color: governor.playerRelationship >= 20 ? '#047857' : governor.playerRelationship <= -10 ? '#b91c1c' : '#f59e0b'
                  }}>
                    {governor.playerRelationship > 0 ? `+${governor.playerRelationship}` : governor.playerRelationship} pts
                  </div>
                </div>
              </div>

              {/* Seção de Articulação do Pacto Federativo */}
              <div style={{
                padding: '1.5rem',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-lg)',
                background: '#eff6ff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Handshake size={20} color="#1d4ed8" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>
                    Negociação Política & Pacto Federativo
                  </h4>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#1e3a8a', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Governadores estaduais exercem controle direto sobre bancadas de deputados federais na Câmara. Ao negociar repasses extraordinários e emendas de bancada para o estado de {region.name}, o governador se compromete a alinhar seus deputados com a pauta do Executivo em Brasília.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e40af' }}>
                      Aporte em Emendas de Bancada:
                    </label>
                    <select
                      value={porkOfferBi}
                      onChange={e => setPorkOfferBi(parseFloat(e.target.value))}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #93c5fd', fontSize: '0.85rem' }}
                    >
                      <option value={0.5}>R$ 500 milhões (+3 a +5 Deputados)</option>
                      <option value={1.5}>R$ 1.5 bilhão (+6 a +9 Deputados)</option>
                      <option value={3.0}>R$ 3.0 bilhões (+10 a +15 Deputados)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleGovernorPact}
                    className="btn btn-primary"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Handshake size={16} /> Firmar Acordo Federativo
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cities' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                Principais polos urbanos do estado com seus respectivos prefeitos fictícios e administrações municipais:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(region.majorCities || [
                  { name: region.capital, population: Math.round(region.population * 0.3), mayorName: "Prefeito da Capital", mayorParty: "BCI", isCapital: true, coord: { x: 0, y: 0 } }
                ]).map((city, idx) => (
                  <div 
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      background: city.isCapital ? '#eff6ff' : '#f8fafc',
                      border: `1px solid ${city.isCapital ? '#bfdbfe' : '#e2e8f0'}`,
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={16} color={city.isCapital ? '#1d4ed8' : '#64748b'} />
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{city.name}</strong>
                        {city.isCapital && <span className="badge badge-blue" style={{ fontSize: '0.68rem' }}>Capital do Estado</span>}
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        População: {(city.population).toLocaleString('pt-BR')} habitantes
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Prefeito Municipal</span>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        {city.mayorName} <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{city.mayorParty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
                Aporte recursos orçamentários federais diretamente nas prioridades do estado de {region.name}:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Rodovias & Ferrovias</strong>
                    <span className="badge badge-blue">R$ 2.0 bi</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.8rem' }}>
                    Duplica corredores logísticos e escoamento da produção. Eleva infraestrutura (+6 pts).
                  </p>
                  <button 
                    onClick={() => handleInvestment('highways')}
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
                  >
                    Aportar Recursos
                  </button>
                </div>

                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Hospital Regional</strong>
                    <span className="badge badge-blue">R$ 1.5 bi</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.8rem' }}>
                    Amplia leitos de UTI e atendimento especializado. Eleva índice de saúde (+7 pts).
                  </p>
                  <button 
                    onClick={() => handleInvestment('hospital')}
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
                  >
                    Aportar Recursos
                  </button>
                </div>

                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Polo Universitário & Técnico</strong>
                    <span className="badge badge-blue">R$ 1.2 bi</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.8rem' }}>
                    Formação profissional e atração de empresas de tecnologia. Eleva educação (+6 pts).
                  </p>
                  <button 
                    onClick={() => handleInvestment('education')}
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
                  >
                    Aportar Recursos
                  </button>
                </div>

                <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.88rem' }}>Força Integrada de Segurança</strong>
                    <span className="badge badge-blue">R$ 1.0 bi</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.8rem' }}>
                    Integração das polícias e inteligência contra facções. Reduz criminalidade (-6 pts).
                  </p>
                  <button 
                    onClick={() => handleInvestment('security')}
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem' }}
                  >
                    Aportar Recursos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
