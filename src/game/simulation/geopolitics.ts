import type { WorldCountry, Ideology, PoliticalCharacter, CharacterPersonality } from '@/game/types';

const FIRST_NAMES = [
  'Gabriel', 'Mateo', 'Lucas', 'Julian', 'Santiago', 'Carlos', 'Diego', 'Alejandro',
  'Arthur', 'James', 'William', 'Benjamin', 'Thomas', 'Oliver', 'Henry', 'Alexander',
  'Heinrich', 'Friedrich', 'Wilhelm', 'Maximilian', 'Klaus', 'Stefan', 'Jürgen',
  'Élodie', 'Camille', 'Antoine', 'Guillaume', 'Laurent', 'Maxime', 'Sébastien',
  'Kenji', 'Hiroshi', 'Daiki', 'Kazuo', 'Ryota', 'Shinji',
  'Rajesh', 'Vikram', 'Anil', 'Sanjay', 'Arun', 'Dev',
  'Viktor', 'Dmitry', 'Mikhail', 'Alexei', 'Sergei', 'Igor',
  'Elena', 'Camila', 'Sophia', 'Isabella', 'Martina', 'Lucia', 'Chiara', 'Giulia', 'Eleanor', 'Sarah'
];

const LAST_NAMES = [
  'Albarracín', 'Benítez', 'Valenzuela', 'Restrepo', 'Morales', 'Silva', 'Santos', 'Ortega',
  'Vance', 'Sinclair', 'Jenkins', 'Sterling', 'Foster', 'Palmer', 'Hayes', 'Sullivan',
  'Vogel', 'Schmidt', 'Weber', 'Becker', 'Hoffmann', 'Schäfer', 'Koch',
  'Laurent', 'Mercier', 'Dupont', 'Moreau', 'Lefebvre', 'Bertrand',
  'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura',
  'Sharma', 'Patel', 'Verma', 'Gupta', 'Singh', 'Reddy',
  'Rostov', 'Ivanov', 'Kuznetsov', 'Smirnov', 'Popov', 'Sokolov',
  'Rossi', 'Ferrari', 'Esposito', 'Bianchi', 'Romano'
];

const PERSONALITIES: CharacterPersonality[] = [
  'conciliador', 'agressivo', 'populista', 'tecnocrata', 'liberal', 
  'conservador', 'progressista', 'nacionalista', 'pragmatico', 'moderado'
];

export function generateFictionalLeader(country: WorldCountry): PoliticalCharacter {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const fullName = `${firstName} ${lastName}`;
  const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
  const age = 42 + Math.floor(Math.random() * 28); // 42 a 70 anos

  const ideologies = [
    'Centro-Pragmático / Livre Comércio',
    'Social Democracia / Bem-Estar',
    'Liberal de Mercado / Austeridade',
    'Nacionalismo Soberano / Protecionismo',
    'Desenvolvimentismo Verde / Inovação'
  ];
  const chosenIdeology = ideologies[Math.floor(Math.random() * ideologies.length)];

  return {
    id: `leader_${country.id.toLowerCase()}_${Date.now()}`,
    name: fullName,
    age,
    role: country.politicalSystem === 'parliamentary' ? 'Primeiro-Ministro(a)' : 'Presidente',
    country: country.name,
    party: `Aliança ${chosenIdeology.split('/')[0].trim()}`,
    partyAcronym: `P${country.id.slice(0, 2)}`,
    ideology: chosenIdeology,
    personality,
    popularity: 45 + Math.floor(Math.random() * 30),
    competence: 70 + Math.floor(Math.random() * 25),
    integrity: 65 + Math.floor(Math.random() * 30),
    experience: 70 + Math.floor(Math.random() * 25),
    influence: 75 + Math.floor(Math.random() * 20),
    ambition: 70 + Math.floor(Math.random() * 25),
    loyalty: 60 + Math.floor(Math.random() * 30),
    negotiationSkill: 75 + Math.floor(Math.random() * 20),
    economicStance: chosenIdeology.includes('Liberal') ? 'liberal' : chosenIdeology.includes('Social') ? 'estatista' : 'misto',
    socialStance: chosenIdeology.includes('Social') ? 'progressista' : chosenIdeology.includes('Nacionalismo') ? 'conservador' : 'moderado',
    securityStance: chosenIdeology.includes('Nacionalismo') ? 'dura' : 'equilibrada',
    foreignPolicyStance: chosenIdeology.includes('Protecionismo') ? 'soberanista' : chosenIdeology.includes('Livre') ? 'globalista' : 'pragmatico',
    playerRelationship: Math.floor((Math.random() * 40) - 20)
  };
}

export type GeopoliticalTurnResult = {
  updatedCountries: WorldCountry[];
  internationalNews: { headline: string; summary: string; sentiment: 'positive' | 'warning' | 'negative' | 'neutral' }[];
  exportDemandMultiplier: number;
};

export function simulateGeopoliticsTurn(
  countries: WorldCountry[],
  playerIdeology: Ideology,
  turn: number
): GeopoliticalTurnResult {
  const news: GeopoliticalTurnResult['internationalNews'] = [];
  let totalGlobalGrowth = 0;

  const updatedCountries = countries.map(country => {
    if (country.id === 'BRA') return country; // O Brasil é governado pelo jogador

    const clone: WorldCountry = JSON.parse(JSON.stringify(country));

    // 1. Verificar Eleições Estrangeiras Autônomas
    if (turn >= clone.nextElectionTurn) {
      const isIncumbentDefeated = Math.random() < 0.65; // 65% de chance de alternância de poder

      if (isIncumbentDefeated) {
        const oldLeaderName = clone.leader.name;
        const newLeader = generateFictionalLeader(clone);
        clone.leader = newLeader;
        clone.rulingParty = newLeader.party;
        clone.governmentApproval = newLeader.popularity;

        // Ajuste diplomático com base na ideologia do jogador
        let relationshipDelta = 0;
        if (newLeader.personality === 'conciliador' || newLeader.foreignPolicyStance === 'globalista') {
          relationshipDelta += 10;
        } else if (newLeader.personality === 'agressivo' || newLeader.foreignPolicyStance === 'soberanista') {
          relationshipDelta -= 12;
        }

        clone.diplomaticRelation.relationshipScore = Math.max(-100, Math.min(100, clone.diplomaticRelation.relationshipScore + relationshipDelta));
        
        // Atualizar status diplomático conforme novo score
        if (clone.diplomaticRelation.relationshipScore >= 70) clone.diplomaticRelation.status = 'allied';
        else if (clone.diplomaticRelation.relationshipScore >= 35) clone.diplomaticRelation.status = 'friendly';
        else if (clone.diplomaticRelation.relationshipScore >= -20) clone.diplomaticRelation.status = 'neutral';
        else if (clone.diplomaticRelation.relationshipScore >= -60) clone.diplomaticRelation.status = 'tense';
        else clone.diplomaticRelation.status = 'rival';

        clone.diplomaticRelation.historicalMemoryLog.push(
          `Semestre ${turn}: Eleição autônoma levou ${newLeader.name} (${newLeader.party}) ao poder, sucedendo ${oldLeaderName}. Relações diplomáticas calibradas para score ${clone.diplomaticRelation.relationshipScore}.`
        );

        clone.recentEvent = `Novo governo sob liderança de ${newLeader.name} reavalia prioridades de política externa.`;

        news.push({
          headline: `Eleições em ${clone.name}: ${newLeader.name} vence o pleito e assume o poder`,
          summary: `Mudança política no governo de ${clone.name} altera diretrizes diplomáticas e comerciais na relação com o Brasil.`,
          sentiment: relationshipDelta >= 0 ? 'positive' : 'negative'
        });
      } else {
        // Incumbente reeleito
        clone.governmentApproval = Math.min(85, clone.governmentApproval + 5);
        clone.diplomaticRelation.historicalMemoryLog.push(
          `Semestre ${turn}: O líder ${clone.leader.name} foi reeleito em ${clone.name}, garantindo estabilidade e continuidade nos acordos bilaterais.`
        );
        clone.recentEvent = `${clone.leader.name} obtém vitória eleitoral e assegura continuidade de suas diretrizes.`;

        news.push({
          headline: `Continuidade em ${clone.name}: ${clone.leader.name} é reeleito(a)`,
          summary: `Governo de ${clone.name} mantém sua composição e reforça estabilidade nas relações comerciais com Brasília.`,
          sentiment: 'neutral'
        });
      }

      // Agendar próxima eleição (4 turnos para parlamentarista, 8 turnos para presidencialista)
      clone.nextElectionTurn = turn + (clone.politicalSystem === 'parliamentary' ? 4 : 8);
    }

    // 2. Dinâmica Econômica Orgânica do País Estrangeiro
    const growthFluctuation = (Math.random() * 0.8) - 0.4;
    clone.gdpGrowth = parseFloat((clone.gdpGrowth + growthFluctuation).toFixed(1));
    totalGlobalGrowth += clone.gdpGrowth;

    // Se o país tem relação amigável e cresce, o comércio bilateral se expande
    if (clone.diplomaticRelation.status === 'allied' || clone.diplomaticRelation.status === 'friendly') {
      clone.diplomaticRelation.tradeVolumeBi = parseFloat((clone.diplomaticRelation.tradeVolumeBi * (1 + (clone.gdpGrowth / 100))).toFixed(1));
    }

    return clone;
  });

  const avgGlobalGrowth = totalGlobalGrowth / (countries.length - 1);
  const exportDemandMultiplier = parseFloat((1 + (avgGlobalGrowth / 100) * 0.5).toFixed(3));

  return {
    updatedCountries,
    internationalNews: news,
    exportDemandMultiplier
  };
}
