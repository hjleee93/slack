import * as moment from 'moment-timezone';
import sequelize from 'sequelize';

const db = require('../model')

const Slack = db.slack;

const Op = db.sequelize.Op;

// import {token} from '../route/route';


class slackController {

    private currTime = moment()
    private regWorkTime = this.currTime.format('yyyy-MM-DDT10:00:59')

    constructor() {
        console.log(this.currTime.format('yyyy-MM-DDT10:00:59'))
        console.log(this.currTime)
        console.log(this.currTime.isAfter(this.regWorkTime))
        console.log(this.currTime.subtract(1, 'd').format('YYYY-MM-DD'))
    }

    create = (req: any, res: any) => {

        const userId = req.body.user_id;
        const condition = userId ? {where: {userId: userId}} : null;

        const slack =
            {
                userId: req.body.user_id,
                userName: req.body.user_name,
                workStart: this.currTime.format('YYYY-MM-DDTHH:mm:ss')
                // status:this.currTime.isAfter(this.regWorkTime) ? 'late' : ''
                // workEnd: req.body.workEnd,
                // published: req.body.published ? req.body.published : false
            };
//this.currTime.format('yyyy-MM-DD')
        //sequelize.fn('DATE_FORMAT', sequelize.col('%Y-%m-%d')),
        Slack.findOne({
            // attributes:['workStart'],
            where:
                sequelize.where(sequelize.fn('DATE_FORMAT', sequelize.col('workStart'), '%Y-%m-%d'), this.currTime.format('yyyy-MM-DD')),
                userId: userId,
        }).then((data: any) => {
            console.log(data)
            // res.send(data);
            if (!data) {
                Slack
                    .create(slack)
                    .then((data: any) => {
                        console.log(data)
                        res.send(data);
                    })
                    .catch((err: { message: any; }) => {
                        res.status(500)
                            .send({message: err.message || 'Create slack failure.'});
                    });
            } else {
                console.log('here')
                res.send('이미 출근 하심')
            }
        }).catch((err: { message: any; }) => {
            res.status(500).send({message: err.message || 'error..'});
        })


        // Slack
        //     .create(slack)
        //     .then((data: any) => {
        //         console.log(data)
        //         res.send(data);
        //     })
        //     .catch((err: { message: any; }) => {
        //         res.status(500)
        //             .send({message: err.message || 'Create slack failure.'});
        //     });

        // Slack.sync({force:true})
    };


    findAll = (req: any, res: any) => {
        // const title = req.query.title;
        let condition = {where: {}};

        // if (keyword) {
        //     condition = { where: { [Op.or]: [{ title: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }] } }
        // };
        Slack.findAll(condition)
            .then((data: any) => {
                res.send(data);
            })
            .catch((err: { message: any; }) => {
                res.status(500).send({message: err.message || 'Retrieve all slack failure.'});
            });
    };

    // Update tutorial by id F
    update = (req: any, res: any) => {


        const userId = req.body.user_id;
        const condition = userId ? {where: {userId: userId}} : null;

        Slack.update({workEnd: this.addHoursToDate(new Date(), 9)},
            {where: {userId: userId}})
            .then((resultCount: number) => {
                if (resultCount == 1) {
                    res.send({message: 'Tutorial updated.'});
                }
                console.debug('data', condition)
            })
            .catch((err: { message: any; }) => {
                res.status(500).send({message: err.message || 'Update slack failure. (id: ' + userId + ')'});
            });
    };


    addHoursToDate(date: Date, hours: number): Date {
        return new Date(new Date(date).setHours(date.getHours() + hours));
    }
}


export default new slackController;