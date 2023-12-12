import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import BannerWrapper from '../../components/BannerWrapper';
import Card from '../../components/common/Card';
import { Icon } from '../../components/icon/icon';
import { color } from '../../theme/color';
import { commonStyles } from '../../theme/commonStyles';
import { typography } from '../../theme/typography';
import { DrawerStackParamList } from '../../types';
import { validateEmail } from '../../utils';
import { variables } from '../../utils/mixins';

interface ResetPasswordProps {
  navigation: any;
}

const ResetPassword = (props: ResetPasswordProps) => {
  const route = useRoute() as RouteProp<DrawerStackParamList, 'ResetPassword'>;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState(
    route?.params?.email && validateEmail(route?.params?.email)
      ? route?.params?.email
      : ''
  );

  const sendResetPasswordEmail = async () => {
    setIsLoading(true);
    try {
      await auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          setSent(true);
        })
        .catch((error) => {
          Alert.alert(error.message);
        });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const goToLogin = () => {
    navigation.goBack();
  };

  return (
    <BannerWrapper
      navBtn="Go back"
      navCallback={() => props.navigation.goBack()}
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
            <Text style={commonStyles.welcomeText}>
              {route?.params?.title ? route.params.title : 'Welcome!'}
            </Text>
          </View>
          <View style={commonStyles.line} />
          <Text style={styles.welcomeHint}>
            {sent
              ? 'We’ve sent you an Email. Please check your mailbox and use the link to reset your password.'
              : 'Please enter your email and we will send you a link to reset your password.'}
          </Text>
          {!sent && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.codeInput, { marginTop: 44 }]}
                placeholder="Email"
                placeholderTextColor={variables.placeHolderGrey}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={sent ? goToLogin : sendResetPasswordEmail}
            >
              <View style={commonStyles.FOOTER_CONTENT}>
                <Text style={commonStyles.NEXT_LINK}>
                  {sent ? 'Log in' : 'Send'}{' '}
                </Text>
                <Icon icon="next" style={{ fill: color.primary }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </BannerWrapper>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 36,
    marginRight: 23,
    marginTop: 117,
    width: '100%'
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
    flexDirection: 'column'
  },
  welcomeHint: {
    color: color.palette.darkGrey,
    fontFamily: typography.fontRegular,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'left'
  }
});
