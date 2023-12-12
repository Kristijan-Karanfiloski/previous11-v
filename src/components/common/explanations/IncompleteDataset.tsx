import React, { useContext } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../../../types';
import { SocketContext } from '../../../hooks/socketContext';
import { color, commonStyles } from '../../../theme';
import { utils, variables } from '../../../utils/mixins';
import ButtonNew from '../ButtonNew';
import Card from '../Card';
import ConnectionButton from '../ConnectionButton';
import FullScreenDialog from '../FullScreenDialog';

interface IncompleteDatasetAlertProps {
  onDismiss?: () => void;
  onConfirm?: () => void;
  event: GameAny;
}

const isIpad = Platform.OS === 'ios' && Platform.isPad;

const IncompleteDatasetAlert = (props: IncompleteDatasetAlertProps) => {
  const navigation = useNavigation();
  const { edgeConnected, isReady } = useContext(SocketContext);
  const { event, onConfirm } = props;

  const requestReportHandler = () => {
    if (!edgeConnected || !isReady) {
      return navigation.navigate('LostConnectionModal', {
        isStartingEvent: true
      });
    }
    onConfirm?.();
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

  return (
    <FullScreenDialog style={styles.modalContainer}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Not all data was received for this session
          </Text>
          {/* <View style={commonStyles.sepparator} /> */}
          {renderDateText()}

          <View style={styles.item}>
            <Text style={styles.itemText}>
              It looks like The iPad and Edge were disconnected during the
              report generation.
            </Text>
          </View>
          <ConnectionButton disabled textColor={variables.black} />

          <View style={commonStyles.sepparator} />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonNew
            text="Do It Later"
            mode="secondary"
            onPress={() => props.onDismiss?.()}
          />
          <ButtonNew text="Retrieve Data" onPress={requestReportHandler} />
        </View>
      </Card>
    </FullScreenDialog>
  );
};

export default IncompleteDatasetAlert;

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
    width: isIpad ? variables.deviceWidth * 0.57 : variables.deviceWidth - 32
  },
  content: {
    alignItems: 'center',
    color: color.palette.darkGrey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    paddingHorizontal: isIpad ? 60 : 13,
    textAlign: 'center'
  },
  item: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 16
  },
  itemText: {
    fontFamily: variables.mainFont,
    fontSize: 16,
    textAlign: 'center'
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center'
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
