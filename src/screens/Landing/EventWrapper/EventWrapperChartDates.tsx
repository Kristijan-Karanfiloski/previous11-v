import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { Icon } from '../../../components/icon/icon';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';

interface EventWrapperChartDatesProps {
  isActive: boolean;
  gameIndicator: number | string | undefined;
  date: string;
}

const EventWrapperChartDates = ({
  isActive,
  gameIndicator,
  date
}: EventWrapperChartDatesProps) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const generateGameDescription = (gameIndicator: number | string) => {
    if (typeof gameIndicator === 'number') {
      if (gameIndicator === 0) return 'MD';
      if (isFinite(gameIndicator)) {
        return `${gameIndicator > 0 ? '+' : ''}${gameIndicator}`;
      }
      return '';
    }

    return gameIndicator;
  };

  return (
    <>
      <Text style={[styles.dateText, isActive && styles.activeText]}>
        {gameIndicator
          ? (
              generateGameDescription(gameIndicator)
            )
          : (
          <Icon
            icon={isHockey ? 'icehockey_puck' : 'football'}
            style={{
              fill: variables.textBlack,
              height: 18,
              width: 18,
              color: variables.textBlack
            }}
          />
            )}
      </Text>
      <Text
        style={[
          styles.dateText,
          styles.monthText,
          isActive && styles.activeText
        ]}
      >
        {date}
      </Text>
      {isActive && (
        <Text
          style={[
            styles.dateText,
            styles.monthText,
            isActive && styles.activeText
          ]}
        >
          Today
        </Text>
      )}
    </>
  );
};

export default EventWrapperChartDates;

const styles = StyleSheet.create({
  activeText: {
    color: variables.red
  },
  dateText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 18
  },
  monthText: {
    fontSize: 12
  }
});
