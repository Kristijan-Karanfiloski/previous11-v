import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';

import { variables } from '../../utils/mixins';

interface FullScreenDialogProps {
  children: React.ReactNode;
  onDismiss?: () => void;
  style?: ViewStyle;
  backdropPress?: boolean;
}

const FullScreenDialog = (props: FullScreenDialogProps) => {
  const { style, onDismiss, children, backdropPress = true } = props;

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        StyleSheet.absoluteFill,
        style,
        {
          opacity
        }
      ]}
    >
      <TouchableWithoutFeedback
        onPress={() => backdropPress && onDismiss && onDismiss()}
      >
        <View style={[styles.modalBg, StyleSheet.absoluteFill]} />
      </TouchableWithoutFeedback>
      <React.Fragment>{children}</React.Fragment>
    </Animated.View>
  );
};

export default FullScreenDialog;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    zIndex: 999
  },
  modalBg: {
    backgroundColor: variables.black,
    height: '100%',
    opacity: 0.6,
    width: '100%'
  }
});
