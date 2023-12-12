import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import { debounce } from 'lodash';

import LinearGradientView from '../../../../components/LinearGradientView';
import { SyncedScrollViewContext } from '../../../../hooks/SyncedScrollViewContext';

import ChartItem from './ChartItem';
import ChartOvetlay from './ChartOvetlay';
import { SyncedScrollView } from './SyncedScrollView';
type AccuteData = {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acuteChronicRatio: number;
};

type Props = {
  data: AccuteData[];
  selectedItem: AccuteData;
  setSelectedItem: React.Dispatch<React.SetStateAction<AccuteData>>;
};

const Chart = ({ data, selectedItem, setSelectedItem }: Props) => {
  const syncedScroll = useContext(SyncedScrollViewContext);
  const [viewableItems, setViewableItems] = useState<string[]>([]);

  // throttle the activeItem state change to avoid too many re-renders
  const debouncedChangeHandler = useMemo(
    () => debounce(setViewableItems, 1),
    [viewableItems]
  );

  useEffect(() => {
    DeviceEventEmitter.addListener(`viewableItems${0}`, (items) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      if (syncedScroll[0].activeScrollView._value === 0) {
        debouncedChangeHandler(items);
      } else {
        setViewableItems(items);
      }
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('viewableItems');
    };
  }, []);

  const renderRowHorizontal = (item: AccuteData) => {
    return (
      <ChartItem
        key={item.date}
        data={item}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isVisible={viewableItems.includes(item.date)}
      />
    );
  };

  return (
    <View style={{ height: 165 }}>
      <LinearGradientView
        linearGradient={{ x1: '0%', y1: '0%', x2: '100%', y2: '0%' }}
        colors={[
          { offset: 0, color: '#58FFAE', opacity: 0.24 },
          { offset: 0.33, color: '#21F90F', opacity: 0.3 },
          { offset: 0.66, color: '#2CFA2C', opacity: 0.3 },
          { offset: 1, color: '#58FFAE', opacity: 0.3 },
          { offset: 1, color: '#58FFAE', opacity: 0.24 }
        ]}
        style={{
          position: 'absolute',
          height: 130 / 4,
          width: '100%',
          top: 130 / 2 - 130 / 4 / 2
        }}
        rectOpacity={0.5}
      />
      <SyncedScrollView
        id="0"
        data={data}
        renderRow={({ item }) => renderRowHorizontal(item)}
        screenNumber={0}
        horizontal
      />
      <ChartOvetlay />
    </View>
  );
};

export default Chart;
