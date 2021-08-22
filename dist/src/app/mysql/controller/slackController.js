"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../model');
const Slack = db.slack;
const Op = db.sequelize.Op;
class slackController {
    constructor() {
        this.create = (req, res) => {
            // Validate request 
            // if (!req.body.title) { res.status(400).send({ message: 'Title is empty!' }); return; }
            // Set tutorial 
            const slack = {
                workStart: this.addHoursToDate(new Date(), 9),
                // workEnd: req.body.workEnd,
                // published: req.body.published ? req.body.published : false
            };
            // Save tutorial 
            Slack
                .create(slack)
                .then((data) => {
                res.send(data);
            })
                .catch((err) => {
                res.status(500)
                    .send({ message: err.message || 'Create slack failure.' });
            });
        };
        this.findAll = (req, res) => {
            // const title = req.query.title;
            let condition = { where: {} };
            // if (keyword) {
            //     condition = { where: { [Op.or]: [{ title: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }] } }
            // };
            Slack.findAll(condition)
                .then((data) => { res.send(data); })
                .catch((err) => { res.status(500).send({ message: err.message || 'Retrieve all slack failure.' }); });
        };
        // Update tutorial by id F
        this.update = (req, res) => {
            const id = req.params.id;
            const condition = id ? { where: { id: id } } : null;
            Slack.update({ workEnd: this.addHoursToDate(new Date(), 9) }, { where: { id: id } })
                .then((resultCount) => {
                if (resultCount == 1) {
                    res.send({ message: 'Tutorial updated.' });
                }
                console.debug('data', condition);
            })
                .catch((err) => { res.status(500).send({ message: err.message || 'Update slack failure. (id: ' + id + ')' }); });
        };
    }
    addHoursToDate(date, hours) {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }
}
exports.default = new slackController;
//# sourceMappingURL=slackController.js.map