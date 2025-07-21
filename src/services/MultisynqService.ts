import MultisynqClient from '@multisynq/client';
import { Position, PlayerAction, Player } from '../types/game';

export class MultisynqService {
  private client: MultisynqClient | null = null;
  private roomId: string | null = null;
  private playerId: string | null = null;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      // Initialize Multisynq client with API key
      this.client = new MultisynqClient({
        apiKey: import.meta.env.VITE_MULTISYNQ_API_KEY || 'demo-key',
        environment: 'development'
      });
      
      console.log('🔗 Multisynq client initialized');
    } catch (error) {
      console.error('Failed to initialize Multisynq:', error);
    }
  }

  // Create a new multiplayer room
  async createRoom(hostPlayerId: string): Promise<string> {
    if (!this.client) {
      throw new Error('Multisynq client not initialized');
    }

    try {
      const room = await this.client.createRoom({
        name: `echoes-room-${Date.now()}`,
        maxPlayers: 4,
        gameType: 'echoes-testnet'
      });

      this.roomId = room.id;
      this.playerId = hostPlayerId;

      console.log('🏠 Multisynq room created:', room.id);
      return room.id;
    } catch (error) {
      console.error('Failed to create Multisynq room:', error);
      throw error;
    }
  }

  // Join an existing room
  async joinRoom(roomCode: string, playerId: string): Promise<void> {
    if (!this.client) {
      throw new Error('Multisynq client not initialized');
    }

    try {
      await this.client.joinRoom(roomCode, {
        playerId,
        playerData: {
          address: playerId,
          position: { x: 150, y: 150 },
          score: 0
        }
      });

      this.roomId = roomCode;
      this.playerId = playerId;

      console.log('🚪 Joined Multisynq room:', roomCode);
    } catch (error) {
      console.error('Failed to join Multisynq room:', error);
      throw error;
    }
  }

  // Sync player movement in real-time
  async syncPlayerMovement(position: Position, action: PlayerAction): Promise<void> {
    if (!this.client || !this.roomId) return;

    try {
      await this.client.sendMessage(this.roomId, {
        type: 'player_move',
        playerId: this.playerId,
        position,
        action,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to sync movement:', error);
    }
  }

  // Sync puzzle solution
  async syncPuzzleSolution(sequence: number[], round: number): Promise<void> {
    if (!this.client || !this.roomId) return;

    try {
      await this.client.sendMessage(this.roomId, {
        type: 'puzzle_solved',
        playerId: this.playerId,
        sequence,
        round,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to sync puzzle solution:', error);
    }
  }

  // Listen for real-time updates
  onPlayerUpdate(callback: (data: any) => void): void {
    if (!this.client || !this.roomId) return;

    this.client.onMessage(this.roomId, (message) => {
      if (message.type === 'player_move' || message.type === 'puzzle_solved') {
        callback(message);
      }
    });
  }

  // Sync ghost positions for all players
  async syncGhostPositions(ghostPositions: Position[]): Promise<void> {
    if (!this.client || !this.roomId) return;

    try {
      await this.client.sendMessage(this.roomId, {
        type: 'ghost_update',
        playerId: this.playerId,
        ghostPositions,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to sync ghost positions:', error);
    }
  }

  // Leave room
  async leaveRoom(): Promise<void> {
    if (!this.client || !this.roomId) return;

    try {
      await this.client.leaveRoom(this.roomId);
      this.roomId = null;
      this.playerId = null;
    } catch (error) {
      console.error('Failed to leave room:', error);
    }
  }
}

export const multisynqService = new MultisynqService();