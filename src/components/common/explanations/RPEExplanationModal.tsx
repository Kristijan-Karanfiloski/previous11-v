import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { variables } from '../../../utils/mixins';
import RPECircles from '../../charts/common/RPECircles';
import { Icon } from '../../icon/icon';
import Card from '../Card';

const RPEExplanationModal = () => {
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
        <Text style={styles.title}>RPE (Rate of Perceived Exertion)</Text>
        <Text style={styles.text}>
          RPE, or Rate of Perceived Exertion, is a subjective measure used to
          gauge the intensity of physical activity as perceived by the player.
          It's a valuable tool for understanding how hard the players feel they
          are working during a match or training session.
        </Text>
        <Text style={styles.text}>
          After each session players will be able to input their perceived
          physical intensity of a session in the Player app on a scale from 1 to
          10:
        </Text>
        <View style={styles.circleContainer}>
          <RPECircles playerFeedback={null} />
        </View>
        <View style={[styles.listContainer, styles.marginTop20]}>
          <View style={styles.blackDot} />
          <Text>
            <Text style={styles.boldText}>1-2: Very Light - </Text>Almost no
            effort required.
          </Text>
        </View>
        <View style={[styles.listContainer, styles.marginTop20]}>
          <View style={styles.blackDot} />
          <Text>
            <Text style={styles.boldText}>3-4: Light - </Text>Little effort,
            could maintain for a long time.
          </Text>
        </View>
        <View style={[styles.listContainer, styles.marginTop20]}>
          <View style={styles.blackDot} />
          <Text>
            <Text style={styles.boldText}>5-6: Moderate - </Text>Noticeable
            effort, sustainable.
          </Text>
        </View>
        <View style={[styles.listContainer, styles.marginTop20]}>
          <View style={styles.blackDot} />
          <Text>
            <Text style={styles.boldText}>7-8: Hard - </Text>Challenging effort.
          </Text>
        </View>
        <View style={[styles.listContainer, styles.marginTop20]}>
          <View style={styles.blackDot} />
          <Text>
            <Text style={styles.boldText}>9-10: Maximum effort - </Text>
            Extremely hard, unsustainable effort.
          </Text>
        </View>
        <Text style={[styles.text, styles.marginTop20]}>
          When players provide their RPE feedback, they are essentially
          indicating how strenuous they felt the session was for them. This
          information can be crucial for tailoring future training plans,
          ensuring that the intensity aligns with their perceived effort.
        </Text>
        <Text style={[styles.text, styles.marginTop20]}>
          We recommend encouraging your players to enter RPE Feedback within one
          hour after a session to help capture the most accurate perceived
          exertion.
        </Text>
      </Card>
    </View>
  );
};

export default RPEExplanationModal;

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
  circleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20
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
