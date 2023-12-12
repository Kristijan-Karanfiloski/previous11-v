import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

import { variables } from '../../utils/mixins';

type Props = {
  date: string;
  name: string;
  text: string;
};
const Comment = ({ date, name, text }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <EvilIcons name="comment" size={16} color="black" />
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <Text style={styles.text} numberOfLines={3}>
        {text}
      </Text>
      {/* <Pressable style={styles.btn}>
        <Text style={styles.btnText}>Read More</Text>
      </Pressable> */}
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 4,
    height: 135,
    marginRight: 16,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 340
  },
  dateText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    marginLeft: 'auto'
  },
  nameText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2,
    textTransform: 'uppercase'
  },
  text: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  topSection: {
    alignItems: 'center',
    flexDirection: 'row',

    marginBottom: 8
  }
  // btn: {
  //   marginTop: 'auto'
  // },
  // btnText: {
  //   color: variables.red,
  //   fontFamily: variables.mainFontSemiBold,
  //   fontSize: 12
  // },
});
