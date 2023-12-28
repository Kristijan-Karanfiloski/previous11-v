import Profile from '../Profile';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import storePlayer from '../../../../redux/store-player';

describe('ProfileScreen', () => {
  it('should the Profile without crashing', async () => {
    const mockNavigation = jest.fn();
    render(
      <Provider store={storePlayer}>
        <Profile navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => {});
  });

  it('navigates to ChangeEmail screen on pressing the Change Email button', () => {
    // Render Profile component
    // Simulate pressing the Change Email button
    // Assert that navigation to 'ChangeEmail' screen is triggered
  });

  it('navigates to ChangePassword screen on pressing the Change Password button', () => {
    // Similar test for Change Password button
  });

  it('logs out the user correctly', () => {
    // Render Profile component
    // Simulate pressing the Logout button
    // Assert that the alert is shown
    // Simulate pressing the 'Logout' on the alert
    // Assert that the logout process is triggered (possibly mocked)
  });
});
