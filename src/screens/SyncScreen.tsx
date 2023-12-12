import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';

import imgBg from '../assets/images/choose_team_bg.png';
import OverlayLoader from '../components/common/OverlayLoader';
import { clubFirestoreProps } from '../converters';
import { needSync, refreshData } from '../redux/slices/syncSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { variables } from '../utils/mixins';

interface SyncScreenProps {
  activeClub: clubFirestoreProps;
  syncTime?: number;
  onFinish?: () => void;
  forceSync?: boolean;
}

const SyncScreen = (props: SyncScreenProps) => {
  const showSync = useAppSelector(needSync);
  const { syncTime, onFinish, forceSync } = props;
  const [screenOpened, setScreenOpened] = useState(false);

  const syncTimeRef = useRef(syncTime).current;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (screenOpened) {
      // dispatch(setActiveClub(props.activeClub));
      dispatch(refreshData());
    }
  }, [screenOpened]);

  useEffect(() => {
    if (syncTime !== syncTimeRef && screenOpened) {
      console.log('onfinish effect');
      onFinish && onFinish();
    }
  }, [syncTime, screenOpened]);

  return (
    <ImageBackground
      defaultSource={imgBg}
      style={[StyleSheet.absoluteFill, styles.container]}
      onLayout={() => setScreenOpened(true)}
    >
      <Text style={styles.title}>Syncing data...</Text>

      <OverlayLoader
        isLoading={showSync || !!forceSync}
        isOverlay={false}
        color={variables.red}
      />
    </ImageBackground>
  );
};

export default SyncScreen;

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  title: {
    color: 'white',
    fontFamily: variables.mainFontBold,
    fontSize: 27,
    marginBottom: 21
  }
});
