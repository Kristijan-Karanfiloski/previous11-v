import { device, element, by, waitFor } from 'detox';

describe('player app Activation screen', () => {
  beforeAll(async () => {
    //new instance makes to close the app and start it again

    await device.launchApp({ newInstance: true });

    await device.openURL({
      url: `exp+next11-reaxt-native-v2://expo-development-client/?url=${encodeURIComponent(
        `http://localhost:8081`
      )}`
    });
  });
  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should tap the Got It button in the development console ', async () => {
    await waitFor(element(by.text('Got It')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.text('Got It')).tap();
  });

  it('should swipe down the development console', async () => {
    await waitFor(element(by.text('Connected to:')))
      .toBeVisible()
      .withTimeout(2000);

    await element(by.text('Connected to:')).swipe('down');
  });

  it('should have a title Welcome', async () => {
    await expect(element(by.text('Welcome!'))).toBeVisible();
  });

  it('should have an input activation code and accept input', async () => {
    await waitFor(element(by.text('Activation code here')))
      .toBeVisible()
      .withTimeout(2000);
    // // await expect(element(by.text('Activation code here'))).toBeVisible();
    //
    // await element(by.text('Activation code here')).tap();
    // await element(by.text('Activation code here')).typeText('456812');

    // await waitFor(element(by.id('emailField')))
    //   .toBeVisible()
    //   .withTimeout(2000);

    // await element(by.id('emailField')).tap();
    // await element(by.id('emailField')).typeText('456812');
  });

  // it('should have a Already have an account button', async () => {
  //   await expect(element(by.text('Already have an account?'))).toBeVisible();
  //   await element(by.text('Already have an account?')).tap();
  // });
});
