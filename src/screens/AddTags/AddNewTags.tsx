import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ButtonNew from '../../components/common/ButtonNew';
import {
  selectConfig,
  updateConfigTagsAction
} from '../../redux/slices/configSlice';
import { selectOnlineTags } from '../../redux/slices/onlineTagsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { variables } from '../../utils/mixins';

import ResponseHandlerModal from './ResponseHandlerModal';
import Row from './Row';

type TagState = { macId: string; tagId: null | string };

const AddNewTags = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { tags } = useAppSelector(selectConfig);
  const onlineTags = useAppSelector(selectOnlineTags);
  const onlineNotAddedTags = onlineTags
    .filter(({ id }) => !Object.keys(tags).includes(id))
    .map(({ id }) => ({ macId: id, tagId: null } as TagState));

  const [tagsState, setTagsState] = useState<TagState[]>(onlineNotAddedTags);
  const [showModal, setShowModal] = useState('');

  const isSubmitDisabled = () => {
    return !tagsState.filter(({ tagId }) => !!tagId).length;
  };

  const onSubmit = () => {
    const addedTagsArr = tagsState.filter(({ tagId }) => !!tagId);
    const addedTags = addedTagsArr.reduce(
      (a, item) => ({ ...a, [item.macId]: item.tagId }),
      {}
    );
    dispatch(updateConfigTagsAction(addedTags))
      .then(() => {
        setShowModal('success');
      })
      .catch(() => setShowModal('error'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {!!tagsState.length && (
          <View style={styles.tableHeaders}>
            <Text style={styles.tableHeader}>Tag ID</Text>
            <Text
              style={StyleSheet.flatten([styles.tableHeader, styles.column])}
            >
              Tag Nr.
            </Text>
          </View>
        )}
        {!tagsState.length && (
          <Text style={styles.msgText}>You have no unassigned tags</Text>
        )}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.tagsContainer}
        >
          {tagsState.map(({ macId, tagId }) => (
            <Row
              key={macId}
              macId={macId}
              value={tagId}
              tagsState={tagsState}
              tags={tags}
              setTagsState={setTagsState}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonsContainer}>
        <ButtonNew
          style={styles.cancelButton}
          mode="secondary"
          onPress={navigation.goBack}
          text="Cancel"
        />
        <ButtonNew
          disabled={isSubmitDisabled()}
          mode="primary"
          onPress={onSubmit}
          text="Add Tag"
        />
      </View>
      {!!showModal && (
        <ResponseHandlerModal
          success={showModal === 'success'}
          close={() => setShowModal('')}
        />
      )}
    </View>
  );
};

export default AddNewTags;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 75,
    marginTop: 'auto'
  },
  cancelButton: {
    marginRight: 20
  },
  column: {
    width: 100
  },
  container: {
    flex: 1,
    marginTop: 14
  },
  content: {
    flex: 1,
    marginBottom: 40
  },
  msgText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    marginTop: 40,
    textAlign: 'center'
  },
  tableHeader: {
    fontFamily: variables.mainFontMedium
  },
  tableHeaders: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderBottomWidth: 1,
    borderColor: variables.backgroundColor,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
  tagsContainer: { backgroundColor: variables.backgroundColor }
});
