import { device, element, by, waitFor } from 'detox';

// As a rule of thumb, end every test with an expect line

// Define constants
const TEST_IDS = {
  haveAccountBtn: 'HaveAccountBtn',
  activationCodeInput: 'ActivationCodeInput',
  loginScreenWelcomeText: 'LoginScreenWelcomeText',
  activationNextButton: 'ActivationNextButton'
  // ... other test IDs
};
const TIMEOUTS = {
  short: 2000,
  long: 3000
  // ... other timeout values
};

describe('player app Activation screen', () => {
  beforeAll(async () => {
    //new instance makes to close the app and start it again

    await device.launchApp({ newInstance: true });
    debugger;

    await device.openURL({
      url: `exp+next11-reaxt-native-v2://expo-development-client/?url=${encodeURIComponent(
        `http://localhost:8081`
      )}`
    });
  });
  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should display and tap the "Got It" button in the development console ', async () => {
    await waitFor(element(by.text('Got It')))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    await element(by.text('Got It')).tap();
  });

  it('should swipe down the development console', async () => {
    await waitFor(element(by.text('Connected to:')))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    // await expect(element(by.text('Connected to:'))).toBeVisible();

    await element(by.text('Connected to:')).swipe('down');
  });

  it('should display the "Welcome" title', async () => {
    await waitFor(element(by.text('Welcome!')))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);
    // await expect(element(by.text('Welcome!'))).toBeVisible();
  });

  it('should have a disabled button', async () => {
    await waitFor(element(by.id(TEST_IDS.activationNextButton)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    // await expect(element(by.id(TEST_IDS.activationNextButton))).toExist();
  });

  it('should show the activation code input field', async () => {
    await waitFor(element(by.id(TEST_IDS.activationCodeInput)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.long);

    // await expect(element(by.id(TEST_IDS.activationCodeInput))).toBeVisible();

    // Tap on the input field
    await element(by.id(TEST_IDS.activationCodeInput)).tap();

    // // Type text into the input field
    await element(by.id(TEST_IDS.activationCodeInput)).typeText('123456');

    // // Clear the text
    await element(by.id(TEST_IDS.activationCodeInput)).clearText();
  });

  it('should display and tap the "Already have an account" button', async () => {
    // Assertion

    await waitFor(element(by.id(TEST_IDS.haveAccountBtn)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    // await expect(element(by.id(TEST_IDS.haveAccountBtn))).toBeVisible();

    // Action
    await element(by.id(TEST_IDS.haveAccountBtn)).tap();

    // Assertion

    await expect(element(by.id(TEST_IDS.loginScreenWelcomeText))).toBeVisible();

    await expect(element(by.id(TEST_IDS.haveAccountBtn))).not.toBeVisible();
  });
});
