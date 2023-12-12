import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { BenchmarkData, GameAny, GameType } from '../../../types';
import {
  selectAllGames,
  selectLastFinishedMatch,
  selectLastFinishedTraining
} from '../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { useAppSelector } from '../../redux/store';
import { categorizeTrainingEvents, formatDateTime } from '../../utils';
import {
  TRAINING_CATEOGRY_OPTIONS,
  utils,
  variables
} from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import CheckBox from '../common/CheckBox';
import DateTimePicker from '../common/DateTimePicker';
import Dropdown from '../common/Dropdown';
import InfoCell from '../common/InfoCell';
import InputCell from '../common/InputCell';

enum WhereIsPlaying {
  Home = 'Home',
  Away = 'Away'
}

type EventTypeState = GameType.Match | GameType.Training;
type WhereIsPlayingState = WhereIsPlaying.Home | WhereIsPlaying.Away;

type NewGame = Partial<GameAny>;
type Props = {
  onSave: (data: NewGame, startEvent?: boolean, endDate?: Date | null) => void;
  onChoosePlayers: (data: any) => void;
  createDate?: Date | undefined;
};

const CreateEvent: React.FC<Props> = ({
  onSave,
  onChoosePlayers,
  createDate = new Date()
}: Props) => {
  const navigation = useNavigation();
  const allGames = useAppSelector(selectAllGames);
  const allPlayers = useAppSelector(selectAllPlayers);
  const lastFinishedMatch = useAppSelector(selectLastFinishedMatch);
  const lastFinishedTraining = useAppSelector(selectLastFinishedTraining);

  const [eventType, setEventType] = useState<EventTypeState>(GameType.Training);
  const [whereIsPlaying, setWhereIsPlaying] = useState<WhereIsPlayingState>(
    WhereIsPlaying.Home
  );
  const [trainingCategory, setTrainingCategory] = useState<number | string>(
    'no_category'
  );
  const [date, setDate] = useState<Date>(createDate);
  const [endDate, setEndDate] = useState<Date>(createDate);
  const [time, setTime] = useState<Date>(new Date());
  const [opponentName, setOpponentName] = useState<string>('');
  const [recurringEvent, setRecurringEvent] = useState<null | number>(null);
  const [manualCategory, setManualCategory] = useState<boolean>(false);

  useEffect(() => {
    setTrainingCategory(getDefaultTrainingCategoryOption());
  }, []);

  useEffect(() => {
    if (recurringEvent) {
      setManualCategory(false);
    }
  }, [recurringEvent]);

  useEffect(() => {
    setEndDate(getEndDate());
  }, [date]);

  const validationMessage = (): string | null => {
    const gameOverlap = allGames.some(
      (game) =>
        moment(game.date, 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD') ===
          moment(date).format('YYYY/MM/DD') &&
        formatDateTime(time, 'HH:mm') ===
          moment(game.date, 'YYYY/MM/DD HH:mm').format('HH:mm')
    );

    if (gameOverlap) {
      return 'Already has an event that starts at this time!';
    }

    return null;
  };

  const getEventData = (): NewGame => {
    const newEventData: NewGame = {
      type: eventType,
      date: formatDateTime(date),
      UTCdate: utils.localeToUTC(date, time),
      startTime: formatDateTime(time, 'HH:mm').toString(),
      endTime: formatDateTime(
        moment(time).add(120, 'minutes').toDate(),
        'HH:mm'
      ).toString(),
      location: whereIsPlaying,
      preparation: {
        playersInPitch:
          eventType === GameType.Training ? allPlayers.map(({ id }) => id) : [],
        playersOnBench:
          eventType === GameType.Training ? [] : allPlayers.map(({ id }) => id)
      }
    };

    if (
      eventType === GameType.Training &&
      lastFinishedTraining &&
      lastFinishedTraining.preparation &&
      newEventData.preparation
    ) {
      const playersInPitch =
        lastFinishedTraining.preparation?.playersInPitch || [];
      newEventData.preparation = {
        playersInPitch: allPlayers
          .filter(({ id }) => playersInPitch.includes(id))
          .map(({ id }) => id),
        playersOnBench: allPlayers
          .filter(({ id }) => !playersInPitch.includes(id))
          .map(({ id }) => id)
      };
    }

    if (eventType === GameType.Match) {
      newEventData.versus = opponentName;
      newEventData.location = whereIsPlaying;
      if (newEventData.preparation) {
        const playersInPitch =
          lastFinishedMatch?.preparation?.playersInPitch || [];
        newEventData.preparation = {
          playersInPitch: allPlayers
            .filter(({ id }) => playersInPitch.includes(id))
            .map(({ id }) => id),
          playersOnBench: allPlayers
            .filter(({ id }) => !playersInPitch.includes(id))
            .map(({ id }) => id)
        };
      }
    }

    if (eventType === GameType.Training && recurringEvent) {
      newEventData.recurringEventId = recurringEvent;
    }

    if (eventType === GameType.Training && manualCategory) {
      newEventData.benchmark = {
        manualIndicator: true,
        indicator: trainingCategory
      } as BenchmarkData;
    }

    return newEventData;
  };

  const isButtonDisabled = (): boolean => {
    if (eventType === GameType.Match) {
      return !opponentName || !!validationMessage();
    }

    return !!validationMessage();
  };

  const saveHandler = (): void => {
    const newEventData = getEventData();
    const isTraining = newEventData.type === GameType.Training;

    const isPastTime = moment(`${newEventData.date}`, 'YYYY/MM/DD').isBefore(
      moment().format('YYYY/MM/DD'),
      'day'
    );
    if (isTraining && isPastTime) {
      return Alert.alert(
        'Error',
        "Can't create training event on past date/time",
        [
          {
            text: 'OK',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    }

    onSave(newEventData, false, endDate);
  };

  const choosePlayersHandler = (): void => {
    const newEventData = getEventData();
    onChoosePlayers(newEventData);
  };

  const getEndDate = (): Date => {
    return moment(date, 'YYYY/MM/DD').add(5, 'M').toDate();
  };

  const getDefaultTrainingCategoryOption = () => {
    const { indicator } = categorizeTrainingEvents([
      ...allGames,
      {
        id: 'NEW',
        date: moment(date).format('YYYY/MM/DD'),
        type: 'training',
        startTime: '15:00'
      }
    ]).NEW;

    if (indicator === null) return 'no_category';
    return indicator;
  };

  return (
    <View>
      <View style={styles.row}>
        <InfoCell title="Type of Event" subTitle="Select Match or Training">
          <View style={styles.sectionContent}>
            <Dropdown
              uiType="two"
              placeholder="Select event type"
              value={eventType}
              options={[
                { label: 'Match', value: GameType.Match },
                { label: 'Training', value: GameType.Training }
              ]}
              onChange={(value) => {
                setEventType(value);
              }}
              preventUnselect
              dropdownHeight={90}
            />
          </View>
        </InfoCell>
      </View>
      {eventType === GameType.Training && (
        <View style={styles.row}>
          <View style={styles.checkBoxWrapper}>
            <CheckBox
              disabled={!!recurringEvent}
              label="Manual Category"
              value={manualCategory}
              onChange={() => {
                setManualCategory((prevState) => !prevState);
              }}
            />
          </View>
          {manualCategory && (
            <InfoCell title="Training Category" subTitle="Select Category">
              <View style={styles.sectionContent}>
                <Dropdown
                  uiType="two"
                  placeholder="Select category"
                  value={trainingCategory}
                  options={TRAINING_CATEOGRY_OPTIONS}
                  onChange={(value) => {
                    setTrainingCategory(value);
                  }}
                  preventUnselect
                  dropdownHeight={107}
                />
              </View>
            </InfoCell>
          )}
        </View>
      )}
      <View style={styles.row}>
        <InfoCell title="When?" subTitle="Select day and time">
          <View style={styles.sectionContent}>
            <View style={styles.inputsWrapper}>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={date}
                  onConfirm={(date) => setDate(date)}
                />
              </View>
              <DateTimePicker
                value={time}
                mode="time"
                onConfirm={(date) => setTime(date)}
              />
            </View>
          </View>
        </InfoCell>
      </View>

      {eventType === GameType.Training && (
        <View style={styles.recurringContainer}>
          <View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                label="Recurring event"
                value={!!recurringEvent}
                onChange={(val) => {
                  setRecurringEvent(val ? Date.now() : null);
                }}
              />
            </View>
            {recurringEvent && (
              <Text style={styles.recurringText}>
                The event will occur once a week until the selected time
              </Text>
            )}
          </View>
          {recurringEvent && (
            <View>
              <DateTimePicker
                value={endDate}
                onConfirm={(date) => setEndDate(date)}
                maximumDate={moment(date, 'YYYY/MM/DD').add(1, 'y').toDate()}
                customStyle={{
                  width: 120
                }}
              />
            </View>
          )}
        </View>
      )}
      {eventType === GameType.Match && (
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
                    setWhereIsPlaying(value);
                  }}
                  preventUnselect
                  dropdownHeight={90}
                />
              </View>
            </InfoCell>
          </View>
          <InputCell
            autoFocus
            placeholder="Enter Opponent Name"
            title="Opponent Name"
            value={opponentName}
            onTextInput={(val) => {
              setOpponentName(val);
            }}
            maxLength={40}
          />
        </>
      )}

      {validationMessage() && (
        <Text style={styles.validationText}>{validationMessage()}</Text>
      )}

      <View style={styles.buttons}>
        {navigation.getState().routeNames.includes('OnboardingSteps') && (
          <ButtonNew
            text="Cancel"
            onPress={() => navigation.goBack()}
            mode="secondary"
            style={styles.saveButton}
          />
        )}
        <ButtonNew
          text="Save & Close"
          onPress={saveHandler}
          disabled={isButtonDisabled()}
          style={styles.saveButton}
        />
        {!navigation.getState().routeNames.includes('OnboardingSteps') && (
          <ButtonNew
            text="Choose Players"
            onPress={choosePlayersHandler}
            disabled={isButtonDisabled() || !!recurringEvent}
          />
        )}
      </View>
    </View>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45
  },
  checkBoxWrapper: {
    marginTop: 16
  },
  checkboxContainer: { marginBottom: 10 },
  datePickerWrapper: {
    marginRight: 18
  },
  inputsWrapper: {
    flexDirection: 'row'
  },
  recurringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25
  },
  recurringText: {
    color: variables.darkGrey,
    fontFamily: variables.mainFont,
    maxWidth: 290,
    paddingRight: 10
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
  },
  validationText: {
    color: variables.red,
    marginTop: 10,
    width: 470
  }
});
