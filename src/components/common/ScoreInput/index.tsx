import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../utils/mixins';

import ScoreInputCell from './ScoreInputCell';

type Props = {
  firstTeam: string;
  secondTeam: string;
  values: {
    first: string;
    second: string;
  };
  onChange: (name: string, val: string) => void;
  inputMaxLength?: number;
};

const ScoreInput = ({
  firstTeam,
  secondTeam,
  values,
  onChange,
  inputMaxLength
}: Props) => {
  return (
    <View style={styles.scoreContainer}>
      <ScoreInputCell
        label={firstTeam}
        value={values.first}
        onChange={(val: string) => onChange('first', val)}
        maxLength={inputMaxLength}
        inputProps={{
          autoFocus: true,
          returnKeyType: 'next'
        }}
      />
      <Text style={styles.textVersus}>vs</Text>
      <ScoreInputCell
        label={secondTeam}
        value={values.second}
        onChange={(val: string) => onChange('second', val)}
        maxLength={inputMaxLength}
      />
    </View>
  );
};

export default ScoreInput;

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: 'row'
  },

  textVersus: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    marginHorizontal: 70,
    marginTop: 35,
    textTransform: 'uppercase'
  }
});
