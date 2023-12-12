import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { FilterStateType } from '../../../../types';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { getCurrentWeek, setNewWeek } from '../../../redux/slices/currentWeek';
import { selectComparisonFilter } from '../../../redux/slices/filterSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { palette } from '../../../theme';
import { utils, variables } from '../../../utils/mixins';
import DropdownFilter from '../../common/DropdownFilter';
import { Icon } from '../../icon/icon';
import { IconTypes } from '../../icon/icons';

interface Props {
  headerData: {
    trainingTime: number;
    matchTime: number;
  };
}

const WeeklyLoadInfoHeader = ({ headerData }: Props) => {
  const dispatch = useAppDispatch();
  const currentWeek = useAppSelector((store) => getCurrentWeek(store));
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, FilterStateType.weeklyLoad)
  );
  const handleCurrentWeek = (isNextWeek: boolean) => {
    if (isNextWeek) {
      dispatch(setNewWeek({ isNextWeek }));
    } else {
      dispatch(setNewWeek({ isNextWeek }));
    }
  };

  const eventInfoTimes = [
    {
      name: 'training',
      icon: isHockey ? 'skate' : 'training_weekly_load',
      data: `${utils.convertMilisecondsToWeeklyLoadTime(
        headerData.trainingTime
      )}`
    },
    {
      name: 'match',
      icon: isHockey ? 'icehockey_puck' : 'ball_weekly_load',
      data: `${utils.convertMilisecondsToWeeklyLoadTime(headerData.matchTime)}`
    },
    {
      name: 'total',
      icon: null,
      data: `${utils.convertMilisecondsToWeeklyLoadTime(
        headerData.matchTime + headerData.trainingTime
      )}`
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.eventsInfo}>
        <View style={styles.dateEditorContainer}>
          {handleCurrentWeek && (
            <Pressable
              onPress={() => handleCurrentWeek(false)}
              style={styles.buttonPadding}
            >
              <Icon
                icon="arrow_left_weekly_load"
                style={{ color: variables.red }}
              />
            </Pressable>
          )}
          <View>
            <Text style={styles.dateEditorMainDate}>
              {moment(currentWeek.start, 'YYYY/MM/DD').format('DD/MM')} -{' '}
              {moment(currentWeek.end, 'YYYY/MM/DD').format('DD/MM')}
            </Text>
            <Text style={styles.dateEditorWeekNumber}>
              WEEK {moment(currentWeek.start, 'YYYY/MM/DD').week()}
            </Text>
          </View>
          {handleCurrentWeek && (
            <Pressable
              onPress={() => handleCurrentWeek(true)}
              style={styles.buttonPadding}
            >
              <Icon
                icon="arrow_right_weekly_load"
                style={{ fill: variables.red }}
              />
            </Pressable>
          )}
        </View>
        <View>
          {eventInfoTimes.map((info) => {
            return (
              <View key={info.name} style={styles.eventInfoTimesContainer}>
                {info.icon && (
                  <Icon
                    icon={info.icon as IconTypes}
                    style={{
                      height: 10,
                      width: 10,
                      fill: variables.chartGrey,
                      marginBottom: 2
                    }}
                  />
                )}
                <Text style={styles.eventInfoText}>{info.name}</Text>
                <Text style={styles.eventInfoData}>{info.data}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {moment(new Date()).format('dddd, DD. MMMM YYYY')}
          </Text>
        </View>
      </View>

      <DropdownFilter
        filterType={FilterStateType.weeklyLoad}
        containerStyle={{ padding: 6 }}
        label={
          comparisonFilter.selectedWeek && comparisonFilter.selectedWeek.label
            ? comparisonFilter.selectedWeek.label
            : ''
        }
      />
    </View>
  );
};

export default WeeklyLoadInfoHeader;

const styles = StyleSheet.create({
  buttonPadding: { padding: 7 },
  container: {
    alignItems: 'center',
    backgroundColor: palette.black2,
    flexDirection: 'row',
    height: 125,
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
  dateContainer: {
    position: 'absolute',
    top: -20
  },
  dateEditorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200
  },
  dateEditorMainDate: {
    color: variables.realWhite,
    fontFamily: variables.mainFontBold,
    fontSize: 20,
    textAlign: 'center'
  },
  dateEditorWeekNumber: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 14,
    textAlign: 'center'
  },
  dateText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  eventInfoData: {
    color: variables.realWhite,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16
  },
  eventInfoText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginLeft: 11,
    marginRight: 7,
    textTransform: 'uppercase'
  },
  eventInfoTimesContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 150
  },
  eventsInfo: {
    alignItems: 'center',
    backgroundColor: palette.grey,
    borderRadius: 4,
    flex: 0.672,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12
  }
});
