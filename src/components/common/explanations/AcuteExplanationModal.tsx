import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import acuteexample from '../../../assets/images/acuteexample.png';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';
import Card from '../Card';

const AcuteExplanationModal = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={() => navigation.goBack()}
        >
          <Icon icon="close" style={styles.closeIcon} />
        </TouchableOpacity>
        <View style={styles.dropdownIconContainer}>
          <View style={styles.dropdownIcon} />
        </View>
        <Text style={styles.headerText}>INFO</Text>
        <Text style={styles.title}>Acute : Chronic Player Load</Text>
        <Text style={styles.text}>
          As a coach, it's crucial to optimize training and minimize injury risk
          for your team. That's why we provide you with valuable insights into
          the Acute : Chronic Player Load. It compares the short-term load
          (acute workload) to the long-term load (chronic workload) to assess
          training intensity and potential injury risk for your players.
        </Text>
        <Text style={styles.subTitle}>Here's how it works:</Text>
        <View style={[styles.listContainer, styles.marginTop20]}>
          <View style={styles.blackDot} />
          <Text>
            <Text style={styles.boldText}>Acute workload </Text>represents the
            workload measured for a specific date. It indicates the immediate
            training stress on each individual player.
          </Text>
        </View>
        <View style={[styles.listContainer, styles.marginTop20]}>
          <View style={styles.blackDot} />
          <Text>
            <Text style={styles.boldText}>Chronic workload </Text>represents the
            long-term average workload measured over four weeks. This provides a
            baseline for comparison and reflects the overall load for each
            player during that time period.
          </Text>
        </View>
        <View style={[styles.exampleContainer, styles.marginTop20]}>
          <Image
            source={acuteexample}
            style={styles.exampleImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.text, styles.marginTop20]}>
          The green band in the Acute : Chronic Player Load graph represents the
          optimal load range (0.75 - 1.25) of the Acute:Chronic Workload Ratio.
          This is the load ratio you should aim for if you want to maintain or
          improve your players’ fitness without risking injury from
          overtraining.
        </Text>
        <Text style={[styles.text, styles.marginTop20]}>
          Monitoring and managing the balance between each of your players’
          acute and chronic load, can help you make informed decisions regarding
          training volume, intensity, and progression for your team.
        </Text>
      </Card>
    </View>
  );
};

export default AcuteExplanationModal;

const styles = StyleSheet.create({
  blackDot: {
    backgroundColor: variables.textBlack,
    borderRadius: 25,
    height: 5,
    marginHorizontal: 10,
    marginTop: 5,
    width: 5
  },
  boldText: {
    fontFamily: variables.mainFontSemiBold
  },
  cardContainer: {
    height: '100%',
    padding: 15
  },
  closeContainer: {
    left: 0,
    padding: 10,
    position: 'absolute',
    top: 0
  },
  closeIcon: {
    fill: variables.red,
    height: 25,
    width: 25
  },
  dropdownIcon: {
    backgroundColor: variables.grey2,
    borderRadius: 25,
    height: 5,
    width: 70
  },
  dropdownIconContainer: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center'
  },
  exampleContainer: {
    alignItems: 'center'
  },
  exampleImage: {
    height: 250,
    marginRight: 20,
    width: '80%'
  },
  headerText: {
    fontFamily: variables.mainFont,
    fontSize: 20,
    marginBottom: 25,
    textAlign: 'center'
  },
  listContainer: {
    flexDirection: 'row'
  },
  mainContainer: {
    flex: 1,
    marginTop: '8%'
  },
  marginTop20: {
    marginTop: 20
  },
  subTitle: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  title: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 30,
    marginBottom: 10
  }
});
