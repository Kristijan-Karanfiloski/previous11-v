import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import LinearGradientView from '../../../../components/LinearGradientView';
import { variables } from '../../../../utils/mixins';

type DataType = {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acuteChronicRatio: number;
};

type Props = {
  data: DataType;
  selectedItem: DataType | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<DataType>>;
  isVisible: boolean;
};

const ChartItem = ({
  data,
  selectedItem,
  setSelectedItem,
  isVisible
}: Props) => {
  const date = moment(data.date, 'YYYY/MM/DD').format('DD/MM');

  const renderMainLine = () => {
    const height =
      data.acuteChronicRatio / 2 > 1 ? 1 : data.acuteChronicRatio / 2;

    if (!isVisible) {
      return (
        <View
          style={StyleSheet.flatten([
            styles.mainLine,
            {
              height: `${height * 100}%`,
              backgroundColor: variables.backgroundColor
            }
          ])}
        />
      );
    }

    if (data.acuteChronicRatio < 0.75 || data.acuteChronicRatio > 1.25) {
      return (
        <View
          style={StyleSheet.flatten([
            styles.mainLine,
            {
              height: `${height * 100}%`
            }
          ])}
        />
      );
    }

    return (
      <LinearGradientView
        colors={[
          { offset: 0, color: '#58FFAE' },
          { offset: 1, color: '#DBFF76' }
        ]}
        linearGradient={{ x1: '0%', y1: '0%', x2: '0%', y2: '100%' }}
        style={StyleSheet.flatten([
          styles.mainLine,
          { height: `${height * 100}%` }
        ])}
      />
    );
  };
  return (
    <Pressable onPress={() => setSelectedItem(data)} style={styles.container}>
      <View style={styles.verticalLine}></View>
      {renderMainLine()}
      <Text
        style={[
          styles.date,
          selectedItem &&
            selectedItem.date === data.date && {
            color: variables.red,
            fontFamily: variables.mainFontBold
          }
        ]}
      >
        {date}
      </Text>
    </Pressable>
  );
};

export default ChartItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 130,
    width: 28
  },
  date: {
    bottom: -25,
    fontFamily: variables.mainFontLight,
    fontSize: 9,
    position: 'absolute',
    transform: [{ rotate: '-44deg' }, { scaleX: -1 }]
  },
  mainLine: {
    backgroundColor: variables.grey,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    bottom: 0,
    position: 'absolute',
    width: 7
  },
  verticalLine: {
    backgroundColor: variables.backgroundColor,
    height: '100%',
    width: 1
  }
});
