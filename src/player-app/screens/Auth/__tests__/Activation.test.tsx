import { render, screen } from '@testing-library/react-native';
import Activation from '../Activation';

describe('Activation', () => {
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
  });
});
