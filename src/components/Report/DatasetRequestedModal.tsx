import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import Card from '../common/Card';
import FullScreenDialog from '../common/FullScreenDialog';
import { Icon } from '../icon/icon';

interface DatasetRequestedModalProps {
  onDismiss: () => void;
  buttonText?: string;
  isListingPlayerTags?: boolean;
}

const DatasetRequestedModal = ({
  onDismiss,
  buttonText,
  isListingPlayerTags = true
}: DatasetRequestedModalProps) => {
  return (
    <FullScreenDialog style={styles.modalContainer}>
      <Card>
        <View style={styles.rootContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              We are now fetching the full dataset from the edge device
            </Text>
          </View>

          <View style={styles.container}>
            <View
              style={{
                marginTop: 22
              }}
            />
            <View style={styles.content}>
              <Text style={styles.text}>Make sure that:</Text>
              <View style={styles.item}>
                <Icon style={styles.itemIcon} icon="checkmark" />
                <Text style={styles.itemText}>The Edge is turned on</Text>
              </View>
              {isListingPlayerTags && (
                <View style={styles.item}>
                  <Icon style={styles.itemIcon} icon="checkmark" />
                  <Text style={styles.itemText}>
                    The player tags are in range
                  </Text>
                </View>
              )}
              <View style={styles.item}>
                <Icon style={styles.itemIcon} icon="checkmark" />
                <Text style={styles.itemText}>
                  The iPad is turned on and in range of the edge
                </Text>
              </View>
              <View style={styles.item}>
                <Icon style={styles.itemIcon} icon="checkmark" />
                <Text style={styles.itemText}>
                  The iPad screen is set to always on
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <ButtonNew
                text={buttonText || 'Ok'}
                onPress={onDismiss}
                style={styles.buttonText}
              />
            </View>
          </View>
        </View>
      </Card>
    </FullScreenDialog>
  );
};

export default DatasetRequestedModal;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    width: '100%'
  },
  buttonText: {
    color: variables.red,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 6,
    marginTop: 54
  },
  container: {
    alignItems: 'center'
  },
  content: {
    borderBottomColor: variables.lightestGrey,
    borderBottomWidth: 1,
    marginBottom: 25,
    paddingBottom: 12,
    width: '100%'
  },
  header: {
    alignItems: 'center',
    borderBottomColor: variables.lightestGrey,
    borderBottomWidth: 1
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16
  },
  itemIcon: {
    marginRight: 10
  },
  itemText: {
    fontFamily: variables.mainFont,
    fontSize: 16
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  rootContainer: {
    paddingBottom: 45,
    paddingHorizontal: 50,
    paddingTop: 20,
    width: 485
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    marginBottom: 20
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginBottom: 18,
    marginTop: 20,
    textAlign: 'center'
  }
});
