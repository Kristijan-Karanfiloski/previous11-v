import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { toNumber } from 'lodash';

import { variables } from '../../../utils/mixins';

type ChartVerticalLinesProps = {
  linePosition: number | string;
  verticalPercentage: number;
  hasVerticalLineTreshold: boolean;
  isLastElement: boolean;
};

const ChartVerticalLines = ({
  linePosition,
  verticalPercentage,
  hasVerticalLineTreshold,
  isLastElement
}: ChartVerticalLinesProps) => {
  return (
    <Svg
      key={linePosition}
      height="100%"
      width="100%"
      style={[
        styles.verticalLines,
        {
          left: `${verticalPercentage * toNumber(linePosition)}%`,
          zIndex: isLastElement && hasVerticalLineTreshold ? 100 : 1
        }
      ]}
    >
      <Line
        stroke={
          isLastElement && hasVerticalLineTreshold
            ? variables.chartExplosive
            : variables.lighterGrey
        }
        strokeWidth={isLastElement && hasVerticalLineTreshold ? 3 : 1}
        x1="0"
        y1="0"
        x2="0"
        y2="100%"
      />
    </Svg>
  );
};

export default ChartVerticalLines;

const styles = StyleSheet.create({
  verticalLines: {
    position: 'absolute',
    top: 0
  }
});
