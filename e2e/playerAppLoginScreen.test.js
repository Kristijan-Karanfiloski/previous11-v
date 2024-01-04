import { device, element, by, waitFor } from 'detox';

describe('player app Activation screen', () => {
  beforeAll(async () => {
    //new instance makes to close the app and start it again

    await device.launchApp({ newInstance: true });

    //{
    //       newInstance: true
    //     }

    await device.openURL({
      url: `exp+next11-reaxt-native-v2://expo-development-client/?url=${encodeURIComponent(
        `http://localhost:8081`
      )}`
    });
  });
  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('set up for the development console ', async () => {
    await waitFor(element(by.text('Got It')))
      .toBeVisible()
      .withTimeout(3000);

    await element(by.text('Got It')).tap();
    await element(by.text('Connected to:')).swipe('down');
  });

  it('should have a title Welcome', async () => {
    await expect(element(by.text('Welcome!'))).toBeVisible();
  });

  const typedText = '45689';

  it('should have an input activation code and accept input', async () => {
    await element(by.id('emailField')).typeText('irem@test.com');
  });
});
