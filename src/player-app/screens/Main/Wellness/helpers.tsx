export const WELLNESS_DATA = {
  fatigued: {
    title: 'How fatigued are you?',
    gradesNumber: 7,
    subTitle: {
      1: 'No fatigue',
      2: 'Minimal fatigue',
      3: 'Better than normal',
      4: 'Normal',
      5: 'Worse than normal',
      6: 'Very fatigued',
      7: 'Exhausted'
    }
  },
  sleepQuality: {
    title: 'How was your sleep last night?',
    gradesNumber: 7,
    subTitle: {
      1: 'Very good',
      2: 'Good',
      3: 'Better than normal',
      4: 'Normal',
      5: 'Worse than normal',
      6: 'Bad',
      7: 'Very bad'
    }
  },
  sleepDuration: {
    title: 'How many hours did you sleep\nlast night?',
    gradesNumber: 13,
    startFromZero: true
  },
  muscleSoreness: {
    title: 'Muscle soreness',
    gradesNumber: 7,
    subTitle: {
      1: 'No soreness',
      2: 'Minimal soreness',
      3: 'Better than normal',
      4: 'Normal',
      5: 'Worse than normal',
      6: 'Very sore',
      7: 'Extremely sore'
    }
  }
};

export type WellnessData = {
  title: string;
  gradesNumber: number;
  subTitle?: Record<number, string>;
  startFromZero?: boolean;
};

export type WellnessCategories =
  | 'fatigued'
  | 'sleepQuality'
  | 'sleepDuration'
  | 'muscleSoreness';
