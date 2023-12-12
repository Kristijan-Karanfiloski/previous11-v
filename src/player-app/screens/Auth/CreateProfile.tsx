import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import logoBlack from '../../../../assets/images/logo_black.png';
import bgSplash from '../../../assets/images/bg_corner_splash.png';
import ButtonNew from '../../../components/common/ButtonNew';
import OverlayLoader from '../../../components/common/OverlayLoader';
import API from '../../../helpers/api';
import { color } from '../../../theme';
import { validatePassword } from '../../../utils';
import { variables } from '../../../utils/mixins';

interface CreateProfileProps {
  navigation: any;
  route: any;
}

const CreateProfile = ({ navigation, route }: CreateProfileProps) => {
  const { firstName, email } = route.params.activation;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!validatePassword(password)) {
      Alert.alert(
        'Please use 8 or more characters with a mix of letters and numbers for the password'
      );
    } else if (password !== confirmPassword) {
      Alert.alert('Password and Confirm password does not match');
    } else {
      setIsLoading(true);

      API.activateUser(route.params.activation.activationCode, {
        firstName,
        email,
        password
      })
        .then(() => {
          setIsLoading(false);
          navigation.navigate('Login', { email });
        })
        .catch((err) => {
          setIsLoading(false);
          alert(err);
        });
    }
  };

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
        <Image
          source={logoBlack}
          style={{ width: 60, height: 60 }}
          resizeMode="cover"
        />
        <Text style={styles.introText}>Welcome, {firstName}!</Text>
        <Text style={styles.hintText}>
          We are almost there, just set your password to create your profile.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Password"
            placeholderTextColor={color.palette.tipGrey}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.codeInput}
            placeholder="Confirm Password"
            placeholderTextColor={color.palette.tipGrey}
            autoCapitalize="none"
            autoCorrect={false}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <Text style={styles.infoText}>
          Use 8 or more characters with a mix of letters and numbers
        </Text>
        <ButtonNew
          text="Agree and Create Profle →"
          onPress={onSubmit}
          style={styles.btnNext}
          disabled={!(password.length >= 8) || !(confirmPassword.length >= 8)}
        />
        <Text style={styles.bottomTip}>
          By creating a profile you are agreeing to our{' '}
          <Text
            style={styles.link}
            onPress={() => {
              // navigation.navigate('WebView');
            }}
          >
            Terms of Service
          </Text>
        </Text>
        <Text style={styles.bottomTip}>
          View our{' '}
          <Text
            style={styles.link}
            onPress={() => {
              // store.goTo('WebView', {
              //   title: 'Privacy Policy',
              //   url: 'https://next11.com/help/privacy-policy'
              // });
            }}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
      <OverlayLoader isLoading={isLoading} />
    </View>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  bottomTip: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 10
  },
  btnNext: {
    height: 44,
    marginBottom: 15,
    marginTop: 50,
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
  infoText: {
    color: color.palette.lighterBlack,
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    marginTop: 6,
    width: '100%'
  },
  inputContainer: {
    flexDirection: 'column',
    marginTop: 47,
    rowGap: 16,
    width: '100%'
  },
  introText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginTop: 41
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  }
});
