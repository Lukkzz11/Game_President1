'use client';

import React, { useState } from 'react';
import type { GameState } from '@/game/types';
import { useGame } from '@/game/state/GameContext';
import confetti from 'canvas-confetti';
import { 
  Megaphone, 
  Tv, 
  Users, 
  Vote, 
  Trophy, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  RotateCcw, 
  Sparkles,
  Flame,
  Radio,
  Building2,
  TrendingDown
} from 'lucide-react';

interface CampaignElectionProps {
  state: GameState;
  onFinishElection: (winnerVoteShare: number) => void;
}

export const CampaignElection: React.FC<CampaignElectionProps> = ({ state, onFinishElection }) => {
  const { performCampaignAction, conductElection, startNewGame } = useGame();
  const campaign = state.electionCampaign;

  const [isCounting, setIsCounting] = useState(false);
  const [countingProgress, setCountingProgress] = useState(0);

  const rivalTop = campaign.rivals[0] || { name: 'Helena Alencastro', party: 'MSD', poll: 27.0 };
  const rivalSecond = campaign.rivals[1] || { name: 'Coronel Brandão', party: 'POR', poll: 23.0 };

  const handleStartCounting = () => {
    setIsCounting(true);
    setCountingProgress(0);

    const interval = setInterval(() => {
      setCountingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          conductElection();
          setIsCounting(false);
          try {
            confetti({
              particleCount: 110,
              spread: 80,
              origin: { y: 0.55 }
            });
          } catch (e) {
            // fallback
          }
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  // Semanas da Campanha
  const renderWeekContent = () => {
    if (campaign.currentWeek === 1) {
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span className="badge badge-blue">Semana 1 de 4</span>
            <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
              Grande Comício Regional de Lançamento
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            A largada da corrida eleitoral exige a presença física do candidato nos grandes polos de votação do Brasil. Onde seu partido concentrará a caravana inaugural?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              {
                id: 'abc_industry',
                title: 'Cinturão Industrial do Sudeste',
                desc: 'Discurso inflamado em frente às montadoras e metalúrgicas com bandeira de reindustrialização e valorização salarial.',
                cost: 8.0,
                playerDelta: 4.8,
                rivalDelta: -2.0,
                target: 'Operários e Sindicatos'
              },
              {
                id: 'agro_center',
                title: 'Interior do Agronegócio (Centro-Oeste)',
                desc: 'Aliança com produtores rurais, cooperativas de grãos e defesa de crédito agrícola facilitado.',
                cost: 9.5,
                playerDelta: 5.2,
                rivalDelta: -1.5,
                target: 'Produtores Rurais e Exportadores'
              },
              {
                id: 'capital_security',
                title: 'Marcha pela Paz nas Grandes Capitais',
                desc: 'Comício focado em segurança cidadã, combate implacável ao crime organizado e apoio à polícia.',
                cost: 6.5,
                playerDelta: 3.9,
                rivalDelta: -2.2,
                target: 'Classe Média e Moradores Urbanos'
              },
              {
                id: 'digital_stream',
                title: 'Maratona Digital & Redes Sociais',
                desc: 'Live nacional de 8 horas respondendo a eleitores indecisos, com foco em custo baixo e engajamento jovem.',
                cost: 3.5,
                playerDelta: 3.2,
                rivalDelta: -1.0,
                target: 'Jovens e Profissionais Autônomos'
              }
            ].map(opt => (
              <div 
                key={opt.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'transform 0.15s ease, border-color 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{opt.title}</h4>
                    <span className="badge badge-gold font-mono" style={{ fontSize: '0.72rem' }}>
                      -R$ {opt.cost}M
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                    {opt.desc}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginBottom: '1rem' }}>
                    Foco: {opt.target}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={campaign.budget < opt.cost}
                  onClick={() => performCampaignAction({
                    type: 'rally',
                    label: opt.title,
                    cost: opt.cost,
                    playerPollDelta: opt.playerDelta,
                    rivalPollDelta: opt.rivalDelta,
                    logMessage: `Semana 1: Realizado comício "${opt.title}". Salto de +${opt.playerDelta}% nas intenções de voto.`
                  })}
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
                >
                  <Megaphone size={16} /> Realizar Comício
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (campaign.currentWeek === 2) {
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span className="badge badge-purple">Semana 2 de 4</span>
            <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
              Debate Presidencial na TV em Horário Nobre
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            38 milhões de telespectadores estão sintonizados. A candidata {rivalTop.name} ({rivalTop.party}) questiona como você financiará as promessas sem gerar inflação galopante. Qual sua resposta?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              {
                id: 'debate_tech',
                title: 'Postura Técnica: Corte Rigoroso de Privilégios & Eficiência da Máquina',
                desc: 'Demonstrar na ponta do lápis que a contenção de supersalários, emendas opacas e desperdícios públicos financiará os investimentos essenciais sem estourar o teto fiscal.',
                cost: 2.0,
                playerDelta: 4.5,
                rivalDelta: -2.5,
                log: 'Debate: Postura austera e técnica convenceu os indecisos e calou a bancada de oposição.'
              },
              {
                id: 'debate_growth',
                title: 'Postura Desenvolvimentista: O Motor do Emprego e Produção Nacional',
                desc: 'Afirmar que a austeridade excessiva estrangula o país: a arrecadação cresce quando o povo tem emprego, renda e consome no comércio local.',
                cost: 2.0,
                playerDelta: 5.0,
                rivalDelta: -1.0,
                log: 'Debate: Discurso popular mobilizou as camadas trabalhadoras e gerou recordes de audiência.'
              },
              {
                id: 'debate_attack',
                title: 'Contra-Ataque Frontal: Cobrar o Passivo de Corrupção dos Adversários',
                desc: 'Lembrar ao eleitor os escândalos nos governos passados dos rivais e desmascarar a incoerência do discurso moralista deles.',
                cost: 2.5,
                playerDelta: 3.5,
                rivalDelta: -3.8,
                log: 'Debate: Confronto direto desestabilizou o adversário, gerando cortes virais nas redes sociais.'
              }
            ].map(opt => (
              <div 
                key={opt.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1.5rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98rem', marginBottom: '0.35rem' }}>
                    {opt.title}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {opt.desc}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => performCampaignAction({
                    type: 'debate',
                    label: opt.title,
                    cost: opt.cost,
                    playerPollDelta: opt.playerDelta,
                    rivalPollDelta: opt.rivalDelta,
                    logMessage: `Semana 2: ${opt.log} (+${opt.playerDelta}% nas pesquisas).`
                  })}
                  className="btn btn-purple"
                  style={{ whiteSpace: 'nowrap', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
                >
                  <Tv size={16} /> Responder no Debate
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (campaign.currentWeek === 3) {
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span className="badge badge-crimson">Semana 3 de 4</span>
            <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
              Alerta de Crise: Dossiê e Ataques na Reta Final
            </h3>
          </div>
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertTriangle size={24} color="#e11d48" />
            <div style={{ fontSize: '0.86rem', color: '#9f1239' }}>
              <strong>Manchete Urgente:</strong> Blogs apócrifos e programas eleitorais rivais espalham notícias truncadas sobre antigos contratos de sua equipe partidária. A boataria ameaça corroer o eleitorado moderado.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              {
                id: 'legal_tse',
                title: 'Ofensiva Jurídica e Direito de Resposta',
                desc: 'Acionar imediatamente o Tribunal Eleitoral para tirar a difamação do ar e obter inserções punitivas no horário eleitoral adversário.',
                cost: 4.5,
                playerDelta: 3.5,
                rivalDelta: -2.5,
                badge: 'Solução Institucional'
              },
              {
                id: 'tv_broadcast',
                title: 'Pronunciamento Emocional em Rede Nacional',
                desc: 'Comprar blitz publicitária com depoimento olho no olho com o povo: reafirmar integridade, família e compromisso com o país.',
                cost: 11.0,
                playerDelta: 5.5,
                rivalDelta: -1.0,
                badge: 'Alto Custo / Alto Retorno'
              },
              {
                id: 'street_militancy',
                title: 'Mobilização da Base e Guerrilha Digital',
                desc: 'Colocar os diretórios partidários e comitês de bairro nas ruas distribuindo cartilhas da verdade.',
                cost: 3.0,
                playerDelta: 2.8,
                rivalDelta: -0.5,
                badge: 'Estratégia Popular'
              }
            ].map(opt => (
              <div 
                key={opt.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{opt.badge}</span>
                    <span className="badge badge-gold font-mono" style={{ fontSize: '0.72rem' }}>-R$ {opt.cost}M</span>
                  </div>
                  <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.4rem' }}>{opt.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                    {opt.desc}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={campaign.budget < opt.cost}
                  onClick={() => performCampaignAction({
                    type: 'crisis',
                    label: opt.title,
                    cost: opt.cost,
                    playerPollDelta: opt.playerDelta,
                    rivalPollDelta: opt.rivalDelta,
                    logMessage: `Semana 3: Crise contornada com "${opt.title}". Subida de +${opt.playerDelta}% nas intenções de voto.`
                  })}
                  className="btn btn-danger"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '0.65rem' }}
                >
                  <ShieldCheck size={16} /> Aplicar Resposta
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Semana 4: Bandeira Solene Final e Fechamento
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <span className="badge badge-gold">Semana 4 de 4 — Reta Final</span>
          <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a' }}>
            O Compromisso Solene de Governo
          </h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Último dia do horário eleitoral no rádio e na televisão brasileira. Qual será a grande bandeira central gravada no coração do eleitor no encerramento da campanha?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {[
            {
              id: 'pledge_tax',
              title: 'Reforma Tributária Justa com Isenção da População de Baixa Renda',
              desc: 'Garantir justiça fiscal desonerando o consumo básico e cobrando a contribuição equitativa dos super-ricos.',
              playerDelta: 4.2,
              rivalDelta: -2.0,
              pledge: 'Reforma Tributária com Isenção Popular'
            },
            {
              id: 'pledge_infra',
              title: 'Choque de Competitividade, Desregulamentação e Energia Barata',
              desc: 'Modernizar a infraestrutura nacional, atrair trilhões em investimento privado e baixar os custos operacionais das indústrias.',
              playerDelta: 4.5,
              rivalDelta: -1.8,
              pledge: 'Choque de Infraestrutura e Atração de Capitais'
            },
            {
              id: 'pledge_social',
              title: 'Pacto da Saúde da Família e Erradicação da Miséria Extrema',
              desc: 'Blindar os hospitais e escolas públicas, ampliando a rede de assistência social para que ninguém fique desamparado.',
              playerDelta: 4.0,
              rivalDelta: -2.2,
              pledge: 'Pacto Nacional de Saúde e Bem-Estar Social'
            }
          ].map(opt => (
            <div 
              key={opt.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98rem', marginBottom: '0.35rem' }}>
                  {opt.title}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {opt.desc}
                </div>
              </div>

              <button
                type="button"
                onClick={() => performCampaignAction({
                  type: 'pledge',
                  label: opt.title,
                  cost: 1.0,
                  playerPollDelta: opt.playerDelta,
                  rivalPollDelta: opt.rivalDelta,
                  pledgeText: opt.pledge,
                  logMessage: `Semana 4: Assumido o compromisso "${opt.pledge}". Última pesquisa aponta liderança consolidada.`
                })}
                className="btn btn-gold pulse-gold"
                style={{ whiteSpace: 'nowrap', padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
              >
                <Sparkles size={16} /> Selar Compromisso
              </button>
            </div>
          ))}
        </div>

        {/* Botão de Conclusão da Campanha e Apuração */}
        <div style={{ textAlign: 'center', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            As Urnas Estão Prontas
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            52 milhões de cidadãos exercerão a soberania popular. Sua estratégia de 4 semanas determinará o futuro da República.
          </p>
          <button
            type="button"
            onClick={handleStartCounting}
            disabled={isCounting}
            className="btn btn-emerald"
            style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem', fontWeight: 700 }}
          >
            <Vote size={20} />
            {isCounting ? `Apurando as Seções Eleitorais (${countingProgress}%)...` : 'Abrir as Urnas e Iniciar Apuração'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1000px', width: '100%', margin: '2rem auto', padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', background: '#ffffff' }}>
        
        {/* Header Principal */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>Simulação Eleitoral Interativa</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Calendar size={16} /> <strong>Outubro de 2026</strong>
            </div>
          </div>
          <h1 className="font-title" style={{ fontSize: '1.95rem', color: '#0f172a', marginBottom: '0.4rem' }}>
            Campanha Eleitoral & Disputa Presidencial
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Conduza seu partido <strong>{state.party.name} ({state.party.acronym})</strong> à vitória nas urnas através de comícios, debates, respostas a crises e compromissos com o eleitorado.
          </p>
        </div>

        {/* Dashboard de Recursos e Tracking Poll em Tempo Real */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Caixa da Campanha (Fundo Partidário & Doações)
              </div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: campaign.budget > 5 ? '#0f172a' : '#dc2626' }}>
                R$ {campaign.budget.toFixed(1)} Milhões
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Cronograma Eleitoral
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.3rem' }}>
                {[1, 2, 3, 4].map(w => (
                  <div
                    key={w}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: campaign.currentWeek === w ? '#2563eb' : campaign.currentWeek > w ? '#10b981' : '#e2e8f0',
                      color: campaign.currentWeek >= w ? '#ffffff' : '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {w}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
                Sua Intenção de Voto (Tracking Poll)
              </div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: campaign.playerPoll >= 50 ? '#047857' : '#2563eb' }}>
                {campaign.playerPoll.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Barra de Distribuição de Votos nas Pesquisas */}
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              <span style={{ color: '#2563eb' }}>{state.player.name} ({state.party.acronym}): {campaign.playerPoll.toFixed(1)}%</span>
              <span style={{ color: '#ec4899' }}>{rivalTop.name} ({rivalTop.party}): {rivalTop.poll.toFixed(1)}%</span>
              <span style={{ color: '#10b981' }}>{rivalSecond.name} ({rivalSecond.party}): {rivalSecond.poll.toFixed(1)}%</span>
              <span style={{ color: '#94a3b8' }}>Indecisos: {Math.max(0, Math.round((100 - campaign.playerPoll - rivalTop.poll - rivalSecond.poll) * 10) / 10)}%</span>
            </div>

            <div style={{ width: '100%', height: '14px', borderRadius: '7px', overflow: 'hidden', display: 'flex', background: '#e2e8f0' }}>
              <div style={{ width: `${campaign.playerPoll}%`, background: '#2563eb', transition: 'width 0.4s ease' }} />
              <div style={{ width: `${rivalTop.poll}%`, background: '#ec4899', transition: 'width 0.4s ease' }} />
              <div style={{ width: `${rivalSecond.poll}%`, background: '#10b981', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* Conteúdo Dinâmico: Se a eleição foi concluída OU se está em campanha */}
        {!campaign.electionFinished ? (
          <div>
            {renderWeekContent()}

            {/* Log de Acontecimentos da Campanha */}
            {campaign.historyLog.length > 0 && (
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Diário Oficial da Campanha
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {campaign.historyLog.map((log, idx) => (
                    <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: '#f8fafc', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                      • {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* RESULTADO FINAL DA ELEIÇÃO: VITÓRIA OU DERROTA REAL */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            {campaign.wonElection ? (
              <div>
                <div style={{
                  width: '76px',
                  height: '76px',
                  margin: '0 auto 1.25rem auto',
                  borderRadius: '50%',
                  background: '#ecfdf5',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Trophy size={40} color="#047857" />
                </div>

                <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', marginBottom: '0.75rem' }}>
                  Eleito Presidente da República
                </span>

                <h2 className="font-title" style={{ fontSize: '2.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Vitória Consagrada nas Urnas!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto 2rem auto', lineHeight: '1.5' }}>
                  O Tribunal Superior Eleitoral proclama <strong>{state.player.name}</strong> o 39º Presidente da República Federativa do Brasil para o quadriênio 2027–2030.
                </p>

                {/* Tabela de Votação Oficial */}
                <div style={{
                  maxWidth: '520px',
                  margin: '0 auto 2rem auto',
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '2px solid #e2e8f0', fontWeight: 700, fontSize: '0.98rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857' }}>
                      <CheckCircle2 size={18} /> {state.player.name} ({state.party.acronym})
                    </span>
                    <span className="font-mono" style={{ color: '#047857', fontSize: '1.2rem' }}>
                      {campaign.finalPlayerVotes}%
                    </span>
                  </div>

                  {campaign.rivals.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: i < campaign.rivals.length - 1 ? '1px solid #f1f5f9' : 'none', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      <span>{r.name} ({r.party})</span>
                      <span className="font-mono" style={{ fontWeight: 600 }}>{r.poll}%</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onFinishElection(campaign.finalPlayerVotes || 52)}
                  className="btn btn-emerald pulse-gold"
                  style={{ padding: '0.95rem 2.75rem', fontSize: '1.1rem', fontWeight: 700 }}
                >
                  Subir a Rampa Presidencial & Iniciar Governo <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              /* DERROTA ELEITORAL REAL */
              <div>
                <div style={{
                  width: '76px',
                  height: '76px',
                  margin: '0 auto 1.25rem auto',
                  borderRadius: '50%',
                  background: '#fef2f2',
                  border: '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingDown size={40} color="#b91c1c" />
                </div>

                <span className="badge badge-crimson" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', marginBottom: '0.75rem' }}>
                  Derrota nas Urnas
                </span>

                <h2 className="font-title" style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                  Eleição Encerrada: A Oposição Venceu
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
                  O Tribunal Superior Eleitoral confirma a vitória de <strong>{campaign.winnerName} ({campaign.winnerParty})</strong>. Sua chapa obteve <strong>{campaign.finalPlayerVotes}%</strong> dos votos válidos.
                </p>

                {/* Caixa de Diagnóstico da Derrota */}
                <div style={{
                  maxWidth: '560px',
                  margin: '0 auto 2rem auto',
                  background: '#fff1f2',
                  border: '1px solid #fecdd3',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 700, color: '#9f1239', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    Diagnóstico da Coordenação Partidária:
                  </div>
                  <p style={{ fontSize: '0.86rem', color: '#881337', lineHeight: '1.45', margin: 0 }}>
                    {campaign.lossAnalysis || 'A campanha não conseguiu furar a bolha dos indecisos e esgotou seus recursos antes da reta final dos debates decisivos.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    startNewGame();
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 2.25rem', fontSize: '1rem' }}
                >
                  <RotateCcw size={18} /> Iniciar Nova Trajetória Política (Novo Jogo)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
