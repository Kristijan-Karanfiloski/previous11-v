import React from 'react';

import { ONBOARDING_NAVIGATOR_TEXTS } from '../../../utils/mixins';
import OnboardingNavigator from '../common/OnboardingNavigator';

type RecurringEditDaySelectProps = {
  handleModal: (type: string) => void;
};

const RecurringEditDaySelect = ({
  handleModal
}: RecurringEditDaySelectProps) => {
  return (
    <OnboardingNavigator
      activeBubble={2}
      hasSecondaryButton
      mainButtonHandler={() => handleModal('editDaySelect')}
      text={ONBOARDING_NAVIGATOR_TEXTS.RECURRING_EVENT_EDIT}
      hideMainButton
      hasCustomHeight
    />
  );
};

export default RecurringEditDaySelect;
