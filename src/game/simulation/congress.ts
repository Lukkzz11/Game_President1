import type { Congress, Law, Party, CongressAmendment } from '@/game/types';

export function simulateCongressTurn(
  prevCongress: Congress,
  presidentialApproval: number,
  allParties: Party[]
): Congress {
  // A popularidade do presidente atrai deputados do centro fisiológico (BCI) e independentes
  let relationship = prevCongress.presidentRelationship;
  if (presidentialApproval > 50) {
    relationship = Math.min(95, relationship + 3.0);
  } else if (presidentialApproval < 35) {
    relationship = Math.max(15, relationship - 3.5);
  }

  // Recalcular base aliada
  let coalitionCount = 0;
  let oppositionCount = 0;
  let independentCount = 0;

  const updatedParties = prevCongress.parties.map(p => {
    let currentStance = p.stanceToPresident;
    if (p.partyId === 'bci') {
      if (relationship > 55) currentStance = 'coalition';
      else if (relationship < 38) currentStance = 'opposition';
      else currentStance = 'independent';
    }

    if (currentStance === 'coalition') coalitionCount += p.seats;
    else if (currentStance === 'opposition') oppositionCount += p.seats;
    else independentCount += p.seats;

    return {
      ...p,
      stanceToPresident: currentStance
    };
  });

  return {
    ...prevCongress,
    presidentRelationship: Math.round(relationship * 10) / 10,
    coalitionSeats: coalitionCount,
    oppositionSeats: oppositionCount,
    independentSeats: independentCount,
    parties: updatedParties
  };
}

/**
 * Gera emendas parlamentares dinâmicas de acordo com os artigos específicos da lei
 * e a composição de forças políticas no Congresso Nacional.
 */
export function generateDynamicAmendments(law: Law, congress: Congress): CongressAmendment[] {
  const amendments: CongressAmendment[] = [];
  const articles = law.articles || [];

  if (articles.length >= 2) {
    // 1. Emenda Modificativa (focada no Artigo 1º ou 3º - Escopo ou Beneficiários)
    const art1 = articles[0];
    const art1Text = art1 ? art1.text : "Dispositivo inicial do programa";
    const modVotesFavor = Math.min(500, Math.max(160, Math.round(congress.oppositionSeats * 0.9 + congress.independentSeats * 0.65 + Math.random() * 25)));
    const modVotesAgainst = 513 - modVotesFavor;

    amendments.push({
      id: `amend_${law.id}_mod_art1`,
      type: 'modificativa',
      title: "Emenda Modificativa nº 01/Relator (Art. 1º)",
      targetArticleNumber: 1,
      originalArticleText: art1Text,
      proposedArticleText: `${art1Text.replace(/\.$/, '')}, restringindo-se aos municípios com mais de 300 mil habitantes e famílias com renda per capita de até 1 salário mínimo.`,
      sponsorParty: "BCI / PSD (Centro)",
      sponsorFaction: "Comissão de Constituição e Justiça",
      sponsorName: "Dep. Arnaldo Silveira",
      description: "Altera o Art. 1º para limitar o escopo aos grandes centros urbanos e famílias de extrema vulnerabilidade, contendo o impacto financeiro.",
      impactSummary: "Reduz o custo anual em ~30%, mas diminui a aprovação popular entre as classes médias e pequenas cidades.",
      budgetChangeModifier: 0.7,
      effectivenessModifier: 0.75,
      approvalChanceModifier: 40,
      status: modVotesFavor >= 257 ? 'approved_by_congress' : 'rejected_by_congress',
      votesFavor: modVotesFavor,
      votesAgainst: modVotesAgainst
    });

    // 2. Emenda Supressiva/Modificativa (focada no Artigo 2º - Financiamento e Rateio)
    const art2 = articles[1];
    const art2Text = art2 ? art2.text : "Dispositivo de financiamento público";
    const supVotesFavor = Math.min(500, Math.max(160, Math.round(congress.oppositionSeats * 0.75 + congress.independentSeats * 0.7 + Math.random() * 30)));
    const supVotesAgainst = 513 - supVotesFavor;

    amendments.push({
      id: `amend_${law.id}_sup_art2`,
      type: 'supressiva',
      title: "Emenda de Bancada nº 02 (Art. 2º - Financiamento Federativo)",
      targetArticleNumber: 2,
      originalArticleText: art2Text,
      proposedArticleText: "Art. 2º Os custos do programa serão compartilhados na proporção de 60% pelo Tesouro Nacional e 40% pelos orçamentos estaduais e municipais aderentes.",
      sponsorParty: "Frente Parlamentar dos Estados e Municípios",
      sponsorFaction: "Bancada Regionalista",
      sponsorName: "Dep. Marlene Vasconcelos",
      description: "Descentraliza as despesas: retira a obrigatoriedade exclusiva da União e impõe contrapartida de Estados e Municípios.",
      impactSummary: "Alivia o orçamento federal em R$ 4 a 8 bilhões anuais, mas gera pressão severa de Governadores e Prefeitos.",
      budgetChangeModifier: 0.65,
      effectivenessModifier: 0.8,
      approvalChanceModifier: 35,
      status: supVotesFavor >= 257 ? 'approved_by_congress' : 'rejected_by_congress',
      votesFavor: supVotesFavor,
      votesAgainst: supVotesAgainst
    });

    // 3. Emenda Aditiva / Jabuti Paroquial (Novo Artigo das Bancadas)
    const newArtNum = articles.length + 1;
    const jabutiVotesFavor = Math.min(500, Math.max(190, Math.round(congress.independentSeats * 0.85 + congress.coalitionSeats * 0.45 + Math.random() * 25)));
    const jabutiVotesAgainst = 513 - jabutiVotesFavor;

    amendments.push({
      id: `amend_${law.id}_jabuti_art_new`,
      type: 'jabuti',
      title: `Emenda Aditiva nº 03 (Jabuti Paroquial - Art. ${newArtNum}º)`,
      targetArticleNumber: newArtNum,
      proposedArticleText: `Art. ${newArtNum}º Fica autorizada a destinação de até 12% dos recursos do programa para fundos municipais de desenvolvimento regional indicados por emendas de comissão.`,
      sponsorParty: "BCI (Centrão)",
      sponsorFaction: "Lideranças Partidárias",
      sponsorName: "Dep. Valdemar Prado",
      description: "Inserção de dispositivo corporativo garantindo repasse direto para bases eleitorais dos parlamentares como condição para destravar apoio.",
      impactSummary: "Aumenta o gasto anual em R$ 2.0 bi e eleva a corrupção percebida, mas atrai ~45 votos imediatos do plenário.",
      budgetChangeModifier: 1.15,
      porkCost: 2.0,
      approvalChanceModifier: 55,
      status: jabutiVotesFavor >= 257 ? 'approved_by_congress' : 'rejected_by_congress',
      votesFavor: jabutiVotesFavor,
      votesAgainst: jabutiVotesAgainst
    });

  } else {
    // Para leis sem artigos detalhados: gerar emendas temáticas
    if (law.category === 'social' || law.category === 'health' || law.category === 'education') {
      amendments.push({
        id: `amend_${law.id}_fatiamento`,
        type: 'fatiamento',
        title: "Substitutivo do Relator: Fatiamento de Valores e Prazos",
        sponsorParty: "BCI / PSD",
        sponsorFaction: "Comissão Mista de Orçamento",
        description: "O relator corta o valor unitário do programa em 30% e limita a duração a 18 meses, exigindo nova reavaliação pelo Congresso.",
        impactSummary: `Custo orçamentário anual reduzido para R$ ${Math.round(law.costPerYear * 0.7 * 10) / 10} bi, porém o ganho de aprovação popular cai 40%.`,
        budgetChangeModifier: 0.7,
        effectivenessModifier: 0.7,
        approvalChanceModifier: 40,
        status: 'approved_by_congress',
        votesFavor: 295,
        votesAgainst: 218
      });

      amendments.push({
        id: `amend_${law.id}_jabuti`,
        type: 'jabuti',
        title: "Jabuti da Bancada: Reserva de Emendas Paroquiais",
        sponsorParty: "BCI (Centrão)",
        sponsorFaction: "Lideranças Partidárias",
        description: "Acrescenta artigo obrigando o Tesouro a repassar R$ 2.5 bi em emendas especiais diretamente para prefeituras de bases eleitorais de deputados.",
        impactSummary: "Custo anual acrescido de R$ 2.5 bi e aumenta a corrupção percebida, mas atrai 50 votos imediatos para a aprovação.",
        budgetChangeModifier: 1.15,
        porkCost: 2.5,
        approvalChanceModifier: 55,
        status: 'approved_by_congress',
        votesFavor: 308,
        votesAgainst: 205
      });
    } else {
      amendments.push({
        id: `amend_${law.id}_exemption`,
        type: 'jabuti',
        title: "Jabuti Setorial: Isenções e Regimes Especiais para Aliados",
        sponsorParty: "PLN / BCI",
        sponsorFaction: "Frente Parlamentar da Agropecuária e Indústria",
        description: "Insere artigo concedendo regime tributário privilegiado e isenção de taxas para cooperativas e grandes grupos logísticos.",
        impactSummary: "Reduz a arrecadação esperada em R$ 1.8 bi, mas pacifica o apoio das bancadas empresariais.",
        budgetChangeModifier: 0.9,
        porkCost: 1.8,
        approvalChanceModifier: 45,
        status: 'approved_by_congress',
        votesFavor: 284,
        votesAgainst: 229
      });
    }
  }

  return amendments;
}

/**
 * Avalia um projeto de lei submetido ao Congresso:
 * Considera quórum constitucional (PL: 257, PEC: 308, MPV: 257),
 * gera emendas parlamentares em votação nominal e define a situação do projeto.
 */
export function generateDirectBargains(law: Law): import('@/game/types').DirectParliamentarianBargain[] {
  return [
    {
      id: `bargain_${law.id}_1`,
      parliamentarianName: "Dep. Silva",
      party: "BCI (Centrão)",
      stateName: "Minas Gerais",
      demandType: 'pork_transfer',
      demandText: "Apoio sua reforma e trago minha bancada se você liberar R$ 1.2 bi em incentivos e verbas para o meu Estado.",
      fiscalCostBi: 1.2,
      votesOffered: 22,
      politicalCapitalCost: 4,
      status: 'pending'
    },
    {
      id: `bargain_${law.id}_2`,
      parliamentarianName: "Depª. Clarice Vasconcelos",
      party: "PLN (Liberal)",
      stateName: "São Paulo",
      demandType: 'tax_incentive',
      demandText: "Fechamos com o projeto se o Planalto incluir regime tributário simplificado para o comércio e pequenas empresas locais.",
      fiscalCostBi: 0.8,
      votesOffered: 16,
      politicalCapitalCost: 3,
      status: 'pending'
    }
  ];
}

export function evaluateLawInCongress(
  law: Law,
  congress: Congress,
  allParties: Party[],
  porkBargainAmount: number = 0
): {
  approved: boolean;
  votesInFavor: number;
  votesAgainst: number;
  proposedAmendments: CongressAmendment[];
  directBargains: import('@/game/types').DirectParliamentarianBargain[];
  status: Law['status'];
  analysisSummary: string;
} {
  const baseVotes = congress.coalitionSeats;
  const oppositionVotes = congress.oppositionSeats;
  const independentVotes = congress.independentSeats;

  // Quórum Constitucional exigido
  const quorumNeeded = law.propositionType === 'constitutional_amendment' ? 308 : 257;

  // Modificadores de Votação
  const relationshipBonus = (congress.presidentRelationship - 50) * 1.3;
  const costDrag = law.costPerYear > 10 ? -(law.costPerYear - 10) * 2.2 : 4;
  const popularDemandBonus = law.popularityImpact > 0 ? law.popularityImpact * 1.6 : -8;
  
  // Efeito da Liberação de Emendas Parlamentares (Articulação Política / Pork)
  const porkVoteBonus = Math.round(porkBargainAmount * 14);

  // Votos dos Independentes
  const independentFractionFavor = Math.max(
    0.1, 
    Math.min(0.92, 0.48 + (relationshipBonus + costDrag + popularDemandBonus) / 220)
  );
  const independentFavorVotes = Math.round(independentVotes * independentFractionFavor) + porkVoteBonus;

  let votesInFavor = Math.min(513, Math.max(35, Math.round(baseVotes + independentFavorVotes)));
  let votesAgainst = 513 - votesInFavor;

  // Gerar emendas parlamentares e negociações com líderes
  const proposedAmendments = generateDynamicAmendments(law, congress);
  const directBargains = law.directBargains && law.directBargains.length > 0 
    ? law.directBargains 
    : generateDirectBargains(law);

  let status: Law['status'] = 'draft';
  let analysisSummary = '';

  const approvedAmendmentsCount = proposedAmendments.filter(a => a.status === 'approved_by_congress').length;

  if (votesInFavor >= quorumNeeded) {
    if (approvedAmendmentsCount > 0) {
      status = 'amended_by_congress';
      analysisSummary = `O Plenário aprovou a matéria (${votesInFavor} favoráveis x ${votesAgainst} contrários), porém o texto final foi modificado por ${approvedAmendmentsCount} emendas do Congresso (Substitutivo do Relator). O autógrafo foi enviado ao Presidente para deliberação de Veto Parcial, Veto Total ou Sanção Integral.`;
    } else {
      status = 'approved_congress';
      analysisSummary = `Vitória acachapante do Poder Executivo! O texto original foi aprovado sem alterações por ${votesInFavor} votos contra ${votesAgainst}. Segue para sanção presidencial imediata.`;
    }
  } else {
    // Votação abaixo do quórum
    if (votesInFavor >= quorumNeeded - 45) {
      status = 'amended_by_congress';
      analysisSummary = `Resistência acirrada no plenário (${votesInFavor} favoráveis, faltavam ${quorumNeeded - votesInFavor} para o quórum de ${quorumNeeded}). A comissão suspendeu a votação final e anexou emendas pacificadoras para salvar o projeto em 2º turno. O Presidente pode ceder emendas orçamentárias ou negociar o texto.`;
    } else {
      status = 'rejected_congress';
      analysisSummary = `Proposição rejeitada pelo plenário da Câmara dos Deputados: obteve apenas ${votesInFavor} votos favoráveis, muito abaixo dos ${quorumNeeded} necessários.`;
    }
  }

  return {
    approved: votesInFavor >= quorumNeeded,
    votesInFavor,
    votesAgainst,
    proposedAmendments,
    directBargains,
    status,
    analysisSummary
  };
}
