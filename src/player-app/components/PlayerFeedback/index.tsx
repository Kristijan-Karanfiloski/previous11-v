import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameAny, GameType } from '../../../../types';
import { Icon } from '../../../components/icon/icon';
import { updateGameAction } from '../../../redux/slices/gamesSlice';
import { useAppDispatch } from '../../../redux/store';
import { variables } from '../../../utils/mixins';

type Props = {
  game: GameAny;
  playerId: string;
  showThanksMessage: boolean;
  setShowThanksMessage: React.Dispatch<React.SetStateAction<boolean>>;
};

const PlayerFeedback = ({
  game,
  playerId,
  showThanksMessage,
  setShowThanksMessage
}: Props) => {
  const dispatch = useAppDispatch();

  const [selectedNumber, setSelectedNumber] = useState(0);
  const isMatch = game.type === GameType.Match;

  const onSubmit = () => {
    const rpe = game.rpe
      ? { ...game.rpe, [playerId]: selectedNumber }
      : { [playerId]: selectedNumber };
    dispatch(updateGameAction({ ...game, rpe })).then(() =>
      setShowThanksMessage(true)
    );
  };

  return (
    <View style={styles.container}>
      {showThanksMessage
        ? (
        <View style={styles.msgWrapper}>
          <Icon style={styles.msgIcon} icon="check" />
          <Text style={styles.msgText}>Thanks for your feedback</Text>
        </View>
          )
        : (
        <>
          <View style={styles.topSection}>
            <View style={styles.wrapper}>
              <Icon style={styles.icon} icon="flag_icon" />
              <Text style={styles.textSecondary}>
                {isMatch ? 'Match' : 'Training'} feedback
              </Text>
            </View>
          </View>
          <Text style={styles.textPrimary}>
            Rate the physical intensity of the training
          </Text>
          <View style={styles.feedbackContainer}>
            {Array(10)
              .fill(null)
              .map((_, index) => {
                const number = index + 1;
                const isSelected = number === selectedNumber;

                return (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedNumber(number)}
                    style={[
                      styles.feedbackButton,
                      isSelected && styles.feedbackButtonSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.feedbackButtonText,
                        isSelected && styles.feedbackButtonTextSelected
                      ]}
                    >
                      {number}
                    </Text>
                  </Pressable>
                );
              })}
          </View>
          {!!selectedNumber && (
            <Pressable onPress={onSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Send</Text>
              <Icon style={styles.buttonIcon} icon="arrow_forward" />
            </Pressable>
          )}
        </>
          )}
    </View>
  );
};

export default PlayerFeedback;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: variables.red,
    borderRadius: 4,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    marginTop: 16
  },
  buttonIcon: {
    color: variables.realWhite
  },
  buttonText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontBold,
    marginRight: 4
  },
  container: {
    backgroundColor: variables.realWhite,
    padding: 16
  },
  feedbackButton: {
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 50,
    borderWidth: 2,
    height: 32,
    justifyContent: 'center',
    width: 32
  },
  feedbackButtonSelected: {
    backgroundColor: variables.red,
    borderColor: variables.red
  },
  feedbackButtonText: {
    fontFamily: variables.mainFontBold,
    fontSize: 12
  },
  feedbackButtonTextSelected: {
    color: variables.realWhite
  },
  feedbackContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  icon: {
    color: variables.textBlack,
    height: 14,
    marginRight: 4
  },
  msgIcon: {
    color: variables.textBlack,
    height: 12,
    marginRight: 4
  },

  msgText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 14
  },
  msgWrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  textPrimary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 16
  },
  textSecondary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 12
  },
  topSection: {
    marginBottom: 20
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  }
});
