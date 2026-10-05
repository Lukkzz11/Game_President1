'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import type { PresidentAgendaActionId } from '@/game/types';
import { 
  Calendar, 
  TrendingUp, 
  Landmark, 
  Users, 
  Building2, 
  Mic2, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Award,
  ArrowRight
} from 'lucide-react';

export const PresidentialAgendaCard: React.FC = () => {
  const { state, executeAgendaAction } = useGame();
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);

  if (!state) return null;

  const agenda = state.agenda || {
    totalActionPoints: 3,
    remainingActionPoints: 3,
    actionsTakenLog: []
  };

  const handleAction = (id: PresidentAgendaActionId) => {
    if (agenda.remainingActionPoints <= 0) return;
    setSubmittingAction(id);
    setTimeout(() => {
      executeAgendaAction(id);
      setSubmittingAction(null);
    }, 400);
  };

  const agendaOptions: {
    id: PresidentAgendaActionId;
    title: string;
    dayLabel: string;
    category: string;
    icon: React.ReactNode;
    description: string;
    benefitSummary: string;
    badgeColor: string;
  }[] = [
    {
      id: 'meeting_economy',
      title: 'Despacho com Ministério da Fazenda & Planejamento',
      dayLabel: 'Segunda-feira',
      category: 'Econômica',
      icon: <TrendingUp size={20} color="#0284c7" />,
      description: 'Reunião estratégica para rever metas fiscais, acalmar os mercados e alinhar a taxa de juros do Banco Central.',
      benefitSummary: '-0.5% Inflação • +0.2% PIB • +6 Capital Político',
      badgeColor: 'badge-blue'
    },
    {
      id: 'congress_whips',
      title: 'Articulação Política com Líderes da Câmara e Senado',
      dayLabel: 'Terça-feira',
      category: 'Congresso',
      icon: <Landmark size={20} color="#7c3aed" />,
      description: 'Reunião com líderes partidários e presidente da Câmara para garantir apoio nas votações de reformas estruturantes.',
      benefitSummary: '+14 Deputados na Base • +10 Capital Político',
      badgeColor: 'badge-purple'
    },
    {
      id: 'governors_summit',
      title: 'Conferência Federativa com Governadores de Estado',
      dayLabel: 'Quarta-feira',
      category: 'Federativa',
      icon: <Building2 size={20} color="#059669" />,
      description: 'Acordo com os governadores para equalizar repasses de saúde e segurança, desarmando tensões regionais.',
      benefitSummary: '+3% Aprovação • +5 Capital Político • Harmonia Federativa',
      badgeColor: 'badge-emerald'
    },
    {
      id: 'unions_dialogue',
      title: 'Mesa de Diálogo com Centrais Sindicais & Trabalhadores',
      dayLabel: 'Quinta-feira',
      category: 'Social',
      icon: <Users size={20} color="#ea580c" />,
      description: 'Audiência com lideranças sindicais e movimentos populares sobre valorização salarial e combate ao desemprego.',
      benefitSummary: '+4% Aprovação • Neutraliza risco de greves urbanas',
      badgeColor: 'badge-gold'
    },
    {
      id: 'business_roundtable',
      title: 'Encontro com Empresários & Investidores (Faria Lima / CNI)',
      dayLabel: 'Sexta-feira',
      category: 'Mercado',
      icon: <Award size={20} color="#0d9488" />,
      description: 'Apresentação de garantias jurídicas e programas de desoneração para estimular investimentos privados no país.',
      benefitSummary: '+0.3% Investimento no PIB • +4 Capital Político',
      badgeColor: 'badge-blue'
    },
    {
      id: 'press_conference',
      title: 'Entrevista Exclusiva & Pronunciamento à Nação',
      dayLabel: 'Sábado',
      category: 'Comunicação',
      icon: <Mic2 size={20} color="#dc2626" />,
      description: 'Transmissão em cadeia nacional de rádio e TV prestando contas e defendendo os rumos do governo perante a sociedade.',
      benefitSummary: '+5% Aprovação Popular • Transparência pública',
      badgeColor: 'badge-crimson'
    },
    {
      id: 'crisis_management',
      title: 'Gabinete de Crise & Gestão de Emergência',
      dayLabel: 'Plantão',
      category: 'Urgência',
      icon: <ShieldAlert size={20} color="#b91c1c" />,
      description: 'Mobilização ministerial para conter o problema mais agudo do país e prevenir que exploda em crise no próximo semestre.',
      benefitSummary: 'Contém dilema urgente • +8 Capital Político',
      badgeColor: 'badge-crimson'
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', background: '#ffffff', border: '1px solid #cbd5e1' }}>
      {/* Header da Agenda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
              Gestão de Tempo & Recursos
            </span>
            <h2 className="font-title" style={{ fontSize: '1.35rem', color: '#0f172a', margin: 0 }}>
              Agenda Semestral do Presidente da República
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', margin: 0, maxWidth: '720px' }}>
            O Chefe de Estado possui tempo limitado e não consegue atender a todas as demandas simultaneamente. Escolha onde concentrar seus despachos. Problemas ignorados podem se agravar nos próximos 6 meses.
          </p>
        </div>

        {/* Contador de Slots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: agenda.remainingActionPoints > 0 ? '#eff6ff' : '#f8fafc',
          border: `1.5px solid ${agenda.remainingActionPoints > 0 ? '#93c5fd' : '#e2e8f0'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '0.65rem 1.25rem'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Despachos Disponíveis
            </div>
            <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: agenda.remainingActionPoints > 0 ? '#1d4ed8' : '#64748b' }}>
              {agenda.remainingActionPoints} / {agenda.totalActionPoints} Slots
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {Array.from({ length: agenda.totalActionPoints }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '12px',
                  height: '24px',
                  borderRadius: '4px',
                  background: idx < agenda.remainingActionPoints ? '#2563eb' : '#cbd5e1',
                  transition: 'background 0.2s ease'
                }}
                title={idx < agenda.remainingActionPoints ? 'Slot disponível' : 'Slot consumido'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Opções da Agenda */}
      {agenda.remainingActionPoints > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {agendaOptions.map(opt => (
            <div
              key={opt.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {opt.icon}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {opt.dayLabel}
                    </span>
                  </div>
                  <span className={`badge ${opt.badgeColor}`} style={{ fontSize: '0.65rem' }}>
                    {opt.category}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem', lineHeight: '1.3' }}>
                  {opt.title}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '0.85rem' }}>
                  {opt.description}
                </p>
              </div>

              <div>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#0369a1',
                  marginBottom: '0.85rem'
                }}>
                  {opt.benefitSummary}
                </div>

                <button
                  type="button"
                  onClick={() => handleAction(opt.id)}
                  disabled={submittingAction !== null}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', fontWeight: 700 }}
                >
                  <Calendar size={14} />
                  {submittingAction === opt.id ? 'Realizando Despacho...' : 'Realizar Despacho (1 Slot)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#e0f2fe',
            color: '#0369a1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
            Agenda do {state.currentDate} Concluída
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '580px', margin: '0 auto 1rem auto', lineHeight: '1.45' }}>
            Todos os 3 slots de tempo do Presidente para este semestre foram empenhados. Os resultados foram registrados e repercutirão nos próximos meses.
          </p>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Clique em <strong>"Avançar 6 Meses"</strong> no topo da página para avançar o mandato e obter um novo conjunto de slots de agenda.
          </div>
        </div>
      )}

      {/* Histórico dos Despachos deste Semestre */}
      {agenda.actionsTakenLog && agenda.actionsTakenLog.length > 0 && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Despachos Cumpridos Neste Semestre ({agenda.actionsTakenLog.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {agenda.actionsTakenLog.map((log, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#334155',
                  background: '#f8fafc',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <CheckCircle2 size={14} color="#15803d" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
