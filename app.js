import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import {google} from 'googleapis';

// use router
import {router as authRouter} from './src/routers/authRouter.js';
import {router as userRouter} from './src/routers/userRouter.js';
import {router as productRouter} from './src/routers/productRouter.js'

const app = express();
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(cors());
app.use(morgan('dev'));

const oauthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:8080/api/service-vascomm/auth/google/callback'
)

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

const authorization = oauthClient.generateAuthUrl({
    access_type : 'offline',
    scope : scopes,
    include_granted_scopes: true
})

app.get('/auth/google', (req, res) => {
    res.redirect(authorization)
})

app.use((req, res, next) => {
  res.jsonf = (code, status, message, data) => {
    res.json({
      code: code,
      status: status,
      message: message,
      data: data
    }).status(code);
  };

  res.jsond = (httpStatus, code, message, data) => {
    res.json({
      code: code,
      message: message,
      data: data
    }).status(httpStatus);
  };
  next();
});


let baseUrl = `/api/${process.env.APP_NAME}`;
console.log(baseUrl);

//prefix declaration
app.use(`${baseUrl}`, 
    authRouter,
    userRouter,
    productRouter
);

app.listen(process.env.PORT, () => {
  console.log(`${process.env.APP_NAME} service started on port`, process.env.PORT);
});

export {
    app
}
