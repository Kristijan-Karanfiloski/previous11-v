import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { palette } from '../../../theme';
import { variables } from '../../../utils/mixins';
import ConnectionButton from '../../common/ConnectionButton';

interface WeeklyLoadHeaderProps {
  title?: string;
}

const WeeklyLoadHeader = ({ title = '' }: WeeklyLoadHeaderProps) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.leftView}>
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={navigation.goBack}
          hitSlop={{
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          }}
        >
          <Ionicons name="caret-back-sharp" size={17} color={palette.orange} />
        </Pressable>
      </View>
      <View style={styles.centerView}>
        <Text
          style={{
            color: variables.realWhite,
            fontSize: 18,
            fontFamily: variables.mainFontMedium
          }}
        >
          {title || 'Weekly Load'}
        </Text>
      </View>
      <View style={styles.rightView}>
        {/* <SyncButton /> */}
        <ConnectionButton />
      </View>
    </SafeAreaView>
  );
};

export default WeeklyLoadHeader;

const styles = StyleSheet.create({
  centerView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center'
  },
  container: {
    alignItems: 'center',
    backgroundColor: palette.black2,
    flexDirection: 'row',
    height: 88,
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
  leftView: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  rightView: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
