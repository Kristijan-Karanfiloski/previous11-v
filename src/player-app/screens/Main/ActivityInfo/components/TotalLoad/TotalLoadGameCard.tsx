import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { GameAny } from '../../../../../../../types';
import { Icon } from '../../../../../../components/icon/icon';
import { variables } from '../../../../../../utils/mixins';

type Props = {
  load?: number;
  event: GameAny;
  type: 'lowest' | 'highest';
  isPressable: boolean;
  onPress: () => void;
  totalTime: string;
};

const TotalLoadGameCard = ({
  load,
  event,
  type,
  isPressable,
  onPress,
  totalTime
}: Props) => {
  const location = event.location;
  const date = moment(event.date, 'YYYY/MM/DD').format('MMMM DD, YYYY');
  const opponent = event.versus;
  const score = `(${event.status?.scoreUs || '/'}-${
    event.status?.scoreThem || '/'
  })`;

  return (
    <Pressable
      disabled={!isPressable}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.content}>
        <View>
          <Text style={styles.label}>{`${type} Match`}</Text>
          <View style={styles.textWrapper}>
            <Text style={styles.loadText}>{load}</Text>
            <Text style={styles.text}>{`vs ${opponent} ${score}`}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.infoText}>{`${date}, ${location}`}</Text>
          <Text style={styles.infoText}>Activity time: {totalTime}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        {isPressable && <Icon style={styles.icon} icon="arrow_right_grey" />}
      </View>
    </Pressable>
  );
};

export default TotalLoadGameCard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: '#DADADA',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    height: 63,
    marginBottom: 10,
    padding: 12
  },
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    height: 13
  },
  iconContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 30
  },
  infoText: {
    color: '#17181A',
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  label: {
    color: '#686868',
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    textTransform: 'uppercase'
  },
  loadText: {
    color: '#17181A',
    fontFamily: variables.mainFontBold,
    fontSize: 22,
    marginRight: 4
  },
  text: {
    fontFamily: variables.mainFontBold,
    fontSize: 10,
    marginBottom: 4
  },
  textWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 28
  }
});
