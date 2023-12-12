import AsyncStorage from '@react-native-async-storage/async-storage';

const persistStorage = () => {
  if (__DEV__) {
    return AsyncStorage;
  }
  return require('./mmkvStorage').reduxStorage;
};

export default persistStorage;
