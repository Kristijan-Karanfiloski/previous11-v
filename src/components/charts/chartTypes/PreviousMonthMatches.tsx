import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import { GameAny } from '../../../../types';
import { utils, variables } from '../../../utils/mixins';

interface PreviousMonthMatchesProps {
  games: GameAny[];
}

const PreviousMonthMatches = ({ games }: PreviousMonthMatchesProps) => {
  const horizontalPercentage = 100 / games.length;
  const maxValue = _.max(
    games.map(
      (game) => game.report?.stats?.team?.fullSession?.playerLoad?.total || 0
    )
  );

  const factor =
    (maxValue || 1) / 5 < 1
      ? (maxValue || 1) / 5
      : Math.round((maxValue || 1) / 5);

  const verticalPercentage = 100 / ((maxValue || 0) + factor);

  return (
    <View style={styles.mainContainer}>
      {games.map((game, index) => {
        const load =
          game?.report?.stats?.team?.fullSession?.playerLoad?.total || 0;

        const { date, dateFormat } = utils.checkAndFormatUtcDate(
          game.UTCdate,
          game.date,
          game.startTime
        );

        return (
          <React.Fragment key={index}>
            <View
              style={[
                styles.verticalBar,
                {
                  height: `${verticalPercentage * load}%`,
                  left: `${index * horizontalPercentage}%`
                }
              ]}
            />
            <View
              style={[
                styles.legendContainer,
                { left: `${index * horizontalPercentage}%` }
              ]}
            >
              <Text>{moment(date, `${dateFormat}`).format('DD/MM-YY')}</Text>
              <Text style={styles.versusText}>vs {game.versus}</Text>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default PreviousMonthMatches;

const styles = StyleSheet.create({
  legendContainer: {
    bottom: -40,
    position: 'absolute'
  },
  mainContainer: {
    height: 250,
    zIndex: 10
  },
  versusText: {
    color: variables.grey2,
    fontSize: 12
  },
  verticalBar: {
    backgroundColor: utils.rgba(variables.textBlack, 0.8),
    bottom: 0,
    position: 'absolute',
    width: 40
  }
});
