import express from 'express';
import path from 'path';

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.json({message: "Hello World"});
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log( `server started at http://localhost:${ port }` );
});
