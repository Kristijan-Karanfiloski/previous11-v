import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SyncButton() {
  const navigation = useNavigation();

  const rotationValue = React.useRef(new Animated.Value(0)).current;
  const onSyncPress = () => {
    animateSyncIcon();
    navigation.navigate('SyncModal', {
      forceSync: true
    });
  };

  const animateSyncIcon = () => {
    return Animated.timing(rotationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(rotationValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start();
    });
  };

  const spin = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  return (
    <Pressable style={styles.container} onPress={onSyncPress}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialCommunityIcons name="sync" size={24} color="white" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15
  }
});
