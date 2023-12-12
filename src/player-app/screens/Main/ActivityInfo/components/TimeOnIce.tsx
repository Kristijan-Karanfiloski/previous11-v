import React, { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GameAny } from '../../../../../../types';
import TimeOnIceShifts from '../../../../../components/charts/chartTypes/TimeOnIceShifts';
import { variables } from '../../../../../utils/mixins';
import { getTime } from '../../../../heleprs';

interface Props {
  event: GameAny;
  playerId: string;
}

const TimeOnIce = ({ event, playerId }: Props) => {
  const [activeShift, setActiveShift] = useState<number | null>(null);
  const horizontalSliderRef = useRef<FlatList>(null);

  const timeOnIceData = (playerId &&
    event.report?.stats?.players[playerId] &&
    event.report?.stats?.players[playerId]?.fullSession?.timeOnIce) || {
    avg: 0,
    max: 0,
    min: 0,
    total: 0,
    series: []
  };

  const horizontalPercentage = 100 / (timeOnIceData.max || 1);

  const renderHeaderData = () => {
    return (
      <View style={styles.headerDataContainer}>
        <View style={styles.headerDataSubContainer}>
          <Text style={styles.headerDataTitles}>Total</Text>
          <Text style={styles.headerDataSubTitle}>
            {getTime(timeOnIceData.total, true)}
          </Text>
        </View>
        <View style={styles.headerDataDivider} />
        <View style={styles.headerDataSubContainer}>
          <Text style={styles.headerDataTitles}>Avg. Ice Time</Text>
          <Text style={styles.headerDataSubTitle}>
            {getTime(timeOnIceData.avg, true)}
          </Text>
        </View>
        <View style={styles.headerDataDivider} />
        <View style={styles.headerDataSubContainer}>
          <Text style={styles.headerDataTitles}>Shifts</Text>
          <Text style={styles.headerDataSubTitle}>
            {timeOnIceData.series.length}
          </Text>
        </View>
      </View>
    );
  };

  const getShiftNumber = (isMin = false) => {
    if (isMin) {
      return timeOnIceData.series.findIndex(
        (item) => item.end - item.start === timeOnIceData.min
      );
    }
    return timeOnIceData.series.findIndex(
      (item) => item.end - item.start === timeOnIceData.max
    );
  };

  const renderLongestAndShortestShift = () => {
    return (
      <View style={{ marginTop: 35, marginHorizontal: -16 }}>
        <Pressable
          onPress={() => {
            setActiveShift(getShiftNumber());
            horizontalSliderRef.current?.scrollToOffset({
              offset: (getShiftNumber() - 3) * 62,
              animated: true
            });
          }}
          style={styles.longestAndShortestContainer}
        >
          {activeShift === getShiftNumber() && (
            <View style={styles.longestAndShortestBlueBorder} />
          )}
          <View style={styles.longestAndShortestSubContainer}>
            <Text style={styles.longestAndShortestHeader}>Longest</Text>
            <View style={styles.longestAndShortestShiftAndTimeContainer}>
              <Text style={styles.longestAndShortestTimeText}>
                {getTime(timeOnIceData.max, true)}
              </Text>
              <Text style={styles.longestAndShortestShiftText}>{`Shift ${
                getShiftNumber() + 1
              }`}</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveShift(getShiftNumber(true));
            horizontalSliderRef.current?.scrollToOffset({
              offset: (getShiftNumber(true) - 3) * 62,
              animated: true
            });
          }}
          style={styles.longestAndShortestContainer}
        >
          {activeShift === getShiftNumber(true) && (
            <View style={styles.longestAndShortestBlueBorder} />
          )}
          <View style={styles.longestAndShortestSubContainer}>
            <Text style={styles.longestAndShortestHeader}>Shortest</Text>
            <View style={styles.longestAndShortestShiftAndTimeContainer}>
              <Text style={styles.longestAndShortestTimeText}>
                {getTime(timeOnIceData.min, true)}
              </Text>
              <Text style={styles.longestAndShortestShiftText}>{`Shift ${
                getShiftNumber(true) + 1
              }`}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.eventTitle}>Time on Ice</Text>
      {renderHeaderData()}
      <TimeOnIceShifts
        series={timeOnIceData.series}
        horizontalSliderRef={horizontalSliderRef}
        activeShift={activeShift}
        horizontalPercentage={horizontalPercentage}
      />
      {renderLongestAndShortestShift()}
    </View>
  );
};

export default TimeOnIce;

const styles = StyleSheet.create({
  eventTitle: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18
  },
  headerDataContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30
  },
  headerDataDivider: {
    borderRightColor: variables.textBlack,
    borderRightWidth: 1,
    height: '80%',
    marginHorizontal: 20,
    width: 10
  },
  headerDataSubContainer: {
    width: 80
  },
  headerDataSubTitle: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 18,
    marginTop: 8
  },
  headerDataTitles: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 10
  },

  longestAndShortestBlueBorder: {
    backgroundColor: variables.timeOnIceDarkerBlue,
    borderRadius: 10,
    height: '100%',
    left: 1,
    position: 'absolute',
    width: 6
  },
  longestAndShortestContainer: {
    borderBottomColor: variables.backgroundColor,
    borderBottomWidth: 1,
    borderTopColor: variables.backgroundColor,
    borderTopWidth: 1,
    height: 44,
    justifyContent: 'center',
    marginBottom: 6
  },
  longestAndShortestHeader: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginLeft: 16
  },
  longestAndShortestShiftAndTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 50,
    width: 100
  },
  longestAndShortestShiftText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  longestAndShortestSubContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  longestAndShortestTimeText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 12
  }
});
