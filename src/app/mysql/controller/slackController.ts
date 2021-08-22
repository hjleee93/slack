

const db = require('../model')

const Slack = db.slack;

const Op = db.sequelize.Op;


class slackController {
    create = (req: any, res: any) => {
        // Validate request 
        // if (!req.body.title) { res.status(400).send({ message: 'Title is empty!' }); return; }
        // Set tutorial 

        const slack =
        {
            workStart: this.addHoursToDate(new Date(), 9),
            // workEnd: req.body.workEnd,
            // published: req.body.published ? req.body.published : false
        };
        // Save tutorial 
        Slack
            .create(slack)
            .then((data: any) => {
                res.send(data);
            })
            .catch((err: { message: any; }) => {
                res.status(500)
                    .send({ message: err.message || 'Create slack failure.' });
            });
    };



    findAll = (req: any, res: any) => {
        // const title = req.query.title;
        let condition = { where: {} };

        // if (keyword) {
        //     condition = { where: { [Op.or]: [{ title: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }] } }
        // };
        Slack.findAll(condition)
            .then((data: any) => { res.send(data); })
            .catch((err: { message: any; }) => { res.status(500).send({ message: err.message || 'Retrieve all slack failure.' }); });
    };

    // Update tutorial by id F
    update = (req: any, res: any) => {


        const id = req.params.id;
        const condition = id ? { where: { id: id } } : null;

        Slack.update({ workEnd: this.addHoursToDate(new Date(), 9) },
            { where: { id: id } })
            .then((resultCount: number) => {
                if (resultCount == 1) { res.send({ message: 'Tutorial updated.' }); }
                console.debug('data', condition)
            })
            .catch((err: { message: any; }) => { res.status(500).send({ message: err.message || 'Update slack failure. (id: ' + id + ')' }); });
    };

   
    addHoursToDate(date: Date, hours: number): Date {
        return new Date(new Date(date).setHours(date.getHours() + hours));
      }
}



export default new slackController;