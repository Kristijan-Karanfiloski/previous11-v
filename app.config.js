const IS_PROD =
  process.env.APP_VARIANT === 'production' ||
  process.env.APP_VARIANT === 'staging';

const APP_NAME = process.env.APP_NAME;

import appJson from './app.json';
export default {
  ...appJson.expo,
  name: APP_NAME,
  ios: {
    buildNumber: appJson.expo.ios.buildNumber,
    bundleIdentifier:
      process.env.BUNDLE_ID || appJson.expo.ios.bundleIdentifier,
    supportsTablet: true,
    googleServicesFile: IS_PROD
      ? './certs/GoogleService-Info_Prod.plist'
      : './certs/GoogleService-Info.plist',
    requireFullScreen: true,
    infoPlist: {
      UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
      'UISupportedInterfaceOrientations~ipad': [
        'UIInterfaceOrientationPortrait'
      ],
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: process.env.BUNDLE_ID || appJson.expo.android.package,
    googleServicesFile: IS_PROD
      ? './certs/GoogleService-Info_Prod.plist'
      : './certs/GoogleService-Info.plist'
  }
};
