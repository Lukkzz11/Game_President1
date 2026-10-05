'use client';

import React, { useState } from 'react';
import type { Party, Ideology, SocialGroup } from '@/game/types';
import partiesData from '@/data/parties.json';
import socialGroupsData from '@/data/social-groups.json';
import { Flag, PlusCircle, Check, Users, DollarSign, Award, ArrowRight, ArrowLeft, Sparkles, Sliders } from 'lucide-react';

interface PartySelectionProps {
  currentPartyId: string;
  onNext: (selectedParty: Party) => void;
  onBack: () => void;
}

const AVAILABLE_COLORS = [
  { name: 'Azul Presidencial', hex: '#2563eb' },
  { name: 'Vermelho Trabalhista', hex: '#dc2626' },
  { name: 'Verde Republicano', hex: '#059669' },
  { name: 'Âmbar Dourado', hex: '#d97706' },
  { name: 'Roxo Centrista', hex: '#7c3aed' },
  { name: 'Ciano Inovação', hex: '#0284c7' },
  { name: 'Rosa Social', hex: '#db2777' },
  { name: 'Grafite Nacional', hex: '#334155' }
];

export const PartySelection: React.FC<PartySelectionProps> = ({ currentPartyId, onNext, onBack }) => {
  const allParties = partiesData as Party[];
  const socialGroups = socialGroupsData as SocialGroup[];

  const [mode, setMode] = useState<'pick' | 'create'>('pick');
  const [selectedId, setSelectedId] = useState(currentPartyId || allParties[0].id);

  // Estado para criação do partido do zero
  const [customName, setCustomName] = useState('Frente Renovadora Cidadã');
  const [customAcronym, setCustomAcronym] = useState('FRC');
  const [customColor, setCustomColor] = useState(AVAILABLE_COLORS[0].hex);
  const [customDescription, setCustomDescription] = useState('Movimento focado na modernização do Estado, combate a privilégios e dinamismo econômico sustentável.');
  const [customFunding, setCustomFunding] = useState(45);
  const [customSeats, setCustomSeats] = useState(105);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['middle_class', 'business']);

  // Ideologia do partido personalizado
  const [partyMarket, setPartyMarket] = useState(40);
  const [partyStateSize, setPartyStateSize] = useState(-20);
  const [partySocialValues, setPartySocialValues] = useState(10);
  const [partySecurity, setPartySecurity] = useState(20);

  const toggleGroup = (groupId: string) => {
    if (selectedGroups.includes(groupId)) {
      if (selectedGroups.length > 1) {
        setSelectedGroups(selectedGroups.filter(g => g !== groupId));
      }
    } else {
      if (selectedGroups.length < 3) {
        setSelectedGroups([...selectedGroups, groupId]);
      }
    }
  };

  const handleConfirm = () => {
    if (mode === 'pick') {
      const party = allParties.find(p => p.id === selectedId) || allParties[0];
      onNext(party);
    } else {
      // Criação de nova legenda
      const customIdeology: Ideology = {
        marketVsState: partyMarket,
        stateSize: partyStateSize,
        taxes: partyStateSize > 0 ? 30 : -30,
        regulation: partyMarket < 0 ? 40 : -30,
        socialValues: partySocialValues,
        centralization: 0,
        civilLiberties: partySecurity,
        globalism: 20,
        trade: partyMarket > 0 ? 40 : -20,
        socialSpending: partyStateSize > 0 ? 50 : 0,
        militarySpending: partySecurity < 0 ? 40 : 0
      };

      const newParty: Party = {
        id: `party_custom_${Date.now()}`,
        name: customName.trim() || 'Nova Aliança Republicana',
        acronym: customAcronym.trim().toUpperCase() || 'NAR',
        color: customColor,
        description: customDescription.trim(),
        ideology: customIdeology,
        popularity: 30,
        seats: Math.max(40, Math.min(160, customSeats)),
        alliedSocialGroups: selectedGroups,
        funding: customFunding,
        influence: 75,
        stanceSummary: `${partyMarket > 20 ? 'Liberal' : partyMarket < -20 ? 'Desenvolvimentista' : 'Pragmático'}, ${partySocialValues > 20 ? 'Progressista' : partySocialValues < -20 ? 'Conservador' : 'Moderado'}`
      };

      onNext(newParty);
    }
  };

  return (
    <div style={{ maxWidth: '1080px', width: '100%', margin: '2rem auto', padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Etapa 2 de 4</span>
              <h1 className="font-title" style={{ fontSize: '1.85rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                Filiação Partidária & Fundação de Legenda
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                O partido define suas bases no Congresso Nacional, o financiamento de campanha e a aliança com grupos sociais.
              </p>
            </div>

            {/* Alternador de Modo */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.3rem', borderRadius: 'var(--radius-md)', gap: '0.3rem' }}>
              <button
                type="button"
                onClick={() => setMode('pick')}
                className="btn"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  background: mode === 'pick' ? '#ffffff' : 'transparent',
                  color: mode === 'pick' ? '#0f172a' : '#64748b',
                  boxShadow: mode === 'pick' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <Flag size={15} /> Escolher Legenda Existente
              </button>
              <button
                type="button"
                onClick={() => setMode('create')}
                className="btn"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  background: mode === 'create' ? '#2563eb' : 'transparent',
                  color: mode === 'create' ? '#ffffff' : '#64748b',
                  boxShadow: mode === 'create' ? '0 2px 6px rgba(37,99,235,0.3)' : 'none'
                }}
              >
                <PlusCircle size={15} /> Fundar Novo Partido
              </button>
            </div>
          </div>
        </div>

        {/* MODO 1: ESCOLHER PARTIDO EXISTENTE */}
        {mode === 'pick' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.15rem', marginBottom: '2rem' }}>
            {allParties.map(p => {
              const isSelected = p.id === selectedId;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  style={{
                    background: isSelected ? '#eff6ff' : '#ffffff',
                    border: isSelected ? `2px solid ${p.color}` : '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 4px 15px ${p.color}25` : '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: p.color
                        }} />
                        <span className="font-mono" style={{ fontWeight: 800, fontSize: '1.2rem', color: p.color }}>
                          {p.acronym}
                        </span>
                      </div>
                      <span className="badge badge-blue font-mono" style={{ fontSize: '0.7rem' }}>
                        {p.seats} Deputados
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                      {p.name}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
                      {p.description}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span>Perfil:</span>
                      <strong style={{ color: '#0f172a' }}>{p.stanceSummary}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fundo Eleitoral:</span>
                      <strong className="font-mono" style={{ color: 'var(--accent-gold)' }}>R$ {p.funding}M</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODO 2: FUNDAR NOVO PARTIDO POLÍTICO */}
        {mode === 'create' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Coluna 1: Dados Institucionais */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Nome Oficial do Partido
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="input-text"
                  placeholder="Ex: Frente Renovadora Cidadã"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Sigla Partidária
                  </label>
                  <input
                    type="text"
                    value={customAcronym}
                    onChange={e => setCustomAcronym(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="input-text font-mono"
                    style={{ fontWeight: 800, letterSpacing: '0.05em' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    Cadeiras Fundadoras
                  </label>
                  <input
                    type="number"
                    value={customSeats}
                    onChange={e => setCustomSeats(Number(e.target.value))}
                    min={40}
                    max={160}
                    className="input-text font-mono"
                  />
                </div>
              </div>

              {/* Seletor de Cor da Legenda */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  Cor e Identidade Visual da Legenda
                </label>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {AVAILABLE_COLORS.map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setCustomColor(c.hex)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: c.hex,
                        border: customColor === c.hex ? '3px solid #0f172a' : '2px solid #ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}
                      title={c.name}
                    >
                      {customColor === c.hex && <Check size={16} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Manifesto & Bandeiras Principais
                </label>
                <textarea
                  value={customDescription}
                  onChange={e => setCustomDescription(e.target.value)}
                  className="input-textarea"
                  rows={3}
                  placeholder="Descreva o manifesto e compromissos centrais da sua legenda..."
                />
              </div>

              {/* Fundo Partidário */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  <span>Fundo Partidário Inicial:</span>
                  <span className="font-mono" style={{ color: 'var(--accent-gold)' }}>R$ {customFunding}M</span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={75}
                  step={5}
                  value={customFunding}
                  onChange={e => setCustomFunding(Number(e.target.value))}
                  className="range-slider"
                />
              </div>
            </div>

            {/* Coluna 2: Ideologia e Base Social */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <Sliders size={18} color="var(--accent-blue)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Diretrizes Ideológicas do Partido
                </h4>
              </div>

              {/* Slider Economia */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginBottom: '0.25rem' }}>
                  <span>Estatista / Desenvolvimentista</span>
                  <strong style={{ color: '#0f172a' }}>{partyMarket > 0 ? `+${partyMarket} Livre Mercado` : `${partyMarket} Intervenção`}</strong>
                  <span>Livre Mercado</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={partyMarket}
                  onChange={e => setPartyMarket(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Slider Tamanho do Estado */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginBottom: '0.25rem' }}>
                  <span>Estado Mínimo / Austeridade</span>
                  <strong style={{ color: '#0f172a' }}>{partyStateSize > 0 ? `+${partyStateSize} Estado de Bem-Estar` : `${partyStateSize} Redução`}</strong>
                  <span>Estado de Bem-Estar Forte</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={partyStateSize}
                  onChange={e => setPartyStateSize(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Slider Costumes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', marginBottom: '0.25rem' }}>
                  <span>Conservador Tradicional</span>
                  <strong style={{ color: '#0f172a' }}>{partySocialValues > 0 ? `+${partySocialValues} Progressista` : `${partySocialValues} Conservador`}</strong>
                  <span>Progressista / Direitos</span>
                </div>
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={partySocialValues}
                  onChange={e => setPartySocialValues(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Grupos Sociais Fundadores */}
              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                  Bases Sociais Fundadoras (Escolha até 3 grupos prioritários):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {socialGroups.map(g => {
                    const isSelected = selectedGroups.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleGroup(g.id)}
                        className={`badge ${isSelected ? 'badge-blue' : 'badge-purple'}`}
                        style={{
                          cursor: 'pointer',
                          padding: '0.35rem 0.65rem',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                          color: isSelected ? '#1d4ed8' : '#475569'
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <button type="button" onClick={onBack} className="btn btn-outline">
            <ArrowLeft size={16} /> Voltar ao Personagem
          </button>
          <button type="button" onClick={handleConfirm} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Próximo: Posições Ideológicas <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
