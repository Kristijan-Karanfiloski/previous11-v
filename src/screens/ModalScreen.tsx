import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';

import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectSyncTime } from '../redux/slices/syncSlice';
import { useAppSelector } from '../redux/store';

import SyncScreen from './SyncScreen';

export default function ModalScreen(props: any) {
  const activeClub = useAppSelector(selectActiveClub);
  const syncTime = useAppSelector(selectSyncTime);
  const navigation = useNavigation();

  const [netInfo, setNetInfo] = useState<boolean | null>(null);

  useEffect(() => {
    const getNetworkState = async () => {
      const state = await NetInfo.fetch();
      setNetInfo(
        (state.isConnected ?? false) && (state.isInternetReachable ?? false)
      );
    };

    getNetworkState();
  }, []);
  console.log('netInfo', netInfo);

  if (netInfo === null) return null;

  if (!netInfo) {
    navigation.goBack();
    navigation.navigate('NetworkErrorModal', {
      title: 'Unable to sync data',
      text: `Please ensure that your iPad is connected to a Wi-Fi or cellular network (4G/5G) to proceed with data synchronization.`
    });
    return null;
  }

  return (
    <SyncScreen
      activeClub={activeClub}
      syncTime={syncTime}
      forceSync={props.route.params?.forceSync}
      onFinish={() => {
        console.log('on finish');
        props.navigation.canGoBack()
          ? props.navigation.goBack()
          : props.navigation.navigate('Drawer');
      }}
    />
  );
}
