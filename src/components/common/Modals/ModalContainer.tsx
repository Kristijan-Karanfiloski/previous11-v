import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { commonStyles } from '../../../theme';
import { variables } from '../../../utils/mixins';
import Card from '../Card';
import FullScreenDialog from '../FullScreenDialog';

type Props = {
  close: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  hideCloseButton?: boolean;
  hasTitleBorder?: boolean;
};

export default function ModalContainer({
  close,
  title,
  subtitle,
  children,
  containerStyle,
  hideCloseButton,
  hasTitleBorder = true
}: Props) {
  return (
    <FullScreenDialog style={styles.modalContainer}>
      <Card
        style={StyleSheet.flatten([
          commonStyles.settingsCardContainer,
          {
            borderRadius: 20
          },
          containerStyle
        ])}
      >
        {!hideCloseButton && (
          <Pressable onPress={close} style={styles.closeButton}>
            <Ionicons name="close" size={26} color={variables.red} />
          </Pressable>
        )}
        <View
          style={[
            styles.header,
            hasTitleBorder && {
              borderBottomColor: variables.lineGrey,
              borderBottomWidth: 1
            }
          ]}
        >
          <Text style={styles.title}>{title}</Text>

          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.content}>{children}</View>
      </Card>
    </FullScreenDialog>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10
  },
  content: {
    paddingTop: 12
  },
  header: {
    alignItems: 'center',
    height: 90,
    justifyContent: 'center'
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    color: variables.placeHolderGrey,
    fontFamily: variables.mainFont,
    fontSize: 16,
    textAlign: 'center'
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    textAlign: 'center'
  }
});
