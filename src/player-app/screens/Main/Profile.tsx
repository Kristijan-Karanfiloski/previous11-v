import * as React from 'react';
import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as Application from 'expo-application';

import DevInfo from '../../../components/common/DevInfo';
import OverlayLoader from '../../../components/common/OverlayLoader';
import { Icon } from '../../../components/icon/icon';
import API from '../../../helpers/api';
import { logoutUser, selectAuth } from '../../../redux/slices/authSlice';
import { updatePlayerAction } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { useAppDispatch } from '../../../redux/store-player';
import { color } from '../../../theme';
import { stopFcm } from '../../../utils/fcm';
import { variables } from '../../../utils/mixins';

interface ProfileProps {
  navigation: any;
}

const Profile = ({ navigation }: ProfileProps) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const [isLoading, setIsLoading] = React.useState(false);

  const deleteProfile = () => {
    setIsLoading(true);
    const playerId = auth.playerId;

    API.disableEmail(auth.email)
      .then(() => dispatch(updatePlayerAction({ id: playerId, deleted: true })))
      .then(() => dispatch(logoutUser()))
      .catch(() => Alert.alert('Something went wrong'))
      .finally(() => setIsLoading(false));
  };

  const renderEmailField = () => {
    if (!auth || !auth.email) {
      return null;
    }

    return (
      <Pressable
        onPress={() => navigation.navigate('ChangeEmail')}
        style={styles.rowItem}
      >
        <View style={styles.groupItems}>
          <Text style={{ fontSize: 14, fontFamily: variables.mainFont }}>
            Email:
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: variables.mainFont,
              marginLeft: 5
            }}
          >
            {auth.email}
          </Text>
        </View>
        <View style={styles.groupItems}>
          <Text style={styles.changeBtn}>Change</Text>
          <Icon
            icon="arrow_next"
            style={{
              color: variables.chartLightGrey,
              width: 9
            }}
          />
        </View>
      </Pressable>
    );
  };

  const renderPasswordField = () => {
    return (
      <Pressable
        style={styles.rowItem}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <View style={styles.groupItems}>
          <Text style={{ fontSize: 14, fontFamily: variables.mainFont }}>
            Password:
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: variables.mainFont,
              marginLeft: 5
            }}
          >
            *******
          </Text>
        </View>
        <View style={styles.groupItems}>
          <Text style={styles.changeBtn}>Change</Text>
          <Icon
            icon="arrow_next"
            style={{
              color: variables.chartLightGrey,
              width: 9
            }}
          />
        </View>
      </Pressable>
    );
  };

  const renderHelpField = () => {
    return (
      <Pressable
        onPress={() => {
          const body = encodeURIComponent(
            `\n\nAccount information: \n user account: ${auth.email} \n app version: ${Application.nativeApplicationVersion} (${Application.nativeBuildVersion}) `
          );

          Linking.openURL(
            `mailto:hello@next11.com?subject=Support&body=${body}`
          ).catch((err) => {
            alert(err);
          });
        }}
        style={styles.rowItem}
      >
        <Text style={{ fontSize: 14, fontFamily: variables.mainFont }}>
          Help & Feedback
        </Text>

        <View style={styles.groupItems}>
          <Icon
            icon="arrow_next"
            style={{
              color: variables.chartLightGrey,
              width: 9
            }}
          />
        </View>
      </Pressable>
    );
  };

  const renderAppVersionField = () => {
    return (
      <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
        <Text
          style={styles.versionText}
        >{`Version number: ${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}</Text>
      </View>
    );
  };

  return (
    <View>
      {isLoading && <OverlayLoader isLoading={isLoading} />}
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>ACCOUNT INFORMATION</Text>
          {renderEmailField()}
          {renderPasswordField()}
          {renderHelpField()}
          {renderAppVersionField()}
          <View style={{ paddingLeft: 16 }}>
            <DevInfo />
          </View>
        </View>

        <View
          style={{
            rowGap: 10
          }}
        >
          <Pressable
            style={styles.btn}
            onPress={() =>
              Alert.alert(
                'Are you sure you want to log out?',
                '',
                [
                  {
                    text: 'Cancel',
                    style: 'default'
                  },
                  {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                      const topic =
                        `~${auth.teamName}~${auth.customerName}`.replace(
                          /[^a-zA-Z0-9-_.~%]+/g,
                          ''
                        );
                      stopFcm(topic);
                      dispatch(logoutUser());
                    }
                  }
                ],
                { cancelable: true }
              )
            }
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: variables.mainFontBold,
                color: color.palette.orange
              }}
            >
              Logout
            </Text>
          </Pressable>

          <Pressable
            style={styles.btn}
            onPress={() =>
              Alert.alert(
                'Are you sure you want to delete your profile?',
                'Your profile will be deleted but your coach will still have access to your data. If you want to delete your data send us an email at hello@next11.com ',
                [
                  {
                    text: 'Cancel',
                    style: 'default'
                  },
                  {
                    text: 'Delete Profile',
                    style: 'destructive',
                    onPress: deleteProfile
                  }
                ],
                { cancelable: true }
              )
            }
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: variables.mainFontBold,
                color: color.palette.tipGrey
              }}
            >
              Delete Profile
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: 44,
    justifyContent: 'center'
  },
  changeBtn: {
    color: color.palette.tipGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginRight: 18
  },
  container: {
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 15
  },
  groupItems: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: color.palette.lighterGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
    paddingLeft: 21,
    paddingRight: 15
  },
  title: {
    color: color.palette.tipGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginBottom: 27,
    paddingLeft: 16
  },
  versionText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 14
  }
});
