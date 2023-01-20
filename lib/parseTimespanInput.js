const dateFns = require('date-fns');

function parseTimespanInput(timespanInput) {
    const today = new Date();
    if (timespanInput === 'today') {
        return {
            from: today,
            to: today,
        };
    } else if (timespanInput === 'yesterday') {
        const yesterday = dateFns.subDays(today, 1);
        return {
            from: yesterday,
            to: yesterday,
        }
    } else if (timespanInput === 'this week') {
        const startOfThisWeek = dateFns.subDays(today, (today.getDay() + 6) % 7);
        return {
            from: startOfThisWeek,
            to: today,
        }
    } else if (timespanInput === 'last week') {
        const startOfThisWeek = dateFns.subDays(today, (today.getDay() + 6) % 7);
        const startOfLastWeek = dateFns.subWeeks(startOfThisWeek, 1);
        const endOfLastWeek = dateFns.addDays(startOfLastWeek, 6);
        return {
            from: startOfLastWeek,
            to: endOfLastWeek,
        }
    } else if (timespanInput === 'this month') {
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
            from: startOfThisMonth,
            to: today,
        }
    } else if (timespanInput === 'last month') {
        const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = dateFns.subMonths(startOfThisMonth, 1);
        const endOfLastMonth = dateFns.subDays(startOfThisMonth, 1);
        return {
            from: startOfLastMonth,
            to: endOfLastMonth,
        }
    } else {
        console.error('Unrecognized time input');
        process.exit(1);
    }
}

module.exports = {
    parseTimespanInput
};
