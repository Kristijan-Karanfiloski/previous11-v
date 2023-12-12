import React from 'react';
import { StyleSheet, View } from 'react-native';

import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import PlayersInfo from '../../../screens/Settings/PlayersInfo';
import { ONBOARDING_NAVIGATOR_TEXTS } from '../../../utils/mixins';
import BackgroundImageLanding from '../../BackgroundImageLanding';
import OnboardingNavigator from '../common/OnboardingNavigator';

const OnboardInvitePlayers = () => {
  const pageRef = React.useRef<{ toggleModal:() => void } | null>(null);
  const players = useAppSelector(selectAllPlayers);

  const getText = () => {
    switch (players.length) {
      case 0:
        return ONBOARDING_NAVIGATOR_TEXTS.INVITE_PLAYERS_FIRST_PLAYER;
      case 1:
        return ONBOARDING_NAVIGATOR_TEXTS.INVITE_PLAYERS_SECOND_PLAYER;
      default:
        return ONBOARDING_NAVIGATOR_TEXTS.INVITE_PLAYERS_LAST_TEXT;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <BackgroundImageLanding bgImage="onboarding_stadium" />
      <View style={styles.playersInfoContainer}>
        <PlayersInfo ref={pageRef} onboardingEditPlayer />
      </View>
      <OnboardingNavigator
        text={getText()}
        hasFinishButton
        activeBubble={players.length === 0 ? 1 : 2}
        showAddPlayerModal={() => pageRef.current?.toggleModal()}
      />
    </View>
  );
};

export default OnboardInvitePlayers;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%'
  },
  playersInfoContainer: {
    height: '77%'
  }
});
