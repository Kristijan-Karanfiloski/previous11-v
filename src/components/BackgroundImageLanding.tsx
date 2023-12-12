import * as React from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';

import bgSplash from '../assets/images/bg_splash.png';

import { RedLine } from './common/RedLine';

const IMAGE_URI = {
  onboarding: require('../assets/images/onboarding_bg.png'),
  choose_team: require('../assets/images/choose_team_bg.png'),
  recurring_training: require('../assets/images/recurring_training_bg.png'),
  onboarding_stadium: require('../assets/images/onboarding_stadium.png')
};
interface BackgroundImageLandingProps {
  bgImage?:
    | 'onboarding'
    | 'choose_team'
    | 'recurring_training'
    | 'onboarding_stadium';
  noRedLines?: boolean;
}

const BackgroundImageLanding = (props: BackgroundImageLandingProps) => {
  const { bgImage = 'onboarding', noRedLines = false } = props;

  return (
    <ImageBackground
      defaultSource={IMAGE_URI[bgImage]}
      style={StyleSheet.absoluteFill}
      resizeMode="cover"
    >
      {!noRedLines && <RedLine style={{ zIndex: 999, height: 9 }} />}

      {!noRedLines && <RedLine style={{ zIndex: 999, bottom: 0, height: 9 }} />}
      <Image
        source={bgSplash}
        resizeMode="cover"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0
        }}
      />
    </ImageBackground>
  );
};

export default BackgroundImageLanding;
