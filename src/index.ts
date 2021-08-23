
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
app.get('/', (req: any, res: any) =>{
    res.sendFile( './add_to_slack.html')  });

// Set listen port for request 
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

