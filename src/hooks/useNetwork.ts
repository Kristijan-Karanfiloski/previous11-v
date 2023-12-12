import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import API_ENDPOINTS from '../helpers/api_endpoints';
import { selectConfig, setEdgeDeviceName } from '../redux/slices/configSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

// check if the device is online or offline
const useNetwork = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(selectConfig);
  // const activeClub = useAppSelector(selectActiveClub);
  const [isConnectedToEdge, setIsConnectedToEdge] = useState(false);
  const [edgeName, setEdgeName] = useState('');

  const timeoutEdgeRef = useRef<NodeJS.Timeout>();
  const timeoutTagsRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // interval to check api endpoint status
    checkApiEndpoint();

    return () => {
      timeoutEdgeRef.current && clearTimeout(timeoutEdgeRef.current);

      timeoutTagsRef.current && clearTimeout(timeoutTagsRef.current);
    };
  }, []);

  useEffect(() => {
    if (
      (edgeName && edgeName !== config.edgeDeviceName) ||
      !config.edgeDeviceName
    ) {
      dispatch(setEdgeDeviceName(edgeName));
      setEdgeName('');
    }
  }, [edgeName, config.edgeDeviceName]);

  const setEdgeConnection = (connected: boolean) => {
    setIsConnectedToEdge(connected);
  };

  const checkApiEndpoint = async () => {
    axios
      .get(API_ENDPOINTS.EDGE_DEVICE_CONNECTION, {
        timeout: 5000
      })
      .then((res) => {
        console.log('[API CHECK EDGE] ', res.status, res.data);
        if (res.status === 200) {
          const { hostname } = res.data;
          setEdgeName(hostname);
          setEdgeConnection(true);
          // firestore().enableNetwork();
        } else {
          setEdgeConnection(false);

          // firestore().disableNetwork();
        }
      })
      .catch((err) => {
        console.log('[API EDGE ERR]', err);
        setEdgeConnection(false);

        // firestore().disableNetwork();
      })
      .finally(async () => {
        timeoutEdgeRef.current = setTimeout(checkApiEndpoint, 3000);
      });
  };

  return { connected: isConnectedToEdge, setIsConnectedToEdge };
};

export default useNetwork;
