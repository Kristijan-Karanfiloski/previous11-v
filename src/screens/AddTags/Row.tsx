import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Dropdown from '../../components/common/Dropdown';
import { variables } from '../../utils/mixins';

type TagState = { macId: string; tagId: null | string };

type Props = {
  macId: string;
  value: string | null;
  tagsState: TagState[];
  tags: Record<string, string>;
  setTagsState: React.Dispatch<React.SetStateAction<TagState[]>>;
};

const Row = ({ macId, value, tagsState, tags, setTagsState }: Props) => {
  const currenlyAddedTags = tagsState
    .filter(({ tagId }) => !!tagId)
    .map(({ tagId }) => tagId);

  const optionsArray = new Array(99)
    .fill(null)
    .map((_, index) => (index + 1).toString());

  const getOptions = () => {
    const alreadyAddedTags = Object.values(tags);
    return optionsArray
      .filter((val) => !alreadyAddedTags.includes(val))
      .map((val) => ({ label: val, value: val }));
  };

  const options = getOptions().filter(
    (item) => !currenlyAddedTags.includes(item.value) || item.value === value
  );

  const onChange = (val: string | null, id: string) => {
    setTagsState((prevState) =>
      prevState.map((item) => {
        if (item.macId === id) {
          return { macId: item.macId, tagId: val };
        }
        return item;
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.rowText}>{macId}</Text>
      <View style={styles.column}>
        <Dropdown
          uiType="two"
          containerStyle={{ width: 80 }}
          dropdownWidth={100}
          dropdownHeight={200}
          dropdownPositon="right"
          value={value}
          options={options}
          onChange={(val) => onChange(val, macId)}
          placeholder="-"
        />
      </View>
    </View>
  );
};

export default Row;

const styles = StyleSheet.create({
  column: {
    width: 100
  },
  container: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderBottomWidth: 1,
    borderColor: variables.backgroundColor,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 30
  },
  rowText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont
  }
});
