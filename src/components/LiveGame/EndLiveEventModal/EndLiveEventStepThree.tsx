import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import moment from 'moment';

import { GameType, StatusMatch } from '../../../../types';
import { selectAuth } from '../../../redux/slices/authSlice';
import { updateGameAction } from '../../../redux/slices/gamesSlice';
import {
  removeTrackingEvent,
  selectTrackingEvent,
  updateTrackingEvent
} from '../../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { RootStackParamList } from '../../../types';
import { utils, variables } from '../../../utils/mixins';
import ButtonNew from '../../common/ButtonNew';
import ScoreInput from '../../common/ScoreInput';

interface EndLiveEventStepThreeProps {
  // handle navigation from LostConnectionModal to Report
  isDisconnected?: boolean;
  next?: () => void;
}

const EndLiveEventStepThree = ({
  isDisconnected,
  next
}: EndLiveEventStepThreeProps) => {
  const { customerName } = useAppSelector(selectAuth);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [score, setScore] = useState({
    first: '',
    second: ''
  });

  const isMatch = activeEvent?.type === GameType.Match;

  const onChange = (name: string, value: string) => {
    setScore((prevState) => ({
      ...prevState,
      [name]: value.replace(/[^0-9]/g, '')
    }));
  };

  const isSaveButtonDisabled = () => {
    if (isMatch) {
      return !score.first || !score.second;
    }
    return false;
  };

  const onSave = () => {
    const event = { ...activeEvent };

    if (isMatch) {
      const eventStatus = { ...activeEvent.status } as StatusMatch;
      const scoreUs = parseInt(score.first);
      const scoreThem = parseInt(score.second);
      const scoreResult =
        scoreUs > scoreThem ? 'w' : scoreUs < scoreThem ? 'l' : 'd';

      eventStatus.scoreUs = score.first;
      eventStatus.scoreThem = score.second;
      eventStatus.scoreResult = scoreResult;
      event.status = eventStatus;
    }

    dispatch(updateGameAction(event));
    dispatch(updateTrackingEvent(event));

    if (isDisconnected) {
      dispatch(removeTrackingEvent());
      navigation.goBack();

      setTimeout(() => {
        navigation.navigate('Report', { eventId: event.id });
      }, 1);

      return;
    }

    if (isMatch && next) {
      next();
    }
  };

  const onCancel = () => {
    if (isDisconnected) {
      dispatch(updateGameAction({ ...activeEvent }));
      dispatch(removeTrackingEvent());

      navigation.goBack();

      return setTimeout(() => navigation.navigate('Root'), 1);
    }
    isMatch && next && next();
  };

  const renderContent = () => {
    if (isMatch && activeEvent.versus) {
      return (
        <View>
          <Text style={styles.text}>Please enter match result</Text>
          <ScoreInput
            firstTeam={customerName}
            secondTeam={activeEvent.versus}
            values={score}
            onChange={onChange}
          />
        </View>
      );
    }
    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      activeEvent.UTCdate,
      activeEvent.date,
      activeEvent.startTime
    );

    return (
      <>
        <Text style={styles.text}>Training Session</Text>
        <Text style={styles.textSecondary}>{`${moment(
          `${date}`,
          dateFormat
        ).format('ddd, MMMM DD | HH:mm')}`}</Text>
      </>
    );
  };

  return (
    <View>
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.buttons}>
        <ButtonNew
          style={styles.secondaryButton}
          onPress={onCancel}
          text={isMatch ? 'Do It Later' : 'Go to home page'}
          mode="secondary"
        />
        <ButtonNew
          disabled={isSaveButtonDisabled()}
          onPress={onSave}
          text={isMatch ? 'Save' : 'See Report'}
        />
      </View>
    </View>
  );
};

export default EndLiveEventStepThree;

const styles = StyleSheet.create({
  buttons: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  content: {
    alignItems: 'center',
    borderBottomColor: variables.lightestGrey,
    borderBottomWidth: 1,
    marginBottom: 50,
    paddingVertical: 20
  },
  secondaryButton: {
    marginRight: 23
  },
  text: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    marginBottom: 9,
    textAlign: 'center'
  },
  textSecondary: {
    color: variables.placeHolderGrey,
    fontFamily: variables.mainFont,
    fontSize: 16
  }
});
