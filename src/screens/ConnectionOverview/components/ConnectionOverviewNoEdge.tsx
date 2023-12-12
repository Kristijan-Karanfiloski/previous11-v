import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import edgeDeviceImg from '../../../assets/images/edge-device.png';
import settingsWheelImg from '../../../assets/images/settings-wheel.png';
import Card from '../../../components/common/Card';
import { Icon } from '../../../components/icon/icon';
import { variables } from '../../../utils/mixins';

const ConnectionOverviewNoEdge = () => {
  return (
    <View>
      <Card style={styles.container}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titleStep}>Step 1: Turn on Edge</Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.subtitleStep}>
            If the Edge is already turned on, skip this step.{'\n\n'}
            Hold down the power button for three seconds until the light above
            the battery indicator is turned on.
          </Text>

          <View style={styles.notificationContainer}>
            <Icon
              icon="error_icon"
              style={{
                marginRight: 15
              }}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: variables.mainFontMedium
              }}
            >
              Do not restart your Edge if you lost connection during a tracking
              session. The Edge is still collecting data. Go to Step 2 instead.{' '}
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'flex-end'
          }}
        >
          <Image
            source={edgeDeviceImg}
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
            Step 2: Connect your iPad to the Edge’s WiFi
          </Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.subtitleStep}>
            Go to System Settings on your iPad and select the Edge WiFi.{'\n\n'}{' '}
            WiFi name: N11-APXX {'\n'} Password: next11WIFI
          </Text>

          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => Linking.openURL('app-settings:').catch((err) => err)}
          >
            <Text style={styles.settingsText}>Open System Settings</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 193
          }}
        >
          <Image
            source={settingsWheelImg}
            style={{
              width: 119,
              height: 119
            }}
          />
        </View>
      </Card>
    </View>
  );
};

export default ConnectionOverviewNoEdge;

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
  notificationContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(242, 242, 244, 0.50)',
    borderRadius: 10,
    flexDirection: 'row',
    height: 68,
    justifyContent: 'center',
    marginTop: 24,
    paddingHorizontal: 31
  },
  settingsBtn: {
    alignItems: 'center',
    backgroundColor: variables.red,
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    marginTop: 24,
    width: 241
  },
  settingsText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 16
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
