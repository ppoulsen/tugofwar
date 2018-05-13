import gql from "graphql-tag";
import * as React from 'react';
import { Mutation } from "react-apollo";

import GameFragment from '../fragments/GameFragment';

const CREATE_GAME_OR_QUEUE = gql`
  mutation createGameOrQueue($initialString: String!) {
    createGameOrQueue(initialString: $initialString) {
      ...GameFragment
    }
  }
  ${GameFragment}
`;

export default class StartGame extends React.Component {
  private inputRef: HTMLInputElement | null = null;

  public render() {
    return (
      <Mutation mutation={CREATE_GAME_OR_QUEUE}>
        {(createGameOrQueue, { data }) => (
          <div>
            <input ref={ref => this.inputRef = ref} />
            <button
              // tslint:disable jsx-no-lambda
              onClick={() => createGameOrQueue({
                variables: {
                  initialString: this.inputRef ? this.inputRef.value : ''
                }
              })}
              // tslint:enable jsx-no-lambda
            >
              Submit
            </button>
          </div>
        )}
      </Mutation>
    );
  }
}
