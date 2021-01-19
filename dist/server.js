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
const metrics_1 = require("./metrics");
const app = express_1.default();
app.use(body_parser_1.default.json());
/*
  Body: {
    differential,
    randomPercent,
    maxWinDifferential,
  }
*/
app.post('/api/worthWatching/:teamId/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const YOUR_TEAM_ID = Number.parseInt(req.params.teamId, 10);
    const date = req.params.date;
    console.log(`/api/worthWatching/${YOUR_TEAM_ID}/${date}`);
    // const body = req.body;
    console.log(req.body);
    const losingMargin = req.body.differential;
    const randomPercent = req.body.randomPercent;
    const maxWinDifferential = req.body.maxWinDifferential;
    const result = yield metrics_1.getResults(YOUR_TEAM_ID, date, losingMargin, randomPercent, maxWinDifferential);
    res.json(result);
}));
/*
  body: {}
*/
app.post('/api/setMetric', (request, response) => {
    response.send(request.body); // echo the result back
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