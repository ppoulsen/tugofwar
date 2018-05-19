import { IMutationContext } from './shared/types';

// Defaults
export interface ICurrentGameClientState {
  currentGameId: string | null;
};

export const defaults: ICurrentGameClientState = {
  currentGameId: null,
};

// Resolvers
interface ISetCurrentGameIdArguments {
  currentGameId: string | null;
};

export const resolvers = {
  Mutation: {
    setCurrentGameId: (_: any, { currentGameId }: ISetCurrentGameIdArguments, { cache }: IMutationContext) => {
      const data = {
        currentGameId,
      };
      cache.writeData({ data });
      return currentGameId;
    },
  },
};

export default {
  defaults,
  resolvers,
};
