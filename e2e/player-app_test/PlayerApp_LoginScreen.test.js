import { element, by, waitFor } from 'detox';
import TEST_CREDENTIALS from '../utils/testCredentials';

const TEST_IDS = {
  playerAppLoginEmailInput: 'PlayerAppLoginEmailInput',
  playerAppLoginPasswordInput: 'PlayerAppLoginPasswordInput',
  playerAppLoginButton: 'PlayerAppLoginButton',
  notificationModal: 'NotificationModal',
  notificationModalAllowButton: 'NotificationModalAllowButton',
  notificationModalSkipForNowButton: 'NotificationModalSkipForNowButton'
};
const TIMEOUTS = {
  short: 2000,
  long: 6000
  // ... other timeout values
};

describe('Player app Login screen', () => {
  beforeAll(async () => {
    //new instance makes to close the app and start it again

    await device.launchApp({ newInstance: false });
  });

  it('should display a "Email" input on the login page ', async () => {
    await waitFor(element(by.id(TEST_IDS.playerAppLoginEmailInput)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    await element(by.id(TEST_IDS.playerAppLoginEmailInput)).tap();

    await element(by.id(TEST_IDS.playerAppLoginEmailInput)).typeText(
      TEST_CREDENTIALS.email
    );
  });

  it('should display a "Password" input on the login page ', async () => {
    await waitFor(element(by.id(TEST_IDS.playerAppLoginPasswordInput)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    await element(by.id(TEST_IDS.playerAppLoginPasswordInput)).tap();

    await element(by.id(TEST_IDS.playerAppLoginPasswordInput)).typeText(
      TEST_CREDENTIALS.password
    );
  });

  it('should display "Login" button on the login page ', async () => {
    await waitFor(element(by.id(TEST_IDS.playerAppLoginButton))).toBeVisible();

    await element(by.id(TEST_IDS.playerAppLoginButton)).tap();
  });
});
