import * as moment from "moment-timezone";
import slackConfig from "../config/slackConfig";
import axios from "axios";
import qs from "qs";

module.exports = (sequelize: any, DataTypes: any) => {
    let booking = sequelize.define("booking", {
        user_id: {type: DataTypes.STRING},
        room_number: {type: DataTypes.STRING},
        title: {type: DataTypes.STRING},
        description: {type: DataTypes.STRING},
        date: {type: DataTypes.STRING},
        start:{type: DataTypes.STRING},
        end:{type: DataTypes.STRING},
        state: {type: DataTypes.STRING},
        // participant_id: {type: DataTypes.STRING},
    });
    return booking;

    // openEditModal= async (trigger_id: any) => {
    //     const modal = {
    //         type: 'modal',
    //         "title": {
    //             "type": "plain_text",
    //             "text": "My App",
    //             "emoji": true
    //         },
    //         "submit": {
    //             "type": "plain_text",
    //             "text": "Submit",
    //             "emoji": true
    //         },
    //         "close": {
    //             "type": "plain_text",
    //             "text": "Cancel",
    //             "emoji": true
    //         },
    //         blocks: [
    //             // Text input
    //             {
    //                 "type": "section",
    //                 "text": {
    //                     "type": "plain_text",
    //                     "text": "선택부탁",
    //                     "emoji": true
    //                 }
    //             },
    //             {
    //                 "type": "input",
    //                 "element": {
    //                     "type": "static_select",
    //                     "placeholder": {
    //                         "type": "plain_text",
    //                         "text": "Select an item",
    //                         "emoji": true
    //                     },
    //                     "options": [
    //                         {
    //                             "text": {
    //                                 "type": "plain_text",
    //                                 "text": "302",
    //                                 "emoji": true
    //                             },
    //                             "value": "302"
    //                         },
    //                         {
    //                             "text": {
    //                                 "type": "plain_text",
    //                                 "text": "402",
    //                                 "emoji": true
    //                             },
    //                             "value": "402"
    //                         },
    //                         // {
    //                         //     "text": {
    //                         //         "type": "plain_text",
    //                         //         "text": "*this is plain_text text*",
    //                         //         "emoji": true
    //                         //     },
    //                         //     "value": "value-2"
    //                         // }
    //                     ],
    //                     "action_id": "room_number"
    //                 },
    //                 "label": {
    //                     "type": "plain_text",
    //                     "text": "회의실",
    //                     "emoji": true
    //                 }
    //             },
    //             {
    //                 "type": "input",
    //                 "element": {
    //                     "type": "plain_text_input",
    //                     "action_id": "title"
    //                 },
    //                 "label": {
    //                     "type": "plain_text",
    //                     "text": "안건",
    //                     "emoji": true
    //                 }
    //             },
    //             {
    //                 "type": "input",
    //                 "element": {
    //                     "type": "plain_text_input",
    //                     "multiline": true,
    //                     "action_id": "description"
    //                 },
    //                 "label": {
    //                     "type": "plain_text",
    //                     "text": "자세히",
    //                     "emoji": true
    //                 }
    //             },
    //             {
    //                 "type": "input",
    //                 "element": {
    //                     "type": "datepicker",
    //                     // 1990-04-28"
    //                     "initial_date": moment().format('yyyy-MM-DD'),
    //                     "placeholder": {
    //                         "type": "plain_text",
    //                         "text": "Select a date",
    //                         "emoji": true
    //                     },
    //                     "action_id": "date"
    //                 },
    //                 "label": {
    //                     "type": "plain_text",
    //                     "text": "미팅 할 날짜",
    //                     "emoji": true
    //                 }
    //             },
    //             {
    //                 "type": "actions",
    //                 "elements": [
    //                     {
    //                         "type": "static_select",
    //                         "placeholder": {
    //                             "type": "plain_text",
    //                             "text": "회의 시작 시각",
    //                             "emoji": true
    //                         },
    //                         "options": [
    //
    //
    //                             {
    //                                 "text": {
    //                                     "type": "plain_text",
    //                                     "text": "09:00",
    //                                     "emoji": true
    //                                 },
    //                                 "value": "09:00"
    //                             }
    //                         ],
    //                         "action_id": "start"
    //                     },
    //                     //회의 끝
    //                     {
    //                         "type": "static_select",
    //                         "placeholder": {
    //                             "type": "plain_text",
    //                             "text": "회의 종료 시각",
    //                             "emoji": true
    //                         },
    //                         "options": [
    //                             {
    //                                 "text": {
    //                                     "type": "plain_text",
    //                                     "text": "11:00",
    //                                     "emoji": true
    //                                 },
    //                                 "value": "11:00"
    //                             },
    //
    //                         ],
    //                         "action_id": "end"
    //                     }
    //                 ]
    //             },
    //             //참석자
    //             {
    //                 "type": "input",
    //                 "element": {
    //                     "type": "multi_users_select",
    //                     "placeholder": {
    //                         "type": "plain_text",
    //                         "text": "Select users",
    //                         "emoji": true
    //                     },
    //                     "action_id": "participant_list"
    //                 },
    //                 "label": {
    //                     "type": "plain_text",
    //                     "text": "미팅 참여자",
    //                     "emoji": true
    //                 }
    //             },
    //
    //         ]
    //     };
    //
    //     const args = {
    //         token: slackConfig.token,
    //         trigger_id: trigger_id,
    //         view: JSON.stringify(modal)
    //     };
    //     console.log(args)
    //
    //     const result = await axios.post('https://slack.com/api/views.open', qs.stringify(args));
    //
    // }
}

