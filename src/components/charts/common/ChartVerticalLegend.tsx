import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { toNumber } from 'lodash';
import moment from 'moment';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

type ChartVerticalLegendProps = {
  linePosition: number | string | { value: number; label: string };
  customLinePosition: {
    positionIndex: number;
    date: string;
    indicator: string | number | null;
  };
  verticalPercentage: number;
  hasCustomVerticalLines: boolean;
  isRealTime?: boolean;
  duration?: number;
};

const ChartVerticalLegend = ({
  linePosition,
  verticalPercentage,
  hasCustomVerticalLines,
  customLinePosition,
  isRealTime = false,
  duration = 0
}: ChartVerticalLegendProps) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const line =
    typeof linePosition === 'object' ? linePosition.value : linePosition;
  if (hasCustomVerticalLines) {
    return (
      <View style={styles.mainContainer}>
        <View
          style={[
            styles.verticalLinesText,
            styles.verticalLinesCustomText,
            {
              left: `${
                verticalPercentage * customLinePosition.positionIndex - 1.8
              }%`
            }
          ]}
        >
          {customLinePosition.indicator
            ? (
            <Text style={styles.customLegendText}>
              {customLinePosition.indicator}
            </Text>
              )
            : (
            <Icon
              icon={isHockey ? 'icehockey_puck' : 'football'}
              style={{
                fill: variables.chartGrey,
                height: 18,
                width: 18,
                color: variables.chartGrey
              }}
            />
              )}
          <Text style={styles.customLegendText}>
            {moment(customLinePosition.date, 'YYYY/MM/DD').format('ddd')}
          </Text>
          <Text style={styles.customLegendText}>
            {moment(customLinePosition.date, 'YYYY/MM/DD').format('DD')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <>
        <Svg
          key={line}
          height="100%"
          width="100%"
          style={[
            styles.verticalLines,
            {
              left: `${verticalPercentage * toNumber(line)}%`
            }
          ]}
        >
          <Line
            stroke={variables.lighterGrey}
            strokeWidth={1}
            x1="0"
            y1="0"
            x2="0"
            y2="100%"
          />
        </Svg>

        <Text
          style={[
            styles.verticalLinesText,
            {
              left:
                typeof line === 'string' || line === 0
                  ? `0%`
                  : `${
                      verticalPercentage * toNumber(line) -
                      (typeof linePosition === 'object'
                        ? 5
                        : isRealTime
                        ? 6
                        : 3.5)
                    }%`,
              marginLeft: typeof line === 'string' || line === 0 ? 2 : 0
            }
          ]}
        >
          {isRealTime
            ? `${moment
                .utc(
                  duration +
                    toNumber(
                      typeof linePosition === 'object'
                        ? linePosition.label
                        : linePosition
                    ) *
                      60 *
                      1000
                )
                .local()
                .format('HH:mm')}`
            : `${
                typeof linePosition === 'object'
                  ? linePosition.label
                  : linePosition
              }'`}
        </Text>
      </>
    </View>
  );
};

export default ChartVerticalLegend;

const styles = StyleSheet.create({
  customLegendText: {
    color: variables.chartLightGrey,
    fontSize: 14
  },
  mainContainer: {
    height: 20,
    position: 'absolute',
    top: '100%',
    width: '100%'
  },
  verticalLines: {
    position: 'absolute',
    top: 0,
    zIndex: 1
  },
  verticalLinesCustomText: {
    alignItems: 'center',
    marginTop: 10
  },
  verticalLinesText: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFont,
    fontSize: 14,
    marginTop: 2,
    position: 'absolute',
    top: 0,
    zIndex: 1
  }
});
