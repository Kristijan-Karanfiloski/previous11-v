import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { GameAny } from '../../../../types';
import {
  getWeeklyFeedbackDescription,
  RPEFormatedData
} from '../../../helpers/chartHelpers';
import { variables } from '../../../utils/mixins';

import WeeklyFeedbackChart from './WeeklyFeedbackChart';

interface Props {
  weekRpe: {
    rpeData: RPEFormatedData;
    event: GameAny;
  }[];
  weekPlayers: ({
    id: string;
    playerName: string;
    tShirt: string | null;
  } | null)[];
}

const WeeklyPlayerChart = ({ weekRpe, weekPlayers }: Props) => {
  const [activePlayer, setActivePlayer] = useState<string | null>('');

  const handlePress = (id: string) => {
    if (activePlayer === id) {
      return setActivePlayer(null);
    }
    return setActivePlayer(id);
  };

  const getCircleBackground = (feedback: number | undefined) => {
    if (!feedback || feedback === 0) {
      return { backgroundColor: variables.lighterGrey };
    }
    if (feedback === 8) {
      return { backgroundColor: variables.chartHigh };
    }
    if (feedback === 9) {
      return { backgroundColor: variables.chartVeryHigh };
    }
    if (feedback === 10) {
      return { backgroundColor: variables.chartExplosive };
    }
    return { backgroundColor: variables.black };
  };

  const getCircleTextColor = (feedback: number | undefined) => {
    if (!feedback || feedback === 0) {
      return { color: variables.black };
    }
    return { color: variables.realWhite };
  };

  const renderPlayerCircles = (playerName: string) => {
    return weekRpe.map((data, index) => {
      const feedback = data.rpeData.find(
        (item) => item.playerName === playerName
      )?.feedback;

      const description = getWeeklyFeedbackDescription(data.event);
      return (
        <View key={index} style={styles.dataContainer}>
          <Text style={styles.dataText}>{description}</Text>
          <View
            style={StyleSheet.flatten([
              styles.dataCircleContainer,
              getCircleBackground(feedback)
            ])}
          >
            <Text
              style={StyleSheet.flatten([
                styles.dataCircleText,
                getCircleTextColor(feedback)
              ])}
            >
              {feedback && feedback !== 0 ? feedback : '-'}
            </Text>
          </View>
        </View>
      );
    });
  };

  const renderExpandedData = (playerChartData: number[]) => {
    return (
      <View style={styles.expandedDataContainer}>
        <View style={styles.expandedDataHeader}>
          <Text style={styles.legendLeftText}>PLAYER VS TEAM</Text>
          <View style={styles.legendContainer}>
            <View
              style={StyleSheet.flatten([
                styles.legendDot,
                {
                  backgroundColor: variables.lightGrey
                }
              ])}
            />
            <Text style={styles.legendRightText}>Team</Text>
            <View
              style={StyleSheet.flatten([
                styles.legendDot,
                {
                  backgroundColor: variables.black
                }
              ])}
            />
            <Text style={styles.legendRightText}>Player</Text>
          </View>
        </View>
        <View style={styles.padding10}>
          <WeeklyFeedbackChart
            weekRpe={weekRpe}
            playerId={activePlayer}
            playerChartData={playerChartData}
          />
        </View>
      </View>
    );
  };

  const renderPlayer = (
    player: {
      id: string;
      playerName: string;
      tShirt: string | null;
    } | null
  ) => {
    if (!player) return null;
    const { id, playerName, tShirt } = player;
    const playerChartData = weekRpe.map((item) => {
      const playerRPE = item.rpeData.find((it) => it.id === id);
      return playerRPE && playerRPE.feedback ? playerRPE.feedback : 0;
    });

    return (
      <View style={{ marginBottom: 4 }}>
        <View key={id} style={styles.cardContainer}>
          <Text style={styles.playerName}>
            {tShirt || ''} {playerName}
          </Text>
          <View style={styles.circleContainer}>
            {renderPlayerCircles(playerName)}
          </View>
          {playerChartData.length === 0 ||
          playerChartData.filter((item) => item > 0).length === 0
            ? null
            : (
            <TouchableOpacity
              style={styles.expandedDataButton}
              onPress={() => handlePress(id)}
            >
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color={variables.textBlack}
              />
            </TouchableOpacity>
              )}
        </View>
        {id === activePlayer ? renderExpandedData(playerChartData) : null}
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {weekPlayers.map((player) => renderPlayer(player))}
    </View>
  );
};

export default WeeklyPlayerChart;

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderRadius: 4,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-between',
    padding: 12
  },
  circleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 35
  },
  dataCircleContainer: {
    alignItems: 'center',
    backgroundColor: variables.black,
    borderRadius: 50,
    height: 24,
    justifyContent: 'center',
    width: 24
  },
  dataCircleText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  dataContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10
  },
  dataText: {
    fontFamily: variables.mainFont,
    fontSize: 10,
    marginRight: 4
  },
  expandedDataButton: { padding: 10, position: 'absolute', right: 10 },
  expandedDataContainer: {
    backgroundColor: variables.realWhite,
    height: 270,
    padding: 10
  },
  expandedDataHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  legendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 50
  },
  legendDot: {
    height: 3,
    marginRight: 5,
    width: 12
  },
  legendLeftText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  legendRightText: {
    fontFamily: variables.mainFont,
    fontSize: 10,
    marginRight: 10
  },
  mainContainer: {
    marginBottom: 50,
    padding: 10
  },
  padding10: { padding: 10 },
  playerName: { fontFamily: variables.mainFontMedium, fontSize: 12 }
});
