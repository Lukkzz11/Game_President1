import type { SupremeCourtState, SupremeJustice, SupremeJusticeCandidate, Congress, ConstitutionRules } from '@/game/types';

export function simulateSupremeCourtTurn(
  prevState: SupremeCourtState,
  constitution: ConstitutionRules
): {
  updatedState: SupremeCourtState;
  newVacanciesCount: number;
  retiredJusticesNames: string[];
} {
  const retirementAge = constitution.supremeCourtRetirementAge || 75;
  const retiredJusticesNames: string[] = [];
  let newVacanciesCount = 0;

  // Cada semestre aumenta a idade dos ministros em 0.5 anos
  const updatedJustices: SupremeJustice[] = prevState.justices.map(justice => {
    if (justice.status !== 'active') return justice;

    const newAge = Math.round((justice.age + 0.5) * 10) / 10;

    // Atingiu a idade limite de aposentadoria compulsória
    if (newAge >= retirementAge) {
      retiredJusticesNames.push(justice.name);
      newVacanciesCount += 1;
      return {
        ...justice,
        age: newAge,
        status: 'retired',
        retirementDate: new Date().getFullYear().toString()
      };
    }

    return {
      ...justice,
      age: newAge
    };
  });

  const totalVacancies = prevState.vacancies + newVacanciesCount;

  return {
    updatedState: {
      ...prevState,
      justices: updatedJustices,
      vacancies: totalVacancies
    },
    newVacanciesCount,
    retiredJusticesNames
  };
}

/**
 * Simula a sabatina e votação de um candidato a ministro do Supremo Tribunal pelo Congresso
 */
export function voteCandidateConfirmation(
  candidate: SupremeJusticeCandidate,
  congress: Congress,
  constitution: ConstitutionRules
): {
  approved: boolean;
  votesInFavor: number;
  votesAgainst: number;
  requiredVotes: number;
  message: string;
} {
  const totalSeats = congress.totalSeats || 513;
  // Regra constitucional: maioria absoluta (257 votos) ou maioria qualificada
  const requiredVotes = constitution.supremeCourtConfirmationRequirement === 'three_fifths' 
    ? Math.ceil(totalSeats * 0.6) 
    : Math.floor(totalSeats / 2) + 1; // 257 votos

  // Fatores que compõem o voto dos parlamentares:
  // 1. Prestígio / Reputação e Integridade do candidato (senadores adoram juristas conceituados)
  const meritBonus = (candidate.reputation * 0.7) + (candidate.integrity * 0.5);

  // 2. Base aliada do Presidente no Congresso
  const coalitionBase = congress.coalitionSeats * 0.9;

  // 3. Rejeição da oposição a candidatos com alinhamento excessivo (suspeita de aparelhamento)
  let oppositionSupportFraction = 0.3; // oposição vota favorável a juristas neutros
  if (candidate.alignmentWithPresident > 80 && candidate.independence < 40) {
    // Aparelhamento gritante: oposição obstrui ferozmente
    oppositionSupportFraction = 0.05;
  } else if (candidate.independence > 75) {
    oppositionSupportFraction = 0.65;
  }

  const oppositionVotes = congress.oppositionSeats * oppositionSupportFraction;
  const independentVotes = congress.independentSeats * (candidate.reputation > 75 ? 0.75 : 0.45);

  const rawVotes = Math.round(coalitionBase + oppositionVotes + independentVotes + (meritBonus * 0.4));
  const votesInFavor = Math.min(totalSeats, Math.max(80, rawVotes));
  const votesAgainst = totalSeats - votesInFavor;

  const approved = votesInFavor >= requiredVotes;

  const message = approved
    ? `Indicação de ${candidate.name} APROVADA pelo Congresso com ${votesInFavor} votos favoráveis (mínimo exigido: ${requiredVotes}). O novo ministro tomará posse imediata.`
    : `Indicação de ${candidate.name} REJEITADA pelo Congresso. Obteve apenas ${votesInFavor} votos dos ${requiredVotes} necessários. O Presidente deve escolher outro candidato.`;

  return {
    approved,
    votesInFavor,
    votesAgainst,
    requiredVotes,
    message
  };
}

/**
 * Análise de constitucionalidade de uma lei ou medida pelo colegiado dos 11 ministros
 */
export function judgeLawConstitutionality(
  lawTitle: string,
  category: string,
  justices: SupremeJustice[]
): {
  ruling: 'constitutional' | 'unconstitutional' | 'partially_unconstitutional';
  votesFavor: number;
  votesAgainst: number;
  summary: string;
} {
  const activeJustices = justices.filter(j => j.status === 'active');
  let votesFavor = 0;
  let votesAgainst = 0;

  activeJustices.forEach(justice => {
    // Voto probabilístico baseado na filosofia e integridade do ministro
    let favorProbability = 0.65; // presunção de constitucionalidade das leis aprovadas no Congresso

    if (justice.legalPhilosophy === 'Garantista') {
      if (category === 'security') favorProbability = 0.35; // desconfia de endurecimento penal
      if (category === 'social') favorProbability = 0.85; // apoia direitos sociais
    } else if (justice.legalPhilosophy === 'Legalista Estrito') {
      if (category === 'economic') favorProbability = 0.8; // respeita rigor orçamentário
      if (category === 'social') favorProbability = 0.5;
    } else if (justice.legalPhilosophy === 'Ativista Social') {
      if (category === 'social') favorProbability = 0.95;
      if (category === 'economic') favorProbability = 0.4;
    }

    if (Math.random() < favorProbability) {
      votesFavor += 1;
    } else {
      votesAgainst += 1;
    }
  });

  let ruling: 'constitutional' | 'unconstitutional' | 'partially_unconstitutional' = 'constitutional';
  if (votesAgainst >= 6) {
    ruling = 'unconstitutional';
  } else if (votesAgainst === 5) {
    ruling = 'partially_unconstitutional';
  }

  const summary = ruling === 'constitutional'
    ? `O Plenário do Supremo Tribunal declarou a constitucionalidade da norma por ${votesFavor} votos a ${votesAgainst}.`
    : ruling === 'unconstitutional'
    ? `Por ${votesAgainst} votos a ${votesFavor}, o Supremo Tribunal julgou a lei inconstitucional por afronta aos preceitos da Carta Magna.`
    : `O Supremo modulou os efeitos da norma por ${votesFavor} a ${votesAgainst}, mantendo apenas parte de seus dispositivos.`;

  return {
    ruling,
    votesFavor,
    votesAgainst,
    summary
  };
}
