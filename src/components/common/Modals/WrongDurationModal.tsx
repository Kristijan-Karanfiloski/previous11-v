import React, { useContext, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../../../types';
import { SocketContext } from '../../../hooks/socketContext';
import { color, commonStyles } from '../../../theme';
import { utils, variables } from '../../../utils/mixins';
import ButtonNew from '../ButtonNew';
import Card from '../Card';
import Dropdown from '../Dropdown';
import FullScreenDialog from '../FullScreenDialog';
import InfoCell from '../InfoCell';

type Props = {
  event: GameAny;
  handleNewEndTimestamp: (endTimestamp: number) => void;
};

const isIpad = Platform.OS === 'ios' && Platform.isPad;
const WrongDurationModal = ({ event, handleNewEndTimestamp }: Props) => {
  const navigation = useNavigation();
  const { edgeConnected, isReady } = useContext(SocketContext);

  const sessionEndTime = Math.ceil((event.status?.duration || 1) / 1000 / 60);
  const eventSeries =
    event?.report?.stats?.team?.fullSession?.playerLoad?.series || [];

  const lastDataTime = Math.ceil(
    (eventSeries[eventSeries.length - 1].timestamp || 1) / 1000 / 60
  );
  const [newEndTime, setNewEndTime] = useState<number | null>(null);

  const requestReportHandler = () => {
    if (!edgeConnected || !isReady) {
      return navigation.navigate('LostConnectionModal', {
        isStartingEvent: true
      });
    }

    handleNewEndTimestamp(
      moment(moment(event?.status?.startTimestamp).add(newEndTime, 'minutes'))
        .toDate()
        .getTime()
    );
  };

  const getEventTypeText = () => {
    return `${
      event?.type === GameType.Match
        ? 'Match'
        : utils.getTrainingDescription(event?.benchmark?.indicator || null)
    }`;
  };

  const getDateText = () => {
    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      event.UTCdate,
      event.date,
      event.startTime
    );
    return `${moment(date, dateFormat).format('MMM DD YYYY')} at ${moment(
      date,
      dateFormat
    ).format('HH:mm')}`;
  };

  const renderDateText = () => {
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{getEventTypeText()}</Text>
        <Text style={styles.text}>{getDateText()}</Text>
      </View>
    );
  };

  const generateMinutesArray = () => {
    return Array.from(
      { length: sessionEndTime - (lastDataTime - 1) },
      (_, i) => {
        return i + lastDataTime;
      }
    );
  };

  return (
    <FullScreenDialog>
      <Card style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Incorect session ending</Text>
          {renderDateText()}
          <View style={commonStyles.sepparator} />
          <View style={styles.item}>
            <Text style={styles.itemText}>
              It looks like The iPad and Edge were disconnected during the live
              session, or the event was not ended properly.
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>
              This session has been ended after {sessionEndTime} minutes, but
              the last data has been received at {lastDataTime} minutes
            </Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>
              Please select the correct ending for this session before
              generating the full report from the edge device.
            </Text>
          </View>
          <View style={commonStyles.sepparator} />
          <View style={styles.inputContainer}>
            <InfoCell
              title="When event ended?"
              subTitle="Select correct minute of ending"
            >
              <View style={styles.dropdownContainer}>
                <Dropdown
                  uiType="two"
                  placeholder="Select Minute"
                  value={newEndTime}
                  options={generateMinutesArray().map((item) => {
                    const label = `${item} minutes`;
                    return {
                      label,
                      value: item
                    };
                  })}
                  onChange={setNewEndTime}
                />
              </View>
            </InfoCell>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonNew
            text="Retrieve Data"
            onPress={requestReportHandler}
            disabled={!newEndTime}
          />
        </View>
      </Card>
    </FullScreenDialog>
  );
};

export default WrongDurationModal;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 6,
    marginTop: 54,
    width: '100%'
  },
  container: {
    alignItems: 'center',
    backgroundColor: color.palette.realWhite,
    borderRadius: isIpad ? 4 : 8,
    justifyContent: 'center',
    paddingVertical: 17,
    width: isIpad ? variables.deviceWidth * 0.67 : variables.deviceWidth - 32
  },
  content: {
    alignItems: 'center',
    color: color.palette.darkGrey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    paddingHorizontal: isIpad ? 60 : 13,
    textAlign: 'center'
  },
  dropdownContainer: {
    width: variables.deviceWidth * 0.2
  },
  inputContainer: {
    width: 400
  },
  item: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 16,
    width: 450
  },
  itemText: {
    fontFamily: variables.mainFont,
    fontSize: 16,
    textAlign: 'center'
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    textAlign: 'center',
    width: '100%'
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginBottom: 28,
    marginTop: 20,
    textAlign: 'center'
  }
});
