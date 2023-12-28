import { render, waitFor, screen } from '@testing-library/react-native';
import Activities from '../Activities';
import { Provider } from 'react-redux';
import storePlayer from '../../../../redux/store-player';
import { rootReducer } from '../../../../redux/store-player';
import { configureStore } from '@reduxjs/toolkit';

// const mockAuthState = {
//   // data: {
//   //   // Fill with mock values according to authFirestoreProps structure
//   //   playerId: 'mockPlayerId'
//   //   // ... other properties of authFirestoreProps
//   // },
//   data: null,
//   isFetching: false,
//   fetched: false,
//   error: null
// };
//
// const mockState = {
//   auth: mockAuthState
//   // ... other slices if necessary
// };
//
// const mockStore = configureStore({
//   reducer: rootReducer,
//   preloadedState: mockState.auth
// });

describe('Activities', () => {
  it('should render the component without crashing', async () => {
    const mockNavigation = jest.fn();

    render(
      <Provider store={storePlayer}>
        <Activities navigation={mockNavigation} />
      </Provider>
    );

    // await waitFor(() => {
    //   render(
    //     <Provider store={store}>
    //       <Activities navigation={mockNavigation} />
    //     </Provider>
    //   );
    // });
  });

  it('should render the flat list', async () => {
    const mockNavigation = jest.fn();
    render(
      <Provider store={storePlayer}>
        <Activities navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => {
      console.log('Current Redux Store State za KIKO', storePlayer.getState());

      const activitiesFlatList = screen.getByTestId('activitiesFlatList-games');
      expect(activitiesFlatList).toBeTruthy();

      screen.debug();
    });
  });

  it('render the FlatList with two games', async () => {
    const mockNavigation = jest.fn();

    await waitFor(() => {
      render(
        <Provider store={storePlayer}>
          <Activities navigation={mockNavigation} />
        </Provider>
      );
    });
  });
});
