const {google} = require('googleapis');
const axios = require('axios')
const express = require('express')
const app = express();
const port = 8080
// Each API may support multiple version. With this sample, we're getting
// v1 of the urlshortener API, and using an API key to authenticate.
const secret = require('./client_secret.json')

const oauth2Client = new google.auth.OAuth2(
    secret.web.client_id,
    secret.web.client_secret,
    secret.web.redirect_uris[0]
  );

  google.options({
      timeout: 10000,
      auth: secret.api_key
  })
  const googleChat = google.chat.spaces
  console.log('GOOGLECHAT', google.chat());
  // generate a url that asks permissions for Google+ and Google Calendar scopes
  const scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/hangout.av',
    'https://www.googleapis.com/auth/hangout.participants'

  ];
  
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
  
    // If you only need one scope you can pass it as a string
    scope: scopes
  });
  
  app.listen(port, _ => {
    console.log('Server listening at port number', port)
  })
  /*
Routes
  */
  app.get('/', function (req, res) {
    res.redirect(url);
  })

  app.get('/redirect', function (req, res) {
    const {code} = req.query;
    console.log('Authroizaation code from Google', code)
    let tokens;
    
    oauth2Client.getToken(code)
        .then(data => {
            tokens = data.tokens;
            oauth2Client.setCredentials(tokens);
            return axiosGetSpaces();
        })
        .then(_ => {
            res.send('Complete...')
        })
        .catch(err => {
            console.error('ERROR /redirect', err);
        })
    
    
  })

function axiosGetSpaces () {
    // return googleChat.list({})
    //     .then(res => {
    //         console.log('Response', res)
    //     })
    //     .catch(err => {
    //         console.error('ERROR axiosGetSpaces', err)
    //     }) 
}
