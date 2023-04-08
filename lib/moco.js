const dateFns = require('date-fns');

if (!process.env.MOCO_API_KEY || !process.env.MOCO_HOST) {
  console.warn('Provide your MOCO host and API key in .env');
  process.exit(1);
}

const apiBaseUrl = `https://${process.env.MOCO_HOST}/api/v1/`;

function createPresenceEntriesFromActivities(activities) {
  const startHour = parseInt(process.env.WORK_TIME_START || 8);
  const workingHoursPerDate = _getWorkingHoursPerDate(activities);
  const createEntries = [];
  for (const date in workingHoursPerDate) {
    const workingHours = workingHoursPerDate[date];
    if (workingHours > 24) {
      console.warn(`WARNING: More than 24 hours booked on ${date}: ${workingHours}. I will only generate presence for 24 hours.`);
    }
    const workingDay = new Date(date);
    const overlapHours = Math.min(0, (24 - startHour - workingHours));
    const todayStartHour = startHour + overlapHours;
    const workingDayStart = dateFns.setHours(workingDay, todayStartHour);
    const workingDayEnd = dateFns.addMinutes(workingDayStart, workingHours * 60);

    createEntries.push({
      date,
      from: dateFns.format(workingDayStart, 'HH:mm'),
      to: dateFns.format(workingDayEnd, 'HH:mm'),
    });
  }
  return createEntries;
}

async function readActivities(timespan) {
  const from = dateFns.format(timespan.from, 'yyyy-MM-dd');
  const to = dateFns.format(timespan.to, 'yyyy-MM-dd');

  const requestUrl = `${apiBaseUrl}activities?from=${from}&to=${to}`;

  const response = await fetch(requestUrl, { headers: { Authorization: `Token token=${process.env.MOCO_API_KEY}` } });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} ${await response.text()}`);
  }
  return await response.json();
}

async function postPresenceEntries(presenceEntries, timespan) {
  await deletePresences(timespan);
  const requestPromises = [];
  const requestUrl = `${apiBaseUrl}users/presences`;
  for (const presenceEntry of presenceEntries) {
    requestPromises.push(_request(requestUrl, 'POST', JSON.stringify(presenceEntry)));
  }
  await Promise.allSettled(requestPromises);
}

async function deletePresences(timespan) {
  const from = dateFns.format(timespan.from, 'yyyy-MM-dd');
  const to = dateFns.format(timespan.to, 'yyyy-MM-dd');
  const requestUrl = `${apiBaseUrl}users/presences?from=${from}&to=${to}`;
  const response = await fetch(requestUrl, { headers: { Authorization: `Token token=${process.env.MOCO_API_KEY}` } });
  const presences = await response.json();
  const deletePromises = [];
  for (const presence of presences) {
    deletePromises.push(_request(`${apiBaseUrl}users/presences/${presence.id}`, 'DELETE'));
  }
  await Promise.allSettled(deletePromises);
}

function _getWorkingHoursPerDate(activities) {
  const presencePerDate = {};
  for (const activity of activities) {
    if (!presencePerDate[activity.date]) {
      presencePerDate[activity.date] = 0;
    }
    presencePerDate[activity.date] += activity.hours;
  }
  return presencePerDate;
}

async function _request(url, method, body) {
  const options = {
    method: method || 'GET',
    headers: { Authorization: `Token token=${process.env.MOCO_API_KEY}` },
  };
  if (method === 'POST') {
    options.headers['Content-Type'] = 'application/json';
  }
  if (body) {
    options.body = body;
  }
  return fetch(url, options);
}

module.exports = {
  createPresenceEntriesFromActivities,
  postPresenceEntries,
  readActivities,
};
