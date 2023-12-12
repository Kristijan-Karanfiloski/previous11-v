import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ButtonNew from '../../components/common/ButtonNew';
import Card from '../../components/common/Card';
import { Icon } from '../../components/icon/icon';
import { SocketContext } from '../../hooks/socketContext';
import { variables } from '../../utils/mixins';
import ConnectionOverviewNoEdge from '../ConnectionOverview/components/ConnectionOverviewNoEdge';

import AddNewTags from './AddNewTags';

const AddTags = () => {
  const navigation = useNavigation();
  const { isReady } = useContext(SocketContext);

  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <View style={styles.header}>
          <Pressable onPress={navigation.goBack} style={styles.close}>
            <AntDesign name="close" size={21} color={variables.red} />
          </Pressable>
          <View style={styles.handle} />
        </View>
        <Text style={styles.title}>Add new tag</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.stepContainer}>
            <View style={styles.stepCircle}>
              {!isReady && <Text style={styles.stepNumber}>1</Text>}
              {isReady && (
                <Icon style={{ width: 15, color: '#fff' }} icon="check" />
              )}
            </View>
            <Text style={styles.stepText}>Connect to Edge</Text>
          </View>
          <View style={styles.stepDivider} />
          <View style={styles.stepContainer}>
            <View
              style={StyleSheet.flatten([
                styles.stepCircle,
                !isReady && { backgroundColor: variables.chartLightGrey }
              ])}
            >
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <Text
              style={StyleSheet.flatten([
                styles.stepText,
                !isReady && { fontFamily: variables.mainFont }
              ])}
            >
              Assign Tag
            </Text>
          </View>
        </View>
      </Card>
      {isReady && <AddNewTags />}
      {!isReady && <ConnectionOverviewNoEdge />}
      {!isReady && (
        <View style={styles.buttonsContainer}>
          <ButtonNew
            style={styles.cancelButton}
            mode="secondary"
            onPress={navigation.goBack}
            text="Cancel"
          />
          <ButtonNew disabled mode="primary" onPress={() => null} text="Next" />
        </View>
      )}
    </View>
  );
};

export default AddTags;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 75,
    marginTop: 'auto'
  },
  cancelButton: {
    marginRight: 20
  },
  cardContainer: {
    backgroundColor: variables.realWhite,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 14,
    padding: 20,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  close: {
    left: 0,
    position: 'absolute',
    top: 0
  },
  container: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    marginTop: 65
  },
  handle: {
    backgroundColor: variables.lightGrey,
    borderRadius: 4,
    height: 5,
    marginBottom: 10,
    width: 70
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  stepCircle: {
    alignItems: 'center',
    backgroundColor: variables.matchGreen,
    borderRadius: 50,
    height: 24,
    justifyContent: 'center',
    marginRight: 8,
    width: 24
  },
  stepContainer: { alignItems: 'center', flexDirection: 'row' },
  stepDivider: {
    backgroundColor: variables.chartLightGrey,
    height: 1,
    marginHorizontal: 12,
    width: 150
  },
  stepNumber: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  },
  stepText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 16
  },
  stepsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center'
  }
});
