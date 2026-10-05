import type { GameState, TurnReport, TimelineEntry } from '@/game/types';
import { simulateEconomy } from '@/game/simulation/economy';
import { simulateSocialGroups } from '@/game/simulation/socialGroups';
import { simulateApproval } from '@/game/simulation/approval';
import { simulateCongressTurn } from '@/game/simulation/congress';
import { simulateSupremeCourtTurn } from '@/game/simulation/supremeCourt';
import { simulateNews } from '@/game/simulation/news';
import { 
  queueNewDelayedConsequences, 
  processTriggeredConsequences 
} from '@/game/simulation/delayedConsequences';
import { getDossiersForTurn } from '@/game/simulation/dossiersEngine';
import pressOutletsData from '@/data/press.json';
import eventsData from '@/data/events.json';
import { simulateGeopoliticsTurn } from '@/game/simulation/geopolitics';
import { saveGameToDb } from '@/database/db';

export function getTurnDateLabel(turn: number): string {
  const baseYear = 2027;
  const yearOffset = Math.floor((turn - 1) / 2);
  const semester = ((turn - 1) % 2) + 1;
  const mandateNumber = Math.floor((turn - 1) / 8) + 1;
  const yearInMandate = (yearOffset % 4) + 1;
  return `${semester}º Semestre de ${baseYear + yearOffset} (${mandateNumber}º Mandato • Ano ${yearInMandate})`;
}

export async function advanceTurn(prevState: GameState): Promise<GameState> {
  const currentTurn = prevState.turn;
  const nextTurn = currentTurn + 1;

  // 1. Simular Economia e Orçamento Base com Empresas Estatais e Subsídios
  const { 
    newEconomy: baseEconomy, 
    updatedTaxes, 
    updatedBudget,
    updatedEnterprises,
    updatedSectorSubsidies,
    updatedFiscalIncentives,
    updatedRegulatoryAgencies,
    soeDividendsTotal
  } = simulateEconomy(
    prevState.economy,
    prevState.taxes,
    prevState.budget,
    prevState.socialPrograms,
    prevState.enterprises || [],
    prevState.sectorSubsidies || [],
    prevState.fiscalIncentives || [],
    prevState.regulatoryAgencies || []
  );

  // 2. Simular Grupos Sociais Base
  const baseSocialGroups = simulateSocialGroups(
    prevState.socialGroups,
    baseEconomy,
    updatedTaxes,
    updatedBudget,
    prevState.socialPrograms
  );

  // 3. Processar Consequências Atrasadas (Delayed Impacts) agendadas de turnos anteriores
  const existingQueue = prevState.delayedConsequences || [];
  const {
    remainingQueue,
    triggeredConsequences,
    updatedEconomy,
    updatedSocialGroups,
    newsItems: delayedNews
  } = processTriggeredConsequences(
    nextTurn,
    existingQueue,
    baseEconomy,
    baseSocialGroups
  );

  // 4. Agendar novas consequências de longo prazo com base nas políticas atuais
  const updatedDelayedConsequences = queueNewDelayedConsequences(
    currentTurn,
    remainingQueue,
    updatedEconomy,
    updatedBudget,
    updatedTaxes,
    prevState.porkBudgetSpent || 0
  );

  // 5. Simular Aprovação e Pesquisas Eleitorais (já considerando choques atrasados)
  const nextDateLabel = getTurnDateLabel(nextTurn);
  const { overallApproval, overallDisapproval, poll } = simulateApproval(
    updatedSocialGroups,
    prevState.allParties,
    prevState.player.partyId,
    prevState.player.name,
    nextDateLabel
  );

  // 6. Simular Congresso Nacional
  const updatedCongress = simulateCongressTurn(
    prevState.congress,
    overallApproval,
    prevState.allParties
  );

  // 7. Simular Supremo Tribunal (Envelhecimento dos 11 ministros, aposentadorias aos 75 anos, vacâncias)
  const { updatedState: updatedSupremeCourt, newVacanciesCount, retiredJusticesNames } = simulateSupremeCourtTurn(
    prevState.supremeCourt,
    prevState.constitution
  );

  // 8. Atualizar Leis Enacted e Custos
  const enactedLaws = prevState.laws.filter(l => l.status === 'enacted');

  // 9. Notícias da Imprensa (com viés de cada veículo)
  const economyDelta = {
    gdpGrowth: Math.round((updatedEconomy.gdpGrowth - prevState.economy.gdpGrowth) * 10) / 10,
    inflation: Math.round((updatedEconomy.inflation - prevState.economy.inflation) * 10) / 10,
    unemployment: Math.round((updatedEconomy.unemployment - prevState.economy.unemployment) * 10) / 10
  };

  const pressNews = simulateNews(
    nextTurn,
    pressOutletsData as any,
    updatedEconomy,
    economyDelta,
    enactedLaws,
    retiredJusticesNames
  );

  const combinedNews = [...delayedNews, ...pressNews];

  // 10. Eventos e Dilemas para o próximo turno
  const turnUpcomingEvents = (eventsData as any[]).filter(
    e => e.turn === nextTurn && !prevState.resolvedEvents.some(r => r.id === e.id)
  );
  const activeEvents = [...prevState.activeEvents.filter(e => !e.resolved), ...turnUpcomingEvents];

  // O primeiro evento ativo não resolvido vira o Dilema Urgente para intervenção imediata do jogador
  const urgentDilemma = activeEvents.length > 0 ? activeEvents[0] : null;

  // 11. Relatório do Semestre
  const supremeCourtEvents: string[] = [];
  if (retiredJusticesNames.length > 0) {
    supremeCourtEvents.push(
      `Aposentadoria compulsória aos 75 anos de: ${retiredJusticesNames.join(', ')}. ${newVacanciesCount} nova(s) vaga(s) aberta(s) no Supremo Tribunal.`
    );
  }

  const delayedTriggeredSummaries = triggeredConsequences.map(
    c => `Impacto Atrasado: ${c.title} (${c.source})`
  );

  const turnReport: TurnReport = {
    turn: currentTurn,
    date: prevState.currentDate,
    gdp: updatedEconomy.gdp,
    gdpDelta: economyDelta.gdpGrowth,
    inflation: updatedEconomy.inflation,
    inflationDelta: economyDelta.inflation,
    unemployment: updatedEconomy.unemployment,
    unemploymentDelta: economyDelta.unemployment,
    publicDebt: updatedEconomy.publicDebt,
    publicDebtDelta: Math.round((updatedEconomy.publicDebt - prevState.economy.publicDebt) * 10) / 10,
    approval: overallApproval,
    approvalDelta: Math.round((overallApproval - prevState.player.popularity) * 10) / 10,
    povertyRate: Math.max(8, Math.min(45, Math.round(24 + (updatedEconomy.unemployment - 12) * 0.8 + (updatedEconomy.inflation - 10) * 0.4))),
    inequalityGini: Math.max(0.42, Math.min(0.62, Math.round((0.51 + (updatedEconomy.inflation > 12 ? 0.02 : -0.01)) * 100) / 100)),
    crimeRate: Math.max(15, Math.min(85, Math.round(48 + (updatedEconomy.unemployment - 12) * 1.2))),
    revenue: updatedBudget.totalRevenue,
    spending: updatedBudget.totalSpending,
    balance: updatedBudget.nominalBalance,
    keyEventsOccurred: [
      `Arrecadação semestral de R$ ${updatedBudget.totalRevenue} bi contra despesas totais de R$ ${updatedBudget.totalSpending} bi.`,
      `Taxa de desemprego em ${updatedEconomy.unemployment}%, inflação acumulada em ${updatedEconomy.inflation}%.`,
      ...(soeDividendsTotal > 0 ? [`Dividendos das empresas estatais geraram receita direta de R$ ${soeDividendsTotal} bi para o Tesouro Nacional.`] : []),
      ...(urgentDilemma ? [`Crise ativa convocada: ${urgentDilemma.title}`] : [])
    ],
    lawsEnacted: enactedLaws.map(l => l.title),
    supremeCourtEvents,
    delayedConsequencesTriggered: delayedTriggeredSummaries,
    porkBargainsSummary: prevState.porkBudgetSpent > 0 
      ? `Total liberado em emendas parlamentares até o momento: R$ ${prevState.porkBudgetSpent} bi.` 
      : undefined,
    politicalCapitalDelta: (overallApproval >= 50 ? 10 : overallApproval <= 30 ? -8 : 2) + (updatedCongress.coalitionSeats >= 257 ? 5 : -4),
    breakingHeadlines: [
      `Inflação em ${updatedEconomy.inflation}% com taxa Selic a ${updatedEconomy.interestRate}%`,
      `Aprovação presidencial aferida em ${overallApproval}%`,
      `Congresso opera com ${updatedCongress.coalitionSeats} parlamentares na base aliada`
    ]
  };

  const nextPoliticalCapital = Math.max(10, Math.min(100,
    (prevState.politicalCapital || 60) +
    (overallApproval >= 50 ? 10 : overallApproval <= 30 ? -8 : 2) +
    (updatedCongress.coalitionSeats >= 257 ? 5 : -4)
  ));

  // O término de ciclo de mandato ocorre a cada 8 semestres (4 anos). No modo infinito, o jogador pode renovar o mandato e continuar indefinidamente.
  const isMandateCycleCompleted = (currentTurn % 8 === 0);

  // 12. Simulação Viva dos Outros Países & Geopolítica Internacional
  const { updatedCountries, internationalNews } = simulateGeopoliticsTurn(
    prevState.worldCountries || [],
    prevState.player.ideology,
    nextTurn
  );

  // Converter notícias internacionais para formato de imprensa
  const formattedIntlNews = internationalNews.map((inNews, idx) => ({
    id: `intl_news_${nextTurn}_${idx}_${Date.now()}`,
    outletId: 'press_gazeta',
    headline: inNews.headline,
    summary: inNews.summary,
    sentiment: (inNews.sentiment === 'warning' ? 'negative' : inNews.sentiment) as 'positive' | 'neutral' | 'negative',
    turn: nextTurn,
    relatedCategory: 'internacional'
  }));

  // Gerar Manchetes do Ticker ao Vivo
  const breakingNewsTicker: string[] = [
    `URGENTE: Inflação fecha o semestre em ${updatedEconomy.inflation}% com taxa Selic a ${updatedEconomy.interestRate}% ao ano.`,
    `PESQUISA DATA-PAÍS: Popularidade do Presidente ${prevState.player.name} atinge ${overallApproval}%.`,
    `CÂMARA DOS DEPUTADOS: Base aliada do governo conta com ${updatedCongress.coalitionSeats} assentos e ${updatedCongress.independentSeats} independentes.`,
    ...(internationalNews.length > 0 ? [`GEOPOLÍTICA: ${internationalNews[0].headline}`] : []),
    ...(urgentDilemma ? [`PLANTÃO: ${urgentDilemma.title.toUpperCase()} - Gabinete de crise convocado às pressas no Palácio do Planalto.`] : []),
    ...(delayedTriggeredSummaries.length > 0 ? [`ALERTA NACIONAL: ${delayedTriggeredSummaries[0]}`] : [])
  ];

  // 13. Dossiês Presidenciais para o Novo Semestre
  const newTurnDossiers = getDossiersForTurn(
    nextTurn,
    updatedEconomy,
    overallApproval,
    updatedCongress.coalitionSeats
  );

  // 14. Linha do Tempo: Novo Registro Semestral
  const semesterMonth = nextTurn % 2 === 1 ? 'Jan' : 'Jul';
  const semesterYear = 2027 + Math.floor((nextTurn - 1) / 2);
  const newTimelineEntry: TimelineEntry = {
    id: `tl_turn_${nextTurn}_${Date.now()}`,
    monthYear: `${semesterMonth}/${semesterYear}`,
    title: `Início do ${nextTurn}º Semestre de Mandato (${nextDateLabel})`,
    description: `Balanço Geral: PIB em R$ ${updatedEconomy.gdp} bi, inflação em ${updatedEconomy.inflation}% e aprovação popular aferida em ${overallApproval}%.`,
    category: 'start',
    type: overallApproval >= 50 ? 'positive' : 'warning'
  };

  const updatedTimeline: TimelineEntry[] = [newTimelineEntry, ...(prevState.timeline || [])];

  // Atualizar Regiões da Federação com base na evolução econômica e aprovação
  const updatedRegions = (prevState.regions || []).map(r => {
    const approvalDelta = Math.round((overallApproval - prevState.player.popularity) * 0.7);
    const newApproval = Math.max(10, Math.min(95, r.governmentApproval + approvalDelta));
    const newUnemp = Math.max(3, Math.min(25, Math.round((r.unemployment + economyDelta.unemployment * 0.6) * 10) / 10));
    const newGdp = Math.round((r.gdp * (1 + (updatedEconomy.gdpGrowth / 100) * 0.5)) * 10) / 10;
    const newCrime = Math.max(10, Math.min(90, Math.round(r.crimeRate + (economyDelta.unemployment > 0 ? 1 : -1))));
    return {
      ...r,
      governmentApproval: newApproval,
      unemployment: newUnemp,
      gdp: newGdp,
      crimeRate: newCrime
    };
  });

  const nextState: GameState = {
    ...prevState,
    turn: nextTurn,
    currentDate: nextDateLabel,
    phase: isMandateCycleCompleted ? 'end_of_mandate' : 'governing',
    player: {
      ...prevState.player,
      popularity: overallApproval
    },
    regions: updatedRegions,
    economy: updatedEconomy,
    taxes: updatedTaxes,
    budget: updatedBudget,
    enterprises: updatedEnterprises,
    sectorSubsidies: updatedSectorSubsidies,
    fiscalIncentives: updatedFiscalIncentives,
    regulatoryAgencies: updatedRegulatoryAgencies,
    socialGroups: updatedSocialGroups,
    congress: updatedCongress,
    supremeCourt: updatedSupremeCourt,
    activeEvents,
    urgentDilemma,
    delayedConsequences: updatedDelayedConsequences,
    politicalCapital: nextPoliticalCapital,
    agenda: {
      totalActionPoints: 3,
      remainingActionPoints: 3,
      actionsTakenLog: []
    },
    timeline: updatedTimeline,
    presidentialDossiers: newTurnDossiers,
    lastActionFeedback: null,
    perceivedCorruption: Math.max(10, Math.min(95, (prevState.perceivedCorruption || 25) + ((prevState.porkBudgetSpent || 0) > 3 ? 3 : -1))),
    breakingNewsTicker,
    news: [...combinedNews, ...formattedIntlNews, ...prevState.news.slice(0, 16)],
    polls: [poll, ...prevState.polls],
    turnHistory: [turnReport, ...prevState.turnHistory],
    worldCountries: updatedCountries
  };

  // Salvar automaticamente no IndexedDB
  try {
    await saveGameToDb(nextState, `Auto-save: ${nextDateLabel}`);
  } catch (err) {
    console.error('Erro ao salvar turno no IndexedDB:', err);
  }

  return nextState;
}
