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
const enums_1 = require("../../../commons/enums");
const slackController_1 = require("./slackController");
const db = require('../model');
const Booking = db.booking;
const Participant = db.participant;
const transaction = db.transaction;
class meetingController {
    constructor() {
        this.meetingList = (user, trigger_id, clickedType) => __awaiter(this, void 0, void 0, function* () {
            const meetingList = yield Booking.findAll({
                where: {
                    user_id: user.id,
                    //     start: {
                    //         [Op.gt]: moment().subtract(historyDuration, 'days').toDate()
                    //     }
                },
            });
            // const userList = await Participant.findAll({
            //
            // })
            // for (let i = 0; i < bookingList.length; i++) {
            //     const args = {
            //         token: slackConfig.token,
            //         user: bookingList[i]
            //     };
            //
            // }
            // const result = await axios.get('https://slack.com/api/users.info', qs.stringify(args));
            const result = _.map(meetingList, (info) => {
                // for (let i = 0; i < bookingList.length; i++) {
                //     const args = {
                //         token: slackConfig.token,
                //         user: bookingList[i]
                //     };
                // }
                //
                // const bookingMemberList = await Participant.findAll({
                //     where: {
                //         booking_id: info.dataValues.id,
                //     }
                //
                // })
                // console.log(bookingMemberList)
                if (info.state == enums_1.eBookingState.Booked) {
                    return {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*${info.title}*\n${info.date} - ${info.start}-${info.end}\n${info.description}\n참여자: @iris, ~@zelda~`
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": `${clickedType === 'delete' ? '삭제' : '수정'}`
                            },
                            "value": `${info.id}`,
                            "action_id": `${clickedType === 'delete' ? 'meeting_delete' : 'meeting_edit'}`
                        },
                    };
                }
                else if (info.state == enums_1.eBookingState.Cancel) {
                    return null;
                }
            });
            return result.filter((element, i) => element !== null);
        });
        this.createBooking = (view, user) => __awaiter(this, void 0, void 0, function* () {
            const values = view.state.values;
            const blocks = view.blocks;
            const createBooking = {
                user_id: user.id,
                room_number: values[blocks[1].block_id].room_number.selected_option.value,
                title: values[blocks[2].block_id].title.value,
                description: values[blocks[3].block_id].description.value,
                date: values[blocks[4].block_id].date.selected_date,
                start: values[blocks[5].block_id].start.selected_option.value,
                end: values[blocks[5].block_id].end.selected_option.value,
                state: enums_1.eBookingState.Booked,
            };
            const participantList = [];
            const participantArr = values[blocks[6].block_id].participant_list.selected_users;
            const booking = yield Booking.create(createBooking);
            for (let i = 0; i < participantArr.length; i++) {
                let obj = {
                    user_id: participantArr[i],
                    booking_id: booking.id
                    // name:view.username
                };
                participantList.push(obj);
            }
            participantList.push({
                user_id: user.id,
                booking_id: booking.id
                // name:user.username
            });
            const result = yield Participant.bulkCreate(participantList);
            yield slackController_1.default.sendDm(participantArr, user, createBooking);
        });
        this.deleteMeeting = (booking_id, user, trigger_id) => __awaiter(this, void 0, void 0, function* () {
            const deleteMeeting = yield Booking.update({ state: enums_1.eBookingState.Cancel }, { where: { id: booking_id } });
            return deleteMeeting;
        });
        this.getMeetingInfo = (booking_id, user) => __awaiter(this, void 0, void 0, function* () {
            const meeting = yield Booking.findOne({ id: booking_id });
            return meeting;
        });
        this.editBooking = (booking_id, user) => __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = new meetingController;
//# sourceMappingURL=meetingController.js.map