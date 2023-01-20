function getTicketReferenceFromString(description) {
  const matches = description.match(/([A-Z]+-\d+)/); // match JIRA ticket reference
  if (!matches) {
    return undefined;
  }
  return matches[1];
}

module.exports = {
  getTicketReferenceFromString,
}
