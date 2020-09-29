const createError = require('http-errors');
import express from 'express';
import {Request} from 'express';
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
import auth from './server/middleware/auth';

import { graphqlHTTP } from 'express-graphql';
import { schema } from './src/schema/schema';
import { resultantSchemaForOrganization } from './server/schema/schema';
import mongoose from 'mongoose';

const app = express();

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://RadiantEngr:Abdull@123@cluster0.m2lv9.mongodb.net/week11db',{
  useUnifiedTopology: true,
  useCreateIndex:true,
  useNewUrlParser:true,
  useFindAndModify:true
})

mongoose.connection.once('open', () => {
  console.log('connected to MongoDB');
})


// app.use('/user');

app.use("/graphql1", graphqlHTTP((req: Request) => ({
  schema: resultantSchemaForOrganization,
  graphiql: true,
  context: auth(req)
})));

app.use("/graphql2", graphqlHTTP((req: Request) => ({
  schema: schema,
  graphiql: true,
//   context: auth(req)
})));


//error handlers
app.use(function(req: any, res: any, next: any) {
  next(createError(404));
});

app.use(function(err: any, req: any, res: any, next: any) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;