import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import { palette } from '../../../theme';
import { OnboardingStackParamList, OnboardingSteps } from '../../../types';
import { ONBOARDING_STEPS, variables } from '../../../utils/mixins';
import BackgroundImageLanding from '../../BackgroundImageLanding';
import { Icon } from '../../icon/icon';
import OnboardingProgressCircle from '../common/OnboardingProgressCircle';
import OnboardingStepItem from '../common/OnboardingStepItem';

enum RecurringEventStatus {
  skipped = 'skipped',
  finished = 'finished'
}

const StepOnboarding = () => {
  const navigation = useNavigation();
  const allGames = useAppSelector(selectAllGames);
  const route = useRoute() as RouteProp<
    OnboardingStackParamList,
    'OnboardingSteps'
  >;

  const [steps, setSteps] = useState<OnboardingSteps>([
    {
      id: 1,
      text: ONBOARDING_STEPS.activate,
      isFinished: true,
      isNext: false
    },
    {
      id: 2,
      text: ONBOARDING_STEPS.recurring,
      isFinished: allGames.length > 0,
      isNext: !(allGames.length > 0)
    },
    {
      id: 3,
      text: ONBOARDING_STEPS.players,
      isFinished: false,
      isNext: allGames.length > 0
    }
  ]);

  const [percentage, setPercentage] = useState(33);

  useEffect(() => {
    if (route.params.recurringEvent === RecurringEventStatus.skipped) {
      handleEndRecurringEvents();
    }
    if (route.params.recurringEvent === RecurringEventStatus.finished) {
      handleEndRecurringEvents();
    }
  }, [route.params.recurringEvent]);

  const handleEndRecurringEvents = () => {
    const copy = [...steps];
    copy[1].isFinished = true;
    copy[1].isNext = false;
    copy[2].isNext = true;
    setSteps(copy);
    setPercentage(66);
  };

  const handleNextStep = () => {
    const nextStep = steps.find((step) => step.isNext);
    if (nextStep) {
      switch (nextStep.id) {
        case 2:
          return navigation.navigate('OnboardingEvents');
        case 3:
          return navigation.navigate('OnboardInvitePlayers');
      }
    }
  };

  const handleGoBack = () => {
    navigation.navigate('OnboardingInfo');
  };

  return (
    <View style={styles.container}>
      <BackgroundImageLanding bgImage="onboarding" noRedLines />
      <View style={styles.mainContainer}>
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
          <Text style={styles.boxHeading}>Your setup progress</Text>
          <Text style={styles.boxSubHeading}>
            By setting up all of these initial steps you’ll supercharge your
            team and have tracking data available fast.
          </Text>
          <View style={styles.spacerTop} />
          <View>
            {steps.map((step) => {
              return <OnboardingStepItem key={step.id} step={step} />;
            })}
          </View>
          <View style={styles.spacerTop} />
          <TouchableOpacity style={{ width: 130 }} onPress={handleNextStep}>
            <OnboardingProgressCircle percentage={percentage} />
            <Text style={styles.nextStep}>Next Step</Text>
          </TouchableOpacity>
          <View style={styles.onboardBackButton}>
            <TouchableOpacity
              onPress={handleGoBack}
              style={styles.onboardBackButton}
            >
              <Icon icon="arrow_left" />
              <Text>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StepOnboarding;

const styles = StyleSheet.create({
  boxContainer: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    height: '65%',
    padding: 50,
    width: '60%'
  },
  boxHeading: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 5
  },
  boxSubHeading: {
    color: variables.placeHolderGrey,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  container: {
    alignItems: 'center',
    backgroundColor: variables.white,
    flex: 1
  },
  mainContainer: {
    alignItems: 'center',
    width: '100%'
  },
  nextStep: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center'
  },
  onboardBackButton: {
    alignItems: 'center',
    bottom: '8%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: '8%',
    position: 'absolute',
    width: 50
  },
  spacerTop: { marginTop: 20 },
  subTitle: {
    color: palette.realWhite,
    fontFamily: variables.mainFont,
    fontSize: 16,
    lineHeight: 17,
    marginBottom: 67,
    textAlign: 'center',
    width: 294
  }
});
