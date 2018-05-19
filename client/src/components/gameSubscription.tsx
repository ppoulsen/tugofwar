import gql from "graphql-tag";
import * as React from 'react';
import { GraphqlQueryControls, Query } from "react-apollo";

import GameFragment from '../fragments/GameFragment';

const CURRENT_GAME_ID_QUERY = gql`
  query currentGameId {
    currentGameId @client
  }
`;

const GAME_QUERY = gql`
  query Game($gameId: String!) {
    game(id: $gameId) {
      ...GameFragment
    }
  }
  ${GameFragment}
`;

const GAME_SUBSCRIPTION = gql`
  subscription onGameChanged($gameId: String!) {
    gameChanged(gameId: $gameId) {
      ...GameFragment
    }
  }
  ${GameFragment}
`;

export default class GameSubscription extends React.Component {
  private hasSubscribed: string[] = [];

  public render() {
    return (
      <Query
        query={CURRENT_GAME_ID_QUERY}
      >
        {({ loading: currentLoading, error: currentError, data: currentData }) => {
          if (currentLoading) {
            return 'Loading...';
          }
          if (currentError) {
            return `Error! ${currentError.message}`;
          }

          const gameId: string | null = currentData.currentGameId;

          if (!gameId) {
            return <div>None</div>;
          }

          return (
            <Query
              query={GAME_QUERY}
              variables={{ gameId }}
            >
              {({ subscribeToMore, loading, error, data }) => {
                if (loading) {
                  return 'Loading...';
                }
                if (error) {
                  return `Error! ${error.message}`;
                }
                this.subscribeOnce(subscribeToMore, gameId);
                return <div>{JSON.stringify(data)}</div>;
              }}
            </Query>
          );
        }}
      </Query>
    )
  }

  private subscribeOnce(subscribeToMore: GraphqlQueryControls['subscribeToMore'], gameId: string) {
    if (this.hasSubscribed.includes(gameId)) {
      return;
    }
    subscribeToMore({
      document: GAME_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData } ) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const updatedGame = subscriptionData.data.gameChanged;
        return Object.assign({}, prev, {
          game: {
            ...updatedGame,
          },
        });
      },
      variables: { gameId },
    });
    this.hasSubscribed.push(gameId);
  }
}
