import * as _ from 'lodash';
import * as moment from 'moment-timezone';
import sequelize from 'sequelize';
// import qs from 'qs'
// import SlackUser from "../model/slackUser";

import axios from "axios"
import workController from './workTimeController'

const db = require('../model')
const qs = require('qs');

const BookingStatus = db.bookingStatus;
const Participant = db.participant;
const Op = db.sequelize.Op;


class slackController {


    event = async (req: any, res: any) => {

        const {type, user, channel, tab, text, subtype} = req.body.event;

        if (type === 'app_home_opened') {
            const homeBlock = [
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
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "출퇴근 통계를 확인하고 싶은 날짜를 고르세요",
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
                                "text": "7일",
                                "emoji": true
                            },
                            "value": "7",
                            "action_id": "work_history1"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "15일",
                                "emoji": true
                            },
                            "value": "15",
                            "action_id": "work_history2"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "30일",
                                "emoji": true
                            },
                            "value": "30",
                            "action_id": "work_history3"
                        },

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
            await this.displayHome(user, homeBlock);
        }
        // res.send(req.body)
    }

    actions = async (req: any, res: any) => {

        const {token, trigger_id, user, actions, type} = JSON.parse(req.body.payload);
        console.log(type, actions)
        if (actions && actions[0].action_id.match(/work_start/)) {
            workController.workStart(user, trigger_id)
        } else if (actions && actions[0].action_id.match(/work_end/)) {
            workController.workEnd(user, trigger_id)
        } else if (actions && actions[0].action_id.match(/work_history/)) {
            const historyDuration = actions[0].value;
            const result = await workController.workHistory(user, historyDuration, trigger_id)

            const block = [
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
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "출퇴근 통계를 확인하고 싶은 날짜를 고르세요",
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
                                "text": "7일",
                                "emoji": true
                            },
                            "value": "7",
                            "action_id": "work_history1"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "15일",
                                "emoji": true
                            },
                            "value": "15",
                            "action_id": "work_history2"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "30일",
                                "emoji": true
                            },
                            "value": "30",
                            "action_id": "work_history3"
                        },

                    ]
                },
                result[0],
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

            await this.displayHome(user, block)
        } else if (actions && actions[0].action_id.match(/meeting_booking/)) {
            await this.openModal(trigger_id);
        } else if (actions && actions[0].action_id.match(/meeting_cancel/)) {
            const block = [
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
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "출퇴근 통계를 확인하고 싶은 날짜를 고르세요",
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
                                "text": "7일",
                                "emoji": true
                            },
                            "value": "7",
                            "action_id": "work_history1"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "15일",
                                "emoji": true
                            },
                            "value": "15",
                            "action_id": "work_history2"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "30일",
                                "emoji": true
                            },
                            "value": "30",
                            "action_id": "work_history3"
                        },

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
                }, {
                    "type": "input",
                    "element": {
                        "type": "datepicker",
                        "initial_date": moment().format('yyyy-MM-DD'),
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date",
                            "emoji": true
                        },
                        "action_id": "meeting_list"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Label",
                        "emoji": true
                    }
                }
            ]
            await this.displayHome(user, block)
        }
        else if (actions && actions[0].action_id.match(/meeting_list/)) {
            console.log(actions[0])
            const block = [
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
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": "출퇴근 통계를 확인하고 싶은 날짜를 고르세요",
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
                                "text": "7일",
                                "emoji": true
                            },
                            "value": "7",
                            "action_id": "work_history1"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "15일",
                                "emoji": true
                            },
                            "value": "15",
                            "action_id": "work_history2"
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "30일",
                                "emoji": true
                            },
                            "value": "30",
                            "action_id": "work_history3"
                        },

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
                },
                {                    "type": "input",
                    "element": {
                        "type": "datepicker",
                        "initial_date": moment().format('yyyy-MM-DD'),
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date",
                            "emoji": true
                        },
                        "action_id": "meeting_list"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Label",
                        "emoji": true
                    }
                }
            ]
            await this.displayHome(user, block)

        }
        //modal submission
        if (type === 'view_submission') {
            const view = JSON.parse(req.body.payload).view;

            const formValues = JSON.parse(req.body.payload).view.state.values;
            const blocks = JSON.parse(req.body.payload).view.blocks;

            await this.createBooking(view, user)

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

    displayHome = async (user: any, block: any, data?: any,) => {
        const args = {
            token: 'xoxb-2409863706817-2407536745683-1dX5uFdB79UtEpba1k3b4zAB',
            user_id: user.id,
            view: await this.updateView(user, block)
        };
        const result = await axios.post('https://slack.com/api/views.publish', qs.stringify(args));


    };

    updateView = async (user: any, blocks: any) => {

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
                                "value": "302"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "402",
                                    "emoji": true
                                },
                                "value": "402"
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
                                    "value": "09:00"
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
                                    "value": "11:00"
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
        const token = 'xoxb-2409863706817-2407536745683-1dX5uFdB79UtEpba1k3b4zAB'
        const args = {
            token: token,
            trigger_id: trigger_id,
            view: JSON.stringify(modal)
        };
        console.log(args)

        const result = await axios.post('https://slack.com/api/views.open', qs.stringify(args));

    };

    createBooking = async (view: any, user: any) => {
        const values = view.state.values;
        const blocks = view.blocks;

        console.log('values', values[blocks[1].block_id]);
        console.log('blocks', blocks[1].block_id);
        // console.log(JSON.stringify(values))
        //.selected_option
        console.log('room_number', values[blocks[1].block_id].room_number.selected_option.value)
        console.log('title', values[blocks[2].block_id].title.value)
        console.log('description', values[blocks[3].block_id].description.value)
        console.log('date', values[blocks[4].block_id].date.selected_date)
        console.log('start', values[blocks[5].block_id].start.selected_option.value)
        console.log('end', values[blocks[5].block_id].end.selected_option.value)
        console.log('participant_list:', values[blocks[6].block_id].participant_list.selected_users)

        const createBooking = {
            booking_id: view.id,
            creator_id: user.id,
            room_number: values[blocks[1].block_id].room_number.selected_option.value,
            title: values[blocks[2].block_id].title.value,
            description: values[blocks[3].block_id].description.value,
            date: values[blocks[4].block_id].date.selected_date,
            start: values[blocks[5].block_id].start.selected_option.value,
            end: values[blocks[5].block_id].end.selected_option.value,
            status: 'booked',
        }

        const participantList = [];
        const participantArr = values[blocks[6].block_id].participant_list.selected_users;


        for (let i = 0; i < participantArr.length; i++) {
            let obj = {
                booking_id: view.id,
                participant_id: participantArr[i]
            }
            participantList.push(obj)
        }

        console.log('arr', participantList)

        const isBooked = await BookingStatus.create(createBooking);

        const result = await Participant.bulkCreate(participantList);

        console.log(result)

    }

}

export default new slackController;