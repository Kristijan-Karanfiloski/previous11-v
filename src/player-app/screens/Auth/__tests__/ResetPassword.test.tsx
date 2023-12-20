import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react-native';
import ResetPassword from '../ResetPassword';
import auth from '@react-native-firebase/auth';

jest.spyOn(auth(), 'sendPasswordResetEmail').mockResolvedValue(undefined);

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

  it('after pressing the Go Back button to take me back to the login page', () => {
    const mockGoBack = jest.fn();
    const mockNavigation = {
      goBack: mockGoBack
    };

    render(<ResetPassword navigation={mockNavigation} route={() => {}} />);

    const goBackButton = screen.getByText('Go back');

    fireEvent.press(goBackButton);

    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should', async () => {
    const email = 'user@example.com';

    render(<ResetPassword navigation={() => {}} route={() => {}} />);

    const emailInput = screen.getByPlaceholderText('Email');
    const sendResetPasswordButton = screen.getByText('Send →');

    fireEvent.changeText(emailInput, 'user@example.com');

    fireEvent.press(sendResetPasswordButton);

    await waitFor(() => {
      expect(auth().sendPasswordResetEmail).toHaveBeenCalledWith(email);
    });
    // await act(() => email);
  });

  //TODO: need to test the alert message

  // it('should display an alert error message', async () => {
  //   // const alertMessage = 'The email dosent exist';
  //
  //   render(<ResetPassword navigation={() => {}} route={() => {}} />);
  //
  //   const emailInput = screen.getByPlaceholderText('Email');
  //   const sendResetPasswordButton = screen.getByText('Send →');
  //
  //   fireEvent.changeText(emailInput, 'user@example.com');
  //
  //   fireEvent.press(sendResetPasswordButton);
  //
  //   await waitFor(() => {
  //     expect(Alert.alert).toHaveBeenCalledWith('The email dosent exist');
  //   });
  // });
});
