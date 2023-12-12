import React from 'react';
import { ActivityIndicator, ColorValue, View } from 'react-native';

import { commonStyles } from '../../theme';

interface OverlayLoaderProps {
  isLoading: boolean;
  size?: 'small' | 'large';
  color?: ColorValue;
  isOverlay?: boolean;
}

const OverlayLoader = ({
  isLoading = true,
  size = 'large',
  color = '#ffff',
  isOverlay = true
}: OverlayLoaderProps) => {
  if (!isLoading) {
    return null;
  }

  if (!isOverlay) {
    return <ActivityIndicator size={size} color={color} />;
  }

  return (
    <View style={commonStyles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default OverlayLoader;
