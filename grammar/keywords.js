const COMMAND_KEYWORDS = require("../data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("../data/execute_subcommands.js");

module.exports = {
	// — — — — Command keywords:

	command_keyword: (_) => choice(...COMMAND_KEYWORDS),
	subcommand_keyword: (_) => choice(...SUBCOMMAND_KEYWORDS),

	// — — — — — — — —
};
