import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import moment from 'moment';

import { GameType } from '../../../../types';
import { Icon } from '../../../components/icon/icon';
import LinearGradientView from '../../../components/LinearGradientView';
import { getYAxisData, weeklyLoadData } from '../../../helpers/chartHelpers';
import { selectGamesWithinDateRange } from '../../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import store, { useAppSelector } from '../../../redux/store';
import {
  DOTTED_LINES_CHARTS,
  gradientColorsMatch,
  gradientColorsTraining,
  utils,
  variables
} from '../../../utils/mixins';

const WeeklyChart = () => {
  const allPlayers = useAppSelector(selectAllPlayers);
  const navigation = useNavigation();

  const navigate = (id: string) => {
    navigation.navigate('Report', { eventId: id });
  };

  const weekEvents = selectGamesWithinDateRange(
    store.getState(),
    moment().clone().startOf('isoWeek').format('YYYY/MM/DD'),
    moment().clone().endOf('isoWeek').format('YYYY/MM/DD')
  );

  const { weeklyOverview } = weeklyLoadData(weekEvents, allPlayers);

  const maxValue = useMemo(() => {
    return _.max(weeklyOverview.map((item) => item.load));
  }, [weeklyOverview]);
  const factor =
    (maxValue || 1) / 5 < 1
      ? (maxValue || 1) / 5
      : Math.round(maxValue || 1) / 5;
  const verticalPercentage = 100 / ((maxValue || 1) + factor);
  const dataLines = getYAxisData(Math.round(maxValue || 0), factor);
  dataLines.push(dataLines[dataLines.length - 1] + factor);
  const horizontalPercentage = 100 / (dataLines.length - 1);

  const renderLines = () => {
    return dataLines.map((line, index) => {
      if (index === dataLines.length - 1 || index === 0) return null;
      return (
        <Text
          key={index}
          ellipsizeMode="clip"
          numberOfLines={1}
          style={[
            styles.horizontalLine,
            { bottom: `${horizontalPercentage * index - 4}%` }
          ]}
        >
          {DOTTED_LINES_CHARTS}
        </Text>
      );
    });
  };

  const renderNoDataDay = (index: number, dayNumber: string) => {
    const isLastEvent = index === variables.weekdaysAbbr.length - 1;
    return (
      <View key={index} style={styles.subContainer}>
        <View
          style={[
            styles.chartContainer,
            isLastEvent && {
              borderRightWidth: 1
            }
          ]}
        >
          {weeklyOverview.length > 0 && renderLines()}
        </View>

        <View
          style={[styles.textRightBorder, isLastEvent && { marginRight: 0 }]}
        >
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>
              {variables.weekdays[index].toUpperCase()}
            </Text>
            <Text style={styles.legendTextBlack}>{dayNumber}</Text>
          </View>
          <View style={styles.legendContainer}>
            <Text style={styles.legendText}>{'Day off'.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderData = (
    dayData: {
      id: string;
      load: number;
      explosive: number;
      veryHigh: number;
      high: number;
      date: any;
      indicator: number | string | null;
      type: GameType.Training | GameType.Match;
    }[],
    index: number,
    dayNumber: string
  ) => {
    return dayData.map((event, ind) => {
      const isLastEvent =
        index === variables.weekdaysAbbr.length - 1 &&
        ind === dayData.length - 1;

      const getLegendText = (indicator: string | number | null) => {
        if (indicator === null) {
          return 'Training';
        }
        if (typeof indicator === 'number') {
          if (indicator === 0) return `MD`;
          return `MD ${indicator > 0 ? '+' : ''}${indicator}`;
        }

        return utils.getTrainingTitleFromString(indicator);
      };
      return (
        <View key={ind} style={styles.subContainer}>
          <Pressable
            onPress={() => navigate(event.id)}
            style={[
              styles.chartContainer,
              isLastEvent && {
                borderRightWidth: 1
              }
            ]}
          >
            <LinearGradientView
              index={event.id}
              colors={
                event.type === GameType.Match
                  ? gradientColorsMatch
                  : gradientColorsTraining
              }
              linearGradient={{ y2: '100%' }}
              style={StyleSheet.flatten([
                styles.barContainer,
                { height: `${event.load * verticalPercentage - 1}%` }
              ])}
            />
            {event.load > 0 && (
              <Text
                style={[
                  styles.barDataNumber,
                  { bottom: `${event.load * verticalPercentage - 1}%` }
                ]}
              >
                {Math.round(event.load)}
              </Text>
            )}
            {weeklyOverview.length > 0 && renderLines()}
          </Pressable>

          <View
            style={[styles.textRightBorder, isLastEvent && { marginRight: 0 }]}
          >
            <View style={styles.legendContainer}>
              <Text style={styles.legendText}>
                {variables.weekdays[index].toUpperCase()}
              </Text>
              <Text style={styles.legendTextBlack}>{dayNumber}</Text>
            </View>
            <View style={styles.legendContainer}>
              <Text style={styles.legendText}>
                {event.type === GameType.Match
                  ? 'MATCH'
                  : getLegendText(event.indicator)}
              </Text>
              <Icon icon="footballBoot" style={styles.legendIcon} />
            </View>
          </View>
        </View>
      );
    });
  };

  const renderChart = () => {
    return variables.weekdaysAbbr.map((day, index) => {
      const dayData = weeklyOverview.filter((game) => {
        return moment(game.date, 'YYYY/MM/DD').format('ddd') === day;
      });
      const dayNumber = moment(
        moment().clone().startOf('isoWeek').format('YYYY/MM/DD'),
        'YYYY/MM/DD'
      )
        .add(index, 'days')
        .format('D');
      if (!dayData.length) {
        return renderNoDataDay(index, dayNumber);
      }
      return renderData(dayData, index, dayNumber);
    });
  };

  const renderYaxis = () => {
    return dataLines.map((line, index) => {
      return (
        <Text
          key={index}
          style={[
            styles.YaxisText,
            { bottom: `${horizontalPercentage * index - 4}%` }
          ]}
        >
          {index === dataLines.length - 1 ? 'LOAD' : line.toFixed(0)}
        </Text>
      );
    });
  };

  const renderNoDataText = () => {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Nothing here yet!</Text>
        <Text style={styles.noDataText}>
          Soon you will get an overview of the latest performance of your team
          here.
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[styles.mainContainer, !weeklyOverview.length && { opacity: 0.3 }]}
    >
      <ScrollView
        horizontal
        style={{ width: '90%' }}
        showsHorizontalScrollIndicator={false}
      >
        {renderChart()}
      </ScrollView>
      {!weeklyOverview.length && renderNoDataText()}
      <View style={styles.YaxisContainer}>{renderYaxis()}</View>
    </View>
  );
};

export default WeeklyChart;

const styles = StyleSheet.create({
  YaxisContainer: {
    height: 200,
    position: 'absolute',
    right: -8,
    width: '10%'
  },
  YaxisText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    left: 0,
    position: 'absolute'
  },
  barContainer: {
    backgroundColor: 'red',
    bottom: 0,
    height: 30,
    left: 30,
    position: 'absolute',
    width: 40,
    zIndex: 10
  },
  barDataNumber: {
    fontFamily: variables.mainFont,
    fontSize: 15,
    left: 0,
    position: 'absolute',
    textAlign: 'center',
    width: '100%'
  },
  chartContainer: {
    borderColor: variables.lightestGrey,
    borderRightWidth: 0,
    borderWidth: 1,
    height: 200
  },
  horizontalLine: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 8,
    position: 'absolute',
    zIndex: 1
  },
  legendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingHorizontal: 2
  },
  legendIcon: {
    color: variables.lightGrey,
    height: 15,
    width: 15
  },
  legendText: {
    color: variables.lightGrey,
    fontSize: 12
  },
  legendTextBlack: {
    color: variables.textBlack,
    fontSize: 12
  },
  mainContainer: {
    marginTop: 15,
    width: '100%'
  },
  noDataContainer: {
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
    position: 'absolute',
    width: '100%'
  },
  noDataText: {
    fontFamily: variables.mainFont,
    fontSize: 14,
    textAlign: 'center',
    width: 280
  },
  subContainer: {
    width: 100
  },
  textRightBorder: {
    borderRightColor: variables.lightestGrey,
    borderRightWidth: 1,
    marginRight: -1,
    paddingHorizontal: 5
  }
});
