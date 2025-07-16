export interface Position {
  x: number;
  y: number;
}

export interface PlayerAction {
  type: 'move' | 'reset' | 'solve';
  position: Position;
  timestamp: number;
}

export interface Player {
  id: string;
  address: string;
  position: Position;
  score: number;
  isHost: boolean;
  pastActions: PlayerAction[][];
}

export type GameState = 'lobby' | 'playing' | 'finished';

export interface GameRoom {
  code: string;
  players: Player[];
  currentRound: number;
  maxRounds: number;
  isActive: boolean;
}

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  player: string;
  data: any;
}

export interface NFTMetadata {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
}