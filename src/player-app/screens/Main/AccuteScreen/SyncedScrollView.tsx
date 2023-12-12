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

import { SyncedScrollViewContext } from '../../../../hooks/SyncedScrollViewContext';

// ----------------------------------------------------------------------------

type DataType = {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acuteChronicRatio: number;
};

type Data = DataType[];
interface SyncedScrollViewProps extends ScrollViewProps {
  id: string;
  data: Data;
  renderRow: ListRenderItem<any>;
  screenNumber: 0 | 1;
}

export const SyncedScrollView = (props: SyncedScrollViewProps) => {
  const { id, screenNumber, ...rest } = props;
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
        viewableItems.map(({ item }) => item.date)
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

  if (id === '0') {
    return (
      <View style={{ height: 165 }}>
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
  horizontalListContainer: {
    minWidth: '100%',
    paddingLeft: 5,
    paddingRight: 45
  },
  verticalListContainer: {
    justifyContent: 'flex-end',
    minWidth: '100%',
    paddingBottom: 1
  }
});
