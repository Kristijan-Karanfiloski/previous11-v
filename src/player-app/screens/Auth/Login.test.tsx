import { fireEvent, render, screen } from '@testing-library/react-native';
import Login from './Login';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store'
import '@testing-library/jest-native/extend-expect';


const initialState = {
  auth: {
    data: null, // or a mock auth data
    isFetching: false,
    fetched: false,
    error: null
  },
  userProfile: {
    data: null, // or a mock user profile data
    isFetching: false,
    fetched: false,
    error: null
  },
  clubs: {
    data: null, // or a mock list of clubs
    activeClub: null,
    isFetching: false,
    fetched: false,
    error: null
  }
};

// const abortFn = jest.fn();
//
// // @ts-ignore
// global.AbortController = jest.fn(() => ({
//   abort: abortFn,
//   signal : {
//     aborted: false,
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     dispatchEvent: jest.fn(),
//   }
// }));

const mockStore = configureMockStore();
const store = mockStore(initialState);

// mocking module
jest.mock('@logrocket/react-native', () => ({
  default: {
    identify: jest.fn()
  }
}));

describe('Login component', () => {
  it('should render the login component', () => {
    // Mock dependencies
    const mockNavigate = jest.fn();
    const navigation = { navigate: mockNavigate };
    const route = { params: { email: 'andrea+04@next11.co' } };
    //password Next11!!

    // Render the component
    render(
      <Provider store={store}>
        <Login navigation={navigation} route={route} />
      </Provider>
    );

    const passwordInput=screen.getByPlaceholderText(/password/i)
    const loginButton=screen.getByText('Login →');

    fireEvent.changeText(passwordInput,'Next11!!');

    expect(loginButton).toBeEnabled();

    // screen.debug();

    // Assert that the logo and input fields are rendered
    // expect(mockNavigate).toHaveBeenCalledWith('ResetPassword', { email });
  });
});
