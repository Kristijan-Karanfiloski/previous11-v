import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { GameAny, GameType } from '../../../types';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { selectAuth } from '../../redux/slices/authSlice';
import { useAppSelector } from '../../redux/store';
import { color, palette } from '../../theme';
import { utils, variables } from '../../utils/mixins';
import DropdownFilter from '../common/DropdownFilter';
import { Icon } from '../icon/icon';

interface ReportHeaderProps {
  event: GameAny | undefined;
}

const ReportHeader = ({ event }: ReportHeaderProps) => {
  const { customerName } = useAppSelector(selectAuth);
  const filterType = useMemo(() => {
    return getFilterType(event || null);
  }, [event, event?.type]);

  if (!event) return null;

  const { versus, type, date, UTCdate, startTime, status, benchmark } = event;

  const { date: formatedDate, dateFormat } = utils.checkAndFormatUtcDate(
    UTCdate,
    date,
    startTime
  );

  const totalTimeMins = Math.ceil(
    moment.duration(utils.getEventDuration(event) || 0).asMinutes()
  );
  const renderGameInfo = () => {
    if (type === GameType.Training) {
      return (
        <Text style={styles.infoText}>
          {utils.getTrainingDescription(benchmark?.indicator || null)}
        </Text>
      );
    }
    return (
      <Text style={styles.infoText}>
        {customerName}
        {` `}
        <Text
          style={{
            color: color.palette.tipGrey,
            fontFamily: variables.mainFont
          }}
        >
          {status?.scoreUs}-{status?.scoreThem}
          {` `}
        </Text>
        {versus}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.eventInfo}>
        <View style={{}}>
          {renderGameInfo()}

          <Text
            style={{
              color: color.palette.tipGrey,
              fontSize: 14,
              fontFamily: variables.mainFont
            }}
          >
            {moment(formatedDate, dateFormat).format('ddd, MMM DD · HH:mm')}
          </Text>
        </View>
        <View style={{}}>
          <Text style={styles.matchTime}>
            <Icon
              icon="clock"
              style={{
                marginRight: 8
              }}
            />
            {totalTimeMins} min
          </Text>

          <Text style={styles.matchTime}>
            <Icon
              icon="player"
              style={{
                marginRight: 8
              }}
            />
            {Object.keys(event?.report?.stats?.players || {}).length} players
          </Text>
        </View>
      </View>

      <DropdownFilter filterType={filterType} />
    </View>
  );
};

export default ReportHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-between'
  },
  eventInfo: {
    alignItems: 'center',
    backgroundColor: palette.grey,
    borderRadius: 4,
    flexDirection: 'row',
    flex: 0.672,
    justifyContent: 'space-between',
    padding: 12
  },
  infoText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontBold,
    fontSize: 20
  },
  matchTime: {
    color: color.palette.realWhite,
    fontFamily: variables.mainFont,
    fontSize: 16
  }
});
