import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameType, StatusMatch } from '../../../../types';
import { LiveTimerContext } from '../../../hooks/liveTimerContext';
import { EventTopics, SocketContext } from '../../../hooks/socketContext';
import { selectAuth } from '../../../redux/slices/authSlice';
import {
  selectTrackingEvent,
  updateTrackingEvent
} from '../../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../../redux/store';
import { utils, variables } from '../../../utils/mixins';
import ButtonNew from '../../common/ButtonNew';
import OverlayLoader from '../../common/OverlayLoader';

type Props = {
  next: () => void;
};

const EndLiveEventStepOne = ({ next }: Props) => {
  const { val, sendEvent } = useContext(SocketContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const activeEvent = useAppSelector(selectTrackingEvent);
  const { customerName } = useAppSelector(selectAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showEndWithoutData, setShowEndWithoutData] = useState(false);
  const { pause } = useContext(LiveTimerContext);

  useEffect(() => {
    if (!isLoading) return;
    const method = val?.method;
    if (method === EventTopics.TRAINING_END) {
      setIsLoading(false);
      next();
    }
  }, [val?.method, isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const timeout = setTimeout(() => {
      setShowEndWithoutData(true);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const getText = () => {
    if (activeEvent?.type === GameType.Match) {
      return `${customerName} vs ${activeEvent.versus}`;
    }

    return 'Training Session';
  };

  const onEndEvent = () => {
    setIsLoading(true);
    const eventStatus = { ...activeEvent.status } as StatusMatch;

    eventStatus.isFinal = true;
    eventStatus.endTimestamp = Date.now();
    eventStatus.duration = Date.now() - eventStatus.startTimestamp;
    pause();
    dispatch(
      updateTrackingEvent({
        ...activeEvent,
        status: eventStatus
      })
    );

    sendEvent(EventTopics.TRAINING_END, {
      gameId: activeEvent.id
    });
  };

  const onEndWithoutFullReport = () => {
    if (!activeEvent) return null;

    const eventStatus = { ...activeEvent.status } as StatusMatch;
    eventStatus.isFinal = true;
    eventStatus.isFullReport = false;
    eventStatus.endTimestamp = Date.now();
    eventStatus.duration = Date.now() - eventStatus.startTimestamp;

    dispatch(
      updateTrackingEvent({
        ...activeEvent,
        status: eventStatus
      })
    );

    next();
  };

  const { date, dateFormat } = utils.checkAndFormatUtcDate(
    activeEvent.UTCdate,
    activeEvent.date,
    activeEvent.startTime
  );

  return (
    <View>
      <View style={styles.contnet}>
        <Text style={styles.text}>{getText()}</Text>
        <Text style={styles.textSecondary}>{`${moment(
          `${date}`,
          dateFormat
        ).format('ddd, MMMM DD | HH:mm')} | ${activeEvent.location}`}</Text>
      </View>
      <View style={styles.buttons}>
        {isLoading
          ? (
          <View>
            <OverlayLoader
              isLoading={isLoading}
              isOverlay={false}
              color={variables.red}
            />

            {showEndWithoutData && (
              <Pressable
                style={styles.marginTop}
                onPress={() => {
                  Alert.alert(
                    'Are you sure?',
                    "You might miss some data in your report, and we can't guarantee the validity of the dataset.",
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel'
                      },
                      {
                        text: 'End',
                        style: 'destructive',
                        onPress: onEndWithoutFullReport
                      }
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <Text style={styles.buttonText}>
                  End tracking without all data
                </Text>
              </Pressable>
            )}
          </View>
            )
          : (
          <>
            <ButtonNew
              style={styles.secondaryButton}
              onPress={navigation.goBack}
              text="Keep Tracking"
              mode="secondary"
            />

            <ButtonNew onPress={onEndEvent} text="End Tracking" />
          </>
            )}
      </View>
    </View>
  );
};

export default EndLiveEventStepOne;

const styles = StyleSheet.create({
  buttonText: {
    color: variables.red,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 6
  },
  buttons: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  contnet: {
    alignItems: 'center',
    borderBottomColor: variables.lightestGrey,
    borderBottomWidth: 1,
    height: 155,
    justifyContent: 'center',
    marginBottom: 60
  },
  marginTop: { marginTop: 25 },
  secondaryButton: {
    marginRight: 23
  },
  text: { fontFamily: variables.mainFontMedium, fontSize: 18, marginBottom: 9 },
  textSecondary: {
    color: variables.placeHolderGrey,
    fontFamily: variables.mainFont,
    fontSize: 16
  }
});
