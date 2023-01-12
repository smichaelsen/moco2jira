# Export time entries from MOCO to Jira (Assistant)

This small script is suited for a very particular workflow:

* You track times in MOCO
* Your time entries have references to Jira tickets
* You have the [Jira Assistant](https://www.jiraassistant.com/) Browser extension (my recommendation anyway!)
* You want to export your time entries from MOCO and import it into JIRA

## Disclaimer

This is a script I hacked together in an hour or so. Please review the time entries carefully that you're about to import into Jira (the Jira Assistant will give you a nice preview).
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
./moco2jira.js 'today'
./moco2jira.js 'yesterday'
./moco2jira.js 'this week'
./moco2jira.js 'last week'
./moco2jira.js 'this month'
./moco2jira.js 'last month'
```

Use Jira Assistant's "Import worklog" to import the `entries.csv` file.
