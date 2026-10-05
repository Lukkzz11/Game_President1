'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Map,
  Landmark, 
  Handshake,
  Scale, 
  ScrollText, 
  FileText, 
  Coins, 
  PieChart, 
  HeartHandshake, 
  Users2, 
  Building2,
  Briefcase, 
  Newspaper, 
  AlertTriangle 
} from 'lucide-react';
import { useGame } from '@/game/state/GameContext';

export type NavTab = 
  | 'overview'
  | 'regional_map'
  | 'coalition'
  | 'congress'
  | 'supreme_court'
  | 'constitution'
  | 'laws'
  | 'enterprises'
  | 'taxes'
  | 'budget'
  | 'social_programs'
  | 'social_groups'
  | 'ministers'
  | 'press'
  | 'events';

interface SidebarNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, onSelectTab }) => {
  const { state } = useGame();

  const vacancies = state?.supremeCourt.vacancies || 0;
  const activeEventsCount = state?.activeEvents.length || 0;
  const pendingLawsCount = state?.laws.filter(l => l.status === 'amended_by_congress' || l.status === 'in_congress').length || 0;
  const coalitionSeats = state?.congress.coalitionSeats || 0;
  const regionsCount = state?.regions?.length || 5;
  const enterprisesCount = state?.enterprises?.length || 10;

  const navItems = [
    { id: 'overview', label: 'Centro de Comando', icon: LayoutDashboard },
    { id: 'regional_map', label: 'MAPA', icon: Map, badge: 'Brasil & Mundo', badgeColor: 'blue' },
    { id: 'coalition', label: 'Alianças & Coalizão', icon: Handshake, badge: `${coalitionSeats}/513`, badgeColor: coalitionSeats >= 257 ? 'emerald' : 'crimson' },
    { id: 'congress', label: 'Congresso Nacional', icon: Landmark, badge: pendingLawsCount > 0 ? `${pendingLawsCount}` : undefined },
    { id: 'supreme_court', label: 'Supremo Tribunal', icon: Scale, badge: vacancies > 0 ? `${vacancies} vaga` : undefined, badgeColor: 'crimson' },
    { id: 'constitution', label: 'Constituição & PECs', icon: ScrollText },
    { id: 'laws', label: 'Leis & Reformas', icon: FileText },
    { id: 'enterprises', label: 'Empresas & Estatais', icon: Building2, badge: `${enterprisesCount}`, badgeColor: 'blue' },
    { id: 'taxes', label: 'Economia & Impostos', icon: Coins },
    { id: 'budget', label: 'Orçamento da União', icon: PieChart },
    { id: 'social_programs', label: 'Programas Sociais', icon: HeartHandshake },
    { id: 'social_groups', label: 'Grupos Sociais', icon: Users2 },
    { id: 'ministers', label: 'Gabinete Ministerial', icon: Briefcase },
    { id: 'press', label: 'Imprensa & Opinião', icon: Newspaper },
    { id: 'events', label: 'Crises & Eventos', icon: AlertTriangle, badge: activeEventsCount > 0 ? `${activeEventsCount}` : undefined, badgeColor: 'gold' },
  ];

  return (
    <aside style={{
      width: '265px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.75rem',
      gap: '0.35rem',
      height: 'calc(100vh - 65px)',
      overflowY: 'auto',
      position: 'sticky',
      top: '65px',
      boxShadow: '1px 0 4px rgba(15, 23, 42, 0.02)'
    }}>
      <div style={{
        padding: '0 0.6rem 0.6rem 0.6rem',
        fontSize: '0.72rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#64748b'
      }}>
        Poderes da República
      </div>

      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as NavTab)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
              background: isActive 
                ? '#eff6ff' 
                : 'transparent',
              color: isActive ? '#1d4ed8' : '#334155',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'left'
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#0f172a';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#334155';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <Icon size={18} color={isActive ? '#2563eb' : '#64748b'} />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span className={`badge ${item.badgeColor === 'crimson' ? 'badge-crimson' : item.badgeColor === 'emerald' ? 'badge-emerald' : item.badgeColor === 'gold' ? 'badge-gold' : 'badge-blue'}`} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
};
