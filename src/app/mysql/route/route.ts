import {NextFunction, Request, Response} from 'express';

const router = require('express').Router();
const fetch = require('node-fetch');



import slackController from '../controller/slackController'


//
// router.post('/api/slack', slackSlashController.basicApi);
// router.post('/api/slack/workStart', slackSlashController.workStart);
// router.post('/api/slack/workEnd', slackSlashController.workEnd);
// router.post('/api/slack/openDatePicker', slackSlashController.openCalender)
// router.post('/api/slack/workAnalytics', slackSlashController.findHistory)


router.post('/slack/events',slackController.event)
router.post('/slack/actions', slackController.actions)

// router.get('/api/slack/getCode', userInfo, slackController.update);


module.exports = router;



