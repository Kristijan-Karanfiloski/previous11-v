import React, { useRef } from 'react';
import {
  ActionSheetIOS,
  findNodeHandle,
  Keyboard,
  TouchableOpacity,
  View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface TakePhotoProps {
  onSuccess?: (result: { uri: string }) => void;
  children: JSX.Element;
}

const MEDIA_INFO: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.1,
  selectionLimit: 1,
  allowsMultipleSelection: false
};

const TakePhoto = (props: TakePhotoProps) => {
  const anchor = useRef(null);

  const checkCameraPermission = async (isChoosePhoto = false) => {
    const { status } = isChoosePhoto
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      return alert(
        `Sorry, we need camera ${
          isChoosePhoto && 'roll'
        } permissions to make this work!`
      );
    }

    if (isChoosePhoto) {
      return await goToChoosePhoto();
    }
    await goToTakePhoto();
  };
  const goToChoosePhoto = async () => {
    const { onSuccess } = props;
    try {
      const result = await ImagePicker.launchImageLibraryAsync(MEDIA_INFO);
      if (!result.canceled) {
        onSuccess && onSuccess({ uri: result.assets[0].uri });
      }
    } catch (e: any) {
      alert(e.message);
      console.log(e);
    }
  };

  const goToTakePhoto = async () => {
    const { onSuccess } = props;

    try {
      const result = await ImagePicker.launchCameraAsync(MEDIA_INFO);
      if (!result.canceled) {
        onSuccess && onSuccess({ uri: result.assets[0].uri });
      }
    } catch (e: any) {
      alert(e.message);
      console.log(e);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Choose from album', 'Take a photo'],
            anchor: findNodeHandle(anchor.current) as number
          },
          (buttonIndex) => {
            if (buttonIndex === 0) {
              checkCameraPermission(true);
            } else if (buttonIndex === 1) {
              checkCameraPermission(false);
            }
          }
        );
      }}
    >
      <View ref={anchor}>{props.children}</View>
    </TouchableOpacity>
  );
};

export default TakePhoto;
