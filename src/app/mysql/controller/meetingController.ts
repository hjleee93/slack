import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import sequelize from 'sequelize';
import fetch from "node-fetch"
// import qs from 'qs'
// import SlackUser from "../model/slackUser";

import axios from "axios"

const db = require('../model')
const qs = require('qs');

const BookingStatus = db.bookingStatus;
const Participant = db.participant;
const Op = db.sequelize.Op;


class meetingController {

    booking = async (req: any, res: any) => {

    }

    event = async (req: any, res: any) => {

        const {type, user, channel, tab, text, subtype} = req.body.event;


        if (type === 'app_home_opened') {
            await this.displayHome(user);
        }

        // res.send(req.body)


    }

    displayHome = async (user: any, data?: any) => {
        const token = 'xoxb-2409863706817-2407536745683-AfrEWCjdEw3ejwZxQtFwVEDr'
        const view = await this.updateView(user)

        const args = {
            token: 'xoxb-2409863706817-2407536745683-AfrEWCjdEw3ejwZxQtFwVEDr',
            user_id: user,
            view: await this.updateView(user)
        };

        console.log(qs.stringify(args))

        // const result = await fetch(new URL('https://slack.com/api/views.publish'), {
        //     method: 'post',
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        //     body: JSON.stringify({
        //         user_id: user,
        //         view:qs.stringify(view)
        //
        //     })
        // });
        const result = await axios.post('https://slack.com/api/views.publish', qs.stringify(args));

        console.log(result)
    };

    updateView = async (user: any) => {
        let blocks = [
            {

                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "출근"
                        },
                        "style": "primary",
                        "value": "click_me_123",
                        "action_id": "work_start"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "퇴근"
                        },
                        "style": "danger",
                        "value": "click_me_123",
                        "action_id": "work_end"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "근태확인"
                        },
                        "value": "click_me_123",
                        "action_id": "work_history"
                    }
                ]
            },
            {
                "type": "divider"
            },
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "회의실",
                    "emoji": true
                }
            },
            {
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "예약",
                            "emoji": true
                        },
                        "style": "primary",
                        "value": "create_task",
                        "action_id": "meeting_booking"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "취소",
                            "emoji": true
                        },
                        "style": "danger",
                        "value": "create_task",
                        "action_id": "meeting_cancel"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "수정",
                            "emoji": true
                        },
                        "value": "create_project",
                        "action_id": "meeting_edit"
                    },
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "확인",
                            "emoji": true
                        },
                        "value": "help",
                        "action_id": "meeting_list"
                    }
                ]
            }
        ]


        let view = {
            type: 'home',
            title: {
                type: 'plain_text',
                text: 'Keep notes!'
            },
            blocks: blocks
        }

        return JSON.stringify(view);
    };

    actions = async (req: any, res: any) => {


        const {token, trigger_id, user, actions, type} = JSON.parse(req.body.payload);

        if (actions && actions[0].action_id.match(/meeting_booking/)) {
            await this.openModal(trigger_id);
        }
        //modal submission
        if (type === 'view_submission') {
            const formValues = JSON.parse(req.body.payload).view;
            // const bookingId =

            console.log('formValues', formValues)
            await this.createBooking(formValues, user)

            // await this.closeModal(user)

            res.send({
                "response_action": "update",
                "view": {
                    "type": "modal",
                    "title": {
                        "type": "plain_text",
                        "text": "Updated view"
                    },
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text": "예약 완료됨"
                            }
                        }
                    ]
                }
            })
        }

    }

    openModal = async (trigger_id: any) => {

        const modal = {
            type: 'modal',
            "title": {
                "type": "plain_text",
                "text": "My App",
                "emoji": true
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit",
                "emoji": true
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel",
                "emoji": true
            },
            blocks: [
                // Text input
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "선택부탁",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select an item",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "302",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "402",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            // {
                            //     "text": {
                            //         "type": "plain_text",
                            //         "text": "*this is plain_text text*",
                            //         "emoji": true
                            //     },
                            //     "value": "value-2"
                            // }
                        ],
                        "action_id": "room_number"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "회의실",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "title"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "안건",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input",
                        "multiline": true,
                        "action_id": "description"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "자세히",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "datepicker",
                        // 1990-04-28"
                        "initial_date": moment().format('yyyy-MM-DD'),
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date",
                            "emoji": true
                        },
                        "action_id": "date"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "미팅 할 날짜",
                        "emoji": true
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "static_select",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "회의 시작 시각",
                                "emoji": true
                            },
                            "options": [


                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "09:00",
                                        "emoji": true
                                    },
                                    "value": "value-2"
                                }
                            ],
                            "action_id": "start"
                        },
                        //회의 끝
                        {
                            "type": "static_select",
                            "placeholder": {
                                "type": "plain_text",
                                "text": "회의 종료 시각",
                                "emoji": true
                            },
                            "options": [
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "11:00",
                                        "emoji": true
                                    },
                                    "value": "value-0"
                                },

                            ],
                            "action_id": "end"
                        }
                    ]
                },
                //참석자
                {
                    "type": "input",
                    "element": {
                        "type": "multi_users_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select users",
                            "emoji": true
                        },
                        "action_id": "participant_list"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "미팅 참여자",
                        "emoji": true
                    }
                },

            ]
        };
        const token = 'xoxb-2409863706817-2407536745683-AfrEWCjdEw3ejwZxQtFwVEDr'
        const args = {
            token: token,
            trigger_id: trigger_id,
            view: JSON.stringify(modal)
        };
        console.log(args)

        const result = await axios.post('https://slack.com/api/views.open', qs.stringify(args));

    };

    createBooking = async (values:any, user:any) => {
        console.log(user)

        const createBooking={
             booking_id: values.id,
            creator_id:user.id
            // room_number:
            //     title: {type: D
            //         description: {t
            //             date: {type: Da
            //                 start:{type: Da
            //                     end:{type: Data
            //                         status: {type:
            //                             participant_id:



        }
        console.log('createBooking',values)


        // const isBooked = await BookingStatus.create();

    }

}

export default new meetingController;