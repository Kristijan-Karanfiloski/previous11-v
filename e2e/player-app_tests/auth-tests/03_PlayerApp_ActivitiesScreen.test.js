import { device, element, by, waitFor } from 'detox';

// As a rule of thumb, end every test with an expect line

// Define constants
const TEST_IDS = {
  notificationModal: 'NotificationModal',
  notificationModalAllowButton: 'NotificationModalAllowButton',
  notificationModalSkipForNowButton: 'NotificationModalSkipForNowButton',
  gameCardPlaceholder: 'GameCardsPlaceholderView',
  playerAppLoginButton: 'PlayerAppLoginButton',
  profileTab: 'profile-tab'
};
const TIMEOUTS = {
  short: 2000,
  long: 60000
  // ... other timeout values
};

describe('player app Activities screen', () => {
  beforeAll(async () => {
    //new instance makes to close the app and start it again

    await device.launchApp({ newInstance: false });
  });

  it('should display "NotificationModal" ', async () => {
    // try {
    //   await expect(element(by.id(TEST_IDS.playerAppLoginButton))).toBeVisible();
    // } catch {
    //   // if already signed in, sign out ,to ensure we test sign in flow
    //   await expect(element(by.id(TEST_IDS.profileTab))).toBeVisible();
    //   await element(by.id(TEST_IDS.profileTab)).tap();
    // }

    await waitFor(element(by.id(TEST_IDS.notificationModal)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.long);
    await waitFor(element(by.id(TEST_IDS.notificationModalSkipForNowButton)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.long);
    await element(by.id(TEST_IDS.notificationModalSkipForNowButton)).tap();
  });

  //TODO:
  // Writing test cases for the activities cards

  it('should display the profile nav tab and tap on it ', async () => {
    // const analysisButton=element(by.id(TEST_IDS.))
  });
});
