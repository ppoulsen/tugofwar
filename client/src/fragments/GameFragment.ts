import gql from 'graphql-tag';

const GameFragment = gql`
  fragment GameFragment on Game {
    currentString
    gameId
    initialString1
    initialString2
    gameState
    isoStartTime
    isoEndTime
    position
    sessionId1
    sessionId2
    winner
  }
`;

export default GameFragment;
