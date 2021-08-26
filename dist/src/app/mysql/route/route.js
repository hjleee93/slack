"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const fetch = require('node-fetch');
const slackController_1 = require("../controller/slackController");
//
// router.post('/api/slack', slackSlashController.basicApi);
// router.post('/api/slack/workStart', slackSlashController.workStart);
// router.post('/api/slack/workEnd', slackSlashController.workEnd);
// router.post('/api/slack/openDatePicker', slackSlashController.openCalender)
// router.post('/api/slack/workAnalytics', slackSlashController.findHistory)
router.post('/slack/events', slackController_1.default.event);
router.post('/slack/actions', slackController_1.default.actions);
// router.get('/api/slack/getCode', userInfo, slackController.update);
module.exports = router;
//# sourceMappingURL=route.js.map