export interface IBestMatch {
  team: {
    id: string;
    intensity: number;
    loadPerMin: number;
  };
  players?: Record<
    string,
    {
      id: string;
      intensity: number;
      loadPerMin: number;
    }
  >;
}

export interface PlayerWellness {
  fatigued: number;
  sleepQuality: number;
  sleepDuration: number;
  muscleSoreness: number;
  comment?: string;
}

export interface clubFirestoreProps {
  id: string;
  photo?: any;
  photoUrl?: string;
  name: string;
  nation?: string;
  league?: string;
  primaryColor?: string;
  secondryColor?: string;
  teamAge?: string;
  gender?: string;
  pitch?: any;
  assistantCoach?: string;
  physicalCoach?: string;
  otherMember?: string;
  location: string;
  drills?: string[];
  extraTime?: string[];
  bestMatch?: IBestMatch;
  lowIntensityDisabled?: boolean;
  moderateIntensityDisabled?: boolean;
  gameType?: 'football' | 'hockey';
  onboarded: boolean;
  wellness: Record<string, Record<string, PlayerWellness>>;
}

export const clubConverter = {
  toFirestore: function (club: clubFirestoreProps) {
    return {
      ...club
    };
  },
  fromFirestore: function (
    snapshot: { id: string; data: (arg0: any) => any },
    options?: any
  ): clubFirestoreProps {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      photo: data.photo,
      photoUrl: data.photoUrl,
      name: data.name,
      nation: data.nation,
      league: data.league,
      primaryColor: data.primaryColor,
      secondryColor: data.secondryColor,
      teamAge: data.teamAge,
      gender: data.gender,
      pitch: data.pitch,
      assistantCoach: data.assistantCoach,
      physicalCoach: data.physicalCoach,
      otherMember: data.otherMember,
      location: data.location,
      drills: data.drills || [],
      bestMatch: data.bestMatch || null,
      lowIntensityDisabled: data.lowIntensityDisabled || false,
      moderateIntensityDisabled: data.moderateIntensityDisabled || false,
      gameType: data.gameType || 'football',
      onboarded: data.onboarded || false,
      wellness: data.wellness || null
    };
  }
};
