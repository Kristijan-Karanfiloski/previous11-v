import { StyleSheet } from 'react-native';

import { variables } from '../../../utils/mixins';

export const commonStylesTooltip = StyleSheet.create({
  heading: {
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 8
  },
  subHeading: {
    fontFamily: variables.mainFontBold,
    fontSize: 14
  },
  text: { fontFamily: variables.mainFont, fontSize: 14, marginBottom: 44 },
  title: {
    fontFamily: variables.mainFontBold,
    fontSize: 22,
    marginBottom: 10
  }
});
