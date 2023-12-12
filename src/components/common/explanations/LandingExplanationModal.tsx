import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import footballImage from '../../../assets/images/footballLandingExplanation.png';
import hockeyImage from '../../../assets/images/hockeyLandingExplanation.png';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';
import Card from '../Card';

const LandingExplanationModal = () => {
  const navigation = useNavigation();
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

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
        <Text style={styles.title}>Tracking Categories</Text>
        <Text style={styles.text}>
          At Next11, we name the sessions based on their proximity to a match.
        </Text>
        <Text style={styles.text}>
          If a training session happens 2 days after a match, it’s called a '+2'
          training session. On the other hand, if it happens 2 days before a
          match, it’s called a '-2' training session.
        </Text>
        <Text style={styles.text}>
          By using this naming convention, it's easy to compare similar types of
          training sessions and ensure that you are preparing for matches in the
          most effective way possible.
        </Text>
        <Text style={styles.text}>
          So, whether it's a +2 or -2 session, we're always working towards
          optimal performance.
        </Text>
        <Text style={styles.text}>
          When creating a training session, you also have the option to manually
          select the training category, such as ‘Individual’ or ‘No Category’
          sessions. We mark these sessions with ‘IT’ or ‘NC’ This is useful when
          tracking sessions for individual players or when you don’t want to
          include a session in the average calculation for a +/- training
          category.
        </Text>
        <Text style={styles.subTitle}>Example</Text>
        <View style={styles.exampleContainer}>
          <Image
            source={isHockey ? hockeyImage : footballImage}
            style={styles.exampleImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.text}>
          Let's say you have three matches scheduled in a two-week period. The
          first match is on a Sunday, the second match is on a Friday, and the
          third match is also on a Friday.
        </Text>
        <Text style={styles.text}>
          To make it easier to keep track of training and recovery days, we use
          a naming convention based on the proximity to each match.
        </Text>
        <Text style={styles.text}>
          The day immediately following a match is called "+1," and the second
          day after the match is called "+2."
        </Text>
        <Text style={styles.text}>
          All other days leading up to the next match are designated with a
          minus sign (-), indicating the number of days until the next match.
        </Text>
        <Text style={styles.text}>
          This system helps us plan training and recovery activities in a way
          that optimizes performance and minimizes the risk of injury.
        </Text>
      </Card>
    </View>
  );
};

export default LandingExplanationModal;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: variables.realWhite,
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
    alignItems: 'flex-start'
  },
  exampleImage: {
    height: 180,
    marginRight: 20,
    width: '50%'
  },
  headerText: {
    fontFamily: variables.mainFont,
    fontSize: 20,
    marginBottom: 25,
    textAlign: 'center'
  },
  mainContainer: {
    flex: 1,
    marginTop: '8%'
  },
  subTitle: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 16,
    marginBottom: 20
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 14,
    marginBottom: 18
  },
  title: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 30,
    marginBottom: 10
  }
});
