import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import bgSplash from '../../../assets/images/bg_corner_splash.png';
import ButtonNew from '../../../components/common/ButtonNew';
import { color } from '../../../theme';
import { variables } from '../../../utils/mixins';

interface ResetPasswordConfirmationProps {
  navigation: any;
}

const ResetPasswordConfirmation = ({
  navigation
}: ResetPasswordConfirmationProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={bgSplash}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: 150,
          width: 480
        }}
        resizeMode="cover"
      />
      <View style={styles.containerView}>
        <View style={{ height: 60 }} />
        <Text style={styles.introText}>Reset Password</Text>
        <Text style={styles.hintText}>
          We've sent you an Email. Please check your mail box and use the
          password we've sent you to log in.
        </Text>

        <ButtonNew
          text="Login →"
          onPress={() => navigation.navigate('Login')}
          style={styles.btnNext}
        />
        <ButtonNew
          text="Resend"
          onPress={() => {}}
          style={StyleSheet.flatten([styles.btnNext, { marginTop: 20 }])}
          mode="secondary"
        />
      </View>
    </View>
  );
};

export default ResetPasswordConfirmation;

const styles = StyleSheet.create({
  btnNext: {
    height: 44,
    marginTop: 130,
    width: '100%'
  },
  container: {
    flex: 1
  },
  containerView: {
    alignItems: 'center',
    flex: 1,

    marginTop: 102,
    paddingHorizontal: 41
  },
  hintText: {
    color: color.palette.lighterBlack,
    fontFamily: variables.mainFont,
    fontSize: 14,
    marginTop: 59,
    textAlign: 'center'
  },
  introText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginTop: 41
  }
});
