import {NextFunction, Request, Response} from 'express';

const router = require('express').Router();
const fetch = require('node-fetch');

import slackController from '../controller/slackController';
import meetingController from '../controller/meetingController'

router.get('/auth', (req: any, res: any, next: any) => {

    console.log('token1', req.query.code)
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
            res.send(json)
        })
        .then(() => {
            fetch(userIdentityUrl, {
                method: 'get',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            })
                .then((response: any) => {
                    response.json();
                })
                .then((json: any) => {
                    console.log('user', json)
                    // res.send(json)
                });
        })
});


router.post('/api/slack', slackController.basicApi);
router.post('/api/slack/workStart', slackController.workStart);
router.post('/api/slack/workEnd', slackController.workEnd);
router.post('/api/slack/openDatePicker', slackController.openCalender)
router.post('/api/slack/workAnalytics', slackController.findHistory)

router.post('/api/slack/meeting/book', meetingController.booking)

router.post('/slack/events',meetingController.event)
router.post('/slack/actions', meetingController.actions)

// router.get('/api/slack/getCode', userInfo, slackController.update);


module.exports = router;



