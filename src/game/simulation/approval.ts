import type { SocialGroup, PollResult, Party } from '@/game/types';

export function simulateApproval(
  groups: SocialGroup[],
  allParties: Party[],
  playerPartyId: string,
  playerName: string,
  currentDate: string
): {
  overallApproval: number;
  overallDisapproval: number;
  poll: PollResult;
} {
  // Média ponderada pela população de cada grupo social
  const totalWeight = groups.reduce((acc, g) => acc + g.populationShare, 0);
  const weightedApproval = groups.reduce((acc, g) => acc + g.approval * g.populationShare, 0) / (totalWeight || 1);

  const overallApproval = Math.round(weightedApproval * 10) / 10;
  const neutralShare = 15; // 15% indecisos / regular
  const overallDisapproval = Math.max(0, Math.round((100 - overallApproval - neutralShare) * 10) / 10);

  // Estimativa de votos se eleição fosse hoje
  const playerVoteShare = Math.max(12, Math.min(65, Math.round((overallApproval * 0.75 + 10) * 10) / 10));
  const remainingVotes = 100 - playerVoteShare;

  const rivalParties = allParties.filter(p => p.id !== playerPartyId);
  const totalRivalPop = rivalParties.reduce((acc, p) => acc + p.popularity, 0) || 1;

  const candidateNames: Record<string, string> = {
    alp: 'Gabriel Montezuma',
    msd: 'Helena Alencastro',
    por: 'Coronel Brandão',
    ptp: 'Rogério Medeiros',
    fpn: 'Álvaro Sampaio',
    bci: 'Dep. Neves Ribeiro'
  };

  const ifElectionToday = [
    {
      partyName: allParties.find(p => p.id === playerPartyId)?.name || 'Partido do Governo',
      candidateName: playerName,
      percentage: playerVoteShare
    },
    ...rivalParties.map(p => ({
      partyName: p.name,
      candidateName: candidateNames[p.id] || `Líder do ${p.acronym}`,
      percentage: Math.round(((p.popularity / totalRivalPop) * remainingVotes) * 10) / 10
    }))
  ];

  const poll: PollResult = {
    date: currentDate,
    governmentApproval: overallApproval,
    governmentDisapproval: overallDisapproval,
    ifElectionToday
  };

  return {
    overallApproval,
    overallDisapproval,
    poll
  };
}
