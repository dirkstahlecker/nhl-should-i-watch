import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import fetch from "node-fetch";

const app = express();

app.use(bodyParser.json());



/*
  Body: {differential: number, }
*/
app.post('/api/worthWatching/:teamId/:date/:metric', async (req, res) => {
  const YOUR_TEAM_ID: number = Number.parseInt(req.params.teamId, 10);
  const date = req.params.date;
  const metric = req.params.metric;

  console.log(`/api/worthWatching/${YOUR_TEAM_ID}/${date}/${metric}`);

  // const body = req.body;
  console.log(req.body)

  const differential = req.body.differential;
  const randomPercent = req.body.randomPercent;
  const maxWinDifferential = req.body.maxWinDifferential;

  // win, lose by 1, 10% random
  function worthIt1(yourTeamScore: number, opponentScore: number)
  {
    let worthWatching = false;

    if (yourTeamScore > opponentScore) // your team wins
    {
      if (maxWinDifferential > 0 && !isNaN(maxWinDifferential)) // not a blowout
      {
        worthWatching = Math.abs(yourTeamScore - opponentScore) <= maxWinDifferential;
      }
      else
      {
        worthWatching = true;
      }
    }
    else if (Math.abs(opponentScore - yourTeamScore) <= differential) // the differential is close enough
    {
      console.log(Math.abs(opponentScore - yourTeamScore))
      console.log("differential: " + differential);
      console.log("2")
      worthWatching = true;
    }

    if (worthWatching === false) // random chance of showing yes instead of no
    {
      if (Math.floor(Math.random() * 100) <= randomPercent)
      {
        console.log("4")
        worthWatching = true;
      }
    }
    return worthWatching;
  }

  function worthIt2(yourTeamScore: number, opponentScore: number)
  {
    return false;
  }

  try
  {
    const url = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=" + YOUR_TEAM_ID + "&date=" + date;

    const gameDataRaw = await fetch(url);
    const gameData = await gameDataRaw.json();

    let gameIdStr;
    try
    {
      gameIdStr = gameData.dates[0].games[0].gamePk;
    }
    catch (err)
    {
      return res.json({ "error" : "Cannot locate game - make sure your team played on this date."});
    }

    if (gameData.dates[0].games[0].status.detailedState !== "Final")
    {
      return res.json({ "error" : "This game has not been completed - please check back later."});
    }

    const boxScoreUrl = "https://statsapi.web.nhl.com/api/v1/game/" + gameIdStr + "/boxscore";

    const boxScore = await fetch(boxScoreUrl);
    const gameResults = await boxScore.json();

    if (gameResults == null || gameResults === {})
    {
      return res.json({ "error" : "Cannot retrieve game results."});
    }

    const homeTeam = gameResults.teams.home;
    const awayTeam = gameResults.teams.away;

    const homeScore = homeTeam.teamStats.teamSkaterStats.goals;
    const awayScore = awayTeam.teamStats.teamSkaterStats.goals;

    console.log(typeof homeTeam.team.id)
    console.log(typeof awayTeam.team.id)

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
      return res.json({ "error" : "Cannot locate team"})
    }

    console.log("your team score: " + yourTeamScore);
    console.log("opponent team score: " + opponentScore);

    let worthWatching;
    switch (metric)
    {
      case "1":
        worthWatching = worthIt1(yourTeamScore, opponentScore);
        break;
    }

    res.json({"worthWatching": worthWatching, "error": null});
  }
  catch (err)
  {
    console.error(err);
    res.json({"error": "Failed to fetch data"});
  }
})

/*
  body: {}
*/
app.post('/api/setMetric', (request, response) => {
  response.send(request.body);    // echo the result back
});





app.get("/test", (req, res) => {
  console.log("/test")
  res.json({message: "Hello World"});
})

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
//   });


// Don't touch the following - Heroku gets very finnicky about it

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

const root = path.join(__dirname, '..', 'client', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on port ${port}`)
});