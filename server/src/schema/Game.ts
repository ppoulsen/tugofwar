import Store, { IGame } from '../store/index';
const store = new Store();

export const GameSchema = [`
type Game {
  currentString: String!
  gameId: String!
  initialString1: String!
  initialString2: String!
  isComplete: Boolean!
  isoStartTime: String!
  isoEndTime: String
  position: Int!
  sessionId1: String!
  sessionId2: String!
  winner: Int
}
`];

export const GameResolver = {
  RootMutation: {
    createGameOrQueue(obj: {}, args: { initialString: string}, context: { sessionId: string | void }): IGame | null {
      if (!context.sessionId) {
        throw new Error('No access');
      }
      const result = store.createGameOrQueue(context.sessionId, args.initialString);
      return result ? result : null;
    },
    tryCharacter(obj: {}, args: { gameId: string, character: string }, context: { sessionId: string | void }): IGame {
      if (!context.sessionId) {
        throw new Error('No access');
      }
      return store.tryCharacter(args.gameId, context.sessionId, args.character);
    },
  },
  RootQuery: {
    game(obj: {}, args: { id: string }, context: { sessionId: string | void }): IGame | null {
      if (!context.sessionId) {
        return null;
      }
      return store.getAuthorizedGame(args.id, context.sessionId);
    },
  },
};
