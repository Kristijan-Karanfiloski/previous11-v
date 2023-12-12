import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import edgeCasesImg from '../../../assets/images/edge-cases.png';
import tagsCaseImg from '../../../assets/images/tag-case.png';
import Card from '../../../components/common/Card';
import { variables } from '../../../utils/mixins';

const ConnectionOverviewNoTags = () => {
  return (
    <View>
      <Card style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleStep}>Step 1: Turn on Tags</Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.subtitleStep}>
            Make sure your tags are connected to a power supply. You can use the
            power bank placed in the tag case.{'\n\n'}
            When lighting red, the tags are charging.{'\n'}
            When lighting green, the tags are fully charged.
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'flex-end'
          }}
        >
          <Image
            source={tagsCaseImg}
            style={{
              width: 193,
              height: 172
            }}
          />
        </View>
      </Card>

      <Card style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleStep}>
            Step 2: Take out the tags you want to connect
          </Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.subtitleStep}>
            Pull out the tags from the tag case.{'\n\n'}
            When blinking red, the tags are searching for connection to the
            Edge.{'\n\n'}
            When blinking green, your tags are connected.
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={edgeCasesImg}
            style={{
              width: 219,
              height: 132
            }}
          />
        </View>
      </Card>
    </View>
  );
};
export default ConnectionOverviewNoTags;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    flexDirection: 'row',
    height: 311,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 7,
    paddingBottom: 45,
    paddingHorizontal: 27,
    paddingTop: 34,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  horizontalLine: {
    backgroundColor: '#F2F2F4',
    height: 1,
    marginBottom: 14,
    width: '100%'
  },
  subtitleStep: {
    fontFamily: variables.mainFontMedium,
    fontSize: 14,
    lineHeight: 20
  },
  titleStep: {
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 14
  }
});
