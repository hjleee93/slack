const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const { App } = require('@slack/bolt');
const appSlack = new App({
    signingSecret: '564d1cf10f1afffb22dd6db94f6b6875',
    token: 'xoxb-2409863706817-2407536745683-AfrEWCjdEw3ejwZxQtFwVEDr',
});

(async () => {
    // Start the app
    await appSlack.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();


const PORT = process.env.PORT || 8000;
// Set CORS option 
app.use(cors());
// Parse requests of content-type: application/json 
app.use(bodyParser.json());
// Parse requests of content-type: application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({extended: true}));
// RESTful API route for DB 
app.use('/', require('./app/mysql/route/route'));
// DB Connection 

const db2 = require('./app/mysql/model');
db2.sequelizeConfig.sync();
// Default route for server status 
app.get('/', (req: any, res: any) => {
    res.send('<a href="https://slack.com/oauth/v2/authorize?client_id=2409863706817.2400580632678&scope=commands,team:read,users.profile:read,usergroups:read&user_scope=admin,identify.basic"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>')
});
// Set listen port for request 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

