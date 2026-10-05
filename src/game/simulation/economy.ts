import type { 
  Economy, 
  Tax, 
  Budget, 
  SocialProgram, 
  Enterprise, 
  SectorSubsidy, 
  FiscalIncentiveProgram, 
  RegulatoryAgency 
} from '@/game/types';

export function simulateEconomy(
  prevEconomy: Economy,
  taxes: Tax[],
  budget: Budget,
  socialPrograms: SocialProgram[],
  enterprises: Enterprise[] = [],
  sectorSubsidies: SectorSubsidy[] = [],
  fiscalIncentives: FiscalIncentiveProgram[] = [],
  regulatoryAgencies: RegulatoryAgency[] = []
): {
  newEconomy: Economy;
  updatedTaxes: Tax[];
  updatedBudget: Budget;
  updatedEnterprises: Enterprise[];
  updatedSectorSubsidies: SectorSubsidy[];
  updatedFiscalIncentives: FiscalIncentiveProgram[];
  updatedRegulatoryAgencies: RegulatoryAgency[];
  soeDividendsTotal: number;
} {
  const gdp = prevEconomy.gdp;

  // 1. Calcular Renúncia Fiscal de Programas de Incentivo Ativos
  const activeIncentives = fiscalIncentives.filter(inc => inc.active && inc.semestersRemaining > 0);
  const totalForegoneTaxBi = activeIncentives.reduce((acc, inc) => acc + (inc.foregoneRevenueBi || 0), 0);

  // 2. Calcular Arrecadação Tributária com Elasticidades Diferenciadas (Curva de Laffer)
  const updatedTaxes = taxes.map(t => {
    let baseFactor = 1.0;
    if (t.category === 'income') baseFactor = 0.28;
    else if (t.category === 'corporate') baseFactor = 0.18;
    else if (t.category === 'consumption') baseFactor = 0.35;
    else if (t.category === 'fuel') baseFactor = 0.08;
    else if (t.category === 'wealth') baseFactor = 0.03;
    else if (t.category === 'import') baseFactor = 0.08;

    // Alíquotas desproporcionais geram elisão ou retração de atividade
    const rateEfficiency = t.rate > 38 ? Math.max(0.65, 1 - (t.rate - 38) * 0.016) : 1.0;
    let computedRevenue = (gdp * baseFactor * (t.rate / 100)) * rateEfficiency;

    // Abater renúncia fiscal do Imposto Corporativo
    if (t.category === 'corporate') {
      computedRevenue = Math.max(4.0, computedRevenue - totalForegoneTaxBi);
    }

    return {
      ...t,
      revenue: Math.round(computedRevenue * 10) / 10
    };
  });

  const taxRevenue = updatedTaxes.reduce((acc, t) => acc + t.revenue, 0);

  // 3. Simular Empresas Estatais & Mistas (Vida Própria e Dividendos ao Tesouro)
  let soeDividendsTotal = 0;
  let soeOperatingLossCoveredByTreasury = 0;

  const updatedEnterprises = enterprises.map(ent => {
    // Verificar se o setor recebe subsídios do governo
    const sectorHasSubsidy = sectorSubsidies.some(s => s.active && s.sector === ent.sector);
    const subsidyBoost = sectorHasSubsidy ? 1.05 : 1.0;

    // Receita reage ao PIB e competitividade
    const gdpGrowthFactor = 1 + (prevEconomy.gdpGrowth / 100) * 0.8;
    const newRevenue = Math.round(ent.annualRevenue * gdpGrowthFactor * subsidyBoost * 10) / 10;

    // Margem líquida orientada por governança e eficiência
    let margin = 0.08;
    if (ent.governance === 'commercial') margin = (ent.efficiency / 100) * 0.18;
    else if (ent.governance === 'strategic_public') margin = (ent.efficiency / 100) * 0.06; // Foco em preço acessível
    else margin = (ent.efficiency / 100) * 0.16;

    // Custo de dívida impactado pelos juros do Banco Central
    const debtCost = ent.debt * (prevEconomy.interestRate / 100) * 0.2;
    let newProfit = Math.round((newRevenue * margin - debtCost) * 10) / 10;

    // Dinâmica autônoma de emprego e investimentos
    let empDeltaPercent = (prevEconomy.gdpGrowth - 1.2) * 0.6;
    if (ent.governance === 'strategic_public') empDeltaPercent += 0.5; // Maior retenção de pessoal
    const empDelta = Math.round(ent.employees * (empDeltaPercent / 100));
    const newEmployees = Math.max(3000, ent.employees + empDelta);

    // Dividendos distribuídos ao Tesouro Nacional
    let dividendsPaidToTreasury = 0;
    if (newProfit > 0 && ent.stateStake > 0) {
      const yieldPercent = (ent.dividendYield || 30) / 100;
      dividendsPaidToTreasury = Math.round(newProfit * (ent.stateStake / 100) * yieldPercent * 0.5 * 100) / 100;
      soeDividendsTotal += dividendsPaidToTreasury;
    } else if (newProfit < 0 && ent.stateStake === 100 && ent.governance === 'strategic_public') {
      // Se estatal estratégica opera no vermelho, Tesouro aporta cobertura
      soeOperatingLossCoveredByTreasury += Math.abs(newProfit) * 0.5;
    }

    // Ação autônoma da diretoria da empresa
    let actionSummary = '';
    if (newProfit > 2.0 && prevEconomy.gdpGrowth > 1.5) {
      actionSummary = 'Diretoria aprovou plano de expansão com reinvestimento de lucros em tecnologia e novas plantas.';
    } else if (prevEconomy.interestRate > 12.0 && ent.debt > 10.0) {
      actionSummary = 'Gestão financeira priorizou corte de despesas de custeio e renegociação de dívidas para preservar caixa.';
    } else if (sectorHasSubsidy) {
      actionSummary = 'Empresa repassou incentivo governamental para manter tarifas moderadas e expandir atendimento.';
    } else {
      actionSummary = 'Operações estáveis com manutenção do cronograma regular de fornecimento e serviços.';
    }

    // Atualizar Valuation estimada
    const valuationMultiplier = ent.ownership === 'private' ? 8.5 : ent.ownership === 'mixed' ? 7.0 : 5.5;
    const newValuation = Math.max(5.0, Math.round((newRevenue * 1.2 + Math.max(0, newProfit) * valuationMultiplier) * 10) / 10);

    return {
      ...ent,
      annualRevenue: newRevenue,
      annualProfit: newProfit,
      employees: newEmployees,
      dividendsPaidToTreasury,
      valuationBi: newValuation,
      autonomousActionSummary: actionSummary
    };
  });

  // Arrecadação total: tributária + dividendos de estatais
  soeDividendsTotal = Math.round(soeDividendsTotal * 10) / 10;
  const totalRevenue = Math.round((taxRevenue + soeDividendsTotal) * 10) / 10;

  // 4. Custos de Programas Sociais
  const socialProgramsCost = socialPrograms
    .filter(p => p.active)
    .reduce((acc, p) => acc + p.annualCost, 0);

  // 5. Custos de Subsídios Setoriais Ativos
  const activeSubsidies = sectorSubsidies.filter(s => s.active && s.semestersRemaining > 0);
  const totalSubsidiesCost = activeSubsidies.reduce((acc, s) => acc + s.budgetBi, 0);

  // Atualizar contadores de semestres dos subsídios
  const updatedSectorSubsidies = sectorSubsidies.map(s => {
    if (!s.active) return s;
    const remaining = s.semestersRemaining - 1;
    return {
      ...s,
      semestersRemaining: Math.max(0, remaining),
      active: remaining > 0
    };
  });

  // Atualizar contadores de semestres dos incentivos fiscais
  const updatedFiscalIncentives = fiscalIncentives.map(inc => {
    if (!inc.active) return inc;
    const remaining = inc.semestersRemaining - 1;
    return {
      ...inc,
      semestersRemaining: Math.max(0, remaining),
      active: remaining > 0
    };
  });

  // 6. Despesas do Orçamento
  const baseBudgetSpending = budget.categories.reduce((acc, c) => acc + c.amount, 0);
  const primarySpending = baseBudgetSpending + socialProgramsCost + totalSubsidiesCost + soeOperatingLossCoveredByTreasury;

  // Juros da dívida pública
  const debtInValue = gdp * (prevEconomy.publicDebt / 100);
  const debtInterestCost = Math.round((debtInValue * (prevEconomy.interestRate / 100) * 0.5) * 10) / 10;

  const totalSpending = primarySpending + debtInterestCost;
  const primaryBalance = Math.round((totalRevenue - primarySpending) * 10) / 10;
  const nominalBalance = Math.round((totalRevenue - totalSpending) * 10) / 10;

  const updatedBudget: Budget = {
    ...budget,
    totalRevenue,
    totalSpending: Math.round(totalSpending * 10) / 10,
    primaryBalance,
    nominalBalance,
    debtInterestCost,
    categories: budget.categories.map(cat => ({
      ...cat,
      percentOfTotal: Math.round((cat.amount / totalSpending) * 1000) / 10
    }))
  };

  // 7. Nova Dívida Pública (% do PIB)
  const deficitNominal = -nominalBalance;
  const newDebtNominal = Math.max(0, debtInValue + deficitNominal);

  // 8. Agências Reguladoras & Confiança Empresarial
  const avgAgencyConfidence = regulatoryAgencies.length > 0 
    ? regulatoryAgencies.reduce((acc, a) => acc + a.marketConfidence, 0) / regulatoryAgencies.length 
    : 75;

  const updatedRegulatoryAgencies = regulatoryAgencies.map(a => {
    // Autonomia independente melhora estabilidade regulatória; controle político diminui previsibilidade
    let newMarketConfidence = a.marketConfidence;
    if (a.autonomyLevel === 'independent') newMarketConfidence = Math.min(95, newMarketConfidence + 1);
    else if (a.autonomyLevel === 'presidential_control') newMarketConfidence = Math.max(45, newMarketConfidence - 2);

    return {
      ...a,
      marketConfidence: newMarketConfidence
    };
  });

  // 9. Investimento Público vs Privado (Crowding-in vs Crowding-out)
  const infraSpending = budget.categories.find(c => c.id === 'infrastructure')?.amount || 10;
  const publicInvestmentRate = Math.round(((infraSpending + 4.0) / gdp) * 100 * 10) / 10; // ~3.3% do PIB

  const corpTax = taxes.find(t => t.category === 'corporate')?.rate || 25;
  const consumptionTax = taxes.find(t => t.category === 'consumption')?.rate || 21;

  // Crowding-in: infraestrutura pública de qualidade multiplica a produtividade privada
  const crowdingInEffect = Math.min(2.0, (publicInvestmentRate - 2.5) * 0.6);

  // Crowding-out: dívida explosiva acima de 80% e juros altos secam o crédito para empresas
  const crowdingOutEffect = prevEconomy.publicDebt > 80 ? (prevEconomy.publicDebt - 80) * 0.08 : 0;
  const interestDrag = (prevEconomy.interestRate > 11) ? (prevEconomy.interestRate - 11) * 0.18 : -0.2;

  // Confiança empresarial: alimentada por estabilidade de agências, juros civilizados e impostos competitivos
  let newBusinessConfidence = Math.round(
    50 + (avgAgencyConfidence - 70) * 0.4 - (corpTax - 25) * 0.8 - (prevEconomy.interestRate - 11) * 1.2 - crowdingOutEffect * 2.0
  );
  newBusinessConfidence = Math.max(25, Math.min(95, newBusinessConfidence));

  // Confiança do consumidor: renda, desemprego e inflação
  let newConsumerConfidence = Math.round(
    52 - (prevEconomy.unemployment - 12) * 1.2 - (prevEconomy.inflation - 8) * 1.5 - (consumptionTax - 20) * 0.6
  );
  newConsumerConfidence = Math.max(20, Math.min(90, newConsumerConfidence));

  // Taxa de investimento privado
  let privateInvestmentRate = 11.2 + (50 - corpTax) * 0.12 + (newBusinessConfidence - 50) * 0.08 + crowdingInEffect - crowdingOutEffect - interestDrag;
  if (activeIncentives.length > 0) {
    privateInvestmentRate += Math.min(2.5, activeIncentives.length * 0.6);
  }
  privateInvestmentRate = Math.max(6.0, Math.min(22.0, Math.round(privateInvestmentRate * 10) / 10));

  const totalInvestmentRate = Math.round((publicInvestmentRate + privateInvestmentRate) * 10) / 10;

  // 10. Crescimento do PIB (Interação Dinâmica)
  const fiscalImpulse = (nominalBalance < 0) ? Math.min(0.8, Math.abs(nominalBalance) * 0.035) : -0.2;
  const privateInvestmentBoost = (privateInvestmentRate - 11.0) * 0.25;

  let gdpGrowth = prevEconomy.gdpGrowth + (fiscalImpulse + privateInvestmentBoost - interestDrag + crowdingInEffect * 0.3) * 0.35;
  gdpGrowth = Math.max(-4.5, Math.min(6.5, Math.round(gdpGrowth * 10) / 10));

  const newGdp = Math.round((gdp * (1 + (gdpGrowth / 100) * 0.5)) * 10) / 10;
  const newPublicDebt = Math.round((newDebtNominal / newGdp) * 1000) / 10;

  // 11. Inflação (Amortecida por Subsídios e Eletricidade)
  let subsidyInflationRelief = 0;
  activeSubsidies.forEach(s => {
    if (s.sector === 'transport' || s.sector === 'oil_gas' || s.sector === 'energy') {
      subsidyInflationRelief += 0.4;
    }
  });

  const consumptionTaxShock = (consumptionTax - 21) * 0.25;
  let inflationDelta = (deficitNominal > 6 ? 0.35 : -0.25) - (prevEconomy.interestRate - 9) * 0.16 + consumptionTaxShock - subsidyInflationRelief;
  let newInflation = Math.max(1.8, Math.min(25.0, prevEconomy.inflation + inflationDelta));
  newInflation = Math.round(newInflation * 10) / 10;

  // 12. Banco Central (Reação à Meta de Inflação)
  let newInterestRate = prevEconomy.interestRate;
  if (newInflation > 6.0) {
    newInterestRate = Math.min(18.5, newInterestRate + 0.5);
  } else if (newInflation < 4.5 && newInterestRate > 7.5) {
    newInterestRate = Math.max(6.0, newInterestRate - 0.5);
  }
  newInterestRate = Math.round(newInterestRate * 100) / 100;

  // 13. Desemprego
  let unemploymentDelta = -(gdpGrowth - 1.8) * 0.38;
  if (activeIncentives.length > 0) {
    unemploymentDelta -= 0.2;
  }
  let newUnemployment = Math.max(4.5, Math.min(22.0, prevEconomy.unemployment + unemploymentDelta));
  newUnemployment = Math.round(newUnemployment * 10) / 10;

  // 14. Balança Comercial & Utilização de Capacidade
  const exportEnterprises = updatedEnterprises.filter(e => e.exportShare > 30);
  const totalExports = exportEnterprises.reduce((acc, e) => acc + (e.annualRevenue * (e.exportShare / 100)), 0);
  const tradeBalance = Math.round((totalExports * 0.35 + (gdpGrowth > 3 ? -2.0 : 1.5)) * 10) / 10;

  const capacityUtilization = Math.max(60, Math.min(94, Math.round(76.5 + (gdpGrowth * 1.5) + (newBusinessConfidence - 50) * 0.1)));

  const newEconomy: Economy = {
    ...prevEconomy,
    gdp: newGdp,
    gdpGrowth,
    inflation: newInflation,
    unemployment: newUnemployment,
    interestRate: newInterestRate,
    publicDebt: newPublicDebt,
    investmentRate: totalInvestmentRate,
    privateInvestmentRate,
    publicInvestmentRate,
    businessConfidence: newBusinessConfidence,
    consumerConfidence: newConsumerConfidence,
    capacityUtilization,
    tradeBalance
  };

  return {
    newEconomy,
    updatedTaxes,
    updatedBudget,
    updatedEnterprises,
    updatedSectorSubsidies,
    updatedFiscalIncentives,
    updatedRegulatoryAgencies,
    soeDividendsTotal
  };
}
