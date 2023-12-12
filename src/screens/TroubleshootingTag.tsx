import React, { useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import TagGreenImg from '../assets/images/tag_green.png';
import TagOffImg from '../assets/images/tag_off.png';
import TagRedImg from '../assets/images/tag_red.png';
import ButtonNew from '../components/common/ButtonNew';
import Card from '../components/common/Card';
import { Icon } from '../components/icon/icon';
import { DrawerStackParamList } from '../types';
import { variables } from '../utils/mixins';

const TroubleshootingTag = () => {
  const navigation = useNavigation();
  const { params } = useRoute() as RouteProp<
    DrawerStackParamList,
    'TroubleshootingTag'
  >;
  const [activeSection, setActiveSection] = useState('');

  const onCardPress = (val: string) => {
    setActiveSection((prevState) => (prevState === val ? '' : val));
  };

  const onEmailPress = () =>
    Linking.openURL('mailto:hello@next11.com?subject=Support').catch((err) =>
      alert(err)
    );

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={navigation.goBack} style={styles.closeIcon}>
            <AntDesign name="close" size={21} color={variables.red} />
          </Pressable>
          <View style={styles.handle} />
        </View>
        <Text style={styles.heading}>Troubleshooting: Tag {params.tagId}</Text>
        <Text style={styles.text}>
          Please select the appropriate option below based on the tag's status,
          then follow the provided guide. Alternatively, you can reach out to us
          at{' '}
          <Text
            onPress={onEmailPress}
            style={{ textDecorationLine: 'underline' }}
          >
            hello@next11.com
          </Text>{' '}
          for assistance.
        </Text>
      </Card>
      <Card
        style={{
          ...styles.section,
          height: activeSection === 'green' ? 'auto' : 100
        }}
      >
        <Pressable
          onPress={() => onCardPress('green')}
          style={styles.sectionHeader}
        >
          <Image source={TagGreenImg} style={styles.tagImg} />
          <View>
            <Text style={styles.sectionTitle}>The tag is blinking green</Text>
            <Text style={styles.sectionText}>
              Indicating, that the tag is connected to the Edge
            </Text>
          </View>
          <Icon
            icon="down"
            containerStyle={{
              marginLeft: 'auto',
              transform: [
                { rotate: activeSection === 'green' ? '180deg' : '0deg' }
              ]
            }}
            style={styles.arrowIcon}
          />
        </Pressable>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionHeading}>
            A: Check if the tag is assigned to your team
          </Text>
          <Text style={styles.sectionTextSecondary}>
            Go to Settings → Select the tab ‘Players and Tags’ → Scroll down to
            ‘Tag Management’ at the bottom of the page → Click ‘Add New Tag’ →
            Check if the tag appears in the tag overview
          </Text>
          <ButtonNew
            mode="secondary"
            text="Open Settings"
            onPress={() =>
              navigation.navigate('Settings', { routeName: 'Players and Tags' })
            }
            style={styles.btn}
          />
          <Text style={styles.sectionHeading}>B: Contact customer support</Text>
          <Text style={styles.sectionTextSecondary}>
            Contact our customer support at{' '}
            <Text
              onPress={onEmailPress}
              style={{ textDecorationLine: 'underline' }}
            >
              hello@next11.com
            </Text>
          </Text>
        </View>
      </Card>
      <Card
        style={{
          ...styles.section,
          height: activeSection === 'red' ? 'auto' : 100
        }}
      >
        <Pressable
          onPress={() => onCardPress('red')}
          style={styles.sectionHeader}
        >
          <Image source={TagRedImg} style={styles.tagImg} />
          <View>
            <Text style={styles.sectionTitle}>The tag is blinking red</Text>
            <Text style={styles.sectionText}>
              Indicating, that the tag is trying to connect to the Edge
            </Text>
          </View>
          <Icon
            icon="down"
            containerStyle={{
              marginLeft: 'auto',
              transform: [
                { rotate: activeSection === 'red' ? '180deg' : '0deg' }
              ]
            }}
            style={styles.arrowIcon}
          />
        </Pressable>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionHeading}>A: Restart tag</Text>
          <Text style={styles.sectionTextSecondary}>
            Put power to the tag case → Place the tag in the tag case → Wait for
            the tag to light up either steady green or steady red → Pull up the
            tag. Please allow the tag up to 1 minute to connect
          </Text>
          <Text style={styles.sectionHeading}>B: Contact customer support</Text>
          <Text style={styles.sectionTextSecondary}>
            Contact our customer support at{' '}
            <Text
              onPress={onEmailPress}
              style={{ textDecorationLine: 'underline' }}
            >
              hello@next11.com
            </Text>
          </Text>
        </View>
      </Card>
      <Card
        style={{
          ...styles.section,
          height: activeSection === 'off' ? 'auto' : 100
        }}
      >
        <Pressable
          onPress={() => onCardPress('off')}
          style={styles.sectionHeader}
        >
          <Image source={TagOffImg} style={styles.tagImg} />
          <View>
            <Text style={styles.sectionTitle}>The tag is not blinking</Text>
            <Text style={styles.sectionText}>
              Indicating, that the tag is off
            </Text>
          </View>
          <Icon
            icon="down"
            containerStyle={{
              marginLeft: 'auto',
              transform: [
                { rotate: activeSection === 'off' ? '180deg' : '0deg' }
              ]
            }}
            style={styles.arrowIcon}
          />
        </Pressable>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionHeading}>A: Restart tag</Text>
          <Text style={styles.sectionTextSecondary}>
            Put power to the tag case → Place the tag in the tag case → Wait for
            the tag to light up either steady green or steady red → Pull up the
            tag. Please allow the tag up to 1 minute to connect
          </Text>
          <Text style={styles.sectionHeading}>B: Contact customer support</Text>
          <Text style={styles.sectionTextSecondary}>
            Contact our customer support at{' '}
            <Text
              onPress={onEmailPress}
              style={{
                textDecorationLine: 'underline'
              }}
            >
              hello@next11.com
            </Text>
          </Text>
        </View>
      </Card>
    </View>
  );
};

export default TroubleshootingTag;

const styles = StyleSheet.create({
  arrowIcon: { color: 'black', height: 42, width: 42 },
  btn: {
    marginBottom: 40
  },
  cardContainer: {
    backgroundColor: variables.realWhite,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 40,
    padding: 20,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  closeIcon: {
    left: 0,
    position: 'absolute',
    top: -5
  },
  handle: {
    backgroundColor: variables.lightGrey,
    borderRadius: 4,
    height: 5,
    marginBottom: 10,
    width: 70
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  heading: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center'
  },
  mainContainer: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    marginTop: 65
  },
  section: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    height: 100,
    marginBottom: 40,
    marginHorizontal: 27,
    overflow: 'hidden',
    paddingHorizontal: 55
  },
  sectionContent: { paddingTop: 25 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 100
  },
  sectionHeading: { fontFamily: variables.mainFontBold, marginBottom: 18 },
  sectionText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  sectionTextSecondary: {
    fontFamily: variables.mainFontMedium,
    marginBottom: 40
  },
  sectionTitle: {
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    marginBottom: 10
  },
  tagImg: {
    marginRight: 15
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    paddingHorizontal: 50,
    textAlign: 'center'
  }
});
