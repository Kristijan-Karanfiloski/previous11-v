import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { variables } from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';

interface DatasetImportedProps {
  onClick: () => void;
}

const DatasetImported = ({ onClick = () => {} }: DatasetImportedProps) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 22
        }}
      />

      <View style={styles.content}>
        <MaterialCommunityIcons name="sync" size={27} color={variables.red} />
        <Text style={styles.text}>Your dataset is now complete</Text>
        {/* <View style={styles.item}>
          <Icon style={styles.itemIcon} icon="checkmark" />
          <Text style={styles.itemText}>The Edge is turned on</Text>
        </View>
        <View style={styles.item}>
          <Icon style={styles.itemIcon} icon="checkmark" />
          <Text style={styles.itemText}>The player tags are in range</Text>
        </View>
        <View style={styles.item}>
          <Icon style={styles.itemIcon} icon="checkmark" />
          <Text style={styles.itemText}>
            The iPad is turned on and in range of the edge
          </Text>
        </View>
        <View style={styles.item}>
          <Icon style={styles.itemIcon} icon="checkmark" />
          <Text style={styles.itemText}>
            The iPad screen is set to always on
          </Text>
        </View> */}
      </View>
      <View style={styles.buttonContainer}>
        <ButtonNew text="OK" onPress={onClick} style={styles.buttonText} />
      </View>
    </View>
  );
};

export default DatasetImported;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    width: '100%'
  },

  buttonText: {
    color: variables.red,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 6,
    marginTop: 54
  },
  container: {
    alignItems: 'center'
  },
  content: {
    alignItems: 'center',
    borderBottomColor: variables.lightestGrey,
    borderBottomWidth: 1,
    marginBottom: 25,
    paddingBottom: 12,
    width: '100%'
  },

  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginVertical: 20
  }
});
