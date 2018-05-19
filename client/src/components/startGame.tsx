import gql from "graphql-tag";
import * as React from 'react';
import { Mutation, MutationFn } from "react-apollo";

import GameFragment from '../fragments/GameFragment';

const CREATE_GAME_OR_QUEUE = gql`
  mutation createGameOrQueue($initialString: String!) {
    createGameOrQueue(initialString: $initialString) {
      ...GameFragment
    }
  }
  ${GameFragment}
`;

const SET_CURRENT_GAME_ID = gql`
  mutation setCurrentGameId($currentGameId: String) {
    setCurrentGameId(currentGameId: $currentGameId) @client
  }
`;

export default class StartGame extends React.Component {
  private inputRef: HTMLInputElement | null = null;

  public render() {
    return (
      <Mutation mutation={SET_CURRENT_GAME_ID}>
       {(setCurrentGameId) => (
        <Mutation mutation={CREATE_GAME_OR_QUEUE}>
          {(createGameOrQueue, { data }) => (
            <div>
              <input ref={ref => this.inputRef = ref} />
              <button
                onClick={this.onSubmit.bind(this, createGameOrQueue, setCurrentGameId)}
              >
                Submit
              </button>
            </div>
          )}
        </Mutation>
       )}
      </Mutation>
    );
  }

  private onSubmit(createGameOrQueue: MutationFn, setCurrentGameId: MutationFn) {
    createGameOrQueue({
      variables: {
        initialString: this.inputRef ? this.inputRef.value : ''
      }
    }).then(result => {
      if (result && !result.errors && result.data) {
        setCurrentGameId({
          variables: {
            currentGameId: result.data.createGameOrQueue.gameId,
          },
        })
      }
    });
  }
}
