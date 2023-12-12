import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { toNumber } from 'lodash';

import { DOTTED_LINES_CHARTS, variables } from '../../../utils/mixins';

type ChartHorizontalLinesProps = {
  horizontalPercentage: number;
  linePosition: number;
  lineValue: number | string;
  isLastElement: boolean;
  hasHorizontalLines?: boolean;
  hasYAxisValues?: boolean;
  lineValueText?: string;
  isMovementsChart?: boolean;
};

const ChartHorizontalLines = ({
  horizontalPercentage,
  linePosition,
  lineValue,
  isLastElement,
  hasHorizontalLines,
  hasYAxisValues,
  lineValueText = 'SEC',
  isMovementsChart = false
}: ChartHorizontalLinesProps) => {
  const getLabelValue = () => {
    if (isMovementsChart) return toNumber(lineValue).toFixed(1);
    return toNumber(lineValue) < 1
      ? toNumber(lineValue).toFixed(2)
      : Math.round(toNumber(lineValue));
  };

  return (
    <>
      {linePosition !== 0 && hasHorizontalLines && !isLastElement && (
        <Text
          ellipsizeMode="clip"
          numberOfLines={1}
          style={[
            styles.horizontalLine,
            { bottom: `${horizontalPercentage * linePosition - 2}%` }
          ]}
        >
          {DOTTED_LINES_CHARTS}
        </Text>
      )}
      {hasYAxisValues && !isLastElement && (
        <Text
          style={[
            styles.horizontalLineNumber,
            {
              bottom: `${horizontalPercentage * linePosition - 4}%`
            }
          ]}
        >
          {getLabelValue()}
        </Text>
      )}
      {isLastElement && hasYAxisValues && (
        <Text
          style={[
            styles.horizontalLineText,
            {
              bottom:
                lineValueText === 'INTENSITY'
                  ? `${horizontalPercentage * linePosition}%`
                  : `${horizontalPercentage * linePosition - 4}%`
            }
          ]}
        >
          {lineValueText}
        </Text>
      )}
    </>
  );
};

export default ChartHorizontalLines;

const styles = StyleSheet.create({
  horizontalLine: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 8,
    position: 'absolute',
    zIndex: 1
  },
  horizontalLineNumber: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFont,
    fontSize: 14,
    position: 'absolute',
    right: '-6.5%'
  },
  horizontalLineText: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    position: 'absolute',
    right: '-6.5%'
  }
});
