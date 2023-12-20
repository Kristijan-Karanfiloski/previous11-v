import { fireEvent, render, screen } from '@testing-library/react-native';
import ResetPassword from '../ResetPassword';

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined)
  });
});

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

  //TODO : to improve the tests with mocking the auth

  // it('should display error message when reset password email fails to send', async () => {
  //   // jest.spyOn(auth(), 'sendPasswordResetEmail');
  //   // Extend the type of the mock to accept an email address as an argument
  //   (auth().sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);
  //
  //   render(<ResetPassword navigation={() => {}} route={() => {}} />);
  //
  //   // const emailInput = screen.getByPlaceholderText('Email');
  //   const sendResetPasswordButton = screen.getByText('Send →');
  //
  //   // fireEvent.changeText(emailInput, 'test@test.com');
  //   fireEvent.press(sendResetPasswordButton);
  //
  //   expect(auth().sendPasswordResetEmail).toHaveBeenCalledWith('test@test.com');
  //
  //   // await waitFor(() => {
  //   //   expect(auth().sendPasswordResetEmail).toHaveBeenCalledWith(
  //   //     'test@test.com'
  //   //   );
  //   // });
  // });

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
