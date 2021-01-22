import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { getResults } from './metrics';

const app = express();

app.use(bodyParser.json());



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

/*
  body: {}
*/
app.post('/api/setMetric', (request, response) => {
  response.send(request.body);    // echo the result back
});




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