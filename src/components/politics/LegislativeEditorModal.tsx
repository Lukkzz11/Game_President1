'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import type { Law, LawArticle, PropositionType } from '@/game/types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Send, 
  X, 
  Sparkles, 
  Scale, 
  DollarSign, 
  Users, 
  Check, 
  AlertTriangle,
  Building2,
  FileCheck
} from 'lucide-react';

interface LegislativeEditorModalProps {
  onClose: () => void;
}

export const LegislativeEditorModal: React.FC<LegislativeEditorModalProps> = ({ onClose }) => {
  const { state, proposeCustomLaw } = useGame();
  if (!state) return null;

  const currentYear = 2027 + Math.floor((state.turn - 1) / 2);
  const randomNum = Math.floor(Math.random() * 80) + 12;

  // Estado do Formulário
  const [propType, setPropType] = useState<PropositionType>('project_of_law');
  const [title, setTitle] = useState('');
  const [summaryEmenta, setSummaryEmenta] = useState('');
  const [objective, setObjective] = useState('');
  const [category, setCategory] = useState<Law['category']>('social');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [durationVigency, setDurationVigency] = useState('Vigência em 90 dias após publicação oficial; duração permanente.');
  const [fundingSource, setFundingSource] = useState('Dotações do Orçamento Geral da União (Tesouro Nacional).');
  const [finalProvisions, setFinalProvisions] = useState('Revogam-se as disposições em contrário e fixa prazo de 60 dias para regulamentação ministerial.');
  
  // Artigos da Lei (Camada 1 - Texto)
  const [articles, setArticles] = useState<LawArticle[]>([
    {
      id: 'art_1',
      articleNumber: 1,
      text: 'Art. 1º Fica instituído o Programa Nacional de Mobilidade Urbana e Transporte Coletivo Gratuito em todo o território da República.'
    },
    {
      id: 'art_2',
      articleNumber: 2,
      text: 'Art. 2º O programa será custeado integralmente pelo Tesouro Nacional através de dotações orçamentárias anuais vinculadas.'
    },
    {
      id: 'art_3',
      articleNumber: 3,
      text: 'Art. 3º Terão direito ao benefício os trabalhadores com renda de até 2 salários mínimos e estudantes devidamente matriculados.'
    }
  ]);

  // Parâmetros (Camada 2 - Efeito da Lei)
  const [annualCost, setAnnualCost] = useState<number>(14.0);
  const [economicSummary, setEconomicSummary] = useState('Aumento do consumo das famílias e dinamização do comércio urbano com despesa pública primária.');
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState<string[]>(['grp_working_class', 'grp_poor']);
  const [selectedPenalized, setSelectedPenalized] = useState<string[]>([]);
  const [judicialRisk, setJudicialRisk] = useState<number>(25);

  const getNumberPrefix = (type: PropositionType) => {
    switch (type) {
      case 'constitutional_amendment':
        return `PEC nº 0${Math.floor(randomNum / 5)}/${currentYear}`;
      case 'complementary_law':
        return `PLC nº 0${randomNum}/${currentYear}`;
      case 'provisional_measure':
        return `MPV nº ${randomNum * 8}/${currentYear}`;
      default:
        return `PL nº 0${randomNum}/${currentYear}`;
    }
  };

  const currentNumberCode = getNumberPrefix(propType);

  // Templates rápidos e Inteligência Legislativa
  const applyPresetTemplate = (templateKey: 'transporte' | 'jovem' | 'reforma_adm' | 'tributaria' | 'seguranca' | 'creches' | 'energia') => {
    if (templateKey === 'transporte') {
      setPropType('project_of_law');
      setCategory('infrastructure');
      setTitle('Programa Nacional de Transporte Público Gratuito');
      setSummaryEmenta('Institui a gratuidade nos serviços de transporte público coletivo para trabalhadores de baixa renda e estudantes, e estabelece diretrizes para o subsídio federal.');
      setObjective('Garantir acesso universal à mobilidade urbana para trabalhadores formais/informais e estudantes de baixa renda, reduzindo custos de vida nas cidades.');
      setEligibilityCriteria('Cidadãos residentes em municípios com mais de 100 mil habitantes, com renda familiar per capita de até 2 salários mínimos.');
      setDurationVigency('Entrada em vigor em 90 dias após publicação; vigência permanente.');
      setFundingSource('Dotações do Orçamento Geral da União (Tesouro Nacional) combinadas com contrapartidas estaduais.');
      setFinalProvisions('Revogam-se disposições em contrário e fixa prazo de 60 dias para regulamentação ministerial e convênios com prefeituras.');
      setArticles([
        { id: 't1', articleNumber: 1, text: 'Art. 1º Fica instituído o Programa Nacional de Transporte Público Gratuito em todo o território nacional.' },
        { id: 't2', articleNumber: 2, text: 'Art. 2º O programa será financiado integralmente pela União através de dotações orçamentárias anuais do Tesouro.' },
        { id: 't3', articleNumber: 3, text: 'Art. 3º Terão acesso ao benefício os cidadãos residentes em municípios com mais de 100 mil habitantes e renda familiar de até 2 salários mínimos.' },
        { id: 't4', articleNumber: 4, text: 'Art. 4º Esta Lei entra em vigor 90 dias após a sua publicação oficial.' }
      ]);
      setAnnualCost(16.0);
      setEconomicSummary('Estímulo ao deslocamento de mão de obra e injeção de renda disponível no comércio urbano.');
      setSelectedBeneficiaries(['grp_working_class', 'grp_poor']);
      setSelectedPenalized([]);
      setJudicialRisk(20);
    } else if (templateKey === 'tributaria') {
      setPropType('complementary_law');
      setCategory('economic');
      setTitle('Reforma da Renda: Tributação de Superlucros e Isenção da Cesta Básica');
      setSummaryEmenta('Institui a tributação de 15% sobre lucros e dividendos distribuídos acima de R$ 5 milhões anuais e isenta totalmente trabalhadores com renda de até 5 salários mínimos.');
      setObjective('Promover a justiça fiscal e a progressividade tributária, desonerando os assalariados e a produção de alimentos essenciais.');
      setEligibilityCriteria('Aplicável a todos os contribuintes pessoas físicas e pessoas jurídicas domiciliadas no território nacional.');
      setDurationVigency('Entrada em vigor no primeiro dia do exercício financeiro seguinte ao de sua promulgação.');
      setFundingSource('Não gera despesa: produz acréscimo líquido de arrecadação compensatória.');
      setFinalProvisions('O superávit de arrecadação resultante será vinculado a fundos públicos de educação básica e combate à pobreza.');
      setArticles([
        { id: 'tr1', articleNumber: 1, text: 'Art. 1º Fica instituída a alíquota de 15% sobre os lucros e dividendos pagos por pessoas jurídicas a pessoas físicas residentes no país, na parcela que ultrapassar R$ 5.000.000,00 anuais.' },
        { id: 'tr2', articleNumber: 2, text: 'Art. 2º Fica estendida a faixa de isenção do Imposto de Renda das Pessoas Físicas (IRPF) para rendimentos mensais de até 5 salários mínimos.' },
        { id: 'tr3', articleNumber: 3, text: 'Art. 3º Ficam reduzidas a zero as alíquotas de tributos federais incidentes sobre os produtos componentes da Cesta Básica Nacional.' }
      ]);
      setAnnualCost(-18.0); // Economia / Arrecadação Líquida Positiva
      setEconomicSummary('Arrecadação fiscal líquida adicional de R$ 18 bilhões com estímulo ao consumo das famílias trabalhadoras.');
      setSelectedBeneficiaries(['grp_working_class', 'grp_poor', 'grp_middle_class']);
      setSelectedPenalized(['grp_business']);
      setJudicialRisk(35);
    } else if (templateKey === 'seguranca') {
      setPropType('project_of_law');
      setCategory('security');
      setTitle('Marco Integrado de Enfrentamento ao Crime Organizado e Blindagem de Fronteiras');
      setSummaryEmenta('Cria a Força Nacional de Inteligência Penitenciária e estabelece o Sistema Integrado de Rastreamento de Armas e Lavagem de Dinheiro das Facções Criminosas.');
      setObjective('Asfixiar a logística e o poder econômico das grandes organizações criminosas com tecnologia cibernética e cofinanciamento federal às polícias estaduais.');
      setEligibilityCriteria('Polícias Federal, Rodoviária Federal e Forças de Segurança Pública de todos os 26 Estados e Distrito Federal.');
      setDurationVigency('Vigência imediata após sanção presidencial.');
      setFundingSource('Fundo Nacional de Segurança Pública reforçado por bens e ativos confiscados do narcotráfico.');
      setFinalProvisions('Autoriza-se o confisco sumário de aeronaves, embarcações e bens de luxo utilizados no tráfico interestadual.');
      setArticles([
        { id: 'sg1', articleNumber: 1, text: 'Art. 1º Fica instituído o Sistema Integrado de Inteligência contra Facções Criminosas e Lavagem de Ativos Ilícitos.' },
        { id: 'sg2', articleNumber: 2, text: 'Art. 2º A União cofinanciará em até 65% a aquisição de armamento de precisão, drones de fronteira e tecnologia de inteligência aos Estados conveniados.' },
        { id: 'sg3', articleNumber: 3, text: 'Art. 3º Os recursos bloqueados judicialmente do crime organizado serão automaticamente revertidos aos fundos estaduais de segurança.' }
      ]);
      setAnnualCost(8.5);
      setEconomicSummary('Redução nos custos econômicos da violência e atração de investimentos com maior estabilidade institucional.');
      setSelectedBeneficiaries(['grp_middle_class', 'grp_poor', 'grp_business']);
      setSelectedPenalized([]);
      setJudicialRisk(20);
    } else if (templateKey === 'creches') {
      setPropType('project_of_law');
      setCategory('education');
      setTitle('Programa Nacional de Universalização de Creches e Escola em Tempo Integral');
      setSummaryEmenta('Institui o Pacto pela Primeira Infância com repasse federal para zerar a fila de creches municipais e apoiar a inserção de mães no mercado de trabalho.');
      setObjective('Garantir desenvolvimento cognitivo infantil e liberdade econômica para milhões de mães de famílias em situação de vulnerabilidade.');
      setEligibilityCriteria('Famílias com crianças de 0 a 5 anos residentes em áreas urbanas e rurais prioritárias no Cadastro Único.');
      setDurationVigency('Entrada em vigor em 60 dias; metas decenais de cobertura de 100%.');
      setFundingSource('Dotações do Fundo de Manutenção e Desenvolvimento da Educação Básica (Fundeb) com complementação da União.');
      setFinalProvisions('O Ministério da Educação fiscalizará a conformidade de infraestrutura pedagógica e merenda nutricional.');
      setArticles([
        { id: 'cr1', articleNumber: 1, text: 'Art. 1º Fica instituído o Programa Nacional de Universalização de Vagas em Creches Públicas e Conveniadas de Educação Integral.' },
        { id: 'cr2', articleNumber: 2, text: 'Art. 2º O Governo Federal arcará com a construção modular e repasse mensal por aluno matriculado aos municípios aderentes.' },
        { id: 'cr3', articleNumber: 3, text: 'Art. 3º Terão prioridade de atendimento os filhos de mães trabalhadoras com renda familiar de até 3 salários mínimos.' }
      ]);
      setAnnualCost(9.8);
      setEconomicSummary('Inclusão de milhões de mulheres na força de trabalho formal e ganhos estruturais de produtividade a longo prazo.');
      setSelectedBeneficiaries(['grp_poor', 'grp_working_class']);
      setSelectedPenalized([]);
      setJudicialRisk(15);
    } else if (templateKey === 'energia') {
      setPropType('project_of_law');
      setCategory('environment');
      setTitle('Marco da Transição Energética Justa e Energia Solar Comunitária');
      setSummaryEmenta('Institui linhas de subsídio e financiamento a juros zero para usinas solares comunitárias em bairros populares e pequenas agroindústrias.');
      setObjective('Zerar a conta de luz de famílias vulneráveis, incentivar a cadeia industrial de semicondutores e painéis nacionais e reduzir emissões de carbono.');
      setEligibilityCriteria('Comunidades urbanas de baixa renda, cooperativas agrícolas e agricultores familiares.');
      setDurationVigency('Vigência em 90 dias após publicação; incentivos válidos por 8 anos.');
      setFundingSource('Fundo Clima e dividendos de estatais de energia do setor elétrico.');
      setFinalProvisions('Ficam isentos de IPI e PIS/Cofins os equipamentos fotovoltaicos com índice mínimo de conteúdo local.');
      setArticles([
        { id: 'en1', articleNumber: 1, text: 'Art. 1º Fica instituído o Programa Telhado Solar Comunitário para geração distribuída de energia limpa em habitações de interesse social.' },
        { id: 'en2', articleNumber: 2, text: 'Art. 2º A energia excedente gerada será creditada automaticamente para abatimento nas contas dos consumidores residenciais de baixa renda.' },
        { id: 'en3', articleNumber: 3, text: 'Art. 3º As empresas nacionais fabricantes de tecnologia fotovoltaica contarão com depreciação acelerada de maquinário.' }
      ]);
      setAnnualCost(7.2);
      setEconomicSummary('Alívio imediato no custo de vida das famílias, diminuição na queima de térmicas fósseis e atração de capital verde.');
      setSelectedBeneficiaries(['grp_poor', 'grp_working_class', 'grp_business']);
      setSelectedPenalized([]);
      setJudicialRisk(15);
    } else if (templateKey === 'jovem') {
      setPropType('project_of_law');
      setCategory('labor');
      setTitle('Marco da Primeira Oportunidade e Desoneração da Juventude');
      setSummaryEmenta('Concede isenção de contribuições previdenciárias e fiscais para micro e pequenas empresas que contratarem jovens de 18 a 25 anos em regime CLT.');
      setObjective('Incentivar a contratação formal de jovens aprendizes e recém-formados através da desoneração temporária da folha de pagamento.');
      setEligibilityCriteria('Jovens de 18 a 25 anos sem registro anterior em carteira de trabalho ou matriculados em cursos técnicos/superiores.');
      setDurationVigency('Vigência imediata após publicação; incentivo fiscal com duração de 4 anos.');
      setFundingSource('Renúncia fiscal compensada por dotação do Fundo de Amparo ao Trabalhador.');
      setFinalProvisions('Fica proibida a substituição de funcionários veteranos sob pena de multa de 200% sobre o incentivo concedido.');
      setArticles([
        { id: 'j1', articleNumber: 1, text: 'Art. 1º Fica instituído o regime especial de incentivo à contratação do jovem aprendiz e recém-formado no mercado de trabalho formal.' },
        { id: 'j2', articleNumber: 2, text: 'Art. 2º As microempresas e empresas de pequeno porte ficam isentas da cota patronal previdenciária incidente sobre a folha salarial dos jovens contratados.' },
        { id: 'j3', articleNumber: 3, text: 'Art. 3º As vagas geradas deverão garantir estabilidade mínima de 12 meses e carga horária compatível com a continuidade dos estudos.' }
      ]);
      setAnnualCost(6.5);
      setEconomicSummary('Queda do desemprego juvenil e incentivo à formalização com leve renúncia fiscal.');
      setSelectedBeneficiaries(['grp_working_class', 'grp_business']);
      setSelectedPenalized([]);
      setJudicialRisk(15);
    } else if (templateKey === 'reforma_adm') {
      setPropType('constitutional_amendment');
      setCategory('political');
      setTitle('Emenda Constitucional de Eficiência Administrativa e Fim de Privilégios');
      setSummaryEmenta('Altera dispositivos da Constituição para extinguir penduricalhos, impor teto remuneratório real aos três poderes e unificar carreiras públicas.');
      setObjective('Restaurar a moralidade e a sustentabilidade fiscal do serviço público com a aplicação rigorosa do teto remuneratório constitucional.');
      setEligibilityCriteria('Aplicável a todos os agentes públicos, magistrados, parlamentares e servidores civis e militares dos três poderes da União.');
      setDurationVigency('Entrada em vigor imediata na data de promulgação da Emenda Constitucional.');
      setFundingSource('Não gera custos: produz economia orçamentária primária direta aos cofres públicos.');
      setFinalProvisions('Ficam nulos de pleno direito quaisquer atos administrativos que autorizem pagamentos acima do teto remuneratório a título indenizatório.');
      setArticles([
        { id: 'r1', articleNumber: 1, text: 'Art. 1º O teto remuneratório constitucional aplica-se a todas as parcelas indenizatórias e verbas acumuladas nos Poderes Executivo, Legislativo e Judiciário.' },
        { id: 'r2', articleNumber: 2, text: 'Art. 2º Ficam extintas as gratificações por acúmulo de acervo e férias superiores a 30 dias anuais em toda a administração direta e indireta.' },
        { id: 'r3', articleNumber: 3, text: 'Art. 3º Os recursos economizados serão compulsoriamente destinados a fundos de educação infantil e segurança pública.' }
      ]);
      setAnnualCost(-12.0); // Economia
      setEconomicSummary('Economia fiscal estrutural de R$ 12 bilhões ao ano com redução de gastos rígidos.');
      setSelectedBeneficiaries(['grp_middle_class']);
      setSelectedPenalized(['grp_public_servants']);
      setJudicialRisk(60); // Risco alto no STF devido a corporações do judiciário/servidores
    }
  };

  // Assistente de Inteligência Legislativa Presidencial
  const handleAutoDraftWithAI = () => {
    const rawTitle = title.trim() || 'Programa Nacional de Inovação e Desenvolvimento Estratégico';
    setTitle(rawTitle);
    setSummaryEmenta(`Dispõe sobre diretrizes, incentivos e governança do ${rawTitle}, estabelecendo metas de eficiência pública e fontes de financiamento.`);
    setObjective(`Assegurar a implementação célere e eficaz do ${rawTitle} em cooperação com Estados e Municípios.`);
    setEligibilityCriteria('Cidadãos, empresas e entes federativos devidamente qualificados conforme regulamentação expedida pelo Executivo.');
    setDurationVigency('Vigência em 60 dias após a publicação no Diário Oficial da União; execução de caráter contínuo.');
    setFundingSource('Dotações específicas consignadas na Lei Orçamentária Anual do Tesouro Nacional.');
    setFinalProvisions('Revogam-se disposições contrárias e comete-se aos Ministérios competentes a fiscalização e prestação semestral de contas ao Congresso.');
    setArticles([
      { id: 'ai_1', articleNumber: 1, text: `Art. 1º Fica instituído o ${rawTitle}, com a finalidade de impulsionar os indicadores nacionais na área temática selecionada.` },
      { id: 'ai_2', articleNumber: 2, text: 'Art. 2º A coordenação das ações caberá aos Ministérios setoriais competentes, garantida a participação da sociedade civil e dos entes federados.' },
      { id: 'ai_3', articleNumber: 3, text: 'Art. 3º As despesas decorrentes da execução desta Lei correrão por conta das dotações orçamentárias anuais vinculadas ao Tesouro Nacional.' },
      { id: 'ai_4', articleNumber: 4, text: 'Art. 4º Esta Lei entra em vigor na data de sua publicação oficial.' }
    ]);
    if (annualCost === 14.0) setAnnualCost(8.0);
    setEconomicSummary('Modernização de processos, melhoria do bem-estar social e atração de investimentos complementares.');
  };

  const handleAddArticle = () => {
    const nextNumber = articles.length + 1;
    setArticles([
      ...articles,
      {
        id: `art_${Date.now()}`,
        articleNumber: nextNumber,
        text: `Art. ${nextNumber}º [Descreva o novo dispositivo da lei...]`
      }
    ]);
  };

  const handleUpdateArticleText = (index: number, newText: string) => {
    const updated = [...articles];
    updated[index].text = newText;
    setArticles(updated);
  };

  const handleRemoveArticle = (index: number) => {
    if (articles.length <= 1) return;
    const updated = articles.filter((_, i) => i !== index).map((art, idx) => ({
      ...art,
      articleNumber: idx + 1,
      text: art.text.replace(/^Art\.\s*\d+º/, `Art. ${idx + 1}º`)
    }));
    setArticles(updated);
  };

  const toggleBeneficiary = (groupId: string) => {
    if (selectedBeneficiaries.includes(groupId)) {
      setSelectedBeneficiaries(selectedBeneficiaries.filter(id => id !== groupId));
    } else {
      setSelectedBeneficiaries([...selectedBeneficiaries, groupId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newLaw: Law = {
      id: `law_struc_${Date.now()}`,
      numberCode: currentNumberCode,
      propositionType: propType,
      title: title.trim(),
      summaryEmenta: summaryEmenta.trim() || `Dispõe sobre ${title.trim()} e dá outras providências.`,
      objective: objective.trim() || `Instituir as diretrizes e mecanismos do ${title.trim()}.`,
      category,
      description: summaryEmenta.trim() || title.trim(),
      articles,
      eligibilityCriteria: eligibilityCriteria.trim() || 'Conforme regulamento expedido pelo Poder Executivo.',
      durationVigency: durationVigency.trim() || 'Vigência em 90 dias após publicação oficial.',
      fundingSource: fundingSource.trim() || 'Dotações do Tesouro Nacional.',
      finalProvisions: finalProvisions.trim() || 'Revogam-se as disposições em contrário.',
      author: 'executive',
      status: 'draft',
      turnProposed: state.turn,
      costPerYear: annualCost,
      originalCost: annualCost,
      popularityImpact: annualCost > 0 ? 9 : -4,
      economicImpactSummary: economicSummary.trim() || (annualCost > 0 ? 'Investimento e expansão de serviços públicos.' : 'Consolidação fiscal e economia orçamentária.'),
      socialImpactSummary: `Beneficia diretamente os setores sociais priorizados pelo Executivo.`,
      beneficiaryGroups: selectedBeneficiaries,
      penalizedGroups: selectedPenalized,
      congressSupport: state.congress.coalitionSeats,
      congressAmendments: [],
      judicialReviewRisk: judicialRisk
    };

    proposeCustomLaw(newLaw);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        border: '1px solid #cbd5e1'
      }}>
        {/* Header do Editor */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span className="badge badge-blue font-mono" style={{ fontSize: '0.72rem' }}>
                {currentNumberCode}
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
                Iniciativa Exclusiva do Executivo
              </span>
            </div>
            <h2 className="font-title" style={{ fontSize: '1.4rem', color: '#0f172a', margin: 0 }}>
              Editor Legislativo: Redigir Nova Proposição
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Templates Rápidos & IA */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.15rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 700, fontSize: '0.82rem' }}>
                <Sparkles size={16} /> Minutas de Leis Pré-Estruturadas & Assistente:
              </div>
              <button
                type="button"
                onClick={handleAutoDraftWithAI}
                className="btn btn-emerald"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem', fontWeight: 700 }}
              >
                🪄 Redigir Texto com IA Parlamentar
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => applyPresetTemplate('tributaria')}
                className="btn btn-outline"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', background: '#ffffff', borderColor: '#86efac', color: '#166534' }}
              >
                💰 Reforma Tributária (Lucros)
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate('seguranca')}
                className="btn btn-outline"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', background: '#ffffff', borderColor: '#93c5fd', color: '#1d4ed8' }}
              >
                🛡️ Combate a Facções & Fronteiras
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate('creches')}
                className="btn btn-outline"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', background: '#ffffff', borderColor: '#fde047', color: '#854d0e' }}
              >
                👶 Creches & Educação Integral
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate('energia')}
                className="btn btn-outline"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', background: '#ffffff', borderColor: '#86efac', color: '#15803d' }}
              >
                ☀️ Energia Solar Popular
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate('transporte')}
                className="btn btn-outline"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', background: '#ffffff' }}
              >
                🚌 Transporte Gratuito
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate('jovem')}
                className="btn btn-outline"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', background: '#ffffff' }}
              >
                💼 Primeiro Emprego Jovem
              </button>
              <button
                type="button"
                onClick={() => applyPresetTemplate('reforma_adm')}
                className="btn btn-outline"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', background: '#ffffff', borderColor: '#fca5a5', color: '#991b1b' }}
              >
                ⚖️ Fim dos Supersalários
              </button>
            </div>
          </div>

          {/* 1. Tipo de Instrumento Legislativo */}
          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
              1. Instrumento Normativo & Rito de Votação
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
              {[
                { id: 'project_of_law', label: 'Projeto de Lei (PL)', quorum: 'Maioria Simples (257 votos)', desc: 'Matérias gerais, transportes, diretrizes.' },
                { id: 'complementary_law', label: 'Lei Complementar (PLC)', quorum: 'Maioria Absoluta (257 nominais)', desc: 'Finanças públicas, normas de gestão.' },
                { id: 'constitutional_amendment', label: 'Emenda Constitucional (PEC)', quorum: '3/5 em 2 Turnos (308 votos)', desc: 'Altera o texto da Carta Magna.' },
                { id: 'provisional_measure', label: 'Medida Provisória (MPV)', quorum: 'Vigência Imediata (120 dias)', desc: 'Efeito imediato com referendo do Congresso.' }
              ].map(t => (
                <div
                  key={t.id}
                  onClick={() => setPropType(t.id as PropositionType)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: propType === t.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: propType === t.id ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{t.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>{t.quorum}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Título, Área e Ementa */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Título Formal da Proposição
              </label>
              <input
                type="text"
                className="input-text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Programa Nacional de Transporte Coletivo Gratuito"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Área Temática
              </label>
              <select
                className="input-select"
                value={category}
                onChange={e => setCategory(e.target.value as Law['category'])}
              >
                <option value="social">Social & Cidadania</option>
                <option value="economic">Economia & Finanças</option>
                <option value="infrastructure">Infraestrutura & Transportes</option>
                <option value="labor">Trabalho & Emprego</option>
                <option value="health">Saúde Pública</option>
                <option value="education">Educação & Ciência</option>
                <option value="security">Segurança Pública</option>
                <option value="political">Institucional & Reforma</option>
                <option value="environment">Meio Ambiente & Energia</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Ementa Oficial (Síntese Jurídica da Matéria)
            </label>
            <textarea
              className="input-text"
              rows={2}
              value={summaryEmenta}
              onChange={e => setSummaryEmenta(e.target.value)}
              placeholder="Ex: Institui a tarifa zero no transporte coletivo urbano para trabalhadores e estudantes e fixa dotações orçamentárias de custeio."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
              Objetivo Estratégico da Proposição
            </label>
            <input
              type="text"
              className="input-text"
              value={objective}
              onChange={e => setObjective(e.target.value)}
              placeholder="Ex: Universalizar o transporte coletivo gratuito para trabalhadores e estudantes de baixa renda."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Critérios de Elegibilidade & Corte
              </label>
              <input
                type="text"
                className="input-text"
                value={eligibilityCriteria}
                onChange={e => setEligibilityCriteria(e.target.value)}
                placeholder="Ex: Municípios > 100k hab, renda até 2 salários mínimos."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Duração & Vigência
              </label>
              <input
                type="text"
                className="input-text"
                value={durationVigency}
                onChange={e => setDurationVigency(e.target.value)}
                placeholder="Ex: 90 dias após publicação; vigência permanente."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Fonte de Financiamento
              </label>
              <input
                type="text"
                className="input-text"
                value={fundingSource}
                onChange={e => setFundingSource(e.target.value)}
                placeholder="Ex: Dotações do Tesouro Nacional / Orçamento Geral."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Disposições Finais & Revogações
              </label>
              <input
                type="text"
                className="input-text"
                value={finalProvisions}
                onChange={e => setFinalProvisions(e.target.value)}
                placeholder="Ex: Revogam-se as disposições em contrário."
              />
            </div>
          </div>

          {/* 3. CAMADA 1 — REDAÇÃO DOS ARTIGOS DA LEI */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Redação dos Artigos do Projeto (Texto Formal da Lei)
                </h4>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  O Congresso analisará e poderá propor emendas sobre cada um dos artigos redigidos abaixo.
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddArticle}
                className="btn btn-outline"
                style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem' }}
              >
                <Plus size={14} /> Adicionar Artigo
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {articles.map((art, idx) => (
                <div 
                  key={art.id}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    background: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#2563eb',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {art.articleNumber}º
                  </div>

                  <div style={{ flex: 1 }}>
                    <textarea
                      className="input-text"
                      rows={2}
                      value={art.text}
                      onChange={e => handleUpdateArticleText(idx, e.target.value)}
                      style={{ fontSize: '0.86rem', lineHeight: '1.45' }}
                    />
                  </div>

                  {articles.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveArticle(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0.4rem'
                      }}
                      title="Excluir este artigo"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. CAMADA 2 — PARÂMETROS E EFEITOS REAIS DA LEI */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              Parâmetros de Simulação & Impacto no País
            </h4>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
              Define os custos, os beneficiários e o reflexo socioeconômico real após a sanção da lei.
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Impacto Orçamentário Anual
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    step="0.5"
                    className="input-text"
                    value={annualCost}
                    onChange={e => setAnnualCost(Number(e.target.value))}
                    style={{ fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    R$ bi/ano
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: annualCost > 0 ? '#b91c1c' : '#15803d', marginTop: '0.25rem', fontWeight: 600 }}>
                  {annualCost > 0 ? `Custo público adicional de R$ ${annualCost} bi` : `Economia fiscal líquida de R$ ${Math.abs(annualCost)} bi`}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Risco de Inconstitucionalidade no STF
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="5"
                  value={judicialRisk}
                  onChange={e => setJudicialRisk(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Seguro ({judicialRisk}%)</span>
                  <span style={{ color: judicialRisk > 40 ? '#b91c1c' : '#15803d', fontWeight: 700 }}>
                    {judicialRisk > 50 ? 'Alto Risco de ADI' : judicialRisk > 25 ? 'Moderado' : 'Pacífico'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Setores Sociais Beneficiados
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'grp_working_class', label: 'Operários & Trabalhadores' },
                  { id: 'grp_poor', label: 'População em Vulnerabilidade' },
                  { id: 'grp_middle_class', label: 'Classe Média Urbana' },
                  { id: 'grp_business', label: 'Empresariado & Indústria' },
                  { id: 'grp_rural', label: 'Produtores do Agronegócio' },
                  { id: 'grp_public_servants', label: 'Servidores Públicos' }
                ].map(grp => (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => toggleBeneficiary(grp.id)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      border: selectedBeneficiaries.includes(grp.id) ? '1px solid #2563eb' : '1px solid #cbd5e1',
                      background: selectedBeneficiaries.includes(grp.id) ? '#eff6ff' : '#ffffff',
                      color: selectedBeneficiaries.includes(grp.id) ? '#1d4ed8' : '#475569',
                      fontWeight: selectedBeneficiaries.includes(grp.id) ? 700 : 500
                    }}
                  >
                    {selectedBeneficiaries.includes(grp.id) ? '✓ ' : ''}{grp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Prévia no Estilo Diário Oficial da União */}
          <div style={{
            background: '#fffdfa',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            fontFamily: 'serif'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '0.75rem', borderBottom: '1px double #d97706', paddingBottom: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#92400e', fontWeight: 700 }}>
                REPÚBLICA FEDERATIVA DO BRASIL • PODER EXECUTIVO
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#78350f', marginTop: '0.2rem' }}>
                MENSAGEM PRESIDENCIAL AO CONGRESSO NACIONAL
              </div>
            </div>

            <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#451a03', textAlign: 'justify', lineHeight: '1.45', marginBottom: '0.75rem' }}>
              &quot;{summaryEmenta || 'Ementa formal da proposição legislativa...'}&quot;
            </div>

            <div style={{ fontSize: '0.82rem', color: '#292524', lineHeight: '1.5' }}>
              {articles.map(art => (
                <p key={art.id} style={{ margin: '0.35rem 0' }}>
                  {art.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé com Botão de Protocolo */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="btn btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 700 }}
          >
            <Send size={16} /> Protocolar e Enviar ao Congresso
          </button>
        </div>
      </div>
    </div>
  );
};
