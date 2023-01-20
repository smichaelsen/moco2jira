# Reuse MOCO time entries

If you track activities in MOCO, this script can help you to:

* Export activities that have a JIRA ticket reference, to import them to Jira with [Jira Assistant](https://www.jiraassistant.com/).
* Convert them into presence time in MOCO.

## Disclaimer

Please review the time entries carefully that you're about to import into Jira (the Jira Assistant will give you a nice preview).
Do not hold me accountable for messed up JIRA time entries.

## Setup

Install the dependencies before the first run:

```bash
npm i
```

Copy the `.env.dist` to `.env`:

```bash
cp .env.dist .env
```

Get an API key from the "integrations" tab of your moco profile. Enter the API key and your moco host into the `.env` file.

## Usage

Execute one of these:

```bash
./moco2jira.js -t 'today'
./moco2jira.js -t 'yesterday'
./moco2jira.js -t 'this week'
./moco2jira.js -t 'last week'
./moco2jira.js -t 'this month'
./moco2jira.js -t 'last month'
```

## Destinations

Jira Assistant `ja` is the default `--destination` (`-d`).

| `--destination` | Name           | Description                                                                                          |
|-----------------|----------------|------------------------------------------------------------------------------------------------------|
| `ja`            | Jira Assistant | Writes an `entries.csv` file that cn be imported with the "Import worklog" option in Jira Assistant. |
| `presence`      | MOCO Presence  | Overwrites(_!_) any MOCO presence time with the working times derived from the time entries.         |

You can supply multiple destinations:

```bash
./moco2jira.js -d presence -d ja -t 'today'
```
