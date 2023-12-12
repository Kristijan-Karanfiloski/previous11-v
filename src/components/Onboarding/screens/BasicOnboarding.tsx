import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ONBOARDING_NAVIGATOR_TEXTS, variables } from '../../../utils/mixins';
import BackgroundImageLanding from '../../BackgroundImageLanding';
import OnboardingBaseSettings from '../common/OnboardingBaseSettings';
import OnboardingNavigator from '../common/OnboardingNavigator';

const BasicOnboarding = () => {
  return (
    <View style={styles.container}>
      <BackgroundImageLanding bgImage="choose_team" />
      <OnboardingBaseSettings />
      <OnboardingNavigator text={ONBOARDING_NAVIGATOR_TEXTS.BASIC_ONBOARDING} />
    </View>
  );
};

export default BasicOnboarding;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: variables.white,
    flex: 1
  }
});
