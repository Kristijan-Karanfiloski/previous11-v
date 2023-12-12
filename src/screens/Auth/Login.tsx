import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import LogRocket from '@logrocket/react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import BannerWrapper from '../../components/BannerWrapper';
import Card from '../../components/common/Card';
import { Icon } from '../../components/icon/icon';
import { authFirestoreProps } from '../../converters';
import API from '../../helpers/api';
import { loginUser } from '../../helpers/firestoreService';
import { authUser, selectAuth } from '../../redux/slices/authSlice';
import {
  getUserProfileAction,
  selectUserProfile
} from '../../redux/slices/userProfileSlice';
import { useAppDispatch } from '../../redux/store';
import { color } from '../../theme/color';
import { commonStyles } from '../../theme/commonStyles';
import { typography } from '../../theme/typography';
import { validateEmail } from '../../utils';
import { variables } from '../../utils/mixins';

interface LoginProps {
  navigation: any;
  route: any;
}

const Login = (props: LoginProps) => {
  const { route } = props;
  const isDemoLogIn = route?.params?.demoLogIn || false;

  const getEmailValue = () => {
    if (isDemoLogIn) {
      return 'hello+demoaccount@next11.com';
    } else {
      return route?.params?.email || '';
    }
  };

  const getPasswordValue = () => {
    if (isDemoLogIn) {
      return 'Next11Demo';
    } else {
      return '';
    }
  };

  const auth = useSelector(selectAuth);
  const userProfile = useSelector(selectUserProfile);
  const [email, setEmail] = useState(getEmailValue());
  const [password, setPassword] = useState(getPasswordValue());
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [netInfo, setNetInfo] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetInfo(
        (state.isConnected ?? false) && (state.isInternetReachable ?? false)
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (auth && !userProfile) {
      dispatch(getUserProfileAction());
    }
    if (userProfile) {
      setIsLoading(false);
    }
  }, [auth, userProfile]);

  useEffect(() => {
    if (isDemoLogIn) {
      setTimeout(() => {
        return onSubmit();
      }, 300);
    }
  }, [isDemoLogIn]);

  const onSubmit = () => {
    if (_.isEmpty(email) || _.isEmpty(password)) {
      alert('Please enter your email and password');
    } else if (!validateEmail(email)) {
      alert('Please enter a valid email');
    } else if (!netInfo) {
      return navigation.navigate('NetworkErrorModal', {
        title: 'Unable to log in',
        text: `Please ensure that your iPad is connected to a Wi-Fi or cellular network (4G/5G) to proceed with login.`
      });
    } else {
      setIsLoading(true);
      loginUser(email, password).then(async (authData: authFirestoreProps) => {
        if (!authData?.id) {
          setIsLoading(false);
          setLoginError(true);
        }
        if (authData?.id) {
          const isCoachActive = await API.checkActivation(authData.email)
            .then((resp) => {
              return resp.data.result.activated;
            })
            .catch(() => false);

          if (!isCoachActive) {
            setIsLoading(false);
            return alert('Your account is not valid coach account.');
          }
          await API.bucketUserEvent({
            userId: authData.email
          });
          if (!__DEV__) {
            LogRocket.identify(authData?.id, {
              name: authData.customerName,
              email: authData.email,

              // Add your own custom user variables here, ie:
              type: authData.userType || 'coach'
              // subscriptionType: 'pro'
            });
          }

          console.log('isCoachActive', isCoachActive);
          dispatch(authUser(authData));
        }
      });
    }
  };

  return (
    <BannerWrapper
      navBtn="Go to Activation Page"
      navCallback={() => props.navigation.navigate('Activation')}
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
            Enter your email and password to log in and see your performance.
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.codeInput, { marginTop: 44 }]}
              placeholder="Email"
              placeholderTextColor={variables.placeHolderGrey}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.codeInput, { marginTop: 12 }]}
              placeholder="Password"
              placeholderTextColor={variables.placeHolderGrey}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            {loginError && (
              <View style={styles.marginTop}>
                <Text style={styles.errorText}>
                  The username or password your entered is incorrect.
                </Text>
              </View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('ResetPassword', { email })
              }
            >
              <View style={commonStyles.FOOTER_CONTENT}>
                <Text style={commonStyles.NEXT_LINK}>
                  Forgot your password?
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={_.debounce(onSubmit, 300)}>
              <View style={commonStyles.FOOTER_CONTENT}>
                <Text style={commonStyles.NEXT_LINK}>Log in </Text>
                <Icon icon="next" style={{ fill: color.primary }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </BannerWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50
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
  errorText: {
    color: color.primary,
    fontFamily: typography.fontLight,
    fontSize: 14,
    lineHeight: 20
  },
  inputContainer: {
    flexDirection: 'column'
  },
  marginTop: { marginTop: 10 },
  welcomeHint: {
    color: color.palette.darkGrey,
    fontFamily: typography.fontRegular,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'left'
  }
});
