import { fireEvent, render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Login from '../Login';
import { Alert } from 'react-native';
import * as firestoreService from '../../../../helpers/firestoreService';
import Activation from '../Activation';

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

jest.mock('../../../../helpers/firestoreService', () => ({
  ...jest.requireActual('../../../../helpers/firestoreService'), // this line is to keep other exports unchanged
  loginUser: jest.fn().mockResolvedValue({
    user: {
      email: 'user@example.com',
      password: 'password123'
    }
  })
}));

const mockStore = configureMockStore();
const store = mockStore(initialState);

// mocking module
jest.mock('@logrocket/react-native', () => ({
  default: {
    identify: jest.fn()
  }
}));

describe('Login component', () => {
  it('should render the component without crashing', () => {
    render(
      <Provider store={store}>
        <Login navigation={() => {}} route={() => {}} />
      </Provider>
    );
  });

  it('after filling out the inputs to make the login button enabled', () => {
    //?ARRANGE
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

    //?ACT
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByText('Login →');

    fireEvent.changeText(passwordInput, 'Next11!!');

    //?ASSERT
    expect(loginButton).toBeEnabled();

    // screen.debug();
  });
  it('allows entering email and password', () => {
    //?ARRANGE
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

    //?ACT
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    //?ASSERT
    // Instead of checking props, we  can assert based on expected behavior.
    // For example, the login button should be enabled when both email and password are provided.
    expect(loginButton).not.toBeDisabled();
  });

  it('should check if the forget your password touchable is called with the navigation function', () => {
    const mockNavigate = jest.fn();
    const mockNavigation = { navigate: mockNavigate };
    const mockRoute = { params: { email: 'andrea+04@next11.co' } };

    //? Arrange
    render(
      <Provider store={store}>
        <Login navigation={mockNavigation} route={mockRoute} />
      </Provider>
    );

    const forgotPass = screen.getByText(/forgot your password/i);

    //?ACT
    fireEvent.press(forgotPass);

    //?Assert
    expect(mockNavigate).toHaveBeenCalled();
  });
  it('should display alert message when email or password is empty', () => {
    // Arrange
    jest.spyOn(Alert, 'alert');
    const mockNavigate = jest.fn();
    const navigation = { navigate: mockNavigate };
    const route = { params: { email: 'example@example.com' } };

    render(
      <Provider store={store}>
        <Login navigation={navigation} route={route} />
      </Provider>
    );

    const loginButton = screen.getByText('Login →');

    // Act
    fireEvent.press(loginButton);

    // Assert
    expect(Alert.alert).toHaveBeenCalledWith(
      'Please enter your email and password'
    );
  });
  it('should call loginUser function with email and password when login button is pressed', async () => {
    //! Arrange
    const mockNavigate = jest.fn();
    const navigation = { navigate: mockNavigate };
    const route = { params: { email: 'example@example.com' } };

    render(
      <Provider store={store}>
        <Login navigation={navigation} route={route} />
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByText('Login →');

    //! Act
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    //! Assert
    expect(firestoreService.loginUser).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });
});
