import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Icon } from '../../../components/icon/icon';
import LinearGradientView from '../../../components/LinearGradientView';
import { selectLastFinishedMatch } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import { gradientColorsMatch, variables } from '../../../utils/mixins';

const LatestInfo = () => {
  const game = useAppSelector(selectLastFinishedMatch);
  const navigation = useNavigation();

  const navigate = () => {
    if (!game) return;
    navigation.navigate('Report', { eventId: game.id });
  };

  const renderData = () => {
    if (!game) {
      return <Text style={styles.subText}>No recorded matches.</Text>;
    }

    return (
      <TouchableOpacity style={styles.infoContainer} onPress={navigate}>
        <LinearGradientView
          colors={gradientColorsMatch}
          linearGradient={{ y2: '100%' }}
          style={styles.gradientContainer}
        />
        <View style={styles.specificWidth}>
          <Text style={styles.subHeadingText}>{game.versus}</Text>
          <Text style={styles.subText}>
            {game?.status?.scoreThem}-{game?.status?.scoreUs}
          </Text>
        </View>
        <Text style={styles.dataText}>
          {Math.round(
            game?.report?.stats?.team?.fullSession?.playerLoad?.total || 0
          ) || '-'}
        </Text>
        <Icon icon="arrow_next" style={styles.nextIcon} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.matchesContentContainer}>
      <Text style={[styles.headingText, styles.extraMarginBottom]}>Latest</Text>
      {renderData()}
    </View>
  );
};

export default LatestInfo;

const styles = StyleSheet.create({
  dataText: {
    fontFamily: variables.mainFont,
    fontSize: 20,
    marginLeft: 10,
    width: 40
  },
  extraMarginBottom: {
    marginBottom: 20
  },
  gradientContainer: {
    borderRadius: 15,
    height: 30,
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
    marginBottom: 10
  },
  matchesContentContainer: {
    padding: 30
  },
  nextIcon: {
    color: variables.lighterBlack,
    height: 15,
    marginLeft: 5,
    width: 15
  },
  specificWidth: {
    width: 90
  },
  subHeadingText: {
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  subText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 11
  }
});
