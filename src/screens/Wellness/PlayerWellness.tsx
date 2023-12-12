import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';

import LinearGradientView from '../../components/LinearGradientView';
import { variables } from '../../utils/mixins';

type Props = {
  data: {
    name: string;
    fatigued: number;
    sleepQuality: number;
    sleepDuration: number;
    muscleSoreness: number;
    comment?: string | undefined;
    noData: boolean;
  };
  date: string;
  showPlayerName?: boolean;
};

const PlayerWellness = ({ data, date, showPlayerName = true }: Props) => {
  const [open, setOpen] = useState(!showPlayerName);
  const {
    name,
    comment,
    fatigued,
    muscleSoreness,
    sleepDuration,
    sleepQuality,
    noData
  } = data;
  const Bar = ({ number }: { number: number }) => {
    let firstColor = '#BFF57B';
    let secondColor = '#DBFF76';

    switch (true) {
      case number > 5:
        firstColor = '#FFA658';
        secondColor = '#E71950';
        break;
      case number > 3:
        firstColor = '#00E591';
        secondColor = '#58B1FF';
        break;
    }

    return (
      <View style={styles.bar}>
        <LinearGradientView
          linearGradient={{ x1: '0%', y1: '0%', x2: '100%', y2: '0%' }}
          colors={[
            { offset: 0, color: firstColor },
            { offset: 1, color: secondColor }
          ]}
          style={{ width: `${(number / 7) * 100}%`, height: '100%' }}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, open && { height: 'auto' }]}>
      <View style={styles.content}>
        {showPlayerName && (
          <View style={styles.nameContent}>
            <Text
              style={[styles.nameText, noData && { opacity: 0.5 }]}
              numberOfLines={1}
            >
              {name}
            </Text>
            {comment && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <EvilIcons
                  style={{ marginRight: 3 }}
                  name="comment"
                  size={16}
                  color="black"
                />
                <Text style={styles.textSecondary}>comment</Text>
              </View>
            )}
            {noData && (
              <Text style={{ ...styles.textSecondary, opacity: 0.5 }}>
                No response
              </Text>
            )}
          </View>
        )}
        <View style={styles.ratingWrapper}>
          <Bar number={fatigued} />
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Fatigue</Text>
            <Text style={styles.ratingNumber}>{noData ? '-' : fatigued}</Text>
          </View>
        </View>
        <View style={styles.ratingWrapper}>
          <Bar number={sleepQuality} />
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>sleep quality</Text>
            <Text style={styles.ratingNumber}>
              {noData ? '-' : sleepQuality}
            </Text>
          </View>
        </View>
        <View style={styles.ratingWrapper}>
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>sleep quantity</Text>
            <Text style={styles.ratingNumber}>
              {noData ? '-' : sleepDuration}
            </Text>
          </View>
        </View>
        <View style={styles.ratingWrapper}>
          <Bar number={muscleSoreness} />
          <View style={styles.labelWrapper}>
            <Text style={styles.label}>Soreness</Text>
            <Text style={styles.ratingNumber}>
              {noData ? '-' : muscleSoreness}
            </Text>
          </View>
        </View>
        {showPlayerName && (
          <Pressable
            style={{ width: 24 }}
            disabled={!comment}
            onPress={() => setOpen((prevState) => !prevState)}
          >
            {!!comment && (
              <MaterialIcons
                name={`keyboard-arrow-${open ? 'up' : 'down'}`}
                size={24}
                color="black"
              />
            )}
          </Pressable>
        )}
      </View>
      {open && !!comment && (
        <View style={styles.commentSection}>
          <View style={styles.commentSecionInner}>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default PlayerWellness;

const styles = StyleSheet.create({
  bar: {
    backgroundColor: variables.backgroundColor,
    borderRadius: 6,
    height: 6,
    marginTop: 5,
    overflow: 'hidden',
    width: 95
  },
  commentSecionInner: {
    backgroundColor: variables.backgroundColor,
    padding: 20
  },
  commentSection: { padding: 20 },
  commentText: {
    color: variables.grey,
    fontFamily: variables.mainFont
  },
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,

    shadowRadius: 4
  },
  content: {
    flexDirection: 'row',
    height: 68,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 20
  },

  dateText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  label: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 10,
    textTransform: 'uppercase'
  },
  labelWrapper: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    width: 95
  },
  nameContent: {
    width: 180
  },
  nameText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    marginBottom: 4,
    paddingRight: 15,
    textTransform: 'uppercase'
  },
  ratingNumber: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    textTransform: 'uppercase'
  },
  ratingWrapper: {
    flex: 1,
    height: 35
  },
  textSecondary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  }
});
