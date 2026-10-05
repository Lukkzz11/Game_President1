import type { News, PressOutlet, Economy, Law, TurnReport } from '@/game/types';

export function simulateNews(
  turn: number,
  pressOutlets: PressOutlet[],
  economy: Economy,
  economyDelta: { gdpGrowth: number; inflation: number; unemployment: number },
  recentLaws: Law[],
  retiredJusticesNames: string[]
): News[] {
  const newsList: News[] = [];

  pressOutlets.forEach(outlet => {
    let headline = '';
    let summary = '';
    let sentiment: News['sentiment'] = 'neutral';

    // Se houve aposentadoria no Supremo Tribunal
    if (retiredJusticesNames.length > 0) {
      if (outlet.orientation === 'liberal_market') {
        headline = `Vaga aberta no Supremo: Mercado financeiro exige jurista com perfil técnico e previsível`;
        summary = `A aposentadoria compulsória de ${retiredJusticesNames.join(', ')} acende holofotes na escolha do Presidente da República. Empresários pedem segurança jurídica.`;
        sentiment = 'neutral';
      } else if (outlet.orientation === 'labor_left') {
        headline = `Cadeira vaga na Suprema Corte: Movimentos cobram nome com histórico em defesa do trabalhador`;
        summary = `Com a saída de ${retiredJusticesNames.join(', ')}, entidades sindicais e de direitos humanos organizam comitê para pressionar o Executivo.`;
        sentiment = 'neutral';
      } else if (outlet.orientation === 'national_conservative') {
        headline = `Nova vaga no Supremo: Bancada conservadora avisa que não aprovará militantes ideológicos`;
        summary = `Lideranças no Congresso articulam veto antecipado a indicações que afrontem valores tradicionais ou a soberania das forças de segurança.`;
        sentiment = 'negative';
      } else {
        headline = `Dança das cadeiras no Supremo: Saída de magistrado abre disputa feroz no Congresso`;
        summary = `Com vaga de ${retiredJusticesNames.join(', ')}, o Palácio do Governo inicia negociações reservadas com líderes partidários.`;
        sentiment = 'neutral';
      }
    } 
    // Notícias sobre a economia
    else if (economyDelta.inflation > 1.0) {
      if (outlet.orientation === 'liberal_market') {
        headline = `Inflação acelera para ${economy.inflation}%: Analistas alertam para descontroles nas contas públicas`;
        summary = `O aumento do custo de vida pressiona o Banco Central a manter juros em patamares restritivos.`;
        sentiment = 'negative';
      } else if (outlet.orientation === 'labor_left') {
        headline = `Carestia atinge prato do trabalhador: Alimentos e combustíveis disparam nos mercados`;
        summary = `Centrais sindicais cobram tabelamento emergencial e reajuste urgente no piso salarial da categoria.`;
        sentiment = 'negative';
      } else {
        headline = `Inflação bate ${economy.inflation}% e corrói poder de compra da classe média`;
        summary = `Famílias apertam os cintos e cobram ação coordenada das equipes econômicas do governo.`;
        sentiment = 'negative';
      }
    } else if (economyDelta.unemployment < -0.4) {
      if (outlet.orientation === 'liberal_market') {
        headline = `Desemprego recua para ${economy.unemployment}%: Produção industrial e comércio mostram fôlego`;
        summary = `Índices de contratação surpreendem economistas e apontam melhora sustentada no setor privado.`;
        sentiment = 'positive';
      } else {
        headline = `Mais empregos gerados: Taxa de desocupação cai para ${economy.unemployment}% no semestre`;
        summary = `Abertura de postos formais de trabalho traz alívio para milhares de famílias em todo o país.`;
        sentiment = 'positive';
      }
    } else {
      headline = `Governo conclui semestre sob forte escrutínio público e debates no Congresso`;
      summary = `Com PIB em ${economy.gdp} bi e inflação em ${economy.inflation}%, forças políticas recalculam rotas para a próxima rodada legislativa.`;
      sentiment = 'neutral';
    }

    newsList.push({
      id: `news_${turn}_${outlet.id}`,
      outletId: outlet.id,
      headline,
      summary,
      sentiment,
      turn,
      relatedCategory: 'geral'
    });
  });

  return newsList;
}
