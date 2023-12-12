import { StyleSheet } from 'react-native';

import { utils, variables } from '../utils/mixins';

import { color } from './color';
import { typography } from './typography';

export const commonStyles = StyleSheet.create({
  FOOTER_CONTENT: {
    alignItems: 'center',
    color: color.primary,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  NEXT_LINK: {
    color: color.primary,
    fontFamily: typography.fontMedium,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'right'
  },
  dot: {
    backgroundColor: color.primary,
    borderRadius: 5,
    height: 10,
    width: 10
  },
  flexRowCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  line: {
    backgroundColor: color.palette.white,
    height: 1,
    marginBottom: 34,
    marginTop: 8,
    width: '100%'
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: utils.rgba('#000000', 0.3),
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000
  },
  sepparator: {
    backgroundColor: variables.lineGrey,
    height: 1,
    marginVertical: 18
  },
  settingsCardContainer: {
    backgroundColor: variables.realWhite,
    borderRadius: 3,
    flexDirection: 'column',
    marginBottom: 60,
    marginTop: 12,
    paddingHorizontal: 30,
    paddingVertical: 30,
    shadowColor: variables.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20
  },
  welcomeText: {
    color: variables.textBlack,
    fontFamily: typography.fontRegular,
    fontSize: 30,
    lineHeight: 40,
    textAlign: 'center'
  }
});
