#!/usr/bin/env node
const fs = require('fs');
require('dotenv').config();
const { parseTimespanInput } = require('./lib/parseTimespanInput');
const { readActivities } = require('./lib/moco');
const { createCsv } = require('./lib/jira-assistant');
const { parseArguments } = require('./lib/parseArguments');

const arguments = parseArguments(process.argv.slice(2));

async function mocoToJiraAssistant(timespan) {
    const activities = await readActivities(timespan);
    const jiraAssistantCsv = createCsv(activities);
    await fs.writeFile(`${__dirname}/entries.csv`, jiraAssistantCsv, err => {
        if (err) console.error(err);
    });
    console.log(`Written to entries.csv`);
}

const timespan = parseTimespanInput(arguments.timespan);;
mocoToJiraAssistant(timespan);
