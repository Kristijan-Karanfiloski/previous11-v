import { device, element, by, waitFor } from 'detox';

// As a rule of thumb, end every test with an expect line

// Define constants
const TEST_IDS = {
  haveAccountBtn: 'HaveAccountBtn',
  activationCodeInput: 'ActivationCodeInput',
  loginScreenWelcomeText: 'LoginScreenWelcomeText',
  activationNextButton: 'ActivationNextButton',
  activationView: 'ActivationView',
  notificationModal: 'NotificationModal',
  notificationModalAllowButton: 'NotificationModalAllowButton',
  notificationModalSkipForNowButton: 'NotificationModalSkipForNowButton'
};
const TIMEOUTS = {
  short: 2000,
  long: 10000
  // ... other timeout values
};

describe('player app Activation screen', () => {
  beforeAll(async () => {
    //new instance makes to close the app and start it again

    await device.launchApp({ newInstance: true });
    debugger;
    // await device.launchApp();

    await device.openURL({
      url: `exp+next11-reaxt-native-v2://expo-development-client/?url=${encodeURIComponent(
        `http://localhost:8081`
      )}`
    });
  });
  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  //TODO: ovie se iskomentirani dava testa bidejki nekogas se pojauva nekogas ne konoslata koja sto ne del od kodot nikade

  // it('should display and tap the "Got It" button in the development console ', async () => {
  //   await waitFor(element(by.text('Got It')))
  //     .toBeVisible()
  //     .withTimeout(TIMEOUTS.long);

  //   await element(by.text('Got It')).tap();
  // });

  // it('should swipe down the development console', async () => {
  //   await waitFor(element(by.text('Connected to:')))
  //     .toBeVisible()
  //     .withTimeout(TIMEOUTS.long);

  //   await element(by.text('Connected to:')).swipe('down');
  // });

  it('should display the "Welcome" title', async () => {
    await waitFor(element(by.text('Welcome!')))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);
  });

  it('should display a button with text "Next →"', async () => {
    await waitFor(element(by.id(TEST_IDS.activationNextButton)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);
  });

  it('should display an alert after filling the input code with incorrect code and clicking the next button ', async () => {
    await waitFor(element(by.id(TEST_IDS.activationCodeInput)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.long);

    await waitFor(element(by.id(TEST_IDS.activationNextButton)))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    // Tap on the input field
    await element(by.id(TEST_IDS.activationCodeInput)).tap();

    // Type text into the input field
    await element(by.id(TEST_IDS.activationCodeInput)).typeText('123456');
    // action

    await element(by.id(TEST_IDS.activationNextButton)).tap();

    //assertion
    await waitFor(element(by.text('OK')))
      .toBeVisible()
      .withTimeout(TIMEOUTS.short);

    // action
    await element(by.text('OK')).tap();

    await expect(element(by.text('OK'))).not.toBeVisible();

    // Clear the text
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

    // Dobro praksa e ako vodi na sleden screen da se najde element tamu i da se proveri dali e visible kako sto e kodot ispod kade sto posle stiskanje na haveAccount ne nosi na login skrinot

    await expect(element(by.id(TEST_IDS.loginScreenWelcomeText))).toBeVisible();

    await expect(element(by.id(TEST_IDS.haveAccountBtn))).not.toBeVisible();
  });
});
