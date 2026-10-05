'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Region, WorldCountry, MapFilterCategory, MapFilterMetric } from '@/game/types';
import { 
  Layers, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  MapPin, 
  Sparkles,
  Shield,
  TrendingUp,
  Maximize2
} from 'lucide-react';

interface ProfessionalGeoMapProps {
  mode: 'national' | 'world';
  regions: Region[];
  worldCountries: WorldCountry[];
  activeCategory: MapFilterCategory;
  activeMetric: MapFilterMetric;
  onSelectRegion: (region: Region) => void;
  onSelectCountry: (country: WorldCountry) => void;
}

type BasemapStyle = 'voyager' | 'dark' | 'satellite';

const TILE_SERVERS: Record<BasemapStyle, { url: string; attribution: string }> = {
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Earthstar Geographics'
  }
};

const STRATEGIC_BR_CITIES = [
  { name: 'Brasília', stateSigla: 'DF', lat: -15.7975, lng: -47.8919, isCapital: true },
  { name: 'São Paulo', stateSigla: 'SP', lat: -23.5505, lng: -46.6333 },
  { name: 'Rio de Janeiro', stateSigla: 'RJ', lat: -22.9068, lng: -43.1729 },
  { name: 'Belo Horizonte', stateSigla: 'MG', lat: -19.9167, lng: -43.9345 },
  { name: 'Salvador', stateSigla: 'BA', lat: -12.9777, lng: -38.5016 },
  { name: 'Curitiba', stateSigla: 'PR', lat: -25.4284, lng: -49.2733 },
  { name: 'Porto Alegre', stateSigla: 'RS', lat: -30.0346, lng: -51.2177 },
  { name: 'Recife', stateSigla: 'PE', lat: -8.0476, lng: -34.8770 },
  { name: 'Fortaleza', stateSigla: 'CE', lat: -3.7172, lng: -38.5433 },
  { name: 'Manaus', stateSigla: 'AM', lat: -3.1190, lng: -60.0217 },
  { name: 'Belém', stateSigla: 'PA', lat: -1.4558, lng: -48.4902 },
  { name: 'Goiânia', stateSigla: 'GO', lat: -16.6869, lng: -49.2648 },
  { name: 'Cuiabá', stateSigla: 'MT', lat: -15.6014, lng: -56.0979 }
];

const STRATEGIC_WORLD_CAPITALS = [
  { name: 'Buenos Aires', countryId: 'ARG', lat: -34.6037, lng: -58.3816 },
  { name: 'Washington D.C.', countryId: 'USA', lat: 38.9072, lng: -77.0369 },
  { name: 'Pequim', countryId: 'CHN', lat: 39.9042, lng: 116.4074 },
  { name: 'Berlim', countryId: 'DEU', lat: 52.5200, lng: 13.4050 },
  { name: 'Paris', countryId: 'FRA', lat: 48.8566, lng: 2.3522 },
  { name: 'Londres', countryId: 'GBR', lat: 51.5074, lng: -0.1278 },
  { name: 'Tóquio', countryId: 'JPN', lat: 35.6762, lng: 139.6503 },
  { name: 'Nova Délhi', countryId: 'IND', lat: 28.6139, lng: 77.2090 },
  { name: 'Santiago', countryId: 'CHL', lat: -33.4489, lng: -70.6693 },
  { name: 'Moscou', countryId: 'RUS', lat: 55.7558, lng: 37.6173 }
];

export const ProfessionalGeoMap: React.FC<ProfessionalGeoMapProps> = ({
  mode,
  regions,
  worldCountries,
  activeCategory,
  activeMetric,
  onSelectRegion,
  onSelectCountry
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const geojsonLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [basemap, setBasemap] = useState<BasemapStyle>('voyager');
  const [geoData, setGeoData] = useState<{ brGeo: any | null; worldGeo: any | null }>({
    brGeo: null,
    worldGeo: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados GeoJSON oficiais
  useEffect(() => {
    let isMounted = true;

    async function loadGeoJson() {
      try {
        const [brRes, worldRes] = await Promise.all([
          fetch('/brazil-states.geojson'),
          fetch('/world-countries.geojson')
        ]);

        const brGeo = brRes.ok ? await brRes.json() : null;
        const worldGeo = worldRes.ok ? await worldRes.json() : null;

        if (isMounted) {
          setGeoData({ brGeo, worldGeo });
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Erro ao carregar dados GeoJSON:', err);
        if (isMounted) setIsLoading(false);
      }
    }

    loadGeoJson();
    return () => {
      isMounted = false;
    };
  }, []);

  // Inicializar Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined') return;

    let isCleanedUp = false;

    async function initMap() {
      const L = (await import('leaflet')).default;
      if (isCleanedUp) return;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const initialCenter: [number, number] = mode === 'national' ? [-14.235, -51.925] : [15, 0];
        const initialZoom = mode === 'national' ? 4 : 2;

        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: initialZoom,
          minZoom: 2,
          maxZoom: 10,
          zoomControl: false,
          attributionControl: false
        });

        // Adicionar attribution discreta no canto inferior direito
        L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

        // Adicionar tile layer
        const tileConfig = TILE_SERVERS[basemap];
        const tileLayer = L.tileLayer(tileConfig.url, {
          attribution: tileConfig.attribution,
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        tileLayerRef.current = tileLayer;
        mapInstanceRef.current = map;
      }
    }

    initMap();

    return () => {
      isCleanedUp = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualizar Basemap Tile
  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === 'undefined') return;

    import('leaflet').then(L => {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const tileConfig = TILE_SERVERS[basemap];
      const newTile = L.default.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newTile;
    });
  }, [basemap]);

  // Função auxiliar para coloração de regiões do Brasil
  const getRegionColor = (region?: Region) => {
    if (!region) return '#475569';

    switch (activeMetric) {
      case 'gdp': {
        const val = region.gdp;
        if (val >= 1500) return '#047857';
        if (val >= 600) return '#059669';
        if (val >= 300) return '#10b981';
        if (val >= 150) return '#34d399';
        return '#6ee7b7';
      }
      case 'gdpPerCapita': {
        const val = region.gdpPerCapita || 35000;
        if (val >= 60000) return '#b45309';
        if (val >= 45000) return '#d97706';
        if (val >= 32000) return '#f59e0b';
        return '#fcd34d';
      }
      case 'unemployment': {
        const val = region.unemployment;
        if (val >= 11) return '#dc2626';
        if (val >= 9) return '#ea580c';
        if (val >= 7) return '#f59e0b';
        return '#0284c7';
      }
      case 'governmentApproval': {
        const val = region.governmentApproval;
        if (val >= 65) return '#15803d';
        if (val >= 50) return '#16a34a';
        if (val >= 40) return '#ca8a04';
        if (val >= 30) return '#ea580c';
        return '#b91c1c';
      }
      case 'crime': {
        const val = region.crimeRate;
        if (val >= 60) return '#991b1b';
        if (val >= 45) return '#dc2626';
        if (val >= 30) return '#f97316';
        return '#3b82f6';
      }
      case 'infrastructure_overall':
      case 'infrastructure_transport':
      case 'infrastructure_energy': {
        const val = region.infrastructure;
        if (val >= 75) return '#0284c7';
        if (val >= 55) return '#0ea5e9';
        if (val >= 40) return '#38bdf8';
        return '#7dd3fc';
      }
      default:
        return '#2563eb';
    }
  };

  // Função auxiliar para coloração de países estrangeiros
  const getCountryColor = (country?: WorldCountry, countryId?: string) => {
    if (countryId === 'BRA') return '#eab308'; // Brasil em destaque Dourado/Pátria
    if (!country) return '#334155';

    if (activeCategory === 'diplomacy' || activeMetric === 'diplomatic_status') {
      switch (country.diplomaticRelation.status) {
        case 'allied': return '#10b981';
        case 'friendly': return '#06b6d4';
        case 'neutral': return '#64748b';
        case 'tense': return '#f59e0b';
        case 'rival': return '#f43f5e';
        case 'sanctioned': return '#dc2626';
        default: return '#64748b';
      }
    }

    if (activeMetric === 'gdp') {
      const val = country.gdp;
      if (val >= 10000) return '#064e3b';
      if (val >= 3000) return '#047857';
      if (val >= 1000) return '#059669';
      return '#34d399';
    }

    if (activeMetric === 'gdpGrowth') {
      const val = country.gdpGrowth;
      if (val >= 4.0) return '#15803d';
      if (val >= 2.0) return '#16a34a';
      if (val >= 0.5) return '#ca8a04';
      return '#b91c1c';
    }

    return '#2563eb';
  };

  // Renderizar Camadas GeoJSON e Marcadores quando os dados mudarem
  useEffect(() => {
    if (!mapInstanceRef.current || isLoading || typeof window === 'undefined') return;

    import('leaflet').then(L => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Limpar camadas anteriores
      if (geojsonLayerRef.current) {
        map.removeLayer(geojsonLayerRef.current);
        geojsonLayerRef.current = null;
      }
      if (markersLayerRef.current) {
        map.removeLayer(markersLayerRef.current);
        markersLayerRef.current = null;
      }

      const markersGroup = L.layerGroup();

      if (mode === 'national' && geoData.brGeo) {
        // Ajustar visualização para o Brasil
        map.flyTo([-14.235, -51.925], 4.2, { duration: 1.2 });

        const geojson = L.geoJSON(geoData.brGeo, {
          style: (feature) => {
            const sigla = feature?.properties?.sigla?.toUpperCase();
            const reg = regions.find(
              r => r.acronym?.toUpperCase() === sigla || 
                   r.id.toLowerCase().includes(sigla?.toLowerCase() || '') ||
                   r.name.toLowerCase() === feature?.properties?.name?.toLowerCase()
            );

            const fillColor = getRegionColor(reg);

            return {
              fillColor,
              weight: 1.5,
              opacity: 0.9,
              color: '#ffffff',
              fillOpacity: basemap === 'satellite' ? 0.45 : 0.62
            };
          },
          onEachFeature: (feature, layer) => {
            const sigla = feature?.properties?.sigla?.toUpperCase();
            const reg = regions.find(
              r => r.acronym?.toUpperCase() === sigla || 
                   r.id.toLowerCase().includes(sigla?.toLowerCase() || '') ||
                   r.name.toLowerCase() === feature?.properties?.name?.toLowerCase()
            );

            if (reg) {
              const tooltipHtml = `
                <div style="min-width: 200px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin-bottom: 6px;">
                    <strong style="color: #60a5fa; font-size: 0.92rem;">${reg.name} (${reg.acronym || sigla})</strong>
                    <span style="font-size: 0.7rem; background: rgba(255,255,255,0.15); padding: 1px 5px; border-radius: 4px;">${reg.macroRegion}</span>
                  </div>
                  <div style="font-size: 0.78rem; line-height: 1.5;">
                    <div>🏛️ <strong>Governador:</strong> ${reg.governor?.name || reg.politicalDominance.governorName} (${reg.governor?.party || reg.politicalDominance.rulingPartyId.toUpperCase()})</div>
                    <div>📊 <strong>PIB:</strong> R$ ${reg.gdp} bi (R$ ${reg.gdpPerCapita?.toLocaleString('pt-BR') || '---'}/hab)</div>
                    <div>👥 <strong>Aprovação Federal:</strong> <span style="color: ${reg.governmentApproval >= 50 ? '#4ade80' : '#f87171'}; font-weight: 700;">${reg.governmentApproval}%</span></div>
                    <div>💼 <strong>Desemprego:</strong> ${reg.unemployment}% | 🚨 <strong>Crime:</strong> ${reg.crimeRate}/100</div>
                  </div>
                  <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 0.72rem; color: #fde047;">
                    ✦ Clique para despachar com o Governador & investir
                  </div>
                </div>
              `;

              layer.bindTooltip(tooltipHtml, {
                className: 'custom-map-tooltip',
                sticky: true,
                direction: 'top'
              });

              layer.on({
                mouseover: (e) => {
                  const target = e.target;
                  target.setStyle({
                    weight: 3,
                    color: '#f59e0b',
                    fillOpacity: 0.85
                  });
                  target.bringToFront();
                },
                mouseout: (e) => {
                  geojson.resetStyle(e.target);
                },
                click: () => {
                  onSelectRegion(reg);
                }
              });
            }
          }
        }).addTo(map);

        geojsonLayerRef.current = geojson;

        // Adicionar marcadores estratégicos de cidades brasileiras
        STRATEGIC_BR_CITIES.forEach(city => {
          const matchingRegion = regions.find(r => r.acronym?.toUpperCase() === city.stateSigla);

          const iconHtml = city.isCapital
            ? `
              <div class="capital-pulse-marker" title="Brasília - Capital Federal">
                <div class="beacon-pulse"></div>
                <span class="marker-star">⭐</span>
                <span class="marker-label">Brasília (DF)</span>
              </div>
            `
            : `
              <div class="city-dot-marker" title="${city.name}">
                <div class="dot-inner"></div>
                <span class="city-label">${city.name}</span>
              </div>
            `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize: city.isCapital ? [36, 36] : [14, 14],
            iconAnchor: city.isCapital ? [18, 18] : [7, 7]
          });

          const marker = L.marker([city.lat, city.lng], { icon: customIcon });

          if (matchingRegion) {
            marker.on('click', () => onSelectRegion(matchingRegion));
          }

          markersGroup.addLayer(marker);
        });

      } else if (mode === 'world' && geoData.worldGeo) {
        // Ajustar visualização para o mundo
        map.flyTo([18, 0], 2.2, { duration: 1.4 });

        const geojson = L.geoJSON(geoData.worldGeo, {
          style: (feature) => {
            const countryId = feature?.id ? String(feature.id) : undefined;
            const country = worldCountries.find(
              c => c.id.toUpperCase() === countryId?.toUpperCase() ||
                   c.name.toLowerCase() === feature?.properties?.name?.toLowerCase()
            );

            const fillColor = getCountryColor(country, countryId);

            return {
              fillColor,
              weight: 1.2,
              opacity: 0.85,
              color: '#ffffff',
              fillOpacity: basemap === 'satellite' ? 0.42 : 0.6
            };
          },
          onEachFeature: (feature, layer) => {
            const countryId = feature?.id ? String(feature.id) : undefined;
            const country = worldCountries.find(
              c => c.id.toUpperCase() === countryId?.toUpperCase() ||
                   c.name.toLowerCase() === feature?.properties?.name?.toLowerCase()
            );

            if (countryId === 'BRA') {
              layer.bindTooltip(`
                <div style="min-width: 170px;">
                  <strong style="color: #facc15; font-size: 0.95rem;">🇧🇷 República Federativa do Brasil</strong>
                  <div style="font-size: 0.78rem; margin-top: 4px;">
                    ✦ <strong>Seu País Governamental</strong><br/>
                    População: 215 milhões<br/>
                    Alterne para o modo <strong>Brasil</strong> para gerenciar os 27 estados.
                  </div>
                </div>
              `, { className: 'custom-map-tooltip', sticky: true });
              return;
            }

            if (country) {
              const statusLabel = {
                allied: '🟢 Aliado Estratégico',
                friendly: '🔵 Relações Amigáveis',
                neutral: '⚪ Neutro / Pragmático',
                tense: '🟠 Relações Tensas',
                rival: '🔴 Rival Geopolítico',
                sanctioned: '⛔ País Sancionado'
              }[country.diplomaticRelation.status] || country.diplomaticRelation.status;

              const tooltipHtml = `
                <div style="min-width: 210px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px; margin-bottom: 6px;">
                    <strong style="color: #60a5fa; font-size: 0.92rem;">${country.name} (${country.id})</strong>
                    <span style="font-size: 0.7rem; color: #94a3b8;">${country.capital}</span>
                  </div>
                  <div style="font-size: 0.78rem; line-height: 1.5;">
                    <div>👤 <strong>Líder Fictício:</strong> ${country.leader.name}</div>
                    <div>🏛️ <strong>Regime:</strong> ${country.politicalSystem === 'presidential' ? 'Presidencialista' : 'Parlamentarista'}</div>
                    <div>🤝 <strong>Status:</strong> ${statusLabel}</div>
                    <div>💰 <strong>PIB:</strong> US$ ${country.gdp} bi (${country.gdpGrowth > 0 ? '+' : ''}${country.gdpGrowth}%)</div>
                    <div>🚢 <strong>Comércio c/ Brasil:</strong> R$ ${country.diplomaticRelation.tradeVolumeBi} bi/sem</div>
                  </div>
                  <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 0.72rem; color: #fde047;">
                    ✦ Clique para negociar tratados, cúpula & sanções
                  </div>
                </div>
              `;

              layer.bindTooltip(tooltipHtml, {
                className: 'custom-map-tooltip',
                sticky: true,
                direction: 'top'
              });

              layer.on({
                mouseover: (e) => {
                  const target = e.target;
                  target.setStyle({
                    weight: 3,
                    color: '#38bdf8',
                    fillOpacity: 0.82
                  });
                  target.bringToFront();
                },
                mouseout: (e) => {
                  geojson.resetStyle(e.target);
                },
                click: () => {
                  onSelectCountry(country);
                }
              });
            }
          }
        }).addTo(map);

        geojsonLayerRef.current = geojson;

        // Adicionar marcadores estratégicos de capitais mundiais
        STRATEGIC_WORLD_CAPITALS.forEach(city => {
          const matchingCountry = worldCountries.find(c => c.id === city.countryId);

          const iconHtml = `
            <div class="city-dot-marker" title="${city.name} (${city.countryId})">
              <div class="dot-inner" style="background: #f59e0b; border-color: #ffffff;"></div>
              <span class="city-label" style="background: rgba(15,23,42,0.9); color: #fef08a;">${city.name}</span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          const marker = L.marker([city.lat, city.lng], { icon: customIcon });

          if (matchingCountry) {
            marker.on('click', () => onSelectCountry(matchingCountry));
          }

          markersGroup.addLayer(marker);
        });
      }

      markersGroup.addTo(map);
      markersLayerRef.current = markersGroup;
    });
  }, [mode, geoData, regions, worldCountries, activeMetric, activeCategory, basemap, isLoading]);

  // Controles de Câmera
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    if (mode === 'national') {
      mapInstanceRef.current.flyTo([-14.235, -51.925], 4.2, { duration: 0.8 });
    } else {
      mapInstanceRef.current.flyTo([18, 0], 2.2, { duration: 0.8 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '620px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
      {/* Container Leaflet Nativo */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          color: '#ffffff',
          gap: '0.75rem'
        }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Carregando Cartografia Oficial de Alta Definição...</div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Renderizando vetores do IBGE e bases geopolíticas em tempo real</div>
        </div>
      )}

      {/* Floating HUD: Estilos de Mapa & Controles de Câmera */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        pointerEvents: 'auto'
      }}>
        {/* Seletor de Basemap Tiles */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          padding: '0.3rem',
          display: 'flex',
          gap: '0.25rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <button
            onClick={() => setBasemap('voyager')}
            title="Cartografia Política HD (CartoDB Voyager)"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              background: basemap === 'voyager' ? '#2563eb' : 'transparent',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            🗺️ Político HD
          </button>
          <button
            onClick={() => setBasemap('dark')}
            title="Visão Tática Militar Escura (CartoDB Dark)"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              background: basemap === 'dark' ? '#2563eb' : 'transparent',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            🌌 Tático Escuro
          </button>
          <button
            onClick={() => setBasemap('satellite')}
            title="Fotografia Real de Satélite Orbital (Esri World Imagery)"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              background: basemap === 'satellite' ? '#2563eb' : 'transparent',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            🛰️ Satélite
          </button>
        </div>

        {/* Botões de Zoom & Centralizar */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'flex-end',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <button
            onClick={handleZoomIn}
            title="Aumentar Zoom"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              padding: '0.5rem',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomOut}
            title="Diminuir Zoom"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              padding: '0.5rem',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleResetView}
            title="Recentralizar Mapa"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Compass size={16} />
          </button>
        </div>
      </div>

      {/* Floating HUD: Legenda de Dados */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        zIndex: 500,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '8px',
        padding: '0.65rem 0.95rem',
        color: '#ffffff',
        fontSize: '0.75rem',
        boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.35rem',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <TrendingUp size={13} />
          <span>Filtro Ativo: {activeCategory.toUpperCase()} • {activeMetric.toUpperCase()}</span>
        </div>

        {mode === 'national' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Menor</span>
            <div style={{
              width: '120px',
              height: '8px',
              borderRadius: '4px',
              background: activeMetric === 'governmentApproval'
                ? 'linear-gradient(90deg, #b91c1c, #ca8a04, #15803d)'
                : activeMetric === 'unemployment' || activeMetric === 'crime'
                ? 'linear-gradient(90deg, #3b82f6, #f97316, #dc2626)'
                : 'linear-gradient(90deg, #6ee7b7, #10b981, #047857)'
            }} />
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Maior</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '320px', fontSize: '0.68rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Aliados
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} /> Amigáveis
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} /> Neutros
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Tensos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} /> Rivais/Sancionados
            </span>
          </div>
        )}

        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontStyle: 'italic' }}>
          💡 Dica: Role para zoom, arraste para mover e clique em qualquer região para abrir o painel.
        </div>
      </div>
    </div>
  );
};
