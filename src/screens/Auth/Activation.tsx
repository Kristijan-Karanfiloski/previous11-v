import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BannerWrapper from '../../components/BannerWrapper';
import Card from '../../components/common/Card';
import { Icon } from '../../components/icon/icon';
import API from '../../helpers/api';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectUserProfile } from '../../redux/slices/userProfileSlice';
import { useAppSelector } from '../../redux/store';
import { color } from '../../theme/color';
import { commonStyles } from '../../theme/commonStyles';
import { typography } from '../../theme/typography';
import { variables } from '../../utils/mixins';

interface ActivationProps {
  navigation: any;
}

const Activation = (props: ActivationProps) => {
  const navigation = useNavigation();
  const auth = useAppSelector(selectAuth);
  const userProfile = useAppSelector(selectUserProfile);
  const isClubSelected = useAppSelector(selectActiveClub);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (auth && userProfile && !isClubSelected) {
      setIsLoading(false);
      props.navigation.navigate('TeamChoose');
    }
  }, [auth, userProfile]);

  const demoLogIn = () => {
    props.navigation.navigate('Login', { demoLogIn: true });
  };

  return (
    <BannerWrapper
      demoBtn
      demoCallback={demoLogIn}
      navBtn="Already have an account?"
      navCallback={() => props.navigation.navigate('Login')}
      isLoading={isLoading}
    >
      <Card style={styles.cardContainer}>
        <View style={styles.container}>
          <View
            style={{
              height: variables.loginHeaderHeight,
              justifyContent: 'center'
            }}
          >
            <Text style={commonStyles.welcomeText}>Welcome!</Text>
          </View>

          <View style={commonStyles.line} />
          <Text style={styles.welcomeHint}>
            Please paste the activation code we have sent you in the welcome
            email to continue creating your profile.{' '}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              testID="emailField"
              style={styles.codeInput}
              placeholder="Activation code here"
              placeholderTextColor={color.palette.tipGrey}
              autoCapitalize="none"
              autoCorrect={false}
              value={code}
              onChangeText={setCode}
              accessibilityLabel={'text'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                // props.navigation.navigate('Register')
                if (!code) return alert('Please enter activation code');
                API.checkActivationCode(code)
                  .then((resp) => {
                    console.log('is active', resp.data);
                    if (resp.status === 200 && resp.data.result) {
                      props.navigation.navigate('Register', {
                        activation: {
                          ...resp.data.result,
                          activationCode: code
                        }
                      });
                    } else {
                      alert(resp.data.msg);
                    }
                  })
                  .catch(() => {
                    navigation.navigate('NetworkErrorModal', {
                      title: 'Unable to log in',
                      text: `Please ensure that your iPad is connected to a Wi-Fi or cellular network (4G/5G) to proceed with login.`
                    });
                  });
              }}
            >
              <View style={commonStyles.FOOTER_CONTENT}>
                <Text style={commonStyles.NEXT_LINK}>Create </Text>
                <Icon icon="next" style={{ fill: color.primary }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </BannerWrapper>
  );
};

export default Activation;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 65
  },
  cardContainer: {
    backgroundColor: color.palette.realWhite,
    borderRadius: 3,
    shadowOpacity: 0.1
  },
  codeInput: {
    borderColor: color.palette.lighterGrey,
    borderRadius: 4,
    borderWidth: 1,
    color: variables.textBlack,
    fontFamily: typography.fontRegular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20.42,
    paddingHorizontal: 12,
    paddingVertical: 13
  },
  container: {
    margin: 'auto',
    paddingBottom: 34,
    paddingLeft: 25,
    paddingRight: 25,
    width: variables.deviceWidth * 0.52
  },

  inputContainer: {
    flexDirection: 'column',
    marginTop: 74
  },
  welcomeHint: {
    color: color.palette.darkGrey,
    fontFamily: typography.fontRegular,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'left'
  }
});
