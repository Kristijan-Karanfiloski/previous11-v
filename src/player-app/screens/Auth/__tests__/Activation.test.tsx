import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react-native';
import Activation from '../Activation';
import axios from 'axios';
import API_ENDPOINTS from '../../../../helpers/api_endpoints';

// jest.spyOn(API, 'checkActivationCode');

jest.mock('axios');
//!This line creates a typed constant mockedAxios which is a version of Axios that has been augmented with Jest's mocking functionalities.
//!The as keyword is used for type assertion in TypeScript. This line is asserting that axios (which is now a Jest mock due to jest.mock('axios')) should be treated as jest.Mocked<typeof axios>. This helps with TypeScript's type checking and editor autocompletion, making it easier to work with the mocked Axios in a TypeScript environment
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Activation', () => {
  ////////////////////////////////////////////////////////////////
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: { code: 'testCode123' } });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the component without crashing', () => {
    render(<Activation navigation={() => {}} />);
  });

  it('should render the Activation screen with all the necessary components', () => {
    const navigation = {};

    render(<Activation navigation={navigation} />);

    const logoImage = screen.getByTestId('logo-img');
    const introText = screen.getByText('Welcome!');
    const hintText = screen.getByText(
      ' You should have recieved an invitation email from Next11. Please enter\n' +
        '          the activation code that you find in the email.'
    );
    const activationCodeInput = screen.getByPlaceholderText(
      'Activation code here'
    );
    const nextButton = screen.getByText('Next →');
    const existingAccountButton = screen.getByText('Already have an account?');

    expect(logoImage).toBeTruthy();
    expect(introText).toBeTruthy();
    expect(hintText).toBeTruthy();
    expect(activationCodeInput).toBeTruthy();
    expect(nextButton).toBeTruthy();
    expect(existingAccountButton).toBeTruthy();
  });

  it('should allow user to input activation code', () => {
    const navigation = {};

    render(<Activation navigation={navigation} />);

    const activationCodeInput = screen.getByPlaceholderText(
      'Activation code here'
    );

    fireEvent.changeText(activationCodeInput, 'testCode123');

    expect(activationCodeInput.props.value).toBe('testCode123');
  });

  it('should allow user to', async () => {
    const navigation = {};

    render(<Activation navigation={navigation} />);

    const activationCodeInput = screen.getByPlaceholderText(
      'Activation code here'
    );

    fireEvent.changeText(activationCodeInput, 'testCode123');

    const submitButton = screen.getByText('Next →');

    fireEvent.press(submitButton);

    const expectedUrl =
      API_ENDPOINTS.CHECK_PLAYER_ACTIVATION_CODE('testCode123');

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(expectedUrl);
    });

    ////////////////////////////////

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  it('should enable the Next button when at least one character is entered in the activation code input', () => {
    render(<Activation navigation={() => {}} />);

    const activationCodeInput = screen.getByPlaceholderText(
      'Activation code here'
    );
    const submitButton = screen.getByText('Next →');

    fireEvent.changeText(activationCodeInput, 'T');

    expect(submitButton).not.toBeDisabled();
  });

  it('after tap on the button Already have an account to take you to the login page ', () => {
    const mockNavigate = jest.fn();
    const mockNavigation = {
      navigate: mockNavigate
    };

    render(<Activation navigation={mockNavigation} />);

    const alreadyHaveAnAccountButton = screen.getByText(
      'Already have an account?'
    );

    fireEvent.press(alreadyHaveAnAccountButton);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  //! TO BE REMADE FETCHING FROM AXIOS AND ALSO DISPLAYING ERROR MESSAGE FROM THE ALERT API

  // it('should get and Alert message', async () => {
  //   mockedAxios.get.mockResolvedValue({
  //     status: 400,
  //     data: { message: 'The activation code does not exist' }
  //   });
  //
  //   const navigation = {};
  //
  //   render(<Activation navigation={navigation} />);
  //
  //   const activationCodeInput = screen.getByPlaceholderText(
  //     'Activation code here'
  //   );
  //
  //   fireEvent.changeText(activationCodeInput, 'tes');
  //
  //   const submitButton = screen.getByText('Next →');
  //
  //   fireEvent.press(submitButton);
  //
  //   // const alertMessage = 'The activation code does not exist';
  //   await waitFor(() => {
  //     expect(Alert.alert).toHaveBeenCalledWith(
  //       'The activation code does not exist'
  //     );
  //   });
  // });
});

// 'The activation code does not exist';
