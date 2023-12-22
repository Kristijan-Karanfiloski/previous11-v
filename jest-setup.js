//!GLOBAL THAT WILL BE USED FOR EVERY TEST
import '@testing-library/jest-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-firebase/auth');

jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('myMockToken')),
    AuthorizationStatus: {
      NOT_DETERMINED: 'not_determined',
      DENIED: 'denied',
      AUTHORIZED: 'authorized',
      PROVISIONAL: 'provisional'
      // ... other statuses as needed
    }
  });
});

const abortFn = jest.fn();
// @ts-ignore
global.AbortController = jest.fn(() => ({
  abort: abortFn,
  signal: {
    aborted: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }
}));
