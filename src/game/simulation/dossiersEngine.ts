import type { PresidentialDossier, Economy } from '@/game/types';
import staticDossiers from '@/data/dossiers.json';

export function getDossiersForTurn(
  turn: number,
  economy: Economy,
  approval: number,
  coalitionSeats: number
): PresidentialDossier[] {
  // 1. Dossiês estáticos definidos para o turno
  const staticForTurn = (staticDossiers as any[]).filter(d => d.turn === turn) as PresidentialDossier[];
  if (staticForTurn.length > 0) {
    return staticForTurn;
  }

  // 2. Se não houver estáticos para este turno (ex: turnos mais avançados), gerar com base no estado real do país
  const dynamicList: PresidentialDossier[] = [];

  // Dossiê Econômico / Inflacionário
  if (economy.inflation > 9.5) {
    dynamicList.push({
      id: `dyn_inflation_${turn}`,
      title: `Pressão Inflacionária: Preços em alta (${economy.inflation.toFixed(1)}%)`,
      source: "Banco Central da República",
      urgency: "critical",
      iconType: "inflation",
      description: `A inflação persistente em ${economy.inflation.toFixed(1)}% está corroendo o poder de compra da população. O Banco Central propõe elevação na taxa Selic de juros ou corte de gastos pelo Executivo.`,
      options: [
        {
          id: "opt_dyn_rate_hike",
          label: "Apoiar elevação da taxa de juros pelo Banco Central",
          description: "Desacelerar a economia e conter a demanda agregada com juros mais rígidos.",
          feedbackText: "Banco Central elevou juros: A inflação perde fôlego no médio prazo, mas os custos de empréstimos sobem para as empresas.",
          consequences: {
            inflationDelta: -1.2,
            gdpDelta: -0.4,
            popularityDelta: -2,
            socialGroupDelta: { grp_business: -4, grp_middle_class: -2 },
            timelineTitle: `Copom eleva juros para conter inflação de ${economy.inflation.toFixed(1)}%`,
            timelineCategory: "economic",
            timelineType: "warning"
          }
        },
        {
          id: "opt_dyn_spending_cut",
          label: "Decretar corte de R$ 3.5 bi no custeio da máquina pública",
          description: "Sinalizar responsabilidade fiscal para aliviar a pressão monetária sem esfriar o crédito privado.",
          feedbackText: "Contingenciamento decretado: Gastos correntes foram reduzidos em R$ 3.5 bi com elogios das entidades do mercado financeiro.",
          consequences: {
            inflationDelta: -0.8,
            budgetDelta: -3.5,
            popularityDelta: 0,
            socialGroupDelta: { grp_public_servants: -6, grp_middle_class: 2 },
            timelineTitle: "Decreto de austeridade corta R$ 3.5 bi de custeio administrativo",
            timelineCategory: "economic",
            timelineType: "positive"
          }
        },
        {
          id: "opt_dyn_ignore_inf",
          label: "Manter política inalterada e esperar aumento da safra agrícola",
          description: "Apostar no aumento da oferta no próximo trimestre sem impor sacrifícios à população.",
          feedbackText: "Nenhuma medida fiscal tomada: O custo de vida segue pressionado nas capitais.",
          consequences: {
            popularityDelta: -3,
            socialGroupDelta: { grp_working_class: -5, grp_poor: -4 },
            timelineTitle: "Planalto decide não intervir nas taxas de juros ou gastos federais",
            timelineCategory: "economic",
            timelineType: "neutral"
          }
        }
      ]
    });
  }

  // Dossiê de Governabilidade / Congresso
  if (coalitionSeats < 257) {
    dynamicList.push({
      id: `dyn_congress_${turn}`,
      title: `Alerta de Governabilidade: Base minoritária (${coalitionSeats}/513 deputados)`,
      source: "Secretaria de Articulação Política",
      urgency: "high",
      iconType: "congress",
      description: `O governo possui apenas ${coalitionSeats} deputados na base aliada, abaixo dos 257 necessários para aprovar leis ordinárias. Líderes do bloco independente condicionam apoio à liberação de emendas paroquiais.`,
      options: [
        {
          id: "opt_dyn_release_pork",
          label: "Liberar R$ 2.0 bi em emendas e atrair 35 parlamentares",
          description: "Atender demandas orçamentárias regionais para consolidar maioria no plenário.",
          feedbackText: "Emendas empenhadas: 35 deputados passam a votar com o governo, garantindo a maioria simples necessária.",
          consequences: {
            budgetDelta: 2.0,
            congressSupportDelta: 35,
            popularityDelta: -1,
            timelineTitle: "Governo amplia base aliada no Congresso com liberação de emendas",
            timelineCategory: "pork",
            timelineType: "warning"
          }
        },
        {
          id: "opt_dyn_negotiate_min",
          label: "Oferecer cargos em autarquias e bancos públicos aos aliados",
          description: "Negociar apoio político em troca de postos estratégicos de segundo escalão.",
          feedbackText: "Acordo formalizado: Nomeações publicadas no Diário Oficial atraem bancadas regionais para a base.",
          consequences: {
            congressSupportDelta: 20,
            popularityDelta: 0,
            timelineTitle: "Planalto acomoda legendas regionais em postos do governo federal",
            timelineCategory: "congress",
            timelineType: "positive"
          }
        },
        {
          id: "opt_dyn_floor_fight",
          label: "Enfrentar as votações no plenário matéria a matéria",
          description: "Buscar votos pelo mérito das propostas, sem concessões fisiológicas prévias.",
          feedbackText: "Estratégia de voto a voto: O governo ganha prestígio ético, mas corre risco de derrotas legislativas.",
          consequences: {
            popularityDelta: 3,
            congressSupportDelta: -10,
            timelineTitle: "Executivo aposta na negociação temática transparente no Congresso",
            timelineCategory: "congress",
            timelineType: "neutral"
          }
        }
      ]
    });
  }

  // Dossiê de Emprego e Obras Públicas
  dynamicList.push({
    id: `dyn_jobs_${turn}`,
    title: `Plano de Reativação Econômica e Geração de Empregos`,
    source: "Ministério da Infraestrutura e Cidades",
    urgency: "medium",
    iconType: "energy",
    description: `A taxa de desemprego está em ${economy.unemployment.toFixed(1)}%. Governadores e prefeitos solicitam parceria federal para destravar obras paralisadas de rodovias, ferrovias e saneamento básico.`,
    options: [
      {
        id: "opt_dyn_infra_pack",
        label: "Lançar Pacote de Obras Públicas de R$ 3.0 bi com foco em rodovias",
        description: "Contratação direta de empreiteiras para reativar canteiros de obras e gerar empregos rápidos.",
        feedbackText: "Pacote de obras lançado: Obras retomadas em 14 estados, gerando 120 mil postos de trabalho diretos.",
        consequences: {
          gdpDelta: 0.7,
          unemploymentDelta: -0.6,
          budgetDelta: 3.0,
          popularityDelta: 4,
          socialGroupDelta: { grp_working_class: 6, grp_business: 5 },
          timelineTitle: "Pacote Nacional de Obras de Infraestrutura é lançado pelo Executivo",
          timelineCategory: "reform",
          timelineType: "positive"
        }
      },
      {
        id: "opt_dyn_concessions",
        label: "Apostar em Concessões e Parcerias Público-Privadas (PPPs)",
        description: "Atrair capital privado nacional e estrangeiro sem gastar recursos do caixa do Tesouro.",
        feedbackText: "Leilões de infraestrutura agendados: O mercado elogia a aposta em concessões e o risco fiscal permanece zerado.",
        consequences: {
          gdpDelta: 0.3,
          unemploymentDelta: -0.2,
          popularityDelta: 2,
          socialGroupDelta: { grp_business: 8, grp_middle_class: 3 },
          timelineTitle: "Programa de Parcerias e Concessões Rodoviárias entra em operação",
          timelineCategory: "reform",
          timelineType: "positive"
        }
      },
      {
        id: "opt_dyn_microcredit",
        label: "Criar Linha de Microcrédito Produtivo para Pequenos Negócios",
        description: "Financiamento de capital de giro a juros subsidiados para microempreendedores individuais.",
        feedbackText: "Linha de microcrédito aberta em bancos públicos: Milhares de pequenos empreendedores acessam crédito produtivo.",
        consequences: {
          unemploymentDelta: -0.4,
          budgetDelta: 1.0,
          popularityDelta: 3,
          socialGroupDelta: { grp_informal: 7, grp_working_class: 4 },
          timelineTitle: "Programa Nacional de Microcrédito é disponibilizado a pequenos empresários",
          timelineCategory: "reform",
          timelineType: "positive"
        }
      }
    ]
  });

  return dynamicList;
}
