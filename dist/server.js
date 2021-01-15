"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const app = express_1.default();
app.use(body_parser_1.default.json());
/*
  Body: {differential: number, }
*/
app.post('/api/worthWatching/:teamId/:date/:metric', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const YOUR_TEAM_ID = Number.parseInt(req.params.teamId, 10);
    const date = req.params.date;
    const metric = req.params.metric;
    console.log(`/api/worthWatching/${YOUR_TEAM_ID}/${date}/${metric}`);
    // const body = req.body;
    console.log(req.body);
    const differential = req.body.differential;
    const randomPercent = req.body.randomPercent;
    const maxWinDifferential = req.body.maxWinDifferential;
    // win, lose by 1, 10% random
    function worthIt1(yourTeamScore, opponentScore) {
        let worthWatching = false;
        if (yourTeamScore > opponentScore) // your team wins
         {
            if (maxWinDifferential > 0 && !isNaN(maxWinDifferential)) // not a blowout
             {
                worthWatching = Math.abs(yourTeamScore - opponentScore) <= maxWinDifferential;
            }
            else {
                worthWatching = true;
            }
        }
        else if (Math.abs(opponentScore - yourTeamScore) <= differential) // the differential is close enough
         {
            console.log(Math.abs(opponentScore - yourTeamScore));
            console.log("differential: " + differential);
            console.log("2");
            worthWatching = true;
        }
        if (worthWatching === false) // random chance of showing yes instead of no
         {
            if (Math.floor(Math.random() * 100) <= randomPercent) {
                console.log("4");
                worthWatching = true;
            }
        }
        return worthWatching;
    }
    function worthIt2(yourTeamScore, opponentScore) {
        return false;
    }
    try {
        const url = "https://statsapi.web.nhl.com/api/v1/schedule?teamId=" + YOUR_TEAM_ID + "&date=" + date;
        const gameDataRaw = yield node_fetch_1.default(url);
        const gameData = yield gameDataRaw.json();
        let gameIdStr;
        try {
            gameIdStr = gameData.dates[0].games[0].gamePk;
        }
        catch (err) {
            return res.json({ "error": "Cannot locate game - make sure your team played on this date." });
        }
        if (gameData.dates[0].games[0].status.detailedState !== "Final") {
            return res.json({ "error": "This game has not been completed - please check back later." });
        }
        const boxScoreUrl = "https://statsapi.web.nhl.com/api/v1/game/" + gameIdStr + "/boxscore";
        const boxScore = yield node_fetch_1.default(boxScoreUrl);
        const gameResults = yield boxScore.json();
        if (gameResults == null || gameResults === {}) {
            return res.json({ "error": "Cannot retrieve game results." });
        }
        const homeTeam = gameResults.teams.home;
        const awayTeam = gameResults.teams.away;
        const homeScore = homeTeam.teamStats.teamSkaterStats.goals;
        const awayScore = awayTeam.teamStats.teamSkaterStats.goals;
        console.log(typeof homeTeam.team.id);
        console.log(typeof awayTeam.team.id);
        let yourTeamScore;
        let opponentScore;
        if (homeTeam.team.id === YOUR_TEAM_ID) {
            yourTeamScore = homeScore;
            opponentScore = awayScore;
        }
        else if (awayTeam.team.id === YOUR_TEAM_ID) {
            yourTeamScore = awayScore;
            opponentScore = homeScore;
        }
        else {
            return res.json({ "error": "Cannot locate team" });
        }
        console.log("your team score: " + yourTeamScore);
        console.log("opponent team score: " + opponentScore);
        let worthWatching;
        switch (metric) {
            case "1":
                worthWatching = worthIt1(yourTeamScore, opponentScore);
                break;
        }
        res.json({ "worthWatching": worthWatching, "error": null });
    }
    catch (err) {
        console.error(err);
        res.json({ "error": "Failed to fetch data" });
    }
}));
/*
  body: {}
*/
app.post('/api/setMetric', (request, response) => {
    response.send(request.body); // echo the result back
});
app.get("/test", (req, res) => {
    console.log("/test");
    res.json({ message: "Hello World" });
});
// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
//   });
// Don't touch the following - Heroku gets very finnicky about it
// Serve static files from the React app
app.use(express_1.default.static(path_1.default.join(__dirname, 'client/build')));
const root = path_1.default.join(__dirname, '..', 'client', 'build');
app.use(express_1.default.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
//# sourceMappingURL=server.js.map