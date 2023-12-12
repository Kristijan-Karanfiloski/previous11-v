import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import moment from 'moment';

import DevInfo from '../components/common/DevInfo';
import Dropdown from '../components/common/Dropdown';
import { Icon } from '../components/icon/icon';
import { clubFirestoreProps } from '../converters';
import { logoutUser } from '../redux/slices/authSlice';
import {
  selectActiveClub,
  selectClubs,
  setActiveClub
} from '../redux/slices/clubsSlice';
import { removeSyncTime } from '../redux/slices/syncSlice';
import { useAppSelector } from '../redux/store';
import { color } from '../theme';
import { variables } from '../utils/mixins';

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { state, navigation } = props;
  const clubs = useAppSelector(selectClubs);
  const club = useAppSelector(selectActiveClub);
  const dispatch = useDispatch();
  const date = moment(new Date());

  const onChange = (val: clubFirestoreProps) => {
    dispatch(removeSyncTime());
    dispatch(setActiveClub(val));
    navigation.closeDrawer();
  };

  const getLabelName = (name: string) => {
    if (name === 'Root') {
      return 'Home';
    }
    if (name === 'WeeklyLoad') {
      return 'Weekly Load';
    }
    if (name === 'AcuteChronic') {
      return 'Acute Chronic';
    }
    return name;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          <Icon icon="logoSecondary" />
          <TouchableOpacity onPress={() => navigation.closeDrawer()}>
            <Icon icon="grey_collapse" />
          </TouchableOpacity>
        </View>
        <View style={styles.dropdownWrapper}>
          <Dropdown
            value={club.id}
            onChange={onChange}
            options={clubs.map((item) => {
              return { label: item.name, value: item.id, data: item };
            })}
            placeholder="SELECT TEAM"
            label="Team"
            preventUnselect
          />
        </View>
        <View style={styles.dateWrapper}>
          <Text style={[styles.dateText, styles.timeText]}>
            {date.format('h:mm A')}
          </Text>
          <Text style={styles.dateText}>{date.format('ddd MMM Do')}</Text>
        </View>
        <View style={styles.itemsContainer}>
          {state.routes.map(({ name }, index) => {
            const label = getLabelName(name);
            const isSelected = getActiveRouteState(
              state.routes,
              state.index,
              name
            );
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  navigation.navigate(name);
                }}
              >
                <View style={styles.navigationItem}>
                  {isSelected && <View style={styles.nextIcon} />}
                  <Text
                    style={[styles.item, isSelected && styles.itemSelected]}
                  >
                    {label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => {
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
                    dispatch(logoutUser());
                  }
                }
              ],
              { cancelable: true }
            );
          }}
        >
          <View style={styles.logout}>
            <Icon icon="logout_large" />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>

        <DevInfo />
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawer;

type Routes = { name: string }[];
const getActiveRouteState = function (
  routes: Routes,
  index: number,
  name: string
) {
  return routes[index].name.toLowerCase().indexOf(name.toLowerCase()) >= 0;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 30,
    marginLeft: 32,
    marginRight: 22,
    marginTop: 22
  },
  dateText: {
    color: color.palette.tipGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    lineHeight: 21
  },
  dateWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 25
  },
  dropdownWrapper: {
    marginBottom: 30
  },
  item: {
    color: variables.grey,
    fontFamily: variables.mainFontMedium,
    fontSize: 40,
    fontWeight: '500',
    lineHeight: 60
  },
  itemSelected: {
    color: color.palette.orange
  },
  itemsContainer: {
    flex: 1
  },
  logoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22
  },
  logout: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  logoutText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    marginLeft: 21
  },
  navigationItem: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 6
  },
  nextIcon: {
    borderBottomColor: color.transparent,
    borderBottomWidth: 12,
    borderLeftColor: color.palette.orange,
    borderLeftWidth: 20,
    borderTopColor: color.transparent,
    borderTopWidth: 12,
    height: 0,
    marginRight: 17,
    width: 0
  },
  timeText: {
    marginRight: 17
  }
});
