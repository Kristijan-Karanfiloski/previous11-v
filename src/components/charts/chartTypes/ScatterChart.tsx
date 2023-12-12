import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  DeviceEventEmitter,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { debounce } from 'lodash';

import { generateStepData } from '../../../helpers/chartHelpers';
import { SyncedScrollViewContext } from '../../../hooks/SyncedScrollViewContext';
import { SyncedScrollView } from '../../../player-app/components/SyncedScrollView';
import { color } from '../../../theme';
import { variables } from '../../../utils/mixins';

import ScatterChartDot from './ScatterChartDot';

const CHART_HEIGHT = 150;

interface ScatterPlotProps {
  data: {
    id: string;
    y: number;
    x: number;
    isMatch: boolean;
    gameId: string;
    averageLoad: number;
    icon: string;
  }[];
  activeItem: string | number | null;
  setActiveItem: (item: string | number | null) => void;
  screenNumber: 0 | 1;
}

interface VerticalLineProps {
  left: number;
  displayText?: string;
  active: boolean;
}
const VerticalLine = ({ displayText, left, active }: VerticalLineProps) => {
  return (
    <View
      style={[
        styles.verticalLine,
        {
          borderColor: active
            ? color.palette.orange
            : color.palette.lighterGrey,
          left
        }
      ]}
    >
      {displayText && (
        <Text
          style={{
            position: 'absolute',
            bottom: 0,
            fontSize: 8
          }}
        >
          {displayText}
        </Text>
      )}
    </View>
  );
};

const calculateMaxYValue = (data: any[]) => {
  let maxYValue = 0;
  let minYValue = (data.length > 1 && data[0]?.y) || 0;

  data.forEach((item) => {
    if (item.y > maxYValue) {
      maxYValue = item.y;
    }
    if (item.y < minYValue) {
      minYValue = item.y;
    }
  });
  return { maxYValue, minYValue };
};

const ScatterPlot = (props: ScatterPlotProps) => {
  const { data, activeItem, setActiveItem, screenNumber } = props;
  const [viewableItems, setViewableItems] = useState<string[]>([]);
  const syncedScroll = useContext(SyncedScrollViewContext);

  // throttle the activeItem state change to avoid too many re-renders
  const debouncedChangeHandler = useMemo(
    () => debounce(setViewableItems, 1),
    [viewableItems]
  );

  useEffect(() => {
    DeviceEventEmitter.addListener(`viewableItems${screenNumber}`, (items) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      if (syncedScroll[screenNumber].activeScrollView._value === 0) {
        debouncedChangeHandler(items);
      } else {
        setViewableItems(items);
      }
    });

    return () => {
      DeviceEventEmitter.removeAllListeners('viewableItems');
    };
  }, []);

  const { maxYValue, minYValue } = useMemo(
    () => calculateMaxYValue(data),
    [data]
  );

  const yAxisData = useMemo(
    () => generateStepData(minYValue === maxYValue ? 0 : minYValue, maxYValue),

    [minYValue, maxYValue]
  );

  const renderYAxisLabels = () => {
    const yAxisLabels = [];
    for (let i = 0; i < yAxisData.length; i++) {
      const operand = yAxisData.length - 1 <= 0 ? 1 : yAxisData.length - 1;
      const bottom = i * (CHART_HEIGHT / operand - 3);

      if (i % 2 === 0) {
        yAxisLabels.push(
          <Text
            key={i}
            style={StyleSheet.flatten([styles.labelText, { bottom }])}
          >
            {Math.floor(yAxisData[i])}
          </Text>
        );
      } else {
        yAxisLabels.push(
          <View
            key={i}
            style={StyleSheet.flatten([
              styles.labelLine,
              {
                bottom
              }
            ])}
          />
        );
      }
    }
    return <View style={styles.vercticalLineContainer}>{yAxisLabels}</View>;
  };

  const renderRow = (
    item: {
      id: string;
      y: number;
      x: number;
      isMatch: boolean;
      gameId: string;
      icon: string;
    },
    i: number
  ) => {
    const leftOperand = item.y - minYValue < 0 ? 0 : item.y - minYValue;
    const rightOperand = maxYValue - minYValue < 0 ? 0 : maxYValue - minYValue;
    const left = 11;
    const bottom = (leftOperand / rightOperand) * CHART_HEIGHT - 6;

    return (
      <View
        style={{
          width: 22
        }}
        key={i}
      >
        <VerticalLine left={left} active={activeItem === item.id} />

        <ScatterChartDot
          left={left}
          bottom={bottom}
          active={activeItem === item.id}
          onPress={() => setActiveItem(item.id)}
          gameId={item.gameId}
          id={item.id}
          isMatch={item.isMatch}
          isViewable={viewableItems.includes(item.id)}
          icon={item.icon}
          screenNumber={screenNumber}
        />
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: 'white' }}>
      <View style={styles.container}>
        {renderYAxisLabels()}
        <SyncedScrollView
          id={'0'}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={data}
          renderRow={({ item, index }) => renderRow(item, index)}
          minMaxYValues={{ maxYValue, minYValue }}
          screenNumber={screenNumber}
        />
      </View>
    </View>
  );
};

export default forwardRef(ScatterPlot);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: color.palette.lighterGrey,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    height: CHART_HEIGHT,
    marginVertical: 30
  },
  labelLine: {
    backgroundColor: color.palette.lighterGrey,
    height: 1,
    position: 'absolute',
    right: 0,
    width: 7
  },
  labelText: {
    fontFamily: variables.mainFont,
    fontSize: 8,
    position: 'absolute',
    right: 0
  },
  vercticalLineContainer: {
    backgroundColor: 'rgba(255,255,255, 0.85)',
    height: '100%',
    position: 'absolute',
    width: 40,
    zIndex: 1
  },
  verticalLine: {
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    height: '100%',
    opacity: 0.7,
    position: 'absolute',
    width: 1
  }
});
