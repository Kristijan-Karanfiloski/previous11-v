import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import LinearGradientView from '../../../components/LinearGradientView';
import { selectLastFinishedTraining } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import {
  gradientColorsTraining,
  utils,
  variables
} from '../../../utils/mixins';

const LatestTrainingInfo = () => {
  const lastTraining = useAppSelector(selectLastFinishedTraining);

  const navigation = useNavigation();

  const navigate = () => {
    if (!lastTraining) return;
    navigation.navigate('Report', { eventId: lastTraining.id });
  };

  const renderData = () => {
    if (!lastTraining) {
      return <Text style={styles.subText}>No recorded trainings.</Text>;
    }
    const text = utils.getEventDescription(lastTraining);

    const { date, dateFormat } = utils.checkAndFormatUtcDate(
      lastTraining.UTCdate,
      lastTraining.date,
      lastTraining.startTime
    );

    const explositeStat =
      lastTraining?.report?.stats.team?.fullSession?.intensityZones?.explosive;
    const veryHighStat =
      lastTraining?.report?.stats.team?.fullSession?.intensityZones?.veryHigh;

    const explosiveMiliseconds = explositeStat ? explositeStat * 1000 : 0;
    const veryHighMiliseconds = veryHighStat ? veryHighStat * 1000 : 0;

    const {
      seconds: explosiveSeconds,
      minutes: explosiveMinutes,
      hours: explosiveHours
    } = utils.convertTimestampToTime(explosiveMiliseconds);
    const {
      seconds: veryHighSeconds,
      minutes: veryHighMinutes,
      hours: veryHighHours
    } = utils.convertTimestampToTime(veryHighMiliseconds);

    const getExplosiveTime = () => {
      let time = '';
      if (explosiveSeconds) {
        time = `${explosiveSeconds}s`;
      }
      if (explosiveMinutes) {
        time = `${explosiveMinutes}m ` + time;
      }
      if (explosiveHours) {
        time = `${explosiveHours}h ` + time;
      }
      return time;
    };

    const getVeryHighTime = () => {
      let time = '';
      if (veryHighSeconds) {
        time = `${veryHighSeconds}s`;
      }
      if (veryHighMinutes) {
        time = `${veryHighMinutes}m ` + time;
      }
      if (veryHighHours) {
        time = `${veryHighHours}h ` + time;
      }
      return time;
    };

    return (
      <Pressable onPress={navigate} style={styles.infoContainer}>
        <View style={styles.leftInfoContainer}>
          <LinearGradientView
            colors={gradientColorsTraining}
            linearGradient={{ y2: '100%' }}
            style={styles.gradientContainer}
          />
          <View>
            <Text style={styles.subHeadingText}>{text.description}</Text>
            <Text style={styles.subText}>
              {moment(date, dateFormat).format('DD ddd, MM ')} at{' '}
              {moment(date, dateFormat).format('HH:mm')}
            </Text>
            <Text style={styles.subText}>
              {Object.keys(lastTraining.report?.stats?.players || {}).length}{' '}
              players |{' '}
              {Math.ceil(
                (utils.getEventDuration(lastTraining) || 1) / 1000 / 60
              )}{' '}
              min
            </Text>
          </View>
        </View>
        <View>
          <Text style={styles.dataText}>
            {Math.round(
              lastTraining?.report?.stats?.team?.fullSession?.playerLoad
                ?.total || 0
            ) || '-'}
          </Text>
        </View>
        <View style={styles.flexCenterCenter}>
          <Text style={styles.subTextMedium}>Explosive</Text>
          <Text style={styles.subTextLarge}>{getExplosiveTime()}</Text>
        </View>
        <View style={styles.flexCenterCenter}>
          <Text style={styles.subTextMedium}>Very High</Text>
          <Text style={styles.subTextLarge}>{getVeryHighTime()}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>Latest Training</Text>
      {renderData()}
    </View>
  );
};

export default LatestTrainingInfo;

const styles = StyleSheet.create({
  dataText: {
    fontFamily: variables.mainFont,
    fontSize: 32
  },
  flexCenterCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradientContainer: {
    borderRadius: 15,
    height: 50,
    marginRight: 15,
    width: 7
  },
  headingText: {
    fontFamily: variables.mainFont,
    fontSize: 24,
    marginBottom: 5
  },
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  leftInfoContainer: {
    flexDirection: 'row'
  },
  mainContainer: {
    padding: 25
  },
  subHeadingText: {
    fontFamily: variables.mainFontBold,
    fontSize: 15
  },
  subText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 11
  },
  subTextLarge: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 18
  },
  subTextMedium: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 14
  }
});
