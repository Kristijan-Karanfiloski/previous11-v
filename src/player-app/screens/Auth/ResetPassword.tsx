import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import auth from '@react-native-firebase/auth';

import bgSplash from '../../../assets/images/bg_corner_splash.png';
import ButtonNew from '../../../components/common/ButtonNew';
import { color } from '../../../theme';
import { validateEmail } from '../../../utils';
import { variables } from '../../../utils/mixins';

interface ResetPasswordProps {
  navigation: any;
  route: any;
}

const ResetPassword = ({ navigation, route }: ResetPasswordProps) => {
  const [email, setEmail] = useState(
    route?.params?.email && validateEmail(route?.params?.email)
      ? route?.params?.email
      : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendResetPasswordEmail = async () => {
    setIsLoading(true);
    try {
      await auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          console.log('Password reset email sent!');

          setSent(true);
        })
        .catch((error) => {
          console.log(error.message);
          Alert.alert(error.message);
        });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  const text = sent
    ? 'We’ve sent you an email. Please check your mail box and use the link we have sent you to reset your password.'
    : 'Please enter your email, and we will send you a link to reset your password.';

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
        <Text style={styles.hintText}>{text}</Text>

        <View style={styles.inputContainer}>
          {!sent && (
            <TextInput
              style={styles.codeInput}
              placeholder="Email"
              placeholderTextColor={color.palette.tipGrey}
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          )}
        </View>

        <ButtonNew
          text={sent ? 'Login →' : 'Send →'}
          onPress={sent ? goToLogin : sendResetPasswordEmail}
          style={styles.btnNext}
          disabled={email.length === 0 || !validateEmail(email) || isLoading}
          isLoading={isLoading}
        />
        {sent && (
          <ButtonNew
            mode="secondary"
            text="Resend"
            onPress={sendResetPasswordEmail}
            style={StyleSheet.flatten([styles.btnNext, { marginTop: 20 }])}
            disabled={email.length === 0 || !validateEmail(email) || isLoading}
            isLoading={isLoading}
          />
        )}

        <ButtonNew
          mode="secondary"
          text="Go back"
          onPress={navigation.goBack}
          style={styles.btnSwitch}
          textStyle={{
            fontSize: 14,
            fontFamily: variables.mainFontBold
          }}
        />
      </View>
    </View>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  btnNext: {
    height: 44,
    marginTop: 50,
    width: '100%'
  },
  btnSwitch: {
    borderWidth: 0,
    marginTop: 38,
    width: '100%'
  },
  codeInput: {
    borderColor: color.palette.lighterGrey,
    borderRadius: 4,
    borderWidth: 1,
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 13
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
  inputContainer: {
    flexDirection: 'column',
    height: 45,
    marginTop: 47,
    width: '100%'
  },
  introText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginTop: 41
  }
});
