const COMMAND_KEYWORDS = require("../data/command_keywords.js");
const SUBCOMMAND_KEYWORDS = require("../data/execute_subcommands.js");

const PREC_KEYWORD = 4;

module.exports = {
	command_keyword: (_) =>
		token(prec(PREC_KEYWORD, choice(...COMMAND_KEYWORDS))),
	subcommand_keyword: (_) =>
		token(prec(PREC_KEYWORD, choice(...SUBCOMMAND_KEYWORDS))),

	operation: (_) =>
		token(
			prec(
				PREC_KEYWORD,
				choice("=", "+=", "-=", "*=", "/=", "%=", "><", "<", ">"),
			),
		),
};
