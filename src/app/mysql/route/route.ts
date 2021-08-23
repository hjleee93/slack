const router = require('express').Router();
import slackController from '../controller/slackController';
import tutorialController from '../controller/tutorialController'; // Create tutorial 

router.post('/api/tutorial', tutorialController.create); // Retrieve all tutorials 
router.get('/api/tutorial', tutorialController.findAll); // Retrieve tutorial by id 
router.get('/api/tutorial/:id', tutorialController.findOne); // Update tutorial by id 
router.put('/api/tutorial/:id', tutorialController.update); // Delete tutorial by id 
router.delete('/api/tutorial/:id', tutorialController.delete);



router.post('/api/slack/workStart', slackController.create);
router.post('/api/slack/workEnd', slackController.update);

router.get('/api/slack/workEnd/api/slack/getCode', slackController.update);

// router.



module.exports = router;



