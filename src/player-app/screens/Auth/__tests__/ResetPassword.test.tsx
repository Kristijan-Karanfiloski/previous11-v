import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react-native';
import ResetPassword from '../ResetPassword';
import auth from '@react-native-firebase/auth';

jest.mock('@react-native-firebase/auth', () => {
  return {
    __esModule: true,
    default: () => ({
      sendPasswordResetEmail: jest.fn(() => Promise.resolve())
      // Add other methods if needed
    })
  };
});
// const sendPasswordResetEmail = jest.fn(() => {
//   return Promise.resolve('test@test.com');
// });

describe('ResetPassword', () => {
  it('component should render without crashing', () => {
    render(<ResetPassword navigation={() => {}} route={() => {}} />);
  });

  it('renders all required elements', () => {
    render(<ResetPassword navigation={() => {}} route={() => {}} />);

    const imageBgSplash = screen.getByTestId('image-bgSplash');
    const introText = screen.getByText('Reset Password');

    const sentMessageText = screen.getByText(
      'Please enter your email, and we will send you a link to reset your password.'
    );
    const codeInput = screen.getByPlaceholderText('Email');

    expect(imageBgSplash).toBeTruthy();
    expect(introText).toBeTruthy();
    expect(sentMessageText).toBeTruthy();
    expect(codeInput).toBeTruthy();
  });

  it('Submit button is disabled for empty or invalid email and enabled for valid email"', () => {
    render(<ResetPassword navigation={() => {}} route={() => {}} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const sendResetPasswordButton = screen.getByText('Send →');

    //! AT FIRST THE BUTTON SHOULD BE DISABLED
    expect(sendResetPasswordButton).toBeDisabled();

    //!Entering invalid email the button should be still disabled
    fireEvent.changeText(emailInput, 'test@test.c');
    expect(sendResetPasswordButton).toBeDisabled();

    //! Entering valid email the button should be enabled
    fireEvent.changeText(emailInput, 'test@test.co');
    expect(sendResetPasswordButton).not.toBeDisabled();
  });

  //TODO : to improve the tests with mocking the auth

  // it('should send reset password email successfully when email is valid', async () => {
  //   const email = 'joe.bloggs@example.com';
  //
  //   render(<ResetPassword navigation={() => {}} route={() => {}} />);
  //
  //   const emailInput = screen.getByPlaceholderText('Email');
  //   fireEvent.changeText(emailInput, 'test@test.com');
  //
  //   const sendButton = screen.getByText('Send →');
  //   fireEvent.press(sendButton);
  //
  //   await waitFor(() => {
  //     expect(auth().sendPasswordResetEmail).toHaveBeenCalledWith(email);
  //   });
  // });
});
