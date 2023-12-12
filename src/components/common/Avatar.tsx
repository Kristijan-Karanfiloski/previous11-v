import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageResizeMode,
  PixelRatio,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { color } from '../../theme';
import { utils } from '../../utils/mixins';

const WIDTH = 106;
const HEIGHT = 106;
interface AvatarProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;
  photo?: any;
  photoUrl?: string | null;
  enableUpload?: boolean;
  resizeMode?: ImageResizeMode;
  offlineId?: string;
}

const Avatar = (props: AvatarProps) => {
  const { style, enableUpload, photoUrl, resizeMode, offlineId } = props;

  const [sourceUri, setSourceUri] = useState<any>(null);
  const [photoValid, setPhotoValid] = useState(false);

  const cameraDim = Math.round((((style?.width as number) || 106) / 106) * 32);

  useEffect(() => {
    if (photoUrl) {
      const key = utils.encodeBase64(photoUrl);
      AsyncStorage.getItem(`images/${key}`)
        .then((base64Img) => {
          setSourceUri(
            base64Img ? { uri: `data:image/jpeg;base64,${base64Img}` } : null
          );
          setPhotoValid(!!base64Img);
        })
        .catch(() => {
          setSourceUri(null);
          setPhotoValid(false);
        });
    }
  }, [photoUrl]);

  return (
    <View style={[styles.rootContainer, style]}>
      <View style={[styles.container, style]}>
        <View style={styles.avatarWrapper}>
          {photoValid
            ? (
            <Image
              style={styles.image}
              source={sourceUri}
              resizeMode={resizeMode}
            />
              )
            : (
            <FontAwesome5
              name="user-alt"
              size={(style?.width ? (style.width as number) : 48) / 2}
              color={color.palette.lightBlack}
            />
              )}
        </View>
      </View>
      {!!enableUpload && (
        <View
          style={[
            styles.cameraWrapper,
            { width: cameraDim, height: cameraDim }
          ]}
        >
          <MaterialCommunityIcons
            name="camera-plus-outline"
            size={12}
            color="white"
          />
        </View>
      )}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%'
  },
  cameraWrapper: {
    alignItems: 'center',
    backgroundColor: color.primary,
    borderRadius: 50,
    bottom: -3,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: -3,
    width: 32
  },
  container: {
    alignItems: 'center',
    backgroundColor: color.palette.grey,
    borderColor: color.primary,
    borderRadius: WIDTH / PixelRatio.get(),
    borderWidth: 5,
    height: HEIGHT,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    width: WIDTH
  },
  image: {
    backgroundColor: 'transparent',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  rootContainer: {
    borderColor: 'transparent',
    height: HEIGHT,
    position: 'relative',
    width: WIDTH
  }
});
