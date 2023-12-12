import React from 'react';
import { View } from 'react-native';

import {
  getIconMatch,
  getIconTraining,
  getTooltipMessageMatch,
  getTooltipMessageTraining
} from '../heleprs';
import { PlayerStats } from '../playerAppTypes';

import DescriptionBubble from './DescriptionBubble';

type Props = {
  isMatch: boolean;
  playerStats: PlayerStats;
  indicator: number | string | null;
};

const ActivityDescription = ({ isMatch, playerStats, indicator }: Props) => {
  const { totalLoad, highestLoad, averageLoad, numberOfSameTypeEvents } =
    playerStats;

  const getIcon = () => {
    const percentage = Math.round(
      (totalLoad / (isMatch ? highestLoad : averageLoad)) * 100 - 100
    );
    const icon = isMatch
      ? getIconMatch(numberOfSameTypeEvents, percentage)
      : getIconTraining(numberOfSameTypeEvents, percentage);

    return icon;
  };

  const getDescriptionText = () => {
    const percentage = Math.round(
      (totalLoad / (isMatch ? highestLoad : averageLoad)) * 100 - 100
    );

    if (!isMatch) {
      return getTooltipMessageTraining(
        numberOfSameTypeEvents,
        totalLoad,
        indicator,
        percentage
      );
    }

    return getTooltipMessageMatch(
      numberOfSameTypeEvents,
      totalLoad,
      percentage
    );
  };

  return (
    <View style={{ marginBottom: 22 }}>
      <DescriptionBubble icon={getIcon()} text={getDescriptionText()} />
    </View>
  );
};

export default ActivityDescription;
