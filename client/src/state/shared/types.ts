import { ApolloCache } from "apollo-cache";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

export interface IMutationContext {
  cache: ApolloCache<NormalizedCacheObject>;
};
