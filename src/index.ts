import {request} from "express";

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;
// Set CORS option 
app.use(cors());
// Parse requests of content-type: application/json 
app.use(bodyParser.json());
// Parse requests of content-type: application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));
// RESTful API route for DB 
app.use('/', require('./app/mysql/route/route'));
// DB Connection 

const db2 = require('./app/mysql/model');
db2.sequelizeConfig.sync();
// Default route for server status 
app.get('/', (req: any, res: any) => {
    res.send('<a href="https://slack.com/oauth/authorize?scope=commands+team%3Aread&client_id=2409863706817.2400580632678">\n' +
        '    <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />\n' +
        '</a>')
});

app.get('/auth', function(req: any, res:any){
    console.debug('req', req.query)
    console.debug('res', res)
    if (!req.query.code) { // access denied

        return;
    }
    let data = {form: {
            client_id: '2409863706817.2400580632678',
            client_secret: '76d379ea705e65d0fff72fa1a10051b6',
            code: req.query.code
        }};
    app.post('https://slack.com/api/oauth.access', data, function (error:any, response:any , body:any) {
        if (!error && response.statusCode == 200) {
            // Get an auth token
            let oauthToken = JSON.parse(body).access_token;
            // OAuth done- redirect the user to wherever
            res.redirect(__dirname + "/public/success.html");
        }
    })
});

// Set listen port for request 
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

