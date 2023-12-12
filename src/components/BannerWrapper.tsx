import React from 'react';
import { StyleSheet, View } from 'react-native';

import { color } from '../theme/color';
import { variables } from '../utils/mixins';

import Banner, { BANNER_HEIGHT } from './common/banner';
import Button from './common/Button';
import OverlayLoader from './common/OverlayLoader';
import { RedLine } from './common/RedLine';

interface BannerWrapperProps {
  children: React.ReactNode;
  navBtn?: null | string;
  navCallback?: () => void;
  isLoading?: boolean;
  demoBtn?: boolean;
  demoCallback?: () => void;
}
const bannerHeight = variables.deviceHeight * 0.4;
const BannerWrapper = (props: BannerWrapperProps) => {
  const {
    navBtn,
    navCallback,
    isLoading,
    demoBtn = false,
    demoCallback
  } = props;

  return (
    <View style={styles.container}>
      <RedLine top={false} />
      <Banner style={styles.banner} showLogo />
      <RedLine top={false} />
      <View
        style={[
          styles.absolute,
          {
            alignItems: 'center',
            paddingTop: bannerHeight - variables.loginHeaderHeight + 20
          }
        ]}
      >
        {props.children}
      </View>

      {navBtn && (
        <View style={styles.btnWrapper}>
          <Button
            customStyle={StyleSheet.flatten([styles.loginBtn, styles.btn])}
            mode="white"
            content={navBtn || 'Login'}
            onPressed={() => navCallback && navCallback()}
          />
          {demoBtn && (
            <Button
              customStyle={StyleSheet.flatten([styles.demoBtn, styles.btn])}
              mode="white"
              content={'Try Demo Account'}
              onPressed={() => demoCallback && demoCallback()}
            />
          )}
        </View>
      )}

      <OverlayLoader isLoading={!!isLoading} />
    </View>
  );
};

export default BannerWrapper;

const styles = StyleSheet.create({
  absolute: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  banner: {
    backgroundColor: color.palette.realBlack,
    height: BANNER_HEIGHT + 268,
    resizeMode: 'contain',
    width: '100%'
  },
  btn: {
    color: color.primary,
    justifyContent: 'flex-start',
    marginBottom: 52,
    width: 'auto'
  },
  btnWrapper: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%'
  },
  container: {
    alignItems: 'center',
    backgroundColor: variables.white,
    flexDirection: 'column',
    height: variables.deviceHeight,
    width: variables.deviceWidth
  },
  demoBtn: {
    alignSelf: 'flex-end',
    marginRight: 71
  },
  loginBtn: {
    alignSelf: 'flex-start',
    marginLeft: 71
  }
});
