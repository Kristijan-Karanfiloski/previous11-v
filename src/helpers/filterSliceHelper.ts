import { FilterStateType, GameAny, GameType } from '../../types';

const checkTrainingIndicator = (event: GameAny | null) => {
  const indicator = event?.benchmark?.indicator;

  if (indicator === null || indicator === 'no_category') return false;
  return true;
};

export const getFilterType = (
  event: GameAny | null,
  formType?: FilterStateType
) => {
  if (formType && !event) {
    return formType;
  }
  const showBenchmark = checkTrainingIndicator(event);
  if (event?.type === GameType.Training) {
    if (!showBenchmark) {
      return FilterStateType.noBenchmark;
    }
    return FilterStateType.training;
  }
  return FilterStateType.match;
};
