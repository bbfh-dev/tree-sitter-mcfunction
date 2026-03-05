const COMMAND_KEYWORDS = require("../data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("../data/execute_subcommands.js");

module.exports = {
	// — — — — Keywords:

	backslash: (_) => /\s*\\\s*/,

	_indentation: (_) => /[ \t]+/,
	_space: ($) => choice(/ +/, $.backslash),
	_newline: (_) => /\r?\n/,

	// Used as part of other tokens.
	identifier: (_) => /[_A-Za-z0-9]+/,

	line: (_) => /[^\r\n]*/,

	scoreboard_operation: (_) =>
		token(choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">")),

	command_keyword: (_) => token(choice(...COMMAND_KEYWORDS)),
	subcommand_keyword: (_) => token(choice(...SUBCOMMAND_KEYWORDS)),

	// — — — — — — — —
};
