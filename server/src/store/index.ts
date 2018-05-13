import { PubSub } from 'graphql-subscriptions';
import LRU = require('lru-cache');
import uuidv4 = require('uuid/v4');

export const pubsub = new PubSub();

enum GameState {
  Queued = 'Queued',
  InProgress = 'InProgress',
  Complete = 'Complete',
};

export interface IGame {
  currentString: string;
  gameId: string;
  gameState: GameState;
  initialString1: string;
  initialString2: string | null;
  isoStartTime: string;
  isoEndTime?: string | void;
  position: number;
  sessionId1: string;
  sessionId2: string | null;
  winner?: 1 | 2 | void;
};

const options = {
  maxAge: 1000 * 60 * 60, // 1 hour
  stale: true, // No reason not to
};
const gameStore = LRU(options);
let queuedGame: IGame | null = null;

function reverseString(input: string): string {
  return input.split('').reverse().join('');
}

export default class Store {
  public createOrJoinGame(sessionId2: string, initialString2: string): IGame | false {
    if (!queuedGame || queuedGame.sessionId1 === sessionId2) {
      queuedGame = {
        currentString: initialString2,
        gameId: uuidv4(),
        gameState: GameState.Queued,
        initialString1: initialString2,
        initialString2: null,
        isoStartTime: new Date().toISOString(),
        position: initialString2.length,
        sessionId1: sessionId2,
        sessionId2: null,
      };
      return queuedGame;
    }

    const newGame: IGame = {
      ...queuedGame,
      currentString: queuedGame.initialString1 + reverseString(initialString2),
      gameState: GameState.InProgress,
      initialString2,
      isoStartTime: new Date().toISOString(),
      sessionId2,
    };
    gameStore.prune();
    this.write(newGame.gameId, newGame);

    queuedGame = null;

    return newGame;
  }

  public removeFromQueue(sessionId: string): void {
    if (queuedGame && queuedGame.sessionId1 === sessionId) {
      queuedGame = null;
    }
  }

  public tryCharacter(gameId: string, sessionId: string, character: string): IGame {
    const game = this.getAuthorizedGame(gameId, sessionId);
    // Treat an access error the same as if missing
    if (!game) {
      throw new Error(`No game found with gameId=${gameId}`);
    }
    if (game.gameState === GameState.Complete) {
      return game;
    }

    let { currentString, position } = game;
    const isPlayer2 = game.sessionId2 === sessionId;
    // Flip the context for player 2
    if (isPlayer2) {
      currentString = reverseString(currentString);
      position = currentString.length - position;
    }

    if (currentString.charAt(position) !== character) {
      return game;
    }

    game.position = isPlayer2 ? game.position - 1 : game.position + 1;
    if (game.position === 0 || game.position === game.currentString.length) {
      game.gameState = GameState.Complete;
      game.isoEndTime = new Date().toISOString();
      game.winner = isPlayer2 ? 2 : 1;
    }

    this.write(game.gameId, game);
    return game;
  }

  public getAuthorizedGame(gameId: string, sessionId: string): null | IGame {
    const game = gameStore.get(gameId) as IGame | void;
    // Treat an access error the same as if missing
    if (!game || !(game.sessionId1 === sessionId || game.sessionId2 === sessionId)) {
      return null;
    }
    return game;
  }

  private write(key: string, game: IGame) {
    gameStore.set(key, game);
    pubsub.publish('gameChanged', { gameChanged: game });
  }
}
