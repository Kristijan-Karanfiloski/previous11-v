// jest.mock('@react-native-async-storage/async-storage', () => require('./__mocks__/@react-native-async-storage/async-storage'));
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// global.AbortController = function() {
//   this.abort = jest.fn();
//   this.signal = {
//     aborted: false,
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     dispatchEvent: jest.fn(),
//   };
// };

const abortFn = jest.fn();

// @ts-ignore
global.AbortController = jest.fn(() => ({
  abort: abortFn,
  signal : {
    aborted: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }
}));
