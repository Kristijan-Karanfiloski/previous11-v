/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';

import SessionsMenu from '../components/Calendar/SessionsMenu';
import AcuteExplanationModal from '../components/common/explanations/AcuteExplanationModal';
import LandingExplanationModal from '../components/common/explanations/LandingExplanationModal';
import RPEExplanationModal from '../components/common/explanations/RPEExplanationModal';
import Header from '../components/common/Header';
import NetworkErrorModal from '../components/common/NetworkErrorModal';
import CreateEventModal from '../components/EventModals/ModalTypes/CreateEventModal';
import MatchTypeSelector from '../components/Events/MatchTypeSelector';
import EndLiveEventModal from '../components/LiveGame/EndLiveEventModal';
import LostConnectionModal from '../components/LiveGame/LostConnectionModal';
import PlayersOverview from '../components/PlayersOverview';
import { clubFirestoreProps } from '../converters';
import { selectAuth } from '../redux/slices/authSlice';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { setDeviceType } from '../redux/slices/deviceSlice';
import { selectUserProfile } from '../redux/slices/userProfileSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import AddTags from '../screens/AddTags';
import ResetPassword from '../screens/Auth/ResetPassword';
import Calendar from '../screens/Calendar';
import ConnectionOverview from '../screens/ConnectionOverview/ConnectionOverview';
import DrillsModalScreen from '../screens/DrillsModalScreen';
// import CreateEventModal from '../screens/EventScreens/CreateEventModal';
import EventDetailsModal from '../screens/EventScreens/EventDetailsModal';
import Landing from '../screens/Landing/Landing';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import Settings from '../screens/Settings/Settings';
import TroubleshootingTag from '../screens/TroubleshootingTag';
import Wellness from '../screens/Wellness';
import {
  DrawerParamList,
  DrawerStackParamList,
  RootStackParamList
} from '../types';

import AcuteChronic from './AcuteChronic';
import AskToLoadSessionModal from './AskToLoadSessionModal';
import AuthNavigation from './AuthNavigation';
import CustomDrawer from './CustomDrawer';
import LinkingConfiguration from './LinkingConfiguration';
import LiveView from './LiveView';
import LoadEdgeSessionsStack from './LoadEdgeSessionsStack';
import OnboardingView from './OnboardingView';
import ReportView from './ReportView';
import WeeklyLoad from './WeeklyLoad';

const switchNavigator = (
  isLoggedIn: boolean,
  activeClub: clubFirestoreProps,
  isAdmin?: boolean
) => {
  if (isLoggedIn) {
    if (activeClub && activeClub.onboarded) {
      return <DrawerWithModal />;
    }
    return (
      <OnboardingView
        initialRouteName={isAdmin ? 'CustomerChoose' : 'TeamChoose'}
      />
    );
  }

  return <AuthNavigation />;
};

export default function Navigation() {
  //   {
  //   colorScheme
  // }: {
  //   colorScheme: ColorSchemeName;
  // }
  const auth = useAppSelector(selectAuth);
  const userProfile = useAppSelector(selectUserProfile);
  const isLoggedIn = auth && userProfile;
  // const isClubSelected = useAppSelector(selectActiveClub);
  const activeClub = useAppSelector(selectActiveClub);
  const dispatch = useAppDispatch();

  // const subscribeEvents = async () => {
  //   const clubRef = (await firestoreService.getClub(auth.customerName)).doc(
  //     isClubSelected.id
  //   );

  //   const unsubscribe = firestoreService
  //     .getGamesRef(clubRef)
  //     .where('type', '==', GameType.Training)
  //     .onSnapshot((snapshot) => {
  //       if (!snapshot || snapshot.empty) return;
  //       snapshot.docChanges().forEach((event) => {
  //         if (event.type !== 'modified') return;
  //         const game = gameConverter.fromFirestore(event.doc.data());
  //         const gameInStore = selectGameById(store.getState(), game.id);

  //         if (
  //           gameInStore &&
  //           JSON.stringify(game.benchmark) !==
  //             JSON.stringify(gameInStore?.benchmark)
  //         ) {
  //           dispatch(
  //             updateGame({
  //               id: game.id,
  //               changes: {
  //                 benchmark: game.benchmark
  //               }
  //             })
  //           );

  //           const activeEvent = selectTrackingEvent(store.getState());

  //           if (activeEvent && activeEvent.id === game.id) {
  //             dispatch(
  //               updateTrackingEvent({
  //                 benchmark: game.benchmark
  //               })
  //             );
  //           }
  //         }
  //       });
  //     });

  //   return unsubscribe;
  // };

  useEffect(() => {
    dispatch(setDeviceType());
  }, []);

  // useEffect(() => {
  //   if (isLoggedIn && isClubSelected) {
  //      subscribeEvents();
  //   }
  // }, [isLoggedIn, isClubSelected]);

  return (
    <View
      style={{ flex: 1 }}
      onLayout={async () => await SplashScreen.hideAsync()}
    >
      <NavigationContainer
        linking={LinkingConfiguration}
        // theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        theme={DefaultTheme}
      >
        {switchNavigator(!!isLoggedIn, activeClub, auth?.isAdmin)}
      </NavigationContainer>
    </View>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const HomeStack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <HomeStack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <HomeStack.Screen name="Landing" component={Landing} />

      {/* <HomeStack.Screen name="LiveView" component={LiveView} /> */}
      <HomeStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      {/* <HomeStack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'fade'
        }}
      >
        <HomeStack.Screen name="Modal" component={ModalScreen} />
      </HomeStack.Group> */}
    </HomeStack.Navigator>
  );
}

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Root"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 411 }
      }}
    >
      <Drawer.Screen name="Root" component={RootNavigator} />
      <Drawer.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerShown: true,
          header: () => <Header />
        }}
      />
      <Drawer.Screen
        name="WeeklyLoad"
        component={WeeklyLoad}
        options={{
          unmountOnBlur: true
        }}
      />
      <Drawer.Screen
        name="AcuteChronic"
        component={AcuteChronic}
        options={{
          unmountOnBlur: true
        }}
      />
      <Drawer.Screen
        name="Wellness"
        component={Wellness}
        options={{
          unmountOnBlur: true
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: true,
          header: () => <Header />,
          unmountOnBlur: true
        }}
      />
    </Drawer.Navigator>
  );
}

const DrawerStack = createStackNavigator<DrawerStackParamList>();
function DrawerWithModal() {
  return (
    <DrawerStack.Navigator
      initialRouteName="Drawer"
      screenOptions={{
        headerShown: false
      }}
    >
      <DrawerStack.Group>
        <DrawerStack.Screen name="Drawer" component={DrawerNavigator} />
        <DrawerStack.Screen
          name="LiveView"
          component={LiveView}
          options={{
            gestureEnabled: false
          }}
        />
        <DrawerStack.Screen
          name="Report"
          component={ReportView}
          options={{
            gestureEnabled: false
          }}
        />
      </DrawerStack.Group>

      <DrawerStack.Group
        screenOptions={{
          presentation: 'modal',
          gestureEnabled: false
        }}
      >
        <DrawerStack.Screen name="SyncModal" component={ModalScreen} />
      </DrawerStack.Group>

      <DrawerStack.Group
        screenOptions={{
          headerShown: false,
          presentation: 'transparentModal'
        }}
      >
        {/* <DrawerStack.Screen
          name="CreateEventModal"
          component={CreateEventModal}
        /> */}
        <DrawerStack.Screen
          name="EventDetailsModal"
          component={EventDetailsModal}
        />

        {/* <DrawerStack.Screen name="TagsOverviewModal" component={TagsOverview} /> */}
        <DrawerStack.Screen
          name="EndLiveEventModal"
          component={EndLiveEventModal}
        />
        <DrawerStack.Screen name="DrillsModal" component={DrillsModalScreen} />
        <DrawerStack.Screen
          name="LostConnectionModal"
          component={LostConnectionModal}
        />
        <DrawerStack.Screen
          name="MatchTypeSelector"
          component={MatchTypeSelector}
        />
        <DrawerStack.Screen name="SessionsMenu" component={SessionsMenu} />
        <DrawerStack.Screen name="ResetPassword" component={ResetPassword} />
        <DrawerStack.Screen
          name="NetworkErrorModal"
          component={NetworkErrorModal}
        />
        <DrawerStack.Screen
          name="AskToLoadSessionModal"
          component={AskToLoadSessionModal}
        />
      </DrawerStack.Group>
      <DrawerStack.Group
        screenOptions={{
          presentation: 'modal',
          cardStyle: {
            backgroundColor: 'transparent'
          }
        }}
      >
        <DrawerStack.Screen
          name="AcuteExplanationModal"
          component={AcuteExplanationModal}
        />
        <DrawerStack.Screen
          name="RPEExplanationMoldal"
          component={RPEExplanationModal}
        />
        <DrawerStack.Screen
          name="TagsOverviewModal"
          component={ConnectionOverview}
        />
        <DrawerStack.Screen
          name="PlayersOverviewModal"
          component={PlayersOverview}
        />
        <DrawerStack.Screen
          name="TroubleshootingTag"
          component={TroubleshootingTag}
        />
        <DrawerStack.Screen
          name="LandingExplanationModal"
          component={LandingExplanationModal}
        />
        <DrawerStack.Screen name="AddingTagsModal" component={AddTags} />
        <DrawerStack.Screen
          name="LoadEdgeSessionsModal"
          component={LoadEdgeSessionsStack}
        />
        <DrawerStack.Screen
          name="CreateEventModal"
          component={CreateEventModal}
        />
      </DrawerStack.Group>
    </DrawerStack.Navigator>
  );
}
