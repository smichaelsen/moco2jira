#!/usr/bin/env node
const fs = require('fs');
require('dotenv').config();
const { parseTimespanInput } = require('./lib/parseTimespanInput');
const { readActivities, createPresenceEntriesFromActivities, postPresenceEntries } = require('./lib/moco');
const { createCsv } = require('./lib/jira-assistant');
const { parseArguments } = require('./lib/parseArguments');

const arguments = parseArguments(process.argv.slice(2));

async function toJiraAssistant(activities) {
  const jiraAssistantCsv = createCsv(activities);
  await fs.writeFile(`${__dirname}/entries.csv`, jiraAssistantCsv, err => {
    if (err) console.error(err);
  });
  console.log(`Written to entries.csv`);
}

async function toMocoPresence(activities, timespan) {
  const presenceEntries = createPresenceEntriesFromActivities(activities);
  await postPresenceEntries(presenceEntries, timespan);
}

async function execute(destinations, timespan) {
  const parsedTimespan = parseTimespanInput(timespan);
  const activities = await readActivities(parsedTimespan);
  for (const destination of destinations) {
    if (destination === 'ja') {
      await toJiraAssistant(activities);
    } else if (destination === 'presence') {
      await toMocoPresence(activities, parsedTimespan);
    }
  }
}

execute(arguments.destinations, arguments.timespan);
