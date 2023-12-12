import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  ClipPath,
  Defs,
  LinearGradient,
  Polygon,
  Rect,
  Stop,
  Svg
} from 'react-native-svg';
import moment from 'moment';

import { variables } from '../../../../../utils/mixins';
import { WeeklyEffortData } from '../../../../heleprs';

const GRAPH_HEIGHT = 160;

type Props = {
  data: { [n: string]: WeeklyEffortData };
  activeWeek: number;
};

const GraphItem = ({
  data,
  highestLoad,
  active
}: {
  data: WeeklyEffortData;
  highestLoad: number;
  active: boolean;
}) => {
  const load = data.totalWeeklyLoad;
  const bottom = (GRAPH_HEIGHT * load) / highestLoad - 4;

  const dotBackgroundColor = active
    ? data.isInRange
      ? '#21F90F'
      : 'black'
    : variables.realWhite;
  const dotBorderColor = data.isInRange && active ? '#21F90F' : 'black';
  const dotActiveBorderColor = data.isInRange
    ? 'rgba(33, 249, 15, 0.3)'
    : 'rgba(1, 1, 1, 0.2)';

  const scaleAnim = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [active, scaleAnim]);

  const dotStyle = {
    bottom,
    backgroundColor: dotBackgroundColor,
    borderColor: dotBorderColor,
    transform: [
      {
        scale: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      }
    ]
  };

  const dotActiveStyle = {
    borderColor: dotActiveBorderColor,
    transform: [
      {
        scale: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      }
    ]
  };

  const opacity = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <Animated.View
      style={[
        styles.graphItem,
        {
          backgroundColor: active ? variables.textBlack : variables.realWhite,
          opacity: active ? opacity : 1
        }
      ]}
    >
      {active && (
        <Animated.View
          style={[
            styles.graphItemSelected,
            { borderTopColor: data.isInRange ? '#58FFAE' : '#D4E0E1', opacity }
          ]}
        />
      )}
      <Animated.View style={[styles.graphItemDot, dotStyle]}>
        {active && (
          <Animated.View style={[styles.graphItemDotActive, dotActiveStyle]} />
        )}
      </Animated.View>
    </Animated.View>
  );
};

const WeeklyGraph = ({ data, activeWeek }: Props) => {
  const [graphWidth, setGraphWidth] = useState(0);

  const getYValues = () => {
    let highestLoad = 0;
    Object.keys(data).forEach((key) => {
      const load = data[key].totalWeeklyLoad;
      if (load > highestLoad) {
        highestLoad = load;
      }
    });

    return {
      top: highestLoad,
      middTop: Math.round(highestLoad * 0.666),
      middBottom: Math.round(highestLoad * 0.333),
      bottom: 0
    };
  };

  const { top, middTop, middBottom, bottom } = getYValues();

  const getSvgPoints = useCallback(() => {
    const points = Object.keys(data)
      .filter((key) => !!data[key].benchmark)
      .map((key) => {
        const [minRange, maxRange] = data[key].benchMarkRange;

        const width = graphWidth / 12;
        const index = (11 - data[key].weekIndex) * width;
        const minPoint = (1 - minRange / top) * GRAPH_HEIGHT;
        const maxPoint = (1 - maxRange / top) * GRAPH_HEIGHT;

        return [`${index},${minPoint}`, `${index},${maxPoint}`];
      });

    const pointsTop: string[] = [];
    const pointsBottom: string[] = [];

    points.forEach((ar) => {
      pointsTop.push(ar[0]);
      pointsBottom.push(ar[1]);
    });

    return [...pointsBottom, ...pointsTop.reverse(), pointsBottom[0]].join(' ');
  }, [data, graphWidth, top]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setGraphWidth(width);
  }, []);

  const renderGraphItems = () => {
    let month = '';

    return Object.keys(data)
      .reverse()
      .map((key) => {
        const date = data[key].name.split('-')[1];
        const monthName = moment(date, 'YYYY/MM/DD').format('MMM');

        const showMonth = monthName !== month;
        if (showMonth) {
          month = monthName;
        }

        return { ...data[key], monthName, showMonth };
      })
      .reverse()
      .map((item, index) => {
        return (
          <>
            <GraphItem
              key={index}
              data={item}
              highestLoad={top}
              active={activeWeek.toString() === item.weekIndex.toString()}
            />
            {item.showMonth && (
              <Text style={{ ...styles.graphItemMonth, left: index * 30 - 15 }}>
                {item.monthName}
              </Text>
            )}
          </>
        );
      });
  };

  return (
    <View style={styles.container}>
      <View onLayout={onLayout} style={styles.graphContainer}>
        <View style={styles.yAxisContainer}>
          <Text style={styles.yAxisText}>{top}</Text>
          <Text style={styles.yAxisText}>{middTop}</Text>
          <Text style={styles.yAxisText}>{middBottom}</Text>
          <Text style={styles.yAxisText}>{bottom}</Text>
        </View>
        <View style={styles.graph}>
          <Svg style={styles.benchmarkSvg}>
            <Defs>
              <LinearGradient
                id="clip-path-grad"
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
              >
                <Stop offset="0" stopColor="#58FFAE" stopOpacity={0.5} />
                <Stop offset="1" stopColor="#DBFF76" stopOpacity={0.5} />
              </LinearGradient>
              <ClipPath id="clip-path-clip">
                <Polygon
                  stroke="none"
                  strokeWidth={10}
                  points={getSvgPoints()}
                />
              </ClipPath>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="url(#clip-path-grad)"
              clipPath="url(#clip-path-clip)"
            />
          </Svg>
          {renderGraphItems()}
        </View>
      </View>
    </View>
  );
};

export default WeeklyGraph;

const styles = StyleSheet.create({
  benchmarkSvg: {
    height: '100%',
    position: 'absolute',
    width: '100%'
  },
  container: {
    backgroundColor: '#F7F7F9',
    paddingLeft: 4,
    paddingRight: 20,
    paddingTop: 15
  },
  graph: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
  },
  graphContainer: {
    flexDirection: 'row',
    height: GRAPH_HEIGHT,
    marginBottom: 10
  },
  graphItem: { height: '100%', overflow: 'visible', width: 1 },
  graphItemDot: {
    borderColor: 'black',
    borderRadius: 50,
    borderWidth: 1,
    height: 9,
    left: -4,
    position: 'absolute',
    width: 9
  },
  graphItemDotActive: {
    borderColor: 'rgba(1,1,1,0.2)',
    borderRadius: 50,
    borderWidth: 4,
    bottom: -5,
    height: 17,
    left: -5,
    position: 'absolute',
    width: 17
  },
  graphItemMonth: {
    bottom: -24,
    fontFamily: variables.mainFontLight,

    fontSize: 10,
    position: 'absolute'
  },
  graphItemSelected: {
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderLeftWidth: 12,
    borderRightColor: 'transparent',
    borderRightWidth: 12,
    borderStyle: 'solid',
    borderTopWidth: 15,
    height: 0,
    left: -11.5,
    position: 'absolute',
    top: -15,
    width: 0
  },
  yAxisContainer: {
    justifyContent: 'space-between',
    paddingRight: 5,
    width: 35
  },
  yAxisText: {
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    textAlign: 'right'
  }
});
