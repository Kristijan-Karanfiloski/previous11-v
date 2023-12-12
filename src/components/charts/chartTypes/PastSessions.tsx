import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  Marker,
  Polygon,
  Polyline
} from 'react-native-svg';
import _ from 'lodash';

import { utils, variables } from '../../../utils/mixins';

interface PastSessionsProps {
  data: (number | undefined)[];
}

const PastSessions = ({ data }: PastSessionsProps) => {
  const [width, setWidth] = useState(0);
  const maxValue = _.max(data?.map((item) => item));
  const [clickedPastSession, setClickedPastSession] = useState<number | null>(
    null
  );
  const factor =
    (maxValue || 1) / 5 < 1
      ? (maxValue || 1) / 5
      : Math.round((maxValue || 1) / 5);

  const verticalPercentage = 250 / ((maxValue || 1) + factor);
  const horizontalPercentage = (width || 1) / (data.length - 1);
  const verticaLinePercentage = 100 / (data.length - 1);

  let generatedData = '';
  const polilineData: string[][] = [];
  data.forEach((item, index) => {
    const calculatedHeight =
      maxValue === 0 ? 250 : 250 - (item || 0) * verticalPercentage;
    const calculatedWidth = index * horizontalPercentage;

    if (index === 0) {
      generatedData = generatedData + `${0},${250},`;
    }
    generatedData = generatedData + `${calculatedWidth},${calculatedHeight},`;
    if (index === data.length - 1 && maxValue !== 0) {
      generatedData = generatedData + `${width} , ${250}`;
    }
    polilineData.push([`${calculatedWidth}`, `${calculatedHeight}`]);
    if (index === data.length - 1) {
      polilineData.push([`${calculatedWidth}`, `${calculatedHeight}`]);
    }
  });
  const handleClickedPastSession = (data: number) => {
    setClickedPastSession(data);
  };

  if (data.length === 1) {
    return (
      <View
        style={styles.mainContainer}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setWidth(width);
        }}
      >
        <Text style={styles.noPastSessionText}>No past sessions</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.mainContainer}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setWidth(width);
      }}
    >
      {width !== 0 && (
        <Svg viewBox={`0 0 ${width} 250`}>
          <Defs>
            <Marker
              id="circle"
              markerWidth="4"
              markerHeight="4"
              refX={2}
              refY={2}
            >
              <Circle
                cx={2}
                cy={2}
                r={2.5}
                stroke={variables.chartExplosive}
                fill={variables.realWhite}
              />
            </Marker>
            <Marker
              id="circleClicked"
              markerWidth="4"
              markerHeight="4"
              refX={2}
              refY={2}
            >
              <Circle
                cx={2}
                cy={2}
                r={2.5}
                stroke={utils.rgba(variables.chartExplosive, 0.2)}
                strokeWidth={6}
                fill={variables.chartExplosive}
              />
            </Marker>
          </Defs>
          <Polygon
            fill={utils.rgba(variables.chartExplosive, 0.4)}
            stroke="none"
            stroke-width="10"
            points={generatedData}
          />
          {polilineData.map((_, index) => {
            if (index === polilineData.length - 1) return null;
            return (
              <Polyline
                key={index}
                onPress={() => {
                  handleClickedPastSession(index);
                }}
                fill={'none'}
                stroke={variables.chartExplosive}
                strokeWidth={3}
                markerStart={
                  index === clickedPastSession
                    ? 'url(#circleClicked)'
                    : 'url(#circle)'
                }
                points={`${polilineData[index][0]}, ${polilineData[index][1]},${
                  polilineData[index + 1][0]
                }, ${polilineData[index + 1][1]}`}
              />
            );
          })}
        </Svg>
      )}
      {clickedPastSession !== null && (
        <>
          <Svg
            key={clickedPastSession}
            height="100%"
            width="100%"
            style={[
              styles.verticalLines,
              {
                left: `${verticaLinePercentage * clickedPastSession - 0.3}%`
              }
            ]}
          >
            <Line
              stroke={variables.red}
              strokeWidth={8}
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
            />
          </Svg>
          <Text
            style={[
              styles.clickedSessionText,
              verticaLinePercentage * clickedPastSession + 1 > 100
                ? { right: 4 }
                : { left: `${verticaLinePercentage * clickedPastSession + 1}%` }
            ]}
          >
            {Math.round(data[clickedPastSession] || 0)}
          </Text>
        </>
      )}
    </View>
  );
};

export default PastSessions;

const styles = StyleSheet.create({
  clickedSessionText: {
    color: variables.chartExplosive,
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    position: 'absolute',
    top: 2
  },
  mainContainer: {
    height: 250,
    zIndex: 10
  },
  noPastSessionText: {
    left: '40%',
    position: 'absolute',
    textTransform: 'uppercase',
    top: '50%'
  },
  verticalLines: {
    position: 'absolute',
    top: 0,
    zIndex: 1
  }
});
