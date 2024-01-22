import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import logoBlack from '../../../../assets/images/logo_black.png';
import bgSplash from '../../../assets/images/bg_corner_splash.png';
import ButtonNew from '../../../components/common/ButtonNew';
import OverlayLoader from '../../../components/common/OverlayLoader';
import API from '../../../helpers/api';
import { color } from '../../../theme';
import { variables } from '../../../utils/mixins';
interface ActivationProps {
  navigation: any;
}

const Activation = ({ navigation }: ActivationProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);
    API.checkPlayerActivationCode(code)
      .then((resp) => {
        console.log('is active', resp.data);

        if (resp.status === 200 && resp.data.result) {
          navigation.navigate('CreateProfile', {
            activation: { ...resp.data.result, activationCode: code }
          });
        } else {
          Alert.alert(resp.data.msg);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
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
          testID="logo-img"
        />
        <Text style={styles.introText}>Welcome!</Text>
        <Text style={styles.hintText}>
          You should have recieved an invitation email from Next11. Please enter
          the activation code that you find in the email.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Activation code here"
            placeholderTextColor={color.palette.tipGrey}
            autoCapitalize="none"
            autoCorrect={false}
            value={code}
            onChangeText={setCode}
          />
        </View>

        <ButtonNew
          text="Next →"
          onPress={onSubmit}
          style={styles.btnNext}
          disabled={code.length === 0}
        />

        <ButtonNew
          testID="HaveAccountBtn"
          mode="secondary"
          text="Already have an account?"
          onPress={() => navigation.navigate('Login')}
          style={styles.btnSwitch}
          textStyle={{
            fontSize: 14,
            fontFamily: variables.mainFontBold
          }}
        />
      </View>

      <OverlayLoader isLoading={isLoading} />
    </View>
  );
};

export default Activation;

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
    marginTop: 47,
    width: '100%'
  },
  introText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginTop: 41
  }
});
