import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Icon } from '../../../components/icon/icon';
import { variables } from '../../../utils/mixins';

interface Props {
  matchAverage: number;
  bestMatch: { id: string; vs: string; load: number };
}

const MatchesInfo = ({
  matchAverage,
  bestMatch: { id = '', vs = '', load = 0 }
}: Props) => {
  const navigation = useNavigation();

  const navigate = () => {
    if (!id) return null;
    navigation.navigate('Report', { eventId: id });
  };

  return (
    <View style={styles.matchesContentContainer}>
      <Text style={styles.headingText}>Matches</Text>
      <View style={styles.infoContainer}>
        <Icon icon="bars_purple" style={styles.icon} />
        <View style={styles.specificWidth}>
          <Text style={styles.subHeadingText}>Average</Text>
          {matchAverage
            ? (
            <Text style={styles.subText}>This season</Text>
              )
            : null}
        </View>
        <Text style={[styles.dataText, { marginLeft: 16 }]}>
          {Math.round(matchAverage) || '-'}
        </Text>
      </View>
      <TouchableOpacity style={styles.infoContainer} onPress={navigate}>
        <Icon icon="heat_icon_purple" style={styles.icon} />
        <View style={styles.specificWidth}>
          <Text style={styles.subHeadingText}>Highest</Text>
          {load ? <Text style={styles.subText}>{vs}</Text> : null}
        </View>
        <Text style={styles.dataText}> {Math.round(load) || '-'}</Text>
        {load ? <Icon icon="arrow_next" style={styles.nextIcon} /> : null}
      </TouchableOpacity>
    </View>
  );
};

export default MatchesInfo;

const styles = StyleSheet.create({
  dataText: {
    fontFamily: variables.mainFont,
    fontSize: 20,
    marginLeft: 10,
    width: 50
  },
  headingText: {
    fontFamily: variables.mainFont,
    fontSize: 24,
    marginBottom: 5
  },
  icon: {
    height: 17,
    marginRight: 10,
    width: 12
  },
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10
  },
  matchesContentContainer: {
    padding: 30
  },
  nextIcon: {
    color: variables.lighterBlack,
    height: 15,
    marginLeft: 5,
    width: 15
  },
  specificWidth: {
    width: 80
  },
  subHeadingText: {
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  subText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 11
  }
});
