import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { getResults } from './metrics';
import fetch from "node-fetch";

const app = express();

app.use(bodyParser.json());

//tslint:disable
const hash = (input: string): number => {
  let hash = 0, i, chr;
  for (i = 0; i < input.length; i++)
  {
    chr = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
// tslint:enable

/*
  Body: {
    differential,
    randomPercent,
    maxWinDifferential,
    hatTrickHome,
    hatTrickAway
  }
*/
app.post('/api/worthWatching/:teamId/:date', async (req, res) => {
  const YOUR_TEAM_ID: number = Number.parseInt(req.params.teamId, 10);
  const date = req.params.date;

  console.log(`/api/worthWatching/${YOUR_TEAM_ID}/${date}`);

  // const body = req.body;
  console.log(req.body)

  const losingMargin = req.body.differential;
  const randomPercent = req.body.randomPercent;
  const maxWinDifferential = req.body.maxWinDifferential;
  const hatTrickHome: boolean = req.body.hatTrickHome;
  const hatTrickAway: boolean = req.body.hatTrickAway;

  const result = await getResults(YOUR_TEAM_ID, date, losingMargin, randomPercent, maxWinDifferential,
    hatTrickHome, hatTrickAway);

  res.json(result);
})

// log the IP address of each user on page load so we can estimate the unique visitors
app.get('/api/initialStartup', async(req, res) => {
  const url = "https://json.geoiplookup.io/";
  const infoRaw = await fetch(url);
  const info = await infoRaw.json();

  const ip = info.ip;
  console.log(`Visitor IP: ||${hash(ip)}||`);
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