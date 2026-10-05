export type Ideology = {
  marketVsState: number; // -100 (Estatista) a 100 (Livre Mercado)
  stateSize: number; // -100 (Estado Mínimo) a 100 (Estado Amplo / Bem-Estar)
  taxes: number; // -100 (Impostos Mínimos) a 100 (Alta Tributação Progressiva)
  regulation: number; // -100 (Desregulamentação) a 100 (Forte Regulação Estatal)
  socialValues: number; // -100 (Conservadorismo Tradicional) a 100 (Progressismo Social)
  centralization: number; // -100 (Federalismo Descentralizado) a 100 (Centralismo Unitário)
  civilLiberties: number; // -100 (Autoridade e Segurança Dura) a 100 (Garantismo e Liberdades Civis)
  globalism: number; // -100 (Nacionalismo Soberano) a 100 (Internacionalismo / Globalismo)
  trade: number; // -100 (Protecionismo Nacional) a 100 (Livre Comércio Aberto)
  socialSpending: number; // -100 (Gasto Social Focalizado/Baixo) a 100 (Gasto Social Universal/Alto)
  militarySpending: number; // -100 (Desmilitarização/Baixo) a 100 (Alto Investimento Bélico)
};

export type PoliticalProfile = {
  economy: string;
  state: string;
  customs: string;
  institutions: string;
  trade: string;
  foreignPolicy: string;
};

export type Player = {
  id: string;
  name: string;
  age: number;
  description: string;
  partyId: string;
  ideology: Ideology;
  politicalExperience: number; // 0 a 100
  popularity: number; // 0 a 100
  integrity: number; // 0 a 100
  competence: number; // 0 a 100
  politicalCapital: number; // 0 a 100 (Recurso limitado para articulações e reformas)
};

export type Party = {
  id: string;
  name: string;
  acronym: string;
  color: string;
  description: string;
  ideology: Ideology;
  popularity: number;
  seats: number;
  alliedSocialGroups: string[];
  funding: number; // em milhões de unidades monetárias
  influence: number; // 0 a 100
  stanceSummary: string;
};

export type Country = {
  name: string;
  motto: string;
  capital: string;
  population: number; // 52_000_000 inicial
  currencySymbol: string; // "R$" (Unidade Monetária)
};

export type RegionalInvestmentType = 
  | 'highways' // Construir Rodovias / Ferrovias
  | 'industry_incentive' // Polo de Incentivo Industrial
  | 'hospital' // Hospital Regional de Alta Complexidade
  | 'housing' // Programa Habitacional & Saneamento
  | 'education' // Polo Universitário & Educação Técnica
  | 'security'; // Força Nacional de Segurança Pública

export type CharacterPersonality = 
  | 'conciliador'
  | 'agressivo'
  | 'populista'
  | 'tecnocrata'
  | 'liberal'
  | 'conservador'
  | 'progressista'
  | 'nacionalista'
  | 'pragmatico'
  | 'ideologico'
  | 'corruptivel'
  | 'incorruptivel'
  | 'oportunista'
  | 'moderado';

export type PoliticalCharacter = {
  id: string;
  name: string;
  age: number;
  role: string;
  country: string;
  region?: string;
  party: string;
  partyAcronym?: string;
  ideology: string;
  personality: CharacterPersonality;
  popularity: number; // 0 a 100
  competence: number; // 0 a 100
  integrity: number; // 0 a 100
  experience: number; // 0 a 100
  influence: number; // 0 a 100
  ambition: number; // 0 a 100
  loyalty: number; // 0 a 100
  negotiationSkill: number; // 0 a 100
  economicStance: 'estatista' | 'misto' | 'liberal';
  socialStance: 'conservador' | 'moderado' | 'progressista';
  securityStance: 'dura' | 'equilibrada' | 'garantista';
  foreignPolicyStance: 'soberanista' | 'pragmatico' | 'globalista';
  playerRelationship: number; // -100 a 100
  avatarSeed?: string;
};

export type CityInfo = {
  name: string;
  population: number;
  mayorName: string;
  mayorParty: string;
  mayorPersonality?: CharacterPersonality;
  isCapital?: boolean;
  coord: { x: number; y: number };
};

export type DiplomaticRelation = {
  relationshipScore: number; // -100 a 100
  status: 'allied' | 'friendly' | 'neutral' | 'tense' | 'rival' | 'sanctioned';
  tradeVolumeBi: number; // Em bilhões de R$
  treaties: string[];
  sanctionsActive: boolean;
  historicalMemoryLog: string[];
};

export type WorldCountry = {
  id: string;
  name: string;
  continent: string;
  capital: string;
  population: number; // em milhões
  gdp: number; // em bilhões de USD
  gdpPerCapita: number;
  gdpGrowth: number; // % anual
  inflation: number; // % anual
  unemployment: number; // %
  politicalSystem: 'presidential' | 'parliamentary' | 'semi_presidential' | 'constitutional_monarchy' | 'one_party';
  leader: PoliticalCharacter;
  rulingParty: string;
  governmentApproval: number;
  politicalStability: number;
  militaryStrength: number;
  mainResources: string[];
  mainExports: string[];
  mainImports: string[];
  topTradingPartners: string[];
  diplomaticRelation: DiplomaticRelation;
  svgPath: string;
  centerCoords: { x: number; y: number };
  nextElectionTurn: number;
  recentEvent: string;
};

export type MapFilterCategory = 'economy' | 'politics' | 'society' | 'infrastructure' | 'diplomacy';

export type MapFilterMetric = 
  | 'gdp'
  | 'gdpPerCapita'
  | 'gdpGrowth'
  | 'unemployment'
  | 'inflation'
  | 'rulingParty'
  | 'governmentApproval'
  | 'politicalStability'
  | 'poverty'
  | 'education'
  | 'health'
  | 'crime'
  | 'infrastructure_overall'
  | 'infrastructure_transport'
  | 'infrastructure_energy'
  | 'diplomatic_status'
  | 'trade_volume';

export type Region = {
  id: string;
  name: string;
  nickname: string;
  acronym?: string;
  macroRegion?: 'Sudeste' | 'Sul' | 'Nordeste' | 'Norte' | 'Centro-Oeste';
  capital: string;
  population: number;
  gdp: number; // Em bilhões de R$
  gdpPerCapita?: number;
  unemployment: number; // Taxa %
  inflationRegional?: number;
  governmentApproval: number; // % (0 a 100)
  crimeRate: number; // 0 a 100
  infrastructure: number; // 0 a 100
  healthIndex: number; // 0 a 100
  educationIndex: number; // 0 a 100
  povertyRate?: number;
  giniIndex?: number;
  naturalResources: string[];
  economicSectors?: string[];
  relevantEnterprises?: string[];
  politicalDominance: {
    rulingPartyId: string;
    governorName: string;
    stanceToPresident: 'allied' | 'neutral' | 'opposition';
    dominantInterests: string;
  };
  governor?: PoliticalCharacter;
  majorCities?: CityInfo[];
  svgPath: string;
  labelCoord: { x: number; y: number };
  recentInvestments: string[];
};

export type Economy = {
  gdp: number; // PIB em bilhões (ex: 420.0 bi)
  gdpGrowth: number; // % anual (ex: 0.5%)
  inflation: number; // % anual (ex: 12.4%)
  unemployment: number; // % (ex: 14.2%)
  interestRate: number; // Taxa de juros do Banco Central % (ex: 13.75%)
  publicDebt: number; // Em % do PIB (ex: 82.0%)
  foreignReserves: number; // Em bilhões de R$ (ex: 45.0)
  investmentRate: number; // % do PIB em investimento total (ex: 14.5%)
  privateInvestmentRate: number; // % do PIB em investimento privado (ex: 11.2%)
  publicInvestmentRate: number; // % do PIB em investimento público (ex: 3.3%)
  businessConfidence: number; // 0 a 100 (ex: 55)
  consumerConfidence: number; // 0 a 100 (ex: 52)
  capacityUtilization: number; // % (ex: 78.5%)
  tradeBalance: number; // Saldo da balança comercial em R$ bilhões (ex: 12.4 bi)
};

export type TaxTransmissionInfo = {
  shortTermEffects: string[];
  mediumTermEffects: string[];
  longTermEffects: string[];
  affectedVariables: string[];
  tradeOffSummary: string;
};

export type Tax = {
  id: string;
  name: string;
  description: string;
  rate: number; // Alíquota percentual (%)
  initialRate: number;
  category: 'income' | 'corporate' | 'consumption' | 'fuel' | 'wealth' | 'import';
  revenue: number; // Arrecadação em bilhões
  transmissionTips?: TaxTransmissionInfo;
};

export type EnterpriseSector = 
  | 'energy'
  | 'oil_gas'
  | 'mining'
  | 'transport'
  | 'banking'
  | 'infrastructure'
  | 'technology'
  | 'telecom'
  | 'sanitation'
  | 'defense'
  | 'industry'
  | 'agriculture'
  | 'logistics';

export type EnterpriseOwnership = 'state_owned' | 'mixed' | 'private_regulated' | 'private';

export type GovernanceModel = 'commercial' | 'strategic_public' | 'independent_board';

export type Enterprise = {
  id: string;
  name: string;
  acronym?: string;
  sector: EnterpriseSector;
  stateStake: number; // 0 a 100%
  ownership: EnterpriseOwnership;
  governance: GovernanceModel;
  employees: number;
  annualRevenue: number; // Em bilhões de R$
  annualProfit: number; // Em bilhões de R$ (pode ser negativo)
  productivity: number; // 0 a 100
  efficiency: number; // 0 a 100
  debt: number; // Em bilhões de R$
  marketShare: number; // % 0 a 100
  exportShare: number; // % 0 a 100
  politicalInfluence: number; // 0 a 100
  reputation: number; // 0 a 100
  strategicImportance: number; // 0 a 100
  concessionExpiresTurn?: number;
  isConcession?: boolean;
  concessionDurationYears?: number;
  recentEvent?: string;
  dividendYield?: number; // % distribuído aos acionistas
  dividendsPaidToTreasury?: number; // Em bilhões de R$ no turno
  complianceScore?: number; // 0 a 100
  headquartersRegionId?: string;
  valuationBi: number; // Valor estimado da empresa
  autonomousActionSummary?: string;
};

export type SectorSubsidy = {
  id: string;
  sector: EnterpriseSector;
  name: string;
  budgetBi: number; // Custo fiscal por semestre em bilhões de R$
  durationSemesters: number;
  semestersRemaining: number;
  targetBeneficiary: string;
  conditions: string;
  active: boolean;
  priceReductionPercent: number; // Redução no preço da cesta do setor
  outputBoostPercent: number;
  inefficiencyRisk: number; // Risco de distorção de preços (0 a 100)
};

export type FiscalIncentiveProgram = {
  id: string;
  name: string;
  sector: EnterpriseSector;
  minInvestmentBi: number;
  taxDiscountPercent: number; // Ex: 20% de redução no imposto corporativo
  durationSemesters: number;
  semestersRemaining: number;
  targetRegionId: string; // 'all' ou ID do estado
  requiredJobs: number;
  localContentPercent: number;
  active: boolean;
  companiesEnrolled: number;
  totalPrivateInvestmentMobilized: number; // Em bilhões de R$
  foregoneRevenueBi: number; // Renúncia fiscal gerada
};

export type RegulatoryAgency = {
  id: string;
  name: string;
  acronym: string;
  sector: EnterpriseSector;
  autonomyLevel: 'independent' | 'shared' | 'presidential_control';
  rigorLevel: 'high' | 'balanced' | 'deregulated';
  directorName: string;
  directorLoyalty: number; // 0 a 100
  marketConfidence: number; // 0 a 100
  regulatoryStability: number; // 0 a 100
  priceCapRule?: string;
  description: string;
};

export type BudgetCategory = {
  id: string;
  name: string;
  description: string;
  amount: number; // Gasto em bilhões de R$
  percentOfTotal: number;
};

export type Budget = {
  totalRevenue: number; // Arrecadação total
  totalSpending: number; // Despesa total primária + juros
  primaryBalance: number; // Superávit ou déficit primário (Receita - Despesas)
  nominalBalance: number; // Balanço nominal considerando juros da dívida
  debtInterestCost: number; // Custo com juros da dívida pública
  categories: BudgetCategory[];
};

export type SocialGroup = {
  id: string;
  name: string;
  description: string;
  populationShare: number; // % da população (0 a 100)
  averageIncome: number; // Renda média relativa
  approval: number; // Aprovação do governo (0 a 100)
  influence: number; // 0 a 100
  keyInterests: string[];
  ideologicalLean: Partial<Ideology>;
};

export type Minister = {
  id: string;
  portfolio: string; // Ex: "Economia e Fazenda", "Justiça", "Saúde"
  portfolioId: string;
  name: string;
  age: number;
  competence: number; // 0 a 100
  loyalty: number; // 0 a 100
  popularity: number; // 0 a 100
  integrity: number; // 0 a 100
  experience: number; // 0 a 100
  ideologyLean: string; // "Liberal", "Estatista", "Técnico Pragmático", etc.
  partyAffiliation?: string; // Ex: "BCI (Centrão)", "Técnico", "MSD"
  scandalRisk?: number; // 0 a 100
  effectsSummary?: string;
  status: 'appointed' | 'vacant';
};

export type MinisterCandidate = {
  id: string;
  portfolioId: string;
  name: string;
  age: number;
  competence: number;
  loyalty: number;
  integrity: number;
  popularity: number;
  experience: number;
  ideologyLean: string;
  partyAffiliation: string;
  bio: string;
  effectsSummary: string;
};

export type SupremeJustice = {
  id: string;
  name: string;
  age: number;
  ideology: number; // -100 (Progressista/Garantista) a 100 (Conservador/Legalista Rígido)
  independence: number; // 0 a 100
  experience: number; // 0 a 100
  integrity: number; // 0 a 100
  reputation: number; // 0 a 100
  appointedBy: string; // Nome do presidente que indicou
  appointmentDate: string; // Ano de nomeação
  retirementDate?: string; // Previsão de aposentadoria aos 75 anos
  status: 'active' | 'retired' | 'resigned' | 'deceased';
  legalPhilosophy: 'Garantista' | 'Legalista Estrito' | 'Pragmatista Constitucional' | 'Ativista Social';
  bio: string;
};

export type SupremeJusticeCandidate = {
  id: string;
  name: string;
  age: number;
  ideology: number;
  independence: number;
  experience: number;
  integrity: number;
  reputation: number;
  alignmentWithPresident: number; // 0 a 100
  legalPhilosophy: 'Garantista' | 'Legalista Estrito' | 'Pragmatista Constitucional' | 'Ativista Social';
  bio: string;
  civilRightsStance: string;
  economicStance: string;
  securityStance: string;
};

export type SupremeCourtAppointmentStatus = 
  | 'idle'
  | 'vacancy_open'
  | 'candidate_chosen'
  | 'congress_voting'
  | 'approved'
  | 'rejected';

export type SupremeCourtState = {
  justices: SupremeJustice[];
  vacancies: number;
  candidatePool: SupremeJusticeCandidate[];
  activeNomination?: {
    candidate: SupremeJusticeCandidate;
    step: SupremeCourtAppointmentStatus;
    congressVotesFor?: number;
    congressVotesAgainst?: number;
    requiredVotes?: number;
    resultMessage?: string;
  };
};

export type PropositionType = 
  | 'project_of_law' // PL - Maioria simples (257)
  | 'complementary_law' // PLC - Maioria absoluta (257)
  | 'constitutional_amendment' // PEC - 3/5 em 2 turnos (308)
  | 'provisional_measure'; // MPV - Vigência imediata por decreto

export type LawArticle = {
  id: string;
  articleNumber: number; // 1, 2, 3...
  text: string;
  targetAspect?: 'objective' | 'funding' | 'beneficiaries' | 'sanctions' | 'transition';
  status?: 'original' | 'amended' | 'vetoed' | 'suppressed';
  amendedText?: string;
};

export type CongressAmendment = {
  id: string;
  type: 'modificativa' | 'supressiva' | 'aditiva' | 'jabuti' | 'fatiamento' | 'desidratacao' | 'pork_demand';
  title?: string;
  targetArticleNumber?: number; // Ex: Artigo 1º ou 2º
  originalArticleText?: string;
  proposedArticleText?: string;
  description: string;
  sponsorParty?: string;
  sponsorFaction?: string;
  sponsorName?: string;
  impactSummary: string;
  budgetChangeModifier?: number; // Ajuste no custo (ex: -8 bilhões ou +2 bilhões)
  porkCost?: number;
  effectivenessModifier?: number;
  approvalChanceModifier?: number;
  status: 'pending_vote' | 'approved_by_congress' | 'rejected_by_congress' | 'vetoed_by_president';
  votesFavor?: number;
  votesAgainst?: number;
};

export type LawStatus = 
  | 'draft'
  | 'in_congress'
  | 'amended_by_congress'
  | 'approved_congress'
  | 'rejected_congress'
  | 'awaiting_sanction'
  | 'enacted'
  | 'vetoed'
  | 'struck_by_supreme_court';

export type Law = {
  id: string;
  numberCode?: string; // Ex: "PL nº 014/2027", "PEC nº 003/2027"
  propositionType?: PropositionType;
  title: string;
  summaryEmenta?: string; // Ementa formal da lei
  category: 'social' | 'economic' | 'security' | 'political' | 'health' | 'education' | 'infrastructure' | 'labor' | 'environment';
  description: string;
  articles?: LawArticle[];
  author: 'executive' | 'congress';
  status: LawStatus;
  turnProposed: number;
  turnEnacted?: number;
  costPerYear: number; // em bilhões de R$ (se negativo, economia)
  originalCost: number;
  popularityImpact: number;
  economicImpactSummary: string;
  socialImpactSummary: string;
  beneficiaryGroups?: string[];
  penalizedGroups?: string[];
  congressSupport: number; // 0 a 513 deputados estimados
  congressAmendments: CongressAmendment[];
  amendmentAccepted?: boolean;
  porkBargainOffered?: number; // Valor em R$ investido em emendas para destravar
  negotiationHistory?: string[];
  judicialReviewRisk: number; // 0 a 100 (chance de questionamento no STF)
  judicialStatus?: 'constitutional' | 'unconstitutional' | 'partially_unconstitutional' | 'pending';
  vetoedArticles?: number[];
  // Campos estruturados de redação legislativa:
  objective?: string; // Objetivo formal da lei
  eligibilityCriteria?: string; // Critérios de elegibilidade e corte
  durationVigency?: string; // Duração / vigência da lei
  fundingSource?: string; // Fonte de financiamento
  finalProvisions?: string; // Disposições finais e penalidades
  directBargains?: DirectParliamentarianBargain[];
};

export type DirectParliamentarianBargain = {
  id: string;
  parliamentarianName: string;
  party: string;
  stateName: string;
  demandType: 'tax_incentive' | 'pork_transfer' | 'regulatory_exception';
  demandText: string;
  fiscalCostBi: number;
  votesOffered: number;
  politicalCapitalCost?: number;
  status: 'pending' | 'accepted' | 'refused' | 'counter_offered';
};

export type PresidentAgendaActionId = 
  | 'meeting_economy'
  | 'congress_whips'
  | 'governors_summit'
  | 'unions_dialogue'
  | 'business_roundtable'
  | 'press_conference'
  | 'crisis_management';

export type PresidentAgenda = {
  totalActionPoints: number; // Padrão: 3 slots por semestre
  remainingActionPoints: number;
  actionsTakenLog: string[];
};

export type DelayedConsequence = {
  id: string;
  source: string; // Ex: "Corte drástico na Infraestrutura (Turno 1)"
  triggerTurn: number; // Turno em que o impacto eclode
  title: string;
  description: string;
  gdpImpact?: number;
  inflationImpact?: number;
  unemploymentImpact?: number;
  publicDebtImpact?: number;
  popularityImpact?: number;
  socialGroupImpacts?: Record<string, number>;
  spawnEventId?: string;
};

export type SocialProgram = {
  id: string;
  name: string;
  description: string;
  monthlyBenefit: number; // Em R$ por pessoa
  beneficiaryCount: number; // Em milhões de pessoas
  annualCost: number; // Em bilhões
  targetGroup: string;
  povertyReductionImpact: number;
  approvalBoost: number;
  active: boolean;
};

export type ConstitutionRules = {
  name: string;
  promulgationYear: number;
  governmentSystem: 'presidential' | 'parliamentary';
  presidentialTermYears: number; // Padrão: 4
  reelectionLimit: number; // 1 reeleição consecutiva
  supremeCourtSeats: number; // 11
  supremeCourtRetirementAge: number; // 75 anos
  supremeCourtAppointmentMethod: 'presidential_nomination_congress_confirmation';
  supremeCourtConfirmationRequirement: 'absolute_majority' | 'simple_majority' | 'three_fifths'; // 257 de 513
  centralBankIndependence: 'autonomous' | 'subordinate';
  amendmentRequirement: {
    congressMajority: number; // ex: 0.6 (308 de 513)
    stages: ('congress_vote' | 'supreme_court_review' | 'executive_sanction')[];
  };
  executiveDecreePower: 'moderate' | 'strong' | 'limited';
};

export type ConstitutionalAmendmentProposal = {
  id: string;
  title: string;
  articleTarget: string;
  proposedChangeDescription: string;
  congressVotesNeeded: number; // 308 votos (3/5)
  currentStage: 'proposal' | 'congress_floor' | 'supreme_court_check' | 'promulgated' | 'rejected';
  votesInFavor?: number;
  votesAgainst?: number;
  justicesRuling?: {
    approved: boolean;
    favorableVotes: number;
    contraryVotes: number;
    rulingSummary: string;
  };
  impactSummary: string;
};

export type CongressPartyStance = {
  partyId: string;
  seats: number;
  stanceToPresident: 'coalition' | 'independent' | 'opposition';
  relationshipWithPresident?: number; // 0 a 100
  demandedMinistry?: string; // Nome do ministério cobiçado
  assignedMinistries?: string[]; // Ministérios cedidos a este partido
  porkReceived?: number; // Em R$ bilhões recebidos
  hasSignedPact?: boolean;
};

export type Congress = {
  totalSeats: number; // 513
  parties: CongressPartyStance[];
  coalitionSeats: number;
  oppositionSeats: number;
  independentSeats: number;
  presidentRelationship: number; // 0 a 100
  congressPresidentName: string;
  congressPresidentParty: string;
};

export type PressOutlet = {
  id: string;
  name: string;
  orientation: 'liberal_market' | 'center_popular' | 'labor_left' | 'national_conservative';
  credibility: number;
  reach: number;
};

export type News = {
  id: string;
  outletId: string;
  headline: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  turn: number;
  relatedCategory: string;
};

export type GameEventOption = {
  id: string;
  label: string;
  description: string;
  costs?: {
    money?: number;
    popularity?: number;
    congressSupport?: number;
  };
  consequences: {
    popularityChange?: number;
    inflationChange?: number;
    unemploymentChange?: number;
    gdpGrowthChange?: number;
    publicDebtChange?: number;
    congressSupportChange?: number;
    socialGroupApprovalChanges?: Record<string, number>;
    description: string;
  };
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  category: 'economic' | 'political' | 'social' | 'judicial' | 'international' | 'scandal';
  options: GameEventOption[];
  turn: number;
  resolved: boolean;
  chosenOptionId?: string;
};

export type PollResult = {
  date: string;
  governmentApproval: number;
  governmentDisapproval: number;
  ifElectionToday: {
    partyName: string;
    candidateName: string;
    percentage: number;
  }[];
};

export type TurnReport = {
  turn: number;
  date: string;
  gdp?: number;
  gdpDelta: number;
  inflation?: number;
  inflationDelta: number;
  unemployment?: number;
  unemploymentDelta: number;
  publicDebt?: number;
  publicDebtDelta: number;
  approval?: number;
  approvalDelta: number;
  povertyRate?: number;
  inequalityGini?: number;
  crimeRate?: number;
  revenue: number;
  spending: number;
  balance: number;
  keyEventsOccurred: string[];
  lawsEnacted: string[];
  supremeCourtEvents: string[];
  delayedConsequencesTriggered?: string[];
  porkBargainsSummary?: string;
  politicalCapitalDelta?: number;
  breakingHeadlines?: string[];
};

export type TimelineEntry = {
  id: string;
  monthYear: string; // Ex: "Jan/2027", "Fev/2027", "Mar/2027"
  title: string;
  description: string;
  category: 'start' | 'crisis' | 'reform' | 'strike' | 'congress' | 'court' | 'economic' | 'pork';
  type: 'positive' | 'warning' | 'negative' | 'neutral';
};

export type PresidentialDossierOption = {
  id: string;
  label: string;
  description: string;
  feedbackText: string;
  consequences: {
    popularityDelta?: number;
    inflationDelta?: number;
    gdpDelta?: number;
    unemploymentDelta?: number;
    budgetDelta?: number; // Custo fiscal em bilhões de R$
    congressSupportDelta?: number;
    socialGroupDelta?: Record<string, number>;
    timelineTitle: string;
    timelineType: 'positive' | 'warning' | 'negative' | 'neutral';
    timelineCategory: TimelineEntry['category'];
    delayedConsequenceTrigger?: {
      title: string;
      description: string;
      turnsAhead: number;
    };
  };
};

export type PresidentialDossier = {
  id: string;
  title: string;
  source: string; // Ex: "Banco Central", "Liderança do Governo", "Ministério da Fazenda", "Sindicatos"
  urgency: 'critical' | 'high' | 'medium';
  description: string;
  iconType: 'inflation' | 'energy' | 'congress' | 'strike' | 'court' | 'corruption';
  options: PresidentialDossierOption[];
};

export type InteractiveCampaignState = {
  budget: number; // Em milhões de R$
  currentWeek: number; // 1 a 4
  maxWeeks: number; // 4
  playerPoll: number; // % (ex: 28)
  rivals: {
    id: string;
    name: string;
    party: string;
    poll: number; // %
    ideology: string;
  }[];
  historyLog: string[];
  pledges: string[];
  chosenRallyRegion?: string;
  debateScore?: number;
  marketingFocusGroup?: string;
  electionFinished: boolean;
  wonElection?: boolean;
  finalPlayerVotes?: number;
  winnerName?: string;
  winnerParty?: string;
  lossAnalysis?: string;
};

export type GamePhase = 
  | 'character_creation'
  | 'party_selection'
  | 'ideology_setup'
  | 'campaign'
  | 'election_day'
  | 'inauguration'
  | 'governing'
  | 'end_of_mandate';

export type GameState = {
  id: string;
  saveName: string;
  lastSavedAt: string;
  currentDate: string; // Ex: "1º Semestre de 2027"
  turn: number; // 1 a 8
  phase: GamePhase;
  player: Player;
  country: Country;
  regions: Region[];
  party: Party;
  allParties: Party[];
  economy: Economy;
  taxes: Tax[];
  budget: Budget;
  enterprises: Enterprise[];
  sectorSubsidies: SectorSubsidy[];
  fiscalIncentives: FiscalIncentiveProgram[];
  regulatoryAgencies: RegulatoryAgency[];
  socialPrograms: SocialProgram[];
  socialGroups: SocialGroup[];
  congress: Congress;
  ministers: Minister[];
  supremeCourt: SupremeCourtState;
  constitution: ConstitutionRules;
  activeConstitutionalProposals: ConstitutionalAmendmentProposal[];
  laws: Law[];
  activeEvents: GameEvent[];
  resolvedEvents: GameEvent[];
  delayedConsequences: DelayedConsequence[];
  urgentDilemma: GameEvent | null;
  politicalCapital: number; // 0 a 100 (Recurso central para reformas, acordos e vetos)
  agenda: PresidentAgenda; // Slots de ação e agenda do presidente por semestre
  porkBudgetSpent: number; // Em R$ bilhões
  perceivedCorruption: number; // 0 a 100
  breakingNewsTicker: string[];
  news: News[];
  polls: PollResult[];
  turnHistory: TurnReport[];
  timeline: TimelineEntry[];
  presidentialDossiers: PresidentialDossier[];
  lastActionFeedback?: {
    title: string;
    description: string;
    deltas: { label: string; value: string; isPositive: boolean }[];
  } | null;
  electionCampaign: InteractiveCampaignState;
  worldCountries: WorldCountry[];
  activeMapMode?: 'national' | 'world';
};
