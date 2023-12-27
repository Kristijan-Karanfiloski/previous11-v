import { render, waitFor, screen } from '@testing-library/react-native';
import Activities from '../Activities';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';

describe('Activities', () => {
  it('should render the component without crashing', async () => {
    const mockNavigation = jest.fn();

    render(
      <Provider store={store}>
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
      <Provider store={store}>
        <Activities navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => {
      console.log('Current Redux Store State za KIKO', store.getState());

      const activitiesFlatList = screen.getByTestId('activitiesFlatList-games');
      expect(activitiesFlatList).toBeTruthy();

      screen.debug();
    });
  });

  it('render the FlatList with two games', async () => {
    const mockNavigation = jest.fn();

    await waitFor(() => {
      render(
        <Provider store={store}>
          <Activities navigation={mockNavigation} />
        </Provider>
      );
    });
  });
});
