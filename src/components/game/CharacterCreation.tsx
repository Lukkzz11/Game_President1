'use client';

import React, { useState } from 'react';
import type { Player } from '@/game/types';
import { User, ShieldCheck, Brain, Star, ArrowRight, ArrowLeft } from 'lucide-react';

interface CharacterCreationProps {
  initialPlayer: Player;
  onNext: (playerData: Partial<Player>) => void;
  onBack: () => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ initialPlayer, onNext, onBack }) => {
  const [name, setName] = useState(initialPlayer.name);
  const [age, setAge] = useState(initialPlayer.age);
  const [description, setDescription] = useState(initialPlayer.description);
  const [politicalExperience, setPoliticalExperience] = useState(initialPlayer.politicalExperience);
  const [integrity, setIntegrity] = useState(initialPlayer.integrity);
  const [competence, setCompetence] = useState(initialPlayer.competence);

  const presets = [
    {
      title: 'Economista & Gestor Técnico',
      desc: 'Ex-Secretário da Fazenda com alta competência técnica e reputação com o setor produtivo.',
      exp: 65,
      integ: 80,
      comp: 88
    },
    {
      title: 'Líder Político Tradicional',
      desc: 'Experiente parlamentar com trânsito livre em todas as bancadas do Congresso Nacional.',
      exp: 88,
      integ: 65,
      comp: 70
    },
    {
      title: 'Magistrado & Jurista Imparcial',
      desc: 'Famoso pelo combate à corrupção e defesa da legalidade institucional.',
      exp: 50,
      integ: 92,
      comp: 82
    },
    {
      title: 'Líder Popular & Comunitário',
      desc: 'Orador carismático com forte apelo junto aos trabalhadores e classes vulneráveis.',
      exp: 70,
      integ: 82,
      comp: 72
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor insira um nome para o seu político.');
      return;
    }
    onNext({
      name,
      age: Number(age),
      description,
      politicalExperience,
      integrity,
      competence
    });
  };

  return (
    <div style={{ maxWidth: '840px', width: '100%', margin: '2rem auto', padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>Etapa 1 de 4</span>
          <h1 className="font-title" style={{ fontSize: '1.85rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Criação do Personagem Político
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Defina o perfil, biografia e atributos do líder que disputará a Presidência da República Federativa do Brasil.
          </p>
        </div>

        {/* Presets Rápidos */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Trajetórias Pré-definidas
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDescription(p.desc);
                  setPoliticalExperience(p.exp);
                  setIntegrity(p.integ);
                  setCompetence(p.comp);
                }}
                className="btn btn-outline"
                style={{
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  height: '100%',
                  background: '#ffffff',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{p.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Nome Completo do Candidato
              </label>
              <input
                type="text"
                className="input-text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Arthur Fontoura"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                Idade (Anos)
              </label>
              <input
                type="number"
                className="input-text font-mono"
                value={age}
                min={35}
                max={85}
                onChange={e => setAge(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
              Biografia e Trajetória Política
            </label>
            <textarea
              className="input-textarea"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva a trajetória do seu líder político..."
            />
          </div>

          {/* Sliders de Atributos */}
          <div style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Atributos de Liderança
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Experiência Política */}
              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Star size={16} color="#f59e0b" /> Experiência Política & Articulação
                  </span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{politicalExperience}/100</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={95}
                  value={politicalExperience}
                  onChange={e => setPoliticalExperience(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Integridade Moral */}
              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <ShieldCheck size={16} color="#10b981" /> Integridade & Transparência Pública
                  </span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{integrity}/100</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={95}
                  value={integrity}
                  onChange={e => setIntegrity(Number(e.target.value))}
                  className="range-slider"
                />
              </div>

              {/* Competência Técnica */}
              <div className="slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                    <Brain size={16} color="#a855f7" /> Competência Técnica & Administrativa
                  </span>
                  <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{competence}/100</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={95}
                  value={competence}
                  onChange={e => setCompetence(Number(e.target.value))}
                  className="range-slider"
                />
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" onClick={onBack} className="btn btn-outline">
              <ArrowLeft size={16} /> Voltar ao Menu
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              Próximo: Escolher Partido <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
