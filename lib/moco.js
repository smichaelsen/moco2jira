const dateFns = require('date-fns');

if (!process.env.MOCO_API_KEY || !process.env.MOCO_HOST) {
  console.warn('Provide your MOCO host and API key in .env');
  process.exit(1);
}

async function readActivities(timespan) {
    const from = dateFns.format(timespan.from, 'yyyy-MM-dd');
    const to = dateFns.format(timespan.to, 'yyyy-MM-dd');

    const apiBaseUrl = `https://${process.env.MOCO_HOST}/api/v1/`;
    const requestUrl = `${apiBaseUrl}activities?from=${from}&to=${to}`;

    const response = await fetch(requestUrl, { headers: { Authorization: `Token token=${process.env.MOCO_API_KEY}` } });
    return await response.json();
}

module.exports = {
  readActivities,
};
