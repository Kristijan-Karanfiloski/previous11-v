import React, { useContext, useMemo } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../../../types';
import { SocketContext } from '../../../hooks/socketContext';
import { selectAuth } from '../../../redux/slices/authSlice';
import { selectTrackingEvent } from '../../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../../redux/store';
import { commonStyles, palette } from '../../../theme';
import { preparationGetActivePlayers } from '../../../utils';
import { deriveNewStats } from '../../../utils/adapter';
import { utils, variables } from '../../../utils/mixins';
import ButtonNew from '../../common/ButtonNew';
import { Icon } from '../../icon/icon';

import EventCountdown from './EventCountdown';

type Props = {
  event?: GameAny;
  onEditPress?: () => void;
  onChoosePlayers?: () => void;
  onStartTracking?: () => void;
  onViewReport?: () => void;
  onEnterScore?: () => void;
};

const EventDetails = ({
  event,
  onEditPress,
  onChoosePlayers,
  onStartTracking = () => undefined,
  onViewReport = () => undefined,
  onEnterScore = () => undefined
}: Props) => {
  const activeEvent = useAppSelector(selectTrackingEvent);
  const navigation = useNavigation();
  const { isReady, edgeConnected } = useContext(SocketContext);
  const { customerName } = useAppSelector(selectAuth);
  const isEventUpcoming = useMemo(() => {
    if (!event) return null;
    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      event.UTCdate,
      event.date,
      event.startTime
    );
    const eventDate = new Date(date);
    const today = new Date();

    // calculate difference in unix time
    if (eventDate >= today) {
      return moment(date, dateFormat).valueOf();
    }

    return null;
  }, [event]);

  const onConfirm = () => {
    if (!event?.report && !event?.status?.isFinal) {
      if (!isReady || !edgeConnected) {
        return navigation.navigate('LostConnectionModal', {
          isStartingEvent: true
        });
      }

      if (activeEvent) {
        return Alert.alert(
          'A session is already live',
          'Please end the current session to start tracking a new.',
          [
            {
              text: 'OK, got it.',
              style: 'cancel'
            }
          ],
          { cancelable: false }
        );
      }
      if (!preparationGetActivePlayers(event)) {
        return Alert.alert(
          "Can't start",
          'Please select at least one player',
          [
            {
              text: 'OK',
              style: 'cancel'
            }
          ],
          { cancelable: true }
        );
      }
      return onStartTracking();
    }

    if (event.type === GameType.Match && !event.status?.scoreResult) {
      return onEnterScore();
    }

    onViewReport();
  };

  const renderMatchResults = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 30
          }}
        >
          <View style={styles.reportIndicator}>
            <Text style={styles.reportIndicatorNum}>
              {event?.status?.scoreUs}
            </Text>
            <Text style={styles.reportIndicatorSubtitle}>{customerName}</Text>
          </View>

          <View style={styles.reportIndicator}>
            <Text style={[styles.reportIndicatorSubtitle, { fontSize: 24 }]}>
              vs
            </Text>
          </View>

          <View style={styles.reportIndicator}>
            <Text style={styles.reportIndicatorNum}>
              {event?.status?.scoreThem}
            </Text>
            <Text style={styles.reportIndicatorSubtitle}>{event?.versus}</Text>
          </View>
        </View>
        <View style={commonStyles.sepparator} />
      </>
    );
  };

  const renderContent = () => {
    if (!event) return null;

    if (!event.report && !event?.status?.isFinal) {
      return (
        <TouchableOpacity
          onPress={onChoosePlayers}
          style={[
            styles.row,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }
          ]}
        >
          <Feather name="users" size={31} color="black" />
          <View
            style={{
              marginLeft: 10
            }}
          >
            <Text
              style={{ fontSize: 19, fontFamily: variables.mainFontMedium }}
            >
              {preparationGetActivePlayers(event)} Players
            </Text>
            <Text style={styles.subTitlePlayers}>
              View or Edit Players joining the {event?.type}
            </Text>
          </View>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={29}
            color={variables.red}
          />
        </TouchableOpacity>
      );
    }

    const { percentageLoad } = deriveNewStats({
      event,
      isMatch: event.type === GameType.Match
    });

    return (
      <View>
        {event.type === GameType.Match ? renderMatchResults() : null}

        <View style={styles.reportStatsContainer}>
          <Icon icon="clock" />
          <Text style={styles.reportText}>
            {Math.ceil((utils.getEventDuration(event) || 1) / 1000 / 60)} min
          </Text>
          <Icon icon="player" />
          <Text style={styles.reportText}>
            {Object.keys(event?.report?.stats?.players || {}).length} players
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingHorizontal: 10
          }}
        >
          <View style={styles.reportIndicator}>
            <Text style={styles.reportIndicatorNum}>{percentageLoad}</Text>
            <Text style={styles.reportIndicatorSubtitle}>Player Load</Text>
          </View>

          <View style={styles.reportIndicator}>
            <Text style={styles.reportIndicatorNum}>0</Text>
            <Text style={styles.reportIndicatorSubtitle}>Technical</Text>
          </View>
        </View>
        <View style={commonStyles.sepparator} />
      </View>
    );
  };

  const confirmTitleBtn =
    !event?.report && !event?.status?.isFinal
      ? 'Start Tracking'
      : event.type === GameType.Match && !event.status?.scoreResult
        ? 'Enter Score'
        : 'See Report';

  return (
    <View>
      {!!isEventUpcoming && !event?.status?.isFinal && (
        <EventCountdown timeLeft={isEventUpcoming} />
      )}

      {renderContent()}
      <View style={styles.buttons}>
        <ButtonNew
          text="Edit Event"
          onPress={() => onEditPress && onEditPress()}
          mode="secondary"
          style={styles.saveButton}
        />

        <ButtonNew text={confirmTitleBtn} onPress={onConfirm} />
      </View>
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30
  },

  reportIndicator: { alignItems: 'center', marginVertical: 29 },
  reportIndicatorNum: {
    color: palette.black2,
    fontFamily: variables.mainFontMedium,
    fontSize: 27
  },
  reportIndicatorSubtitle: {
    color: variables.darkGrey,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  reportStatsContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 170
  },
  reportText: {
    color: palette.black2,
    fontFamily: variables.mainFont,
    fontSize: 12,
    lineHeight: 17.86
  },
  row: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  saveButton: {
    marginRight: 30
  },
  subTitlePlayers: {
    color: variables.placeHolderGrey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    letterSpacing: 0.8,
    maxWidth: '90%'
  }
});
