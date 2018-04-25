import { makeExecutableSchema } from 'graphql-tools';
import { GameResolver, GameSchema } from './Game';

const RootQuery = `
  type RootQuery {
    game(id: String!): Game
  }
`;

const RootMutation = `
  type RootMutation {
    createGameOrQueue(initialString: String!): Game
    tryCharacter(gameId: String!, character: String!): Game
  }
`;

const SchemaDefinition = `
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`;

export default makeExecutableSchema({
  // we could also concatenate arrays
  // typeDefs: [SchemaDefinition, RootQuery].concat(Post)
  resolvers: GameResolver,
  typeDefs: [
    SchemaDefinition, RootQuery, RootMutation,
    // we have to destructure array imported from the post.js file
    // as typeDefs only accepts an array of strings or functions
    ...GameSchema,
  ],
});
