function getShorthandsMap() {
  return {
    d: 'destination',
    t: 'timespan'
  }
}

function parseArguments(rawArguments) {
  const parsedArguments = require('minimist')(rawArguments);

  const shorthandsMap = getShorthandsMap();
  for (const shorthand in shorthandsMap) {
    const fullArgumentName = shorthandsMap[shorthand];
    if (parsedArguments[shorthand] && parsedArguments[fullArgumentName]) {
      console.error(`Error: You provided both ${shorthand} and ${fullArgumentName} which are the same option. Provide only one of them.`);
      process.exit(1);
    }
    if (parsedArguments[shorthand] && !parsedArguments[fullArgumentName]) {
      parsedArguments[fullArgumentName] = parsedArguments[shorthand];
      delete parsedArguments[shorthand];
    }
  }

  if (!parsedArguments.destination) {
    console.error(`You did not provide a --destination (-d). Assuming "ja".`);
    parsedArguments.destination = 'ja';
  }

  if (!parsedArguments.timespan) {
    console.error(`You did not provide a --timespan (-t). Assuming "today".`);
    parsedArguments.timespan = 'today';
  }

  return parsedArguments;
}

module.exports = {
  parseArguments,
}
