import React from 'react';
import { StyleSheet, View } from 'react-native';

import { GameAny } from '../../../types';
import { variables } from '../../utils/mixins';
import ToggleButton from '../Buttons/ToggleButton';

import PlayerStats from './PlayersStats';
import RpeStats from './RpeStats';
import TeamStats from './TeamStats';

interface PhysicalStatsProps {
  event: GameAny | undefined;
  activeSubSession: string;
}

const PhysicalStats = ({ event, activeSubSession }: PhysicalStatsProps) => {
  const [currentViewMode, setCurrentViewMode] = React.useState<
    'player_stats' | 'team_stats' | 'rpe'
  >('team_stats');

  const renderStats = () => {
    switch (currentViewMode) {
      case 'player_stats':
        return (
          <PlayerStats event={event} activeSubSession={activeSubSession} />
        );
      case 'team_stats':
        return <TeamStats event={event} activeSubSession={activeSubSession} />;
      case 'rpe':
        return <RpeStats event={event} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewSwitch}>
        <ToggleButton
          onClick={() => setCurrentViewMode('team_stats')}
          isActive={currentViewMode === 'team_stats'}
          content="Team Stats"
          position="left"
        />

        <ToggleButton
          onClick={() => setCurrentViewMode('player_stats')}
          position="right"
          isActive={currentViewMode === 'player_stats'}
          content="Player Stats"
        />

        <ToggleButton
          onClick={() => setCurrentViewMode('rpe')}
          position="right"
          isActive={currentViewMode === 'rpe'}
          content="RPE"
        />
      </View>
      {renderStats()}
    </View>
  );
};

export default PhysicalStats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12
  },
  viewSwitch: {
    alignItems: 'center',
    backgroundColor: variables.backgroundColor,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    marginBottom: 20,
    minWidth: 305
  }
});
