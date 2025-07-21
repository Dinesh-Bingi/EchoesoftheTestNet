// Mock Multisynq service to avoid import issues
import { Position, PlayerAction } from '../types/game';

export class MultisynqService {
  private roomId: string | null = null;
  private playerId: string | null = null;

  constructor() {
    console.log('🔗 Mock Multisynq service initialized');
  }

  // Create a new multiplayer room
  async createRoom(hostPlayerId: string): Promise<string> {
    try {
      const roomId = `room-${Date.now()}`;
      this.roomId = roomId;
      this.playerId = hostPlayerId;

      console.log('🏠 Mock room created:', roomId);
      return roomId;
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  }

  // Join an existing room
  async joinRoom(roomCode: string, playerId: string): Promise<void> {
    try {
      this.roomId = roomCode;
      this.playerId = playerId;

      console.log('🚪 Joined mock room:', roomCode);
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  }

  // Sync player movement in real-time
  async syncPlayerMovement(position: Position, action: PlayerAction): Promise<void> {
    // Mock implementation - just log the movement
    console.log('🎮 Mock player movement:', { position, action });
  }

  // Sync puzzle solution
  async syncPuzzleSolution(sequence: number[], round: number): Promise<void> {
    console.log('🧩 Mock puzzle solution:', { sequence, round });
  }

  // Listen for real-time updates
  onPlayerUpdate(callback: (data: any) => void): void {
    console.log('👂 Mock player update listener registered');
  }

  // Sync ghost positions for all players
  async syncGhostPositions(ghostPositions: Position[]): Promise<void> {
    console.log('👻 Mock ghost positions sync:', ghostPositions.length);
  }

  // Leave room
  async leaveRoom(): Promise<void> {
    this.roomId = null;
    this.playerId = null;
    console.log('🚪 Left mock room');
  }
}

export const multisynqService = new MultisynqService();