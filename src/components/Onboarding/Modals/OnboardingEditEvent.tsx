import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../../../types';
import {
  deleteGameAction,
  updateGameAction
} from '../../../redux/slices/gamesSlice';
import { useAppDispatch } from '../../../redux/store';
import { RootStackParamList } from '../../../types';
import { formatDateTime } from '../../../utils';
import { utils, variables } from '../../../utils/mixins';
import ButtonNew from '../../common/ButtonNew';
import DateTimePIcker from '../../common/DateTimePicker';
import Dropdown from '../../common/Dropdown';
import InfoCell from '../../common/InfoCell';
import InputCell from '../../common/InputCell';
import ModalContainer from '../../common/Modals/ModalContainer';

enum WhereIsPlaying {
  Home = 'Home',
  Away = 'Away'
}
type NewGame = Partial<GameAny>;

const OnboardingEditEvent = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const route = useRoute() as RouteProp<
    RootStackParamList,
    'EventDetailsModal'
  >;
  const event = route.params.event;
  const [whereIsPlaying, setWhereIsPLaying] = useState(
    event?.location || 'Home'
  );
  const [date, setDate] = useState(moment(event?.date).toDate());
  const [time, setTime] = useState(moment(event?.date).toDate());
  const [opponentName, setOpponentName] = useState(
    event?.type === GameType.Match ? event?.versus || '' : ''
  );

  const closeModal = () => {
    navigation.goBack();
  };

  const onSave = (newEventData: any) => {
    dispatch(updateGameAction(newEventData));
  };

  const saveHandler = () => {
    if (event) {
      const newEventData: NewGame = {
        id: event.id,
        date: formatDateTime(date),
        UTCdate: utils.localeToUTC(date, time),
        startTime: formatDateTime(time, 'HH:mm').toString(),
        endTime: formatDateTime(
          moment(time).add(120, 'minutes'),
          'HH:mm'
        ).toString(),
        location: whereIsPlaying,
        versus: null
      };

      if (event.type === GameType.Match) {
        newEventData.versus = opponentName;
        newEventData.location = whereIsPlaying;
      }
      onSave(newEventData);
    }
    closeModal();
  };

  const deleteHandler = (event: GameAny) => {
    dispatch(deleteGameAction(event));
    closeModal();
  };

  const { date: formatedDate, dateFormat } = utils.checkAndFormatUtcDate(
    event.UTCdate,
    event.date,
    event.startTime
  );

  return (
    <ModalContainer title={'Edit Event'} close={closeModal}>
      <View>
        <View style={styles.row}>
          <InfoCell
            title="When?"
            subTitle={
              !event?.report
                ? 'Select day and time'
                : `${moment(formatedDate, dateFormat).format(
                    'ddd, MMM DD'
                  )} | ${moment(formatedDate, dateFormat).format('HH:mm')}`
            }
          >
            <View style={styles.sectionContent}>
              <View style={styles.inputsWrapper}>
                <View style={styles.datePickerWrapper}>
                  <DateTimePIcker
                    value={date}
                    onConfirm={(date) => setDate(date)}
                  />
                </View>
                <DateTimePIcker
                  value={time}
                  mode="time"
                  onConfirm={(date) => setTime(date)}
                />
              </View>
            </View>
          </InfoCell>
        </View>
        {event?.type === GameType.Match && (
          <>
            <View style={styles.row}>
              <InfoCell title="Where?" subTitle="Select where you playing">
                <View style={styles.sectionContent}>
                  <Dropdown
                    uiType="two"
                    placeholder="Select where you playing"
                    value={whereIsPlaying}
                    options={[
                      { label: 'Home', value: WhereIsPlaying.Home },
                      { label: 'Away', value: WhereIsPlaying.Away }
                    ]}
                    onChange={(value) => {
                      setWhereIsPLaying(value);
                    }}
                    preventUnselect
                  />
                </View>
              </InfoCell>
            </View>

            <InputCell
              placeholder="Enter Opponent Name"
              title="Opponent Name"
              value={opponentName}
              onTextInput={(val) => {
                setOpponentName(val);
              }}
            />
          </>
        )}

        <View style={styles.buttons}>
          <ButtonNew
            text="Delete Event"
            onPress={() => {
              if (event) {
                deleteHandler(event);
              } else {
                alert('No event found');
              }
            }}
            mode="secondary"
            style={styles.saveButton}
          />
          <ButtonNew text="Save & Close" onPress={saveHandler} />
        </View>
      </View>
    </ModalContainer>
  );
};

export default OnboardingEditEvent;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45
  },
  datePickerWrapper: {
    marginRight: 18
  },
  inputsWrapper: {
    flexDirection: 'row'
  },
  row: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  saveButton: {
    marginRight: 30
  },
  sectionContent: {
    marginLeft: 50,
    width: 260
  }
});
