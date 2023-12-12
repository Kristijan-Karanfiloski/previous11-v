import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { toNumber } from 'lodash';

import { DEFAULT_CHART_VERTICAL_LINES, variables } from '../../utils/mixins';

import ChartHorizontalLines from './common/ChartHorizontalLines';
import ChartVerticalLegend from './common/ChartVerticalLegend';
import ChartVerticalLines from './common/ChartVerticalLines';
import WeeklyOverviewLegend from './common/WeeklyOverviewLegend';

type ChartGridProps = {
  children: ReactNode;
  customVerticalLinesData?: {
    positionIndex: number;
    date: string;
    indicator: string | number | null;
  }[];
  horizontalLines?: Array<number | string>;
  verticalLines?: Array<number | string | { value: number; label: string }>;
  hasHorizontalLines?: boolean;
  hasYAxisValues?: boolean;
  customVerticalLines?: boolean;
  hasBottomLegend?: boolean;
  hasVerticalLineTreshold?: boolean;
  lineValueText?: string;
  hasPrevSessionLegend?: boolean;
  isPastSession?: boolean;
  isLastChart?: boolean;
  hasWeeklyOverviewLegend?: boolean;
  customBottomLegend?: { position: string; text: string }[];
  hasNoBorders?: boolean;
  isMovementsChart?: boolean;
  isRealTime?: boolean;
  duration?: number;
};

const ChartGrid = ({
  children,
  horizontalLines = [],
  verticalLines = DEFAULT_CHART_VERTICAL_LINES,
  hasHorizontalLines = false,
  hasYAxisValues = false,
  customVerticalLines = false,
  hasBottomLegend = false,
  hasVerticalLineTreshold = false,
  lineValueText = 'SEC',
  customVerticalLinesData = [
    {
      positionIndex: 0,
      date: '',
      indicator: null
    }
  ],
  hasPrevSessionLegend = false,
  isPastSession = false,
  isLastChart = false,
  hasWeeklyOverviewLegend = false,
  customBottomLegend = [],
  hasNoBorders = false,
  isMovementsChart = false,
  isRealTime = false,
  duration
}: ChartGridProps) => {
  const horizontalPercentage = 100 / (horizontalLines.length - 1);
  const lastVerticalLine = verticalLines[verticalLines.length - 1];
  const lastVerticalLineValue =
    typeof lastVerticalLine === 'object'
      ? lastVerticalLine.value
      : lastVerticalLine;

  const verticalPercentage = customVerticalLines
    ? 100 / toNumber(lastVerticalLineValue)
    : 100 / verticalLines.length;

  const renderHorizontalLines = () => {
    return horizontalLines.map((item, index) => {
      return (
        <ChartHorizontalLines
          key={item}
          linePosition={index}
          lineValue={item}
          horizontalPercentage={horizontalPercentage}
          isLastElement={index === horizontalLines.length - 1}
          hasHorizontalLines={hasHorizontalLines}
          hasYAxisValues={hasYAxisValues}
          lineValueText={lineValueText}
          isMovementsChart={isMovementsChart}
        />
      );
    });
  };

  const renderVerticalLines = () => {
    return verticalLines.map((item, index) => {
      const linePosition = typeof item === 'object' ? item.value : item;
      return (
        <ChartVerticalLines
          key={index}
          linePosition={customVerticalLines ? linePosition : index}
          verticalPercentage={verticalPercentage}
          isLastElement={index === verticalLines.length - 1}
          hasVerticalLineTreshold={hasVerticalLineTreshold}
        />
      );
    });
  };

  const renderVerticalLegend = () => {
    return verticalLines.map((item, index) => {
      if (hasWeeklyOverviewLegend) {
        return (
          <WeeklyOverviewLegend
            key={index}
            data={customBottomLegend[index]}
            verticalPercentage={verticalPercentage}
            position={index}
          />
        );
      }

      return (
        <ChartVerticalLegend
          key={index}
          linePosition={customVerticalLines ? item : index}
          verticalPercentage={verticalPercentage}
          hasCustomVerticalLines={hasPrevSessionLegend}
          customLinePosition={customVerticalLinesData[index]}
          isRealTime={isRealTime}
          duration={duration}
        />
      );
    });
  };

  return (
    <View
      style={[
        styles.chartGridContainer,
        {
          width: hasYAxisValues ? '95%' : '100%',
          marginBottom: isPastSession ? 50 : isLastChart ? 0 : 25
        },
        !hasNoBorders && { borderColor: variables.lighterGrey, borderWidth: 1 }
      ]}
    >
      {renderHorizontalLines()}
      {!hasNoBorders && renderVerticalLines()}
      {children}
      {hasBottomLegend && renderVerticalLegend()}
    </View>
  );
};

export default ChartGrid;

const styles = StyleSheet.create({
  chartGridContainer: {
    position: 'relative'
  }
});
