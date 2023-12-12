import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../utils/mixins';

import BackgroundImageLanding from './BackgroundImageLanding';

const ComingSoon = () => {
  return (
    <View style={styles.container}>
      <BackgroundImageLanding />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Under construction</Text>
      </View>
    </View>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'flex-end' },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    height: variables.deviceHeight / 4,
    justifyContent: 'center',
    marginTop: 100,
    width: '100%'
  },
  title: {
    color: variables.pinkishRed,
    fontFamily: variables.mainFont,
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
