import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { useSelector } from 'react-redux';

import bannerGrayscale from '../../../../assets/images/banner_activation_grayscale.jpg';
import bannerActivation from '../../../../assets/images/banner_activation_new.jpeg';
import bannerTablet from '../../../../assets/images/banner-tablet.png';
import { selectDeviceType } from '../../../redux/slices/deviceSlice';
import { color } from '../../../theme/color';
import { Icon } from '../../icon/icon';
export interface BannerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;
  hasLogin?: boolean;
  showLogo?: boolean;
  type?: string; // phone or tablet

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode;
  imageType?: string; // activation or landing
  grayscale?: boolean;

  onlyBg?: boolean;
  image?: boolean;
}
export const BANNER_HEIGHT = 232;

const Banner = (props: BannerProps) => {
  const {
    style,
    showLogo,
    children,
    imageType = 'activation',
    grayscale = true,
    onlyBg = false,
    image = false
  } = props;

  const isTablet = useSelector(selectDeviceType);
  return (
    <View style={[styles.container, style]}>
      {!onlyBg && !image && (
        <ImageBackground
          source={
            imageType === 'activation'
              ? grayscale
                ? bannerGrayscale
                : bannerActivation
              : bannerTablet
          }
          style={styles.background}
        >
          {grayscale && (
            <View
              style={StyleSheet.flatten([
                StyleSheet.absoluteFillObject,
                { backgroundColor: 'rgba(0,0,0,0.6)' }
              ])}
            />
          )}
          {showLogo && (
            <Icon
              icon="logo"
              style={{
                width: isTablet ? 316 : 180,
                height: isTablet ? 316 : 180
              }}
            />
          )}
          <View style={styles.contentWrapper}>{children}</View>
        </ImageBackground>
      )}
      {image && <View style={styles.contentWrapper}>{children}</View>}
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  container: {
    borderColor: color.palette.black,
    height: BANNER_HEIGHT,
    justifyContent: 'center',
    width: '100%'
  },
  contentWrapper: {
    backgroundColor: 'transparent',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  }
});
