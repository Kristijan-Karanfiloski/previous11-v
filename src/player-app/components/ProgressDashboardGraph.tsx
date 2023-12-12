import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { variables } from '../../utils/mixins';

type Props = {
  games: { playerLoad: number; isMatch: boolean }[];
  activeGameIndex: number;
  onItemPress: (index: number) => void;
};

const Dot = ({
  top,
  isMatch,
  isActive
}: {
  top: number;
  isMatch: boolean;
  isActive: boolean;
}) => {
  return (
    <View
      style={{
        ...styles.dot,
        top: top - 4,
        borderColor: isActive ? variables.red : isMatch ? '#654CF4' : 'black',
        backgroundColor: isActive ? variables.red : variables.realWhite
      }}
    >
      {isActive && <View style={styles.dotActive}></View>}
    </View>
  );
};

const ProgressDashboardGraph = ({
  games,
  activeGameIndex,
  onItemPress
}: Props) => {
  const calculateMaxYValue = (data: any[]) => {
    let maxYValue = 0;
    let minYValue = (data.length > 1 && data[0]?.playerLoad) || 0;

    data.forEach((item) => {
      if (item.playerLoad > maxYValue) {
        maxYValue = item.playerLoad;
      }
      if (item.playerLoad < minYValue) {
        minYValue = item.playerLoad;
      }
    });
    return { maxYValue, minYValue };
  };

  const { maxYValue, minYValue } = useMemo(
    () => calculateMaxYValue(games),
    [games]
  );

  const renderItems = (games: { playerLoad: number; isMatch: boolean }[]) => {
    const items = [];
    for (let i = 0; i < 9; i++) {
      const game = [...games].reverse()[i];

      if (!game) {
        items.push(<View key={i} style={styles.item}></View>);
      } else {
        const percent = (maxYValue - game.playerLoad) / (maxYValue - minYValue);
        const height = 130 * percent;
        const isActive = activeGameIndex === Math.abs(i - 8);
        items.push(
          <Pressable
            onPress={() => onItemPress(Math.abs(i - 8))}
            key={i}
            style={{
              ...styles.item,
              backgroundColor: isActive ? variables.red : variables.lighterGrey
            }}
          >
            <Dot isMatch={game.isMatch} top={height} isActive={isActive} />
          </Pressable>
        );
      }
    }

    return items;
  };

  return (
    <View style={styles.container}>
      <View style={styles.yValues}>
        <Text style={styles.text}>{maxYValue}</Text>
        <Text style={styles.text}>
          {Math.round((maxYValue + minYValue) / 2)}
        </Text>
        <Text style={styles.text}>{minYValue}</Text>
      </View>
      <View style={styles.graphContainer}>{renderItems(games)}</View>
    </View>
  );
};

export default ProgressDashboardGraph;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', height: 130, marginBottom: 26 },
  dot: {
    backgroundColor: variables.realWhite,
    borderColor: 'black',
    borderRadius: 50,
    borderWidth: 1,
    height: 9,
    left: -4,
    position: 'absolute',
    top: -4,
    width: 9
  },
  dotActive: {
    backgroundColor: variables.red,
    borderRadius: 50,
    height: 13,
    left: -3,
    opacity: 0.5,
    position: 'absolute',
    top: -3,
    width: 13
  },
  graphContainer: {
    borderBottomWidth: 1,
    borderColor: variables.lighterGrey,
    borderTopWidth: 1,
    flex: 1,
    flexDirection: 'row',
    height: 130,
    justifyContent: 'space-between'
  },
  item: {
    backgroundColor: variables.lighterGrey,
    height: '100%',
    width: 1
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 10
  },
  yValues: {
    height: '100%',
    justifyContent: 'space-between',
    marginRight: 10
  }
});
