'use client';

import React from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  FileCheck2, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  CheckCircle, 
  ArrowRight,
  Gavel,
  Clock,
  HandCoins,
  AlertTriangle,
  Award,
  Newspaper
} from 'lucide-react';

export const TurnReportModal: React.FC = () => {
  const { activeReport, closeReportModal, state } = useGame();

  if (!activeReport) return null;

  return (
    <div className="modal-overlay" onClick={closeReportModal} style={{ zIndex: 1050 }}>
      <div 
        className="glass-panel" 
        style={{ 
          maxWidth: '720px', 
          width: '100%', 
          padding: '2.25rem', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-gold)'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FileCheck2 size={28} color="var(--accent-gold)" />
            <h2 className="font-title" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              Relatório Semestral de Governo
            </h2>
          </div>
          <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
            {activeReport.date}
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.45' }}>
          Conclusão do semestre de mandato. A simulação processou as consequências imediatas e atrasadas das decisões econômicas, o impacto das leis aprovadas e o humor das instituições.
        </p>

        {/* Indicadores Deltas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {/* Variação PIB */}
          <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Crescimento PIB</div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: activeReport.gdpDelta >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)', margin: '0.2rem 0' }}>
              {activeReport.gdpDelta > 0 ? `+${activeReport.gdpDelta}%` : `${activeReport.gdpDelta}%`}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>no semestre</div>
          </div>

          {/* Variação Inflação */}
          <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Variação Inflação</div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: activeReport.inflationDelta > 0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)', margin: '0.2rem 0' }}>
              {activeReport.inflationDelta > 0 ? `+${activeReport.inflationDelta}%` : `${activeReport.inflationDelta}%`}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>acumulado</div>
          </div>

          {/* Variação Desemprego */}
          <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Desemprego</div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: activeReport.unemploymentDelta > 0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)', margin: '0.2rem 0' }}>
              {activeReport.unemploymentDelta > 0 ? `+${activeReport.unemploymentDelta}%` : `${activeReport.unemploymentDelta}%`}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>da força de trabalho</div>
          </div>

          {/* Variação Popularidade */}
          <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Aprovação Popular</div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: activeReport.approvalDelta >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)', margin: '0.2rem 0' }}>
              {activeReport.approvalDelta >= 0 ? `+${activeReport.approvalDelta}%` : `${activeReport.approvalDelta}%`}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>pesquisa nacional</div>
          </div>

          {/* Variação Capital Político */}
          <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Capital Político</div>
            <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: (activeReport.politicalCapitalDelta ?? 0) >= 0 ? '#0369a1' : 'var(--accent-crimson)', margin: '0.2rem 0' }}>
              {(activeReport.politicalCapitalDelta ?? 0) >= 0 ? `+${activeReport.politicalCapitalDelta ?? 0}` : `${activeReport.politicalCapitalDelta ?? 0}`} pts
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>saldo institucional</div>
          </div>
        </div>

        {/* Manchetes dos Jornais e Repercussão */}
        {activeReport.breakingHeadlines && activeReport.breakingHeadlines.length > 0 && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#1e293b', fontSize: '0.92rem', marginBottom: '0.5rem' }}>
              <Newspaper size={18} color="#2563eb" /> Manchetes da Imprensa no Semestre
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {activeReport.breakingHeadlines.map((head, idx) => (
                <div key={idx} style={{ fontSize: '0.84rem', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ color: '#2563eb' }}>•</span>
                  <span>&quot;{head}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consequências Atrasadas que Eclodiram neste Semestre */}
        {activeReport.delayedConsequencesTriggered && activeReport.delayedConsequencesTriggered.length > 0 && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#b45309', fontSize: '0.92rem', marginBottom: '0.5rem' }}>
              <Clock size={18} color="#d97706" /> Consequências de Longo Prazo Eclodidas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {activeReport.delayedConsequencesTriggered.map((item, idx) => (
                <div key={idx} style={{ fontSize: '0.82rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle size={14} color="#d97706" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notificações do Supremo Tribunal */}
        {activeReport.supremeCourtEvents.length > 0 && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '1.15rem',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#991b1b', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <Gavel size={18} color="var(--accent-crimson)" /> Vacância no Supremo Tribunal Federal
            </div>
            {activeReport.supremeCourtEvents.map((evt, i) => (
              <div key={i} style={{ fontSize: '0.82rem', color: '#7f1d1d' }}>
                {evt}
              </div>
            ))}
          </div>
        )}

        {/* Resumo Fiscal */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xs)', borderRadius: 'var(--radius-md)', padding: '1.15rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>Balanço das Contas da União:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            <span>Receita Federal Arrecadada:</span>
            <strong className="font-mono">R$ {activeReport.revenue} bi</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
            <span>Despesas Executadas:</span>
            <strong className="font-mono">R$ {activeReport.spending} bi</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: activeReport.balance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)', fontWeight: 700, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <span>Resultado Nominal (Superávit/Déficit):</span>
            <span className="font-mono">{activeReport.balance >= 0 ? `+R$ ${activeReport.balance} bi` : `-R$ ${Math.abs(activeReport.balance)} bi`}</span>
          </div>
        </div>

        {/* ASSESSORIA ESTRATÉGICA PRESIDENCIAL: DIAGNÓSTICO & O QUE FAZER PARA MELHORAR */}
        {(() => {
          const tips: { title: string; desc: string; icon: string; tag: string; tagBg: string; tagColor: string }[] = [];
          const isDeficit = activeReport.balance < 0;
          const highLafferTaxes = (state?.taxes || []).filter(t => t.rate > 38);
          const inflation = activeReport.inflation ?? state?.economy.inflation ?? 5.0;
          const unemployment = activeReport.unemployment ?? state?.economy.unemployment ?? 10.0;
          const approval = activeReport.approval ?? state?.player.popularity ?? 40;
          const coalitionSeats = state?.congress?.coalitionSeats || 240;

          // 1. Diagnóstico Fiscal
          if (isDeficit) {
            if (highLafferTaxes.length > 0) {
              tips.push({
                title: 'Alerta da Curva de Laffer na Arrecadação',
                desc: `Você tem tributos com alíquota superior a 38% (${highLafferTaxes.map(t => `${t.name}: ${t.rate}%`).join(', ')}). Alíquotas tão altas geram evasão fiscal e fuga de capitais. Dica: reduza ligeiramente essas alíquotas na aba de Impostos para que a arrecadação líquida real aumente!`,
                icon: '⚖️',
                tag: 'Finanças Públicas',
                tagBg: '#fef2f2',
                tagColor: '#dc2626'
              });
            } else {
              tips.push({
                title: 'Déficit Nominal das Contas da União',
                desc: `As contas públicas registraram déficit de R$ ${Math.abs(activeReport.balance)} bi neste semestre. Dica: para evitar o crescimento descontrolado da dívida (${activeReport.publicDebt}% do PIB), avalie cortar despesas em ministérios de menor retorno, realizar concessões de ativos de estatais ou ampliar sutilmente tributos com alíquotas moderadas.`,
                icon: '📉',
                tag: 'Ajuste Fiscal',
                tagBg: '#fff7ed',
                tagColor: '#c2410c'
              });
            }
          } else {
            tips.push({
              title: 'Superávit Primário e Folga Orçamentária',
              desc: `Excelente disciplina fiscal com superávit de +R$ ${activeReport.balance} bi. Dica: use este colchão para impulsionar investimentos estratégicos nos Estados através do Mapa da Federação ou expandir programas sociais sem gerar pressão inflacionária.`,
              icon: '💰',
              tag: 'Superávit',
              tagBg: '#f0fdf4',
              tagColor: '#16a34a'
            });
          }

          // 2. Diagnóstico de Inflação e Emprego
          if (inflation > 7.0) {
            tips.push({
              title: 'Pressão Inflacionária Corroendo a Renda',
              desc: `A inflação acumulada de ${inflation}% é o principal vilão da sua popularidade nas pesquisas. Dica: evite elevar impostos indiretos sobre consumo e considere subsídios setoriais pontuais em combustíveis ou cesta básica na aba de Empresas Estatais.`,
              icon: '🔥',
              tag: 'Preços & Selic',
              tagBg: '#fef2f2',
              tagColor: '#b91c1c'
            });
          } else if (unemployment > 11.0) {
            tips.push({
              title: 'Desemprego Elevado Exige Estímulos à Atividade',
              desc: `Taxa de desemprego em ${unemployment}%. Dica: impulsione parcerias público-privadas de infraestrutura, incentive setores intensivos em mão de obra e aproveite a aba de Programas Sociais para criar frentes emergenciais de trabalho.`,
              icon: '👥',
              tag: 'Mercado de Trabalho',
              tagBg: '#eff6ff',
              tagColor: '#1d4ed8'
            });
          }

          // 3. Diagnóstico de Governabilidade no Congresso
          if (coalitionSeats < 257) {
            tips.push({
              title: 'Risco de Paralisia Legislativa no Congresso',
              desc: `Sua base aliada possui apenas ${coalitionSeats} dos 257 votos necessários para aprovar leis ordinárias. Dica: vá à aba Coalizão para negociar ministérios com partidos de centro, articule com Governadores no Mapa ou utilize a liberação emergencial de emendas para blindar a governabilidade.`,
              icon: '🏛️',
              tag: 'Articulação Política',
              tagBg: '#fef3c7',
              tagColor: '#b45309'
            });
          } else {
            tips.push({
              title: 'Maioria Consolidada na Câmara dos Deputados',
              desc: `Sua coalizão conta com confortáveis ${coalitionSeats} parlamentares. Dica: este é o momento ideal para pautar reformas estruturantes e Projetos de Lei de maior impacto antes que o ciclo eleitoral divida os partidos.`,
              icon: '✅',
              tag: 'Maioria no Congresso',
              tagBg: '#f0fdf4',
              tagColor: '#15803d'
            });
          }

          // 4. Humor Popular
          if (approval < 40) {
            tips.push({
              title: 'Reconstrução da Confiança Popular',
              desc: `Aprovação presidencial em ${approval}%. Dica: anuncie novos benefícios sociais, faça visitas aos estados pelo Mapa para ouvir demandas locais e evite pautas fiscais impopulares até recuperar a marca dos 50%.`,
              icon: '📢',
              tag: 'Aprovação Popular',
              tagBg: '#faf5ff',
              tagColor: '#7e22ce'
            });
          }

          return (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>
                  <Award size={20} color="#2563eb" /> Diagnóstico do Conselho Presidencial & Recomendações
                </div>
                <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                  Análise Estratégica
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tips.map((tip, idx) => (
                  <div key={idx} style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '1.1rem' }}>{tip.icon}</span>
                        <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>{tip.title}</strong>
                      </div>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        background: tip.tagBg,
                        color: tip.tagColor
                      }}>
                        {tip.tag}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: '1.45' }}>
                      {tip.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Botão de Fechar / Avançar */}
        <div style={{ textAlign: 'right' }}>
          <button onClick={closeReportModal} className="btn btn-gold" style={{ padding: '0.75rem 2.25rem', fontSize: '0.92rem' }}>
            Continuar para o Próximo Semestre <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
