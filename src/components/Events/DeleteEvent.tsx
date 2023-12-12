import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../../types';
import { utils, variables } from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';

type Props = {
  event?: GameAny;
  onDelete: (event: GameAny, recurringEvent: boolean) => void;
};

const DeleteEvent = ({ event, onDelete }: Props) => {
  const navigation = useNavigation();

  const onDeleteHanlder = () => {
    if (!event) return alert('No event found');
    if (event?.recurringEventId) {
      return Alert.alert(
        'Delete recurring event',
        '',
        [
          {
            text: 'This Event',
            onPress: () => onDelete(event, false)
          },
          {
            text: 'All Events',
            style: 'destructive',
            onPress: () => onDelete(event, true)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    }
    return onDelete(event, false);
  };

  const getDateFormatedTest = () => {
    if (!event) return '';
    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      event.UTCdate,
      event.date,
      event.startTime
    );

    return `${moment(date, dateFormat).format('ddd, MMM DD')} | ${moment(
      date,
      dateFormat
    ).format('HH:mm')}`;
  };

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.title}>
          {event?.type === GameType.Training ? 'Training' : 'Match'}
        </Text>

        <Text style={styles.subtitle}>{getDateFormatedTest()}</Text>
      </View>

      <View style={styles.buttons}>
        <ButtonNew
          text="Cancel"
          onPress={navigation.goBack}
          mode="secondary"
          style={styles.saveButton}
        />

        <ButtonNew
          text="Delete Event"
          onPress={onDeleteHanlder}
          mode="secondary"
        />
      </View>
    </View>
  );
};

export default DeleteEvent;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 45
  },
  row: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  saveButton: {
    marginRight: 30
  },
  subtitle: {
    color: variables.placeHolderGrey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    textAlign: 'center'
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    textAlign: 'center'
  }
});
