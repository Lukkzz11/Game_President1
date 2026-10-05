'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  GameState, 
  Player, 
  Party, 
  Law, 
  Tax, 
  SupremeJusticeCandidate, 
  ConstitutionalAmendmentProposal,
  TurnReport,
  TimelineEntry
} from '@/game/types';
import { createInitialGameState } from '@/game/state/initialState';
import { advanceTurn } from '@/game/engine/turnEngine';
import { saveGameToDb, loadGameFromDb, listAllSaves, type SavedGameRecord } from '@/database/db';
import { evaluateLawInCongress } from '@/game/simulation/congress';
import { voteCandidateConfirmation } from '@/game/simulation/supremeCourt';

interface GameContextType {
  state: GameState | null;
  isLoading: boolean;
  activeReport: TurnReport | null;
  savedGamesList: SavedGameRecord[];
  refreshSavedGames: () => Promise<void>;
  startNewGame: (customPlayer?: Partial<Player>, selectedPartyId?: string) => void;
  loadGame: (saveId: string) => Promise<boolean>;
  saveGame: (name?: string) => Promise<string | null>;
  setGamePhase: (phase: GameState['phase']) => void;
  updateTaxRate: (taxId: string, newRate: number) => void;
  updateBudgetAmount: (categoryId: string, newAmount: number) => void;
  proposeNewLaw: (lawId: string) => void;
  negotiateLawWithPork: (lawId: string, porkAmount: number) => void;
  acceptLawAmendment: (lawId: string, amendmentId?: string) => void;
  vetoLawArticles: (lawId: string, vetoedArticleNumbers: number[], vetoedAmendmentIds: string[]) => void;
  vetoOrRejectLaw: (lawId: string) => void;
  nominateJustice: (candidate: SupremeJusticeCandidate) => void;
  resolveActiveEvent: (eventId: string, optionId: string) => void;
  dismissUrgentDilemma: () => void;
  proposeConstitutionalAmendment: (proposal: ConstitutionalAmendmentProposal) => void;
  voteConstitutionalAmendment: (proposalId: string) => void;
  dismissMinister: (ministerId: string) => void;
  appointMinister: (portfolioId: string, candidate: import('@/game/types').MinisterCandidate) => void;
  investigateMinister: (ministerId: string) => void;
  praiseMinister: (ministerId: string) => void;
  warnMinister: (ministerId: string) => void;
  applyRegionalInvestment: (regionId: string, investmentType: import('@/game/types').RegionalInvestmentType) => void;
  createStateEnterprise: (params: {
    name: string;
    acronym: string;
    sector: import('@/game/types').EnterpriseSector;
    objective: string;
    initialCapitalBi: number;
    stateStake: number;
    governance: import('@/game/types').GovernanceModel;
    headquartersRegionId: string;
  }) => void;
  adjustEnterpriseStateStake: (enterpriseId: string, newStake: number) => void;
  privatizeEnterprise: (enterpriseId: string, model: 'full_sale' | 'partial_sale' | 'ipo' | 'foreign_sale', stakeToSell: number) => void;
  concedeEnterpriseAsset: (enterpriseId: string, durationYears: number, upfrontGrantFeeBi: number) => void;
  nationalizeEnterprise: (enterpriseId: string, indemnityCostBi: number, reason: string) => void;
  createSectorSubsidy: (subsidy: Omit<import('@/game/types').SectorSubsidy, 'id' | 'active' | 'semestersRemaining'>) => void;
  cancelSectorSubsidy: (subsidyId: string) => void;
  createFiscalIncentive: (program: Omit<import('@/game/types').FiscalIncentiveProgram, 'id' | 'active' | 'companiesEnrolled' | 'totalPrivateInvestmentMobilized' | 'semestersRemaining' | 'foregoneRevenueBi'>) => void;
  cancelFiscalIncentive: (programId: string) => void;
  updateAgencyAutonomy: (agencyId: string, autonomy: import('@/game/types').RegulatoryAgency['autonomyLevel'], rigor: import('@/game/types').RegulatoryAgency['rigorLevel']) => void;
  negotiatePartyAlliance: (partyId: string, action: 'offer_pork' | 'pact' | 'break_alliance') => void;
  proposeCustomLaw: (newLaw: Law) => void;
  createCustomSocialProgram: (program: import('@/game/types').SocialProgram) => void;
  executePresidentialDossier: (dossierId: string, optionId: string) => void;
  clearActionFeedback: () => void;
  performCampaignAction: (payload: {
    type: 'rally' | 'debate' | 'crisis' | 'pledge';
    label: string;
    cost: number;
    playerPollDelta: number;
    rivalPollDelta: number;
    logMessage: string;
    pledgeText?: string;
  }) => void;
  conductElection: () => void;
  executeAgendaAction: (actionId: import('@/game/types').PresidentAgendaActionId) => void;
  respondToParliamentarianBargain: (lawId: string, bargainId: string, decision: 'accept' | 'refuse' | 'counter') => void;
  advanceSemesterTurn: () => Promise<void>;
  closeReportModal: () => void;
  negotiateWithGovernor: (stateId: string, offer: { porkBarrelsBi?: number; federalProject?: string }) => void;
  negotiateDiplomaticTreaty: (countryId: string, treatyName: string) => void;
  applyDiplomaticSanction: (countryId: string) => void;
  sendDiplomaticAid: (countryId: string, amountBi: number) => void;
  conductBilateralSummit: (countryId: string) => void;
  setActiveMapMode: (mode: 'national' | 'world') => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReport, setActiveReport] = useState<TurnReport | null>(null);
  const [savedGamesList, setSavedGamesList] = useState<SavedGameRecord[]>([]);

  const refreshSavedGames = useCallback(async () => {
    try {
      const saves = await listAllSaves();
      setSavedGamesList(saves);
    } catch (err) {
      console.warn('Erro ao carregar lista de saves:', err);
    }
  }, []);

  // Inicialização: tentar carregar último save ou deixar pronto para novo jogo
  useEffect(() => {
    async function init() {
      try {
        const saves = await listAllSaves();
        setSavedGamesList(saves);
        if (saves.length > 0) {
          // Mantém na tela de início/carregamento ou abre o primeiro
        }
      } catch (e) {
        console.error('Falha ao inicializar banco IndexedDB:', e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const startNewGame = useCallback((customPlayer?: Partial<Player>, selectedPartyId?: string) => {
    const newState = createInitialGameState(customPlayer, selectedPartyId);
    setState(newState);
  }, []);

  const loadGame = useCallback(async (saveId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const loaded = await loadGameFromDb(saveId);
      if (loaded) {
        setState(loaded);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Erro ao carregar partida:', err);
    } finally {
      setIsLoading(false);
    }
    return false;
  }, []);

  const saveGame = useCallback(async (name?: string): Promise<string | null> => {
    if (!state) return null;
    try {
      const saveId = await saveGameToDb(state, name);
      await refreshSavedGames();
      return saveId;
    } catch (err) {
      console.error('Erro ao salvar no banco:', err);
      return null;
    }
  }, [state, refreshSavedGames]);

  const setGamePhase = useCallback((phase: GameState['phase']) => {
    setState(prev => prev ? { ...prev, phase } : null);
  }, []);

  const updateTaxRate = useCallback((taxId: string, newRate: number) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        taxes: prev.taxes.map(t => t.id === taxId ? { ...t, rate: Math.max(0, Math.min(80, newRate)) } : t)
      };
    });
  }, []);

  const updateBudgetAmount = useCallback((categoryId: string, newAmount: number) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        budget: {
          ...prev.budget,
          categories: prev.budget.categories.map(c => 
            c.id === categoryId ? { ...c, amount: Math.max(0, Math.min(100, newAmount)) } : c
          )
        }
      };
    });
  }, []);

  const proposeNewLaw = useCallback((lawId: string) => {
    setState(prev => {
      if (!prev) return null;
      const targetLaw = prev.laws.find(l => l.id === lawId);
      if (!targetLaw) return prev;

      // Executa avaliação do plenário do Congresso com emendas e jabutis dinâmicos
      const evalResult = evaluateLawInCongress(targetLaw, prev.congress, prev.allParties, targetLaw.porkBargainOffered || 0);

      const updatedLaw: Law = {
        ...targetLaw,
        status: evalResult.status,
        turnProposed: prev.turn,
        congressSupport: evalResult.votesInFavor,
        congressAmendments: evalResult.proposedAmendments,
        directBargains: evalResult.directBargains,
        economicImpactSummary: `${targetLaw.economicImpactSummary} [Congresso: ${evalResult.analysisSummary}]`
      };

      return {
        ...prev,
        laws: prev.laws.map(l => l.id === lawId ? updatedLaw : l)
      };
    });
  }, []);

  const negotiateLawWithPork = useCallback((lawId: string, porkAmount: number) => {
    setState(prev => {
      if (!prev) return null;
      const targetLaw = prev.laws.find(l => l.id === lawId);
      if (!targetLaw) return prev;

      const evalResult = evaluateLawInCongress(
        targetLaw, 
        prev.congress, 
        prev.allParties, 
        (targetLaw.porkBargainOffered || 0) + porkAmount
      );

      const updatedLaw: Law = {
        ...targetLaw,
        status: evalResult.status,
        congressSupport: evalResult.votesInFavor,
        porkBargainOffered: (targetLaw.porkBargainOffered || 0) + porkAmount,
        negotiationHistory: [
          ...(targetLaw.negotiationHistory || []),
          `Liberação de R$ ${porkAmount} bi em emendas: elevou apoio para ${evalResult.votesInFavor} votos.`
        ],
        economicImpactSummary: `${targetLaw.economicImpactSummary} [Articulação Política: ${evalResult.analysisSummary}]`
      };

      const newPorkSpent = (prev.porkBudgetSpent || 0) + porkAmount;
      const newCorruption = Math.min(95, (prev.perceivedCorruption || 28) + Math.round(porkAmount * 2.5));

      return {
        ...prev,
        porkBudgetSpent: newPorkSpent,
        perceivedCorruption: newCorruption,
        budget: {
          ...prev.budget,
          nominalBalance: Math.round((prev.budget.nominalBalance - porkAmount) * 10) / 10
        },
        laws: prev.laws.map(l => l.id === lawId ? updatedLaw : l),
        news: [
          {
            id: `news_pork_${Date.now()}`,
            outletId: 'press_gazeta',
            headline: `Governo libera emendas orçamentárias para destravar "${targetLaw.title}"`,
            summary: `Palácio do Planalto empenha R$ ${porkAmount} bi para atrair votos do Centrão e aprovar a pauta no plenário.`,
            sentiment: 'neutral' as const,
            turn: prev.turn,
            relatedCategory: 'articulacao_politica'
          },
          ...prev.news
        ]
      };
    });
  }, []);

  const acceptLawAmendment = useCallback((lawId: string, amendmentId?: string) => {
    setState(prev => {
      if (!prev) return null;
      const targetLaw = prev.laws.find(l => l.id === lawId);
      if (!targetLaw) return prev;

      let finalCost = targetLaw.costPerYear;
      const approvedAmendments = targetLaw.congressAmendments.filter(a => a.status === 'approved_by_congress');
      
      // Aplicar modificadores de custo das emendas
      approvedAmendments.forEach(am => {
        if (am.budgetChangeModifier) {
          finalCost = finalCost * am.budgetChangeModifier;
        }
        if (am.porkCost) {
          finalCost += am.porkCost;
        }
      });

      finalCost = Math.round(finalCost * 10) / 10;

      const updatedLaw: Law = {
        ...targetLaw,
        status: 'enacted',
        turnEnacted: prev.turn,
        costPerYear: finalCost,
        amendmentAccepted: true
      };

      // Atualizar gastos do orçamento
      const newSpending = Math.round((prev.budget.totalSpending + finalCost) * 10) / 10;
      const newBalance = Math.round((prev.budget.totalRevenue - newSpending) * 10) / 10;
      const newPopularity = Math.min(95, Math.max(5, prev.player.popularity + targetLaw.popularityImpact));

      // Linha do tempo
      const currentYear = 2027 + Math.floor((prev.turn - 1) / 2);
      const isSecondSemester = prev.turn % 2 === 0;
      const baseMonths = isSecondSemester ? ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const monthYear = `${baseMonths[2]}/${currentYear}`;

      const timelineEntry: TimelineEntry = {
        id: `tl_law_${Date.now()}`,
        monthYear,
        title: `Promulgação: ${targetLaw.numberCode || 'PL'} — ${targetLaw.title}`,
        description: `Sancionada integralmente com o substitutivo e emendas aprovadas pelo Congresso. Custo anual fixado em R$ ${finalCost} bi.`,
        category: 'reform',
        type: 'positive'
      };

      const sanctionNews = {
        id: `news_sanction_${Date.now()}`,
        outletId: 'gazeta_nacional',
        headline: `PRESIDENTE SANCIONA: ${targetLaw.numberCode || 'PL'} "${targetLaw.title}" É PROMULGADO`,
        summary: `Acordo histórico entre o Planalto e o Congresso viabiliza a promulgação da lei com emendas pactuadas pelas bancadas.`,
        sentiment: 'positive' as const,
        turn: prev.turn,
        relatedCategory: 'leis'
      };

      return {
        ...prev,
        laws: prev.laws.map(l => l.id === lawId ? updatedLaw : l),
        budget: {
          ...prev.budget,
          totalSpending: newSpending,
          nominalBalance: newBalance
        },
        player: {
          ...prev.player,
          popularity: newPopularity
        },
        timeline: [timelineEntry, ...prev.timeline],
        news: [sanctionNews, ...prev.news],
        lastActionFeedback: {
          title: `Lei Sancionada: ${targetLaw.numberCode || 'PL'} - ${targetLaw.title}`,
          description: `O autógrafo da lei foi homologado no Diário Oficial com todas as emendas aprovadas pelo Congresso.`,
          deltas: [
            { label: 'Aprovação Popular', value: `+${targetLaw.popularityImpact}%`, isPositive: true },
            { label: 'Impacto Fiscal Anual', value: `${finalCost > 0 ? '-' : '+'}R$ ${Math.abs(finalCost)} bi`, isPositive: finalCost <= 0 },
            { label: 'Status da Matéria', value: 'Promulgada', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const vetoLawArticles = useCallback((lawId: string, vetoedArticleNumbers: number[], vetoedAmendmentIds: string[]) => {
    setState(prev => {
      if (!prev) return null;
      const targetLaw = prev.laws.find(l => l.id === lawId);
      if (!targetLaw) return prev;

      // Atualiza status das emendas vetadas
      const updatedAmendments = targetLaw.congressAmendments.map(am => {
        if (vetoedAmendmentIds.includes(am.id)) {
          return { ...am, status: 'vetoed_by_president' as const };
        }
        return am;
      });

      // Atualiza artigos vetados
      const updatedArticles = targetLaw.articles?.map(art => {
        if (vetoedArticleNumbers.includes(art.articleNumber)) {
          return { ...art, status: 'vetoed' as const };
        }
        return art;
      });

      // Recalcular custo sem as emendas vetadas
      let finalCost = targetLaw.costPerYear;
      const nonVetoedApproved = updatedAmendments.filter(a => a.status === 'approved_by_congress');
      nonVetoedApproved.forEach(am => {
        if (am.budgetChangeModifier) finalCost = finalCost * am.budgetChangeModifier;
        if (am.porkCost) finalCost += am.porkCost;
      });
      finalCost = Math.round(finalCost * 10) / 10;

      const updatedLaw: Law = {
        ...targetLaw,
        status: 'enacted',
        turnEnacted: prev.turn,
        costPerYear: finalCost,
        articles: updatedArticles,
        congressAmendments: updatedAmendments,
        vetoedArticles: vetoedArticleNumbers
      };

      const newSpending = Math.round((prev.budget.totalSpending + finalCost) * 10) / 10;
      const newBalance = Math.round((prev.budget.totalRevenue - newSpending) * 10) / 10;

      const currentYear = 2027 + Math.floor((prev.turn - 1) / 2);
      const isSecondSemester = prev.turn % 2 === 0;
      const baseMonths = isSecondSemester ? ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const monthYear = `${baseMonths[3]}/${currentYear}`;

      const timelineEntry: TimelineEntry = {
        id: `tl_veto_${Date.now()}`,
        monthYear,
        title: `Veto Parcial: ${targetLaw.numberCode || 'PL'} — ${targetLaw.title}`,
        description: `Presidente veta ${vetoedAmendmentIds.length + vetoedArticleNumbers.length} dispositivos/emendas corporativas. Texto restante promulgado e enviado ao Congresso para apreciação do veto.`,
        category: 'congress',
        type: 'warning'
      };

      const vetoNews = {
        id: `news_veto_${Date.now()}`,
        outletId: 'gazeta_nacional',
        headline: `VETO PARCIAL: PLANALTO BARRAS DISPOSITIVOS DE "${targetLaw.title}"`,
        summary: `Presidente publica mensagem de veto contra emendas e jabutis aprovados pelos deputados, preservando o equilíbrio fiscal. Congresso decidirá se mantém ou derruba os vetos.`,
        sentiment: 'neutral' as const,
        turn: prev.turn,
        relatedCategory: 'leis'
      };

      return {
        ...prev,
        laws: prev.laws.map(l => l.id === lawId ? updatedLaw : l),
        budget: {
          ...prev.budget,
          totalSpending: newSpending,
          nominalBalance: newBalance
        },
        timeline: [timelineEntry, ...prev.timeline],
        news: [vetoNews, ...prev.news],
        lastActionFeedback: {
          title: `Veto Parcial Aplicado: ${targetLaw.numberCode || 'PL'} - ${targetLaw.title}`,
          description: `Dispositivos e emendas corporativas foram vetados por contrariedade ao interesse público. O texto remanescente entrou em vigor.`,
          deltas: [
            { label: 'Dispositivos Vetados', value: `${vetoedAmendmentIds.length + vetoedArticleNumbers.length} itens`, isPositive: true },
            { label: 'Custo Reajustado', value: `R$ ${finalCost} bi/ano`, isPositive: true },
            { label: 'Apreciação do Congresso', value: 'Vetos Aguardando Sessão', isPositive: false }
          ]
        }
      };
    });
  }, []);

  const vetoOrRejectLaw = useCallback((lawId: string) => {
    setState(prev => {
      if (!prev) return null;
      const targetLaw = prev.laws.find(l => l.id === lawId);
      if (!targetLaw) return prev;

      const currentYear = 2027 + Math.floor((prev.turn - 1) / 2);
      const isSecondSemester = prev.turn % 2 === 0;
      const baseMonths = isSecondSemester ? ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const monthYear = `${baseMonths[4]}/${currentYear}`;

      const timelineEntry: TimelineEntry = {
        id: `tl_veto_total_${Date.now()}`,
        monthYear,
        title: `Veto Total Presidencial: ${targetLaw.numberCode || 'PL'} — ${targetLaw.title}`,
        description: `O Presidente rejeitou integralmente a matéria aprovada pelo Congresso por inconstitucionalidade e dano fiscal irreparável.`,
        category: 'congress',
        type: 'negative'
      };

      const vetoNews = {
        id: `news_veto_total_${Date.now()}`,
        outletId: 'gazeta_nacional',
        headline: `VETO TOTAL: PRESIDENTE REJEITA INTEGRALMENTE "${targetLaw.title}"`,
        summary: `Chefe do Executivo devolve autógrafo da lei com veto integral, confrontando a maioria parlamentar na Câmara dos Deputados.`,
        sentiment: 'negative' as const,
        turn: prev.turn,
        relatedCategory: 'leis'
      };

      return {
        ...prev,
        laws: prev.laws.map(l => l.id === lawId ? { ...l, status: 'vetoed' as const } : l),
        timeline: [timelineEntry, ...prev.timeline],
        news: [vetoNews, ...prev.news],
        lastActionFeedback: {
          title: `Veto Total Aplicado: ${targetLaw.numberCode || 'PL'} - ${targetLaw.title}`,
          description: `O projeto foi integralmente vetado e retirado de vigência. Mensagem presidencial enviada à Mesa do Congresso.`,
          deltas: [
            { label: 'Desfecho da Matéria', value: 'Vetada Totalmente', isPositive: false },
            { label: 'Risco Fiscal Evitado', value: `R$ ${targetLaw.costPerYear} bi/ano`, isPositive: true },
            { label: 'Tensão com a Bancada', value: '+15% atrito parlamentar', isPositive: false }
          ]
        }
      };
    });
  }, []);

  const nominateJustice = useCallback((candidate: SupremeJusticeCandidate) => {
    setState(prev => {
      if (!prev) return null;
      if (prev.supremeCourt.vacancies <= 0) return prev;

      // Sabatina e votação no Congresso Nacional
      const voteResult = voteCandidateConfirmation(candidate, prev.congress, prev.constitution);

      if (voteResult.approved) {
        // Novo ministro assume seat no STF
        const newJustice = {
          id: `stf_new_${Date.now()}`,
          name: candidate.name,
          age: candidate.age,
          ideology: candidate.ideology,
          independence: candidate.independence,
          experience: candidate.experience,
          integrity: candidate.integrity,
          reputation: candidate.reputation,
          appointedBy: `Presidente ${prev.player.name}`,
          appointmentDate: new Date().getFullYear().toString(),
          retirementDate: (new Date().getFullYear() + (prev.constitution.supremeCourtRetirementAge - candidate.age)).toString(),
          status: 'active' as const,
          legalPhilosophy: candidate.legalPhilosophy,
          bio: candidate.bio
        };

        const updatedPool = prev.supremeCourt.candidatePool.filter(c => c.id !== candidate.id);
        const updatedJustices = [...prev.supremeCourt.justices, newJustice];

        const newsConfirmation = {
          id: `news_stf_${Date.now()}`,
          outletId: 'press_diario',
          headline: `Congresso aprova ${candidate.name} para o Supremo Tribunal Federal`,
          summary: voteResult.message,
          sentiment: 'positive' as const,
          turn: prev.turn,
          relatedCategory: 'judiciario'
        };

        return {
          ...prev,
          supremeCourt: {
            ...prev.supremeCourt,
            vacancies: Math.max(0, prev.supremeCourt.vacancies - 1),
            justices: updatedJustices,
            candidatePool: updatedPool,
            activeNomination: {
              candidate,
              step: 'approved',
              congressVotesFor: voteResult.votesInFavor,
              congressVotesAgainst: voteResult.votesAgainst,
              requiredVotes: voteResult.requiredVotes,
              resultMessage: voteResult.message
            }
          },
          news: [newsConfirmation, ...prev.news]
        };
      } else {
        // Rejeitado pelo Congresso
        return {
          ...prev,
          supremeCourt: {
            ...prev.supremeCourt,
            activeNomination: {
              candidate,
              step: 'rejected',
              congressVotesFor: voteResult.votesInFavor,
              congressVotesAgainst: voteResult.votesAgainst,
              requiredVotes: voteResult.requiredVotes,
              resultMessage: voteResult.message
            }
          }
        };
      }
    });
  }, []);

  const resolveActiveEvent = useCallback((eventId: string, optionId: string) => {
    setState(prev => {
      if (!prev) return null;
      const event = prev.activeEvents.find(e => e.id === eventId);
      if (!event) return prev;
      const option = event.options.find(o => o.id === optionId);
      if (!option) return prev;

      const c = option.consequences;

      const updatedEconomy = {
        ...prev.economy,
        inflation: Math.max(1, prev.economy.inflation + (c.inflationChange || 0)),
        unemployment: Math.max(3, prev.economy.unemployment + (c.unemploymentChange || 0)),
        gdpGrowth: prev.economy.gdpGrowth + (c.gdpGrowthChange || 0),
        publicDebt: Math.max(10, prev.economy.publicDebt + (c.publicDebtChange || 0))
      };

      const updatedCongress = {
        ...prev.congress,
        presidentRelationship: Math.max(10, Math.min(100, prev.congress.presidentRelationship + (c.congressSupportChange || 0)))
      };

      const updatedPlayer = {
        ...prev.player,
        popularity: Math.max(5, Math.min(95, prev.player.popularity + (c.popularityChange || 0)))
      };

      // Atualizar Grupos Sociais se a decisão afetar setores
      let updatedSocialGroups = prev.socialGroups;
      if (c.socialGroupApprovalChanges) {
        updatedSocialGroups = prev.socialGroups.map(g => {
          const delta = c.socialGroupApprovalChanges![g.id];
          return delta !== undefined 
            ? { ...g, approval: Math.max(5, Math.min(95, g.approval + delta)) } 
            : g;
        });
      }

      const resolved = { ...event, resolved: true, chosenOptionId: optionId };

      return {
        ...prev,
        economy: updatedEconomy,
        congress: updatedCongress,
        player: updatedPlayer,
        socialGroups: updatedSocialGroups,
        urgentDilemma: prev.urgentDilemma?.id === eventId ? null : prev.urgentDilemma,
        activeEvents: prev.activeEvents.filter(e => e.id !== eventId),
        resolvedEvents: [...prev.resolvedEvents, resolved]
      };
    });
  }, []);

  const dismissUrgentDilemma = useCallback(() => {
    setState(prev => prev ? { ...prev, urgentDilemma: null } : null);
  }, []);

  const proposeConstitutionalAmendment = useCallback((proposal: ConstitutionalAmendmentProposal) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        activeConstitutionalProposals: [proposal, ...prev.activeConstitutionalProposals]
      };
    });
  }, []);

  const voteConstitutionalAmendment = useCallback((proposalId: string) => {
    setState(prev => {
      if (!prev) return null;
      const prop = prev.activeConstitutionalProposals.find(p => p.id === proposalId);
      if (!prop) return prev;

      // Requisito constitucional: 3/5 do Congresso (308 deputados)
      const baseSupport = prev.congress.coalitionSeats * 0.95 + (prev.congress.presidentRelationship > 60 ? 40 : 0);
      const votesInFavor = Math.min(513, Math.round(baseSupport + (prev.player.popularity > 50 ? 30 : -20)));
      const votesAgainst = 513 - votesInFavor;
      const required = prop.congressVotesNeeded || 308;

      const congressPassed = votesInFavor >= required;

      // Análise no Supremo Tribunal Federal
      let courtApproved = true;
      let rulingSummary = 'O Supremo Tribunal Federal julgou a emenda compatível com as cláusulas pétreas da Constituição.';
      if (congressPassed) {
        // Se a emenda for muito polêmica, o STF julga
        courtApproved = true;
      }

      const finalStage = congressPassed && courtApproved ? 'promulgated' : 'rejected';

      const updatedProposal: ConstitutionalAmendmentProposal = {
        ...prop,
        currentStage: finalStage,
        votesInFavor,
        votesAgainst,
        justicesRuling: {
          approved: courtApproved,
          favorableVotes: 8,
          contraryVotes: 3,
          rulingSummary
        }
      };

      return {
        ...prev,
        activeConstitutionalProposals: prev.activeConstitutionalProposals.map(p => p.id === proposalId ? updatedProposal : p)
      };
    });
  }, []);


  const dismissMinister = useCallback((ministerId: string) => {
    setState(prev => {
      if (!prev) return null;
      const target = prev.ministers.find(m => m.id === ministerId);
      if (!target) return prev;

      const updatedMinisters = prev.ministers.map(m => {
        if (m.id === ministerId) {
          return {
            ...m,
            name: 'Cargo Vago (Aguardando Nomeação)',
            status: 'vacant' as const,
            competence: 30,
            loyalty: 50,
            integrity: 80,
            popularity: 30,
            scandalRisk: 0,
            partyAffiliation: undefined
          };
        }
        return m;
      });

      let updatedParties = prev.congress.parties;
      if (target.partyAffiliation) {
        updatedParties = prev.congress.parties.map(p => {
          if (target.partyAffiliation?.includes(p.partyId.toUpperCase())) {
            const newRel = Math.max(10, (p.relationshipWithPresident || 50) - 25);
            return {
              ...p,
              relationshipWithPresident: newRel,
              stanceToPresident: newRel < 40 ? ('independent' as const) : p.stanceToPresident
            };
          }
          return p;
        });
      }

      const coalitionSeats = updatedParties.filter(p => p.stanceToPresident === 'coalition').reduce((s, p) => s + p.seats, 0);
      const oppositionSeats = updatedParties.filter(p => p.stanceToPresident === 'opposition').reduce((s, p) => s + p.seats, 0);
      const independentSeats = updatedParties.filter(p => p.stanceToPresident === 'independent').reduce((s, p) => s + p.seats, 0);

      const newsItem = {
        id: `news_demiss_${Date.now()}`,
        outletId: 'press_diario',
        headline: `Presidente exonera titular da pasta de ${target.portfolio}`,
        summary: `Palácio do Planalto confirma a saída de ${target.name}. Pasta estratégica fica vaga enquanto governo articula novo nome.`,
        sentiment: 'neutral' as const,
        turn: prev.turn,
        relatedCategory: 'gabinete'
      };

      return {
        ...prev,
        ministers: updatedMinisters,
        congress: {
          ...prev.congress,
          parties: updatedParties,
          coalitionSeats,
          oppositionSeats,
          independentSeats
        },
        news: [newsItem, ...prev.news]
      };
    });
  }, []);

  const appointMinister = useCallback((portfolioId: string, candidate: import('@/game/types').MinisterCandidate) => {
    setState(prev => {
      if (!prev) return null;

      const updatedMinisters = prev.ministers.map(m => {
        if (m.portfolioId === portfolioId) {
          return {
            ...m,
            name: candidate.name,
            age: candidate.age,
            competence: candidate.competence,
            loyalty: candidate.loyalty,
            integrity: candidate.integrity,
            popularity: candidate.popularity,
            experience: candidate.experience,
            ideologyLean: candidate.ideologyLean,
            partyAffiliation: candidate.partyAffiliation,
            scandalRisk: Math.max(5, 100 - candidate.integrity),
            effectsSummary: candidate.effectsSummary,
            status: 'appointed' as const
          };
        }
        return m;
      });

      let updatedParties = prev.congress.parties;
      const matchedParty = prev.allParties.find(p => candidate.partyAffiliation.toUpperCase().includes(p.acronym.toUpperCase()) || candidate.partyAffiliation.toUpperCase().includes(p.id.toUpperCase()));

      if (matchedParty) {
        updatedParties = prev.congress.parties.map(p => {
          if (p.partyId === matchedParty.id) {
            const newRel = Math.min(100, (p.relationshipWithPresident || 50) + 30);
            return {
              ...p,
              relationshipWithPresident: newRel,
              stanceToPresident: 'coalition' as const,
              assignedMinistries: [...(p.assignedMinistries || []), portfolioId]
            };
          }
          return p;
        });
      }

      const coalitionSeats = updatedParties.filter(p => p.stanceToPresident === 'coalition').reduce((s, p) => s + p.seats, 0);
      const oppositionSeats = updatedParties.filter(p => p.stanceToPresident === 'opposition').reduce((s, p) => s + p.seats, 0);
      const independentSeats = updatedParties.filter(p => p.stanceToPresident === 'independent').reduce((s, p) => s + p.seats, 0);

      const targetPortfolioName = prev.ministers.find(m => m.portfolioId === portfolioId)?.portfolio || portfolioId;

      const newsItem = {
        id: `news_appoint_${Date.now()}`,
        outletId: 'press_gazeta',
        headline: `Novo Ministro da Fazenda/Governo: ${candidate.name} assume ${targetPortfolioName}`,
        summary: `Nomeação fortalece sustentação política do Executivo e traz perfil ${candidate.ideologyLean} para a gestão federal.`,
        sentiment: 'positive' as const,
        turn: prev.turn,
        relatedCategory: 'gabinete'
      };

      return {
        ...prev,
        ministers: updatedMinisters,
        congress: {
          ...prev.congress,
          parties: updatedParties,
          coalitionSeats,
          oppositionSeats,
          independentSeats
        },
        news: [newsItem, ...prev.news]
      };
    });
  }, []);

  const investigateMinister = useCallback((ministerId: string) => {
    setState(prev => {
      if (!prev) return null;
      const target = prev.ministers.find(m => m.id === ministerId);
      if (!target) return prev;

      return {
        ...prev,
        ministers: prev.ministers.map(m => m.id === ministerId ? {
          ...m,
          scandalRisk: Math.max(5, (m.scandalRisk || 20) - 25),
          loyalty: Math.max(30, m.loyalty - 10)
        } : m),
        news: [
          {
            id: `news_pf_${Date.now()}`,
            outletId: 'press_diario',
            headline: `Polícia Federal abre auditoria interna em contratos do Ministério de ${target.portfolio}`,
            summary: `Investigação preventiva mira supostas irregularidades em licitações e desarticula riscos de escândalo.`,
            sentiment: 'neutral' as const,
            turn: prev.turn,
            relatedCategory: 'investigacao'
          },
          ...prev.news
        ]
      };
    });
  }, []);

  const praiseMinister = useCallback((ministerId: string) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ministers: prev.ministers.map(m => m.id === ministerId ? {
          ...m,
          loyalty: Math.min(100, m.loyalty + 12),
          popularity: Math.min(100, m.popularity + 6)
        } : m)
      };
    });
  }, []);

  const warnMinister = useCallback((ministerId: string) => {
    setState(prev => {
      if (!prev) return null;
      const target = prev.ministers.find(m => m.id === ministerId);
      if (!target) return prev;

      return {
        ...prev,
        ministers: prev.ministers.map(m => m.id === ministerId ? {
          ...m,
          scandalRisk: Math.max(5, (m.scandalRisk || 20) - 15),
          loyalty: Math.max(20, m.loyalty - 6),
          integrity: Math.min(100, m.integrity + 3)
        } : m),
        lastActionFeedback: {
          title: `Advertência Reservada: Ministério de ${target.portfolio}`,
          description: `O Presidente da República cobrou rigor ético e metas do Ministro ${target.name}. O risco de escândalos foi reduzido.`,
          deltas: [
            { label: 'Risco de Escândalo', value: '-15%', isPositive: true },
            { label: 'Cobrança Institucional', value: '+Rigor', isPositive: true },
            { label: 'Lealdade Pessoal', value: '-6%', isPositive: false }
          ]
        }
      };
    });
  }, []);

  const applyRegionalInvestment = useCallback((regionId: string, investmentType: import('@/game/types').RegionalInvestmentType) => {
    setState(prev => {
      if (!prev) return null;
      const targetRegion = (prev.regions || []).find(r => r.id === regionId);
      if (!targetRegion) return prev;

      const configs = {
        highways: {
          name: 'Construção de Corredor Rodoviário e Ferroviário',
          cost: 1.8,
          cpCost: 3,
          infraDelta: 12,
          unempDelta: -0.6,
          approvalDelta: 6,
          gdpGrowthDelta: 0.15,
          desc: 'Modernização de rodovias e linhas férreas reduz o custo logístico de escoamento e gera empregos imediatos na construção civil.'
        },
        industry_incentive: {
          name: 'Polo de Incentivo Fiscal e Industrial',
          cost: 2.2,
          cpCost: 4,
          infraDelta: 8,
          unempDelta: -0.8,
          approvalDelta: 7,
          gdpGrowthDelta: 0.25,
          desc: 'Regime aduaneiro especial e créditos tributários atraem montadoras e indústrias de ponta para a região.'
        },
        hospital: {
          name: 'Complexo Hospitalar Regional e Rede de UPAs',
          cost: 1.5,
          cpCost: 2,
          infraDelta: 4,
          unempDelta: -0.2,
          approvalDelta: 9,
          gdpGrowthDelta: 0.05,
          desc: 'Ampliação de leitos de UTI, centros de diagnóstico e atendimento de urgência reduzem filas e mortalidade.'
        },
        housing: {
          name: 'Programa Habitacional & Saneamento Básico',
          cost: 2.0,
          cpCost: 3,
          infraDelta: 10,
          unempDelta: -0.5,
          approvalDelta: 8,
          gdpGrowthDelta: 0.1,
          desc: 'Urbanização de periferias, água tratada, esgotamento sanitário e entrega de casas populares com subsídio federal.'
        },
        education: {
          name: 'Campus Universitário e Centro Tecnológico',
          cost: 1.2,
          cpCost: 2,
          infraDelta: 6,
          unempDelta: -0.3,
          approvalDelta: 6,
          gdpGrowthDelta: 0.12,
          desc: 'Formação técnica profissionalizante e pesquisa aplicada aumentam a produtividade média do trabalho.'
        },
        security: {
          name: 'Força Nacional e Integração de Inteligência',
          cost: 0.8,
          cpCost: 2,
          infraDelta: 2,
          unempDelta: 0,
          approvalDelta: 8,
          gdpGrowthDelta: 0.02,
          desc: 'Operações táticas integradas, blitzes contra o crime organizado e policiamento ostensivo reduzem a criminalidade.'
        }
      };

      const cfg = configs[investmentType];
      if (!cfg) return prev;

      const updatedRegions = (prev.regions || []).map(r => {
        if (r.id === regionId) {
          return {
            ...r,
            infrastructure: Math.min(100, r.infrastructure + cfg.infraDelta),
            unemployment: Math.max(3, Math.round((r.unemployment + cfg.unempDelta) * 10) / 10),
            governmentApproval: Math.min(98, r.governmentApproval + cfg.approvalDelta),
            crimeRate: investmentType === 'security' ? Math.max(10, r.crimeRate - 16) : r.crimeRate,
            healthIndex: investmentType === 'hospital' ? Math.min(100, r.healthIndex + 14) : r.healthIndex,
            educationIndex: investmentType === 'education' ? Math.min(100, r.educationIndex + 12) : r.educationIndex,
            recentInvestments: [cfg.name, ...(r.recentInvestments || []).slice(0, 3)]
          };
        }
        return r;
      });

      const updatedBudget = {
        ...prev.budget,
        totalSpending: Math.round((prev.budget.totalSpending + cfg.cost) * 10) / 10,
        nominalBalance: Math.round((prev.budget.nominalBalance - cfg.cost) * 10) / 10
      };

      const updatedEconomy = {
        ...prev.economy,
        gdpGrowth: Math.round((prev.economy.gdpGrowth + cfg.gdpGrowthDelta) * 100) / 100,
        unemployment: Math.max(3, Math.round((prev.economy.unemployment + cfg.unempDelta * 0.2) * 10) / 10)
      };

      const newsItem = {
        id: `news_reg_${Date.now()}`,
        outletId: 'press_diario',
        headline: `Planalto destina R$ ${cfg.cost} bi para ${cfg.name} em ${targetRegion.name}`,
        summary: cfg.desc,
        sentiment: 'positive' as const,
        turn: prev.turn,
        relatedCategory: 'desenvolvimento_regional'
      };

      return {
        ...prev,
        regions: updatedRegions,
        budget: updatedBudget,
        economy: updatedEconomy,
        politicalCapital: Math.max(5, (prev.politicalCapital || 50) - cfg.cpCost),
        player: {
          ...prev.player,
          popularity: Math.min(95, prev.player.popularity + Math.round(cfg.approvalDelta * 0.35))
        },
        news: [newsItem, ...prev.news],
        lastActionFeedback: {
          title: `Investimento Regional: ${cfg.name}`,
          description: `Aporte de R$ ${cfg.cost} bilhões direcionado para ${targetRegion.name}.`,
          deltas: [
            { label: 'Custo Orçamentário', value: `-R$ ${cfg.cost} bi`, isPositive: false },
            { label: 'Aprovação Regional', value: `+${cfg.approvalDelta}%`, isPositive: true },
            { label: 'Infraestrutura Local', value: `+${cfg.infraDelta} pts`, isPositive: true }
          ]
        }
      };
    });
  }, []);

  const createStateEnterprise = useCallback((params: {
    name: string;
    acronym: string;
    sector: import('@/game/types').EnterpriseSector;
    objective: string;
    initialCapitalBi: number;
    stateStake: number;
    governance: import('@/game/types').GovernanceModel;
    headquartersRegionId: string;
  }) => {
    setState(prev => {
      if (!prev) return null;
      const cost = Math.max(1.0, params.initialCapitalBi);
      const isStateOwned = params.stateStake === 100;
      const isMixed = params.stateStake > 0 && params.stateStake < 100;

      const newEnterprise: import('@/game/types').Enterprise = {
        id: `ent_${Date.now()}`,
        name: params.name,
        acronym: params.acronym || params.name.substring(0, 8),
        sector: params.sector,
        stateStake: params.stateStake,
        ownership: isStateOwned ? 'state_owned' : isMixed ? 'mixed' : 'private_regulated',
        governance: params.governance,
        employees: Math.round(cost * 1800),
        annualRevenue: Math.round(cost * 1.4 * 10) / 10,
        annualProfit: Math.round(cost * (params.governance === 'commercial' ? 0.12 : 0.04) * 10) / 10,
        productivity: 78,
        efficiency: params.governance === 'commercial' ? 82 : 72,
        debt: Math.round(cost * 0.4 * 10) / 10,
        marketShare: Math.min(60, Math.round(cost * 2.5)),
        exportShare: params.sector === 'oil_gas' || params.sector === 'mining' || params.sector === 'agriculture' ? 40 : 10,
        politicalInfluence: 60,
        reputation: 80,
        strategicImportance: isStateOwned ? 90 : 75,
        valuationBi: Math.round(cost * 2.2 * 10) / 10,
        dividendYield: params.governance === 'commercial' ? 35 : 15,
        dividendsPaidToTreasury: 0,
        complianceScore: 85,
        headquartersRegionId: params.headquartersRegionId || 'reg_centro',
        recentEvent: `Fundação oficial autorizada por decreto presidencial com capital de R$ ${cost} bi.`
      };

      const updatedBudget = {
        ...prev.budget,
        totalSpending: Math.round((prev.budget.totalSpending + cost) * 10) / 10,
        nominalBalance: Math.round((prev.budget.nominalBalance - cost) * 10) / 10
      };

      const updatedEconomy = {
        ...prev.economy,
        publicInvestmentRate: Math.round((prev.economy.publicInvestmentRate + 0.4) * 10) / 10,
        investmentRate: Math.round((prev.economy.investmentRate + 0.4) * 10) / 10
      };

      const newsItem = {
        id: `news_ent_${Date.now()}`,
        outletId: 'press_gazeta',
        headline: `Governo funda a ${params.name} com aporte de R$ ${cost} bi`,
        summary: `Empresa terá atuação no setor de ${params.sector} com meta de assegurar capacidade estratégica nacional.`,
        sentiment: 'positive' as const,
        turn: prev.turn,
        relatedCategory: 'empresas_estatais'
      };

      return {
        ...prev,
        enterprises: [newEnterprise, ...(prev.enterprises || [])],
        budget: updatedBudget,
        economy: updatedEconomy,
        politicalCapital: Math.max(5, prev.politicalCapital - 4),
        news: [newsItem, ...prev.news],
        lastActionFeedback: {
          title: `Criação de Estatal: ${params.name}`,
          description: `Empresa estatal fundada no setor de ${params.sector} com ${params.stateStake}% de participação da União.`,
          deltas: [
            { label: 'Aporte de Capital', value: `-R$ ${cost} bi`, isPositive: false },
            { label: 'Participação Estatal', value: `${params.stateStake}%`, isPositive: true },
            { label: 'Investimento Público', value: '+0.4% PIB', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const adjustEnterpriseStateStake = useCallback((enterpriseId: string, newStake: number) => {
    setState(prev => {
      if (!prev) return null;
      const target = (prev.enterprises || []).find(e => e.id === enterpriseId);
      if (!target) return prev;

      const deltaStake = newStake - target.stateStake;
      const capitalImpactBi = Math.round((target.valuationBi * (Math.abs(deltaStake) / 100)) * 10) / 10;

      let updatedDebt = prev.economy.publicDebt;
      let balanceDelta = 0;

      if (deltaStake > 0) {
        // Estado aporta dinheiro comprando ações
        balanceDelta = -capitalImpactBi;
      } else {
        // Estado vende ações e arrecada dinheiro
        balanceDelta = capitalImpactBi;
        updatedDebt = Math.max(20, Math.round((prev.economy.publicDebt - (capitalImpactBi / prev.economy.gdp) * 100) * 10) / 10);
      }

      const updatedOwnership = newStake >= 90 ? 'state_owned' : newStake > 0 ? 'mixed' : 'private_regulated';

      return {
        ...prev,
        enterprises: (prev.enterprises || []).map(e => e.id === enterpriseId ? {
          ...e,
          stateStake: newStake,
          ownership: updatedOwnership,
          recentEvent: `Participação da União ajustada de ${target.stateStake}% para ${newStake}%.`
        } : e),
        economy: {
          ...prev.economy,
          publicDebt: updatedDebt
        },
        budget: {
          ...prev.budget,
          nominalBalance: Math.round((prev.budget.nominalBalance + balanceDelta) * 10) / 10
        },
        lastActionFeedback: {
          title: `Ajuste Acionário: ${target.name}`,
          description: deltaStake > 0 
            ? `União adquiriu fatia adicional de ${deltaStake}% na empresa por R$ ${capitalImpactBi} bi.`
            : `União alienou fatia de ${Math.abs(deltaStake)}% na empresa, arrecadando R$ ${capitalImpactBi} bi para amortização da dívida pública.`,
          deltas: [
            { label: 'Nova Participação', value: `${newStake}%`, isPositive: true },
            { label: deltaStake > 0 ? 'Custo de Aquisição' : 'Caixa Arrecadado', value: `${deltaStake > 0 ? '-' : '+'}R$ ${capitalImpactBi} bi`, isPositive: deltaStake <= 0 },
            { label: 'Dívida Pública', value: `${updatedDebt}% PIB`, isPositive: deltaStake <= 0 }
          ]
        }
      };
    });
  }, []);

  const privatizeEnterprise = useCallback((enterpriseId: string, model: 'full_sale' | 'partial_sale' | 'ipo' | 'foreign_sale', stakeToSell: number) => {
    setState(prev => {
      if (!prev) return null;
      const target = (prev.enterprises || []).find(e => e.id === enterpriseId);
      if (!target) return prev;

      const premium = model === 'foreign_sale' ? 1.15 : model === 'ipo' ? 1.08 : 1.0;
      const cashInflow = Math.round((target.valuationBi * (stakeToSell / 100) * premium) * 10) / 10;
      const newStake = Math.max(0, target.stateStake - stakeToSell);
      const newOwnership = newStake === 0 ? 'private_regulated' : 'mixed';

      // Reduz a dívida pública em valor equivalente ao caixa arrecadado
      const debtReductionPercent = Math.round((cashInflow / prev.economy.gdp) * 100 * 10) / 10;
      const newDebt = Math.max(15, Math.round((prev.economy.publicDebt - debtReductionPercent) * 10) / 10);

      const newsItem = {
        id: `news_priv_${Date.now()}`,
        outletId: 'press_gazeta',
        headline: `Privatização de ${target.name}: Tesouro arrecada R$ ${cashInflow} bi`,
        summary: `Leilão homologado com venda de ${stakeToSell}% das ações da companhia via modelo ${model}.`,
        sentiment: 'positive' as const,
        turn: prev.turn,
        relatedCategory: 'privatizacao'
      };

      return {
        ...prev,
        enterprises: (prev.enterprises || []).map(e => e.id === enterpriseId ? {
          ...e,
          stateStake: newStake,
          ownership: newOwnership,
          efficiency: Math.min(95, e.efficiency + 8),
          productivity: Math.min(95, e.productivity + 6),
          recentEvent: `Privatização de ${stakeToSell}% das ações concluída por R$ ${cashInflow} bi.`
        } : e),
        economy: {
          ...prev.economy,
          publicDebt: newDebt,
          businessConfidence: Math.min(95, prev.economy.businessConfidence + 6),
          privateInvestmentRate: Math.round((prev.economy.privateInvestmentRate + 0.6) * 10) / 10
        },
        player: {
          ...prev.player,
          popularity: Math.max(10, prev.player.popularity - 3) // Reação mista da opinião pública
        },
        news: [newsItem, ...prev.news],
        lastActionFeedback: {
          title: `Privatização Concluída: ${target.name}`,
          description: `Venda de ${stakeToSell}% das ações gerou receita extraordinária de R$ ${cashInflow} bi para o Tesouro Nacional.`,
          deltas: [
            { label: 'Entrada de Caixa', value: `+R$ ${cashInflow} bi`, isPositive: true },
            { label: 'Queda na Dívida Pública', value: `-${debtReductionPercent}% PIB`, isPositive: true },
            { label: 'Confiança Empresarial', value: '+6 pts', isPositive: true },
            { label: 'Participação Estatal Remanescente', value: `${newStake}%`, isPositive: newStake > 0 }
          ]
        }
      };
    });
  }, []);

  const concedeEnterpriseAsset = useCallback((enterpriseId: string, durationYears: number, upfrontGrantFeeBi: number) => {
    setState(prev => {
      if (!prev) return null;
      const target = (prev.enterprises || []).find(e => e.id === enterpriseId);
      if (!target) return prev;

      const fee = Math.max(0.5, upfrontGrantFeeBi);
      const newDebt = Math.max(15, Math.round((prev.economy.publicDebt - (fee / prev.economy.gdp) * 100) * 10) / 10);

      return {
        ...prev,
        enterprises: (prev.enterprises || []).map(e => e.id === enterpriseId ? {
          ...e,
          isConcession: true,
          concessionDurationYears: durationYears,
          concessionExpiresTurn: prev.turn + Math.round(durationYears * 2),
          efficiency: Math.min(92, e.efficiency + 10),
          recentEvent: `Contrato de concessão operacional de ${durationYears} anos assinado. Outorga paga ao Tesouro: R$ ${fee} bi.`
        } : e),
        economy: {
          ...prev.economy,
          publicDebt: newDebt,
          privateInvestmentRate: Math.round((prev.economy.privateInvestmentRate + 0.5) * 10) / 10
        },
        budget: {
          ...prev.budget,
          totalRevenue: Math.round((prev.budget.totalRevenue + fee) * 10) / 10,
          nominalBalance: Math.round((prev.budget.nominalBalance + fee) * 10) / 10
        },
        lastActionFeedback: {
          title: `Concessão de Ativo: ${target.name}`,
          description: `Ativo concedido à iniciativa privada por ${durationYears} anos. O Estado mantém a propriedade jurídica do bem e arrecadou R$ ${fee} bi em outorga.`,
          deltas: [
            { label: 'Outorga Arrecadada', value: `+R$ ${fee} bi`, isPositive: true },
            { label: 'Prazo da Concessão', value: `${durationYears} anos`, isPositive: true },
            { label: 'Propriedade do Ativo', value: '100% da União', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const nationalizeEnterprise = useCallback((enterpriseId: string, indemnityCostBi: number, reason: string) => {
    setState(prev => {
      if (!prev) return null;
      const target = (prev.enterprises || []).find(e => e.id === enterpriseId);
      if (!target) return prev;

      const cost = Math.max(1.0, indemnityCostBi);
      const newDebt = Math.round((prev.economy.publicDebt + (cost / prev.economy.gdp) * 100) * 10) / 10;

      const newsItem = {
        id: `news_nat_${Date.now()}`,
        outletId: 'press_trabalhador',
        headline: `Soberania Nacional: Governo estatiza a ${target.name}`,
        summary: `Motivo invocado pelo Executivo: "${reason}". Indenização de R$ ${cost} bi arbitrada pelo Estado.`,
        sentiment: 'positive' as const,
        turn: prev.turn,
        relatedCategory: 'estatizacao'
      };

      return {
        ...prev,
        enterprises: (prev.enterprises || []).map(e => e.id === enterpriseId ? {
          ...e,
          stateStake: 100,
          ownership: 'state_owned',
          governance: 'strategic_public',
          strategicImportance: Math.min(100, e.strategicImportance + 15),
          recentEvent: `Estatização homologada por decreto: ${reason}. Indenização paga aos investidores: R$ ${cost} bi.`
        } : e),
        economy: {
          ...prev.economy,
          publicDebt: newDebt,
          businessConfidence: Math.max(20, prev.economy.businessConfidence - 12) // Queda de confiança do mercado
        },
        player: {
          ...prev.player,
          popularity: Math.min(95, prev.player.popularity + 4) // Ganho popular com setores nacionalistas
        },
        news: [newsItem, ...prev.news],
        lastActionFeedback: {
          title: `Estatização Decretada: ${target.name}`,
          description: `Empresa nacionalizada e integrada ao controle 100% da União por motivo de: ${reason}.`,
          deltas: [
            { label: 'Indenização Paga', value: `-R$ ${cost} bi`, isPositive: false },
            { label: 'Controle Estatal', value: '100% União', isPositive: true },
            { label: 'Confiança Empresarial', value: '-12 pts', isPositive: false },
            { label: 'Soberania Estratégica', value: '+15 pts', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const createSectorSubsidy = useCallback((subsidy: Omit<import('@/game/types').SectorSubsidy, 'id' | 'active' | 'semestersRemaining'>) => {
    setState(prev => {
      if (!prev) return null;
      const newSubsidy: import('@/game/types').SectorSubsidy = {
        ...subsidy,
        id: `sub_${Date.now()}`,
        active: true,
        semestersRemaining: subsidy.durationSemesters
      };

      return {
        ...prev,
        sectorSubsidies: [newSubsidy, ...(prev.sectorSubsidies || [])],
        lastActionFeedback: {
          title: `Subsídio Setorial Concedido: ${subsidy.name}`,
          description: `Aporte semestral de R$ ${subsidy.budgetBi} bi destinado ao setor de ${subsidy.sector} para proteger empregos e conter tarifas.`,
          deltas: [
            { label: 'Custo por Semestre', value: `-R$ ${subsidy.budgetBi} bi`, isPositive: false },
            { label: 'Duração', value: `${subsidy.durationSemesters} semestres`, isPositive: true },
            { label: 'Alívio Tarifário', value: `-${subsidy.priceReductionPercent}%`, isPositive: true }
          ]
        }
      };
    });
  }, []);

  const cancelSectorSubsidy = useCallback((subsidyId: string) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        sectorSubsidies: (prev.sectorSubsidies || []).map(s => s.id === subsidyId ? { ...s, active: false } : s),
        lastActionFeedback: {
          title: 'Subsídio Setorial Revogado',
          description: 'O programa de subsídio foi cancelado. As despesas públicas foram aliviadas de imediato.',
          deltas: [
            { label: 'Economia Orçamentária', value: 'Ativada', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const createFiscalIncentive = useCallback((program: Omit<import('@/game/types').FiscalIncentiveProgram, 'id' | 'active' | 'companiesEnrolled' | 'totalPrivateInvestmentMobilized' | 'semestersRemaining' | 'foregoneRevenueBi'>) => {
    setState(prev => {
      if (!prev) return null;
      const foregone = Math.round(program.minInvestmentBi * 0.18 * (program.taxDiscountPercent / 100) * 10) / 10;
      const newProgram: import('@/game/types').FiscalIncentiveProgram = {
        ...program,
        id: `inc_${Date.now()}`,
        active: true,
        companiesEnrolled: 3,
        totalPrivateInvestmentMobilized: Math.round(program.minInvestmentBi * 3.4 * 10) / 10,
        semestersRemaining: program.durationSemesters,
        foregoneRevenueBi: foregone
      };

      return {
        ...prev,
        fiscalIncentives: [newProgram, ...(prev.fiscalIncentives || [])],
        lastActionFeedback: {
          title: `Programa de Incentivo Fiscal: ${program.name}`,
          description: `Desconto de ${program.taxDiscountPercent}% no imposto corporativo para investimentos acima de R$ ${program.minInvestmentBi} bi com exigência de ${program.requiredJobs} empregos.`,
          deltas: [
            { label: 'Investimento Estimulado', value: `+R$ ${newProgram.totalPrivateInvestmentMobilized} bi`, isPositive: true },
            { label: 'Empregos Exigidos', value: `+${program.requiredJobs}`, isPositive: true },
            { label: 'Renúncia Tributária', value: `-R$ ${foregone} bi/sem`, isPositive: false }
          ]
        }
      };
    });
  }, []);

  const cancelFiscalIncentive = useCallback((programId: string) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        fiscalIncentives: (prev.fiscalIncentives || []).map(inc => inc.id === programId ? { ...inc, active: false } : inc),
        lastActionFeedback: {
          title: 'Programa de Incentivo Fiscal Cancelado',
          description: 'O regime de desoneração foi descontinuado. A arrecadação corporativa retornará ao patamar padrão.',
          deltas: [
            { label: 'Renúncia Fiscal', value: 'Encerrada', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const updateAgencyAutonomy = useCallback((agencyId: string, autonomy: import('@/game/types').RegulatoryAgency['autonomyLevel'], rigor: import('@/game/types').RegulatoryAgency['rigorLevel']) => {
    setState(prev => {
      if (!prev) return null;
      const target = (prev.regulatoryAgencies || []).find(a => a.id === agencyId);
      if (!target) return prev;

      let confidenceDelta = 0;
      if (autonomy === 'independent') confidenceDelta = 8;
      else if (autonomy === 'presidential_control') confidenceDelta = -10;

      return {
        ...prev,
        regulatoryAgencies: (prev.regulatoryAgencies || []).map(a => a.id === agencyId ? {
          ...a,
          autonomyLevel: autonomy,
          rigorLevel: rigor,
          marketConfidence: Math.max(30, Math.min(98, a.marketConfidence + confidenceDelta))
        } : a),
        economy: {
          ...prev.economy,
          businessConfidence: Math.max(25, Math.min(95, prev.economy.businessConfidence + (confidenceDelta > 0 ? 3 : -4)))
        },
        lastActionFeedback: {
          title: `Regulação Setorial: ${target.acronym}`,
          description: `Modelo regulatório da agência alterado para "${autonomy === 'independent' ? 'Autonomia Técnica Total' : autonomy === 'shared' ? 'Gestão Compartilhada' : 'Controle Direto do Executivo'}".`,
          deltas: [
            { label: 'Confiança do Mercado', value: `${confidenceDelta >= 0 ? '+' : ''}${confidenceDelta} pts`, isPositive: confidenceDelta >= 0 },
            { label: 'Rigor Normativo', value: rigor.toUpperCase(), isPositive: true }
          ]
        }
      };
    });
  }, []);

  const negotiatePartyAlliance = useCallback((partyId: string, action: 'offer_pork' | 'pact' | 'break_alliance') => {
    setState(prev => {
      if (!prev) return null;

      let porkCost = 0;
      let corruptionDelta = 0;
      let relDelta = 0;

      if (action === 'offer_pork') {
        porkCost = 2.0;
        corruptionDelta = 4;
        relDelta = 25;
      } else if (action === 'pact') {
        relDelta = 15;
      } else if (action === 'break_alliance') {
        relDelta = -40;
      }

      const updatedParties = prev.congress.parties.map(p => {
        if (p.partyId === partyId) {
          const newRel = Math.max(0, Math.min(100, (p.relationshipWithPresident || 50) + relDelta));
          const finalStance = action === 'break_alliance' ? ('opposition' as const) : newRel >= 55 ? ('coalition' as const) : newRel <= 35 ? ('opposition' as const) : ('independent' as const);
          return {
            ...p,
            relationshipWithPresident: newRel,
            stanceToPresident: finalStance,
            porkReceived: (p.porkReceived || 0) + porkCost,
            hasSignedPact: action === 'pact' ? true : p.hasSignedPact
          };
        }
        return p;
      });

      const coalitionSeats = updatedParties.filter(p => p.stanceToPresident === 'coalition').reduce((s, p) => s + p.seats, 0);
      const oppositionSeats = updatedParties.filter(p => p.stanceToPresident === 'opposition').reduce((s, p) => s + p.seats, 0);
      const independentSeats = updatedParties.filter(p => p.stanceToPresident === 'independent').reduce((s, p) => s + p.seats, 0);

      const partyObj = prev.allParties.find(ap => ap.id === partyId);

      return {
        ...prev,
        porkBudgetSpent: (prev.porkBudgetSpent || 0) + porkCost,
        perceivedCorruption: Math.min(100, (prev.perceivedCorruption || 28) + corruptionDelta),
        budget: {
          ...prev.budget,
          nominalBalance: Math.round((prev.budget.nominalBalance - porkCost) * 10) / 10
        },
        congress: {
          ...prev.congress,
          parties: updatedParties,
          coalitionSeats,
          oppositionSeats,
          independentSeats
        },
        news: [
          {
            id: `news_coalition_${Date.now()}`,
            outletId: 'press_gazeta',
            headline: action === 'offer_pork' 
              ? `Planalto fecha acordo com bancada do ${partyObj?.acronym || partyId} com liberação de emendas`
              : action === 'pact'
              ? `Pacto de Governabilidade: ${partyObj?.acronym || partyId} assina termo de cooperação legislativa`
              : `Ruptura política: Planalto rompe aliança com ${partyObj?.acronym || partyId} que passa para a oposição`,
            summary: `Articulação altera a correlação de forças na Câmara dos Deputados. Base do governo agora soma ${coalitionSeats} parlamentares.`,
            sentiment: action === 'break_alliance' ? ('negative' as const) : ('positive' as const),
            turn: prev.turn,
            relatedCategory: 'articulacao_politica'
          },
          ...prev.news
        ]
      };
    });
  }, []);

  const proposeCustomLaw = useCallback((newLaw: Law) => {
    setState(prev => {
      if (!prev) return null;
      const evalResult = evaluateLawInCongress(newLaw, prev.congress, prev.allParties, 0);

      const evaluated: Law = {
        ...newLaw,
        status: evalResult.status,
        turnProposed: prev.turn,
        congressSupport: evalResult.votesInFavor,
        congressAmendments: evalResult.proposedAmendments,
        directBargains: evalResult.directBargains,
        economicImpactSummary: `${newLaw.economicImpactSummary} [Congresso: ${evalResult.analysisSummary}]`
      };

      return {
        ...prev,
        laws: [evaluated, ...prev.laws]
      };
    });
  }, []);

  const executeAgendaAction = useCallback((actionId: import('@/game/types').PresidentAgendaActionId) => {
    setState(prev => {
      if (!prev) return null;
      if (prev.agenda.remainingActionPoints <= 0) return prev;

      let logMsg = '';
      let feedbackTitle = '';
      let feedbackDesc = '';
      let feedbackDeltas: { label: string; value: string; isPositive: boolean }[] = [];
      let newPop = prev.player.popularity;
      let newCP = prev.politicalCapital ?? 60;
      let newInflation = prev.economy.inflation;
      let newGdpGrowth = prev.economy.gdpGrowth;
      let newCoalitionSeats = prev.congress.coalitionSeats;

      switch (actionId) {
        case 'meeting_economy':
          feedbackTitle = 'Despacho com Ministério da Fazenda & Planejamento';
          feedbackDesc = 'Definição rigorosa de diretrizes fiscais e alinhamento de metas de arrecadação acalmaram o mercado financeiro e os juros futuros.';
          newCP = Math.min(100, newCP + 6);
          newInflation = Math.max(2.0, Math.round((newInflation - 0.5) * 10) / 10);
          newGdpGrowth = Math.round((newGdpGrowth + 0.2) * 10) / 10;
          feedbackDeltas = [
            { label: 'Expectativa de Inflação', value: '-0.5%', isPositive: true },
            { label: 'Crescimento Projetado', value: '+0.2%', isPositive: true },
            { label: 'Capital Político', value: '+6 pts', isPositive: true }
          ];
          logMsg = 'Reunião com equipe econômica alinhou metas fiscais e reduziu pressão inflacionária.';
          break;

        case 'congress_whips':
          feedbackTitle = 'Articulação Política com Líderes da Câmara e Senado';
          feedbackDesc = 'Alinhamento direto com as lideranças partidárias e presidente da Câmara garantiu ampliação da base aliada e fidelidade de voto.';
          newCP = Math.min(100, newCP + 10);
          newCoalitionSeats = Math.min(350, newCoalitionSeats + 14);
          feedbackDeltas = [
            { label: 'Base Aliada no Congresso', value: '+14 deputados', isPositive: true },
            { label: 'Capital Político', value: '+10 pts', isPositive: true },
            { label: 'Fidelidade de Bancada', value: 'Elevada', isPositive: true }
          ];
          logMsg = 'Articulação direta com bancadas no Congresso conquistou 14 novos parlamentares para a base.';
          break;

        case 'governors_summit':
          feedbackTitle = 'Conferência Federativa com Governadores de Estado';
          feedbackDesc = 'Pacto de cooperação entre União e Estados para repasses de saúde e segurança pública reduziu resistências regionais.';
          newPop = Math.min(95, newPop + 3);
          newCP = Math.min(100, newCP + 5);
          feedbackDeltas = [
            { label: 'Aprovação Popular', value: '+3%', isPositive: true },
            { label: 'Capital Político', value: '+5 pts', isPositive: true },
            { label: 'Harmonia Federativa', value: 'Pacto Firmado', isPositive: true }
          ];
          logMsg = 'Conferência Federativa selou cooperação com os Governadores de Estado.';
          break;

        case 'unions_dialogue':
          feedbackTitle = 'Mesa de Diálogo com Centrais Sindicais & Trabalhadores';
          feedbackDesc = 'Abertura de canal formal de negociação salarial e condições de trabalho desarmou o risco de greves gerais nos transportes e serviços essenciais.';
          newPop = Math.min(95, newPop + 4);
          feedbackDeltas = [
            { label: 'Aprovação Popular', value: '+4%', isPositive: true },
            { label: 'Risco de Paralisações', value: 'Neutralizado', isPositive: true }
          ];
          logMsg = 'Diálogo com centrais sindicais garantiu paz trabalhista e preveniu paralisações no país.';
          break;

        case 'business_roundtable':
          feedbackTitle = 'Encontro com Lideranças Empresariais & Investidores (Faria Lima / CNI)';
          feedbackDesc = 'Apresentação das garantias de segurança jurídica e estabilidade regulatória destravaram investimentos privados no setor produtivo.';
          newGdpGrowth = Math.round((newGdpGrowth + 0.3) * 10) / 10;
          newCP = Math.min(100, newCP + 4);
          feedbackDeltas = [
            { label: 'Investimento Produtivo', value: '+0.3% no PIB', isPositive: true },
            { label: 'Confiança Empresarial', value: 'Alta', isPositive: true }
          ];
          logMsg = 'Mesa com investidores e empresários estimulou a formação de capital fixo e crescimento.';
          break;

        case 'press_conference':
          feedbackTitle = 'Entrevista Coletiva & Pronunciamento em Cadeia de Rádio e TV';
          feedbackDesc = 'Prestação de contas direta ao povo brasileiro, esclarecendo as medidas de governo e desmentindo boatos da oposição.';
          newPop = Math.min(95, newPop + 5);
          feedbackDeltas = [
            { label: 'Aprovação Popular', value: '+5%', isPositive: true },
            { label: 'Alcance Midiático', value: 'Nacional', isPositive: true }
          ];
          logMsg = 'Pronunciamento em rede nacional elevou a percepção de transparência e aprovação do governo.';
          break;

        case 'crisis_management':
          feedbackTitle = 'Gabinete de Crise & Resposta Rápida do Planalto';
          feedbackDesc = 'Intervenção emergencial direta do Presidente sobre o problema mais urgente do país, evitando desdobramentos catastróficos.';
          newCP = Math.min(100, newCP + 8);
          newPop = Math.min(95, newPop + 3);
          feedbackDeltas = [
            { label: 'Dilema Urgente', value: 'Contido com Sucesso', isPositive: true },
            { label: 'Aprovação Popular', value: '+3%', isPositive: true }
          ];
          logMsg = 'Gabinete de crise conteve os impactos imediatos e evitou o alastramento de emergências.';
          break;
      }

      const newRemainingPoints = prev.agenda.remainingActionPoints - 1;
      const updatedAgenda = {
        ...prev.agenda,
        remainingActionPoints: newRemainingPoints,
        actionsTakenLog: [logMsg, ...prev.agenda.actionsTakenLog]
      };

      const timelineEntry: TimelineEntry = {
        id: `tl_agenda_${Date.now()}`,
        monthYear: prev.currentDate.split(' de ')[0],
        title: `Agenda Presidencial: ${feedbackTitle}`,
        description: feedbackDesc,
        category: 'start',
        type: 'positive'
      };

      return {
        ...prev,
        agenda: updatedAgenda,
        politicalCapital: newCP,
        player: {
          ...prev.player,
          popularity: newPop,
          politicalCapital: newCP
        },
        economy: {
          ...prev.economy,
          inflation: newInflation,
          gdpGrowth: newGdpGrowth
        },
        congress: {
          ...prev.congress,
          coalitionSeats: newCoalitionSeats
        },
        timeline: [timelineEntry, ...prev.timeline],
        lastActionFeedback: {
          title: feedbackTitle,
          description: feedbackDesc,
          deltas: feedbackDeltas
        }
      };
    });
  }, []);

  const respondToParliamentarianBargain = useCallback((lawId: string, bargainId: string, decision: 'accept' | 'refuse' | 'counter') => {
    setState(prev => {
      if (!prev) return null;
      const targetLaw = prev.laws.find(l => l.id === lawId);
      if (!targetLaw) return prev;
      const bargain = targetLaw.directBargains?.find(b => b.id === bargainId);
      if (!bargain) return prev;

      let newSupport = targetLaw.congressSupport;
      let newCost = targetLaw.costPerYear;
      let newCP = prev.politicalCapital ?? 60;
      let newPork = prev.porkBudgetSpent ?? 0;
      let feedbackTitle = '';
      let feedbackDesc = '';
      let feedbackDeltas: { label: string; value: string; isPositive: boolean }[] = [];

      const updatedBargains = targetLaw.directBargains?.map(b => {
        if (b.id === bargainId) {
          if (decision === 'accept') {
            newSupport += b.votesOffered;
            newCost += b.fiscalCostBi;
            newPork += b.fiscalCostBi;
            feedbackTitle = `Acordo Firmado com ${b.parliamentarianName} (${b.party})`;
            feedbackDesc = `O Planalto aceitou a demanda: "${b.demandText}". A bancada de ${b.stateName} agora votará a favor da proposta no plenário.`;
            feedbackDeltas = [
              { label: 'Votos Conquistados', value: `+${b.votesOffered} deputados`, isPositive: true },
              { label: 'Custo Orçamentário', value: `-R$ ${b.fiscalCostBi} bi`, isPositive: false }
            ];
            return { ...b, status: 'accepted' as const };
          } else if (decision === 'refuse') {
            newCP = Math.max(0, newCP - 2);
            feedbackTitle = `Demanda Recusada: ${b.parliamentarianName}`;
            feedbackDesc = `O Presidente recusou ceder vantagens paroquiais. A disciplina fiscal foi preservada, mas o parlamentar votará contra a matéria.`;
            feedbackDeltas = [
              { label: 'Integridade Fiscal', value: 'Preservada', isPositive: true },
              { label: 'Apoio da Bancada', value: 'Perdido', isPositive: false }
            ];
            return { ...b, status: 'refused' as const };
          } else {
            // counter offer: gasta capital político para conseguir meio-termo fiscal
            const halfCost = Math.round((b.fiscalCostBi * 0.5) * 10) / 10;
            const partialVotes = Math.round(b.votesOffered * 0.75);
            newSupport += partialVotes;
            newCost += halfCost;
            newPork += halfCost;
            newCP = Math.max(0, newCP - 6);
            feedbackTitle = `Contraproposta Aceita por ${b.parliamentarianName}`;
            feedbackDesc = `O Presidente utilizou prestígio e Capital Político para pactuar um meio-termo (R$ ${halfCost} bi). Apoio garantido com custo moderado.`;
            feedbackDeltas = [
              { label: 'Votos Conquistados', value: `+${partialVotes} deputados`, isPositive: true },
              { label: 'Custo Reduzido', value: `R$ ${halfCost} bi`, isPositive: true },
              { label: 'Capital Político Gasto', value: '-6 pts', isPositive: false }
            ];
            return { ...b, status: 'counter_offered' as const };
          }
        }
        return b;
      });

      const updatedLaw: Law = {
        ...targetLaw,
        congressSupport: newSupport,
        costPerYear: newCost,
        directBargains: updatedBargains
      };

      return {
        ...prev,
        politicalCapital: newCP,
        porkBudgetSpent: newPork,
        laws: prev.laws.map(l => l.id === lawId ? updatedLaw : l),
        lastActionFeedback: {
          title: feedbackTitle,
          description: feedbackDesc,
          deltas: feedbackDeltas
        }
      };
    });
  }, []);

  const createCustomSocialProgram = useCallback((program: import('@/game/types').SocialProgram) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        socialPrograms: [program, ...prev.socialPrograms],
        budget: {
          ...prev.budget,
          totalSpending: Math.round((prev.budget.totalSpending + program.annualCost) * 10) / 10,
          nominalBalance: Math.round((prev.budget.nominalBalance - program.annualCost) * 10) / 10
        }
      };
    });
  }, []);

  const executePresidentialDossier = useCallback((dossierId: string, optionId: string) => {
    setState(prev => {
      if (!prev) return null;
      const dossier = prev.presidentialDossiers.find(d => d.id === dossierId);
      if (!dossier) return prev;
      const option = dossier.options.find(o => o.id === optionId);
      if (!option) return prev;

      const { consequences } = option;

      // 1. Popularidade
      const popDelta = consequences.popularityDelta ?? 0;
      const newPopularity = Math.min(95, Math.max(5, prev.player.popularity + popDelta));

      // 2. Economia
      const infDelta = consequences.inflationDelta ?? 0;
      const newInflation = Math.round(Math.max(1, prev.economy.inflation + infDelta) * 10) / 10;
      const gdpDelta = consequences.gdpDelta ?? 0;
      const newGdpGrowth = Math.round((prev.economy.gdpGrowth + gdpDelta) * 10) / 10;
      const unempDelta = consequences.unemploymentDelta ?? 0;
      const newUnemployment = Math.round(Math.max(2, prev.economy.unemployment + unempDelta) * 10) / 10;

      // 3. Orçamento
      const budgetDelta = consequences.budgetDelta ?? 0;
      const newSpending = Math.round((prev.budget.totalSpending + budgetDelta) * 10) / 10;
      const newNominalBalance = Math.round((prev.budget.totalRevenue - newSpending) * 10) / 10;

      // 4. Apoio parlamentar
      const congDelta = consequences.congressSupportDelta ?? 0;
      const newCoalitionSeats = Math.min(prev.congress.totalSeats, Math.max(40, prev.congress.coalitionSeats + congDelta));

      // 5. Grupos sociais
      const newSocialGroups = prev.socialGroups.map(group => {
        const delta = consequences.socialGroupDelta?.[group.id] ?? 0;
        if (delta !== 0) {
          return {
            ...group,
            approval: Math.min(100, Math.max(0, group.approval + delta))
          };
        }
        return group;
      });

      // 6. Linha do Tempo
      const currentYear = 2027 + Math.floor((prev.turn - 1) / 2);
      const isSecondSemester = prev.turn % 2 === 0;
      const baseMonths = isSecondSemester ? ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const monthIdx = Math.min(5, Math.max(0, 4 - prev.presidentialDossiers.length));
      const monthYear = `${baseMonths[monthIdx]}/${currentYear}`;

      const timelineEntry: TimelineEntry = {
        id: `tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        monthYear,
        title: consequences.timelineTitle || dossier.title,
        description: `${option.label} — ${option.feedbackText}`,
        category: consequences.timelineCategory || 'crisis',
        type: consequences.timelineType || 'neutral'
      };

      // 7. Preparar Feedback Imediato
      const feedbackDeltas: { label: string; value: string; isPositive: boolean }[] = [];
      if (popDelta !== 0) {
        feedbackDeltas.push({
          label: 'Aprovação Presidencial',
          value: `${popDelta > 0 ? '+' : ''}${popDelta}%`,
          isPositive: popDelta > 0
        });
      }
      if (infDelta !== 0) {
        feedbackDeltas.push({
          label: 'Inflação Anual',
          value: `${infDelta > 0 ? '+' : ''}${infDelta}%`,
          isPositive: infDelta < 0
        });
      }
      if (budgetDelta !== 0) {
        feedbackDeltas.push({
          label: 'Impacto Fiscal',
          value: `${budgetDelta > 0 ? '-' : '+'}R$ ${Math.abs(budgetDelta)} bi`,
          isPositive: budgetDelta <= 0
        });
      }
      if (gdpDelta !== 0) {
        feedbackDeltas.push({
          label: 'Crescimento PIB',
          value: `${gdpDelta > 0 ? '+' : ''}${gdpDelta}%`,
          isPositive: gdpDelta > 0
        });
      }
      if (congDelta !== 0) {
        feedbackDeltas.push({
          label: 'Apoio no Congresso',
          value: `${congDelta > 0 ? '+' : ''}${congDelta} deputados`,
          isPositive: congDelta > 0
        });
      }

      if (consequences.socialGroupDelta) {
        Object.entries(consequences.socialGroupDelta).forEach(([grpId, val]) => {
          const grp = prev.socialGroups.find(g => g.id === grpId);
          if (grp && val !== 0) {
            feedbackDeltas.push({
              label: grp.name,
              value: `${val > 0 ? '+' : ''}${val}% satisfação`,
              isPositive: val > 0
            });
          }
        });
      }

      // 8. Notícia Imediata
      const newsItem: import('@/game/types').News = {
        id: `news_${Date.now()}`,
        outletId: 'gazeta_nacional',
        headline: `DESPACHO PRESIDENCIAL: ${option.label}`,
        summary: option.feedbackText,
        sentiment: popDelta >= 0 ? 'positive' : 'negative',
        turn: prev.turn,
        relatedCategory: 'politica'
      };

      // 9. Consequência postergada
      const newDelayed = [...prev.delayedConsequences];
      if (consequences.delayedConsequenceTrigger) {
        newDelayed.push({
          id: `del_${Date.now()}`,
          title: consequences.delayedConsequenceTrigger.title,
          description: consequences.delayedConsequenceTrigger.description,
          source: dossier.title,
          triggerTurn: prev.turn + consequences.delayedConsequenceTrigger.turnsAhead,
          popularityImpact: -3,
          gdpImpact: -0.2
        });
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          popularity: newPopularity
        },
        economy: {
          ...prev.economy,
          inflation: newInflation,
          gdpGrowth: newGdpGrowth,
          unemployment: newUnemployment
        },
        budget: {
          ...prev.budget,
          totalSpending: newSpending,
          nominalBalance: newNominalBalance
        },
        congress: {
          ...prev.congress,
          coalitionSeats: newCoalitionSeats
        },
        socialGroups: newSocialGroups,
        timeline: [timelineEntry, ...prev.timeline],
        presidentialDossiers: prev.presidentialDossiers.filter(d => d.id !== dossierId),
        lastActionFeedback: {
          title: dossier.title,
          description: option.feedbackText,
          deltas: feedbackDeltas
        },
        news: [newsItem, ...prev.news.slice(0, 9)],
        delayedConsequences: newDelayed,
        breakingNewsTicker: [`DESPACHO: ${option.label} aprovado pelo Planalto`, ...prev.breakingNewsTicker.slice(0, 4)]
      };
    });
  }, []);

  const clearActionFeedback = useCallback(() => {
    setState(prev => prev ? { ...prev, lastActionFeedback: null } : null);
  }, []);

  const performCampaignAction = useCallback((payload: {
    type: 'rally' | 'debate' | 'crisis' | 'pledge';
    label: string;
    cost: number;
    playerPollDelta: number;
    rivalPollDelta: number;
    logMessage: string;
    pledgeText?: string;
  }) => {
    setState(prev => {
      if (!prev) return null;
      const curr = prev.electionCampaign;
      const newBudget = Math.max(0, Math.round((curr.budget - payload.cost) * 10) / 10);
      const newPlayerPoll = Math.min(65, Math.max(15, Math.round((curr.playerPoll + payload.playerPollDelta) * 10) / 10));

      const rivalsUpdated = curr.rivals.map((r, i) => {
        const delta = i === 0 ? payload.rivalPollDelta : -Math.round((payload.rivalPollDelta / 2) * 10) / 10;
        return {
          ...r,
          poll: Math.min(50, Math.max(8, Math.round((r.poll + delta) * 10) / 10))
        };
      });

      const nextWeek = curr.currentWeek < curr.maxWeeks ? curr.currentWeek + 1 : curr.currentWeek;
      const updatedPledges = payload.pledgeText ? [...curr.pledges, payload.pledgeText] : curr.pledges;

      return {
        ...prev,
        electionCampaign: {
          ...curr,
          budget: newBudget,
          playerPoll: newPlayerPoll,
          rivals: rivalsUpdated,
          currentWeek: nextWeek,
          pledges: updatedPledges,
          historyLog: [payload.logMessage, ...curr.historyLog]
        }
      };
    });
  }, []);

  const conductElection = useCallback(() => {
    setState(prev => {
      if (!prev) return null;
      const curr = prev.electionCampaign;
      const variance = (Math.random() * 3.6 - 1.8);
      const finalVotes = Math.min(64, Math.max(32, Math.round((curr.playerPoll + variance) * 10) / 10));
      const hasWon = finalVotes >= 50.0;

      const updatedRivals = curr.rivals.map((r, i) => {
        if (i === 0) {
          const rivalVotes = Math.round((100 - finalVotes - (curr.rivals[1]?.poll || 10)) * 10) / 10;
          return { ...r, poll: rivalVotes };
        }
        return r;
      });

      const winnerName = hasWon ? prev.player.name : updatedRivals[0].name;
      const winnerParty = hasWon ? prev.party.acronym : updatedRivals[0].party;

      const lossReason = finalVotes < 45
        ? 'A rejeição nas grandes regiões metropolitanas e o esgotamento orçamentário impediram a virada nas urnas.'
        : 'Disputa acirrada até a última urna, mas a hegemonia da oposição nos setores tradicionais garantiu a vitória deles.';

      const newTimeline = hasWon ? [
        {
          id: `tl_election_win_${Date.now()}`,
          monthYear: 'Nov/2026',
          title: 'Eleição Presidencial da República',
          description: `Vitória com ${finalVotes}% dos votos válidos contra ${updatedRivals[0].name} (${updatedRivals[0].poll}%).`,
          category: 'start' as const,
          type: 'positive' as const
        },
        ...prev.timeline
      ] : prev.timeline;

      return {
        ...prev,
        player: {
          ...prev.player,
          popularity: hasWon ? Math.round(finalVotes * 0.95) : prev.player.popularity
        },
        timeline: newTimeline,
        electionCampaign: {
          ...curr,
          electionFinished: true,
          wonElection: hasWon,
          finalPlayerVotes: finalVotes,
          winnerName,
          winnerParty,
          rivals: updatedRivals,
          lossAnalysis: !hasWon ? lossReason : undefined
        }
      };
    });
  }, []);

  const advanceSemesterTurn = useCallback(async () => {
    if (!state) return;
    setIsLoading(true);
    try {
      const nextState = await advanceTurn(state);
      setState(nextState);
      if (nextState.turnHistory.length > 0) {
        setActiveReport(nextState.turnHistory[0]);
      }
    } catch (err) {
      console.error('Falha ao avançar semestre:', err);
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  const closeReportModal = useCallback(() => {
    setActiveReport(null);
  }, []);

  const negotiateWithGovernor = useCallback((stateId: string, offer: { porkBarrelsBi?: number; federalProject?: string }) => {
    setState(prev => {
      if (!prev) return null;
      const region = (prev.regions || []).find(r => r.id === stateId);
      if (!region) return prev;

      const cost = offer.porkBarrelsBi || 0;
      const govName = region.governor?.name || region.politicalDominance.governorName;
      const gainedSupport = Math.min(15, 6 + Math.round(cost * 3));
      const newCoalitionSeats = Math.min(513, prev.congress.coalitionSeats + gainedSupport);
      const newIndependentSeats = Math.max(0, prev.congress.independentSeats - gainedSupport);

      return {
        ...prev,
        budget: {
          ...prev.budget,
          nominalBalance: Math.round((prev.budget.nominalBalance - cost) * 10) / 10
        },
        porkBudgetSpent: Math.round(((prev.porkBudgetSpent || 0) + cost) * 10) / 10,
        politicalCapital: Math.min(100, (prev.politicalCapital || 50) + 5),
        congress: {
          ...prev.congress,
          coalitionSeats: newCoalitionSeats,
          independentSeats: newIndependentSeats
        },
        regions: (prev.regions || []).map(r => r.id === stateId ? {
          ...r,
          governmentApproval: Math.min(95, r.governmentApproval + 6),
          governor: r.governor ? {
            ...r.governor,
            playerRelationship: Math.min(100, r.governor.playerRelationship + 25)
          } : undefined,
          politicalDominance: {
            ...r.politicalDominance,
            stanceToPresident: 'allied'
          }
        } : r),
        lastActionFeedback: {
          title: `Pacto Federativo com ${region.name}`,
          description: `Acordo firmado com o Governador ${govName}. Alocados R$ ${cost} bi em emendas e contrapartidas em troca do apoio da bancada estadual.`,
          deltas: [
            { label: 'Bancada Conquistada', value: `+${gainedSupport} Deputados`, isPositive: true },
            { label: 'Aprovação Estadual', value: '+6%', isPositive: true },
            { label: 'Custo de Repasses', value: `-R$ ${cost} bi`, isPositive: cost === 0 },
            { label: 'Capital Político', value: '+5 pts', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const negotiateDiplomaticTreaty = useCallback((countryId: string, treatyName: string) => {
    setState(prev => {
      if (!prev) return null;
      const country = (prev.worldCountries || []).find(c => c.id === countryId);
      if (!country) return prev;

      const alreadyHas = country.diplomaticRelation.treaties.includes(treatyName);
      if (alreadyHas) return prev;

      const updatedTreaties = [...country.diplomaticRelation.treaties, treatyName];
      const updatedScore = Math.min(100, country.diplomaticRelation.relationshipScore + 20);
      const tradeBoost = treatyName.includes('Comércio') ? 6.5 : 2.0;

      return {
        ...prev,
        politicalCapital: Math.max(5, (prev.politicalCapital || 50) - 10),
        worldCountries: (prev.worldCountries || []).map(c => c.id === countryId ? {
          ...c,
          diplomaticRelation: {
            ...c.diplomaticRelation,
            treaties: updatedTreaties,
            relationshipScore: updatedScore,
            status: updatedScore >= 70 ? 'allied' : 'friendly',
            tradeVolumeBi: parseFloat((c.diplomaticRelation.tradeVolumeBi + tradeBoost).toFixed(1)),
            historicalMemoryLog: [
              ...c.diplomaticRelation.historicalMemoryLog,
              `Assinado tratado bilateral: ${treatyName}. Comércio ampliado e laços diplomáticos reforçados.`
            ]
          }
        } : c),
        economy: {
          ...prev.economy,
          tradeBalance: parseFloat((prev.economy.tradeBalance + tradeBoost * 0.4).toFixed(1))
        },
        lastActionFeedback: {
          title: `Tratado Celebrado com ${country.name}`,
          description: `Ratificado solenemente o "${treatyName}" com o governo de ${country.leader.name}.`,
          deltas: [
            { label: 'Relação Bilateral', value: `+20 pts (${country.name})`, isPositive: true },
            { label: 'Comércio Bilateral', value: `+R$ ${tradeBoost} bi`, isPositive: true },
            { label: 'Saldo Comercial', value: `+R$ ${(tradeBoost * 0.4).toFixed(1)} bi`, isPositive: true },
            { label: 'Custo de Articulação', value: '-10 Cap. Político', isPositive: false }
          ]
        }
      };
    });
  }, []);

  const applyDiplomaticSanction = useCallback((countryId: string) => {
    setState(prev => {
      if (!prev) return null;
      const country = (prev.worldCountries || []).find(c => c.id === countryId);
      if (!country) return prev;

      const isCurrentlySanctioned = country.diplomaticRelation.sanctionsActive;
      const newSanctionState = !isCurrentlySanctioned;
      const scoreDelta = newSanctionState ? -40 : 15;
      const newScore = Math.max(-100, Math.min(100, country.diplomaticRelation.relationshipScore + scoreDelta));

      return {
        ...prev,
        worldCountries: (prev.worldCountries || []).map(c => c.id === countryId ? {
          ...c,
          diplomaticRelation: {
            ...c.diplomaticRelation,
            sanctionsActive: newSanctionState,
            relationshipScore: newScore,
            status: newSanctionState ? 'sanctioned' : newScore >= 35 ? 'friendly' : 'neutral',
            historicalMemoryLog: [
              ...c.diplomaticRelation.historicalMemoryLog,
              newSanctionState 
                ? `Sanções econômicas e diplomáticas aplicadas pelo governo brasileiro.`
                : `Sanções revogadas. Reabertura paulatina de canais diplomáticos.`
            ]
          }
        } : c),
        lastActionFeedback: {
          title: newSanctionState ? `Sanções Aplicadas contra ${country.name}` : `Sanções Revogadas contra ${country.name}`,
          description: newSanctionState
            ? `Medidas restritivas e congelamento de cooperação impostos ao governo de ${country.leader.name}.`
            : `Canais comerciais reabertos com ${country.name}.`,
          deltas: [
            { label: 'Status Diplomático', value: newSanctionState ? 'Sancionado' : 'Normalizado', isPositive: !newSanctionState },
            { label: 'Score Diplomático', value: `${scoreDelta} pts`, isPositive: !newSanctionState }
          ]
        }
      };
    });
  }, []);

  const sendDiplomaticAid = useCallback((countryId: string, amountBi: number) => {
    setState(prev => {
      if (!prev) return null;
      const country = (prev.worldCountries || []).find(c => c.id === countryId);
      if (!country) return prev;

      return {
        ...prev,
        budget: {
          ...prev.budget,
          nominalBalance: Math.round((prev.budget.nominalBalance - amountBi) * 10) / 10
        },
        worldCountries: (prev.worldCountries || []).map(c => c.id === countryId ? {
          ...c,
          diplomaticRelation: {
            ...c.diplomaticRelation,
            relationshipScore: Math.min(100, c.diplomaticRelation.relationshipScore + 18),
            historicalMemoryLog: [
              ...c.diplomaticRelation.historicalMemoryLog,
              `Ajuda humanitária / linha de financiamento de exportação de R$ ${amountBi} bi concedida pelo Brasil.`
            ]
          }
        } : c),
        lastActionFeedback: {
          title: `Ajuda e Financiamento Concedidos: ${country.name}`,
          description: `Liberação de R$ ${amountBi} bi em crédito e cooperação bilateral com ${country.name}.`,
          deltas: [
            { label: 'Aporte Financeiro', value: `-R$ ${amountBi} bi`, isPositive: false },
            { label: 'Afinidade Diplomática', value: '+18 pts', isPositive: true },
            { label: 'Influência Internacional', value: '+8 pts', isPositive: true }
          ]
        }
      };
    });
  }, []);

  const conductBilateralSummit = useCallback((countryId: string) => {
    setState(prev => {
      if (!prev) return null;
      const country = (prev.worldCountries || []).find(c => c.id === countryId);
      if (!country) return prev;

      return {
        ...prev,
        politicalCapital: Math.max(5, (prev.politicalCapital || 50) - 8),
        worldCountries: (prev.worldCountries || []).map(c => c.id === countryId ? {
          ...c,
          diplomaticRelation: {
            ...c.diplomaticRelation,
            relationshipScore: Math.min(100, c.diplomaticRelation.relationshipScore + 12),
            historicalMemoryLog: [
              ...c.diplomaticRelation.historicalMemoryLog,
              `Cúpula Bilateral de Chefes de Estado realizada entre o Presidente do Brasil e ${c.leader.name}.`
            ]
          }
        } : c),
        player: {
          ...prev.player,
          popularity: Math.min(95, prev.player.popularity + 2)
        },
        lastActionFeedback: {
          title: `Cúpula Bilateral Realizada com ${country.name}`,
          description: `Encontro oficial de alto nível entre o Presidente brasileiro e ${country.leader.name} (${country.leader.role}).`,
          deltas: [
            { label: 'Relação com Líder', value: '+12 pts', isPositive: true },
            { label: 'Prestígio Internacional', value: '+2% Aprovação', isPositive: true },
            { label: 'Custo da Cúpula', value: '-8 Cap. Político', isPositive: false }
          ]
        }
      };
    });
  }, []);

  const setActiveMapMode = useCallback((mode: 'national' | 'world') => {
    setState(prev => prev ? { ...prev, activeMapMode: mode } : null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        activeReport,
        savedGamesList,
        refreshSavedGames,
        startNewGame,
        loadGame,
        saveGame,
        setGamePhase,
        updateTaxRate,
        updateBudgetAmount,
        proposeNewLaw,
        negotiateLawWithPork,
        acceptLawAmendment,
        vetoLawArticles,
        vetoOrRejectLaw,
        nominateJustice,
        resolveActiveEvent,
        dismissUrgentDilemma,
        proposeConstitutionalAmendment,
        voteConstitutionalAmendment,
        dismissMinister,
        appointMinister,
        investigateMinister,
        praiseMinister,
        warnMinister,
        applyRegionalInvestment,
        createStateEnterprise,
        adjustEnterpriseStateStake,
        privatizeEnterprise,
        concedeEnterpriseAsset,
        nationalizeEnterprise,
        createSectorSubsidy,
        cancelSectorSubsidy,
        createFiscalIncentive,
        cancelFiscalIncentive,
        updateAgencyAutonomy,
        negotiatePartyAlliance,
        proposeCustomLaw,
        createCustomSocialProgram,
        executePresidentialDossier,
        clearActionFeedback,
        performCampaignAction,
        conductElection,
        executeAgendaAction,
        respondToParliamentarianBargain,
        advanceSemesterTurn,
        closeReportModal,
        negotiateWithGovernor,
        negotiateDiplomaticTreaty,
        applyDiplomaticSanction,
        sendDiplomaticAid,
        conductBilateralSummit,
        setActiveMapMode
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser utilizado dentro de um GameProvider');
  }
  return context;
};
