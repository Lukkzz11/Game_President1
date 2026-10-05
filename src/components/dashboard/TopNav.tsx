'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Building2, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Save, 
  Play, 
  Menu,
  ShieldAlert,
  Gavel,
  Award
} from 'lucide-react';

interface TopNavProps {
  onToggleSidebar?: () => void;
  onOpenSaveModal?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, onOpenSaveModal }) => {
  const { state, advanceSemesterTurn, isLoading } = useGame();
  const [advancing, setAdvancing] = useState(false);

  if (!state) return null;

  const handleAdvance = async () => {
    if (advancing || isLoading) return;
    setAdvancing(true);
    await advanceSemesterTurn();
    setAdvancing(false);
  };

  const gdp = state.economy.gdp;
  const inflation = state.economy.inflation;
  const unemployment = state.economy.unemployment;
  const debt = state.economy.publicDebt;
  const balance = state.budget.nominalBalance;
  const popularity = state.player.popularity;
  const politicalCapital = state.politicalCapital ?? 60;
  const vacancies = state.supremeCourt.vacancies;

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.65rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)'
    }}>
      {/* Esquerda: Identificação do País e Presidente */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={onToggleSidebar}
          className="btn btn-outline" 
          style={{ padding: '0.45rem', display: 'md:none' }}
          title="Alternar Menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.1)'
          }}>
            <Building2 size={22} color="#2563eb" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="font-title" style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                {state.country.name}
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                Turno {state.turn}/8
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Pres. <strong>{state.player.name}</strong></span>
              <span>•</span>
              <span style={{ color: state.party.color, fontWeight: 700 }}>{state.party.acronym}</span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={13} /> {state.currentDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Centro: Indicadores Chave de Gestão */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.25rem',
        padding: '0.35rem 1rem',
        background: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Capital Político */}
        <div style={{ textAlign: 'center' }} title="Capital Político do Presidente (Gasto em reformas e articulações)">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
            <Award size={11} color="var(--accent-gold)" /> Cap. Político
          </div>
          <div className="font-mono" style={{ 
            fontSize: '0.95rem', 
            fontWeight: 800, 
            color: politicalCapital >= 50 ? '#0369a1' : '#b45309' 
          }}>
            {politicalCapital} pts
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Popularidade */}
        <div style={{ textAlign: 'center' }} title="Aprovação Popular do Presidente">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aprovação</div>
          <div className="font-mono" style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: popularity >= 50 ? 'var(--accent-emerald)' : popularity >= 35 ? 'var(--accent-gold)' : 'var(--accent-crimson)' 
          }}>
            {popularity}%
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Inflação */}
        <div style={{ textAlign: 'center' }} title="Inflação Anual Acumulada">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inflação</div>
          <div className="font-mono" style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: inflation > 8.0 ? 'var(--accent-crimson)' : 'var(--text-primary)' 
          }}>
            {inflation}%
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Desemprego */}
        <div style={{ textAlign: 'center' }} title="Taxa de Desemprego Nacional">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Desemprego</div>
          <div className="font-mono" style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: unemployment > 12.0 ? 'var(--accent-crimson)' : 'var(--text-primary)' 
          }}>
            {unemployment}%
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Dívida Pública */}
        <div style={{ textAlign: 'center' }} title="Dívida Pública em % do PIB">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dívida/PIB</div>
          <div className="font-mono" style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: debt > 80.0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)' 
          }}>
            {debt}%
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Balanço Nominal / Déficit */}
        <div style={{ textAlign: 'center' }} title="Resultado Orçamentário Nominal (Receita - Despesas)">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Balanço</div>
          <div className="font-mono" style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: balance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)' 
          }}>
            {balance >= 0 ? `+${balance} bi` : `${balance} bi`}
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />

        {/* Termômetro de Corrupção */}
        <div style={{ textAlign: 'center' }} title="Percepção de Corrupção Governamental">
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Corrupção</div>
          <div className="font-mono" style={{ 
            fontSize: '0.95rem', 
            fontWeight: 700, 
            color: (state.perceivedCorruption || 28) > 40 ? 'var(--accent-crimson)' : 'var(--accent-emerald)' 
          }}>
            {state.perceivedCorruption || 28}%
          </div>
        </div>

        {vacancies > 0 && (
          <>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)' }} />
            <div style={{ textAlign: 'center' }} title="Vagas Abertas no Supremo Tribunal Federal">
              <span className="badge badge-crimson" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Gavel size={12} /> {vacancies} {vacancies === 1 ? 'Vaga STF' : 'Vagas STF'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Direita: Ações (Salvar e Avançar Turno) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          onClick={onOpenSaveModal}
          className="btn btn-secondary" 
          title="Salvar Estado da Partida no Navegador"
        >
          <Save size={16} /> Salvar
        </button>

        <button 
          onClick={handleAdvance}
          disabled={advancing || isLoading}
          className="btn btn-gold pulse-gold"
          style={{ padding: '0.65rem 1.4rem', fontWeight: 700 }}
          title="Simular os próximos 6 meses de governo e processar consequências"
        >
          <Play size={16} fill="currentColor" />
          {advancing ? 'Simulando Semestre...' : 'Avançar 6 Meses'}
        </button>
      </div>
    </header>
  );
};
