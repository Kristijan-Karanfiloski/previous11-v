import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Game, GameType, StatusMatch } from '../../../types';
import { selectAuth } from '../../redux/slices/authSlice';
import { updateGameAction } from '../../redux/slices/gamesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import ButtonNew from '../common/ButtonNew';
import ScoreInput from '../common/ScoreInput';

type Props = {
  event: Game<GameType.Match>;
  editResult?: boolean;
  goBackToEdit?: () => void;
};

const MatchScore = ({ event, editResult = false, goBackToEdit }: Props) => {
  const dispatch = useAppDispatch();
  const { customerName } = useAppSelector(selectAuth);

  const navigation = useNavigation();
  const [score, setScore] = useState({
    first: event?.status?.scoreUs || '',
    second: event?.status?.scoreThem || ''
  });

  const onSave = () => {
    const activeEvent = { ...event };
    const eventStatus = { ...activeEvent.status } as StatusMatch;
    eventStatus.scoreUs = score.first;
    eventStatus.scoreThem = score.second;
    const scoreUs = parseInt(score.first);
    const scoreThem = parseInt(score.second);
    const scoreResult =
      scoreUs > scoreThem ? 'w' : scoreUs < scoreThem ? 'l' : 'd';
    eventStatus.scoreResult = scoreResult;
    activeEvent.status = eventStatus;
    dispatch(updateGameAction(activeEvent));
    if (editResult) {
      setTimeout(() => {
        goBackToEdit && goBackToEdit();
      }, 300);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View>
      <View style={styles.scoreContainer}>
        <ScoreInput
          firstTeam={customerName}
          secondTeam={event.versus}
          onChange={(name, value) => {
            setScore((prevState) => ({
              ...prevState,
              // accept only numbers and replace all other characters
              [name]: value.replace(/[^0-9]/g, '')
            }));
          }}
          values={score}
          inputMaxLength={2}
        />
      </View>
      <View style={styles.buttons}>
        <ButtonNew
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          text="Cancel"
          mode="secondary"
        />
        <ButtonNew
          disabled={!score.first.length || !score.second.length}
          onPress={onSave}
          text="Save"
        />
      </View>
    </View>
  );
};

export default MatchScore;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row'
  },
  cancelBtn: {
    marginRight: 40
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30
  }
});
