import {NextFunction, Request, Response} from 'express';

const router = require('express').Router();
const fetch = require('node-fetch');

import slackController from '../controller/slackController';
import tutorialController from '../controller/tutorialController'; // Create tutorial


// const token = router.get('/auth', (req: any, res: any, next: NextFunction) => {
export const userInfo = (req: any, res: any, next: any) => {
    console.log(req.body)

    //     .then(() => {
    //     fetch(userIdentityUrl, {
    //         method: 'get',
    //         headers: {
    //             Authorization: `Bearer ${access_token}`,
    //         }
    //     })
    //         .then((response: any) => {
    //             response.json();
    //         })
    //         .then((json: any) => {
    //
    //             console.log('user', json)
    //             // res.send(json)
    //         });
    // });
    next();

};

const token1 = router.get('/auth', (req: any, res: any, next: any) => {
    console.log('token1')
    if (!req.query.code) {
        //error
        res.send(new Error('no code'));
        return;
    }

    const url = `https://slack.com/api/oauth.access?code=${req.query.code}&client_id=2409863706817.2400580632678&client_secret=76d379ea705e65d0fff72fa1a10051b6`
    const userIdentityUrl = "https://slack.com/api/users.identity"
    let access_token = '';

    fetch(url, {method: 'post'})
        .then((res: any) => res.json())
        .then((json: any) => {
            access_token = json.access_token
            console.log('token', access_token)
            // res.send(json)
        })
    next();
});

router.post('/api/tutorial', tutorialController.create); // Retrieve all tutorials 
router.get('/api/tutorial', tutorialController.findAll); // Retrieve tutorial by id 
router.get('/api/tutorial/:id', tutorialController.findOne); // Update tutorial by id 
router.put('/api/tutorial/:id', tutorialController.update); // Delete tutorial by id 
router.delete('/api/tutorial/:id', tutorialController.delete);


router.post('/api/slack/workStart', slackController.create);
router.post('/api/slack/workEnd', slackController.update);

router.get('/api/slack/getCode', userInfo, slackController.update);


module.exports = router;



