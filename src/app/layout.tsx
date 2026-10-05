import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { GameProvider } from '@/game/state/GameContext';

export const metadata: Metadata = {
  title: 'Simulador Político - Presidência da República',
  description: 'Simulador político, econômico e social completo com Congresso, Supremo Tribunal de 11 Ministros, Leis, Orçamento e Constituição.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
