import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Line, Svg } from 'react-native-svg';

import { PlayerLoadSerie } from '../../../../types';
import {
  generateActivityGraphBackgroundColor,
  getDrillStyle,
  getYAxisData
} from '../../../helpers/chartHelpers';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import {
  EVENT_SUBSESSIONS,
  INTENSITY_ZONES,
  INTENSITY_ZONES_FEMALE_TRESHOLD,
  INTENSITY_ZONES_FEMALE_TRESHOLD_HOCKEY,
  INTENSITY_ZONES_MALE_TRESHOLD,
  INTENSITY_ZONES_MALE_TRESHOLD_HOCKEY,
  INTENSITY_ZONES_TEAM_TRESHOLD,
  INTENSITY_ZONES_TEAM_TRESHOLD_HOCKEY,
  MATCH_PERIODS_CONCAT,
  variables
} from '../../../utils/mixins';

interface Props {
  isTeamStats?: boolean;
  data: PlayerLoadSerie[];
  matchDuration: number;
  drills: {
    sessionName: string;
    sessionId: string;
    startTime: number;
    endTime: number;
  }[];
  isMatch: boolean;
}

const ActivityGraph = ({
  data,
  matchDuration,
  isTeamStats,
  drills,
  isMatch
}: Props) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const [isLongPressed, setIsLongPressed] = useState<number | null>(null);
  const handleLongPress = (index: number) => {
    if (index === isLongPressed) {
      return setIsLongPressed(null);
    }
    return setIsLongPressed(index);
  };

  const getHorizontalZoneLines = () => {
    if (isHockey) {
      return isTeamStats
        ? INTENSITY_ZONES_TEAM_TRESHOLD_HOCKEY
        : activeClub.gender === 'Men'
          ? INTENSITY_ZONES_MALE_TRESHOLD_HOCKEY
          : INTENSITY_ZONES_FEMALE_TRESHOLD_HOCKEY;
    } else {
      return isTeamStats
        ? INTENSITY_ZONES_TEAM_TRESHOLD
        : activeClub.gender === 'Men'
          ? INTENSITY_ZONES_MALE_TRESHOLD
          : INTENSITY_ZONES_FEMALE_TRESHOLD;
    }
  };

  const horizontalZoneLines = getHorizontalZoneLines();

  const highestZoneValue = horizontalZoneLines[0];
  const factor = Math.round(highestZoneValue / 5);
  const dottedLinesHorizontalV2 = getYAxisData(highestZoneValue, factor);
  const horizontalPercentage =
    100 /
    (dottedLinesHorizontalV2[dottedLinesHorizontalV2.length - 1] + factor);
  const durationPercentage = 100 / matchDuration;

  const renderHorizontalZoneLines = (
    data: Array<number>,
    numberOfLinesHorizontal: number
  ) => {
    return (
      <>
        {data.map((item, index) => {
          if (index === data.length - 1) {
            return null;
          }
          return (
            <React.Fragment key={index}>
              <Svg
                height={'100%'}
                width={'101%'}
                style={[
                  styles.barLoad,
                  { top: `${100 - numberOfLinesHorizontal * item}%` }
                ]}
                key={item}
              >
                <Line
                  stroke={
                    INTENSITY_ZONES[index]
                      ? INTENSITY_ZONES[index].color
                      : '#DADADA'
                  }
                  strokeWidth={2.5}
                  x1={'100%'}
                  y1="0"
                  x2="0"
                  y2="0"
                />
              </Svg>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const renderHorizontalLinesCb = useCallback(
    (horizontalZoneLines: number[], horizontalPercentage: number) => {
      return renderHorizontalZoneLines(
        horizontalZoneLines,
        horizontalPercentage
      );
    },
    [renderHorizontalZoneLines, data]
  );

  const renderDrills = (
    drills: {
      sessionName: string;
      sessionId: string;
      startTime: number;
      endTime: number;
    }[],
    durationPercentage: number
  ) => {
    return Object.values(drills).map((item, index) => {
      const startingPercentage =
        (item.startTime / 1000 / 60) * durationPercentage;
      const endingPercentage = (item.endTime / 1000 / 60) * durationPercentage;

      if (
        item.sessionId === EVENT_SUBSESSIONS.fullGame ||
        item.sessionId === EVENT_SUBSESSIONS.fullSession
      ) {
        return null;
      }

      return (
        <View
          key={index}
          style={[
            styles.drillBox,
            getDrillStyle(
              startingPercentage,
              endingPercentage,
              item.sessionId,
              isMatch
            )
          ]}
        />
      );
    });
  };

  const generateSessionName = (name: string) => {
    const tagTitle = MATCH_PERIODS_CONCAT.find(
      (item) => item.drillName === name
    )?.tagTitle;

    return tagTitle || name;
  };

  const renderDrillsNames = (
    drills: {
      sessionName: string;
      sessionId: string;
      startTime: number;
      endTime: number;
    }[],
    durationPercentage: number
  ) => {
    const subRenderNames = () => {
      return Object.values(drills).map((item, index) => {
        const startingPercentage =
          (item.startTime / 1000 / 60) * durationPercentage;
        if (
          item.sessionId === EVENT_SUBSESSIONS.fullGame ||
          item.sessionId === EVENT_SUBSESSIONS.fullSession
        ) {
          return null;
        }

        return (
          <TouchableOpacity
            onLongPress={() => handleLongPress(index)}
            key={index}
            style={[
              styles.gridLines,
              {
                left: `${startingPercentage + 0.5}%`,
                top: 5
              },
              isLongPressed === index ? {} : { width: 70 }
            ]}
          >
            <Text numberOfLines={1} style={styles.drillTextName}>
              {generateSessionName(item.sessionName)}
            </Text>
          </TouchableOpacity>
        );
      });
    };

    return <View style={styles.drillTextContainer}>{subRenderNames()}</View>;
  };

  const clusterData = (
    data: {
      timestamp: number;
      value: number;
    }[]
  ) => {
    // Step 1: Define clustering criteria (time interval and value)
    const timeInterval = 9; // 60 seconds
    const valueField = 'value';
    // Step 3: Create an array to store the clusters
    const clusters: { timestamp: number; value: number; data: any[] }[] = [];

    // Step 2: Sort the data based on the timestamp in ascending order
    data.sort((a, b) => a.timestamp - b.timestamp);

    // Step 4: Group data into clusters based on the time interval and value
    data.forEach((point) => {
      const cluster = clusters.find((c) =>
        isSameCluster(c, point, timeInterval, valueField)
      );
      if (cluster) {
        cluster.data.push(point);
      } else {
        clusters.push({
          timestamp: point.timestamp,
          value: point.value,
          data: [point]
        });
      }
    });

    return clusters;
  };

  // Helper function to check if two points belong to the same cluster
  function isSameCluster(
    cluster: { [x: string]: any; timestamp: any; value?: number; data?: any[] },
    point: any,
    timeInterval: number,
    valueField: string
  ) {
    const timeDifference = Math.abs(cluster.timestamp - point.timestamp) / 1000;

    return (
      timeDifference <= timeInterval &&
      cluster[valueField] === point[valueField]
    );
  }

  const clustersMemo = useMemo(() => clusterData([...data]), [data]);

  const renderVerticalLines = useCallback(() => {
    return clustersMemo.map((item, index) => {
      const height = horizontalPercentage * item.value;
      return (
        <View
          key={index}
          style={{
            position: 'absolute',
            bottom: 0,
            // width: 2 * item.data.length,
            width: 2,
            left: `${durationPercentage * (item.timestamp / 1000 / 60)}%`,
            height: height > 100 ? '100%' : `${height}%`,
            backgroundColor: generateActivityGraphBackgroundColor(
              item.value,
              horizontalZoneLines
            )
          }}
        />
      );
    });
  }, [
    clustersMemo,
    horizontalZoneLines,
    horizontalPercentage,
    durationPercentage
  ]);

  return (
    <View style={styles.mainContainer}>
      {drills && renderDrillsNames(drills, durationPercentage)}
      {drills && renderDrills(drills, durationPercentage)}
      {renderHorizontalLinesCb(horizontalZoneLines, horizontalPercentage)}
      {renderVerticalLines()}
    </View>
  );
};

export default ActivityGraph;

const styles = StyleSheet.create({
  barLoad: {
    color: '#9899A0',
    fontSize: 8,
    fontWeight: '400',
    position: 'absolute'
  },
  drillBox: {
    borderColor: variables.lightGrey,
    borderWidth: 0.5,
    height: 250,
    position: 'absolute',
    top: 0
  },
  drillTextContainer: {
    height: 20,
    top: -20,
    width: '100%'
  },
  drillTextName: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 10
  },
  gridLines: {
    position: 'absolute'
  },
  mainContainer: {
    height: 250
  }
});
