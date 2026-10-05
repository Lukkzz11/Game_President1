'use client';

import React, { useState } from 'react';
import { useGame } from '@/game/state/GameContext';
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Flame, 
  Scale, 
  Users, 
  Plus, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Globe2, 
  Briefcase, 
  Factory, 
  FileText, 
  Zap, 
  X,
  HelpCircle,
  Clock,
  Landmark,
  ArrowRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import type { 
  Enterprise, 
  EnterpriseSector, 
  GovernanceModel, 
  SectorSubsidy, 
  FiscalIncentiveProgram, 
  RegulatoryAgency 
} from '@/game/types';

export const StateEnterprisesTab: React.FC = () => {
  const { 
    state, 
    createStateEnterprise, 
    adjustEnterpriseStateStake, 
    privatizeEnterprise, 
    concedeEnterpriseAsset, 
    nationalizeEnterprise,
    createSectorSubsidy,
    cancelSectorSubsidy,
    createFiscalIncentive,
    cancelFiscalIncentive,
    updateAgencyAutonomy
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'soes' | 'private' | 'subsidies' | 'agencies'>('soes');
  
  // Modais de Operação
  const [showCreateSoeModal, setShowCreateSoeModal] = useState(false);
  const [selectedEnterpriseForPrivatization, setSelectedEnterpriseForPrivatization] = useState<Enterprise | null>(null);
  const [selectedEnterpriseForConcession, setSelectedEnterpriseForConcession] = useState<Enterprise | null>(null);
  const [selectedEnterpriseForStakeAdjust, setSelectedEnterpriseForStakeAdjust] = useState<Enterprise | null>(null);
  const [selectedEnterpriseForNationalization, setSelectedEnterpriseForNationalization] = useState<Enterprise | null>(null);
  const [showNewSubsidyModal, setShowNewSubsidyModal] = useState(false);
  const [showNewIncentiveModal, setShowNewIncentiveModal] = useState(false);
  const [selectedAgencyForEdit, setSelectedAgencyForEdit] = useState<RegulatoryAgency | null>(null);

  // Formulário: Criar Estatal
  const [newSoeForm, setNewSoeForm] = useState({
    name: '',
    acronym: '',
    sector: 'energy' as EnterpriseSector,
    objective: '',
    initialCapitalBi: 12.0,
    stateStake: 100,
    governance: 'commercial' as GovernanceModel,
    headquartersRegionId: 'reg_centro'
  });

  // Formulário: Privatização
  const [privatizeForm, setPrivatizeForm] = useState({
    model: 'full_sale' as 'full_sale' | 'partial_sale' | 'ipo' | 'foreign_sale',
    stakeToSell: 100
  });

  // Formulário: Concessão
  const [concessionForm, setConcessionForm] = useState({
    durationYears: 25,
    upfrontGrantFeeBi: 3.5
  });

  // Formulário: Ajustar Participação
  const [adjustStakeValue, setAdjustStakeValue] = useState(50);

  // Formulário: Estatização
  const [nationalizeForm, setNationalizeForm] = useState({
    indemnityCostBi: 15.0,
    reason: 'Segurança nacional e proteção do suprimento estratégico essencial'
  });

  // Formulário: Novo Subsídio
  const [subsidyForm, setSubsidyForm] = useState({
    sector: 'energy' as EnterpriseSector,
    name: 'Subsídio Tarifário Emergencial',
    budgetBi: 2.5,
    durationSemesters: 4,
    targetBeneficiary: 'Consumidores residenciais e microempresas',
    conditions: 'Congelamento de reajuste tarifário durante o período',
    priceReductionPercent: 15,
    outputBoostPercent: 6,
    inefficiencyRisk: 20
  });

  // Formulário: Novo Incentivo Fiscal
  const [incentiveForm, setIncentiveForm] = useState({
    name: 'Incentivo à Modernização Fabril & Exportação',
    sector: 'industry' as EnterpriseSector,
    minInvestmentBi: 1.0,
    taxDiscountPercent: 25,
    durationSemesters: 6,
    targetRegionId: 'all',
    requiredJobs: 2500,
    localContentPercent: 50
  });

  if (!state) return null;

  const enterprises = state.enterprises || [];
  const stateOwnedAndMixed = enterprises.filter(e => e.stateStake > 0);
  const privateEnterprises = enterprises.filter(e => e.stateStake === 0);
  const subsidies = state.sectorSubsidies || [];
  const incentives = state.fiscalIncentives || [];
  const agencies = state.regulatoryAgencies || [];

  const totalDividendsReceived = stateOwnedAndMixed.reduce((acc, e) => acc + (e.dividendsPaidToTreasury || 0), 0);
  const totalEmployeesInStateSector = stateOwnedAndMixed.reduce((acc, e) => acc + e.employees, 0);

  const getSectorLabel = (sec: EnterpriseSector) => {
    const labels: Record<EnterpriseSector, string> = {
      energy: '⚡ Energia & Eletricidade',
      oil_gas: '🛢️ Petróleo & Gás',
      mining: '⛏️ Mineração & Minérios',
      transport: '🚆 Transporte & Ferrovias',
      banking: '🏦 Bancos & Crédito',
      infrastructure: '🏗️ Infraestrutura & Portos',
      technology: '💻 Tecnologia & Semicondutores',
      telecom: '📡 Telecomunicações & 5G',
      sanitation: '💧 Água & Saneamento Básico',
      defense: '🛡️ Defesa & Indústria Bélica',
      industry: '🏭 Indústria Pesada & Siderurgia',
      agriculture: '🌾 Agricultura & Alimentos',
      logistics: '📦 Logística & Armazéns'
    };
    return labels[sec] || sec;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. CABEÇALHO DO SISTEMA DE POLÍTICA ECONÔMICA & EMPRESAS */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb'
            }}>
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="font-title" style={{ fontSize: '1.45rem', color: '#0f172a', margin: 0 }}>
                Empresas Estatais & Política Econômica
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Governança corporativa, controle acionário, privatizações, concessões, subsídios e regulação setorial
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => setShowCreateSoeModal(true)}
              className="btn btn-primary"
              style={{ fontSize: '0.84rem', padding: '0.55rem 1.1rem' }}
            >
              <Plus size={16} /> Fundar Empresa Estatal
            </button>
          </div>
        </div>

        {/* KPIs Econômicos Consolidados */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Dividendos ao Tesouro
            </div>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>
              R$ {totalDividendsReceived.toFixed(2)} bi
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Receita não-tributária no semestre
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Investimento Privado vs Público
            </div>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>
              {state.economy.privateInvestmentRate || 11.2}% <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ {state.economy.publicInvestmentRate || 3.3}%</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Total: {state.economy.investmentRate}% do PIB
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Confiança Empresarial & Mercado
            </div>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: (state.economy.businessConfidence || 50) >= 50 ? '#15803d' : '#b91c1c' }}>
              {state.economy.businessConfidence || 54} pts
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Capacidade instalada: {state.economy.capacityUtilization || 76.5}%
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Empregos no Setor Público/Misto
            </div>
            <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {totalEmployeesInStateSector.toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Trabalhadores em {stateOwnedAndMixed.length} estatais e mistas
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-ABAS DE NAVEGAÇÃO INTERNA */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('soes')}
          className={`btn ${activeSubTab === 'soes' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
        >
          <Building2 size={15} /> Estatais & Empresas Mistas ({stateOwnedAndMixed.length})
        </button>
        <button
          onClick={() => setActiveSubTab('private')}
          className={`btn ${activeSubTab === 'private' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
        >
          <Factory size={15} /> Ecossistema Privado & Nacionalizações ({privateEnterprises.length})
        </button>
        <button
          onClick={() => setActiveSubTab('subsidies')}
          className={`btn ${activeSubTab === 'subsidies' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
        >
          <Coins size={15} /> Subsídios & Incentivos Fiscais ({subsidies.filter(s => s.active).length + incentives.filter(i => i.active).length})
        </button>
        <button
          onClick={() => setActiveSubTab('agencies')}
          className={`btn ${activeSubTab === 'agencies' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.82rem', padding: '0.45rem 1rem' }}
        >
          <Scale size={15} /> Agências Reguladoras & Rigor ({agencies.length})
        </button>
      </div>

      {/* ============================================================== */}
      {/* SUB-ABA 1: EMPRESAS ESTATAIS & MISTAS                         */}
      {/* ============================================================== */}
      {activeSubTab === 'soes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.88rem', color: '#475569' }}>
              Empresas controladas majoritária ou minoritariamente pela União. Decida entre gestão estratégica, atração de capital misto, concessão ou privatização.
            </div>
            <span className="badge badge-neutral font-mono">
              {stateOwnedAndMixed.length} Empresas na Carteira Federal
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {stateOwnedAndMixed.map(ent => (
              <div 
                key={ent.id}
                className="glass-panel"
                style={{
                  padding: '1.4rem',
                  background: '#ffffff',
                  border: ent.stateStake === 100 ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div>
                  {/* Header do Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', margin: 0 }}>
                          {ent.name}
                        </h4>
                        {ent.acronym && (
                          <span className="badge badge-neutral font-mono" style={{ fontSize: '0.68rem' }}>
                            {ent.acronym}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                        {getSectorLabel(ent.sector)}
                      </div>
                    </div>

                    <span 
                      className={`badge ${ent.stateStake === 100 ? 'badge-blue' : 'badge-emerald'}`}
                      style={{ fontSize: '0.74rem', fontWeight: 800 }}
                    >
                      {ent.stateStake === 100 ? '100% Estatal' : `Mista (${ent.stateStake}% Estado)`}
                    </span>
                  </div>

                  {/* Informações Operacionais da Empresa */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    margin: '0.75rem 0',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Receita Anual</div>
                      <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        R$ {ent.annualRevenue} bi
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Lucro / Prejuízo</div>
                      <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: ent.annualProfit >= 0 ? '#15803d' : '#b91c1c' }}>
                        {ent.annualProfit >= 0 ? `+${ent.annualProfit}` : ent.annualProfit} bi
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Valuation</div>
                      <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7' }}>
                        R$ {ent.valuationBi} bi
                      </div>
                    </div>
                  </div>

                  {/* Barras de Desempenho e Governança */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Modelo de Governança:</span>
                      <strong style={{ color: '#0f172a' }}>
                        {ent.governance === 'commercial' ? 'Comercial de Mercado' : ent.governance === 'strategic_public' ? 'Estratégico de Preço Social' : 'Conselho Independente'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Funcionários Ativos:</span>
                      <strong style={{ color: '#0f172a' }}>{ent.employees.toLocaleString('pt-BR')}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Dividendos ao Tesouro:</span>
                      <strong style={{ color: '#15803d' }}>R$ {ent.dividendsPaidToTreasury || 0} bi/sem</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Eficiência Operacional:</span>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${ent.efficiency}%`, height: '100%', background: ent.efficiency >= 75 ? '#10b981' : '#f59e0b' }} />
                      </div>
                      <span className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 700 }}>{ent.efficiency}%</span>
                    </div>
                  </div>

                  {/* Fato Recente / Ação Autônoma da Empresa */}
                  {(ent.recentEvent || ent.autonomousActionSummary) && (
                    <div style={{
                      marginTop: '0.75rem',
                      background: '#f1f5f9',
                      borderLeft: '3px solid #3b82f6',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '0 4px 4px 0',
                      fontSize: '0.74rem',
                      color: '#334155',
                      lineHeight: '1.35'
                    }}>
                      {ent.autonomousActionSummary || ent.recentEvent}
                    </div>
                  )}
                </div>

                {/* Barra de Ações Presidenciais para a Empresa */}
                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  gap: '0.45rem',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => {
                      setSelectedEnterpriseForStakeAdjust(ent);
                      setAdjustStakeValue(ent.stateStake);
                    }}
                    className="btn btn-outline"
                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', flex: 1 }}
                  >
                    <Sliders size={13} /> Ajustar %
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEnterpriseForConcession(ent);
                      setConcessionForm({ durationYears: 25, upfrontGrantFeeBi: Math.round(ent.valuationBi * 0.25 * 10) / 10 });
                    }}
                    className="btn btn-outline"
                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', flex: 1 }}
                  >
                    <FileText size={13} /> Conceder
                  </button>

                  <button
                    onClick={() => {
                      setSelectedEnterpriseForPrivatization(ent);
                      setPrivatizeForm({ model: 'full_sale', stakeToSell: ent.stateStake });
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.74rem', padding: '0.35rem 0.65rem', flex: 1.2, background: '#b91c1c', borderColor: '#b91c1c' }}
                  >
                    <Coins size={13} /> Privatizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-ABA 2: ECOSSISTEMA PRIVADO & ESTATIZAÇÕES                  */}
      {/* ============================================================== */}
      {activeSubTab === 'private' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.88rem', color: '#475569' }}>
              Grandes corporações privadas que compõem o parque produtivo do país. Você pode fiscalizar, conceder incentivos ou nacionalizar companhias por motivo de soberania ou emergência.
            </div>
            <span className="badge badge-neutral font-mono">
              {privateEnterprises.length} Empresas Privadas Monitoradas
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {privateEnterprises.map(ent => (
              <div 
                key={ent.id}
                className="glass-panel"
                style={{
                  padding: '1.4rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', margin: 0 }}>
                        {ent.name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                        {getSectorLabel(ent.sector)}
                      </div>
                    </div>

                    <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
                      {ent.isConcession ? `Concessão (${ent.concessionDurationYears || 25} anos)` : '100% Privada'}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    background: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    margin: '0.75rem 0',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Faturamento</div>
                      <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        R$ {ent.annualRevenue} bi
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Lucro Líquido</div>
                      <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#15803d' }}>
                        R$ {ent.annualProfit} bi
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Exportações</div>
                      <div className="font-mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7' }}>
                        {ent.exportShare}% da receita
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.76rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Funcionários Empregados:</span>
                      <strong style={{ color: '#0f172a' }}>{ent.employees.toLocaleString('pt-BR')}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Participação no Mercado:</span>
                      <strong style={{ color: '#0f172a' }}>{ent.marketShare}% do setor</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Influência de Lobby no Congresso:</span>
                      <strong style={{ color: ent.politicalInfluence > 70 ? '#b45309' : '#0f172a' }}>
                        {ent.politicalInfluence} / 100
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Valor de Avaliação (Indenização):</span>
                      <strong className="font-mono" style={{ color: '#0284c7' }}>R$ {ent.valuationBi} bi</strong>
                    </div>
                  </div>

                  {(ent.recentEvent || ent.autonomousActionSummary) && (
                    <div style={{
                      marginTop: '0.75rem',
                      background: '#f8fafc',
                      borderLeft: '3px solid #64748b',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '0 4px 4px 0',
                      fontSize: '0.74rem',
                      color: '#475569',
                      lineHeight: '1.35'
                    }}>
                      {ent.autonomousActionSummary || ent.recentEvent}
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setSelectedEnterpriseForNationalization(ent);
                      setNationalizeForm({
                        indemnityCostBi: ent.valuationBi,
                        reason: `Intervenção estratégica no setor de ${ent.sector} para garantir a soberania nacional.`
                      });
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%', fontSize: '0.78rem', color: '#b91c1c', borderColor: '#fca5a5' }}
                  >
                    <Landmark size={14} /> Estatizar / Nacionalizar Companhia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-ABA 3: SUBSÍDIOS SETORIAIS & INCENTIVOS FISCAIS           */}
      {/* ============================================================== */}
      {activeSubTab === 'subsidies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Seção 1: Subsídios Setoriais */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 className="font-title" style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Coins size={18} color="var(--accent-gold)" /> Subsídios de Preços & Estímulo Setorial
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Reduz tarifas de transporte, combustível e energia para blindar a população da inflação, gerando despesa fiscal pública.
                </div>
              </div>

              <button
                onClick={() => setShowNewSubsidyModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem' }}
              >
                <Plus size={14} /> Conceder Novo Subsídio
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {subsidies.map(sub => (
                <div 
                  key={sub.id}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    background: '#ffffff',
                    borderLeft: sub.active ? '4px solid #10b981' : '4px solid #cbd5e1',
                    opacity: sub.active ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98rem', margin: 0 }}>
                      {sub.name}
                    </h4>
                    <span className={`badge ${sub.active ? 'badge-emerald' : 'badge-neutral'}`}>
                      {sub.active ? `${sub.semestersRemaining} semestres` : 'Expirado'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    Setor: <strong>{getSectorLabel(sub.sector)}</strong> • Beneficiário: {sub.targetBeneficiary}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.6rem', borderRadius: '4px', fontSize: '0.76rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Custo Semestral:</span><br />
                      <strong className="font-mono" style={{ color: '#b91c1c' }}>R$ {sub.budgetBi} bi</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Alívio no Preço:</span><br />
                      <strong className="font-mono" style={{ color: '#15803d' }}>-{sub.priceReductionPercent}%</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Risco Distorção:</span><br />
                      <strong className="font-mono" style={{ color: sub.inefficiencyRisk > 30 ? '#b45309' : '#64748b' }}>{sub.inefficiencyRisk}%</strong>
                    </div>
                  </div>

                  {sub.active && (
                    <button
                      onClick={() => cancelSectorSubsidy(sub.id)}
                      className="btn btn-outline"
                      style={{ width: '100%', fontSize: '0.74rem', color: '#b91c1c' }}
                    >
                      Revogar Subsídio
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Seção 2: Incentivos Fiscais ao Investimento Privado */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div>
                <h3 className="font-title" style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Factory size={18} color="var(--accent-blue)" /> Programas de Incentivo Fiscal ao Investimento Privado
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Desonera o imposto corporativo sob metas rigorosas de novos empregos e fábricas, acelerando a taxa de formação de capital.
                </div>
              </div>

              <button
                onClick={() => setShowNewIncentiveModal(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem' }}
              >
                <Plus size={14} /> Criar Programa de Incentivo
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {incentives.map(inc => (
                <div 
                  key={inc.id}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    background: '#ffffff',
                    borderLeft: inc.active ? '4px solid #3b82f6' : '4px solid #cbd5e1',
                    opacity: inc.active ? 1 : 0.6
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98rem', margin: 0 }}>
                      {inc.name}
                    </h4>
                    <span className={`badge ${inc.active ? 'badge-blue' : 'badge-neutral'}`}>
                      {inc.active ? `${inc.semestersRemaining} semestres` : 'Expirado'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.65rem' }}>
                    Setor Alvo: <strong>{getSectorLabel(inc.sector)}</strong> • Benefício: <strong>-{inc.taxDiscountPercent}% no IRPJ</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: '#f8fafc', padding: '0.6rem', borderRadius: '4px', fontSize: '0.76rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Investimento Mobilizado:</span><br />
                      <strong className="font-mono" style={{ color: '#0284c7' }}>+R$ {inc.totalPrivateInvestmentMobilized} bi</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Exigência de Empregos:</span><br />
                      <strong className="font-mono" style={{ color: '#15803d' }}>+{inc.requiredJobs} vagas</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Renúncia Tributária:</span><br />
                      <strong className="font-mono" style={{ color: '#b91c1c' }}>-R$ {inc.foregoneRevenueBi} bi/sem</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Conteúdo Nacional:</span><br />
                      <strong className="font-mono">{inc.localContentPercent}% mín.</strong>
                    </div>
                  </div>

                  {inc.active && (
                    <button
                      onClick={() => cancelFiscalIncentive(inc.id)}
                      className="btn btn-outline"
                      style={{ width: '100%', fontSize: '0.74rem', color: '#b91c1c' }}
                    >
                      Encerrar Regime de Incentivo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-ABA 4: AGÊNCIAS REGULADORAS                                */}
      {/* ============================================================== */}
      {activeSubTab === 'agencies' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.88rem', color: '#475569' }}>
              As agências reguladoras garantem o equilíbrio entre modicidade tarifária, segurança jurídica para os investidores e fiscalização das concessões e estatais.
            </div>
            <span className="badge badge-neutral font-mono">
              {agencies.length} Agências em Operação
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {agencies.map(agency => (
              <div 
                key={agency.id}
                className="glass-panel"
                style={{
                  padding: '1.4rem',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <h4 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', margin: 0 }}>
                          {agency.name}
                        </h4>
                        <span className="badge badge-blue font-mono" style={{ fontSize: '0.7rem' }}>
                          {agency.acronym}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                        Setor: {getSectorLabel(agency.sector)}
                      </div>
                    </div>

                    <span className={`badge ${agency.autonomyLevel === 'independent' ? 'badge-emerald' : agency.autonomyLevel === 'shared' ? 'badge-blue' : 'badge-gold'}`}>
                      {agency.autonomyLevel === 'independent' ? 'Independente' : agency.autonomyLevel === 'shared' ? 'Compartilhada' : 'Controle Presidencial'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.45', margin: '0.65rem 0' }}>
                    {agency.description}
                  </p>

                  <div style={{
                    background: '#f8fafc',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    fontSize: '0.76rem',
                    border: '1px solid #f1f5f9'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Diretor-Geral:</span>
                      <strong style={{ color: '#0f172a' }}>{agency.directorName}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Rigor Normativo:</span>
                      <strong style={{ color: '#0284c7' }}>
                        {agency.rigorLevel === 'high' ? 'Rigoroso (Padrões Severos)' : agency.rigorLevel === 'balanced' ? 'Equilibrado' : 'Flexível / Desregulado'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ color: '#64748b' }}>Confiança do Mercado:</span>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${agency.marketConfidence}%`, height: '100%', background: agency.marketConfidence >= 80 ? '#10b981' : '#f59e0b' }} />
                      </div>
                      <span className="font-mono" style={{ fontWeight: 700 }}>{agency.marketConfidence}%</span>
                    </div>

                    {agency.priceCapRule && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '0.35rem' }}>
                        Regra de Preço: {agency.priceCapRule}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <button
                    onClick={() => setSelectedAgencyForEdit(agency)}
                    className="btn btn-outline"
                    style={{ width: '100%', fontSize: '0.78rem' }}
                  >
                    <Sliders size={14} /> Alterar Autonomia & Rigor
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: FUNDAR NOVA EMPRESA ESTATAL                           */}
      {/* ============================================================== */}
      {showCreateSoeModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '640px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={22} color="var(--accent-blue)" />
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Criar Nova Empresa Estatal / Mista
                </h3>
              </div>
              <button onClick={() => setShowCreateSoeModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              createStateEnterprise(newSoeForm);
              setShowCreateSoeModal(false);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Nome da Empresa:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Companhia Nacional de Semicondutores (CNS)"
                    value={newSoeForm.name}
                    onChange={e => setNewSoeForm({ ...newSoeForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Sigla Comercial:</label>
                    <input
                      type="text"
                      placeholder="Ex: SemicoNac"
                      value={newSoeForm.acronym}
                      onChange={e => setNewSoeForm({ ...newSoeForm, acronym: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Setor Produtivo:</label>
                    <select
                      value={newSoeForm.sector}
                      onChange={e => setNewSoeForm({ ...newSoeForm, sector: e.target.value as EnterpriseSector })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="energy">Energia & Eletricidade</option>
                      <option value="oil_gas">Petróleo & Gás</option>
                      <option value="mining">Mineração</option>
                      <option value="transport">Transporte & Logística</option>
                      <option value="banking">Bancos & Crédito de Fomento</option>
                      <option value="infrastructure">Infraestrutura & Obras</option>
                      <option value="technology">Tecnologia & Inovação</option>
                      <option value="telecom">Telecomunicações</option>
                      <option value="sanitation">Saneamento & Água</option>
                      <option value="defense">Defesa & Segurança</option>
                      <option value="industry">Indústria Fabril</option>
                      <option value="agriculture">Agricultura & Abastecimento</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Objetivo Estratégico da Empresa:</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Descreva a finalidade pública, comercial ou de segurança nacional da empresa..."
                    value={newSoeForm.objective}
                    onChange={e => setNewSoeForm({ ...newSoeForm, objective: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                      Capital Inicial (Aporte da União):
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        step="0.5"
                        value={newSoeForm.initialCapitalBi}
                        onChange={e => setNewSoeForm({ ...newSoeForm, initialCapitalBi: parseFloat(e.target.value) || 1 })}
                        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      />
                      <span className="font-mono" style={{ fontSize: '0.85rem' }}>bi</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                      Participação Estatal (%): {newSoeForm.stateStake}%
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={newSoeForm.stateStake}
                      onChange={e => setNewSoeForm({ ...newSoeForm, stateStake: parseInt(e.target.value) })}
                      style={{ width: '100%', marginTop: '0.5rem' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {newSoeForm.stateStake === 100 ? '100% Estatal (Controle Pleno)' : `Sociedade de Economia Mista (${newSoeForm.stateStake}% União)`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Modelo de Gestão:</label>
                    <select
                      value={newSoeForm.governance}
                      onChange={e => setNewSoeForm({ ...newSoeForm, governance: e.target.value as GovernanceModel })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="commercial">Comercial (Foco em Lucro e Dividendos)</option>
                      <option value="strategic_public">Estratégica (Preços Sociais Acessíveis)</option>
                      <option value="independent_board">Conselho de Administração Blindado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Sede Regional:</label>
                    <select
                      value={newSoeForm.headquartersRegionId}
                      onChange={e => setNewSoeForm({ ...newSoeForm, headquartersRegionId: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      {state.regions?.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#475569' }}>
                  💡 <strong>Impacto Preliminar:</strong> O capital de R$ {newSoeForm.initialCapitalBi} bi será aportado do orçamento da União, aumentando a capacidade de investimento público (+0.4% do PIB) e gerando cerca de {Math.round(newSoeForm.initialCapitalBi * 1800).toLocaleString('pt-BR')} empregos imediatos.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowCreateSoeModal(false)} className="btn btn-outline">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Promulgar Criação da Empresa
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: PRIVATIZAR EMPRESA                                    */}
      {/* ============================================================== */}
      {selectedEnterpriseForPrivatization && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '580px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Coins size={22} color="#b91c1c" />
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Privatização: {selectedEnterpriseForPrivatization.name}
                </h3>
              </div>
              <button onClick={() => setSelectedEnterpriseForPrivatization(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Participação Atual da União:</span>
                  <strong style={{ color: '#0f172a' }}>{selectedEnterpriseForPrivatization.stateStake}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#64748b' }}>Avaliação de Mercado (Valuation):</span>
                  <strong className="font-mono" style={{ color: '#0284c7' }}>R$ {selectedEnterpriseForPrivatization.valuationBi} bi</strong>
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                  Modelo de Alienação / Leilão:
                </label>
                <select
                  value={privatizeForm.model}
                  onChange={e => setPrivatizeForm({ ...privatizeForm, model: e.target.value as any })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="full_sale">Venda Integral (Controle 100% Privado)</option>
                  <option value="partial_sale">Venda Parcial (Manter Fatia Estratégica Minoritária)</option>
                  <option value="ipo">Abertura de Capital na Bolsa (IPO com pulverização de ações)</option>
                  <option value="foreign_sale">Leilão para Consórcio Estrangeiro (+15% de ágio em divisas)</option>
                </select>
              </div>

              <div>
                <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                  Percentual a ser Vendido: {privatizeForm.stakeToSell}%
                </label>
                <input
                  type="range"
                  min="10"
                  max={selectedEnterpriseForPrivatization.stateStake}
                  step="5"
                  value={privatizeForm.stakeToSell}
                  onChange={e => setPrivatizeForm({ ...privatizeForm, stakeToSell: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Cálculo do Caixa e Efeitos */}
              {(() => {
                const premium = privatizeForm.model === 'foreign_sale' ? 1.15 : privatizeForm.model === 'ipo' ? 1.08 : 1.0;
                const cashInflow = Math.round((selectedEnterpriseForPrivatization.valuationBi * (privatizeForm.stakeToSell / 100) * premium) * 10) / 10;
                const debtReduction = Math.round((cashInflow / state.economy.gdp) * 100 * 10) / 10;

                return (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.35rem' }}>
                      Projeção da Operação de Privatização:
                    </div>
                    <div>💰 Entrada de Caixa Imediata no Tesouro: <strong>+R$ {cashInflow} bi</strong></div>
                    <div>📉 Abatimento na Dívida Pública: <strong>-{debtReduction}% do PIB</strong></div>
                    <div>📈 Estímulo à Confiança Empresarial: <strong>+6 pontos</strong></div>
                    <div>⚠️ Repercussão: Sindicatos e partidos de esquerda registrarão protestos (-3% popularidade).</div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedEnterpriseForPrivatization(null)} className="btn btn-outline">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    privatizeEnterprise(selectedEnterpriseForPrivatization.id, privatizeForm.model, privatizeForm.stakeToSell);
                    setSelectedEnterpriseForPrivatization(null);
                  }}
                  className="btn btn-primary"
                  style={{ background: '#b91c1c', borderColor: '#b91c1c' }}
                >
                  Homologar Leilão de Privatização
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CONCEDER ATIVO (CONCESSÃO ≠ PRIVATIZAÇÃO)              */}
      {/* ============================================================== */}
      {selectedEnterpriseForConcession && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '580px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={22} color="var(--accent-blue)" />
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Concessão: {selectedEnterpriseForConcession.name}
                </h3>
              </div>
              <button onClick={() => setSelectedEnterpriseForConcession(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#1e40af' }}>
                🏛️ <strong>Princípio da Concessão:</strong> O Estado mantém a propriedade definitiva do ativo ou serviço público, delegando temporariamente a operação e os investimentos de manutenção à concessionária privada vencedora.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                    Prazo do Contrato (Anos):
                  </label>
                  <select
                    value={concessionForm.durationYears}
                    onChange={e => setConcessionForm({ ...concessionForm, durationYears: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value={15}>15 anos</option>
                    <option value={20}>20 anos</option>
                    <option value={25}>25 anos</option>
                    <option value={30}>30 anos (Padrão de Infraestrutura)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                    Valor da Outorga Inicial (R$ bi):
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="20"
                    step="0.5"
                    value={concessionForm.upfrontGrantFeeBi}
                    onChange={e => setConcessionForm({ ...concessionForm, upfrontGrantFeeBi: parseFloat(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                <div>💼 A concessionária assumirá metas de modernização fabril e expansão de capacidade.</div>
                <div>💰 A outorga de <strong>R$ {concessionForm.upfrontGrantFeeBi} bi</strong> entrará diretamente no caixa do Tesouro Nacional.</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedEnterpriseForConcession(null)} className="btn btn-outline">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    concedeEnterpriseAsset(selectedEnterpriseForConcession.id, concessionForm.durationYears, concessionForm.upfrontGrantFeeBi);
                    setSelectedEnterpriseForConcession(null);
                  }}
                  className="btn btn-primary"
                >
                  Assinar Contrato de Concessão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: AJUSTAR PARTICIPAÇÃO ACIONÁRIA                        */}
      {/* ============================================================== */}
      {selectedEnterpriseForStakeAdjust && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                Ajustar Participação: {selectedEnterpriseForStakeAdjust.name}
              </h3>
              <button onClick={() => setSelectedEnterpriseForStakeAdjust(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                  Nova Participação da União: {adjustStakeValue}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={adjustStakeValue}
                  onChange={e => setAdjustStakeValue(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '0.3rem' }}>
                  <span>0% (Privatização Total)</span>
                  <span>51% (Controle Majoritário)</span>
                  <span>100% (Integralmente Pública)</span>
                </div>
              </div>

              {(() => {
                const delta = adjustStakeValue - selectedEnterpriseForStakeAdjust.stateStake;
                const costOrRevenue = Math.round((selectedEnterpriseForStakeAdjust.valuationBi * (Math.abs(delta) / 100)) * 10) / 10;

                return (
                  <div style={{ background: delta > 0 ? '#eff6ff' : '#f0fdf4', padding: '0.85rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    {delta > 0 ? (
                      <div>
                        💰 <strong>Custo de Aporte:</strong> A União despenderá <strong>R$ {costOrRevenue} bi</strong> para recomprar {delta}% das ações no mercado.
                      </div>
                    ) : delta < 0 ? (
                      <div>
                        💵 <strong>Caixa Arrecadado:</strong> A venda de {Math.abs(delta)}% das ações gerará <strong>R$ {costOrRevenue} bi</strong> para amortizar a dívida pública.
                      </div>
                    ) : (
                      <div>Nenhuma alteração na estrutura societária da empresa.</div>
                    )}
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedEnterpriseForStakeAdjust(null)} className="btn btn-outline">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    adjustEnterpriseStateStake(selectedEnterpriseForStakeAdjust.id, adjustStakeValue);
                    setSelectedEnterpriseForStakeAdjust(null);
                  }}
                  className="btn btn-primary"
                >
                  Confirmar Ajuste Acionário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: NACIONALIZAÇÃO / ESTATIZAÇÃO                          */}
      {/* ============================================================== */}
      {selectedEnterpriseForNationalization && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '580px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Landmark size={22} color="#b91c1c" />
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Estatização: {selectedEnterpriseForNationalization.name}
                </h3>
              </div>
              <button onClick={() => setSelectedEnterpriseForNationalization(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.85rem', borderRadius: '6px', fontSize: '0.8rem', color: '#991b1b' }}>
                ⚠️ <strong>Ato de Soberania Econômica:</strong> A nacionalização transfere 100% da empresa para a União. Exige pagamento de indenização judicial e causa nervosismo imediato nos mercados financeiros (-12 pontos na confiança empresarial), mas assegura controle de preços e insumos estratégicos.
              </div>

              <div>
                <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                  Motivo da Estatização (Decreto Presidencial):
                </label>
                <textarea
                  rows={2}
                  value={nationalizeForm.reason}
                  onChange={e => setNationalizeForm({ ...nationalizeForm, reason: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                  Indenização Arbitrada (R$ bi):
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={nationalizeForm.indemnityCostBi}
                  onChange={e => setNationalizeForm({ ...nationalizeForm, indemnityCostBi: parseFloat(e.target.value) || 1 })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedEnterpriseForNationalization(null)} className="btn btn-outline">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    nationalizeEnterprise(selectedEnterpriseForNationalization.id, nationalizeForm.indemnityCostBi, nationalizeForm.reason);
                    setSelectedEnterpriseForNationalization(null);
                  }}
                  className="btn btn-primary"
                  style={{ background: '#b91c1c', borderColor: '#b91c1c' }}
                >
                  Decretar Estatização
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: NOVO SUBSÍDIO SETORIAL                                */}
      {/* ============================================================== */}
      {showNewSubsidyModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '580px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Coins size={22} color="var(--accent-gold)" />
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Conceder Novo Subsídio Setorial
                </h3>
              </div>
              <button onClick={() => setShowNewSubsidyModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              createSectorSubsidy(subsidyForm);
              setShowNewSubsidyModal(false);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Título do Programa de Subsídio:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Subsídio à Tarifa de Eletricidade Industrial"
                    value={subsidyForm.name}
                    onChange={e => setSubsidyForm({ ...subsidyForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Setor Beneficiado:</label>
                    <select
                      value={subsidyForm.sector}
                      onChange={e => setSubsidyForm({ ...subsidyForm, sector: e.target.value as any })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="energy">Energia</option>
                      <option value="oil_gas">Combustíveis / Óleo Diesel</option>
                      <option value="transport">Transporte Público</option>
                      <option value="agriculture">Agricultura & Alimentos</option>
                      <option value="industry">Indústria</option>
                      <option value="technology">Tecnologia</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Custo Semestral (R$ bi):</label>
                    <input
                      type="number"
                      min="0.5"
                      max="15"
                      step="0.5"
                      value={subsidyForm.budgetBi}
                      onChange={e => setSubsidyForm({ ...subsidyForm, budgetBi: parseFloat(e.target.value) || 1 })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Duração (Semestres):</label>
                    <select
                      value={subsidyForm.durationSemesters}
                      onChange={e => setSubsidyForm({ ...subsidyForm, durationSemesters: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value={2}>2 semestres (1 ano)</option>
                      <option value={4}>4 semestres (2 anos)</option>
                      <option value={6}>6 semestres (3 anos)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Redução Estimada no Preço (%):</label>
                    <input
                      type="number"
                      min="5"
                      max="40"
                      value={subsidyForm.priceReductionPercent}
                      onChange={e => setSubsidyForm({ ...subsidyForm, priceReductionPercent: parseInt(e.target.value) || 10 })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Condições e Fiscalização:</label>
                  <input
                    type="text"
                    value={subsidyForm.conditions}
                    onChange={e => setSubsidyForm({ ...subsidyForm, conditions: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowNewSubsidyModal(false)} className="btn btn-outline">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Instituir Subsídio Setorial
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 7: NOVO PROGRAMA DE INCENTIVO FISCAL                     */}
      {/* ============================================================== */}
      {showNewIncentiveModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '580px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Factory size={22} color="var(--accent-blue)" />
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Criar Programa de Incentivo Fiscal
                </h3>
              </div>
              <button onClick={() => setShowNewIncentiveModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              createFiscalIncentive(incentiveForm);
              setShowNewIncentiveModal(false);
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Nome do Programa:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Regime Especial de Atração Automotiva & Verde"
                    value={incentiveForm.name}
                    onChange={e => setIncentiveForm({ ...incentiveForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Setor Produtivo:</label>
                    <select
                      value={incentiveForm.sector}
                      onChange={e => setIncentiveForm({ ...incentiveForm, sector: e.target.value as any })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="industry">Indústria de Transformação</option>
                      <option value="technology">Tecnologia & Inovação</option>
                      <option value="energy">Energias Renováveis</option>
                      <option value="agriculture">Agroindústria</option>
                      <option value="mining">Minerais Estratégicos</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Desconto no IRPJ (%):</label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={incentiveForm.taxDiscountPercent}
                      onChange={e => setIncentiveForm({ ...incentiveForm, taxDiscountPercent: parseInt(e.target.value) || 20 })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Investimento Mínimo (R$ bi):</label>
                    <input
                      type="number"
                      min="0.2"
                      max="10"
                      step="0.1"
                      value={incentiveForm.minInvestmentBi}
                      onChange={e => setIncentiveForm({ ...incentiveForm, minInvestmentBi: parseFloat(e.target.value) || 0.5 })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Empregos Exigidos:</label>
                    <input
                      type="number"
                      min="500"
                      max="20000"
                      step="500"
                      value={incentiveForm.requiredJobs}
                      onChange={e => setIncentiveForm({ ...incentiveForm, requiredJobs: parseInt(e.target.value) || 1000 })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Duração do Benefício:</label>
                    <select
                      value={incentiveForm.durationSemesters}
                      onChange={e => setIncentiveForm({ ...incentiveForm, durationSemesters: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value={4}>4 semestres (2 anos)</option>
                      <option value={6}>6 semestres (3 anos)</option>
                      <option value={8}>8 semestres (4 anos)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>Conteúdo Nacional (%):</label>
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={incentiveForm.localContentPercent}
                      onChange={e => setIncentiveForm({ ...incentiveForm, localContentPercent: parseInt(e.target.value) || 40 })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setShowNewIncentiveModal(false)} className="btn btn-outline">
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Criar Programa de Incentivo
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 8: EDITAR AUTONOMIA E RIGOR DA AGÊNCIA REGULADORA         */}
      {/* ============================================================== */}
      {selectedAgencyForEdit && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="glass-panel" style={{ background: '#ffffff', width: '92%', maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Scale size={22} color="var(--accent-purple)" />
                <h3 className="font-title" style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Regulação: {selectedAgencyForEdit.acronym}
                </h3>
              </div>
              <button onClick={() => setSelectedAgencyForEdit(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div>
                <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                  Grau de Autonomia Institucional:
                </label>
                <select
                  defaultValue={selectedAgencyForEdit.autonomyLevel}
                  id="agencyAutonomySelect"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="independent">Independente (Mandato Fixo e Blindagem Política)</option>
                  <option value="shared">Gestão Compartilhada com o Ministério</option>
                  <option value="presidential_control">Controle Presidencial Direto (Diretor de Livre Exoneração)</option>
                </select>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Maior autonomia aumenta a confiança do investidor privado e reduz o risco regulatório.
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.3rem' }}>
                  Diretriz de Rigor Normativo:
                </label>
                <select
                  defaultValue={selectedAgencyForEdit.rigorLevel}
                  id="agencyRigorSelect"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="high">Rigor Elevado (Fiscalização Severa e Multas)</option>
                  <option value="balanced">Equilibrado (Modicidade Tarifária e Segurança)</option>
                  <option value="deregulated">Desregulatório (Liberdade Tarifária e Menos Exigências)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setSelectedAgencyForEdit(null)} className="btn btn-outline">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const autoEl = document.getElementById('agencyAutonomySelect') as HTMLSelectElement;
                    const rigorEl = document.getElementById('agencyRigorSelect') as HTMLSelectElement;
                    if (autoEl && rigorEl) {
                      updateAgencyAutonomy(selectedAgencyForEdit.id, autoEl.value as any, rigorEl.value as any);
                    }
                    setSelectedAgencyForEdit(null);
                  }}
                  className="btn btn-primary"
                >
                  Salvar Diretriz Regulatória
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
