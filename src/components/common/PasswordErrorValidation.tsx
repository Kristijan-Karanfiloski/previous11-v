import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { color, commonStyles, typography } from '../../theme';

interface Props {
  isSamePassword: boolean;
}

const PasswordErrorValidation = ({ isSamePassword }: Props) => {
  const navigation = useNavigation();

  if (isSamePassword) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.text}>
          Old password can not be set as your new password.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text style={styles.text}>The password you entered is incorrect.</Text>
        <Text style={styles.text}>Please try again.</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ResetPassword', {
            title: 'Forgot your password?'
          })
        }
      >
        <View style={commonStyles.FOOTER_CONTENT}>
          <Text style={commonStyles.NEXT_LINK}>Forgot your password?</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordErrorValidation;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  text: {
    color: color.primary,
    fontFamily: typography.fontMedium,
    fontSize: 16,
    lineHeight: 22
  }
});
