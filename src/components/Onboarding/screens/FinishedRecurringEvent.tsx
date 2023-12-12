import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { palette } from '../../../theme';
import { variables } from '../../../utils/mixins';
import BackgroundImageLanding from '../../BackgroundImageLanding';
import { Icon } from '../../icon/icon';
import OnboardingProgressCircle from '../common/OnboardingProgressCircle';

const FinishedRecurringEvent = () => {
  const navigation = useNavigation();

  const handleNextStep = () => {
    navigation.navigate('OnboardingSteps', { recurringEvent: 'finished' });
  };

  return (
    <View style={styles.mainContainer}>
      <BackgroundImageLanding bgImage="recurring_training" />
      <View style={styles.container}>
        <Icon
          icon="logo"
          style={{
            width: 180,
            height: 180
          }}
        />
        <Text style={styles.subTitle}>
          Welcome to the universe of Next11. Empower your team through data.
        </Text>
        <View style={styles.boxContainer}>
          <View style={styles.marginTop50}>
            <Icon
              icon="circle_checkmark"
              style={{ color: 'black', width: 20 }}
            />
          </View>
          <View style={[styles.marginTop50, styles.textWidth]}>
            <Text style={[styles.centerText, styles.mainText]}>
              Success! You've now set up your Recurring Training sessions
            </Text>
          </View>
          <View style={[styles.marginTop20, styles.textWidth]}>
            <Text style={[styles.centerText, styles.subText]}>
              You can always change it or add new events in the Calendar
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.navBubbleContainer}>
              <View style={styles.navBubble} />
              <View style={styles.navBubble} />
              <View style={[styles.navBubble, styles.activeNavBubble]} />
            </View>
            <View style={styles.circleContainer}>
              <TouchableOpacity onPress={handleNextStep}>
                <OnboardingProgressCircle percentage={20} checkmark />
                <Text style={styles.nextStep}>3/3</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FinishedRecurringEvent;

const styles = StyleSheet.create({
  activeNavBubble: {
    backgroundColor: '#686868',
    height: 10,
    width: 23
  },
  bottomContainer: {
    alignItems: 'center',
    bottom: '10%',
    position: 'absolute'
  },
  boxContainer: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    height: '65%',
    paddingHorizontal: 50,
    paddingVertical: 60,
    width: '60%'
  },
  centerText: {
    textAlign: 'center'
  },
  circleContainer: {
    marginTop: 20
  },
  container: {
    alignItems: 'center',
    width: '100%'
  },
  mainContainer: {
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 6
  },
  mainText: {
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    letterSpacing: 0.2
  },
  marginTop20: {
    marginTop: 20
  },
  marginTop50: {
    marginTop: 50
  },
  navBubble: {
    backgroundColor: '#9899A0',
    borderRadius: 10,
    height: 10,
    marginRight: 10,
    width: 10
  },
  navBubbleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    marginLeft: 12,
    marginTop: 10,
    width: 100
  },
  nextStep: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center'
  },
  subText: {
    color: variables.placeHolderGrey,
    fontSize: 14
  },
  subTitle: {
    color: palette.realWhite,
    fontFamily: variables.mainFont,
    fontSize: 16,
    lineHeight: 17,
    marginBottom: 67,
    textAlign: 'center',
    width: 294
  },
  textWidth: {
    width: '70%'
  }
});
