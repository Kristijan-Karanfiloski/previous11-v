import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import Card from '../common/Card';
import FullScreenDialog from '../common/FullScreenDialog';

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
};

const CancelModal = ({ onCancel, onSubmit }: Props) => {
  return (
    <FullScreenDialog onDismiss={onCancel} style={styles.container}>
      <Card>
        <View style={styles.rootContainer}>
          <Text style={styles.title}>Cancel Report Generation?</Text>
          <Text style={styles.text}>
            Report generation is in process.{'\n'} Are you sure you want to
            cancel?
          </Text>
          <View style={styles.buttons}>
            <ButtonNew
              style={styles.button}
              mode="secondary"
              text="No"
              onPress={onCancel}
            />
            <ButtonNew text="Yes" onPress={onSubmit} />
          </View>
        </View>
      </Card>
    </FullScreenDialog>
  );
};

export default CancelModal;

const styles = StyleSheet.create({
  button: {
    marginRight: 20
  },
  buttons: {
    flexDirection: 'row'
  },
  container: { alignItems: 'center', justifyContent: 'center' },
  rootContainer: {
    paddingBottom: 45,
    paddingHorizontal: 50,
    paddingTop: 20,
    width: 485
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    marginBottom: 40,
    textAlign: 'center'
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    marginBottom: 40,
    textAlign: 'center'
  }
});
