import { ApolloCache } from 'apollo-cache';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import merge = require('lodash/merge');

import currentGame from './currentGame';

type withClientStateType = typeof withClientState;
let stateLink: ReturnType<withClientStateType> | null = null;

export function getStateLink(cache: ApolloCache<NormalizedCacheObject>): ReturnType<withClientStateType> {
  if (stateLink) {
    return stateLink;
  }

  stateLink = withClientState({
    ...merge(currentGame),
    cache,
  });

  return stateLink;
}
