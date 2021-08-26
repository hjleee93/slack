"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const moment = require("moment-timezone");
const node_fetch_1 = require("node-fetch");
// import SlackUser from "../model/slackUser";
const axios_1 = require("axios");
const slackConfig_1 = require("../config/slackConfig");
const qs = require('qs');
const db = require('../model');
const SlackUser = db.slackUser;
const WorkLog = db.workLog;
const Op = db.sequelize.Op;
class workTimeController {
    constructor() {
        this.basicApi = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req);
            res.send();
        });
        this.workStart = (user, trigger_id) => __awaiter(this, void 0, void 0, function* () {
            const user_id = user.id;
            const condition = user_id ? { where: { user_id: user_id } } : null;
            const userInfo = {
                user_id,
                user_name: user.username,
            };
            const workStart = {
                user_id,
                start: moment().format('YYYY-MM-DDTHH:mm:ss')
            };
            console.log(moment().format('yyyy-MM-DD').toString());
            const isWorkStart = yield WorkLog.findOne({
                where: {
                    user_id,
                    start: {
                        //범위
                        [Op.gte]: moment().format('yyyy-MM-DD').toString(),
                        [Op.lt]: moment().add(1, 'day').format('yyyy-MM-DD').toString(),
                    }
                }
            });
            console.log('userInfo', userInfo);
            if (!isWorkStart) {
                const user = yield SlackUser.create(userInfo);
                console.log('user', user);
                if (!user) {
                    // res.status(500).send('Create User for slack failure')
                }
                else {
                    const time = yield WorkLog.create(workStart);
                    if (!time) {
                        // res.status(500).send(`Create WorkLog for ${userInfo.userName}  failure`)
                    }
                    yield this.openModal(trigger_id, '출근 처리되었습니다.');
                }
            }
            else {
                yield this.openModal(trigger_id, '이미 출근처리되었습니다.');
            }
        });
        this.workEnd = (user, trigger_id) => __awaiter(this, void 0, void 0, function* () {
            const user_id = user.id;
            const workEnd = moment().format('YYYY-MM-DDTHH:mm:ss');
            const isWorkStart = yield WorkLog.findOne({
                where: {
                    user_id,
                    start: {
                        //범위
                        [Op.gte]: moment().format('yyyy-MM-DD').toString(),
                        [Op.lt]: moment().add(1, 'day').format('yyyy-MM-DD').toString(),
                    }
                }
            });
            const isWorkEnd = yield WorkLog.findOne({
                where: {
                    user_id,
                    end: {
                        //범위
                        [Op.gte]: moment().format('yyyy-MM-DD').toString(),
                        [Op.lt]: moment().add(1, 'day').format('yyyy-MM-DD').toString(),
                    }
                }
            });
            if (isWorkEnd) {
                yield this.openModal(trigger_id, '이미 퇴근하셨습니다.');
            }
            else if (isWorkStart) {
                const workDone = yield WorkLog.update({ end: workEnd }, { where: { user_id } });
                if (workDone[0] === 1) {
                    yield this.openModal(trigger_id, '퇴근 처리되었습니다. ');
                }
                else {
                    // res.status(500).send('Update slack failure. (id: ' + user_id + ')')
                }
            }
            else {
                yield this.openModal(trigger_id, '출근기록이 없습니다. 출근 버튼 먼저 눌러주세요');
            }
        });
        this.openModal = (trigger_id, text) => __awaiter(this, void 0, void 0, function* () {
            const modal = {
                "type": "modal",
                "title": {
                    "type": "plain_text",
                    "text": "My App",
                    "emoji": true
                },
                "close": {
                    "type": "plain_text",
                    "text": "ok",
                    "emoji": true
                },
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "plain_text",
                            "text": text,
                            "emoji": true
                        }
                    }
                ]
            };
            const args = {
                token: slackConfig_1.default.token,
                trigger_id: trigger_id,
                view: JSON.stringify(modal)
            };
            console.log('args', args);
            const result = yield axios_1.default.post('https://slack.com/api/views.open', qs.stringify(args));
            console.log(result);
        });
        // findAll = (req: any, res: any) => {
        //     // const title = req.query.title;
        //     let condition = {where: {}};
        //
        //     // if (keyword) {
        //     //     condition = { where: { [Op.or]: [{ title: { [Op.like]: `%${keyword}%` } }, { description: { [Op.like]: `%${keyword}%` } }] } }
        //     // };
        //     Slack.findAll(condition)
        //         .then((data: any) => {
        //             res.send(data);
        //         })
        //         .catch((err: { message: any; }) => {
        //             res.status(500).send({message: err.message || 'Retrieve all slack failure.'});
        //         });
        // };
        this.openCalender = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = {
                "title": {
                    "type": "plain_text",
                    "text": "Add info to feedback",
                    "emoji": true
                },
                "submit": {
                    "type": "plain_text",
                    "text": "Save",
                    "emoji": true
                },
                "type": "modal",
                "blocks": [
                    {
                        "type": "input",
                        "element": {
                            "type": "plain_text_input"
                        },
                        "label": {
                            "type": "plain_text",
                            "text": "Label",
                            "emoji": true
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Test block with multi conversations select"
                        },
                        "accessory": {
                            "type": "multi_conversations_select",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select conversations",
                                "emoji": true
                            },
                            "action_id": "multi_conversations_select-action"
                        }
                    },
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
                    }
                ]
            };
            node_fetch_1.default(new URL(`${req.body.response_url}`), {
                method: 'post',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            })
                .catch((err) => {
                res.status.send('response err');
            });
            res.send();
        });
        this.workHistory = (user, historyDuration, trigger_id) => __awaiter(this, void 0, void 0, function* () {
            console.log(historyDuration);
            const user_id = user.id;
            const workHistory = yield WorkLog.findAll({
                where: {
                    user_id,
                    start: {
                        [Op.gt]: moment().subtract(historyDuration, 'days').toDate()
                    }
                },
            });
            const result = _.map(workHistory, (log) => {
                // return {
                //     start: log.start,
                //     end: log.end,
                //     is_야근: true,
                //     초과근무: true,
                // }
                return {
                    "type": "section",
                    "fields": [
                        {
                            "type": "plain_text",
                            "text": `날짜 : ${moment().subtract(historyDuration, 'days').toDate()}`,
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": ' ',
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": `출근 시간`,
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": new Date(log.start).toLocaleTimeString(),
                            "emoji": true
                        }, {
                            "type": "plain_text",
                            "text": `퇴근 시간`,
                            "emoji": true
                        },
                        {
                            "type": "plain_text",
                            "text": new Date(log.end).toLocaleTimeString(),
                            "emoji": true
                        },
                    ]
                };
            });
            // let obj = {}
            // for (let i in result) {
            // 
            //     obj = {...obj, ...result[i]}
            //   
            //
            // }
            return result;
        });
        this.findHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const response = JSON.parse(req.body.payload);
            console.log('actions', response.actions);
            const user_id = response.user.id;
            const workHistory = yield WorkLog.findAll({
                where: { user_id },
            });
            const result = _.map(workHistory, (log) => {
                return {
                    start: log.start,
                    end: log.end,
                    is_야근: true,
                    초과근무: true,
                };
            });
            // res.send(result)
            // const body = {
            //     text: '최근 한달간의 근태 기록입니다.',
            //     response_type: "ephemeral"
            // };
            console.log(moment().subtract(3, 'm').format('yyyy-MM-DD'));
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
        });
    }
}
exports.default = new workTimeController;
//# sourceMappingURL=workTimeController.js.map