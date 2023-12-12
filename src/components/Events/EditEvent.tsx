import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { BenchmarkData, GameAny, GameType } from '../../../types';
import { selectAllGames } from '../../redux/slices/gamesSlice';
import { useAppSelector } from '../../redux/store';
import { formatDateTime } from '../../utils';
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

type NewGame = Partial<GameAny>;
type Props = {
  event: GameAny;
  onSave: (
    newEventData: NewGame,
    startTracking: boolean,
    recurringEvent: boolean
  ) => void;
  onDelete?: () => void;
  onEnterScore?: () => void;
};

const EditEvent: React.FC<Props> = ({
  event,
  onSave = () => undefined,
  onDelete = () => undefined,
  onEnterScore = () => undefined
}: Props) => {
  const allGames = useAppSelector(selectAllGames);

  const [whereIsPlaying, setWhereIsPlaying] = useState<string>(
    event.location || WhereIsPlaying.Home
  );
  const [date, setDate] = useState<Date>(moment(event.date).toDate());
  const { date: newDate, dateFormat } = utils.checkAndFormatUtcDate(
    event.UTCdate,
    event.date,
    event.startTime
  );
  const [time, setTime] = useState<Date>(moment(newDate, dateFormat).toDate());
  const [opponentName, setOpponentName] = useState<string>(
    event.type === GameType.Match ? event.versus || '' : ''
  );
  const [manualCategory, setManualCategory] = useState<boolean>(
    !!event.benchmark?.manualIndicator
  );

  const [trainingCategory, setTrainingCategory] = useState<
    number | string | null
  >(event.benchmark?.indicator || null);

  const saveHandler = (updateRecurring = false) => {
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

    if (updateRecurring && event.recurringEventId) {
      newEventData.recurringEventId = event.recurringEventId;
    }

    if (event.type === GameType.Training && manualCategory) {
      const eventBenchmark = event.benchmark ? event.benchmark : {};
      newEventData.benchmark = {
        ...eventBenchmark,
        manualIndicator: true,
        indicator: trainingCategory
      } as BenchmarkData;
    }

    onSave(newEventData, false, updateRecurring);
  };

  const onSubmit = () => {
    if (event.recurringEventId) {
      return Alert.alert(
        'Update recurring event',
        '',
        [
          {
            text: 'This Event',
            onPress: () => saveHandler()
          },
          {
            text: 'All Events',
            style: 'destructive',
            onPress: () => saveHandler(true)
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    }
    return saveHandler();
  };

  const validationMessage = (): string | null => {
    const gamesOnSelectedDate = allGames.filter((game) => {
      return game.id !== event.id && game.date === formatDateTime(date);
    });

    if (gamesOnSelectedDate.length === 1) {
      const startTimeOnExistingEvent = moment(
        gamesOnSelectedDate[0].date,
        'YYYY/MM/DD HH:mm'
      ).format('HH:mm');
      if (formatDateTime(time, 'HH:mm') === startTimeOnExistingEvent) {
        return 'Already has an event that starts at this time!';
      }
    }

    return null;
  };

  return (
    <View>
      <View style={styles.row}>
        {!!event.recurringEventId && (
          <Text style={styles.recurringEventText}>Recurring event</Text>
        )}
        {event?.type === GameType.Match &&
          event.report &&
          event.status?.isFinal && (
            <>
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
              <View style={styles.row}>
                <InfoCell
                  title="Result"
                  subTitle={`${event?.status?.scoreUs}-${event?.status?.scoreThem}`}
                >
                  <ButtonNew
                    mode="secondary"
                    text="Edit Result"
                    onPress={onEnterScore}
                    style={{ width: 140 }}
                  />
                </InfoCell>
              </View>
            </>
        )}
        {!event.report && (
          <View>
            <InfoCell
              title=""
              subTitle={
                !event.report
                  ? 'Select day and time'
                  : `${moment(date, dateFormat).format(
                      'ddd, MMM DD'
                    )} | ${moment(date, dateFormat).format('HH:mm')}`
              }
            />
            <View style={styles.sectionDayTime}>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={date}
                  onConfirm={(date) => setDate(date)}
                  customStyle={{ width: 120 }}
                />
              </View>
              <DateTimePicker
                value={time}
                mode="time"
                onConfirm={(date) => setTime(date)}
                customStyle={{ width: 120 }}
              />
            </View>
          </View>
        )}
      </View>
      {event.type === GameType.Training && (
        <View style={styles.row}>
          <View style={styles.checkBoxWrapper}>
            <CheckBox
              disabled={
                !!event.benchmark?.manualIndicator || !!event.recurringEventId
              }
              label="Manual Category"
              value={manualCategory}
              onChange={() => {
                setManualCategory((prevState) => !prevState);
              }}
            />
          </View>
          {manualCategory && (
            <View>
              <InfoCell title="" subTitle="No Category or Individual" />
              <View
                style={{
                  width: 240,
                  marginTop: 10
                }}
              >
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
            </View>
          )}
        </View>
      )}
      {!!validationMessage() && (
        <Text style={styles.validationText}>{validationMessage()}</Text>
      )}
      {event.type === GameType.Match && (
        <View style={styles.row}>
          <InfoCell title="" subTitle="Select where you playing" />

          <View
            style={{
              width: 260,
              marginTop: 10
            }}
          >
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
            />
          </View>
        </View>
      )}
      <View style={styles.buttons}>
        <ButtonNew
          text="Delete"
          onPress={onDelete}
          mode="secondary"
          style={styles.saveButton}
        />
        <ButtonNew
          text="Save & Close"
          onPress={onSubmit}
          disabled={!!validationMessage()}
        />
      </View>
    </View>
  );
};

export default EditEvent;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 45
  },
  checkBoxWrapper: {
    marginTop: 16
  },
  datePickerWrapper: {
    marginRight: 18
  },
  recurringEventText: {
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    marginBottom: 10
  },
  row: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    paddingBottom: 16
  },
  saveButton: {
    marginRight: 30
  },
  sectionDayTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: 240
  },
  validationText: {
    color: variables.red,
    marginTop: 10,
    width: 470
  }
});
