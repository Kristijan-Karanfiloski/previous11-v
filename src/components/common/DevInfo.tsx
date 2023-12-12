import * as React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Application from 'expo-application';
import * as Updates from 'expo-updates';
import moment from 'moment';

import { color } from '../../theme';

const DevInfo = () => {
  if (__DEV__ || !Updates?.updateId) {
    return null;
  }

  const onFetchUpdateAsync = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        const newUpdate = await Updates.fetchUpdateAsync();
        if (newUpdate.isNew) {
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      console.log(`Error fetching latest Expo update: ${error}`);
    }
  };

  return (
    <TouchableOpacity
      style={{
        marginTop: 11
      }}
      onLongPress={() => {
        Alert.alert('Reload app', 'Are you sure you want to reload the app?', [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: onFetchUpdateAsync
            // () => {
            //   Updates.fetchUpdateAsync()
            //     .then((update) => {
            //       if (update.isNew) {
            //         Updates.reloadAsync();
            //       }
            //     })
            //     .catch((err) => console.log('err', err));

            // }
          }
        ]);
      }}
    >
      <Text style={styles.updatesText}>{Updates.channel}</Text>
      <Text
        style={styles.updatesText}
      >{`${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}</Text>
      <Text style={styles.updatesText}>
        {moment(Updates?.manifest?.createdAt).format('DD/MM/YYYY HH:mm')}
      </Text>
    </TouchableOpacity>
  );
};

export default DevInfo;

const styles = StyleSheet.create({
  updatesText: {
    color: color.palette.tipGrey,
    fontSize: 10,
    textAlign: 'left'
  }
});
