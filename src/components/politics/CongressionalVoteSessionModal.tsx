'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useGame } from '@/game/state/GameContext';
import type { Law } from '@/game/types';
import { 
  Landmark, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  HandCoins, 
  MessageSquare, 
  Award, 
  AlertTriangle, 
  Play, 
  Check, 
  X, 
  Volume2, 
  Sparkles,
  Users,
  Timer
} from 'lucide-react';

interface CongressionalVoteSessionModalProps {
  law: Law;
  onClose: () => void;
  onVoteCompleted: (passed: boolean, finalYes: number, finalNo: number) => void;
}

interface MiniSeat {
  id: number;
  x: number;
  y: number;
  vote: 'yes' | 'no' | 'undecided' | 'absent';
  partyAcronym: string;
  stance: 'coalition' | 'independent' | 'opposition';
}

export const CongressionalVoteSessionModal: React.FC<CongressionalVoteSessionModalProps> = ({
  law,
  onClose,
  onVoteCompleted
}) => {
  const { state } = useGame();
  if (!state) return null;

  const quorumNeeded = law.propositionType === 'constitutional_amendment' ? 308 : 257;

  // Estado da votação
  const [isVotingActive, setIsVotingActive] = useState(true);
  const [votingProgress, setVotingProgress] = useState(0); // 0 a 513
  const [speechIndex, setSpeechIndex] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [voteBonus, setVoteBonus] = useState(0);

  // Ações de emergência realizadas
  const [actionsTaken, setActionsTaken] = useState<{
    speech: boolean;
    pork: boolean;
    amendment: boolean;
    whip: boolean;
  }>({
    speech: false,
    pork: false,
    amendment: false,
    whip: false
  });

  const [tacticalFeedback, setTacticalFeedback] = useState<string | null>(null);

  // Geração dos 513 assentos em semi-arco
  const seats: MiniSeat[] = useMemo(() => {
    const list: MiniSeat[] = [];
    const totalSeats = 513;
    const centerX = 240;
    const centerY = 210;
    const rows = [28, 36, 44, 52, 60, 68, 74, 80, 71];
    let seatIndex = 0;

    const coalitionCount = state.congress.coalitionSeats;
    const oppositionCount = state.congress.oppositionSeats;

    for (let r = 0; r < rows.length; r++) {
      const radius = 60 + r * 16;
      const count = rows[r];

      for (let c = 0; c < count; c++) {
        if (seatIndex >= totalSeats) break;

        const angle = Math.PI - (c / (count - 1)) * Math.PI;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY - Math.sin(angle) * radius;

        // Distribuição visual: Esquerda=Oposição, Centro=Independente, Direita=Base
        let stance: 'coalition' | 'independent' | 'opposition' = 'independent';
        if (seatIndex < oppositionCount) {
          stance = 'opposition';
        } else if (seatIndex < totalSeats - coalitionCount) {
          stance = 'independent';
        } else {
          stance = 'coalition';
        }

        list.push({
          id: seatIndex + 1,
          x,
          y,
          vote: 'undecided',
          partyAcronym: stance === 'coalition' ? state.party.acronym : stance === 'opposition' ? 'OPOS' : 'CENT',
          stance
        });

        seatIndex++;
      }
    }
    return list;
  }, [state.congress, state.party]);

  // Votos dinâmicos calculados
  const calculatedVotes = useMemo(() => {
    let yes = 0;
    let no = 0;
    let abst = 0;

    const baseRatio = (state.congress.coalitionSeats / 513);
    const popRatio = state.player.popularity / 100;
    const costPenalty = law.costPerYear > 20 ? 0.12 : law.costPerYear < 0 ? -0.15 : 0;

    seats.forEach((seat, idx) => {
      if (idx >= votingProgress) return;

      // Calcular probabilidade de voto favorável deste deputado
      let favorProb = 0.5;
      if (seat.stance === 'coalition') {
        favorProb = 0.88 + popRatio * 0.1;
      } else if (seat.stance === 'opposition') {
        favorProb = 0.12 + (popRatio > 0.6 ? 0.15 : 0);
      } else {
        // Centro
        favorProb = 0.45 + (baseRatio * 0.25) + (popRatio * 0.2) - costPenalty;
      }

      // Adicionar bônus táticos
      favorProb += (voteBonus / 513);

      if (favorProb > 0.52) {
        yes++;
      } else if (favorProb < 0.38) {
        no++;
      } else {
        abst++;
      }
    });

    return { yes, no, abst };
  }, [seats, votingProgress, state.congress, state.player.popularity, law.costPerYear, voteBonus]);

  // Ticker de Discursos na Tribuna
  const speeches = [
    {
      author: 'Dep. Rodrigo Alencastro (Líder do Governo)',
      role: 'Bancada Governista',
      color: '#059669',
      avatar: '🟢',
      text: `Senhor Presidente, o projeto "${law.title}" é indispensável para o desenvolvimento social e econômico do Brasil! A base orienta SIM!`
    },
    {
      author: 'Dep. Milton Brandão (Líder da Oposição)',
      role: 'Oposição Unida',
      color: '#dc2626',
      avatar: '🔴',
      text: `Essa matéria é um cheque em branco do Palácio do Planalto! O texto vai pressionar o déficit público e prejudicar o país. A oposição vota NÃO!`
    },
    {
      author: 'Dep. Valdemar Prado (Bancada do Centrão)',
      role: 'Bloco Parlamentar Independente',
      color: '#7c3aed',
      avatar: '🟣',
      text: `O Centrão mantém postura pragmática. Exigimos compromisso federativo com os municípios e liberação das emendas parlamentares empenhadas.`
    },
    {
      author: 'Dep. Marlene Fontoura (Frente Parlamentar Mista)',
      role: 'Representante Temática',
      color: '#d97706',
      avatar: '🟡',
      text: `Acompanhamos a repercussão popular e as pesquisas de opinião pública antes de registrar o voto desta bancada regional.`
    }
  ];

  // Simulação do progresso da contagem
  useEffect(() => {
    if (!isVotingActive) return;

    const interval = setInterval(() => {
      setVotingProgress(prev => {
        const next = prev + 18;
        if (next >= 513) {
          clearInterval(interval);
          setIsVotingActive(false);
          setSessionFinished(true);
          return 513;
        }
        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isVotingActive]);

  // Rotação dos discursos a cada 3.5 segundos
  useEffect(() => {
    const speechTimer = setInterval(() => {
      setSpeechIndex(prev => (prev + 1) % speeches.length);
    }, 3500);
    return () => clearInterval(speechTimer);
  }, [speeches.length]);

  // AÇÕES TÁTICAS PRESIDENCIAIS
  const handleTacticalSpeech = () => {
    if (actionsTaken.speech) return;
    const polCap = state.politicalCapital || 50;
    if (polCap < 8) {
      setTacticalFeedback('Capital político insuficiente para convocar pronunciamento nacional!');
      return;
    }
    state.politicalCapital = polCap - 8;
    setVoteBonus(prev => prev + 22);
    setActionsTaken(prev => ({ ...prev, speech: true }));
    setTacticalFeedback('🎙️ Pronunciamento em Rede Nacional convocado! A pressão popular fez 22 deputados indecisos virarem o voto para SIM!');
  };

  const handleTacticalPork = () => {
    if (actionsTaken.pork) return;
    const porkBi = 1.5;
    state.porkBudgetSpent = (state.porkBudgetSpent || 0) + porkBi;
    state.budget.nominalBalance = Math.round((state.budget.nominalBalance - porkBi) * 10) / 10;
    state.perceivedCorruption = Math.min(95, (state.perceivedCorruption || 25) + 3);
    setVoteBonus(prev => prev + 32);
    setActionsTaken(prev => ({ ...prev, pork: true }));
    setTacticalFeedback(`💼 Liberação extraordinária de R$ 1.5 bi em emendas empenhada! A bancada fisiológica do Centrão aderiu com +32 votos SIM!`);
  };

  const handleTacticalRelatorDeal = () => {
    if (actionsTaken.amendment) return;
    setVoteBonus(prev => prev + 18);
    setActionsTaken(prev => ({ ...prev, amendment: true }));
    setTacticalFeedback('🤝 Acordo firmado com o relator: acolhida emenda modificativa técnica. +18 votos garantidos!');
  };

  const isPassed = calculatedVotes.yes >= quorumNeeded;

  const handleFinish = () => {
    onVoteCompleted(isPassed, calculatedVotes.yes, calculatedVotes.no);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1.25rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #cbd5e1',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header do Plenário */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Landmark size={20} color="#38bdf8" />
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 700 }}>
                Câmara dos Deputados • Sessão Deliberativa Extraordinária
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
              Votação Nominal: {law.numberCode || 'PL'} — {law.title}
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: isVotingActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isVotingActive ? '#f87171' : '#34d399',
              border: isVotingActive ? '1px solid #ef4444' : '1px solid #10b981'
            }}>
              <Radio size={14} className={isVotingActive ? 'pulse-danger' : ''} />
              {isVotingActive ? 'Painel Eletrônico Aberto' : 'Votação Encerrada'}
            </span>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Quórum exigido: <strong>{quorumNeeded} votos</strong> ({law.propositionType === 'constitutional_amendment' ? 'PEC 3/5' : 'Maioria Absoluta'})
            </div>
          </div>
        </div>

        {/* Banner do Discurso ao Vivo na Tribuna */}
        <div style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.85rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.3rem' }}>{speeches[speechIndex].avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <strong style={{ fontSize: '0.82rem', color: '#1e293b' }}>{speeches[speechIndex].author}</strong>
              <span style={{ fontSize: '0.7rem', color: speeches[speechIndex].color, fontWeight: 700, background: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                {speeches[speechIndex].role}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', fontStyle: 'italic', lineHeight: '1.35' }}>
              &quot;{speeches[speechIndex].text}&quot;
            </p>
          </div>
        </div>

        {/* Área Central: Hemiciclo Gráfico + Placar ao Vivo */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
          {/* Mini-Hemiciclo SVG com 513 assentos */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Plenário Ulysses Guimarães ({votingProgress} / 513 Computados)
            </div>

            <svg viewBox="0 0 480 230" style={{ width: '100%', height: 'auto', maxHeight: '200px' }}>
              {seats.map((seat, i) => {
                let color = '#cbd5e1';
                if (i < votingProgress) {
                  const baseRatio = (state.congress.coalitionSeats / 513);
                  const popRatio = state.player.popularity / 100;
                  let pFavor = seat.stance === 'coalition' ? 0.88 : seat.stance === 'opposition' ? 0.14 : (0.45 + baseRatio * 0.2 + popRatio * 0.2);
                  pFavor += (voteBonus / 513);

                  if (pFavor > 0.52) color = '#059669'; // SIM
                  else if (pFavor < 0.38) color = '#dc2626'; // NÃO
                  else color = '#d97706'; // ABSTENÇÃO
                }

                return (
                  <circle
                    key={seat.id}
                    cx={seat.x}
                    cy={seat.y}
                    r={2.5}
                    fill={color}
                  />
                );
              })}
            </svg>

            {/* Legenda dos assentos */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }} />
                <span>Sim ({calculatedVotes.yes})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }} />
                <span>Não ({calculatedVotes.no})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d97706' }} />
                <span>Abst. ({calculatedVotes.abst})</span>
              </div>
            </div>
          </div>

          {/* Placar Oficial e Barra de Tensão */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: calculatedVotes.yes >= quorumNeeded ? '#f0fdf4' : '#fff7ed',
              border: calculatedVotes.yes >= quorumNeeded ? '2px solid #86efac' : '2px solid #fdba74',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Total de Votos Favoráveis (SIM)
              </div>
              <div className="font-mono" style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: calculatedVotes.yes >= quorumNeeded ? '#15803d' : '#c2410c',
                lineHeight: '1.1',
                margin: '0.25rem 0'
              }}>
                {calculatedVotes.yes}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: calculatedVotes.yes >= quorumNeeded ? '#166534' : '#9a3412' }}>
                {calculatedVotes.yes >= quorumNeeded 
                  ? `✓ Quórum de ${quorumNeeded} superado!` 
                  : `Faltam ${Math.max(0, quorumNeeded - calculatedVotes.yes)} votos para atingir a meta`}
              </div>
            </div>

            {/* Barra de Progresso em relação ao Quorum */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>
                <span>0</span>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>Meta: {quorumNeeded} votos</span>
                <span>513</span>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  width: `${Math.min(100, (calculatedVotes.yes / 513) * 100)}%`,
                  height: '100%',
                  background: calculatedVotes.yes >= quorumNeeded ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f59e0b, #ea580c)',
                  transition: 'width 0.2s ease-out'
                }} />
                {/* Linha vertical da Meta */}
                <div style={{
                  position: 'absolute',
                  left: `${(quorumNeeded / 513) * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: '3px',
                  background: '#0f172a',
                  zIndex: 2
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK DE AÇÃO TÁTICA */}
        {tacticalFeedback && (
          <div style={{
            margin: '0 1.75rem',
            padding: '0.75rem 1rem',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            color: '#1e40af',
            fontWeight: 600
          }}>
            {tacticalFeedback}
          </div>
        )}

        {/* INTERVENÇÕES TÁTICAS DO PRESIDENTE DURANTE A VOTAÇÃO */}
        {isVotingActive && (
          <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="#d97706" /> Intervenções Presidenciais de Emergência (Tempo Real)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {/* Ação 1: Pronunciamento */}
              <button
                type="button"
                onClick={handleTacticalSpeech}
                disabled={actionsTaken.speech || (state.politicalCapital || 0) < 8}
                className="btn btn-outline"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.2rem',
                  borderColor: actionsTaken.speech ? '#cbd5e1' : '#38bdf8',
                  background: actionsTaken.speech ? '#f1f5f9' : '#f0f9ff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0369a1' }}>
                  <Radio size={14} /> Pronunciamento Nacional
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {actionsTaken.speech ? 'Já convocado (+22 votos)' : 'Mobiliza a opinião pública (-8 Cap. Político)'}
                </span>
              </button>

              {/* Ação 2: Emendas de Emergência */}
              <button
                type="button"
                onClick={handleTacticalPork}
                disabled={actionsTaken.pork}
                className="btn btn-outline"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.2rem',
                  borderColor: actionsTaken.pork ? '#cbd5e1' : '#f59e0b',
                  background: actionsTaken.pork ? '#f1f5f9' : '#fffbeb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#b45309' }}>
                  <HandCoins size={14} /> Emendas Extras (R$ 1.5 bi)
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {actionsTaken.pork ? 'Empenhado (+32 votos)' : 'Libera verbas do orçamento para o Centrão'}
                </span>
              </button>

              {/* Ação 3: Acordo com Relator */}
              <button
                type="button"
                onClick={handleTacticalRelatorDeal}
                disabled={actionsTaken.amendment}
                className="btn btn-outline"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.2rem',
                  borderColor: actionsTaken.amendment ? '#cbd5e1' : '#10b981',
                  background: actionsTaken.amendment ? '#f1f5f9' : '#f0fdf4'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#047857' }}>
                  <MessageSquare size={14} /> Acordo com o Relator
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {actionsTaken.amendment ? 'Pactuado (+18 votos)' : 'Acatar emenda redacional conciliatória'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* BANNER DE RESULTADO FINAL */}
        {sessionFinished && (
          <div style={{
            margin: '1rem 1.75rem',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            background: isPassed ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: isPassed ? '2px solid #86efac' : '2px solid #fecaca'
          }}>
            <div style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: isPassed ? '#15803d' : '#b91c1c',
              marginBottom: '0.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              {isPassed ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
              {isPassed ? 'PROPOSIÇÃO APROVADA PELO PLENÁRIO!' : 'PROPOSIÇÃO REJEITADA PELO CONGRESSO!'}
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: isPassed ? '#166534' : '#991b1b', lineHeight: '1.45' }}>
              {isPassed 
                ? `O Plenário aprovou o texto com ${calculatedVotes.yes} votos favoráveis (quórum mínimo de ${quorumNeeded}). A matéria segue imediatamente para Sanção e Promulgação no Diário Oficial.`
                : `A proposição obteve apenas ${calculatedVotes.yes} dos ${quorumNeeded} votos necessários e foi rejeitada pelo Congresso. A matéria será arquivada nesta legislatura.`}
            </p>
          </div>
        )}

        {/* Rodapé com Fechamento / Homologação */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          {isVotingActive ? (
            <button
              type="button"
              onClick={() => {
                setVotingProgress(513);
                setIsVotingActive(false);
                setSessionFinished(true);
              }}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Acelerar e Apurar Resultado Final
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className={`btn ${isPassed ? 'btn-emerald pulse-gold' : 'btn-danger'}`}
              style={{ padding: '0.75rem 2rem', fontSize: '0.95rem', fontWeight: 800 }}
            >
              {isPassed ? 'Homologar Aprovação no Diário Oficial' : 'Reconhecer Resultado e Fechar Sessão'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
