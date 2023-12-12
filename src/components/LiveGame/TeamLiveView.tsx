import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DropdownFilterKeys, GameType } from '../../../types';
import { generateSessions } from '../../helpers/chartHelpers';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { selectTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../redux/store';
import { color } from '../../theme';
import { deriveNewStats } from '../../utils/adapter';
import { EVENT_SUBSESSIONS } from '../../utils/mixins';
import OverlayLoader from '../common/OverlayLoader';
import PhysicalStats from '../StatsScreens/PhysicalStats';

import IndicatorLayout from './IndicatorLayout';
import LiveHeader from './LiveHeader';
import LiveHeaderSessions from './LiveHeaderSessions';
import LiveIntensityStats from './LiveIntensityStats';

const INDICATORS_TEAM = [
  {
    number: 12,
    locked: false,
    label: 'INTENSITY',
    isActive: true,
    badge: 'Team'
  },
  {
    number: 84,
    locked: false,
    label: 'PHYSICAL STATS',
    isActive: false
  },
  {
    number: 0,
    locked: true,
    label: 'TECHNICAL',
    isActive: false
  }
];

const TeamLiveView = () => {
  const activeEvent = useAppSelector(selectTrackingEvent);
  const [activeTab, setActiveTab] = useState(INDICATORS_TEAM[0].label);
  const [activeSubSession, setActiveSubsession] = useState(
    EVENT_SUBSESSIONS.fullSession
  );

  const filterType = useMemo(() => {
    return getFilterType(activeEvent);
  }, [activeEvent, activeEvent?.type]);

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const isDontCompare =
    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE;

  const handleActiveSubsession = (session: string) => {
    setActiveSubsession(session);
  };

  const deriveData = useMemo(() => {
    return deriveNewStats({
      event: activeEvent,
      isMatch: activeEvent?.type === GameType.Match,
      explicitBestMatch: comparisonFilter.key === DropdownFilterKeys.BEST_MATCH,
      dontCompare: isDontCompare,
      activeSubSession
    });
  }, [activeEvent, isDontCompare, comparisonFilter.key, activeSubSession]);

  if (!activeEvent) return <OverlayLoader isLoading />;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <LiveHeader />
        <LiveHeaderSessions
          sessions={generateSessions(activeEvent).sort((a, b) => {
            return a.startTime - b.startTime;
          })}
          activeSubSession={activeSubSession}
          handleActiveSubsession={handleActiveSubsession}
        />
        <IndicatorLayout
          containerStyle={styles.indicatorLayout}
          indicators={INDICATORS_TEAM.map((it) => {
            return {
              ...it,
              isActive: it.label === activeTab,
              onClick: () => setActiveTab(it.label),
              number: isDontCompare
                ? Math.round(deriveData?.teamLoad)
                : Math.round(deriveData.percentageLoad),
              filterType
            };
          })}
        />
      </View>
      {INDICATORS_TEAM[0].label === activeTab
        ? (
        <LiveIntensityStats
          activeEvent={activeEvent}
          activeSubSession={activeSubSession}
        />
          )
        : (
        <PhysicalStats
          event={activeEvent}
          activeSubSession={activeSubSession}
        />
          )}
    </View>
  );
};
export default TeamLiveView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.palette.black2,
    paddingHorizontal: 24
  },
  indicatorLayout: {
    borderColor: color.palette.grey,
    borderRadius: 2,
    borderWidth: 1,
    marginVertical: 20
  }
});
