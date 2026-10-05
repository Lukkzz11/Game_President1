import Dexie, { type EntityTable } from 'dexie';
import type { GameState } from '@/game/types';

export interface SavedGameRecord {
  id: string; // unique save id, e.g. "save_1" or timestamp
  saveName: string;
  playerName: string;
  partyName: string;
  turn: number;
  currentDate: string;
  createdAt: string;
  updatedAt: string;
  state: GameState;
}

const db = new Dexie('SimuladorPoliticoDB') as Dexie & {
  saves: EntityTable<SavedGameRecord, 'id'>;
};

db.version(1).stores({
  saves: 'id, saveName, playerName, partyName, turn, updatedAt'
});

export { db };

export async function saveGameToDb(state: GameState, customName?: string): Promise<string> {
  const saveId = state.id || `save_${Date.now()}`;
  const record: SavedGameRecord = {
    id: saveId,
    saveName: customName || state.saveName || `Mandato de ${state.player.name} - Turno ${state.turn}`,
    playerName: state.player.name,
    partyName: state.party.name,
    turn: state.turn,
    currentDate: state.currentDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: {
      ...state,
      id: saveId,
      lastSavedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  };

  await db.saves.put(record);
  return saveId;
}

export async function loadGameFromDb(saveId: string): Promise<GameState | null> {
  const record = await db.saves.get(saveId);
  return record ? record.state : null;
}

export async function listAllSaves(): Promise<SavedGameRecord[]> {
  return await db.saves.orderBy('updatedAt').reverse().toArray();
}

export async function deleteSaveFromDb(saveId: string): Promise<void> {
  await db.saves.delete(saveId);
}
