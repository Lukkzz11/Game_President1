import type { SocialGroup, Economy, Tax, Budget, SocialProgram } from '@/game/types';

export function simulateSocialGroups(
  groups: SocialGroup[],
  economy: Economy,
  taxes: Tax[],
  budget: Budget,
  socialPrograms: SocialProgram[]
): SocialGroup[] {
  const corpTax = taxes.find(t => t.category === 'corporate')?.rate || 25;
  const consumptionTax = taxes.find(t => t.category === 'consumption')?.rate || 20;
  const incomeTax = taxes.find(t => t.category === 'income')?.rate || 22.5;

  const healthBudget = budget.categories.find(c => c.id === 'health')?.amount || 20;
  const eduBudget = budget.categories.find(c => c.id === 'education')?.amount || 20;
  const secBudget = budget.categories.find(c => c.id === 'security')?.amount || 15;
  const infraBudget = budget.categories.find(c => c.id === 'infrastructure')?.amount || 10;
  const adminBudget = budget.categories.find(c => c.id === 'administration')?.amount || 14;

  const activeProgramsCount = socialPrograms.filter(p => p.active).length;
  const socialProgramsBudget = socialPrograms.filter(p => p.active).reduce((sum, p) => sum + p.annualCost, 0);

  return groups.map(group => {
    let delta = 0;

    // Efeito comum: inflação descontrolada corrói poder de compra de todos
    if (economy.inflation > 10.0) delta -= (economy.inflation - 10.0) * 0.4;
    else if (economy.inflation < 5.0) delta += 1.5;

    // Efeito específico por grupo
    switch (group.id) {
      case 'workers':
        if (economy.unemployment > 12) delta -= (economy.unemployment - 12) * 0.6;
        else if (economy.unemployment < 8) delta += 2.0;
        if (consumptionTax > 22) delta -= (consumptionTax - 22) * 0.4;
        if (socialProgramsBudget > 15) delta += 2.0;
        break;

      case 'business':
        if (corpTax > 25) delta -= (corpTax - 25) * 0.7;
        else if (corpTax < 22) delta += (22 - corpTax) * 0.8;
        if (economy.interestRate > 12) delta -= (economy.interestRate - 12) * 0.5;
        if (economy.gdpGrowth > 2.0) delta += (economy.gdpGrowth - 2.0) * 0.8;
        if (budget.nominalBalance < -15) delta -= 2.0; // Desconfiança fiscal
        break;

      case 'middle_class':
        if (incomeTax > 24) delta -= (incomeTax - 24) * 0.5;
        if (secBudget > 16) delta += 1.5;
        if (eduBudget > 22) delta += 1.5;
        if (healthBudget > 24) delta += 1.5;
        if (economy.unemployment > 13) delta -= 1.5;
        break;

      case 'low_income':
        if (activeProgramsCount > 0) delta += activeProgramsCount * 2.5 + (socialProgramsBudget * 0.15);
        if (economy.inflation > 9) delta -= (economy.inflation - 9) * 0.6;
        if (healthBudget < 20) delta -= 2.0;
        break;

      case 'agribusiness':
        if (infraBudget > 14) delta += (infraBudget - 14) * 0.5;
        if (taxes.find(t => t.category === 'import')?.rate || 0 > 20) delta -= 1.0;
        break;

      case 'civil_servants':
        if (adminBudget >= 14) delta += (adminBudget - 14) * 0.4;
        else delta -= (14 - adminBudget) * 0.8;
        break;

      case 'students_youth':
        if (eduBudget > 22) delta += (eduBudget - 22) * 0.5;
        if (economy.unemployment > 14) delta -= (economy.unemployment - 14) * 0.6;
        break;

      default:
        break;
    }

    // Limites de aprovação entre 5% e 95%
    const newApproval = Math.max(5, Math.min(95, Math.round((group.approval + delta) * 10) / 10));

    return {
      ...group,
      approval: newApproval
    };
  });
}
