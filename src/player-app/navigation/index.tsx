import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import moment from 'moment';

import bgSplash from '../../assets/images/bg_corner_splash.png';
import { Icon } from '../../components/icon/icon';
import { authFirestoreProps, clubFirestoreProps } from '../../converters';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { useAppSelector } from '../../redux/store-player';
import { color } from '../../theme';
import {
  ActivitiesStackParamList,
  PlayerAuthStackParamList,
  PlayerMainStackParamList,
  ProfileStackParamList,
  ProgressStackParamList
} from '../../types';
import { variables } from '../../utils/mixins';
import BackButton from '../components/BackButton';
import FilterButton from '../components/FilterButton';
import Activation from '../screens/Auth/Activation';
import CreateProfile from '../screens/Auth/CreateProfile';
import Login from '../screens/Auth/Login';
import ResetPassword from '../screens/Auth/ResetPassword';
import ResetPasswordConfirmation from '../screens/Auth/ResetPasswordConfirmation';
import AccuteScreen from '../screens/Main/AccuteScreen';
import Activities from '../screens/Main/Activities';
import ActivityInfo from '../screens/Main/ActivityInfo';
import ChangePassword from '../screens/Main/ChangePassword';
import FilterModal from '../screens/Main/FilterModal';
import Profile from '../screens/Main/Profile';
import ProgressScreen from '../screens/Main/ProgressScreen';
import ProgressDashboard from '../screens/Main/ProgressScreenDashboard';
import TeamEffortScreen from '../screens/Main/TeamEffortScreen';
import TooltipModal from '../screens/Main/TooltipModal';
import WeeklyEffort from '../screens/Main/WeeklyEffort';
import Wellness from '../screens/Main/Wellness';

const switchNavigator = (
  auth: authFirestoreProps,
  activeClub: clubFirestoreProps
) => {
  if (auth && activeClub) {
    return <MainStackNavigator />;
  }

  return <AuthNavigation />;
};

const Stack = createStackNavigator<PlayerAuthStackParamList>();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Activation" component={Activation} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen
        name="ResetPasswordConfirmation"
        component={ResetPasswordConfirmation}
      />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
    </Stack.Navigator>
  );
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={() => {
          return {
            headerShown: true,
            headerTitleStyle: styles.headerText,

            headerBackground: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={bgSplash}
                  style={styles.bgSplash}
                  resizeMode="cover"
                />
              </View>
            )
          };
        }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerLeft: () => {
              return <BackButton text="profile" onPress={navigation.goBack} />;
            }
          };
        }}
      />
      <ProfileStack.Screen
        name="ChangeEmail"
        component={ChangePassword}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerLeft: () => {
              return <BackButton text="profile" onPress={navigation.goBack} />;
            }
          };
        }}
      />
    </ProfileStack.Navigator>
  );
};

const ProgressStack = createStackNavigator<ProgressStackParamList>();
const ProgressStackNavigator = () => {
  return (
    <ProgressStack.Navigator>
      <ProgressStack.Screen
        name="ProgressScreen"
        component={ProgressDashboard}
        options={() => {
          return {
            headerShown: true,
            headerTitleStyle: styles.headerText,

            title: 'Progress',

            headerBackground: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={bgSplash}
                  style={styles.bgSplash}
                  resizeMode="cover"
                />
              </View>
            )
          };
        }}
      />
      <ProgressStack.Screen
        name="Progress"
        component={ProgressScreen}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitleStyle: styles.headerText,
            title: '',
            headerRight: () => <FilterButton />,
            headerLeft: () => {
              return <BackButton text="Progress" onPress={navigation.goBack} />;
            },
            headerBackground: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={bgSplash}
                  style={styles.bgSplash}
                  resizeMode="cover"
                />
              </View>
            )
          };
        }}
      />
      <ProgressStack.Screen
        name="WeeklyEffort"
        component={WeeklyEffort}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitleStyle: styles.headerText,
            title: '',
            headerLeft: () => {
              return <BackButton text="Progress" onPress={navigation.goBack} />;
            },
            headerRight() {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate('TooltipModal', {
                      modal: 'weeklyEffort'
                    })
                  }
                >
                  <Text
                    style={{
                      color: color.palette.black,
                      fontSize: 14,
                      fontFamily: variables.mainFontBold,
                      textTransform: 'uppercase',
                      marginRight: 15
                    }}
                  >
                    info
                  </Text>
                </Pressable>
              );
            },
            headerBackground: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={bgSplash}
                  style={styles.bgSplash}
                  resizeMode="cover"
                />
              </View>
            )
          };
        }}
      />
      <ProgressStack.Screen
        name="ActivityInfo"
        component={ActivityInfo}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerLeft: () => {
              return (
                <BackButton
                  text={route.params.prevRoute}
                  onPress={navigation.goBack}
                />
              );
            }
          };
        }}
      />
      <ProgressStack.Screen
        name="ActivitiesProgress"
        component={ProgressScreen}
        options={({ navigation, route }) => {
          const { date } = route.params.game;
          const text = moment(date, 'YYYY/MM/DD').format('MMM DD');

          return {
            headerShown: true,
            headerTitle: '',
            headerLeft: () => {
              return <BackButton text={text} onPress={navigation.goBack} />;
            }
          };
        }}
      />
      <ProgressStack.Screen
        name="Accute"
        component={AccuteScreen}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitleStyle: styles.headerText,
            title: '',
            headerLeft: () => {
              return <BackButton text="Progress" onPress={navigation.goBack} />;
            },
            headerBackground: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={bgSplash}
                  style={styles.bgSplash}
                  resizeMode="cover"
                />
              </View>
            )
          };
        }}
      />
      <ProgressStack.Screen
        name="TeamEffort"
        component={TeamEffortScreen}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitle: 'TEAM EFFORT',
            headerLeft: () => {
              return <BackButton text={'BACK'} onPress={navigation.goBack} />;
            }
          };
        }}
      />
    </ProgressStack.Navigator>
  );
};

const ActivitiesStack = createStackNavigator<ActivitiesStackParamList>();
const ActivitiesStackNavigator = () => {
  return (
    <ActivitiesStack.Navigator>
      <ActivitiesStack.Screen
        name="Activities"
        component={Activities}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitleStyle: styles.headerText,

            headerBackground: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={bgSplash}
                  style={styles.bgSplash}
                  resizeMode="cover"
                />
              </View>
            ),
            headerRight() {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate('TooltipModal', {
                      modal: 'similarTrainings'
                    })
                  }
                >
                  <Text
                    style={{
                      color: color.palette.black,
                      fontSize: 14,
                      fontFamily: variables.mainFontBold,
                      textTransform: 'uppercase',
                      marginRight: 15
                    }}
                  >
                    info
                  </Text>
                </Pressable>
              );
            }
          };
        }}
      />
      <ActivitiesStack.Screen
        name="ActivityInfo"
        component={ActivityInfo}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerLeft: () => {
              return (
                <BackButton
                  text={route.params.prevRoute}
                  onPress={navigation.goBack}
                />
              );
            }
          };
        }}
      />
      <ActivitiesStack.Screen
        name="ActivitiesProgress"
        component={ProgressScreen}
        options={({ navigation, route }) => {
          const { date } = route.params.game;
          const text = moment(date, 'YYYY/MM/DD').format('MMM DD');

          return {
            headerShown: true,
            headerTitle: '',
            headerLeft: () => {
              return <BackButton text={text} onPress={navigation.goBack} />;
            }
          };
        }}
      />
      <ActivitiesStack.Screen
        name="TeamEffort"
        component={TeamEffortScreen}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitle: 'TEAM EFFORT',
            headerLeft: () => {
              return <BackButton text={'BACK'} onPress={navigation.goBack} />;
            }
          };
        }}
      />
      <ActivitiesStack.Screen
        name="Accute"
        component={AccuteScreen}
        options={({ navigation, route }) => {
          const date = route.params.date;
          const text = moment(date, 'YYYY/MM/DD').format('MMM DD');

          return {
            headerShown: true,
            headerTitle: 'ACUTE:CHRONIC',
            headerLeft: () => {
              return <BackButton text={text} onPress={navigation.goBack} />;
            },
            headerBackground: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={bgSplash}
                  style={styles.bgSplash}
                  resizeMode="cover"
                />
              </View>
            )
          };
        }}
      />
    </ActivitiesStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const MainNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Activities"
        component={ActivitiesStackNavigator}
        options={({ navigation }) => {
          return {
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Icon
                icon={focused ? 'dot' : 'dot_grey'}
                style={{
                  width: 24,
                  height: 24
                }}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={StyleSheet.flatten([
                  {
                    color: focused
                      ? color.palette.orange
                      : color.palette.lighterBlack
                  },
                  styles.tabBarLabel
                ])}
              >
                Activities
              </Text>
            ),
            headerRight() {
              return (
                <Pressable
                  onPress={() =>
                    navigation.navigate('TooltipModal', {
                      modal: 'similarTrainings'
                    })
                  }
                >
                  <Text
                    style={{
                      color: color.palette.black,
                      fontSize: 14,
                      fontFamily: variables.mainFontBold,
                      textTransform: 'uppercase',
                      marginRight: 15
                    }}
                  >
                    info
                  </Text>
                </Pressable>
              );
            },

            headerTitleStyle: styles.headerText
          };
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="show-chart"
              size={24}
              color={
                focused ? color.palette.orange : color.palette.lighterBlack
              }
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={StyleSheet.flatten([
                {
                  color: focused
                    ? color.palette.orange
                    : color.palette.lighterBlack
                },
                styles.tabBarLabel
              ])}
            >
              Progress
            </Text>
          ),
          headerTitleStyle: styles.headerText
        }}
      />

      <Tab.Screen
        name="Wellness"
        component={Wellness}
        options={{
          headerShown: true,
          headerTitleStyle: styles.headerText,
          headerBackground: () => (
            <View style={styles.headerContainer}>
              <Image
                source={bgSplash}
                style={styles.bgSplash}
                resizeMode="cover"
              />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="wellness"
              style={{
                color: focused
                  ? color.palette.orange
                  : color.palette.lighterBlack,
                width: 24
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={StyleSheet.flatten([
                {
                  color: focused
                    ? color.palette.orange
                    : color.palette.lighterBlack
                },
                styles.tabBarLabel
              ])}
            >
              Wellness
            </Text>
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="profile_circle"
              style={{
                fill: focused
                  ? color.palette.orange
                  : color.palette.lighterBlack,
                width: 24
              }}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={StyleSheet.flatten([
                {
                  color: focused
                    ? color.palette.orange
                    : color.palette.lighterBlack
                },
                styles.tabBarLabel
              ])}
            >
              Profile
            </Text>
          ),
          headerTitleStyle: styles.headerText
        }}
      />
    </Tab.Navigator>
  );
};

const MainStack = createStackNavigator<PlayerMainStackParamList>();
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <MainStack.Screen name="Root" component={MainNavigation} />
      <MainStack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'modal'
        }}
      >
        <MainStack.Screen name="TooltipModal" component={TooltipModal} />
        <MainStack.Screen name="FilterModal" component={FilterModal} />
      </MainStack.Group>
    </MainStack.Navigator>
  );
};

function PlayerNavigation() {
  const auth = useAppSelector(selectAuth);
  const activeClub = useAppSelector(selectActiveClub);
  return (
    <NavigationContainer theme={DefaultTheme}>
      {switchNavigator(auth, activeClub)}
    </NavigationContainer>
  );
}

export default PlayerNavigation;

const styles = StyleSheet.create({
  bgSplash: {
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%'
  },
  headerContainer: {
    backgroundColor: color.palette.realWhite,
    borderBottomColor: color.palette.lighterGrey,
    borderBottomWidth: 0.5,
    flex: 1,
    overflow: 'hidden'
  },
  headerText: {
    color: color.palette.black,
    fontFamily: variables.mainFontBold,
    fontSize: 21,
    textTransform: 'uppercase'
  },
  tabBarLabel: {
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    textTransform: 'uppercase'
  }
});
