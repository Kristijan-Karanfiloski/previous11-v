import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Card from '../../components/common/Card';
import { Icon } from '../../components/icon/icon';
import TagsOverview from '../../components/TagsOverview';
import { SocketContext } from '../../hooks/socketContext';
import { selectConfig } from '../../redux/slices/configSlice';
import { selectOnlineTags } from '../../redux/slices/onlineTagsSlice';
// import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { useAppSelector } from '../../redux/store';
// import { getPlayersMacIds } from '../../utils';
import { variables } from '../../utils/mixins';

import ConnectionOverviewNoEdge from './components/ConnectionOverviewNoEdge';
import ConnectionOverviewNoTags from './components/ConnectionOverviewNoTags';

const ConnectionOverview = () => {
  const { edgeConnected } = useContext(SocketContext);
  const navigation = useNavigation();
  const config = useAppSelector(selectConfig);
  const onlineTags = useAppSelector(selectOnlineTags);
  // const players = useAppSelector(selectAllPlayers);

  // const macIds = getPlayersMacIds(
  //   players.map(({ id }) => id),
  //   players,
  //   config.tags
  // );

  const numberOfTagsConnected = onlineTags.length;

  const renderConnectionInfo = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.topWrapper}>
          <Icon
            style={styles.icon}
            icon={edgeConnected ? 'icon_connected' : 'icon_disconnected'}
          />
          <Text numberOfLines={1}>
            {edgeConnected && config.edgeDeviceName
              ? `Connected Egde: ${config.edgeDeviceName}`
              : 'No Edge Connected'}
          </Text>
        </View>

        <View
          style={[
            styles.topWrapper,
            {
              marginLeft: 40
            }
          ]}
        >
          <Icon
            style={styles.icon}
            icon={
              numberOfTagsConnected !== 0
                ? 'icon_connected'
                : 'icon_disconnected'
            }
          />
          <Text numberOfLines={1}>
            {numberOfTagsConnected !== 0
              ? `${numberOfTagsConnected} tags connected`
              : 'No Tags Connected'}
          </Text>
        </View>
      </View>
    );
  };

  const renderScreen = () => {
    if (!edgeConnected) {
      return <ConnectionOverviewNoEdge />;
    }
    if (numberOfTagsConnected === 0) {
      return <ConnectionOverviewNoTags />;
    }
    return <TagsOverview />;
  };

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={navigation.goBack} style={styles.closeIcon}>
            <AntDesign name="close" size={21} color={variables.red} />
          </Pressable>

          <View style={styles.handle} />
        </View>
        <Text style={styles.heading}>Connection Overview</Text>

        {renderConnectionInfo()}
      </Card>
      {renderScreen()}
    </View>
  );
};

export default ConnectionOverview;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: variables.realWhite,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 6,
    padding: 20,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  closeIcon: {
    left: 0,
    position: 'absolute',
    top: -5
  },
  handle: {
    backgroundColor: variables.lightGrey,
    borderRadius: 4,
    height: 5,
    marginBottom: 10,
    width: 70
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  heading: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    textAlign: 'center'
  },
  icon: {
    marginRight: 10
  },
  mainContainer: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    marginTop: 65
  },
  topWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  }
});
