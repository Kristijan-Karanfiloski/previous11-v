import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import _ from 'lodash';

import BannerWrapper from '../../components/BannerWrapper';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { Icon } from '../../components/icon/icon';
import API from '../../helpers/api';
import { color, commonStyles } from '../../theme/';
import { variables } from '../../utils/mixins';
interface RegisterProps {
  navigation: any;
  route: any;
}

const Register = (props: RegisterProps) => {
  const { route } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clearPwd, setClearPwd] = useState(false);

  useEffect(() => {
    if (route.params && route.params.activation) {
      const { firstName = '', lastName = '', email } = route.params.activation;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
    }
  }, [route.params]);

  const onSubmit = () => {
    if (_.isEmpty(firstName) || _.isEmpty(lastName)) {
      alert('Please enter your first and last name');
    } else if (_.isEmpty(email)) {
      alert('Please enter your email');
    } else if (_.isEmpty(password)) {
      alert('Please enter your password');
    } else if (_.isEmpty(confirmPassword)) {
      alert('Please confirm your password');
    } else if (password !== confirmPassword) {
      alert('Password does not match');
    } else {
      setIsLoading(true);
      API.activateUser(route.params.activation.activationCode, {
        firstName,
        lastName,
        email,
        password
      })
        .then(() => {
          setIsLoading(false);
          props.navigation.navigate('Login', { email });
        })
        .catch((err) => {
          setIsLoading(false);
          alert(err);
        });
    }
  };

  return (
    <BannerWrapper isLoading={isLoading}>
      <Card style={styles.cardContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.titleText}>
              Hello, {firstName} {lastName}
            </Text>
          </View>
          <View style={styles.Line} />
          <Text style={styles.subTitleText}>
            You are almost there. Fill in your information to create your N11
            profile.
          </Text>
          <View style={styles.nameContainer}>
            <TextInput
              style={[styles.inputView, styles.multipleInputsItem]}
              placeholder="First Name"
              placeholderTextColor={variables.placeHolderGrey}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[
                styles.inputView,
                styles.multipleInputsItem,
                { marginLeft: 24 }
              ]}
              placeholder="Last Name"
              placeholderTextColor={variables.placeHolderGrey}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <TextInput
            style={[styles.inputView, styles.emailLayout]}
            placeholder="Your Email"
            placeholderTextColor={variables.placeHolderGrey}
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.pwdContainer}>
            <View
              style={[
                styles.inputView,
                styles.multipleInputsItem,
                { flexDirection: 'row' }
              ]}
            >
              <TextInput
                style={{ flex: 1 }}
                placeholder="Password"
                placeholderTextColor={variables.placeHolderGrey}
                secureTextEntry={!clearPwd}
                onChangeText={setPassword}
                value={password}
              />
              <TouchableOpacity onPress={() => setClearPwd(!clearPwd)}>
                <Icon icon={clearPwd ? 'eye_open' : 'eye_close'} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputView,
                styles.multipleInputsItem,
                { flexDirection: 'row', marginLeft: 24 }
              ]}
            >
              <TextInput
                style={{ flex: 1 }}
                placeholder="Confirm"
                placeholderTextColor={variables.placeHolderGrey}
                secureTextEntry={!clearPwd}
                onChangeText={(confirmPassword) =>
                  setConfirmPassword(confirmPassword)
                }
                value={confirmPassword}
              />
              <TouchableOpacity onPress={() => setClearPwd(!clearPwd)}>
                <Icon icon={clearPwd ? 'eye_open' : 'eye_close'} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.bottomTip}>
            Use 8 or more characters with a mix of letters, numbers &amp;
            symbols
          </Text>
          <Text style={styles.bottomTip}>
            By creating a profile you are agreeing to our{' '}
            <Text
              style={styles.link}
              onPress={() => {
                // store.goTo('WebView', {
                //   title: 'Terms of Service',
                //   url: 'https://next11.com/help/terms-of-service'
                // });
              }}
            >
              Terms of Service
            </Text>
            {`\n`}View our{' '}
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
          <View style={styles.buttonContainer}>
            <Button
              mode="white"
              content="Back to activate"
              id="back"
              onPressed={async () => {
                props.navigation.goBack();
              }}
            />
            <TouchableOpacity onPress={onSubmit}>
              <View style={styles.FOOTER_CONTENT}>
                <Text style={commonStyles.NEXT_LINK}>
                  Agree and Create Profile{' '}
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

export default Register;

const styles = StyleSheet.create({
  FOOTER_CONTENT: {
    alignItems: 'center',
    color: color.primary,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  Line: {
    backgroundColor: color.palette.white,
    height: 1,
    marginBottom: 30,
    marginTop: 8,
    width: '100%'
  },
  bottomTip: {
    color: variables.placeHolderGrey,
    fontSize: 12,
    marginTop: 8
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 48
  },
  cardContainer: {
    backgroundColor: color.palette.realWhite,
    borderRadius: 3,
    shadowOpacity: 0.1
  },
  container: {
    margin: 'auto',
    paddingBottom: 34,
    paddingLeft: 25,
    paddingRight: 25,
    width: variables.deviceWidth * 0.52
  },
  emailLayout: {
    marginTop: 24
  },
  headerContainer: {
    height: variables.loginHeaderHeight,
    justifyContent: 'center'
  },
  inputView: {
    borderColor: variables.lighterGrey,
    borderRadius: 4,
    borderWidth: 1,
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 13
  },

  link: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid'
  },
  multipleInputsItem: {
    flex: 1
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24
  },
  pwdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40
  },
  subTitleText: {
    color: color.palette.darkGrey,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
    textAlign: 'left'
  },
  titleText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 30,
    lineHeight: 40,
    textAlign: 'center'
  }
});
