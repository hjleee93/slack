"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const slackController_1 = require("../controller/slackController");
const tutorialController_1 = require("../controller/tutorialController"); // Create tutorial 
router.post('/api/tutorial', tutorialController_1.default.create); // Retrieve all tutorials 
router.get('/api/tutorial', tutorialController_1.default.findAll); // Retrieve tutorial by id 
router.get('/api/tutorial/:id', tutorialController_1.default.findOne); // Update tutorial by id 
router.put('/api/tutorial/:id', tutorialController_1.default.update); // Delete tutorial by id 
router.delete('/api/tutorial/:id', tutorialController_1.default.delete);
router.post('/api/slack/workStart', slackController_1.default.create);
router.post('/api/slack/workEnd/:id', slackController_1.default.update);
module.exports = router;
//# sourceMappingURL=route.js.map