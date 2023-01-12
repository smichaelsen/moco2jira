#!/usr/bin/env node
const fs = require('fs');
require('dotenv').config();
const dateFns = require('date-fns');

const cliArgs = process.argv.slice(2);
if (!cliArgs[0]) {
    console.info('You did not specify the time for which you want to export MOCO data. Assuming "today".' + '\n');
}

if (!process.env.MOCO_API_KEY || !process.env.MOCO_HOST) {
    console.warn('Provide your MOCO host and API key in .env');
    process.exit(1);
}

function getTicketReference(description) {
    const matches = description.match(/([A-Z]+-\d+)/); // match JIRA ticket reference
    if (!matches) {
        return undefined;
    }
    return matches[1];
}

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

async function exportData() {
    const timespanInput = cliArgs[0]?.trim() || 'today';
    const timespan = parseTimespanInput(timespanInput);
    const from = dateFns.format(timespan.from, 'yyyy-MM-dd');
    const to = dateFns.format(timespan.to, 'yyyy-MM-dd');

    const apiBaseUrl = `https://${process.env.MOCO_HOST}/api/v1/`;
    const requestUrl = `${apiBaseUrl}activities?from=${from}&to=${to}`;

    console.log(requestUrl);

    const response = await fetch(requestUrl, { headers: { Authorization: `Token token=${process.env.MOCO_API_KEY}` } });
    const activities = await response.json();
    const csvEntries = [[
        'Ticket No',
        'Start Date',
        'Timespent',
        'Comment',
    ].join(',')];
    for (const activity of activities) {
        const ticketReference = getTicketReference(activity.description);
        if (!ticketReference) {
            continue;
        }

        const date = new Date(`${activity.date}T08:00:00.000000`).toISOString();
        const timeSpent = `${Math.round(activity.seconds / 60)}m`;
        csvEntries.push([
            ticketReference,
            date,
            timeSpent,
            'Imported from Moco',
        ].join(','));
    }
    await fs.writeFile(`${__dirname}/entries.csv`, csvEntries.join('\n'), err => {
        if (err) console.error(err);
    });
    console.log(`${csvEntries.length - 1} entries written to entries.csv`);
}

exportData();
