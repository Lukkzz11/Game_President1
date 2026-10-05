'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { HeartHandshake, Plus, CheckCircle, ShieldAlert, Users, DollarSign, X } from 'lucide-react';
import type { SocialProgram } from '@/game/types';

export const SocialProgramsTab: React.FC = () => {
  const { state, createCustomSocialProgram } = useGame();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [benefit, setBenefit] = useState(350);
  const [beneficiaries, setBeneficiaries] = useState(3.5);
  const [targetGroup, setTargetGroup] = useState('Famílias em extrema vulnerabilidade');

  if (!state) return null;

  const { socialPrograms } = state;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const annualCost = Math.round(((benefit * 12 * beneficiaries * 1_000_000) / 1_000_000_000) * 10) / 10;

    const newProg: SocialProgram = {
      id: `prog_${Date.now()}`,
      name,
      description: `Transferência direta mensal de R$ ${benefit} para ${beneficiaries} milhões de pessoas.`,
      monthlyBenefit: benefit,
      beneficiaryCount: beneficiaries,
      annualCost,
      targetGroup,
      povertyReductionImpact: Math.min(25, Math.round(beneficiaries * 3.5)),
      approvalBoost: Math.min(20, Math.round(beneficiaries * 2.8)),
      active: true
    };

    createCustomSocialProgram(newProg);
    setShowCreateModal(false);
    setName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <HeartHandshake size={26} color="var(--accent-emerald)" />
              <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#0f172a' }}>
                Programas Sociais & Transferência de Renda
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '720px' }}>
              Crie e gerencie programas de assistência direta aos 34% de cidadãos em situação de pobreza da República. Transferências de renda reduzem a desigualdade e estimulam o consumo básico imediato, mas exigem disciplina orçamentária para não comprometer as metas fiscais.
            </p>
          </div>

          <button onClick={() => setShowCreateModal(true)} className="btn btn-emerald">
            <Plus size={16} /> Criar Novo Programa Social
          </button>
        </div>
      </div>

      {/* Lista de Programas Sociais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {socialPrograms.map(prog => (
          <div
            key={prog.id}
            className="glass-panel"
            style={{
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: prog.active ? '4px solid var(--accent-emerald)' : '4px solid #94a3b8',
              background: '#ffffff'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{prog.name}</h4>
                <span className={`badge ${prog.active ? 'badge-emerald' : 'badge-crimson'}`} style={{ fontSize: '0.68rem' }}>
                  {prog.active ? 'Ativo' : 'Pausado'}
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '1rem' }}>
                {prog.description}
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.6rem',
                fontSize: '0.78rem',
                marginBottom: '1rem'
              }}>
                <div>Benefício: <strong className="font-mono" style={{ color: 'var(--accent-gold)' }}>R$ {prog.monthlyBenefit}/mês</strong></div>
                <div>Alcance: <strong className="font-mono">{prog.beneficiaryCount}M famílias</strong></div>
                <div>Impacto na Pobreza: <strong className="font-mono" style={{ color: 'var(--accent-emerald)' }}>-{prog.povertyReductionImpact}%</strong></div>
                <div>Custo Anual: <strong className="font-mono" style={{ color: 'var(--accent-crimson)' }}>R$ {prog.annualCost} bi</strong></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Público-alvo: <strong>{prog.targetGroup}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar Programa */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 className="font-title" style={{ fontSize: '1.3rem', color: '#0f172a' }}>
                Instituir Novo Programa Social
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-outline" style={{ padding: '0.35rem' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Nome Oficial do Programa
                </label>
                <input
                  type="text"
                  className="input-text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Programa Renda Mínima Materna"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Valor Mensal por Família (R$)
                </label>
                <input
                  type="number"
                  className="input-text font-mono"
                  value={benefit}
                  min={100}
                  max={1200}
                  step={50}
                  onChange={e => setBenefit(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Número de Beneficiários (Milhões de Pessoas)
                </label>
                <input
                  type="number"
                  className="input-text font-mono"
                  value={beneficiaries}
                  min={0.5}
                  max={15.0}
                  step={0.5}
                  onChange={e => setBeneficiaries(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Público-Alvo Prioritário
                </label>
                <input
                  type="text"
                  className="input-text"
                  value={targetGroup}
                  onChange={e => setTargetGroup(e.target.value)}
                  placeholder="Ex: Mães solo e trabalhadores informais sem renda fixa"
                  required
                />
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Custo estimado anual para o Orçamento: <strong className="font-mono" style={{ color: 'var(--accent-crimson)' }}>
                  R$ {(((benefit * 12 * beneficiaries * 1_000_000) / 1_000_000_000)).toFixed(1)} bilhões
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-emerald">
                  Criar e Promulgar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
