import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  DeviceEventEmitter,
  FlatList,
  ListRenderItem,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View
} from 'react-native';
import {
  ClipPath,
  Defs,
  Line,
  LinearGradient,
  Polygon,
  Rect,
  Stop,
  Svg
} from 'react-native-svg';

import { GameAny } from '../../../types';
import { SyncedScrollViewContext } from '../../hooks/SyncedScrollViewContext';

// ----------------------------------------------------------------------------

type DataType1 = { id: string; game: GameAny; section?: string }[];
type DataType2 = {
  id: string;
  y: number;
  x: number;
  isMatch: boolean;
  gameId: string;
  averageLoad: number;
}[];

type Data = DataType1 | DataType2;
interface SyncedScrollViewProps extends ScrollViewProps {
  id: string;
  data: Data;
  renderRow: ListRenderItem<any>;
  minMaxYValues?: { maxYValue: number; minYValue: number };
  screenNumber: 0 | 1;
}

export const SyncedScrollView = (props: SyncedScrollViewProps) => {
  const { id, minMaxYValues, screenNumber, ...rest } = props;
  const listId = parseInt(id);

  const syncedScroll = useContext(SyncedScrollViewContext);

  const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 100
  };
  const onViewableItemsChanged = ({
    viewableItems
  }: {
    viewableItems: { key: string }[];
  }) => {
    if (!props.horizontal) {
      DeviceEventEmitter.emit(
        `viewableItems${screenNumber}`,
        viewableItems.map(({ key }) => key)
      );
    }
  };

  const viewabilityConfigCallbackPairs = useRef(
    props.horizontal ? [] : [{ onViewableItemsChanged, viewabilityConfig }]
  );

  // Get relevant ScrollView Dimensions --------------------------------------------------

  const [scrollViewLength, setScrollViewLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);

  const [scrollableLength, setScrollableLength] = useState(0);

  // Calculate the scrollable Length everytime the contentLength or scrollViewLength changes
  useEffect(() => {
    // The scrollable length is the difference between the content length and the scrollview length

    setScrollableLength(contentLength - scrollViewLength);
  }, [scrollViewLength, contentLength]);

  const handleLayout = ({
    nativeEvent: {
      layout: { width, height }
    }
  }: any) => {
    // The length of the scrollView depends on the orientation we scroll in
    setScrollViewLength(props.horizontal ? width : height);
  };

  const handleContentSizeChange = (width: number, height: number) => {
    // The length of the content inside the scrollView depends on the orientation we scroll in
    setContentLength(props.horizontal ? width : height);
  };

  // handle yPercent change ----------------------------------------------------

  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  syncedScroll[screenNumber].offsetPercent?.addListener(({ value }) => {
    // Only respond to changes of the offsetPercent if this scrollView is NOT the activeScrollView
    // --> The active ScrollView responding to its own changes would cause an infinite loop
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    if (
      listId !== syncedScroll[screenNumber].activeScrollView._value &&
      scrollableLength > 0
    ) {
      // Depending on the orientation we scroll in, we need to use different properties

      flatListRef.current?.scrollToOffset({
        offset: value * scrollableLength,
        animated: false
      });

      scrollViewRef?.current?.scrollTo({
        x: value * scrollableLength,
        animated: false
      });
    }
  });

  // handleScroll ---------------------------------------------------------------

  const offset = new Animated.Value(0);

  const handleScroll = Animated.event(
    // Depending on the orientation we scroll in, we need to use different properties

    [
      {
        nativeEvent: {
          contentOffset: { [props.horizontal ? 'x' : 'y']: offset }
        }
      }
    ],
    { useNativeDriver: true }
  );

  offset.addListener(({ value }) => {
    // Only change the offsetPercent if the scrollView IS the activeScrollView
    // --> The inactive ScrollViews changing the offsetPercent would cause an infinite loop
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    if (
      listId === syncedScroll[screenNumber].activeScrollView._value &&
      scrollableLength > 0
    ) {
      syncedScroll[screenNumber].offsetPercent.setValue(
        value / scrollableLength
      );
    }
  });

  // onTouch ----------------------------------------------------------------------------

  // Change this ScrollView to the active ScrollView when it is touched
  const handleTouchStart = () => {
    syncedScroll[screenNumber].activeScrollView.setValue(listId);
  };

  const getPolygonPoints = (data: DataType2) => {
    if (!minMaxYValues) return;
    const { maxYValue, minYValue } = minMaxYValues;
    const pointsTop: number[][] = [];
    const pointsBottom: number[][] = [];
    const array = data.slice(0, data.length - 1).map(({ averageLoad }, i) => {
      const minOptRange = averageLoad * 0.75;
      const maxOptRange = averageLoad * 1.25;

      const max =
        100 - ((maxOptRange - minYValue) / (maxYValue - minYValue)) * 100;
      const min =
        100 - ((minOptRange - minYValue) / (maxYValue - minYValue)) * 100;

      const topPoint = Math.round(150 * (max / 100));
      const bottomPoint = Math.round(150 * (min / 100));

      return [
        [i * 22, topPoint],
        [i * 22, bottomPoint]
      ];
    });
    array.forEach((ar) => {
      pointsTop.push(ar[0]);
      pointsBottom.push(ar[1]);
    });

    return [...pointsBottom, ...pointsTop.reverse(), pointsBottom[0]].join(' ');
  };

  const renderLines = (data: DataType2) => {
    if (!minMaxYValues) return;

    const { maxYValue, minYValue } = minMaxYValues;
    const highestMatches: { x: number; y: number }[] = [];
    let load = 0;
    [...data].reverse().forEach((item, index) => {
      if (index === 0 || item.y > load) {
        const indexOfEvent = data.map(({ id }) => id).indexOf(item.id);

        highestMatches.push({
          y: Math.round(
            150 * (1 - (item.y - minYValue) / (maxYValue - minYValue))
          ),
          x: indexOfEvent * 22
        });
        load = item.y;
      }
    });

    return highestMatches.map(({ x, y }, index) => {
      if (highestMatches[index + 1]) {
        const nextHighestMatch = highestMatches[index + 1];

        const line1 = { x1: x, y1: y, x2: x, y2: nextHighestMatch.y };
        const line2 = {
          x1: x,
          y1: nextHighestMatch.y,
          x2: nextHighestMatch.x,
          y2: nextHighestMatch.y
        };

        return (
          <>
            <Line
              x1={`${line1.x1}`}
              y1={`${line1.y1}`}
              x2={`${line1.x2}`}
              y2={`${line1.y2}`}
              stroke="rgba(136, 255, 154, 0.5)"
              strokeWidth={3}
            />
            <Line
              x1={`${line2.x1}`}
              y1={`${line2.y1}`}
              x2={`${line2.x2}`}
              y2={`${line2.y2}`}
              stroke="rgba(136, 255, 154, 0.5)"
              strokeWidth={3}
            />
          </>
        );
      }
      return (
        <Line
          key={index}
          x1={`${x}`}
          y1={`${y}`}
          x2={`0`}
          y2={`${y}`}
          stroke="rgba(136, 255, 154, 0.5)"
          strokeWidth={3}
        />
      );
    });
  };

  const renderSvg = (data) => {
    if (screenNumber === 0) return null;
    const isMatch = data[0] && data[0].isMatch;
    return (
      <Svg
        style={{
          ...styles.benchmarkSvg,
          width: (props.data.length - 1) * 22
        }}
      >
        {!isMatch && (
          <>
            <Defs>
              <LinearGradient
                id="clip-path-grad"
                x1="0%"
                x2="0%"
                y1="0%"
                y2="100%"
              >
                <Stop offset="0" stopColor="#58FFAE" stopOpacity={0.5} />
                <Stop offset="1" stopColor="#DBFF76" stopOpacity={0.5} />
              </LinearGradient>
              <ClipPath id="clip-path-clip">
                <Polygon
                  stroke="none"
                  stroke-width="10"
                  points={getPolygonPoints(data)}
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
          </>
        )}
        {isMatch && renderLines(data)}
      </Svg>
    );
  };

  if (id === '0') {
    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          {...rest}
          ref={scrollViewRef}
          bounces={false}
          horizontal
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}
          style={{ transform: [{ scaleX: -1 }], overflow: 'visible' }}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          contentContainerStyle={styles.horizontalListContainer}
        >
          {renderSvg(props.data)}
          {props.data.map((item, index) => props.renderRow({ item, index }))}
        </Animated.ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        {...rest}
        data={props.data}
        renderItem={props.renderRow}
        ref={flatListRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onTouchStart={handleTouchStart}
        onLayout={handleLayout}
        onContentSizeChange={handleContentSizeChange}
        inverted={props.horizontal}
        contentContainerStyle={styles.verticalListContainer}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        bounces={false}
        decelerationRate={0.3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  benchmarkSvg: {
    height: '100%',
    position: 'absolute',
    right: 51,
    top: 0
  },
  horizontalListContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minWidth: '100%',
    paddingLeft: 60,
    paddingRight: 40
  },
  verticalListContainer: {
    justifyContent: 'flex-end',
    minWidth: '100%'
  }
});
