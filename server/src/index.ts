import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import bodyParser = require('body-parser');
import cors = require('cors');
import express = require('express');
import session = require('express-session');
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import uuidv4 = require('uuid/v4');
import schema from './schema';

// The GraphQL schema in string form
const PORT = 3000;

const app = express();

app.use('*', cors({ origin: `http://localhost:${PORT}` }));

// passport's session piggy-backs on express-session
app.use(session({
  genid(req) {
    return uuidv4();
  },
  secret: process.env.SESSION_SECRET_KEY || 'welcomehackers',
 }));
// bodyParser is needed just for POST.
app.use('/graphql', bodyParser.json(), graphqlExpress(request => ({
  context: {
    sessionId: request && request.session && request.session.id,
  },
  schema,
})));
app.get('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:3000/subscriptions`,
})); // if you want GraphiQL enabled

// Wrap the Express server
const ws = createServer(app);
ws.listen(PORT, () => (
  new SubscriptionServer({
    execute,
    schema,
    subscribe,
  }, {
    path: '/subscriptions',
    server: ws,
  })
));