import gql from "graphql-tag";
import * as React from 'react';
import { Mutation, MutationFn } from "react-apollo";

import GameFragment from '../fragments/GameFragment';

const TRY_CHARACTER = gql`
  mutation tryCharacter($gameId: String!, $character: String!) {
    tryCharacter(gameId: $gameId, character: $character) {
      ...GameFragment
    }
  }
  ${GameFragment}
`;

export interface ILiveGameProps {
  currentGameId: string;
  currentString: string;
  position: number;
  playerNumber: 1 | 2;
}

export default class LiveGame extends React.Component<ILiveGameProps, {}> {
  public render() {
    return (
      <Mutation mutation={TRY_CHARACTER}>
        {(tryCharacter) => (
          <div>
            <input onChange={this.handleCharacter.bind(this, tryCharacter)} />
            <div>{this.props.currentString}</div>
            <div>{this.props.position}</div>
          </div>
        )}
      </Mutation>
    );
  }

  private handleCharacter(tryCharacter: MutationFn, e: React.FormEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    if (!value || !value.length) {
      return;
    }
    e.currentTarget.value = '';
    if (value.length !== 1) {
      return;
    }

    tryCharacter({ variables: { gameId: this.props.currentGameId, character: value }});
  }
}
