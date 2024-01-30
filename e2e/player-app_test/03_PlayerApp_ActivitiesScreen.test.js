import { device, element, by, waitFor } from 'detox';

// As a rule of thumb, end every test with an expect line

// Define constants
const TEST_IDS = {
  notificationModal: 'NotificationModal',
  notificationModalAllowButton: 'NotificationModalAllowButton',
  notificationModalSkipForNowButton: 'NotificationModalSkipForNowButton'
};
const TIMEOUTS = {
  short: 2000,
  long: 10000
  // ... other timeout values
};

describe('player app Activities screen', () => {
  //NOTIFICATION MODAL
  //TODO: da gi podelam vo dav it  bloka i da dodam not visible after closing the modal
  // it('should display "NotificationModal" ', async () => {
  //   await waitFor(element(by.id(TEST_IDS.notificationModal)))
  //     .toBeVisible()
  //     .withTimeout(60000);
  //   await waitFor(element(by.id(TEST_IDS.notificationModalSkipForNowButton)))
  //     .toBeVisible()
  //     .withTimeout(60000);
  //   await element(by.id(TEST_IDS.notificationModalSkipForNowButton)).tap();
  // });
});
