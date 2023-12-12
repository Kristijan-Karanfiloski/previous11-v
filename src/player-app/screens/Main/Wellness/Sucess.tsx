import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '../../../../components/icon/icon';
import { variables } from '../../../../utils/mixins';

const Sucess = () => {
  return (
    <View style={styles.container}>
      <Icon style={styles.icon} icon="spot_on_large" />
      <Text style={styles.title}>Thank you</Text>
      <Text style={styles.text}>
        Remember to check back tomorrow to keep your coach informed about your
        well-being
      </Text>
    </View>
  );
};

export default Sucess;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  icon: {
    marginBottom: 40
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14,
    textAlign: 'center'
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 22,
    marginBottom: 8
  }
});
