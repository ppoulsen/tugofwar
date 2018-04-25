import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import bodyParser = require('body-parser');
import express = require('express');
import session = require('express-session');
import uuidv4 = require('uuid/v4');
import schema from './schema';

// The GraphQL schema in string form
const PORT = 3000;

const app = express();

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
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

app.listen(PORT);