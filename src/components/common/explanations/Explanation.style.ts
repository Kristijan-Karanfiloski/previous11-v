import { StyleSheet } from 'react-native';

import { variables } from '../../../utils/mixins';

export const styles = StyleSheet.create({
  border: {
    borderColor: '#F2F2F2',
    borderWidth: 0.5,
    width: '100%'
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: variables.pinkishRed,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    width: 177
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: variables.mainFont,
    fontSize: 16,
    fontWeight: '600'
  },
  formulaImage: {
    height: 60,
    marginBottom: 10,
    width: 120
  },
  header: {
    color: variables.black,
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 40
  },
  innerContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-around',
    marginHorizontal: 40
  },
  loadMoreBoldText: {
    fontSize: 16,
    fontWeight: '600'
  },
  loadMoreInnerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadMoreText: {
    fontFamily: variables.mainFont,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center'
  },
  mainContainer: {
    backgroundColor: 'white',
    height: 430,
    width: 490
  },
  mainContainerBestMatch: {
    height: 535
  },
  mainContainerIntensityZones: {
    height: 642
  },
  mainContainerLoadData: {
    height: 750
  },
  mainContainerPlayerLoad: {
    height: 655
  },
  text: {
    fontFamily: variables.mainFont,
    fontSize: 14,
    textAlign: 'center'
  }
});
