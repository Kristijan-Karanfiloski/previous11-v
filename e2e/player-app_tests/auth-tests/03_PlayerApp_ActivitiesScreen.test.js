import { device, element, by, waitFor } from 'detox';

// As a rule of thumb, end every test with an expect line

// Define constants
const TEST_IDS = {
  notificationModal: 'NotificationModal',
  notificationModalAllowButton: 'NotificationModalAllowButton',
  notificationModalSkipForNowButton: 'NotificationModalSkipForNowButton',
  gameCardPlaceholder: 'GameCardsPlaceholderView'
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
    await waitFor(element(by.id(TEST_IDS.notificationModal)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.long);
    await waitFor(element(by.id(TEST_IDS.notificationModalSkipForNowButton)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.long);
    await element(by.id(TEST_IDS.notificationModalSkipForNowButton)).tap();
  });
});
