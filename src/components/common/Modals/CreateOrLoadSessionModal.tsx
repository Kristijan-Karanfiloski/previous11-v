import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SocketContext } from '../../../hooks/socketContext';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';
import ButtonNew from '../ButtonNew';

import ModalContainer from './ModalContainer';

type Props = {
  close: () => void;
  onCreate: () => void;
  onLoad: () => void;
};

const CreateOrLoadSessionModal = ({ close, onCreate, onLoad }: Props) => {
  const { isReady } = useContext(SocketContext);
  return (
    <ModalContainer
      containerStyle={{ width: 470 }}
      title="Create New or Load Session?"
      close={close}
    >
      <View style={styles.content}>
        <Text style={styles.text}>
          Choose between creating a new event or loading a previously tracked
          session, if you've recorded a session without using your iPad.
          {'\n'}
          {'\n'}Please ensure that you are connected to the Edge, if you wish to
          load a completed session.
        </Text>
      </View>
      <Text style={styles.textSecondary}>Connection status:</Text>
      <View style={styles.wrapper}>
        <Text style={styles.textTeriery}>Edge Device</Text>
        <View style={styles.wrapper}>
          <Icon
            style={styles.icon}
            icon={isReady ? 'icon_connected' : 'icon_disconnected'}
          />
          <Text style={styles.textTeriery}>
            {isReady ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <ButtonNew style={styles.btn} text="Create New" onPress={onCreate} />
        <ButtonNew disabled={!isReady} text="Load Session" onPress={onLoad} />
      </View>
    </ModalContainer>
  );
};

export default CreateOrLoadSessionModal;

const styles = StyleSheet.create({
  btn: {
    marginRight: 20
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30
  },
  content: {
    borderBottomColor: variables.backgroundColor,
    borderBottomWidth: 1,
    marginBottom: 26,
    paddingBottom: 26
  },
  icon: {
    marginBottom: 2,
    marginRight: 12
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFont
  },
  textSecondary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    marginBottom: 15
  },
  textTeriery: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12,
    marginRight: 50
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
