'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { MainMenu } from '@/components/game/MainMenu';
import { CharacterCreation } from '@/components/game/CharacterCreation';
import { PartySelection } from '@/components/game/PartySelection';
import { IdeologyCompass } from '@/components/game/IdeologyCompass';
import { CampaignElection } from '@/components/game/CampaignElection';
import { EndOfMandateReport } from '@/components/game/EndOfMandateReport';
import { TopNav } from '@/components/dashboard/TopNav';
import { SidebarNav, type NavTab } from '@/components/dashboard/SidebarNav';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { MapTab } from '@/components/map/MapTab';
import { CongressTab } from '@/components/politics/CongressTab';
import { SupremeCourtTab } from '@/components/institutions/SupremeCourtTab';
import { ConstitutionTab } from '@/components/institutions/ConstitutionTab';
import { LawsTab } from '@/components/politics/LawsTab';
import { StateEnterprisesTab } from '@/components/economy/StateEnterprisesTab';
import { TaxesTab } from '@/components/dashboard/TaxesTab';
import { BudgetTab } from '@/components/dashboard/BudgetTab';
import { SocialProgramsTab } from '@/components/dashboard/SocialProgramsTab';
import { SocialGroupsTab } from '@/components/dashboard/SocialGroupsTab';
import { MinistersTab } from '@/components/politics/MinistersTab';
import { CoalitionTab } from '@/components/politics/CoalitionTab';
import { PressTab } from '@/components/politics/PressTab';
import { EventsTab } from '@/components/politics/EventsTab';
import { TurnReportModal } from '@/components/game/TurnReportModal';
import { SaveModal } from '@/components/game/SaveModal';
import { BreakingNewsTicker } from '@/components/dashboard/BreakingNewsTicker';
import { UrgentCrisisModal } from '@/components/game/UrgentCrisisModal';
import type { Player, Party, Ideology } from '@/game/types';

export default function HomePage() {
  const { state, startNewGame, setGamePhase, isLoading } = useGame();
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [tempPlayer, setTempPlayer] = useState<Partial<Player>>({});
  const [tempPartyId, setTempPartyId] = useState<string>('alp');

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        Carregando simulador político...
      </div>
    );
  }

  // 1. Menu Principal
  if (!state) {
    return (
      <MainMenu
        onStartNewGame={() => {
          startNewGame();
          setGamePhase('character_creation');
        }}
      />
    );
  }

  // 2. Fluxo de Onboarding (Criação de Personagem -> Partido -> Ideologia -> Eleição)
  if (state.phase === 'character_creation') {
    return (
      <CharacterCreation
        initialPlayer={state.player}
        onNext={playerData => {
          setTempPlayer(playerData);
          setGamePhase('party_selection');
        }}
        onBack={() => {
          window.location.reload();
        }}
      />
    );
  }

  if (state.phase === 'party_selection') {
    return (
      <PartySelection
        currentPartyId={state.party.id}
        onNext={(selectedParty: Party) => {
          setTempPartyId(selectedParty.id);
          state.party = selectedParty;
          state.player.partyId = selectedParty.id;

          const exists = state.allParties.some(p => p.id === selectedParty.id);
          if (!exists) {
            state.allParties = [selectedParty, ...state.allParties];
            state.congress.parties = [
              { partyId: selectedParty.id, seats: selectedParty.seats, stanceToPresident: 'coalition', relationshipWithPresident: 95 },
              ...state.congress.parties.filter(p => p.partyId !== selectedParty.id)
            ];
            state.congress.coalitionSeats = state.congress.parties
              .filter(p => p.stanceToPresident === 'coalition')
              .reduce((s, p) => s + p.seats, 0);
          }

          setGamePhase('ideology_setup');
        }}
        onBack={() => setGamePhase('character_creation')}
      />
    );
  }

  if (state.phase === 'ideology_setup') {
    return (
      <IdeologyCompass
        initialIdeology={state.player.ideology}
        onNext={(ideology: Ideology) => {
          state.player = {
            ...state.player,
            ...tempPlayer,
            ideology
          };
          setGamePhase('campaign');
        }}
        onBack={() => setGamePhase('party_selection')}
      />
    );
  }

  if (state.phase === 'campaign' || state.phase === 'election_day') {
    return (
      <CampaignElection
        state={state}
        onFinishElection={(voteShare: number) => {
          state.player.popularity = Math.round(voteShare * 0.9);
          setGamePhase('governing');
        }}
      />
    );
  }

  // 3. Fim do Mandato (8 Semestres / 4 anos concluídos)
  if (state.phase === 'end_of_mandate') {
    return <EndOfMandateReport />;
  }

  // 4. Modo de Governo (Governing)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopNav
        onOpenSaveModal={() => setShowSaveModal(true)}
      />
      <BreakingNewsTicker />

      <div style={{ display: 'flex', flex: 1 }}>
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <main style={{ flex: 1, padding: '1.75rem 2rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          {activeTab === 'overview' && <OverviewTab onNavigateTab={setActiveTab} />}
          {activeTab === 'regional_map' && <MapTab />}
          {activeTab === 'coalition' && <CoalitionTab />}
          {activeTab === 'congress' && <CongressTab />}
          {activeTab === 'supreme_court' && <SupremeCourtTab />}
          {activeTab === 'constitution' && <ConstitutionTab />}
          {activeTab === 'laws' && <LawsTab />}
          {activeTab === 'enterprises' && <StateEnterprisesTab />}
          {activeTab === 'taxes' && <TaxesTab />}
          {activeTab === 'budget' && <BudgetTab />}
          {activeTab === 'social_programs' && <SocialProgramsTab />}
          {activeTab === 'social_groups' && <SocialGroupsTab />}
          {activeTab === 'ministers' && <MinistersTab />}
          {activeTab === 'press' && <PressTab />}
          {activeTab === 'events' && <EventsTab />}
        </main>
      </div>

      {/* Modais Globais */}
      <UrgentCrisisModal />
      <TurnReportModal />
      {showSaveModal && <SaveModal onClose={() => setShowSaveModal(false)} />}
    </div>
  );
}
