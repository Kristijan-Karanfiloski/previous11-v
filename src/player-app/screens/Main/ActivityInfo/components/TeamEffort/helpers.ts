import moment from 'moment';

import { GameAny, GameType } from '../../../../../../../types';

export const getTotalAndPercentageLoad = (
  isMatch: boolean,
  games: GameAny[],
  event: GameAny,
  playerId?: string
) => {
  const playerLoad = playerId
    ? event.report?.stats.players[playerId].fullSession.playerLoad.total || 0
    : 0;
  const teamLoad = event.report?.stats.team.fullSession.playerLoad.total || 0;
  const filteredGames = games.filter((game) => {
    const isDifferentEvent = event.id !== game.id;
    const isBefore = moment(
      `${game.date} ${game.startTime}`,
      'YYYY/MM/DD HH:mm'
    ).isBefore(moment(`${event.date} ${event.startTime}`, 'YYYY/MM/DD HH:mm'));
    if (isMatch) {
      return isDifferentEvent && isBefore && game.type === GameType.Match;
    }

    const isSameCategory =
      event.benchmark?.indicator === game.benchmark?.indicator;
    return (
      isSameCategory &&
      isDifferentEvent &&
      isBefore &&
      game.benchmark?.indicator === event.benchmark?.indicator
    );
  });

  if (isMatch) {
    const highestLoad = Math.max(
      ...filteredGames.map(({ report }) => {
        if (playerId) {
          return (
            (report?.stats.players &&
              report?.stats.players[playerId] &&
              report?.stats.players[playerId].fullSession.playerLoad.total) ||
            0
          );
        }
        return report?.stats.team.fullSession.playerLoad.total || 0;
      })
    );

    let highestLoadForGame = 0;
    let lowestLoadForGame = 0;
    let highestGame = null as GameAny | null;
    let lowestGame = null as GameAny | null;
    games
      .filter(({ type }) => type === GameType.Match)
      .forEach((game, i) => {
        const teamLoad =
          game.report?.stats.team.fullSession.playerLoad.total || 0;
        if (teamLoad > highestLoadForGame) {
          highestLoadForGame = teamLoad;
          highestGame = game;
        }

        if (i === 0 || teamLoad < lowestLoadForGame) {
          lowestLoadForGame = teamLoad;
          lowestGame = game;
        }
      });

    return {
      load: highestLoad,
      percentageOfLoad: Math.round(
        ((playerId !== undefined ? Math.round(playerLoad) : teamLoad) /
          Math.round(highestLoad)) *
          100
      ),
      highestGame,
      lowestGame
    };
  }

  const totalLoad = filteredGames.reduce((sum, game) => {
    if (playerId) {
      return (
        sum +
        (game.report?.stats.players[playerId].fullSession.playerLoad.total || 0)
      );
    }
    return sum + (game.report?.stats.team.fullSession.playerLoad.total || 0);
  }, 0);
  const averageLoad = Math.round(totalLoad / filteredGames.length);

  return {
    load: averageLoad,
    percentageOfLoad: Math.round(
      ((playerId !== undefined
        ? Math.round(playerLoad)
        : Math.round(teamLoad)) /
        averageLoad) *
        100
    )
  };
};

export const getDescriptionText = (
  isMatch: boolean,
  percentage: number,
  category?: number | string
) => {
  if (isMatch) {
    if (percentage >= 100) {
      return 'This is your team’s match with the highest load so far!';
    }

    return `The Total Load of this match was ${
      100 - percentage
    }% lower than your highest match.`;
  }

  if (percentage > 125) {
    return `Your team’s average Load was ${
      percentage - 100
    }% higher than its average ${category} trainings. Pay attention to your physical wellbeing and watch out for overload.`;
  }
  if (percentage < 75) {
    return `Your team’s average Load was ${
      100 - percentage
    }% lower than its average ${category} trainings.`;
  }
  return `Your team’s load was spot on your average ${category} trainings. It was at ${percentage}%, which is within the optimal range.`;
};

export const getIcon = (isMatch: boolean, percentage: number) => {
  if (isMatch) {
    if (percentage >= 100) {
      return 'spot_on';
    }

    return 'arrow_downward';
  }

  if (percentage > 125) return 'arrow_upward';
  if (percentage < 75) return 'arrow_downward';
  return 'spot_on';
};
