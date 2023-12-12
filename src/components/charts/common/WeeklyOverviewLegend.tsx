import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

interface WeeklyOverviewLegendProps {
  data: { position: string; text: string };
  verticalPercentage: number;
  position: number;
}

const WeeklyOverviewLegend = ({
  data,
  verticalPercentage,
  position
}: WeeklyOverviewLegendProps) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

  return (
    <View style={styles.mainContainer}>
      <View
        style={[
          styles.container,
          { left: `${verticalPercentage * position}%`, top: 3 }
        ]}
      >
        <Text style={styles.dayText}>
          {moment(data.position, 'YYYY/MM/DD').format('dddd')}
        </Text>
        <Text style={styles.dayNumber}>
          {moment(data.position, 'YYYY/MM/DD').format('D.')}
        </Text>
      </View>
      <View
        style={[
          styles.container,
          { left: `${verticalPercentage * position}%`, top: 22 }
        ]}
      >
        <Text style={styles.text}>{data.text}</Text>
        {data.text === 'Match' && (
          <Icon
            icon={isHockey ? 'icehockey_puck' : 'ball_weekly_load'}
            style={{
              height: 14,
              width: 14,
              fill: variables.chartGrey,
              color: variables.chartGrey
            }}
          />
        )}
        {data.text.includes('MD') && (
          <Icon
            icon={isHockey ? 'skate' : 'training_weekly_load'}
            style={{ height: 12, width: 12, fill: variables.chartGrey }}
          />
        )}
      </View>
    </View>
  );
};

export default WeeklyOverviewLegend;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    position: 'absolute',
    width: '14%'
  },
  dayNumber: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  dayText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    textTransform: 'uppercase'
  },
  mainContainer: {
    height: 20,
    position: 'absolute',
    top: '100%',
    width: '100%'
  },
  text: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    textTransform: 'uppercase'
  }
});
