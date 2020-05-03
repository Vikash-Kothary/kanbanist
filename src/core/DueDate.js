import { Record } from 'immutable';
import moment from 'moment';

const DueDateRecord = Record({
    due_moment: null,
    has_time: false,
});

export default class DueDate extends DueDateRecord {
    updateWith({ due_moment, has_time }) {
        return new DueDate({
            due_moment: due_moment || this.due_moment,
            has_time: has_time != null ? has_time : this.has_time,
        });
    }

    isExpired() {
        return this.due_moment.isBefore(moment().startOf('day'));
    }

    format() {
        const isCurrentYear = this.due_moment.year() === moment().year();
        const dateFormat = isCurrentYear ? 'Do MMM' : 'Do MMM YY'; // also display year, if it does not match the current year
        const dueDateTimeFormat = this.has_time ? dateFormat + ' LT' : dateFormat;
        return this.due_moment.format(dueDateTimeFormat);
    }
}

export const parseDueDate = dateTimeStr => {
    const due_moment = moment(dateTimeStr);
    let has_time = true;
    // If time is exactly zero and no colon is found in the ISO 8601 datetime string, it means
    // no time was given.
    if (
        due_moment.hours() === 0 &&
        due_moment.minutes() === 0 &&
        due_moment.seconds() === 0 &&
        due_moment.milliseconds() === 0 &&
        !/:/.test(dateTimeStr)
    ) {
        has_time = false;
    }
    return new DueDate({ due_moment, has_time });
};
