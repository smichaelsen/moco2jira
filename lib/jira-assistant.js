const { getTicketReferenceFromString } = require('./jira');

function createCsv(activities) {
  const csvEntries = [[
    'Ticket No',
    'Start Date',
    'Timespent',
    'Comment',
  ].join(',')];
  for (const activity of activities) {
    const ticketReference = getTicketReferenceFromString(activity.description);
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
  console.log(`${csvEntries.length - 1} entries`);
  return csvEntries.join("\n");
}

module.exports = {
  createCsv,
}
