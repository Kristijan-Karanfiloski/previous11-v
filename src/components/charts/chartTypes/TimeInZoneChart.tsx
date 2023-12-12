import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import ChartHorizontalBars from '../common/ChartHorizontalBars';

type TimeInZoneChartProps = {
  data: {
    percentageValue: number;
    barText: string;
    missingBarText: string;
    barColor: string;
    maxPercentageValue?: number;
    isNoBenchmark: boolean;
  }[];
  isDontCompare?: boolean;
};

const TimeInZoneChart = ({
  data,
  isDontCompare = false
}: TimeInZoneChartProps) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isLowIntensityDisabled = activeClub.lowIntensityDisabled;
  const isModerateIntensityDisabled = activeClub.moderateIntensityDisabled;
  const zonesDisabled = [isLowIntensityDisabled, isModerateIntensityDisabled];

  const getContainerHeight = () => {
    let height = 160;
    zonesDisabled
      .filter((disabled) => disabled)
      .forEach(() => (height = height - 33));
    return height;
  };

  return (
    <View style={[styles.mainContainer, { height: getContainerHeight() }]}>
      {data.map((item, index) => {
        const {
          percentageValue,
          barText,
          barColor,
          missingBarText,
          maxPercentageValue,
          isNoBenchmark
        } = item;

        const isNoCompare = isNoBenchmark || isDontCompare;
        const baseWidth = isNoCompare
          ? 100 / (maxPercentageValue || 1)
          : percentageValue;
        const widthPercentage = isNoBenchmark
          ? 0
          : isNoCompare
            ? baseWidth * percentageValue
            : baseWidth;

        return (
          <View key={index} style={{ width: '100%' }}>
            <View style={{ position: 'relative', width: '91%' }}>
              <ChartHorizontalBars
                barWidth={widthPercentage}
                barText={barText}
                barColor={barColor}
                missingBarText={missingBarText}
                isDontCompare={isNoCompare}
                widthPercentage={widthPercentage}
              />
            </View>
            {widthPercentage <= 15 && (
              <Text style={styles.barText}>
                {barText}{' '}
                {isNoBenchmark
                  ? '-%'
                  : isNoCompare
                    ? ''
                    : `${Math.round(percentageValue)}%`}
              </Text>
            )}

            {widthPercentage < 100 && (
              <Text
                style={[
                  styles.missingBarText,
                  {
                    color:
                      !isNoCompare && percentageValue < 90
                        ? variables.lightGrey
                        : variables.textBlack
                  }
                ]}
              >
                {isNoBenchmark
                  ? `${missingBarText}`
                  : `${isNoCompare ? '' : '-'}${missingBarText}`}
              </Text>
            )}
            {widthPercentage >= 100 && (
              <View
                style={[
                  styles.aboveAverageContainer,
                  {
                    backgroundColor: isNoCompare
                      ? variables.realWhite
                      : barColor
                  }
                ]}
              >
                <Text style={styles.missingBarTextFilled}>
                  {isNoCompare
                    ? missingBarText
                    : `${Math.round(percentageValue)}%`}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default TimeInZoneChart;

const styles = StyleSheet.create({
  aboveAverageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '9%',
    zIndex: 10
  },
  barText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 8,
    marginRight: 10,
    position: 'absolute',
    textTransform: 'capitalize',
    top: 7
  },
  mainContainer: {
    zIndex: 10
  },
  missingBarText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    letterSpacing: 1,
    position: 'absolute',
    right: 4,
    top: 7
  },
  missingBarTextFilled: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    letterSpacing: 1,
    marginRight: 2
  }
});
