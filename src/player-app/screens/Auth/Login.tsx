import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import LogRocket from '@logrocket/react-native';
import _ from 'lodash';

import logoBlack from '../../../../assets/images/logo_black.png';
import bgSplash from '../../../assets/images/bg_corner_splash.png';
import ButtonNew from '../../../components/common/ButtonNew';
import OverlayLoader from '../../../components/common/OverlayLoader';
import { authFirestoreProps } from '../../../converters';
import API from '../../../helpers/api';
import { loginUser } from '../../../helpers/firestoreService';
import { authUser, selectAuth } from '../../../redux/slices/authSlice';
import {
  getClubsAction,
  selectClubs,
  setActiveClub
} from '../../../redux/slices/clubsSlice';
import {
  getUserProfileAction,
  selectUserProfile
} from '../../../redux/slices/userProfileSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store-player';
import { color } from '../../../theme';
import { validateEmail } from '../../../utils';
import { variables } from '../../../utils/mixins';
interface LoginProps {
  navigation: any;
  route: any;
}

const Login = ({ navigation, route }: LoginProps) => {
  const auth = useAppSelector(selectAuth);
  const userProfile = useAppSelector(selectUserProfile);
  const clubs = useAppSelector(selectClubs);
  const [email, setEmail] = useState(route?.params?.email || '');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth && !userProfile) {
      dispatch(getUserProfileAction());
      dispatch(getClubsAction());
    }
    if (userProfile) {
      setIsLoading(false);
    }
  }, [auth, userProfile]);

  useEffect(() => {
    if (clubs) {
      const activeClub = clubs.find((club) => club.name === auth.teamName);
      if (activeClub) {
        API.bucketCustomerEvent({
          companyId: `${auth.customerName}/club/${activeClub.name}`,
          userId: auth.email,
          attributes: {
            email: auth.email,
            type: auth.userType
          }
        })
          .then((resp) => console.log('customer', resp.data))
          .catch((err) => console.log('customer err', err));
        dispatch(setActiveClub(activeClub));
      }
    }
  }, [clubs]);

  const onSubmit = () => {
    if (_.isEmpty(email) || _.isEmpty(password)) {
      Alert.alert('Please enter your email and password');
    } else if (!validateEmail(email)) {
      Alert.alert('Please enter a valid email');
    } else {
      setIsLoading(true);
      loginUser(email, password)
        .then(async (authData: authFirestoreProps) => {
          console.log('authData', authData);

          if (authData) {
            const isPlayerActive = await API.checkActivation(
              authData.email,
              'player'
            )
              .then((resp) => {
                return resp.data.result.activated;
              })
              .catch(() => false);

            if (!isPlayerActive) {
              return Alert.alert(
                'Your email or password is incorrect',
                "Please try again or reset your password by clicking on 'forgot password’"
              );
            }
            console.log('isPlayerActive', isPlayerActive);
            await API.bucketUserEvent({
              userId: authData.email
            });
            if (!__DEV__) {
              LogRocket.identify(authData?.id, {
                name: authData.customerName,
                email: authData.email,
                // Add your own custom user variables here, ie:
                type: authData.userType || 'player',
                playerId: authData.playerId || ''
                // subscriptionType: 'pro'
              });
            }

            dispatch(authUser(authData));
          }
        })
        .catch((err) => {
          console.log('err', err);
          Alert.alert('Invalid email or password');
        })
        .finally(() => setIsLoading(false));
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
        <Text testID="LoginScreenWelcomeText" style={styles.introText}>
          Welcome!
        </Text>
        <Text style={styles.hintText}>
          Enter your email and password to log in and see your performance.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Email"
            placeholderTextColor={color.palette.tipGrey}
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
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
          <TouchableOpacity
            onPress={() => navigation.navigate('ResetPassword', { email })}
          >
            <Text style={styles.forgotPwd}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 50,
            gap: 18,
            width: '100%'
          }}
        >
          <ButtonNew
            text="Login →"
            onPress={onSubmit}
            style={styles.btnNext}
            disabled={email.length === 0 || !validateEmail(email)}
          />

          {/* <ButtonNew
            text="Login with Face/Touch ID"
            onPress={() => {}}
            style={styles.btnNext}
            mode="secondary"
            disabled
          /> */}
        </View>

        <ButtonNew
          mode="secondary"
          text="Go to Activation Page"
          onPress={() => navigation.navigate('Activation')}
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

export default Login;

const styles = StyleSheet.create({
  btnNext: {
    height: 44,
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
  forgotPwd: {
    color: color.palette.black2,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    textAlign: 'right'
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
    gap: 8,
    marginTop: 47,
    width: '100%'
  },
  introText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginTop: 41
  }
});
