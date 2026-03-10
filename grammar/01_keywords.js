const COMMAND_KEYWORDS = require("../data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("../data/execute_subcommands.js");

module.exports = {
	command_keyword: (_) => token(choice(...COMMAND_KEYWORDS)),
	subcommand_keyword: (_) => token(choice(...SUBCOMMAND_KEYWORDS)),

	operation: (_) =>
		token(choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),
};
