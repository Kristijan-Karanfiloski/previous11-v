import { render, waitFor } from '@testing-library/react-native';
import Activities from '../Activities';
import { Provider } from 'react-redux';
import store from '../../../../redux/store';
jest.mock('@logrocket/react-native', () => ({
  default: {
    identify: jest.fn()
  }
}));

// jest.mock('@react-native-firebase/messaging', () => {
//   return () => ({
//     hasPermission: jest.fn(() => Promise.resolve(true)),
//     subscribeToTopic: jest.fn(),
//     unsubscribeFromTopic: jest.fn(),
//     requestPermission: jest.fn(() => Promise.resolve(true)),
//     getToken: jest.fn(() => Promise.resolve('myMockToken')),
//     AuthorizationStatus: {
//       NOT_DETERMINED: 'not_determined',
//       DENIED: 'denied',
//       AUTHORIZED: 'authorized',
//       PROVISIONAL: 'provisional'
//       // ... other statuses as needed
//     }
//   });
// });

describe('Activities', () => {
  it('should render the component without crashing', async () => {
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
