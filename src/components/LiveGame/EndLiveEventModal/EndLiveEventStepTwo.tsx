import { useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { StatusMatch } from '../../../../types';
import { EventTopics, SocketContext } from '../../../hooks/socketContext';
import { updateGameAction } from '../../../redux/slices/gamesSlice';
import {
  removeTrackingEvent,
  selectTrackingEvent,
  updateTrackingEvent
} from '../../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

type Props = {
  next: () => void;
};

const EndLiveEventStepTwo = ({ next }: Props) => {
  const navigation = useNavigation() as any;

  const { val, sendEvent } = useContext(SocketContext);

  const activeEvent = useAppSelector(selectTrackingEvent);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const method = val?.method;
    if (method === EventTopics.REPORT) {
      const eventStatus = { ...activeEvent.status } as StatusMatch;
      eventStatus.isFullReport = true;

      dispatch(
        updateTrackingEvent({
          ...activeEvent,
          status: eventStatus
        })
      );
      next();
    }
  }, [val?.method]);

  useEffect(() => {
    onEndWithoutFullReport();
  }, []);

  const onEndWithoutFullReport = () => {
    const eventStatus = { ...activeEvent.status } as StatusMatch;

    eventStatus.isFullReport = false;
    eventStatus.endTimestamp = Date.now();
    eventStatus.duration = Date.now() - eventStatus.startTimestamp;

    dispatch(
      updateTrackingEvent({
        ...activeEvent,
        status: eventStatus
      })
    );
    sendEvent(EventTopics.RESET);
    const event = { ...activeEvent, ...eventStatus };

    dispatch(updateGameAction(event));
    dispatch(removeTrackingEvent());

    navigation.goBack();

    setTimeout(
      () =>
        navigation.replace('Report', {
          eventId: event.id,
          wasPrevRouteLive: true
        }),
      1
    );

    // next();
  };

  return null;

  // return (
  //   <View style={styles.container}>
  //     <View
  //       style={{
  //         marginTop: 22
  //       }}
  //     />
  //     {/* <View style={styles.progressBar}>
  //       <View
  //         style={{
  //           ...styles.progressBarInner,
  //           width: `${progressBarInnerWidth()}%`
  //         }}
  //       />
  //     </View> */}
  //     <View style={styles.content}>
  //       <Text style={styles.text}>Make sure that:</Text>
  //       <View style={styles.item}>
  //         <Icon style={styles.itemIcon} icon="checkmark" />
  //         <Text style={styles.itemText}>The Edge is turned on</Text>
  //       </View>
  //       <View style={styles.item}>
  //         <Icon style={styles.itemIcon} icon="checkmark" />
  //         <Text style={styles.itemText}>The player tags are in range</Text>
  //       </View>
  //       <View style={styles.item}>
  //         <Icon style={styles.itemIcon} icon="checkmark" />
  //         <Text style={styles.itemText}>
  //           The iPad is turned on and in range of the edge
  //         </Text>
  //       </View>
  //       <View style={styles.item}>
  //         <Icon style={styles.itemIcon} icon="checkmark" />
  //         <Text style={styles.itemText}>
  //           The iPad screen is set to always on
  //         </Text>
  //       </View>
  //     </View>
  //     <View style={styles.buttonContainer}>
  //       {/* <Pressable
  //         onPress={() => {
  //           Alert.alert(
  //             'Are you sure?',
  //             "You might miss some data in your report, and we can't guarantee the validity of the dataset.",
  //             [
  //               {
  //                 text: 'Cancel',
  //                 style: 'cancel'
  //               },
  //               {
  //                 text: 'End',
  //                 style: 'destructive',
  //                 onPress: onEndWithoutFullReport
  //               }
  //             ],
  //             { cancelable: true }
  //           );
  //         }}
  //       >
  //         <Text style={styles.buttonText}>OK</Text>
  //       </Pressable> */}

  //       <ButtonNew
  //         text="OK"
  //         onPress={onEndWithoutFullReport}
  //         style={styles.buttonText}
  //       />
  //     </View>
  //   </View>
  // );
};

export default EndLiveEventStepTwo;
