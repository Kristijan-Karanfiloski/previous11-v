import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GameType } from '../../../../types';
import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import { utils, variables } from '../../../utils/mixins';

import LatestInfo from './LatestInfo';
import MatchesInfo from './MatchesInfo';

const MatchesData = () => {
  const matchGames =
    useAppSelector(selectAllGames).filter(
      (game) => game.type === GameType.Match
    ) || [];

  const matchData = utils.getMatchData(matchGames);

  const renderMatchesInfo = () => {
    return (
      <MatchesInfo
        matchAverage={matchData.matchAverage}
        bestMatch={matchData.bestMatch}
      />
    );
  };

  const renderLatestInfo = () => {
    return <LatestInfo />;
  };

  return (
    <View style={styles.matchesContainer}>
      {renderMatchesInfo()}
      <View style={styles.divider} />
      {renderLatestInfo()}
    </View>
  );
};

export default MatchesData;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: variables.lighterGrey,
    borderRadius: 10,
    height: 1,
    marginLeft: '10%',
    width: '80%'
  },

  matchesContainer: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    height: 380,
    marginLeft: 14,
    marginRight: 7,
    marginVertical: 7,
    width: '30%'
  }
});
