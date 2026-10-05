import type { 
  GameState, 
  DelayedConsequence, 
  Economy, 
  Budget, 
  Tax, 
  SocialGroup, 
  News 
} from '@/game/types';

/**
 * Avalia as políticas do turno atual e agenda impactos tardios (Delayed Consequences)
 * de acordo com o GDD Seção 44 (Consequências de Longo Prazo).
 */
export function queueNewDelayedConsequences(
  currentTurn: number,
  prevConsequences: DelayedConsequence[],
  economy: Economy,
  budget: Budget,
  taxes: Tax[],
  porkSpent: number
): DelayedConsequence[] {
  const newQueue: DelayedConsequence[] = [...prevConsequences];

  // 1. Corte em Infraestrutura (Corte no Turno T -> Colapso logístico no Turno T+2)
  const infraBudget = budget.categories.find(c => c.id === 'infrastructure')?.amount || 10;
  if (infraBudget < 8 && !newQueue.some(c => c.id.startsWith('delay_infra_collapse'))) {
    newQueue.push({
      id: `delay_infra_collapse_${currentTurn}`,
      source: `Corte Crítico no Orçamento de Infraestrutura (Turno ${currentTurn})`,
      triggerTurn: currentTurn + 2,
      title: "Sucateamento da Malha Rodoviária e Colapso Logístico",
      description: "Dois anos após os cortes de verbas na manutenção de estradas federais, pontes e rodovias críticas colapsaram, gerando filas quilométricas de caminhões e aumento nos custos de frete do agronegócio.",
      gdpImpact: -0.7,
      inflationImpact: 0.8,
      popularityImpact: -8,
      socialGroupImpacts: { agribusiness: -12, business: -10, workers: -6 }
    });
  }

  // 2. Forte Investimento em Infraestrutura (> 16 bi) -> Boom Logístico no Turno T+2
  if (infraBudget >= 18 && !newQueue.some(c => c.id.startsWith('delay_infra_boom'))) {
    newQueue.push({
      id: `delay_infra_boom_${currentTurn}`,
      source: `Aporte Histórico em Obras e Ferrovias (Turno ${currentTurn})`,
      triggerTurn: currentTurn + 2,
      title: "Inauguração dos Novos Eixos Logísticos e Salto de Competitividade",
      description: "A maturação das obras federais duplicadas permitiu escoamento recorde da safra aos portos, barateando fretes e atraindo montadoras internacionais.",
      gdpImpact: 1.1,
      unemploymentImpact: -0.8,
      popularityImpact: 7,
      socialGroupImpacts: { agribusiness: 14, business: 10, workers: 6 }
    });
  }

  // 3. Corte em Saúde Pública (< 17 bi) -> Crise Sanitária no Turno T+2
  const healthBudget = budget.categories.find(c => c.id === 'health')?.amount || 20;
  if (healthBudget < 16 && !newQueue.some(c => c.id.startsWith('delay_health_crisis'))) {
    newQueue.push({
      id: `delay_health_crisis_${currentTurn}`,
      source: `Contingenciamento de Recursos da Saúde (Turno ${currentTurn})`,
      triggerTurn: currentTurn + 2,
      title: "Superlotação Extrema nos Hospitais e Crise Sanitária Regional",
      description: "A falta continuada de insumos básicos e leitos de UTI gerou paralisação de médicos e revolta de famílias em filas de atendimento nas capitais.",
      popularityImpact: -11,
      socialGroupImpacts: { low_income: -15, workers: -10, middle_class: -8 }
    });
  }

  // 4. Corte em Educação (< 16 bi) -> Greve Geral das Universidades
  const eduBudget = budget.categories.find(c => c.id === 'education')?.amount || 20;
  if (eduBudget < 16 && !newQueue.some(c => c.id.startsWith('delay_edu_strike'))) {
    newQueue.push({
      id: `delay_edu_strike_${currentTurn}`,
      source: `Redução de Verbas do Ensino Superior e Básico (Turno ${currentTurn})`,
      triggerTurn: currentTurn + 2,
      title: "Greve Nacional de Professores e Marchas Estudantis",
      description: "Centros acadêmicos e sindicatos do magistério deflagram greve nacional por tempo indeterminado exigindo recomposição de orçamento.",
      popularityImpact: -6,
      socialGroupImpacts: { students_youth: -20, civil_servants: -12 }
    });
  }

  // 5. Imposto Corporativo Excessivo (> 30%) -> Desindustrialização
  const corpTax = taxes.find(t => t.category === 'corporate')?.rate || 25;
  if (corpTax > 30 && !newQueue.some(c => c.id.startsWith('delay_capital_flight'))) {
    newQueue.push({
      id: `delay_capital_flight_${currentTurn}`,
      source: `Tributação Corporativa Elevada (Alíquota de ${corpTax}%)`,
      triggerTurn: currentTurn + 2,
      title: "Deslocalização Industrial e Fuga de Investimento Produtivo",
      description: "Duas grandes multinacionais do setor automotivo e químico anunciaram o fechamento de fábricas locais e transferência de plantas para países vizinhos.",
      gdpImpact: -0.9,
      unemploymentImpact: 1.2,
      socialGroupImpacts: { business: -15, workers: -8 }
    });
  }

  // 6. Abuso de Emendas Parlamentares / Pork Barrel (> 6.0 bi acumulados)
  if (porkSpent >= 6.0 && !newQueue.some(c => c.id.startsWith('delay_pork_scandal'))) {
    newQueue.push({
      id: `delay_pork_scandal_${currentTurn}`,
      source: `Volumes Desproporcionais de Emendas de Relator (R$ ${porkSpent} bi)`,
      triggerTurn: currentTurn + 1,
      title: "Operação Orçamento Secreto: Mandados de Busca no Congresso",
      description: "Ministério Público Federal deflagra operação contra desvio de emendas parlamentares liberadas pelo Executivo para comprar apoio legislativo.",
      popularityImpact: -12,
      socialGroupImpacts: { middle_class: -14, civil_servants: -8 }
    });
  }

  return newQueue;
}

/**
 * Processa as consequências que atingiram o turno atual,
 * aplicando seus efeitos cumulativos na economia e opinião pública.
 */
export function processTriggeredConsequences(
  currentTurn: number,
  queue: DelayedConsequence[],
  currentEconomy: Economy,
  currentSocialGroups: SocialGroup[]
): {
  remainingQueue: DelayedConsequence[];
  triggeredConsequences: DelayedConsequence[];
  updatedEconomy: Economy;
  updatedSocialGroups: SocialGroup[];
  newsItems: News[];
} {
  const triggered = queue.filter(c => c.triggerTurn <= currentTurn);
  const remainingQueue = queue.filter(c => c.triggerTurn > currentTurn);

  let updatedEconomy = { ...currentEconomy };
  let updatedSocialGroups = [...currentSocialGroups];
  const newsItems: News[] = [];

  for (const c of triggered) {
    if (c.gdpImpact) {
      updatedEconomy.gdpGrowth = Math.round((updatedEconomy.gdpGrowth + c.gdpImpact) * 10) / 10;
    }
    if (c.inflationImpact) {
      updatedEconomy.inflation = Math.max(1.5, Math.round((updatedEconomy.inflation + c.inflationImpact) * 10) / 10);
    }
    if (c.unemploymentImpact) {
      updatedEconomy.unemployment = Math.max(3.5, Math.round((updatedEconomy.unemployment + c.unemploymentImpact) * 10) / 10);
    }

    if (c.socialGroupImpacts) {
      updatedSocialGroups = updatedSocialGroups.map(g => {
        const delta = c.socialGroupImpacts![g.id];
        if (delta !== undefined) {
          return {
            ...g,
            approval: Math.max(5, Math.min(95, g.approval + delta))
          };
        }
        return g;
      });
    }

    newsItems.push({
      id: `news_delay_${c.id}`,
      outletId: 'press_diario',
      headline: `IMPACTO ESTRUTURAL: ${c.title}`,
      summary: `${c.description} [Consequência acumulada de: ${c.source}]`,
      sentiment: (c.gdpImpact && c.gdpImpact > 0) ? 'positive' : 'negative',
      turn: currentTurn,
      relatedCategory: 'consequencia_tardia'
    });
  }

  return {
    remainingQueue,
    triggeredConsequences: triggered,
    updatedEconomy,
    updatedSocialGroups,
    newsItems
  };
}
