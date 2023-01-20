#!/usr/bin/env node
const fs = require('fs');
require('dotenv').config();
const { parseTimespanInput } = require('./lib/parseTimespanInput');
const { readActivities } = require('./lib/moco');
const { createCsv } = require('./lib/jira-assistant');

const cliArgs = process.argv.slice(2);
if (!cliArgs[0]) {
    console.info('You did not specify the time for which you want to export MOCO data. Assuming "today".' + '\n');
}

async function exportData() {
    const timespanInput = cliArgs[0]?.trim() || 'today';
    const timespan = parseTimespanInput(timespanInput);
    const activities = await readActivities(timespan);
    const jiraAssistantCsv = createCsv(activities);
    await fs.writeFile(`${__dirname}/entries.csv`, jiraAssistantCsv, err => {
        if (err) console.error(err);
    });
    console.log(`Written to entries.csv`);
}

exportData();
