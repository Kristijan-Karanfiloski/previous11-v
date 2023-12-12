import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { variables } from '../../../../../../utils/mixins';

type Props = {
  gameDate: string;
};

const AcuteChronicFooter = ({ gameDate }: Props) => {
  const navigation = useNavigation() as any;
  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.greenDot}></View>
        <Text style={styles.text}>Within range</Text>
        <Text style={styles.subText}>0.75-1.25</Text>
      </View>
      <Pressable
        style={{ alignItems: 'flex-end', justifyContent: 'center', height: 20 }}
        onPress={() => navigation.navigate('Accute', { date: gameDate })}
      >
        <Text style={styles.buttonText}>View and compare</Text>
      </Pressable>
    </>
  );
};

export default AcuteChronicFooter;

const styles = StyleSheet.create({
  buttonText: {
    color: variables.grey2,
    fontFamily: variables.mainFontBold
  },
  greenDot: {
    backgroundColor: '#88FF9A',
    borderRadius: 50,
    height: 8,
    marginRight: 10,
    width: 8
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  subText: {
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    marginRight: 5
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginRight: 2
  }
});
