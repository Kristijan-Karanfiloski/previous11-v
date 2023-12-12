import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import AlertTooltip from '../../components/common/AlertTooltip';
import Avatar from '../../components/common/Avatar';
import ButtonNew from '../../components/common/ButtonNew';
import Card from '../../components/common/Card';
import FullScreenDialog from '../../components/common/FullScreenDialog';
import InfoCell from '../../components/common/InfoCell';
import InputCell from '../../components/common/InputCell';
import OverlayLoader from '../../components/common/OverlayLoader';
import PasswordErrorValidation from '../../components/common/PasswordErrorValidation';
import TakePhoto from '../../components/common/TakePhoto';
import { userProfileFirestoreProps } from '../../converters';
import { updatePassword, uploadPhoto } from '../../helpers/firestoreService';
import { selectAuth } from '../../redux/slices/authSlice';
import {
  selectUserProfile,
  updateUserProfileAction
} from '../../redux/slices/userProfileSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { commonStyles } from '../../theme';
import { variables } from '../../utils/mixins';

const CoachInfo = () => {
  const profile = useAppSelector(selectUserProfile);
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [name, setName] = useState(profile?.name);
  const [phone, setPhone] = useState(profile?.phone);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSamePassword, setIsSamePassword] = useState(false);

  useEffect(() => {
    if (!showPasswordDialog) {
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [showPasswordDialog]);

  useEffect(() => {
    if (isSaved) {
      setTimeout(() => setIsSaved(false), 3000);
    }
  }, [isSaved]);

  const onBlurSubmit = (key: keyof userProfileFirestoreProps, value: any) => {
    if (profile?.[key] === value) return;
    setIsSaved(true);
    return dispatch(updateUserProfileAction({ [key]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Card style={commonStyles.settingsCardContainer}>
          <Text style={styles.title}>Personal Info</Text>
          <View style={commonStyles.sepparator} />

          <InfoCell title="Profile Picture" subTitle="Add your profile picture">
            <TakePhoto
              onSuccess={({ uri }) => {
                setIsLoading(true);
                uploadPhoto('user', auth.id, uri)
                  .then((photoUrl) => onBlurSubmit('photoUrl', photoUrl))
                  .finally(() => setIsLoading(false));
              }}
            >
              <Avatar
                style={{
                  width: 64,
                  height: 64,
                  borderWidth: 2
                }}
                enableUpload
                photoUrl={profile?.photoUrl}
              />
            </TakePhoto>
          </InfoCell>
          <InputCell
            placeholder="Enter your name"
            title="First & Last Name"
            value={name}
            onBlur={() => onBlurSubmit('name', name)}
            onTextInput={(text) => setName(text)}
            autoCapitalize="words"
          />

          <InfoCell title="Role" subTitle="Head Coach" />
        </Card>

        <Card style={commonStyles.settingsCardContainer}>
          <Text style={styles.title}>Account Settings</Text>
          <View style={commonStyles.sepparator} />

          <InfoCell title="Email" subTitle={profile?.email} />

          <InputCell
            placeholder="Enter your phone number"
            title="Phone Number"
            value={phone}
            onBlur={() => onBlurSubmit('phone', phone)}
            onTextInput={(text) => setPhone(text)}
          />

          <Pressable onPress={() => setShowPasswordDialog(true)}>
            <InfoCell subTitle="********" title="Change Password" />
          </Pressable>

          <ButtonNew
            style={{
              marginTop: 23,
              width: '100%'
            }}
            text="Delete account"
            onPress={() => {
              // updatePassword(password, newPassword)
              console.log('press');
            }}
          />
        </Card>
      </ScrollView>
      {showPasswordDialog && (
        <FullScreenDialog
          onDismiss={() => {
            setIsSamePassword(false);
            setPasswordError(false);
            setShowPasswordDialog(false);
          }}
        >
          <Card
            style={StyleSheet.flatten([
              commonStyles.settingsCardContainer,
              { width: variables.deviceWidth * 0.75 }
            ])}
          >
            <View>
              <Text style={styles.title}>Change Password</Text>
            </View>

            <InputCell
              placeholder="Enter your current password"
              title="Current Password"
              value={password}
              onTextInput={(text) => setPassword(text)}
              isPassword
              secureTextEntry={!showPassword}
              onToggleSecureText={() => setShowPassword(!showPassword)}
              inputStyle={styles.passwordInput}
            />

            {passwordError && (
              <PasswordErrorValidation isSamePassword={isSamePassword} />
            )}

            <InputCell
              placeholder="Enter your new password"
              title="New Password"
              value={newPassword}
              onTextInput={(text) => setNewPassword(text)}
              isPassword
              secureTextEntry={!showPassword}
              onToggleSecureText={() => setShowPassword(!showPassword)}
              inputStyle={styles.passwordInput}
            />

            <InputCell
              placeholder="Confirm your new password"
              title="Confirm Password"
              value={confirmPassword}
              onTextInput={(text) => setConfirmPassword(text)}
              isPassword
              secureTextEntry={!showPassword}
              onToggleSecureText={() => setShowPassword(!showPassword)}
              inputStyle={styles.passwordInput}
            />
            <Text style={styles.passwordMsg}>
              Use 8 or more characters with a mix of letters, numbers & symbols
            </Text>
            <ButtonNew
              style={{
                marginTop: 23,
                width: '100%'
              }}
              text="Change Password"
              onPress={() => {
                setIsLoading(true);
                updatePassword(password, newPassword)
                  .then((res) => {
                    if (
                      confirmPassword === newPassword &&
                      password === newPassword
                    ) {
                      setIsLoading(false);
                      setPasswordError(true);
                      return setIsSamePassword(true);
                    }
                    if (res === 'Wrong password') {
                      setPasswordError(true);
                      return setIsLoading(false);
                    }

                    setIsSamePassword(false);
                    setPasswordError(false);
                    setShowPasswordDialog(false);
                    setIsLoading(false);
                  })
                  .catch(() => {
                    setPasswordError(true);
                    setIsLoading(false);
                  });

                console.log('press');
              }}
              disabled={
                !password ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                newPassword.length < 8
              }
            />
          </Card>
        </FullScreenDialog>
      )}

      <OverlayLoader isLoading={isLoading} />
      {isSaved && <AlertTooltip text="Changes saved!" />}
    </View>
  );
};

export default CoachInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 100,
    paddingTop: 31
  },
  passwordInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16
  },
  passwordMsg: {
    color: variables.lightGrey,
    fontSize: 12
  },

  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 20
  }
});
