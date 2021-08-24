import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import sequelize from 'sequelize';
// import SlackUser from "../model/slackUser";

const db = require('../model')

const Slack = db.slack;
const SlackUser = db.slackUser;
const WorkLog = db.workLog;
const Op = db.sequelize.Op;

// import {token} from '../route/route';


class slackController {

    private currTime = moment()
    private regWorkTime = moment().format('yyyy-MM-DDT10:00:59')

    constructor() {
        console.log(moment())
        console.log(this.regWorkTime)
        console.log(moment().isAfter(this.regWorkTime))

    }

    workStart = async (req: any, res: any) => {

        console.log(req.body)
        console.log(res.body)

        const user_id = req.body.user_id;
        const condition = user_id ? {where: {user_id: user_id}} : null;

        const userInfo = {
            user_id,
            userName: req.body.user_name,
        };

        const workStart = {
            user_id,
            start: moment().format('YYYY-MM-DDTHH:mm:ss')
        }
        console.log(moment().format('yyyy-MM-DD').toString())

        const isWorkStart = await WorkLog.findOne({
            // attributes:['workStart'],
            where: {
                user_id,
                start: {
                    //범위
                    [Op.gte]: moment().format('yyyy-MM-DD').toString(),
                    [Op.lt]: moment().add(1,'day').format('yyyy-MM-DD').toString(),
                }
            }
        })

        if (!isWorkStart) {
            const user = await SlackUser.create(userInfo)

            if (!user) {
                res.status(500).send('Create User for slack failure')
            } else {
                const time = await WorkLog.create(workStart)

                if (!time) {
                    res.status(500).send(`Create WorkLog for ${userInfo.userName}  failure`)
                }
                res.send(`${userInfo.userName}이(가) ${workStart.start}에 출근 처리되었습니다.`)
                // fetch(`${req.body.response_url}`)

            }
        } else {
            res.send('이미 출근하셨습니다')
        }
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

    findHistory = async (req: any, res: any) => {
        console.log('history', req.body)
        const hasParam = req.body.text;

        if (hasParam) {

        } else {

        }
        const user_id = req.body.user_id;

        // const workHistory = await SlackUser.findOne({
        //     where: {user_id},
        //     include: [
        //         {
        //             model: WorkLog,
        //             // attributes: ['user_id','start', 'end'],
        //             // required: true
        //         },
        //
        //     ],
        // })
        const workHistory = await WorkLog.findAll({
            where: { user_id },

        })

        const result = _.map(workHistory, (log: any) => {
            return {
                start: log.start,
                end: log.end,
                is_야근: true,
                초과근무: true,
            }
        })
        res.send(result);
    }


    workEnd = async (req: any, res: any) => {

        const userId = req.body.user_id;
        const workEnd = moment().format('YYYY-MM-DDTHH:mm:ss');

        const isWorkStart = await WorkLog.findOne({
            // attributes:['workStart'],
            where: {
                user_id: req.body.user_id,
                start: {
                    [Op.eq]: moment().format('yyyy-MM-DD').toString()
                }
            }
        })

        console.log('isWorkStart', isWorkStart)

        if (isWorkStart) {
            const workDone = WorkLog.update({workEnd: workEnd},
                {where: {userId: userId}})

            if (workDone === 1) {
                res.send(`${workEnd}에 퇴근 처리되었습니다.`);
            } else {
                res.status(500).send('Update slack failure. (id: ' + userId + ')')
            }

        } else {
            res.send('출근 기록이 없습니다. "/출근"을 입력해주세요');
        }
    }


}


export default new slackController;