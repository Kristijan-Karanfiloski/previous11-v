import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { getTime } from '../../../player-app/heleprs';
import { variables } from '../../../utils/mixins';

interface Props {
  series: { start: number; end: number }[];
  horizontalSliderRef: React.Ref<FlatList>;
  activeShift: number | null;
  horizontalPercentage: number;
}

const TimeOnIceShifts = ({
  series,
  horizontalSliderRef,
  activeShift,
  horizontalPercentage
}: Props) => {
  const renderRow = (item: { start: number; end: number }, index: number) => {
    const timeInSerie = item.end - item.start;

    return (
      <View>
        <View style={styles.chartItemContainer}>
          <View
            style={[
              styles.chartItemBarContainer,
              {
                height: `${horizontalPercentage * timeInSerie}%`,
                backgroundColor:
                  activeShift === index
                    ? variables.timeOnIceDarkerBlue
                    : variables.timeOnIceLighterBlue
              }
            ]}
          >
            <View style={styles.chartItemShiftContainer}>
              <Text style={styles.chartItemShiftText}>{`Shift ${
                index + 1
              }`}</Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.chartItemTimeContainer,
            {
              backgroundColor:
                activeShift === index
                  ? variables.timeOnIceDarkerBlue
                  : variables.backgroundColor
            }
          ]}
        >
          <Text
            style={[
              styles.chartItemTimeText,
              {
                color:
                  activeShift === index
                    ? variables.realWhite
                    : variables.textBlack
              }
            ]}
          >
            {getTime(timeInSerie, true)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ref={horizontalSliderRef}
      style={{
        marginTop: 40,
        borderTopColor: variables.backgroundColor,
        borderTopWidth: 1,
        height: 200,
        marginHorizontal: -15
      }}
      data={series}
      renderItem={({ item, index }) => renderRow(item, index)}
      showsHorizontalScrollIndicator={false}
      horizontal
      decelerationRate="fast"
    />
  );
};
export default TimeOnIceShifts;

const styles = StyleSheet.create({
  chartItemBarContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    width: 62
  },
  chartItemContainer: {
    height: 169,
    marginRight: 1,
    width: 62
  },
  chartItemShiftContainer: {
    bottom: 2,
    position: 'absolute'
  },
  chartItemShiftText: {
    color: variables.realWhite,
    fontFamily: variables.mainFont,
    fontSize: 10
  },
  chartItemTimeContainer: {
    alignItems: 'center',
    height: 39,
    justifyContent: 'center',
    marginRight: 1,
    marginTop: 1,
    width: 62
  },
  chartItemTimeText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginBottom: 5
  }
});
