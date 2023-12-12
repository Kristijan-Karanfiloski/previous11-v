import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import ProgressDashboard from '../../components/ProgressDashboard';

import AcuteChronicPlayerApp from './ActivityInfo/components/AcuteChronic';
import CardContainer from './ActivityInfo/components/CardContainer';
import WeeklyEffortDashboard from './WeeklyEffort/WeeklyEffortDashboard';

const ProgressScreenDashboard = () => {
  return (
    <ScrollView>
      <ProgressDashboard />
      <WeeklyEffortDashboard />
      <CardContainer>
        <AcuteChronicPlayerApp />
      </CardContainer>
    </ScrollView>
  );
};

export default ProgressScreenDashboard;
