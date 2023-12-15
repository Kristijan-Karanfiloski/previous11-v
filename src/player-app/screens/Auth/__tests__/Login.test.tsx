import { fireEvent, render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Login from '../Login';

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
    //ARRANGE
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

    //ACT

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText('Login →');

    fireEvent.changeText(passwordInput, 'Next11!!');

    //ASSERT
    expect(loginButton).toBeEnabled();

    // screen.debug();
  });
  it('allows entering email and password', () => {
    //ARRANGE
    const mockNavigate = jest.fn();
    const mockNavigation = { navigate: mockNavigate };
    const mockRoute = { params: { email: 'andrea+04@next11.co' } };

    render(
      <Provider store={store}>
        <Login navigation={mockNavigation} route={mockRoute} />
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login →');

    //ACT
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    //ASSERT
    // Instead of checking props, we  can assert based on expected behavior.
    // For example, the login button should be enabled when both email and password are provided.
    expect(loginButton).not.toBeDisabled();
  });

  it('should check if the forget your password touchable is called with the navigation function', () => {
    const mockNavigate = jest.fn();
    const mockNavigation = { navigate: mockNavigate };
    const mockRoute = { params: { email: 'andrea+04@next11.co' } };

    // Arrange
    render(
      <Provider store={store}>
        <Login navigation={mockNavigation} route={mockRoute} />
      </Provider>
    );

    const forgotPass = screen.getByText(/forgot your password/i);

    //Act
    fireEvent.press(forgotPass);

    //Assert
    expect(mockNavigate).toHaveBeenCalled();
  });
});
