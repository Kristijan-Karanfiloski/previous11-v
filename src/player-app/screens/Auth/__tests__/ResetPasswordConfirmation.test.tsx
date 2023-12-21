import { fireEvent, render, screen } from '@testing-library/react-native';
import ResetPasswordConfirmation from '../ResetPasswordConfirmation';

describe('Reset password confirmation', () => {
  it('component should render without crashing', () => {
    render(<ResetPasswordConfirmation navigation={() => {}} />);
  });

  it('renders all the required elements', () => {
    render(<ResetPasswordConfirmation navigation={() => {}} />);

    const imageBgSplash = screen.getByTestId('image-bgSplash');
    const introText = screen.getByText('Reset Password');
    const hintText = screen.getByText(
      " We've sent you an Email. Please check your mail box and use the\n" +
        "          password we've sent you to log in."
    );

    const loginButton = screen.getByText('Login →');
    const resendButton = screen.getByText('Resend');

    expect(imageBgSplash).toBeTruthy();
    expect(introText).toBeTruthy();
    expect(hintText).toBeTruthy();
    expect(loginButton).toBeTruthy();
    expect(resendButton).toBeTruthy();
  });

  it('pressing the login button to take me to the login page', () => {
    const mockNavigate = jest.fn();
    const navigation = {
      navigate: mockNavigate
    };

    render(<ResetPasswordConfirmation navigation={navigation} />);

    const loginButton = screen.getByText('Login →');

    fireEvent.press(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });
});
