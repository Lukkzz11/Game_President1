'use client';

import React, { useState, useMemo } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Landmark, 
  Users, 
  Vote, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Play, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import type { Congress, Party } from '@/game/types';

interface ParliamentarianSeat {
  id: number;
  name: string;
  partyAcronym: string;
  partyColor: string;
  stance: 'coalition' | 'independent' | 'opposition';
  region: string;
  ideology: string;
  loyalty: number; // 0 a 100
  interests: string;
  x: number;
  y: number;
  vote: 'yes' | 'no' | 'undecided' | 'absent';
}

const FIRST_NAMES = [
  'Marcos', 'Carlos', 'Rodrigo', 'Arthur', 'Renato', 'Eduardo', 'Paulo', 'Fernando', 'Luiz', 'Gustavo',
  'Camila', 'Helena', 'Mariana', 'Beatriz', 'Juliana', 'Patrícia', 'Renata', 'Simone', 'Teresa', 'Aline'
];

const LAST_NAMES = [
  'Silva', 'Oliveira', 'Santos', 'Souza', 'Pereira', 'Lima', 'Carvalho', 'Ferreira', 'Ribeiro', 'Barbosa',
  'Fontoura', 'Alencastro', 'Queiroz', 'Macedo', 'Bittencourt', 'Mundukuru', 'Klinger', 'Brandão', 'Duarte', 'Siqueira'
];

const REGIONS = [
  'Distrito Federal (Brasília)',
  'São Paulo (Sudeste)',
  'Rio de Janeiro (Sudeste)',
  'Minas Gerais (Sudeste)',
  'Bahia (Nordeste)',
  'Pernambuco (Nordeste)',
  'Rio Grande do Sul (Sul)',
  'Paraná (Sul)',
  'Amazonas (Norte)',
  'Pará (Norte)',
  'Mato Grosso (Centro-Oeste)',
  'Goiás (Centro-Oeste)'
];

const INTERESTS = [
  'Emendas de bancada para saneamento e infraestrutura',
  'Incentivos fiscais para a indústria de transformação',
  'Pauta de segurança pública e combate ao crime organizado',
  'Segurança jurídica e desoneração do agronegócio',
  'Aumento real do salário mínimo e direitos trabalhistas',
  'Equilíbrio fiscal e controle rigoroso do teto de gastos',
  'Crédito subsidiado para agricultura familiar'
];

export const CongressionalPlenaryView: React.FC = () => {
  const { state } = useGame();
  const [selectedSeat, setSelectedSeat] = useState<ParliamentarianSeat | null>(null);
  const [displayMode, setDisplayMode] = useState<'benches' | 'voting'>('benches');
  const [isVotingSimulating, setIsVotingSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);

  if (!state) return null;

  const { congress, allParties } = state;
  const coalitionSeatsCount = congress.coalitionSeats;
  const oppositionSeatsCount = congress.oppositionSeats;
  const independentSeatsCount = congress.independentSeats;

  // Gerar os 513 assentos em arco geométrico (Hemiciclo Parlamentar)
  const seats: ParliamentarianSeat[] = useMemo(() => {
    const list: ParliamentarianSeat[] = [];
    const totalSeats = 513;

    // Distribuição de partidos
    const partyPool: { acronym: string; color: string; stance: 'coalition' | 'independent' | 'opposition' }[] = [];
    
    congress.parties.forEach(p => {
      const pInfo = allParties.find(ap => ap.id === p.partyId);
      const acronym = pInfo?.acronym || p.partyId.toUpperCase();
      const color = pInfo?.color || '#64748b';
      for (let i = 0; i < p.seats; i++) {
        partyPool.push({
          acronym,
          color,
          stance: p.stanceToPresident
        });
      }
    });

    // Ordenar para agrupar visualmente: Esquerda/Oposição -> Centro -> Base Aliada
    partyPool.sort((a, b) => {
      const order = { opposition: 1, independent: 2, coalition: 3 };
      return order[a.stance] - order[b.stance];
    });

    // Disposição concêntrica em arco (9 fileiras)
    const rows = [30, 38, 46, 54, 62, 70, 78, 85, 90]; // Soma aprox. 553, ajustamos a 513
    let seatIndex = 0;
    const centerX = 360;
    const centerY = 340;

    for (let r = 0; r < rows.length; r++) {
      const rowRadius = 100 + r * 26;
      const countInRow = rows[r];

      for (let c = 0; c < countInRow; c++) {
        if (seatIndex >= totalSeats) break;

        // Ângulo de PI (180°) a 0 (0°)
        const angle = Math.PI - (c / (countInRow - 1)) * Math.PI;
        const x = centerX + Math.cos(angle) * rowRadius;
        const y = centerY - Math.sin(angle) * rowRadius;

        const party = partyPool[seatIndex] || { acronym: 'IND', color: '#64748b', stance: 'independent' };
        
        const firstName = FIRST_NAMES[(seatIndex * 7 + r) % FIRST_NAMES.length];
        const lastName = LAST_NAMES[(seatIndex * 13 + c) % LAST_NAMES.length];
        const region = REGIONS[(seatIndex + r) % REGIONS.length];
        const interests = INTERESTS[(seatIndex * 3) % INTERESTS.length];
        
        const loyalty = party.stance === 'coalition' 
          ? Math.min(100, Math.max(55, 75 + ((seatIndex % 7) - 3) * 5))
          : party.stance === 'independent'
          ? Math.min(80, Math.max(30, 50 + ((seatIndex % 5) - 2) * 8))
          : Math.min(40, Math.max(5, 20 + ((seatIndex % 3) - 1) * 6));

        // Votação inicial estimada
        let vote: 'yes' | 'no' | 'undecided' | 'absent' = 'undecided';
        if (party.stance === 'coalition') {
          vote = (seatIndex % 20 === 0) ? 'undecided' : 'yes';
        } else if (party.stance === 'opposition') {
          vote = (seatIndex % 15 === 0) ? 'undecided' : 'no';
        } else {
          vote = loyalty > 48 ? 'yes' : loyalty < 35 ? 'no' : 'undecided';
        }
        if (seatIndex % 45 === 0) vote = 'absent';

        list.push({
          id: seatIndex + 1,
          name: `Dep. ${firstName} ${lastName}`,
          partyAcronym: party.acronym,
          partyColor: party.color,
          stance: party.stance,
          region,
          ideology: party.stance === 'coalition' ? 'Governo / Reformista' : party.stance === 'opposition' ? 'Oposição / Crítica Fiscal' : 'Centrão / Pragmático',
          loyalty,
          interests,
          x,
          y,
          vote
        });

        seatIndex++;
      }
    }

    return list;
  }, [congress, allParties]);

  // Contagem de votos do modo Votação
  const voteStats = useMemo(() => {
    const yes = seats.filter(s => s.vote === 'yes').length;
    const no = seats.filter(s => s.vote === 'no').length;
    const undecided = seats.filter(s => s.vote === 'undecided').length;
    const absent = seats.filter(s => s.vote === 'absent').length;
    return { yes, no, undecided, absent };
  }, [seats]);

  const handleSimulateRollCall = () => {
    setDisplayMode('voting');
    setIsVotingSimulating(true);
    setSimulationProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setSimulationProgress(current);
      if (current >= 513) {
        clearInterval(interval);
        setIsVotingSimulating(false);
      }
    }, 60);
  };

  const getSeatColor = (seat: ParliamentarianSeat) => {
    if (displayMode === 'voting') {
      if (isVotingSimulating && seat.id > simulationProgress) {
        return '#cbd5e1'; // Aguardando chamada nominal
      }
      switch (seat.vote) {
        case 'yes': return '#059669'; // 🟢 Verde Sim
        case 'no': return '#dc2626'; // 🔴 Vermelho Não
        case 'undecided': return '#d97706'; // 🟨 Amarelo Indeciso
        case 'absent': return '#94a3b8'; // ⚪ Cinza Ausente
      }
    }

    // Modo Bancadas
    switch (seat.stance) {
      case 'coalition': return '#2563eb'; // 🟦 Azul Base
      case 'independent': return '#7c3aed'; // 🟪 Roxo Centrão
      case 'opposition': return '#dc2626'; // 🟥 Vermelho Oposição
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Barra de Controle de Visualização do Plenário */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.75rem', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="font-title" style={{ fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Landmark size={20} color="var(--accent-blue)" /> Hemiciclo do Plenário Ulisses Guimarães (513 Cadeiras)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Representação visual de cada um dos 513 deputados federais da República. Passe o mouse ou clique sobre qualquer assento para abrir o perfil parlamentar.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Seletor de Modo */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => { setDisplayMode('benches'); setIsVotingSimulating(false); }}
              className="btn"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: displayMode === 'benches' ? '#ffffff' : 'transparent',
                color: displayMode === 'benches' ? '#1d4ed8' : '#64748b',
                boxShadow: displayMode === 'benches' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Users size={14} style={{ marginRight: '0.3rem' }} /> Bancadas Partidárias
            </button>
            <button
              onClick={() => setDisplayMode('voting')}
              className="btn"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: displayMode === 'voting' ? '#ffffff' : 'transparent',
                color: displayMode === 'voting' ? '#047857' : '#64748b',
                boxShadow: displayMode === 'voting' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Vote size={14} style={{ marginRight: '0.3rem' }} /> Painel de Votação
            </button>
          </div>

          <button
            onClick={handleSimulateRollCall}
            disabled={isVotingSimulating}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Play size={14} /> Simular Chamada Nominal
          </button>
        </div>
      </div>

      {/* Grid: Hemiciclo SVG à Esquerda e Dossiê do Deputado à Direita */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Painel do Hemiciclo */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', textAlign: 'center' }}>
          {/* Placar de Quórum ou Votação */}
          {displayMode === 'benches' ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#2563eb' }} />
                <span>Base Governista: <strong className="font-mono">{coalitionSeatsCount}</strong> ({Math.round((coalitionSeatsCount / 513) * 100)}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#7c3aed' }} />
                <span>Centrão / Independente: <strong className="font-mono">{independentSeatsCount}</strong> ({Math.round((independentSeatsCount / 513) * 100)}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#dc2626' }} />
                <span>Oposição: <strong className="font-mono">{oppositionSeatsCount}</strong> ({Math.round((oppositionSeatsCount / 513) * 100)}%)</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857' }}>
                <CheckCircle2 size={16} />
                <span>SIM: <strong className="font-mono" style={{ fontSize: '1.1rem' }}>{voteStats.yes}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#b91c1c' }}>
                <XCircle size={16} />
                <span>NÃO: <strong className="font-mono" style={{ fontSize: '1.1rem' }}>{voteStats.no}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d97706' }}>
                <HelpCircle size={16} />
                <span>INDECISOS: <strong className="font-mono" style={{ fontSize: '1.1rem' }}>{voteStats.undecided}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                <span>AUSENTES: <strong className="font-mono" style={{ fontSize: '1.1rem' }}>{voteStats.absent}</strong></span>
              </div>
              <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '1rem', fontWeight: 700, color: voteStats.yes >= 257 ? '#047857' : '#b91c1c' }}>
                {voteStats.yes >= 257 ? 'MAIORIA ALCANÇADA (257+)' : 'MAIORIA NÃO ALCANÇADA'}
              </div>
            </div>
          )}

          {/* SVG Hemiciclo de 513 Assentos */}
          <div style={{ background: '#f8fafc', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0', padding: '1.5rem 0.5rem', position: 'relative' }}>
            <svg viewBox="0 0 720 380" style={{ width: '100%', height: 'auto', maxHeight: '420px', overflow: 'visible' }}>
              {/* Mesa Diretora da Presidência da Câmara */}
              <circle cx="360" cy="345" r="22" fill="#0f172a" stroke="#d97706" strokeWidth="2" />
              <text x="360" y="349" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">MESA</text>

              {/* Tribuna de Oradores */}
              <rect x="345" y="310" width="30" height="12" rx="4" fill="#334155" />

              {/* Todos os 513 Assentos Individuais */}
              {seats.map(seat => {
                const isSelected = selectedSeat?.id === seat.id;
                const fillColor = getSeatColor(seat);

                return (
                  <circle
                    key={seat.id}
                    cx={seat.x}
                    cy={seat.y}
                    r={isSelected ? 6.5 : 4.2}
                    fill={fillColor}
                    stroke={isSelected ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected ? 2 : 0.6}
                    className={`plenary-seat ${isVotingSimulating && seat.id === simulationProgress ? 'seat-vote-flip' : ''}`}
                    onClick={() => setSelectedSeat(seat)}
                  />
                );
              })}
            </svg>

            {/* Marcadores de Linha de Fogo no Plenário */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              <span>⬅ Ala da Oposição (Bancada da Esquerda)</span>
              <span>Tribuna Central</span>
              <span>Ala Governista (Bancada da Direita) ➡</span>
            </div>
          </div>
        </div>

        {/* Dossiê do Parlamentar Selecionado */}
        <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff', minHeight: '440px' }}>
          {selectedSeat ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    Cadeira #{selectedSeat.id} de 513
                  </span>
                  <span className={`badge ${selectedSeat.stance === 'coalition' ? 'badge-blue' : selectedSeat.stance === 'opposition' ? 'badge-crimson' : 'badge-gold'}`} style={{ fontSize: '0.68rem' }}>
                    {selectedSeat.stance === 'coalition' ? 'Base Aliada' : selectedSeat.stance === 'opposition' ? 'Oposição' : 'Centrão'}
                  </span>
                </div>

                <h3 className="font-title" style={{ fontSize: '1.3rem', color: '#0f172a' }}>
                  {selectedSeat.name}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Partido: <strong style={{ color: selectedSeat.partyColor }}>{selectedSeat.partyAcronym}</strong> • {selectedSeat.region}
                </div>
              </div>

              {/* Status de Lealdade e Votação */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ALINHAMENTO COM O GOVERNO</div>
                  <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedSeat.loyalty > 60 ? '#047857' : selectedSeat.loyalty < 40 ? '#b91c1c' : '#d97706' }}>
                    {selectedSeat.loyalty}%
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>VOTO NA PAUTA ATIVA</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: selectedSeat.vote === 'yes' ? '#047857' : selectedSeat.vote === 'no' ? '#b91c1c' : '#d97706', textTransform: 'uppercase' }}>
                    {selectedSeat.vote === 'yes' ? '🟢 Favorável' : selectedSeat.vote === 'no' ? '🔴 Contrário' : selectedSeat.vote === 'undecided' ? '🟨 Em Negociação' : '⚪ Ausente'}
                  </div>
                </div>
              </div>

              {/* Perfil e Interesses */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Orientação Ideológica
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                  {selectedSeat.ideology}
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Interesse Regional Prioritário
                </div>
                <p style={{ fontSize: '0.82rem', color: '#1e293b', lineHeight: '1.4' }}>
                  "{selectedSeat.interests}"
                </p>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                Dica: Votos deste parlamentar podem ser conquistados mediante atendimento de emendas estaduais, audiências na agenda presidencial ou inclusão de emendas supressivas.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '360px', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
              <Users size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 600 }}>Nenhum Parlamentar Selecionado</h4>
              <p style={{ fontSize: '0.82rem', maxWidth: '300px', marginTop: '0.4rem' }}>
                Passe o cursor sobre os 513 círculos do hemiciclo para inspecionar nome, partido, região e alinhamento político de cada deputado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
