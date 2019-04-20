let serverRecovery = require("./extractors/serverRecovery");
let messageRTT = require("./extractors/messageRTT");
let clientWelcome = require("./extractors/clientWelcome");
let stateConvergence = require("./extractors/stateConvergence");

// Defines a map of events to be extracted from the log files and an extract function
// The extract funtion will process the logs and filter the events of interest
const events = {
	serverRecovery: serverRecovery.extract,
	messageRTT: messageRTT.extract,
	clientWelcome: clientWelcome.extract,
	stateConvergence: stateConvergence.extract
};

exports.Extractor = {
	events
};