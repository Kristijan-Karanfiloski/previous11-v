import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '../../components/icon/icon';
import { variables } from '../../utils/mixins';
import { getIconMatch, getIconTraining } from '../heleprs';
import { PlayerStats } from '../playerAppTypes';

type Props = {
  isMatch: boolean;
  playerStats: PlayerStats;
  uiType?: 'vertical' | 'horizontal';
};

const TotalLoadPlayer = ({
  isMatch,
  playerStats,
  uiType = 'vertical'
}: Props) => {
  const { totalLoad, highestLoad, averageLoad, numberOfSameTypeEvents } =
    playerStats;

  const renderIcon = () => {
    if (numberOfSameTypeEvents === 0) return null;

    const percentage = Math.round(
      (totalLoad / (isMatch ? highestLoad : averageLoad)) * 100 - 100
    );

    const icon = isMatch
      ? getIconMatch(numberOfSameTypeEvents, percentage)
      : getIconTraining(numberOfSameTypeEvents, percentage);

    const iconStyle = icon === 'spot_on' ? styles.iconSpotOn : styles.iconArrow;

    return (
      <Icon
        style={StyleSheet.flatten([
          iconStyle,
          uiType === 'vertical' ? styles.iconVertical : styles.iconHorizontal
        ])}
        icon={icon}
      />
    );
  };

  const renderPercentage = () => {
    if (numberOfSameTypeEvents === 0) return null;

    const percentage = Math.round(
      (totalLoad / (isMatch ? highestLoad : averageLoad)) * 100 - 100
    );

    if (!percentage) return null;

    return (
      <Text
        style={[
          styles.totalLoadPercentageText,
          uiType === 'vertical'
            ? styles.totalLoadPercentageTextVertical
            : styles.totalLoadPercentageTextHorizontal
        ]}
      >{`${percentage}%`}</Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.totalLoadText,
          uiType === 'horizontal' && styles.totalLoadTextHorizontal
        ]}
      >
        {totalLoad}
      </Text>
      <View
        style={[
          uiType === 'vertical'
            ? styles.percentageVertical
            : styles.percentageHorizontal,
          styles.percentageContainer
        ]}
      >
        {renderIcon()}
        {renderPercentage()}
      </View>
    </View>
  );
};

export default TotalLoadPlayer;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  iconArrow: {
    height: 16,
    width: 16
  },
  iconHorizontal: {
    marginRight: 5
  },
  iconSpotOn: {
    height: 20,
    width: 20
  },
  iconVertical: {
    marginBottom: 4
  },
  percentageContainer: {
    alignItems: 'center'
  },
  percentageHorizontal: {
    flexDirection: 'row'
  },
  percentageVertical: {
    flexDirection: 'column'
  },
  totalLoadPercentageText: {
    color: variables.black,
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  totalLoadPercentageTextHorizontal: {
    fontFamily: variables.mainFont,
    fontSize: 18
  },
  totalLoadPercentageTextVertical: {
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  totalLoadText: {
    color: variables.black,
    fontFamily: variables.mainFontBold,
    fontSize: 55,
    marginRight: 2
  },
  totalLoadTextHorizontal: {
    marginRight: 7
  }
});
