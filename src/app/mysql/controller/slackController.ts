import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import sequelize from 'sequelize';
import fetch from "node-fetch"
// import SlackUser from "../model/slackUser";

const db = require('../model')

const Slack = db.slack;
const SlackUser = db.slackUser;
const WorkLog = db.workLog;
const Op = db.sequelize.Op;

class slackController {

    workStart = async (req: any, res: any) => {

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
            where: {
                user_id,
                start: {
                    //범위
                    [Op.gte]: moment().format('yyyy-MM-DD').toString(),
                    [Op.lt]: moment().add(1, 'day').format('yyyy-MM-DD').toString(),
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

            }
        } else {
            res.send('이미 출근처리되었습니다.')
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

    openCalender = async (req:any, res:any)=>{
        const body={
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Pick a date for the deadline."
                    },
                    "accessory": {
                        "type": "datepicker",
                        "initial_date": "1990-04-28",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date",
                            "emoji": true
                        },
                        "action_id": "datepicker-action"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "근태확인 할 날짜를 선택하세요",
                        "emoji": true
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "datepicker",
                            "initial_date":moment().subtract(3,'months').format('yyyy-MM-DD'),
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select a date",
                                "emoji": true
                            },
                            "action_id": "actionId-0"
                        },

                        {
                            "type": "datepicker",
                            "initial_date": moment().format('yyyy-MM-DD'),
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select a date",
                                "emoji": true
                            },
                            "action_id": "action_approve"
                        },

                    ]
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "확인",
                                "emoji": true
                            },
                            "value": "click_me_123",
                            "action_id": "actionId-0"
                        }
                    ]
                }

            ]
        }
        console.log(body)

        fetch(new URL(`${req.body.response_url}`), {
            method: 'post',
            body: JSON.stringify(body),
            headers: {'Content-Type': 'application/json'}
        })
            .catch((err:any)=>{
                res.status.send('response err')
            })

        res.send()
    }

    findHistory = async (req: any, res: any) => {

        const response = JSON.parse(req.body.payload);

        console.log(response.actions)

        const user_id = response.user.id;


            const workHistory = await WorkLog.findAll({
                where: {user_id},
            })

            const result = _.map(workHistory, (log: any) => {
                return {
                    start: log.start,
                    end: log.end,
                    is_야근: true,
                    초과근무: true,
                }
            })
            // res.send(result)

            // const body = {
            //     text: '최근 한달간의 근태 기록입니다.',
            //     response_type: "ephemeral"
            // };
            console.log(moment().subtract(3,'m').format('yyyy-MM-DD'))





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

    }


    workEnd = async (req: any, res: any) => {

        const user_id = req.body.user_id;
        const workEnd = moment().format('YYYY-MM-DDTHH:mm:ss');

        const isWorkStart = await WorkLog.findOne({
            where: {
                user_id,
                start: {
                    //범위
                    [Op.gte]: moment().format('yyyy-MM-DD').toString(),
                    [Op.lt]: moment().add(1, 'day').format('yyyy-MM-DD').toString(),
                }
            }
        })

        const isWorkEnd = await WorkLog.findOne({
            where: {
                user_id,
                end: {
                    //범위
                    [Op.gte]: moment().format('yyyy-MM-DD').toString(),
                    [Op.lt]: moment().add(1, 'day').format('yyyy-MM-DD').toString(),
                }
            }
        })

        console.log('isWorkStart', isWorkStart)

        if (isWorkEnd) {
            res.send('이미 퇴근하셨습니다')
        } else if (isWorkStart) {
            const workDone = await WorkLog.update({end: workEnd},
                {where: {user_id}})

            if (workDone[0] === 1) {

                res.send(`${workEnd}에 퇴근 처리되었습니다.`);
            } else {
                res.status(500).send('Update slack failure. (id: ' + user_id + ')')
            }

        } else {
            res.send('출근 기록이 없습니다. "/출근"을 입력해주세요');
        }
    }


}


export default new slackController;