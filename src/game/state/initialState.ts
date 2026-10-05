import type { GameState, Player, Party, Ideology } from '@/game/types';
import countryData from '@/data/country.json';
import partiesData from '@/data/parties.json';
import supremeCourtData from '@/data/supreme-court.json';
import candidatePoolData from '@/data/candidate-pool.json';
import socialGroupsData from '@/data/social-groups.json';
import taxesData from '@/data/taxes.json';
import budgetData from '@/data/budget.json';
import ministersData from '@/data/ministers.json';
import constitutionData from '@/data/constitution.json';
import lawsCatalogData from '@/data/laws-catalog.json';
import eventsData from '@/data/events.json';
import pressData from '@/data/press.json';
import dossiersData from '@/data/dossiers.json';
import regionsData from '@/data/regions.json';
import enterprisesData from '@/data/enterprises.json';
import regulatoryAgenciesData from '@/data/regulatoryAgencies.json';
import worldCountriesData from '@/data/worldCountries.json';

export const defaultIdeology: Ideology = {
  marketVsState: 10,
  stateSize: 0,
  taxes: 0,
  regulation: 0,
  socialValues: 0,
  centralization: 10,
  civilLiberties: 20,
  globalism: 10,
  trade: 15,
  socialSpending: 30,
  militarySpending: 0
};

export function getPoliticalProfileLabel(ideology: Ideology) {
  return {
    economy: ideology.marketVsState > 30 ? 'Liberal de Mercado' : ideology.marketVsState < -30 ? 'Desenvolvimentista / Estatista' : 'Mista / Pragmática',
    state: ideology.stateSize > 30 ? 'Estado de Bem-Estar Forte' : ideology.stateSize < -30 ? 'Estado Mínimo' : 'Moderado',
    customs: ideology.socialValues > 30 ? 'Progressista' : ideology.socialValues < -30 ? 'Conservador' : 'Moderado',
    institutions: ideology.civilLiberties > 30 ? 'Democrático Garantista' : ideology.civilLiberties < -30 ? 'Lei e Ordem Rígido' : 'Institucional Equilibrado',
    trade: ideology.trade > 30 ? 'Livre Comércio Aberto' : ideology.trade < -30 ? 'Protecionista' : 'Comércio Seletivo',
    foreignPolicy: ideology.globalism > 30 ? 'Internacionalista e Multilateral' : ideology.globalism < -30 ? 'Nacionalista Soberanista' : 'Pragmática Não-Alinhada'
  };
}

export function createInitialGameState(customPlayer?: Partial<Player>, selectedPartyId?: string): GameState {
  const allParties = partiesData as Party[];
  const chosenParty = allParties.find(p => p.id === (selectedPartyId || 'alp')) || allParties[0];

  const player: Player = {
    id: `player_${Date.now()}`,
    name: customPlayer?.name || 'Arthur Fontoura',
    age: customPlayer?.age || 48,
    description: customPlayer?.description || 'Ex-governador e economista com histórico de diálogo entre diferentes setores produtivos.',
    partyId: chosenParty.id,
    ideology: customPlayer?.ideology || chosenParty.ideology || defaultIdeology,
    politicalExperience: customPlayer?.politicalExperience || 70,
    popularity: customPlayer?.popularity || 34,
    integrity: customPlayer?.integrity || 80,
    competence: customPlayer?.competence || 78,
    politicalCapital: 65
  };

  // Montar bancadas do Congresso
  const congressParties = allParties.map(p => {
    let stance: 'coalition' | 'independent' | 'opposition' = 'independent';
    if (p.id === chosenParty.id) stance = 'coalition';
    else if (p.id === 'bci') stance = 'coalition'; // Centro pragmático começa apoiando
    else if (p.popularity > 20) stance = 'opposition';

    return {
      partyId: p.id,
      seats: p.seats,
      stanceToPresident: stance
    };
  });

  const coalitionSeats = congressParties.filter(p => p.stanceToPresident === 'coalition').reduce((s, p) => s + p.seats, 0);
  const oppositionSeats = congressParties.filter(p => p.stanceToPresident === 'opposition').reduce((s, p) => s + p.seats, 0);
  const independentSeats = congressParties.filter(p => p.stanceToPresident === 'independent').reduce((s, p) => s + p.seats, 0);

  const initialLaws = (lawsCatalogData as any[]).map(l => ({
    ...l,
    author: 'executive',
    status: 'draft',
    turnProposed: 1,
    congressSupport: coalitionSeats,
    congressAmendments: l.possibleAmendments || []
  }));

  const initialPoll = {
    date: '1º Semestre de 2027',
    governmentApproval: player.popularity,
    governmentDisapproval: 52,
    ifElectionToday: allParties.map(p => ({
      partyName: p.name,
      candidateName: p.id === chosenParty.id ? player.name : `Líder do ${p.acronym}`,
      percentage: p.id === chosenParty.id ? player.popularity : Math.round((100 - player.popularity) / (allParties.length - 1))
    }))
  };

  const turn1Events = (eventsData as any[]).filter(e => e.turn === 1);

  return {
    id: `game_${Date.now()}`,
    saveName: `Novo Mandato - ${player.name}`,
    lastSavedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    currentDate: '1º Semestre de 2027',
    turn: 1,
    phase: 'character_creation',
    player,
    country: countryData,
    regions: regionsData as any,
    party: chosenParty,
    allParties,
    economy: {
      gdp: 420.0,
      gdpGrowth: 0.5,
      inflation: 12.4,
      unemployment: 14.2,
      interestRate: 13.75,
      publicDebt: 82.0,
      foreignReserves: 45.0,
      investmentRate: 14.5,
      privateInvestmentRate: 11.2,
      publicInvestmentRate: 3.3,
      businessConfidence: 54,
      consumerConfidence: 51,
      capacityUtilization: 76.5,
      tradeBalance: 8.5
    },
    taxes: taxesData as any,
    budget: budgetData as any,
    enterprises: enterprisesData as any,
    regulatoryAgencies: regulatoryAgenciesData as any,
    sectorSubsidies: [
      {
        id: "sub_public_transport",
        sector: "transport",
        name: "Subsídio Tarifário ao Transporte Público",
        budgetBi: 3.5,
        durationSemesters: 4,
        semestersRemaining: 4,
        targetBeneficiary: "Usuários de ônibus e metrôs urbanos",
        conditions: "Manutenção do congelamento de passagens municipais",
        active: true,
        priceReductionPercent: 18,
        outputBoostPercent: 5,
        inefficiencyRisk: 25
      },
      {
        id: "sub_diesel_agro",
        sector: "oil_gas",
        name: "Desoneração e Subsídio ao Óleo Diesel Agroindustrial",
        budgetBi: 2.2,
        durationSemesters: 2,
        semestersRemaining: 2,
        targetBeneficiary: "Cooperativas agrícolas e transportadores autônomos",
        conditions: "Repasse do desconto na bomba para fretes de grãos",
        active: true,
        priceReductionPercent: 12,
        outputBoostPercent: 8,
        inefficiencyRisk: 35
      }
    ],
    fiscalIncentives: [
      {
        id: "inc_tech_industrial",
        name: "Programa de Incentivo à Indústria de Alta Tecnologia",
        sector: "technology",
        minInvestmentBi: 0.5,
        taxDiscountPercent: 20,
        durationSemesters: 6,
        semestersRemaining: 6,
        targetRegionId: "all",
        requiredJobs: 1500,
        localContentPercent: 40,
        active: true,
        companiesEnrolled: 4,
        totalPrivateInvestmentMobilized: 4.8,
        foregoneRevenueBi: 0.95
      }
    ],
    socialPrograms: [
      {
        id: "prog_family_aid",
        name: "Auxílio Família e Alimentação Básica",
        description: "Bolsa de transferência de renda focalizada para 4 milhões de mães chefes de família.",
        monthlyBenefit: 400,
        beneficiaryCount: 4.2,
        annualCost: 12.0,
        targetGroup: "Famílias de extrema pobreza",
        povertyReductionImpact: 12,
        approvalBoost: 8,
        active: true
      }
    ],
    socialGroups: socialGroupsData as any,
    congress: {
      totalSeats: 513,
      parties: congressParties,
      coalitionSeats,
      oppositionSeats,
      independentSeats,
      presidentRelationship: 50,
      congressPresidentName: 'Dep. Rodrigo Queiroz',
      congressPresidentParty: 'BCI'
    },
    ministers: ministersData as any,
    supremeCourt: {
      justices: supremeCourtData as any,
      vacancies: 0,
      candidatePool: candidatePoolData as any
    },
    constitution: constitutionData as any,
    activeConstitutionalProposals: [],
    laws: initialLaws,
    activeEvents: turn1Events,
    resolvedEvents: [],
    delayedConsequences: [],
    urgentDilemma: turn1Events.length > 0 ? turn1Events[0] : null,
    politicalCapital: 65,
    agenda: {
      totalActionPoints: 3,
      remainingActionPoints: 3,
      actionsTakenLog: []
    },
    porkBudgetSpent: 0,
    perceivedCorruption: 28,
    breakingNewsTicker: [
      "PLANTÃO DA REPÚBLICA: Novo Presidente assume em sessão solene no Congresso Nacional.",
      "MERCADO: Inflação e juros do Banco Central pressionam o início da gestão em Brasília.",
      "POLÍTICA: Centrão exige cargos estratégicos e liberação de emendas para garantir governabilidade no Congresso."
    ],
    news: [
      {
        id: "news_init_1",
        outletId: "press_diario",
        headline: "Presidente toma posse em Brasília com promessa de diálogo e reconstrução econômica",
        summary: "Cerimônia concorrida no Palácio do Planalto marca início do novo governo diante de cenário de juros altos e desafios fiscais.",
        sentiment: "neutral",
        turn: 1,
        relatedCategory: "posse"
      },
      {
        id: "news_init_2",
        outletId: "press_gazeta",
        headline: "Mercado reage com cautela à posse e aguarda primeiras medidas fiscais",
        summary: "Dívida pública em 82% do PIB exige aprovação rápida de controle de gastos no Congresso Nacional.",
        sentiment: "neutral",
        turn: 1,
        relatedCategory: "mercado"
      }
    ],
    polls: [initialPoll],
    turnHistory: [],
    timeline: [
      {
        id: "tl_init",
        monthYear: "Jan/2027",
        title: `Sessão Solene de Posse de ${player.name}`,
        description: `O Presidente da República assume o cargo perante o Congresso Nacional em Brasília com compromisso de diálogo e desenvolvimento.`,
        category: "start",
        type: "positive"
      }
    ],
    presidentialDossiers: (dossiersData as any[]).filter(d => d.turn === 1),
    lastActionFeedback: null,
    electionCampaign: {
      budget: chosenParty.funding || 25.0,
      currentWeek: 1,
      maxWeeks: 4,
      playerPoll: player.popularity || 32,
      rivals: [
        { id: "rival_msd", name: "Helena Alencastro", party: "MSD", poll: 28, ideology: "Social-Democracia" },
        { id: "rival_por", name: "Coronel Brandão", party: "POR", poll: 24, ideology: "Conservador & Ordem" },
        { id: "rival_ptp", name: "Rogério Medeiros", party: "PTP", poll: 16, ideology: "Trabalhista" }
      ],
      historyLog: [
        "Campanha eleitoral aberta pelo Tribunal Superior Eleitoral. 156 milhões de eleitores brasileiros aptos a votar."
      ],
      pledges: [],
      electionFinished: false
    },
    worldCountries: worldCountriesData as any,
    activeMapMode: 'national'
  };
}
