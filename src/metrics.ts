import fetch from "node-fetch";

export type ResultObj = {worthWatching: boolean, error: string | null};


export class Metric
{
  public readonly worthWatching: boolean; // immutable - make a new Metric class instead
  public readonly yourTeamScore: number;
  public readonly opponentScore: number;

  constructor(worthWatching: boolean, yourTeamScore: number, opponentScore: number)
  {
    this.worthWatching = worthWatching;
    this.yourTeamScore = yourTeamScore;
    this.opponentScore = opponentScore;
  }

  // apply____Metric functions take in whether it's currently worth watching and the two scores.
  // Returns the new value of worth watching as a new Metric for chaining
  // Should be standalone and independent of order.
  // Don't set worthWatching to false - only set to true or previous value

  /**
   * Return YES if:
   *  -Your team wins (by less than maxWinMargin if defined)
   *  -Your team loses by less than or equal to the losingMargin
   */
  public applyBasicScoreMetric(losingMargin: number, maxWinMargin: number | null): Metric
  {
    if (losingMargin < 0) // invalid
    {
      console.error("Invalid losing margin: " + losingMargin);
      return new Metric(this.worthWatching, this.yourTeamScore, this.opponentScore);
    }
    if (maxWinMargin != null && maxWinMargin <= 0) // invalid
    {
      console.error("Invalid max win margin: " + maxWinMargin);
      return new Metric(this.worthWatching, this.yourTeamScore, this.opponentScore);
    }

    const scoreDiff: number = this.yourTeamScore - this.opponentScore;


    let result: boolean = this.worthWatching;
    if (scoreDiff > 0) // your team wins
    {
      result = true;

      if (maxWinMargin != null) //need to check max win
      {
        if (scoreDiff > maxWinMargin)
        {
          result = false; //not within the margin, so make it false
        }
      }
    }
    else if (Math.abs(this.opponentScore - this.yourTeamScore) <= losingMargin) // loss, but close enough
    {
      result = true;
    }

    console.log(`losing margin metric: ${result}`);
    return new Metric(result, this.yourTeamScore, this.opponentScore);
  }

  /**
   * Return YES if:
   *  -Already returning YES
   *  -x% of the time if returning NO
   */
  public applyRandomPercentageMetric(randomPercent: number): Metric
  {
    if (randomPercent <= 0) // invalid percent, don't change anything
    {
      console.error("Invalid random percentage: " + randomPercent);
      return new Metric(this.worthWatching, this.yourTeamScore, this.opponentScore);
    }

    let result: boolean = this.worthWatching;

    if (Math.floor(Math.random() * 100) <= randomPercent)
    {
      result = true;
    }

    console.log(`random percentage metric: ${result}`);
    return new Metric(result, this.yourTeamScore, this.opponentScore);
  }

  /*
    * Return YES if:
    *  -Someone on your team gets a hat trick (if onlyYourTeam = true)
    *  -Someone on either team gets a hat trick (if onlyYourTeam = false)
    */
  public applyHatTrickMetric(onlyYourTeam: boolean, homeHatTrick: boolean, awayHatTrick: boolean): Metric
  {
    let result: boolean = this.worthWatching;
    if (onlyYourTeam)
    {
      result = homeHatTrick;
    }
    else
    {
      result = homeHatTrick || awayHatTrick;
    }

    console.log(`hat trick metric: ${result}`);
    return new Metric(result, this.yourTeamScore, this.opponentScore);
  }
}




function getHatTricks(team: any)
{
  //tslint:disable
  for (const player in team.players)
  {
    try
    {
      const stats = team.players[player].stats;
      const skaterStats = stats.skaterStats; //could be goalieStats
      if (skaterStats !== undefined && skaterStats !== {}) //we have valid stats
      {
        if (skaterStats.goals >= 3)
        {
          console.log("Hat trick")
          return true;
        }
      }
    }
    catch (e)
    {
      console.error(`hat trick error: ${e}`);
    }
  }
  return false;
}

// /**
//  *
//  * @param yourTeamScore input info
//  * @param opponentScore input info
//  * @param losingMargin your team loses by more than this number, not worth watching
//  * @param maxWinMargin your team wins by more than this number, not worth watching
//  * @param randomPercent at the very end, chance of randomly changing a NO to a YES
//  */
// function applyMetric(yourTeamScore: number, opponentScore: number, losingMargin: number,
//   maxWinMargin?: number, randomPercent?: number): boolean
// {
//   let worthWatching: boolean = false;

//   if (yourTeamScore > opponentScore) // your team wins
//   {
//     if (maxWinMargin > 0 && !isNaN(maxWinMargin)) // check max win margin
//     {
//       worthWatching = Math.abs(yourTeamScore - opponentScore) <= maxWinMargin;
//     }
//     else
//     {
//       worthWatching = true;
//     }
//   }
//   else if (Math.abs(opponentScore - yourTeamScore) <= losingMargin) // loss, but differential is close enough
//   {
//     worthWatching = true;
//   }

//    // random chance of showing YES instead of NO
//   if (worthWatching === false && randomPercent !== undefined && randomPercent > 0)
//   {
//     if (Math.floor(Math.random() * 100) <= randomPercent)
//     {
//       console.log("4")
//       worthWatching = true;
//     }
//   }
//   return worthWatching;
// }

// return json
export async function getResults(YOUR_TEAM_ID: number, date: string, losingMargin: number,
  randomPercent: number, maxWinDifferential: number): Promise<ResultObj>
{
  try
  {
    const url = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=" + YOUR_TEAM_ID + "&date=" + date;
    console.log(url)

    const gameDataRaw = await fetch(url);
    const gameData = await gameDataRaw.json();

    let gameIdStr;
    try
    {
      gameIdStr = gameData.dates[0].games[0].gamePk;
    }
    catch (err)
    {
      return {worthWatching: false, error : "Cannot locate game - make sure your team played on this date."};
    }

    if (gameData.dates[0].games[0].status.detailedState !== "Final")
    {
      return {worthWatching: false, error: "This game has not been completed - please check back later."};
    }

    const boxScoreUrl = "https://statsapi.web.nhl.com/api/v1/game/" + gameIdStr + "/boxscore";
    console.log(boxScoreUrl)

    const boxScore = await fetch(boxScoreUrl);
    const gameResults = await boxScore.json();

    if (gameResults == null || gameResults === {})
    {
      return {worthWatching: false, error: "Cannot retrieve game results."};
    }

    const homeTeam = gameResults.teams.home;
    const awayTeam = gameResults.teams.away;

    const homeHatTricks = getHatTricks(homeTeam);
    const awayHatTricks = getHatTricks(awayTeam);

    const homeScore = homeTeam.teamStats.teamSkaterStats.goals;
    const awayScore = awayTeam.teamStats.teamSkaterStats.goals;

    let yourTeamScore;
    let opponentScore;
    if (homeTeam.team.id === YOUR_TEAM_ID)
    {
      yourTeamScore = homeScore
      opponentScore = awayScore
    }
    else if (awayTeam.team.id === YOUR_TEAM_ID)
    {
      yourTeamScore = awayScore
      opponentScore = homeScore
    }
    else
    {
      return {worthWatching: false, error: "Cannot locate team"};
    }

    console.log("your team score: " + yourTeamScore);
    console.log("opponent team score: " + opponentScore);

    // const worthWatching = worthIt1(yourTeamScore, opponentScore);

    const worthWatching: boolean = new Metric(false, yourTeamScore, opponentScore)
      .applyBasicScoreMetric(losingMargin, maxWinDifferential)
      .applyRandomPercentageMetric(randomPercent)
      .applyHatTrickMetric(false, homeHatTricks, awayHatTricks) //TODO: onlyYourTeam
      .worthWatching;

    return {worthWatching, error: null};
  }
  catch (err)
  {
    console.error(err);
    return {worthWatching: false, error: "Failed to fetch data"};
  }
}
