// GOAL: implement authentication/authorization
require('dotenv').config();
const express = require('express');
const app = express();
const { port = 3000 } = process.env;
const cors = require('cors');
const morgan = require('morgan');
const { auth, requiresAuth } = require('express-openid-connect');

//  middleware
app.use(express.json());  // can read JSON in req.body
app.use(express.urlencoded({extended:true})) // can read url-encoded data in req.body
app.use(cors()); // enable CORS
app.use(morgan('dev')); // log requests to console

// object destructuring to get stuff out of process.env
const { AUTH0_BASE_URL, AUTH0_SECRET, AUTH0_CLIENT_ID, AUTH0_ISSUER_BASE_URL } = process.env;

// load up the configurations
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_BASE_URL,
  clientID: AUTH0_CLIENT_ID, // id of app
  issuerBaseURL: AUTH0_ISSUER_BASE_URL
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  // res.send(req.oidc.idToken);
  // res.send(req.oidc.user);
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(req.oidc.user);
})

// // is the server running?
// app.get('/', (req, res) => {
//   res.send("I'm alive!");
// })

// error handling middleware
app.use((error, req, res, next) => {
    console.error('SERVER ERROR: ', error);
    if(res.statusCode < 400) res.status(500);
    res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});