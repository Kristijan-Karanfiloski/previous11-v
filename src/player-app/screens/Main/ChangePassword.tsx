import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import OverlayLoader from '../../../components/common/OverlayLoader';
import API from '../../../helpers/api';
import { updatePassword } from '../../../helpers/firestoreService';
import { selectAuth, updateUser } from '../../../redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { color } from '../../../theme';
import { validateEmail, validatePassword } from '../../../utils';
import { variables } from '../../../utils/mixins';

const INITIAL_FORM = {
  ChangePassword: {
    currentPass: '',
    newPass: '',
    confirmNewPass: ''
  },
  ChangeEmail: {
    email: ''
    // password: ''
  }
};

type FormType = {
  currentPass?: any;
  newPass?: any;
  confirmNewPass?: any;
  email?: any;
  password?: any;
};

type RouteName = 'ChangePassword' | 'ChangeEmail';

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const auth = useAppSelector(selectAuth);
  const routeName = navigation.getState().routes[
    navigation.getState().routes.length - 1
  ].name as RouteName;
  const [form, setForm] = useState<FormType>(INITIAL_FORM[routeName]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerBackTitleStyle: {
        fontSize: 14,
        fontFamily: variables.mainFontBold
      },
      headerRight: () => (
        <Pressable disabled={isDisabled()} onPress={onSave}>
          <Text
            style={{
              ...styles.saveBtn,
              color: isDisabled() ? variables.lightGrey : color.palette.orange
            }}
          >
            Save
          </Text>
        </Pressable>
      )
    });
  }, [form]);

  useEffect(() => {
    if (routeName === 'ChangeEmail') {
      setForm((prevState) => ({
        ...prevState,
        email: auth.email.toLowerCase()
      }));
    }
  }, [routeName]);

  const isDisabled = () => {
    if (routeName === 'ChangePassword') {
      return (
        _.isEmpty(form.currentPass) ||
        _.isEmpty(form.newPass) ||
        _.isEmpty(form.confirmNewPass)
      );
    } else {
      return (
        _.isEmpty(form.email) ||
        !validateEmail(form.email) ||
        form.email.toLowerCase() === auth.email.toLowerCase()
      );
    }
  };

  const onSave = () => {
    if (routeName === 'ChangePassword') {
      const { currentPass, newPass, confirmNewPass } = form;

      if (!validatePassword(newPass)) {
        Alert.alert(
          'Please use 8 or more characters with a mix of letters and numbers'
        );
      } else if (newPass !== confirmNewPass) {
        Alert.alert('New password and Confirm password does not match');
      } else {
        setIsLoading(true);
        updatePassword(currentPass, newPass)
          .then(() => navigation.goBack())
          .catch(() => Alert.alert('Something went wrong'))
          .finally(() => setIsLoading(false));
      }
    } else {
      const { email } = form;

      if (!validateEmail(email)) {
        Alert.alert('Please enter a valid email');
      } else {
        setIsLoading(true);
        API.changeEmail({ email: auth.email, newEmail: email })
          .then(() => {
            dispatch(updateUser({ email }));
            navigation.goBack();
          })
          .catch(() => Alert.alert('Something went wrong'))
          .finally(() => setIsLoading(false));
      }
    }
  };

  return (
    <>
      {isLoading && <OverlayLoader isLoading={isLoading} />}
      <View style={styles.container}>
        <Text style={styles.title}>
          {routeName === 'ChangePassword' ? 'Change Password' : 'Change Email'}
        </Text>
        {routeName === 'ChangePassword' && (
          <>
            <View style={styles.rowItem}>
              <View style={styles.groupItems}>
                <Text style={styles.inputLabel}>Current</Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    value={form.currentPass}
                    onChangeText={(val) =>
                      setForm((prevState) => ({
                        ...prevState,
                        currentPass: val
                      }))
                    }
                    style={styles.input}
                    placeholder="enter password"
                    placeholderTextColor={color.palette.tipGrey}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <View style={styles.rowItem}>
              <View style={styles.groupItems}>
                <Text style={styles.inputLabel}>New</Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    value={form.newPass}
                    onChangeText={(val) =>
                      setForm((prevState) => ({ ...prevState, newPass: val }))
                    }
                    style={styles.input}
                    placeholder="enter password"
                    placeholderTextColor={color.palette.tipGrey}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <View style={styles.rowItem}>
              <View style={styles.groupItems}>
                <Text style={styles.inputLabel}>Confirm</Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    value={form.confirmNewPass}
                    onChangeText={(val) =>
                      setForm((prevState) => ({
                        ...prevState,
                        confirmNewPass: val
                      }))
                    }
                    style={styles.input}
                    placeholder="enter password"
                    placeholderTextColor={color.palette.tipGrey}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>

            <Text
              style={{
                fontSize: 10,
                fontFamily: variables.mainFont,
                color: variables.textBlack,
                marginLeft: 16,
                marginTop: 17
              }}
            >
              Use 8 or more characters with a mix of letters and numbers
            </Text>
          </>
        )}
        {routeName === 'ChangeEmail' && (
          <>
            <View style={styles.rowItem}>
              <View style={styles.groupItems}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    value={form.email}
                    onChangeText={(val) =>
                      setForm((prevState) => ({
                        ...prevState,
                        email: val.toLowerCase()
                      }))
                    }
                    style={styles.input}
                    placeholder="enter email"
                    placeholderTextColor={color.palette.tipGrey}
                  />
                </View>
              </View>
            </View>
            {/* <View style={styles.rowItem}>
              <View style={styles.groupItems}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={{ flex: 1 }}>
                  <TextInput
                    value={form.password}
                    onChangeText={(val) =>
                      setForm((prevState) => ({
                        ...prevState,
                        password: val
                      }))
                    }
                    style={styles.input}
                    placeholder="enter password"
                    placeholderTextColor={color.palette.tipGrey}
                    secureTextEntry
                  />
                </View>
              </View>
            </View> */}
          </>
        )}
      </View>
    </>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 30 },
  groupItems: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  input: {
    color: color.palette.realBlack,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginLeft: 29
  },
  inputLabel: {
    color: variables.textBlack,
    flex: 0.22,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  rowItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: color.palette.lighterGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'flex-start',
    paddingLeft: 21,
    paddingRight: 15
  },
  saveBtn: {
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    marginRight: 34,
    textTransform: 'uppercase'
  },
  title: {
    color: color.palette.tipGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginBottom: 11,
    marginLeft: 16
  }
});
